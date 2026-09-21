import { z } from "zod";

// 電話番号の正規表現
const PHONE_NUMBER_REGEX = /^0\d{1,4}-\d{1,4}-\d{3,4}$/;

/**
 * プロフィール編集フォーム全体の Zod バリデーションスキーマ
 */
export const profileUpdateFormSchema = z.object({
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
        certificationCode: z.string(),
        name: z.string(),
      })
    ),

    /** 得意分野リスト */
    specialties: z.array(
      z.object({
        specialtyCode: z.string(),
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
});

/**
 * プロフィール編集フォームの入力値を表す TypeScript 型
 */
export type ProfileUpdateFormValues = z.infer<typeof profileUpdateFormSchema>;