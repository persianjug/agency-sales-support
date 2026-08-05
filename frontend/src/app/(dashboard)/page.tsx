import DashboardHeader from "@/components/command/DashboardHeader";
import DealsTable from "@/components/table/deals-table"
import { getDeals } from "@/mocks/deals";

/**
 * ダッシュボードのメインページ（Server Component）
 * サーバー側で営業案件データを取得し、ヘッダーとテーブルを出力します。
 *
 * @returns ダッシュボード全体のメインUI
 */
const Home = async () => {
  const dealsData = await getDeals();

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <DashboardHeader />
        <DealsTable deals={dealsData} />
      </div>
    </main>
  )
}

export default Home;