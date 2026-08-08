package com.agency.sales.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.agency.sales.dto.AuthResponse;
import com.agency.sales.dto.SignupRequest;
import com.agency.sales.mapper.AccountMapper;
import com.agency.sales.domain.Account;
import com.agency.sales.domain.Role;
import com.agency.sales.dto.AuthRequest;
import com.agency.sales.security.CustomUserDetails;
import com.agency.sales.security.JwtTokenProvider;

/**
 * 認証ビジネスロジックサービス。
 * AuthenticationManager を使用したユーザー検証と、認証成功時の JWT トークン生成を担当。
 */
@Service
public class AuthService {
  private final AuthenticationManager authenticationManager;
  private final JwtTokenProvider tokenProvider;
  private final AccountMapper accountMapper;
  private final PasswordEncoder passwordEncoder;

  /**
   * コンストラクタ
   *
   * @param authenticationManager 認証マネージャー
   * @param tokenProvider         JWT トークン生成・検証コンポーネント
   * @param accountMapper         アカウントマッパー
   * @param passwordEncoder       パスワードエンコーダー
   */
  public AuthService(
      AuthenticationManager authenticationManager,
      JwtTokenProvider tokenProvider,
      AccountMapper accountMapper,
      PasswordEncoder passwordEncoder) {
    this.authenticationManager = authenticationManager;
    this.tokenProvider = tokenProvider;
    this.accountMapper = accountMapper;
    this.passwordEncoder = passwordEncoder;
  }

  /**
   * ログイン認証を行い、認証に成功した場合は JWT トークンを生成して返却します。
   *
   * @param request ログインリクエスト DTO (ユーザー名、パスワード)
   * @return 生成された JWT トークンを格納した AuthReponse DTO
   * @throws org.springframework.security.core.AuthenticationException 認証に失敗した場合（BadCredentialsException
   *                                                                   等）
   */
  public AuthResponse login(AuthRequest request) {
    // 1. 認証処理を実行（内部で CustomUserDetailsService が呼ばれる）
    Authentication authentication = authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));

    // 2. 認証に成功した Principal（CustomUserDetails）を取り出す
    CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

    // 3. トークンの生成
    String role = authentication.getAuthorities().iterator().next().getAuthority();
    String token = tokenProvider.generateToken(request.getUsername(), role);

    // 4. レスポンスDTOを生成
    return new AuthResponse(token, userDetails.getUsername(), userDetails.getName());
  }

  /**
   * 新規アカウント登録（サインアップ）処理を行い、登録後に自動ログイン用 JWT トークンを生成して返却します。
   *
   * @param request サインアップリクエスト DTO (名前、ユーザー名、パスワード)
   * @return 生成された JWT トークンおよびユーザー情報を格納した AuthResponse DTO
   * @throws IllegalArgumentException 既にユーザー名が存在する場合
   */
  @Transactional
  public AuthResponse signup(SignupRequest request) {
    // 1. ユーザー名の重複チェック
    if (accountMapper.findByUsername(request.getUsername()).isPresent()) {
      throw new IllegalArgumentException("指定されたメールアドレスは既に登録されています。");
    }

    // 2. Account エンティティの作成（パスワードのハッシュ化・デフォルトロール ROLE_USER の付与）
    Account newAccount = Account.builder()
        .name(request.getName())
        .username(request.getUsername())
        .password(passwordEncoder.encode(request.getPassword()))
        .role(Role.ROLE_USER)
        .build();

    // 3. DBへ登録
    accountMapper.insert(newAccount);

    // 4. 登録した情報で自動ログイン処理（Authentication 取得 & トークン生成）
    AuthRequest loginRequest = new AuthRequest();
    loginRequest.setUsername(request.getUsername());
    loginRequest.setPassword(request.getPassword());

    return login(loginRequest);
  }

}
