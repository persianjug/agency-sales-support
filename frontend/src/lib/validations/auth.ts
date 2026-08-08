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
    .min(8, "パスワードは8文字以上で入力してください。"),
});

/**
 * ログインフォームの入力値を表す TypeScript の型定義
 *
 * @remarks
 * `authLoginSchema` から `z.infer` を使用して推論された型（`{ email: string; password: string }`）です。
 */
export type AuthLoginFormValues = z.infer<typeof authLoginSchema>

/**
 * サインアップフォーム入力値のバリデーションスキーマ
 *
 * @remarks
 * 各フィールドの検証ルール:
 * - `name`: 文字列かつ 1～50 文字の長さを要求
 * - `email`: メールアドレス形式チェック（フォーマット違反時にエラーメッセージを出力）
 * - `password`: 文字列かつ 8 文字以上の長さを要求
 * - `confirmPassword`: 文字列かつ 1 文字以上の長さを要求、passwordと不一致時にエラーメッセージ出力
 */
export const authSignupSchema = z
  .object({
    name: z
      .string()
      .min(1, { message: "お名前を入力してください" })
      .max(50, { message: "お名前は50文字以内で入力してください" }),
    email: z
      .email({ message: "正しいメールアドレス形式で入力してください" }),
    password: z
      .string()
      .min(8, { message: "パスワードは8文字以上で入力してください" }),
    confirmPassword: z
      .string()
      .min(1, { message: "確認用パスワードを入力してください" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "パスワードが一致しません",
    path: ["confirmPassword"], // エラーを confirmPassword フィールドに紐付ける
  })

/**
 * サインアップフォームの入力値を表す TypeScript の型定義
 *
 * @remarks
 * `authSignupSchema` から `z.infer` を使用して推論された型です。
 */
export type AuthSignupFormValues = z.infer<typeof authSignupSchema>
