import { PriceAPI } from "~/types/metamask";
import { Badge } from "./ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

type TickerProps = {
  data: PriceAPI,
  period: number
}

const Ticker = (props: TickerProps) => {
  return(
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Badge variant={props.data[`pricePercentChange${props.period}d`] as number < 0 ? "destructive" : "default"}>{Math.round(props.data[`pricePercentChange${props.period}d`] as number)}%</Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>(7-day period)</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default Ticker;