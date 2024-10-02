import React from "react";
import { Badge } from "./ui/badge"; // Assuming you're using a badge component from shadcn/ui or similar
import { PriceAPI } from "~/types/metamask"; // Your PriceAPI type
import PriceChart from "./PriceChart";

const KeyMetrics = (props: PriceAPI) => {
  const {
    name,
    symbol,
    price,
    marketCap,
    allTimeHigh,
    allTimeLow,
    totalVolume,
    circulatingSupply,
    dilutedMarketCap,
    pricePercentChange1d,
    pricePercentChange7d,
    pricePercentChange30d,
    lastUpdated,
  } = props;

  return (
    <div className="p-4 bg-gray-800 text-white rounded-md w-full">
      {/* Token Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">{name} ({symbol.toUpperCase()})</h1>
        <span>Last Updated: {new Date(lastUpdated).toLocaleString()}</span>
      </div>

      {/* Key Metrics Section */}
      <div className="grid grid-cols-2 gap-4">
        {/* Price and Market Cap */}
        <div className="flex flex-col">
          <span className="text-sm text-gray-400">Price</span>
          <span className="text-2xl font-bold overflow-hidden text-ellipsis whitespace-nowrap">${price.toFixed(2)}</span>
        </div>

        <div className="flex flex-col">
          <span className="text-sm text-gray-400">Market Cap</span>
          <span className="text-2xl font-bold overflow-hidden text-ellipsis whitespace-nowrap">
            ${marketCap.toLocaleString()}
          </span>
        </div>

        {/* All-time High / Low */}
        <div className="flex flex-col">
          <span className="text-sm text-gray-400">All-Time High</span>
          <span className="text-xl overflow-hidden text-ellipsis whitespace-nowrap">${allTimeHigh.toFixed(2)}</span>
        </div>

        <div className="flex flex-col">
          <span className="text-sm text-gray-400">All-Time Low</span>
          <span className="text-xl overflow-hidden text-ellipsis whitespace-nowrap">${allTimeLow.toFixed(2)}</span>
        </div>

        {/* Total Volume / Circulating Supply */}
        <div className="flex flex-col">
          <span className="text-sm text-gray-400">Total Volume (24h)</span>
          <span className="text-xl overflow-hidden text-ellipsis whitespace-nowrap">${totalVolume.toLocaleString()}</span>
        </div>

        <div className="flex flex-col">
          <span className="text-sm text-gray-400">Circulating Supply</span>
          <span className="text-xl overflow-hidden text-ellipsis whitespace-nowrap">{circulatingSupply.toLocaleString()} {symbol.toUpperCase()}</span>
        </div>

        {/* Diluted Market Cap */}
        <div className="flex flex-col">
          <span className="text-sm text-gray-400">Diluted Market Cap</span>
          <span className="text-xl overflow-hidden text-ellipsis whitespace-nowrap">${dilutedMarketCap.toLocaleString()}</span>
        </div>

        {/* Price Percent Changes */}
        <div className="flex flex-col">
          <span className="text-sm text-gray-400">Price Change (1d)</span>
          <div>
            <Badge variant={pricePercentChange1d >= 0 ? "default" : "destructive"}>
              {pricePercentChange1d >= 0 ? `+${pricePercentChange1d.toFixed(2)}%` : `${pricePercentChange1d.toFixed(2)}%`}
            </Badge>
          </div>
        </div>

        <div className="flex flex-col">
          <span className="text-sm text-gray-400">Price Change (7d)</span>
          <div>
            <Badge variant={pricePercentChange7d >= 0 ? "default" : "destructive"}>
              {pricePercentChange7d >= 0 ? `+${pricePercentChange7d.toFixed(2)}%` : `${pricePercentChange7d.toFixed(2)}%`}
            </Badge>
          </div>
        </div>

        <div className="flex flex-col">
          <span className="text-sm text-gray-400">Price Change (30d)</span>
          <div>
            <Badge variant={pricePercentChange30d >= 0 ? "default" : "destructive"}>
              {pricePercentChange30d >= 0 ? `+${pricePercentChange30d.toFixed(2)}%` : `${pricePercentChange30d.toFixed(2)}%`}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KeyMetrics;