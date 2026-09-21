"use client";

import { useFieldArray, UseFormReturn } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import { Specialty } from "@/types/api/common-type";
import FormRow1Col from "@/components/common/form/form-row-1col";
import AutocompleteSelect from "@/components/common/form/form-autocomplete-select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/**
 * AccountCreateSpecialtySection コンポーネントの Props 定義
 */
type AccountCreateSpecialtySectionProps = {
  /** React Hook Form の form インスタンス */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>;
  /** 得意分野のマスタ情報リスト */
  specialtiesMast: Specialty[];
};

/**
 * アカウント作成フォームにおける「得意分野」編集セクションコンポーネント
 *
 * @param props - {@link AccountCreateSpecialtySectionProps}
 * @returns 得意分野の動的追加・削除（useFieldArray）および経験年数入力を行う UI
 */
export const AccountCreateSpecialtySection = ({
  form,
  specialtiesMast = [],
}: AccountCreateSpecialtySectionProps) => {
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
  const handleSpecialtyChange = (index: number, selectedName: string | null) => {
    // ガード1: 未選択（null）の場合は処理を抜ける
    if (!selectedName) return;

    // マスタデータから対象の得意分野オブジェクトを検索
    // ガード2: マスタに存在しない場合は処理を抜ける
    const matched = specialtiesMast.find((spec) => spec.name === selectedName);
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

  return (
    <FormRow1Col label="得意分野" contentClassName="p-3 space-y-2.5">
      {/* 得意分野入力行の一覧表示 */}
      {fields.map((fieldItem, index) => (
        <div key={fieldItem.id} className="flex items-center gap-3">
          {/* 得意分野の選択 */}
          <div className="w-56">
            <AutocompleteSelect
              items={getAvailableSpecialtyNames(index)}
              value={form.watch(`specialties.${index}.name`)}
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
              className="w-20 h-9"
            />
            <span className="text-sm font-medium text-muted-foreground">年</span>
          </div>

          {/* 行削除ボタン */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => remove(index)}
            className="h-9 w-9 text-muted-foreground hover:text-red-600 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ))}

      {/* 新規行追加ボタン */}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => append({ specialtyCode: 0, name: "", years: 1 })}
        className="text-emerald-700 border-emerald-300 hover:bg-emerald-50 h-8 text-xs mt-1"
      >
        <Plus className="w-3.5 h-3.5 mr-1" /> 得意分野を追加
      </Button>
    </FormRow1Col>
  );
};