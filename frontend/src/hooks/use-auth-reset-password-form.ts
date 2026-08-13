import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { authResetPasswordSchema, AuthResetPasswordFormValues } from "@/lib/validations/auth";
import { authResetPasswordAction } from "@/actions/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { ROUTES } from "@/constants/auth"

/**
 * パスワード再設定処理のステート管理および送信処理を提供するカスタムフック
 *
 * @param token - ワンタイムトークン（親コンポーネントから受領）
 * @returns オブジェクト
 * - `form`: react-hook-form のフォームオブジェクト
 * - `handleSubmit`: フォーム送信用のイベントハンドラー
 * - `isSubmitting`: 送信処理中フラグ
 *
 * @remarks
 * - クライアント側での Cookie 直読み処理（`js-cookie` やハイドレーション用ガード）を排除し、安全でシンプルな構造を実現しています。
 * - フォーム送信時には `authResetPasswordAction` (Server Action) を呼び出して更新処理を実行します。
 * - 変更成功時はトースト表示後、指定のリダイレクト先（`from` パラメータまたはデフォルトホーム）へ遷移します。
 */
export const useAuthResetPasswordForm = ( token : string) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const form = useForm<AuthResetPasswordFormValues>({
    resolver: zodResolver(authResetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  /**
   * フォームのバリデーション成功時に呼び出される送信ハンドラー
   *
   * @param data - フォームから受け取る入力値（`AuthResetPasswordFormValues`）
   */
  const onSubmit = async (data: AuthResetPasswordFormValues) => {
    try {
      // Server Action (authResetPasswordAction) を呼び出し
      const result = await authResetPasswordAction(token, data);

      if (!result.success) {
        toast.error(result.message || "パスワード再設定処理に失敗しました");
        return;
      }

      // クエリパラメータ `from` （リダイレクト元）があればそこへ、無ければホーム画面へ遷移
      const redirectUrl = searchParams.get("from") || ROUTES.HOME;
      router.push(redirectUrl);
      // router.refresh();
    } catch (error) {
      console.error("Change Password Submit Error:", error);
      toast.error("予期せぬエラーが発生しました");
    }
  };

  return {
    form,
    handleSubmit: form.handleSubmit(onSubmit),
    isSubmitting: form.formState.isSubmitting,
  };
}