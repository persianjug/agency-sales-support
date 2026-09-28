"use client";

import { useFieldArray, UseFormReturn } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import { Specialty } from "@/types/api/common-type";
import FormRow1Col from "@/components/common/form/form-row-1col";
import FormAutocompleteSelect from "@/components/common/form/form-autocomplete-select";
import AppButton from "@/components/common/button/app-button";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/**
 * FormSpecialtySection コンポーネントの Props 定義
 */
type FormSpecialtySectionProps = {
  /** React Hook Form の form インスタンス */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>;
  /** 得意分野のマスタ情報リスト */
  specialtiesMast: Specialty[];
};

/**
 * アカウント作成フォームにおける「得意分野」編集セクションコンポーネント
 *
 * @param props - {@link FormSpecialtySectionProps}
 * @returns 得意分野の動的追加・削除（useFieldArray）および経験年数入力を行う UI
 */
export const FormSpecialtySection = ({
  form,
  specialtiesMast = [],
}: FormSpecialtySectionProps) => {
  /** React Hook Form による得意分野オブジェクト配列（specialties）の動的制御 */
  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: "specialties",
  });

  /**
   * 指定インデックスの得意分野名が変更された際のハンドラー
   *
   * @param index - 更新対象行のインデックス番号
   * @param selectedName - ドロップダウンで選択された得意分野名（未選択時は null）
   */
  const handleSpecialtyChange = (index: number, selectedDisplayValue: string | null) => {
    // ガード1: 未選択（null）の場合は処理を抜ける
    if (!selectedDisplayValue) return;

    // マスタデータから対象の得意分野オブジェクトを検索
    // ガード2: マスタに存在しない場合は処理を抜ける
    const codeMatch = selectedDisplayValue.match(/^(\d+):/);
    const targetCode = codeMatch ? parseInt(codeMatch[1], 10) : null;
    const matched = specialtiesMast.find((spec) =>
      targetCode !== null
        ? spec.specialtyCode === targetCode
        : spec.name === selectedDisplayValue
    );

    if (!matched) return;

    // 正常系: 指定インデックスの要素をマスタのIDと名称で更新
    const current = form.getValues(`specialties.${index}`);
    update(index, {
      ...current,
      specialtyCode: matched.specialtyCode,
      name: matched.name,
    });
  };

  /**
   * 自分以外の行で選択済みの得意分野を除外し、選択可能な候補リストを取得する関数
   *
   * @param currentIndex - 現在選択操作を行っている行のインデックス番号
   * @returns 選択可能な得意分野名称の配列
   */
  const getAvailableSpecialtyNames = (currentIndex: number) => {
    const currentSpecialties: Specialty[] = form.watch("specialties") || [];
    const usedNames = currentSpecialties
      .filter((_: unknown, i: number) => i !== currentIndex)
      .map(s => s.specialtyCode);

    return specialtiesMast
      .filter((m) => !usedNames.includes(m.specialtyCode))
      .map((m) => `${m.specialtyCode}: ${m.name}`);
  };

  /**
   * 選択中の得意分野名称を組み立て
   *
   * @param currentIndex - 現在選択操作を行っている行のインデックス番号
   * @returns 選択中の得意分野名称（コード+「:」+名称）
   */
  const getDisplayValue = (currentIndex: number) => {
    const currentCode = form.watch(`specialties.${currentIndex}.specialtyCode`);
    const currentName = form.watch(`specialties.${currentIndex}.name`);
    const displayValue = currentCode
      ? `${currentCode}:${currentName}`
      : currentName || "";

    return displayValue;
  }

  return (
    <FormRow1Col label="得意分野" contentClassName="p-3 space-y-2.5">
      {/* 得意分野入力行の一覧表示 */}
      {fields.map((fieldItem, index) => {
        return (
          <div key={fieldItem.id} className="flex items-center gap-3">
            {/* 得意分野の選択 */}
            <div className="w-64">
              <FormAutocompleteSelect
                items={getAvailableSpecialtyNames(index)}
                value={getDisplayValue(index)}
                onValueChange={(value) => handleSpecialtyChange(index, value)}
                placeholder="分野を入力・検索..."
                emptyMessage="一致する候補がありません"
              />
            </div>

            {/* 経験年数の入力 */}
            <div className="flex items-center gap-1.5">
              <Input
                type="number"
                min={1}
                max={50}
                {...form.register(`specialties.${index}.years`, {
                  valueAsNumber: true,
                })}
                className="w-20 h-9 focus-visible:ring-1 focus-visible:ring-ring"
              />
              <span className="text-sm font-medium text-muted-foreground">年</span>
            </div>

            {/* 行削除ボタン */}
            <AppButton
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => remove(index)}
              className="h-9 w-9 text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </AppButton>
          </div>
        );
      })}

      {/* 新規行追加ボタン */}
      <AppButton
        type="button"
        variant="outline"
        size="sm"
        onClick={() => append({ specialtyCode: 0, name: "", years: 1 })}
        startIcon={<Plus className="w-3.5 h-3.5" />}
        className="h-8 text-xs mt-1 border-primary text-primary hover:text-primary hover:bg-accent"
      >
        得意分野を追加
      </AppButton>
    </FormRow1Col>
  );
};

export default FormSpecialtySection;