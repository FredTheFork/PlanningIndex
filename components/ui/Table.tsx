'use client';

import React, { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

export interface TableColumn<T> {
  key: keyof T | string;
  header: string;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'right' | 'center';
}

interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  rowKey?: (row: T, index: number) => string;
  onRowClick?: (row: T) => void;
  zebra?: boolean;
  loading?: boolean;
  loadingRows?: number;
  emptyState?: React.ReactNode;
  className?: string;
}

type SortState = { column: string | null; direction: 'asc' | 'desc' | null };

export function Table<T extends Record<string, unknown>>({
  columns,
  data,
  rowKey,
  onRowClick,
  zebra = false,
  loading = false,
  loadingRows = 5,
  emptyState,
  className = '',
}: TableProps<T>) {
  const [sort, setSort] = useState<SortState>({ column: null, direction: null });
  const [internalData, setInternalData] = useState<T[]>(data);

  useEffect(() => {
    setInternalData(data);
  }, [data]);

  const handleSort = (col: TableColumn<T>) => {
    if (!col.sortable) return;
    const key = String(col.key);
    let newDirection: 'asc' | 'desc' | null = 'asc';
    if (sort.column === key) {
      if (sort.direction === 'asc') newDirection = 'desc';
      else if (sort.direction === 'desc') newDirection = null;
    }
    setSort({ column: newDirection ? key : null, direction: newDirection });

    if (!newDirection) {
      setInternalData(data);
      return;
    }
    const sorted = [...data].sort((a, b) => {
      const aVal = a[key as keyof T];
      const bVal = b[key as keyof T];
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return newDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }
      const aStr = String(aVal);
      const bStr = String(bVal);
      return newDirection === 'asc' ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr);
    });
    setInternalData(sorted);
  };

  const alignClass = (align?: string) => {
    if (align === 'right') return 'text-right';
    if (align === 'center') return 'text-center';
    return 'text-left';
  };

  if (loading) {
    return (
      <div className={`overflow-x-auto rounded-xl border border-primary-200 ${className}`}>
        <table className="w-full">
          <thead>
            <tr className="border-b border-primary-200 bg-primary-50">
              {columns.map((col) => (
                <th key={String(col.key)} className={`px-4 py-3 ${alignClass(col.align)}`} style={col.width ? { width: col.width } : undefined}>
                  <div className="h-4 bg-primary-200 rounded w-24 animate-pulse" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...Array(loadingRows)].map((_, i) => (
              <tr key={i} className="border-b border-primary-100 last:border-b-0">
                {columns.map((col) => (
                  <td key={String(col.key)} className={`px-4 py-3.5 ${alignClass(col.align)}`}>
                    <div className="h-4 bg-primary-100 rounded w-full animate-pulse" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (data.length === 0 && emptyState) {
    return <div className={`rounded-xl border border-primary-200 ${className}`}>{emptyState}</div>;
  }

  return (
    <div className={`overflow-x-auto rounded-xl border border-primary-200 ${className}`}>
      <table className="w-full">
        <thead>
          <tr className="border-b border-primary-200 bg-primary-50">
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className={`px-4 py-3 font-sans font-semibold text-primary-600 text-xs uppercase tracking-wide ${alignClass(col.align)} ${col.sortable ? 'cursor-pointer select-none hover:text-primary-900' : ''}`}
                style={col.width ? { width: col.width } : undefined}
                onClick={() => col.sortable && handleSort(col)}
              >
                <span className={`inline-flex items-center gap-1 ${col.align === 'right' ? 'flex-row-reverse' : ''}`}>
                  {col.header}
                  {col.sortable && sort.column === String(col.key) && (
                    sort.direction === 'asc' ? <ChevronUp size={14} /> : sort.direction === 'desc' ? <ChevronDown size={14} /> : null
                  )}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {internalData.map((row, index) => (
            <tr
              key={rowKey ? rowKey(row, index) : index}
              onClick={() => onRowClick?.(row)}
              className={`border-b border-primary-100 last:border-b-0 transition-colors ${zebra && index % 2 === 1 ? 'bg-primary-50/50' : 'bg-white'} ${onRowClick ? 'cursor-pointer hover:bg-accent-50' : 'hover:bg-primary-50'}`}
            >
              {columns.map((col) => (
                <td key={String(col.key)} className={`px-4 py-3.5 font-sans text-sm text-primary-700 ${alignClass(col.align)}`}>
                  {col.render ? col.render(row) : String(row[col.key as keyof T] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
