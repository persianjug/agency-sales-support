"use client";

import Link from "next/link";
import { ChevronsUpDown, LogOut, User } from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
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
import AvatarDisplay from "../common/avatar/avatar-dispaly";

type UserData = {
  name: string;
  role: string;
  email: string;
  avatar: string;
};

type AppSidebarUserProps = {
  user: UserData;
};

export const AppSidebarUser = ({ user }: AppSidebarUserProps) => {
  const { isMobile } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground py-1.5 rounded-lg transition-colors cursor-pointer group-data-[collapsible=icon]:!p-0 group-data-[collapsible=icon]:!justify-center group-data-[collapsible=icon]:w-full"
              />
            }
          >
            <AvatarDisplay
              src={user.avatar}
              name={user.name}
              size="xs"
            />
            <div className="grid flex-1 text-left leading-tight group-data-[collapsible=icon]:hidden ml-1">
              <span className="truncate font-semibold text-xs text-foreground">{user.name}</span>
              <span className="truncate text-[11px] text-muted-foreground">{user.email}</span>
            </div>
            <ChevronsUpDown className="ml-auto size-4 text-muted-foreground shrink-0 group-data-[collapsible=icon]:hidden" />
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-xl p-1 shadow-lg border border-border/60"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={8}
          >
            {/* 1. ユーザー情報グループ */}
            <DropdownMenuGroup>
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2.5 px-2 py-2 text-left text-xs">
                  <AvatarDisplay
                    src={user.avatar}
                    name={user.name}
                    size="xs"
                  />
                  <div className="grid flex-1 text-left text-xs leading-tight">
                    <span className="truncate font-semibold text-foreground">{user.name}</span>
                    <span className="truncate text-[11px] text-muted-foreground">{user.email}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            {/* 2. アカウント設定グループ */}
            <DropdownMenuGroup>
              <DropdownMenuItem
                render={<Link href="/profile" />}
                className="gap-2 text-xs cursor-pointer py-2 px-2.5 rounded-md"
              >
                <User className="size-4 text-muted-foreground" />
                <span>アカウント設定</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            {/* 3. ログアウトグループ */}
            <DropdownMenuGroup>
              <DropdownMenuItem className="gap-2 text-xs text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer py-2 px-2.5 rounded-md">
                <LogOut className="size-4" />
                <span>ログアウト</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

export default AppSidebarUser;