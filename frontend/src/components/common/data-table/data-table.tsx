"use client";

import { useState } from "react"
import {
  PaginationState,
  useTable,
  type ColumnDef,
  type ColumnFiltersState,
  type ColumnVisibilityState,
  type RowData,
  type SortingState,
} from "@tanstack/react-table";

import { features, type DataTableFeatures } from "./data-table-features";
import { DataTableToolbar } from "./data-table-toolbar";
import { DataTablePagination } from "./data-table-pagination";
import { DataTableContent } from "./data-table-content";

/**
 * 汎用 DataTable コンポーネント Props
 * @template TData レコードデータの型定義
 */
type DataTableProps<TData extends RowData> = {
  /** カラム定義配列 */
  columns: ColumnDef<DataTableFeatures, TData>[];
  /** 表示するデータの配列 */
  data: TData[];
  /** 検索（グローバルフィルター）の対象にするカラムのID */
  // searchKey?: string;
  /** 行がクリックされた際のコールバック関数 */
  onRowClick?: (row: TData) => void;
}

/**
 * TanStack Table v9 と shadcn/ui をベースにした汎用データテーブル共通コンポーネント
 * @param props - {@link DataTableProps}
 * @returns JSX.Element - ツールバー、テーブル本体、ページネーションを含む統合テーブルUI
 */
export const DataTable = <TData extends RowData>({
  columns,
  data,
  // searchKey,
  onRowClick,
}: DataTableProps<TData>) => {
  // ソート対象カラムの状態を管理
  const [sorting, setSorting] = useState<SortingState>([]);

  // 検索フィールドでフィルターしたカラムの状態を管理
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  // 表示項目のカラムの状態を管理
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibilityState>({});

  // ページネーション（現在ページ、1ページの表示可能行数）を状態を管理
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  // グローバルフィルター（横断検索）の状態
  const [globalFilter, setGlobalFilter] = useState<string>("");

  const table = useTable({
    features,
    data,
    columns,
    globalFilterFn: "includesString",
    // defaultColumn: {
    //   size: 150,
    // },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      pagination,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    onGlobalFilterChange: setGlobalFilter,
  });

  return (
    <div className="w-full space-y-4">
      {/* 1. ツールバー（検索入力・表示項目選択） */}
      <DataTableToolbar table={table} />

      {/* 2. テーブル領域本体 */}
      <DataTableContent
        table={table}
        columnCount={columns.length}
        onRowClick={onRowClick}
      />

      {/* 3. ページネーション */}
      <DataTablePagination
        pageSize={pagination.pageSize}
        pageIndex={pagination.pageIndex}
        pageCount={table.getPageCount()}
        canPreviousPage={table.getCanPreviousPage()}
        canNextPage={table.getCanNextPage()}
        onPageSizeChange={(size) => table.setPageSize(size)}
        onPreviousPage={() => table.previousPage()}
        onNextPage={() => table.nextPage()}
      />
    </div>
  );
}

export default DataTable;