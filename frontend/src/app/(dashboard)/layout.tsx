import Header from "@/components/layouts/header"

const DashboardLayout = ({ children, }: { children: React.ReactNode }) => {
  return (
    <div className="relative min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 p-6">{children}</main>
    </div>
  )
}

export default DashboardLayout;