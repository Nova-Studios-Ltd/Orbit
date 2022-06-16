import { ContentType } from "./NCAPI";

/**
 * Interface representing Electrons IPCRenderer/IPCMain object
 */
export interface IPCRenderer {
  send: (channel: string, ...data: any[]) => void,
  on: (channel: string, func: (...args: any[]) => void) => void,
  once: (channel: string, func: (...args: any[]) => void) => void,
  removeAllListeners: (channel: string) => void,
  invoke: (channel: string, ...data: any[]) => Promise<any>,
  sendSync: (channel: string, ...data: any[]) => any;
}

/**
 * Class respresenting a uploaded file
 */
export class NCFile {
  readonly FileContents: Uint8Array;
  readonly FilePath: string;
  readonly Filename: string;

  constructor(fileContents: Uint8Array, filePath: string, filename: string) {
    this.FileContents = fileContents;
    this.FilePath = filePath;
    this.Filename = filename;
  }
}

export enum NotificationType {
  Info,
  Success,
  Warning,
  Error
}

/**
 * Checks if the client is loaded in a Electron instance
 * @returns True if loaded in a Electron instance, else false
 */
export function IsElectron() : boolean {
  return (window as any).electron !== undefined;
}

/**
 * Retreive IPCRenderer
 * @returns A IPCRenderer object
 */
export function GetIPCRenderer() : IPCRenderer {
  return (window as any).electron.ipcRenderer as IPCRenderer;
}

/**
 * Triggers a file download, automaticly handles switching to native
 * @param file Uint8Array containing the file contents
 * @param filename Optional name
 */
export async function DownloadUint8ArrayFile(file: Uint8Array, filename = "unknown") {
  if (IsElectron()) {
    GetIPCRenderer().send("SaveFile", file, filename);
  }
  else {
    const link = document.createElement('a');
    const url = URL.createObjectURL(new Blob([file]));
    link.href = url;
    link.download = filename;
    link.click();
  }
}

/**
 * Triggers a file download, automaticly handles switching to native
 * @param file Blob containing the file contents
 * @param filename Optional name
 */
 export async function DownloadBlobFile(file: Blob, filename = "unknown") {
  if (IsElectron()) {
    GetIPCRenderer().send("SaveFile", new Uint8Array(await file.arrayBuffer()), filename);
  }
  else {
    const link = document.createElement('a');
    const url = URL.createObjectURL(file);
    link.href = url;
    link.download = filename;
    link.click();
  }
}



/**
 * Triggers a file upload, automaticly handles switching to native
 * @returns A Promise containing a NCFile array
 */
export function UploadFile(): Promise<NCFile[]> {
  return new Promise(async (resolve) => {
    const handleFiles = async (file: HTMLInputElement) => {
      if (file.files === null || file.files.length === 0) return;
      const files = [] as NCFile[];
      for (let ff = 0; ff < file.files.length; ff++) {
        const f = file.files[ff];
        files.push(new NCFile(new Uint8Array(await f.arrayBuffer()), "N/A", f.name));
      }
      resolve(files);
    }

    if (IsElectron()) {
      resolve(await GetIPCRenderer().invoke("UploadFile"))
    }
    else {
      var file = document.createElement('input');
      file.multiple = true;
      file.type = 'file';
      file.click();
      file.oninput = (event) => handleFiles(event.currentTarget as HTMLInputElement);
      file.onblur = (event) => handleFiles(event.currentTarget as HTMLInputElement);
    }
  })
}

/**
 * Fetches a files from the clipboard, automaticly handles switching to native
 * @param ev Event from document.onpaste
 * @returns A Uint8Array of png data
 */
export function FetchFileFromClipboard(ev: ClipboardEvent) : Promise<Uint8Array> {
  return new Promise(async (resolve) => {
    if (IsElectron()) {
      resolve(await GetIPCRenderer().invoke("GetClipboard"));
    }
    else {
      const clipboardItems = ev.clipboardData?.items;
      const items = [].slice.call(clipboardItems).filter(function (item: DataTransferItem) {
        return item.type.indexOf('image') !== -1;
      }) as DataTransferItem[];
      const buf = await items[0].getAsFile()?.arrayBuffer();
      if (buf === undefined) return;
      resolve(new Uint8Array(buf));
    }
  });
}

/**
 * Write a string of text to the clipboard, automaticly handles switching to native
 * @param text Text to be written to the clipboard
 * @returns True if write is succesful otherwise false
 */
export function WriteToClipboard(text: string) : Promise<boolean> {
  return new Promise(async (resolve) => {
    if (IsElectron()) {
      resolve(await GetIPCRenderer().invoke("WriteTextClipboard", text));
    }
    else {
      navigator.clipboard.writeText(text).then(() => {
        resolve(true);
      }, () => {
        resolve(false);
      });
    }
  });
}

/**
 * Writes data to the clipboard, automaticly handles switching to native
 * @param data A Uint8Array containing the data to be written to the clipboard
 * @param content_type ContentType
 * @returns True if write is successful otherwise false
 */
export function WriteImageToClipboard(data: Uint8Array, content_type: ContentType) : Promise<boolean> {
  return new Promise(async (resolve) => {
    if (IsElectron()) {
      resolve(await GetIPCRenderer().invoke("WriteClipboard", data, content_type))
    }
    else {
      const item = [new ClipboardItem({[content_type]: new Blob([data])})];
      navigator.clipboard.write(item).then(() => {
        resolve(true);
      }, () => {
        resolve(false);
      });
    }
  })
}


export function TriggerNotification(title: string, body: string, type: NotificationType) {
  if (IsElectron()) {
    GetIPCRenderer().send("Notification", title, body, type)
  }
  else {

  }
}
