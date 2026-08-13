"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import ControlledInput from "../ui/controlled-input";
import { useAuthForgotPasswordForm } from "@/hooks/use-auth-forgot-password-form";
import { Separator } from "../ui/separator";
import { ROUTES } from "@/constants/auth";
import AuthForgotPasswordComplete from "./auth-forgot-password-complete";

/**
 * パスワード再設定メール送信要求フォーム・コンポーネント
 *
 * @returns JSX.Element - メールアドレス入力欄を備えたフォームUI
 *
 * @remarks
 * - Custom Hook (`useAuthForgotPasswordForm`) からフォーム状態（`form`）、送信ハンドラー（`handleSubmit`）、送信中フラグ（`isSubmitting`）、メールアドレス読み取り専用フラグ（`isReadOnlyEmail`）を取得して制御します。
 */
export const AuthForgotPasswordForm = () => {
  // 専用カスタムフック
  const { form, handleSubmit, isSubmitting, isSubmitted } = useAuthForgotPasswordForm();

  if (isSubmitted) {
    return <AuthForgotPasswordComplete />;
  }

  return (
    <Card className="w-full sm:max-w-sm [--card-spacing:--spacing(8)]">
      <CardHeader className="text- gap-2">
        {/* <CardTitle className="text-2xl font-bold text-center tracking-[0.25rem] pl-1">
          パスワードをお忘れの方
        </CardTitle> */}
        <CardTitle className="text-2xl font-bold">
          パスワードをお忘れの方
        </CardTitle>

        <Separator className="my-2.5" />

        <CardDescription className="text-xs leading-relaxed text-muted-foreground">
          アカウント登録しているメールアドレスを入力してください。パスワード再設定用のメールをお送りします。
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form id="change-password-form" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-6">
            {/* メールアドレス */}
            <div className="grid gap-2">
              <ControlledInput
                control={form.control}
                name="email"
                label="登録メールアドレス"
                type="email"
                placeholder="m@example.com"
                autoComplete="email"
              />
            </div>

          </div>
        </form>
      </CardContent>

      <CardFooter className="flex-col gap-4">
        <Button
          type="submit"
          form="change-password-form"
          className="w-full font-medium"
          disabled={isSubmitting}
        >
          {isSubmitting ? "送信中..." : "再設定用メールを送信"}
        </Button>

        <Separator className="my-1" />

        <div className="text-center text-xs text-muted-foreground">
          <a href={ROUTES.LOGIN} className="underline underline-offset-4 hover:text-primary">
            ログイン画面へ戻る
          </a>
        </div>
      </CardFooter>
    </Card>
  );
};

export default AuthForgotPasswordForm;