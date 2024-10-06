import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ChevronDown } from "lucide-react";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "./ui/command";
import { TokenList, TokenSelectResult } from "~/types";
import { FixedSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';

const ITEM_HEIGHT = 40;
const ITEMS_PER_PAGE = 100;

type TokenSelectorProps = {
  tokenList: TokenList[],
  selectedToken: TokenSelectResult,
  onSelect: (token: TokenList) => void
}

export const TokenSelector = ({ tokenList, selectedToken, onSelect }: TokenSelectorProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [displayedItemsCount, setDisplayedItemsCount] = useState(ITEMS_PER_PAGE);

  const filteredTokens = useMemo(() => {
    if (!searchTerm) return tokenList;

    const lowerSearchTerm = searchTerm.toLowerCase();
    return tokenList.filter(token => 
      token.name.toLowerCase().includes(lowerSearchTerm) ||
      token.symbol.toLowerCase().includes(lowerSearchTerm)
    )
  }, [searchTerm, tokenList]);

  const displayedTokens = useMemo(() => {
    return filteredTokens.slice(0, displayedItemsCount);
  }, [filteredTokens, displayedItemsCount]);

  const loadMoreItems = useCallback(() => {
    setDisplayedItemsCount(prevCount => Math.min(prevCount + ITEMS_PER_PAGE, filteredTokens.length));
  }, [filteredTokens.length]);

  const itemCount = displayedTokens.length + (displayedTokens.length < filteredTokens.length ? 1 : 0);

  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    if (index === displayedTokens.length) {
      return (
        <div style={style} className="text-center py-2 text-sm text-gray-500 cursor-pointer hover:bg-gray-100" onClick={loadMoreItems}>
          Load more...
        </div>
      );
    }

    const token = displayedTokens[index];
    return (
      <CommandItem
        key={token.address}
        onSelect={() => {
          onSelect(token);
          setSearchTerm("");
        }}
        style={style}
      >
        <Avatar className="mr-2 h-5 w-5">
          <AvatarImage src={token.iconUrl} alt={token.name} />
          <AvatarFallback>{token.symbol.slice(0, 2)}</AvatarFallback>
        </Avatar>
        <span className="truncate">
          {token.name} ({token.symbol})
        </span>
      </CommandItem>
    );
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" className="w-[200px] justify-between">
          {selectedToken ? (
            <>
              <Avatar className="mr-2 h-5 w-5">
                <AvatarImage src={selectedToken.iconUrl} alt={selectedToken.symbol} />
                <AvatarFallback>{selectedToken.symbol.slice(0, 2)}</AvatarFallback>
              </Avatar>
              {selectedToken.symbol}
            </>
          ) : (
            "Select token"
          )}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput 
            placeholder="Search token..." 
            value={searchTerm}
            onValueChange={(value) => {
              setSearchTerm(value);
              setDisplayedItemsCount(ITEMS_PER_PAGE);
            }}
          />
          <CommandList>
            <CommandEmpty>No token found.</CommandEmpty>
            <CommandGroup>
              <AutoSizer disableHeight>
                {({ width }) => (
                  <List
                    height={300}
                    itemCount={itemCount}
                    itemSize={ITEM_HEIGHT}
                    width={width}
                    overscanCount={5}
                  >
                    {Row}
                  </List>
                )}
              </AutoSizer>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default TokenSelector;