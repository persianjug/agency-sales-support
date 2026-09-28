"use client";

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { cn } from "@/lib/utils";

/**
 * FormAutocompleteSelect コンポーネントの Props 定義
 */
type FormAutocompleteSelectProps = {
  /** ドロップダウンの選択肢一覧 */
  items: readonly string[] | string[];
  /** 現在選択されている値 */
  value?: string;
  /** 値が変更・選択されたときのハンドラー */
  onValueChange: (value: string | null) => void;
  /** プレースホルダー文字列 */
  placeholder?: string;
  /** 一致する項目がない場合のメッセージ */
  emptyMessage?: string;
  /** 入力枠のCSSクラス名 */
  className?: string;
};

/**
 * サジェスト・検索機能が付いた汎用ドロップダウン（Combobox）コンポーネント
 *
 * @param props - {@link FormAutocompleteSelectProps}
 * @returns JSX.Element - 検索入力機能付きの Combobox UI
 */
export const FormAutocompleteSelect = ({
  items,
  value,
  onValueChange,
  placeholder = "入力して検索...",
  emptyMessage = "一致する項目が見つかりません",
  className = "h-9",
}: FormAutocompleteSelectProps) => {
  return (
    <Combobox items={items} value={value} onValueChange={onValueChange}>
      <ComboboxInput
        placeholder={placeholder}
        className={
          cn(
            className,
            "focus-visible:ring-1 focus-visible:ring-ring focus-visible:border-ring"
          )}
        showClear
      />
      <ComboboxContent>
        <ComboboxEmpty>{emptyMessage}</ComboboxEmpty>
        <ComboboxList>
          {(item) => (
            <ComboboxItem key={item} value={item}>
              {item}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
};

export default FormAutocompleteSelect;