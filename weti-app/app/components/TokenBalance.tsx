import { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  SortingState,
  getSortedRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { Input } from "./ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Result } from '~/types/moralis';
import { parseBalance } from '~/lib';
import { Link, useNavigate } from '@remix-run/react';
import { useChainId } from 'wagmi';

const columns: ColumnDef<Result>[] = [
  {
    accessorKey: "name",
    header: "Token",
    cell: ({ row }) => {
      const result = row.original;
      return (
        <div className="flex items-center space-x-2">
          <Avatar>
            <AvatarImage src={result.logo} alt={result.name} />
            <AvatarFallback>{result.symbol}</AvatarFallback>
          </Avatar>
          <span>{result.name}</span>
        </div>
      );
    },
    filterFn: "includesString"
  },
  {
    accessorKey: "balance",
    header: "Balance",
    cell: ({ row }) => {
      const result = row.original;
      const parsedBalance = parseBalance(result.balance, result.decimals);
      return <span>{parsedBalance}</span>;
    },
    sortingFn: (a, b) => {
      const balanceA = parseFloat(`${parseBalance(a.original.balance, a.original.decimals)}`);
      const balanceB = parseFloat(`${parseBalance(b.original.balance, b.original.decimals)}`);
      return balanceB - balanceA;
    },
  },
  {
    accessorKey: "symbol",
    header: "Symbol",
  },
];

const TokenBalanceTable = ({ data }: { data: Result[] }) => {
  const navigate = useNavigate();
  const chain = useChainId();
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'balance', desc: true }
  ]);
  const [globalFilter, setGlobalFilter] = useState('');

  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => {
      const balanceA = parseFloat(`${parseBalance(a.balance, a.decimals)}`);
      const balanceB = parseFloat(`${parseBalance(b.balance, b.decimals)}`);
      return balanceB - balanceA;
    });
  }, [data]);

  const table = useReactTable({
    data: sortedData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      globalFilter,
    },
  });

  return (
    <div className="p-6">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter tokens..."
          value={globalFilter}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : (
                      <div
                        {...{
                          className: header.column.getCanSort() ? 'cursor-pointer select-none' : '',
                          onClick: header.column.getToggleSortingHandler(),
                        }}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: ' 🔼',
                          desc: ' 🔽',
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      <Link
                        to={`/token/${chain}/${row.original.token_address}`}
                        prefetch="intent"
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </Link>
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TokenBalanceTable;