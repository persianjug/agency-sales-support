"use client"

import HeaderLogo from "./header-logo"
import UserNav from "./user-nav"

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between px-4">
        <HeaderLogo />
        <div className="flex items-center gap-4">
          <UserNav />
        </div>
      </div>
    </header>
  );
}

export default Header;