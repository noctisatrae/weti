import { useParams } from "@remix-run/react";
import React, { useState } from "react";
import CalendarForm from "~/components/CalendarForm";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Slider } from "~/components/ui/slider";

const Watch = () => {
  const params = useParams();
  const [frequency, setFrequency] = useState<number>(10);

  return <>
    <Card>
      <CardHeader>
        <CardTitle>Watch a wallet</CardTitle>
        <CardDescription>Creates a job that gives you information about the earnings of a wallet</CardDescription>
      </CardHeader>
      <CardContent>
        <form action="">
          <div className="grid w-full items-center gap-4">
            <Input placeholder="Address" value={params.address} />
            <Slider about="frequency" min={10} max={100} onValueChange={(val) => {
              setFrequency(val[0])
            }} />
            <CalendarForm/>
            <Button>Watch wallet every {frequency > 60 ? "1h + " + frequency % 60 + " min." : frequency + " min."}</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  </>
}

export default Watch;