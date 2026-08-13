"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import ControlledInput from "../ui/controlled-input";
import { useAuthChangePasswordForm } from "@/hooks/use-auth-change-password-form";
import { useWatch } from "react-hook-form";
import PasswordStrengthMeter from "./password-strength-meter";
import { Separator } from "../ui/separator";

/**
 * パスワード変更フォームのProps定義
 */
type AuthChangePasswordFormProps = {
  /** Server Component (page.tsx) 側の Cookie 等から渡されるメールアドレスの初期値 */
  defaultEmail?: string;
};

/**
 * パスワード変更フォーム・コンポーネント
 *
 * @param props - `defaultEmail`: 初期表示用のメールアドレス
 * @returns JSX.Element - メールアドレス・現在のパスワード・新しいパスワード・確認用パスワード入力欄を備えたフォームUI
 *
 * @remarks
 * - Custom Hook (`useAuthChangePasswordForm`) からフォーム状態（`form`）、送信ハンドラー（`handleSubmit`）、送信中フラグ（`isSubmitting`）、メールアドレス読み取り専用フラグ（`isReadOnlyEmail`）を取得して制御します。
 * - `defaultEmail` が存在する場合、メールアドレス入力欄は `readOnly` 化され変更不可となります。
 */
export const AuthChangePasswordForm = ({ defaultEmail = "" }: AuthChangePasswordFormProps) => {
  // 専用カスタムフックに defaultEmail を渡して状態を取得
  const { form, handleSubmit, isSubmitting, isReadOnlyEmail } = useAuthChangePasswordForm({ defaultEmail });

  // 新しいパスワード入力欄のリアルタイムな入力を監視（強度メーター用）
  const newPasswordValue = useWatch({
    control: form.control,
    name: "newPassword",
  });

  return (
    <Card className="w-full sm:max-w-sm [--card-spacing:--spacing(8)]">
      <CardHeader>
        {/* <CardTitle className="text-2xl font-bold text-center tracking-[0.25rem] pl-1">
          PASSWORD CHANGE
        </CardTitle> */}
        <CardTitle className="text-2xl font-bold">
          パスワード変更
        </CardTitle>
        <Separator className="my-2.5" />
      </CardHeader>


      <CardContent>
        <form id="change-password-form" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <ControlledInput
                control={form.control}
                name="currentPassword"
                label="現在のパスワード"
                type="password"
                placeholder=""
                autoComplete="current-password"
              />
            </div>

            <div className="grid gap-2">
              <ControlledInput
                control={form.control}
                name="newPassword"
                label="新しいパスワード"
                type="password"
                placeholder=""
                autoComplete="new-password"
              />
              <PasswordStrengthMeter password={newPasswordValue} />
            </div>

            <div className="grid gap-2">
              <ControlledInput
                control={form.control}
                name="confirmPassword"
                label="新しいパスワード（確認）"
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
          form="change-password-form"
          className="w-full font-medium"
          disabled={isSubmitting}
        >
          {isSubmitting ? "変更中..." : "パスワードを変更"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AuthChangePasswordForm;