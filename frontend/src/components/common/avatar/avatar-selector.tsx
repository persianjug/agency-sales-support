"use client";

import { Upload, Image as ImageIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import AvatarDisplay from "./avatar-dispaly";
import { useAvatarSelector } from "@/hooks/use-avatar-selector";

/**
 * AvatarSelector コンポーネントの Props 定義
 */
type AvatarSelectorProps = {
  /** ダイアログの開閉状態 */
  open: boolean;
  /** ダイアログの開閉状態が変更されたときに呼び出されるハンドラー */
  onOpenChange: (open: boolean) => void;
  /** 現在設定されているアバター画像のURLまたはパス */
  currentAvatar?: string;
  /** 新しいアバター画像が選択・決定されたときに呼び出されるハンドラー */
  onSelect: (newUrl: string) => void;
};

/**
 * プロフィール画像（アバター）の選択・アップロードを行うモーダルダイアログコンポーネント
 *
 * @param props - {@link AvatarSelectorProps}
 * @returns JSX.Element - アバター画像のプレビューおよびドラッグ＆ドロップ領域を持つダイアログUI
 *
 * @remarks
 * - ロジックはカスタムフック (`useAvatarSelector`) に委譲し、本コンポーネントはUIの構築に専念します。
 */
const AvatarSelector = ({
  open,
  onOpenChange,
  currentAvatar,
  onSelect,
}: AvatarSelectorProps) => {
  const {
    previewUrl,
    fileInputRef,
    handleSave,
    handleDragOver,
    handleDrop,
    handleUploadAreaClick,
    handleInputChange,
    handleCancel,
  } = useAvatarSelector({ onSelect, onOpenChange });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>プロフィール画像を更新</DialogTitle>
        </DialogHeader>

        {/* メインコンテンツ領域：プレビューとドロップエリア */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4 items-center">
          <div className="flex flex-col items-center gap-2">
            <AvatarDisplay src={previewUrl || currentAvatar} size="lg" />
            <span className="text-xs text-muted-foreground font-medium">プレビュー</span>
          </div>

          {/* 右側：ドラッグ＆ドロップ / ファイル選択エリア */}
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={handleUploadAreaClick}
            className="md:col-span-2 border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-muted/50 transition-colors text-center"
          >
            <Upload className="w-8 h-8 text-muted-foreground" />
            <div className="text-xs text-muted-foreground">
              <span className="font-semibold text-emerald-600">クリックしてファイルを選択</span>
              <br />
              またはここにドラッグ＆ドロップ
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/* フッター：設定ボタン、キャンセルボタン */}
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            キャンセル
          </Button>
          <Button
            onClick={handleSave}
            disabled={!previewUrl}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            設定する
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AvatarSelector;