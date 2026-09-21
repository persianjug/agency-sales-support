"use client";

import { useState } from "react";
import { useController, UseFormReturn } from "react-hook-form";
import { Plus } from "lucide-react";
import { Certification } from "@/types/api/common-type";
import FormRow1Col from "@/components/common/form/form-row-1col";
import BadgeEditableTag from "@/components/common/badge/badge-editable-tag";
import AutocompleteSelect from "@/components/common/form/form-autocomplete-select";
import { Button } from "@/components/ui/button";

/**
 * FormCertificationSection コンポーネントの Props 定義
 */
type FormCertificationSectionProps = {
  /** React Hook Form の form インスタンス */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>;
  /** 資格のマスタ情報リスト */
  certificationsMast: Certification[];
};

/**
 * アカウント作成フォームにおける「保有資格」選択セクションコンポーネント
 *
 * @param props - {@link FormCertificationSectionProps}
 * @returns 保有資格のタグ表示・追加（AutocompleteSelect）・削除を行う UI
 */
export const FormCertificationSection = ({
  form,
  certificationsMast = [],
}: FormCertificationSectionProps) => {
  /** 資格追加フォーム（AutocompleteSelect）の表示/非表示フラグ */
  const [isAddingCert, setIsAddingCert] = useState(false);

  /** React Hook Form による保有資格配列（certifications）の制御 */
  const { field: certField } = useController({
    control: form.control,
    name: "certifications",
  });

  /** 現在選択されている保有資格リスト */
  const selectedCerts: Certification[] = certField.value || [];

  /**
   * AutocompleteSelect で資格が選択された際の追加ハンドラー
   *
   * @param certName - ドロップダウンで選択された資格の名称（未選択時は null）
   */
  const handleSelectCert = (certName: string | null) => {
    // ガード1: 未選択（null）の場合は処理を抜ける
    if (!certName) return;

    // マスタデータから選択された資格オブジェクトを検索
    // ガード2: マスタに存在しない場合は処理を抜ける
    const matched = certificationsMast.find((c) => c.name === certName);
    if (!matched) return;

    // ガード3: 既に選択済みの資格の場合は処理を抜ける（重複登録防止）
    const isAlreadySelected = selectedCerts.some(
      (c) => c.certificationCode === matched.certificationCode
    );
    if (isAlreadySelected) return;

    // 正常系: フォーム状態（State）の更新
    certField.onChange([
      ...selectedCerts,
      {
        certificationCode: matched.certificationCode,
        name: matched.name,
      },
    ]);

    // 追加UIを閉じる
    setIsAddingCert(false);
  };

  /**
   * 選択中の資格一覧から指定の資格を削除するハンドラー
   *
   * @param targetId - 削除対象の資格識別コード（certificationCode）
   */
  const handleRemoveCert = (targetId: number) => {
    certField.onChange(
      selectedCerts.filter((c) => c.certificationCode !== targetId)
    );
  };

  /**
   * まだ選択されていない資格名称リストをフィルタリングして取得する関数
   *
   * @returns AutocompleteSelect の選択肢候補となる資格名称の配列
   */
  const getAvailableCertificationNames = () => {
    return certificationsMast
      .filter(
        (m) =>
          !selectedCerts.some((c) => c.certificationCode === m.certificationCode)
      )
      .map((m) => `${m.certificationCode}: ${m.name}`);
  };

  return (
    <FormRow1Col label="保有資格" contentClassName="p-3 space-y-3">
      {/* 選択済み資格タグ一覧 & 追加ボタン */}
      <div className="flex flex-wrap gap-2 items-center">
        {selectedCerts.map((cert) => (
          <BadgeEditableTag
            key={cert.certificationCode}
            label={cert.name}
            onRemove={() => handleRemoveCert(cert.certificationCode)}
          />
        ))}

        {!isAddingCert && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setIsAddingCert(true)}
            className="text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 h-7 text-xs font-medium px-2.5 border border-dashed border-emerald-300"
          >
            <Plus className="w-3.5 h-3.5 mr-1" /> 資格を追加
          </Button>
        )}
      </div>

      {/* 資格追加用ドロップダウン入力エリア */}
      {isAddingCert && (
        <div className="flex items-center gap-2 max-w-md pt-1">
          <div className="flex-1">
            <AutocompleteSelect
              items={getAvailableCertificationNames()}
              onValueChange={handleSelectCert}
              placeholder="資格名を入力して検索..."
              emptyMessage="一致する資格が見つかりません"
            />
          </div>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setIsAddingCert(false)}
            className="h-9 px-3 text-xs"
          >
            キャンセル
          </Button>
        </div>
      )}
    </FormRow1Col>
  );
};

export default FormCertificationSection;