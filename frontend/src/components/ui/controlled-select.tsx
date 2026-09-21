"use client";

import { Control, FieldValues, Path, useController } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertCircle } from "lucide-react";

/**
 * 選択肢データの型定義
 */
export type SelectOption = {
  value: string;
  label: string;
};

/**
 * ControlledSelect コンポーネントの Props 型定義
 */
type ControlledSelectProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  placeholder?: string;
  options: readonly SelectOption[] | SelectOption[];
  disabled?: boolean;
};

/**
 * react-hook-form と UI ライブラリの Select を接続する汎用選択コンポーネント
 */
export const ControlledSelect = <T extends FieldValues>({
  control,
  name,
  label,
  placeholder = "選択してください",
  options,
  disabled = false,
}: ControlledSelectProps<T>) => {
  const {
    field,
    fieldState: { invalid, error },
  } = useController({
    name,
    control,
  });

  /** 現在選択されている option を探して日本語ラベルを取得 */
  const selectedOption = options.find((opt) => opt.value === field.value);

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {/* Labelが指定されている場合のみ表示 */}
      {label && (
        <label
          htmlFor={`field-select-${name}`}
          className="font-medium text-xs text-foreground"
        >
          {label}
        </label>
      )}

      <Select
        value={field.value ?? ""}
        onValueChange={field.onChange}
        disabled={disabled}
      >
        <SelectTrigger
          id={`field-select-${name}`}
          aria-invalid={invalid}
          className="w-full focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0"
        >
          {/* selectedOption が見つかればその label を表示し、なければ placeholder を表示 */}
          <SelectValue placeholder={placeholder} >
            {selectedOption?.label}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* ControlledInputと統一したエラーメッセージUI */}
      {invalid && (
        <div
          id={`field-select-${name}-error`}
          role="alert"
          className="flex items-center gap-1 text-[10px] sm:text-[11px] font-normal text-destructive leading-none -mt-0.5"
        >
          <AlertCircle className="h-3 w-3 shrink-0" />
          <span>{error?.message}</span>
        </div>
      )}
    </div>
  );
};

export default ControlledSelect;