export interface Employee {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  role: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'ACTIVE' | 'SUSPENDED' | 'TERMINATED';
  avatar?: string;
  lastActive: string;
  joinDate: string;
  location: string;
  manager: string;
}

export interface Activity {
  id: string;
  employeeId: string;
  employee: {
    firstName: string;
    lastName: string;
    employeeId: string;
  };
  type: 'EMAIL' | 'FILE_ACCESS' | 'USB_ACCESS' | 'CLOUD_UPLOAD' | 'GITHUB' | 'SYSTEM_LOGIN' | 'PRINT';
  action: string;
  description: string;
  timestamp: string;
  riskScore: number;
  location: string;
  ipAddress: string;
  deviceId: string;
  status: 'ALLOWED' | 'BLOCKED' | 'FLAGGED' | 'UNDER_REVIEW';
  metadata: Record<string, any>;
}

export interface Alert {
  id: string;
  employeeId: string;
  employee: {
    firstName: string;
    lastName: string;
    employeeId: string;
  };
  title: string;
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  category: 'DATA_EXFILTRATION' | 'UNUSUAL_ACCESS' | 'POLICY_VIOLATION' | 'SECURITY_BREACH' | 'SUSPICIOUS_BEHAVIOR';
  timestamp: string;
  status: 'OPEN' | 'INVESTIGATING' | 'RESOLVED' | 'FALSE_POSITIVE';
  assignedTo?: string;
  riskScore: number;
  relatedActivities: string[];
}

export interface Restriction {
  id: string;
  employeeId: string;
  employee: {
    firstName: string;
    lastName: string;
    employeeId: string;
  };
  type: 'EMAIL' | 'USB' | 'CLOUD' | 'GITHUB' | 'PRINT' | 'NETWORK' | 'APPLICATIONS';
  service: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'EXPIRED';
  appliedBy: string;
  appliedAt: string;
  expiresAt?: string;
  reason: string;
  severity: 'TEMPORARY' | 'PERMANENT';
}

export interface DashboardMetrics {
  totalEmployees: number;
  activeMonitoring: number;
  riskDistribution: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
  activeAlerts: number;
  blockedActions: number;
  dataExfiltrationAttempts: number;
  complianceScore: number;
  trendsData: {
    date: string;
    activities: number;
    alerts: number;
    blocked: number;
  }[];
}

// Dummy Data
export const employees: Employee[] = [
  {
    id: '1',
    employeeId: 'WB001',
    firstName: 'Adebayo',
    lastName: 'Johnson',
    email: 'adebayo.johnson@wemabank.com',
    department: 'IT Operations',
    role: 'Senior System Administrator',
    riskLevel: 'HIGH',
    status: 'ACTIVE',
    lastActive: '2024-10-07T08:30:00Z',
    joinDate: '2021-03-15',
    location: 'Lagos HQ',
    manager: 'Folake Adeyemi'
  },
  {
    id: '2',
    employeeId: 'WB002',
    firstName: 'Chioma',
    lastName: 'Okafor',
    email: 'chioma.okafor@wemabank.com',
    department: 'Treasury',
    role: 'Treasury Analyst',
    riskLevel: 'MEDIUM',
    status: 'ACTIVE',
    lastActive: '2024-10-07T07:45:00Z',
    joinDate: '2022-08-10',
    location: 'Victoria Island',
    manager: 'Emeka Nwosu'
  },
  {
    id: '3',
    employeeId: 'WB003',
    firstName: 'Babatunde',
    lastName: 'Adebisi',
    email: 'babatunde.adebisi@wemabank.com',
    department: 'Risk Management',
    role: 'Risk Analyst',
    riskLevel: 'LOW',
    status: 'ACTIVE',
    lastActive: '2024-10-07T09:15:00Z',
    joinDate: '2023-01-20',
    location: 'Abuja Branch',
    manager: 'Kemi Ogundipe'
  },
  {
    id: '4',
    employeeId: 'WB004',
    firstName: 'Funmi',
    lastName: 'Bakare',
    email: 'funmi.bakare@wemabank.com',
    department: 'Customer Service',
    role: 'Senior Customer Relations Officer',
    riskLevel: 'MEDIUM',
    status: 'ACTIVE',
    lastActive: '2024-10-07T08:00:00Z',
    joinDate: '2020-11-05',
    location: 'Ikeja Branch',
    manager: 'Tolu Adebayo'
  },
  {
    id: '5',
    employeeId: 'WB005',
    firstName: 'Ibrahim',
    lastName: 'Musa',
    email: 'ibrahim.musa@wemabank.com',
    department: 'Credit Operations',
    role: 'Credit Analyst',
    riskLevel: 'CRITICAL',
    status: 'SUSPENDED',
    lastActive: '2024-10-06T16:30:00Z',
    joinDate: '2019-07-12',
    location: 'Kano Branch',
    manager: 'Aisha Bello'
  },
  {
    id: '6',
    employeeId: 'WB006',
    firstName: 'Grace',
    lastName: 'Okonkwo',
    email: 'grace.okonkwo@wemabank.com',
    department: 'Compliance',
    role: 'Compliance Officer',
    riskLevel: 'LOW',
    status: 'ACTIVE',
    lastActive: '2024-10-07T08:45:00Z',
    joinDate: '2021-12-03',
    location: 'Lagos HQ',
    manager: 'Daniel Okoro'
  }
];

