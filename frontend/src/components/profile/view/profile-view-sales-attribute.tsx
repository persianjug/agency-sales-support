import ProfileRow1Col from "../common/profile-row-1col";
import { ProfileGetApiResponse } from "@/types/api/profile-type";
import FormSectionHeader from "@/components/common/form/form-section-header";
import ProfileViewEditButton from "./profile-view-edit-button";
import ProfileViewSpecialtySection from "./profile-view-specilty-section";
import ProfileViewCertificationSection from "./profile-view-certification-section";
import ViewSectionHeader from "@/components/common/view/view-section-header";

/**
 * ProfileViewSalesAttribute コンポーネントの Props 定義
 */
type ProfileViewSalesAttributeProps = {
  /** ユーザーのプロフィール情報 */
  profile: ProfileGetApiResponse;
};

/**
 * 営業属性（電話番号・保有資格・得意分野・挨拶メッセージ）の閲覧用コンポーネント
 *
 * @param props - {@link ProfileViewSalesAttributeProps}
 * @returns JSX.Element - 営業属性の参照UI
 */
const ProfileViewSalesAttribute = ({ profile }: ProfileViewSalesAttributeProps) => {

  return (
    <div className="space-y-2 pt-4">

      {/* セクションヘッダー（タイトル: 連絡先・営業属性 / 編集ボタン） */}
      <FormSectionHeader title="連絡先・営業属性">
        <ProfileViewEditButton />
      </FormSectionHeader>

      <div className="border rounded-md overflow-hidden text-sm bg-background shadow-sm">
        {/* 営業用電話番号 */}
        <ProfileRow1Col
          label="営業用電話番号"
          contentClassName="p-3 font-medium flex items-center"
        >
          {profile.phoneNumber}
        </ProfileRow1Col>

        {/* 保有資格（緑タグバッジ） */}
        <ProfileViewCertificationSection profile={profile} />

        {/* 得意分野 */}
        <ProfileViewSpecialtySection profile={profile} />

        {/* 業務経歴 */}
        <ProfileRow1Col
          label="業務経歴"
          contentClassName="p-3 font-medium flex items-center leading-relaxed"
        >
          {profile.careerSummary}
        </ProfileRow1Col>

        {/* ご挨拶メッセージ（最下行のため border なし） */}
        <ProfileRow1Col
          label="ご挨拶メッセージ"
          contentClassName="p-3 font-medium flex items-center leading-relaxed"
          hasBorderBottom={false}
        >
          {profile.greetingMessage}
        </ProfileRow1Col>
      </div>
    </div>
  );
};

export default ProfileViewSalesAttribute;