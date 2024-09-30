export type GetBalances = {
  jsonrpc: string
  id: number
  result: Result[]
}

export type Result = {
  token_address: string
  name: string
  symbol: string
  decimals: number
  logo?: string
  thumbnail?: string
  balance: string
  possible_spam: boolean
  verified_contract: boolean
  total_supply: string
  total_supply_formatted: string
  percentage_relative_to_total_supply: number
}

export default GetBalances;
