'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  FileText, 
  Download, 
  Calendar as CalendarIcon, 
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  Shield,
  Activity,
  BarChart3,
  PieChart,
  Filter,
  Search,
  RefreshCw
} from 'lucide-react';
import { format } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { cn } from '@/lib/utils';
import { dashboardMetrics, employees, activities, alerts } from '@/lib/dummy-data';
import { toast } from 'sonner';

const reportTypes = [
  {
    id: 'compliance',
    name: 'Compliance Report',
    description: 'Regulatory compliance and audit trail',
    icon: Shield,
    frequency: 'Monthly',
    lastGenerated: '2024-10-01',
    size: '2.4 MB',
    status: 'Ready'
  },
  {
    id: 'security-summary',
    name: 'Security Summary',
    description: 'Overall security posture and incidents',
    icon: AlertTriangle,
    frequency: 'Weekly',
    lastGenerated: '2024-10-07',
    size: '1.8 MB',
    status: 'Ready'
  },
  {
    id: 'employee-activity',
    name: 'Employee Activity Report',
    description: 'Detailed user activity analysis',
    icon: Users,
    frequency: 'Daily',
    lastGenerated: '2024-10-07',
    size: '5.2 MB',
    status: 'Ready'
  },
  {
    id: 'risk-assessment',
    name: 'Risk Assessment Report',
    description: 'Risk levels and threat analysis',
    icon: BarChart3,
    frequency: 'Monthly',
    lastGenerated: '2024-10-01',
    size: '3.1 MB',
    status: 'Ready'
  },
  {
    id: 'incident-response',
    name: 'Incident Response Report',
    description: 'Security incidents and response times',
    icon: Clock,
    frequency: 'As needed',
    lastGenerated: '2024-09-28',
    size: '1.2 MB',
    status: 'Ready'
  },
  {
    id: 'data-exfiltration',
    name: 'Data Exfiltration Report',
    description: 'Attempted and successful data breaches',
    icon: FileText,
    frequency: 'Monthly',
    lastGenerated: '2024-10-01',
    size: '856 KB',
    status: 'Ready'
  }
];

const complianceMetrics = [
  {
    standard: 'CBN Guidelines',
    compliance: 94,
    requirements: 45,
    met: 42,
    pending: 3,
    status: 'Good'
  },
  {
    standard: 'NDPR',
    compliance: 89,
    requirements: 28,
    met: 25,
    pending: 3,
    status: 'Good'
  },
  {
    standard: 'ISO 27001',
    compliance: 92,
    requirements: 114,
    met: 105,
    pending: 9,
    status: 'Good'
  },
  {
    standard: 'PCI DSS',
    compliance: 87,
    requirements: 12,
    met: 10,
    pending: 2,
    status: 'Needs Attention'
  }
];

