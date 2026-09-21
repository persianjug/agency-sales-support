"use client"

import Link from "next/link"
import { createColumnHelper } from "@tanstack/react-table"

import {
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"

import { type DataTableFeatures } from "@/components/common/data-table/data-table-features"
import { DataTableColumnHeader } from "@/components/common/data-table/data-table-column-header"
import { AccountListItem } from "@/types/api/account-type"
import StatusBadge from "../common/status-badge"
import DataTableRowActions from "../common/data-table/data-table-row-actions"

const columnHelper = createColumnHelper<DataTableFeatures, AccountListItem>()

/**
 * アカウント一覧テーブル用のカラム定義配列
 */
export const accountListColumns = columnHelper.columns([
  columnHelper.accessor(
    "lastName",
    {
      id: "fullName",
      header: ({ column }) => <DataTableColumnHeader column={column} title="氏名" />,
      cell: ({ row }) => (
        <div>
          <div className="font-medium text-gray-900">
            {row.original.lastName} {row.original.firstName}
          </div>
          <div className="text-xs text-muted-foreground">
            {row.original.lastNameKana} {row.original.firstNameKana}
          </div>
        </div>
      ),
      meta: { label: "氏名" },
      size: 180,
    }
  ),

  columnHelper.accessor(
    "username",
    {
      header: ({ column }) => <DataTableColumnHeader column={column} title="メールアドレス" />,
      cell: ({ row }) => <div className="lowercase">{row.getValue("username")}</div>,
      meta: { label: "メールアドレス" },
      size: 200,
    }
  ),

  columnHelper.accessor(
    "agencyName",
    {
      header: ({ column }) => <DataTableColumnHeader column={column} title="所属代理店" />,
      meta: { label: "所属代理店" },
      size: 200,
    }
  ),

  columnHelper.accessor(
    "role",
    {
      header: ({ column }) => <DataTableColumnHeader column={column} title="権限" />,
      cell: ({ row }) => {
        const roleMap = {
          ROLE_SYSTEM_ADMIN: "システム管理者",
          ROLE_AGENCY_ADMIN: "代理店管理者",
          ROLE_SOLICITOR: "募集人",
        }
        return <span>{roleMap[row.getValue("role") as keyof typeof roleMap]}</span>
      },
      meta: { label: "権限" },
      size: 100,
    }
  ),

  columnHelper.accessor(
    "status",
    {
      header: ({ column }) => <DataTableColumnHeader column={column} title="ステータス" />,
      cell: ({ row }) => {
        const status = row.getValue("status") as AccountListItem["status"]
        switch (status) {
          case "ACTIVE":
            return <StatusBadge variant="success">有効</StatusBadge>;
          case "SUSPENDED":
            return <StatusBadge variant="warning">停止中</StatusBadge>;
          case "LOCKED":
            return <StatusBadge variant="danger">ロック</StatusBadge>;
          default:
            return <StatusBadge variant="neutral">{status}</StatusBadge>;
        }
      },
      meta: { label: "ステータス" },
      size: 80,
    }
  ),

  columnHelper.display(
    {
      id: "actions",
      enableHiding: false,
      size: 50,
      cell: ({ row }) => {
        const account = row.original
        return (
          <DataTableRowActions label="操作">
            <DropdownMenuItem
              render={<Link href={`/accounts/${account.id}`} />}
              className="flex items-center justify-between w-full cursor-pointer"
              autoFocus
            >
              <span>参照</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              render={<Link href={`/accounts/${account.id}/edit`} />}
              className="flex items-center justify-between w-full cursor-pointer"
            >
              <span>編集</span>
            </DropdownMenuItem>
          </DataTableRowActions>)
      },
    }
  ),
]);