"use client";

import { useAccountCreateForm } from "@/hooks/use-account-create-form";
import AccountCreateLoginInfoForm from "./account-create-login-info-form";
import AccountCreateRegistrationInfoForm from "./account-create-registration-info-form";
import AccountCreateSalesAttributeForm from "./account-create-sales-attribute-form";
import AccountCreateFooter from "./account-create-footer";
import { Certification, Specialty } from "@/types/api/common-type";

type AccountCreateFormProps = {
  /** 資格情報 */
  certifications: Certification[];
  /** 得意分野情報 */
  specialties: Specialty[];
};

/**
 * アカウント作成画面全体のコンテナコンポーネント
 *
 * @returns JSX.Element - アカウント作成画面UI
 */
const AccountCreateForm = ({certifications, specialties}: AccountCreateFormProps) => {
  const { form, handleSubmit, isSubmitting } = useAccountCreateForm();

  return (
    <div className="container max-w-5xl py-8 space-y-6">
      <form id="account-create-form" onSubmit={handleSubmit} className="space-y-6">
        {/* ログイン・アカウント情報の編集 */}
        <AccountCreateLoginInfoForm form={form} />

        {/* 登録情報の編集 */}
        <AccountCreateRegistrationInfoForm form={form} agencyName="" />

        {/* 連絡先・営業属性の編集 */}
        <AccountCreateSalesAttributeForm form={form} certificationsMast={certifications} specialtiesMast={specialties} />

        {/* フッター：ボタン */}
        <AccountCreateFooter isSubmitting={isSubmitting} />
      </form>
    </div>
  );
};

export default AccountCreateForm;