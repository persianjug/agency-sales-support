"use client";

import {
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { MenuItem } from "./menu-item";
import { ActionGroup } from "./types";

/**
 * コマンドメニューリストのProps定義
 */
type CommandMenuListProps = {
  // 描画対象のアクション群データ
  actionGroups: ActionGroup[];
}

/**
 * コマンドパレット内の検索入力・結果リスト・グループ表示を担当するコンポーネント。
 *
 * @param props Propsオブジェクト
 * @param props.actionGroups 表示するアクションのグループ配列
 * @returns 検索入力とメニューリストのUI
 */
export const CommandMenuList = ({ actionGroups }: CommandMenuListProps) => {
  return (
    <>
      <CommandInput placeholder="コマンドを入力、または検索..." />
      <CommandList className="text-zinc-100">
        <CommandEmpty className="py-6 text-center text-sm text-zinc-500">
          該当する結果が見つかりません。
        </CommandEmpty>

        {actionGroups.map((group, index) => (
          <div key={group.heading}>
            <CommandGroup heading={group.heading}>
              {group.items.map((item) => (
                <MenuItem key={item.id} item={item} />
              ))}
            </CommandGroup>
            {/* 最後のグループ以外にはセパレーターを挟む */}
            {index < actionGroups.length - 1 && (
              <CommandSeparator className="bg-zinc-800" />
            )}
          </div>
        ))}
      </CommandList>
    </>
  );
};