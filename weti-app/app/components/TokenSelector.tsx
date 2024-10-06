import { ChevronDown } from "lucide-react";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "./ui/command";
import { FixedSizeList as List } from "react-window";
import { TokenList, TokenSelectResult } from "~/types";
import { useState, useEffect } from "react";

const ITEM_HEIGHT = 40; // Adjust based on your item height

type TokenSelectorProps =  {
  tokenList: TokenList[],
  selectedToken: TokenSelectResult,
  onSelect: (token: TokenList) => void
}

export const TokenSelector = ({ tokenList, selectedToken, onSelect }: TokenSelectorProps) => {
  const [filteredTokens, setFilteredTokens] = useState<TokenList[]>(tokenList);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (searchTerm) {
      const filtered = tokenList.filter(token => 
        token.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        token.symbol.toLowerCase().includes(searchTerm.toLowerCase())
      );
  
      // Improved sorting logic
      filtered.sort((a, b) => {
        const aNameIndex = a.name.toLowerCase().indexOf(searchTerm.toLowerCase());
        const bNameIndex = b.name.toLowerCase().indexOf(searchTerm.toLowerCase());
        const aSymbolIndex = a.symbol.toLowerCase().indexOf(searchTerm.toLowerCase());
        const bSymbolIndex = b.symbol.toLowerCase().indexOf(searchTerm.toLowerCase());
  
        // Prioritize exact symbol matches first
        if (a.symbol.toLowerCase() === searchTerm.toLowerCase()) return -1;
        if (b.symbol.toLowerCase() === searchTerm.toLowerCase()) return 1;
  
        // Prioritize exact name matches second
        if (a.name.toLowerCase() === searchTerm.toLowerCase()) return -1;
        if (b.name.toLowerCase() === searchTerm.toLowerCase()) return 1;
  
        // If both names contain the search term, prioritize the one with the earlier match
        if (aNameIndex !== -1 && bNameIndex !== -1) return aNameIndex - bNameIndex;
        
        // If only one name contains the search term, prioritize it
        if (aNameIndex !== -1) return -1;
        if (bNameIndex !== -1) return 1;
  
        // If neither name contains the search term, prioritize based on symbol index
        if (aSymbolIndex !== -1 && bSymbolIndex !== -1) return aSymbolIndex - bSymbolIndex;
        if (aSymbolIndex !== -1) return -1;
        if (bSymbolIndex !== -1) return 1;
  
        // If no matches at all, keep original order
        return 0;
      });
  
      setFilteredTokens(filtered);
    } else {
      setFilteredTokens(tokenList);
    }
  }, [searchTerm, tokenList]);  

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" className="w-[200px] justify-between">
          {selectedToken?.symbol}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput 
            placeholder="Search token..." 
            /* @ts-ignore */
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
          <CommandList>
            <CommandEmpty>No token found.</CommandEmpty>
            <CommandGroup>
              <List
                height={300} // Adjust height as needed
                itemCount={filteredTokens.length}
                itemSize={ITEM_HEIGHT}
                width="100%"
              >
                {({ index, style }) => {
                  const token = filteredTokens[index];
                  return (
                    <div style={style} key={token.address}>
                      <CommandItem onSelect={() => onSelect(token)}>
                        <Avatar className="mr-2 h-5 w-5">
                          <AvatarImage src={token.iconUrl} alt={token.name} />
                          <AvatarFallback>{token.symbol.slice(0, 2)}</AvatarFallback>
                        </Avatar>
                        <span className="truncate w-40"> {/* Adjust width as needed */}
                          {token.name} ({token.symbol})
                        </span>
                      </CommandItem>
                    </div>
                  );
                }}
              </List>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default TokenSelector;