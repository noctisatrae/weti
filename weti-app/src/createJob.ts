import useSWR from 'swr';

// Type definition for the response
type WatchRes = {
  id: number;
};

// Custom fetcher for POST requests
const postFetcher = async (url: string, arg: any) => {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer helloworld'
    },
    body: JSON.stringify(arg),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch');
  }

  return response.json();
};

export enum Provider {
  "alchemy",
  "moralis"
}

type WatchRequest = {
  chainId: number,
  frequency: number,
  expiration: string,
  provider: Provider,
  rpc: any
}

// Custom hook to query /watch with POST, ensuring it only runs once per unique RPC
export const useJob = (watchRequest: WatchRequest) => {
  // Only run if rpc exists, null or undefined rpc will disable the request
  const shouldFetch = Boolean(watchRequest);

  const { data, error, isLoading } = useSWR(
    shouldFetch ? ['http://localhost:4000/watch', watchRequest] : null, // key is null if rpc is falsy, preventing fetch
    ([url, arg]) => postFetcher(url, arg),
    {
      revalidateOnFocus: false,  // Optional: disable revalidation on window focus
      revalidateOnReconnect: false, // Disable re-fetch on reconnect (e.g., after network interruption)
      shouldRetryOnError: false,    // Disable retries after an error
    }
  );

  return {
    data,
    error,
    isLoading,
  };
};