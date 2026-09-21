"use client";

import { RowData, Table } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { DataTableFeatures } from "./data-table-features";

/**
 * 検索入力 Props
 * @template TData テーブルデータの型
 */
type DataTableSearchInputProps<TData extends RowData> = {
  /** TanStack Table の table インスタンス */
  table: Table<DataTableFeatures, TData>;
};

/**
 * 検索入力のコンポーネント
 * @param props - {@link DataTableSearchInputProps}
 * @returns JSX.Element - 検索入力UI
 */
export const DataTableSearchInput = <TData extends RowData>({
  table,
}: DataTableSearchInputProps<TData>) => {
  const globalFilterValue =
    (table.options.state?.globalFilter as string) ?? "";

  return (
    <Input
      placeholder="検索..."
      value={globalFilterValue}
      onChange={(event) => table.setGlobalFilter(event.target.value)}
      className="max-w-sm"
    />
  );
};

export default DataTableSearchInput;