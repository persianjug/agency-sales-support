package com.agency.sales.service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.HexFormat;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import com.agency.sales.dto.AuthResponse;
import com.agency.sales.dto.ChangePasswordRequest;
import com.agency.sales.dto.ForgotPasswordRequest;
import com.agency.sales.dto.MailRequest;
import com.agency.sales.dto.MessageResponse;
import com.agency.sales.dto.ResetPasswordRequest;
import com.agency.sales.dto.SignupRequest;
import com.agency.sales.mapper.AccountMapper;
import com.agency.sales.mapper.PasswordResetTokenMapper;
import com.agency.sales.domain.Account;
import com.agency.sales.domain.PasswordResetToken;
import com.agency.sales.domain.Role;
import com.agency.sales.dto.AuthRequest;
import com.agency.sales.security.CustomUserDetails;
import com.agency.sales.security.JwtTokenProvider;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.extern.slf4j.Slf4j;

/**
 * 認証ビジネスロジックサービス。
 * AuthenticationManager を使用したユーザー検証と、認証成功時の JWT トークン生成およびパスワードリセット処理を担当。
 */
@Slf4j
@Service
public class AuthService {

  private final AuthenticationManager authenticationManager;
  private final JwtTokenProvider tokenProvider;
  private final AccountMapper accountMapper;
  private final PasswordResetTokenMapper tokenMapper;
  private final PasswordEncoder passwordEncoder;
  private final JavaMailSender mailSender;
  private final TemplateEngine templateEngine;

  // パスワード変更要求ページの有効期限（分）
  private static final long EXPIRATION_MINUTES = 30;

  // パス構造定数
  private static final String RESET_PASSWORD_PATH = "/reset-password?token=";
  private static final String DEFAULT_FROM_EMAIL = "noreply@agency-sales.local";
  private static final String RESET_PASSWORD_TEMPLATE = "mail/reset-password";

  // メッセージ定数
  private static final String MSG_EMAIL_ALREADY_EXISTS = "指定されたメールアドレスは既に登録されています。";
  private static final String MSG_RESET_EMAIL_SENT = "パスワード再設定用のメールを送信しました。";
  private static final String MSG_INVALID_TOKEN = "無効なトークンです。";
  private static final String MSG_TOKEN_USED = "このリンクは既に使用されています。";
  private static final String MSG_TOKEN_EXPIRED = "リンクの有効期限が切れています。";
  private static final String MSG_ACCOUNT_NOT_FOUND = "アカウントが存在しません。";
  private static final String MSG_MAIL_SEND_ERROR = "メール送信処理に失敗しました。";
  private static final String MSG_HASH_ALGORITHM_ERROR = "SHA-256 error";
  private static final String MSG_INVALID_CURRENT_PASSWORD = "現在のパスワードが正しくありません。"; 
  private static final String MSG_INVALID_NEW_PASSWORD = "新しいパスワードには、現在のパスワードと異なるものを入力してください。";

  // フロント側URL
  @Value("${cors.allowed-origins}")
  private String frontendUrl;

  /**
   * コンストラクタ
   *
   * @param authenticationManager 認証マネージャー
   * @param tokenProvider         JWT トークン生成・検証コンポーネント
   * @param accountMapper         アカウントマッパー
   * @param tokenMapper           パスワードリセット用トークンマッパー
   * @param passwordEncoder       パスワードエンコーダー
   * @param mailSender            メール送信コンポーネント
   */
  public AuthService(
      AuthenticationManager authenticationManager,
      JwtTokenProvider tokenProvider,
      AccountMapper accountMapper,
      PasswordResetTokenMapper tokenMapper,
      PasswordEncoder passwordEncoder,
      JavaMailSender mailSender,
      TemplateEngine templateEngine) {
    this.authenticationManager = authenticationManager;
    this.tokenProvider = tokenProvider;
    this.accountMapper = accountMapper;
    this.tokenMapper = tokenMapper;
    this.passwordEncoder = passwordEncoder;
    this.mailSender = mailSender;
    this.templateEngine = templateEngine;
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

    // 3. トークンの生成 & レスポンス構築（共通メソッド呼出）
    String role = authentication.getAuthorities().iterator().next().getAuthority();
    return createAuthResponse(userDetails.getUsername(), userDetails.getName(), role);
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
      throw new IllegalArgumentException(MSG_EMAIL_ALREADY_EXISTS);
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

    // 4. 自動ログイン用の AuthResponse を生成して返却
    String role = newAccount.getRole().name();
    return createAuthResponse(newAccount.getUsername(), newAccount.getName(), role);
  }

