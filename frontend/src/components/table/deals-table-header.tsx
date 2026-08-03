"use client";

import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

/**
 * 営業案件テーブルのヘッダー要素を描画するコンポーネント。
 *
 * @returns テーブルのヘッダー行UI
 */
export const DealsTableHeader = () => {
  return (
    <TableHeader className="bg-zinc-950/50">
      <TableRow className="border-zinc-800 hover:bg-transparent">
        <TableHead className="w-[100px] text-zinc-400">案件ID</TableHead>
        <TableHead className="text-zinc-400">顧客名</TableHead>
        <TableHead className="text-zinc-400">ステータス</TableHead>
        <TableHead className="text-zinc-400">担当者</TableHead>
        <TableHead className="text-right text-zinc-400">予定金額</TableHead>
      </TableRow>
    </TableHeader>
  );
};