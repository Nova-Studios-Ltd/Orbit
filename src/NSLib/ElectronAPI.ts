export interface IPCRenderer {
  send: (channel: string, ...data: any[]) => void,
  on: (channel: string, func: (...args: any[]) => void) => void,
  once: (channel: string, func: (...args: any[]) => void) => void,
  removeAllListeners: (channel: string) => void,
  invoke: (channel: string, ...data: any[]) => Promise<any>,
  sendSync: (channel: string, ...data: any[]) => any;
}

export function IsElectron() : boolean {
  return (window as any).electron !== undefined;
}

export function GetIPCRenderer() : IPCRenderer {
  return (window as any).electron.ipcRenderer as IPCRenderer;
}

export async function DownloadFile(file: Blob, filename = "unknown") {
  if (IsElectron()) {
    GetIPCRenderer().send("SaveFile", new Uint8Array(await file.arrayBuffer()), filename);
  }
  else {
    const link = document.createElement('a');
    const url = URL.createObjectURL(file);
    link.href = url;
    link.download = url;
    link.click();
  }
}

export function UploadFile(): Promise<FileList> {
  return new Promise(async (resolve) => {
    if (IsElectron()) {
      resolve(await GetIPCRenderer().invoke("UploadFile"))
    }
    else {
      var file = document.createElement('input');
      file.multiple = true;
      file.type = 'file';
      file.click();
      file.onchange = () => {
        if (file.files === null || file.files.length === 0) return;
        resolve(file.files);
      }
    }
  })
}