  /**
   * パスワード再設定用の申請処理を行い、トークンを発行します。
   * ユーザーが存在する場合は再設定用URLを生成し、古いトークンの破棄と新規トークンの保存を行います。
   *
   * @param request パスワードリセット申請リクエスト DTO (ユーザー名)
   * @return 処理結果メッセージを保持する MessageResponse
   */
  @Transactional
  public MessageResponse requestPasswordReset(ForgotPasswordRequest request) {
    // 1. アカウントの重複チェック
    Account account = accountMapper.findByUsername(request.getUsername()).orElse(null);

    // 2. ユーザーが存在しない場合もエラーを出さず静かに復帰（ユーザー存在チェックの列挙攻撃対策）
    if (account == null) {
      log.debug("パスワードリセット申請: 該当するユーザーが存在しません ({})", request.getUsername());
      return new MessageResponse(MSG_RESET_EMAIL_SENT);
    }

    // 3. 生トークン生成 & SHA-256 ハッシュ化
    String rawToken = generateSecureRawToken();
    String tokenHash = hashToken(rawToken);

    // 4. 過去の未消費トークンを削除
    tokenMapper.deleteByAccountId(account.getId());

    // 5. 新規トークンの保存
    PasswordResetToken resetToken = PasswordResetToken.builder()
        .accountId(account.getId())
        .tokenHash(tokenHash)
        .expiresAt(LocalDateTime.now().plusMinutes(EXPIRATION_MINUTES))
        .build();
    tokenMapper.insert(resetToken);

    // 6. 再設定用URLの発行し、再設定用メール送信
    String resetUrl = frontendUrl + RESET_PASSWORD_PATH + rawToken;
    sendResetEmail(account.getUsername(), resetUrl);

    // 7. レスポンスDTOを生成
    return new MessageResponse(MSG_RESET_EMAIL_SENT);
  }

  /**
   * 提供されたトークンを検証し、対象アカウントのパスワードを再設定します。<br>
   * 再設定後に自動ログイン用 JWT トークンを生成して返却します。
   *
   * @param request パスワード再設定リクエスト DTO (トークン、新しいパスワード)
   * @throws IllegalArgumentException トークンが無効、または該当アカウントが存在しない場合
   * @throws IllegalStateException    トークンが既に使用済み、または有効期限切れの場合
   */
  @Transactional
  public AuthResponse resetPassword(ResetPasswordRequest request) {
    // 1. トークンのハッシュ化
    String tokenHash = hashToken(request.getToken());

    // 2. トークン検証
    PasswordResetToken resetToken = tokenMapper.findByTokenHash(tokenHash)
        .orElseThrow(() -> new IllegalArgumentException(MSG_INVALID_TOKEN));

    // 3. トークンが使用済みの場合
    if (resetToken.getUsedAt() != null) {
      throw new IllegalStateException(MSG_TOKEN_USED);
    }

    // 4. トークンが効期限切れの場合
    if (resetToken.getExpiresAt().isBefore(LocalDateTime.now())) {
      throw new IllegalStateException(MSG_TOKEN_EXPIRED);
    }

    // 5. アカウント検索
    Account account = accountMapper.findById(resetToken.getAccountId())
        .orElseThrow(() -> new IllegalArgumentException(MSG_ACCOUNT_NOT_FOUND));

    // 6. 新しいパスワードが現在のパスワードと照合
    if (passwordEncoder.matches(request.getNewPassword(), account.getPassword())) {
      throw new IllegalArgumentException(MSG_INVALID_NEW_PASSWORD);
    }

    // 7. パスワードの更新
    account.setPassword(passwordEncoder.encode(request.getNewPassword()));
    accountMapper.updatePassword(account);

    // 8. トークンを消費状態に更新
    resetToken.setUsedAt(LocalDateTime.now());
    tokenMapper.updateUsedAt(resetToken);

    log.info("アカウント (ID: {}) のパスワード更新完了", resetToken.getAccountId());

    // 9. 自動ログイン用の AuthResponse を生成して返却
    String role = account.getRole().name();
    return createAuthResponse(account.getUsername(), account.getName(), role);
  }

  /**
   * 対象アカウントのパスワードを変更します。<br>
   * 再設定後に自動ログイン用 JWT トークンを生成して返却します。
   *
   * @param request パスワード変更リクエスト DTO (ユーザー名、現パスワード、新しいパスワード)
   * @throws IllegalArgumentException 該当アカウントが存在しない場合
   */
  @Transactional
  public AuthResponse changePassword(ChangePasswordRequest request) {
    // 1. アカウント検索
    Account account = accountMapper.findByUsername(request.getUsername())
        .orElseThrow(() -> new IllegalArgumentException(MSG_ACCOUNT_NOT_FOUND));

    // 2. 現在のパスワードの照合チェック
    // 本人確認：入力された「現在のパスワード」がDBのハッシュ値と一致するかチェック
    if (!passwordEncoder.matches(request.getCurrentPassword(), account.getPassword())) {
      throw new IllegalArgumentException(MSG_INVALID_CURRENT_PASSWORD);
    }

    // 3. 新しいパスワードが現在のパスワードと同じかチェック
    // 重複防止：入力された「新しいパスワード」が現在のパスワードと同じでないかチェック
    // ※フロント側のZodチェックをバイパスされた場合や、直叩きAPI対策としてサーバー側でもガード
    if (passwordEncoder.matches(request.getNewPassword(), account.getPassword())) {
      throw new IllegalArgumentException(MSG_INVALID_NEW_PASSWORD);
    }

    // 4. パスワードの更新
    account.setPassword(passwordEncoder.encode(request.getNewPassword()));
    accountMapper.updatePassword(account);

    // 5. 自動ログイン用の AuthResponse を生成して返却
    String role = account.getRole().name();
    return createAuthResponse(account.getUsername(), account.getName(), role);
  }

