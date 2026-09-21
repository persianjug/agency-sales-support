import AccountListTable from "@/components/accounts/account-list-table";
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

  return <AccountListTable data={result.items} />;
}

export default AccountListPage;
