"use client"

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ControlledInput from "../ui/controlled-input";
import { useAuthLoginForm } from "@/hooks/use-autu-login-form";
import { Separator } from "../ui/separator";

/**
 * ログインフォーム・コンポーネント
 *
 * @returns JSX.Element - メールアドレス・パスワード入力欄および送信ボタンを備えたログインフォームUI
 *
 * @remarks
 * - Custom Hook (`useAuthLoginForm`) からフォーム状態（`form`）、送信ハンドラー（`handleSubmit`）、送信中フラグ（`isSubmitting`）を取得して制御します。
 * - UI ライブラリの Card コンポーネントおよび ControlledInput を使用して整列・配置しています。
 */
const AuthLoginForm = () => {
  // ログインフォーム専用のカスタムフックから各種プロパティ・ハンドラーを取得
  const { form, handleSubmit, isSubmitting } = useAuthLoginForm();

  return (
    // <div className="flex flex-col gap-4">
    <Card className="w-full sm:max-w-sm [--card-spacing:--spacing(8)]">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-center tracking-[0.5rem] pl-2">LOGIN</CardTitle>
      </CardHeader>

      <CardContent>
        <form id="login-form" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <ControlledInput
                control={form.control}
                name="email"
                // label="メールアドレス"
                label="Email"
                type="email"
                placeholder="m@example.com"
                autoComplete="email"
              />
            </div>

            <div className="grid gap-2">
              <ControlledInput
                control={form.control}
                name="password"
                // label="パスワード"
                label="Password"
                type="password"
                placeholder=""
                autoComplete="current-password"
              />
              <div className="flex justify-end">
                <a
                  href="#"
                  className="text-xs text-muted-foreground underline-offset-4 hover:underline"
                >
                  パスワードをお忘れですか？
                </a>
              </div>
            </div>
          </div>
        </form>
      </CardContent>

      <CardFooter className="flex-col gap-4">
        <Button
          type="submit"
          form="login-form"
          className="w-full font-medium"
          disabled={isSubmitting}
        >
          {isSubmitting ? "ログイン中..." : "ログイン"}
        </Button>

        <Separator className="my-1" />

        <div className="text-center text-xs text-muted-foreground">
          アカウントをお持ちでないですか？{" "}
          <a href="/signup" className="underline underline-offset-4 hover:text-primary">
            新規登録
          </a>
        </div>
      </CardFooter>
    </Card>
  );
}

export default AuthLoginForm;