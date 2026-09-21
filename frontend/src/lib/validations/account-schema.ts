import { z } from "zod";

// 全角カタカナの正規表現（ハイフンやスペース許容）
const KATAKANA_REGEX = /^[ァ-ヶー\s]+$/;

// 電話番号の正規表現
const PHONE_NUMBER_REGEX = /^0\d{1,4}-\d{1,4}-\d{3,4}$/;

/**
 * アカウント作成フォーム全体の Zod バリデーションスキーマ
 */
export const accountCreateSchema = z
  .object({
    // -----------------------------------------------------------------
    // 1. ログイン・アカウント情報
    // -----------------------------------------------------------------
    /** メールアドレス（アカウントログインID） */
    email: z
      .email("有効なメールアドレスの形式で入力してください"),

    /** 初期パスワード生成方式（"auto": 自動生成 / "manual": 手動設定） */
    passwordType: z.enum(["auto", "manual"]),

    /** パスワード（手動設定時のみ必須） */
    password: z.string().optional(),

    /** パスワード確認入力（手動設定時のみ必須） */
    confirmPassword: z.string().optional(),

    // -----------------------------------------------------------------
    // 2. 登録情報（必須）
    // -----------------------------------------------------------------
    /** 姓（漢字） */
    lastName: z.string().min(1, "姓を入力してください"),

    /** 名（漢字） */
    firstName: z.string().min(1, "名を入力してください"),

    /** 姓（フリガナ） */
    lastNameKana: z
      .string()
      .min(1, "セイを入力してください")
      .regex(KATAKANA_REGEX, "全角カタカナで入力してください"),

    /** 名（フリガナ） */
    firstNameKana: z
      .string()
      .min(1, "メイを入力してください")
      .regex(KATAKANA_REGEX, "全角カタカナで入力してください"),

    /** 代理店コード（6桁） */
    agencyCode: z
      .string()
      .min(1, "代理店コードを入力してください")
      .length(6, "代理店コードは6桁で入力してください"),

    /** 募集人コード（6桁） */
    solicitorCode: z
      .string()
      .min(1, "募集人コードを入力してください")
      .length(6, "募集人コードは6桁で入力してください"),

    /** 募集人登録番号（13桁） */
    solicitorRegistrationNumber: z
      .string()
      .min(1, "募集人登録番号を入力してください")
      .length(13, "募集人登録番号は13桁で入力してください"),

    /** 役割・権限（Role Enum値） */
    role: z.enum(
      [
        "ROLE_USER",
        "ROLE_SOLICITOR",
        "ROLE_AGENCY_ADMIN",
        "ROLE_HQ_STAFF",
        "ROLE_SYSTEM_ADMIN",
      ],
      {
        errorMap: () => ({ message: "役割・権限を選択してください" }),
      }
    ),

    // -----------------------------------------------------------------
    // 3. 連絡先・営業属性（任意）
    // -----------------------------------------------------------------
    /** アバター画像URL */
    avatarUrl: z.string().optional(),

    /** 営業用電話番号 */
    phoneNumber: z
      .string()
      .optional()
      .refine(
        (val) => !val || PHONE_NUMBER_REGEX.test(val),
        "正しい電話番号の形式（例: 090-1234-5678）で入力してください"
      ),

    /** 保有資格リスト */
    certifications: z.array(
      z.object({
        CertificationCode: z.number(),
        name: z.string(),
      })
    ),

    /** 得意分野リスト */
    specialties: z.array(
      z.object({
        specialtyCode: z.number(),
        name: z.string(),
        years: z.number()
          .min(1, "1年以上の年数を指定してください")
          .max(50, "50年以内の年数を指定してください"),
      })
    ),

    /** 業務経歴・強みサマリ */
    careerSummary: z.string().optional(),

    /** ご挨拶メッセージ */
    greetingMessage: z.string().optional(),
  })
  // --- 相関バリデーション 1: 手動設定時のパスワードチェック ---
  .refine(
    (data) => {
      if (data.passwordType === "manual") {
        return !!data.password && data.password.length >= 8;
      }
      return true;
    },
    {
      message: "パスワードは8文字以上で入力してください",
      path: ["password"],
    }
  )
  // --- 相関バリデーション 2: パスワード一致チェック ---
  .refine(
    (data) => {
      if (data.passwordType === "manual") {
        return data.password === data.confirmPassword;
      }
      return true;
    },
    {
      message: "パスワードが一致しません",
      path: ["confirmPassword"],
    }
  );

/**
 * アカウント作成フォームの型定義
 */
export type AccountCreateFormValues = z.infer<typeof accountCreateSchema>;