"use client";

import { FlexRender, Table as TableType, RowData } from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableRow, } from "@/components/ui/table";
import { type DataTableFeatures } from "./data-table-features";
import DataTableHeader from "./data-table-header";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

/**
 * DataTableContent Props
 * @template TData レコードデータの型定義
 */
type DataTableContentProps<TData extends RowData> = {
  /** TanStack Table の table インスタンス */
  table: TableType<DataTableFeatures, TData>;
  /** 表示中のカラム数（データなし表示の colSpan 用） */
  columnCount: number;
  /** 行がクリックされた際のコールバック関数 */
  onRowClick?: (row: TData) => void;
  /** ScrollArea の高さクラス（省略時は h-[450px]） */
  heightClass?: string;
  /** ラッパー用（ScrollArea）の追加 className */
  className?: string;
}

/**
 * テーブル本体の表示用コンポーネント
 * @param props - {@link DataTableContentProps}
 * @returns JSX.Element - テーブルヘッダーおよびデータ行UI
 */
export const DataTableContent = <TData extends RowData>({
  table,
  columnCount,
  onRowClick,
  heightClass = "h-[450px]",
  className,
}: DataTableContentProps<TData>) => {
  const rows = table.getRowModel().rows

  /**
     * TableBody の中身を生成するヘルパー関数
     */
  const renderTableBody = () => {
    // 1. データなし時の描画
    if (!rows?.length) {
      return (
        <TableRow className="hover:bg-transparent border-b-0">
          <TableCell colSpan={columnCount} className="h-24 text-center text-muted-foreground">
            データが存在しません。
          </TableCell>
        </TableRow>
      );
    }

    // 2. データあり時の描画
    return rows.map((row) => (
      <TableRow
        key={row.id}
        // モダン＆高可視性スタイル（ネイビーヘッダー＋ほんのりブルーホバー）
        // className="border-b border-slate-200 transition-colors hover:bg-slate-100/80"
        className="border-b border-border/60 transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
      >
        {row.getVisibleCells().map((cell) => (
          <TableCell key={cell.id}
            // className="border-x-0"
            className="py-3 px-4"
            style={
              {
                width: `${cell.column.getSize()}px`,
                minWidth: `${cell.column.getSize()}px`,
                maxWidth: `${cell.column.getSize()}px`,
              }
            }
          >
            <FlexRender cell={cell} />
          </TableCell>
        ))}
      </TableRow>
    ));
  }

  return (
    <ScrollArea className={cn(
      // "rounded-md border border-slate-300",
      "rounded-lg border border-border bg-card shadow-sm",
      heightClass,
      className
    )}>
      <Table noWrapper className="w-full table-fixed" >
        <DataTableHeader table={table} />
        <TableBody>{renderTableBody()}</TableBody>
      </Table>
    </ScrollArea>
  );
}