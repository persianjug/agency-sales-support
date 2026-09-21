"use client";

import { Lock } from "lucide-react";

/**
 * ViewSectionHeader コンポーネントの Props 型定義
 */
type ViewSectionHeaderProps = {
  /** セクションのタイトル（例: "ログイン・アカウント情報"） */
  title: string;
  /** 任意のコンテンツ */
  children?: React.ReactNode;
};

/**
 * 表示専用のカテゴリ大見出し（バッジ付き）コンポーネント
 *
 * @param props - {@link ViewSectionHeaderProps}
 * @returns JSX.Element - 見出しと状態バッジを並べたUI
 */
export const ViewSectionHeader = ({
  title,
  children = undefined,
}: ViewSectionHeaderProps) => {
  return (
    <div className="flex items-center gap-2 mb-2">
      <h3 className="text-base font-bold text-foreground">{title}</h3>
        <span className="text-xs text-muted-foreground flex items-center gap-1 bg-muted px-2.5 py-1 rounded-full">
          <Lock className="w-3 h-3" /> 登録情報は管理者のみ変更可能です
        </span>
        {children}
    </div>
  );
};

export default ViewSectionHeader;