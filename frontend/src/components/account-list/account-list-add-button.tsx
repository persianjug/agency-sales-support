"use client";

import { Plus } from "lucide-react";
import { AppButton } from "../common/button/app-button";

/**
 * アカウント追加ボタンのコンポーネント
 * @returns JSX.Element - ボタンUI
 */
export const AccountListAddButton = () => {
  return (
    <AppButton
      href="/account-create"
      variant="default"
      startIcon={<Plus className="size-4" />}
    >
      新規アカウント追加
    </AppButton>
  );
}

export default AccountListAddButton;