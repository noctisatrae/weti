import { useFetcher } from "@remix-run/react";
import { useEffect } from "react";
import { loader } from "./balance";

import { useIsConnected } from "~/hooks/useIsConnected";
import { GetBalances } from "~/types/alchemy";

import { formatEther } from 'ethers'
import { useChainId } from "wagmi";

const Index = () => {
  const isConnected = useIsConnected()
  const chain = useChainId()
  const fetcher = useFetcher<typeof loader>()

  useEffect(() => {
    if (isConnected == true) {
      fetcher.load("/balance?connected=true&chain=" + chain)
    }
  }, [isConnected, chain])

  return (
    <>
      {fetcher.data == undefined || null && isConnected ?
        (<p>Loading...</p>) :
        ((fetcher.data as GetBalances).result.tokenBalances.map(balance => 
          <li key={balance.contractAddress}>{formatEther(balance.tokenBalance)}</li>
        ))
      }
    </>
  );
}

export default Index;