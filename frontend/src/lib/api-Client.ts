/**
 * リクエストで許容する HTTP メソッドの型定義
 */
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

/**
 * `apiFetch` に渡せるオプションの型定義
 *
 * @remarks
 * `fetch` の `RequestInit` から、内部で制御する `method` および `body` を除外した型です。
 */
type FetchOptions = Omit<RequestInit, 'method' | 'body'>;

/**
 * Spring Boot 向け共通 Fetch ヘルパー
 *
 * @param endpoint - 呼び出し対象の API エンドポイント（例: `/api/v1/users`）
 * @param method - HTTP メソッド（`GET`, `POST`, `PUT`, `DELETE`）
 * @param payload - 送信するリクエストボディ（JSON化可能なオブジェクト / 任意）
 * @param options - `fetch` に渡す追加オプション（ヘッダーやキャッシュ設定等 / 任意）
 * @returns `fetch` のレスポンス（`Promise<Response>`）
 *
 * @remarks
 * - 環境変数 `SPRING_BOOT_API_URL` をベース URL として結合します。
 * - デフォルトのヘッダーとして `'Content-Type': 'application/json'` をセットします（`options.headers` で上書き・拡張可能）。
 * - `cache` のデフォルト値は `'no-store'` に設定されており、常に最新データを取得します。
 */
const apiFetch = async (
  endpoint: string,
  method: HttpMethod,
  payload?: unknown,
  options?: FetchOptions
): Promise<Response> => {
  const baseUrl = process.env.SPRING_BOOT_API_URL;
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options?.headers,
  }

  // キャッシュはデフォルト 'no-store'
  return (
    await fetch(`${baseUrl}${endpoint}`, {
      method,
      headers,
      body: payload ? JSON.stringify(payload) : undefined,
      cache: options?.cache ?? 'no-store',
      ...options,
    })
  );
}

/**
 * API 通信を行う共通クライアントオブジェクト
 */
export const apiClient = {
  /**
   * GET リクエストを送信します。
   *
   * @param endpoint - 呼び出し対象のエンドポイント
   * @param options - 追加の fetch オプション
   * @returns `Promise<Response>`
   */
  get: (endpoint: string, options?: FetchOptions) =>
    apiFetch(endpoint, 'GET', undefined, options),

  /**
   * POST リクエストを送信します。
   *
   * @param endpoint - 呼び出し対象のエンドポイント
   * @param payload - 送信するデータ
   * @param options - 追加の fetch オプション
   * @returns `Promise<Response>`
   */
  post: (endpoint: string, payload: unknown, options?: FetchOptions) =>
    apiFetch(endpoint, 'POST', payload, options),

  /**
   * PUT リクエストを送信します。
   *
   * @param endpoint - 呼び出し対象のエンドポイント
   * @param payload - 更新するデータ
   * @param options - 追加の fetch オプション
   * @returns `Promise<Response>`
   */
  put: (endpoint: string, payload: unknown, options?: FetchOptions) =>
    apiFetch(endpoint, 'PUT', payload, options),

  /**
   * DELETE リクエストを送信します。
   *
   * @param endpoint - 呼び出し対象のエンドポイント
   * @param options - 追加の fetch オプション
   * @returns `Promise<Response>`
   */
  delete: (endpoint: string, options?: FetchOptions) =>
    apiFetch(endpoint, 'DELETE', undefined, options),
}
