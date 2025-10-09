import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { activityService } from '@/lib/database'
import { Activity } from '@/lib/types'

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

// Agents send activities to this endpoint
export async function POST(req: NextRequest) {
  try {
    const auth = verifyAgentToken(req)
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { activities } = body

    if (!Array.isArray(activities)) {
      return NextResponse.json({ error: 'Activities must be an array' }, { status: 400 })
    }

    const savedActivities = []

    // Process each activity
    for (const activity of activities) {
      try {
        // Map agent activity to our Activity interface
        const activityData: Omit<Activity, 'id' | 'timestamp'> = {
          employeeId: auth.employeeId,
          agentId: auth.agentId,
          type: mapActivityType(activity.type),
          description: activity.description,
          details: {
            ...activity.metadata,
            originalType: activity.type,
            agentTimestamp: activity.timestamp
          },
          riskLevel: calculateRiskLevel(activity.type, activity.description),
          blocked: false
        }

        const activityId = await activityService.create(activityData)
        savedActivities.push(activityId)
      } catch (error) {
        console.error('Error saving activity:', error)
      }
    }

    console.log(`📊 Saved ${savedActivities.length} activities from agent ${auth.agentId}`)

    return NextResponse.json({
      success: true,
      message: `Saved ${savedActivities.length} activities`,
      savedCount: savedActivities.length
    })

  } catch (error) {
    console.error('Activities POST error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to save activities'
    }, { status: 500 })
  }
}

// Dashboard gets activities (admin endpoint)
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const employeeId = searchParams.get('employeeId')
    const agentId = searchParams.get('agentId')
    const type = searchParams.get('type')
    const riskLevel = searchParams.get('riskLevel')
    const limit = parseInt(searchParams.get('limit') || '50')

    let activities: Activity[]

    if (employeeId) {
      activities = await activityService.getByEmployeeId(employeeId, limit)
    } else if (agentId) {
      activities = await activityService.getByAgentId(agentId, limit)
    } else if (type) {
      activities = await activityService.getByType(type as Activity['type'], limit)
    } else if (riskLevel) {
      activities = await activityService.getByRiskLevel(riskLevel as Activity['riskLevel'], limit)
    } else {
      activities = await activityService.getRecent(limit)
    }

    return NextResponse.json({
      success: true,
      activities,
      count: activities.length
    })

  } catch (error) {
    console.error('Activities GET error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to get activities'
    }, { status: 500 })
  }
}

// Map agent activity types to our standard types
function mapActivityType(agentType: string): Activity['type'] {
  switch (agentType) {
    case 'usb_detected':
      return 'usb_detected'
    case 'file_access':
      return 'file_access'
    case 'network_activity':
      return 'network_activity'
    case 'git_operation':
      return 'git_operation'
    case 'login':
      return 'login'
    case 'application_usage':
      return 'application_usage'
    default:
      return 'application_usage' // Default fallback
  }
}

// Calculate risk level based on activity type and content
function calculateRiskLevel(type: string, description: string): Activity['riskLevel'] {
  const lowerDesc = description.toLowerCase()
  
  // High risk indicators
  if (lowerDesc.includes('password') || 
      lowerDesc.includes('ssh') || 
      lowerDesc.includes('key') ||
      lowerDesc.includes('credential') ||
      type === 'usb_detected') {
    return 'HIGH'
  }
  
  // Medium risk indicators
  if (lowerDesc.includes('download') || 
      lowerDesc.includes('network') ||
      lowerDesc.includes('git') ||
      type === 'network_activity') {
    return 'MEDIUM'
  }
  
  // Low risk by default
  return 'LOW'
}