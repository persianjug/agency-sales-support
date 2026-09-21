"use client";

import { useRef, useState } from "react";
import { Upload, AlertCircle } from "lucide-react";
import AvatarDisplay from "../avatar/avatar-dispaly";

/**
 * AvatarUploadDropzone コンポーネントの Props 型定義
 */
type AvatarUploadDropzoneProps = {
  /** 現在設定・プレビューされているアバター画像のURL */
  currentValue?: string;
  /** 新しい画像がアップロード（ドロップ/選択）された際に呼び出されるハンドラー関数 */
  onSelect: (newUrl: string) => void;
};

/**
 * アバター画像のドラッグ＆ドロップ / ファイル選択領域 UI コンポーネント
 *
 * @param props - {@link AvatarUploadDropzoneProps}
 * @returns JSX.Element - ファイル選択・ドロップ領域、プレビューおよびインラインエラー表示UI
 *
 * @remarks
 * - 画像ファイルのドラッグ＆ドロップおよびクリックによるファイル選択に対応します。
 * - 不正なファイル選択時にはインライン（赤字・赤枠）でエラーメッセージを表示します。
 * - 状態管理・ファイル検証ロジックをコンポーネント内部で自己完結させています。
 */
export const AvatarUploadDropzone = ({
  currentValue,
  onSelect,
}: AvatarUploadDropzoneProps) => {
  /** プレビュー表示用URL State */
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  /** インライン表示用のバリデーションエラーメッセージ State */
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  /** file input 要素への参照 */
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * ファイルの検証および選択処理
   *
   * @param file - 選択・ドロップされた File オブジェクト
   */
  const handleFile = (file: File) => {
    // エラー状態をリセット
    setErrorMessage(null);

    // MIMEタイプの検証 (画像のみ)
    if (!file.type.startsWith("image/")) {
      setErrorMessage("画像ファイル（JPEG / PNG）を選択してください。");
      return;
    }

    // ファイルサイズの検証 (5MB以内)
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage("ファイルサイズが制限（5MB）を超えています。");
      return;
    }

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    onSelect(url);
  };

  /**
   * ドラッグオーバー時のイベントハンドラー
   *
   * @param e - React のドラッグイベントオブジェクト
   */
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  /**
   * ドロップ時のイベントハンドラー
   *
   * @param e - React のドラッグイベントオブジェクト
   */
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  /**
   * アップロード領域クリック時のハンドラー (inputクリックを模倣)
   */
  const handleClick = () => {
    fileInputRef.current?.click();
  };

  /**
   * file input 変更時のイベントハンドラー
   *
   * @param e - React の Change イベントオブジェクト
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  /** 表示対象の画像URL (選択プレビュー優先、無ければ設定中の値) */
  const displayUrl = previewUrl || currentValue;

  return (
    <div className="pl-6 space-y-2">
      {/* ドロップ＆クリック領域 */}
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleClick}
        className={`max-w-md border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center gap-2 cursor-pointer bg-background hover:bg-muted/40 transition-colors text-center ${
          errorMessage ? "border-destructive bg-destructive/5" : ""
        }`}
      >
        {displayUrl ? (
          <div className="flex flex-col items-center gap-2">
            <AvatarDisplay src={displayUrl} size="lg" />
            <span className="text-xs text-emerald-600 font-medium">
              クリックまたはドラッグ＆ドロップで画像を変更
            </span>
          </div>
        ) : (
          <>
            <Upload className="w-8 h-8 text-muted-foreground" />
            <div className="text-xs text-muted-foreground">
              <span className="font-medium text-foreground">
                クリックまたはドラッグ＆ドロップで画像を選択
              </span>
              <br />
              （※JPEG/PNG 5MB以内）
            </div>
          </>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png"
          className="hidden"
          onChange={handleInputChange}
        />
      </div>

      {/* インラインエラーメッセージ表示 */}
      {errorMessage && (
        <div className="flex items-center gap-1.5 text-xs text-destructive font-medium pl-1">
          <AlertCircle className="w-3.5 h-3.5" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
};

export default AvatarUploadDropzone;