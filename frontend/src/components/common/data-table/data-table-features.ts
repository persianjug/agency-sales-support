import {
  columnFilteringFeature,
  columnVisibilityFeature,
  globalFilteringFeature,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFn_includesString,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_text,
  tableFeatures,
  columnSizingFeature,
} from "@tanstack/react-table";

/**
 * TanStack Table v9 の機能（ソート・フィルター・ページネーション等）を一括宣言
 */
export const features = tableFeatures({
  columnFilteringFeature,
  columnVisibilityFeature,
  globalFilteringFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  columnSizingFeature,
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortedRowModel: createSortedRowModel(),
  sortFns: { alphanumeric: sortFn_alphanumeric, text: sortFn_text },
  filterFns: { includesString: filterFn_includesString },
});

/**
 * 各コンポーネントや ColumnDef に渡す機能定義型
 */
export type DataTableFeatures = typeof features;