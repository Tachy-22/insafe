import { Timestamp } from 'firebase/firestore';

export interface Employee {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  role: string;
  hireDate: Timestamp;
  status: 'ACTIVE' | 'SUSPENDED' | 'TERMINATED';
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  riskScore: number;
  lastActivity: Timestamp;
  permissions: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Agent {
  id: string;
  agentId: string;
  employeeId: string; // Links to Employee
  hostname: string;
  platform: 'windows' | 'darwin' | 'linux';
  version: string;
  macAddress: string;
  ipAddress: string;
  status: 'online' | 'offline' | 'error';
  lastSeen: Timestamp;
  systemInfo: {
    uptime: number;
    memory: {
      total: number;
      free: number;
    };
    cpu: {
      count: number;
      usage: number;
    };
  };
  capabilities: {
    usbControl: boolean;
    gitControl: boolean;
    fileMonitoring: boolean;
    fileUploadControl: boolean;
    emailAttachmentControl: boolean;
  };
  // Current blocking states
  blockedServices: {
    git: boolean;
    usb: boolean;
    fileUploads: boolean;
    emailAttachments: boolean;
  };
  registeredAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Command {
  id: string;
  agentId: string;
  employeeId: string;
  type: 'disable-usb' | 'enable-usb' | 'block-git' | 'unblock-git' | 'block-file-uploads' | 'unblock-file-uploads' | 'block-email-attachments' | 'unblock-email-attachments' | 'get-status' | 'restart-agent';
  payload?: Record<string, unknown>;
  status: 'pending' | 'executing' | 'completed' | 'failed';
  issuedBy: string; // Admin user ID
  createdAt: Timestamp;
  executedAt?: Timestamp;
  completedAt?: Timestamp;
  result?: unknown;
  error?: string;
}

export interface Activity {
  id: string;
  employeeId: string;
  agentId: string;
  type: 'file_access' | 'usb_detected' | 'git_operation' | 'login' | 'application_usage' | 'network_activity';
  description: string;
  details: {
    fileName?: string;
    filePath?: string;
    application?: string;
    command?: string;
    size?: number;
    duration?: number;
  };
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  blocked: boolean;
  timestamp: Timestamp;
}

export interface Alert {
  id: string;
  employeeId: string;
  type: 'high_risk_activity' | 'policy_violation' | 'anomalous_behavior' | 'security_breach';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  title: string;
  description: string;
  details: Record<string, unknown>;
  status: 'open' | 'investigating' | 'resolved' | 'false_positive';
  assignedTo?: string;
  createdAt: Timestamp;
  resolvedAt?: Timestamp;
}

export interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'super_admin' | 'admin' | 'analyst';
  permissions: string[];
  createdAt: Timestamp;
  lastLogin: Timestamp;
}