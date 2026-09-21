"use client";

import { ROLE_OPTIONS } from "@/constants/role-constant";

/**
 * ProfileViewFullname コンポーネントの Props 定義
 */
type ProfileViewFullnameProps = {
  /** 姓 */
  lastName: string;
  /** 名 */
  firstName: string;
  /** 姓（フリガナ） */
  lastNameKana?: string;
  /** 名（フリガナ） */
  firstNameKana?: string;
  /** 表示用の役職・権限名 */
  role: string;
};

/**
 * ユーザーの基本情報（氏名・フリガナ・役職）を表示するコンポーネント
 *
 * @param props - {@link ProfileViewFullnameProps}
 * @returns JSX.Element - 氏名、フリガナ、役職ラベルをまとめたテキストグループUI
 */
const ProfileViewFullname = ({
  lastName,
  firstName,
  lastNameKana,
  firstNameKana,
  role,
}: ProfileViewFullnameProps) => {
  return (
    <div className="space-y-1">
      <div className="flex items-baseline gap-2">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          {`${lastName} ${firstName}`}
        </h2>
        {(lastNameKana || firstNameKana) && (
          <span className="text-sm font-normal text-muted-foreground">
            {`(${lastNameKana ?? ""} ${firstNameKana ?? ""})`.trim()}
          </span>
        )}
      </div>
      <p className="text-sm font-medium text-muted-foreground">
        {ROLE_OPTIONS.filter(r => r.value === role).map(m => m.label)}
      </p>
    </div>
  );
};

export default ProfileViewFullname;