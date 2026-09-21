/**
 * 2列構成（ラベル+値が2セット）の行コンポーネントの Props
 */
type ProfileRow2ColProps = {
  /** 左側ラベル */
  label1: string;
  /** 左側表示値 */
  value1: React.ReactNode;
  /** 右側ラベル */
  label2: string;
  /** 右側表示値 */
  value2: React.ReactNode;
  /** 下線ボーダーを表示するかどうか */
  hasBorderBottom?: boolean;
  /** 左側ラベルの折り返し制御（whitespace-nowrapを付与するか） */
  nowrapLabel1?: boolean;
  /** 左側値のスタイルカスタマイズ */
  value1ClassName?: string;
};

/**
 * 1行2列（4グリッド）構成の共通行コンポーネント
 * @param props - {@link ProfileRow2ColProps}
 * @returns JSX.Element - 基本情報テーブル内の1行フォームUI
 */
const ProfileRow2Col = ({
  label1,
  value1,
  label2,
  value2,
  hasBorderBottom = true,
  nowrapLabel1 = false,
  value1ClassName = "",
}: ProfileRow2ColProps) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-12 ${hasBorderBottom ? "border-b" : ""}`}>
      <div
        className={`
          md:col-span-2 bg-muted/60 p-3 font-medium text-muted-foreground border-r flex items-center
          ${nowrapLabel1 ? "whitespace-nowrap" : ""}`}
      >
        {label1}
      </div>
      <div className={`md:col-span-4 p-3 font-medium flex items-center border-r ${value1ClassName}`}>
        {value1}
      </div>
      <div className="md:col-span-2 bg-muted/60 p-3 font-medium text-muted-foreground border-r flex items-center">
        {label2}
      </div>
      <div className="md:col-span-4 p-3 font-medium flex items-center">
        {value2}
      </div>
    </div>
  );
};

export default ProfileRow2Col;