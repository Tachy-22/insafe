import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'
import { agentService, employeeService } from '@/lib/database'
import { Timestamp } from 'firebase/firestore'

// Registration tokens for pre-authorization
const registrationTokens = new Map()

export interface AgentRegistrationRequest {
  hostname: string
  username: string
  macAddress: string
  platform: string
  version: string
  employeeId?: string
  registrationToken?: string
}

export interface AgentRegistrationResponse {
  success: boolean
  agentId?: string
  token?: string
  error?: string
}

// Generate a registration token (admin uses this to pre-authorize agents)
export async function POST(req: NextRequest) {
  try {
    const body: AgentRegistrationRequest = await req.json()
    
    // Validate required fields
    if (!body.hostname || !body.username || !body.macAddress || !body.platform) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: hostname, username, macAddress, platform'
      }, { status: 400 })
    }

    // Check if agent already exists by machine identifier (hostname + macAddress)
    const existingAgent = await agentService.getByMachineIdentifier(body.hostname, body.macAddress)
    
    let agentId: string
    let employeeId = body.employeeId
    
    if (existingAgent) {
      // Update existing agent
      agentId = existingAgent.agentId
      employeeId = existingAgent.employeeId
      console.log(`Updating existing agent: ${body.hostname} (${agentId})`)
    } else {
      // Create new agent
      agentId = uuidv4()
      console.log(`Creating new agent: ${body.hostname} (${agentId})`)
    }
    
    // Find employee by employeeId or create a default one
    if (!employeeId) {
      // Create default employee for this agent
      employeeId = await employeeService.create({
        employeeId: `EMP_${body.username.toUpperCase()}`,
        firstName: body.username,
        lastName: 'Agent User',
        email: `${body.username}@wemabank.com`,
        department: 'IT',
        role: 'Agent User',
        hireDate: Timestamp.now(),
        status: 'ACTIVE',
        riskLevel: 'LOW',
        riskScore: 0,
        lastActivity: Timestamp.now(),
        permissions: []
      });
    }
    
    // Create JWT token for agent authentication
    const token = jwt.sign(
      { 
        agentId, 
        employeeId,
        hostname: body.hostname,
        username: body.username,
        macAddress: body.macAddress 
      },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '365d' } // Long-lived token for agents
    )

    // Register or update agent in Firebase
    if (existingAgent) {
      // Update existing agent
      await agentService.updateAgent(agentId, {
        employeeId,
        hostname: body.hostname,
        platform: body.platform as 'windows' | 'darwin' | 'linux',
        version: body.version || '1.0.0',
        ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown',
        status: 'online',
        lastSeen: Timestamp.now(),
        systemInfo: {
          uptime: 0,
          memory: { total: 0, free: 0 },
          cpu: { count: 0, usage: 0 }
        },
        // Ensure blockedServices field exists with all services
        blockedServices: {
          git: existingAgent.blockedServices?.git || false,
          usb: existingAgent.blockedServices?.usb || false,
          fileUploads: existingAgent.blockedServices?.fileUploads || false,
          emailAttachments: existingAgent.blockedServices?.emailAttachments || false
        }
      })
    } else {
      // Register new agent
      await agentService.register({
        agentId,
        employeeId,
        hostname: body.hostname,
        platform: body.platform as 'windows' | 'darwin' | 'linux',
        version: body.version || '1.0.0',
        macAddress: body.macAddress,
        ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown',
        status: 'online',
        lastSeen: Timestamp.now(),
        systemInfo: {
          uptime: 0,
          memory: { total: 0, free: 0 },
          cpu: { count: 0, usage: 0 }
        },
        capabilities: {
          usbControl: true,
          gitControl: true,
          fileMonitoring: true,
          fileUploadControl: true,
          emailAttachmentControl: true
        },
        blockedServices: {
          git: false,
          usb: false,
          fileUploads: false,
          emailAttachments: false
        }
      })
    }

    console.log(`New agent registered: ${body.hostname} (${agentId})`)

    return NextResponse.json({
      success: true,
      agentId,
      employeeId,
      token,
      serverUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      pollInterval: 30000 // 30 seconds
    })

  } catch (error) {
    console.error('Agent registration error:', error)
    return NextResponse.json({
      success: false,
      error: 'Registration failed'
    }, { status: 500 })
  }
}

// Get registration status or generate registration tokens (admin only)
export async function GET(req: NextRequest) {
  try {
    // This would be admin-only in production
    const searchParams = req.nextUrl.searchParams
    const action = searchParams.get('action')

    if (action === 'generate-token') {
      // Generate a registration token for pre-authorization
      const token = uuidv4()
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
      
      registrationTokens.set(token, {
        token,
        createdAt: new Date().toISOString(),
        expiresAt: expiresAt.toISOString(),
        used: false
      })

      return NextResponse.json({
        success: true,
        registrationToken: token,
        expiresAt: expiresAt.toISOString()
      })
    }

    // Return all registered agents (admin view)
    const agents = await agentService.getAll()
    const onlineAgents = await agentService.getOnlineAgents()
    
    return NextResponse.json({
      success: true,
      agents,
      stats: {
        totalAgents: agents.length,
        onlineAgents: onlineAgents.length,
        offlineAgents: agents.length - onlineAgents.length
      }
    })

  } catch (error) {
    console.error('Agent registration GET error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to process request'
    }, { status: 500 })
  }
}