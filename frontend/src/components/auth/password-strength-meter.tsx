"use client"

import { Progress as ProgressPrimitive } from "@base-ui/react/progress"
import { EMPTY_STRENGTH_CONFIG, STRENGTH_MAP } from "@/constants/auth"
import { Check, X } from "lucide-react";

/**
 * パスワード強度メーターコンポーネントの Props 型定義
 */
type PasswordStrengthMeterProps = {
  /** 判定対象のパスワード文字列 */
  password?: string;
}

/**
 * パスワード強度の判定ルールオブジェクトの型定義
 */
type StrengthRule = {
  /** ルールの識別子 */
  id: string,
  /** 画面に表示するルールの説明テキスト */
  label: string,
  /** パスワードが条件を満たしているかを判定する評価関数 */
  validator: (password: string) => boolean,
}

/**
 * デフォルトのパスワード判定ルール一覧
 * 
 * @remarks
 * ルールの追加・変更を行う場合はこの配列を編集します。
 */
const DEFAULT_RULES: StrengthRule[] = [
  {
    id: "length",
    label: "8文字以上",
    validator: (p) => p.length >= 8,
  },
  {
    id: "case",
    label: "英大文字・小文字の両方を含む",
    validator: (p) => /[A-Z]/.test(p) && /[a-z]/.test(p),
  },
  {
    id: "number",
    label: "数字を含む",
    validator: (p) => /[0-9]/.test(p),
  },
  {
    id: "symbol",
    label: "記号を含む",
    validator: (p) => /[^A-Za-z0-9]/.test(p),
  },
];

/**
 * 入力されたパスワードの強度スコアおよび表示スタイル設定を算出します。
 *
 * @param password - 評価対象のパスワード文字列
 * @param rules - 評価に使用する判定ルール一覧（デフォルト: `DEFAULT_RULES`）
 * @returns スコア数値および対応するラベル・カラークラスの設定オブジェクト
 *
 * @remarks
 * - パスワードが未入力（空文字）の場合はスコア 0 と未入力用設定（`EMPTY_STRENGTH_CONFIG`）を返します。
 * - 適合したルールの数を集計し、定数マッピング（`STRENGTH_MAP`）から表示設定を取得します。
 */
const calculateStrength = (password: string, rules = DEFAULT_RULES) => {
  // 未入力の場合はスコア0 ＆ 専用のEMPTY設定を返す
  if (!password) return { score: 0, ...EMPTY_STRENGTH_CONFIG }

  // 適合するルールの数をカウントしてスコア化
  const score = rules.reduce((acc, rule) => (rule.validator(password) ? acc + 1 : acc), 0);

  return { score, ...(STRENGTH_MAP[score] ?? STRENGTH_MAP[0]) };
}

/**
 * パスワード強度メーター・コンポーネント
 *
 * @param props - `PasswordStrengthMeterProps`
 * @returns JSX.Element - 強度プログレスバーおよび要件チェックリストを備えたUI
 *
 * @remarks
 * - 入力されたパスワード文字列をリアルタイムに評価し、強度インジケーターと各要件の達成状態（アイコン付きリスト）を表示します。
 * - Base UI の `ProgressPrimitive` を直接使用して、スムーズなアニメーションとカスタムカラー適用を実現しています。
 */
const PasswordStrengthMeter = ({ password = "" }: PasswordStrengthMeterProps) => {
  const { score, label, color, textColor } = calculateStrength(password);
  const progressValue = (score / DEFAULT_RULES.length) * 100;

  return (
    <div className="mt-2 space-y-1.5">
      <div className="flex justify-between items-center text-xs">
        <span className="text-muted-foreground font-medium">パスワード強度</span>
        <span className={`font-semibold ${textColor}`}>{label}</span>
      </div>

      {/* Base UI の Root / Track / Indicator を直接構築 */}
      <ProgressPrimitive.Root value={progressValue}>
        <ProgressPrimitive.Track className="relative flex h-1.5 w-full items-center overflow-x-hidden rounded-full bg-muted">
          <ProgressPrimitive.Indicator
            className={`h-full transition-all duration-300 ${color}`}
          />
        </ProgressPrimitive.Track>
      </ProgressPrimitive.Root>

      {/* 条件チェックリスト */}
      <ul className="space-y-1 pt-1 text-xs">
        {DEFAULT_RULES.map((rule) => {
          const isPassed = password ? rule.validator(password) : false;

          return (
            <li
              key={rule.id}
              className={`
                flex items-center gap-1.5 transition-colors duration-200
                ${isPassed ? "text-emerald-600 font-medium" : "text-muted-foreground"}`}
            >
              {isPassed ? (
                <Check className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
              ) : (
                <X className="h-3.5 w-3.5 shrink-0 text-muted-foreground/50" />
              )}
              <span>{rule.label}</span>
            </li>
          );
        })}
      </ul>
    </div>
  )
}

export default PasswordStrengthMeter;
