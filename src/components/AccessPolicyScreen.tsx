import React, { useState } from 'react';
import { AccessPolicyRule } from '../types';

const INITIAL_RULES: AccessPolicyRule[] = [
  {
    id: 'POL-01',
    role: 'Super Administrateur',
    resource: 'Toutes ressources d infrastructure (K8s, DB, Bastion)',
    requireMfa: true,
    maxSessionMinutes: 60,
    dualCustodyRequired: true,
    sessionRecorded: true,
    ipWhitelist: '192.168.1.0/24 (VLAN Administration)',
  },
  {
    id: 'POL-02',
    role: 'Analyste SOC (Incident Handler)',
    resource: 'Passerelles de télémétrie, Révocation de sessions',
    requireMfa: true,
    maxSessionMinutes: 120,
    dualCustodyRequired: false,
    sessionRecorded: true,
    ipWhitelist: '192.168.10.0/24 (VLAN SOC)',
  },
  {
    id: 'POL-03',
    role: 'Ingénieur SRE (DevOps)',
    resource: 'Clusters Kubernetes de staging / Cache Redis',
    requireMfa: true,
    maxSessionMinutes: 30,
    dualCustodyRequired: true,
    sessionRecorded: true,
    ipWhitelist: 'VPN Zero Trust WireGuard avec posture EDR',
  },
  {
    id: 'POL-04',
    role: 'Auditeur Sécurité & RGPD',
    resource: 'Journaux d audit scellés RFC 3161 (Lecture seule)',
    requireMfa: true,
    maxSessionMinutes: 240,
    dualCustodyRequired: false,
    sessionRecorded: false,
    ipWhitelist: '10.0.50.0/24 (VLAN Audit)',
  },
];

