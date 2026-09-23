"use client";

import { useRouter } from "next/navigation";
import { accountListColumns } from "./account-list-columns";
import { AccountListGetResponse, AccountListItem } from "@/types/api/account-type";
import DataTable from "@/components/common/data-table/data-table";
import { SidebarTrigger } from "../ui/sidebar";

/**
 * AccountListTable コンポーネント Props
 */
type AccountListTableProps = {
  /** 表示対象のアカウントデータ一覧 */
  // data: AccountListItem[];
  data: AccountListGetResponse;
}

/**
 * アカウント一覧テーブルコンポーネント
 * @param props - {@link AccountListTableProps}
 * @returns JSX.Element - アカウント一覧のデータテーブルUI
 */
export const AccountListTable = ({ data }: AccountListTableProps) => {
  const router = useRouter();

  /**
   * 行クリック時の遷移ハンドラー
   * @param row クリックされた行のアカウントデータ
   */
  const handleRowClick = (row: AccountListItem) => {
    router.push(`/accounts/${row.id}`);
  }

  return (

    <div className="p-6 space-y-6">
      {/* 1. ヘッダー帯は作らず、直接タイトルとユーザー操作を配置 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold tracking-tight">アカウント管理</h1>
          <span className="text-sm text-muted-foreground">{`全${data.totalCount}人`}</span>
        </div>
      </div>

      <DataTable
        columns={accountListColumns}
        data={data.items}
        onRowClick={handleRowClick}
      />
    </div>
  )
}

export default AccountListTable;