import React, { useState, useEffect, useRef } from 'react';
import { AdminUser } from '../types';

interface LoginScreenProps {
  onSuccessLogin: (user: AdminUser) => void;
  onOpenPasswordReset: () => void;
  onOpenSocModal: () => void;
}

type AuthStep = 'credentials' | 'verifying' | 'mfa_challenge' | 'mfa_verifying' | 'mfa_success';
type MfaMethod = 'fido2' | 'totp' | 'recovery_code';

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onSuccessLogin,
  onOpenPasswordReset,
  onOpenSocModal,
}) => {
  const [identifier, setIdentifier] = useState('admin@enterprise.internal');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberSession, setRememberSession] = useState(true);
  const [authStep, setAuthStep] = useState<AuthStep>('credentials');
  const [mfaMethod, setMfaMethod] = useState<MfaMethod>('fido2');
  const [totpDigits, setTotpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [recoveryCode, setRecoveryCode] = useState('');
  const [sessionTimeoutSeconds, setSessionTimeoutSeconds] = useState(120);
  const [fidoPulsing, setFidoPulsing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const totpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Real-time countdown timer for MFA challenge
  useEffect(() => {
    let timer: any = null;
    if (authStep === 'mfa_challenge') {
      setSessionTimeoutSeconds(120);
      timer = setInterval(() => {
        setSessionTimeoutSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setAuthStep('credentials');
            setErrorMessage('La fenêtre de défi MFA a expiré pour des raisons de sécurité. Veuillez vous réauthentifier.');
            return 120;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [authStep]);

  // Handle Primary Credentials Submission
  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setErrorMessage('Identifiant requis.');
      return;
    }
    setErrorMessage(null);
    setAuthStep('verifying');

    setTimeout(() => {
      setAuthStep('mfa_challenge');
    }, 1100);
  };

  // Handle TOTP input changes
  const handleTotpChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Handle paste of 6 digits
      const cleaned = value.replace(/\D/g, '').slice(0, 6);
      if (cleaned.length > 0) {
        const newDigits = [...totpDigits];
        for (let i = 0; i < 6; i++) {
          newDigits[i] = cleaned[i] || '';
        }
        setTotpDigits(newDigits);
        const nextIndex = Math.min(cleaned.length, 5);
        totpInputRefs.current[nextIndex]?.focus();
      }
      return;
    }

    const singleDigit = value.replace(/\D/g, '');
    const newDigits = [...totpDigits];
    newDigits[index] = singleDigit;
    setTotpDigits(newDigits);

    // Auto-advance
    if (singleDigit && index < 5) {
      totpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleTotpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !totpDigits[index] && index > 0) {
      totpInputRefs.current[index - 1]?.focus();
    }
  };

  // Quick fill TOTP demo code
  const fillSampleTotp = () => {
    const sample = ['8', '4', '9', '2', '0', '1'];
    setTotpDigits(sample);
  };

  // Complete MFA
  const completeAuthentication = (method: string) => {
    setAuthStep('mfa_verifying');
    setErrorMessage(null);

    setTimeout(() => {
      setAuthStep('mfa_success');
      setTimeout(() => {
        const user: AdminUser = {
          identifier: identifier.trim() || 'admin@enterprise.internal',
          displayName: identifier.includes('soc') ? 'Alexandre Dubois (SOC)' : 'Marc Vance (Directeur SSI)',
          role: identifier.includes('soc') ? 'Analyste SOC' : 'Super Administrateur',
          email: identifier.includes('@') ? identifier : `${identifier}@enterprise.internal`,
          lastLogin: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
          ipAddress: '192.168.1.104',
          fidoTokenName: method === 'fido2' ? 'YubiKey 5C NFC (FIPS)' : 'TOTP Authenticator',
          tokenFingerprint: 'SHA256:7b4e9f1a2c3d5e89a0b1c2d3e4f5a6b7',
        };
        onSuccessLogin(user);
      }, 700);
    }, 1000);
  };

  // Simulate FIDO2 WebAuthn Touch
  const handleFidoTouch = () => {
    setFidoPulsing(true);
    setTimeout(() => {
      completeAuthentication('fido2');
    }, 800);
  };

  // Format seconds into MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="relative w-full flex-1 flex flex-col justify-center items-center p-4 sm:p-6 my-auto">
      {/* Background radial glow */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(77,142,255,0.08),rgba(15,19,28,0))]"></div>

      <div className="relative w-full max-w-xl z-10">
        {/* Ambient Blur Orbs */}
        <div className="absolute -top-16 -left-16 w-64 h-64 bg-[#adc6ff]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-[#3131c0]/20 rounded-full blur-3xl pointer-events-none"></div>

        {/* Main Card Chassis */}
        <div className="relative bg-[#1c1f29]/95 backdrop-blur-2xl rounded-xl shadow-2xl p-6 sm:p-10 overflow-hidden border border-[#424754]/30">
          {/* Top Security Line or Session Timeout Bar */}
          {authStep === 'mfa_challenge' || authStep === 'mfa_verifying' ? (
            <div className="h-1.5 -mt-6 sm:-mt-10 -mx-6 sm:-mx-10 mb-6 bg-[#0a0e17] overflow-hidden relative">
              <div
                className="h-full bg-gradient-to-r from-[#4edea3] to-[#4d8eff] transition-all duration-1000 ease-linear"
                style={{ width: `${(sessionTimeoutSeconds / 120) * 100}%` }}
                title={`Expiration du défi MFA : ${formatTime(sessionTimeoutSeconds)}`}
              />
            </div>
          ) : (
            <div className="h-1 -mt-6 sm:-mt-10 -mx-6 sm:-mx-10 mb-6 bg-gradient-to-r from-[#4d8eff] via-[#adc6ff] to-[#4edea3]"></div>
          )}

          {/* Quick Demo Credentials Bar (Developer Friendly Helper) */}
          <div className="mb-4 pb-3 border-b border-[#424754]/30 flex items-center justify-between gap-2 text-xs">
            <span className="text-[#8c909f] font-mono text-[11px] flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px] text-[#adc6ff]">vpn_key</span>
              Comptes démo PAM :
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setIdentifier('admin@enterprise.internal');
                  setPassword('SecAdmin@Aegis#2026');
                }}
                className="px-2 py-0.5 rounded bg-[#262a34] text-[#adc6ff] hover:bg-[#31353f] transition-colors text-[11px] font-mono cursor-pointer"
              >
                Super Admin
              </button>
              <button
                type="button"
                onClick={() => {
                  setIdentifier('analyste.soc@enterprise.internal');
                  setPassword('SOCLevel3@Gate#2026');
                }}
                className="px-2 py-0.5 rounded bg-[#262a34] text-[#c2c6d6] hover:bg-[#31353f] transition-colors text-[11px] font-mono cursor-pointer"
              >
                Analyste SOC
              </button>
            </div>
          </div>

          {/* Error Banner if any */}
          {errorMessage && (
            <div className="mb-5 p-3 rounded bg-[#93000a]/20 border border-[#ffb4ab]/30 text-[#ffdad6] text-xs flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-[#ffb4ab]">error</span>
              <span>{errorMessage}</span>
            </div>
          )}

          {/* STEP 1: PRIMARY CREDENTIALS */}
          {(authStep === 'credentials' || authStep === 'verifying') && (
            <div>
              {/* Header inside card */}
              <div className="flex flex-col gap-1 mb-6">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#31353f] text-[#4edea3]">
                    <span className="w-2 h-2 rounded-full bg-[#4edea3] animate-pulse"></span>
                    <span className="font-mono text-[11px] tracking-wider uppercase font-medium">
                      Accès restreint aux administrateurs
                    </span>
                  </div>
                  <span className="font-mono text-[11px] text-[#8c909f]">
                    SOC-NODE #4092
                  </span>
                </div>
                <h1 className="font-sans font-semibold text-2xl sm:text-3xl text-[#dfe2ef] tracking-tight mt-2">
                  Espace Administrateur
                </h1>
                <p className="font-sans text-sm text-[#c2c6d6]">
                  Veuillez saisir vos identifiants d'accès sécurisé pour initialiser votre session.
                </p>
              </div>

              {/* Login Form */}
              <form className="flex flex-col gap-4" onSubmit={handleCredentialsSubmit}>
                {/* Admin Identifier */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label
                      className="font-mono text-[13px] font-medium text-[#dfe2ef] flex items-center gap-1.5"
                      htmlFor="admin-identifier"
                    >
                      <span className="material-symbols-outlined text-[#adc6ff] text-[18px]">
                        verified_user
                      </span>
                      Identifiant administrateur
                    </label>
                    <span className="font-mono text-[11px] text-[#8c909f]">Requis</span>
                  </div>
                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined absolute left-3.5 text-[#424754] pointer-events-none text-[20px]">
                      badge
                    </span>
                    <input
                      id="admin-identifier"
                      name="identifier"
                      type="text"
                      autoComplete="username"
                      required
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="admin@enterprise.internal ou identifiant"
                      className="w-full bg-[#0a0e17] text-[#dfe2ef] font-mono text-sm pl-11 pr-4 py-3 rounded-lg outline-none border border-[#424754]/40 transition-all duration-200 placeholder:text-[#424754] focus:bg-[#181b25] focus:border-[#adc6ff] focus:ring-2 focus:ring-[#adc6ff]/20 shadow-sm"
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label
                      className="font-mono text-[13px] font-medium text-[#dfe2ef] flex items-center gap-1.5"
                      htmlFor="admin-password"
                    >
                      <span className="material-symbols-outlined text-[#adc6ff] text-[18px]">
                        lock
                      </span>
                      Mot de passe principal
                    </label>
                    <button
                      type="button"
                      onClick={onOpenPasswordReset}
                      className="text-xs text-[#adc6ff] hover:text-[#d8e2ff] transition-colors cursor-pointer"
                    >
                      Mot de passe oublié ?
                    </button>
                  </div>
                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined absolute left-3.5 text-[#424754] pointer-events-none text-[20px]">
                      key
                    </span>
                    <input
                      id="admin-password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full bg-[#0a0e17] text-[#dfe2ef] font-mono text-sm pl-11 pr-11 py-3 rounded-lg outline-none border border-[#424754]/40 transition-all duration-200 placeholder:text-[#424754] focus:bg-[#181b25] focus:border-[#adc6ff] focus:ring-2 focus:ring-[#adc6ff]/20 shadow-sm"
                    />
                    <button
                      type="button"
                      aria-label="Afficher ou masquer le mot de passe"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 p-1 text-[#8c909f] hover:text-[#dfe2ef] transition-colors rounded cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        {showPassword ? 'visibility' : 'visibility_off'}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Options Row */}
                <div className="flex items-center justify-between gap-2 pt-1 select-none">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <div className="relative flex items-center justify-center">
                      <input
                        type="checkbox"
                        id="remember-session"
                        checked={rememberSession}
                        onChange={(e) => setRememberSession(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-5 h-5 rounded bg-[#0a0e17] border border-[#424754] peer-checked:bg-[#4d8eff] peer-checked:border-[#4d8eff] peer-checked:text-[#00285d] transition-all flex items-center justify-center">
                        <span className="material-symbols-outlined text-[16px] opacity-0 peer-checked:opacity-100 font-bold transition-opacity text-white">
                          check
                        </span>
                      </div>
                    </div>
                    <span className="text-xs text-[#c2c6d6] group-hover:text-[#dfe2ef] transition-colors">
                      Mémoriser cette session sécurisée
                    </span>
                  </label>

                  <button
                    type="button"
                    onClick={onOpenSocModal}
                    className="text-xs text-[#8c909f] hover:text-[#c2c6d6] transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      contact_support
                    </span>
                    Assistance SOC
                  </button>
                </div>

                {/* Submit Button */}
                <div className="pt-2 flex flex-col gap-2">
                  <button
                    type="submit"
                    disabled={authStep === 'verifying'}
                    className={`w-full py-3 px-4 rounded-lg font-sans text-base font-medium tracking-wide flex items-center justify-center gap-2 transition-all duration-150 active:scale-[0.99] shadow-lg cursor-pointer ${
                      authStep === 'verifying'
                        ? 'bg-[#4edea3] text-[#003824] cursor-not-allowed opacity-90'
                        : 'bg-[#adc6ff] text-[#002e6a] hover:bg-[#d8e2ff]'
                    }`}
                  >
                    <span>
                      {authStep === 'verifying'
                        ? 'Vérification de sécurité...'
                        : 'Connexion à la console'}
                    </span>
                    <span
                      className={`material-symbols-outlined text-[20px] ${
                        authStep === 'verifying' ? 'animate-spin' : ''
                      }`}
                    >
                      {authStep === 'verifying' ? 'sync' : 'arrow_forward'}
                    </span>
                  </button>
                </div>
              </form>

              {/* Bottom Security Card */}
              <div className="mt-6 pt-4 bg-[#181b25]/80 rounded-lg p-4 border border-[#424754]/30 flex flex-col gap-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-[#4edea3]">
                    <span className="material-symbols-outlined text-[16px]">lock</span>
                    <span className="font-mono text-[11px] font-medium">
                      Chiffrement TLS 1.3 / E2EE actif
                    </span>
                  </div>
                  <span className="font-mono text-[11px] text-[#8c909f]">
                    Passkey FIDO2 prêt
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[#8c909f]">
                  <span className="material-symbols-outlined text-[16px] text-[#adc6ff]">
                    phonelink_lock
                  </span>
                  <span className="text-xs text-[#c2c6d6]">
                    Authentification à double facteur (MFA / TOTP) requise à l'étape suivante.
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: MFA & FIDO2 CHALLENGE */}
          {(authStep === 'mfa_challenge' || authStep === 'mfa_verifying' || authStep === 'mfa_success') && (
            <div>
              {/* Header inside card */}
              <div className="flex flex-col gap-1 mb-5">
                <div className="flex items-center justify-between gap-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#31353f] text-[#4edea3]">
                    <span className="w-2 h-2 rounded-full bg-[#4edea3] animate-pulse"></span>
                    <span className="font-mono text-[11px] tracking-wider uppercase font-medium">
                      Défi Multi-Facteur Requis
                    </span>
                  </div>
                  <div className="flex items-center gap-1 font-mono text-[11px] text-[#adc6ff] bg-[#262a34] px-2 py-0.5 rounded">
                    <span className="material-symbols-outlined text-[14px]">timer</span>
                    <span>{formatTime(sessionTimeoutSeconds)}</span>
                  </div>
                </div>

                <h1 className="font-sans font-semibold text-2xl text-[#dfe2ef] tracking-tight mt-2">
                  Validation de Sécurité Requise
                </h1>
                <p className="font-sans text-xs text-[#c2c6d6]">
                  Session initiée pour <span className="font-mono text-[#adc6ff]">{identifier}</span>. Veuillez confirmer votre identité via votre clé FIDO2 ou votre application d'authentification.
                </p>
              </div>

              {/* Segmented Switcher for MFA Method */}
              <div className="p-1 bg-[#0a0e17] rounded-lg border border-[#424754]/40 flex items-center gap-1 mb-5">
                <button
                  type="button"
                  onClick={() => setMfaMethod('fido2')}
                  className={`flex-1 py-1.5 px-3 rounded-md text-xs font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    mfaMethod === 'fido2'
                      ? 'bg-[#262a34] text-[#4edea3] shadow-sm font-semibold'
                      : 'text-[#8c909f] hover:text-[#dfe2ef]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">fingerprint</span>
                  <span>Passkey FIDO2 (YubiKey)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMfaMethod('totp')}
                  className={`flex-1 py-1.5 px-3 rounded-md text-xs font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    mfaMethod === 'totp'
                      ? 'bg-[#262a34] text-[#adc6ff] shadow-sm font-semibold'
                      : 'text-[#8c909f] hover:text-[#dfe2ef]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">phonelink_ring</span>
                  <span>Code TOTP (6 chiffres)</span>
                </button>
              </div>

              {/* FIDO2 Screen Option */}
              {mfaMethod === 'fido2' && (
                <div className="flex flex-col items-center justify-center p-6 bg-[#0a0e17]/80 rounded-lg border border-[#424754]/40 text-center gap-4">
                  {/* Radar Pulse Visual */}
                  <div className="relative w-24 h-24 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full border border-[#4edea3]/20 animate-ping"></div>
                    <div className="absolute inset-2 rounded-full border border-[#4edea3]/40"></div>
                    <div className="w-16 h-16 rounded-full bg-[#181b25] border-2 border-[#4edea3] flex items-center justify-center shadow-[0_0_24px_rgba(78,222,163,0.3)]">
                      <span className="material-symbols-outlined text-[32px] text-[#4edea3]">
                        {authStep === 'mfa_success'
                          ? 'check_circle'
                          : fidoPulsing
                          ? 'contactless'
                          : 'touch_app'}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 max-w-sm">
                    <h3 className="text-sm font-medium text-[#dfe2ef]">
                      {authStep === 'mfa_success'
                        ? 'Authentification validée'
                        : authStep === 'mfa_verifying'
                        ? 'Vérification cryptographique WebAuthn...'
                        : 'En attente de contact avec votre clé FIDO2'}
                    </h3>
                    <p className="text-xs text-[#8c909f]">
                      Insérez votre YubiKey ou touchez le capteur biométrique pour signer le défi cryptographique SHA-256.
                    </p>
                  </div>

                  <button
                    type="button"
                    disabled={authStep === 'mfa_verifying' || authStep === 'mfa_success'}
                    onClick={handleFidoTouch}
                    className="w-full py-2.5 px-4 rounded-lg bg-[#4edea3] text-[#003824] hover:bg-[#6ffbbe] font-medium text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {authStep === 'mfa_verifying' ? 'sync' : 'fingerprint'}
                    </span>
                    <span>
                      {authStep === 'mfa_verifying'
                        ? 'Signature du jeton en cours...'
                        : 'Toucher la clé de sécurité (Simuler WebAuthn)'}
                    </span>
                  </button>
                </div>
              )}

              {/* TOTP Screen Option */}
              {mfaMethod === 'totp' && (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-mono text-[#c2c6d6]">
                      Saisissez le code à 6 chiffres affiché sur votre terminal :
                    </label>
                    <button
                      type="button"
                      onClick={fillSampleTotp}
                      className="text-[11px] font-mono text-[#adc6ff] hover:underline cursor-pointer"
                    >
                      Code démo (849 201)
                    </button>
                  </div>

                  {/* 6 Digit Cells */}
                  <div className="flex items-center justify-between gap-2">
                    {totpDigits.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={(el) => {
                          totpInputRefs.current[idx] = el;
                        }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleTotpChange(idx, e.target.value)}
                        onKeyDown={(e) => handleTotpKeyDown(idx, e)}
                        className="w-12 h-12 text-center text-xl font-mono font-semibold bg-[#0a0e17] text-[#4edea3] rounded-lg border border-[#424754] focus:border-[#4edea3] focus:ring-2 focus:ring-[#4edea3]/20 outline-none transition-all shadow-inner"
                      />
                    ))}
                  </div>

                  <button
                    type="button"
                    disabled={totpDigits.some((d) => !d) || authStep === 'mfa_verifying'}
                    onClick={() => completeAuthentication('totp')}
                    className="w-full py-3 rounded-lg bg-[#adc6ff] text-[#002e6a] hover:bg-[#d8e2ff] font-sans font-medium text-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-2 shadow-lg"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {authStep === 'mfa_verifying' ? 'sync' : 'verified'}
                    </span>
                    <span>
                      {authStep === 'mfa_verifying'
                        ? 'Validation du code TOTP...'
                        : 'Valider et ouvrir la console'}
                    </span>
                  </button>
                </div>
              )}

              {/* Recovery Code Option */}
              {mfaMethod === 'recovery_code' && (
                <div className="flex flex-col gap-3">
                  <label className="text-xs text-[#c2c6d6]">
                    Code de secours d'urgence à usage unique (Format : REC-XXXX-XXXX) :
                  </label>
                  <input
                    type="text"
                    value={recoveryCode}
                    onChange={(e) => setRecoveryCode(e.target.value)}
                    placeholder="REC-9482-A72B"
                    className="w-full bg-[#0a0e17] text-[#dfe2ef] font-mono text-sm px-4 py-2.5 rounded-lg border border-[#424754] focus:border-[#adc6ff] outline-none"
                  />
                  <button
                    type="button"
                    disabled={!recoveryCode.trim()}
                    onClick={() => completeAuthentication('recovery')}
                    className="w-full py-2.5 rounded-lg bg-[#3131c0] text-white hover:bg-[#4d8eff] text-sm font-medium transition-colors cursor-pointer"
                  >
                    Utiliser ce code de secours
                  </button>
                </div>
              )}

              {/* Navigation Back & Alternatives */}
              <div className="mt-4 pt-3 border-t border-[#424754]/30 flex items-center justify-between text-xs text-[#8c909f]">
                <button
                  type="button"
                  onClick={() => setAuthStep('credentials')}
                  className="flex items-center gap-1 hover:text-[#dfe2ef] transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[14px]">arrow_back</span>
                  <span>Changer d'identifiant</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMfaMethod(mfaMethod === 'recovery_code' ? 'fido2' : 'recovery_code')}
                  className="hover:text-[#adc6ff] transition-colors cursor-pointer"
                >
                  {mfaMethod === 'recovery_code' ? 'Retour aux méthodes standard' : 'Code de secours'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
