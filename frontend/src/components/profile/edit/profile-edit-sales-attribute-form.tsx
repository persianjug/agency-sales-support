"use client";

import { UseFormReturn, useWatch } from "react-hook-form";
import { Certification, Specialty } from "@/types/api/common-type";
import FormSectionHeader from "@/components/common/form/form-section-header";
import FormPhonenumberSection from "@/components/common/form/form-phonenumber-section";
import FormCertificationSection from "@/components/common/form/form-certification-section";
import FormSpecialtySection from "@/components/common/form/form-specialty-section";
import FormCareerSummarySection from "@/components/common/form/form-careersummary-section";
import FormGreetingMessageSection from "@/components/common/form/form-greetingmessage-section";

/**
 * ProfileEditSalesAttributeForm コンポーネントの Props 定義
 */
type ProfileEditSalesAttributeFormProps = {
  /** React Hook Form の form インスタンス */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>;
  /** 資格のマスタ情報 */
  certificationsMast: Certification[];
  /** 得意分野のマスタ情報 */
  specialtiesMast: Specialty[];
};

/**
 * アカウント作成における「連絡先・営業属性」セクションフォーム
 *
 * @param props - {@link ProfileEditSalesAttributeFormProps}
 * @returns JSX.Element - アバター選択・電話番号・資格・得意分野・経歴・挨拶メッセージ入力UI
 */
export const ProfileEditSalesAttributeForm = ({
  form,
  certificationsMast = [],
  specialtiesMast = [],
}: ProfileEditSalesAttributeFormProps) => {

  /** アバターイニシャル用の姓をリアルタイム監視 */
  const lastName = useWatch({
    control: form.control,
    name: "lastName",
    defaultValue: "",
  });

  return (
    <div className="space-y-2">
      {/* セクションヘッダー（タイトル: 連絡先・営業属性 / バッジ: 任意） */}
      <FormSectionHeader title="連絡先・営業属性" badgeType="optional" />

      <div className="border rounded-md overflow-hidden text-sm bg-background shadow-sm">
        {/* 営業用電話番号 */}
        <FormPhonenumberSection form={form} />

        {/* 保有資格 */}
        <FormCertificationSection
          form={form}
          certificationsMast={certificationsMast}
        />

        {/* 得意分野 */}
        <FormSpecialtySection
          form={form}
          specialtiesMast={specialtiesMast}
        />

        {/* 業務経歴 */}
        <FormCareerSummarySection form={form} />

        {/* ご挨拶メッセージ（最下行のため border なし） */}
        <FormGreetingMessageSection form={form} />
      </div>
    </div>
  );
};

export default ProfileEditSalesAttributeForm;