"use client";

import { Column, RowData } from "@tanstack/react-table";
import { ChevronsUpDown, ChevronUp, ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DataTableFeatures } from "./data-table-features";

/**
 * ソート機能付きカラムヘッダー Props
 * @template TData テーブルデータの型
 * @template TValue カラムの値の型
 */
type DataTableColumnHeaderProps<TData extends RowData, TValue> = {
  /** TanStack Table の Column オブジェクト */
  column: Column<DataTableFeatures, TData, TValue>;
  /** ヘッダーに表示するラベルテキスト */
  title: string;
}

/**
 * ソート状態に応じたアイコンを返却するヘルパー関数
 */
const renderSortIcon = (isSorted: false | "asc" | "desc") => {
  if (isSorted === "desc") {
    return <ChevronDown className="ml-2 size-5" strokeWidth={3} />;
  }
  if (isSorted === "asc") {
    return <ChevronUp className="ml-2 size-5" strokeWidth={3} />;
  }
  // return <ChevronsUpDown className="ml-2  opacity-50" />;
  return <ChevronsUpDown className="ml-2 size-5 opacity-50" strokeWidth={3} />;
}

/**
 * ソート機能付きのカラムヘッダー共通コンポーネント
 * @param props - {@link DataTableColumnHeaderProps}
 * @returns JSX.Element - ソート切り替えボタンまたは通常のテキストUI
 */
export const DataTableColumnHeader = <TData extends RowData, TValue>({
  column,
  title,
}: DataTableColumnHeaderProps<TData, TValue>) => {
  if (!column.getCanSort()) {
    return <div className="text-sm font-medium">{title}</div>
  }

  // 現在のソート状態を取得
  const isSorted = column.getIsSorted()

  return (
    <Button
      variant="ghost"
      size="sm"
      className="px-2 w-full justify-between text-slate-50 hover:bg-slate-700 hover:text-white data-[state=open]:bg-slate-700"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      <span>{title}</span>
      {renderSortIcon(isSorted)}
    </Button>
  );
}

export default DataTableColumnHeader;