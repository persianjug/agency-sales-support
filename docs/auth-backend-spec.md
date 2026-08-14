# 認証・認可API仕様書

---

## 1. 概要

### 1.1 目的

本APIは認証・認可機能（アカウント登録、ログイン認証、パスワード変更、パスワード再設定）を提供する REST API の仕様を定義します。

### 1.2 システム構成

- **技術スタック**:
  - Spring Security, MyBatis, JWT (`jjwt`), PostgreSQL, BCrypt
- **方式**:
  - JWT（JSON Web Token）によるステートレス認証
- **パスワードハッシュ化**:
  - BCrypt（アルゴリズム）

---

## 2. 共通仕様

### 2.1 JWT トークン仕様

- **ヘッダー/形式**:
  - Bearer トークン (`Authorization: Bearer <token>`)
- **有効期限**:
  - 24時間 (`86,400,000` ms)
- **Claims（トークンに含まれる情報）**:
  - `sub` (username)
  - `roles` (権限情報)
  - `iat` / `exp` (発行日時・有効期限)

### 2.2 共通エラーレスポンス構造 (`ErrorResponse`)

エラー発生時は、HTTP ステータスコードに応じた統一フォーマットの JSON を返却します。

| 項目名 | 型 | 説明 | 例 |
| --- | --- | --- | --- |
| `timestamp` | String (ISO-8601) | エラー発生時刻 (日本時間) | `"2026-08-13T21:00:00.000+09:00"` |
| `status` | Integer | HTTP ステータスコード | `401` |
| `error` | String | エラー種別識別子 | `"UNAUTHORIZED"` |
| `message` | String | ユーザー向けエラー詳細メッセージ | `"ユーザー名またはパスワードが正しくありません。"` |

### 3.2 エラー種別マッピング

| エラー種別 | 説明 |
| --- | --- |
| `400 Bad Request` (`BAD_REQUEST`) | リクエストパラメータ不正、バリデーションエラー、アカウント重複、無効/期限切れトークンなど |
| `401 Unauthorized` (`UNAUTHORIZED`) | 認証失敗（ID/パスワード不一致） |
| `500 Internal Server Error` (`INTERNAL_SERVER_ERROR`) | サーバー内部エラー、メール送信失敗など |

---

## 3. エンドポイント詳細仕様

### 3.1 新規アカウント登録 (Signup)

新規ユーザーのアカウント登録を行い、登録完了後に自動ログイン用 JWT トークンを返却します。

- **URL**:
  - `/api/v1/auth/signup`
- **Method**:
  - `POST`
- **認証**:
  - 不要

#### リクエストボディ (`SignupRequest`)

```json
{
  "name": "山田 太郎",
  "username": "user@example.com",
  "password": "password123"
}
```

| 項目名 | 型 | 必須 | 説明 |
| --- | --- | --- | --- |
| `name` | String | ○ | ユーザー表示名 |
| `username` | String | ○ | ユーザー名（メールアドレス形式） |
| `password` | String | ○ | パスワード（平文） |

#### レスポンス (`200 OK` / `AuthResponse`)

```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "username": "user@example.com",
  "name": "山田 太郎"
}
```

#### エラーレスポンス例 (`400 Bad Request`)

- 既に該当ユーザー名が存在する場合：

```json
{
  "timestamp": "2026-08-13T21:00:00.000+09:00",
  "status": 400,
  "error": "BAD_REQUEST",
  "message": "指定されたメールアドレスは既に登録されています。"
}
```

---

### 3.2 ログイン (Login)

ユーザー認証（ユーザー名・パスワード）を行い、認証に成功した場合に JWT トークンを発行します。

- **URL**:
  - `/api/v1/auth/login`
- **Method**:
  - `POST`
- **認証**:
  - 不要

#### リクエストボディ (`AuthRequest`)

```json
{
  "username": "user@example.com",
  "password": "password123"
}
```

| 項目名 | 型 | 必須 | 説明 |
| --- | --- | --- | --- |
| `username` | String | ○ | ユーザー名（メールアドレス） |
| `password` | String | ○ | パスワード（平文） |

#### レスポンス (`200 OK` / `AuthResponse`)

```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "username": "user@example.com",
  "name": "山田 太郎"
}
```

#### エラーレスポンス例 (`401 Unauthorized`)

- ユーザー名またはパスワードに誤りがある場合：

