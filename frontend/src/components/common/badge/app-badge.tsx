"use client";

import * as React from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

/**
 * AppBadge のバリアント定義
 */
export type AppBadgeVariant =
  // ステータス系
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "neutral"
  // フォーム属性系
  | "required"
  | "optional"
  | "recommended"
  // 汎用・タグ系
  | "primary";

/**
 * バリアントごとのスタイリング定義
 */
const variantClasses: Record<AppBadgeVariant, string> = {
  // ステータス系
  success:
    "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
  warning:
    "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300",
  danger:
    "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-800 dark:bg-rose-950 dark:text-rose-300",
  info:
    "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-800 dark:bg-sky-950 dark:text-sky-300",
  neutral:
    "border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300",

  // フォーム属性系
  required:
    "bg-red-600 hover:bg-red-600 text-white border-transparent text-[11px] px-2 py-0.5",
  optional:
    "border-slate-300 text-muted-foreground text-[11px] px-2 py-0.5",
  recommended:
    "bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300 border-transparent text-[11px] px-2 py-0.5",

  // 汎用・タグ系
  primary:
    "bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 rounded-full font-normal px-3 py-1 text-xs shadow-none",
};

/**
 * インジケータードットの色定義（ステータス用）
 */
const dotClasses: Partial<Record<AppBadgeVariant, string>> = {
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  danger: "bg-rose-500",
  info: "bg-sky-500",
  neutral: "bg-slate-400",
};

/**
 * AppBadge コンポーネントの Props 型定義
 */
export type AppBadgeProps = React.HTMLAttributes<HTMLDivElement> & {
  /** バッジの表示スタイルバリアント */
  variant?: AppBadgeVariant;
  /** ステータス用の先頭ドットを表示するか */
  showDot?: boolean;
  /** 削除ボタン表示＆押下時ハンドラー（タグ用途） */
  onRemove?: () => void;
  /** 削除ボタンのアクセシビリティラベル */
  removeAriaLabel?: string;
  /** 子要素（テキスト等） */
  children?: React.ReactNode;
};

/**
 * 統合共通バッジコンポーネント (AppBadge)
 *
 * @param props - {@link AppBadgeProps}
 * @returns ステータス表示・フォームの必須/任意ラベル・削除可能タグに対応した Badge UI
 */
export const AppBadge = ({
  variant = "neutral",
  showDot = false,
  onRemove,
  removeAriaLabel = "削除",
  className,
  children,
  ...props
}: AppBadgeProps) => {
  return (
    <Badge
      variant="outline"
      className={cn(
        "gap-1.5 font-medium transition-colors inline-flex items-center shrink-0",
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {/* ステータスドット表示 */}
      {showDot && dotClasses[variant] && (
        <span
          className={cn("h-1.5 w-1.5 shrink-0 rounded-full", dotClasses[variant])}
          aria-hidden
        />
      )}

      {/* メインテキスト */}
      <span>{children}</span>

      {/* タグ用削除ボタン（×印） */}
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="hover:bg-muted-foreground/20 rounded-full p-0.5 transition-colors -mr-1"
          aria-label={removeAriaLabel}
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </Badge>
  );
};

export default AppBadge;