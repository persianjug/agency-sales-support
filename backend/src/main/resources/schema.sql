-- テーブル削除（依存関係を考慮して逆順に削除）
DROP TABLE IF EXISTS user_specialties;
DROP TABLE IF EXISTS specialties;
DROP TABLE IF EXISTS user_certifications;
DROP TABLE IF EXISTS certifications;
DROP TABLE IF EXISTS password_reset_tokens;
DROP TABLE IF EXISTS user_profiles;
DROP TABLE IF EXISTS agencies;
DROP TABLE IF EXISTS accounts;

-- =================================================================
-- 1. accounts テーブル（認証・セキュリティ・アクセス制御専用）
-- =================================================================
CREATE TABLE IF NOT EXISTS accounts (
    id BIGSERIAL PRIMARY KEY,
    ,username VARCHAR(100) NOT NULL UNIQUE
    ,password VARCHAR(255) NOT NULL
    ,role VARCHAR(50) NOT NULL DEFAULT 'ROLE_USER'
    ,status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE'
    ,is_active BOOLEAN NOT NULL DEFAULT TRUE
    ,password_updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    ,failed_login_attempts INT NOT NULL DEFAULT 0
    ,locked_until TIMESTAMPTZ
    ,deleted_at TIMESTAMPTZ
    ,created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
    ,updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- コメント
COMMENT ON TABLE accounts IS 'システムアカウント基盤（認証・アクセス制御）';
COMMENT ON COLUMN accounts.id IS 'アカウントID（主キー）';
COMMENT ON COLUMN accounts.username IS 'ログインID（メールアドレス等）';
COMMENT ON COLUMN accounts.password IS 'ハッシュ化済みパスワード';
COMMENT ON COLUMN accounts.role IS 'システム権限（ROLE_ADMIN, ROLE_SOLICITORなど）';
COMMENT ON COLUMN accounts.status IS 'アカウント状態（ACTIVE, SUSPENDED等）';
COMMENT ON COLUMN accounts.is_active IS '有効フラグ';
COMMENT ON COLUMN accounts.password_updated_at IS 'パスワード最終変更日時';
COMMENT ON COLUMN accounts.failed_login_attempts IS '連続ログイン失敗回数';
COMMENT ON COLUMN accounts.locked_until IS 'アカウントロック解除日時';
COMMENT ON COLUMN accounts.deleted_at IS '論理削除日時';
COMMENT ON COLUMN accounts.created_at IS '作成日時';
COMMENT ON COLUMN accounts.updated_at IS '更新日時';

-- =================================================================
-- 2. agencies テーブル（新規追加: 代理店マスタ）
-- =================================================================
CREATE TABLE IF NOT EXISTS agencies (
    id BIGSERIAL PRIMARY KEY
    ,agency_code VARCHAR(6) NOT NULL UNIQUE  -- 代理店コード（6桁）
    ,agency_name VARCHAR(100) NOT NULL      -- 代理店名
    ,created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
    ,updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE agencies IS '代理店マスタ';
COMMENT ON COLUMN agencies.id IS '代理店ID（主キー）';
COMMENT ON COLUMN agencies.agency_code IS '代理店コード（6桁）';
COMMENT ON COLUMN agencies.agency_name IS '代理店名称';
COMMENT ON COLUMN agencies.created_at IS '作成日時';
COMMENT ON COLUMN agencies.updated_at IS '更新日時';

-- =================================================================
-- 3. user_profiles テーブル（新設: 募集人・人事属性専用）
-- =================================================================
CREATE TABLE IF NOT EXISTS user_profiles (
    id BIGSERIAL PRIMARY KEY,
    ,account_id BIGINT NOT NULL UNIQUE

    -- 【登録情報（表示用・管理者管理）】
    ,last_name VARCHAR(50) NOT NULL             -- 姓（漢字）
    ,first_name VARCHAR(50) NOT NULL            -- 名（漢字）
    ,last_name_kana VARCHAR(50) NOT NULL        -- 姓（フリガナ）
    ,first_name_kana VARCHAR(50) NOT NULL       -- 名（フリガナ）
    ,agency_id BIGINT REFERENCES agencies(id)   -- 所属代理店ID
    ,solicitor_code VARCHAR(6) NOT NULL         -- 募集人コード（6桁）
    ,solicitor_number VARCHAR(13) NOT NULL UNIQUE -- 募集人登録番号（13桁）
    ,department_id BIGINT                       -- 所属部署/支店ID（将来用）

    -- 【アバター画像（独立更新）】
    ,avatar_url TEXT,                            -- アバター画像ストレージURL

    -- 【連絡先・営業属性（インライン編集可）】
    ,phone_number VARCHAR(20)                   -- 営業用電話番号
    ,greeting_message TEXT                      -- ご挨拶メッセージ
    ,career_summary TEXT                        -- 業務経歴・強みサマリ
    
    ,created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
    ,updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
    ,CONSTRAINT fk_user_profiles_account FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE
);

-- コメント
COMMENT ON TABLE user_profiles IS '募集人・営業職員プロフィールマスタ';
COMMENT ON COLUMN user_profiles.id IS 'プロフィールID（主キー）';
COMMENT ON COLUMN user_profiles.account_id IS '関連アカウントID（accountsへの1:1外部キー）';
COMMENT ON COLUMN user_profiles.last_name IS '姓（漢字）';
COMMENT ON COLUMN user_profiles.first_name IS '名（漢字）';
COMMENT ON COLUMN user_profiles.last_name_kana IS '姓（フリガナ）';
COMMENT ON COLUMN user_profiles.first_name_kana IS '名（フリガナ）';
COMMENT ON COLUMN user_profiles.agency_id IS '代理店コード（6桁）';
COMMENT ON COLUMN user_profiles.solicitor_code IS '募集人コード（6桁）';
COMMENT ON COLUMN user_profiles.solicitor_number IS '募集人登録番号（13桁）';
COMMENT ON COLUMN user_profiles.department_id IS '所属部署/支店ID（将来の組織マスタFK）';
COMMENT ON COLUMN user_profiles.avatar_url IS 'アバター画像ストレージURL';
COMMENT ON COLUMN user_profiles.phone_number IS '営業用連絡先電話番号';
COMMENT ON COLUMN user_profiles.greeting_message IS '顧客向け提案書・紹介用のご挨拶メッセージ';
COMMENT ON COLUMN user_profiles.career_summary IS '社内共有用 業務経歴・強みサマリ';
COMMENT ON COLUMN user_profiles.created_at IS '作成日時';
COMMENT ON COLUMN user_profiles.updated_at IS '更新日時';

-- インデックス
CREATE INDEX idx_user_profiles_solicitor_code ON user_profiles(solicitor_code);
CREATE INDEX idx_user_profiles_agency_id ON user_profiles(agency_id);

-- =================================================================
-- 4. password_reset_tokens テーブル（既存通り accounts 参照）
-- =================================================================
CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id BIGSERIAL PRIMARY KEY
    ,account_id BIGINT NOT NULL
    ,token_hash VARCHAR(255) NOT NULL UNIQUE
    ,expires_at TIMESTAMPTZ NOT NULL
    ,used_at TIMESTAMPTZ NULL
    ,created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
    ,CONSTRAINT fk_password_reset_account FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE
);

-- コメント
COMMENT ON TABLE password_reset_tokens IS 'パスワードリセット用トークン';
COMMENT ON COLUMN password_reset_tokens.account_id IS '対象アカウントID';
COMMENT ON COLUMN password_reset_tokens.token_hash IS 'トークンハッシュ';
COMMENT ON COLUMN password_reset_tokens.expires_at IS '有効期限';
COMMENT ON COLUMN password_reset_tokens.used_at IS '使用済フラグ';
COMMENT ON COLUMN password_reset_tokens.created_at IS '作成日時';

-- =================================================================
-- 1. certifications テーブル（資格マスタ）
-- =================================================================
CREATE TABLE IF NOT EXISTS certifications (
    id BIGSERIAL PRIMARY KEY
    ,name VARCHAR(100) NOT NULL
    ,code VARCHAR(6) NOT NULL UNIQUE
    ,created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
    ,updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE certifications IS '資格マスタ';
COMMENT ON COLUMN certifications.id IS '資格ID（主キー）';
COMMENT ON COLUMN certifications.name IS '資格名称';
COMMENT ON COLUMN certifications.code IS '資格識別コード';
COMMENT ON COLUMN certifications.created_at IS '作成日時';
COMMENT ON COLUMN certifications.updated_at IS '更新日時';

-- =================================================================
-- 2. user_certifications テーブル（アカウント保有資格・中間テーブル）
-- =================================================================
CREATE TABLE IF NOT EXISTS user_certifications (
    id BIGSERIAL PRIMARY KEY
    ,account_id BIGINT NOT NULL
    ,certification_id BIGINT NOT NULL
    ,acquired_at DATE
    ,expiration_at DATE
    ,created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
    ,updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
    ,CONSTRAINT fk_user_certifications_account FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE
    ,CONSTRAINT fk_user_certifications_cert FOREIGN KEY (certification_id) REFERENCES certifications(id) ON DELETE CASCADE
    ,CONSTRAINT uq_account_certification UNIQUE (account_id, certification_id)
);

COMMENT ON TABLE user_certifications IS 'アカウント保有資格（中間テーブル）';
COMMENT ON COLUMN user_certifications.id IS '保有資格ID（主キー）';
COMMENT ON COLUMN user_certifications.account_id IS '関連アカウントID（accountsへのFK）';
COMMENT ON COLUMN user_certifications.certification_id IS '関連資格ID（certificationsへのFK）';
COMMENT ON COLUMN user_certifications.acquired_at IS '資格取得日';
COMMENT ON COLUMN user_certifications.expiration_at IS '資格有効期限';
COMMENT ON COLUMN user_certifications.created_at IS '作成日時';
COMMENT ON COLUMN user_certifications.updated_at IS '更新日時';

-- =================================================================
-- 3. specialties テーブル（得意分野・担当カテゴリマスタ）
-- =================================================================
CREATE TABLE IF NOT EXISTS specialties (
    id BIGSERIAL PRIMARY KEY,
    ,name VARCHAR(100) NOT NULL
    ,code VARCHAR(6) NOT NULL UNIQUE
    ,created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
    ,updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE specialties IS '得意分野・担当商品カテゴリマスタ';
COMMENT ON COLUMN specialties.id IS '得意分野ID（主キー）';
COMMENT ON COLUMN specialties.name IS '分野・カテゴリ名称（例：法人税務・事業承継、相続・贈与）';
COMMENT ON COLUMN specialties.code IS '分野識別コード';
COMMENT ON COLUMN specialties.created_at IS '作成日時';
COMMENT ON COLUMN specialties.updated_at IS '更新日時';

-- =================================================================
-- 4. user_specialties テーブル（アカウント得意分野・中間テーブル）
-- =================================================================
CREATE TABLE IF NOT EXISTS user_specialties (
    account_id BIGINT NOT NULL
    ,specialty_id BIGINT NOT NULL
    ,created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
    ,years INT NOT NULL DEFAULT 1
    ,PRIMARY KEY (account_id, specialty_id)
    ,CONSTRAINT fk_user_specialties_account FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE
    ,CONSTRAINT fk_user_specialties_specialty FOREIGN KEY (specialty_id) REFERENCES specialties(id) ON DELETE CASCADE
);

COMMENT ON TABLE user_specialties IS 'アカウント得意分野（中間テーブル）';
COMMENT ON COLUMN user_specialties.account_id IS '関連アカウントID（accountsへのFK）';
COMMENT ON COLUMN user_specialties.specialty_id IS '関連得意分野ID（specialtiesへのFK）';
COMMENT ON COLUMN user_specialties.years IS '経験年数';
COMMENT ON COLUMN user_specialties.created_at IS '作成日時';
