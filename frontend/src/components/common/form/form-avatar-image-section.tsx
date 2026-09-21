"use client";

import { UseFormReturn, useWatch } from "react-hook-form";
import FormRow1Col from "./form-row-1col";
import AvatarPicker from "./form-avatar-picker";

/**
 * FormAvatarImageSection コンポーネントの Props 定義
 */
type FormAvatarImageSectionProps = {
  /** React Hook Form の form インスタンス */
  form: UseFormReturn<any>;
};

/**
 * アバター選択入力のセクションフォーム
 *
 * @param props - {@link FormAvatarImageSectionProps}
 * @returns JSX.Element - アバター選択入力UI
 */
export const FormAvatarImageSection = ({
  form,
}: FormAvatarImageSectionProps) => {

  /** アバターイニシャル用の姓をリアルタイム監視 */
  const lastName = useWatch({
    control: form.control,
    name: "lastName",
    defaultValue: "",
  });

  return (
    <FormRow1Col label="アバター画像" contentClassName="p-3">
      <AvatarPicker
        control={form.control}
        name="avatarUrl"
        initialName={lastName ? lastName.slice(0, 1) : "山"}
      />
    </FormRow1Col>
  );
};

export default FormAvatarImageSection;