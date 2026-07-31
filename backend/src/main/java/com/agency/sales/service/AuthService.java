package com.agency.sales.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import com.agency.sales.dto.AuthReponse;
import com.agency.sales.dto.AuthRequest;
import com.agency.sales.security.JwtTokenProvider;

/**
 * 認証ビジネスロジックサービス。
 * AuthenticationManager を使用したユーザー検証と、認証成功時の JWT トークン生成を担当。
 */
@Service
public class AuthService {
  private final AuthenticationManager authenticationManager;
  private final JwtTokenProvider tokenProvider;

  /**
   * コンストラクタ
   *
   * @param authenticationManager 認証マネージャー
   * @param tokenProvider JWT トークン生成・検証コンポーネント
   */
  public AuthService(AuthenticationManager authenticationManager, JwtTokenProvider tokenProvider) {
    this.authenticationManager = authenticationManager;
    this.tokenProvider = tokenProvider;
  }

  /**
   * ログイン認証を行い、認証に成功した場合は JWT トークンを生成して返却します。
   *
   * @param request ログインリクエスト DTO (ユーザー名、パスワード)
   * @return 生成された JWT トークンを格納した AuthReponse DTO
   * @throws org.springframework.security.core.AuthenticationException 認証に失敗した場合（BadCredentialsException 等）
   */
  public AuthReponse login(AuthRequest request) {
    Authentication authentication = authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));

    String role = authentication.getAuthorities().iterator().next().getAuthority();
    String token = tokenProvider.generateToken(request.getUsername(), role);

    return new AuthReponse(token);
  }

}
