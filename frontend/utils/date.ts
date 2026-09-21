/**
 * ISO8601形式の文字列を「yyyy年mm月dd日」に変換する
 */
export const formatDateToJapanese = (isoString?: string): string => {
  if (!isoString) return '';

  const date = new Date(isoString);

  // 不正な日付文字列が入ってきた場合のガード
  if (isNaN(date.getTime())) return '';

  // 日本のロケールを指定してフォーマット（月・日が自動的に1桁/2桁処理される）
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');

  return `${yyyy}年${mm}月${dd}日`;
}
