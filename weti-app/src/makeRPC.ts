const getTokenBalanceForAddress = (address: string, token: string[]) => {
  return {
    jsonrpc: "2.0",
    method: "alchemy_getTokenBalances",
    "params": [
      `${address}`,
      token
    ],
    // ? why?
    id: 42
  }
}

export const AlchemyRPC = {
  getTokenBalanceForAddress
}