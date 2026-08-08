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
import { useAuthSignupForm } from "@/hooks/use-auth-signup-form";
import { Separator } from "../ui/separator";

/**
 * サインアップフォーム・コンポーネント
 *
 * @returns JSX.Element - お名前・メールアドレス・パスワード・確認用パスワード入力欄および送信ボタンを備えたログインフォームUI
 *
 * @remarks
 * - Custom Hook (`useAuthSignupForm`) からフォーム状態（`form`）、送信ハンドラー（`handleSubmit`）、送信中フラグ（`isSubmitting`）を取得して制御します。
 * - UI ライブラリの Card コンポーネントおよび ControlledInput を使用して整列・配置しています。
 */
const AuthSignupForm = () => {
  // ログインフォーム専用のカスタムフックから各種プロパティ・ハンドラーを取得
  const { form, handleSubmit, isSubmitting } = useAuthSignupForm();

  return (
    // <div className="flex flex-col gap-4">
    <Card className="w-full sm:max-w-sm [--card-spacing:--spacing(8)]">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-center tracking-[0.5rem] pl-2">SIGNUP</CardTitle>
      </CardHeader>

      <CardContent>
        <form id="signup-form" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <ControlledInput
                control={form.control}
                name="name"
                label="Name"
                type="text"
                placeholder="山田　太郎"
                autoComplete="name"
              />
            </div>

            <div className="grid gap-2">
              <ControlledInput
                control={form.control}
                name="email"
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
                label="Password"
                type="password"
                placeholder=""
                autoComplete="new-password"
              />
            </div>

            <div className="grid gap-2">
              <ControlledInput
                control={form.control}
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                placeholder=""
                autoComplete="new-password"
              />
            </div>
          </div>
        </form>
      </CardContent>

      <CardFooter className="flex-col gap-4">
        <Button
          type="submit"
          form="signup-form"
          className="w-full font-medium"
          disabled={isSubmitting}
        >
          {isSubmitting ? "登録中..." : "アカウント作成"}
        </Button>

        <Separator className="my-1" />

        <div className="text-center text-xs text-muted-foreground">
          すでにアカウントをお持ちですか？{" "}
          <a href="/login" className="underline underline-offset-4 hover:text-primary">
            ログイン
          </a>
        </div>
      </CardFooter>
    </Card>
  );
}

export default AuthSignupForm;