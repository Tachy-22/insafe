'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  AlertTriangle, 
  Search, 
  Filter, 
  RefreshCw, 
  MoreHorizontal, 
  Eye, 
  CheckCircle,
  XCircle,
  Clock,
  User,
  Shield,
  Bell,
  TrendingUp,
  AlertCircle,
  Ban,
  MessageSquare
} from 'lucide-react';
import { alerts, Alert } from '@/lib/dummy-data';
import { toast } from 'sonner';

const alertCategories = [
  { value: 'DATA_EXFILTRATION', label: 'Data Exfiltration', color: 'bg-red-500', icon: AlertTriangle },
  { value: 'UNUSUAL_ACCESS', label: 'Unusual Access', color: 'bg-orange-500', icon: Eye },
  { value: 'POLICY_VIOLATION', label: 'Policy Violation', color: 'bg-yellow-500', icon: Shield },
  { value: 'SECURITY_BREACH', label: 'Security Breach', color: 'bg-red-600', icon: Ban },
  { value: 'SUSPICIOUS_BEHAVIOR', label: 'Suspicious Behavior', color: 'bg-purple-500', icon: AlertCircle }
];

export default function AlertsPage() {
  const [filteredAlerts, setFilteredAlerts] = useState<Alert[]>(alerts);
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [investigationNotes, setInvestigationNotes] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Simulate real-time alerts
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.98) {
        toast.error('New Critical Alert', {
          description: 'A high-severity security incident has been detected'
        });
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // Filter alerts
  useEffect(() => {
    let filtered = alerts;

    if (searchQuery) {
      filtered = filtered.filter(
        alert =>
          alert.employee.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          alert.employee.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          alert.employee.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          alert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          alert.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (severityFilter !== 'ALL') {
      filtered = filtered.filter(alert => alert.severity === severityFilter);
    }

    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(alert => alert.status === statusFilter);
    }

    if (categoryFilter !== 'ALL') {
      filtered = filtered.filter(alert => alert.category === categoryFilter);
    }

    // Sort by timestamp and severity
    filtered.sort((a, b) => {
      const severityOrder = { 'CRITICAL': 4, 'HIGH': 3, 'MEDIUM': 2, 'LOW': 1 };
      if (a.severity !== b.severity) {
        return severityOrder[b.severity] - severityOrder[a.severity];
      }
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });

    setFilteredAlerts(filtered);
  }, [searchQuery, severityFilter, statusFilter, categoryFilter]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
    toast.success('Alerts refreshed');
  };

  const handleStatusChange = (alertId: string, newStatus: string) => {
    const alert = alerts.find(a => a.id === alertId);
    if (alert) {
      toast.success(`Alert status updated to ${newStatus}`, {
        description: `Alert for ${alert.employee.firstName} ${alert.employee.lastName} updated`
      });
    }
  };

  const handleAssignAlert = (alertId: string) => {
    const alert = alerts.find(a => a.id === alertId);
    if (alert) {
      toast.success('Alert assigned', {
        description: `Alert has been assigned to Security Team Lead`
      });
    }
  };

  const handleViewDetails = (alert: Alert) => {
    setSelectedAlert(alert);
    setIsDetailsOpen(true);
    setInvestigationNotes('');
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return <Badge variant="destructive" className="text-xs">Critical</Badge>;
      case 'HIGH':
        return <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-800">High</Badge>;
      case 'MEDIUM':
        return <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-800">Medium</Badge>;
      case 'LOW':
        return <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">Low</Badge>;
      default:
        return <Badge variant="secondary" className="text-xs">{severity}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'OPEN':
        return <Badge variant="destructive" className="text-xs">Open</Badge>;
      case 'INVESTIGATING':
        return <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-800">Investigating</Badge>;
      case 'RESOLVED':
        return <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">Resolved</Badge>;
      case 'FALSE_POSITIVE':
        return <Badge variant="outline" className="text-xs">False Positive</Badge>;
      default:
        return <Badge variant="secondary" className="text-xs">{status}</Badge>;
    }
  };

  const getCategoryIcon = (category: string) => {
    const cat = alertCategories.find(c => c.value === category);
    if (cat) {
      const IconComponent = cat.icon;
      return <IconComponent className="h-4 w-4 text-muted-foreground" />;
    }
    return <AlertTriangle className="h-4 w-4 text-muted-foreground" />;
  };

  const getAlertAge = (timestamp: string) => {
    const now = new Date();
    const alertTime = new Date(timestamp);
    const diffInHours = Math.floor((now.getTime() - alertTime.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Less than 1 hour ago';
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Security Alerts</h1>
          <p className="text-muted-foreground">
            Monitor and investigate security incidents and threats
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Bell className="mr-2 h-4 w-4" />
            Configure Notifications
          </Button>
          
          <Button size="sm" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Alert Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{alerts.length}</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Critical/High</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {alerts.filter(a => a.severity === 'CRITICAL' || a.severity === 'HIGH').length}
            </div>
            <p className="text-xs text-muted-foreground">Require immediate attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Open Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {alerts.filter(a => a.status === 'OPEN' || a.status === 'INVESTIGATING').length}
            </div>
            <p className="text-xs text-muted-foreground">Under investigation</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Resolution Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {Math.round((alerts.filter(a => a.status === 'RESOLVED').length / alerts.length) * 100)}%
            </div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +5% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Alert Categories */}
      <Card>
        <CardHeader>
          <CardTitle>Alert Categories</CardTitle>
          <CardDescription>Distribution of alerts by threat type</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-5">
            {alertCategories.map((category) => {
              const count = alerts.filter(a => a.category === category.value).length;
              return (
                <div key={category.value} className="flex items-center space-x-3 p-3 rounded-lg border">
                  <div className={`w-3 h-3 rounded-full ${category.color}`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{category.label}</p>
                    <p className="text-xs text-muted-foreground">{count} alerts</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filter Alerts</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-5">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search alerts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Severities</SelectItem>
                <SelectItem value="CRITICAL">Critical</SelectItem>
                <SelectItem value="HIGH">High</SelectItem>
                <SelectItem value="MEDIUM">Medium</SelectItem>
                <SelectItem value="LOW">Low</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Status</SelectItem>
                <SelectItem value="OPEN">Open</SelectItem>
                <SelectItem value="INVESTIGATING">Investigating</SelectItem>
                <SelectItem value="RESOLVED">Resolved</SelectItem>
                <SelectItem value="FALSE_POSITIVE">False Positive</SelectItem>
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Categories</SelectItem>
                {alertCategories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button 
              variant="outline" 
              onClick={() => {
                setSearchQuery('');
                setSeverityFilter('ALL');
                setStatusFilter('ALL');
                setCategoryFilter('ALL');
              }}
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Alerts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Active Alerts</CardTitle>
          <CardDescription>
            Showing {filteredAlerts.length} of {alerts.length} alerts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Alert</TableHead>
                  <TableHead>Employee</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Risk Score</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAlerts.map((alert) => (
                  <TableRow key={alert.id}>
                    <TableCell>
                      <div className="max-w-xs">
                        <div className="font-medium text-sm">{alert.title}</div>
                        <div className="text-xs text-muted-foreground truncate">
                          {alert.description}
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium text-sm">
                            {alert.employee.firstName} {alert.employee.lastName}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {alert.employee.employeeId}
                          </div>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getCategoryIcon(alert.category)}
                        <span className="text-sm">
                          {alertCategories.find(c => c.value === alert.category)?.label || alert.category}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell>
                      {getSeverityBadge(alert.severity)}
                    </TableCell>

                    <TableCell>
                      {getStatusBadge(alert.status)}
                    </TableCell>

                    <TableCell>
                      <span className={`font-medium ${
                        alert.riskScore >= 8 ? 'text-red-600' :
                        alert.riskScore >= 6 ? 'text-orange-600' :
                        alert.riskScore >= 4 ? 'text-yellow-600' :
                        'text-green-600'
                      }`}>
                        {alert.riskScore.toFixed(1)}
                      </span>
                    </TableCell>

                    <TableCell className="text-sm">
                      {getAlertAge(alert.timestamp)}
                    </TableCell>

                    <TableCell className="text-sm">
                      {alert.assignedTo || (
                        <span className="text-muted-foreground italic">Unassigned</span>
                      )}
                    </TableCell>

                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewDetails(alert)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          
                          {alert.status === 'OPEN' && (
                            <DropdownMenuItem onClick={() => handleStatusChange(alert.id, 'INVESTIGATING')}>
                              <Clock className="mr-2 h-4 w-4" />
                              Start Investigation
                            </DropdownMenuItem>
                          )}
                          
                          {!alert.assignedTo && (
                            <DropdownMenuItem onClick={() => handleAssignAlert(alert.id)}>
                              <User className="mr-2 h-4 w-4" />
                              Assign to Me
                            </DropdownMenuItem>
                          )}
                          
                          {alert.status !== 'RESOLVED' && (
                            <DropdownMenuItem onClick={() => handleStatusChange(alert.id, 'RESOLVED')}>
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Mark Resolved
                            </DropdownMenuItem>
                          )}
                          
                          <DropdownMenuItem onClick={() => handleStatusChange(alert.id, 'FALSE_POSITIVE')}>
                            <XCircle className="mr-2 h-4 w-4" />
                            False Positive
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Alert Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <span>Alert Details</span>
            </DialogTitle>
          </DialogHeader>
          
          {selectedAlert && (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label className="text-sm font-medium">Severity</Label>
                  <div className="mt-1">
                    {getSeverityBadge(selectedAlert.severity)}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <div className="mt-1">
                    {getStatusBadge(selectedAlert.status)}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Risk Score</Label>
                  <div className="mt-1 text-lg font-semibold">
                    {selectedAlert.riskScore.toFixed(1)}/10
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Category</Label>
                  <div className="mt-1">
                    {alertCategories.find(c => c.value === selectedAlert.category)?.label}
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Employee</Label>
                <div className="mt-1 p-3 rounded-lg border">
                  <div className="font-medium">
                    {selectedAlert.employee.firstName} {selectedAlert.employee.lastName}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    ID: {selectedAlert.employee.employeeId}
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Description</Label>
                <div className="mt-1 p-3 rounded-lg border bg-muted/50">
                  {selectedAlert.description}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Related Activities</Label>
                <div className="mt-1 text-sm text-muted-foreground">
                  {selectedAlert.relatedActivities.length} related activities found
                </div>
              </div>

              <div>
                <Label htmlFor="notes" className="text-sm font-medium">Investigation Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Add investigation notes..."
                  value={investigationNotes}
                  onChange={(e) => setInvestigationNotes(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>
                  Close
                </Button>
                <Button onClick={() => {
                  toast.success('Investigation notes saved');
                  setIsDetailsOpen(false);
                }}>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Save Notes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}