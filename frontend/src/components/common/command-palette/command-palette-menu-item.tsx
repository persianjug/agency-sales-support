"use client";

import { CommandItem, CommandShortcut } from "@/components/ui/command";
import { type CommandPaletteActionItem } from "./command-palette-types";
import { useRouter } from "next/navigation";

/**
 * メニュー項目のProps定義
 */
type CommandPaletteMenuItemProps = {
  /* 項目データ（ラベル、アイコン、ショートカット、イベント） */
  item: CommandPaletteActionItem;
  /* パレットを閉じる関数 */
  onClose?: () => void;
}

/**
 * コマンドパレット内の単一メニュー項目を描画するコンポーネント。
 *
 * @param props - {@link CommandPaletteMenuItemProps}
 * @returns メニュー項目のUI
 */
export const CommandPaletteMenuItem = ({ item, onClose }: CommandPaletteMenuItemProps) => {
  const router = useRouter();
  const handleSelect = () => {
    if (item.href) {
      onClose?.();
      router.push(item.href);
    }
  };

  const Icon = item.icon;
  return (
    <CommandItem onSelect={handleSelect}>
      <Icon className="mr-2 h-4 w-4 text-muted-foreground" />
      <span>{item.label}</span>
      {item.shortcut && (
        <CommandShortcut className="text-muted-foreground">{item.shortcut}</CommandShortcut>
      )}
    </CommandItem>
  );
};

export default CommandPaletteMenuItem;