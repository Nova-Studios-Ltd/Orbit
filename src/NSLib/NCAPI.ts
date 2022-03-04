export class NCAPIResponse {
    status: number | undefined;
    statusText: string | undefined;
    error: unknown | undefined;
    payload: any | undefined;

    constructor(status?: number | undefined, statusText?: string | undefined, payload?: unknown, error?: unknown | undefined) {
        this.status = status || -1;
        this.statusText = statusText || "";
        this.error = error;
        this.payload = payload;
    }
}

export enum ContentType {
    EMPTY = "",
    JSON = "application/json",
    PNG = "image/png",
    FORMDATA = "multipart/form-data",
    TEXT = "text/plain"
}

export async function GET(endpoint: string, token?: string) : Promise<NCAPIResponse> {
    const resp = await fetch(`https://api.novastudios.tk/${endpoint}`, {
        method: "GET",
        headers: {
            "Authorization": token || ""
        }
    });
    return new NCAPIResponse(resp.status, resp.statusText, await resp.json())
}

export async function POST(endpoint: string, content_type: ContentType, payload: string, token?: string) : Promise<NCAPIResponse> {
    const resp = await fetch(`https://api.novastudios.tk/${endpoint}`, {
        method: "POST",
        headers: {
            "Authorization": token || "",
            "Content-Type": content_type
        },
        body: payload
    });
    return new NCAPIResponse(resp.status, resp.statusText, await resp.json());
}

export async function PUT(endpoint: string, content_type: ContentType, payload: string, token?: string) : Promise<NCAPIResponse> {
    const resp = await fetch(`https://api.novastudios.tk/${endpoint}`, {
        method: "PUT",
        headers: {
            "Authorization": token || "",
            "Content-Type": content_type
        },
        body: payload
    });
    return new NCAPIResponse(resp.status, resp.statusText);
}

export async function PATCH(endpoint: string, content_type: ContentType, payload: string, token?: string) : Promise<NCAPIResponse> {
    const resp = await fetch(`https://api.novastudios.tk/${endpoint}`, {
        method: "PATCH",
        headers: {
            "Authorization": token || "",
            "Content-Type": content_type
        },
        body: payload
    });
    return new NCAPIResponse(resp.status, resp.statusText);
}

export async function DELETE(endpoint: string, token?: string) : Promise<NCAPIResponse> {
    const resp = await fetch(`https://api.novastudios.tk/${endpoint}`, {
        method: "PATCH",
        headers: {
            "Authorization": token || ""
        }
    });
    return new NCAPIResponse(resp.status, resp.statusText);
}

export async function POSTFile(endpoint: string, payload: Blob, token?: string) : Promise<NCAPIResponse> {
    const formData = new FormData();
    formData.append("file", payload);
    const resp = await fetch(`https://novastudios.tk/${endpoint}`, {
        method: "POST",
        body: formData
    });
    return new NCAPIResponse(resp.status, resp.statusText, resp.json());
}

export async function GETFile(endpoint: string, token?: string) : Promise<NCAPIResponse> {
    const resp = await fetch(`https://api.novastudios.tk/${endpoint}`, {
        method: "GET",
        headers: {
            "Authorization": token || ""
        }
    });
    return new NCAPIResponse(resp.status, resp.statusText, new Uint8Array(await resp.arrayBuffer()))
}