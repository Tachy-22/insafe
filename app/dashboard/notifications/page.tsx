'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Bell, 
  BellRing,
  Mail, 
  Smartphone,
  MessageSquare,
  Settings,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  Volume2,
  VolumeX,
  Eye,
  EyeOff
} from 'lucide-react';
import { toast } from 'sonner';

const notifications = [
  {
    id: '1',
    title: 'Critical Alert: Data Exfiltration Attempt',
    message: 'Ibrahim Musa attempted to upload sensitive financial data to Google Drive',
    type: 'CRITICAL_ALERT',
    severity: 'CRITICAL',
    timestamp: '2024-10-07T08:25:00Z',
    read: false,
    channel: ['EMAIL', 'SMS', 'IN_APP'],
    source: 'Activity Monitor'
  },
  {
    id: '2',
    title: 'High Risk Activity Detected',
    message: 'Adebayo Johnson sending confidential customer data to personal email',
    type: 'HIGH_RISK',
    severity: 'HIGH',
    timestamp: '2024-10-07T07:45:00Z',
    read: false,
    channel: ['EMAIL', 'IN_APP'],
    source: 'Email Monitor'
  },
  {
    id: '3',
    title: 'Policy Violation',
    message: 'Multiple unauthorized USB device usage attempts detected',
    type: 'POLICY_VIOLATION',
    severity: 'MEDIUM',
    timestamp: '2024-10-07T07:30:00Z',
    read: true,
    channel: ['IN_APP'],
    source: 'USB Monitor'
  },
  {
    id: '4',
    title: 'System Alert: Unusual Login Pattern',
    message: 'Multiple failed login attempts from IP 192.168.1.45',
    type: 'SYSTEM_ALERT',
    severity: 'MEDIUM',
    timestamp: '2024-10-07T06:15:00Z',
    read: true,
    channel: ['EMAIL', 'IN_APP'],
    source: 'Authentication System'
  },
  {
    id: '5',
    title: 'Compliance Report Generated',
    message: 'Monthly compliance report for September 2024 is ready for review',
    type: 'REPORT_READY',
    severity: 'INFO',
    timestamp: '2024-10-07T05:00:00Z',
    read: true,
    channel: ['EMAIL', 'IN_APP'],
    source: 'Report Generator'
  }
];

const notificationRules = [
  {
    id: '1',
    name: 'Critical Data Exfiltration',
    description: 'Immediate alerts for data exfiltration attempts',
    trigger: 'Risk Score >= 9.0',
    channels: ['EMAIL', 'SMS', 'IN_APP'],
    recipients: ['Security Team', 'IT Manager'],
    enabled: true,
    frequency: 'IMMEDIATE'
  },
  {
    id: '2',
    name: 'High Risk Employee Activity',
    description: 'Alerts for high-risk employee behaviors',
    trigger: 'Risk Score >= 7.0',
    channels: ['EMAIL', 'IN_APP'],
    recipients: ['Security Team'],
    enabled: true,
    frequency: 'IMMEDIATE'
  },
  {
    id: '3',
    name: 'Multiple Policy Violations',
    description: 'Alerts when user violates multiple policies',
    trigger: 'Policy Violations >= 3 in 24h',
    channels: ['EMAIL'],
    recipients: ['HR Team', 'Security Team'],
    enabled: true,
    frequency: 'DAILY_DIGEST'
  },
  {
    id: '4',
    name: 'After Hours Access',
    description: 'Unusual access outside business hours',
    trigger: 'Access between 10 PM - 6 AM',
    channels: ['IN_APP'],
    recipients: ['Security Team'],
    enabled: false,
    frequency: 'IMMEDIATE'
  }
];

const notificationChannels = [
  {
    id: 'EMAIL',
    name: 'Email',
    description: 'Send notifications via email',
    icon: Mail,
    enabled: true,
    config: {
      smtpServer: 'smtp.wemabank.com',
      from: 'insafe@wemabank.com'
    }
  },
  {
    id: 'SMS',
    name: 'SMS',
    description: 'Send critical alerts via SMS',
    icon: Smartphone,
    enabled: true,
    config: {
      provider: 'Twilio',
      from: '+234-XXX-XXXX'
    }
  },
  {
    id: 'IN_APP',
    name: 'In-App',
    description: 'Show notifications in dashboard',
    icon: Bell,
    enabled: true,
    config: {}
  },
  {
    id: 'SLACK',
    name: 'Slack',
    description: 'Post to Slack channels',
    icon: MessageSquare,
    enabled: false,
    config: {
      webhook: 'https://hooks.slack.com/...'
    }
  }
];

