'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Search,
  Filter,
  RefreshCw,
  Shield,
  AlertTriangle,
  Activity as ActivityIcon,
  TrendingUp,
  Clock,
  Eye,
  Users,
  Usb,
  GitBranch,
  Network,
  FileText,
  LogIn,
  Monitor,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { activityService } from '@/lib/database';
import { Activity } from '@/lib/types';
import { toast } from 'sonner';
import { useAuth } from '@/lib/auth-context';
import { Timestamp } from 'firebase/firestore';

// Type for handling both Firestore Timestamp and serialized timestamp objects
type TimestampType = Timestamp | { seconds: number; nanoseconds: number } | Date | string;

const activityTypeIcons = {
  'file_access': FileText,
  'usb_detected': Usb,
  'git_operation': GitBranch,
  'login': LogIn,
  'application_usage': Monitor,
  'network_activity': Network
};

const activityTypeLabels = {
  'file_access': 'File Access',
  'usb_detected': 'USB Device',
  'git_operation': 'Git Operation',
  'login': 'User Login',
  'application_usage': 'Application',
  'network_activity': 'Network Activity'
};

export default function ActivitiesPage() {
  const { user } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [riskFilter, setRiskFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [chartTimePeriod, setChartTimePeriod] = useState<'min' | 'hour' | 'day'>('hour');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);

  useEffect(() => {
    if (user) {
      loadActivities();
    }
  }, [user]);

  useEffect(() => {
    filterActivities();
    setCurrentPage(1); // Reset to first page when filters change
  }, [activities, searchQuery, typeFilter, riskFilter]);

  const loadActivities = async () => {
    try {
      setLoading(true);
      // Request more activities for better chart data - 1000 should cover most use cases
      const response = await fetch('/api/agents/activities?limit=1000');
      const data = await response.json();

      if (data.success) {
        setActivities(data.activities);
      } else {
        toast.error('Failed to load activities');
      }
    } catch (error) {
      console.error('Error loading activities:', error);
      toast.error('Failed to load activities');
    } finally {
      setLoading(false);
    }
  };

  const filterActivities = () => {
    let filtered = activities;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(activity =>
        activity.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activity.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activity.agentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activityTypeLabels[activity.type]?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Type filter
    if (typeFilter !== 'ALL') {
      filtered = filtered.filter(activity => activity.type === typeFilter);
    }

    // Risk filter
    if (riskFilter !== 'ALL') {
      filtered = filtered.filter(activity => activity.riskLevel === riskFilter);
    }

    setFilteredActivities(filtered);
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredActivities.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedActivities = filteredActivities.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const goToFirstPage = () => goToPage(1);
  const goToLastPage = () => goToPage(totalPages);
  const goToPreviousPage = () => goToPage(currentPage - 1);
  const goToNextPage = () => goToPage(currentPage + 1);

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'CRITICAL': return 'bg-red-500';
      case 'HIGH': return 'bg-orange-500';
      case 'MEDIUM': return 'bg-yellow-500';
      case 'LOW': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getRiskLevelVariant = (level: string) => {
    switch (level) {
      case 'CRITICAL': return 'destructive';
      case 'HIGH': return 'destructive';
      case 'MEDIUM': return 'secondary';
      case 'LOW': return 'secondary';
      default: return 'secondary';
    }
  };

  const formatTimeAgo = (timestamp: TimestampType) => {
    let date: Date;
    if (timestamp && typeof timestamp === 'object' && 'toDate' in timestamp && typeof timestamp.toDate === 'function') {
      date = timestamp.toDate();
    } else if (timestamp && typeof timestamp === 'object' && 'seconds' in timestamp && 'nanoseconds' in timestamp) {
      date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
    } else {
      date = new Date(timestamp as string | number | Date);
    }

    const now = new Date();
    const diff = now.getTime() - date.getTime();

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  const getChartData = () => {
    if (activities.length === 0) {
      return [];
    }

    console.log('📊 Chart Debug - Total activities:', activities.length);

    // Convert all activity timestamps and find data range
    const activityTimes: Date[] = [];
    activities.forEach(activity => {
      try {
        let activityTime: Date;
        if (activity.timestamp && typeof activity.timestamp === 'object' && 'toDate' in activity.timestamp && typeof activity.timestamp.toDate === 'function') {
          activityTime = activity.timestamp.toDate();
        } else if (activity.timestamp && typeof activity.timestamp === 'object' && 'seconds' in activity.timestamp && 'nanoseconds' in activity.timestamp) {
          activityTime = new Date(activity.timestamp.seconds * 1000 + activity.timestamp.nanoseconds / 1000000);
        } else if (typeof activity.timestamp === 'string') {
          activityTime = new Date(activity.timestamp);
        } else {
          activityTime = new Date(activity.timestamp as any);
        }
        activityTimes.push(activityTime);
      } catch (error) {
        console.error('📊 Chart Debug - Error processing activity timestamp:', activity, error);
      }
    });

    if (activityTimes.length === 0) {
      return [];
    }

    // Find the earliest and latest activity times
    const earliestTime = new Date(Math.min(...activityTimes.map(t => t.getTime())));
    const latestTime = new Date(Math.max(...activityTimes.map(t => t.getTime())));
    const now = new Date();

    console.log('📊 Chart Debug - Data range:', earliestTime, 'to', latestTime);

    // Determine slot duration based on period
    let slotDuration: number;
    if (chartTimePeriod === 'min') {
      slotDuration = 60 * 1000; // 1 minute
    } else if (chartTimePeriod === 'hour') {
      slotDuration = 60 * 60 * 1000; // 1 hour
    } else { // day
      slotDuration = 24 * 60 * 60 * 1000; // 1 day
    }

    // Calculate time slots to cover the data range plus some padding
    const paddingSlots = chartTimePeriod === 'min' ? 5 : chartTimePeriod === 'hour' ? 2 : 1;
    const startTime = new Date(earliestTime.getTime() - (paddingSlots * slotDuration));
    const endTime = new Date(Math.max(latestTime.getTime(), now.getTime()) + (paddingSlots * slotDuration));

    // Round start time to appropriate boundary
    let roundedStartTime: Date;
    if (chartTimePeriod === 'min') {
      roundedStartTime = new Date(startTime);
      roundedStartTime.setSeconds(0, 0);
    } else if (chartTimePeriod === 'hour') {
      roundedStartTime = new Date(startTime);
      roundedStartTime.setMinutes(0, 0, 0);
    } else { // day
      roundedStartTime = new Date(startTime);
      roundedStartTime.setHours(0, 0, 0, 0);
    }

    // Generate time slots from start to end
    const timeSlots: Array<{ time: Date; label: string }> = [];
    const data: Array<{
      time: string;
      file_access: number;
      usb_detected: number;
      git_operation: number;
      login: number;
      application_usage: number;
      network_activity: number;
    }> = [];
    let currentTime = new Date(roundedStartTime);

    while (currentTime <= endTime) {
      const label = currentTime.toLocaleString('en-US', {
        ...(chartTimePeriod === 'min' && { hour: '2-digit', minute: '2-digit' }),
        ...(chartTimePeriod === 'hour' && { hour: '2-digit', minute: '2-digit' }),
        ...(chartTimePeriod === 'day' && { month: '2-digit', day: '2-digit' })
      });

      timeSlots.push({
        time: new Date(currentTime),
        label: label
      });

      data.push({
        time: label,
        file_access: 0,
        usb_detected: 0,
        git_operation: 0,
        login: 0,
        application_usage: 0,
        network_activity: 0
      });

      currentTime = new Date(currentTime.getTime() + slotDuration);
    }

    console.log('📊 Chart Debug - Time period:', chartTimePeriod);
    console.log('📊 Chart Debug - Generated time slots:', timeSlots.length);
    console.log('📊 Chart Debug - First time slot:', timeSlots[0]);
    console.log('📊 Chart Debug - Last time slot:', timeSlots[timeSlots.length - 1]);

    // Count activities in each time slot
    let activitiesProcessed = 0;
    activities.forEach((activity, index) => {
      try {
        // Handle Firestore Timestamp properly
        let activityTime: Date;
        if (activity.timestamp && typeof activity.timestamp.toDate === 'function') {
          activityTime = activity.timestamp.toDate();
        } else if (activity.timestamp && typeof activity.timestamp === 'object' && activity.timestamp.seconds) {
          activityTime = new Date(activity.timestamp.seconds * 1000 + activity.timestamp.nanoseconds / 1000000);
        } else if (typeof activity.timestamp === 'string') {
          activityTime = new Date(activity.timestamp);
        } else {
          activityTime = new Date(activity.timestamp as any);
        }

        // Find the appropriate time slot
        for (let i = 0; i < timeSlots.length; i++) {
          const slotStart = timeSlots[i].time;
          const slotEnd = new Date(slotStart.getTime() + slotDuration);

          if (activityTime >= slotStart && activityTime < slotEnd) {
            if (data[i][activity.type] !== undefined) {
              data[i][activity.type]++;
              activitiesProcessed++;
              if (index < 5) { // Debug first few activities
                console.log(`📊 Chart Debug - Activity ${index} (${activity.type}) placed in slot ${i} (${timeSlots[i].label})`);
              }
            } else {
              console.warn('📊 Chart Debug - Unknown activity type:', activity.type);
            }
            break;
          }
        }
      } catch (error) {
        console.error('📊 Chart Debug - Error processing activity:', activity, error);
      }
    });

    console.log('📊 Chart Debug - Activities processed:', activitiesProcessed);
    console.log('📊 Chart Debug - Final data points:', data.length);

    return data;
  };

  if (!user) {
    return <div>Please log in to access the activities page.</div>;
  }

  if (loading) {
    return <div className="flex-1 space-y-6 p-6">
      <div className="text-center">Loading activities...</div>
    </div>;
  }

  // Calculate statistics
  const totalActivities = activities.length;
  const highRiskActivities = activities.filter(a => a.riskLevel === 'HIGH' || a.riskLevel === 'CRITICAL').length;
  const recentActivities = activities.filter(a => {
    const activityTime = a.timestamp?.toDate ? a.timestamp.toDate() : new Date(a.timestamp as unknown as string);
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    return activityTime > oneHourAgo;
  }).length;
  const blockedActivities = activities.filter(a => a.blocked).length;

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Activity Monitor</h1>
          <p className="text-muted-foreground">
            Real-time tracking of employee activities and security events
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={loadActivities}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>

          <Button variant="outline" size="sm">
            <Shield className="mr-2 h-4 w-4" />
            Security Report
          </Button>
        </div>
      </div>

      {/* Activity Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalActivities}</div>
            <p className="text-xs text-muted-foreground">All time tracking</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">High Risk Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{highRiskActivities}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              Require attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{recentActivities}</div>
            <p className="text-xs text-muted-foreground">
              Last hour
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Blocked Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{blockedActivities}</div>
            <p className="text-xs text-muted-foreground">
              Security interventions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Activity Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Activity Trends
              </CardTitle>
              <CardDescription>
                Activity count by type over time
              </CardDescription>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant={chartTimePeriod === 'min' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setChartTimePeriod('min')}
              >
                min
              </Button>
              <Button
                variant={chartTimePeriod === 'hour' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setChartTimePeriod('hour')}
              >
                hour
              </Button>
              <Button
                variant={chartTimePeriod === 'day' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setChartTimePeriod('day')}
              >
                day
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={getChartData()}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis
                  dataKey="time"
                  tick={{ fontSize: 12 }}
                  tickLine={{ stroke: 'currentColor', opacity: 0.3 }}
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  tickLine={{ stroke: 'currentColor', opacity: 0.3 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px'
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="file_access"
                  stroke="#8884d8"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  name="File Access"
                />
                <Line
                  type="monotone"
                  dataKey="usb_detected"
                  stroke="#82ca9d"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  name="USB Device"
                />
                <Line
                  type="monotone"
                  dataKey="git_operation"
                  stroke="#ffc658"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  name="Git Operation"
                />
                <Line
                  type="monotone"
                  dataKey="login"
                  stroke="#ff7300"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  name="User Login"
                />
                <Line
                  type="monotone"
                  dataKey="application_usage"
                  stroke="#ff6b9d"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  name="Application"
                />
                <Line
                  type="monotone"
                  dataKey="network_activity"
                  stroke="#00bcd4"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  name="Network Activity"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="font-medium">Time Resolution</div>
              <div className="text-muted-foreground">
                {chartTimePeriod === 'min' && 'Per minute'}
                {chartTimePeriod === 'hour' && 'Per hour'}
                {chartTimePeriod === 'day' && 'Per day'}
              </div>
            </div>
            <div className="text-center">
              <div className="font-medium">Total Activities</div>
              <div className="text-muted-foreground">{activities.length}</div>
            </div>
            <div className="text-center">
              <div className="font-medium">Chart Points</div>
              <div className="text-muted-foreground">
                {getChartData().length} time slots
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search activities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Activity Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Types</SelectItem>
                <SelectItem value="file_access">File Access</SelectItem>
                <SelectItem value="usb_detected">USB Device</SelectItem>
                <SelectItem value="git_operation">Git Operation</SelectItem>
                <SelectItem value="login">User Login</SelectItem>
                <SelectItem value="application_usage">Application</SelectItem>
                <SelectItem value="network_activity">Network Activity</SelectItem>
              </SelectContent>
            </Select>

            <Select value={riskFilter} onValueChange={setRiskFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Risk Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Risk</SelectItem>
                <SelectItem value="LOW">Low</SelectItem>
                <SelectItem value="MEDIUM">Medium</SelectItem>
                <SelectItem value="HIGH">High</SelectItem>
                <SelectItem value="CRITICAL">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        {/* Activities Table */}
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Activity</TableHead>
                  <TableHead>Employee</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Risk Level</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedActivities.map((activity) => {
                  const ActivityTypeIcon = activityTypeIcons[activity.type] || ActivityIcon;

                  return (
                    <TableRow key={activity.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <ActivityTypeIcon className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div className="font-medium">
                              {activity.description}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Agent: {activity.agentId.substring(0, 8)}...
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {activity.employeeId}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {activityTypeLabels[activity.type] || activity.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${getRiskLevelColor(activity.riskLevel)}`} />
                          <Badge variant={getRiskLevelVariant(activity.riskLevel) as any} className="text-xs">
                            {activity.riskLevel}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        <Clock className="inline h-3 w-3 mr-1" />
                        {formatTimeAgo(activity.timestamp)}
                      </TableCell>
                      <TableCell>
                        {activity.blocked ? (
                          <Badge variant="destructive" className="text-xs">
                            Blocked
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="text-xs">
                            Allowed
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>

            {/* Pagination Controls */}
            {filteredActivities.length > 0 && (
              <div className="flex items-center justify-between px-2 py-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">
                    Showing {startIndex + 1} to {Math.min(endIndex, filteredActivities.length)} of {filteredActivities.length} activities
                  </span>
                </div>
                
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium">Rows per page</p>
                    <Select
                      value={`${itemsPerPage}`}
                      onValueChange={(value) => {
                        setItemsPerPage(Number(value));
                        setCurrentPage(1);
                      }}
                    >
                      <SelectTrigger className="h-8 w-[70px]">
                        <SelectValue placeholder={itemsPerPage} />
                      </SelectTrigger>
                      <SelectContent side="top">
                        {[10, 25, 50, 100].map((pageSize) => (
                          <SelectItem key={pageSize} value={`${pageSize}`}>
                            {pageSize}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">
                      Page {currentPage} of {totalPages}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="outline"
                      className="hidden h-8 w-8 p-0 lg:flex"
                      onClick={goToFirstPage}
                      disabled={currentPage === 1}
                    >
                      <span className="sr-only">Go to first page</span>
                      <ChevronsLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      className="h-8 w-8 p-0"
                      onClick={goToPreviousPage}
                      disabled={currentPage === 1}
                    >
                      <span className="sr-only">Go to previous page</span>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      className="h-8 w-8 p-0"
                      onClick={goToNextPage}
                      disabled={currentPage === totalPages}
                    >
                      <span className="sr-only">Go to next page</span>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      className="hidden h-8 w-8 p-0 lg:flex"
                      onClick={goToLastPage}
                      disabled={currentPage === totalPages}
                    >
                      <span className="sr-only">Go to last page</span>
                      <ChevronsRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {filteredActivities.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <ActivityIcon className="mx-auto h-8 w-8 mb-2" />
                <p>No activities found</p>
                <p className="text-sm">Try adjusting your filters or wait for new activities</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}