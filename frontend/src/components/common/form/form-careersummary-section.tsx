"use client";

import { UseFormReturn } from "react-hook-form";
import FormRow1Col from "./form-row-1col";
import { Textarea } from "../../ui/textarea";

/**
 * FormCareerSummarySection コンポーネントの Props 定義
 */
type FormCareerSummarySectionProps = {
  /** React Hook Form の form インスタンス */
  form: UseFormReturn<any>;
};

/**
 * 経歴入力のセクションフォーム
 *
 * @param props - {@link FormCareerSummarySectionProps}
 * @returns JSX.Element - 経歴入力UI
 */
export const FormCareerSummarySection = ({
  form,
}: FormCareerSummarySectionProps) => {
  return (
    <FormRow1Col label="業務経歴" contentClassName="p-2.5">
      <Textarea
        {...form.register("careerSummary")}
        rows={5}
        className="w-full resize-none leading-relaxed"
        placeholder="これまでの業務経歴や得意な領域をご入力ください"
      />
    </FormRow1Col>
  );
};

export default FormCareerSummarySection;