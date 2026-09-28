import { Settings, FileText, LayoutDashboard, Users, Building2, ShieldCheck } from "lucide-react";
import { type CommandPaletteActionGroup } from "./command-palette-types";

export const COMMAND_PALETTE_ACTION_GROUPS: CommandPaletteActionGroup[] = [
  {
    heading: "クイックアクション",
    items: [
      {
        id: "dashboard",
        label: "ダッシュボード",
        icon: LayoutDashboard,
        href: "/dashboard",
      },
      {
        id: "customers",
        label: "顧客管理",
        icon: Users,
        href: "/customers",
        shortcut: "⌘C",
      },
      {
        id: "policies",
        label: "契約・募集管理",
        icon: FileText,
        href: "/policies",
        shortcut: "⌘P",
      },
      {
        id: "agencies",
        label: "代理店管理",
        icon: Building2,
        href: "/agencies",
        shortcut: "⌘D",
      },
      {
        id: "accounts",
        label: "アカウント管理",
        icon: ShieldCheck,
        href: "/accounts",
        shortcut: "⌘A",
      },
    ],
  },
  {
    heading: "作成",
    items: [
      {
        id: "account-create",
        label: "アカウント作成",
        icon: FileText,
        shortcut: "⌘S",
        href: "/account-create",
      },
    ],
  },
  {
    heading: "設定・システム",
    items: [
      {
        id: "settings",
        label: "アカウント設定",
        icon: Settings,
        shortcut: "⌘S",
        href: "/",
      },
    ],
  },
];
