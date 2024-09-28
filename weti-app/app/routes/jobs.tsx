import { json, LoaderFunctionArgs } from "@remix-run/node"
import { base, mainnet } from "viem/chains";

type Rpc = {
  jsonrpc: string,
  method: string,
  params: string[],
  id: number
}

type RpcResponse = {
  id: number;
  result: unknown;
}

enum Provider {
  Alchmey = "alchemy",
  Moralis = "moralis"
}

type WatchRequest = {
  chainId: number,
  frequency: number,
  expiration: string,
  provider: Provider,
  rpc: Rpc
}

type WatchRequestResponse = {
  id: number
}

type WatchRequestResponseError = {
  error: string
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const isConnected = url.searchParams.get('connected') === 'true';

  if (!isConnected) {
    return json({ error: 'User not connected' }, { status: 401 });
  }

  try {
    // 1. Make the /watch request only once (e.g., to start a job)
    let watchResponse = await fetch("http://localhost:8000/watch", {
      method: "POST",
      body: JSON.stringify({
        chainId: mainnet.id,
        frequency: 10,
        expiration: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
        provider: Provider.Alchmey,
        rpc: {
          jsonrpc: "2.0",
          method: "alchemy_getTokenBalances",
          params: [
            "0x84673f99d9807780ce5Db4c3A980d708535d9604", ["0x3abF2A4f8452cCC2CF7b4C1e4663147600646f66"]
          ],
          id: 1
        }
      } as WatchRequest),
      headers: {
        "Authorization": "Bearer helloworld",
        "Content-Type": "application/json"
      }
    });

    // Ensure that the /watch request was successful
    if (watchResponse.status != 200) {
      throw new Error("Failed to create job");
    }

    const watchData = await watchResponse.json() as WatchRequestResponse;

    // 2. Poll the /result endpoint until the job is completed
    let result: RpcResponse | null = null;
    const pollInterval = 2000; // 2 seconds polling interval
    const maxRetries = 25; // Retry 10 times before giving up
    let retries = 0;

    while (result == null && retries < maxRetries) {
      await new Promise(res => setTimeout(res, pollInterval)); // Wait for 2 seconds before retrying

      const resultResponse = await fetch(`http://localhost:8000/result`, {
        method: "POST",
        headers: {
          "Authorization": "Bearer helloworld",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
           id: watchData.id
        } as WatchRequestResponse)
      });

      if (resultResponse.ok) {
        result = await resultResponse.json() as RpcResponse;
      }

      retries++;
    }

    if (!result) {
      throw new Error("Failed to retrieve result after multiple attempts");
    }

    return json(result);

  } catch (e) {
    console.error(e);
    return json({ error: `${e}` } as WatchRequestResponseError);
  }
};