"use client";

import { Badge } from "@/components/ui/badge";

/** バッジの種別型定義 */
export type BadgeType = "required" | "optional" | "recommended";

/**
 * バッジの設定情報（スタイル・表示ラベル）を定義するオブジェクト
 */
const BADGE_CONFIG: Record<
  BadgeType,
  { label: string; variant?: "default" | "outline"; className: string }
> = {
  required: {
    label: "必須",
    className:
      "bg-red-600 hover:bg-red-600 text-white border-transparent text-[11px] px-2 py-0.5",
  },
  optional: {
    label: "任意",
    variant: "outline",
    className: "text-muted-foreground text-[11px] px-2 py-0.5",
  },
  recommended: {
    label: "推奨",
    className:
      "bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300 border-transparent text-[11px] px-2 py-0.5",
  },
};

/**
 * FormBadge コンポーネントの Props 型定義
 */
type FormBadgeProps = {
  /** バッジ種別 ('required' | 'optional' | 'recommended') */
  type: BadgeType;
  /** 追加で適用するカスタムクラス（主にマージン調整用） */
  className?: string;
};

/**
 * フォーム用の状態表示バッジ（必須・任意・推奨）
 *
 * @param props - {@link FormBadgeProps}
 * @returns JSX.Element - スタイル定義済みの Badge コンポーネント
 *
 * @remarks
 * - 表示設定は `BADGE_CONFIG` オブジェクトで一元管理しています。
 * - 新しいバッジ種別を追加する場合は `BadgeType` と `BADGE_CONFIG` を更新してください。
 */
export const FormBadge = ({ type, className = "" }: FormBadgeProps) => {
  const config = BADGE_CONFIG[type];

  if (!config) return null;

  return (
    <Badge
      variant={config.variant ?? "default"}
      className={`${config.className} ${className}`}
    >
      {config.label}
    </Badge>
  );
};

export default FormBadge;