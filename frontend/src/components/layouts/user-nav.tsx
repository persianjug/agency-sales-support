"use client"

import { LogOut, User } from "lucide-react"
import { useAuthLogout } from "@/hooks/use-auth-logout"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useCurrentUser } from "@/hooks/use-current-user"

const UserNav = () => {
  const { handleLogout, isPending } = useAuthLogout();
  const { name, email } = useCurrentUser();

  // アバターアイコン表示用（名前の最初の1文字。なければ'U'）
  const initialLetter = name ? name.charAt(0).toUpperCase() : "U"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="relative flex h-8 w-8 items-center justify-center rounded-full outline-none hover:opacity-80 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-opacity">
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-primary/10 text-primary font-semibold">
            {initialLetter}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      {/* ドロップダウンコンテンツ（カード風に幅を少し広めの w-72 に設定） */}
      <DropdownMenuContent className="w-72 p-2" align="end">
        <DropdownMenuGroup>
          {/* 上部: 大きなアバターとユーザー情報カード */}
          <div className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg">
            <Avatar className="h-14 w-14 border">
              <AvatarFallback className="bg-primary/20 text-primary text-xl font-bold">
                {initialLetter}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0 flex-1">
              <p className="text-base font-semibold text-foreground truncate">
                {name || "ユーザー"}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {email || "user@example.com"}
              </p>
            </div>
          </div>

          <DropdownMenuSeparator className="my-2" />

          {/* 中央: マイページなどの機能メニュー */}
          <DropdownMenuItem disabled className="py-2.5 cursor-not-allowed">
            <User className="mr-3 h-4 w-4 text-muted-foreground" />
            <span className="text-sm">マイページ (準備中)</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator className="my-2" />

          {/* 下部: ログアウトボタン */}
          <DropdownMenuItem
            className="py-2.5 text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer"
            onClick={handleLogout}
            disabled={isPending}
          >
            <LogOut className="mr-3 h-4 w-4" />
            <span className="text-sm font-medium">
              {isPending ? "ログアウト中..." : "ログアウト"}
            </span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>

      {/* <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {name || "ユーザー"}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {email || "user@example.com"}
              </p>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          <DropdownMenuItem disabled>
            <User className="mr-2 h-4 w-4" />
            <span>マイページ (準備中)</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer"
            onClick={handleLogout}
            disabled={isPending}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>{isPending ? "ログアウト中..." : "ログアウト"}</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent> */}
    </DropdownMenu>
  );
}

export default UserNav;