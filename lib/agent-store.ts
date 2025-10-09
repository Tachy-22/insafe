// Shared in-memory store for agents and commands
// In production, this would be replaced with a real database

export interface Agent {
  id: string
  agentId: string
  hostname: string
  username: string
  macAddress: string
  platform: string
  version: string
  registeredAt: string
  lastSeen: string
  status: 'registered' | 'online' | 'offline' | 'error'
  systemInfo?: Record<string, unknown>
}

export interface Command {
  id: string
  agentId: string
  type: 'disable-usb' | 'enable-usb' | 'block-git' | 'unblock-git' | 'get-status' | 'restart-agent'
  payload?: Record<string, unknown>
  status: 'pending' | 'completed' | 'failed'
  createdAt: string
  completedAt?: string
  result?: unknown
  error?: string
}

export interface Activity {
  id: string
  agentId: string
  type: 'usb_detected' | 'usb_blocked' | 'git_push_blocked' | 'file_access' | 'system_event'
  description: string
  timestamp: string
  metadata?: Record<string, unknown>
}

// Global storage
class AgentStore {
  private agents = new Map<string, Agent>()
  private commands = new Map<string, Command>()
  private activities = new Map<string, Activity>()

  // Agent management
  setAgent(agentId: string, agent: Agent) {
    this.agents.set(agentId, agent)
  }

  getAgent(agentId: string): Agent | undefined {
    return this.agents.get(agentId)
  }

  getAllAgents(): Agent[] {
    return Array.from(this.agents.values())
  }

  deleteAgent(agentId: string): boolean {
    return this.agents.delete(agentId)
  }

  updateAgentStatus(agentId: string, status: Agent['status'], systemInfo?: Record<string, unknown>) {
    const agent = this.agents.get(agentId)
    if (agent) {
      agent.status = status
      agent.lastSeen = new Date().toISOString()
      if (systemInfo) {
        agent.systemInfo = systemInfo
      }
      this.agents.set(agentId, agent)
    }
  }

  // Command management
  setCommand(commandId: string, command: Command) {
    this.commands.set(commandId, command)
  }

  getCommand(commandId: string): Command | undefined {
    return this.commands.get(commandId)
  }

  getAllCommands(): Command[] {
    return Array.from(this.commands.values())
  }

  getCommandsForAgent(agentId: string, status?: Command['status']): Command[] {
    return Array.from(this.commands.values())
      .filter(cmd => cmd.agentId === agentId && (!status || cmd.status === status))
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
  }

  updateCommandStatus(commandId: string, status: Command['status'], result?: unknown, error?: string) {
    const command = this.commands.get(commandId)
    if (command) {
      command.status = status
      command.completedAt = new Date().toISOString()
      if (result !== undefined) command.result = result
      if (error) command.error = error
      this.commands.set(commandId, command)
    }
  }

  // Activity management
  addActivity(activity: Activity) {
    this.activities.set(activity.id, activity)
  }

  getActivitiesForAgent(agentId: string, limit: number = 50): Activity[] {
    return Array.from(this.activities.values())
      .filter(activity => activity.agentId === agentId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit)
  }

  getAllActivities(limit: number = 100): Activity[] {
    return Array.from(this.activities.values())
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit)
  }

  // Statistics
  getStats() {
    const agents = this.getAllAgents()
    const commands = this.getAllCommands()
    const activities = this.getAllActivities()

    const onlineAgents = agents.filter(agent => {
      const lastSeen = new Date(agent.lastSeen)
      const now = new Date()
      const diffMinutes = (now.getTime() - lastSeen.getTime()) / (1000 * 60)
      return diffMinutes < 5 // Consider online if seen within 5 minutes
    })

    const pendingCommands = commands.filter(cmd => cmd.status === 'pending')
    const recentActivities = activities.filter(activity => {
      const timestamp = new Date(activity.timestamp)
      const now = new Date()
      const diffHours = (now.getTime() - timestamp.getTime()) / (1000 * 60 * 60)
      return diffHours < 24 // Activities from last 24 hours
    })

    return {
      totalAgents: agents.length,
      onlineAgents: onlineAgents.length,
      offlineAgents: agents.length - onlineAgents.length,
      totalCommands: commands.length,
      pendingCommands: pendingCommands.length,
      recentActivities: recentActivities.length,
      lastUpdated: new Date().toISOString()
    }
  }

  // Cleanup old data (call this periodically)
  cleanup() {
    const now = new Date()
    
    // Remove old activities (older than 30 days)
    const cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    for (const [id, activity] of this.activities) {
      if (new Date(activity.timestamp) < cutoffDate) {
        this.activities.delete(id)
      }
    }

    // Remove completed commands older than 7 days
    const commandCutoff = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    for (const [id, command] of this.commands) {
      if (command.status !== 'pending' && new Date(command.createdAt) < commandCutoff) {
        this.commands.delete(id)
      }
    }
  }
}

// Singleton instance
const agentStore = new AgentStore()

// Cleanup every hour
setInterval(() => {
  agentStore.cleanup()
}, 60 * 60 * 1000)

export default agentStore