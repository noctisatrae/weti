import React, { useCallback, useEffect, useState } from 'react';
import { useAccount, useChainId } from 'wagmi';
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { ArrowRightLeft } from "lucide-react";
import debounce from 'lodash/debounce';
import PriceAction from "~/routes/price";
import TokenSelector from './TokenSelector';
import { TokenList } from '~/types';
import { useFetcher, useActionData, useLoaderData } from '@remix-run/react';

export const Trade = () => {
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");

  const tokenList = useLoaderData<TokenList[]>();
  // Storing token objects (address + symbol)
  const [fromToken, setFromToken] = useState<TokenList>(tokenList[0]);
  const [toToken, setToToken] = useState<TokenList>(tokenList[1]);

  const [quote, setQuote] = useState(null);
  const { address } = useAccount();
  const chainId = useChainId();
  const fetcher = useFetcher();
  const actionData = useActionData<typeof PriceAction>();

  const debouncedFetchQuote = useCallback(
    debounce((amount: string, from: string, to: string, chain: number, taker: string) => {
      if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) return;

      fetcher.submit(
        {
          chain: `${chain}`,
          buyToken: to,
          sellToken: from,
          sellAmount: amount,
          taker: taker,
        },
        { method: "post" }
      );
    }, 500),
    []
  );

  useEffect(() => {
    if (address && chainId) {
      debouncedFetchQuote(fromAmount, fromToken.address, toToken.address, chainId, address);
    }
  }, [fromAmount, fromToken, toToken, chainId, address, debouncedFetchQuote]);

  useEffect(() => {
    // @ts-ignore
    if (fetcher.data && !fetcher.data.errors) {
      // @ts-ignore
      setQuote(fetcher.data);
      // @ts-ignore
      setToAmount(fetcher.data.buyAmount || "Liquidity not available");
    }
  }, [fetcher.data]);

  const handleSwap = () => {
    // Swap token addresses and symbols
    const tempToken = fromToken;
    setFromToken(toToken);
    setToToken(tempToken);

    // Swap amounts
    setFromAmount(toAmount);
    setToAmount(fromAmount);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-2xl font-bold text-center">
        Trade {fromToken.symbol} for {toToken.symbol}
      </CardHeader>
      <CardContent>
        {actionData && <p>{JSON.stringify(actionData)}</p>}
        <fetcher.Form method="post" className="space-y-4">
          <div className="flex items-center space-x-2">
            <TokenSelector 
              tokenList={tokenList} 
              selectedToken={fromToken} 
              onSelect={setFromToken}  // Full token object passed here
            />
            <Input
              name="from"
              placeholder="Amount..."
              value={fromAmount}
              onChange={(e) => setFromAmount(e.target.value)}
              className="flex-grow"
            />
          </div>
          <div className="flex justify-center">
            <Button type="button" variant="ghost" onClick={handleSwap}>
              <ArrowRightLeft className="h-6 w-6" />
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <TokenSelector 
              tokenList={tokenList} 
              selectedToken={toToken} 
              onSelect={(val: TokenList) => { setToToken(val) }}  // Full token object passed here
            />
            <Input
              name="to"
              value={toAmount}
              readOnly
              className="flex-grow"
            />
          </div>
          <Button type="submit" className="w-full">
            Swap {fromToken.symbol} for {toToken.symbol}
          </Button>
        </fetcher.Form>
      </CardContent>
    </Card>
  );
};
