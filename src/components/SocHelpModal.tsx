import React, { useState } from 'react';

interface SocHelpModalProps {
  onClose: () => void;
}

export const SocHelpModal: React.FC<SocHelpModalProps> = ({ onClose }) => {
  const [ticketSubject, setTicketSubject] = useState('');
  const [severity, setSeverity] = useState('P2');
  const [ticketSent, setTicketSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTicketSent(true);
    setTimeout(() => {
      onClose();
    }, 2200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#1c1f29] border border-[#424754] rounded-xl max-w-lg w-full p-6 shadow-2xl flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-[#424754]/40 pb-3">
          <div className="flex items-center gap-2 text-[#4edea3]">
            <span className="material-symbols-outlined text-[22px]">contact_support</span>
            <h3 className="text-base font-semibold text-[#dfe2ef]">
              Assistance & Support SOC 24/7
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#8c909f] hover:text-[#dfe2ef] cursor-pointer"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {ticketSent ? (
          <div className="p-6 text-center flex flex-col items-center gap-3">
            <span className="material-symbols-outlined text-[48px] text-[#4edea3]">
              check_circle
            </span>
            <h4 className="text-base font-semibold text-[#dfe2ef]">
              Ticket d'Incident SOC Transmis
            </h4>
            <p className="text-xs text-[#8c909f] font-mono">
              Référence : INC-{Math.floor(100000 + Math.random() * 900000)}
            </p>
            <p className="text-xs text-[#c2c6d6]">
              L'équipe d'astreinte SOC a été alertée par pager sécurisé. Un analyste examine votre demande sous 5 minutes.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4 text-xs">
            {/* Emergency Hotline Info */}
            <div className="p-3.5 rounded-lg bg-[#0a0e17] border border-[#424754]/40 flex flex-col gap-2 font-mono">
              <div className="flex items-center justify-between">
                <span className="text-[#adc6ff] font-semibold">Ligne d'Urgence Sécurité (24/7)</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#93000a]/30 text-[#ffb4ab]">
                  PRIORITÉ CRITIQUE
                </span>
              </div>
              <div className="text-sm font-bold text-[#dfe2ef]">+33 (0)1 40 92 00 24</div>
              <div className="text-[11px] text-[#8c909f]">
                Email chiffré PGP : soc-incident-response@enterprise.internal
              </div>
            </div>

            {/* Quick Ticket Submission */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[#8c909f] font-mono">Niveau de criticité :</label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value)}
                  className="bg-[#0a0e17] border border-[#424754] text-[#dfe2ef] px-3 py-2 rounded-lg outline-none focus:border-[#adc6ff]"
                >
                  <option value="P1">P1 - Incident Critique (Blocage total ou suspicion d'intrusion)</option>
                  <option value="P2">P2 - Incident Majeur (Problème de jeton FIDO2 ou authentification)</option>
                  <option value="P3">P3 - Demande d'assistance standard ou renouvellement de clé</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[#8c909f] font-mono">Description du problème / motif de l'alerte :</label>
                <textarea
                  required
                  rows={3}
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  placeholder="Ex: Clé YubiKey désynchronisée, suspicion de tentative non autorisée, besoin d'accès JIT urgent..."
                  className="bg-[#0a0e17] border border-[#424754] text-[#dfe2ef] px-3 py-2 rounded-lg outline-none focus:border-[#adc6ff] resize-none"
                />
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
                  className="px-4 py-2 rounded-lg bg-[#4edea3] text-[#003824] hover:bg-[#6ffbbe] font-medium transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">send</span>
                  <span>Transmettre au SOC</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
