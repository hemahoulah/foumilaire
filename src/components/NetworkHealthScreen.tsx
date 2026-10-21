import React, { useState } from 'react';
import { SocNode } from '../types';

const INITIAL_NODES: SocNode[] = [
  {
    id: 'node-4092',
    code: 'SOC-NODE #4092',
    city: 'Paris',
    country: 'France',
    role: 'Passerelle Primaire',
    status: 'nominal',
    latencyMs: 1.2,
    uptime: '99.999%',
    cipherSuite: 'TLS_AES_256_GCM_SHA384 (ECDH X25519)',
    tlsVersion: 'TLS 1.3',
    activeSessions: 4,
    throughputMbps: 480,
  },
  {
    id: 'node-1044',
    code: 'SOC-NODE #1044',
    city: 'Frankfurt',
    country: 'Allemagne',
    role: 'Nœud de Secours',
    status: 'nominal',
    latencyMs: 3.8,
    uptime: '99.995%',
    cipherSuite: 'TLS_CHACHA20_POLY1305_SHA256',
    tlsVersion: 'TLS 1.3',
    activeSessions: 2,
    throughputMbps: 210,
  },
  {
    id: 'node-8821',
    code: 'SOC-NODE #8821',
    city: 'Zurich',
    country: 'Suisse',
    role: 'Enclave HSM',
    status: 'nominal',
    latencyMs: 5.4,
    uptime: '100.000%',
    cipherSuite: 'TLS_AES_256_GCM_SHA384 (HSM FIPS 140-3)',
    tlsVersion: 'mTLS 1.3',
    activeSessions: 1,
    throughputMbps: 95,
  },
  {
    id: 'node-0933',
    code: 'SOC-NODE #0933',
    city: 'Londres',
    country: 'Royaume-Uni',
    role: 'Proxy Edge Inspection',
    status: 'nominal',
    latencyMs: 2.9,
    uptime: '99.982%',
    cipherSuite: 'TLS_AES_128_GCM_SHA256',
    tlsVersion: 'TLS 1.3',
    activeSessions: 8,
    throughputMbps: 840,
  },
];

