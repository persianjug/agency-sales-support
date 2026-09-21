"use client";

import AvatarDisplay from "@/components/common/avatar/avatar-dispaly";
import AvatarSelector from "@/components/common/avatar/avatar-selector";
import ProfileViewFullname from "../view/profile-view-fullname";
import { ProfileGetApiResponse } from "@/types/api/profile-type";
import { useState } from "react";

/**
 * ProfileHero コンポーネントの Props 定義
 */
type ProfileHeaderProps = {
  /** ユーザーの基本プロフィール情報 */
  profile: ProfileGetApiResponse;
  /** 現在設定されているアバター画像のURL（指定時は profile.avatarUrl より優先） */
  avatarUrl?: string;
  /** アバター画像変更時のコールバック関数 */
  onAvatarChange?: (newUrl: string) => void;
}

/**
 * プロフィール画面のヘッダー領域（アバター表示・選択およびユーザー基本情報）を表示するコンポーネント
 *
 * @param props - {@link ProfileHeaderProps}
 * @returns JSX.Element - プロフィールヘッダーUI
 */
const ProfileHeader = ({ profile, avatarUrl, onAvatarChange }: ProfileHeaderProps) => {
  /** アバター選択ダイアログの開閉状態 */
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  /** 表示用のアバター画像URL */
  const currentAvatar = avatarUrl || profile.avatarUrl;

  return (
    <div className="flex items-center justify-between pb-2">
      <div className="flex items-center gap-6">
        <AvatarDisplay
          src={currentAvatar}
          name={profile.lastName || profile.firstName}
          size="lg"
          editable
          onClick={() => setIsDialogOpen(true)}
        />

        <ProfileViewFullname
          lastName={profile.lastName}
          firstName={profile.firstName}
          lastNameKana={profile.lastNameKana}
          firstNameKana={profile.firstNameKana}
          role={profile.role}
        />
      </div>

      <AvatarSelector
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        currentAvatar={currentAvatar}
        onSelect={(newUrl) => onAvatarChange?.(newUrl)}
      />
    </div>
  );
}

export default ProfileHeader;