```json
{
  "timestamp": "2026-08-13T21:00:00.000+09:00",
  "status": 401,
  "error": "UNAUTHORIZED",
  "message": "ユーザー名またはパスワードが正しくありません。"
}
```

---

### 3.3 パスワード変更 (Change Password)

ログイン中のユーザーが自身のパスワードを変更します。現在パスワードによる照合と、新旧パスワードの重複チェックを実施します。変更完了後、更新後の自動ログイン用 JWT トークンを返却します。

- **URL**:
  - `/api/v1/auth/change-password`
- **Method**:
  - `POST`
- **認証**:
  - 不要（現在パスワードによる照合を実施）

#### リクエストボディ (`ChangePasswordRequest`)

```json
{
  "username": "user@example.com",
  "currentPassword": "oldPassword123",
  "newPassword": "newPassword456"
}
```

| 項目名 | 型 | 必須 | 説明 |
| --- | --- | --- | --- |
| `username` | String | ○ | ユーザー名（メールアドレス） |
| `currentPassword` | String | ○ | 現在のパスワード（平文） |
| `newPassword` | String | ○ | 新しいパスワード（平文） |

#### レスポンス (`200 OK` / `AuthResponse`)

```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "username": "user@example.com",
  "name": "山田 太郎"
}
```

#### エラーレスポンス例 (`400 Bad Request`)

- 現在のパスワードが正しくない場合：

```json
{
  "timestamp": "2026-08-13T21:00:00.000+09:00",
  "status": 400,
  "error": "BAD_REQUEST",
  "message": "現在のパスワードが正しくありません。"
}
```

- 新しいパスワードが現在のパスワードと同じ場合：

```json
{
  "timestamp": "2026-08-13T21:00:00.000+09:00",
  "status": 400,
  "error": "BAD_REQUEST",
  "message": "新しいパスワードには、現在のパスワードと異なるものを入力してください。"
}
```

- アカウントが存在しない場合：

```json
{
  "timestamp": "2026-08-13T21:00:00.000+09:00",
  "status": 400,
  "error": "BAD_REQUEST",
  "message": "アカウントが存在しません。"
}
```

---

### 3.4 パスワード再設定申請 (Forgot Password)

パスワードを忘れたユーザーからの再設定申請を受け付け、再設定用トークンを発行して案内メールを送信します。
※ユーザー存在チェックによる列挙攻撃を防止するため、指定されたユーザーが存在しない場合でも同一の成功レスポンスを返却します。

- **URL**:
  - `/api/v1/auth/forgot-password`
- **Method**:
  - `POST`
- **認証**:
  - 不要

#### リクエストボディ (`ForgotPasswordRequest`)

```json
{
  "username": "user@example.com"
}
```

| 項目名 | 型 | 必須 | 説明 |
| --- | --- | --- | --- |
| `username` | String | ○ | ユーザー名（メールアドレス） |

#### レスポンス (`200 OK` / `MessageResponse`)

```json
{
  "message": "パスワード再設定用のメールを送信しました。"
}
```

#### メール送信仕様

- **有効期限**:
  - トークン発行から30分
- **送信先**:
  - リクエストされたメールアドレス
- **再設定用URL形式**:
  - `{cors.allowed-origins}/reset-password?token={rawToken}`
- **トークン保存仕様**:
  - 過去の未消費トークンは物理削除の上、生トークンの SHA-256 ハッシュ値を DB に保存

---

### 3.5 パスワード再設定実行 (Reset Password)

メール通知された生トークンを検証し、パスワードの再設定を行います。完了後、使用済みフラグ（`used_at`）を更新し、新しい JWT トークンを返却します。

- **URL**:
  - `/api/v1/auth/reset-password`
- **Method**:
  - `POST`
- **認証**:
  - 不要

#### リクエストボディ (`ResetPasswordRequest`)

```json
{
  "token": "raw_token_string_from_email",
  "newPassword": "newPassword456"
}
```

| 項目名 | 型 | 必須 | 説明 |
| --- | --- | --- | --- |
| `token` | String | ○ | メール通知された生トークン文字列 |
| `newPassword` | String | ○ | 新しいパスワード（平文） |

#### レスポンス (`200 OK` / `AuthResponse`)

```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "username": "user@example.com",
  "name": "山田 太郎"
}
```

#### エラーレスポンス例 (`400 Bad Request` / `409 Conflict`)

- トークンが無効な場合 (`400 Bad Request`)：

