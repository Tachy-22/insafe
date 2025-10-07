'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Search, 
  Plus, 
  MoreHorizontal, 
  Lock, 
  Unlock,
  Clock,
  User,
  Mail,
  UsbIcon,
  Cloud,
  Github,
  Printer,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Calendar
} from 'lucide-react';
import { restrictions, employees, Restriction } from '@/lib/dummy-data';
import { toast } from 'sonner';

const restrictionTypes = [
  { value: 'EMAIL', label: 'Email', icon: Mail, description: 'Control email access and external communications' },
  { value: 'USB', label: 'USB Access', icon: UsbIcon, description: 'Manage USB device permissions' },
  { value: 'CLOUD', label: 'Cloud Services', icon: Cloud, description: 'Control cloud storage access' },
  { value: 'GITHUB', label: 'GitHub', icon: Github, description: 'Manage code repository access' },
  { value: 'PRINT', label: 'Printing', icon: Printer, description: 'Control printing capabilities' },
  { value: 'NETWORK', label: 'Network Access', icon: Shield, description: 'Manage network connectivity' },
  { value: 'APPLICATIONS', label: 'Applications', icon: Lock, description: 'Control application access' }
];

export default function RestrictionsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isNewRestrictionOpen, setIsNewRestrictionOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [restrictionType, setRestrictionType] = useState('');
  const [restrictionService, setRestrictionService] = useState('');
  const [restrictionReason, setRestrictionReason] = useState('');
  const [isTemporary, setIsTemporary] = useState(true);
  const [expirationDate, setExpirationDate] = useState('');

  const filteredRestrictions = restrictions.filter(restriction => {
    const matchesSearch = searchQuery === '' || 
      restriction.employee.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restriction.employee.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restriction.employee.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restriction.service.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = typeFilter === 'ALL' || restriction.type === typeFilter;
    const matchesStatus = statusFilter === 'ALL' || restriction.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  const handleApplyRestriction = () => {
    if (!selectedEmployee || !restrictionType || !restrictionService || !restrictionReason) {
      toast.error('Please fill in all required fields');
      return;
    }

    const employee = employees.find(emp => emp.id === selectedEmployee);
    if (!employee) {
      toast.error('Employee not found');
      return;
    }

    // In a real app, this would make an API call
    toast.success(`Restriction applied to ${employee.firstName} ${employee.lastName}`, {
      description: `${restrictionService} access has been restricted`
    });

    // Reset form
    setSelectedEmployee('');
    setRestrictionType('');
    setRestrictionService('');
    setRestrictionReason('');
    setIsTemporary(true);
    setExpirationDate('');
    setIsNewRestrictionOpen(false);
  };

  const handleToggleRestriction = (restrictionId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    const restriction = restrictions.find(r => r.id === restrictionId);
    
    if (restriction) {
      toast.success(`Restriction ${newStatus.toLowerCase()} for ${restriction.employee.firstName} ${restriction.employee.lastName}`);
    }
  };

  const handleRemoveRestriction = (restrictionId: string) => {
    const restriction = restrictions.find(r => r.id === restrictionId);
    
    if (restriction) {
      toast.success(`Restriction removed for ${restriction.employee.firstName} ${restriction.employee.lastName}`);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <Lock className="h-4 w-4 text-red-600" />;
      case 'SUSPENDED':
        return <Unlock className="h-4 w-4 text-yellow-600" />;
      case 'EXPIRED':
        return <XCircle className="h-4 w-4 text-gray-600" />;
      default:
        return <Shield className="h-4 w-4 text-blue-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <Badge variant="destructive">Active</Badge>;
      case 'SUSPENDED':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Suspended</Badge>;
      case 'EXPIRED':
        return <Badge variant="outline">Expired</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getRestrictionIcon = (type: string) => {
    const restrictionType = restrictionTypes.find(rt => rt.value === type);
    if (restrictionType) {
      const IconComponent = restrictionType.icon;
      return <IconComponent className="h-4 w-4 text-muted-foreground" />;
    }
    return <Shield className="h-4 w-4 text-muted-foreground" />;
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Access Control & Restrictions</h1>
          <p className="text-muted-foreground">
            Manage employee access restrictions and security policies
          </p>
        </div>

        <Dialog open={isNewRestrictionOpen} onOpenChange={setIsNewRestrictionOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Apply Restriction
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Apply New Restriction</DialogTitle>
              <DialogDescription>
                Restrict access to specific services for an employee
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="employee">Employee *</Label>
                <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select employee" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map((emp) => (
                      <SelectItem key={emp.id} value={emp.id}>
                        {emp.firstName} {emp.lastName} ({emp.employeeId})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Restriction Type *</Label>
                <Select value={restrictionType} onValueChange={setRestrictionType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select restriction type" />
                  </SelectTrigger>
                  <SelectContent>
                    {restrictionTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center space-x-2">
                          <type.icon className="h-4 w-4" />
                          <span>{type.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="service">Service/Application *</Label>
                <Input
                  id="service"
                  placeholder="e.g., Gmail, Google Drive, USB Devices"
                  value={restrictionService}
                  onChange={(e) => setRestrictionService(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason">Reason *</Label>
                <Textarea
                  id="reason"
                  placeholder="Explain why this restriction is necessary..."
                  value={restrictionReason}
                  onChange={(e) => setRestrictionReason(e.target.value)}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="temporary"
                  checked={isTemporary}
                  onCheckedChange={setIsTemporary}
                />
                <Label htmlFor="temporary">Temporary restriction</Label>
              </div>

              {isTemporary && (
                <div className="space-y-2">
                  <Label htmlFor="expiration">Expiration Date</Label>
                  <Input
                    id="expiration"
                    type="datetime-local"
                    value={expirationDate}
                    onChange={(e) => setExpirationDate(e.target.value)}
                  />
                </div>
              )}
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsNewRestrictionOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleApplyRestriction}>
                Apply Restriction
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Restrictions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{restrictions.length}</div>
            <p className="text-xs text-muted-foreground">Across all employees</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Restrictions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {restrictions.filter(r => r.status === 'ACTIVE').length}
            </div>
            <p className="text-xs text-muted-foreground">Currently enforced</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Temporary Restrictions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {restrictions.filter(r => r.severity === 'TEMPORARY').length}
            </div>
            <p className="text-xs text-muted-foreground">With expiration dates</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Permanent Restrictions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {restrictions.filter(r => r.severity === 'PERMANENT').length}
            </div>
            <p className="text-xs text-muted-foreground">Long-term restrictions</p>
          </CardContent>
        </Card>
      </div>

      {/* Restriction Types Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Restriction Types</CardTitle>
          <CardDescription>Available restriction categories and their applications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
            {restrictionTypes.map((type) => {
              const count = restrictions.filter(r => r.type === type.value).length;
              return (
                <div key={type.value} className="flex items-center space-x-3 p-3 rounded-lg border">
                  <type.icon className="h-5 w-5 text-primary" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{type.label}</p>
                    <p className="text-xs text-muted-foreground">{count} active</p>
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
          <CardTitle>Filter Restrictions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search employees or services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Types</SelectItem>
                {restrictionTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Status</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="SUSPENDED">Suspended</SelectItem>
                <SelectItem value="EXPIRED">Expired</SelectItem>
              </SelectContent>
            </Select>

            <Button 
              variant="outline" 
              onClick={() => {
                setSearchQuery('');
                setTypeFilter('ALL');
                setStatusFilter('ALL');
              }}
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Restrictions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Current Restrictions</CardTitle>
          <CardDescription>
            Showing {filteredRestrictions.length} of {restrictions.length} restrictions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Restriction Type</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Applied By</TableHead>
                  <TableHead>Applied Date</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRestrictions.map((restriction) => (
                  <TableRow key={restriction.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium">
                            {restriction.employee.firstName} {restriction.employee.lastName}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {restriction.employee.employeeId}
                          </div>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getRestrictionIcon(restriction.type)}
                        <span className="text-sm">
                          {restrictionTypes.find(rt => rt.value === restriction.type)?.label || restriction.type}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="text-sm font-medium">{restriction.service}</div>
                      <div className="text-xs text-muted-foreground truncate max-w-xs">
                        {restriction.reason}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(restriction.status)}
                        {getStatusBadge(restriction.status)}
                      </div>
                    </TableCell>

                    <TableCell className="text-sm">
                      {restriction.appliedBy}
                    </TableCell>

                    <TableCell className="text-sm">
                      {new Date(restriction.appliedAt).toLocaleDateString()}
                    </TableCell>

                    <TableCell>
                      {restriction.expiresAt ? (
                        <div className="flex items-center space-x-1 text-sm">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(restriction.expiresAt).toLocaleDateString()}</span>
                        </div>
                      ) : (
                        <Badge variant="outline" className="text-xs">Permanent</Badge>
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
                          <DropdownMenuItem 
                            onClick={() => handleToggleRestriction(restriction.id, restriction.status)}
                          >
                            {restriction.status === 'ACTIVE' ? (
                              <>
                                <Unlock className="mr-2 h-4 w-4" />
                                Suspend
                              </>
                            ) : (
                              <>
                                <Lock className="mr-2 h-4 w-4" />
                                Activate
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toast.info('Editing restriction')}>
                            Edit Details
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleRemoveRestriction(restriction.id)}
                            className="text-red-600"
                          >
                            <XCircle className="mr-2 h-4 w-4" />
                            Remove Restriction
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
    </div>
  );
}