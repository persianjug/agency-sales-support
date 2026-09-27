import React from "react";

type PageContainerProps = {
  /** ページタイトル */
  title: string;
  /** タイトルの横に表示する件数やバッジ情報（任意） */
  badge?: React.ReactNode;
  /** タイトルの下に表示する補足説明テキスト（任意） */
  description?: string;
  /** タイトルの右側に配置するアクションボタン等（任意） */
  action?: React.ReactNode;
  /** ページのメインコンテンツ */
  children: React.ReactNode;
};

/**
 * ヘッダー位置を共通ラッパーコンポーネント
 * @param props - {@link PageContainerProps}
 * @returns JSX.Element - ヘッダー位置を共通ラッパーコンポーネントUI
 */
export const PageContainer = ({
  title,
  badge,
  description,
  action,
  children,
}: PageContainerProps) => {
  return (
    <div className="container flex-1 space-y-6 p-6">
      {/* ヘッダーエリア */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            {/* タイトル */}
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              {title}
            </h1>
            {/* badge が指定されていればタイトルの横に自動で控えめな文字で表示 */}
            {badge && (
              <span className="text-sm font-normal text-muted-foreground">
                {badge}
              </span>
            )}
          </div>
          {/* 説明文 */}
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        {/* アクションボタン等 */}
        {action && <div className="shrink-0">{action}</div>}
      </div>

      {/* メインコンテンツエリア */}
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
};

export default PageContainer;