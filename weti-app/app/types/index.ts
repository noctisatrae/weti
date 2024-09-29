export type Rpc = {
  jsonrpc: string,
  method: string,
  params: string[],
  id: number
}

export type RpcResponse<T> = {
  id: number;
  result: T;
}

export enum Provider {
  Alchemy = "alchemy",
  Moralis = "moralis"
}

export type WatchRequest = {
  chainId: number,
  frequency: number,
  expiration: string,
  provider: Provider,
  rpc: Rpc
}

export type WatchRequestResponse = {
  id: number
}

export type WatchRequestResponseError = {
  error: string
}