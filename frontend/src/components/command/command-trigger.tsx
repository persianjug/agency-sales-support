"use client";

import { Search } from "lucide-react";

/**
 * コマンドパレット起動ボタンのProps定義
 */
type CommandTriggerProps = {
  // クリック時のハンドラー関数
  onClick: () => void;
}

/**
 * コマンドパレットを開くためのトリガーボタンコンポーネント。
 *
 * @param props Propsオブジェクト
 * @param props.onClick ボタンクリック時に実行される関数
 * @returns 検索風のトリガーボタンUI
 */
export const CommandTrigger = ({ onClick }: CommandTriggerProps) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-between w-full max-w-sm px-4 py-2 text-sm text-zinc-400 bg-zinc-900 border border-zinc-800 rounded-lg hover:border-zinc-700 transition-colors"
    >
      <span className="flex items-center gap-2">
        <Search className="w-4 h-4 text-zinc-400" />
        コマンド・案件を検索...
      </span>
      <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-zinc-700 bg-zinc-800 px-1.5 font-mono text-[10px] font-medium text-zinc-400">
        <span className="text-xs">⌘/Ctrl</span>K
      </kbd>
    </button>
  );
};