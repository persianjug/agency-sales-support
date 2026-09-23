"use client"

import { SidebarTrigger } from "../ui/sidebar";
import HeaderLogo from "./header-logo"
import UserNav from "./user-nav"

const Header = () => {
  return (
    // <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
    // <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur shadow-sm border-b supports-[backdrop-filter]:bg-background/60">
    //  <header className="sticky top-0 z-50 w-full border-b bg-sidebar/80 backdrop-blur supports-[backdrop-filter]:bg-sidebar/60">
    // <header className="sticky top-0 z-50 w-full bg-background backdrop-blur rounded-tl-xl ">
    // <header className="sticky top-0 z-50 w-full border-b border-border/30 bg-sidebar/50 backdrop-blur">
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/60 bg-slate-900/5 backdrop-blur supports-[backdrop-filter]:bg-slate-900/5">
      <div className="flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <SidebarTrigger />
          {/* <HeaderLogo /> */}
        </div>
        <div className="flex items-center gap-4">
          <UserNav />
        </div>
      </div>
    </header>
  );
}

export default Header;