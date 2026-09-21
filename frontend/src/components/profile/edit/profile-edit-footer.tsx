"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

type ProfileEditFooterProps = {
  /** フォーム送信中の状態フラグ */
  isSubmitting: boolean;
  /** 対象フォームの id 属性（デフォルト: "profile-edit-form"） */
  formId?: string;
};

/**
 * プロフィール編集画面の固定フッターアクションコンポーネント
 */
const ProfileEditFooter = ({
  isSubmitting,
  formId = "profile-edit-form",
}: ProfileEditFooterProps) => {
  const router = useRouter();

  return (
    <div className="flex justify-end gap-3 pt-4">
      <Button
        type="button"
        variant="outline"
        onClick={() => router.back()}
        disabled={isSubmitting}
        className="min-w-[100px]"
      >
        キャンセル
      </Button>
      <Button
        type="submit"
        form={formId}
        className="bg-emerald-600 hover:bg-emerald-700 text-white min-w-[120px]"
        disabled={isSubmitting}
      >
        {isSubmitting ? "保存中..." : "変更を保存"}
      </Button>
    </div>
  );
};

export default ProfileEditFooter;