```json
{
  "timestamp": "2026-08-13T21:00:00.000+09:00",
  "status": 400,
  "error": "BAD_REQUEST",
  "message": "無効なトークンです。"
}
```

- トークンが既に使用済みの場合 (`409 Conflict`)：

```json
{
  "timestamp": "2026-08-13T21:00:00.000+09:00",
  "status": 409,
  "error": "CONFLICT",
  "message": "このリンクは既に使用されています。"
}
```

- トークンの有効期限が切れている場合 (`400 Bad Request`)：

```json
{
  "timestamp": "2026-08-13T21:00:00.000+09:00",
  "status": 400,
  "error": "BAD_REQUEST",
  "message": "リンクの有効期限が切れています。"
}
```

- 新しいパスワードが現在のパスワードと同じ場合 (`400 Bad Request`)：

```json
{
  "timestamp": "2026-08-13T21:00:00.000+09:00",
  "status": 400,
  "error": "BAD_REQUEST",
  "message": "新しいパスワードには、現在のパスワードと異なるものを入力してください。"
}
```

---

## 4. データベーステーブル定義（参考）

### `accounts` テーブル

| カラム名 | 型 | 制約 | 説明 |
| --- | --- | --- | --- |
| `id` | BIGINT | PRIMARY KEY, AUTO_INCREMENT | アカウントID |
| `username` | VARCHAR | UNIQUE, NOT NULL | ユーザー名（メールアドレス） |
| `password` | VARCHAR | NOT NULL | BCrypt暗号化済みパスワード |
| `name` | VARCHAR | NOT NULL | ユーザー表示名 |
| `role` | VARCHAR | NOT NULL | 権限ロール (`ROLE_USER`等) |

### `password_reset_tokens` テーブル

| カラム名 | 型 | 制約 | 説明 |
| --- | --- | --- | --- |
| `id` | BIGINT | PRIMARY KEY, AUTO_INCREMENT | トークンID |
| `account_id` | BIGINT | FOREIGN KEY | 対象アカウントID |
| `token_hash` | VARCHAR | NOT NULL | SHA-256 ハッシュ化済みトークン |
| `expires_at` | TIMESTAMP | NOT NULL | 有効期限（発行から30分） |
| `used_at` | TIMESTAMP | NULL | 消費日時 |
| `created_at` | TIMESTAMP | NOT NULL | 発行日時 (デフォルト `NOW()`) |

---

## 5. 処理フロー（シーケンス図）

### 5.1 ログイン認証・JWTトークン発行処理シーケンス