export default function ReportsPage() {
  const [selectedDateRange, setSelectedDateRange] = useState<DateRange | undefined>({
    from: new Date(2024, 9, 1), // October 1, 2024
    to: new Date()
  });
  const [selectedReportType, setSelectedReportType] = useState('all');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateReport = async (reportId: string) => {
    setIsGenerating(true);
    
    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsGenerating(false);
    toast.success('Report generated successfully', {
      description: 'The report has been generated and is ready for download'
    });
  };

  const handleDownloadReport = (reportName: string) => {
    toast.success('Download started', {
      description: `${reportName} is being downloaded`
    });
  };

  const handleScheduleReport = (reportId: string) => {
    toast.success('Report scheduled', {
      description: 'Automated report generation has been configured'
    });
  };

  const getComplianceColor = (percentage: number) => {
    if (percentage >= 95) return 'text-green-600';
    if (percentage >= 85) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Good':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Good</Badge>;
      case 'Needs Attention':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Needs Attention</Badge>;
      case 'Critical':
        return <Badge variant="destructive">Critical</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Reports & Analytics</h1>
          <p className="text-muted-foreground">
            Generate compliance reports and security analytics
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter Reports
          </Button>
          
          <Button size="sm" onClick={() => toast.info('Refreshing reports...')}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Report Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportTypes.length}</div>
            <p className="text-xs text-muted-foreground">Available report types</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Generated This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">47</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Compliance Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">91%</div>
            <Progress value={91} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Scheduled Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">Automated generation</p>
          </CardContent>
        </Card>
      </div>

      {/* Compliance Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Compliance Overview</CardTitle>
          <CardDescription>Regulatory compliance status across different standards</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Standard</TableHead>
                  <TableHead>Compliance %</TableHead>
                  <TableHead>Requirements</TableHead>
                  <TableHead>Met</TableHead>
                  <TableHead>Pending</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {complianceMetrics.map((metric) => (
                  <TableRow key={metric.standard}>
                    <TableCell className="font-medium">{metric.standard}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <span className={`font-semibold ${getComplianceColor(metric.compliance)}`}>
                          {metric.compliance}%
                        </span>
                        <Progress value={metric.compliance} className="w-16 h-2" />
                      </div>
                    </TableCell>
                    <TableCell>{metric.requirements}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>{metric.met}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4 text-yellow-600" />
                        <span>{metric.pending}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(metric.status)}
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleGenerateReport(`compliance-${metric.standard.toLowerCase()}`)}
                      >
                        <FileText className="mr-1 h-3 w-3" />
                        Generate
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Report Generation */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Generate Custom Report</CardTitle>
            <CardDescription>Create reports for specific date ranges and criteria</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Report Type</label>
              <Select value={selectedReportType} onValueChange={setSelectedReportType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Activities</SelectItem>
                  <SelectItem value="security">Security Incidents</SelectItem>
                  <SelectItem value="compliance">Compliance Audit</SelectItem>
                  <SelectItem value="risk">Risk Assessment</SelectItem>
                  <SelectItem value="employee">Employee Activity</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Date Range</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !selectedDateRange && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDateRange?.from ? (
                      selectedDateRange.to ? (
                        <>
                          {format(selectedDateRange.from, 'LLL dd, y')} -{' '}
                          {format(selectedDateRange.to, 'LLL dd, y')}
                        </>
                      ) : (
                        format(selectedDateRange.from, 'LLL dd, y')
                      )
                    ) : (
                      <span>Pick a date range</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={selectedDateRange?.from}
                    selected={selectedDateRange}
                    onSelect={setSelectedDateRange}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <Button 
              className="w-full" 
              onClick={() => handleGenerateReport('custom')}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <FileText className="mr-2 h-4 w-4" />
                  Generate Report
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity Summary</CardTitle>
            <CardDescription>Key metrics from the last 30 days</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-3 rounded-lg border">
                <div className="flex items-center space-x-2">
                  <Activity className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">Total Activities</span>
                </div>
                <div className="text-2xl font-bold mt-1">2,847</div>
                <div className="text-xs text-muted-foreground">
                  <TrendingUp className="inline h-3 w-3 mr-1" />
                  +15% from last month
                </div>
              </div>

              <div className="p-3 rounded-lg border">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <span className="text-sm font-medium">Security Alerts</span>
                </div>
                <div className="text-2xl font-bold mt-1">23</div>
                <div className="text-xs text-muted-foreground">
                  <TrendingDown className="inline h-3 w-3 mr-1" />
                  -8% from last month
                </div>
              </div>

              <div className="p-3 rounded-lg border">
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-orange-600" />
                  <span className="text-sm font-medium">Blocked Actions</span>
                </div>
                <div className="text-2xl font-bold mt-1">156</div>
                <div className="text-xs text-muted-foreground">
                  <TrendingUp className="inline h-3 w-3 mr-1" />
                  +22% from last month
                </div>
              </div>

              <div className="p-3 rounded-lg border">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">High Risk Users</span>
                </div>
                <div className="text-2xl font-bold mt-1">12</div>
                <div className="text-xs text-muted-foreground">
                  <TrendingUp className="inline h-3 w-3 mr-1" />
                  +3 from last month
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Available Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Available Reports</CardTitle>
          <CardDescription>Pre-configured reports ready for generation and download</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {reportTypes.map((report) => {
              const IconComponent = report.icon;
              return (
                <div key={report.id} className="p-4 rounded-lg border">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <IconComponent className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{report.name}</h3>
                      <p className="text-sm text-muted-foreground">{report.description}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-xs text-muted-foreground mb-4">
                    <div className="flex justify-between">
                      <span>Frequency:</span>
                      <span>{report.frequency}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Last Generated:</span>
                      <span>{report.lastGenerated}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Size:</span>
                      <span>{report.size}</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleDownloadReport(report.name)}
                    >
                      <Download className="mr-1 h-3 w-3" />
                      Download
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleScheduleReport(report.id)}
                    >
                      <Clock className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}