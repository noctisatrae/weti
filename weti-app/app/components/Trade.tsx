import React, { useCallback, useEffect, useRef, useState } from 'react';
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
  const chainId = useChainId();
  const tokenList = useLoaderData<TokenList[]>();
  const [fromToken, setFromToken] = useState<TokenList | null>(null);
  const [toToken, setToToken] = useState<TokenList | null>(null);
  const [quote, setQuote] = useState(null);
  const { address } = useAccount();
  const fetcher = useFetcher({ key: "price-fetching" });
  const tokenFetcher = useFetcher({ key: "token" });
  const actionData = useActionData<typeof PriceAction>();

  useEffect(() => {
    tokenFetcher.load(`/trade?chainId=${chainId}`);
  }, [chainId]);

  useEffect(() => {
    if (tokenList.length > 0) {
      setFromToken(tokenList[0]);
      setToToken(tokenList[1]);
    }
  }, [tokenList]);

  const fetchQuote = useCallback((amount: string, from: string, to: string, chain: number, taker: string) => {
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
  }, [fetcher]);

  const debouncedFetchQuote = useRef(debounce(fetchQuote, 500)).current;

  useEffect(() => {
    if (address && chainId && fromToken && toToken && fromAmount) {
      debouncedFetchQuote(fromAmount, fromToken.address, toToken.address, chainId, address);
    }
  }, [fromAmount])

  useEffect(() => {
    if (fetcher.data && !fetcher.data.errors) {
      setQuote(fetcher.data);
      setToAmount(fetcher.data.buyAmount || "Liquidity not available");
    }
  }, [fetcher.data]);

  const handleSwap = () => {
    if (fromToken && toToken) {
      setFromToken(toToken);
      setToToken(fromToken);
      setFromAmount(toAmount);
      setToAmount(fromAmount);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-2xl font-bold text-center">
        Trade {fromToken?.symbol} for {toToken?.symbol}
      </CardHeader>
      <CardContent>
        {actionData && <p>{JSON.stringify(actionData)}</p>}
        <fetcher.Form method="post" className="space-y-4">
          <div className="flex items-center space-x-2">
            <TokenSelector
              tokenList={tokenList}
              selectedToken={fromToken!}
              onSelect={setFromToken}
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
              selectedToken={toToken!}
              onSelect={setToToken}
            />
            <Input
              name="to"
              value={toAmount}
              readOnly
              className="flex-grow"
            />
          </div>
          <Button type="submit" className="w-full">
            Swap {fromToken?.symbol} for {toToken?.symbol}
          </Button>
        </fetcher.Form>
      </CardContent>
    </Card>
  );
};