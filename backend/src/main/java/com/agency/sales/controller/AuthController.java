package com.agency.sales.controller;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.agency.sales.domain.Account;
import com.agency.sales.domain.Role;
import com.agency.sales.dto.AuthReponse;
import com.agency.sales.dto.AuthRequest;
import com.agency.sales.mapper.AccountMapper;
import com.agency.sales.service.AuthService;
import org.springframework.web.bind.annotation.PostMapping;

/**
 * 認証関係のエンドポイントを提供する REST コントローラー。
 * ログイン要求の受け付けおよび初期データの自動投入を担当。
 */
@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {
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
  public ResponseEntity<AuthReponse> login(@RequestBody AuthRequest request) {
    AuthReponse reponse = authService.login(request);
    return ResponseEntity.ok(reponse);
  }

  /**
   * アプリケーション起動時に開発/テスト用の初期管理者アカウント (admin) を自動登録します。
   * すでにアカウントが存在する場合は挿入をスキップします。
   *
   * @param accountMapper アカウントマッパー
   * @param passwordEncoder パスワード暗号化機能
   * @return 起動時に実行される CommandLineRunner
   */
  @Bean
  public CommandLineRunner initDatabase(AccountMapper accountMapper, PasswordEncoder passwordEncoder) {
    return args -> {
      if (accountMapper.findByUsername("admin").isEmpty()) {
        Account admin = Account.builder()
            .username("admin")
            .password(passwordEncoder.encode("password123"))
            .role(Role.ROLE_ADMIN)
            .build();
        accountMapper.insert(admin);
      }
    };
  }

}