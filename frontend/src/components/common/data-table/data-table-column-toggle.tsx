"use client";

import { RowData, Table } from "@tanstack/react-table";
import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTableFeatures } from "./data-table-features";

/**
 * 表示項目選択 Props
 * @template TData テーブルデータの型
 */
type DataTableColumnToggleProps<TData extends RowData> = {
  table: Table<DataTableFeatures, TData>;
};

/**
 * 表示項目選択コンポーネント
 * @param props - {@link DataTableColumnToggleProps}
 * @returns JSX.Element -表示カラム制御ドロップダウンUI
 */
export const DataTableColumnToggle = <TData extends RowData>({
  table,
}: DataTableColumnToggleProps<TData>) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" className="ml-auto" />}>
        表示項目 <ChevronDown className="ml-2 h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[160px]">
        {table
          .getAllColumns()
          .filter((column) => column.getCanHide())
          .map((column) => {
            const label = (column.columnDef.meta as { label?: string })?.label ?? column.id;
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="whitespace-nowrap"
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {label}
              </DropdownMenuCheckboxItem>
            );
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DataTableColumnToggle;