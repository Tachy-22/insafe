import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
 
  query, 
  where, 
  orderBy, 
  limit,
  Timestamp,
  onSnapshot
} from 'firebase/firestore';
import { db } from './firebase';
import { Employee, Agent, Command, Activity, Alert } from './types';

// Collections
const COLLECTIONS = {
  EMPLOYEES: 'employees',
  AGENTS: 'agents', 
  COMMANDS: 'commands',
  ACTIVITIES: 'activities',
  ALERTS: 'alerts',
  ADMIN_USERS: 'adminUsers'
};

// Employee operations
export const employeeService = {
  async getAll(): Promise<Employee[]> {
    const snapshot = await getDocs(collection(db, COLLECTIONS.EMPLOYEES));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Employee));
  },

  async getById(id: string): Promise<Employee | null> {
    const docRef = doc(db, COLLECTIONS.EMPLOYEES, id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as Employee : null;
  },

  async getByEmployeeId(employeeId: string): Promise<Employee | null> {
    const q = query(collection(db, COLLECTIONS.EMPLOYEES), where('employeeId', '==', employeeId));
    const snapshot = await getDocs(q);
    return snapshot.empty ? null : { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Employee;
  },

  async create(employee: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const now = Timestamp.now();
    const docRef = await addDoc(collection(db, COLLECTIONS.EMPLOYEES), {
      ...employee,
      createdAt: now,
      updatedAt: now
    });
    return docRef.id;
  },

  async update(id: string, updates: Partial<Employee>): Promise<void> {
    const docRef = doc(db, COLLECTIONS.EMPLOYEES, id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: Timestamp.now()
    });
  },

  async updateRiskLevel(id: string, riskLevel: Employee['riskLevel'], riskScore: number): Promise<void> {
    await this.update(id, { riskLevel, riskScore });
  }
};

// Agent operations
export const agentService = {
  async getAll(): Promise<Agent[]> {
    const snapshot = await getDocs(collection(db, COLLECTIONS.AGENTS));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Agent));
  },

  async getByEmployeeId(employeeId: string): Promise<Agent | null> {
    const q = query(collection(db, COLLECTIONS.AGENTS), where('employeeId', '==', employeeId));
    const snapshot = await getDocs(q);
    return snapshot.empty ? null : { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Agent;
  },

  async getByAgentId(agentId: string): Promise<Agent | null> {
    const q = query(collection(db, COLLECTIONS.AGENTS), where('agentId', '==', agentId));
    const snapshot = await getDocs(q);
    return snapshot.empty ? null : { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Agent;
  },

  async getByMachineIdentifier(hostname: string, macAddress: string): Promise<Agent | null> {
    const q = query(
      collection(db, COLLECTIONS.AGENTS), 
      where('hostname', '==', hostname),
      where('macAddress', '==', macAddress)
    );
    const snapshot = await getDocs(q);
    return snapshot.empty ? null : { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Agent;
  },

  async register(agent: Omit<Agent, 'id' | 'registeredAt' | 'updatedAt'>): Promise<string> {
    const now = Timestamp.now();
    const docRef = await addDoc(collection(db, COLLECTIONS.AGENTS), {
      ...agent,
      registeredAt: now,
      updatedAt: now
    });
    return docRef.id;
  },

  async updateAgent(agentId: string, updates: Partial<Agent>): Promise<void> {
    const q = query(collection(db, COLLECTIONS.AGENTS), where('agentId', '==', agentId));
    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
      const docRef = doc(db, COLLECTIONS.AGENTS, snapshot.docs[0].id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: Timestamp.now()
      });
    }
  },

  async updateStatus(agentId: string, status: Agent['status'], systemInfo?: Agent['systemInfo']): Promise<void> {
    const q = query(collection(db, COLLECTIONS.AGENTS), where('agentId', '==', agentId));
    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
      const docRef = doc(db, COLLECTIONS.AGENTS, snapshot.docs[0].id);
      const updates: Record<string, unknown> = {
        status,
        lastSeen: Timestamp.now(),
        updatedAt: Timestamp.now()
      };
      
      if (systemInfo) {
        updates.systemInfo = systemInfo;
      }
      
      await updateDoc(docRef, updates);
    }
  },

  async updateBlockingState(agentId: string, service: 'git' | 'usb' | 'fileUploads' | 'emailAttachments', blocked: boolean): Promise<void> {
    const q = query(collection(db, COLLECTIONS.AGENTS), where('agentId', '==', agentId));
    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
      const docRef = doc(db, COLLECTIONS.AGENTS, snapshot.docs[0].id);
      const updates: Record<string, unknown> = {
        [`blockedServices.${service}`]: blocked,
        updatedAt: Timestamp.now()
      };
      
      await updateDoc(docRef, updates);
    }
  },

  async getOnlineAgents(): Promise<Agent[]> {
    const fiveMinutesAgo = Timestamp.fromDate(new Date(Date.now() - 5 * 60 * 1000));
    const q = query(
      collection(db, COLLECTIONS.AGENTS), 
      where('lastSeen', '>=', fiveMinutesAgo),
      where('status', '==', 'online')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Agent));
  }
};

