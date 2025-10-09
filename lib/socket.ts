import { Server as NetServer } from 'http'
import { NextApiResponse } from 'next'
import { Server as SocketIOServer } from 'socket.io'
import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'

export type NextApiResponseServerIO = NextApiResponse & {
  socket: {
    server: NetServer & {
      io: SocketIOServer
    }
  }
}

export interface Agent {
  id: string
  agentId: string
  hostname: string
  username: string
  macAddress: string
  platform: string
  version: string
  lastSeen: Date
  status: 'online' | 'offline' | 'error'
  socketId?: string
}

export interface Command {
  id: string
  agentId: string
  type: 'disable-usb' | 'enable-usb' | 'block-git' | 'unblock-git' | 'get-status' | 'restart-agent'
  payload?: Record<string, unknown>
  status: 'pending' | 'sent' | 'completed' | 'failed'
  createdAt: Date
  completedAt?: Date
  result?: unknown
  error?: string
}

// In-memory storage (you can replace with database later)
export const agents = new Map<string, Agent>()
export const commands = new Map<string, Command>()
export const agentSockets = new Map<string, string>() // agentId -> socketId

export function initializeSocketIO(server: NetServer): SocketIOServer {
  const io = new SocketIOServer(server, {
    path: '/api/socketio',
    addTrailingSlash: false,
    cors: {
      origin: process.env.NODE_ENV === 'production' 
        ? ['https://your-vercel-app.vercel.app'] 
        : ['http://localhost:3000'],
      methods: ['GET', 'POST']
    }
  })

  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token
      if (!token) {
        return next(new Error('Authentication error'))
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as Record<string, unknown>
      socket.data.agentId = decoded.agentId
      socket.data.agent = decoded
      next()
    } catch {
      next(new Error('Authentication error'))
    }
  })

  io.on('connection', (socket) => {
    const agentId = socket.data.agentId
    console.log(`Agent connected: ${agentId}`)

    // Register agent connection
    agentSockets.set(agentId, socket.id)
    
    // Update agent status
    const agent = agents.get(agentId)
    if (agent) {
      agent.status = 'online'
      agent.lastSeen = new Date()
      agent.socketId = socket.id
      agents.set(agentId, agent)
    }

    // Send pending commands
    const pendingCommands = Array.from(commands.values())
      .filter(cmd => cmd.agentId === agentId && cmd.status === 'pending')
    
    pendingCommands.forEach(command => {
      socket.emit('command', command)
      command.status = 'sent'
      commands.set(command.id, command)
    })

    // Handle agent responses
    socket.on('command-response', (data: { commandId: string, result?: unknown, error?: string }) => {
      const command = commands.get(data.commandId)
      if (command) {
        command.status = data.error ? 'failed' : 'completed'
        command.completedAt = new Date()
        command.result = data.result
        command.error = data.error
        commands.set(command.id, command)
      }
    })

    // Handle activity reports
    socket.on('activity-report', (activity: Record<string, unknown>) => {
      console.log(`Activity from ${agentId}:`, activity)
      // TODO: Store activity in database
    })

    // Handle heartbeat
    socket.on('heartbeat', (data: { status: string, systemInfo?: Record<string, unknown> }) => {
      const agent = agents.get(agentId)
      if (agent) {
        agent.lastSeen = new Date()
        agent.status = data.status as 'online' | 'offline' | 'error'
        agents.set(agentId, agent)
      }
    })

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log(`Agent disconnected: ${agentId}`)
      agentSockets.delete(agentId)
      
      const agent = agents.get(agentId)
      if (agent) {
        agent.status = 'offline'
        agent.socketId = undefined
        agents.set(agentId, agent)
      }
    })
  })

  return io
}

// Helper functions for sending commands
export function sendCommandToAgent(agentId: string, type: Command['type'], payload?: Record<string, unknown>): string {
  const command: Command = {
    id: uuidv4(),
    agentId,
    type,
    payload,
    status: 'pending',
    createdAt: new Date()
  }

  commands.set(command.id, command)

  // If agent is online, send immediately
  const socketId = agentSockets.get(agentId)
  if (socketId && (global as any).io) {
    (global as any).io.to(socketId).emit('command', command)
    command.status = 'sent'
    commands.set(command.id, command)
  }

  return command.id
}

export function getAgentStatus(agentId: string): Agent | undefined {
  return agents.get(agentId)
}

export function getAllAgents(): Agent[] {
  return Array.from(agents.values())
}

export function getCommandStatus(commandId: string): Command | undefined {
  return commands.get(commandId)
}