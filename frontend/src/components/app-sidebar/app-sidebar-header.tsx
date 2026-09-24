"use client";

import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import Logo from "../common/logo";

export const AppSidebarHeader = () => {
  const { toggleSidebar } = useSidebar();

  return (
    <SidebarHeader className="pt-4 pb-2 px-3 group-data-[collapsible=icon]:px-0">
      <SidebarMenu>
        <SidebarMenuItem className="flex items-center justify-between">
          <SidebarMenuButton
            size="lg"
            onClick={toggleSidebar}
            className="hover:bg-transparent active:bg-transparent cursor-pointer flex-1 p-0 group-data-[collapsible=icon]:justify-center"
          >
            <Logo
              size="md"
              textClassName="group-data-[collapsible=icon]:hidden"
            />
          </SidebarMenuButton>

          <SidebarTrigger className="group-data-[collapsible=icon]:hidden shrink-0 h-8 w-8 ml-1" />
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
  );
};

export default AppSidebarHeader;