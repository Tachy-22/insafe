'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Activity, 
  AlertTriangle, 
  Shield, 
  Monitor,
  Clock,
  ArrowUpRight,
  Circle
} from 'lucide-react';
import { employeeService, agentService, alertService, activityService } from '@/lib/database';
import { Employee, Agent, Alert, Activity as ActivityType } from '@/lib/types';
import Link from 'next/link';
import { toast } from 'sonner';
import { useAuth } from '@/lib/auth-context';

export default function DashboardPage() {
  const { user } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [activities, setActivities] = useState<ActivityType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      const [employeesData, agentsData, alertsData, activitiesData] = await Promise.all([
        employeeService.getAll(),
        agentService.getAll(),
        alertService.getOpen(),
        activityService.getRecent(10)
      ]);

      setEmployees(employeesData);
      setAgents(agentsData);
      setAlerts(alertsData);
      setActivities(activitiesData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const onlineAgents = agents.filter(agent => {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    return agent.lastSeen.toDate() > fiveMinutesAgo && agent.status === 'online';
  });

  const criticalAlerts = alerts.filter(alert => alert.severity === 'CRITICAL');
  const highRiskEmployees = employees.filter(emp => emp.riskLevel === 'HIGH' || emp.riskLevel === 'CRITICAL');


  if (!user) {
    return <div>Please log in to access the dashboard.</div>;
  }

  if (loading) {
    return <div className="flex-1 space-y-6 p-6">
      <div className="text-center">Loading dashboard...</div>
    </div>;
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">InSafe Security Dashboard</h1>
          <p className="text-muted-foreground">
            Real-time insider threat monitoring for Wema Bank Nigeria
          </p>
        </div>
        
        <Button onClick={loadDashboardData}>
          <Activity className="mr-2 h-4 w-4" />
          Refresh Data
        </Button>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{employees.length}</div>
            <p className="text-xs text-muted-foreground">Under monitoring</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Online Agents</CardTitle>
            <Monitor className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{onlineAgents.length}</div>
            <p className="text-xs text-muted-foreground">
              {agents.length > 0 ? `${((onlineAgents.length / agents.length) * 100).toFixed(1)}% online` : 'No agents'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{alerts.length}</div>
            <p className="text-xs text-muted-foreground">
              {criticalAlerts.length} critical
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Risk Users</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{highRiskEmployees.length}</div>
            <p className="text-xs text-muted-foreground">
              Require attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities & Online Agents */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Activities</CardTitle>
              <CardDescription>Latest security events</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/activities">
                View All <ArrowUpRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {activities.length === 0 ? (
              <p className="text-sm text-muted-foreground">No recent activities</p>
            ) : (
              activities.slice(0, 5).map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg border">
                  <div className="flex-shrink-0">
                    <Activity className="h-4 w-4 text-muted-foreground mt-0.5" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">{activity.description}</p>
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{activity.timestamp.toDate().toLocaleString()}</span>
                      <Badge 
                        variant={activity.blocked ? 'destructive' : 'secondary'}
                        className="text-xs"
                      >
                        {activity.blocked ? 'Blocked' : activity.riskLevel}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Online Agents</CardTitle>
              <CardDescription>Active endpoint monitoring</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/employees">
                Manage <ArrowUpRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {onlineAgents.length === 0 ? (
              <p className="text-sm text-muted-foreground">No agents online</p>
            ) : (
              onlineAgents.slice(0, 5).map((agent) => {
                const employee = employees.find(emp => emp.id === agent.employeeId);
                return (
                  <div key={agent.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center space-x-3">
                      <Circle className="w-3 h-3 text-green-500 fill-current" />
                      <div>
                        <p className="text-sm font-medium">{agent.hostname}</p>
                        <p className="text-xs text-muted-foreground">
                          {employee ? `${employee.firstName} ${employee.lastName}` : 'Unknown User'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Badge variant="outline" className="text-xs">
                        {agent.platform}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {agent.lastSeen.toDate().toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      </div>

      {/* Critical Alerts */}
      {criticalAlerts.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Critical Alerts</CardTitle>
              <CardDescription>High-priority security incidents</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/alerts">
                View All <ArrowUpRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {criticalAlerts.slice(0, 3).map((alert) => {
              const employee = employees.find(emp => emp.id === alert.employeeId);
              return (
                <div key={alert.id} className="flex items-start space-x-3 p-3 rounded-lg border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/30">
                  <AlertTriangle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-medium">{alert.title}</p>
                      <Badge variant="destructive" className="text-xs">
                        {alert.severity}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{alert.description}</p>
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <span>{employee ? `${employee.firstName} ${employee.lastName}` : 'Unknown User'}</span>
                      <span>•</span>
                      <span>{alert.createdAt.toDate().toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}
    </div>
  );
}