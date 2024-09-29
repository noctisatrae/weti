export interface GetBalances {
  id: number
  result: Result
  jsonrpc: string
}

export interface Result {
  address: string
  tokenBalances: TokenBalance[]
}

export interface TokenBalance {
  tokenBalance: string
  contractAddress: string
}