export const AccessPolicyScreen: React.FC = () => {
  const [rules] = useState<AccessPolicyRule[]>(INITIAL_RULES);
  const [selectedRole, setSelectedRole] = useState('Ingénieur SRE (DevOps)');
  const [selectedTarget, setSelectedTarget] = useState('PostgreSQL Production (Clients)');
  const [devicePosture, setDevicePosture] = useState<'compliant' | 'untrusted'>('compliant');
  const [timeContext, setTimeContext] = useState<'business_hours' | 'off_hours'>('off_hours');
  const [simVerdict, setSimVerdict] = useState<{
    allowed: boolean;
    verdict: string;
    ruleMatched: string;
    controlsRequired: string[];
  } | null>(null);

  const evaluatePolicy = (e: React.FormEvent) => {
    e.preventDefault();

    if (devicePosture === 'untrusted') {
      setSimVerdict({
        allowed: false,
        verdict: 'ACCÈS REFUSÉ (DENY) - Posture de sécurité insuffisante',
        ruleMatched: 'Règle Zero Trust ZT-DEV-09 : Échec d intégrité EDR',
        controlsRequired: [
          'Le poste client ne respecte pas les prérequis de sécurité (Agent EDR manquant ou non à jour)',
          'Connexion depuis un terminal non enrôlé strictement proscrite par la norme ISO/IEC 27001',
        ],
      });
      return;
    }

    if (selectedTarget.includes('Production') && selectedRole.includes('SRE') && timeContext === 'off_hours') {
      setSimVerdict({
        allowed: false,
        verdict: 'ÉLÉVATION REQUISE (JIT PENDING) - Approbation 4-Yeux nécessaire',
        ruleMatched: 'Règle PAM PAM-JIT-44 : Accès production hors heures ouvrées',
        controlsRequired: [
          'Création d une demande Just-In-Time avec justification d incident (ex: ticket Jira/ServiceNow)',
          'Validation obligatoire par un membre de l équipe Super Administrateur ou SOC',
          'Enregistrement vidéo de la session et analyse des frappes clavier',
        ],
      });
      return;
    }

    setSimVerdict({
      allowed: true,
      verdict: 'ACCÈS AUTORISÉ (ALLOW) - Conditions Zero Trust remplies',
      ruleMatched: 'Règle PAM PAM-STD-02 : Accès nominal',
      controlsRequired: [
        'Validation par clé physique FIDO2 requise avant chaque commande privilégiée',
        'Durée maximale de session : 30 minutes (Renouvellement automatique désactivé)',
        'Journalisation immuable dans le SIEM d entreprise',
      ],
    });
  };

  const handleExportComplianceReport = () => {
    const reportData = {
      standard: 'ISO/IEC 27001:2022 & RGPD Art. 32',
      applet: 'AegisGate Privileged Access Gateway',
      evaluatedAt: new Date().toISOString(),
      controls: [
        { id: 'A.9.1.1', control: 'Politique de contrôle d accès', status: 'CONFORME' },
        { id: 'A.9.2.1', control: 'Enregistrement et désenregistrement des utilisateurs', status: 'CONFORME' },
        { id: 'A.9.2.6', control: 'Suppression ou modification des droits d accès', status: 'CONFORME' },
        { id: 'A.9.4.2', control: 'Procédures d ouverture de session sécurisée (FIDO2 / MFA)', status: 'CONFORME' },
        { id: 'A.9.4.3', control: 'Système de gestion des mots de passe et clés éphémères', status: 'CONFORME' },
        { id: 'A.9.4.4', control: 'Utilisation de programmes utilitaires à privilèges (PAM Bastion)', status: 'CONFORME' },
        { id: 'RGPD-32.1.a', control: 'Pseudonymisation et chiffrement des données à caractère personnel (E2EE)', status: 'CONFORME' },
      ],
      rules,
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(reportData, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute('href', dataStr);
    dlAnchor.setAttribute('download', `aegisgate-conformite-iso27001-${Date.now()}.json`);
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    dlAnchor.remove();
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 lg:px-6 py-6 flex flex-col gap-6">
      {/* Title */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#31353f] text-[#4edea3] mb-2">
            <span className="w-2 h-2 rounded-full bg-[#4edea3] animate-pulse"></span>
            <span className="font-mono text-[11px] tracking-wider uppercase font-medium">
              Gouvernance Zero Trust & PAM
            </span>
          </div>
          <h1 className="text-2xl font-semibold text-[#dfe2ef]">
            Politique d'Accès & Contrôle des Privilèges
          </h1>
          <p className="text-xs text-[#8c909f] mt-0.5">
            Matrice de contrôle d'accès logique (RBAC/ABAC), exigences MFA matérielles et conformité ISO/IEC 27001.
          </p>
        </div>

        <button
          onClick={handleExportComplianceReport}
          className="px-4 py-2.5 rounded-lg bg-[#adc6ff] text-[#002e6a] hover:bg-[#d8e2ff] font-medium text-xs transition-all flex items-center gap-2 cursor-pointer shadow-md"
        >
          <span className="material-symbols-outlined text-[18px]">verified</span>
          <span>Télécharger le rapport de conformité (JSON)</span>
        </button>
      </div>

      {/* Access Control Policy Matrix */}
      <div className="bg-[#181b25] border border-[#424754]/40 rounded-xl p-5 shadow-md flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-[#dfe2ef] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#adc6ff] text-[20px]">
              policy
            </span>
            Matrice des Règles PAM Actives
          </h3>
          <span className="font-mono text-xs text-[#4edea3]">
            4 règles en vigueur
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono border-collapse">
            <thead>
              <tr className="border-b border-[#424754]/40 text-[#8c909f]">
                <th className="py-2.5 px-3">Règle</th>
                <th className="py-2.5 px-3">Rôle Assigné</th>
                <th className="py-2.5 px-3">Périmètre / Ressources</th>
                <th className="py-2.5 px-3">FIDO2 Requis</th>
                <th className="py-2.5 px-3">TTL Max</th>
                <th className="py-2.5 px-3">4-Yeux</th>
                <th className="py-2.5 px-3">Enregistrement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#424754]/20 text-[#dfe2ef]">
              {rules.map((rule) => (
                <tr key={rule.id} className="hover:bg-[#1c1f29]/80 transition-colors">
                  <td className="py-3 px-3 font-bold text-[#adc6ff]">{rule.id}</td>
                  <td className="py-3 px-3 font-sans font-medium">{rule.role}</td>
                  <td className="py-3 px-3 text-[#c2c6d6]">{rule.resource}</td>
                  <td className="py-3 px-3">
                    <span className="text-[#4edea3] flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">check_circle</span>
                      Oui
                    </span>
                  </td>
                  <td className="py-3 px-3 text-[#adc6ff]">{rule.maxSessionMinutes} min</td>
                  <td className="py-3 px-3">
                    {rule.dualCustodyRequired ? (
                      <span className="text-[#ffb4ab]">Obligatoire</span>
                    ) : (
                      <span className="text-[#8c909f]">Optionnel</span>
                    )}
                  </td>
                  <td className="py-3 px-3">
                    {rule.sessionRecorded ? (
                      <span className="text-[#4edea3] font-sans">Actif (REC)</span>
                    ) : (
                      <span className="text-[#8c909f]">Désactivé</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive Policy Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Simulator Form */}
        <div className="bg-[#181b25] border border-[#424754]/40 rounded-xl p-5 shadow-md flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#4edea3] text-[20px]">
              science
            </span>
            <h3 className="text-sm font-semibold text-[#dfe2ef]">
              Simulateur d'Accès Zero Trust (Moteur de Décision)
            </h3>
          </div>
          <p className="text-xs text-[#8c909f]">
            Testez l'application des règles de gouvernance PAM en fonction de l'identité, du contexte horaire et de la santé du terminal.
          </p>

          <form onSubmit={evaluatePolicy} className="flex flex-col gap-3 text-xs">
            <div className="flex flex-col gap-1">
              <label className="text-[#8c909f] font-mono">Identité / Rôle demandeur :</label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="bg-[#0a0e17] border border-[#424754] text-[#dfe2ef] px-3 py-2 rounded-lg outline-none focus:border-[#adc6ff]"
              >
                <option value="Super Administrateur">Super Administrateur (Root)</option>
                <option value="Ingénieur SRE (DevOps)">Ingénieur SRE (DevOps)</option>
                <option value="Analyste SOC (Incident Handler)">Analyste SOC (Incident Handler)</option>
                <option value="Auditeur Sécurité & RGPD">Auditeur Sécurité & RGPD</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[#8c909f] font-mono">Ressource cible :</label>
              <select
                value={selectedTarget}
                onChange={(e) => setSelectedTarget(e.target.value)}
                className="bg-[#0a0e17] border border-[#424754] text-[#dfe2ef] px-3 py-2 rounded-lg outline-none focus:border-[#adc6ff]"
              >
                <option value="PostgreSQL Production (Clients)">PostgreSQL Production (Données Clients)</option>
                <option value="k8s-prod-eu-west-01 (Cluster Core)">k8s-prod-eu-west-01 (Cluster Core)</option>
                <option value="redis-cache-prod-02">redis-cache-prod-02 (Cache temporaire)</option>
                <option value="audit-logs-glacier-read">audit-logs-glacier-read (Journaux d audit)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[#8c909f] font-mono">Posture du poste client :</label>
                <select
                  value={devicePosture}
                  onChange={(e) => setDevicePosture(e.target.value as any)}
                  className="bg-[#0a0e17] border border-[#424754] text-[#dfe2ef] px-3 py-2 rounded-lg outline-none focus:border-[#adc6ff]"
                >
                  <option value="compliant">Poste conforme & EDR actif</option>
                  <option value="untrusted">Poste non managé / Inconnu</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[#8c909f] font-mono">Plage horaire :</label>
                <select
                  value={timeContext}
                  onChange={(e) => setTimeContext(e.target.value as any)}
                  className="bg-[#0a0e17] border border-[#424754] text-[#dfe2ef] px-3 py-2 rounded-lg outline-none focus:border-[#adc6ff]"
                >
                  <option value="business_hours">Heures ouvrées (08h - 19h)</option>
                  <option value="off_hours">Hors heures ouvrées (Nuit / WE)</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="mt-2 py-2.5 px-4 rounded-lg bg-[#adc6ff] text-[#002e6a] hover:bg-[#d8e2ff] font-medium transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <span className="material-symbols-outlined text-[18px]">play_arrow</span>
              <span>Évaluer la décision Zero Trust</span>
            </button>
          </form>
        </div>

        {/* Simulator Verdict Card */}
        <div className="bg-[#181b25] border border-[#424754]/40 rounded-xl p-5 shadow-md flex flex-col justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-[#adc6ff] text-[20px]">
                gavel
              </span>
              <h3 className="text-sm font-semibold text-[#dfe2ef]">
                Résultat de l'Évaluation
              </h3>
            </div>

            {simVerdict ? (
              <div className="flex flex-col gap-3">
                <div
                  className={`p-3.5 rounded-lg border font-mono text-xs font-bold flex items-center gap-2 ${
                    simVerdict.allowed
                      ? 'bg-[#003824] border-[#4edea3]/40 text-[#4edea3]'
                      : simVerdict.verdict.includes('PENDING')
                      ? 'bg-[#3131c0]/20 border-[#adc6ff]/40 text-[#adc6ff]'
                      : 'bg-[#93000a]/20 border-[#ffb4ab]/40 text-[#ffdad6]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {simVerdict.allowed ? 'check_circle' : simVerdict.verdict.includes('PENDING') ? 'hourglass_top' : 'cancel'}
                  </span>
                  <span>{simVerdict.verdict}</span>
                </div>

                <div className="text-xs text-[#8c909f] font-mono">
                  Déclencheur : <strong className="text-[#dfe2ef]">{simVerdict.ruleMatched}</strong>
                </div>

                <div className="flex flex-col gap-1.5 mt-2">
                  <span className="text-xs font-semibold text-[#dfe2ef]">Contrôles appliqués :</span>
                  {simVerdict.controlsRequired.map((ctrl, i) => (
                    <div key={i} className="text-xs text-[#c2c6d6] flex items-start gap-2 bg-[#0a0e17] p-2 rounded border border-[#424754]/30">
                      <span className="material-symbols-outlined text-[16px] text-[#4edea3] shrink-0 mt-0.5">
                        arrow_right
                      </span>
                      <span>{ctrl}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-48 flex flex-col items-center justify-center text-center p-6 text-[#8c909f] border border-dashed border-[#424754]/40 rounded-lg">
                <span className="material-symbols-outlined text-[32px] text-[#424754] mb-2">
                  flaky
                </span>
                <span className="text-xs">
                  Sélectionnez les paramètres et cliquez sur "Évaluer la décision Zero Trust" pour tester le comportement du pare-feu applicatif PAM.
                </span>
              </div>
            )}
          </div>

          <div className="p-3 rounded bg-[#0a0e17] border border-[#424754]/40 text-[11px] text-[#8c909f] font-mono">
            Conforme RGPD Art. 32 (Traçabilité stricte) & ISO/IEC 27001 Mesure A.9.4.2
          </div>
        </div>
      </div>
    </div>
  );
};
