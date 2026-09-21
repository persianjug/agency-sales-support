import { getProfileAction } from "@/actions/profile-action";
import ProfileEditForm from "@/components/profile/edit/profile-edit-form";
import { getProfile } from "@/mocks/profile-mock";

export default async function ProfileEditPage() {
  // const result = await getProfileAction();
  const result = await getProfile();

  if ('status' in result) {
    throw result;
  }

  return (
    <div className="container max-w-4xl py-8 space-y-6">
      <div className="border-b pb-4">
        <h1 className="text-5xl font-bold tracking-tight">プロフィール編集</h1>
      </div>
      <ProfileEditForm profile={result} />
    </div>
  );
}