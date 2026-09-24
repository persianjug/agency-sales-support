"use client";

import { Search } from "lucide-react";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

interface AppSidebarCommandButtonProps {
  onOpenCommand?: () => void;
}

export const AppSidebarCommandButton = ({ onOpenCommand }: AppSidebarCommandButtonProps) => {
  return (
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
  );
};

export default AppSidebarCommandButton;