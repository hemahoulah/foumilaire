import React, { useState, useEffect, useRef } from 'react';
import { BastionSession } from '../types';

interface TerminalModalProps {
  session: BastionSession;
  onClose: () => void;
}

export const TerminalModal: React.FC<TerminalModalProps> = ({ session, onClose }) => {
  const [history, setHistory] = useState<string[]>([
    `[AegisGate Bastion Proxy v4.19.2 - Node: SOC-NODE #4092]`,
    `Connected to target: ${session.targetName} (${session.address})`,
    `Session ID: ${session.id} | Protocol: ${session.targetType} | Cryptographic tunnel: TLS 1.3 / AES-256-GCM`,
    `AUDIT WARNING: All keystrokes and output streams are cryptographically recorded under ISO/IEC 27001 audit standards.`,
    `Session TTL: ${Math.floor(session.remainingSeconds / 60)} minutes remaining.`,
    `Type 'help' for available commands.`,
    ``,
  ]);
  const [currentInput, setCurrentInput] = useState('');
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = currentInput.trim();
    if (!cmd) return;

    const newHistory = [...history, `admin@${session.targetName}:~$ ${cmd}`];

    if (cmd === 'help') {
      newHistory.push(
        `Available privileged commands:`,
        `  status      - Display bastion connection & cipher telemetry`,
        `  top         - Show active processes on target`,
        `  k8s         - Inspect pod cluster health (if Kubernetes)`,
        `  whoami      - Verify active security role and token`,
        `  clear       - Clear terminal screen`,
        `  exit        - Terminate and detach terminal`
      );
    } else if (cmd === 'status') {
      newHistory.push(
        `Connection State: ACTIVE & VERIFIED`,
        `Target IP: ${session.address}`,
        `Cipher Suite: TLS_AES_256_GCM_SHA384`,
        `FIDO2 Assertion: VALID (YubiKey 5C NFC)`,
        `Keystroke Logger: RECORDING ACTIVE (Session RFC 3161 timestamped)`
      );
    } else if (cmd === 'whoami') {
      newHistory.push(
        `User: ${session.user}`,
        `Role: ${session.role}`,
        `Privilege Level: ROOT_ELEVATED`,
        `Gateway: SOC-NODE #4092 (Paris DataCenter)`
      );
    } else if (cmd === 'top') {
      newHistory.push(
        `PID   USER      CPU%   MEM%   COMMAND`,
        `1024  root      0.8    1.2    systemd-journald`,
        `2401  postgres  1.4    8.4    postgres: writer process`,
        `3109  kubelet   2.1    4.2    kubelet --config=/var/lib/kubelet/config.yaml`,
        `4912  secops    0.1    0.9    aegisgate-audit-agent (v4.19.2)`
      );
    } else if (cmd === 'k8s' || cmd.startsWith('kubectl')) {
      newHistory.push(
        `NAME                               READY   STATUS    RESTARTS   AGE`,
        `auth-service-7f4c8b9d-12x4        1/1     Running   0          4d`,
        `core-gateway-69f84b6c-90qa        2/2     Running   0          18d`,
        `vault-enclave-5c87bb88-m4p1       1/1     Running   0          42d`,
        `telemetry-agent-soc-33a9          1/1     Running   0          12h`
      );
    } else if (cmd === 'clear') {
      setHistory([]);
      setCurrentInput('');
      return;
    } else if (cmd === 'exit') {
      onClose();
      return;
    } else {
      newHistory.push(`[aegis-exec]: Command executed with audit signature [exit code 0]: ${cmd}`);
    }

    setHistory(newHistory);
    setCurrentInput('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
      <div className="bg-[#0a0e17] border border-[#424754] rounded-xl max-w-4xl w-full h-[85vh] max-h-[640px] flex flex-col shadow-2xl overflow-hidden">
        {/* Terminal Header Bar */}
        <div className="h-11 bg-[#181b25] border-b border-[#424754]/40 px-4 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ffb4ab]"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#c2c6d6]"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#4edea3]"></span>
            <span className="text-[#dfe2ef] font-semibold ml-2">
              {session.targetName} ({session.role})
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#93000a]/40 text-[#ffdad6] flex items-center gap-1 font-sans">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ffb4ab] animate-pulse"></span>
              REC
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[#8c909f] text-[11px] hidden sm:inline">
              Chiffrement E2EE : TLS 1.3
            </span>
            <button
              onClick={onClose}
              className="px-2 py-0.5 rounded bg-[#262a34] text-[#c2c6d6] hover:bg-[#31353f] hover:text-white transition-colors cursor-pointer text-xs"
            >
              Fermer (ESC)
            </button>
          </div>
        </div>

        {/* Terminal Screen Body */}
        <div className="flex-1 p-4 overflow-y-auto font-mono text-xs text-[#dfe2ef] flex flex-col gap-1 select-text bg-[#0a0e17]">
          {history.map((line, idx) => (
            <div
              key={idx}
              className={
                line.includes('WARNING')
                  ? 'text-[#ffb4ab]'
                  : line.includes('Target IP') || line.includes('Cipher')
                  ? 'text-[#4edea3]'
                  : line.startsWith('admin@')
                  ? 'text-[#adc6ff] font-semibold'
                  : 'text-[#c2c6d6]'
              }
            >
              {line}
            </div>
          ))}

          {/* Active Command Input Line */}
          <form onSubmit={handleCommandSubmit} className="flex items-center gap-1.5 mt-1">
            <span className="text-[#adc6ff] font-semibold whitespace-nowrap">
              admin@{session.targetName}:~$
            </span>
            <input
              type="text"
              autoFocus
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              className="flex-1 bg-transparent text-[#4edea3] font-mono outline-none caret-[#4edea3]"
              placeholder="Entrez une commande (ex: status, top, k8s, help)..."
            />
          </form>
          <div ref={bottomRef} />
        </div>

        {/* Terminal Footer Bar */}
        <div className="h-8 bg-[#181b25] border-t border-[#424754]/40 px-4 flex items-center justify-between text-[11px] font-mono text-[#8c909f]">
          <span>Touches rapides : 'help', 'status', 'k8s', 'top', 'exit'</span>
          <span className="text-[#4edea3]">Port de sortie : 22/mTLS (Zero Trust)</span>
        </div>
      </div>
    </div>
  );
};
