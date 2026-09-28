import { type LucideIcon } from "lucide-react";

export type CommandPaletteActionItem = {
  id: string;
  label: string;
  icon: LucideIcon;
  shortcut?: string;
  href: string;
}

export type CommandPaletteActionGroup = {
  heading: string;
  items: CommandPaletteActionItem[];
}