  /**
   * ユーザー情報およびロール情報を基に JWT トークンを生成し、認証レスポンス DTO を構築します。
   *
   * @param username ユーザー名（メールアドレス等）
   * @param name     ユーザー表示名
   * @param role     権限ロール文字列（例: "ROLE_USER"）
   * @return 生成された JWT トークンとユーザー情報を保持する {@link AuthResponse}
   */
  private AuthResponse createAuthResponse(String username, String name, String role) {
    String token = tokenProvider.generateToken(username, role);
    return new AuthResponse(token, username, name);
  }

  /**
   * パスワード再設定用メールの送信処理を行います。
   * メール送信用の {@link MailRequest} を構築し、MimeMessage の生成と送信を実行します。
   *
   * @param toEmail  送信先メールアドレス
   * @param resetUrl パスワード再設定用URL
   * @throws RuntimeException メール送信処理中に例外が発生した場合
   */
  private void sendResetEmail(String toEmail, String resetUrl) {
    // 1. メール送信に必要なパラメータ（MailRequest）を構築
    MailRequest mailRequest = MailRequest.builder()
        .from(DEFAULT_FROM_EMAIL)
        .to(toEmail)
        .subject("【Agency Sales】パスワード再設定のご案内")
        .templatePath(RESET_PASSWORD_TEMPLATE)
        .variables(Map.of("resetUrl", resetUrl))
        .build();

    try {
      // 2. MimeMessage を生成してメール送信を実行
      MimeMessage message = createMimeMessage(mailRequest);
      mailSender.send(message);
      log.info("パスワード再設定メール送信成功: To={}", toEmail);
    } catch (Exception e) {
      log.error("メール送信失敗: To={}", toEmail, e);
      throw new RuntimeException(MSG_MAIL_SEND_ERROR, e);
    }
  }

  /**
   * {@link MailRequest} の情報を基に、Thymeleaf テンプレートをレンダリングした HTML 形式の
   * {@link MimeMessage} を生成します。
   *
   * @param mailRequest メール送信パラメータを保持する DTO
   * @return 構築された MimeMessage オブジェクト
   * @throws MessagingException メールヘッダーの設定や本文構築に失敗した場合
   */
  private MimeMessage createMimeMessage(MailRequest mailRequest) throws MessagingException {
    // 1. MimeMessage と MimeMessageHelper の初期化
    MimeMessage message = mailSender.createMimeMessage();
    MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

    // 2. 基本情報（送信元、送信先、件名）の設定
    helper.setFrom(mailRequest.getFrom());
    helper.setTo(mailRequest.getTo());
    helper.setSubject(mailRequest.getSubject());

    // 3. Thymeleaf コンテキストの作成とテンプレート変数のセット
    Context context = new Context();
    if (mailRequest.getVariables() != null) {
      mailRequest.getVariables().forEach(context::setVariable);
    }

    // 4. テンプレートのレンダリングと HTML 本文の設定
    String htmlContent = templateEngine.process(mailRequest.getTemplatePath(), context);
    helper.setText(htmlContent, true);

    return message;
  }

  /**
   * 安全な乱数生成器 (SecureRandom) を使用して、32バイトのランダムな URL セーフな生トークンを生成します。
   *
   * @return URL セーフな Base64 エンコード文字列の生トークン
   */
  private String generateSecureRawToken() {
    SecureRandom random = new SecureRandom();
    byte[] bytes = new byte[32];
    random.nextBytes(bytes);
    return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
  }

  /**
   * 提供された生トークンを SHA-256 アルゴリズムでハッシュ化し、16進数文字列に変換します。
   *
   * @param rawToken ハッシュ化対象の生トークン文字列
   * @return SHA-256 ハッシュ化された16進数文字列
   * @throws RuntimeException SHA-256 アルゴリズムが利用できない場合
   */
  private String hashToken(String rawToken) {
    try {
      MessageDigest digest = MessageDigest.getInstance("SHA-256");
      byte[] hash = digest.digest(rawToken.getBytes(StandardCharsets.UTF_8));
      return HexFormat.of().formatHex(hash);
      // StringBuilder hexString = new StringBuilder();
      // for (byte b : hash) {
      // String hex = Integer.toHexString(0xff & b);
      // if (hex.length() == 1)
      // hexString.append('0');
      // hexString.append(hex);
      // }
      // return hexString.toString();
    } catch (NoSuchAlgorithmException e) {
      throw new RuntimeException(MSG_HASH_ALGORITHM_ERROR, e);
    }
  }
}
