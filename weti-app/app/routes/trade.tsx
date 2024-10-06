import { Trade } from "~/components/Trade";
import PriceAction from "./price";
import TokenLoader from "./tokens";
import { LoaderFunctionArgs } from "@remix-run/node";

export const loader = async ({ request, params, context }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const chainId = url.searchParams.get("chainId") || "1"; // Default to Ethereum mainnet
  return TokenLoader({ request: new Request(`${url.origin}?chainId=${chainId}`), params, context });
};

export const action = PriceAction;

const TradeRoute = () => {
  return <Trade />;
};

export default TradeRoute;
