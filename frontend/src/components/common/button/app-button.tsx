import React from "react";
import Link from "next/link";
import { buttonVariants, Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Spinner } from "../../ui/spinner";

/**
 * shadcnのbuttonVariantsの型を活用
 */
type Variant = "default" | "outline" | "ghost" | "destructive" | "secondary" | "link";
type Size = "default" | "xs" | "sm" | "lg" | "icon" | "icon-xs" | "icon-sm" | "icon-lg";

/**
 * ベースのprops定義
 */
type BaseProps = {
  /** ボタンのラベルテキストや内部要素 */
  children?: React.ReactNode;
  /** 前置アイコン */
  startIcon?: React.ReactNode;
  /** 後置アイコン */
  endIcon?: React.ReactNode;
  /** スタイルバリエーション */
  variant?: Variant;
  /** サイズ */
  size?: Size;
  /** ローディング状態 */
  loading?: boolean;
};

/**
 * AppButton の props定義
 * href がある場合は Link 用の Props、ない場合は button 用の Props になる型定義
 */
type AppButtonProps = BaseProps &
  (
    | ({ href: string } & Omit<React.ComponentProps<typeof Link>, "href">)
    | ({ href?: never } & React.ComponentProps<"button">)
  );

/**
 * 共通ボタンコンポーネント
 * @param props - {@link AppButtonProps}
 * @returns JSX.Element - 共通ボタンコンポーネントUI
 */
export const AppButton = ({
  children,
  startIcon,
  endIcon,
  variant = "default",
  size = "default",
  loading = false,
  className,
  ...props
}: AppButtonProps) => {
  // ローディング中は Spinner を表示し、それ以外は startIcon を表示
  // 公式の指示通り data-icon="inline-start" を付与して適切な間隔を保つ
  const renderStartIcon = () => {
    if (loading) {
      return <Spinner data-icon="inline-start" className="shrink-0" />;
    }

    if (startIcon) {
      return (
        <span data-icon="inline-start" className="shrink-0">
          {startIcon}
        </span>
      );
    }
    return null;
  };

  // アイコンとテキストの配置コンテンツ
  const content = (
    <>
      {renderStartIcon()}
      {children}
      {endIcon && (
        <span data-icon="inline-end" className="shrink-0">
          {endIcon}
        </span>
      )}
    </>
  );

  // href が指定されている場合（ページ遷移用リンク）
  // <Link> として出力（公式推奨の buttonVariants を使用）
  if ("href" in props && props.href) {
    const { href, ...linkProps } = props;
    return (
      <Link
        href={href}
        className={cn(buttonVariants({ variant, size }), className)}
        {...linkProps}
      >
        {content}
      </Link>
    );
  }

  // href がない通常のボタン
  // 通常のボタン処理（フォーム送信やAPI呼び出し用）
  const { disabled, ...buttonProps } = props as React.ComponentProps<"button">;
  return (
    <Button
      variant={variant}
      size={size}
      disabled={disabled || loading} // ローディング中は自動で連打防止（disabled）にする
      className={className}
      {...buttonProps}
    >
      {content}
    </Button>
  );
};

export default AppButton;