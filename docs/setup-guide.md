# 🚀 プロジェクト作成・環境構築コマンドメモ

## 1. Next.js (フロントエンド) の作成

VS Codeで親フォルダを開き、ターミナル（`Ctrl + Shift + @` または `Cmd + Shift + @`）で実行。

```bash
# Next.js (TypeScript / App Router / Tailwind CSS) の最新プロジェクトを作成
npx create-next-app@latest frontend
```

### 質問の選択肢（インタラクティブ設定）

プロンプトが出たら、以下のように選択する：

```text
✔ Would you like to use TypeScript? … Yes
✔ Would you like to use ESLint? … Yes
✔ Would you like to use Tailwind CSS? … Yes
✔ Would you like to use `src/` directory? … Yes
✔ Would you like to use App Router? … Yes
✔ Would you like to customize the default import alias (@/*)? … No
```

### shadcn/ui の初期化とコンポーネント追加

作成したプロジェクトフォルダに移動して、shadcn/uiをセットアップ。

```bash
# フロントエンドのディレクトリへ移動
cd frontend

# shadcn/ui の初期化
npx shadcn@latest init

# 今回使う主要コンポーネント（コマンドパレット、テーブル等）を一括追加
npx shadcn@latest add command dialog table dropdown-menu button input
```

---

## 2. Spring Boot (バックエンド) の作成

ビルドツールは **Gradle** または **Maven** から選択可能。

### A案: Web GUI（Spring Initializr）を使う場合（推奨）

