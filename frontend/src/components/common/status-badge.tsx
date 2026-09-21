import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

/**
 * バリアント定義
 */
export type StatusBadgeVariant =
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "neutral";


/**
 * バリアントごとのカラー定義（枠線・背景・テキスト・ダークモード対応）
 */
const variantClasses: Record<StatusBadgeVariant, string> = {
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
};

/**
 * インジケータードットの色定義
 */
const dotClasses: Record<StatusBadgeVariant, string> = {
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  danger: "bg-rose-500",
  info: "bg-sky-500",
  neutral: "bg-slate-400",
};

/**
 * ステータスバッジのコンポーネント Props
 */
type StatusBadgeProps = {
  children: React.ReactNode;
  variant?: StatusBadgeVariant;
  showDot?: boolean;
  className?: string;
};

/**
 * ステータスバッジのコンポーネント
 * @param props - {@link StatusBadgeProps}
 * @returns JSX.Element - ステータスバッジUI
*/
export const StatusBadge = ({
  children,
  variant = "neutral",
  showDot = true,
  className,
}: StatusBadgeProps) => {
  return (
    <Badge
      variant="outline"
      className={cn(
        "gap-1.5 font-medium px-2 py-0.5",
        variantClasses[variant],
        className
      )}
    >
      {showDot && (
        <span
          className={cn("h-1.5 w-1.5 shrink-0 rounded-full", dotClasses[variant])}
          aria-hidden
        />
      )}
      {children}
    </Badge>
  );
};

export default StatusBadge;