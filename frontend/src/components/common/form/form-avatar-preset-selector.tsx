"use client";

import AvatarDisplay from "../avatar/avatar-dispaly";

/**
 * プリセットアバターのカラー設定一覧定義
 */
export const PRESET_AVATARS = [
  { id: "preset-blue", colorKey: "blue", bgClass: "bg-blue-600" },
  { id: "preset-green", colorKey: "green", bgClass: "bg-emerald-600" },
  { id: "preset-yellow", colorKey: "yellow", bgClass: "bg-amber-500" },
  { id: "preset-purple", colorKey: "purple", bgClass: "bg-purple-600" },
  { id: "preset-gray", colorKey: "gray", bgClass: "bg-slate-400" },
];

/**
 * AvatarPresetSelector コンポーネントの Props 型定義
 */
type AvatarPresetSelectorProps = {
  /** 現在選択されているカラーキー (例: "blue", "green") */
  selectedValue?: string;
  /** イニシャル表示用の名前（文字） */
  initialName?: string;
  /** カラーが選択された際に呼び出されるハンドラー関数 */
  onSelect: (colorKey: string) => void;
};

/**
 * プリセットアバターの丸型アイコン一覧選択 UI コンポーネント
 *
 * @param props - {@link AvatarPresetSelectorProps}
 * @returns JSX.Element - プリセットアイコンの横並び選択リストUI
 */
export const AvatarPresetSelector = ({
  selectedValue = "blue",
  initialName = "山",
  onSelect,
}: AvatarPresetSelectorProps) => {
  return (
    <div className="pl-6 flex items-center gap-3">
      {PRESET_AVATARS.map((preset) => {
        const isSelected = selectedValue === preset.colorKey;
        return (
          <button
            key={preset.id}
            type="button"
            onClick={() => onSelect(preset.colorKey)}
            className={`rounded-full transition-transform ${isSelected
                ? "ring-2 ring-primary ring-offset-2 scale-105"
                : "opacity-80 hover:opacity-100"
              }`}
          >
            <AvatarDisplay
              name={initialName}
              bgColorClass={preset.bgClass}
              size="sm"
              editable={false}
            />
          </button>
        );
      })}
    </div>
  );
};

export default AvatarPresetSelector;