"use client";

import CommandMenu from "@/components/command/command-menu";

/**
 * ダッシュボードの最上部に表示されるヘッダーコンポーネント。
 * タイトル、説明、コマンドパレットの起動トリガーをレイアウトします。
 *
 * @returns ヘッダー領域のUI
 */
const DashboardHeader = () => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-zinc-800 pb-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">営業ダッシュボード (試作版)</h1>
        <p className="text-sm text-zinc-400 mt-1">
          キーボードファースト UI テスト —{" "}
          <kbd className="px-1.5 py-0.5 text-xs bg-zinc-800 border border-zinc-700 rounded">Ctrl</kbd>{" "}
          +{" "}
          <kbd className="px-1.5 py-0.5 text-xs bg-zinc-800 border border-zinc-700 rounded">K</kbd>{" "}
          でパレット起動
        </p>
      </div>
      <CommandMenu />
    </div>
  );
};

export default DashboardHeader;