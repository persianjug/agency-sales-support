import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { authForgotPasswordSchema, AuthForgotPasswordFormValues } from "@/lib/validations/auth";
import { authForgotPasswordAction } from "@/actions/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { ROUTES } from "@/constants/auth"
import { useState } from "react";

/**
 * パスワード再設定メール送信要求フォームのステート管理および送信処理を提供するカスタムフック
 *
 * @param props - `token`: ワンタイムトークン（親コンポーネントから受領）
 * @returns オブジェクト
 * - `form`: react-hook-form のフォームオブジェクト
 * - `handleSubmit`: フォーム送信用のイベントハンドラー
 * - `isSubmitting`: 送信処理中フラグ
 *
 * @remarks
 * - クライアント側での Cookie 直読み処理（`js-cookie` やハイドレーション用ガード）を排除し、安全でシンプルな構造を実現しています。
 * - フォーム送信時には `authForgotPasswordAction` (Server Action) を呼び出して更新処理を実行します。
 * - 変更成功時はトースト表示後、指定のリダイレクト先（`from` パラメータまたはデフォルトホーム）へ遷移します。
 */
export const useAuthForgotPasswordForm = () => {
  // 送信完了フラグ
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<AuthForgotPasswordFormValues>({
    resolver: zodResolver(authForgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  /**
   * フォームのバリデーション成功時に呼び出される送信ハンドラー
   *
   * @param data - フォームから受け取る入力値（`AuthForgotPasswordFormValues`）
   */
  const onSubmit = async (data: AuthForgotPasswordFormValues) => {
    try {
      // Server Action (authForgotPasswordAction) を呼び出し
      const result = await authForgotPasswordAction(data);

      if (!result.success) {
        toast.error(result.message || "パスワード再設定メール送信要求に失敗しました");
        return;
      }

      // 送信成功時にステートを更新（画面切り替え用）
      setIsSubmitted(true);
    } catch (error) {
      console.error("Change Password Submit Error:", error);
      toast.error("予期せぬエラーが発生しました");
    }
  };

  return {
    form,
    handleSubmit: form.handleSubmit(onSubmit),
    isSubmitting: form.formState.isSubmitting,
    isSubmitted,
  };
}