import { Badge } from "@/components/ui/badge";
import ProfileRow1Col from "../common/profile-row-1col";
import { ProfileGetApiResponse } from "@/types/api/profile-type";
import FormSectionHeader from "@/components/common/form/form-section-header";
import ProfileViewEditButton from "./profile-view-edit-button";

/**
 * ProfileViewSpecialtySection コンポーネントの Props 定義
 */
type ProfileViewSpecialtySectionProps = {
  /** ユーザーのプロフィール情報 */
  profile: ProfileGetApiResponse;
};

/**
 * 営業属性（電話番号・保有資格・得意分野・挨拶メッセージ）の閲覧用コンポーネント
 *
 * @param props - {@link ProfileViewSpecialtySectionProps}
 * @returns JSX.Element - 営業属性の参照UI
 */
const ProfileViewSpecialtySection = ({ profile }: ProfileViewSpecialtySectionProps) => {

  return (
    <ProfileRow1Col
      label="得意分野"
      contentClassName="p-3 font-medium flex items-center gap-2"
    >
      {profile.specialties && profile.specialties.map((spec) => `${spec.name}${spec.years}年`).join("、")}
    </ProfileRow1Col>
  );
};

export default ProfileViewSpecialtySection;