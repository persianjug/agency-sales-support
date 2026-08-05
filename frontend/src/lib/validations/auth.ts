import * as z from "zod";

/**
 * ログインフォーム入力値のバリデーションスキーマ
 *
 * @remarks
 * 各フィールドの検証ルール:
 * - `email`: メールアドレス形式チェック（フォーマット違反時にエラーメッセージを出力）
 * - `password`: 文字列かつ 6 文字以上の長さを要求
 */
export const authLoginSchema = z.object({
  email: z
    .email({ message: "有効なメールアドレス形式で入力してください。" }),
  password: z
    .string()
    .min(6, "パスワードは6文字以上で入力してください。"),
});

/**
 * ログインフォームの入力値を表す TypeScript の型定義
 *
 * @remarks
 * `authLoginSchema` から `z.infer` を使用して推論された型（`{ email: string; password: string }`）です。
 */
export type AuthLoginFormValues = z.infer<typeof authLoginSchema>
