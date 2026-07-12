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
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder={searchPlaceholder}
            onChange={(e) => onSearch?.(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-4 py-2 text-sm text-gray-700 outline-none focus:border-black shadow-sm transition-all font-medium"
          />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors shadow-sm text-gray-700">
            <SlidersHorizontal size={16} />
            Filters
          </button>
          {actions}
        </div>
      </div>

      {/* Table Content */}
      <div className="flex flex-col">
        {/* Header */}
        <div className="px-6 py-2">
           <div 
             className="w-full grid gap-4 text-left items-center" 
             style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))` }}
           >
              {columns.map((col, i) => (
                 <div key={i} className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                   {col.header}
                 </div>
              ))}
           </div>
        </div>

        {/* Rows */}
        <div className="flex flex-col gap-3">
          {paginatedData.length === 0 ? (
             <div className="bg-white px-6 py-12 text-center text-gray-400 font-semibold rounded-2xl border border-gray-100 shadow-sm">
                No results found
             </div>
          ) : (
             paginatedData.map((item) => (
                <div key={item.id} className="bg-white px-6 py-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                   <div 
                     className="w-full grid gap-4 text-left items-center"
                     style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))` }}
                   >
                      {columns.map((col, i) => (
                         <div key={i} className="text-sm text-gray-700 font-semibold truncate">
                            {col.cell ? col.cell(item) : String(col.accessorKey ? item[col.accessorKey] : "")}
                         </div>
                      ))}
                   </div>
                </div>
             ))
          )}
        </div>

        {/* Pagination Footer */}
        <div className="flex items-center justify-between mt-6 px-2">
          <div className="text-xs font-semibold text-gray-400">
            Showing <span className="text-black">{startIndex + 1}</span> to{" "}
            <span className="text-black">
              {Math.min(startIndex + itemsPerPage, data.length)}
            </span>{" "}
            of <span className="text-black">{data.length}</span> results
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm text-gray-600 transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <div className="text-xs font-bold text-gray-700 px-2">
              {currentPage} / {totalPages || 1}
            </div>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm text-gray-600 transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
