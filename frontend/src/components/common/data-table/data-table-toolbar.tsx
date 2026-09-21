"use client";

import { RowData, Table } from "@tanstack/react-table";
import { DataTableFeatures } from "./data-table-features";
import DataTableSearchInput from "./data-table-search-input";
import DataTableColumnToggle from "./data-table-column-toggle";

/**
 * テーブルツールバー Props
 * @template TData テーブルデータの型
 */
type DataTableToolbarProps<TData extends RowData> = {
  /** TanStack Table の table インスタンス */
  table: Table<DataTableFeatures, TData>;
}

/**
 * テーブル上部のツールバーコンポーネント（検索入力・表示項目選択）
 * @param props - {@link DataTableToolbarProps}
 * @returns JSX.Element - 検索インプットおよび表示カラム制御ドロップダウンUI
 */
export const DataTableToolbar = <TData extends RowData>({
  table,
}: DataTableToolbarProps<TData>) => {
  return (
    <div className="flex items-center justify-between py-4 gap-2 bg-background">
      <DataTableSearchInput table={table} />
      <DataTableColumnToggle table={table} />
    </div>
  );
}

export default DataTableToolbar;