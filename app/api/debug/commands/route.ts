import { NextRequest, NextResponse } from 'next/server'
import { commandService, agentService } from '@/lib/database'

// Debug endpoint to check commands
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const agentId = searchParams.get('agentId')
    
    if (agentId) {
      // Get pending commands for specific agent
      const pendingCommands = await commandService.getPendingForAgent(agentId)
      return NextResponse.json({
        success: true,
        agentId,
        pendingCommands,
        count: pendingCommands.length
      })
    } else {
      // Get all agents and their pending commands
      const agents = await agentService.getAll()
      const debugInfo = []
      
      for (const agent of agents) {
        const pendingCommands = await commandService.getPendingForAgent(agent.agentId)
        debugInfo.push({
          agentId: agent.agentId,
          employeeId: agent.employeeId,
          hostname: agent.hostname,
          status: agent.status,
          lastSeen: agent.lastSeen,
          pendingCommands,
          pendingCount: pendingCommands.length
        })
      }
      
      return NextResponse.json({
        success: true,
        agents: debugInfo,
        totalAgents: agents.length
      })
    }
  } catch (error) {
    console.error('Debug commands error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to get debug info'
    }, { status: 500 })
  }
}