"use client";

import React from "react";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

/**
 * AvatarModeOption コンポーネントの Props 型定義
 */
type AvatarModeOptionProps = {
  /** ラジオボタンの選択値 (例: "preset", "upload") */
  value: string;
  /** ラジオボタン横に表示するラベルテキスト */
  label: string;
  /** ラジオボタン選択時に下部に展開表示するコンテンツ */
  children?: React.ReactNode;
};

/**
 * アバター選択モード（プリセット / アップロード）のラジオボタン枠組みコンポーネント
 *
 * @param props - {@link AvatarModeOptionProps}
 * @returns JSX.Element - ラジオ項目と子要素（選択時表示領域）のコンテナUI
 *
 * @remarks
 * - ラジオボタンの構造（`RadioGroupItem` + `Label`）および下部コンテンツの配置構造を共通化するためのコンポーネントです。
 */
export const AvatarModeOption = ({
  value,
  label,
  children,
}: AvatarModeOptionProps) => {
  const id = `mode-${value}`;

  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-2">
        <RadioGroupItem value={value} id={id} />
        <Label htmlFor={id} className="font-medium cursor-pointer">
          {label}
        </Label>
      </div>
      {children}
    </div>
  );
};

export default AvatarModeOption;