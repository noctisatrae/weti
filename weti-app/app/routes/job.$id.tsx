import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData, useParams } from "@remix-run/react";
import TokenBalance from "~/components/TokenBalance";
import { RpcResponse } from "~/types";
import Moralis from "~/types/moralis";

async function fetchJobResult(id: number): Promise<RpcResponse<Moralis> | null> {
  try {
    const response = await fetch(`http://localhost:8000/result`, {
      method: "POST",
      headers: {
        "Authorization": "Bearer helloworld",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ id })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status} | msg: ${JSON.stringify(await response.json())}`);
    }

    const text = await response.text();
    return text ? JSON.parse(text) : null;
  } catch (error) {
    console.error("Error fetching job result:", error);
    return null;
  }
}

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const jobId = +params["id"]!;
  if (!jobId) {
    throw json({ error: "Job ID is required" }, { status: 400 });
  }

  const pollInterval = 2000; // 2 seconds polling interval
  const maxRetries = 25; // Retry 25 times before giving up

  for (let i = 0; i < maxRetries; i++) {
    const jobResult = await fetchJobResult(jobId);
    if (jobResult) {
      return json(jobResult.result);
    }
    await new Promise(res => setTimeout(res, pollInterval));
  }

  throw json({ error: "Failed to retrieve result after multiple attempts" }, { status: 504 });
};

const Job = () => {
  const data = useLoaderData<typeof loader>();
  const { id } = useParams();

  return (
    <div>
      <h1>Result of {id}</h1>
      <TokenBalance data={data.result} />
    </div>
  );
};

export default Job;