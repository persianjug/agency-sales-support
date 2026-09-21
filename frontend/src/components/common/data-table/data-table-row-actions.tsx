// components/common/data-table/data-table-row-actions.tsx
"use client";

import { type ReactNode } from "react";
import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/**
 * DataTableRowActions コンポーネントの Props 型定義
 *
 */
export type DataTableRowActionsProps = {
  /** ドロップダウン上部に表示するラベル（省略時は「操作」） */
  label?: string;
  /** ドロップダウンの配置位置（省略時は "end"） */
  align?: "start" | "center" | "end";
  /** DropdownMenuItem 群を渡す children */
  children: ReactNode;
};

/**
 * データテーブル行用の汎用操作ドロップダウンメニュー
 */
export const DataTableRowActions = ({
  label = "操作",
  align = "end",
  children,
}: DataTableRowActionsProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="ghost" className="h-8 w-8 p-0" />}>
        <span className="sr-only">メニューを開く</span>
        <MoreHorizontal className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className="min-w-[140px]">
        <DropdownMenuGroup>
          {label && (
            <>
              <DropdownMenuLabel>{label}</DropdownMenuLabel>
              <DropdownMenuSeparator />
            </>
          )}
          {children}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DataTableRowActions;