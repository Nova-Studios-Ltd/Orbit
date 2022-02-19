export function ToBase64String(buffer: Uint8Array) : string {
    return window.btoa(String.fromCharCode.apply(null, Array.from<number>(buffer)));
}

export function FromBase64String(base64: string) : Uint8Array {
    return new Uint8Array(window.atob(base64).split("").map(function(c) {return c.charCodeAt(0); }));
}

export function ToUint8Array(text: string) : Uint8Array {
    return new TextEncoder().encode(text);
}

export function FromUint8Array(buffer: Uint8Array) : string {
    return String.fromCharCode.apply(null, Array.from<number>(buffer));
}