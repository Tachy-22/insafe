'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Search, 
  Filter, 
  RefreshCw, 
  MoreHorizontal, 
  Eye, 
  AlertTriangle,
  Download,
  Play,
  Pause
} from 'lucide-react';
import { activities, Activity } from '@/lib/dummy-data';
import { toast } from 'sonner';

export default function ActivitiesPage() {
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>(activities);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [riskFilter, setRiskFilter] = useState('ALL');
  const [isRealTime, setIsRealTime] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Simulate real-time updates
  useEffect(() => {
    if (!isRealTime) return;

    const interval = setInterval(() => {
      // In a real app, this would fetch new activities from an API
      // For demo, we'll just show a toast occasionally
      if (Math.random() > 0.95) {
        toast.info('New activity detected', {
          description: 'A new user activity has been logged'
        });
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isRealTime]);

  // Filter activities
  useEffect(() => {
    let filtered = activities;

    if (searchQuery) {
      filtered = filtered.filter(
        activity =>
          activity.employee.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          activity.employee.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          activity.employee.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          activity.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (typeFilter !== 'ALL') {
      filtered = filtered.filter(activity => activity.type === typeFilter);
    }

    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(activity => activity.status === statusFilter);
    }

    if (riskFilter !== 'ALL') {
      if (riskFilter === 'HIGH_RISK') {
        filtered = filtered.filter(activity => activity.riskScore >= 7);
      } else if (riskFilter === 'MEDIUM_RISK') {
        filtered = filtered.filter(activity => activity.riskScore >= 4 && activity.riskScore < 7);
      } else if (riskFilter === 'LOW_RISK') {
        filtered = filtered.filter(activity => activity.riskScore < 4);
      }
    }

    // Sort by timestamp (newest first)
    filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    setFilteredActivities(filtered);
  }, [searchQuery, typeFilter, statusFilter, riskFilter]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
    toast.success('Activities refreshed');
  };

  const handleExport = () => {
    toast.success('Activities exported to CSV', {
      description: 'Download will begin shortly'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'BLOCKED':
        return <Badge variant="destructive" className="text-xs">Blocked</Badge>;
      case 'FLAGGED':
        return <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-800">Flagged</Badge>;
      case 'UNDER_REVIEW':
        return <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-800">Under Review</Badge>;
      case 'ALLOWED':
        return <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">Allowed</Badge>;
      default:
        return <Badge variant="secondary" className="text-xs">{status}</Badge>;
    }
  };

  const getRiskScoreColor = (score: number) => {
    if (score >= 8) return 'text-red-600 font-semibold';
    if (score >= 6) return 'text-orange-600 font-medium';
    if (score >= 4) return 'text-yellow-600';
    return 'text-green-600';
  };


  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex lg:flex-row flex-col items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Activity Monitoring</h1>
          <p className="text-muted-foreground">
            Real-time monitoring of user activities across all systems
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsRealTime(!isRealTime)}
          >
            {isRealTime ? (
              <>
                <Pause className="mr-2 h-4 w-4" />
                Pause Live
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Resume Live
              </>
            )}
          </Button>
          
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          
          <Button size="sm" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activities.length}</div>
            <p className="text-xs text-muted-foreground">Last 24 hours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Blocked Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {activities.filter(a => a.status === 'BLOCKED').length}
            </div>
            <p className="text-xs text-muted-foreground">Potential threats stopped</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">High Risk Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {activities.filter(a => a.riskScore >= 7).length}
            </div>
            <p className="text-xs text-muted-foreground">Score ≥ 7.0</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Under Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {activities.filter(a => a.status === 'UNDER_REVIEW').length}
            </div>
            <p className="text-xs text-muted-foreground">Pending investigation</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filters & Search</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-5">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search activities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Activity Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Types</SelectItem>
                <SelectItem value="EMAIL">Email</SelectItem>
                <SelectItem value="FILE_ACCESS">File Access</SelectItem>
                <SelectItem value="USB_ACCESS">USB Access</SelectItem>
                <SelectItem value="CLOUD_UPLOAD">Cloud Upload</SelectItem>
                <SelectItem value="GITHUB">GitHub</SelectItem>
                <SelectItem value="SYSTEM_LOGIN">System Login</SelectItem>
                <SelectItem value="PRINT">Print</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Status</SelectItem>
                <SelectItem value="ALLOWED">Allowed</SelectItem>
                <SelectItem value="BLOCKED">Blocked</SelectItem>
                <SelectItem value="FLAGGED">Flagged</SelectItem>
                <SelectItem value="UNDER_REVIEW">Under Review</SelectItem>
              </SelectContent>
            </Select>

            <Select value={riskFilter} onValueChange={setRiskFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Risk Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Risk Levels</SelectItem>
                <SelectItem value="HIGH_RISK">High Risk (≥7)</SelectItem>
                <SelectItem value="MEDIUM_RISK">Medium Risk (4-7)</SelectItem>
                <SelectItem value="LOW_RISK">Low Risk (&lt;4)</SelectItem>
              </SelectContent>
            </Select>

            <Button 
              variant="outline" 
              onClick={() => {
                setSearchQuery('');
                setTypeFilter('ALL');
                setStatusFilter('ALL');
                setRiskFilter('ALL');
              }}
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Activities Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Activities</CardTitle>
              <CardDescription>
                Showing {filteredActivities.length} of {activities.length} activities
                {isRealTime && (
                  <Badge variant="secondary" className="ml-2 bg-green-100 text-green-800">
                    Live
                  </Badge>
                )}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Activity</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Risk Score</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredActivities.map((activity) => (
                  <TableRow key={activity.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {activity.employee.firstName} {activity.employee.lastName}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {activity.employee.employeeId}
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="max-w-xs">
                        <div className="text-sm font-medium">{activity.action}</div>
                        <div className="text-xs text-muted-foreground truncate">
                          {activity.description}
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {activity.type.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    
                    <TableCell>
                      <span className={getRiskScoreColor(activity.riskScore)}>
                        {activity.riskScore.toFixed(1)}
                      </span>
                    </TableCell>
                    
                    <TableCell>
                      {getStatusBadge(activity.status)}
                    </TableCell>
                    
                    <TableCell className="text-sm">
                      {new Date(activity.timestamp).toLocaleString()}
                    </TableCell>
                    
                    <TableCell className="text-sm">
                      {activity.location}
                    </TableCell>
                    
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => toast.info('Activity details opened')}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toast.info('Employee profile opened')}>
                            View Employee
                          </DropdownMenuItem>
                          {activity.status === 'FLAGGED' && (
                            <DropdownMenuItem onClick={() => toast.success('Activity marked for investigation')}>
                              <AlertTriangle className="mr-2 h-4 w-4" />
                              Investigate
                            </DropdownMenuItem>
                          )}
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
    </div>
  );
}