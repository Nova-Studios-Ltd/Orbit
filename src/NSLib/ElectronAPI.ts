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

export function GetIPCRenderer() : IPCRenderer | undefined {
    if (!IsElectron()) return undefined;
    return (window as any).electron.ipcRenderer as IPCRenderer;
}