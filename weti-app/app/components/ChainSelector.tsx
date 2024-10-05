import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "~/lib/utils"
import { Button } from "~/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover"
import { base } from "viem/chains"

const chains = [
  {
    value: 1,
    label: "Mainnet",
  },
  {
    value: base.id,
    label: "Base",
  }
]

interface ChainSelectorProps {
  value: number | null;
  onChange: (value: number | null) => void;
}

export function ChainSelector({ value, onChange }: ChainSelectorProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value !== null
            ? chains.find((chain) => chain.value === value)?.label
            : "Select chain..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search chain..." />
          <CommandList>
            <CommandEmpty>No chain found.</CommandEmpty>
            <CommandGroup>
              {chains.map((chain) => (
                <CommandItem
                  key={chain.value}
                  value={chain.value.toString()}
                  onSelect={(currentValue) => {
                    onChange(parseInt(currentValue))
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === chain.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {chain.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export default ChainSelector;