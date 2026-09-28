"use client";

import AppBadge from "../badge/app-badge";

/**
 * FormSectionHeader コンポーネントの Props 型定義
 */
type FormSectionHeaderProps = {
  /** セクションのタイトル（例: "ログイン・アカウント情報"） */
  title: string;
  /** バッジの種類 ('required' | 'optional' | 'recommended') */
  badgeType?: 'required' | 'optional' | 'recommended';
  /** 任意のコンテンツ */
  children?: React.ReactNode;
};

/**
 * フォームのカテゴリ大見出し（バッジ付き）コンポーネント
 *
 * @param props - {@link FormSectionHeaderProps}
 * @returns JSX.Element - 見出しと状態バッジを並べたUI
 */
export const FormSectionHeader = ({
  title,
  badgeType,
  children = undefined,
}: FormSectionHeaderProps) => {
  const badgeLabel = 
    badgeType === "required" ? "必須" :
    badgeType === "optional" ? "任意" :
    badgeType === "recommended" ? "推奨" : "";

  return (
    <div className="flex items-center gap-2 mb-2">
      <h3 className="text-base font-bold text-foreground">{title}</h3>
      {badgeType && <AppBadge variant={badgeType}>{badgeLabel}</AppBadge>}
      {children}
    </div>
  );
};

export default FormSectionHeader;