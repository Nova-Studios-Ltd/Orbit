import { Flags, HasUrlFlag } from "Lib/Debug/Flags";
import { API_DOMAIN } from "vars";

/**
 * Experimental type overrides.
 */
type EXPERIMENTAL_TYPE_RequestInit = RequestInit & { duplex: "half" | "full" };
type EXPERIMENTAL_TYPE_fetch = (input: RequestInfo, init?: EXPERIMENTAL_TYPE_RequestInit) => Promise<Response>;

const EXPERIMENTAL_fetch: EXPERIMENTAL_TYPE_fetch = fetch;

/**
 * Represents commonly used HTTP Status Codes (HTTPStatusCodes.OK, 400, 401, 403, 404, 500)
 */
export enum HTTPStatusCodes {
  OK = 200,
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  MethodNotAllowed = 405,
  ServerError = 500,
}

/**
 * Represents a response from the NovaChat API
 */
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

/**
 * Represents common content types
 */
export enum ContentType {
  EMPTY = "",
  JSON = "application/json",
  PNG = "image/png",
  FORM_DATA = "multipart/form-data",
  TEXT = "text/plain"
}

/**
 * Represents the callback type for the status of requests.
 *
 * For example, getting the progress of an upload.
 */
export type ProgressCallback = (current: number, max: number) => any

/**
 * Use to GET data from the API
 * @param endpoint Url of the endpoint
 * @param token Optional security token
 * @returns A NCAPIResponse with the data from the NovaChat API
 */
export async function GET(endpoint: string, token?: string, json: boolean = true) : Promise<NCAPIResponse> {
  const resp = await fetch(`${API_DOMAIN}/${endpoint}`, {
    method: "GET",
    headers: {
      "Authorization": token || ""
    }
  });
  if (json && resp.status === HTTPStatusCodes.OK)
    return new NCAPIResponse(resp.status, resp.statusText, await resp.json());
  else
    return new NCAPIResponse(resp.status, resp.statusText, await resp.text());
}

/**
 * Use to POST data to the API
 * @param endpoint Url of the endpoint
 * @param content_type Indicates the type of data being sent
 * @param payload The data to be sent with the request
 * @param token Optional security token
 * @returns A NCAPIResponse with the data from the NovaChat API
 */
export async function POST(endpoint: string, content_type: ContentType, payload: string, token?: string, json: boolean = true) : Promise<NCAPIResponse> {
  const resp = await fetch(`${API_DOMAIN}/${endpoint}`, {
    method: "POST",
    headers: {
        "Authorization": token || "",
        "Content-Type": content_type
    },
    body: payload,
  });

  if (json && resp.status === HTTPStatusCodes.OK)
    return new NCAPIResponse(resp.status, resp.statusText, await resp.json());
  else
    return new NCAPIResponse(resp.status, resp.statusText, await resp.text());
}

/**
 * WARNING: Experimental method! May break at any time, and may not work on even slightly older browser versions.
 *
 * Use to POST a file to the API.
 *
 * This experimental version uses streams instead of static strings as the payload.
 *
 * @param endpoint Url of the endpoint
 * @param content_type Indicates the type of data being sent
 * @param payload The data to be sent with the request
 * @param token Optional security token
 * @param progressCallback Optional callback function that is called whenever a new "progress" event is received from the request
 * @returns A NCAPIResponse with the data from the NovaChat API
 */
export async function EXPERIMENTAL_POSTFile(endpoint: string, payload: Blob, filename: string, keys?: string, iv?: string, token?: string, progressCallback?: ProgressCallback) : Promise<NCAPIResponse> {
  let progress = 0;
  const MAX_PROGRESS = payload.length;

  const formData = new FormData();
  formData.append("file", payload, filename);
  formData.append("keys", keys || "");
  formData.append("iv", iv || "");

  const stream = new ReadableStream({
    start: (controller) => {
      controller.enqueue(formData);
    },
    pull: (controller) => {
      progress++;
      if (progressCallback) progressCallback(progress, MAX_PROGRESS);
      if (progress >= MAX_PROGRESS) controller.close();
    }
  });

  const resp = await EXPERIMENTAL_fetch(`${API_DOMAIN}/${endpoint}`, {
    method: "POST",
    headers: {
        "Authorization": token || "",
    },
    body: stream,
    duplex: "half"
  }).catch(e => Promise.reject(e));

  return new NCAPIResponse(resp.status, resp.statusText, await resp.text());
}

