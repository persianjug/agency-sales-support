"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

type AccountCreateFooterProps = {
  /** フォーム送信中の状態フラグ */
  isSubmitting: boolean;
  /** 対象フォームの id 属性（デフォルト: "account-create-form"） */
  formId?: string;
};

/**
 * アカウント登録画面の固定フッターアクションコンポーネント
 */
const AccountCreateFooter = ({
  isSubmitting,
  formId = "account-create-form",
}: AccountCreateFooterProps) => {
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
        {isSubmitting ? "作成中..." : "アカウントを作成する"}
      </Button>
    </div>
  );
};

export default AccountCreateFooter;