```mermaid
sequenceDiagram
    autonumber
    actor Client as クライアント
    participant SecFilter as セキュリティフィルタ<br/>(SecurityFilterChain)
    participant AuthCtrl as 認証コントローラー<br/>(AuthController)
    participant AuthSvc as 認証サービス<br/>(AuthService)
    participant AuthMgr as 認証マネージャー<br/>(AuthenticationManager)
    participant DaoProvider as DAO認証プロバイダー<br/>(DaoAuthenticationProvider)
    participant UserDts as ユーザー詳細サービス<br/>(CustomUserDetailsService)
    participant Mapper as アカウントマッパー<br/>(AccountMapper)
    participant DB as データベース<br/>(accountsテーブル)
    participant Encoder as パスワード暗号化機能<br/>(PasswordEncoder)
    participant JwtProv as JWT生成機能<br/>(JwtTokenProvider)
    participant ExHandler as 共通例外ハンドラー<br/>(GlobalExceptionHandler)

    %% --- リクエスト開始 ---
    Client->>SecFilter: ログイン要求 (POST /api/v1/auth/login)
    Note over SecFilter: /api/v1/auth/** は許可設定のため無条件通過
    SecFilter->>AuthCtrl: リクエスト転送 (login)
    AuthCtrl->>AuthSvc: ログイン処理を呼び出し (login)

    %% --- 認証処理 ---
    AuthSvc->>AuthMgr: ユーザー認証を実行 (authenticate)
    AuthMgr->>DaoProvider: 認証処理を委譲 (authenticate)
    
    %% --- ユーザー検索 ---
    DaoProvider->>UserDts: ユーザー情報の取得要求 (loadUserByUsername)
    UserDts->>Mapper: ユーザー名からアカウント検索 (findByUsername)
    Mapper->>DB: ユーザー情報を取得 (SELECT ... WHERE username = ?)
    
    alt 1. ユーザーが存在しない場合 (Optional.empty)
        DB-->>Mapper: 検索結果：なし (0件)
        Mapper-->>UserDts: 空のOptionalを返却
        UserDts-->>DaoProvider: ユーザー未存在例外を発生 (UsernameNotFoundException)
        DaoProvider-->>AuthMgr: 認証失敗例外に変換 (BadCredentialsException)
        AuthMgr-->>AuthSvc: 認証失敗例外を伝播 (BadCredentialsException)
        AuthSvc-->>AuthCtrl: 例外発生
        AuthCtrl-->>ExHandler: 例外を捕捉 (handleAuthException)
        ExHandler-->>Client: 401エラー返却 (UNAUTHORIZED / ErrorResponse)
        
    else 2. ユーザーが存在する場合
        DB-->>Mapper: 検索結果：アカウント情報取得 (id, username, password, role)
        Mapper-->>UserDts: Accountオブジェクト返却
        Note over UserDts: 権限名を整形してSpring Security用Userを構築<br/>User.withUsername().roles(...)
        UserDts-->>DaoProvider: ユーザー詳細情報を返却 (UserDetails)

        %% --- パスワード照合 ---
        DaoProvider->>Encoder: 入力パスワードとDBハッシュ値を照合 (matches)
        
        alt パスワードが不一致の場合
            Encoder-->>DaoProvider: 照合結果：失敗 (false)
            DaoProvider-->>AuthMgr: 認証失敗例外を発生 (BadCredentialsException)
            AuthMgr-->>AuthSvc: 認証失敗例外を伝播 (BadCredentialsException)
            AuthSvc-->>AuthCtrl: 例外発生
            AuthCtrl-->>ExHandler: 例外を捕捉 (handleAuthException)
            ExHandler-->>Client: 401エラー返却 (UNAUTHORIZED / ErrorResponse)
            
        else パスワードが一致する場合
            Encoder-->>DaoProvider: 照合結果：成功 (true)
            DaoProvider-->>AuthMgr: 認証完了オブジェクトを返却 (Authentication)
            AuthMgr-->>AuthSvc: 認証完了オブジェクトを返却 (Authentication)
            
            %% --- トークン生成 ---
            Note over AuthSvc: 認証情報からロール権限文字列を取得 (ROLE_ADMIN等)
            AuthSvc->>JwtProv: JWTトークンの生成を依頼 (generateToken)
            Note over JwtProv: 暗号化キーで署名してトークン作成<br/>Jwts.builder().compact()
            JwtProv-->>AuthSvc: JWTトークン文字列を返却
            AuthSvc-->>AuthCtrl: レスポンスDTO作成 (AuthReponse)
            AuthCtrl-->>Client: 200成功レスポンス返却 (AuthReponse / JWTトークン)
        end
    end
```

### 5.2 パスワード変更シーケンス

```mermaid
sequenceDiagram
    autonumber
    actor Client as クライアント
    participant AuthCtrl as 認証コントローラー<br/>(AuthController)
    participant AuthSvc as 認証サービス<br/>(AuthService)
    participant Mapper as アカウントマッパー<br/>(AccountMapper)
    participant DB as データベース<br/>(accountsテーブル)
    participant Encoder as パスワード暗号化機能<br/>(PasswordEncoder)

    Client->>AuthCtrl: パスワード変更リクエスト <br/> (PUT /api/v1/auth/change-password)
    AuthCtrl->>AuthSvc: パスワード変更処理 (changePassword)
    
    AuthSvc->>Mapper: アカウント検索 (findByUsername)
    Mapper->>DB: ユーザー情報を取得 (SELECT * FROM accounts WHERE username = ?)
    DB-->>Mapper: 該当アカウント取得 (Accountオブジェクト返却)
    
    alt アカウント存在しない場合
        Mapper-->>AuthSvc: 空返却 (Optional.empty)
        AuthSvc-->>AuthCtrl: 例外発生（IllegalArgumentException）
        AuthCtrl-->>Client: 400エラー返却 (Bad Request / ErrorResponse) <br/>※アカウントが存在しません。
    else アカウント存在する場合
        AuthSvc->>Encoder: リスクエストの現パスワードとDBの現在パスワードの照合 (matches)
        
        alt パスワード不一致
            Encoder-->>AuthSvc: 照合NG (false)
            AuthSvc-->>AuthCtrl: 例外発生（IllegalArgumentException）
            AuthCtrl-->>Client: 400エラー返却 (Bad Request / ErrorResponse) <br/>※現在のパスワードが正しくありません。
        else パスワード一致
            AuthSvc->>Encoder: リスクエストの新パスワードとDBの現在パスワードの照合 (matches)
            
            alt 新パスワードが現パスワードと一致
                Encoder-->>AuthSvc: 照合OK (true)
                AuthSvc-->>AuthCtrl: 例外発生（IllegalArgumentException）
                AuthCtrl-->>Client: 400エラー返却 (Bad Request / ErrorResponse) <br/>※新しいパスワードには、現在のパスワードと異なるものを入力してください。
            else 
                AuthSvc->>Encoder: 新パスワードをハッシュ化 (encode)
                AuthSvc->>Mapper: パスワード更新 (updatePassword)
                Mapper->>DB: パスワード更新 (UPDATE accounts SET password = ?)
                AuthSvc-->>AuthCtrl: 認証レスポンス返却 (JWTトークン生成)
                AuthCtrl-->>Client:  200成功レスポンス返却 (AuthReponse / JWTトークン)
            end
        end
    end
```

