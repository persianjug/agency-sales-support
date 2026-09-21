"use client";

import { useRouter } from "next/navigation";
import { accountListColumns } from "./account-list-columns";
import { AccountListItem } from "@/types/api/account-type";
import DataTable from "@/components/common/data-table/data-table";

/**
 * AccountListTable コンポーネント Props
 */
type AccountListTableProps = {
  /** 表示対象のアカウントデータ一覧 */
  data: AccountListItem[];
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
    <DataTable
      columns={accountListColumns}
      data={data}
      onRowClick={handleRowClick}
    />
  )
}

export default AccountListTable;