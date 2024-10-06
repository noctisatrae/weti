import { Trade } from "~/components/Trade";

import PriceAction from "./price";
import TokenLoader from "./tokens";

export const loader = TokenLoader;
export const action = PriceAction;

const TradeRoute = () => {
  return <Trade />
}

export default TradeRoute;