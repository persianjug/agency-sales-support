package com.agency.sales.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

import com.agency.sales.service.CustomUserDetailsService;

/**
 * Spring Security のセキュリティ全体設定クラス。
 * 認証・認可ルール、セッション管理ポリシー、および認証プロバイダーの定義を担当。
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

  private final CustomUserDetailsService userDetailsService;

  /**
   * コンストラクタ
   *
   * @param userDetailsService ユーザー情報取得用サービス
   */
  public SecurityConfig(CustomUserDetailsService userDetailsService) {
    this.userDetailsService = userDetailsService;
  }

  /**
   * HTTP セキュリティの設定（フィルタチェーン）を構築。
   * CSRF 無効化、ステートレスセッション管理、公開エンドポイントの設定を行う。
   *
   * @param http HttpSecurity オブジェクト
   * @return 構築された SecurityFilterChain
   * @throws Exception 設定時の例外
   */
  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http
        .csrf(AbstractHttpConfigurer::disable)
        .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .authorizeHttpRequests(auth -> auth
            // 認証不要のエンドポイント（ログインAPI、Swagger UI）
            .requestMatchers(
                "/api/v1/auth/**",
                "/v3/api-docs/**",
                "/swagger-ui/**",
                "/swagger-ui.html")
            .permitAll()
            .anyRequest().authenticated());

    return http.build();
  }

  /**
   * パスワードハッシュ化用のエンコーダーを生成。
   * 安全なアルゴリズムである BCrypt を採用。
   *
   * @return PasswordEncoder インスタンス
   */
  @Bean
  public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }

  /**
   * ユーザー詳細サービスとパスワードエンコーダーを紐付けた DaoAuthenticationProvider を生成。
   * 認証処理で DB 参照とパスワード照合を行うコンポーネント。
   *
   * @return DaoAuthenticationProvider インスタンス
   */
  @Bean
  public DaoAuthenticationProvider authenticationProvider() {
    DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider(userDetailsService);
    authProvider.setPasswordEncoder(passwordEncoder());
    return authProvider;
  }

  /**
   * 認証処理を統括する AuthenticationManager を Bean 登録。
   *
   * @param config 認証設定オブジェクト
   * @return AuthenticationManager インスタンス
   * @throws Exception 取得時の例外
   */
  @Bean
  public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
    return config.getAuthenticationManager();
  }

}
