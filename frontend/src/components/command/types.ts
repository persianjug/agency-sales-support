import { type LucideIcon } from "lucide-react";

export type ActionItem = {
  id: string;
  label: string;
  icon: LucideIcon;
  shortcut?: string;
  onSelect: () => void;
}

export type ActionGroup = {
  heading: string;
  items: ActionItem[];
}
