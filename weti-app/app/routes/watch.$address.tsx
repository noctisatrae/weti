import { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect, useParams } from "@remix-run/react";
import { useState } from "react";
import { isAddress } from "viem";
import CalendarForm from "~/components/CalendarForm";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Slider } from "~/components/ui/slider";
import { Provider, WatchRequest, WatchRequestResponse, WatchRequestResponseError } from "~/types";
import ChainSelector from "~/components/ChainSelector";

const Watch = () => {
  const params = useParams();
  const [address, setAddress] = useState<string>(params.address || "");
  const [utcDate, setUTCDate] = useState<string>("");
  const [frequency, setFrequency] = useState<number>(10);
  const [chain, setChain] = useState<number | null>(null);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Watch a wallet</CardTitle>
        <CardDescription>Creates a job that gives you information about the earnings of a wallet</CardDescription>
      </CardHeader>
      <CardContent>
        <form method="post">
          <div className="grid w-full items-center gap-4">
            <Input 
              placeholder="Address" 
              name="address" 
              onChange={(e) => setAddress(e.target.value)} 
              defaultValue={params.address} 
            />
            <ChainSelector value={chain} onChange={setChain} />
            <Slider 
              defaultValue={[frequency]}
              min={10} 
              max={100} 
              step={1}
              onValueChange={(val) => setFrequency(val[0])} 
            />
            <CalendarForm name="test" utcDate={utcDate} setUTCDate={setUTCDate} />
            <input type="hidden" name="utcDate" value={utcDate} />
            <input type="hidden" name="frequency" value={frequency} />
            <input type="hidden" name="chain" value={chain ?? ''} />
            <Button 
              type="submit" 
              disabled={utcDate.length === 0 || !isAddress(address) || chain === null}
            >
              Watch wallet every {frequency > 60 ? "1h + " + frequency % 60 + " min." : frequency + " min."}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const body = await request.formData();
  const address = String(body.get("address"))
  const utcDate = String(body.get("utcDate"))
  const frequency = Number(body.get("frequency"))
  const chain = Number(body.get("chain"))

  if (!chain) {
    return json({ error: "Chain must be selected" }, { status: 400 });
  }

  const watchResponse = await fetch("http://localhost:8000/watch", {
    method: "POST",
    body: JSON.stringify({
      chainId: chain,
      frequency: frequency,
      expiration: utcDate,
      provider: Provider.Moralis,
      rpc: {
        jsonrpc: "2.0",
        method: "eth_getTokenBalances",
        params: [
          {
            "address": address,
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

  const res = await watchResponse.json();
  if (watchResponse.status != 200) {
    return json({
      error: `Request failed with status: ${watchResponse.status}`,
      response: (res as WatchRequestResponseError).error
    })
  }
  return redirect(`/job/${(res as WatchRequestResponse).id}`)
}

export default Watch;