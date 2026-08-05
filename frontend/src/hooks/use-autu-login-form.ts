import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { authLoginSchema, AuthLoginFormValues } from "@/lib/validations/auth"
import { authLoginAction } from "@/actions/auth"
import { useRouter, useSearchParams } from "next/navigation"
import { ROUTES } from "@/constants/auth"

/**
 * ログインフォームのステート管理および送信処理を提供するカスタムフック
 *
 * @returns オブジェクト
 * - `form`: react-hook-form のフォームオブジェクト
 * - `handleSubmit`: フォーム送信用のイベントハンドラー
 * - `isSubmitting`: 送信処理中フラグ
 *
 * @remarks
 * - Zod スキーマ（`authLoginSchema`）を使用したバリデーションを適用します。
 * - フォーム送信時には `authLoginAction` (Server Action) を呼び出して認証処理を実行します。
 * - ログイン成功時は、URL クエリパラメータ (`from`) に指定されたリダイレクト先、またはデフォルトのホーム画面（`/`）へ遷移します。
 * - 失敗時は `sonner` トースト通知にてユーザーへエラーメッセージを表示します。
 */
export const useAuthLoginForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const form = useForm<AuthLoginFormValues>({
    resolver: zodResolver(authLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  /**
   * フォームのバリデーション成功時に呼び出される送信ハンドラー
   *
   * @param data - フォームから受け取る入力値（`AuthLoginFormValues`）
   */
  const onSubmit = async (data: AuthLoginFormValues) => {
    try {
      // Server Action (authLoginAction) を呼び出し
      const result = await authLoginAction(data);

      if (!result.success) {
        toast.error(result.message || "ログインに失敗しました");
        return;
      }

      toast.success("ログインしました");

      // クエリパラメータ `from` （リダイレクト元）があればそこへ、無ければホーム画面へ遷移
      const redirectUrl = searchParams.get("from") || ROUTES.HOME;
      router.push(redirectUrl);
      router.refresh();
    } catch (error) {
      console.error("Login Submit Error:", error);
      toast.error("予期せぬエラーが発生しました");
    }
  }

  return {
    form,
    handleSubmit: form.handleSubmit(onSubmit),
    isSubmitting: form.formState.isSubmitting,
  }
}