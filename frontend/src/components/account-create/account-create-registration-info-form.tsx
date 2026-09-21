"use client";

import { UseFormReturn } from "react-hook-form";
import ControlledInput from "@/components/ui/controlled-input";
import ControlledSelect from "@/components/ui/controlled-select";
import FormSectionHeader from "@/components/common/form/form-section-header";
import FormRow1Col from "@/components/common/form/form-row-1col";
import AgencyCodeInput from "@/components/common/form/form-agency-code-input";
import { ROLE_OPTIONS } from "@/constants/role-constant";

/**
 * AccountCreateRegistrationInfoForm コンポーネントの Props 定義
 */
type AccountCreateRegistrationInfoFormProps = {
  /** React Hook Form の form インスタンス */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>;
  /** 取得・紐付けされた代理店名（AgencyCodeInputへ受け渡し） */
  agencyName?: string;
};

/**
 * アカウント作成における「登録情報」セクションフォーム
 *
 * @param props - {@link AccountCreateRegistrationInfoFormProps}
 * @returns JSX.Element - 氏名・所属代理店・募集人情報・役割権限入力UI
 *
 * @remarks
 * - ワイヤーフレームに基づき、テーブルスタイルのレイアウト（FormRow1Col）を採用しています。
 * - 「所属代理店」には `AgencyCodeInput` を使用し、コード入力に応じた代理店名の動的表示に対応しています。
 */
export const AccountCreateRegistrationInfoForm = ({
  form,
  agencyName,
}: AccountCreateRegistrationInfoFormProps) => {
  return (
    <div className="space-y-2">
      {/* セクションヘッダー（タイトル: 登録情報 / バッジ: 必須） */}
      <FormSectionHeader title="登録情報" badgeType="required" />

      <div className="border rounded-md overflow-hidden text-sm bg-background shadow-sm">
        {/* 氏名（漢字・フリガナ 2x2入力） */}
        <FormRow1Col label="氏名" contentClassName="p-3">
          <div className="space-y-3 max-w-2xl">
            {/* 漢字 (姓 / 名) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <ControlledInput
                control={form.control}
                name="lastName"
                label="姓"
                placeholder="姓"
              />
              <ControlledInput
                control={form.control}
                name="firstName"
                label="名"
                placeholder="名"
              />
            </div>
            {/* フリガナ (セイ / メイ) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <ControlledInput
                control={form.control}
                name="lastNameKana"
                label="セイ"
                placeholder="セイ"
              />
              <ControlledInput
                control={form.control}
                name="firstNameKana"
                label="メイ"
                placeholder="メイ"
              />
            </div>
          </div>
        </FormRow1Col>

        {/* 所属代理店 */}
        <FormRow1Col label="所属代理店" contentClassName="p-3">
          <AgencyCodeInput
            control={form.control}
            name="agencyCode"
            agencyName={agencyName}
            placeholder="代理店コード（半角英数字6桁）"
          />
        </FormRow1Col>

        {/* 募集人コード */}
        <FormRow1Col label="募集人コード" contentClassName="p-3">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="w-full sm:w-64">
              <ControlledInput
                control={form.control}
                name="solicitorCode"
                placeholder="募集人コード（半角英数字6桁）"
              />
            </div>
            <a
              href="#solicitor-code-rules"
              onClick={(e) => {
                e.preventDefault();
                // 採番ルールモーダルまたは別ウィンドウ開く処理など
              }}
              className="text-xs text-sky-600 hover:text-sky-700 underline font-medium"
            >
              募集人コード採番ルール
            </a>
          </div>
        </FormRow1Col>

        {/* 募集人登録番号 */}
        <FormRow1Col label="募集人登録番号" contentClassName="p-3">
          <div className="w-full sm:w-64">
            <ControlledInput
              control={form.control}
              name="solicitorRegistrationNumber"
              placeholder="募集人登録番号（半角英数字13桁）"
            />
          </div>
        </FormRow1Col>

        {/* 役割・権限（最下行のため border なし） */}
        <FormRow1Col label="役割・権限" contentClassName="p-3" hasBorderBottom={false}>
          <div className="w-full sm:w-64">
            <ControlledSelect
              control={form.control}
              name="role"
              placeholder="役割・権限を選択"
              options={ROLE_OPTIONS}
            />
          </div>
        </FormRow1Col>
      </div>
    </div>
  );
};

export default AccountCreateRegistrationInfoForm;