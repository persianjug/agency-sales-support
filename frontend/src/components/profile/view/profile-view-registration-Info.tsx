import { ProfileGetApiResponse } from "@/types/api/profile-type";
import ViewRow2Col from "@/components/common/view/view-row-2col";
import ViewSectionHeader from "@/components/common/view/view-section-header";
import { ROLE_OPTIONS } from "@/constants/role-constant";

/**
 * ProfileViewRegistrationInfo コンポーネントの Props 定義
 */
type ProfileViewRegistrationInfoProps = {
  /** ユーザーの基本プロフィール情報 */
  profile: ProfileGetApiResponse;
};

/**
 * 管理者のみ変更可能なユーザー基本情報を表示する読み取り専用テーブルコンポーネント
 *
 * @param props - {@link ProfileViewRegistrationInfoProps}
 * @returns JSX.Element - 読み取り専用の基本情報UI
 */
const ProfileViewRegistrationInfo = ({ profile }: ProfileViewRegistrationInfoProps) => {
  return (
    <div className="space-y-2">

      {/* セクションヘッダー（タイトル: 登録情報） */}
      <ViewSectionHeader title="登録情報" />

      <div className="border rounded-md overflow-hidden text-sm bg-muted/20 opacity-80 shadow-sm">
        {/* 氏名（漢字 / カナ） */}
        <ViewRow2Col
          label1="氏名（漢字）"
          value1={`${profile.lastName} ${profile.firstName}`}
          label2="氏名（カナ）"
          value2={`${profile.lastNameKana} ${profile.firstNameKana}`}
        />

        {/* 代理店情報 */}
        <ViewRow2Col
          label1="代理店名"
          value1={profile.agencyName}
          label2="代理店コード"
          value2={profile.agencyCode}
        />

        {/* 募集人情報 */}
        <ViewRow2Col
          label1="募集人コード"
          value1={profile.solicitorCode}
          label2="募集人登録番号"
          value2={profile.solicitorRegistrationNumber}
          nowrapLabel1
        />

        {/* アカウント情報（最下行のためボーダーなし） */}
        <ViewRow2Col
          label1="メールアドレス"
          value1={profile.email}
          value1ClassName="text-muted-foreground underline"
          label2="役割・権限"
          value2={ROLE_OPTIONS.filter(r => r.value == profile.role).map(s => s.label)}
          hasBorderBottom={false}
        />
      </div>
    </div>
  );
};

export default ProfileViewRegistrationInfo;