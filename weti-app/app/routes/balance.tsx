import { json, LoaderFunctionArgs } from "@remix-run/node"

import { Provider, WatchRequest, WatchRequestResponse, WatchRequestResponseError, RpcResponse } from "~/types/";
import Moralis from "~/types/moralis"

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const chain = url.searchParams.get('chain');
  const isConnected = url.searchParams.get('connected') === 'true';
  const address = url.searchParams.get('address');

  if (address === null) {
    return json({ error: "Address was not provided!" }, { status: 400 })
  }

  if (chain === null) {
    return json({ error: 'Chain id not provided' }, { status: 400 })
  }

  if (!isConnected) {
    return json({ error: 'User not connected' }, { status: 401 });
  }

  try {
    // 1. Make the /watch request only once (e.g., to start a job)
    const watchResponse = await fetch("http://localhost:8000/watch", {
      method: "POST",
      body: JSON.stringify({
        // string conversion
        chainId: +chain,
        frequency: 10,
        // 2 minutes from now
        expiration: new Date(Date.now() + 2 * 60 * 1000).toISOString(),
        provider: Provider.Moralis,
        rpc: {
          jsonrpc: "2.0",
          method: "eth_getTokenBalances",
          params: [
            {
              "address": address!,
              "excludeSpam": true,
            }
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

    const { id } = await watchResponse.json() as WatchRequestResponse;

    // 2. Poll the /result endpoint until the job is completed
    let jobResult: RpcResponse<Moralis> | null = null;
    const pollInterval = 2000; // 2 seconds polling interval
    const maxRetries = 25; // Retry 25 times before giving up
    let retries = 0;

    while (jobResult == null && retries < maxRetries) {
      await new Promise(res => setTimeout(res, pollInterval)); // Wait for 2 seconds before retrying

      const resultResponse = await (await fetch(`http://localhost:8000/result`, {
        method: "POST",
        headers: {
          "Authorization": "Bearer helloworld",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          id: id
        })
      })).text();

      if (resultResponse != "") {
        jobResult = JSON.parse(resultResponse)
      }

      retries++;
    }

    if (jobResult == null) {
      throw new Error("Failed to retrieve result after multiple attempts");
    }

    return json(jobResult.result);

  } catch (e) {
    console.error(e);
    return json({ error: `${e}` } as WatchRequestResponseError);
  }
};