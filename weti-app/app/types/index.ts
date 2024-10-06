export type Rpc = {
  jsonrpc: string,
  method: string,
  params: unknown[],
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

export type TokenList = {
  name: string,
  symbol: string,
  decimals: number,
  address: string,
  iconUrl: string,
  occurences: number,
  source: string[],
  chainId: number,
  coingeckoId: string
}

export type TokenSelectResult = {
  symbol: string,
  address: string
}

export type WatchRequestResponse = {
  id: number
}

export type WatchRequestResponseError = {
  error: string
}