1. ブラウザで [start.spring.io](https://start.spring.io/) にアクセス。
2. 以下の設定を選択：
   - **Project:** `Gradle - Groovy` (または `Gradle - Kotlin` / `Maven`)
   - **Language:** Java
   - **Spring Boot:** 最新安定版 (3.x系)
   - **Packaging:** Jar
   - **Java:** 17 または 21
3. **Dependencies (依存関係)** で以下を追加して `GENERATE` を押す：
   - `Spring Web`
   - `Spring Security`
   - `MyBatis Framework`
   - `PostgreSQL Driver`
   - `Lombok`
4. ダウンロードしたZIPを解凍し、VS Codeで開く。

### B案: ターミナル（curl）で一発作成する場合

#### 🐘 Gradleプロジェクトを作る場合

```bash
# Gradle (Groovy DSL) でプロジェクト（ZIP）を取得して解凍
curl [https://start.spring.io/starter.zip](https://start.spring.io/starter.zip) \
  -d type=gradle-project \
  -d dependencies=web,security,mybatis,postgresql,lombok \
  -d language=java \
  -d javaVersion=17 \
  -d name=backend \
  -o backend.zip

# ZIPを解凍して元ファイルを削除
tar -xf backend.zip
rm backend.zip
```

#### 🛠️ Mavenプロジェクトを作る場合

```bash
# Maven でプロジェクト（ZIP）を取得して解凍
curl [https://start.spring.io/starter.zip](https://start.spring.io/starter.zip) \
  -d type=maven-project \
  -d dependencies=web,security,mybatis,postgresql,lombok \
  -d language=java \
  -d javaVersion=17 \
  -d name=backend \
  -o backend.zip

# ZIPを解凍して元ファイルを削除
tar -xf backend.zip
rm backend.zip
```

---

## 3. PostgreSQL (Docker) の起動

プロジェクト直下に `docker-compose.yml` を作成し、ターミナルで実行。

```bash
# バックグラウンドでPostgreSQLコンテナを立ち上げる
docker compose up -d

# 起動状態の確認
docker compose ps
```

---

## 4. 各サーバーの起動コマンド

開発中の日常的な起動コマンド。

```bash
# 【フロントエンド】 Next.js 起動 (http://localhost:3000)
cd frontend
npm run dev

# 【バックエンド】 Spring Boot 起動 (http://localhost:8080)
# ※VS Codeの「Spring Boot Dashboard」拡張機能からボタン一発で起動するのが一番ラク！

# Gradleの場合:
./gradlew bootRun

# Mavenの場合:
./mvnw spring-boot:run
```

## 5. 設定ファイル（Configuration）の雛形メモ

### 🐘 Gradle設定 (`build.gradle` - Groovy DSL)

```groovy
dependencies {
    implementation 'org.springframework.boot:spring-boot-starter-web'
    implementation 'org.springframework.boot:spring-boot-starter-security'
    implementation 'org.mybatis.spring.boot:mybatis-spring-boot-starter:3.0.3'
    implementation 'io.jsonwebtoken:jjwt-api:0.12.6'
    implementation 'io.jsonwebtoken:jjwt-impl:0.12.6'
    implementation 'io.jsonwebtoken:jjwt-jackson:0.12.6'
    implementaiton 'org.springdoc:springdoc-openapi-starter-webmvc-ui:2.6.0'
    runtimeOnly 'org.postgresql:postgresql'
    compileOnly 'org.projectlombok:lombok'
    annotationProcessor 'org.projectlombok:lombok'
    testImplementation 'org.springframework.boot:spring-boot-starter-test'
    testImplementation 'org.springframework.security:spring-security-test'
}
```

---

### 🛠️ Maven設定 (`pom.xml`)

```xml
<dependencies>
    <!-- Web -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>

    <!-- Security -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-security</artifactId>
    </dependency>

    <!-- MyBatis -->
    <dependency>
        <groupId>org.mybatis.spring.boot</groupId>
        <artifactId>mybatis-spring-boot-starter</artifactId>
        <version>3.0.3</version>
    </dependency>

    <!-- PostgreSQL Driver -->
    <dependency>
        <groupId>org.postgresql</groupId>
        <artifactId>postgresql</artifactId>
        <scope>runtime</scope>
    </dependency>

    <!-- Lombok -->
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <optional>true</optional>
    </dependency>

    <!-- Test -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-test</artifactId>
        <scope>test</scope>
    </dependency>
    <dependency>
        <groupId>org.springframework.security</groupId>
        <artifactId>spring-security-test</artifactId>
        <scope>test</scope>
    </dependency>
</dependencies>
```

---

### ⚙️ Spring Boot環境設定 (`src/main/resources/application.yml`)

※ `${変数名:デフォルト値}` の構文にすることで、未設定時はデフォルト値で起動し、環境変数がある場合のみ自動で上書きされる。

```yaml
server:
  port: 8080

spring:
  datasource:
    # 環境変数 POSTGRES_URL / USER / PASSWORD があれば上書き
    url: ${POSTGRES_URL:jdbc:postgresql://localhost:5432/agency_db}
    username: ${POSTGRES_USER:postgres}
    password: ${POSTGRES_PASSWORD:postgres}
    driver-class-name: org.postgresql.Driver

# MyBatis 設定
mybatis:
  type-aliases-package: com.agency.sales.domain.model
  mapper-locations: classpath:mapper/*.xml
  configuration:
    map-underscore-to-camel-case: true # DBの snake_case を Javaの camelCase に自動変換

# JWT（認証）用カスタムプロパティ
jwt:
  secret: ${JWT_SECRET:your-default-dev-secret-key-must-be-long-enough-32bytes}
  expiration-ms: 86400000 # 24時間 (ミリ秒)

# ログレベル変更
logging:
  level:
    # 独自認証(JWT等)使用時に出るSpring Securityの不要なWARNログを抑止（ログレベルを ERROR に上げて非表示にする）
    "[org.springframework.security.config.annotation.authentication.configuration.InitializeUserDetailsBeanManagerConfigurer]": ERROR
```

> 💡 **JWT Secret（シークレットキー）の安全な生成コマンド**
>
> ```bash
> # Node.js で256ビットのランダム文字列を生成
> node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
>
> # または OpenSSL (Mac/Linux)
> openssl rand -base64 32
> ```

---

### 🔐 環境変数（Environment Variables）の渡し方メモ

#### 1. ローカル開発環境 (`backend/.env` ファイルを作成)

プロジェクト直下に `.env` を配置（※ `.gitignore` に登録して Git 対象外にする）。

```env
POSTGRES_URL=postgresql://localhost:5432/agency_db
POSTGRES_USER=(自分で決めたユーザー名)
POSTGRES_PASSWORD=(自分で決めたパスワード)
JWT_SECRET=（生成したシークレットキー）
```

- **ターミナルから `.env` を読み込んで起動する場合:**

  ```bash
  export $(cat .env | xargs) && ./gradlew bootRun   # Gradle
  # または
  export $(cat .env | xargs) && ./mvnw spring-boot:run # Maven
  ```

#### 2. 本番環境（Koyeb / Render 等）

管理画面の **Environment Variables** 設定欄に `POSTGRES_PASSWORD` や `JWT_SECRET` をKey/Valueで追加するだけで、`application.yml` 側に安全に注入される。

---

### 🐳 Docker環境設定 (`docker-compose.yml` または `compose.yaml`)

※ versionプロパティは非推奨のため削除。`.env` の環境変数にも対応。

```yaml
services:
  postgres:
    image: postgres:16-alpine
    container_name: agency-postgres
    restart: unless-stopped
    ports:
      - "5432:5432"
    environment:
      POSTGRES_DB: agency_db
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      TZ: Asia/Tokyo
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

### VS Code でのローカル起動・デバッグ設定

本プロジェクトはルート直下に `agency-sales-support/backend` などのサブディレクトリを持つ構成になっています。
VS Code からデバッグ起動（`F5`）する際は、**.env のパス指定** に注意してください。

#### 1. `.vscode/launch.json` の作成

プロジェクトルートの `.vscode/launch.json` に以下の設定を記述します。

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "java",
      "name": "Spring Boot-SalesApplication<backend>",
      "request": "launch",
      "cwd": "${workspaceFolder}/agency-sales-support/backend",
      "mainClass": "com.agency.sales.SalesApplication",
      "projectName": "backend",
      "args": "",
      "envFile": "${workspaceFolder}/agency-sales-support/backend/.env"
    }
  ]
}
```

> **ハマりポイント（注意点）**
>
> - ルートディレクトリを VS Code で開いている場合、`"envFile"` に `${workspaceFolder}/backend/.env` と書くと `.env` が読み込まれず、起動時エラー（`Could not resolve placeholder`）が発生します。
> - 必ずルートからの相対パス（`${workspaceFolder}/agency-sales-support/backend/.env`）を指定してください。

---

## 6. プロジェクト全体ディレクトリ構成メモ

本プロジェクトは `frontend` と `backend` を分離したモノレポ構成で管理する。

```text
agency-sales-support/              # プロジェクトルート
├── compose.yaml                   # Docker Compose 設定ファイル
├── .gitignore
├── README.md                      # プロジェクト概要・設計書
├── docs/                          # ドキュメント類（セットアップ手順、メモなど）
│   └── setup-guide.md
│
├── frontend/                      # Next.js (App Router)
│   ├── src/
│   │   ├── app/                   # App Router ページ・レイアウト定義
│   │   │   ├── (auth)/            # 認証関連ページグループ (login等)
│   │   │   ├── (dashboard)/       # ダッシュボード関連ページグループ
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── components/            # UIコンポーネント
│   │   │   ├── ui/                # shadcn/ui 自動生成コンポーネント (button, dialog等)
│   │   │   ├── command/           # コマンドパレット(Ctrl+K)関連
│   │   │   └── table/             # キーボード操作対応テーブル関連
│   │   ├── hooks/                 # カスタムフック (キーボードイベント検知等)
│   │   ├── lib/                   # ユーティリティ関数・fetch共通設定
│   │   └── types/                 # TypeScriptの型定義 (APIレスポンス等)
│   ├── public/
│   ├── package.json
│   └── tsconfig.json
│
└── backend/                       # Spring Boot
    ├── src/
    │   ├── main/
    │   │   ├── java/com/agency/sales/   # パッケージルート (com.agency.sales)
    │   │   │   ├── config/              # Spring Security / CORS / JWT設定
    │   │   │   ├── controller/          # REST API コントローラー
    │   │   │   ├── service/             # ビジネスロジック
    │   │   │   ├── mapper/              # MyBatis Mapper インターフェース
    │   │   │   ├── domain/              # DBエンティティ・ドメインモデル (Entity)
    │   │   │   ├── dto/                 # APIデータ転送用 (DTO)
    │   │   │   └── security/            # JWT認証フィルター
    │   │   └── resources/
    │   │       ├── mapper/              # MyBatis SQL XML ファイル
    │   │       └── application.yml
    │   └── test/                        # テストコード
    ├── build.gradle (または pom.xml)
    └── .env                             # ローカル用環境変数 (Git除外)
```

### フォルダ配置の基本ルール

- **フロントエンド (`frontend/src/`)**
  - `components/ui/`: `shadcn/ui` で追加した汎用パーツ。手動変更は最小限にする。
  - `components/`: 業務固有のUIコンポーネント（コマンドパレット、専用テーブルなど）。
  - `app/(グループ名)/`: `()` で囲むとURLパスに影響を与えずにレイアウトやルーティングをグループ化できる。
- **バックエンド (`backend/src/main/java/com/agency/sales/`)**
  - **レイヤー分割（Package by Layer）を採用:**
    アーキテクチャ構造が直感的で、小〜中規模開発において全体を見通しやすいためこの設計とする（必要に応じて将来的に機能別の `Package by Feature` への再整理も可能）。
  - SQLは `resources/mapper/*.xml` に記述し、Javaコードと分離する。

---

### 🚀 本番デプロイ時のパイプライン（CI/CD）分離メモ

モノレポ構成であっても、フロントとバックエンドは完全に独立してビルド・デプロイが可能。

#### 1. ホスティングサービスのルートディレクトリ指定を使う場合（一番簡単）

- Vercel / Cloudflare Pages（フロント）: **Root Directory** に `frontend` を設定。
- Koyeb / Render（バック）: **Root Directory** に `backend` を設定。
- 指定したディレクトリ配下の変更（差分）のみを自動検知して個別にデプロイが実行される。

#### 2. GitHub Actions でパスフィルターを使う場合（設定ファイル例）

リポジトリ直下に `.github/workflows/` ディレクトリを作成し、以下のように定義する。

- **フロントエンド用 (`.github/workflows/deploy-frontend.yml`)**

  ```yaml
  name: Deploy Frontend

  on:
    push:
      branches: [ main ]
      paths:
        - 'frontend/**'  # frontend 配下が変更された時だけ自動起動
        - '.github/workflows/deploy-frontend.yml'

  jobs:
    build-and-deploy:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v4
        - name: Setup Node.js
          uses: actions/setup-node@v4
          with:
            node-version: '20'
            cache: 'npm'
            cache-dependency-path: 'frontend/package-lock.json'
        - name: Install & Build
          run: |
            cd frontend
            npm ci
            npm run build
        # 以降にデプロイ処理スクリプトなどを記述
  ```

- **バックエンド用 (`.github/workflows/deploy-backend.yml`)**

  ```yaml
  name: Deploy Backend

  on:
    push:
      branches: [ main ]
      paths:
        - 'backend/**'   # backend 配下が変更された時だけ自動起動
        - '.github/workflows/deploy-backend.yml'

  jobs:
    build-and-deploy:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v4
        - name: Set up JDK 21
          uses: actions/setup-java@v4
          with:
            java-version: '21'
            distribution: 'temurin'
            cache: 'gradle' # Mavenの場合は 'maven'
        - name: Build with Gradle
          run: |
            cd backend
            ./gradlew build -x test
        # 以降にコンテナビルドやデプロイ処理スクリプトなどを記述
  ```
  
## 7. Git設定ファイルのプロジェクトルート移設

フロントエンドおよびバックエンドの各ディレクトリで個別に管理していた Git 設定（`.gitignore` / `.gitattributes`）を、プロジェクト全体で一括管理するためにプロジェクトルートへ移動・統合します。

### 1. ファイルの作成と統合

プロジェクトルート直下に `.gitignore` と `.gitattributes` を作成し、各ディレクトリの内容を統合します。

#### `.gitignore`（プロジェクトルート）

フロントエンド（Node.js / Next.js 等）とバックエンド（Java / Spring Boot 等）双方の除外設定を統合します。

```gitignore
# ======================================================
# Common / Environment
# ======================================================
.DS_Store
*.log
.env
.env.*
!.env.example

# Docker / IDE / Editors
.idea/
.vscode/
*.suo
*.ntvs*
*.njsproj
*.sln
*.swp

# ======================================================
# Backend (Spring Boot / Java / Gradle / Maven)
# ======================================================
backend/HELP.md
backend/.gradle
backend/build/
!backend/gradle/wrapper/gradle-wrapper.jar
!backend/**/src/main/**/build/
!backend/**/src/test/**/build/

# env files (can opt-in for committing if needed)
backend/.env*

### STS ###
backend/.apt_generated
backend/.classpath
backend/.factorypath
backend/.project
backend/.settings
backend/.springBeans
backend/.sts4-cache
backend/bin/
!backend/**/src/main/**/bin/
!backend/**/src/test/**/bin/

### IntelliJ IDEA ###
backend/.idea
backend/*.iws
backend/*.iml
backend/*.ipr
backend/out/
!backend/**/src/main/**/out/
!backend/**/src/test/**/out/

### NetBeans ###
backend/nbproject/private/
backend/nbbuild/
backend/dist/
backend/nbdist/
backend/.nb-gradle/

### VS Code ###
backend/.vscode/

# ======================================================
# Frontend (Next.js / Node)
# ======================================================
# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# dependencies
frontend/node_modules
frontend/.pnp
frontend/.pnp.*
frontend/.yarn/*
!frontend/.yarn/patches
!frontend/.yarn/plugins
!frontend/.yarn/releases
!frontend/.yarn/versions

# testing
frontend/coverage

# next.js
frontend/.next/
frontend/out/

# production
frontend/build

# misc
frontend/.DS_Store
frontend/*.pem

# debug
frontend/npm-debug.log*
frontend/yarn-debug.log*
frontend/yarn-error.log*
frontend/.pnpm-debug.log*

# env files (can opt-in for committing if needed)
frontend/.env*

# vercel
frontend/.vercel

# typescript
frontend/*.tsbuildinfo
frontend/next-env.d.ts
```

#### .gitattributes（プロジェクトルート）

改行コードの設定などをプロジェクト全体に適用します。

```gitattributes
# Auto detect text files and perform LF normalization
* text=auto eol=lf

# Gradle wrapper scripts formatting
backend/gradlew text eol=lf
backend/*.bat text eol=crlf
backend/*.jar binary
```
