import React, { useState } from 'react';

interface PasswordResetModalProps {
  onClose: () => void;
}

export const PasswordResetModal: React.FC<PasswordResetModalProps> = ({ onClose }) => {
  const [identifier, setIdentifier] = useState('admin@enterprise.internal');
  const [tokenSerial, setTokenSerial] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#1c1f29] border border-[#424754] rounded-xl max-w-md w-full p-6 shadow-2xl flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-[#424754]/40 pb-3">
          <div className="flex items-center gap-2 text-[#adc6ff]">
            <span className="material-symbols-outlined text-[20px]">lock_reset</span>
            <h3 className="text-base font-semibold text-[#dfe2ef]">
              Récupération Sécurisée d'Accès
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#8c909f] hover:text-[#dfe2ef] cursor-pointer"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {isSubmitted ? (
          <div className="p-6 text-center flex flex-col items-center gap-3">
            <span className="material-symbols-outlined text-[48px] text-[#4edea3]">
              verified
            </span>
            <h4 className="text-base font-semibold text-[#dfe2ef]">
              Demande de Réinitialisation Transmise
            </h4>
            <p className="text-xs text-[#c2c6d6]">
              Un jeton à usage unique chiffré par clé PGP a été envoyé au contact d'urgence désigné de votre entité. Contactez l'administrateur de garde pour validation physique.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3.5 text-xs">
            <p className="text-xs text-[#c2c6d6]">
              Conformément à la politique Zero Trust, la réinitialisation d'un mot de passe principal requiert la possession physique de votre clé de secours ou la confirmation par un tiers de confiance SOC.
            </p>

            <div className="flex flex-col gap-1">
              <label className="text-[#8c909f] font-mono">Identifiant administrateur :</label>
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="bg-[#0a0e17] border border-[#424754] text-[#dfe2ef] font-mono px-3 py-2 rounded-lg outline-none focus:border-[#adc6ff]"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[#8c909f] font-mono">Numéro de série de la YubiKey / Jeton matériel :</label>
              <input
                type="text"
                required
                value={tokenSerial}
                onChange={(e) => setTokenSerial(e.target.value)}
                placeholder="Ex: YUBI-9842-8812"
                className="bg-[#0a0e17] border border-[#424754] text-[#dfe2ef] font-mono px-3 py-2 rounded-lg outline-none focus:border-[#adc6ff]"
              />
            </div>

            <div className="p-3 rounded bg-[#0a0e17] border border-[#424754]/40 flex items-center gap-2 text-[#ffb4ab] text-[11px] font-mono">
              <span className="material-symbols-outlined text-[16px] shrink-0">warning</span>
              <span>Toute fausse déclaration d'incident est enregistrée et auditée dans les registres légaux.</span>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#424754]/30">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 rounded-lg bg-[#262a34] text-[#c2c6d6] hover:bg-[#31353f] transition-colors cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-[#adc6ff] text-[#002e6a] hover:bg-[#d8e2ff] font-medium transition-colors cursor-pointer"
              >
                Demander la réinitialisation
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
