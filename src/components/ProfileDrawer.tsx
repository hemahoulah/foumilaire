import React from 'react';
import { AdminUser } from '../types';

interface ProfileDrawerProps {
  currentUser: AdminUser | null;
  onClose: () => void;
  onLogout: () => void;
  onQuickLogin: (role: 'admin' | 'soc') => void;
}

export const ProfileDrawer: React.FC<ProfileDrawerProps> = ({
  currentUser,
  onClose,
  onLogout,
  onQuickLogin,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end">
      <div className="bg-[#1c1f29] border-l border-[#424754] w-full max-w-sm h-full p-6 shadow-2xl flex flex-col justify-between overflow-y-auto">
        <div className="flex flex-col gap-5">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#424754]/40 pb-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#adc6ff] text-[22px]">
                badge
              </span>
              <h3 className="text-base font-semibold text-[#dfe2ef]">
                Session & Identité PAM
              </h3>
            </div>
            <button
              onClick={onClose}
              className="text-[#8c909f] hover:text-[#dfe2ef] cursor-pointer"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          {currentUser ? (
            <div className="flex flex-col gap-4 text-xs font-mono">
              <div className="p-4 rounded-xl bg-[#0a0e17] border border-[#4edea3]/30 flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#4edea3] text-[#003824] flex items-center justify-center font-bold text-sm">
                    {currentUser.displayName.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex flex-col font-sans">
                    <span className="font-semibold text-sm text-[#dfe2ef]">
                      {currentUser.displayName}
                    </span>
                    <span className="text-xs text-[#8c909f]">
                      {currentUser.email}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#424754]/30 flex items-center justify-between">
                  <span className="text-[#8c909f]">Rôle Privilégié :</span>
                  <span className="text-[#4edea3] font-semibold">{currentUser.role}</span>
                </div>
              </div>

              {/* Cryptographic Session details */}
              <div className="p-3.5 rounded-lg bg-[#181b25] border border-[#424754]/40 flex flex-col gap-2.5 text-[11px]">
                <span className="text-[#adc6ff] font-semibold">Attributs de Sécurité Active :</span>
                <div className="flex justify-between">
                  <span className="text-[#8c909f]">Adresse IP client :</span>
                  <span className="text-[#dfe2ef]">{currentUser.ipAddress} (Interne)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8c909f]">Jeton FIDO2 :</span>
                  <span className="text-[#4edea3]">{currentUser.fidoTokenName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8c909f]">Chiffrement :</span>
                  <span className="text-[#dfe2ef]">TLS 1.3 / AES-256-GCM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8c909f]">Nœud passerelle :</span>
                  <span className="text-[#dfe2ef]">SOC-NODE #4092</span>
                </div>
                <div className="flex flex-col gap-0.5 pt-1 border-t border-[#424754]/30">
                  <span className="text-[#8c909f]">Empreinte cryptographique :</span>
                  <span className="text-[#8c909f] break-all">{currentUser.tokenFingerprint}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                className="w-full py-2.5 rounded-lg bg-[#93000a]/20 border border-[#ffb4ab]/40 text-[#ffb4ab] hover:bg-[#93000a]/40 font-medium transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[16px]">logout</span>
                <span>Fermer la session sécurisée</span>
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4 text-xs font-mono">
              <div className="p-4 rounded-xl bg-[#0a0e17] border border-[#424754]/40 text-center flex flex-col items-center gap-2">
                <span className="material-symbols-outlined text-[36px] text-[#8c909f]">
                  no_accounts
                </span>
                <span className="font-sans font-medium text-sm text-[#dfe2ef]">
                  Aucune session active
                </span>
                <p className="text-[#8c909f] text-[11px] font-sans">
                  Connectez-vous via l'écran Espace Administrateur avec authentification FIDO2 pour accéder aux privilèges PAM.
                </p>
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <span className="text-xs text-[#8c909f] font-sans">Connexion rapide démo :</span>
                <button
                  onClick={() => {
                    onQuickLogin('admin');
                    onClose();
                  }}
                  className="w-full py-2 px-3 rounded-lg bg-[#262a34] text-[#adc6ff] hover:bg-[#31353f] transition-colors cursor-pointer flex items-center justify-between"
                >
                  <span>Super Admin (Directeur SSI)</span>
                  <span className="material-symbols-outlined text-[16px]">login</span>
                </button>
                <button
                  onClick={() => {
                    onQuickLogin('soc');
                    onClose();
                  }}
                  className="w-full py-2 px-3 rounded-lg bg-[#262a34] text-[#4edea3] hover:bg-[#31353f] transition-colors cursor-pointer flex items-center justify-between"
                >
                  <span>Analyste SOC Niveau 3</span>
                  <span className="material-symbols-outlined text-[16px]">login</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="pt-4 border-t border-[#424754]/30 text-[11px] text-[#8c909f] font-mono flex flex-col gap-1">
          <div>AegisGate Gateway v4.19.2-sec</div>
          <div>Certification ISO/IEC 27001 & RGPD</div>
        </div>
      </div>
    </div>
  );
};
