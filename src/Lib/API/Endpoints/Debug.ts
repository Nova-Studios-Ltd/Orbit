import { HTTPStatus, NetAPI } from "@nova-studios-ltd/typescript-netapi";

/**
 * Sends a ping and returns the latency
 * @param status Optional. Status to conclude as a sucess
 * @returns If the status code is met, returns latency. Otherwise Number.MAX_SAFE_INTEGER
 */
export async function SendPing(status: number = HTTPStatus.OK) : Promise<number> {
  const start = Date.now();
  const resp = await NetAPI.GET(`/Events/Ping?status=${status}`);
  if (resp.status === HTTPStatus.OK) {
    return Date.now() - start;
  }
  return Number.MAX_SAFE_INTEGER;
}
