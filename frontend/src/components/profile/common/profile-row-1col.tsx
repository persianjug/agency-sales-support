/**
 * 1行1列（ラベル + フォームコンテンツ）構成の行コンポーネント Props
 */
type ProfileRow1ColProps = {
  /** 左側ラベルテキスト */
  label: string;
  /** 右側フォーム入力コンテンツ */
  children: React.ReactNode;
  /** 下線ボーダーを表示するかどうか */
  hasBorderBottom?: boolean;
  /** 右側コンテンツコンテナのパディング用クラス */
  contentClassName?: string;
};

/**
 * 1行1列共通ラッパーコンポーネント
 * @param props - {@link ProfileRow1ColProps}
 * @returns JSX.Element - 編集フォーム用の1行フォームUI
*/
const ProfileRow1Col = ({
  label,
  children,
  hasBorderBottom = true,
  contentClassName = "p-3",
}: ProfileRow1ColProps) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-12 ${hasBorderBottom ? "border-b" : ""}`}>
      <div className="md:col-span-2 bg-muted/60 p-3 font-medium text-muted-foreground border-r flex items-center">
        {label}
      </div>
      <div className={`md:col-span-10 ${contentClassName}`}>{children}</div>
    </div>
  );
};

export default ProfileRow1Col;