### 5.3 パスワード再設定申請処理シーケンス

```mermaid
sequenceDiagram
    autonumber
    actor Client as クライアント
    participant AuthCtrl as 認証コントローラー<br/>(AuthController)
    participant AuthSvc as 認証サービス<br/>(AuthService)
    participant Mapper as アカウントマッパー<br/>(AccountMapper)
    participant TokenMapper as トークンマッパー<br/>(TokenMapper)
    participant Mail as メール送信機能

    Client->>AuthCtrl: 再設定申請<br/>  (POST /api/v1/auth/forgot-password)
    AuthCtrl->>AuthSvc: 再設定申請処理 (requestPasswordReset)
    
    AuthSvc->>Mapper: アカウント検索 (findByUsername)
    
    alt アカウントが存在しない場合
        Note over AuthSvc: 列挙攻撃対策のため静かに復帰
    else アカウントが存在する場合
        AuthSvc->>AuthSvc: 安全な生トークン生成
        AuthSvc->>AuthSvc: SHA-256 ハッシュ化
        AuthSvc->>TokenMapper: 過去トークン削除
        AuthSvc->>TokenMapper: 新規トークン登録
    end
    
    AuthSvc->>Mail: 再設定メール送信 (sendResetEmail)
    AuthSvc-->>AuthCtrl: 認証レスポンス返却
    AuthCtrl-->>Client: 200成功レスポンス返却 (MessageResponse)
```

### 5.4 パスワード再設定実行処理シーケンス

```mermaid
sequenceDiagram
    autonumber
    actor Client as クライアント
    participant AuthCtrl as 認証コントローラー<br/>(AuthController)
    participant AuthSvc as 認証サービス<br/>(AuthService)
    participant TokenMapper as トークンマッパー<br/>(TokenMapper)
    participant Mapper as アカウントマッパー<br/>(AccountMapper)
    participant Encoder as パスワード暗号化機能<br/>(PasswordEncoder)
    participant DB as データベース<br/>(accountsテーブル, <br/>password_reset_tokensテーブル)


    Client->>AuthCtrl: 再設定実行 (POST /api/v1/auth/reset-password)
    AuthCtrl->>AuthSvc: パスワード再設定実行処理 (resetPassword)
    
    AuthSvc->>AuthSvc: トークンをハッシュ化
    AuthSvc->>TokenMapper: トークン取得 (findByTokenHash)
    
    alt トークン無効/期限切れ/使用済みの場合
        TokenMapper-->>AuthSvc: エラー返却
        AuthSvc-->>AuthCtrl: 例外発生 (IllegalArgumentException)
        AuthCtrl-->>Client: 400/409 エラー<br/>※無効なトークンです。<br/>※このリンクは既に使用されています。<br/>※リンクの有効期限が切れています。
    else トークン有効の場合
        AuthSvc->>Mapper: アカウント取得 (findById)
        AuthSvc->>Encoder: 新パスワードと現在パスワードの重複チェック
        
        alt アカウント存在しない場合
            AuthSvc-->>AuthCtrl: 例外発生 (IllegalArgumentException)
            AuthCtrl-->>Client: 400エラー返却 (Bad Request / ErrorResponse) <br/>※アカウントが存在しません。
        else アカウント存在するの場合
            Mapper-->>AuthSvc: Accountオブジェクト返却
            AuthSvc->>Encoder: 新パスワードとDBの現在パスワードの照合 (matches)
            
            alt 新パスワードが現在パスワードと一致する場合
                Encoder-->>AuthSvc: 照合OK (true)
                AuthSvc-->>AuthCtrl: 例外発生 (IllegalArgumentException)
                AuthCtrl-->>Client: 400エラー返却 (Bad Request / ErrorResponse) <br/>※新しいパスワードには、現在のパスワードと異なるものを入力してください。
            else 新パスワードが現在パスワードと異なる場合
                Encoder-->>AuthSvc: 照合NG (false)
                AuthSvc->>Encoder: 新パスワードをハッシュ化 (encode)
                Encoder-->>AuthSvc: BCryptハッシュ文字列返却
                
                AuthSvc->>Mapper: パスワード更新 (updatePassword)
                Mapper->>DB: パスワード更新 (UPDATE accounts SET password = ?)
                
                AuthSvc->>TokenMapper: トークン使用済み更新 (updateUsedAt)
                TokenMapper->>DB: トークン更新 (UPDATE password_reset_tokens SET used_at = NOW()...)
                
                AuthSvc-->>AuthCtrl: 認証レスポンス返却 (JWTトークン生成)
                AuthCtrl-->>Client: 200成功レスポンス返却 (AuthResponse / JWTトークン)
            end
        end
    end
```