// Command operations
export const commandService = {
  async create(command: Omit<Command, 'id' | 'createdAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, COLLECTIONS.COMMANDS), {
      ...command,
      createdAt: Timestamp.now()
    });
    return docRef.id;
  },

  async getById(commandId: string): Promise<Command | null> {
    const docRef = doc(db, COLLECTIONS.COMMANDS, commandId);
    const snapshot = await getDoc(docRef);
    return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } as Command : null;
  },

  async getPendingForAgent(agentId: string): Promise<Command[]> {
    const q = query(
      collection(db, COLLECTIONS.COMMANDS),
      where('agentId', '==', agentId),
      where('status', '==', 'pending'),
      orderBy('createdAt', 'asc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Command));
  },

  async updateStatus(
    commandId: string, 
    status: Command['status'], 
    result?: unknown, 
    error?: string
  ): Promise<void> {
    const docRef = doc(db, COLLECTIONS.COMMANDS, commandId);
    const updates: Record<string, unknown> = { status };
    
    if (status === 'executing') {
      updates.executedAt = Timestamp.now();
    } else if (status === 'completed' || status === 'failed') {
      updates.completedAt = Timestamp.now();
      if (result) updates.result = result;
      if (error) updates.error = error;
    }
    
    await updateDoc(docRef, updates);
  },

  async getByEmployee(employeeId: string, limitTo = 50): Promise<Command[]> {
    const q = query(
      collection(db, COLLECTIONS.COMMANDS),
      where('employeeId', '==', employeeId),
      orderBy('createdAt', 'desc'),
      limit(limitTo)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Command));
  }
};

// Activity operations
export const activityService = {
  async create(activity: Omit<Activity, 'id' | 'timestamp'>): Promise<string> {
    const docRef = await addDoc(collection(db, COLLECTIONS.ACTIVITIES), {
      ...activity,
      timestamp: Timestamp.now()
    });
    return docRef.id;
  },

  async getByEmployeeId(employeeId: string, limitTo = 100): Promise<Activity[]> {
    const q = query(
      collection(db, COLLECTIONS.ACTIVITIES),
      where('employeeId', '==', employeeId),
      orderBy('timestamp', 'desc'),
      limit(limitTo)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Activity));
  },

  async getByAgentId(agentId: string, limitTo = 100): Promise<Activity[]> {
    const q = query(
      collection(db, COLLECTIONS.ACTIVITIES),
      where('agentId', '==', agentId),
      orderBy('timestamp', 'desc'),
      limit(limitTo)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Activity));
  },

  async getByType(type: Activity['type'], limitTo = 100): Promise<Activity[]> {
    const q = query(
      collection(db, COLLECTIONS.ACTIVITIES),
      where('type', '==', type),
      orderBy('timestamp', 'desc'),
      limit(limitTo)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Activity));
  },

  async getByRiskLevel(riskLevel: Activity['riskLevel'], limitTo = 100): Promise<Activity[]> {
    const q = query(
      collection(db, COLLECTIONS.ACTIVITIES),
      where('riskLevel', '==', riskLevel),
      orderBy('timestamp', 'desc'),
      limit(limitTo)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Activity));
  },

  async getRecent(limitTo = 50): Promise<Activity[]> {
    const q = query(
      collection(db, COLLECTIONS.ACTIVITIES),
      orderBy('timestamp', 'desc'),
      limit(limitTo)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Activity));
  },

  async getHighRisk(limitTo = 20): Promise<Activity[]> {
    const q = query(
      collection(db, COLLECTIONS.ACTIVITIES),
      where('riskLevel', 'in', ['HIGH', 'CRITICAL']),
      orderBy('timestamp', 'desc'),
      limit(limitTo)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Activity));
  }
};

// Alert operations
export const alertService = {
  async create(alert: Omit<Alert, 'id' | 'createdAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, COLLECTIONS.ALERTS), {
      ...alert,
      createdAt: Timestamp.now()
    });
    return docRef.id;
  },

  async getOpen(): Promise<Alert[]> {
    const q = query(
      collection(db, COLLECTIONS.ALERTS),
      where('status', '==', 'open'),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Alert));
  },

  async getCritical(): Promise<Alert[]> {
    const q = query(
      collection(db, COLLECTIONS.ALERTS),
      where('severity', '==', 'CRITICAL'),
      where('status', '==', 'open'),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Alert));
  },

  async updateStatus(alertId: string, status: Alert['status'], assignedTo?: string): Promise<void> {
    const docRef = doc(db, COLLECTIONS.ALERTS, alertId);
    const updates: Record<string, unknown> = { status };
    
    if (assignedTo) updates.assignedTo = assignedTo;
    if (status === 'resolved') updates.resolvedAt = Timestamp.now();
    
    await updateDoc(docRef, updates);
  }
};

// Real-time subscriptions
export const subscriptions = {
  onEmployeesChange(callback: (employees: Employee[]) => void) {
    return onSnapshot(collection(db, COLLECTIONS.EMPLOYEES), (snapshot) => {
      const employees = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Employee));
      callback(employees);
    });
  },

  onAgentsChange(callback: (agents: Agent[]) => void) {
    return onSnapshot(collection(db, COLLECTIONS.AGENTS), (snapshot) => {
      const agents = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Agent));
      callback(agents);
    });
  },

  onAlertsChange(callback: (alerts: Alert[]) => void) {
    const q = query(collection(db, COLLECTIONS.ALERTS), where('status', '==', 'open'));
    return onSnapshot(q, (snapshot) => {
      const alerts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Alert));
      callback(alerts);
    });
  }
};