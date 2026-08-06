# Next.js 認証・認可＆ダッシュボード連携仕様書

---

## 1. 概要

### 1.1 目的

本仕様書は、Next.js（App Router）における認証・認可処理、JWT およびユーザー情報 Cookie を用いたセッション管理、保護された領域（ダッシュボード等）へのルーティング制御、ログアウト機能、および UI 連携の仕様を定義します。

### 1.2 システム構成（フロントエンド側）

- **フレームワーク**:
  - Next.js (App Router, React 19)
- **UI ライブラリ**:
  - Tailwind CSS, shadcn/ui, Lucide Icons, Sonner (Toast)
- **フォーム管理**:
  - `react-hook-form`, `zod`
- **状態管理/通信**:
  - Server Actions, Custom Hooks (`useAuthLoginForm`, `useAuthLogout`, `useCurrentUser`)
- **認証方式**:
  - Cookie ベースのステートレス JWT 認証 ＋ 表示用 Cookie 連携

---

## 2. 認証・認可アーキテクチャ

### 2.1 セッション管理（Cookie）

認証トークン（JWT）に加えて、クライアント側でユーザー情報を表示するための Cookie を一括管理します。

| Cookie キー | 設定値 | `httpOnly` | `sameSite` | 用途 |
| --- | --- | --- | --- | --- |
| `auth_token` | JWT トークン | `true` | `lax` | API 認証用トークン（JS 閲覧不可） |
| `user_email` | ユーザーID (メールアドレス) | `false` | `lax` | UI 表示用（ヘッダーアバター等） |
| `user_name` | ユーザー表示名 | `false` | `lax` | UI 表示用（ヘッダーアバター等） |

- **共通保存処理 (`saveSessionCookie`)**:
  - Server Action 内で `CookieItem[]` 配列を受け取り、ループ処理にて一括で Cookie をセットします。

- **ライフサイクル**:
  - **ログイン成功時**: Spring Boot 側の `AuthResponse` から受け取った `トークン(token)`, `ユーザーID(username)`, `ユーザー表示名(name)` を各 Cookie に保存。

  - **ログアウト時**: Server Action (`authLogoutAction`) 経由で全セッション Cookie (`auth_token`, `user_email`, `user_name`) を一括削除。

### 2.2 アクセス制御マトリクス

| パス | 種別 | 未ログイン時 | ログイン済み時 |
| --- | --- | --- | --- |
| `/login` | 公開パス (`PUBLIC_PATHS`) | アクセス可 | **`/`（ホーム）へ自動リダイレクト** |
| `/signup` | 公開パス (`PUBLIC_PATHS`) | アクセス可 | **`/`（ホーム）へ自動リダイレクト** |
| `/` (ダッシュボード) | 保護パス | **`/login` へ自動リダイレクト** | アクセス可 |
| `/api/**` | APIルート | ミドルウェア対象外 | ミドルウェア対象外 |

---

## 3. コンポーネントおよび処理設計

### 3.1 ディレクトリ構成・配置ルール

```text
src/
├── actions/
│   └── auth.ts                 # Server Actions (authLoginAction, authLogoutAction)
├── app/
│   ├── (auth)/
│   │   └── login/             # ログインページ
│   └── (dashboard)/
│       ├── layout.tsx          # ダッシュボード共通レイアウト (Header 配置)
│       └── page.tsx            # ダッシュボード (保護ページ)
├── components/
│   ├── auth/
│   │   └── auth-login-form.tsx # ログインフォーム UI
│   ├── layout/
│   │   ├── header.tsx          # アプリ共通ヘッダー
│   │   ├── header-logo.tsx     # ヘッダーロゴ
│   │   └── user-nav.tsx        # ユーザーアバター＆ドロップダウンメニュー (カード型)
│   └── ui/
│       └── controlled-input.tsx # 共通制御入力 (パスワード表示切替機能内蔵)
├── hooks/
│   ├── use-auth-login-form.ts  # ログインフォーム状態管理フック
│   ├── use-auth-logout.ts      # ログアウト処理フック
│   └── use-current-user.ts     # Cookie からのユーザー情報取得フック
├── lib/
│   └── auth-cookie.ts          # Cookie 操作共通関数 (saveSessionCookie, deleteSessionCookie)
├── constants/
│   └── auth.ts                 # Cookie キー、パス定義定数
└── middleware.ts               # 認証・認可ミドルウェア

```

