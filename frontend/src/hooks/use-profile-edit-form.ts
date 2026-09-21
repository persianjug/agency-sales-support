import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateProfileAction } from "@/actions/profile-action";
import { profileUpdateFormSchema, ProfileUpdateFormValues } from "@/lib/validations/profile-schema";
import { ProfileGetApiResponse } from "@/types/api/profile-type";
import { toast } from "sonner";

/**
 * プロフィール編集フォームのステート管理および送信処理を提供するカスタムフック
 *
 * @returns オブジェクト
 * - `form`: react-hook-form のフォームオブジェクト
 * - `handleSubmit`: フォーム送信用のイベントハンドラー
 * - `isSubmitting`: 送信処理中フラグ
 *
 * @remarks
 * - Zod スキーマ（`profileUpdateFormSchema`）を使用したバリデーションを適用します。
 * - フォーム送信時には `updateProfileAction` (Server Action) を呼び出して更新処理を実行します。
 * - 変更成功時はトースト表示後、指定のリダイレクト先（`from` パラメータまたはデフォルトホーム）へ遷移します。
 */
export const useProfileEditForm = (profile: ProfileGetApiResponse) => {
  const router = useRouter();

  const form = useForm<ProfileUpdateFormValues>({
    resolver: zodResolver(profileUpdateFormSchema),
    values: {
      avatarUrl: profile.avatarUrl,
      careerSummary: profile.careerSummary,
      greetingMessage: profile.greetingMessage,
      phoneNumber: profile.phoneNumber,
      certifications: profile.certifications || [],
      specialties: profile.specialties || [],
    },
  });

  /**
  * フォームのバリデーション成功時に呼び出される送信ハンドラー
  *
  * @param data - フォームから受け取る入力値（`ProfileUpdateFormValues`）
  */
  const onSubmit = async (values: ProfileUpdateFormValues) => {
    try {
      // プロフィール更新
      const result = await updateProfileAction(values);

      // プロフィール更新失敗時：トースト表示
      if (!result.success) {
        toast.error(result.message || "プロフィールの更新に失敗しました");
        return;
      }

      // プロフィール更新成功時：トースト表示
      toast.success("プロフィールの更新をしました");

      // プロフィール更新成功時：詳細画面へ遷移し、キャッシュを更新
      router.push("/profile");
      router.refresh();

    } catch (error) {
      console.error("Profile Update Submit Error:", error);
      toast.error("予期せぬエラーが発生しました");
    }
  };

  return {
    form,
    handleSubmit: form.handleSubmit(onSubmit),
    isSubmitting: form.formState.isSubmitting,
  };
}
