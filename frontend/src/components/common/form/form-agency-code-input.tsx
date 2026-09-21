"use client";

import { Control, FieldValues, Path, useWatch } from "react-hook-form";
import ControlledInput from "@/components/ui/controlled-input";

/**
 * FormAgencyCodeInput コンポーネントの Props 型定義
 *
 * @template T - フォームの値の型（FieldValuesを継承）
 */
type FormAgencyCodeInputProps<T extends FieldValues> = {
  /** React Hook Form の control インスタンス */
  control: Control<T>;
  /** 代理店コードフィールドのフォームキー名（デフォルト: "agencyCode"） */
  name?: Path<T>;
  /** 代理店名（コード入力に応じて外部から渡される、またはAPI等で取得した値） */
  agencyName?: string;
  /** コード入力欄のプレースホルダー */
  placeholder?: string;
  /** 入力不可状態フラグ */
  disabled?: boolean;
};

/**
 * 代理店コード入力 ＋ 代理店名表示コンポーネント
 *
 * @template T - フォームの値の型
 * @param props - {@link FormAgencyCodeInputProps}
 * @returns JSX.Element - 代理店コード入力と代理店名表示の横並びUI
 *
 * @remarks
 * - 左側に入力フィールド、右側に自動補完された代理店名を表示するレイアウトです。
 * - コードが未入力または該当なしの場合はプレースホルダーテキストを表示します。
 */
export const FormAgencyCodeInput = <T extends FieldValues>({
  control,
  name = "agencyCode" as Path<T>,
  agencyName,
  placeholder = "代理店コードを入力",
  disabled = false,
}: FormAgencyCodeInputProps<T>) => {
  // コードのリアルタイム入力を監視（必要に応じて連携ロジックに使用可能）
  const codeValue = useWatch({
    control,
    name,
  });

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
      {/* 代理店コード入力欄 */}
      <div className="w-full sm:w-64 shrink-0">
        <ControlledInput
          control={control}
          name={name}
          placeholder={placeholder}
          disabled={disabled}
        />
      </div>

      {/* 代理店名表示エリア */}
      <div className="flex items-center min-h-[40px] px-3 py-2 bg-muted/40 rounded-md border text-sm w-full sm:w-auto min-w-[200px]">
        {agencyName ? (
          <span className="font-medium text-foreground">{agencyName}</span>
        ) : (
          <span className="text-muted-foreground text-xs">
            {codeValue
              ? "該当する代理店を探しています..."
              : "※コード入力後に代理店名が表示されます"}
          </span>
        )}
      </div>
    </div>
  );
};

export default FormAgencyCodeInput;