export const activities: Activity[] = [
  {
    id: '1',
    employeeId: '1',
    employee: {
      firstName: 'Adebayo',
      lastName: 'Johnson',
      employeeId: 'WB001'
    },
    type: 'EMAIL',
    action: 'SEND_EXTERNAL_EMAIL',
    description: 'Sent email with sensitive customer data to personal Gmail account',
    timestamp: '2024-10-07T08:25:00Z',
    riskScore: 9.2,
    location: 'Lagos HQ',
    ipAddress: '192.168.1.45',
    deviceId: 'WB-LAPTOP-001',
    status: 'FLAGGED',
    metadata: {
      recipient: 'personal.email@gmail.com',
      attachments: 2,
      classification: 'CONFIDENTIAL'
    }
  },
  {
    id: '2',
    employeeId: '2',
    employee: {
      firstName: 'Chioma',
      lastName: 'Okafor',
      employeeId: 'WB002'
    },
    type: 'USB_ACCESS',
    action: 'USB_INSERT',
    description: 'Connected personal USB drive to workstation',
    timestamp: '2024-10-07T07:40:00Z',
    riskScore: 6.5,
    location: 'Victoria Island',
    ipAddress: '192.168.2.12',
    deviceId: 'WB-DESKTOP-012',
    status: 'BLOCKED',
    metadata: {
      usbId: 'USB-987654321',
      capacity: '64GB',
      filesCopied: 0
    }
  },
  {
    id: '3',
    employeeId: '5',
    employee: {
      firstName: 'Ibrahim',
      lastName: 'Musa',
      employeeId: 'WB005'
    },
    type: 'CLOUD_UPLOAD',
    action: 'GOOGLE_DRIVE_UPLOAD',
    description: 'Attempted to upload loan portfolio spreadsheet to Google Drive',
    timestamp: '2024-10-06T16:20:00Z',
    riskScore: 9.8,
    location: 'Kano Branch',
    ipAddress: '192.168.3.89',
    deviceId: 'WB-LAPTOP-089',
    status: 'BLOCKED',
    metadata: {
      fileName: 'Q3_Loan_Portfolio_Analysis.xlsx',
      fileSize: '25MB',
      classification: 'RESTRICTED'
    }
  },
  {
    id: '4',
    employeeId: '3',
    employee: {
      firstName: 'Babatunde',
      lastName: 'Adebisi',
      employeeId: 'WB003'
    },
    type: 'FILE_ACCESS',
    action: 'FILE_DOWNLOAD',
    description: 'Downloaded customer credit reports from internal database',
    timestamp: '2024-10-07T09:10:00Z',
    riskScore: 4.2,
    location: 'Abuja Branch',
    ipAddress: '192.168.4.25',
    deviceId: 'WB-WORKSTATION-025',
    status: 'ALLOWED',
    metadata: {
      fileName: 'Credit_Reports_Batch_001.pdf',
      recordCount: 150,
      accessReason: 'Routine risk assessment'
    }
  },
  {
    id: '5',
    employeeId: '1',
    employee: {
      firstName: 'Adebayo',
      lastName: 'Johnson',
      employeeId: 'WB001'
    },
    type: 'GITHUB',
    action: 'REPOSITORY_CREATE',
    description: 'Created private repository containing internal system configurations',
    timestamp: '2024-10-07T08:15:00Z',
    riskScore: 7.8,
    location: 'Lagos HQ',
    ipAddress: '192.168.1.45',
    deviceId: 'WB-LAPTOP-001',
    status: 'UNDER_REVIEW',
    metadata: {
      repositoryName: 'wema-core-config-backup',
      visibility: 'private',
      filesCommitted: 23
    }
  }
];

