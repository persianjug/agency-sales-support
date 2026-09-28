"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Command } from "@/components/ui/command";
import { useKeyboardShortcut } from "@/hooks/use-keyboard-shortcut";

import CommandPaletteTrigger from "./command-palette-trigger";
import CommandPaletteMenuList from "./command-palette-menu-list";
import { COMMAND_PALETTE_ACTION_GROUPS } from "./command-palette-constants";
import { useState } from "react";

const commandStyle =
  "bg-popover text-popover-foreground [&_[cmdk-input-wrapper]]:border-border [&_[cmdk-input]]:text-popover-foreground [&_[cmdk-input]]:placeholder:text-muted-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]]:px-2 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]]:text-popover-foreground [&_[cmdk-item][aria-selected='true']]:bg-accent [&_[cmdk-item][aria-selected='true']]:text-accent-foreground";

/**
 * コマンドパレット全体の統括コンポーネント。
 * ダイアログの開閉状態とキーボードショートカット（Cmd+K / Ctrl+K）を管理します。
 *
 * @returns コマンドパレットのUI要素
 */
const CommandPalleteMenu = () => {
  const [open, setOpen] = useState(false);

  useKeyboardShortcut("k", () => setOpen((prev) => !prev), { ctrlOrCmd: true });

  return (
    <>
      <CommandPaletteTrigger onClick={() => setOpen(true)} />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="p-0 overflow-hidden shadow-2xl border-border bg-popover text-popover-foreground max-w-xl">
          <DialogTitle className="sr-only">コマンドパレット</DialogTitle>
          <Command className={commandStyle}>
            <CommandPaletteMenuList
              actionGroups={COMMAND_PALETTE_ACTION_GROUPS}
              onClose={() => setOpen(false)}
            />
          </Command>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CommandPalleteMenu;