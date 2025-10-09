'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { 
  Search, 
  MoreHorizontal, 
  Eye, 
  AlertTriangle,
  Users,
  Shield,
  TrendingUp,
  Clock,
  Activity,
  Bell,
  Usb,
  GitBranch,
  Circle,
  Monitor
} from 'lucide-react';
import { employeeService, agentService } from '@/lib/database';
import { Employee, Agent } from '@/lib/types';
import { toast } from 'sonner';
import { useAuth } from '@/lib/auth-context';

export default function EmployeesPage() {
  const { user } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');
  const [riskFilter, setRiskFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadEmployeesData();
    }
  }, [user]);

  useEffect(() => {
    filterEmployees();
  }, [employees, searchQuery, departmentFilter, riskFilter, statusFilter]);

  const loadEmployeesData = async () => {
    try {
      setLoading(true);
      const [employeesData, agentsData] = await Promise.all([
        employeeService.getAll(),
        agentService.getAll()
      ]);
      setEmployees(employeesData);
      setAgents(agentsData);
    } catch (error) {
      console.error('Error loading employees:', error);
      toast.error('Failed to load employees data');
    } finally {
      setLoading(false);
    }
  };

  const filterEmployees = useCallback(() => {
    let filtered = employees;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(emp => 
        emp.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.department.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Department filter
    if (departmentFilter !== 'ALL') {
      filtered = filtered.filter(emp => emp.department === departmentFilter);
    }

    // Risk filter
    if (riskFilter !== 'ALL') {
      filtered = filtered.filter(emp => emp.riskLevel === riskFilter);
    }

    // Status filter
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(emp => emp.status === statusFilter);
    }

    setFilteredEmployees(filtered);
  }, [employees, searchQuery, departmentFilter, riskFilter, statusFilter]);

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getEmployeeAgent = (employeeId: string): Agent | undefined => {
    return agents.find(agent => agent.employeeId === employeeId);
  };

  const isAgentOnline = (agent: Agent | undefined): boolean => {
    if (!agent) return false;
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    return agent.lastSeen.toDate() > fiveMinutesAgo && agent.status === 'online';
  };

  // Agent control functions
  const sendAgentCommand = async (employeeId: string, commandType: string) => {
    try {
      const response = await fetch('/api/agents/commands', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          employeeId,
          type: commandType,
          payload: {}
        })
      });

      const result = await response.json();
      
      if (result.success) {
        const employee = employees.find(emp => emp.id === employeeId);
        toast.success(`Command "${commandType}" sent to ${employee?.firstName} ${employee?.lastName}'s device`);
        // Refresh data to get updated blocking states
        loadEmployeesData();
      } else {
        toast.error(`Failed to send command: ${result.error}`);
      }
    } catch {
      toast.error('Failed to communicate with agent');
    }
  };

  const toggleUSBBlocking = (employeeId: string, agent: Agent) => {
    const command = agent.blockedServices?.usb ? 'enable-usb' : 'disable-usb';
    sendAgentCommand(employeeId, command);
  };

  const toggleGitBlocking = (employeeId: string, agent: Agent) => {
    const command = agent.blockedServices?.git ? 'unblock-git' : 'block-git';
    sendAgentCommand(employeeId, command);
  };

  const handleGetAgentStatus = (employeeId: string) => {
    sendAgentCommand(employeeId, 'get-status');
  };

  const handleViewProfile = (employeeId: string) => {
    const employee = employees.find(emp => emp.id === employeeId);
    toast.info(`Viewing profile for ${employee?.firstName} ${employee?.lastName}`);
  };

  const handleAdjustRisk = (employeeId: string) => {
    const employee = employees.find(emp => emp.id === employeeId);
    toast.info(`Adjusting risk level for ${employee?.firstName} ${employee?.lastName}`);
  };

  const handleSuspendEmployee = (employeeId: string) => {
    const employee = employees.find(emp => emp.id === employeeId);
    toast.warning(`Suspending access for ${employee?.firstName} ${employee?.lastName}`);
  };

  // Get unique departments
  const departments = [...new Set(employees.map(emp => emp.department))];

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

  if (!user) {
    return <div>Please log in to access the employees page.</div>;
  }

  if (loading) {
    return <div className="flex-1 space-y-6 p-6">
      <div className="text-center">Loading employees...</div>
    </div>;
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Employee Management</h1>
          <p className="text-muted-foreground">
            Monitor employee activities and manage security controls
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={loadEmployeesData}>
            <Users className="mr-2 h-4 w-4" />
            Refresh
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
              Require attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Online Agents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {agents.filter(agent => isAgentOnline(agent)).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Active monitoring
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Controls</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {agents.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Deployed agents
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search employees..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Departments</SelectItem>
                {departments.map(dept => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
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

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Status</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="SUSPENDED">Suspended</SelectItem>
                <SelectItem value="TERMINATED">Terminated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        {/* Employee Table */}
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Risk Level</TableHead>
                  <TableHead>Agent Status</TableHead>
                  <TableHead>Last Activity</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.map((employee) => {
                  const agent = getEmployeeAgent(employee.id);
                  const agentOnline = isAgentOnline(agent);
                  
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
                              {employee.email}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{employee.department}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${getRiskLevelColor(employee.riskLevel)}`} />
                          <Badge variant={getRiskLevelVariant(employee.riskLevel) as "default" | "destructive" | "outline" | "secondary"} className="text-xs">
                            {employee.riskLevel}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            ({employee.riskScore})
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {agent ? (
                          <div className="flex items-center space-x-2">
                            <Circle 
                              className={`w-2 h-2 ${agentOnline ? 'text-green-500 fill-current' : 'text-gray-400 fill-current'}`} 
                            />
                            <span className="text-xs">
                              {agentOnline ? 'Online' : 'Offline'}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {agent.platform}
                            </Badge>
                          </div>
                        ) : (
                          <Badge variant="secondary" className="text-xs">
                            No Agent
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        <Clock className="inline h-3 w-3 mr-1" />
                        {employee.lastActivity.toDate().toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
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
                            
                            {agent && agentOnline && (
                              <>
                                <DropdownMenuSeparator />
                                {/* Agent Controls */}
                                <DropdownMenuItem onClick={() => handleGetAgentStatus(employee.id)}>
                                  <Monitor className="mr-2 h-4 w-4" />
                                  Check Agent Status
                                </DropdownMenuItem>
                                
                                {/* Git Toggle - Single item with dynamic label */}
                                <DropdownMenuItem 
                                  onClick={() => toggleGitBlocking(employee.id, agent)}
                                  className={agent.blockedServices?.git ? "text-green-600" : "text-red-600"}
                                >
                                  <GitBranch className="mr-2 h-4 w-4" />
                                  {agent.blockedServices?.git ? 'Unblock Git' : 'Block Git'}
                                </DropdownMenuItem>
                                
                                {/* USB Toggle - Single item with dynamic label */}
                                <DropdownMenuItem 
                                  onClick={() => toggleUSBBlocking(employee.id, agent)}
                                  className={agent.blockedServices?.usb ? "text-green-600" : "text-red-600"}
                                >
                                  <Usb className="mr-2 h-4 w-4" />
                                  {agent.blockedServices?.usb ? 'Enable USB' : 'Disable USB'}
                                </DropdownMenuItem>
                              </>
                            )}
                            
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleAdjustRisk(employee.id)}>
                              <Shield className="mr-2 h-4 w-4" />
                              Adjust Risk Level
                            </DropdownMenuItem>
                            
                            {employee.status === 'ACTIVE' && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  onClick={() => handleSuspendEmployee(employee.id)}
                                  className="text-red-600"
                                >
                                  <AlertTriangle className="mr-2 h-4 w-4" />
                                  Suspend Access
                                </DropdownMenuItem>
                              </>
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