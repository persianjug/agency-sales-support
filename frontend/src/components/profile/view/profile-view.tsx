import { ProfileGetApiResponse } from "@/types/api/profile-type"
import ProfileHeader from "../common/profile-header";
import ProfileViewRegistrationInfo from "./profile-view-registration-Info";
import ProfileViewSalesAttribute from "./profile-view-sales-attribute";

/**
 * ProfileViewForm コンポーネントの Props 定義
 */
type ProfileViewProps = {
  /** ユーザープロフィール情報 */
  profile: ProfileGetApiResponse;
}

/**
 * プロフィール参照画面全体のコンテナコンポーネント
 *
 * @param props - {@link ProfileViewProps}
 * @returns JSX.Element - プロフィール編集画面UI
 */
const ProfileView = ({ profile }: ProfileViewProps) => {

  return (
    <div className="container max-w-5xl py-8 space-y-8">
      {/* ヘッダー */}
      <ProfileHeader profile={profile} />

      {/* 登録情報（閲覧専用） */}
      <ProfileViewRegistrationInfo profile={profile} />

      {/* 連絡先・営業属性（閲覧専用） */}
      <ProfileViewSalesAttribute profile={profile} />
    </div>
  );
}

export default ProfileView;