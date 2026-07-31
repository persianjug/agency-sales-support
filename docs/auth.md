# 認証・認可API仕様書

---

## 1. 概要

---

### 1.1 目的

本APIは認証・認可に必要なトークン取得機能を提供します。

### 1.2 システム構成

- **技術スタック**:
  - Spring Security, MyBatis, JWT (`jjwt`), PostgreSQL, BCrypt
- **方式**:
  - JWT（JSON Web Token）によるステートレス認証
- **パスワードハッシュ化**:
  - BCrypt（アルゴリズム）

## 2. JWT トークン仕様

---

- **ヘッダー/形式**:
  - Bearer トークン (`Authorization: Bearer <token>`)
- **有効期限**:
  - 24時間 (`86,400,000` ms)
- **Claims（トークンに含まれる情報）**:
  - `sub` (username)
  - `roles` (権限情報)
  - `iat` / `exp` (発行日時・有効期限)

## 3. API仕様

---

### 3.1 エンドポイント一覧

| エンドポイント | HTTPメソッド | 必要な権限 | 概要 |
| --- | --- | --- | --- |
| `/api/v1/auth/login` | POST | 未認証（PermitAll） | 認証実行・JWT発行 |
| `/v3/api-docs/**` | GET | 未認証（PermitAll） | Swagger API定義 |
| `/swagger-ui/**` | GET | 未認証（PermitAll） | Swagger UI |
| `/api/v1/sales/**` など | ALL | 要認証 (`authenticated`) | 営業系業務API |

### 3.2 認証実行・JWT発行

- **エンドポイント**: `POST /api/v1/auth/login`
- **Content-Type**: `application/json`

#### リクエストパラメータ

| パラメータ | 型 | 必須 | 説明 |
| --- | --- | --- | --- |
| `username` | string | 〇 | ユーザー名 |
| `password` | string | 〇 | パスワード |

#### リクエストボディ

```json
  {
    "username": "admin",
    "password": "password123"
  }
```

#### 成功レスポンス（成功・201 OK）

```json
  {
    "token": [トークンの内容]
  }
```

#### エラーレスポンス

##### 認証エラー（401・UNAUTHORIZED）

```json
{
  "error": "UNAUTHORIZED",
  "message": "ユーザー名またはパスワードが正しくありません。",
  "status": 401,
  "timestamp": "2026-07-31T01:24:18.956275700Z"
}
```

##### その他エラー（500・INTERNAL SERVER ERROR）

```json
{
  "error": "INTERNAL_SERVER_ERROR",
  "message": "システムエラーが発生しました。時間をおいて再度お試しください。",
  "status": 500,
  "timestamp": "2026-07-31T01:24:18.956275700Z"
}
```

---

## 4. 処理フロー（シーケンス図）

### 4.1 ログイン認証・JWTトークン発行処理シーケンス

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

### 4.2 アプリケーション起動時の初期データ投入フロー（参考）

```mermaid
sequenceDiagram
    autonumber
    participant App as システム起動処理<br/>(SalesApplication)
    participant AuthCtrl as 認証コントローラー<br/>(AuthController / initDatabase)
    participant Mapper as アカウントマッパー<br/>(AccountMapper)
    participant DB as データベース<br/>(accountsテーブル)
    participant Encoder as パスワード暗号化機能<br/>(PasswordEncoder)

    App->>AuthCtrl: 起動時初期化処理を実行 (CommandLineRunner)
    AuthCtrl->>Mapper: 「admin」ユーザーの存在確認 (findByUsername)
    Mapper->>DB: accountsテーブルから「admin」を検索 (SELECT)
    
    alt admin ユーザーが存在しない場合
        DB-->>Mapper: 検索結果：なし (0件)
        Mapper-->>AuthCtrl: 未登録 (Optional.empty) を返却
        AuthCtrl->>Encoder: 初期パスワード「password123」を暗号化 (encode)
        Encoder-->>AuthCtrl: ハッシュ化された文字列を返却
        AuthCtrl->>Mapper: 管理者アカウント (admin) の登録要求 (insert)
        Mapper->>DB: accountsテーブルへ新規登録 (INSERT)
    else admin ユーザーが既に存在する場合
        DB-->>Mapper: 検索結果：あり (1件)
        Mapper-->>AuthCtrl: 登録済みアカウント情報を返却
        Note over AuthCtrl: データ登録処理をスキップ
    end
   ```
