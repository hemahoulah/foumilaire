import React, { useState } from 'react';
import { EcommerceDashboard } from './components/EcommerceDashboard';

type Screen = 'connexion' | 'ecommerce-dashboard' | 'sante-reseau' | 'politique-acces';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('connexion');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordValue, setPasswordValue] = useState('••••••••••••');
  const [identifierValue, setIdentifierValue] = useState('admin@enterprise.internal');
  const [isVerifying, setIsVerifying] = useState(false);
  const [buttonLabel, setButtonLabel] = useState('Connexion à la console');
  const [buttonIcon, setButtonIcon] = useState('arrow_forward');
  const [activeModal, setActiveModal] = useState<'forgot' | 'soc' | null>(null);

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  // Login handler: logs in and redirects to the E-commerce Dashboard
  const handleLoginSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setIsVerifying(true);
    setButtonLabel('Vérification des accès marchands...');
    setButtonIcon('sync');

    setTimeout(() => {
      setIsVerifying(false);
      setIsAuthenticated(true);
      setCurrentScreen('ecommerce-dashboard');
      setButtonLabel('Connexion à la console');
      setButtonIcon('arrow_forward');
    }, 900);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentScreen('connexion');
  };

  return (
    <div className="bg-background font-body-md text-on-surface antialiased min-h-screen flex flex-col justify-between selection:bg-primary selection:text-on-primary relative overflow-x-hidden">
      {/* Background radial gradient subtle for light theme */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(37,99,235,0.06),rgba(248,250,252,0))]"></div>

      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-surface/90 backdrop-blur-xl border-b border-outline-variant/60 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
        <div className="h-16 w-full max-w-7xl mx-auto px-gutter-sm lg:px-gutter flex items-center justify-between">
          <div 
            onClick={() => setCurrentScreen(isAuthenticated ? 'ecommerce-dashboard' : 'connexion')}
            className="flex items-center gap-space-md cursor-pointer select-none"
          >
            <img
              alt="Admin Security Logo"
              className="h-8 w-auto object-contain"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAoUUioooVtYv7pbU8vY37suZJdWb5hdxOS6BsGNplzofPakrY4YQhEQpWyNDeQwqCajw3OFuATKtk8X8D1r_QjBDY0WM6xIRgaRLcjrhlGFx0-qaudK_MZPTR2OaCMsOFCy00Z2hRBJ7fLP8any31e6ELNsOlUeS1wRlgtw4MkXPSrTwdYnj9dVIQye7f5bZlDpSqwVzSnCxT75HgmdXvihF5AUN8Kq_J7g_-y392eBcJi18GwHUHm"
            />
            <div className="flex flex-col">
              <span className="font-headline-md text-headline-md text-on-surface tracking-tight leading-none">
                AegisGate
              </span>
              <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider mt-space-xs font-semibold">
                {isAuthenticated ? 'Portail E-Commerce & PAM' : 'Privileged Access Gateway'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-space-lg">
            <div className="hidden sm:flex items-center gap-space-xs px-space-sm py-1 rounded bg-surface-container-high border border-outline-variant/60">
              <span className="material-symbols-outlined text-tertiary text-[14px]">
                verified_user
              </span>
              <span className="font-label-sm text-label-sm text-tertiary uppercase tracking-wider font-semibold">
                {isAuthenticated ? 'Session Marchande Active' : 'TLS 1.3 / AES-256-GCM Active'}
              </span>
            </div>

            <nav className="flex items-center gap-space-md">
              {isAuthenticated ? (
                <button
                  type="button"
                  onClick={() => setCurrentScreen('ecommerce-dashboard')}
                  className={`transition-colors cursor-pointer text-sm ${
                    currentScreen === 'ecommerce-dashboard'
                      ? 'text-primary font-bold border-b-2 border-primary pb-0.5'
                      : 'font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  Dashboard E-Commerce
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setCurrentScreen('connexion')}
                  className={`transition-colors cursor-pointer text-sm ${
                    currentScreen === 'connexion'
                      ? 'text-primary font-bold border-b-2 border-primary pb-0.5'
                      : 'font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  Connexion
                </button>
              )}

              <button
                type="button"
                onClick={() => setCurrentScreen('sante-reseau')}
                className={`transition-colors cursor-pointer text-sm ${
                  currentScreen === 'sante-reseau'
                    ? 'text-primary font-bold border-b-2 border-primary pb-0.5'
                    : 'font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Santé Réseau
              </button>
              <button
                type="button"
                onClick={() => setCurrentScreen('politique-acces')}
                className={`transition-colors cursor-pointer text-sm ${
                  currentScreen === 'politique-acces'
                    ? 'text-primary font-bold border-b-2 border-primary pb-0.5'
                    : 'font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Politique d'Accès
              </button>
            </nav>

            <div className="flex items-center gap-space-sm pl-space-sm">
              <button
                type="button"
                onClick={() => {
                  if (isAuthenticated) {
                    handleLogout();
                  } else {
                    setCurrentScreen('connexion');
                  }
                }}
                title={isAuthenticated ? 'Cliquer pour vous déconnecter' : 'Connexion'}
                className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white shadow-sm cursor-pointer hover:bg-primary-fixed"
              >
                <span className="material-symbols-outlined text-on-primary text-[18px]">
                  {isAuthenticated ? 'storefront' : 'person'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 w-full pt-16 flex-1 flex flex-col justify-center">
        {/* SCREEN 1: CONNEXION */}
        {currentScreen === 'connexion' && (
          <div className="flex flex-col w-full items-center justify-center p-gutter-sm sm:p-gutter my-auto">
            <div className="relative w-full max-w-xl">
              {/* Soft Ambient Light Glows */}
              <div className="absolute -top-16 -left-16 w-64 h-64 bg-primary/8 rounded-full blur-3xl pointer-events-none"></div>
              <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-secondary/8 rounded-full blur-3xl pointer-events-none"></div>

              {/* White Card Chassis */}
              <div className="relative bg-surface rounded-xl shadow-xl shadow-slate-200/70 border border-outline-variant/60 p-space-md sm:p-space-xl overflow-hidden">
                <div className="h-1 -mt-space-md sm:-mt-space-xl -mx-space-md sm:-mx-space-xl mb-space-lg bg-gradient-to-r from-primary via-secondary to-tertiary"></div>

                <div className="flex flex-col gap-space-xs mb-space-lg">
                  <div className="flex items-center justify-between gap-space-sm flex-wrap">
                    <div className="inline-flex items-center gap-space-xs px-space-sm py-1 rounded-full bg-tertiary-container/60 text-on-tertiary-container border border-tertiary/20">
                      <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
                      <span className="font-label-sm text-label-sm tracking-wider uppercase font-semibold">
                        Accès restreint aux administrateurs
                      </span>
                    </div>
                    <span className="font-label-sm text-label-sm text-outline font-mono font-medium">
                      SOC-NODE #4092
                    </span>
                  </div>
                  <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight mt-space-xs">
                    Espace Administrateur
                  </h1>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    Veuillez saisir vos identifiants d'accès sécurisé pour accéder au dashboard e-commerce.
                  </p>
                </div>

                <form className="flex flex-col gap-space-md" id="admin-login-form" onSubmit={handleLoginSubmit}>
                  {/* Identifiant */}
                  <div className="flex flex-col gap-space-xs">
                    <div className="flex items-center justify-between">
                      <label className="font-label-md text-label-md text-on-surface flex items-center gap-space-xs font-semibold" htmlFor="admin-identifier">
                        <span className="material-symbols-outlined text-primary text-[18px]">verified_user</span>
                        Identifiant administrateur
                      </label>
                      <span className="font-label-sm text-label-sm text-outline">Requis</span>
                    </div>
                    <div className="relative flex items-center">
                      <span className="material-symbols-outlined absolute left-space-md text-outline pointer-events-none text-[20px]">
                        badge
                      </span>
                      <input
                        autoComplete="username"
                        className="w-full bg-surface-container-lowest text-on-surface font-label-md text-label-md pl-11 pr-space-md py-3 rounded-lg outline-none border border-outline-variant transition-all duration-200 placeholder:text-outline/70 focus:border-primary focus:ring-2 focus:ring-primary/15 shadow-sm"
                        id="admin-identifier"
                        name="identifier"
                        placeholder="admin@enterprise.internal ou identifiant"
                        required
                        type="text"
                        value={identifierValue}
                        onChange={(e) => setIdentifierValue(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Mot de passe */}
                  <div className="flex flex-col gap-space-xs">
                    <div className="flex items-center justify-between">
                      <label className="font-label-md text-label-md text-on-surface flex items-center gap-space-xs font-semibold" htmlFor="admin-password">
                        <span className="material-symbols-outlined text-primary text-[18px]">lock</span>
                        Mot de passe principal
                      </label>
                      <button
                        type="button"
                        onClick={() => setActiveModal('forgot')}
                        className="font-body-sm text-body-sm text-primary hover:text-primary-fixed font-medium transition-colors cursor-pointer"
                      >
                        Mot de passe oublié ?
                      </button>
                    </div>
                    <div className="relative flex items-center">
                      <span className="material-symbols-outlined absolute left-space-md text-outline pointer-events-none text-[20px]">
                        key
                      </span>
                      <input
                        autoComplete="current-password"
                        className="w-full bg-surface-container-lowest text-on-surface font-label-md text-label-md pl-11 pr-11 py-3 rounded-lg outline-none border border-outline-variant transition-all duration-200 placeholder:text-outline/70 focus:border-primary focus:ring-2 focus:ring-primary/15 shadow-sm"
                        id="admin-password"
                        name="password"
                        placeholder="••••••••••••"
                        required
                        type={showPassword ? 'text' : 'password'}
                        value={passwordValue}
                        onChange={(e) => setPasswordValue(e.target.value)}
                      />
                      <button
                        aria-label="Afficher ou masquer le mot de passe"
                        className="absolute right-2 p-space-xs text-outline hover:text-on-surface transition-colors rounded cursor-pointer"
                        id="toggle-password-btn"
                        onClick={togglePasswordVisibility}
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[20px]" id="password-toggle-icon">
                          {showPassword ? 'visibility' : 'visibility_off'}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Options */}
                  <div className="flex items-center justify-between gap-space-sm pt-space-xs select-none">
                    <label className="flex items-center gap-space-sm cursor-pointer group">
                      <div className="relative flex items-center justify-center">
                        <input className="sr-only peer" defaultChecked id="remember-session" type="checkbox" />
                        <div className="w-5 h-5 rounded bg-surface-container-lowest border border-outline-variant peer-checked:bg-primary peer-checked:border-primary peer-checked:text-white transition-all flex items-center justify-center shadow-sm">
                          <span className="material-symbols-outlined text-[16px] opacity-0 peer-checked:opacity-100 font-bold transition-opacity text-white">
                            check
                          </span>
                        </div>
                      </div>
                      <span className="font-body-sm text-body-sm text-on-surface-variant group-hover:text-on-surface transition-colors">
                        Mémoriser cette session sécurisée
                      </span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setActiveModal('soc')}
                      className="font-body-sm text-body-sm text-outline hover:text-on-surface transition-colors flex items-center gap-1 cursor-pointer font-medium"
                    >
                      <span className="material-symbols-outlined text-[16px]">contact_support</span>
                      Assistance SOC
                    </button>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-space-sm flex flex-col gap-space-sm">
                    <button
                      className={`w-full py-3 px-space-md rounded-lg font-headline-md text-headline-md font-medium tracking-wide flex items-center justify-center gap-space-sm transition-all duration-150 active:scale-[0.99] shadow-md cursor-pointer ${
                        isVerifying
                          ? 'bg-primary text-on-primary opacity-80 cursor-not-allowed'
                          : 'bg-primary text-on-primary hover:bg-primary-fixed shadow-blue-500/25'
                      }`}
                      id="submit-button"
                      disabled={isVerifying}
                      type="submit"
                    >
                      <span id="button-label">{buttonLabel}</span>
                      <span
                        className={`material-symbols-outlined text-[20px] ${
                          isVerifying ? 'animate-spin' : ''
                        }`}
                        id="button-icon"
                      >
                        {buttonIcon}
                      </span>
                    </button>
                  </div>
                </form>

                {/* Bottom Security Info */}
                <div className="mt-space-lg pt-space-md bg-surface-container-low border border-outline-variant/60 rounded-lg p-space-md flex flex-col gap-space-xs">
                  <div className="flex items-center justify-between gap-space-xs">
                    <div className="flex items-center gap-space-xs text-tertiary font-semibold">
                      <span className="material-symbols-outlined text-[16px]">lock</span>
                      <span className="font-label-sm text-label-sm font-mono">Chiffrement TLS 1.3 / E2EE actif</span>
                    </div>
                    <span className="font-label-sm text-label-sm text-outline font-medium">Accès Marchand Sécurisé</span>
                  </div>
                  <div className="flex items-center gap-space-xs text-outline">
                    <span className="material-symbols-outlined text-[16px] text-primary">storefront</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      La validation des identifiants ouvre directement la console de gestion e-commerce.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SCREEN 2: E-COMMERCE DASHBOARD (AUTHENTICATED) */}
        {currentScreen === 'ecommerce-dashboard' && (
          <EcommerceDashboard onLogout={handleLogout} />
        )}

        {/* SCREEN 3: SANTÉ RÉSEAU */}
        {currentScreen === 'sante-reseau' && (
          <div className="flex flex-col w-full max-w-7xl mx-auto px-gutter-sm lg:px-gutter py-space-lg gap-space-md">
            <div className="relative bg-surface rounded-xl shadow-xl shadow-slate-200/70 border border-outline-variant/60 p-space-md sm:p-space-lg overflow-hidden">
              <div className="h-1 -mt-space-md sm:-mt-space-lg -mx-space-md sm:-mx-space-lg mb-space-md bg-gradient-to-r from-primary via-secondary to-tertiary"></div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm mb-space-md">
                <div className="flex flex-col gap-space-xs">
                  <div className="inline-flex items-center gap-space-xs px-space-sm py-1 rounded-full bg-tertiary-container/60 text-on-tertiary-container border border-tertiary/20 w-fit">
                    <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
                    <span className="font-label-sm text-label-sm tracking-wider uppercase font-semibold">Télémétrie & Nœuds Actifs</span>
                  </div>
                  <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight">
                    Santé du Réseau AegisGate
                  </h1>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    Statut en temps réel des passerelles cryptographiques et de l'hébergement e-commerce.
                  </p>
                </div>

                <div className="flex items-center gap-space-sm font-label-sm text-label-sm text-tertiary font-semibold bg-tertiary-container/40 border border-tertiary/30 px-space-md py-2 rounded-lg">
                  <span className="material-symbols-outlined text-[18px]">wifi_tethering</span>
                  <span>4 Nœuds Opérationnels (SLA 99.99%)</span>
                </div>
              </div>

              {/* Grid of Nodes */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-md">
                <div className="bg-surface-container-low border border-outline-variant/70 rounded-lg p-space-md flex flex-col justify-between gap-space-md shadow-sm">
                  <div className="flex flex-col gap-space-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-label-md text-label-md font-bold text-on-surface">SOC-NODE #4092</span>
                      <span className="text-[10px] font-label-sm font-semibold px-2 py-0.5 rounded bg-tertiary-container text-on-tertiary-container">PRIMAIRE</span>
                    </div>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">Paris, France</span>
                    <span className="font-label-sm text-label-sm text-outline">TLS 1.3 / AES-256-GCM</span>
                  </div>
                  <div className="pt-space-sm border-t border-outline-variant/40 flex items-center justify-between text-xs font-mono">
                    <span className="text-outline">Latence :</span>
                    <span className="text-tertiary font-bold">1.2 ms</span>
                  </div>
                </div>

                <div className="bg-surface-container-low border border-outline-variant/70 rounded-lg p-space-md flex flex-col justify-between gap-space-md shadow-sm">
                  <div className="flex flex-col gap-space-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-label-md text-label-md font-bold text-on-surface">SOC-NODE #1044</span>
                      <span className="text-[10px] font-label-sm font-semibold px-2 py-0.5 rounded bg-primary-container text-on-primary-container">FAILOVER</span>
                    </div>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">Francfort, Allemagne</span>
                    <span className="font-label-sm text-label-sm text-outline">CHACHA20-POLY1305</span>
                  </div>
                  <div className="pt-space-sm border-t border-outline-variant/40 flex items-center justify-between text-xs font-mono">
                    <span className="text-outline">Latence :</span>
                    <span className="text-tertiary font-bold">3.8 ms</span>
                  </div>
                </div>

                <div className="bg-surface-container-low border border-outline-variant/70 rounded-lg p-space-md flex flex-col justify-between gap-space-md shadow-sm">
                  <div className="flex flex-col gap-space-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-label-md text-label-md font-bold text-on-surface">SOC-NODE #8821</span>
                      <span className="text-[10px] font-label-sm font-semibold px-2 py-0.5 rounded bg-secondary-container text-on-secondary-container">HSM ENCLAVE</span>
                    </div>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">Zurich, Suisse</span>
                    <span className="font-label-sm text-label-sm text-outline">mTLS 1.3 FIPS 140-3</span>
                  </div>
                  <div className="pt-space-sm border-t border-outline-variant/40 flex items-center justify-between text-xs font-mono">
                    <span className="text-outline">Latence :</span>
                    <span className="text-tertiary font-bold">5.4 ms</span>
                  </div>
                </div>

                <div className="bg-surface-container-low border border-outline-variant/70 rounded-lg p-space-md flex flex-col justify-between gap-space-md shadow-sm">
                  <div className="flex flex-col gap-space-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-label-md text-label-md font-bold text-on-surface">SOC-NODE #0933</span>
                      <span className="text-[10px] font-label-sm font-semibold px-2 py-0.5 rounded bg-surface-container-highest text-outline">EDGE PROXY</span>
                    </div>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">Londres, Royaume-Uni</span>
                    <span className="font-label-sm text-label-sm text-outline">AES-128-GCM Anti-DDoS</span>
                  </div>
                  <div className="pt-space-sm border-t border-outline-variant/40 flex items-center justify-between text-xs font-mono">
                    <span className="text-outline">Latence :</span>
                    <span className="text-tertiary font-bold">2.9 ms</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SCREEN 4: POLITIQUE D'ACCÈS */}
        {currentScreen === 'politique-acces' && (
          <div className="flex flex-col w-full max-w-7xl mx-auto px-gutter-sm lg:px-gutter py-space-lg gap-space-md">
            <div className="relative bg-surface rounded-xl shadow-xl shadow-slate-200/70 border border-outline-variant/60 p-space-md sm:p-space-lg overflow-hidden">
              <div className="h-1 -mt-space-md sm:-mt-space-lg -mx-space-md sm:-mx-space-lg mb-space-md bg-gradient-to-r from-primary via-secondary to-tertiary"></div>

              <div className="flex flex-col gap-space-xs mb-space-md">
                <div className="inline-flex items-center gap-space-xs px-space-sm py-1 rounded-full bg-tertiary-container/60 text-on-tertiary-container border border-tertiary/20 w-fit">
                  <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
                  <span className="font-label-sm text-label-sm tracking-wider uppercase font-semibold">Gouvernance PAM</span>
                </div>
                <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight">
                  Politique d'Accès & Contrôle Zero Trust
                </h1>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Matrice des autorisations de la boutique, règles de conformité ISO/IEC 27001 et RGPD Article 32.
                </p>
              </div>

              {/* Table of Policies */}
              <div className="overflow-x-auto bg-surface-container-low rounded-lg border border-outline-variant/60 p-space-sm">
                <table className="w-full text-left font-label-md text-label-md">
                  <thead>
                    <tr className="border-b border-outline-variant/50 text-outline">
                      <th className="p-3 font-semibold">Règle</th>
                      <th className="p-3 font-semibold">Rôle PAM</th>
                      <th className="p-3 font-semibold">Ressources Cibles</th>
                      <th className="p-3 font-semibold">MFA FIDO2</th>
                      <th className="p-3 font-semibold">Durée Max</th>
                      <th className="p-3 font-semibold">Audit Vidéo</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/30 text-on-surface">
                    <tr className="hover:bg-white transition-colors">
                      <td className="p-3 text-primary font-bold">POL-01</td>
                      <td className="p-3 font-medium">Administrateur Marchand</td>
                      <td className="p-3 text-on-surface-variant">Catalogue, Commandes, Remboursements Stripe</td>
                      <td className="p-3 text-tertiary font-semibold">Obligatoire</td>
                      <td className="p-3 font-mono">120 min</td>
                      <td className="p-3 text-tertiary font-semibold">Actif</td>
                    </tr>
                    <tr className="hover:bg-white transition-colors">
                      <td className="p-3 text-primary font-bold">POL-02</td>
                      <td className="p-3 font-medium">Opérateur Logistique</td>
                      <td className="p-3 text-on-surface-variant">Bordereaux d'expédition, Niveaux de Stock</td>
                      <td className="p-3 text-tertiary font-semibold">Standard</td>
                      <td className="p-3 font-mono">480 min</td>
                      <td className="p-3 text-outline">Désactivé</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modal: Mot de passe oublié */}
      {activeModal === 'forgot' && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-gutter-sm">
          <div className="bg-surface border border-outline-variant rounded-xl p-space-lg max-w-md w-full shadow-2xl flex flex-col gap-space-md">
            <div className="flex items-center justify-between border-b border-outline-variant/40 pb-space-xs">
              <span className="font-headline-md text-headline-md text-on-surface">Réinitialisation d'Accès</span>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="text-outline hover:text-on-surface cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Conformément à la politique de sécurité, la réinitialisation nécessite votre clé physique ou l'approbation d'un tiers de confiance SOC.
            </p>
            <div className="flex flex-col gap-space-xs">
              <label className="font-label-sm text-label-sm text-on-surface font-semibold" htmlFor="reset-id">Identifiant administrateur</label>
              <input
                id="reset-id"
                defaultValue="admin@enterprise.internal"
                className="bg-surface-container-low text-on-surface font-label-md text-label-md p-space-sm rounded border border-outline-variant outline-none focus:border-primary"
              />
            </div>
            <div className="flex justify-end gap-space-sm pt-space-xs">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-space-md py-2 rounded bg-surface-container-high text-on-surface cursor-pointer hover:bg-surface-container-highest"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-space-md py-2 rounded bg-primary text-on-primary font-medium cursor-pointer hover:bg-primary-fixed shadow-sm"
              >
                Valider
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Assistance SOC */}
      {activeModal === 'soc' && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-gutter-sm">
          <div className="bg-surface border border-outline-variant rounded-xl p-space-lg max-w-md w-full shadow-2xl flex flex-col gap-space-md">
            <div className="flex items-center justify-between border-b border-outline-variant/40 pb-space-xs">
              <span className="font-headline-md text-headline-md text-on-surface flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-tertiary">contact_support</span>
                Assistance SOC 24/7
              </span>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="text-outline hover:text-on-surface cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-space-md rounded bg-surface-container-low border border-outline-variant/50 font-mono text-xs flex flex-col gap-space-xs">
              <span className="text-primary font-bold">Ligne d'Urgence Sécurité (24/7)</span>
              <span className="text-on-surface text-sm font-semibold">+33 (0)1 40 92 00 24</span>
              <span className="text-outline">Email PGP : soc@enterprise.internal</span>
            </div>
            <div className="flex justify-end gap-space-sm pt-space-xs">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-space-md py-2 rounded bg-primary text-on-primary font-medium cursor-pointer hover:bg-primary-fixed shadow-sm"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="relative z-10 w-full bg-surface/90 border-t border-outline-variant/60 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-gutter-sm lg:px-gutter py-space-md flex flex-col sm:flex-row items-center justify-between gap-space-sm">
          <div className="flex items-center gap-space-sm text-outline font-label-sm text-label-sm">
            <span className="material-symbols-outlined text-[14px] text-tertiary font-bold">shield_lock</span>
            <span className="font-medium">Architecture Zero Trust certifiée ISO/IEC 27001</span>
          </div>
          <div className="flex items-center gap-space-md font-body-sm text-body-sm text-on-surface-variant">
            <button
              type="button"
              onClick={() => setCurrentScreen('politique-acces')}
              className="hover:text-on-surface transition-colors cursor-pointer text-xs"
            >
              Conformité RGPD
            </button>
            <button
              type="button"
              onClick={() => setActiveModal('soc')}
              className="hover:text-on-surface transition-colors cursor-pointer text-xs"
            >
              Support SOC 24/7
            </button>
            <span className="font-label-sm text-label-sm text-outline font-mono">v4.19.2-sec</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
