"use client";

import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

/**
 * BadgeEditableTag コンポーネントの Props 定義
 */
type BadgeEditableTagProps = {
  /** タグとして表示するラベルテキスト */
  label: string;
  /** 削除ボタン押下時のハンドラー */
  onRemove: () => void;
};

/**
 * 削除ボタン（×印）が付いた編集可能タグコンポーネント
 *
 * @param props - {@link BadgeEditableTagProps}
 * @returns JSX.Element - 削除ボタン付きのバッジUI
 */
export const BadgeEditableTag = ({ label, onRemove }: BadgeEditableTagProps) => {
  return (
    <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-emerald-200 font-normal px-3 py-1 text-xs rounded-full shadow-none flex items-center gap-1.5">
      <span>{label}</span>
      <button
        type="button"
        onClick={onRemove}
        className="hover:bg-emerald-300/60 rounded-full p-0.5 text-emerald-900 transition-colors"
        aria-label={`${label}を削除`}
      >
        <X className="w-3 h-3" />
      </button>
    </Badge>
  );
};

export default BadgeEditableTag;