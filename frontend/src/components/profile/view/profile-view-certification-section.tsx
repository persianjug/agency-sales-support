import { Badge } from "@/components/ui/badge";
import ProfileRow1Col from "../common/profile-row-1col";
import { ProfileGetApiResponse } from "@/types/api/profile-type";

/**
 * ProfileViewCertificationSection コンポーネントの Props 定義
 */
type ProfileViewCertificationSectionProps = {
  /** ユーザーのプロフィール情報 */
  profile: ProfileGetApiResponse;
};

/**
 * 営業属性（保有資格）の閲覧用コンポーネント
 *
 * @param props - {@link ProfileViewCertificationSectionProps}
 * @returns JSX.Element - 保有資格の参照UI
 */
const ProfileViewCertificationSection = ({ profile }: ProfileViewCertificationSectionProps) => {

  return (
    <ProfileRow1Col
      label="保有資格"
      contentClassName="p-3 flex flex-wrap gap-2 items-center"
    >
      {profile.certifications && profile.certifications.map((cert, index) => (
        <Badge
          key={index}
          className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-emerald-200 font-normal px-3 py-1 text-xs rounded-full shadow-none"
        >
          {cert.name}
        </Badge>
      ))}
    </ProfileRow1Col>
  );
};

export default ProfileViewCertificationSection;