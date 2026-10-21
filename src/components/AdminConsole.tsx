import React, { useState, useEffect } from 'react';
import { AdminUser, BastionSession, JitRequest, AuditLogEntry } from '../types';

interface AdminConsoleProps {
  currentUser: AdminUser;
  onOpenTerminal: (session: BastionSession) => void;
  onLogout: () => void;
}

const INITIAL_SESSIONS: BastionSession[] = [
  {
    id: 'SES-9481',
    targetName: 'k8s-prod-eu-west-01',
    targetType: 'Kubernetes',
    address: '10.240.4.12:6443',
    role: 'cluster-admin',
    startedAt: '11:15',
    ttlMinutes: 60,
    remainingSeconds: 3120,
    status: 'active',
    recordingEnabled: true,
    user: 'admin@enterprise.internal',
    activeCommandsCount: 14,
  },
  {
    id: 'SES-9482',
    targetName: 'pg-cluster-main.internal',
    targetType: 'PostgreSQL',
    address: '10.240.18.5:5432',
    role: 'dba_elevated',
    startedAt: '11:22',
    ttlMinutes: 30,
    remainingSeconds: 1420,
    status: 'active',
    recordingEnabled: true,
    user: 'admin@enterprise.internal',
    activeCommandsCount: 28,
  },
  {
    id: 'SES-9483',
    targetName: 'bastion-core-01.internal',
    targetType: 'Linux SSH',
    address: '10.240.1.1:22',
    role: 'secops-root',
    startedAt: '10:50',
    ttlMinutes: 120,
    remainingSeconds: 3890,
    status: 'active',
    recordingEnabled: true,
    user: 'admin@enterprise.internal',
    activeCommandsCount: 82,
  },
  {
    id: 'SES-9484',
    targetName: 'vault-hsm-node-03',
    targetType: 'HSM Enclave',
    address: '10.240.9.33:8200',
    role: 'key-custodian',
    startedAt: '11:20',
    ttlMinutes: 20,
    remainingSeconds: 710,
    status: 'active',
    recordingEnabled: false,
    user: 'admin@enterprise.internal',
    activeCommandsCount: 6,
  },
];

const INITIAL_JIT: JitRequest[] = [
  {
    id: 'JIT-802',
    requester: 'lucas.sre@enterprise.internal',
    resource: 'redis-cache-prod-02',
    durationMinutes: 15,
    justification: 'Purge d urgence cluster cache suite incident #INC-904',
    requestedAt: '11:21',
    status: 'pending',
  },
  {
    id: 'JIT-803',
    requester: 'auditeur.kpmg@audit.internal',
    resource: 'audit-logs-glacier-read',
    durationMinutes: 60,
    justification: 'Vérification de conformité annuelle ISO/IEC 27001 Annexe A.9',
    requestedAt: '11:10',
    status: 'pending',
  },
];

const INITIAL_AUDIT: AuditLogEntry[] = [
  {
    id: 'AUD-991',
    timestamp: '11:24:02',
    actor: 'admin@enterprise.internal',
    event: 'Clé FIDO2 touchée avec succès (Assertion validée)',
    node: 'SOC-NODE #4092',
    severity: 'low',
    details: 'AAGUID: 00000000-0000-0000-0000-000000000000 / Algorithme: ES256',
  },
  {
    id: 'AUD-990',
    timestamp: '11:23:44',
    actor: 'system-pam',
    event: 'Handshake mTLS 1.3 établi avec bastion-core-01',
    node: 'SOC-NODE #4092',
    severity: 'low',
    details: 'Cipher: TLS_AES_256_GCM_SHA384 (ECDH X25519)',
  },
  {
    id: 'AUD-989',
    timestamp: '11:18:12',
    actor: 'pg-cluster-main.internal',
    event: 'Requête SELECT exécutée sur table confidentielle',
    node: 'SOC-NODE #4092',
    severity: 'medium',
    details: 'Masquage dynamique des colonnes PII appliqué conformément au RGPD',
  },
  {
    id: 'AUD-988',
    timestamp: '11:05:01',
    actor: 'firewall-perimeter',
    event: 'Tentative de connexion brute-force bloquée',
    node: 'SOC-NODE #0933',
    severity: 'high',
    details: 'IP 185.220.101.5 bannie pour 24 heures (12 échecs d authentification consécutifs)',
  },
];

