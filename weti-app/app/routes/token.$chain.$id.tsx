import { json, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import KeyMetrics from "~/components/KeyMetrics";
import PriceChart from "~/components/PriceChart";
import {Trade} from "~/components/Trade";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

import PriceAction from "~/routes/price"

import { PriceAPI } from "~/types/metamask";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const priceRequest = await fetch(`https://price.api.cx.metamask.io/v1/chains/${params['chain']}/spot-prices/${params['id']}`)
  try {
    const data = await priceRequest.json();
    return json(data as PriceAPI)
  } catch (e) {
    return json({ error: e  })
  }  
}

export const action = PriceAction;

const Index = () => {
  const data = useLoaderData<typeof loader>()

  return (
    <Tabs className="p-1 lg:p-5 lg:m-5" defaultValue="metrics">
      <TabsList>
        <TabsTrigger value="metrics">Key Metrics</TabsTrigger>
        <TabsTrigger value="chart" >Chart</TabsTrigger>
        <TabsTrigger value="trade">Trade</TabsTrigger>
      </TabsList>
      <TabsContent value="metrics">
        { /* @ts-ignore */ }
        {data.symbol == null ? <p>This token doesn't have public data available...</p> : <KeyMetrics {...data}/>}
      </TabsContent>
      <TabsContent value="chart">
        { /* @ts-ignore */ }
        {data != null ? <PriceChart id={data.id} /> : <p>Loading chart...</p>}
      </TabsContent>
      <TabsContent value="trade">
        { /* @ts-ignore */ }
        {data.symbol != null ? <Trade /> : <p>Trade not available</p> }
      </TabsContent>
    </Tabs>
  );
}

export default Index