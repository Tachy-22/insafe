'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  AlertTriangle,
  Users,
  Activity,
  Clock,
  Shield,
  Eye,
  Target,
  Zap,
  Brain,
  RefreshCw,
  Download,
  Calendar,
  Filter
} from 'lucide-react';
import { dashboardMetrics, employees, activities, alerts } from '@/lib/dummy-data';
import { toast } from 'sonner';

// Mock advanced analytics data
const threatIntelligence = {
  riskTrends: [
    { date: '2024-10-01', critical: 2, high: 8, medium: 15, low: 25 },
    { date: '2024-10-02', critical: 3, high: 6, medium: 18, low: 28 },
    { date: '2024-10-03', critical: 1, high: 12, medium: 14, low: 32 },
    { date: '2024-10-04', critical: 4, high: 9, medium: 20, low: 27 },
    { date: '2024-10-05', critical: 2, high: 7, medium: 16, low: 30 },
    { date: '2024-10-06', critical: 5, high: 11, medium: 19, low: 25 },
    { date: '2024-10-07', critical: 3, high: 8, medium: 17, low: 29 }
  ],
  behaviorAnalysis: {
    anomalousUsers: 12,
    normalPatterns: 1234,
    riskEscalations: 8,
    patternDeviations: 45
  },
  predictiveInsights: [
    {
      type: 'Data Exfiltration Risk',
      probability: 78,
      description: 'High probability of data exfiltration attempt in IT Operations department',
      timeframe: 'Next 7 days',
      severity: 'HIGH'
    },
    {
      type: 'Insider Threat',
      probability: 65,
      description: 'Unusual access patterns detected in Treasury department',
      timeframe: 'Next 3 days',
      severity: 'MEDIUM'
    },
    {
      type: 'Policy Violation',
      probability: 85,
      description: 'Increased likelihood of USB policy violations',
      timeframe: 'Next 24 hours',
      severity: 'HIGH'
    }
  ]
};

const departmentRiskAnalysis = [
  {
    department: 'IT Operations',
    employees: 45,
    riskScore: 8.2,
    alerts: 12,
    incidents: 3,
    trend: 'up',
    topRisks: ['Data Access', 'System Administration', 'External Communications']
  },
  {
    department: 'Treasury',
    employees: 28,
    riskScore: 7.8,
    alerts: 8,
    incidents: 2,
    trend: 'up',
    topRisks: ['Financial Data', 'External Transfers', 'Document Access']
  },
  {
    department: 'Credit Operations',
    employees: 67,
    riskScore: 6.5,
    alerts: 15,
    incidents: 1,
    trend: 'down',
    topRisks: ['Customer Data', 'Loan Information', 'Credit Reports']
  },
  {
    department: 'Customer Service',
    employees: 156,
    riskScore: 4.2,
    alerts: 6,
    incidents: 0,
    trend: 'stable',
    topRisks: ['Customer Information', 'Call Recordings', 'Personal Data']
  },
  {
    department: 'Compliance',
    employees: 12,
    riskScore: 3.8,
    alerts: 2,
    incidents: 0,
    trend: 'down',
    topRisks: ['Regulatory Data', 'Audit Reports', 'Policy Documents']
  }
];

const behaviorPatterns = [
  {
    pattern: 'After Hours Access',
    occurrences: 89,
    riskLevel: 'HIGH',
    affectedUsers: 12,
    trend: 'increasing'
  },
  {
    pattern: 'Multiple Failed Logins',
    occurrences: 156,
    riskLevel: 'MEDIUM',
    affectedUsers: 23,
    trend: 'stable'
  },
  {
    pattern: 'Large File Downloads',
    occurrences: 34,
    riskLevel: 'HIGH',
    affectedUsers: 8,
    trend: 'increasing'
  },
  {
    pattern: 'External Email Attachments',
    occurrences: 267,
    riskLevel: 'MEDIUM',
    affectedUsers: 45,
    trend: 'decreasing'
  },
  {
    pattern: 'USB Device Usage',
    occurrences: 78,
    riskLevel: 'MEDIUM',
    affectedUsers: 19,
    trend: 'stable'
  }
];

