import { json, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import KeyMetrics from "~/components/KeyMetrics";
import PriceChart from "~/components/PriceChart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

import { PriceAPI } from "~/types/metamask";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const priceRequest = await fetch(`https://price.api.cx.metamask.io/v1/chains/${params['chain']}/spot-prices/${params['id']}`)
  return json(await priceRequest.json() as PriceAPI)
}

const Index = () => {
  const data = useLoaderData<typeof loader>()

  return (
    <Tabs className="p-1 lg:p-10 lg:m-10" defaultValue="metrics">
      <script src="https://widgets.coingecko.com/gecko-coin-price-chart-widget.js"></script>
      <TabsList>
        <TabsTrigger value="metrics">Key Metrics</TabsTrigger>
        <TabsTrigger value="chart" >Chart</TabsTrigger>
        <TabsTrigger value="trade">Trade</TabsTrigger>
      </TabsList>
      <TabsContent value="metrics">
        {data.symbol == null ? <p>This token doesn't have public data available...</p> : <KeyMetrics {...data}/>}
      </TabsContent>
      <TabsContent value="chart">
        {data != null ? <PriceChart id={data.id} /> : <p>Loading chart...</p>}
      </TabsContent>
      <TabsContent value="trade">
      </TabsContent>
    </Tabs>
  );
}

export default Index