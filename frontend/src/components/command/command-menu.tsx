"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Command } from "@/components/ui/command";
import { useKeyboardShortcut } from "@/hooks/use-keyboard-shortcut";

import { CommandTrigger } from "./command-trigger";
import { CommandMenuList } from "./command-menu-list";
import { ACTION_GROUPS } from "./constants";
import { useState } from "react";

const commandStyle =
  "bg-zinc-950 text-zinc-100 [&_[cmdk-input-wrapper]]:border-zinc-800 [&_[cmdk-input]]:text-zinc-100 [&_[cmdk-input]]:placeholder:text-zinc-500 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-zinc-400 [&_[cmdk-group]]:px-2 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]]:text-zinc-200 [&_[cmdk-item][aria-selected='true']]:bg-zinc-800 [&_[cmdk-item][aria-selected='true']]:text-zinc-100";

/**
 * コマンドパレット全体の統括コンポーネント。
 * ダイアログの開閉状態とキーボードショートカット（Cmd+K / Ctrl+K）を管理します。
 *
 * @returns コマンドパレットのUI要素
 */
const CommandMenu = () => {
  const [open, setOpen] = useState(false);

  useKeyboardShortcut("k", () => setOpen((prev) => !prev), { ctrlOrCmd: true });

  return (
    <>
      <CommandTrigger onClick={() => setOpen(true)} />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="p-0 overflow-hidden shadow-2xl border-zinc-800 bg-zinc-950 text-zinc-100 max-w-xl">
          <DialogTitle className="sr-only">コマンドパレット</DialogTitle>
          <Command className={commandStyle}>
            <CommandMenuList actionGroups={ACTION_GROUPS} />
          </Command>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CommandMenu;