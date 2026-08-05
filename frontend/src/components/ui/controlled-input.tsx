import { Control, Controller, FieldValues, Path } from "react-hook-form"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { Button } from "./button"
import { Eye, EyeOff } from "lucide-react"

/**
 * `ControlledInput` コンポーネントの Props 定義
 *
 * @template T - react-hook-form で管理するフォーム値の型（`FieldValues` を継承）
 */
type ControlledInputProps<T extends FieldValues> = {
/** react-hook-form の `useForm` から取得した `control` オブジェクト */
  control: Control<T>
  /** フォームフィールドの識別名（フォーム型 `T` のキー構造に安全に準拠するパス） */
  name: Path<T>
  /** 画面上に表示するラベルテキスト */
  label: string
  /** HTML input 要素の type 属性（デフォルト: `"text"`） */
  type?: string
  /** input 要素のプレースホルダーテキスト */
  placeholder?: string
  /** ブラウザの自動補完挙動を制御する autoComplete 属性 */
  autoComplete?: string
}

/**
 * react-hook-form と UI ライブラリの Input を接続する汎用入力コンポーネント
 *
 * @template T - フォームの型定義（`FieldValues`）
 * @param props - `ControlledInputProps<T>`
 * @returns JSX.Element - ラベル、入力欄、エラーメッセージを含む制御付き入力フィールド
 *
 * @remarks
 * - `Controller` を介してフォーム状態をアタッチし、バリデーションエラー時には自動で `FieldError` を描画します。
 * - `type="password"` が指定された場合、パスワードの表示/非表示を切り替えるトグルボタンを自動的に配置します。
 * - アクセシビリティ対応として `aria-invalid` および `htmlFor`/`id` の紐付けを行っています。
 */
const ControlledInput = <T extends FieldValues>({
  control,
  name,
  label,
  type = "text",
  placeholder,
  autoComplete,
}: ControlledInputProps<T>) => {
  // パスワードの表示/非表示状態を管理する State
  const [showPassword, setShowPassword] = useState(false);

  // type が password かどうかを判定
  const isPasswordType = type === "password";

  // パスワード表示状態に応じて input に渡す type を切り替え
  const actualType = isPasswordType ? (showPassword ? "text" : "password") : type;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={`field-${name}`} className={"font-semibold"}>
            {label}
          </FieldLabel>

          {/* アイコンを右端に絶対配置するため relative のラッパーを配置 */}
          <div className="relative">
            <Input
              {...field}
              id={`field-${name}`}
              type={actualType}
              aria-invalid={fieldState.invalid}
              placeholder={placeholder}
              autoComplete={autoComplete}
              // パスワード型の場合はアイコンと重ならないよう右側に余白（pr-10）を確保
              className={isPasswordType ? "pr-10" : ""}
            />

            {/* type="password" の場合のみ切替ボタンを描画 */}
            {isPasswordType && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full w-10 text-muted-foreground hover:bg-transparent hover:text-foreground"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "パスワードを隠す" : "パスワードを表示"}
              >
                {showPassword ? (
                  <Eye className="h-4 w-4" />
                ) : (
                  <EyeOff className="h-4 w-4" />
                )}
              </Button>
            )}
          </div>

          {fieldState.invalid && (
            <FieldError errors={[fieldState.error]} />
          )}
        </Field>
      )}
    />
  );
}

export default ControlledInput;