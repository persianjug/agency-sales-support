"use client";

import { ArrowLeft, ChevronLeft, Plus } from "lucide-react";
import { AppButton } from "./app-button";
import { useRouter } from "next/navigation";

/**
 * アカウント追加ボタンのコンポーネント
 * @returns JSX.Element - ボタンUI
 */
export const BackButton = () => {
  const router = useRouter();

  return (
    <AppButton
      type="button"
      variant="outline"
      startIcon={<ChevronLeft />}
      onClick={() => router.back()}
    >
      前に戻る
    </AppButton>
  );
}

export default BackButton;