export default function AnalyticsPage() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('7d');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsRefreshing(false);
    toast.success('Analytics data refreshed');
  };

  const handleExportAnalytics = () => {
    toast.success('Analytics exported', {
      description: 'Advanced analytics report has been downloaded'
    });
  };

  const getRiskColor = (score: number) => {
    if (score >= 8) return 'text-red-600';
    if (score >= 6) return 'text-orange-600';
    if (score >= 4) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-red-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-green-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'HIGH':
        return <Badge variant="destructive">High</Badge>;
      case 'MEDIUM':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Medium</Badge>;
      case 'LOW':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Low</Badge>;
      default:
        return <Badge variant="secondary">{severity}</Badge>;
    }
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Advanced Analytics</h1>
          <p className="text-muted-foreground">
            AI-powered threat analytics and behavioral insights
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1d">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="sm" onClick={handleExportAnalytics}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>

          <Button size="sm" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Risk Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">7.2</div>
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 text-red-500" />
              <span>+0.8 from last week</span>
            </div>
            <Progress value={72} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Threat Detection</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">94%</div>
            <p className="text-xs text-muted-foreground">Detection accuracy</p>
            <Progress value={94} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Behavioral Anomalies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 text-red-500" />
              <span>+12 this week</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">ML Model Accuracy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">97.8%</div>
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span>+0.3% improvement</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="predictive" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="predictive">Predictive Analytics</TabsTrigger>
          <TabsTrigger value="behavioral">Behavioral Analysis</TabsTrigger>
          <TabsTrigger value="department">Department Risks</TabsTrigger>
          <TabsTrigger value="patterns">Threat Patterns</TabsTrigger>
        </TabsList>

        {/* Predictive Analytics */}
        <TabsContent value="predictive" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="h-5 w-5 text-purple-600" />
                  <span>AI Threat Predictions</span>
                </CardTitle>
                <CardDescription>Machine learning-based threat forecasting</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {threatIntelligence.predictiveInsights.map((insight, index) => (
                  <div key={index} className="p-4 rounded-lg border">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{insight.type}</h4>
                      {getSeverityBadge(insight.severity)}
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {insight.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Target className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{insight.timeframe}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">{insight.probability}%</div>
                        <div className="text-xs text-muted-foreground">Probability</div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="h-5 w-5 text-yellow-600" />
                  <span>Behavior Anomalies</span>
                </CardTitle>
                <CardDescription>AI-detected unusual behavior patterns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="text-center p-4 rounded-lg border">
                    <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold">{threatIntelligence.behaviorAnalysis.anomalousUsers}</div>
                    <div className="text-sm text-muted-foreground">Anomalous Users</div>
                  </div>
                  <div className="text-center p-4 rounded-lg border">
                    <Activity className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold">{threatIntelligence.behaviorAnalysis.normalPatterns}</div>
                    <div className="text-sm text-muted-foreground">Normal Patterns</div>
                  </div>
                  <div className="text-center p-4 rounded-lg border">
                    <TrendingUp className="h-8 w-8 text-red-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold">{threatIntelligence.behaviorAnalysis.riskEscalations}</div>
                    <div className="text-sm text-muted-foreground">Risk Escalations</div>
                  </div>
                  <div className="text-center p-4 rounded-lg border">
                    <AlertTriangle className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold">{threatIntelligence.behaviorAnalysis.patternDeviations}</div>
                    <div className="text-sm text-muted-foreground">Pattern Deviations</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Behavioral Analysis */}
        <TabsContent value="behavioral" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Behavioral Pattern Analysis</CardTitle>
              <CardDescription>Detected patterns in user behavior across the organization</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {behaviorPatterns.map((pattern, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="flex-1">
                      <h4 className="font-medium">{pattern.pattern}</h4>
                      <p className="text-sm text-muted-foreground">
                        {pattern.occurrences} occurrences • {pattern.affectedUsers} users affected
                      </p>
                    </div>
                    <div className="flex items-center space-x-4">
                      {getSeverityBadge(pattern.riskLevel)}
                      <div className="flex items-center space-x-1">
                        {pattern.trend === 'increasing' ? (
                          <TrendingUp className="h-4 w-4 text-red-500" />
                        ) : pattern.trend === 'decreasing' ? (
                          <TrendingDown className="h-4 w-4 text-green-500" />
                        ) : (
                          <Activity className="h-4 w-4 text-gray-500" />
                        )}
                        <span className="text-sm capitalize">{pattern.trend}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Department Risk Analysis */}
        <TabsContent value="department" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Department Risk Analysis</CardTitle>
              <CardDescription>Risk assessment breakdown by organizational departments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {departmentRiskAnalysis.map((dept, index) => (
                  <div key={index} className="p-4 rounded-lg border">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-lg">{dept.department}</h4>
                        <p className="text-sm text-muted-foreground">
                          {dept.employees} employees • {dept.alerts} active alerts
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-2">
                          <span className={`text-xl font-bold ${getRiskColor(dept.riskScore)}`}>
                            {dept.riskScore}
                          </span>
                          {getTrendIcon(dept.trend)}
                        </div>
                        <div className="text-xs text-muted-foreground">Risk Score</div>
                      </div>
                    </div>
                    
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="text-center p-2 rounded-lg bg-muted/50">
                        <div className="text-lg font-semibold">{dept.alerts}</div>
                        <div className="text-xs text-muted-foreground">Active Alerts</div>
                      </div>
                      <div className="text-center p-2 rounded-lg bg-muted/50">
                        <div className="text-lg font-semibold">{dept.incidents}</div>
                        <div className="text-xs text-muted-foreground">Incidents</div>
                      </div>
                      <div className="text-center p-2 rounded-lg bg-muted/50">
                        <div className="text-lg font-semibold">{dept.employees}</div>
                        <div className="text-xs text-muted-foreground">Employees</div>
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <div className="text-sm font-medium mb-2">Top Risk Areas:</div>
                      <div className="flex flex-wrap gap-1">
                        {dept.topRisks.map((risk, riskIndex) => (
                          <Badge key={riskIndex} variant="outline" className="text-xs">
                            {risk}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Threat Patterns */}
        <TabsContent value="patterns" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Risk Trend Analysis</CardTitle>
                <CardDescription>7-day risk level trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {threatIntelligence.riskTrends.slice(-3).map((trend, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">
                          {new Date(trend.date).toLocaleDateString()}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          Total: {trend.critical + trend.high + trend.medium + trend.low}
                        </span>
                      </div>
                      <div className="flex space-x-1 h-4 rounded-full overflow-hidden bg-muted">
                        <div 
                          className="bg-red-500"
                          style={{ width: `${(trend.critical / (trend.critical + trend.high + trend.medium + trend.low)) * 100}%` }}
                        />
                        <div 
                          className="bg-orange-500"
                          style={{ width: `${(trend.high / (trend.critical + trend.high + trend.medium + trend.low)) * 100}%` }}
                        />
                        <div 
                          className="bg-yellow-500"
                          style={{ width: `${(trend.medium / (trend.critical + trend.high + trend.medium + trend.low)) * 100}%` }}
                        />
                        <div 
                          className="bg-green-500"
                          style={{ width: `${(trend.low / (trend.critical + trend.high + trend.medium + trend.low)) * 100}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Critical: {trend.critical}</span>
                        <span>High: {trend.high}</span>
                        <span>Medium: {trend.medium}</span>
                        <span>Low: {trend.low}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>ML Model Performance</CardTitle>
                <CardDescription>Machine learning model metrics and accuracy</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm">Threat Detection</span>
                      <span className="text-sm font-semibold">97.8%</span>
                    </div>
                    <Progress value={97.8} />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm">False Positive Rate</span>
                      <span className="text-sm font-semibold">2.1%</span>
                    </div>
                    <Progress value={2.1} className="[&>div]:bg-yellow-500" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm">Anomaly Detection</span>
                      <span className="text-sm font-semibold">94.5%</span>
                    </div>
                    <Progress value={94.5} />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm">Prediction Accuracy</span>
                      <span className="text-sm font-semibold">89.2%</span>
                    </div>
                    <Progress value={89.2} />
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="text-sm font-medium mb-2">Model Last Updated</div>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>October 5, 2024 - 14:32 UTC</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}