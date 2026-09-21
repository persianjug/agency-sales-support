"use client";

import { useProfileEditForm } from "@/hooks/use-profile-edit-form";
import { ProfileGetApiResponse } from "@/types/api/profile-type";
import { Certification, Specialty } from "@/types/api/common-type";
import ProfileHeader from "../common/profile-header";
import ProfileViewRegistrationInfo from "../view/profile-view-registration-Info";
import ProfileEditSalesAttributeForm from "./profile-edit-sales-attribute-form";
import ProfileEditFooter from "./profile-edit-footer";

/**
 * ProfileEditForm コンポーネントの Props 定義
 */
type ProfileEditFormProps = {
  /** ユーザープロフィール情報 */
  profile: ProfileGetApiResponse;
  /** 資格情報 */
  certifications: Certification[];
  /** 得意分野情報 */
  specialties: Specialty[];
};

/**
 * プロフィール編集画面全体のコンテナコンポーネント
 *
 * @param props - {@link ProfileEditFormProps}
 * @returns JSX.Element - プロフィール編集画面UI
 */
const ProfileEditForm = ({ profile, certifications, specialties }: ProfileEditFormProps) => {
  const { form, handleSubmit, isSubmitting } = useProfileEditForm(profile);

  return (
    <div className="container max-w-5xl py-8 space-y-6">
      {/* ヘッダー */}
      <ProfileHeader profile={profile} />

      <form id="profile-edit-form" onSubmit={handleSubmit} className="space-y-6">
        {/* 登録情報（閲覧専用） */}
        <ProfileViewRegistrationInfo profile={profile} />

        {/* 連絡先・営業属性の編集 */}
        <ProfileEditSalesAttributeForm form={form} certificationsMast={certifications} specialtiesMast={specialties} />

        {/* フッター：ボタン */}
        <ProfileEditFooter isSubmitting={isSubmitting} />
      </form>
    </div>
  );
};

export default ProfileEditForm;