package com.agency.sales.config;

import com.agency.sales.dto.ErrorResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.ZoneId;
import java.time.ZonedDateTime;

/**
 * 全コントローラー共通の例外ハンドラー。
 * アプリケーション内で発生した例外を捕捉し、一律の ErrorResponse 形式に整形してレスポンスする。
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

  private static final ZoneId JST_ZONE = ZoneId.of("Asia/Tokyo");

  /**
   * バリデーションエラーや不正な引数例外をハンドリング（400 Bad Request）。
   * ユーザー重複時などに呼び出される。
   *
   * @param e 発生した例外オブジェクト
   * @return 400 ステータスと例外メッセージを含むエラー詳細レスポンス
   */
  @ExceptionHandler(IllegalArgumentException.class)
  public ResponseEntity<ErrorResponse> handleIllegalArgumentException(IllegalArgumentException e) {
    return createErrorResponse(HttpStatus.BAD_REQUEST, e.getMessage());
  }

  /**
   * 認証失敗系の例外をハンドリング（401 Unauthorized）。
   * ユーザー不在、パスワード不一致の場合に呼び出される。
   *
   * @return 401 ステータスとエラー詳細レスポンス
   */
  @ExceptionHandler({ BadCredentialsException.class, UsernameNotFoundException.class })
  public ResponseEntity<ErrorResponse> handleAuthException() {
    return createErrorResponse(HttpStatus.UNAUTHORIZED, "ユーザー名またはパスワードが正しくありません。");
  }

  /**
   * システム全体の予期せぬ例外をハンドリング（500 Internal Server Error）。
   *
   * @param e 発生した例外オブジェクト
   * @return 500 ステータスとエラー詳細レスポンス
   */
  @ExceptionHandler(Exception.class)
  public ResponseEntity<ErrorResponse> handleGeneralException(Exception e) {
    return createErrorResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        "システムエラーが発生しました。時間をおいて再度お試しください。");
  }

  /**
   * 共通のエラーレスポンス（ErrorResponse DTO）を生成する内部メソッド。
   *
   * @param status  HTTPステータスコード
   * @param message ユーザー向けエラーメッセージ
   * @return レスポンスエンティティ
   */
  private ResponseEntity<ErrorResponse> createErrorResponse(HttpStatus status, String message) {
    ErrorResponse response = ErrorResponse.builder()
        .timestamp(ZonedDateTime.now(JST_ZONE))
        .status(status.value())
        .error(status.getReasonPhrase().toUpperCase().replace(" ", "_"))
        .message(message)
        .build();

    return ResponseEntity.status(status).body(response);
  }
}