import React from 'react';
import { ActiveTab, AdminUser } from '../types';

interface HeaderProps {
  currentTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  currentUser: AdminUser | null;
  onOpenProfile: () => void;
  onOpenSocModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  currentUser,
  onOpenProfile,
}) => {
  const logoUrl =
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAoUUioooVtYv7pbU8vY37suZJdWb5hdxOS6BsGNplzofPakrY4YQhEQpWyNDeQwqCajw3OFuATKtk8X8D1r_QjBDY0WM6xIRgaRLcjrhlGFx0-qaudK_MZPTR2OaCMsOFCy00Z2hRBJ7fLP8any31e6ELNsOlUeS1wRlgtw4MkXPSrTwdYnj9dVIQye7f5bZlDpSqwVzSnCxT75HgmdXvihF5AUN8Kq_J7g_-y392eBcJi18GwHUHm';

  return (
    <header className="fixed top-0 w-full z-50 bg-[#0f131c]/90 backdrop-blur-xl border-b border-[#424754]/30 shadow-[0_1px_8px_rgba(0,0,0,0.4)]">
      <div className="h-16 w-full max-w-7xl mx-auto px-4 lg:px-6 flex items-center justify-between">
        {/* Brand Zone */}
        <div 
          onClick={() => onSelectTab(currentUser ? 'console' : 'connexion')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="relative flex items-center justify-center">
            <img
              alt="AegisGate Security Logo"
              className="h-8 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
              src={logoUrl}
              referrerPolicy="no-referrer"
              onError={(e) => {
                // Fallback SVG if remote image fails
                (e.target as HTMLElement).style.display = 'none';
                const parent = (e.target as HTMLElement).parentElement;
                if (parent && !parent.querySelector('.svg-fallback')) {
                  const svg = document.createElement('div');
                  svg.className = 'svg-fallback w-8 h-8 rounded bg-[#1c1f29] border border-[#adc6ff]/30 flex items-center justify-center text-[#adc6ff]';
                  svg.innerHTML = '<span class="material-symbols-outlined text-[20px]">shield_lock</span>';
                  parent.appendChild(svg);
                }
              }}
            />
          </div>
          <div className="flex flex-col">
            <span className="font-sans font-semibold text-lg text-[#dfe2ef] tracking-tight leading-none group-hover:text-white transition-colors">
              AegisGate
            </span>
            <span className="font-mono text-[10px] text-[#8c909f] uppercase tracking-wider mt-0.5">
              Privileged Access Gateway
            </span>
          </div>
        </div>

        {/* Action & Nav Zone */}
        <div className="flex items-center gap-4 sm:gap-6">
          {/* Security Badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#262a34]/80 border border-[#424754]/40">
            <span className="material-symbols-outlined text-[#4edea3] text-[15px]">
              verified_user
            </span>
            <span className="font-mono text-[11px] font-medium text-[#4edea3] uppercase tracking-wider">
              TLS 1.3 / AES-256-GCM Active
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center gap-3 sm:gap-5 text-sm">
            <button
              onClick={() => onSelectTab(currentUser ? 'console' : 'connexion')}
              className={`transition-colors whitespace-nowrap cursor-pointer text-sm font-medium ${
                currentTab === 'connexion' || currentTab === 'console'
                  ? 'text-[#adc6ff] font-semibold border-b-2 border-[#adc6ff] pb-0.5'
                  : 'text-[#c2c6d6] hover:text-[#dfe2ef]'
              }`}
            >
              {currentUser ? 'Console PAM' : 'Connexion'}
            </button>
            <button
              onClick={() => onSelectTab('sante-reseau')}
              className={`transition-colors whitespace-nowrap cursor-pointer text-sm font-medium ${
                currentTab === 'sante-reseau'
                  ? 'text-[#adc6ff] font-semibold border-b-2 border-[#adc6ff] pb-0.5'
                  : 'text-[#c2c6d6] hover:text-[#dfe2ef]'
              }`}
            >
              Santé Réseau
            </button>
            <button
              onClick={() => onSelectTab('politique-acces')}
              className={`transition-colors whitespace-nowrap cursor-pointer text-sm font-medium ${
                currentTab === 'politique-acces'
                  ? 'text-[#adc6ff] font-semibold border-b-2 border-[#adc6ff] pb-0.5'
                  : 'text-[#c2c6d6] hover:text-[#dfe2ef]'
              }`}
            >
              Politique d'Accès
            </button>
          </nav>

          {/* User Profile Button */}
          <div className="flex items-center gap-2 pl-2 border-l border-[#424754]/40">
            <button
              onClick={onOpenProfile}
              aria-label="Profil administrateur et session"
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                currentUser
                  ? 'bg-[#4edea3] text-[#003824] ring-2 ring-[#4edea3]/40 hover:ring-[#4edea3]/80'
                  : 'bg-[#adc6ff] text-[#002e6a] hover:bg-[#d8e2ff]'
              }`}
              title={currentUser ? `Connecté : ${currentUser.identifier}` : 'Non connecté'}
            >
              <span className="material-symbols-outlined text-[18px]">
                {currentUser ? 'admin_panel_settings' : 'person'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
