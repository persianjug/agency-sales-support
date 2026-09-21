"use client";

import { Control, FieldValues, Path, useWatch } from "react-hook-form";
import ControlledInput from "@/components/ui/controlled-input";
import PasswordStrengthMeter from "./form-password-strength-meter";

/**
 * FormPasswordSetupFields コンポーネントの Props 型定義
 *
 * @template T - フォームの値の型（FieldValuesを継承）
 */
type FormPasswordSetupFieldsProps<T extends FieldValues> = {
  /** React Hook Form の control インスタンス */
  control: Control<T>;
  /** パスワードフィールドのフォームキー名（デフォルト: "password"） */
  passwordName?: Path<T>;
  /** パスワード確認フィールドのフォームキー名（デフォルト: "confirmPassword"） */
  confirmPasswordName?: Path<T>;
  /** パスワード入力欄のラベル（デフォルト: "初期パスワード"） */
  passwordLabel?: string;
  /** パスワード確認入力欄のラベル（デフォルト: "初期パスワード（確認）"） */
  confirmPasswordLabel?: string;
};

/**
 * パスワード入力・強度メーター・確認用パスワード入力をセットにした共通フォームコンポーネント
 *
 * @template T - フォームの値の型
 * @param props - {@link FormPasswordSetupFieldsProps}
 * @returns JSX.Element - パスワード設定フィールド群UI
 *
 * @remarks
 * - React Hook Form の `useWatch` を使用して、パスワードの入力をリアルタイムに監視し、`PasswordStrengthMeter` に渡します。
 * - 既存の `ControlledInput` を活用し、各フィールドの表示ラベルやキー名を Props でフレキシブルに変更可能です。
 */
export const FormPasswordSetupFields = <T extends FieldValues>({
  control,
  passwordName = "password" as Path<T>,
  confirmPasswordName = "confirmPassword" as Path<T>,
  passwordLabel = "初期パスワード",
  confirmPasswordLabel = "初期パスワード（確認）",
}: FormPasswordSetupFieldsProps<T>) => {
  // パスワードのリアルタイム入力を監視して強度メーターに渡す
  const passwordValue = useWatch({
    control,
    name: passwordName,
  });

  return (
    <div className="space-y-4 pt-2">
      {/* 初期パスワード入力欄 */}
      <div className="grid gap-2">
        <ControlledInput
          control={control}
          name={passwordName}
          label={passwordLabel}
          type="password"
          placeholder="半角英数字記号（8文字以上）"
          autoComplete="new-password"
        />
        {/* パスワード強度メーター */}
        <PasswordStrengthMeter password={passwordValue} />
      </div>

      {/* 初期パスワード（確認）入力欄 */}
      <div className="grid gap-2">
        <ControlledInput
          control={control}
          name={confirmPasswordName}
          label={confirmPasswordLabel}
          type="password"
          placeholder="もう一度入力してください"
          autoComplete="new-password"
        />
      </div>
    </div>
  );
};

export default FormPasswordSetupFields;