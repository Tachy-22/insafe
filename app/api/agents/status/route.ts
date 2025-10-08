import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { agentService } from '@/lib/database'

// Verify JWT token from agent
function verifyAgentToken(req: NextRequest): { agentId: string } | null {
  const authHeader = req.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }

  try {
    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any
    return { agentId: decoded.agentId }
  } catch (error) {
    return null
  }
}

// Agents send heartbeat and status updates
export async function POST(req: NextRequest) {
  try {
    const auth = verifyAgentToken(req)
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { agentId } = auth
    const body = await req.json()

    // Update agent status in Firebase
    await agentService.updateStatus(agentId, body.status || 'online', body.systemInfo)

    return NextResponse.json({
      success: true,
      message: 'Status updated'
    })

  } catch (error) {
    console.error('Status update error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to update status'
    }, { status: 500 })
  }
}

// Dashboard gets agent status (admin endpoint)
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const agentId = searchParams.get('agentId')

    if (agentId) {
      // Get specific agent status
      const agent = await agentService.getByAgentId(agentId)
      if (!agent) {
        return NextResponse.json({
          success: false,
          error: 'Agent not found'
        }, { status: 404 })
      }

      return NextResponse.json({
        success: true,
        agent
      })
    }

    // Get all agents status
    const allAgents = await agentService.getAll()
    const onlineAgents = await agentService.getOnlineAgents()

    return NextResponse.json({
      success: true,
      agents: allAgents,
      stats: {
        totalAgents: allAgents.length,
        onlineAgents: onlineAgents.length,
        offlineAgents: allAgents.length - onlineAgents.length
      }
    })

  } catch (error) {
    console.error('Get status error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to get status'
    }, { status: 500 })
  }
}