export const alerts: Alert[] = [
  {
    id: '1',
    employeeId: '5',
    employee: {
      firstName: 'Ibrahim',
      lastName: 'Musa',
      employeeId: 'WB005'
    },
    title: 'Potential Data Exfiltration Attempt',
    description: 'Employee attempted multiple unauthorized cloud uploads of sensitive financial data within 24 hours',
    severity: 'CRITICAL',
    category: 'DATA_EXFILTRATION',
    timestamp: '2024-10-06T16:25:00Z',
    status: 'INVESTIGATING',
    assignedTo: 'Security Team Lead',
    riskScore: 9.8,
    relatedActivities: ['3', '8', '12']
  },
  {
    id: '2',
    employeeId: '1',
    employee: {
      firstName: 'Adebayo',
      lastName: 'Johnson',
      employeeId: 'WB001'
    },
    title: 'Suspicious External Email Activity',
    description: 'Sending confidential customer data to personal email accounts',
    severity: 'HIGH',
    category: 'POLICY_VIOLATION',
    timestamp: '2024-10-07T08:30:00Z',
    status: 'OPEN',
    assignedTo: 'Compliance Officer',
    riskScore: 9.2,
    relatedActivities: ['1', '15']
  },
  {
    id: '3',
    employeeId: '2',
    employee: {
      firstName: 'Chioma',
      lastName: 'Okafor',
      employeeId: 'WB002'
    },
    title: 'Unauthorized USB Device Usage',
    description: 'Multiple attempts to use personal storage devices during restricted hours',
    severity: 'MEDIUM',
    category: 'POLICY_VIOLATION',
    timestamp: '2024-10-07T07:45:00Z',
    status: 'RESOLVED',
    assignedTo: 'IT Security',
    riskScore: 6.5,
    relatedActivities: ['2', '7']
  },
  {
    id: '4',
    employeeId: '4',
    employee: {
      firstName: 'Funmi',
      lastName: 'Bakare',
      employeeId: 'WB004'
    },
    title: 'Unusual Access Pattern Detected',
    description: 'Accessing customer records outside normal working hours and department scope',
    severity: 'HIGH',
    category: 'UNUSUAL_ACCESS',
    timestamp: '2024-10-07T02:30:00Z',
    status: 'OPEN',
    riskScore: 8.1,
    relatedActivities: ['11', '14']
  }
];

