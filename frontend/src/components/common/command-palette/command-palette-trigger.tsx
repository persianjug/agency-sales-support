"use client";

import { Search } from "lucide-react";

/**
 * コマンドパレット起動ボタンのProps定義
 */
type CommandPaletteTriggerProps = {
  /* クリック時のハンドラー関数 */
  onClick: () => void;
}

/**
 * コマンドパレットを開くためのトリガーボタンコンポーネント。
 * @param props - {@link CommandPaletteTriggerProps}
 * @returns 検索風のトリガーボタンUI
 */
export const CommandPaletteTrigger = ({ onClick }: CommandPaletteTriggerProps) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-between w-full max-w-sm px-4 py-2 text-sm text-muted-foreground bg-background border border-input rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors shadow-sm"

    >
      <span className="flex items-center gap-2">
        <Search className="w-4 h-4 text-muted-foreground" />
        コマンド・案件を検索...
      </span>
      <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
        <span className="text-xs">Ctrl+K</span>
      </kbd>
    </button>
  );
};

export default CommandPaletteTrigger;