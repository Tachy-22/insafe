import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { commandService, agentService } from '@/lib/database'
import { Command } from '@/lib/types'

// Command interface is now imported from agent-store

// Verify JWT token from agent
function verifyAgentToken(req: NextRequest): { agentId: string; employeeId: string } | null {
  const authHeader = req.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }

  try {
    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as { agentId: string; employeeId: string }
    return { agentId: decoded.agentId, employeeId: decoded.employeeId }
  } catch {
    return null
  }
}

// Agents poll this endpoint to get new commands
export async function GET(req: NextRequest) {
  try {
    const auth = verifyAgentToken(req)
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { agentId } = auth

    // Update agent last seen
    await agentService.updateStatus(agentId, 'online')

    // Get pending commands for this agent
    const pendingCommands = await commandService.getPendingForAgent(agentId)

    return NextResponse.json({
      success: true,
      commands: pendingCommands,
      count: pendingCommands.length
    })

  } catch (error) {
    console.error('Get commands error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to get commands'
    }, { status: 500 })
  }
}

// Agents report command completion, Dashboard sends new commands
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    
    // Check if this is an agent reporting command completion
    const auth = verifyAgentToken(req)
    if (auth) {
      const { commandId, result, error } = body
      
      if (!commandId) {
        return NextResponse.json({ error: 'commandId required' }, { status: 400 })
      }

      // Get the command to check its type
      const command = await commandService.getById(commandId)
      
      // Update command status
      await commandService.updateStatus(commandId, error ? 'failed' : 'completed', result, error)

      // Update agent blocking state if command succeeded
      if (!error && command) {
        switch (command.type) {
          case 'block-git':
            await agentService.updateBlockingState(auth.agentId, 'git', true)
            break
          case 'unblock-git':
            await agentService.updateBlockingState(auth.agentId, 'git', false)
            break
          case 'disable-usb':
            await agentService.updateBlockingState(auth.agentId, 'usb', true)
            break
          case 'enable-usb':
            await agentService.updateBlockingState(auth.agentId, 'usb', false)
            break
        }
      }

      console.log(`Command ${commandId} completed by agent ${auth.agentId}`)

      return NextResponse.json({
        success: true,
        message: 'Command status updated'
      })
    }

    // Otherwise, this is a dashboard request to send a command
    const { employeeId, agentId, type, payload } = body

    if ((!employeeId && !agentId) || !type) {
      return NextResponse.json({
        error: 'employeeId or agentId, and type required'
      }, { status: 400 })
    }

    // Validate command type
    const validTypes = ['disable-usb', 'enable-usb', 'block-git', 'unblock-git', 'get-status', 'restart-agent']
    if (!validTypes.includes(type)) {
      return NextResponse.json({
        error: 'Invalid command type'
      }, { status: 400 })
    }

    // Find agent by employeeId or agentId
    let targetAgentId = agentId;
    let targetEmployeeId = employeeId;
    
    if (employeeId && !agentId) {
      const agent = await agentService.getByEmployeeId(employeeId);
      if (!agent) {
        return NextResponse.json({
          error: 'No agent found for this employee'
        }, { status: 404 })
      }
      targetAgentId = agent.agentId;
      targetEmployeeId = agent.employeeId;
    } else if (agentId && !employeeId) {
      const agent = await agentService.getByAgentId(agentId);
      if (!agent) {
        return NextResponse.json({
          error: 'Agent not found'
        }, { status: 404 })
      }
      targetEmployeeId = agent.employeeId;
    }

    // Create new command
    const commandId = await commandService.create({
      agentId: targetAgentId,
      employeeId: targetEmployeeId,
      type: type as Command['type'],
      payload,
      status: 'pending',
      issuedBy: 'admin' // TODO: Get from auth token
    })

    console.log(`New command created: ${type} for agent ${agentId}`)

    return NextResponse.json({
      success: true,
      commandId,
      message: 'Command queued successfully'
    })

  } catch (error) {
    console.error('Command POST error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to process command'
    }, { status: 500 })
  }
}