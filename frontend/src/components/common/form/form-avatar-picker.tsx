"use client";

import { useState } from "react";
import { Control, FieldValues, Path, useController } from "react-hook-form";
import { RadioGroup } from "@/components/ui/radio-group";
import AvatarModeOption from "./form-avatar-mode-option";
import AvatarPresetSelector from "./form-avatar-preset-selector";
import AvatarUploadDropzone from "./form-avatar-upload-dropzone";

/**
 * FormAvatarPicker コンポーネントの Props 型定義
 *
 * @template T - フォームの値の型（FieldValuesを継承）
 */
type FormAvatarPickerProps<T extends FieldValues> = {
  /** React Hook Form の control インスタンス */
  control: Control<T>;
  /** アバター画像のフォームキー名（デフォルト: "avatarUrl"） */
  name?: Path<T>;
  /** イニシャル表示用の名前（デフォルト: "山"） */
  initialName?: string;
};

/**
 * ラジオボタン切替式 アバター選択・アップロード統合コンポーネント
 *
 * @template T - フォームの値の型
 * @param props - {@link FormAvatarPickerProps}
 * @returns JSX.Element - プリセット選択／アップロード動的切替UI
 *
 * @remarks
 * - 「プリセット選択」と「画像アップロード」の2モードをラジオボタンで動的に切り替えます。
 * - React Hook Form の `useController` と連携し、選択した画像URLをフォーム値（RHF）に自動同期します。
 */
export const FormAvatarPicker = <T extends FieldValues>({
  control,
  name = "avatarUrl" as Path<T>,
  initialName = "山",
}: FormAvatarPickerProps<T>) => {
  const [mode, setMode] = useState<"preset" | "upload">("preset");

  const {
    field: { value, onChange },
  } = useController({
    control,
    name,
  });

  return (
    <div className="space-y-4 py-2">
      <RadioGroup
        value={mode}
        onValueChange={(val) => setMode(val as "preset" | "upload")}
        className="space-y-4"
      >
        {/* 1. プリセット選択 */}
        <AvatarModeOption value="preset" label="プリセットから選択（デフォルト）">
          {mode === "preset" && (
            <AvatarPresetSelector
              selectedValue={value}
              initialName={initialName}
              onSelect={onChange}
            />
          )}
        </AvatarModeOption>

        {/* 2. 画像アップロード */}
        <AvatarModeOption value="upload" label="画像をアップロード">
          {mode === "upload" && (
            <AvatarUploadDropzone currentValue={value} onSelect={onChange} />
          )}
        </AvatarModeOption>
      </RadioGroup>
    </div>
  );
};

export default FormAvatarPicker;