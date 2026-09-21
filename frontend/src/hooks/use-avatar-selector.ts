import { useState, useRef } from "react";

/**
 * useAvatarSelector の引数型定義
 */
type UseAvatarSelectorProps = {
  /** 新しいアバター画像が選択・決定されたときに呼び出されるハンドラー */
  onSelect: (newUrl: string) => void;
  /** ダイアログの開閉状態が変更されたときに呼び出されるハンドラー（任意） */
  onOpenChange: (open: boolean) => void;
};

/**
 * アバター画像の選択・ドラッグ＆ドロップ・プレビュー生成のロジックを提供するカスタムフック
 *
 * @param props - {@link UseAvatarSelectorProps}
 * @returns フォーム状態、参照、および各種イベントハンドラー
 *
 * @remarks
 * - 画像ファイルの選択およびドロップ時のプレビューURL生成（Blob URL）を管理します。
 * - コンポーネント側のイベント定義をシンプルに集約します。
 */
export const useAvatarSelector = ({
  onSelect,
  onOpenChange,
}: UseAvatarSelectorProps) => {
  /** 選択された画像のプレビュー用URL（Blob URL） */
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  /** 非表示の file input 要素への参照 */
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * ファイル選択時の変更処理
   *
   * @param file - 選択またはドロップされた画像ファイル
   * @remarks
   * 渡されたファイルが存在する場合、`URL.createObjectURL` を使用してローカルのプレビューURLを生成し状態を更新します。
   */
  const handleFileChange = (file: File | undefined) => {
    if (!file) return;
    setPreviewUrl(URL.createObjectURL(file));
  };

  /**
   * 画像設定の確定ハンドラー
   *
   * @remarks
   * プレビュー用URLが生成されている場合、親コンポーネントの通知ハンドラー（`onSelect`）を実行し、
   * ダイアログを閉じます（`onOpenChange(false)`）。
   */
  const handleSave = () => {
    if (!previewUrl) return;
    onSelect(previewUrl);
    onOpenChange(false);
  };

  /**
   * ドラッグオーバー時のイベントハンドラー
   *
   * @param e - React のドラッグイベントオブジェクト
   * @remarks
   * ブラウザのデフォルト挙動（ファイルを開く動作）を抑制します。
   */
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  /**
   * ドロップ時のイベントハンドラー
   *
   * @param e - React のドラッグイベントオブジェクト
   * @remarks
   * ブラウザのデフォルト動作をキャンセルした上で、ドロップされたファイルを取り出して処理します。
   */
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleFileChange(e.dataTransfer.files?.[0]);
  };

  /**
   * ファイルドロップ領域クリック時のハンドラー
   *
   * @remarks
   * 隠されている input[type="file"] の要素をクリックし、OS標準のファイル選択ダイアログを開きます。
   */
  const handleUploadAreaClick = () => {
    fileInputRef.current?.click();
  };

  /**
   * ファイルインプット要素の change イベントハンドラー
   *
   * @param e - React の Change イベントオブジェクト
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileChange(e.target.files?.[0]);
  };

  /**
   * キャンセルボタン押下時のハンドラー
   *
   * @remarks
   * ダイアログを閉じる動作をトリガーします。
   */
  const handleCancel = () => {
    onOpenChange(false);
  };

  return {
    previewUrl,
    fileInputRef,
    handleSave,
    handleDragOver,
    handleDrop,
    handleUploadAreaClick,
    handleInputChange,
    handleCancel,
  };
};