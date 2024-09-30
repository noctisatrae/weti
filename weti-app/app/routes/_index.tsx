import { useFetcher } from "@remix-run/react";
import { useEffect } from "react";
import { loader } from "./balance";

import { useIsConnected } from "~/hooks/useIsConnected";
import { GetBalances } from "~/types/moralis";
import { useAccount, useChainId } from "wagmi";
import TokenBalanceTable from "~/components/TokenBalance";

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
          <TokenBalanceTable data={(fetcher.data as GetBalances).result} />
        ) : (
          <p>No balances available</p>
        )
      )}
    </>
  );  
}

export default Index;