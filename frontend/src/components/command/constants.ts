import { Calendar, Settings, User, FileText } from "lucide-react";
import { type ActionGroup } from "./types";

export const ACTION_GROUPS: ActionGroup[] = [
  {
    heading: "クイックアクション",
    items: [
      {
        id: "new-deal",
        label: "新規営業案件の作成",
        icon: Calendar,
        shortcut: "⌘N",
        onSelect: () => alert("新規案件を作成"),
      },
      {
        id: "search-customer",
        label: "顧客データベース検索",
        icon: User,
        onSelect: () => alert("顧客検索へ"),
      },
      {
        id: "issue-invoice",
        label: "見積書の発行・出力",
        icon: FileText,
        shortcut: "⌘P",
        onSelect: () => alert("見積書発行へ"),
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
        onSelect: () => alert("設定へ"),
      },
    ],
  },
];
