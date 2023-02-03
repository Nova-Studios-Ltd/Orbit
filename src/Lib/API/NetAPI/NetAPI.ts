import { BufferPayload } from "Lib/API/NetAPI/BufferPayload";
import { NetHeaders } from "Lib/API/NetAPI/NetHeaders";
import { NetResponse } from "Lib/API/NetAPI/NetResponse";
import { KeyValuePair } from "Lib/Objects/Dictionary";
import { API_DOMAIN } from "vars";

/**
 * Attempts to parse the provided string, if unsuccessful returns a string
 * @param json Json to be parsed
 * @returns A object of type T
 */
function HandleResponsePayload<T>(json: string) : T {
  if (json === "") return "" as T;
  let data = undefined;
  try {
    data = JSON.parse(json);
  } catch (e) {
    return json as T;
  }

  if (typeof data === "object" && data !== null) {
    return data as T;
  }

  return "" as T;
}

/**
 * Use to GET data from the API
 * @param endpoint Url of the endpoint
 * @param headers Optional headers along side the request
 * @returns A NetResponse with the data
 */
export async function GET<T>(endpoint: string, headers?: NetHeaders) : Promise<NetResponse<T>> {
  const resp = await fetch((endpoint.startsWith("http"))? endpoint : `${API_DOMAIN}/${endpoint}`, {
    method: "GET",
    headers: headers?.Finish() || {},
  });

  return new NetResponse<T>(resp.status, resp.statusText, HandleResponsePayload<T>(await resp.text()));
}

/**
 * Use to POST data to the API
 * @param endpoint Url of the endpoint
 * @param payload The data to be sent with the request
 * @param headers Optional headers along side the request
 * @returns A NetResponse with the data
 */
export async function POST<T>(endpoint: string, payload: string, headers?: NetHeaders) : Promise<NetResponse<T>> {
  const resp = await fetch((endpoint.startsWith("http"))? endpoint : `${API_DOMAIN}/${endpoint}`, {
    method: "POST",
    headers: headers?.Finish() || {},
    body: payload
  });

  return new NetResponse<T>(resp.status, resp.statusText, HandleResponsePayload<T>(await resp.text()));
}

/**
 * Use to PUT data to the API
 * @param endpoint Url of the endpoint
 * @param payload The data to be sent with the request
 * @param headers Optional headers along side the request
 * @returns A NetResponse with the data
 */
export async function PUT<T>(endpoint: string, payload: string, headers?: NetHeaders) : Promise<NetResponse<T>> {
  const resp = await fetch((endpoint.startsWith("http"))? endpoint : `${API_DOMAIN}/${endpoint}`, {
    method: "PUT",
    headers: headers?.Finish() || {},
    body: payload
  });

  return new NetResponse<T>(resp.status, resp.statusText, HandleResponsePayload<T>(await resp.text()));
}

/**
 * Use to PATCH data to the API
 * @param endpoint Url of the endpoint
 * @param payload The data to be sent with the request
 * @param headers Optional headers along side the request
 * @returns A NetResponse with the data
 */
export async function PATCH<T>(endpoint: string, payload: string, headers?: NetHeaders) : Promise<NetResponse<T>> {
  const resp = await fetch((endpoint.startsWith("http"))? endpoint : `${API_DOMAIN}/${endpoint}`, {
    method: "PATCH",
    headers: headers?.Finish() || {},
    body: payload
  });

  return new NetResponse<T>(resp.status, resp.statusText, HandleResponsePayload<T>(await resp.text()));
}

/**
 * Use to DELETE data from the API
 * @param endpoint Url of the endpoint
 * @param payload The data to be sent with the request
 * @param headers Optional headers along side the request
 * @returns A NetResponse with the data
 */
export async function DELETE<T>(endpoint: string, headers?: NetHeaders) : Promise<NetResponse<T>> {
  const resp = await fetch((endpoint.startsWith("http"))? endpoint : `${API_DOMAIN}/${endpoint}`, {
    method: "DELETE",
    headers: headers?.Finish() || {}
  });

  return new NetResponse<T>(resp.status, resp.statusText, HandleResponsePayload<T>(await resp.text()));
}

/* Special functions for handling direct buffer data */
/* Automatically proxies data through API */

/**
 * Use to GET a buffer of data from the API (Such as a file or other non-text data)
 * @param endpoint Url of the endpoint
 * @param headers Optional headers along side the request
 * @param ignoreCache Ignores cache
 * @returns A NetResponse with the data
 */
export async function GETBuffer(endpoint: string, headers?: NetHeaders, ignoreCache = false) : Promise<NetResponse<Uint8Array>> {
  endpoint = endpoint.replace(API_DOMAIN, "");
  const url = (endpoint.startsWith("http"))? `${API_DOMAIN}/Proxy?url=${endpoint}` : `${API_DOMAIN}/${endpoint}`;

  const cache = await caches.open("MediaCache");

  if (!ignoreCache && cache !== undefined) {
    const entry = await cache.match(url);
    if (entry !== undefined) return new NetResponse<Uint8Array>(entry.status, entry.statusText, new Uint8Array(await entry.arrayBuffer()));
  }

  const resp = await fetch(url, {
    method: "GET",
    headers: headers?.Finish() || {}
  });

  if (!ignoreCache && cache !== undefined) {
    cache.put(url, resp.clone());
  }
  return new NetResponse<Uint8Array>(resp.status, resp.statusText, new Uint8Array(await resp.arrayBuffer()));
}

/**
 * Use to POST a buffer to the API (Uses FormData)
 * @param endpoint Url of the endpoint
 * @param payload The payload to post
 * @param headers Optional headers along side the request
 * @returns A NetResponse with the data
 */
export async function POSTBuffer(endpoint: string, payload: BufferPayload, headers?: NetHeaders) : Promise<NetResponse<string>> {
  const formData = new FormData();
  formData.append("file", payload.payload, payload.name);
  payload.extraFields.forEach((pair: KeyValuePair<string, string>) => {
    formData.append(pair.Key, pair.Value);
  });

  const resp = await fetch(`${API_DOMAIN}/${endpoint}`, {
    method: "POST",
    body: formData,
    headers: headers?.Finish() || {}
  });

  return new NetResponse<string>(resp.status, resp.statusText, await resp.text());
}
