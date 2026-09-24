"use client";

import * as React from "react";
import {
  LayoutDashboard,
  Users,
  FileText,
  Building2,
  ShieldCheck,
} from "lucide-react";

import { Sidebar, SidebarContent, SidebarFooter, SidebarRail } from "@/components/ui/sidebar";
import { AppSidebarHeader } from "./app-sidebar-header";
import { AppSidebarCommandButton } from "./app-sidebar-command-button";
import { AppSidebarMain } from "./app-sidebar-main";
import { AppSidebarUser } from "./app-sidebar-user";

const AppSidebarItems = [
  { title: "ダッシュボード", url: "/dashboard", icon: LayoutDashboard },
  { title: "顧客管理", url: "/customers", icon: Users },
  { title: "契約・募集管理", url: "/policies", icon: FileText },
  { title: "代理店管理", url: "/agencies", icon: Building2 },
  { title: "アカウント管理", url: "/accounts", icon: ShieldCheck },
];

const mockUser = {
  name: "山田 太郎",
  role: "システム管理者",
  email: "yamada@example.com",
  avatar: "/avatars/user.png",
};

export const AppSidebar = ({
  onOpenCommand,
  ...props
}: React.ComponentProps<typeof Sidebar> & { onOpenCommand?: () => void }) => {
  return (
    <Sidebar collapsible="icon" {...props}>
      <AppSidebarHeader />

      <SidebarContent className="gap-2 px-2">
        <AppSidebarCommandButton onOpenCommand={onOpenCommand} />
        <AppSidebarMain items={AppSidebarItems} />

        {/* メニューのすぐ下に隙間なく配置 */}
        {/* <div className="mt-2 pt-2 border-t border-border/40">
          <AppSidebarUser user={mockUser}/>
        </div> */}
        <SidebarFooter className="p-2 group-data-[collapsible=icon]:p-0">
          <AppSidebarUser user={mockUser} />
        </SidebarFooter>

      </SidebarContent>


      <SidebarRail />
    </Sidebar>
  );
};

export default AppSidebar;