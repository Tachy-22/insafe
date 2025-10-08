'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Settings, 
  Shield, 
  Bell, 
  Users, 
  Lock, 
  Activity,
  Database,
  Mail,
  Smartphone,
  Globe,
  Key,
  Eye,
  EyeOff,
  Save,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Upload,
  Download,
  Trash2,
  Copy
} from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';

const systemStatus = {
  status: 'healthy',
  uptime: '99.9%',
  lastRestart: '2024-09-15T10:30:00Z',
  version: '2.1.4',
  components: [
    { name: 'Web Application', status: 'healthy', response: '120ms' },
    { name: 'Database', status: 'healthy', response: '45ms' },
    { name: 'Email Service', status: 'healthy', response: '200ms' },
    { name: 'SMS Gateway', status: 'warning', response: '800ms' },
    { name: 'File Storage', status: 'healthy', response: '90ms' }
  ]
};

const securitySettings = {
  passwordPolicy: {
    minLength: 12,
    requireUppercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    maxAge: 90,
    preventReuse: 5
  },
  sessionSettings: {
    timeout: 30,
    maxConcurrentSessions: 3,
    enforceHttps: true
  },
  twoFactorAuth: {
    required: false,
    gracePeriod: 7
  }
};

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [showPasswordPolicy, setShowPasswordPolicy] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form states
  const [generalSettings, setGeneralSettings] = useState({
    organizationName: 'Wema Bank Nigeria',
    systemName: 'InSafe Security Platform',
    timezone: 'Africa/Lagos',
    language: 'en',
    dateFormat: 'dd/MM/yyyy',
    enableMaintenanceMode: false
  });

  const [monitoringSettings, setMonitoringSettings] = useState({
    realTimeMonitoring: true,
    activityLogging: true,
    dataRetentionDays: 365,
    riskScoreThreshold: 7.0,
    autoBlockThreshold: 9.0,
    behaviorAnalysis: true,
    anomalyDetection: true
  });

  const [integrationSettings, setIntegrationSettings] = useState({
    activeDirectory: {
      enabled: true,
      server: 'ad.wemabank.com',
      port: 389,
      baseDN: 'dc=wemabank,dc=com'
    },
    emailIntegration: {
      enabled: true,
      smtpServer: 'smtp.wemabank.com',
      port: 587,
      useSSL: true,
      username: 'insafe@wemabank.com'
    },
    smsGateway: {
      enabled: true,
      provider: 'Twilio',
      accountSid: 'AC***',
      fromNumber: '+234-XXX-XXXX'
    }
  });

  const handleSaveSettings = async () => {
    setIsSaving(true);
    
    // Simulate save operation
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSaving(false);
    toast.success('Settings saved successfully', {
      description: 'Your changes have been applied'
    });
  };

  const handleTestIntegration = (type: string) => {
    toast.info(`Testing ${type} integration...`, {
      description: 'This may take a few moments'
    });
    
    setTimeout(() => {
      toast.success(`${type} integration test completed`, {
        description: 'Connection established successfully'
      });
    }, 2000);
  };

  const handleExportSettings = () => {
    toast.success('Settings exported', {
      description: 'Configuration file downloaded'
    });
  };

  const handleImportSettings = () => {
    toast.success('Settings imported', {
      description: 'Configuration has been updated'
    });
  };

  const handleResetSettings = () => {
    toast.warning('Settings reset to defaults', {
      description: 'All customizations have been reverted'
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'text-green-600';
      case 'warning':
        return 'text-yellow-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">System Settings</h1>
          <p className="text-muted-foreground">
            Configure security policies, integrations, and system behavior
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={handleExportSettings}>
            <Download className="mr-2 h-4 w-4" />
            Export Config
          </Button>
          
          <Button variant="outline" size="sm" onClick={handleImportSettings}>
            <Upload className="mr-2 h-4 w-4" />
            Import Config
          </Button>
          
          <Button size="sm" onClick={handleSaveSettings} disabled={isSaving}>
            {isSaving ? (
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {/* System Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5" />
            <span>System Status</span>
          </CardTitle>
          <CardDescription>Real-time system health and performance metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{systemStatus.uptime}</div>
              <div className="text-sm text-muted-foreground">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{systemStatus.version}</div>
              <div className="text-sm text-muted-foreground">Version</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {systemStatus.components.filter(c => c.status === 'healthy').length}/{systemStatus.components.length}
              </div>
              <div className="text-sm text-muted-foreground">Services Online</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {new Date(systemStatus.lastRestart).toLocaleDateString()}
              </div>
              <div className="text-sm text-muted-foreground">Last Restart</div>
            </div>
          </div>

          <Separator className="my-6" />

          <div className="space-y-4">
            <h4 className="font-medium">Component Health</h4>
            {systemStatus.components.map((component, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(component.status)}
                  <span className="font-medium">{component.name}</span>
                </div>
                <div className="flex items-center space-x-4 text-sm">
                  <span className={getStatusColor(component.status)}>
                    {component.status.charAt(0).toUpperCase() + component.status.slice(1)}
                  </span>
                  <span className="text-muted-foreground">{component.response}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Settings Tabs */}
      <Tabs className='w-full' value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full ">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <Image 
                  src="/wema-logo.jpeg" 
                  alt="Wema Bank" 
                  width={32}
                  height={32}
                  className="h-8 w-8 object-contain rounded"
                />
                <span>Organization Settings</span>
              </CardTitle>
              <CardDescription>Basic configuration for your organization</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="org-name">Organization Name</Label>
                  <Input
                    id="org-name"
                    value={generalSettings.organizationName}
                    onChange={(e) => setGeneralSettings({
                      ...generalSettings,
                      organizationName: e.target.value
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="system-name">System Name</Label>
                  <Input
                    id="system-name"
                    value={generalSettings.systemName}
                    onChange={(e) => setGeneralSettings({
                      ...generalSettings,
                      systemName: e.target.value
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select 
                    value={generalSettings.timezone} 
                    onValueChange={(value) => setGeneralSettings({
                      ...generalSettings,
                      timezone: value
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Africa/Lagos">Africa/Lagos (WAT)</SelectItem>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="America/New_York">America/New_York (EST)</SelectItem>
                      <SelectItem value="Europe/London">Europe/London (GMT)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="language">Language</Label>
                  <Select 
                    value={generalSettings.language}
                    onValueChange={(value) => setGeneralSettings({
                      ...generalSettings,
                      language: value
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="ar">Arabic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="maintenance-mode">Maintenance Mode</Label>
                  <p className="text-sm text-muted-foreground">Temporarily disable user access for maintenance</p>
                </div>
                <Switch 
                  id="maintenance-mode"
                  checked={generalSettings.enableMaintenanceMode}
                  onCheckedChange={(checked) => setGeneralSettings({
                    ...generalSettings,
                    enableMaintenanceMode: checked
                  })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Password Policy</span>
              </CardTitle>
              <CardDescription>Configure password requirements and security policies</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="min-length">Minimum Length</Label>
                  <Slider
                    value={[securitySettings.passwordPolicy.minLength]}
                    onValueChange={(value) => console.log('Password length:', value[0])}
                    min={8}
                    max={20}
                    step={1}
                    className="mt-2"
                  />
                  <div className="text-sm text-muted-foreground mt-1">
                    {securitySettings.passwordPolicy.minLength} characters
                  </div>
                </div>
                <div>
                  <Label htmlFor="max-age">Password Age (days)</Label>
                  <Input
                    id="max-age"
                    type="number"
                    value={securitySettings.passwordPolicy.maxAge}
                    min={30}
                    max={365}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Require Uppercase Letters</Label>
                    <p className="text-sm text-muted-foreground">At least one uppercase letter (A-Z)</p>
                  </div>
                  <Switch defaultChecked={securitySettings.passwordPolicy.requireUppercase} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Require Numbers</Label>
                    <p className="text-sm text-muted-foreground">At least one numeric digit (0-9)</p>
                  </div>
                  <Switch defaultChecked={securitySettings.passwordPolicy.requireNumbers} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Require Special Characters</Label>
                    <p className="text-sm text-muted-foreground">At least one special character (!@#$%)</p>
                  </div>
                  <Switch defaultChecked={securitySettings.passwordPolicy.requireSpecialChars} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Key className="h-5 w-5" />
                <span>Two-Factor Authentication</span>
              </CardTitle>
              <CardDescription>Enhance security with multi-factor authentication</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Require 2FA for All Users</Label>
                  <p className="text-sm text-muted-foreground">Force all users to set up two-factor authentication</p>
                </div>
                <Switch defaultChecked={securitySettings.twoFactorAuth.required} />
              </div>

              <div>
                <Label htmlFor="grace-period">Grace Period (days)</Label>
                <Input
                  id="grace-period"
                  type="number"
                  value={securitySettings.twoFactorAuth.gracePeriod}
                  min={0}
                  max={30}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Allow users this many days to set up 2FA before enforcing
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Monitoring Settings */}
        <TabsContent value="monitoring" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Eye className="h-5 w-5" />
                <span>Activity Monitoring</span>
              </CardTitle>
              <CardDescription>Configure how user activities are monitored and analyzed</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Real-time Monitoring</Label>
                    <p className="text-sm text-muted-foreground">Monitor activities in real-time</p>
                  </div>
                  <Switch 
                    checked={monitoringSettings.realTimeMonitoring}
                    onCheckedChange={(checked) => setMonitoringSettings({
                      ...monitoringSettings,
                      realTimeMonitoring: checked
                    })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Activity Logging</Label>
                    <p className="text-sm text-muted-foreground">Log all user activities</p>
                  </div>
                  <Switch 
                    checked={monitoringSettings.activityLogging}
                    onCheckedChange={(checked) => setMonitoringSettings({
                      ...monitoringSettings,
                      activityLogging: checked
                    })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Behavior Analysis</Label>
                    <p className="text-sm text-muted-foreground">AI-powered behavior analysis</p>
                  </div>
                  <Switch 
                    checked={monitoringSettings.behaviorAnalysis}
                    onCheckedChange={(checked) => setMonitoringSettings({
                      ...monitoringSettings,
                      behaviorAnalysis: checked
                    })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Anomaly Detection</Label>
                    <p className="text-sm text-muted-foreground">Detect unusual patterns</p>
                  </div>
                  <Switch 
                    checked={monitoringSettings.anomalyDetection}
                    onCheckedChange={(checked) => setMonitoringSettings({
                      ...monitoringSettings,
                      anomalyDetection: checked
                    })}
                  />
                </div>
              </div>

              <Separator />

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="risk-threshold">Risk Score Alert Threshold</Label>
                  <Slider
                    value={[monitoringSettings.riskScoreThreshold]}
                    onValueChange={(value) => setMonitoringSettings({
                      ...monitoringSettings,
                      riskScoreThreshold: value[0]
                    })}
                    min={1}
                    max={10}
                    step={0.1}
                    className="mt-2"
                  />
                  <div className="text-sm text-muted-foreground mt-1">
                    {monitoringSettings.riskScoreThreshold}/10
                  </div>
                </div>

                <div>
                  <Label htmlFor="auto-block-threshold">Auto-block Threshold</Label>
                  <Slider
                    value={[monitoringSettings.autoBlockThreshold]}
                    onValueChange={(value) => setMonitoringSettings({
                      ...monitoringSettings,
                      autoBlockThreshold: value[0]
                    })}
                    min={5}
                    max={10}
                    step={0.1}
                    className="mt-2"
                  />
                  <div className="text-sm text-muted-foreground mt-1">
                    {monitoringSettings.autoBlockThreshold}/10
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="data-retention">Data Retention Period (days)</Label>
                <Input
                  id="data-retention"
                  type="number"
                  value={monitoringSettings.dataRetentionDays}
                  onChange={(e) => setMonitoringSettings({
                    ...monitoringSettings,
                    dataRetentionDays: parseInt(e.target.value)
                  })}
                  min={30}
                  max={2555}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  How long to keep activity logs and monitoring data
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Notification Preferences</span>
              </CardTitle>
              <CardDescription>Configure how and when notifications are sent</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h4 className="font-medium">Email Notifications</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="email-critical">Critical Alerts</Label>
                      <Switch id="email-critical" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="email-high">High Risk Activities</Label>
                      <Switch id="email-high" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="email-reports">Daily Reports</Label>
                      <Switch id="email-reports" />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="email-system">System Updates</Label>
                      <Switch id="email-system" defaultChecked />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">SMS Notifications</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="sms-critical">Critical Alerts Only</Label>
                      <Switch id="sms-critical" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="sms-after-hours">After Hours Alerts</Label>
                      <Switch id="sms-after-hours" />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="sms-system">System Failures</Label>
                      <Switch id="sms-system" defaultChecked />
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-4">Notification Schedule</h4>
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <Label htmlFor="quiet-start">Quiet Hours Start</Label>
                    <Input id="quiet-start" type="time" defaultValue="22:00" />
                  </div>
                  <div>
                    <Label htmlFor="quiet-end">Quiet Hours End</Label>
                    <Input id="quiet-end" type="time" defaultValue="06:00" />
                  </div>
                  <div>
                    <Label htmlFor="digest-time">Daily Digest Time</Label>
                    <Input id="digest-time" type="time" defaultValue="08:00" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integrations Settings */}
        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Globe className="h-5 w-5" />
                <span>External Integrations</span>
              </CardTitle>
              <CardDescription>Connect with external systems and services</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Active Directory */}
              <div className="p-4 rounded-lg border">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Users className="h-5 w-5" />
                    <div>
                      <h4 className="font-medium">Active Directory</h4>
                      <p className="text-sm text-muted-foreground">User authentication and management</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={integrationSettings.activeDirectory.enabled ? 'secondary' : 'outline'}>
                      {integrationSettings.activeDirectory.enabled ? 'Connected' : 'Disabled'}
                    </Badge>
                    <Switch 
                      checked={integrationSettings.activeDirectory.enabled}
                      onCheckedChange={(checked) => setIntegrationSettings({
                        ...integrationSettings,
                        activeDirectory: { ...integrationSettings.activeDirectory, enabled: checked }
                      })}
                    />
                  </div>
                </div>
                
                {integrationSettings.activeDirectory.enabled && (
                  <div className="grid gap-3 md:grid-cols-2">
                    <div>
                      <Label htmlFor="ad-server">Server</Label>
                      <Input 
                        id="ad-server" 
                        value={integrationSettings.activeDirectory.server}
                        onChange={(e) => setIntegrationSettings({
                          ...integrationSettings,
                          activeDirectory: { ...integrationSettings.activeDirectory, server: e.target.value }
                        })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="ad-port">Port</Label>
                      <Input 
                        id="ad-port" 
                        type="number"
                        value={integrationSettings.activeDirectory.port}
                        onChange={(e) => setIntegrationSettings({
                          ...integrationSettings,
                          activeDirectory: { ...integrationSettings.activeDirectory, port: parseInt(e.target.value) }
                        })}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="ad-base-dn">Base DN</Label>
                      <Input 
                        id="ad-base-dn" 
                        value={integrationSettings.activeDirectory.baseDN}
                        onChange={(e) => setIntegrationSettings({
                          ...integrationSettings,
                          activeDirectory: { ...integrationSettings.activeDirectory, baseDN: e.target.value }
                        })}
                      />
                    </div>
                    <div className="md:col-span-2 flex space-x-2">
                      <Button variant="outline" onClick={() => handleTestIntegration('Active Directory')}>
                        Test Connection
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Email Integration */}
              <div className="p-4 rounded-lg border">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5" />
                    <div>
                      <h4 className="font-medium">Email Service</h4>
                      <p className="text-sm text-muted-foreground">SMTP configuration for notifications</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={integrationSettings.emailIntegration.enabled ? 'secondary' : 'outline'}>
                      {integrationSettings.emailIntegration.enabled ? 'Connected' : 'Disabled'}
                    </Badge>
                    <Switch 
                      checked={integrationSettings.emailIntegration.enabled}
                      onCheckedChange={(checked) => setIntegrationSettings({
                        ...integrationSettings,
                        emailIntegration: { ...integrationSettings.emailIntegration, enabled: checked }
                      })}
                    />
                  </div>
                </div>
                
                {integrationSettings.emailIntegration.enabled && (
                  <div className="grid gap-3 md:grid-cols-2">
                    <div>
                      <Label htmlFor="smtp-server">SMTP Server</Label>
                      <Input 
                        id="smtp-server" 
                        value={integrationSettings.emailIntegration.smtpServer}
                        onChange={(e) => setIntegrationSettings({
                          ...integrationSettings,
                          emailIntegration: { ...integrationSettings.emailIntegration, smtpServer: e.target.value }
                        })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="smtp-port">Port</Label>
                      <Input 
                        id="smtp-port" 
                        type="number"
                        value={integrationSettings.emailIntegration.port}
                        onChange={(e) => setIntegrationSettings({
                          ...integrationSettings,
                          emailIntegration: { ...integrationSettings.emailIntegration, port: parseInt(e.target.value) }
                        })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="smtp-username">Username</Label>
                      <Input 
                        id="smtp-username" 
                        value={integrationSettings.emailIntegration.username}
                        onChange={(e) => setIntegrationSettings({
                          ...integrationSettings,
                          emailIntegration: { ...integrationSettings.emailIntegration, username: e.target.value }
                        })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="smtp-password">Password</Label>
                      <Input 
                        id="smtp-password" 
                        type="password"
                        placeholder="Enter SMTP password"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch 
                        checked={integrationSettings.emailIntegration.useSSL}
                        onCheckedChange={(checked) => setIntegrationSettings({
                          ...integrationSettings,
                          emailIntegration: { ...integrationSettings.emailIntegration, useSSL: checked }
                        })}
                      />
                      <Label>Use SSL/TLS</Label>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" onClick={() => handleTestIntegration('Email')}>
                        Send Test Email
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Advanced Settings */}
        <TabsContent value="advanced" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="h-5 w-5" />
                <span>Advanced Configuration</span>
              </CardTitle>
              <CardDescription>Advanced system settings and database configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 rounded-lg border-dashed border-2 border-yellow-200 bg-yellow-50">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-800">Warning</h4>
                    <p className="text-sm text-yellow-700">
                      These settings are for advanced users only. Incorrect configuration may cause system instability.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="db-pool-size">Database Connection Pool Size</Label>
                  <Input id="db-pool-size" type="number" defaultValue="20" min="5" max="100" />
                  <p className="text-xs text-muted-foreground mt-1">
                    Maximum number of concurrent database connections
                  </p>
                </div>

                <div>
                  <Label htmlFor="cache-ttl">Cache TTL (seconds)</Label>
                  <Input id="cache-ttl" type="number" defaultValue="3600" min="60" max="86400" />
                  <p className="text-xs text-muted-foreground mt-1">
                    Time-to-live for cached data
                  </p>
                </div>

                <div>
                  <Label htmlFor="log-level">Log Level</Label>
                  <Select defaultValue="INFO">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DEBUG">Debug</SelectItem>
                      <SelectItem value="INFO">Info</SelectItem>
                      <SelectItem value="WARN">Warning</SelectItem>
                      <SelectItem value="ERROR">Error</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Enable Debug Mode</Label>
                    <p className="text-sm text-muted-foreground">Show detailed error messages and logs</p>
                  </div>
                  <Switch />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium text-red-600">Danger Zone</h4>
                
                <div className="space-y-3">
                  <Button variant="outline" onClick={handleResetSettings}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Reset All Settings
                  </Button>
                  
                  <Button variant="destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Clear All Data
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}