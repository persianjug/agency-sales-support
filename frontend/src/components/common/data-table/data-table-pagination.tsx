"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type DataTablePaginationProps = {
  pageSize: number;
  pageIndex: number;
  pageCount: number;
  canPreviousPage: boolean;
  canNextPage: boolean;
  onPageSizeChange: (value: number) => void;
  onPreviousPage: () => void;
  onNextPage: () => void;
};

export const DataTablePagination = ({
  pageSize,
  pageIndex,
  pageCount,
  canPreviousPage,
  canNextPage,
  onPageSizeChange,
  onPreviousPage,
  onNextPage,
}: DataTablePaginationProps) => {
  return (
    <div className="flex items-center justify-between gap-4 py-4">
      {/* 左側: 表示件数セレクト & ページ情報 */}
      <div className="flex items-center gap-6 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <span>表示件数</span>
          <Select
            value={`${pageSize}`}
            onValueChange={(value) => onPageSizeChange(Number(value))}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="start">
              <SelectGroup>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div>
          {pageCount > 0 ? (
            <span>
              {pageIndex + 1} / {pageCount} ページ
            </span>
          ) : (
            <span>0 ページ</span>
          )}
        </div>
      </div>

      {/* 右側: ページ送りボタン（公式サンプルの構造そのまま） */}
      <Pagination className="mx-0 w-auto">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              text="前へ"
              onClick={onPreviousPage}
              className={
                !canPreviousPage
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer"
              }
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              text="次へ"
              onClick={onNextPage}
              className={
                !canNextPage
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer"
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default DataTablePagination;