export const restrictions: Restriction[] = [
  {
    id: '1',
    employeeId: '5',
    employee: {
      firstName: 'Ibrahim',
      lastName: 'Musa',
      employeeId: 'WB005'
    },
    type: 'CLOUD',
    service: 'All Cloud Storage Services',
    status: 'ACTIVE',
    appliedBy: 'Security Admin',
    appliedAt: '2024-10-06T17:00:00Z',
    reason: 'Multiple data exfiltration attempts detected',
    severity: 'PERMANENT'
  },
  {
    id: '2',
    employeeId: '1',
    employee: {
      firstName: 'Adebayo',
      lastName: 'Johnson',
      employeeId: 'WB001'
    },
    type: 'EMAIL',
    service: 'External Email Attachments',
    status: 'ACTIVE',
    appliedBy: 'Compliance Officer',
    appliedAt: '2024-10-07T09:00:00Z',
    expiresAt: '2024-10-14T09:00:00Z',
    reason: 'Sending confidential data to personal accounts',
    severity: 'TEMPORARY'
  },
  {
    id: '3',
    employeeId: '2',
    employee: {
      firstName: 'Chioma',
      lastName: 'Okafor',
      employeeId: 'WB002'
    },
    type: 'USB',
    service: 'Personal USB Devices',
    status: 'ACTIVE',
    appliedBy: 'IT Security',
    appliedAt: '2024-10-07T08:00:00Z',
    expiresAt: '2024-10-10T08:00:00Z',
    reason: 'Unauthorized device usage during restricted hours',
    severity: 'TEMPORARY'
  },
  {
    id: '4',
    employeeId: '4',
    employee: {
      firstName: 'Funmi',
      lastName: 'Bakare',
      employeeId: 'WB004'
    },
    type: 'NETWORK',
    service: 'After Hours Network Access',
    status: 'ACTIVE',
    appliedBy: 'Security Team Lead',
    appliedAt: '2024-10-07T03:00:00Z',
    expiresAt: '2024-10-21T03:00:00Z',
    reason: 'Unusual access patterns outside business hours',
    severity: 'TEMPORARY'
  }
];

export const dashboardMetrics: DashboardMetrics = {
  totalEmployees: 1247,
  activeMonitoring: 1195,
  riskDistribution: {
    low: 876,
    medium: 245,
    high: 89,
    critical: 37
  },
  activeAlerts: 23,
  blockedActions: 156,
  dataExfiltrationAttempts: 8,
  complianceScore: 94.2,
  trendsData: [
    { date: '2024-10-01', activities: 2340, alerts: 12, blocked: 89 },
    { date: '2024-10-02', activities: 2156, alerts: 15, blocked: 76 },
    { date: '2024-10-03', activities: 2589, alerts: 8, blocked: 124 },
    { date: '2024-10-04', activities: 2234, alerts: 18, blocked: 91 },
    { date: '2024-10-05', activities: 1987, alerts: 6, blocked: 67 },
    { date: '2024-10-06', activities: 2678, alerts: 25, blocked: 203 },
    { date: '2024-10-07', activities: 1876, alerts: 14, blocked: 95 }
  ]
};

// Helper functions
export const getEmployeeById = (id: string): Employee | undefined => {
  return employees.find(emp => emp.id === id);
};

export const getActivitiesByEmployeeId = (employeeId: string): Activity[] => {
  return activities.filter(activity => activity.employeeId === employeeId);
};

export const getAlertsByEmployeeId = (employeeId: string): Alert[] => {
  return alerts.filter(alert => alert.employeeId === employeeId);
};

export const getRestrictionsByEmployeeId = (employeeId: string): Restriction[] => {
  return restrictions.filter(restriction => restriction.employeeId === employeeId);
};

export const getRecentActivities = (limit: number = 10): Activity[] => {
  return activities
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, limit);
};

export const getCriticalAlerts = (): Alert[] => {
  return alerts.filter(alert => alert.severity === 'CRITICAL' && alert.status !== 'RESOLVED');
};

export const getHighRiskEmployees = (): Employee[] => {
  return employees.filter(emp => emp.riskLevel === 'HIGH' || emp.riskLevel === 'CRITICAL');
};