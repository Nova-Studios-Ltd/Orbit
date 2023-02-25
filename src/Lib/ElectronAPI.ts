import { ContentType, NetAPI } from "@nova-studios-ltd/typescript-netapi";

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
 * Class representing a uploaded file
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
 * Retrieve IPCRenderer
 * @returns A IPCRenderer object
 */
export function GetIPCRenderer() : IPCRenderer {
  return (window as any).electron.ipcRenderer as IPCRenderer;
}

/**
 * Triggers a file download, automatically handles switching to native
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
 * Triggers a file download, automatically handles switching to native
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
 * Triggers a file upload, automatically handles switching to native
 * @returns A Promise containing a NCFile array
 */
export function UploadFile(multiple?: boolean): Promise<NCFile[]> {
  return new Promise(async (resolve) => {
    const handleFiles = async (file: HTMLInputElement) => {
      document.body.removeChild(file);
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
      file.multiple = multiple ? true : false;
      file.type = 'file';
      file.addEventListener("change", (event) => handleFiles(event.currentTarget as HTMLInputElement));
      document.body.appendChild(file);
      file.click();
    }
  })
}

/**
 * Fetches a files from the clipboard, automatically handles switching to native
 * @param event Event from document.onpaste, *currently not used.
 * @returns A Uint8Array of png data
 */
export function FetchImageFromClipboard(event?: React.ClipboardEvent<HTMLInputElement>) : Promise<NCFile> {
  return new Promise(async (resolve) => {
    if (IsElectron()) {
      const data = await GetIPCRenderer().invoke("GetClipboard");
      resolve(data);
    }
    else {
      if (!event) return;
      const clipboardItems = event.clipboardData?.items;
      const items = [].slice.call(clipboardItems).filter(function (item: DataTransferItem) {
        return item.type.indexOf('image') !== -1;
      }) as DataTransferItem[];
      const buf = await items[0].getAsFile()?.arrayBuffer();
      if (buf === undefined) return;
      resolve(new NCFile(new Uint8Array(buf), "", "Unknown.png"));
    }
  });
}

/**
 * Write a string of text to the clipboard, automatically handles switching to native
 * @param text Text to be written to the clipboard
 * @returns True if write is successful otherwise false
 */
export function WriteToClipboard(text: string) : Promise<boolean> {
  return new Promise(async (resolve) => {
    if (IsElectron()) {
      resolve(await GetIPCRenderer().invoke("WriteTextClipboard", text));
    }
    else {
      navigator.clipboard.writeText(text).then(() => {
        resolve(true);
        console.success("Successfully copied text to clipboard");
      }, () => {
        resolve(false);
        console.error("Unable to copy text to clipboard");
      });
    }
  });
}

/**
 * EXPERIMENTAL METHOD
 *
 * Writes a blob with a specific mime type to the clipboard, automatically handles switching to native
 * @param data Blob to be written to the clipboard
 * @returns True if write is successful otherwise false
 */
export function EXPERIMENTAL_WriteBlobToClipboard(data: Blob) : Promise<boolean> {
  return new Promise(async (resolve) => {
    if (IsElectron()) {
      resolve(await GetIPCRenderer().invoke("WriteBlobClipboard", data));
    }
    else {
      navigator.clipboard.write([new ClipboardItem({ [data.type]: data })]).then(() => {
        resolve(true);
        console.success("Successfully copied blob to clipboard");
      }, (reason) => {
        resolve(false);
        console.error(`Unable to copy blob to clipboard (${reason})`);
      });
    }
  });
}

/**
 * Writes data to the clipboard, automatically handles switching to native
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

/**
 * Handles creating a notification for native or browser
 * @param title Title of the notification
 * @param body Body of the notification
 * @param type Type of the notification (Can be: Error, Information, etc.)
 * @param icon Icon URL. Requesting the icon is done internally
 */
export function TriggerNotification(title: string, body: string, type: NotificationType, icon?: string) {
  if (IsElectron()) {
    if (icon) {
      NetAPI.GETBuffer(icon).then((v) => {
        GetIPCRenderer().send("TriggerNotif", title, body, v.payload);
      });
    }
    else {
      GetIPCRenderer().send("TriggerNotif", title, body)
    }
  }
  else {

  }
}
