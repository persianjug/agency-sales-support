"use client";

import { UseFormReturn, useWatch } from "react-hook-form";
import FormRow1Col from "./form-row-1col";
import { Textarea } from "../../ui/textarea";

/**
 * FormGreetingMessageSection コンポーネントの Props 定義
 */
type FormGreetingMessageSectionProps = {
  /** React Hook Form の form インスタンス */
  form: UseFormReturn<any>;
};

/**
 * 挨拶メッセージ入力のセクションフォーム
 *
 * @param props - {@link FormGreetingMessageSectionProps}
 * @returns JSX.Element - 挨拶メッセージ入力UI
 */
export const FormGreetingMessageSection = ({
  form,
}: FormGreetingMessageSectionProps) => {

  /** アバターイニシャル用の姓をリアルタイム監視 */
  const lastName = useWatch({
    control: form.control,
    name: "lastName",
    defaultValue: "",
  });

  return (
    <FormRow1Col
      label="ご挨拶メッセージ"
      contentClassName="p-2.5"
      hasBorderBottom={false}
    >
      <Textarea
        {...form.register("greetingMessage")}
        rows={5}
        className="w-full resize-none leading-relaxed"
        placeholder="お客様へのご挨拶メッセージをご入力ください"
      />
    </FormRow1Col>
  );
};

export default FormGreetingMessageSection;