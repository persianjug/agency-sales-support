import AccountListAddButton from "@/components/account-list/account-list-add-button";
import AccountListTable from "@/components/account-list/account-list-table";
import PageContainer from "@/components/common/container/page-container";
import { getAccounts } from "@/mocks/accounts-mock";
import { AccountListGetResponse } from "@/types/api/account-type";

/**
 * アカウントページ（Server Component）
 * サーバー側でプロフィール情報を取得し、プロフィール画面を出力します。
 *
 * @returns プロフィール画面UI
 */
const AccountListPage = async () => {
  const result: AccountListGetResponse = await getAccounts();

  // エラーなら例外を投げて Next.js の機構（error.tsx）に委ねる
  if ('status' in result) {
    throw result;
  }

  return (
    <PageContainer
      title="アカウント一覧"
      badge={
        <span className="text-sm text-muted-foreground align-text-bottom">
          {`（全${result.totalCount}人）`}
        </span>
      }
      action={
        <AccountListAddButton />
      }
    >
      <AccountListTable data={result} />
    </PageContainer>
  );
}

export default AccountListPage;
