import AppSidebar from "@/components/app-sidebar/app-sidebar";
import CommandMenu from "@/components/common/command-palette/command-palette-menu";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

const DashboardLayout = ({ children, }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      {/* サイドバー */}
      <AppSidebar />

      {/* メインコンテンツエリア */}
      <SidebarInset>
        {/* ダッシュボード全体共通のヘッダーバー */}
        <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center justify-end gap-2 px-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          {/* 右上に固定配置されるコマンドパレット */}
          <div className="flex items-center gap-4">
            <CommandMenu />
          </div>
        </header>

        {/* 各ページのメインコンテンツ */}
        <div className="relative min-h-[calc(100vh-4rem)] flex flex-col">
          {/* <main className="flex-1 p-6"> */}
          <main className="flex-1 py-6">
            {children}
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default DashboardLayout;