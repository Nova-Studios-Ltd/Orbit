import { GET, HTTPStatusCodes } from "Lib/API/NCAPI";

/**
 * Sends a ping and returns the latency
 * @param status Optional. Status to conclude as a sucess
 * @returns If the status code is met, returns latency. Otherwise Number.MAX_SAFE_INTEGER
 */
export async function SendPing(status: number = HTTPStatusCodes.OK) : Promise<number> {
  const start = Date.now();
  const resp = await GET(`/Events/Ping?status=${status}`, undefined, false);
  if (resp.status === HTTPStatusCodes.OK) {
    return Date.now() - start;
  }
  return Number.MAX_SAFE_INTEGER;
}
