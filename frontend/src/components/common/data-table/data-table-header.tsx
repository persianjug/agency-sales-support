"use client";

import { FlexRender, Table as TableType, RowData } from "@tanstack/react-table";
import { TableHeader, TableRow, TableHead, } from "@/components/ui/table";
import { type DataTableFeatures } from "./data-table-features";

/**
 * DataTableHeader Props
 * @template TData レコードデータの型定義
 */
type DataTableHeaderProps<TData extends RowData> = {
  /** TanStack Table の table インスタンス */
  table: TableType<DataTableFeatures, TData>
}

/**
 * テーブルヘッダー共通コンポーネント
 * @param props - {@link DataTableHeaderProps}
 * @returns JSX.Element - テーブルのヘッダー行UI
 */
export const DataTableHeader = <TData extends RowData>({
  table,
}: DataTableHeaderProps<TData>) => {
  return (
    <TableHeader className="bg-muted/80 sticky top-0 z-10 backdrop-blur-sm">
      {table.getHeaderGroups().map((headerGroup) => (
        <TableRow
          key={headerGroup.id}
          className="hover:bg-transparent border-b border-border"
        >
          {headerGroup.headers.map((header) => (
            <TableHead
              key={header.id}
              className="text-muted-foreground font-semibold text-xs uppercase tracking-wider py-3"
              style={
                {
                  width: `${header.column.getSize()}px`,
                  minWidth: `${header.column.getSize()}px`,
                  maxWidth: `${header.column.getSize()}px`,
                }
              }
            >
              {header.isPlaceholder ? null : (
                <FlexRender header={header} />
              )}
            </TableHead>
          ))}
        </TableRow>
      ))}
    </TableHeader>
  );
}

export default DataTableHeader;