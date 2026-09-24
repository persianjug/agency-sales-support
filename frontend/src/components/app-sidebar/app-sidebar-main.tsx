"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LucideIcon } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

export type NavItem = {
  title: string;
  url: string;
  icon: LucideIcon;
}

type AppSidebarMainProps = {
  items: NavItem[];
}

export const AppSidebarMain = ({ items }: AppSidebarMainProps) => {
  const pathname = usePathname();

  return (
    <SidebarGroup className="px-0">
      <SidebarGroupLabel className="text-[11px] font-medium text-muted-foreground/70 mb-1 px-1 group-data-[collapsible=icon]:hidden">
        メインメニュー
      </SidebarGroupLabel>
      <SidebarMenu className="space-y-1">
        {items.map((item) => {
          const isActive = pathname.startsWith(item.url);
          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                render={<Link href={item.url} />}
                isActive={isActive}
                tooltip={item.title}
                className={`h-9.5 text-sm font-medium rounded-md transition-all 
                  ${isActive
                    ? "bg-sidebar-accent !text-primary font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                <item.icon className={`size-4.5 shrink-0 ${isActive ? "text-primary" : ""}`} />
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
};

export default AppSidebarMain;