import React from 'react';
import { flexRender, getCoreRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';

const EmptyHandler = ({ value }) => {
  if (!value) return <span>--</span>;
  return <span>{value}</span>;
};

const TierFormatter = ({ value }) => {
  if (!value) return <span>--</span>;
  if (value < 2) {
    return <span>S</span>;
  } else if (value < 3) {
    return <span>A+</span>;
  }

  switch (value) {
    case 3:
      return <span>A</span>;
    case 4:
      return <span>A-</span>;
    case 5:
      return <span>B</span>;
    case 6:
      return <span>C</span>;
    case 7:
      return <span>D</span>;
    default:
      return <span>F</span>;
  }
};

const ReviewsTable = ({ rows, defaultSorting }) => {
  const [sorting, setSorting] = React.useState(defaultSorting);

  const columns = React.useMemo(
    () => [
      {
        accessorKey: 'title',
        header: 'Name',
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'tier',
        header: 'Tier',
        cell: (info) => <TierFormatter value={info.getValue()} />,
      },
      {
        accessorKey: 'review',
        header: 'Review',
        cell: (info) => <EmptyHandler value={info.getValue()} />,
      },
      {
        accessorKey: 'year',
        header: 'Watched',
        cell: (info) => info.getValue(),
      },
    ],
    []
  );

  const table = useReactTable({
    data: rows,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div>
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} colSpan={header.colSpan}>
                  {header.isPlaceholder ? null : (
                    <button type="button" className="inline-flex" onClick={header.column.getToggleSortingHandler()}>
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      <span>
                        {header.column.getIsSorted() === 'asc' ? ' ↑' : ''}
                        {header.column.getIsSorted() === 'desc' ? ' ↓' : ''}
                      </span>
                    </button>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReviewsTable;
