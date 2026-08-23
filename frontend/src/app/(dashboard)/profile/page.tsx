"use client"

import Link from "next/link"
import { User, Shield, Edit3, ArrowRight } from "lucide-react"
import { useCurrentUser } from "@/hooks/use-current-user"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function ProfilePage() {
  const { name, email } = useCurrentUser()

  const initialLetter = name ? name.charAt(0).toUpperCase() : "U"

  return (
    <div className="container max-w-3xl py-8 space-y-10">
      {/* ページタイトル */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">アカウント概要</h1>
        <p className="text-sm text-muted-foreground mt-1">
          登録情報の確認およびセキュリティ設定が行えます。
        </p>
      </div>

      {/* セクション1: 基本プロフィール（閲覧専用） */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-lg font-semibold">プロフィール情報</h2>
          </div>
          {/* 編集ページへのボタン */}
          <Button variant="outline" size="sm" className="gap-1.5">
            <Link href="/profile/edit">
              <Edit3 className="h-3.5 w-3.5" />
              プロフィールを編集
            </Link>
          </Button>
        </div>

        <div className="flex items-center gap-8 py-2">
          <Avatar className="h-20 w-20 border">
            <AvatarFallback className="bg-primary/10 text-primary text-3xl font-bold">
              {initialLetter}
            </AvatarFallback>
          </Avatar>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 flex-1">
            {/* 項目名（ラベル）を太字、値を通常フォントに変更 */}
            <div className="space-y-1">
              <span className="text-sm font-bold text-foreground">表示名</span>
              <p className="text-sm text-muted-foreground">{name || "未設定"}</p>
            </div>
            <div className="space-y-1">
              <span className="text-sm font-bold text-foreground">メールアドレス (ユーザーID)</span>
              <p className="text-sm text-muted-foreground">{email || "user@example.com"}</p>
            </div>
          </div>
        </div>
      </section>

      {/* セクション2: セキュリティ */}
      <section className="space-y-4">
        <div className="border-b pb-3">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-lg font-semibold">セキュリティ</h2>
          </div>
        </div>

        <div className="flex items-center justify-between py-2">
          <div className="space-y-0.5">
            <p className="text-sm font-bold text-foreground">パスワード</p>
            <p className="text-xs text-muted-foreground">
              定期的なパスワードの変更を推奨しています。
            </p>
          </div>
          <Button variant="outline" size="sm" className="gap-1.5">
            <Link href="/change-password">
              パスワード変更
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}