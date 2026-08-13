"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "../ui/separator";
import { ROUTES } from "@/constants/auth";

/**
 * パスワード再設定メール送信完了・コンポーネント
 *
 * @returns JSX.Element - メールアドレス入力欄を備えたフォームUI
 */
export const AuthForgotPasswordComplete = () => {

  return (
    <Card className="w-full sm:max-w-sm [--card-spacing:--spacing(8)]">
      <CardHeader className="text-center gap-2">
        <CardTitle className="text-2xl font-bold">
          パスワード再設定メール<br />送信済み
        </CardTitle>
        <Separator className="my-0" />
      </CardHeader>

      <CardContent className="space-y-4 text-center text-xs text-muted-foreground leading-relaxed">
        <p className="font-bold">
          メールをご確認いただき、記載されているURLにアクセスしてパスワード再設定をしてください。
        </p>

        {/* <Separator className="my-2" /> */}

        <ul className="text-left space-y-1.5 text-[11px] text-muted-foreground/90 list-disc list-inside bg-muted/30 p-3 rounded-md">
          <li>URLの有効期限は <strong>30分間</strong> です。</li>
          <li>メールが届かない場合は、迷惑メールフォルダをご確認ください。</li>
        </ul>

      </CardContent>

      <CardFooter className="flex-col gap-4">
        <div className="text-center text-xs text-muted-foreground">
          <a href={ROUTES.LOGIN} className="underline underline-offset-4 hover:text-primary">
            ログイン画面へ戻る
          </a>
        </div>
      </CardFooter>
    </Card>
  );
};

export default AuthForgotPasswordComplete;