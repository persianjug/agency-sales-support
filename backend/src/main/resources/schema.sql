-- アカウントテーブル
CREATE TABLEIF NOT EXISTS accounts (
  id BIGSERIAL PRIMARY KEY
  ,username VARCHAR(100) NOT NULL UNIQUE
  ,password VARCHAR(255) NOT NULL
  ,role VARCHAR(50) NOT NULL
  ,name VARCHAR(100) NOT NULL
);

-- パスワードリセット用トークンテーブル
CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id BIGSERIAL PRIMARY KEY
    ,account_id BIGINT NOT NULL
    ,token_hash VARCHAR(255) NOT NULL UNIQUE
    ,expires_at TIMESTAMP NOT NULL
    ,used_at TIMESTAMP NULL
    ,created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    ,CONSTRAINT fk_password_reset_account FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE
);