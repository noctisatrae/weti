export interface PriceAPI {
  [key: string]: any;
  id:                       string;
  symbol:                   string;
  name:                     string;
  price:                    number;
  marketCap:                number;
  allTimeHigh:              number;
  allTimeLow:               number;
  totalVolume:              number;
  high1d:                   number;
  low1d:                    number;
  circulatingSupply:        number;
  dilutedMarketCap:         number;
  marketCapPercentChange1d: number;
  priceChange1d:            number;
  pricePercentChange1h:     number;
  pricePercentChange1d:     number;
  pricePercentChange7d:     number;
  pricePercentChange14d:    number;
  pricePercentChange30d:    number;
  pricePercentChange200d:   number;
  pricePercentChange1y:     null;
  lastUpdated:              string;
  platforms:                Platforms;
}

export interface Platforms {
  [key: string]: string
}