export const AdminConsole: React.FC<AdminConsoleProps> = ({
  currentUser,
  onOpenTerminal,
  onLogout,
}) => {
  const [sessions, setSessions] = useState<BastionSession[]>(INITIAL_SESSIONS);
  const [jitRequests, setJitRequests] = useState<JitRequest[]>(INITIAL_JIT);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT);
  const [filterType, setFilterType] = useState<string>('all');
  const [showNewSessionModal, setShowNewSessionModal] = useState(false);
  const [newTargetName, setNewTargetName] = useState('elastic-prod-cluster.internal');
  const [newTargetType, setNewTargetType] = useState<'Linux SSH' | 'PostgreSQL' | 'Kubernetes'>('Linux SSH');
  const [newRole, setNewRole] = useState('ops-admin');
  const [notification, setNotification] = useState<string | null>(null);

  // Countdown timer for active sessions
  useEffect(() => {
    const timer = setInterval(() => {
      setSessions((prev) =>
        prev.map((s) => ({
          ...s,
          remainingSeconds: Math.max(0, s.remainingSeconds - 1),
          status: s.remainingSeconds <= 300 ? 'warning' : 'active',
        }))
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}m ${s < 10 ? '0' : ''}${s}s`;
  };

  const handleTerminateSession = (id: string, name: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
    const newLog: AuditLogEntry = {
      id: `AUD-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toLocaleTimeString('fr-FR'),
      actor: currentUser.identifier,
      event: `Session PAM révoquée d'urgence : ${name}`,
      node: 'SOC-NODE #4092',
      severity: 'medium',
      details: `Révocation immédiate ordonnée par l'administrateur (${id})`,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
    showToast(`Session ${name} révoquée immédiatement.`);
  };

  const handleRenewSession = (id: string) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, remainingSeconds: s.remainingSeconds + 1800 } : s))
    );
    showToast(`TTL prolongé de +30 minutes.`);
  };

  const handleJitDecision = (id: string, approve: boolean) => {
    const req = jitRequests.find((r) => r.id === id);
    if (!req) return;

    setJitRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: approve ? 'approved' : 'rejected' } : r))
    );

    const newLog: AuditLogEntry = {
      id: `AUD-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toLocaleTimeString('fr-FR'),
      actor: currentUser.identifier,
      event: `Demande JIT ${approve ? 'Approuvée' : 'Refusée'} pour ${req.requester}`,
      node: 'SOC-NODE #4092',
      severity: approve ? 'medium' : 'low',
      details: `Ressource: ${req.resource} (${req.durationMinutes} min) - Motif: ${req.justification}`,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
    showToast(approve ? `Accès temporaire accordé à ${req.requester}` : `Demande rejetée.`);
  };

  const handleCreateSession = (e: React.FormEvent) => {
    e.preventDefault();
    const newSession: BastionSession = {
      id: `SES-${Math.floor(1000 + Math.random() * 9000)}`,
      targetName: newTargetName,
      targetType: newTargetType,
      address: '10.240.22.9:22',
      role: newRole,
      startedAt: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      ttlMinutes: 45,
      remainingSeconds: 2700,
      status: 'active',
      recordingEnabled: true,
      user: currentUser.identifier,
      activeCommandsCount: 1,
    };
    setSessions((prev) => [newSession, ...prev]);
    setShowNewSessionModal(false);
    showToast(`Nouvelle session PAM initialisée : ${newTargetName}`);
  };

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 3500);
  };

  const filteredSessions =
    filterType === 'all'
      ? sessions
      : sessions.filter((s) => s.targetType.toLowerCase().includes(filterType.toLowerCase()));

  return (
    <div className="w-full max-w-7xl mx-auto px-4 lg:px-6 py-6 flex flex-col gap-6">
      {/* Toast notification */}
      {notification && (
        <div className="fixed bottom-16 right-6 z-50 bg-[#1c1f29] border border-[#4edea3] text-[#dfe2ef] px-4 py-2.5 rounded-lg shadow-2xl flex items-center gap-2 text-xs font-mono animate-bounce">
          <span className="material-symbols-outlined text-[#4edea3] text-[18px]">check_circle</span>
          <span>{notification}</span>
        </div>
      )}

      {/* Top Banner: Active Privileged Session Information */}
      <div className="bg-[#1c1f29]/95 border border-[#424754]/40 rounded-xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-lg bg-[#0a0e17] border border-[#4edea3]/40 flex items-center justify-center text-[#4edea3] shadow-inner shrink-0">
            <span className="material-symbols-outlined text-[24px]">shield_person</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-sm sm:text-base text-[#dfe2ef]">
                {currentUser.displayName}
              </span>
              <span className="font-mono text-[10px] uppercase px-2 py-0.5 rounded bg-[#4edea3]/15 text-[#4edea3] border border-[#4edea3]/30 font-medium">
                {currentUser.role}
              </span>
              <span className="font-mono text-[11px] text-[#8c909f]">
                IP: {currentUser.ipAddress}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#8c909f] font-mono mt-0.5">
              <span>Nœud d'accès : <strong className="text-[#dfe2ef]">SOC-NODE #4092 (Paris)</strong></span>
              <span>·</span>
              <span>Jeton : <strong className="text-[#4edea3]">{currentUser.fidoTokenName}</strong></span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-[#424754]/40">
          <button
            onClick={() => setShowNewSessionModal(true)}
            className="px-3.5 py-2 rounded-lg bg-[#adc6ff] text-[#002e6a] hover:bg-[#d8e2ff] text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <span className="material-symbols-outlined text-[16px]">add_link</span>
            <span>Ouvrir un accès PAM</span>
          </button>
          <button
            onClick={onLogout}
            className="px-3.5 py-2 rounded-lg bg-[#262a34] text-[#c2c6d6] hover:bg-[#93000a]/30 hover:text-[#ffdad6] hover:border-[#ffb4ab]/40 border border-[#424754]/40 text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">logout</span>
            <span>Fermer la session</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-[#181b25] border border-[#424754]/30 rounded-lg p-3.5 flex flex-col gap-1">
          <span className="text-xs text-[#8c909f]">Sessions Bastion Actives</span>
          <div className="flex items-baseline justify-between">
            <span className="text-xl sm:text-2xl font-semibold font-mono text-[#4edea3] tabular-nums">
              {sessions.length}
            </span>
            <span className="text-[11px] font-mono text-[#8c909f]">Toutes chiffrées</span>
          </div>
        </div>

        <div className="bg-[#181b25] border border-[#424754]/30 rounded-lg p-3.5 flex flex-col gap-1">
          <span className="text-xs text-[#8c909f]">Demandes JIT en Attente</span>
          <div className="flex items-baseline justify-between">
            <span className="text-xl sm:text-2xl font-semibold font-mono text-[#adc6ff] tabular-nums">
              {jitRequests.filter((j) => j.status === 'pending').length}
            </span>
            <span className="text-[11px] font-mono text-[#8c909f]">Élévation 4-yeux</span>
          </div>
        </div>

        <div className="bg-[#181b25] border border-[#424754]/30 rounded-lg p-3.5 flex flex-col gap-1">
          <span className="text-xs text-[#8c909f]">Chiffrement & Invariants</span>
          <div className="flex items-baseline justify-between">
            <span className="text-xl sm:text-2xl font-semibold font-mono text-[#4edea3] tabular-nums">
              100%
            </span>
            <span className="text-[11px] font-mono text-[#8c909f]">TLS 1.3 / E2EE</span>
          </div>
        </div>

        <div className="bg-[#181b25] border border-[#424754]/30 rounded-lg p-3.5 flex flex-col gap-1">
          <span className="text-xs text-[#8c909f]">Enregistrement d'Audit</span>
          <div className="flex items-baseline justify-between">
            <span className="text-xl sm:text-2xl font-semibold font-mono text-[#dfe2ef] tabular-nums">
              Actif
            </span>
            <span className="text-[11px] font-mono text-[#4edea3] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3] animate-pulse"></span>
              Conforme ISO
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Active Bastion Sessions (Left 2 cols) + JIT & Fast Actions (Right 1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Active Bastion Sessions Table */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h2 className="text-base font-semibold text-[#dfe2ef] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#adc6ff] text-[20px]">
                  terminal
                </span>
                Sessions Privilégiées Sécurisées (Bastion PAM)
              </h2>
              <p className="text-xs text-[#8c909f]">
                Tunnels d'accès directs avec journalisation temps-réel des commandes et révocation instantanée.
              </p>
            </div>

            {/* Filter segmented buttons */}
            <div className="flex items-center gap-1 p-1 bg-[#0a0e17] rounded-lg border border-[#424754]/40">
              <button
                onClick={() => setFilterType('all')}
                className={`px-2.5 py-1 text-xs rounded transition-colors cursor-pointer ${
                  filterType === 'all'
                    ? 'bg-[#262a34] text-[#dfe2ef] font-medium'
                    : 'text-[#8c909f] hover:text-[#dfe2ef]'
                }`}
              >
                Tous ({sessions.length})
              </button>
              <button
                onClick={() => setFilterType('ssh')}
                className={`px-2.5 py-1 text-xs rounded transition-colors cursor-pointer ${
                  filterType === 'ssh'
                    ? 'bg-[#262a34] text-[#dfe2ef] font-medium'
                    : 'text-[#8c909f] hover:text-[#dfe2ef]'
                }`}
              >
                SSH
              </button>
              <button
                onClick={() => setFilterType('kubernetes')}
                className={`px-2.5 py-1 text-xs rounded transition-colors cursor-pointer ${
                  filterType === 'kubernetes'
                    ? 'bg-[#262a34] text-[#dfe2ef] font-medium'
                    : 'text-[#8c909f] hover:text-[#dfe2ef]'
                }`}
              >
                K8s
              </button>
              <button
                onClick={() => setFilterType('postgresql')}
                className={`px-2.5 py-1 text-xs rounded transition-colors cursor-pointer ${
                  filterType === 'postgresql'
                    ? 'bg-[#262a34] text-[#dfe2ef] font-medium'
                    : 'text-[#8c909f] hover:text-[#dfe2ef]'
                }`}
              >
                Postgres
              </button>
            </div>
          </div>

          {/* Session Cards */}
          <div className="flex flex-col gap-3">
            {filteredSessions.map((session) => (
              <div
                key={session.id}
                className="bg-[#181b25] border border-[#424754]/40 hover:border-[#adc6ff]/50 rounded-xl p-4 transition-all duration-150 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#0a0e17] border border-[#424754]/40 flex items-center justify-center text-[#adc6ff] shrink-0">
                    <span className="material-symbols-outlined text-[20px]">
                      {session.targetType === 'Kubernetes'
                        ? 'hub'
                        : session.targetType === 'PostgreSQL'
                        ? 'database'
                        : session.targetType === 'HSM Enclave'
                        ? 'key'
                        : 'computer'}
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-sm font-semibold text-[#dfe2ef]">
                        {session.targetName}
                      </span>
                      <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[#262a34] text-[#adc6ff]">
                        {session.role}
                      </span>
                      {session.recordingEnabled && (
                        <span className="text-[10px] font-mono text-[#ffdad6] bg-[#93000a]/30 px-1.5 py-0.5 rounded flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#ffb4ab] animate-pulse"></span>
                          REC
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-[#8c909f] font-mono mt-1">
                      <span>IP : {session.address}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1 text-[#c2c6d6]">
                        <span className="material-symbols-outlined text-[13px] text-[#adc6ff]">schedule</span>
                        Expire : <strong className="text-[#4edea3]">{formatSeconds(session.remainingSeconds)}</strong>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Session Actions */}
                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => onOpenTerminal(session)}
                    className="px-3 py-1.5 rounded-lg bg-[#262a34] text-[#dfe2ef] hover:bg-[#31353f] hover:text-[#4edea3] border border-[#424754]/50 text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Ouvrir le terminal interactif sécurisé"
                  >
                    <span className="material-symbols-outlined text-[15px]">terminal</span>
                    <span>Console</span>
                  </button>
                  <button
                    onClick={() => handleRenewSession(session.id)}
                    className="p-1.5 rounded-lg bg-[#262a34] text-[#8c909f] hover:text-[#adc6ff] border border-[#424754]/50 transition-colors cursor-pointer"
                    title="Prolonger la session de 30 minutes"
                  >
                    <span className="material-symbols-outlined text-[16px]">more_time</span>
                  </button>
                  <button
                    onClick={() => handleTerminateSession(session.id, session.targetName)}
                    className="p-1.5 rounded-lg bg-[#262a34] text-[#ffb4ab] hover:bg-[#93000a]/40 border border-[#424754]/50 transition-colors cursor-pointer"
                    title="Révoquer et détruire la session immédiatement"
                  >
                    <span className="material-symbols-outlined text-[16px]">close</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: JIT Requests & Quick Tools */}
        <div className="flex flex-col gap-6">
          {/* JIT Elevation Requests */}
          <div className="bg-[#181b25] border border-[#424754]/40 rounded-xl p-4 shadow-md flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-[#dfe2ef] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#4edea3] text-[18px]">
                  verified
                </span>
                Demandes d'accès JIT (4-Yeux)
              </h3>
              <span className="text-[11px] font-mono text-[#8c909f]">
                {jitRequests.filter((j) => j.status === 'pending').length} en attente
              </span>
            </div>

            <div className="flex flex-col gap-3">
              {jitRequests.map((req) => (
                <div
                  key={req.id}
                  className="p-3 rounded-lg bg-[#0a0e17] border border-[#424754]/40 flex flex-col gap-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-semibold text-[#adc6ff]">
                      {req.requester}
                    </span>
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                        req.status === 'pending'
                          ? 'bg-[#31353f] text-[#dfe2ef]'
                          : req.status === 'approved'
                          ? 'bg-[#003824] text-[#4edea3]'
                          : 'bg-[#93000a]/40 text-[#ffb4ab]'
                      }`}
                    >
                      {req.status === 'pending' ? 'En attente' : req.status === 'approved' ? 'Accordé' : 'Refusé'}
                    </span>
                  </div>

                  <div className="text-xs text-[#c2c6d6]">
                    Cible : <strong className="font-mono text-[#dfe2ef]">{req.resource}</strong> ({req.durationMinutes} min)
                  </div>
                  <p className="text-[11px] text-[#8c909f] italic">
                    "{req.justification}"
                  </p>

                  {req.status === 'pending' && (
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => handleJitDecision(req.id, true)}
                        className="flex-1 py-1 rounded bg-[#00a572] hover:bg-[#4edea3] text-[#002113] font-medium text-xs transition-colors cursor-pointer"
                      >
                        Approuver
                      </button>
                      <button
                        onClick={() => handleJitDecision(req.id, false)}
                        className="py-1 px-3 rounded bg-[#262a34] hover:bg-[#31353f] text-[#ffb4ab] text-xs transition-colors cursor-pointer"
                      >
                        Refuser
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Quick Lockdown Kill-Switch */}
          <div className="bg-[#93000a]/10 border border-[#ffb4ab]/30 rounded-xl p-4 flex flex-col gap-2.5">
            <div className="flex items-center gap-2 text-[#ffb4ab]">
              <span className="material-symbols-outlined text-[20px]">gpp_bad</span>
              <span className="text-xs font-semibold uppercase tracking-wider font-mono">
                Bouton d'Arrêt d'Urgence (Kill-Switch)
              </span>
            </div>
            <p className="text-xs text-[#c2c6d6]">
              En cas d'anomalie détectée par le SOC, isolez immédiatement toutes les passerelles et révoquez les jetons actifs.
            </p>
            <button
              onClick={() => {
                if (window.confirm("CONFIRMATION REQUISE : Voulez-vous déclencher le verrouillage d'urgence de toutes les sessions actives ?")) {
                  setSessions([]);
                  showToast("VERROUILLAGE TOTAL : Toutes les sessions PAM ont été révoquées.");
                }
              }}
              className="w-full py-2 px-3 rounded-lg bg-[#93000a] text-white hover:bg-[#b3261e] text-xs font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <span className="material-symbols-outlined text-[16px]">lock_reset</span>
              <span>Révoquer toutes les sessions immédiatement</span>
            </button>
          </div>
        </div>
      </div>

      {/* Live Cryptographic Audit Stream */}
      <div className="bg-[#181b25] border border-[#424754]/40 rounded-xl p-4 sm:p-5 flex flex-col gap-3 shadow-md">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h3 className="text-sm font-semibold text-[#dfe2ef] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#adc6ff] text-[18px]">
                receipt_long
              </span>
              Journal d'Audit Cryptographique en Direct (Immuable)
            </h3>
            <p className="text-xs text-[#8c909f]">
              Chaque action est signée cryptographiquement avec scellement d'horodatage RFC 3161.
            </p>
          </div>

          <button
            onClick={() => {
              const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(auditLogs, null, 2));
              const downloadAnchor = document.createElement('a');
              downloadAnchor.setAttribute('href', dataStr);
              downloadAnchor.setAttribute('download', `aegisgate-audit-log-${Date.now()}.json`);
              document.body.appendChild(downloadAnchor);
              downloadAnchor.click();
              downloadAnchor.remove();
              showToast("Rapport d'audit JSON téléchargé.");
            }}
            className="px-3 py-1.5 rounded-lg bg-[#262a34] text-[#adc6ff] hover:bg-[#31353f] border border-[#424754]/50 text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[15px]">download</span>
            <span>Exporter JSON</span>
          </button>
        </div>

        {/* Audit Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono border-collapse">
            <thead>
              <tr className="border-b border-[#424754]/40 text-[#8c909f]">
                <th className="py-2 px-3">Horodatage</th>
                <th className="py-2 px-3">Acteur</th>
                <th className="py-2 px-3">Événement</th>
                <th className="py-2 px-3">Nœud</th>
                <th className="py-2 px-3">Détails techniques</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#424754]/20 text-[#dfe2ef]">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-[#1c1f29]/80 transition-colors">
                  <td className="py-2.5 px-3 text-[#8c909f] whitespace-nowrap">{log.timestamp}</td>
                  <td className="py-2.5 px-3 text-[#adc6ff] whitespace-nowrap">{log.actor}</td>
                  <td className="py-2.5 px-3 font-sans font-medium">{log.event}</td>
                  <td className="py-2.5 px-3 text-[#4edea3] whitespace-nowrap">{log.node}</td>
                  <td className="py-2.5 px-3 text-[#8c909f] max-w-xs truncate" title={log.details}>
                    {log.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Session Modal */}
      {showNewSessionModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1c1f29] border border-[#424754] rounded-xl max-w-md w-full p-6 shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-[#424754]/40 pb-3">
              <h3 className="text-base font-semibold text-[#dfe2ef] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#4edea3]">add_moderator</span>
                Initialiser un Tunnel PAM
              </h3>
              <button
                onClick={() => setShowNewSessionModal(false)}
                className="text-[#8c909f] hover:text-[#dfe2ef] cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateSession} className="flex flex-col gap-3.5 text-xs">
              <div className="flex flex-col gap-1">
                <label className="text-[#8c909f] font-mono">Nom de la cible d'infrastructure :</label>
                <input
                  type="text"
                  required
                  value={newTargetName}
                  onChange={(e) => setNewTargetName(e.target.value)}
                  className="bg-[#0a0e17] border border-[#424754] text-[#dfe2ef] font-mono px-3 py-2 rounded-lg outline-none focus:border-[#adc6ff]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[#8c909f] font-mono">Protocole du bastion :</label>
                <select
                  value={newTargetType}
                  onChange={(e) => setNewTargetType(e.target.value as any)}
                  className="bg-[#0a0e17] border border-[#424754] text-[#dfe2ef] px-3 py-2 rounded-lg outline-none focus:border-[#adc6ff]"
                >
                  <option value="Linux SSH">Linux SSH (OpenSSH avec certificat PAM)</option>
                  <option value="PostgreSQL">PostgreSQL (Tunnel sécurisé mTLS)</option>
                  <option value="Kubernetes">Kubernetes (Kubeconfig temporaire)</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[#8c909f] font-mono">Rôle privilégié assigné :</label>
                <input
                  type="text"
                  required
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="bg-[#0a0e17] border border-[#424754] text-[#dfe2ef] font-mono px-3 py-2 rounded-lg outline-none focus:border-[#adc6ff]"
                />
              </div>

              <div className="p-3 rounded bg-[#0a0e17] border border-[#424754]/40 flex items-center gap-2 text-[#4edea3]">
                <span className="material-symbols-outlined text-[16px]">verified</span>
                <span>Clé FIDO2 requise pour initier la session cryptographique.</span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewSessionModal(false)}
                  className="px-3 py-2 rounded-lg bg-[#262a34] text-[#c2c6d6] hover:bg-[#31353f] cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#adc6ff] text-[#002e6a] hover:bg-[#d8e2ff] font-medium cursor-pointer"
                >
                  Ouvrir la session
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
