"use client";

import { Camera } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

/**
 * AvatarDisplay Props定義
 */
type AvatarDisplayProps = {
  /* アバター画像のパス */
  src?: string;
  /* 表示名 */
  name?: string;
  /** 背景色クラス（Fallback用） */
  bgColorClass?: string;
  /* アバターのサイズ */
  size?: "xs" | "sm" | "md" | "lg";
  /* 編集モードか？ */
  editable?: boolean;
  /* クリック時のハンドラー関数 */
  onClick?: () => void;
};

// アバターサイズのclass定義
const sizeClasses = {
  xs: "h-8 w-8 text-xs",
  sm: "h-12 w-12 text-sm",
  md: "h-16 w-16 text-2xl",
  lg: "h-24 w-24 text-4xl",
};


/**
 * アバター表示・コンポーネント
 *
 * @param props - {@link AvatarDisplayProps}
 * @returns アバター画像UI
 *
 * @remarks
 * - アバター画像表示不可の場合、表示名の先頭1文字をアバターとします。
 * - `bgColorClass` を指定することで、Fallback時の背景色を変更可能です。
 * - 編集モードの場合、アバター画像の右下にカメラアイコンを表示します。
 */
const AvatarDisplay = ({
  src,
  name = "U",
  bgColorClass = "bg-muted text-muted-foreground",
  size = "lg",
  editable = false,
  onClick,
}: AvatarDisplayProps) => {
  const initialLetter = name.charAt(0).toUpperCase();
  
  return (
    <div
      className={`relative inline-block ${editable ? "group cursor-pointer" : ""}`}
      onClick={editable ? onClick : undefined}
    >
      <Avatar className={`${sizeClasses[size]} border border-border/50 shadow-xs shrink-0`}>
        <AvatarImage src={src} alt={name} />
        <AvatarFallback className={`${bgColorClass} font-semibold`}>
          {initialLetter}
        </AvatarFallback>
      </Avatar>

      {editable && (
        <div className="absolute bottom-0 right-0 bg-background border border-border p-1.5 rounded-full shadow-md text-muted-foreground group-hover:text-foreground group-hover:scale-110 transition-all">
          <Camera className="w-4 h-4" />
        </div>
      )}
    </div>
  );
};

export default AvatarDisplay;