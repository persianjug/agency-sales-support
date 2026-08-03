"use client";

import { CommandItem, CommandShortcut } from "@/components/ui/command";
import { type ActionItem } from "./types";

/**
 * メニュー項目のProps定義
 */
type MenuItemProps = {
  // 項目データ（ラベル、アイコン、ショートカット、イベント）
  item: ActionItem;
}

/**
 * コマンドパレット内の単一メニュー項目を描画するコンポーネント。
 *
 * @param props Propsオブジェクト
 * @param props.item 単一アクションの設定オブジェクト
 * @returns メニュー項目のUI
 */
export const MenuItem = ({ item }: MenuItemProps) => {
  const Icon = item.icon;
  return (
    <CommandItem onSelect={item.onSelect}>
      <Icon className="mr-2 h-4 w-4 text-zinc-400" />
      <span>{item.label}</span>
      {item.shortcut && (
        <CommandShortcut className="text-zinc-500">{item.shortcut}</CommandShortcut>
      )}
    </CommandItem>
  );
};