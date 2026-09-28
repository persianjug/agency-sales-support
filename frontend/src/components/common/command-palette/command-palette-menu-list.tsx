"use client";

import {
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import CommandPaletteMenuItem from "./command-palette-menu-item";
import { CommandPaletteActionGroup } from "./command-palette-types";

/**
 * コマンドメニューリストのProps定義
 */
type CommandPaletteMenuListProps = {
  /* 描画対象のアクション群データ */
  actionGroups: CommandPaletteActionGroup[];
  /* パレットを閉じる関数 */
  onClose?: () => void;
}

/**
 * コマンドパレット内の検索入力・結果リスト・グループ表示を担当するコンポーネント。
 * @param props - {@link CommandPaletteMenuListProps}
 * @returns 検索入力とメニューリストのUI
 */
export const CommandPaletteMenuList = ({ actionGroups, onClose }: CommandPaletteMenuListProps) => {
  return (
    <>
      <CommandInput placeholder="コマンドを入力、または検索..." />
      <CommandList className="text-popover-foreground">
        <CommandEmpty className="py-6 text-center text-sm text-muted-foreground">
          該当する結果が見つかりません。
        </CommandEmpty>

        {actionGroups.map((group, index) => (
          <div key={group.heading}>
            <CommandGroup heading={group.heading}>
              {group.items.map((item) => (
                <CommandPaletteMenuItem
                  key={item.id}
                  item={item}
                  onClose={onClose}
                />
              ))}
            </CommandGroup>
            {/* 最後のグループ以外にはセパレーターを挟む */}
            {index < actionGroups.length - 1 && (
              <CommandSeparator className="bg-border" />
            )}
          </div>
        ))}
      </CommandList>
    </>
  );
};

export default CommandPaletteMenuList;