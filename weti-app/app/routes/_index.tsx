import { useFetcher } from "@remix-run/react";
import { useEffect } from "react";
import { loader } from "./jobs";

import { useIsConnected } from "~/hooks/useIsConnected";

const Index = () => {
  const isConnected = useIsConnected()
  const fetcher = useFetcher<typeof loader>()

  useEffect(() => {
    if (isConnected == true) {
      fetcher.load("/jobs?connected=true")
    }
  }, [isConnected])

  return (
    <>
      {fetcher.data == null && isConnected ? (<p>Loading...</p>) : (<p>{JSON.stringify(fetcher.data)}</p>)}
    </>
  );
}

export default Index;