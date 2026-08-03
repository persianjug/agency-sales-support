import { useEffect } from "react"

/**
 * オプション設定の型定義
 */
type ShortcutOptions = {
  // Cmdキー（Mac）または Ctrlキー（Windows）との組み合わせを必須にするか
  ctrlOrCmd?: boolean;
};

/**
 * グローバルなキーボードショートカットイベントを監視するカスタムフック。
 *
 * @param key 監視対象のキー（例: "k", "Escape" など）
 * @param callback キーが押されたときに実行されるコールバック関数
 * @param options イベント挙動の制御オプション（Cmd/Ctrl同時押しの指定など）
 */
export const useKeyboardShortcut = (
  key: string,
  callback: () => void,
  options:ShortcutOptions = {}
) => {

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isKeyMatch = event.key.toLowerCase() === key.toLowerCase()
      const isCtrlOrCmdMatch =
        options.ctrlOrCmd ? (event.ctrlKey || event.metaKey) : true;

      if (isKeyMatch && isCtrlOrCmdMatch) {
        event.preventDefault();
        callback();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [key, callback, options])

}