export default function NotificationsPage() {
  const [selectedTab, setSelectedTab] = useState('inbox');
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [isNewRuleOpen, setIsNewRuleOpen] = useState(false);

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = searchQuery === '' || 
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSeverity = severityFilter === 'ALL' || notification.severity === severityFilter;
    
    return matchesSearch && matchesSeverity;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAsRead = (notificationId: string) => {
    toast.success('Notification marked as read');
  };

  const handleMarkAllAsRead = () => {
    toast.success('All notifications marked as read');
  };

  const handleDeleteNotification = (notificationId: string) => {
    toast.success('Notification deleted');
  };

  const handleToggleRule = (ruleId: string, enabled: boolean) => {
    toast.success(`Notification rule ${enabled ? 'enabled' : 'disabled'}`);
  };

  const handleToggleChannel = (channelId: string, enabled: boolean) => {
    toast.success(`${channelId} notifications ${enabled ? 'enabled' : 'disabled'}`);
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'HIGH':
        return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      case 'MEDIUM':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      default:
        return <Bell className="h-4 w-4 text-blue-600" />;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return <Badge variant="destructive">Critical</Badge>;
      case 'HIGH':
        return <Badge variant="secondary" className="bg-orange-100 text-orange-800">High</Badge>;
      case 'MEDIUM':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Medium</Badge>;
      case 'INFO':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Info</Badge>;
      default:
        return <Badge variant="secondary">{severity}</Badge>;
    }
  };

  const getChannelIcon = (channel: any) => {
    const IconComponent = channel.icon;
    return <IconComponent className="h-4 w-4" />;
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Notifications Center</h1>
          <p className="text-muted-foreground">
            Manage alerts, notifications, and communication channels
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={handleMarkAllAsRead}>
            <CheckCircle className="mr-2 h-4 w-4" />
            Mark All Read
          </Button>
          
          <Dialog open={isNewRuleOpen} onOpenChange={setIsNewRuleOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                New Rule
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Notification Rule</DialogTitle>
                <DialogDescription>
                  Set up automated notifications for specific security events
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="rule-name">Rule Name</Label>
                  <Input id="rule-name" placeholder="Enter rule name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rule-description">Description</Label>
                  <Textarea id="rule-description" placeholder="Describe when this rule should trigger" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rule-trigger">Trigger Condition</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select trigger condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="risk-score">Risk Score Threshold</SelectItem>
                      <SelectItem value="policy-violation">Policy Violation</SelectItem>
                      <SelectItem value="multiple-alerts">Multiple Alerts</SelectItem>
                      <SelectItem value="after-hours">After Hours Access</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsNewRuleOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => {
                  toast.success('Notification rule created');
                  setIsNewRuleOpen(false);
                }}>
                  Create Rule
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Unread Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{unreadCount}</div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">Notifications sent</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Rules</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{notificationRules.filter(r => r.enabled).length}</div>
            <p className="text-xs text-muted-foreground">Monitoring conditions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Critical Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {notifications.filter(n => n.severity === 'CRITICAL' && !n.read).length}
            </div>
            <p className="text-xs text-muted-foreground">Immediate action needed</p>
          </CardContent>
        </Card>
      </div>

      {/* Notification Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="inbox" className="relative">
            Inbox
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2 h-4 w-4 p-0 text-xs">
                {unreadCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="rules">Notification Rules</TabsTrigger>
          <TabsTrigger value="channels">Channels</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Inbox */}
        <TabsContent value="inbox" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search notifications..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Select value={severityFilter} onValueChange={setSeverityFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Severity</SelectItem>
                    <SelectItem value="CRITICAL">Critical</SelectItem>
                    <SelectItem value="HIGH">High</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="INFO">Info</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" />
                  Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Notifications List */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Notifications</CardTitle>
              <CardDescription>
                Showing {filteredNotifications.length} of {notifications.length} notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredNotifications.map((notification) => (
                  <div 
                    key={notification.id} 
                    className={`p-4 rounded-lg border ${!notification.read ? 'bg-muted/50 border-primary/20' : ''}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <div className="flex-shrink-0 mt-1">
                          {getSeverityIcon(notification.severity)}
                        </div>
                        
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center space-x-2">
                            <h4 className={`font-medium ${!notification.read ? 'font-semibold' : ''}`}>
                              {notification.title}
                            </h4>
                            {getSeverityBadge(notification.severity)}
                            {!notification.read && (
                              <Badge variant="outline" className="text-xs">New</Badge>
                            )}
                          </div>
                          
                          <p className="text-sm text-muted-foreground">
                            {notification.message}
                          </p>
                          
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <Clock className="h-3 w-3" />
                              <span>{new Date(notification.timestamp).toLocaleString()}</span>
                            </div>
                            
                            <div className="flex items-center space-x-1">
                              <span>Source: {notification.source}</span>
                            </div>
                            
                            <div className="flex items-center space-x-1">
                              <span>Channels: {notification.channel.join(', ')}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {!notification.read && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleMarkAsRead(notification.id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        )}
                        
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeleteNotification(notification.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Rules */}
        <TabsContent value="rules" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Rules</CardTitle>
              <CardDescription>Automated notification triggers and conditions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {notificationRules.map((rule) => (
                  <div key={rule.id} className="p-4 rounded-lg border">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <Switch
                          checked={rule.enabled}
                          onCheckedChange={(enabled) => handleToggleRule(rule.id, enabled)}
                        />
                        <div>
                          <h4 className="font-medium">{rule.name}</h4>
                          <p className="text-sm text-muted-foreground">{rule.description}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid gap-4 md:grid-cols-3 text-sm">
                      <div>
                        <span className="font-medium">Trigger:</span>
                        <div className="text-muted-foreground">{rule.trigger}</div>
                      </div>
                      <div>
                        <span className="font-medium">Channels:</span>
                        <div className="text-muted-foreground">{rule.channels.join(', ')}</div>
                      </div>
                      <div>
                        <span className="font-medium">Recipients:</span>
                        <div className="text-muted-foreground">{rule.recipients.join(', ')}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Channels */}
        <TabsContent value="channels" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Channels</CardTitle>
              <CardDescription>Configure how notifications are delivered</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {notificationChannels.map((channel) => (
                  <div key={channel.id} className="p-4 rounded-lg border">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        {getChannelIcon(channel)}
                        <div>
                          <h4 className="font-medium">{channel.name}</h4>
                          <p className="text-sm text-muted-foreground">{channel.description}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={channel.enabled}
                          onCheckedChange={(enabled) => handleToggleChannel(channel.id, enabled)}
                        />
                        <Button variant="ghost" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {Object.keys(channel.config).length > 0 && (
                      <div className="text-xs text-muted-foreground space-y-1">
                        {Object.entries(channel.config).map(([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                            <span>{String(value)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings */}
        <TabsContent value="settings" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>Configure global notification preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="enable-sounds">Enable Notification Sounds</Label>
                    <p className="text-sm text-muted-foreground">Play sound for new notifications</p>
                  </div>
                  <Switch id="enable-sounds" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="enable-desktop">Desktop Notifications</Label>
                    <p className="text-sm text-muted-foreground">Show browser notifications</p>
                  </div>
                  <Switch id="enable-desktop" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="quiet-hours">Quiet Hours</Label>
                    <p className="text-sm text-muted-foreground">Suppress non-critical notifications</p>
                  </div>
                  <Switch id="quiet-hours" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Email Settings</CardTitle>
                <CardDescription>Configure email notification preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="email-frequency">Email Frequency</Label>
                  <Select defaultValue="immediate">
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immediate">Immediate</SelectItem>
                      <SelectItem value="hourly">Hourly Digest</SelectItem>
                      <SelectItem value="daily">Daily Digest</SelectItem>
                      <SelectItem value="weekly">Weekly Digest</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="email-template">Email Template</Label>
                  <Select defaultValue="standard">
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="detailed">Detailed</SelectItem>
                      <SelectItem value="summary">Summary Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}