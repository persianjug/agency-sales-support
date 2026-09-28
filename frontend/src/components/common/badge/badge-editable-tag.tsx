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
    <Badge
      variant="outline"
      className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 font-normal px-3 py-3 text-xs rounded-full shadow-none flex items-center gap-1.5 transition-colors"
    >
      <span>{label}</span>
      <button
        type="button"
        onClick={onRemove}
        className="hover:bg-muted-foreground/20 rounded-full p-0.5 transition-colors"
        aria-label={`${label}を削除`}
      >
        <X className="w-3 h-3" />
      </button>
    </Badge>
  );
};

export default BadgeEditableTag;