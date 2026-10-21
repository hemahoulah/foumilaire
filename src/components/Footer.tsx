import React from 'react';
import { ActiveTab } from '../types';

interface FooterProps {
  onSelectTab: (tab: ActiveTab) => void;
  onOpenSocModal: () => void;
  onOpenCompliance: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectTab,
  onOpenSocModal,
  onOpenCompliance,
}) => {
  return (
    <footer className="relative z-10 w-full bg-[#0a0e17]/85 backdrop-blur-md border-t border-[#424754]/30 py-3 sm:py-4">
      <div className="max-w-7xl mx-auto px-4 lg:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-[#8c909f] font-mono text-[11px]">
          <span className="material-symbols-outlined text-[15px] text-[#4edea3]">
            shield_lock
          </span>
          <span>Architecture Zero Trust certifiée ISO/IEC 27001</span>
        </div>
        <div className="flex items-center gap-4 text-[#c2c6d6]">
          <button
            onClick={() => {
              onSelectTab('politique-acces');
              onOpenCompliance();
            }}
            className="hover:text-[#dfe2ef] transition-colors cursor-pointer text-xs"
          >
            Conformité RGPD
          </button>
          <button
            onClick={onOpenSocModal}
            className="hover:text-[#dfe2ef] transition-colors cursor-pointer text-xs"
          >
            Support SOC 24/7
          </button>
          <span className="font-mono text-[11px] text-[#424754]">
            v4.19.2-sec
          </span>
        </div>
      </div>
    </footer>
  );
};
