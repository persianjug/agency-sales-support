"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FileText,
  Building2,
  ShieldCheck,
  Search,
  ChevronsUpDown,
  LogOut,
  User,
  Shield,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const navItems = [
  {
    title: "ダッシュボード",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "顧客管理",
    url: "/customers",
    icon: Users,
  },
  {
    title: "契約・募集管理",
    url: "/policies",
    icon: FileText,
  },
  {
    title: "代理店管理",
    url: "/agencies",
    icon: Building2,
  },
  {
    title: "アカウント管理",
    url: "/accounts",
    icon: ShieldCheck,
  },
];

export const AppSidebar = ({
  onOpenCommand,
  ...props
}: React.ComponentProps<typeof Sidebar> & { onOpenCommand?: () => void }) => {
  const pathname = usePathname();
  const { isMobile, toggleSidebar } = useSidebar();

  return (
    <Sidebar collapsible="icon" {...props}>
      {/* 1. Header: 左右パディング(px-4)で全体に余白を拡張 */}
      <SidebarHeader className="pt-4 pb-2 px-4">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center justify-between">
            <SidebarMenuButton
              size="lg"
              onClick={toggleSidebar}
              className="hover:bg-transparent active:bg-transparent cursor-pointer flex-1 p-0"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-blue-600 text-white shrink-0">
                <Shield className="size-4" />
              </div>
              <div className="grid flex-1 text-left leading-tight group-data-[collapsible=icon]:hidden ml-2">
                <span className="truncate font-bold text-base tracking-wide text-foreground">LOGO</span>
              </div>
            </SidebarMenuButton>

            <SidebarTrigger className="group-data-[collapsible=icon]:hidden shrink-0 h-8 w-8 ml-1" />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="gap-2 px-4">
        {/* 2. Command 検索ボタン */}
        <SidebarGroup className="py-0 px-0">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={onOpenCommand}
                tooltip="クイック検索 (Ctrl+K)"
                className="bg-muted/50 text-muted-foreground hover:bg-muted h-9 text-xs"
              >
                <Search className="size-4 shrink-0" />
                <span>検索 / 移動...</span>
                <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-background px-1.5 font-mono text-[10px] font-medium opacity-100">
                  <span className="text-xs">⌘</span>K
                </kbd>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        {/* 3. Main Navigation */}
        <SidebarGroup className="px-0">
          <SidebarGroupLabel className="text-[11px] font-medium text-muted-foreground/70 mb-1 px-1">
            メインメニュー
          </SidebarGroupLabel>
          <SidebarMenu className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname.startsWith(item.url);
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    render={<Link href={item.url} />}
                    isActive={isActive}
                    tooltip={item.title}
                    // 右端アクセントバー（after:right-0）＋明確な青文字スタイル
                    className={`h-9.5 text-sm font-medium rounded-md transition-all relative px-3 ${
                      isActive
                        ? "bg-blue-50/70 !text-blue-600 font-semibold after:absolute after:right-0 after:top-2 after:bottom-2 after:w-1 after:bg-blue-600 after:rounded-l"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <item.icon className={`size-4.5 shrink-0 ${isActive ? "text-blue-600" : ""}`} />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>

        {/* 4. アバター情報 */}
        <SidebarGroup className="mt-2 pt-3 border-t border-border/40 px-0">
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <SidebarMenuButton
                      size="lg"
                      className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground border border-border/40 px-2.5"
                    />
                  }
                >
                  <Avatar className="h-8 w-8 rounded-lg shrink-0">
                    <AvatarImage src="/avatars/user.png" alt="山田 太郎" />
                    <AvatarFallback className="rounded-lg bg-slate-200 text-xs font-medium">山田</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left leading-tight group-data-[collapsible=icon]:hidden">
                    <span className="truncate font-semibold text-xs">山田 太郎</span>
                    <span className="truncate text-[11px] text-muted-foreground">システム管理者</span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4 shrink-0 group-data-[collapsible=icon]:hidden" />
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                  side={isMobile ? "bottom" : "right"}
                  align="end"
                  sideOffset={4}
                >
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="p-0 font-normal">
                      <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                        <Avatar className="h-8 w-8 rounded-lg">
                          <AvatarFallback className="rounded-lg bg-slate-200">山田</AvatarFallback>
                        </Avatar>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                          <span className="truncate font-semibold">山田 太郎</span>
                          <span className="truncate text-xs text-muted-foreground">yamada@example.com</span>
                        </div>
                      </div>
                    </DropdownMenuLabel>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem render={<Link href="/profile" />}>
                      <User className="mr-2 size-4" />
                      <span>マイページ（プロフィール）</span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600 focus:text-red-600">
                    <LogOut className="mr-2 size-4" />
                    <span>ログアウト</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
};

export default AppSidebar;