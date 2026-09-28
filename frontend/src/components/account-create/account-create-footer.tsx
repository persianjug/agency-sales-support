"use client";

import { useRouter } from "next/navigation";
import AppButton from "../common/button/app-button";

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
      <AppButton
        type="button"
        variant="outline"
        onClick={() => router.back()}
        disabled={isSubmitting}
        className="min-w-[100px]"
      >
        キャンセル
      </AppButton>
      <AppButton
        type="submit"
        form={formId}
        disabled={isSubmitting}
        loading={isSubmitting}
        className="min-w-[120px]"
      >
        アカウントを作成する
      </AppButton>
    </div>
  );
};

export default AccountCreateFooter;