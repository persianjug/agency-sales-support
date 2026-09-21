"use client";

import { useWatch, UseFormReturn } from "react-hook-form";
import ControlledInput from "@/components/ui/controlled-input";
import { RadioGroup } from "@/components/ui/radio-group";
import FormSectionHeader from "@/components/common/form/form-section-header";
import FormRow1Col from "@/components/common/form/form-row-1col";
import PasswordSetupFields from "@/components/common/form/form-password-setup-fields";
import AvatarModeOption from "@/components/common/form/form-avatar-mode-option";

/**
 * AccountCreateLoginInfoForm コンポーネントの Props 定義
 */
type AccountCreateLoginInfoFormProps = {
  /** React Hook Form の form インスタンス */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>;
};

/**
 * アカウント作成における「ログイン・アカウント情報」セクションフォーム
 *
 * @param props - {@link AccountCreateLoginInfoFormProps}
 * @returns JSX.Element - メールアドレス設定および初期パスワード設定（自動生成/手動設定切り替え）UI
 *
 * @remarks
 * - ワイヤーフレームに基づき、テーブルスタイルのレイアウト（FormRow1Col）を採用しています。
 * - `AvatarModeOption` を活用し、パスワード設定のラジオ選択肢と選択時コンテンツ（PasswordSetupFields）を構造化しています。
 */
export const AccountCreateLoginInfoForm = ({
  form,
}: AccountCreateLoginInfoFormProps) => {
  // パスワード生成方式（"auto": システム自動生成, "manual": 手動設定）の選択状態をリアルタイム監視
  const passwordType = useWatch({
    control: form.control,
    name: "passwordType",
    defaultValue: "auto",
  });

  return (
    <div className="space-y-2">
      {/* セクションヘッダー（タイトル: ログイン・アカウント情報 / バッジ: 必須） */}
      <FormSectionHeader title="ログイン・アカウント情報" badgeType="required" />

      <div className="border rounded-md overflow-hidden text-sm bg-background shadow-sm">
        {/* メールアドレス入力行 */}
        <FormRow1Col label="メールアドレス" contentClassName="p-2.5">
          <div className="max-w-md">
            <ControlledInput
              control={form.control}
              name="email"
              label=""
              placeholder="メールアドレス（半角英数字記号）"
              type="email"
            />
          </div>
        </FormRow1Col>

        {/* 初期パスワード設定行（最下行のため border なし） */}
        <FormRow1Col
          label="初期パスワード"
          contentClassName="p-3"
          hasBorderBottom={false}
        >
          {/* パスワード生成方式選択ラジオグループ */}
          <RadioGroup
            value={passwordType}
            onValueChange={(value) => form.setValue("passwordType", value)}
            className="space-y-3"
          >
            {/* 自動生成（推奨）オプション */}
            <AvatarModeOption
              value="auto"
              label="システムで自動生成して招待メールを送信（推奨）"
            />

            {/* 手動設定オプション（選択時のみ PasswordSetupFields を展開） */}
            <AvatarModeOption
              value="manual"
              label="手動で初期パスワードを設定する"
            >
              {passwordType === "manual" && (
                <div className="pl-6 max-w-md border-l-2 border-emerald-500/30 ml-1">
                  <PasswordSetupFields control={form.control} />
                </div>
              )}
            </AvatarModeOption>
          </RadioGroup>
        </FormRow1Col>
      </div>
    </div>
  );
};

export default AccountCreateLoginInfoForm;