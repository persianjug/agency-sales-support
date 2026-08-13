package com.agency.sales.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.service.annotation.PutExchange;

import com.agency.sales.dto.AuthResponse;
import com.agency.sales.dto.ChangePasswordRequest;
import com.agency.sales.dto.ForgotPasswordRequest;
import com.agency.sales.dto.MessageResponse;
import com.agency.sales.dto.ResetPasswordRequest;
import com.agency.sales.dto.SignupRequest;
import com.agency.sales.dto.AuthRequest;
import com.agency.sales.service.AuthService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;

/**
 * 認証関係のエンドポイントを提供する REST コントローラー。
 * ログイン要求の受け付け、パスワード再設定、および初期データの自動投入を担当。
 */
@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

  // 認証処理用サービス
  private final AuthService authService;

  /**
   * コンストラクタ
   *
   * @param authService 認証処理用サービス
   */
  public AuthController(AuthService authService) {
    this.authService = authService;
  }

  /**
   * ユーザーログイン処理を実行し、JWT トークンを発行します。
   *
   * @param request ユーザー名とパスワードを含むリクエスト DTO
   * @return 発行された JWT トークンを含むレスポンス DTO
   */
  @PostMapping("/login")
  public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
    AuthResponse response = authService.login(request);
    return ResponseEntity.ok(response);
  }

  /**
   * 新規ユーザー登録処理を実行し、自動ログイン用の JWT トークンを発行します。
   *
   * @param request 名前、ユーザー名、パスワードを含むリクエスト DTO
   * @return 発行された JWT トークンを含むレスポンス DTO
   */
  @PostMapping("/signup")
  public ResponseEntity<AuthResponse> signup(@RequestBody SignupRequest request) {
    AuthResponse response = authService.signup(request);
    return ResponseEntity.ok(response);
  }

  /**
   * パスワード再設定用の申請処理を受け付け、トークンを発行します。
   *
   * @param request ユーザー名を含むリクエスト DTO
   * @return 処理結果メッセージを含むレスポンス DTO
   */
  @PostMapping("/forgot-password")
  public ResponseEntity<MessageResponse> forgotPassword(@RequestBody ForgotPasswordRequest request) {
    MessageResponse response = authService.requestPasswordReset(request);
    return ResponseEntity.ok(response);
  }

  /**
   * トークンを検証し、パスワードの再設定を実行し、自動ログイン用の JWT トークンを発行します。
   *
   * @param request トークンと新しいパスワードを含むリクエスト DTO
   * @return 発行された JWT トークンを含むレスポンス DTO
   */
  @PostMapping("/reset-password")
  public ResponseEntity<AuthResponse> resetPassword(@RequestBody ResetPasswordRequest request) {
    AuthResponse response = authService.resetPassword(request);
    return ResponseEntity.ok(response);
  }

  /**
   * パスワード処理を実行し、自動ログイン用の JWT トークンを発行します。
   *
   * @param request ユーザー名、現在パスワード、新パスワードを含むリクエスト DTO
   * @return 発行された JWT トークンを含むレスポンス DTO
   */
  @PutMapping("/change-password")
  public ResponseEntity<AuthResponse> changePassword(@RequestBody ChangePasswordRequest request) {
    AuthResponse response = authService.changePassword(request);
    return ResponseEntity.ok(response);
  }

}