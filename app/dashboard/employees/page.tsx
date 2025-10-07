'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  Eye, 
  AlertTriangle,
  Users,
  Shield,
  TrendingUp,
  Clock,
  MapPin,
  Building,
  Mail,
  Activity,
  Bell
} from 'lucide-react';
import { employees, Employee, getActivitiesByEmployeeId, getAlertsByEmployeeId } from '@/lib/dummy-data';
import { toast } from 'sonner';

export default function EmployeesPage() {
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>(employees);
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');
  const [riskFilter, setRiskFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Get unique departments
  const departments = [...new Set(employees.map(emp => emp.department))];

  // Filter employees
  useEffect(() => {
    let filtered = employees;

    if (searchQuery) {
      filtered = filtered.filter(
        employee =>
          employee.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          employee.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          employee.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          employee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          employee.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
          employee.role.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (departmentFilter !== 'ALL') {
      filtered = filtered.filter(employee => employee.department === departmentFilter);
    }

    if (riskFilter !== 'ALL') {
      filtered = filtered.filter(employee => employee.riskLevel === riskFilter);
    }

    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(employee => employee.status === statusFilter);
    }

    // Sort by risk level first (highest risk first), then by name
    filtered.sort((a, b) => {
      const riskOrder = { 'CRITICAL': 4, 'HIGH': 3, 'MEDIUM': 2, 'LOW': 1 };
      if (a.riskLevel !== b.riskLevel) {
        return riskOrder[b.riskLevel] - riskOrder[a.riskLevel];
      }
      return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
    });

    setFilteredEmployees(filtered);
  }, [searchQuery, departmentFilter, riskFilter, statusFilter]);

  const getRiskBadge = (level: string) => {
    switch (level) {
      case 'CRITICAL':
        return <Badge variant="destructive" className="text-xs">Critical Risk</Badge>;
      case 'HIGH':
        return <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-800">High Risk</Badge>;
      case 'MEDIUM':
        return <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-800">Medium Risk</Badge>;
      case 'LOW':
        return <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">Low Risk</Badge>;
      default:
        return <Badge variant="secondary" className="text-xs">{level}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">Active</Badge>;
      case 'SUSPENDED':
        return <Badge variant="secondary" className="text-xs bg-red-100 text-red-800">Suspended</Badge>;
      case 'TERMINATED':
        return <Badge variant="outline" className="text-xs">Terminated</Badge>;
      default:
        return <Badge variant="secondary" className="text-xs">{status}</Badge>;
    }
  };

  const getRiskScore = (level: string) => {
    switch (level) {
      case 'CRITICAL': return 90;
      case 'HIGH': return 75;
      case 'MEDIUM': return 50;
      case 'LOW': return 25;
      default: return 0;
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const handleViewProfile = (employeeId: string) => {
    toast.info('Opening employee profile', {
      description: 'Loading detailed employee information and activity history'
    });
  };

  const handleAdjustRisk = (_employeeId: string) => {
    const employee = employees.find(emp => emp.id === employeeId);
    if (employee) {
      toast.success('Risk assessment updated', {
        description: `Risk level for ${employee.firstName} ${employee.lastName} has been adjusted`
      });
    }
  };

  const handleSuspendEmployee = (employeeId: string) => {
    const employee = employees.find(emp => emp.id === employeeId);
    if (employee) {
      toast.success('Employee suspended', {
        description: `${employee.firstName} ${employee.lastName} access has been suspended`
      });
    }
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Employee Profiles</h1>
          <p className="text-muted-foreground">
            Monitor employee risk assessments and security profiles
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Users className="mr-2 h-4 w-4" />
            Bulk Actions
          </Button>
          
          <Button variant="outline" size="sm">
            <Bell className="mr-2 h-4 w-4" />
            Risk Alerts
          </Button>
        </div>
      </div>

      {/* Employee Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{employees.length}</div>
            <p className="text-xs text-muted-foreground">Under monitoring</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">High Risk</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {employees.filter(emp => emp.riskLevel === 'HIGH' || emp.riskLevel === 'CRITICAL').length}
            </div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +12% this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Employees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {employees.filter(emp => emp.status === 'ACTIVE').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Currently employed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Suspended</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {employees.filter(emp => emp.status === 'SUSPENDED').length}
            </div>
            <p className="text-xs text-muted-foreground">Access restricted</p>
          </CardContent>
        </Card>
      </div>

      {/* Department Risk Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Department Risk Analysis</CardTitle>
          <CardDescription>Detailed security risk assessment by department with actionable insights</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
            {departments.map((dept) => {
              const deptEmployees = employees.filter(emp => emp.department === dept);
              const riskCounts = {
                CRITICAL: deptEmployees.filter(emp => emp.riskLevel === 'CRITICAL').length,
                HIGH: deptEmployees.filter(emp => emp.riskLevel === 'HIGH').length,
                MEDIUM: deptEmployees.filter(emp => emp.riskLevel === 'MEDIUM').length,
                LOW: deptEmployees.filter(emp => emp.riskLevel === 'LOW').length
              };
              
              const totalHighRisk = riskCounts.CRITICAL + riskCounts.HIGH;
              const riskPercentage = deptEmployees.length > 0 ? (totalHighRisk / deptEmployees.length) * 100 : 0;
              
              // Get sample high-risk employees for this department
              const highRiskEmployees = deptEmployees.filter(emp => emp.riskLevel === 'CRITICAL' || emp.riskLevel === 'HIGH');
              
              // Determine department priority
              const getPriorityLevel = () => {
                if (riskPercentage >= 30) return { level: 'URGENT', color: 'text-red-600', bg: 'bg-red-50 border-red-200' };
                if (riskPercentage >= 15) return { level: 'HIGH', color: 'text-orange-600', bg: 'bg-orange-50 border-orange-200' };
                if (riskPercentage >= 5) return { level: 'MEDIUM', color: 'text-yellow-600', bg: 'bg-yellow-50 border-yellow-200' };
                return { level: 'LOW', color: 'text-green-600', bg: 'bg-green-50 border-green-200' };
              };
              
              const priority = getPriorityLevel();
              
              return (
                <div key={dept} className={`p-4 rounded-lg border-2 ${priority.bg}`}>
                  {/* Department Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">{dept}</h3>
                      <p className="text-sm text-muted-foreground">{deptEmployees.length} total employees</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className={`${priority.color} border-current`}>
                        {priority.level} PRIORITY
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">
                        {riskPercentage.toFixed(1)}% high risk
                      </p>
                    </div>
                  </div>

                  {/* Risk Breakdown */}
                  <div className="space-y-3 mb-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 rounded-lg bg-white/50">
                        <div className="text-2xl font-bold text-red-600">{riskCounts.CRITICAL}</div>
                        <div className="text-xs text-muted-foreground">Critical Risk</div>
                      </div>
                      <div className="text-center p-3 rounded-lg bg-white/50">
                        <div className="text-2xl font-bold text-orange-600">{riskCounts.HIGH}</div>
                        <div className="text-xs text-muted-foreground">High Risk</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-2 rounded bg-white/30">
                        <div className="text-lg font-semibold text-yellow-600">{riskCounts.MEDIUM}</div>
                        <div className="text-xs text-muted-foreground">Medium Risk</div>
                      </div>
                      <div className="text-center p-2 rounded bg-white/30">
                        <div className="text-lg font-semibold text-green-600">{riskCounts.LOW}</div>
                        <div className="text-xs text-muted-foreground">Low Risk</div>
                      </div>
                    </div>
                  </div>

                  {/* Visual Risk Distribution */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Risk Distribution</span>
                      <span className="text-sm text-muted-foreground">
                        {totalHighRisk}/{deptEmployees.length} need attention
                      </span>
                    </div>
                    <div className="flex space-x-1 h-3 rounded-full overflow-hidden bg-gray-200">
                      {riskCounts.CRITICAL > 0 && (
                        <div 
                          className="bg-red-500"
                          style={{ width: `${(riskCounts.CRITICAL / deptEmployees.length) * 100}%` }}
                          title={`${riskCounts.CRITICAL} Critical Risk Employees`}
                        />
                      )}
                      {riskCounts.HIGH > 0 && (
                        <div 
                          className="bg-orange-500"
                          style={{ width: `${(riskCounts.HIGH / deptEmployees.length) * 100}%` }}
                          title={`${riskCounts.HIGH} High Risk Employees`}
                        />
                      )}
                      {riskCounts.MEDIUM > 0 && (
                        <div 
                          className="bg-yellow-500"
                          style={{ width: `${(riskCounts.MEDIUM / deptEmployees.length) * 100}%` }}
                          title={`${riskCounts.MEDIUM} Medium Risk Employees`}
                        />
                      )}
                      {riskCounts.LOW > 0 && (
                        <div 
                          className="bg-green-500"
                          style={{ width: `${(riskCounts.LOW / deptEmployees.length) * 100}%` }}
                          title={`${riskCounts.LOW} Low Risk Employees`}
                        />
                      )}
                    </div>
                  </div>

                  {/* High Risk Employees Preview */}
                  {highRiskEmployees.length > 0 && (
                    <div className="border-t pt-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-red-600">Requires Immediate Attention</span>
                        {highRiskEmployees.length > 2 && (
                          <span className="text-xs text-muted-foreground">
                            +{highRiskEmployees.length - 2} more
                          </span>
                        )}
                      </div>
                      <div className="space-y-1">
                        {highRiskEmployees.slice(0, 2).map((emp) => (
                          <div key={emp.id} className="flex items-center justify-between text-xs">
                            <span>{emp.firstName} {emp.lastName}</span>
                            <Badge 
                              variant={emp.riskLevel === 'CRITICAL' ? 'destructive' : 'secondary'}
                              className="text-xs px-1 py-0"
                            >
                              {emp.riskLevel}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recommendations */}
                  <div className="mt-4 pt-3 border-t">
                    <div className="text-xs text-muted-foreground">
                      <strong>Recommended Actions:</strong>
                      {riskPercentage >= 30 && (
                        <span> Immediate security review required. Consider enhanced monitoring and access restrictions.</span>
                      )}
                      {riskPercentage >= 15 && riskPercentage < 30 && (
                        <span> Increase monitoring frequency. Review access permissions for high-risk employees.</span>
                      )}
                      {riskPercentage >= 5 && riskPercentage < 15 && (
                        <span> Monitor trends. Provide additional security training to medium-risk employees.</span>
                      )}
                      {riskPercentage < 5 && (
                        <span> Maintain current monitoring levels. Continue regular security awareness programs.</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Overall Risk Summary */}
          <div className="mt-6 p-4 rounded-lg bg-muted/50 border">
            <h4 className="font-medium mb-3">Organization-Wide Risk Summary</h4>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="text-center">
                <div className="text-xl font-bold text-red-600">
                  {employees.filter(emp => emp.riskLevel === 'CRITICAL').length}
                </div>
                <div className="text-sm text-muted-foreground">Total Critical</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-orange-600">
                  {employees.filter(emp => emp.riskLevel === 'HIGH').length}
                </div>
                <div className="text-sm text-muted-foreground">Total High Risk</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold">
                  {departments.filter(dept => {
                    const deptEmps = employees.filter(emp => emp.department === dept);
                    const highRiskCount = deptEmps.filter(emp => emp.riskLevel === 'CRITICAL' || emp.riskLevel === 'HIGH').length;
                    return deptEmps.length > 0 && (highRiskCount / deptEmps.length) >= 0.15;
                  }).length}
                </div>
                <div className="text-sm text-muted-foreground">Departments at Risk</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-green-600">
                  {(((employees.filter(emp => emp.riskLevel === 'LOW').length) / employees.length) * 100).toFixed(0)}%
                </div>
                <div className="text-sm text-muted-foreground">Low Risk Rate</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filter Employees</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-5">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search employees..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Departments</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={riskFilter} onValueChange={setRiskFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Risk Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Risk Levels</SelectItem>
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
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="SUSPENDED">Suspended</SelectItem>
                <SelectItem value="TERMINATED">Terminated</SelectItem>
              </SelectContent>
            </Select>

            <Button 
              variant="outline" 
              onClick={() => {
                setSearchQuery('');
                setDepartmentFilter('ALL');
                setRiskFilter('ALL');
                setStatusFilter('ALL');
              }}
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Employees Table */}
      <Card>
        <CardHeader>
          <CardTitle>Employee Directory</CardTitle>
          <CardDescription>
            Showing {filteredEmployees.length} of {employees.length} employees
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Risk Level</TableHead>
                  <TableHead>Risk Score</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Active</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Activities</TableHead>
                  <TableHead>Alerts</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.map((employee) => {
                  const employeeActivities = getActivitiesByEmployeeId(employee.id);
                  const employeeAlerts = getAlertsByEmployeeId(employee.id);
                  const highRiskActivities = employeeActivities.filter(a => a.riskScore >= 7).length;
                  
                  return (
                    <TableRow key={employee.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs">
                              {getInitials(employee.firstName, employee.lastName)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">
                              {employee.firstName} {employee.lastName}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {employee.employeeId} • {employee.role}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              <Mail className="inline h-3 w-3 mr-1" />
                              {employee.email}
                            </div>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Building className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div className="text-sm font-medium">{employee.department}</div>
                            <div className="text-xs text-muted-foreground">
                              Manager: {employee.manager}
                            </div>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        {getRiskBadge(employee.riskLevel)}
                      </TableCell>

                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm font-medium">
                            {getRiskScore(employee.riskLevel)}%
                          </div>
                          <Progress 
                            value={getRiskScore(employee.riskLevel)} 
                            className="w-16 h-2"
                          />
                        </div>
                      </TableCell>

                      <TableCell>
                        {getStatusBadge(employee.status)}
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center space-x-2 text-sm">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{new Date(employee.lastActive).toLocaleDateString()}</span>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center space-x-2 text-sm">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{employee.location}</span>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="text-center">
                          <div className="text-sm font-medium">{employeeActivities.length}</div>
                          {highRiskActivities > 0 && (
                            <div className="text-xs text-red-600">
                              {highRiskActivities} high risk
                            </div>
                          )}
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="text-center">
                          <div className="text-sm font-medium">{employeeAlerts.length}</div>
                          {employeeAlerts.filter(a => a.severity === 'CRITICAL').length > 0 && (
                            <div className="text-xs text-red-600">
                              {employeeAlerts.filter(a => a.severity === 'CRITICAL').length} critical
                            </div>
                          )}
                        </div>
                      </TableCell>

                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewProfile(employee.id)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => toast.info('Activity history opened')}>
                              <Activity className="mr-2 h-4 w-4" />
                              Activity History
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleAdjustRisk(employee.id)}>
                              <Shield className="mr-2 h-4 w-4" />
                              Adjust Risk Level
                            </DropdownMenuItem>
                            {employee.status === 'ACTIVE' && (
                              <DropdownMenuItem 
                                onClick={() => handleSuspendEmployee(employee.id)}
                                className="text-red-600"
                              >
                                <AlertTriangle className="mr-2 h-4 w-4" />
                                Suspend Access
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}