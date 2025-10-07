'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Home, 
  Users, 
  Activity, 
  AlertTriangle, 
  Settings, 
  FileText,
  Lock,
  Bell,
  BarChart3,
  Search,
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const navigation = [
  {
    name: 'Overview',
    href: '/dashboard',
    icon: Home,
    description: 'Dashboard overview and metrics'
  },
  {
    name: 'Employees',
    href: '/dashboard/employees',
    icon: Users,
    description: 'Employee profiles and risk assessment'
  },
  {
    name: 'Activities',
    href: '/dashboard/activities',
    icon: Activity,
    description: 'Real-time user activity monitoring',
    badge: 'Live'
  },
  {
    name: 'Alerts',
    href: '/dashboard/alerts',
    icon: AlertTriangle,
    description: 'Security alerts and incidents',
    badge: 23
  },
  {
    name: 'Restrictions',
    href: '/dashboard/restrictions',
    icon: Lock,
    description: 'Access control and restrictions'
  },
  {
    name: 'Reports',
    href: '/dashboard/reports',
    icon: FileText,
    description: 'Compliance and security reports'
  },
  {
    name: 'Analytics',
    href: '/dashboard/analytics',
    icon: BarChart3,
    description: 'Advanced threat analytics'
  }
];

const bottomNavigation = [
  {
    name: 'Notifications',
    href: '/dashboard/notifications',
    icon: Bell
  },
  {
    name: 'Search',
    href: '/dashboard/search',
    icon: Search
  },
  {
    name: 'Settings',
    href: '/dashboard/settings',
    icon: Settings
  }
];

interface DashboardSidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export function DashboardSidebar({ collapsed, onToggleCollapse }: DashboardSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    if (email) {
      setUserEmail(email);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('auth');
    localStorage.removeItem('userEmail');
    router.push('/auth/login');
  };

  return (
    <div className={cn(
      'flex flex-col h-full bg-sidebar border-r border-sidebar-border transition-all duration-300',
      collapsed ? 'w-16' : 'w-64'
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        {!collapsed && (
          <div className="flex items-center space-x-3">
            <img 
              src="/wema-logo.jpeg" 
              alt="Wema Bank" 
              className="h-16 w-16 object-contain rounded"
            />
            <div>
              <h1 className="text-lg font-bold text-sidebar-foreground">InSafe</h1>
              <p className="text-xs text-sidebar-foreground/70">Wema Bank</p>
            </div>
          </div>
        )}
        
        {collapsed && (
          <img 
            src="/wema-logo.jpeg" 
            alt="Wema Bank" 
            className="h-16 w-16 object-contain rounded mx-auto"
          />
        )}
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleCollapse}
          className="p-2"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="px-3 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== '/dashboard' && pathname?.startsWith(item.href));
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'
                )}
              >
                <item.icon className={cn(
                  'flex-shrink-0 h-4 w-4',
                  collapsed ? 'mr-0' : 'mr-3'
                )} />
                
                {!collapsed && (
                  <>
                    <span className="flex-1">{item.name}</span>
                    {item.badge && (
                      <Badge 
                        variant={typeof item.badge === 'number' ? 'destructive' : 'secondary'}
                        className="ml-auto h-5 px-1.5 text-xs"
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </>
                )}
                
                {collapsed && item.badge && (
                  <div className="absolute left-12 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Badge 
                      variant={typeof item.badge === 'number' ? 'destructive' : 'secondary'}
                      className="h-5 px-1.5 text-xs"
                    >
                      {item.badge}
                    </Badge>
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        <Separator className="mx-3 my-4" />

        {/* Bottom Navigation */}
        <nav className="px-3 space-y-1">
          {bottomNavigation.map((item) => {
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'
                )}
              >
                <item.icon className={cn(
                  'flex-shrink-0 h-4 w-4',
                  collapsed ? 'mr-0' : 'mr-3'
                )} />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Info & Logout */}
      <div className="p-3 border-t border-sidebar-border">
        {!collapsed && (
          <div className="mb-3 px-3 py-2 rounded-lg bg-sidebar-accent/50">
            <p className="text-xs font-medium text-sidebar-foreground">Signed in as</p>
            <p className="text-sm text-sidebar-foreground/70 truncate">{userEmail}</p>
          </div>
        )}
        
        <Button
          variant="ghost"
          className={cn(
            'w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent/50',
            collapsed ? 'px-3' : 'px-3'
          )}
          onClick={handleLogout}
        >
          <LogOut className={cn(
            'h-4 w-4',
            collapsed ? 'mr-0' : 'mr-3'
          )} />
          {!collapsed && <span>Sign Out</span>}
        </Button>
      </div>
    </div>
  );
}