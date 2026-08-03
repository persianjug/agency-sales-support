"use client";

import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Deal } from "./types";

/**
 * 営業案件テーブルのボディ部分のProps定義
 */
type DealsTableBodyProps = {
  // 描画する案件データの配列
  deals: Deal[];
};

/**
 * 営業案件リストをループしてテーブルの各行を描画するコンポーネント。
 *
 * @param props Propsオブジェクト
 * @param props.deals 案件データの配列
 * @returns テーブルのボディ行UI
 */
export const DealsTableBody = ({ deals }: DealsTableBodyProps) => {
  return (
    <TableBody>
      {deals.map((deal) => (
        <TableRow
          key={deal.id}
          className="border-zinc-800 hover:bg-zinc-800/50 cursor-pointer transition-colors"
        >
          <TableCell className="font-mono text-xs text-zinc-500">{deal.id}</TableCell>
          <TableCell className="font-medium text-zinc-200">{deal.client}</TableCell>
          <TableCell>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-950 text-blue-400 border border-blue-800/50">
              {deal.status}
            </span>
          </TableCell>
          <TableCell className="text-zinc-400 text-sm">{deal.owner}</TableCell>
          <TableCell className="text-right font-mono font-medium text-zinc-200">
            {deal.amount}
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
};
