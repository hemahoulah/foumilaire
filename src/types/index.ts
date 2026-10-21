export type ActiveTab = 'connexion' | 'sante-reseau' | 'politique-acces' | 'console';

export interface AdminUser {
  identifier: string;
  displayName: string;
  role: 'Super Administrateur' | 'Analyste SOC' | 'Ingénieur SRE' | 'Auditeur Sécurité';
  email: string;
  lastLogin: string;
  ipAddress: string;
  fidoTokenName: string;
  tokenFingerprint: string;
}

export interface BastionSession {
  id: string;
  targetName: string;
  targetType: 'Kubernetes' | 'PostgreSQL' | 'Linux SSH' | 'HSM Enclave' | 'RDP';
  address: string;
  role: string;
  startedAt: string;
  ttlMinutes: number;
  remainingSeconds: number;
  status: 'active' | 'warning' | 'terminated';
  recordingEnabled: boolean;
  user: string;
  activeCommandsCount: number;
}

export interface SocNode {
  id: string;
  code: string;
  city: string;
  country: string;
  role: 'Passerelle Primaire' | 'Nœud de Secours' | 'Enclave HSM' | 'Proxy Edge Inspection';
  status: 'nominal' | 'degraded' | 'maintenance';
  latencyMs: number;
  uptime: string;
  cipherSuite: string;
  tlsVersion: 'TLS 1.3' | 'mTLS 1.3';
  activeSessions: number;
  throughputMbps: number;
}

export interface JitRequest {
  id: string;
  requester: string;
  resource: string;
  durationMinutes: number;
  justification: string;
  requestedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  event: string;
  node: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  details: string;
}

export interface AccessPolicyRule {
  id: string;
  role: string;
  resource: string;
  requireMfa: boolean;
  maxSessionMinutes: number;
  dualCustodyRequired: boolean;
  sessionRecorded: boolean;
  ipWhitelist: string;
}
