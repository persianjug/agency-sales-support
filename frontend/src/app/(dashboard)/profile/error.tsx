'use client'

import { useRouter } from 'next/navigation';

type ProfileErrorProps = {
  error: Error & { status?: number };
  reset: () => void;
}

const ProfileError = ({ error, reset }: ProfileErrorProps) => {
  const router = useRouter();

  // 401 / 403 の場合はログインへ飛ばす
  if (error.status === 401 || error.status === 403) {
    router.push('/login?from=/profile');
    return null;
  }

  // 500系などの通常エラー画面UI
  return (
    <div className="p-4 text-center">
      <h2>プロフィールの読み込みに失敗しました</h2>
      <button onClick={() => reset()} className="mt-4 btn">
        再読み込み
      </button>
    </div>
  );
}

export default ProfileError;