/**
 * Use to PUT data to the API
 * @param endpoint Url of the endpoint
 * @param content_type Indicates the type of data being sent
 * @param payload The data to be sent with the request
 * @param token Optional security token
 * @returns A NCAPIResponse with the data from the NovaChat API
 */
export async function PUT(endpoint: string, content_type: ContentType, payload: string, token?: string) : Promise<NCAPIResponse> {
    const resp = await fetch(`${API_DOMAIN}/${endpoint}`, {
        method: "PUT",
        headers: {
            "Authorization": token || "",
            "Content-Type": content_type
        },
        body: payload
    });
    return new NCAPIResponse(resp.status, resp.statusText);
}

/**
 * Use to PATCH data to the API
 * @param endpoint Url of the endpoint
 * @param content_type Indicates the type of data being sent
 * @param payload The data to be sent with the request
 * @param token Optional security token
 * @returns A NCAPIResponse with the data from the NovaChat API
 */
export async function PATCH(endpoint: string, content_type: ContentType, payload: string, token?: string) : Promise<NCAPIResponse> {
  const resp = await fetch(`${API_DOMAIN}/${endpoint}`, {
    method: "PATCH",
    headers: {
      "Authorization": token || "",
      "Content-Type": content_type
    },
    body: payload
  });
  return new NCAPIResponse(resp.status, resp.statusText);
}

/**
 * Use to DELETE data from the API
 * @param endpoint Url of the endpoint
 * @param token Optional security token
 * @returns A NCAPIResponse with the data from the NovaChat API
 */
export async function DELETE(endpoint: string, token?: string) : Promise<NCAPIResponse> {
    const resp = await fetch(`${API_DOMAIN}/${endpoint}`, {
        method: "DELETE",
        headers: {
          "Authorization": token || ""
        }
    });
    return new NCAPIResponse(resp.status, resp.statusText);
}

/**
 * Use to POST a file to the API
 * @param endpoint Url of the endpoint
 * @param payload Blob containing the file
 * @param token Optional security token
 * @returns A NCAPIResponse with the data from the NovaChat API
 */
export async function POSTFile(endpoint: string, payload: Blob, filename: string, keys?: string, iv?: string, token?: string) : Promise<NCAPIResponse> {
  const formData = new FormData();
  formData.append("file", payload, filename);
  formData.append("keys", keys || "");
  formData.append("iv", iv || "");
  const resp = await fetch(`${API_DOMAIN}/${endpoint}`, {
    method: "POST",
    body: formData,
    headers: {
      "Authorization": token || ""
    }
  });
  return new NCAPIResponse(resp.status, resp.statusText, await resp.text());
}

/**
 * Use to GET a file from the API
 * @param endpoint Url of the endpoint
 * @param token Optional security token
 * @returns A NCAPIResponse with the data from the NovaChat API
 */
export async function GETFile(endpoint: string, token?: string, isExternal?: boolean) : Promise<NCAPIResponse> {
  if (endpoint.includes(API_DOMAIN)) endpoint = endpoint.replace(API_DOMAIN, "");
  const url = (isExternal) ? `${API_DOMAIN}/Proxy?url=${endpoint}` : `${API_DOMAIN}/${endpoint}`;

  const cache = await caches.open("NCMediaCache");

  if (!HasUrlFlag(Flags.NoCache)) {
    if (cache !== undefined) {
      const cachedEntry = await cache.match(url);

      if (cachedEntry !== undefined) {
        return new NCAPIResponse(cachedEntry.status, cachedEntry.statusText, new Uint8Array(await cachedEntry.arrayBuffer()))
      }
    } else {
      console.warn("Media caching is not available in this environment");
    }
  } else {
    console.warn("Not fetching media from cache due to URL flag")
  }

  const resp = await fetch(url, {
    method: "GET",
    headers: {
      "Authorization": token || ""
    }
  });

  // There's two of the same check because this chunk is only reached when the file isn't already cached
  if (!HasUrlFlag(Flags.NoCache) && cache !== undefined) {
    const respCC = resp.clone();

    cache.put(url, respCC);
  }

  return new NCAPIResponse(resp.status, resp.statusText, new Uint8Array(await resp.arrayBuffer()))
}
