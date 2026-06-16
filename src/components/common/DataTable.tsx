import type { ReactNode } from 'react';

export interface Column<T> {
  key: string;
  label: string;
  render?: (row: T) => ReactNode;
  headerClassName?: string;
  cellClassName?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T) => string;
}

export function DataTable<T>({ columns, data, keyExtractor }: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-white border-b border-gray-100 text-xs text-gray-400 uppercase tracking-wider">
            {columns.map(col => (
              <th key={col.key} className={`p-4 font-bold ${col.headerClassName || ''}`}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="text-sm">
          {data.map((row, i) => (
            <tr key={keyExtractor(row)} className={`border-b border-gray-50 hover:bg-blue-50/30 transition-colors ${i === data.length - 1 ? 'border-b-0' : ''}`}>
              {columns.map(col => (
                <td key={col.key} className={`p-4 ${col.cellClassName || ''}`}>
                  {col.render ? col.render(row) : (row as any)[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