### 5.5 新規アカウント登録処理シーケンス

```mermaid
sequenceDiagram
    autonumber
    actor Client as クライアント
    participant SecFilter as セキュリティフィルタ<br/>(SecurityFilterChain)
    participant AuthCtrl as 認証コントローラー<br/>(AuthController)
    participant AuthSvc as 認証サービス<br/>(AuthService)
    participant Mapper as アカウントマッパー<br/>(AccountMapper)
    participant DB as データベース<br/>(accountsテーブル)
    participant Encoder as パスワード暗号化機能<br/>(PasswordEncoder)
    participant JwtProv as JWT生成機能<br/>(JwtTokenProvider)
    participant ExHandler as 共通例外ハンドラー<br/>(GlobalExceptionHandler)

    %% --- リクエスト開始 ---
    Client->>SecFilter: アカウント登録要求 (POST /api/v1/auth/signup)
    Note over SecFilter: /api/v1/auth/** は許可設定のため無条件通過
    SecFilter->>AuthCtrl: リクエスト転送 (signup)
    AuthCtrl->>AuthSvc: サインアップ処理を呼び出し (signup)

    %% --- アカウント重複チェック ---
    AuthSvc->>Mapper: ユーザー名の存在チェック (existsByUsername)
    Mapper->>DB: ユーザー重複確認 (SELECT COUNT(*) FROM accounts WHERE username = ?)
    DB-->>Mapper: 検索結果返却
    Mapper-->>AuthSvc: 存在の有無 (boolean)

    alt 1. 指定されたメールアドレスが既に存在する場合
        AuthSvc-->>AuthCtrl: 重複例外を発生 (IllegalArgumentException)
        AuthCtrl-->>ExHandler: 例外を捕捉 (handleIllegalArgumentException)
        ExHandler-->>Client: 400エラー返却 (BAD_REQUEST / ErrorResponse)<br/>※指定されたメールアドレスは既に登録されています。

    else 2. メールアドレスが未登録の場合
        %% --- パスワードハッシュ化 & アカウント保存 ---
        AuthSvc->>Encoder: パスワードをハッシュ化 (encode)
        Encoder-->>AuthSvc: BCryptハッシュ文字列返却
        
        AuthSvc->>Mapper: アカウント登録 (insert)
        Mapper->>DB: アカウント情報保存 (INSERT INTO accounts...)
        DB-->>Mapper: 保存完了通知
        Mapper-->>AuthSvc: 登録完了

        %% --- 自動ログイン用トークン生成 ---
        AuthSvc->>JwtProv: JWTトークンの生成を依頼 (generateToken)
        Note over JwtProv: 暗号化キーで署名してトークン作成<br/>Jwts.builder().compact()
        JwtProv-->>AuthSvc: JWTトークン文字列を返却
        
        AuthSvc-->>AuthCtrl: レスポンスDTO作成 (AuthResponse)
        AuthCtrl-->>Client: 200成功レスポンス返却 (AuthResponse / JWTトークン)
    end
```
