import { useFetcher } from "@remix-run/react";
import { useEffect, useMemo } from "react";
import { loader } from "./balance";

import { useIsConnected } from "~/hooks/useIsConnected";
import { GetBalances } from "~/types/moralis";
import { useAccount, useChainId } from "wagmi";

import { parseBalance } from '~/lib/'

const Index = () => {
  const isConnected = useIsConnected()
  const account = useAccount()
  const chain = useChainId()
  const fetcher = useFetcher<typeof loader>()

  useEffect(() => {
    if (isConnected == true) {
      fetcher.load(`/balance?connected=true&chain=${chain}&address=${account.address}`)
    }
  }, [isConnected, chain])

  return (
    <>
      {fetcher.data == null && fetcher.data == undefined && isConnected ? (
        <p>Loading...</p>
      ) : (
        fetcher.data && (fetcher.data as GetBalances).result? (
          (fetcher.data as GetBalances).result.map(token => (
            <li key={token.symbol}><img src={token.logo} alt={token.symbol} />{parseBalance(token.balance, token.decimals)}</li>
          ))
        ) : (
          <p>No balances available</p>
        )
      )}
    </>
  );  
}

export default Index;