### 3.2 主要コンポーネントの役割

#### 3.2.1. **`ControlledInput` (`src/components/ui/controlled-input.tsx`)**

- `react-hook-form` と UI ライブラリを接続する汎用コンポーネント。
- `type="password"` が指定された場合、右端に表示/非表示切替トグル（`Eye` / `EyeOff`）を自動挿入する。

#### 3.2.2.  **`useAuthLoginForm` (`src/hooks/use-auth-login-form.ts`)**

- フォームのバリデーション、送信状態管理、Server Action の呼び出しを担当。
- 成功時には Sonner トーストを出力し、 `router.push('/')` でダッシュボード画面遷移を行う。

#### 3.2.3.  **`middleware.ts` (`src/middleware.ts`)**

- リクエスト毎に `auth_token` Cookie の有無を検証し、保護パスおよび公開パスへのアクセスを制御する。

#### 3.2.5. **`saveSessionCookie` / `deleteSessionCookie` (`src/lib/auth-cookie.ts`)**

- Cookie の保存・削除を一括管理するユーティリティ関数。
- `CookieItem[]`（オブジェクト配列）を受け取ることで、複数の Cookie 設定を一括ループ処理可能。

#### 3.2.6. **`useCurrentUser` (`src/hooks/use-current-user.ts`)**

- クライアント側（`js-cookie`）で Cookie から `user_name` と `user_email` を取得するカスタムフック。
- `useEffect` を用いることで SSR 時のハイドレーションミスマッチを防ぎます。

#### 3.2.7. **`UserNav` (`src/components/layout/user-nav.tsx`)**

- ヘッダー右上に配置されるユーザーアバターアイコンおよびドロップダウンメニュー。
- ドロップダウン内部は上部に「大型アバター＋名前＋メールアドレス」をまとめたアカウントカード、下部にマイページやログアウトボタンを配置した Microsoft 風 UI を採用。

#### 3.2.8. **`useAuthLogout` (`src/hooks/use-auth-logout.ts`)**

- `useTransition` を使用してログアウト中のローディング状態（`isPending`）を管理。
- `authLogoutAction` を呼び出して Cookie を全削除後、Sonner トースト表示とともに `router.push('/login')` および `router.refresh()` を実行。

---

## 4. 処理フロー（シーケンス図）

### 4.1 ログイン実行～ダッシュボード遷移フロー

```mermaid
sequenceDiagram
    autonumber
    actor User as ユーザー
    participant Form as AuthLoginForm / Hook
    participant Action as Server Action<br/>(authLoginAction)
    participant API as Spring Boot API<br/>(/api/v1/auth/login)
    participant Cookie as Browser Cookie
    participant MW as Middleware<br/>(src/middleware.ts)
    participant Dash as Dashboard Page

    User->>Form: メールアドレス・パスワード入力＆送信
    Form->>Action: authLoginAction(payload) 呼び出し
    Action->>API: POST /api/v1/auth/login (JSON)
    
    alt 1. API認証失敗 (401 / 500)
        API-->>Action: エラーレスポンス (JSON)
        Action-->>Form: { success: false, message: "..." } 返却
        Form->>User: トーストでエラーメッセージ表示
    else 2. API認証成功 (200 OK)
        API-->>Action: { token: "JWT..." } 返却
        Action->>Cookie: auth_token として Cookie 保存 (httpOnly, path=/)
        Action-->>Form: { success: true } 返却
        Form->>User: 成功トースト表示 ("ログインしました")
        Note over Form: 200ms 待機後、router.push('/') を実行
        
        Form->>MW: リクエスト (GET /)
        Note over MW: auth_token の存在確認 -> OK
        MW->>Dash: 画面描画許可 (NextResponse.next)
        Dash-->>User: ダッシュボード画面を表示
    end

```

### 4.2 直打ち（アドレスバー直接指定）アクセス時のミドルウェア制御フロー

