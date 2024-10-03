import { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect, useParams } from "@remix-run/react";
import { add } from "date-fns";
import React, { useState } from "react";
import { isAddress } from "viem";
import CalendarForm from "~/components/CalendarForm";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Slider } from "~/components/ui/slider";

const Watch = () => {
  const params = useParams();
  const [address, setAddress] = useState<string>(params.address!);
  const [utcDate, setUTCDate] = useState<string>(""); 
  const [frequency, setFrequency] = useState<number>(10);

  return <>
    <Card>
      <CardHeader>
        <CardTitle>Watch a wallet</CardTitle>
        <CardDescription>Creates a job that gives you information about the earnings of a wallet</CardDescription>
      </CardHeader>
      <CardContent>
        <form method="post">
          <div className="grid w-full items-center gap-4">
            <Input placeholder="Address" name="address" onChange={(e) => setAddress(e.target.value)} defaultValue={params.address} />
            <Slider about="frequency" min={10} max={100} onValueChange={(val) => {
              setFrequency(val[0])
            }} />
            <CalendarForm name="test" utcDate={utcDate} setUTCDate={setUTCDate} />
            <input type="hidden" name="utcDate" value={utcDate} />
            <input type="hidden" name="frequency" value={frequency} />
            <Button disabled={utcDate.length == 0 || !isAddress(address)}>Watch wallet every {frequency > 60 ? "1h + " + frequency % 60 + " min." : frequency + " min."}</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  </>
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const body = await request.formData();
  const address = body.get("address")
  const utcDate = body.get("utcDate")
  const frequency = body.get("frequency")

  console.debug({address, utcDate, frequency})

  fetch("http://localhost:8000/watch", { method: "POST" })

  return redirect("/job/3")
}

export default Watch;