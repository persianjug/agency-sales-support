"use client";

import { Table } from "@/components/ui/table";
import { Deal } from "./types";
import { DealsTableHeader } from "./deals-table-header";
import { DealsTableBody } from "./deals-table-body";

/**
 * 営業案件テーブルのProps定義
 */
type DealsTableProps = {
  // 表示する案件リスト
  deals: Deal[];
}

/**
 * 最新の営業案件情報をテーブル形式で一覧表示するコンポーネント。
 *
 * @param props Propsオブジェクト
 * @param props.deals 案件データの配列
 * @returns 営業案件テーブルUI
 */
const DealsTable = ({ deals }: DealsTableProps) => {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl">
      <div className="p-4 border-b border-zinc-800">
        <h2 className="text-base font-semibold text-zinc-200">最新の営業案件情報</h2>
      </div>
      <Table>
        <DealsTableHeader />
        <DealsTableBody deals={deals} />
      </Table>
    </div>
  );
};

export default DealsTable;