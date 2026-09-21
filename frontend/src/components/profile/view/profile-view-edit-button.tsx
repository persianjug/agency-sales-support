import { Button } from "@/components/ui/button";
import { Edit3 } from "lucide-react";
import Link from "next/link";

/**
 * プロフィール編集画面の編集ボタンコンポーネント
 *
 * @param props - {@link ProfileViewEditButtonProps}
 * @returns JSX.Element - 編集ボタンコンポーネント
 */
const ProfileViewEditButton = () => {

  return (
    <Button
      variant="outline"
      size="sm"
      className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 h-8 px-3"
    >
      <Link href="/profile/edit" className="flex items-center gap-1.5">
        <Edit3 className="h-3.5 w-3.5" />
        <span>編集する</span>
      </Link>
    </Button>
  );
};

export default ProfileViewEditButton;