import AppSidebar from "@/components/layouts/app-sidebar";
import Header from "@/components/layouts/header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

const DashboardLayout = ({ children, }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="relative min-h-screen flex flex-col">
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default DashboardLayout;