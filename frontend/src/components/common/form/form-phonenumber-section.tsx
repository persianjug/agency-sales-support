"use client";

import { UseFormReturn, useWatch } from "react-hook-form";
import FormRow1Col from "./form-row-1col";
import ControlledInput from "../../ui/controlled-input";

/**
 * FormPhonenumberSection コンポーネントの Props 定義
 */
type FormPhonenumberSectionProps = {
  /** React Hook Form の form インスタンス */
  form: UseFormReturn<any>;
};

/**
 * 電話番号入力のセクションフォーム
 *
 * @param props - {@link FormPhonenumberSectionProps}
 * @returns JSX.Element - 電話番号入力UI
 */
export const FormPhonenumberSection = ({
  form,
}: FormPhonenumberSectionProps) => {

  /** アバターイニシャル用の姓をリアルタイム監視 */
  const lastName = useWatch({
    control: form.control,
    name: "lastName",
    defaultValue: "",
  });

  return (
    <FormRow1Col label="営業用電話番号" contentClassName="p-2.5">
      <div className="max-w-md">
        <ControlledInput
          control={form.control}
          name="phoneNumber"
          placeholder="営業用電話番号（例: 090-1234-5678）"
        />
      </div>
    </FormRow1Col>
  );
};

export default FormPhonenumberSection;