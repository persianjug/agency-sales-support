"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { authChangePasswordSchema, AuthChangePasswordFormValues } from "@/lib/validations/auth";
import { authChangePasswordAction } from "@/actions/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { ROUTES } from "@/constants/auth"
import { useState } from "react";

/**
 * パスワード変更のカスタムフックのProps定義
 */
type UseAuthChangePasswordFormProps = {
  /** Server Component から親コンポーネント経由で渡されるメールアドレスの初期値 */
  defaultEmail?: string;
};

/**
 * Cookie から初期表示用のメールアドレスを取得するヘルパー関数
 *
 * @returns Cookie に保存されているメールアドレス（存在しない場合や 1 回目の実行時は空文字 `""`）
 *
 * @remarks
 * Next.js では Client Component (`"use client"`) であっても、以下の 2 段階でコードが動きます。
 *
 * 1 回目（サーバー側）:
 *   まだ JavaScript のブラウザ用オブジェクト（`window` や Cookie など）が存在しない状態。
 *   ここで参照しようとするとエラー（クラッシュ）するため、`if (typeof window === "undefined")` でガードして安全に空文字 `""` を返します。
 *
 * 2 回目（ブラウザ側）:
 *   画面が届き、JavaScript のブラウザ用オブジェクト群が到着して参照可能になった状態。
 *   ここで初めて Cookie（`USER_EMAIL_COOKIE_KEY`）から実際のメールアドレスを取得してフォームの初期値にセットします。
 */
// const getInitialEmail = (): string => {
//   if (typeof window === "undefined") return "";
//   return Cookies.get(USER_EMAIL_COOKIE_KEY) || "";
// };

/**
 * パスワード変更フォームのステート管理および送信処理を提供するカスタムフック
 *
 * @param props - `defaultEmail`: 初期表示用のメールアドレス（親コンポーネントから受領）
 * @returns オブジェクト
 * - `form`: react-hook-form のフォームオブジェクト
 * - `handleSubmit`: フォーム送信用のイベントハンドラー
 * - `isSubmitting`: 送信処理中フラグ
 * - `isReadOnlyEmail`: メールアドレスが初期補完されて編集不可状態かどうか
 *
 * @remarks
 * - 親（Server Component）から渡された `defaultEmail` をフォームの初期値（`email`）にセットします。
 * - `defaultEmail` に値が存在する場合は `isReadOnlyEmail` を `true` に設定し、UI 側で編集不可とします。
 * - クライアント側での Cookie 直読み処理（`js-cookie` やハイドレーション用ガード）を排除し、安全でシンプルな構造を実現しています。
 * - フォーム送信時には `authChangePasswordAction` (Server Action) を呼び出して更新処理を実行します。
 * - 変更成功時はトースト表示後、指定のリダイレクト先（`from` パラメータまたはデフォルトホーム）へ遷移します。
 */
export const useAuthChangePasswordForm = ({ defaultEmail = "" }: UseAuthChangePasswordFormProps = {}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 親から渡された defaultEmail の有無で readOnly フラグを判定
  const [isReadOnlyEmail] = useState<boolean>(!!defaultEmail);

  const form = useForm<AuthChangePasswordFormValues>({
    resolver: zodResolver(authChangePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  /**
   * フォームのバリデーション成功時に呼び出される送信ハンドラー
   *
   * @param data - フォームから受け取る入力値（`AuthChangePasswordFormValues`）
   */
  const onSubmit = async (data: AuthChangePasswordFormValues) => {
    try {
      // Server Action (authChangePasswordAction) を呼び出し
      const result = await authChangePasswordAction(defaultEmail, data);

      // サーバー側でエラーが発生した場合のハンドリング
      if (!result.success) {
        const errorMessage = result.message || "パスワードの変更に失敗しました。";

        // 1. 「現在のパスワードが正しくありません。」の場合
        if (errorMessage.includes("現在のパスワードが正しくありません")) {
          // 「現在のパスワード」入力欄にエラーを紐づける
          form.setError("currentPassword", {
            type: "manual",
            message: errorMessage,
          });

          // 「現在のパスワード」欄だけをクリア
          form.setValue("currentPassword", "");
          // ※ resetField を使う場合: form.resetField("currentPassword");

          // 「現在のパスワード」欄へフォーカスを移動
          form.setFocus("currentPassword");

          return;
        }

        // 2. それ以外のエラー（新旧パスワード重複「新しいパスワードには〜」など）の場合
        // 「新しいパスワード」入力欄にエラーを紐づける
        form.setError("newPassword", {
          type: "manual",
          message: errorMessage,
        });

        // 「新しいパスワード」欄へフォーカスを移動
        form.setFocus("newPassword");

        return;
      }

      // 成功時の処理
      toast.success("パスワードを変更しました。");
      form.reset();

      // クエリパラメータ `from` があればそこへ、無ければホーム/ダッシュボードへ遷移
      const redirectUrl = searchParams.get("from") || ROUTES.HOME;
      router.push(redirectUrl);
      router.refresh();
    } catch (error) {
      console.error("Change Password Submit Error:", error);
      toast.error("予期せぬエラーが発生しました");
    }
  };

  return {
    form,
    handleSubmit: form.handleSubmit(onSubmit),
    isSubmitting: form.formState.isSubmitting,
    isReadOnlyEmail,
  };
}