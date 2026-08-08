import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { authSignupSchema, AuthSignupFormValues } from "@/lib/validations/auth"
import { authSignupAction } from "@/actions/auth"
import { useRouter, useSearchParams } from "next/navigation"
import { ROUTES } from "@/constants/auth"
// import { toast } from "@/components/ui/toast"

/**
 * サインアップフォームのステート管理および送信処理を提供するカスタムフック
 *
 * @returns オブジェクト
 * - `form`: react-hook-form のフォームオブジェクト
 * - `handleSubmit`: フォーム送信用のイベントハンドラー
 * - `isSubmitting`: 送信処理中フラグ
 *
 * @remarks
 * - Zod スキーマ（`authLoginSchema`）を使用したバリデーションを適用します。
 * - フォーム送信時には `authSignupAction` (Server Action) を呼び出して認証処理を実行します。
 * - 登録成功時は、URL クエリパラメータ (`from`) に指定されたリダイレクト先、またはデフォルトのホーム画面（`/`）へ遷移します。
 * - 失敗時は `sonner` トースト通知にてユーザーへエラーメッセージを表示します。
 */
export const useAuthSignupForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const form = useForm<AuthSignupFormValues>({
    resolver: zodResolver(authSignupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  /**
   * フォームのバリデーション成功時に呼び出される送信ハンドラー
   *
   * @param data - フォームから受け取る入力値（`AuthSignupFormValues`）
   */
  const onSubmit = async (data: AuthSignupFormValues) => {
    try {
      // Server Action (authSignupAction) を呼び出し
      const result = await authSignupAction(data);

      if (!result.success) {
        toast.error(result.message || "アカウント登録に失敗しました");
        // console.log(`${JSON.stringify(result)}`);
        // toast.add({
        //   type: "error",
        //   title: "エラー",
        //   description: result.message || "アカウント登録に失敗しました",
        //   priority: "high",
        // });
        return;
      }

      toast.success("アカウントを作成し、ログインしました");
      // toast.add({
      //   type: "success",
      //   title: "登録完了",
      //   description: "アカウントを作成し、ログインしました",
      // });

      // クエリパラメータ `from` （リダイレクト元）があればそこへ、無ければホーム画面へ遷移
      const redirectUrl = searchParams.get("from") || ROUTES.HOME;
      router.push(redirectUrl);
      router.refresh();
    } catch (error) {
      console.error("Signup Submit Error:", error);
      toast.error("予期せぬエラーが発生しました");
      // toast.add({
      //   type: "error",
      //   title: "エラー",
      //   description: "予期せぬエラーが発生しました",
      //   priority: "high",
      // });
    }
  }

  return {
    form,
    handleSubmit: form.handleSubmit(onSubmit),
    isSubmitting: form.formState.isSubmitting,
  }
}