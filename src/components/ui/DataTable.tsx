"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Search, SlidersHorizontal } from "lucide-react";

interface Column<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchPlaceholder?: string;
  onSearch?: (value: string) => void;
  actions?: React.ReactNode;
}

export default function DataTable<T extends { id: string | number }>({
  data,
  columns,
  searchPlaceholder = "Search...",
  onSearch,
  actions,
}: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = data.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="flex flex-col gap-4">
      {/* Table Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-primary-primary-primary-muted" size={16} />
          <input
            type="text"
            placeholder={searchPlaceholder}
            onChange={(e) => onSearch?.(e.target.value)}
            className="w-full bg-surface-primary border border-border-default-default-default rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-primary-light focus:ring-1 focus:ring-primary-light transition-all"
          />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {actions}
          <button className="flex items-center gap-2 px-3 py-2 bg-surface-primary border border-border-default-default-default rounded-lg text-sm font-medium hover:bg-surface-primary-card-hover transition-colors">
            <SlidersHorizontal size={16} />
            Filters
          </button>
        </div>
      </div>

      {/* Table Content */}
      <div className="bg-surface-secondary border border-border-default-default-default rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-surface-primary/50 border-b border-border-default-default-default text-text-primary-primary-primary-secondary uppercase text-xs">
              <tr>
                {columns.map((col, i) => (
                  <th key={i} className="px-6 py-4 font-semibold tracking-wider">
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-12 text-center text-text-primary-primary-primary-muted">
                    No results found
                  </td>
                </tr>
              ) : (
                paginatedData.map((item) => (
                  <tr key={item.id} className="hover:bg-surface-primary/40 transition-colors">
                    {columns.map((col, i) => (
                      <td key={i} className="px-6 py-4 whitespace-nowrap">
                        {col.cell ? col.cell(item) : String(col.accessorKey ? item[col.accessorKey] : "")}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border-default-default-default bg-surface-primary/20">
          <div className="text-sm text-text-primary-primary-primary-muted">
            Showing <span className="font-medium text-text-primary-primary-primary">{startIndex + 1}</span> to{" "}
            <span className="font-medium text-text-primary-primary-primary">
              {Math.min(startIndex + itemsPerPage, data.length)}
            </span>{" "}
            of <span className="font-medium text-text-primary-primary-primary">{data.length}</span> results
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-md border border-border-default-default-default hover:bg-surface-primary-card-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <div className="text-sm font-medium px-2">
              {currentPage} / {totalPages || 1}
            </div>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="p-1.5 rounded-md border border-border-default-default-default hover:bg-surface-primary-card-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
