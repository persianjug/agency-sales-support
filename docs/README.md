# 代理店営業支援システム（ver 1.0）基本設計書

## 1. システム概要

本システムは、代理店（管理者・使用人）の営業活動を支援するためのダッシュボード基盤である。
キーボードを中心とした高速なUI操作性と、セキュリティを担保した役割ベースの認証認可（RBAC）を提供する。

## 2. システム要件 & コア機能

- **認証・認可基盤**
  - Spring Security + JWT による stateless 認証
  - JWTは `HttpOnly Cookie` に保持（XSS対策）
  - ロール（権限）管理: `ROLE_ADMIN` (管理者) / `ROLE_USER` (使用人)
- **キーボードファースト UI/UX**
  - コマンドパレット (`Ctrl + K`) による画面遷移・アクション起動
  - テーブル画面のキーボードナビゲーション（`↑` `↓` 行移動、`Enter` 詳細表示、`e` 編集モーダル）
- **レスポンシブ対応**
  - PC専用表示（`min-width: 1024px` 想定）。モバイル対応はスコープ外。

## 3. 技術スタック & アーキテクチャ

- **フロントエンド:** Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui (cmdk)
- **バックエンド:** Java (Spring Boot, Spring Security), MyBatis
- **データベース:** PostgreSQL (ローカル開発環境は Docker コンテナ / テスト環境は H2)
- **インフラ（本番想定環境）:**
  - Frontend: Vercel
  - Backend: Koyeb (or Render)
  - Database: Neon (or Supabase)

## 4. UI/UX コンセプト検証（パイロット案）

共通のデータ・コマンドパレットを使用し、レイアウトのみ以下の3パターンを検証可能とする。

- **案1: Raycast / VS Code風** (サイドバー最小限 + 中央コマンド＆検索)
- **案2: Linear / Notion風** (折りたたみ極細サイドバー + Bento Grid表示)
- **案3: ヘッダー集中型** (サイドバー廃止 + 上部コマンドバー)