```mermaid
sequenceDiagram
    autonumber
    actor User as ユーザー
    participant MW as Middleware<br/>(src/middleware.ts)
    participant Cookie as Browser Cookie
    participant App as Next.js Router

    User->>MW: アドレスバーに URL 直接入力 (例: /login)
    MW->>Cookie: auth_token の取得要求
    
    alt A. ログイン済み（トークン存在）かつ /login へアクセス
        Cookie-->>MW: トークン取得成功
        Note over MW: ログイン済みの公開パスアクセスを検知
        MW-->>App: リダイレクト命令 (NextResponse.redirect -> '/')
        App-->>User: ダッシュボード (/) を表示
    else B. 未ログイン（トークンなし）かつ 保護パス (/) へアクセス
        Cookie-->>MW: トークンなし (null/undefined)
        Note over MW: 未ログインの保護パスアクセスを検知
        MW-->>App: リダイレクト命令 (NextResponse.redirect -> '/login')
        App-->>User: ログイン画面 (/login) を表示
    end

```

### 4.3 ログアウト実行フロー

```mermaid
sequenceDiagram
    autonumber
    actor User as ユーザー
    participant Nav as UserNav Component
    participant Hook as useAuthLogout Hook
    participant Action as Server Action<br/>(authLogoutAction)
    participant Cookie as Browser Cookie
    participant App as Next.js Router

    User->>Nav: アバターメニューから「ログアウト」をクリック
    Nav->>Hook: handleLogout() 実行
    Note over Hook: isPending = true (ボタン非活性化・ローディング表記)
    Hook->>Action: authLogoutAction() 呼び出し
    Action->>Cookie: deleteSessionCookie() (auth_token, user_email, user_name 削除)
    Action-->>Hook: { success: true } 返却
    Hook->>User: 成功トースト表示 ("ログアウトしました")
    Hook->>App: router.push('/login') 実行
    Hook->>App: router.refresh() 実行 (サーバーコンポーネント状態最新化)
    App-->>User: ログイン画面 (/login) を表示

```

---

## 5. 開発時の留意事項・ハマりどころ（Pitfalls & Best Practices）

ドキュメントとして将来の保守・改修時に特に注意すべきポイントを以下に記録します。

### ① `middleware.ts` の配置場所（最重要）

- **罠**: `src` ディレクトリ構造を採用しているプロジェクトにおいて、`middleware.ts` をプロジェクトルート直下に配置すると **Next.js に完全に無視され、ミドルウェアが一切起動しない**。
- **対策**: 必ず **`src/middleware.ts`** に配置すること。

### ② ミドルウェアの実行環境とログ出力

- **罠**: ミドルウェアはブラウザ（クライアント）ではなく Node.js サーバー環境で実行されるため、`console.log` を仕込んでもブラウザのデベロッパーツール（F12）には表示されない。
- **対策**: 動作確認時のログは **`npm run dev` を実行している Terminal（サーバーログ）** を確認すること。

### ③ Server Actions における `redirect()` の取り扱い

- **罠**: Server Action 内で Next.js の `redirect()` 関数を呼び出すと内部的に特殊な例外を発生させるため、呼び出し側の `try-catch` やカスタムフックで正常に結果を処理できず、トースト表示がキャンセルされる。
- **対策**: Server Action 側では `redirect()` は使わず、処理結果オブジェクト（`{ success: boolean, message?: string }`）を返却するのみ留める。リダイレクト制御は呼び出し側のクライアント（Custom Hook 内の `router.push` や `router.replace`）で実行する。

### ④ トースト表示と画面遷移のタイミング制御

- **罠**: ログイン成功時にトーストを表示して即座に `router.push()` を実行すると、コンポーネントがアンマウントされてトーストが画面に映る前に消えてしまう。
- **対策**: `setTimeout`（100〜300ms 程度）のディレイを挟んでから `router.push` を呼び出すことで、ユーザーに成功トーストを確実に視認させる。

### ⑤ CORS と Credentials（Spring Boot 連携）

- **罠**: Cookie を利用した認証通信を行う場合、Spring Boot 側の SecurityConfig で `allowedOrigins("*")` を設定しているとブラウザが Security エラーで通信を遮断する。
- **対策**: `allowCredentials(true)` を有効化し、`allowedOrigins` には `http://localhost:3000` などの具体的な送信元オリジンを明示的に指定すること。

### ⑥ クライアントコンポーネントでの Cookie 取得と SSR ハイドレーション

- **罠**: クライアントコンポーネントで直接 `Cookies.get()` して初期値にセットすると、サーバーレンダリング時（Cookie 読み取り不可）とクライアントハイドレーション時で DOM にギャップが生じ、Hydration Error が発生する。
- **対策**: `useCurrentUser` 内のように、初期状態は空文字列にしておき `useEffect` 内で Cookie を取得・セットすること。

---