export const NetworkHealthScreen: React.FC = () => {
  const [nodes, setNodes] = useState<SocNode[]>(INITIAL_NODES);
  const [activeNodeCode, setActiveNodeCode] = useState<string>('SOC-NODE #4092');
  const [isRunningDiagnostic, setIsRunningDiagnostic] = useState(false);
  const [diagnosticResult, setDiagnosticResult] = useState<string | null>(null);

  const runDiagnostic = () => {
    setIsRunningDiagnostic(true);
    setDiagnosticResult(null);

    setTimeout(() => {
      // Simulate small latency updates
      setNodes((prev) =>
        prev.map((n) => ({
          ...n,
          latencyMs: Number((n.latencyMs + (Math.random() * 0.4 - 0.2)).toFixed(2)),
        }))
      );
      setIsRunningDiagnostic(false);
      setDiagnosticResult(
        'Diagnostic réseau terminé : 4/4 nœuds conformes. Invariants cryptographiques TLS 1.3 / AES-256-GCM validés sans perte de paquets (0.00%).'
      );
    }, 1500);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 lg:px-6 py-6 flex flex-col gap-6">
      {/* Page Title & Intro */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#31353f] text-[#4edea3] mb-2">
            <span className="w-2 h-2 rounded-full bg-[#4edea3] animate-pulse"></span>
            <span className="font-mono text-[11px] tracking-wider uppercase font-medium">
              Supervision Réseau & Télémétrie SOC
            </span>
          </div>
          <h1 className="text-2xl font-semibold text-[#dfe2ef]">
            Santé du Réseau AegisGate & Nœuds Passerelles
          </h1>
          <p className="text-xs text-[#8c909f] mt-0.5">
            Surveillance en temps réel des nœuds de dérivation cryptographique, de la latence TLS et de l'intégrité de l'infrastructure Zero Trust.
          </p>
        </div>

        <button
          onClick={runDiagnostic}
          disabled={isRunningDiagnostic}
          className="px-4 py-2.5 rounded-lg bg-[#adc6ff] text-[#002e6a] hover:bg-[#d8e2ff] font-medium text-xs transition-all flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
        >
          <span className={`material-symbols-outlined text-[18px] ${isRunningDiagnostic ? 'animate-spin' : ''}`}>
            {isRunningDiagnostic ? 'sync' : 'network_check'}
          </span>
          <span>{isRunningDiagnostic ? 'Sondage des nœuds en cours...' : 'Lancer le diagnostic de santé'}</span>
        </button>
      </div>

      {/* Diagnostic Success Banner */}
      {diagnosticResult && (
        <div className="p-3.5 rounded-lg bg-[#00a572]/15 border border-[#4edea3]/40 text-[#4edea3] text-xs font-mono flex items-center gap-2.5">
          <span className="material-symbols-outlined text-[20px]">verified</span>
          <span>{diagnosticResult}</span>
        </div>
      )}

      {/* Primary Nodes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {nodes.map((node) => {
          const isSelected = activeNodeCode === node.code;
          return (
            <div
              key={node.id}
              onClick={() => setActiveNodeCode(node.code)}
              className={`bg-[#181b25] border rounded-xl p-4 transition-all duration-200 cursor-pointer flex flex-col justify-between gap-4 shadow-md ${
                isSelected
                  ? 'border-[#4edea3] ring-1 ring-[#4edea3]/30 bg-[#1c1f29]'
                  : 'border-[#424754]/40 hover:border-[#adc6ff]/50'
              }`}
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-[#dfe2ef]">
                    {node.code}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#003824] text-[#4edea3] border border-[#4edea3]/30">
                    {node.status.toUpperCase()}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-[#c2c6d6]">
                  <span className="material-symbols-outlined text-[15px] text-[#adc6ff]">location_on</span>
                  <span>{node.city}, {node.country}</span>
                </div>
                <div className="text-[11px] text-[#8c909f] font-mono">
                  {node.role}
                </div>
              </div>

              {/* Node Metrics */}
              <div className="pt-3 border-t border-[#424754]/30 grid grid-cols-2 gap-2 text-xs font-mono">
                <div>
                  <span className="text-[10px] text-[#8c909f] block">Latence RTT</span>
                  <span className="font-bold text-[#4edea3] tabular-nums">{node.latencyMs} ms</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#8c909f] block">Disponibilité</span>
                  <span className="font-bold text-[#dfe2ef] tabular-nums">{node.uptime}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#8c909f] block">Sessions</span>
                  <span className="text-[#adc6ff] tabular-nums">{node.activeSessions}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#8c909f] block">Débit PAM</span>
                  <span className="text-[#dfe2ef] tabular-nums">{node.throughputMbps} Mb/s</span>
                </div>
              </div>

              <div className="text-[10px] font-mono text-[#8c909f] truncate" title={node.cipherSuite}>
                {node.cipherSuite}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Node Details & Deep Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Node Cryptographic Topology */}
        <div className="lg:col-span-2 bg-[#181b25] border border-[#424754]/40 rounded-xl p-5 shadow-md flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[#dfe2ef] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#4edea3] text-[20px]">
                security
              </span>
              Tunneling Cryptographique & Handshake mTLS (Actif sur {activeNodeCode})
            </h3>
            <span className="font-mono text-xs text-[#4edea3] bg-[#003824] px-2 py-0.5 rounded">
              Handshake Validé
            </span>
          </div>

          {/* Architecture Visual Step Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
            <div className="p-3 rounded-lg bg-[#0a0e17] border border-[#424754]/40 flex flex-col gap-1.5">
              <span className="text-[#adc6ff] text-[11px] font-bold">1. Authentification Client</span>
              <p className="text-[11px] text-[#8c909f] font-sans">
                Signature biométrique FIDO2 (ES256) validée sur clé physique matérielle.
              </p>
              <span className="text-[#4edea3] text-[10px] mt-auto">Passkey vérifiée</span>
            </div>

            <div className="p-3 rounded-lg bg-[#0a0e17] border border-[#424754]/40 flex flex-col gap-1.5">
              <span className="text-[#adc6ff] text-[11px] font-bold">2. Passerelle AegisGate</span>
              <p className="text-[11px] text-[#8c909f] font-sans">
                Tunnel TLS 1.3 avec échange éphémère ECDH Curve25519 et scellement AES-256.
              </p>
              <span className="text-[#4edea3] text-[10px] mt-auto">{activeNodeCode}</span>
            </div>

            <div className="p-3 rounded-lg bg-[#0a0e17] border border-[#424754]/40 flex flex-col gap-1.5">
              <span className="text-[#adc6ff] text-[11px] font-bold">3. Cible d'Infrastructure</span>
              <p className="text-[11px] text-[#8c909f] font-sans">
                Bastion SSH/Kubernetes/PostgreSQL avec proxy Zero Trust isolé du réseau public.
              </p>
              <span className="text-[#4edea3] text-[10px] mt-auto">Chiffrement E2EE</span>
            </div>
          </div>

          {/* Technical Invariants Spec */}
          <div className="p-3.5 rounded-lg bg-[#0a0e17] border border-[#424754]/30 flex flex-col gap-2 text-xs font-mono">
            <div className="text-[#dfe2ef] font-semibold">Paramètres de sécurité validés pour la session :</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[#8c909f] text-[11px]">
              <div>Protocole : <span className="text-[#dfe2ef]">TLS 1.3 (RFC 8446)</span></div>
              <div>Algorithme asymétrique : <span className="text-[#dfe2ef]">ECDH X25519</span></div>
              <div>Chiffrement symétrique : <span className="text-[#dfe2ef]">AES-256-GCM</span></div>
              <div>Algorithme d'intégrité : <span className="text-[#dfe2ef]">SHA-384</span></div>
              <div>Protection anti-rejeu : <span className="text-[#4edea3]">Activée (Nonce 64-bit)</span></div>
              <div>Renouvellement des clés : <span className="text-[#dfe2ef]">Toutes les 60 minutes</span></div>
            </div>
          </div>
        </div>

        {/* Security & Threat Telemetry */}
        <div className="bg-[#181b25] border border-[#424754]/40 rounded-xl p-5 shadow-md flex flex-col gap-4">
          <h3 className="text-sm font-semibold text-[#dfe2ef] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#adc6ff] text-[20px]">
              shield
            </span>
            Télémétrie des Menaces (24h)
          </h3>

          <div className="flex flex-col gap-3">
            <div className="p-3 rounded-lg bg-[#0a0e17] border border-[#424754]/30 flex items-center justify-between">
              <div>
                <span className="text-xs text-[#8c909f] block">Sondes suspectes bloquées</span>
                <span className="font-mono text-lg font-bold text-[#ffb4ab] tabular-nums">1,492</span>
              </div>
              <span className="material-symbols-outlined text-[#ffb4ab] text-[24px]">block</span>
            </div>

            <div className="p-3 rounded-lg bg-[#0a0e17] border border-[#424754]/30 flex items-center justify-between">
              <div>
                <span className="text-xs text-[#8c909f] block">Certificats mTLS actifs</span>
                <span className="font-mono text-lg font-bold text-[#4edea3] tabular-nums">14 / 14</span>
              </div>
              <span className="material-symbols-outlined text-[#4edea3] text-[24px]">badge</span>
            </div>

            <div className="p-3 rounded-lg bg-[#0a0e17] border border-[#424754]/30 flex items-center justify-between">
              <div>
                <span className="text-xs text-[#8c909f] block">Temps moyen handshake TLS</span>
                <span className="font-mono text-lg font-bold text-[#dfe2ef] tabular-nums">1.4 ms</span>
              </div>
              <span className="material-symbols-outlined text-[#adc6ff] text-[24px]">speed</span>
            </div>
          </div>

          <div className="p-2.5 rounded bg-[#262a34]/60 text-[11px] text-[#c2c6d6] flex items-center gap-2 font-mono">
            <span className="material-symbols-outlined text-[16px] text-[#4edea3]">cloud_done</span>
            <span>Routage haute disponibilité : BGP Anycast actif sur 4 PoPs.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
