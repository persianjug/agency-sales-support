"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { authLogoutAction } from "@/actions/auth"
import { ROUTES } from "@/constants/auth"

/**
 * ログアウト処理および状態管理を提供するカスタムフック
 *
 * @returns オブジェクト
 * - `handleLogout`: ログアウト実行ハンドラー
 * - `isPending`: ログアウト処理中フラグ
 *
 * @remarks
 * - `authLogoutAction` (Server Action) を呼び出して Cookie から認証トークンを削除します。
 * - 成功時はトースト通知を表示し、ログイン画面（`/login`）へ遷移後、`router.refresh()` でサーバー状態を更新します。
 * - 失敗時は `sonner` トースト通知にてエラーメッセージを表示します。
 */
export const useAuthLogout = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  /**
   * ログアウトを実行するイベントハンドラー
   */
  const handleLogout = () => {
    startTransition(async () => {
      try {
        const result = await authLogoutAction();

        if (!result.success) {
          toast.error(result.message || "ログアウトに失敗しました")
          return
        }

        toast.success("ログアウトしました")

        // ログイン画面へ遷移し、サーバーコンポーネントの状態を最新化
        router.push(ROUTES.LOGIN)
        router.refresh()
      } catch (error) {
        console.error("Logout Submit Error:", error)
        toast.error("予期せぬエラーが発生しました")
      }
    })
  }

  return {
    handleLogout,
    isPending,
  }
}