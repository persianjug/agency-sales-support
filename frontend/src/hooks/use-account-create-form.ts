import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createAccountAction } from "@/actions/account-action";
import { AccountCreateFormValues, accountCreateSchema } from "@/lib/validations/account-schema";
import { toast } from "sonner";

/**
 * アカウント作成フォームのステート管理および送信処理を提供するカスタムフック
 *
 * @returns オブジェクト
 * - `form`: react-hook-form のフォームオブジェクト
 * - `handleSubmit`: フォーム送信用のイベントハンドラー
 * - `isSubmitting`: 送信処理中フラグ
 *
 * @remarks
 * - Zod スキーマ（`accountFormSchema`）を使用したバリデーションを適用します。
 * - フォーム送信時には `updateProfileAction` (Server Action) を呼び出して更新処理を実行します。
 * - 変更成功時はトースト表示後、指定のリダイレクト先（`from` パラメータまたはデフォルトホーム）へ遷移します。
 */
export const useAccountCreateForm = () => {
  const router = useRouter();

  const form = useForm<AccountCreateFormValues>({
    resolver: zodResolver(accountCreateSchema),
    values: {
      email: "",
      passwordType: "auto",
      lastName: "",
      firstName: "",
      lastNameKana: "",
      firstNameKana: "",
      agencyCode: "",
      solicitorCode: "",
      solicitorRegistrationNumber: "",
      role: "ROLE_USER",
      certifications: [],
      specialties: []
    },
  });

  /**
  * フォームのバリデーション成功時に呼び出される送信ハンドラー
  *
  * @param values - フォームから受け取る入力値（`AccountCreateFormValues`）
  */
  const onSubmit = async (values: AccountCreateFormValues) => {
    try {
      // アカウント作成
      const result = await createAccountAction(values);

      // アカウント作成失敗時：トースト表示
      if (!result.success) {
        toast.error(result.message || "アカウントの作成に失敗しました");
        return;
      }

      // アカウント作成成功時：トースト表示
      toast.success("アカウントの作成をしました");

      // アカウント作成成功時：ダッシュボードへ遷移し、キャッシュを更新
      router.push("/");
      router.refresh();

    } catch (error) {
      console.error("Account Create Submit Error:", error);
      toast.error("予期せぬエラーが発生しました");
    }
  };

  return {
    form,
    handleSubmit: form.handleSubmit(onSubmit),
    isSubmitting: form.formState.isSubmitting,
  };
}
