import { getProfileAction } from "@/actions/profile-action";
import ProfileView from "@/components/profile/view/profile-view";
import { getProfile } from "@/mocks/profile-mock";

/**
 * プロフィールページ（Server Component）
 * サーバー側でプロフィール情報を取得し、プロフィール画面を出力します。
 *
 * @returns プロフィール画面UI
 */
const ProfilePage = async () => {
  // const result = await getProfileAction();
  const result = await getProfile();

  // エラーなら例外を投げて Next.js の機構（error.tsx）に委ねる
  if ('status' in result) {
    throw result;
  }

  return <ProfileView profile={result} />;
}

export default ProfilePage;
