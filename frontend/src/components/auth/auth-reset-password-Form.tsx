"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import ControlledInput from "../ui/controlled-input";
import { Separator } from "../ui/separator";
import { ROUTES } from "@/constants/auth";
import { useAuthResetPasswordForm } from "@/hooks/use-auth-reset-password-form";
import { useWatch } from "react-hook-form";
import PasswordStrengthMeter from "./password-strength-meter";

/**
 * パスワード変更フォームのProps定義
 */
type AuthResetPasswordFormProps = {
  /** Server Component (page.tsx) 側の Cookie 等から渡されるワンタイムトークン */
  token: string;
}

/**
 * パスワード再設定フォーム・コンポーネント
 *
 * @param props - `token`: Server Component (page.tsx) 側の Cookie 等から渡されるワンタイムトークン
 * @returns JSX.Element - メールアドレス入力欄を備えたフォームUI
 *
 * @remarks
 * - Custom Hook (`useAuthForgotPasswordForm`) からフォーム状態（`form`）、送信ハンドラー（`handleSubmit`）、送信中フラグ（`isSubmitting`）、メールアドレス読み取り専用フラグ（`isReadOnlyEmail`）を取得して制御します。
 */
export const AuthResetPasswordForm = (props: AuthResetPasswordFormProps) => {
  // 専用カスタムフック
  const { form, handleSubmit, isSubmitting } = useAuthResetPasswordForm(props.token);

  // パスワード入力欄のリアルタイムな入力を監視
  const passwordValue = useWatch({
    control: form.control,
    name: "newPassword",
  });

  return (
    <Card className="w-full sm:max-w-sm [--card-spacing:--spacing(8)]">
      <CardHeader className="text- gap-2">
        <CardTitle className="text-2xl font-bold">
          パスワード再設定
        </CardTitle>
        <Separator className="my-2.5" />
      </CardHeader>

      <CardContent>
        <form id="reset-password-form" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <ControlledInput
                control={form.control}
                name="newPassword"
                label="パスワード"
                type="password"
                placeholder=""
                autoComplete="new-password"
              />
              {/* パスワード強度メーターを配置 */}
              <PasswordStrengthMeter password={passwordValue} />
            </div>

            <div className="grid gap-2">
              <ControlledInput
                control={form.control}
                name="confirmPassword"
                label="パスワード（確認）"
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
          form="reset-password-form"
          className="w-full font-medium"
          disabled={isSubmitting}
        >
          {isSubmitting ? "パスワード変更中..." : "パスワード再設定"}
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

export default AuthResetPasswordForm;