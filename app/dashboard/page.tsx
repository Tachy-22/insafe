'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  Activity, 
  AlertTriangle, 
  Shield, 
  TrendingUp,
  Clock,
  FileText,
  Eye,
  ArrowUpRight
} from 'lucide-react';
import { dashboardMetrics, getRecentActivities, getCriticalAlerts, getHighRiskEmployees } from '@/lib/dummy-data';
import Link from 'next/link';
import { toast } from 'sonner';

// Chart component placeholder - in a real app you'd use recharts
function MiniChart({ data, type: _type = 'line' }: { data: { value: number }[], type?: string }) {
  return (
    <div className="h-16 w-full bg-muted/20 rounded flex items-end justify-between px-1">
      {data.slice(-7).map((item, index) => (
        <div 
          key={index}
          className="bg-primary/60 w-2 rounded-t"
          style={{ height: `${(item.activities / 3000) * 100}%` }}
        />
      ))}
    </div>
  );
}

export default function DashboardPage() {
  const [metrics, setMetrics] = useState(dashboardMetrics);
  const [recentActivities] = useState(getRecentActivities(5));
  const [criticalAlerts] = useState(getCriticalAlerts());
  const [highRiskEmployees] = useState(getHighRiskEmployees());
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate new activities
      setMetrics(prev => ({
        ...prev,
        activeAlerts: prev.activeAlerts + Math.floor(Math.random() * 3) - 1,
        blockedActions: prev.blockedActions + Math.floor(Math.random() * 5)
      }));
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    
    // Simulate API refresh
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsRefreshing(false);
    toast.success('Dashboard data refreshed');
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'CRITICAL': return 'bg-red-500';
      case 'HIGH': return 'bg-orange-500';
      case 'MEDIUM': return 'bg-yellow-500';
      case 'LOW': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };


  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Insider Threat Monitoring</h1>
          <p className="text-muted-foreground">
            Real-time monitoring and threat detection for Wema Bank Nigeria
          </p>
        </div>
        
        <Button onClick={handleRefresh} disabled={isRefreshing}>
          <Activity className="mr-2 h-4 w-4" />
          {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
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
            <div className="text-2xl font-bold">{metrics.totalEmployees.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +2.1% from last month
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Monitoring</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.activeMonitoring.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {((metrics.activeMonitoring / metrics.totalEmployees) * 100).toFixed(1)}% coverage
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{metrics.activeAlerts}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +15% from yesterday
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance Score</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{metrics.complianceScore}%</div>
            <Progress value={metrics.complianceScore} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Risk Distribution & Activity Chart */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Risk Distribution</CardTitle>
            <CardDescription>Employee risk levels across the organization</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-sm">Low Risk</span>
                </div>
                <div className="text-sm font-medium">{metrics.riskDistribution.low}</div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <span className="text-sm">Medium Risk</span>
                </div>
                <div className="text-sm font-medium">{metrics.riskDistribution.medium}</div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-orange-500" />
                  <span className="text-sm">High Risk</span>
                </div>
                <div className="text-sm font-medium">{metrics.riskDistribution.high}</div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="text-sm">Critical Risk</span>
                </div>
                <div className="text-sm font-medium">{metrics.riskDistribution.critical}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Activity Trends</CardTitle>
            <CardDescription>7-day activity overview</CardDescription>
          </CardHeader>
          <CardContent>
            <MiniChart data={metrics.trendsData} />
            <div className="flex items-center justify-between mt-4 text-sm">
              <div>
                <span className="text-muted-foreground">Blocked: </span>
                <span className="font-medium text-red-600">{metrics.blockedActions}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Exfiltration Attempts: </span>
                <span className="font-medium text-orange-600">{metrics.dataExfiltrationAttempts}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities & Critical Alerts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Activities</CardTitle>
              <CardDescription>Latest user activities requiring attention</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/activities">
                View All <ArrowUpRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg border">
                <div className="flex-shrink-0">
                  <Activity className="h-4 w-4 text-muted-foreground mt-0.5" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium">
                      {activity.employee.firstName} {activity.employee.lastName}
                    </p>
                    <Badge variant="outline" className="text-xs">
                      {activity.employee.employeeId}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{activity.description}</p>
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{new Date(activity.timestamp).toLocaleString()}</span>
                    <Badge 
                      variant={activity.status === 'BLOCKED' ? 'destructive' : 'secondary'}
                      className="text-xs"
                    >
                      {activity.status}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

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
            {criticalAlerts.slice(0, 3).map((alert) => (
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
                    <span>{alert.employee.firstName} {alert.employee.lastName}</span>
                    <span>•</span>
                    <span>{new Date(alert.timestamp).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* High Risk Employees */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>High Risk Employees</CardTitle>
            <CardDescription>Employees requiring immediate attention</CardDescription>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/employees">
              View All <ArrowUpRight className="ml-1 h-3 w-3" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {highRiskEmployees.slice(0, 4).map((employee) => (
              <div key={employee.id} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${getRiskLevelColor(employee.riskLevel)}`} />
                  <div>
                    <p className="text-sm font-medium">
                      {employee.firstName} {employee.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {employee.department} • {employee.role}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge 
                    variant={employee.riskLevel === 'CRITICAL' ? 'destructive' : 'secondary'}
                    className="text-xs"
                  >
                    {employee.riskLevel} RISK
                  </Badge>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/dashboard/employees/${employee.id}`}>
                      <Eye className="h-3 w-3" />
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}