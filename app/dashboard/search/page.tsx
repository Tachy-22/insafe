'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { 
  Search, 
  Filter, 
  Calendar as CalendarIcon,
  Clock,
  User,
  Activity,
  AlertTriangle,
  FileText,
  Download,
  Eye,
  ChevronRight,
  History,
  Bookmark,
  Star,
  TrendingUp
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { employees, activities, alerts, restrictions } from '@/lib/dummy-data';
import { toast } from 'sonner';

const recentSearches = [
  'Ibrahim Musa data exfiltration',
  'High risk employees Treasury',
  'USB violations last week',
  'After hours access patterns',
  'Email policy violations'
];

const savedSearches = [
  {
    id: '1',
    name: 'High Risk Activities',
    query: 'risk_score:>=7',
    description: 'All activities with risk score 7 or higher',
    starred: true
  },
  {
    id: '2',
    name: 'Data Exfiltration Attempts',
    query: 'type:CLOUD_UPLOAD OR type:EMAIL status:BLOCKED',
    description: 'Blocked cloud uploads and external emails',
    starred: false
  },
  {
    id: '3',
    name: 'Critical Alerts This Month',
    query: 'severity:CRITICAL date:>2024-10-01',
    description: 'All critical security alerts from this month',
    starred: true
  }
];

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined
  });
  const [searchResults, setSearchResults] = useState<({
    _type: 'employee' | 'activity' | 'alert' | 'restriction';
    id: string;
  } & Record<string, unknown>)[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  // Get search query from URL params if exists
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('q');
    if (query) {
      setSearchQuery(decodeURIComponent(query));
      handleSearch(decodeURIComponent(query));
    }
  }, []);

  const handleSearch = async (query?: string) => {
    const searchTerm = query || searchQuery;
    if (!searchTerm.trim()) return;

    setIsSearching(true);
    
    // Simulate search delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock search results combining different data types
    const results = [];
    
    // Search employees
    const matchingEmployees = employees.filter(emp => 
      emp.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.role.toLowerCase().includes(searchTerm.toLowerCase())
    ).map(emp => ({ ...emp, _type: 'employee' }));
    
    // Search activities
    const matchingActivities = activities.filter(act => 
      act.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      act.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      act.employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      act.employee.lastName.toLowerCase().includes(searchTerm.toLowerCase())
    ).map(act => ({ ...act, _type: 'activity' }));
    
    // Search alerts
    const matchingAlerts = alerts.filter(alert => 
      alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.employee.lastName.toLowerCase().includes(searchTerm.toLowerCase())
    ).map(alert => ({ ...alert, _type: 'alert' }));
    
    // Search restrictions
    const matchingRestrictions = restrictions.filter(rest => 
      rest.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rest.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rest.employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rest.employee.lastName.toLowerCase().includes(searchTerm.toLowerCase())
    ).map(rest => ({ ...rest, _type: 'restriction' }));
    
    results.push(...matchingEmployees, ...matchingActivities, ...matchingAlerts, ...matchingRestrictions);
    
    setSearchResults(results);
    setIsSearching(false);
  };

  const handleSaveSearch = () => {
    if (!searchQuery.trim()) return;
    toast.success('Search saved', {
      description: 'You can access this search from your saved searches'
    });
  };

  const handleExportResults = () => {
    toast.success('Search results exported', {
      description: 'Results have been exported to CSV'
    });
  };

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'employee':
        return <User className="h-4 w-4 text-blue-600" />;
      case 'activity':
        return <Activity className="h-4 w-4 text-green-600" />;
      case 'alert':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'restriction':
        return <FileText className="h-4 w-4 text-orange-600" />;
      default:
        return <Search className="h-4 w-4 text-gray-600" />;
    }
  };

  const getResultTitle = (result: { _type: string; [key: string]: unknown }) => {
    switch (result._type) {
      case 'employee':
        return `${result.firstName} ${result.lastName} (${result.employeeId})`;
      case 'activity':
        return result.action;
      case 'alert':
        return result.title;
      case 'restriction':
        return `${result.type} restriction for ${result.employee.firstName} ${result.employee.lastName}`;
      default:
        return 'Unknown';
    }
  };

  const getResultDescription = (result: { _type: string; [key: string]: unknown }) => {
    switch (result._type) {
      case 'employee':
        return `${result.department} • ${result.role} • Risk Level: ${result.riskLevel}`;
      case 'activity':
        return `${result.description} • Risk Score: ${result.riskScore}`;
      case 'alert':
        return `${result.description} • Severity: ${result.severity}`;
      case 'restriction':
        return `${result.service} • ${result.reason}`;
      default:
        return '';
    }
  };

  const filteredResults = searchResults.filter(result => {
    if (selectedCategory === 'all') return true;
    return result._type === selectedCategory;
  });

  const getTabCounts = () => {
    return {
      all: searchResults.length,
      employee: searchResults.filter(r => r._type === 'employee').length,
      activity: searchResults.filter(r => r._type === 'activity').length,
      alert: searchResults.filter(r => r._type === 'alert').length,
      restriction: searchResults.filter(r => r._type === 'restriction').length
    };
  };

  const tabCounts = getTabCounts();

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Advanced Search</h1>
          <p className="text-muted-foreground">
            Search across employees, activities, alerts, and security data
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={handleSaveSearch} disabled={!searchQuery.trim()}>
            <Bookmark className="mr-2 h-4 w-4" />
            Save Search
          </Button>
          
          <Button variant="outline" size="sm" onClick={handleExportResults} disabled={searchResults.length === 0}>
            <Download className="mr-2 h-4 w-4" />
            Export Results
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {/* Main search input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search employees, activities, alerts, restrictions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 text-lg h-12"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Button 
                className="absolute right-2 top-1/2 -translate-y-1/2"
                onClick={() => handleSearch()}
                disabled={isSearching}
              >
                {isSearching ? 'Searching...' : 'Search'}
              </Button>
            </div>

            {/* Advanced filters */}
            <div className="grid gap-4 md:grid-cols-4">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="employee">Employees</SelectItem>
                  <SelectItem value="activity">Activities</SelectItem>
                  <SelectItem value="alert">Alerts</SelectItem>
                  <SelectItem value="restriction">Restrictions</SelectItem>
                </SelectContent>
              </Select>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'justify-start text-left font-normal',
                      !dateRange?.from && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange?.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, 'LLL dd, y')} - {format(dateRange.to, 'LLL dd, y')}
                        </>
                      ) : (
                        format(dateRange.from, 'LLL dd, y')
                      )
                    ) : (
                      <span>Date range</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>

              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                More Filters
              </Button>

              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setDateRange({ from: undefined, to: undefined });
                  setSearchResults([]);
                }}
              >
                Clear All
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Access */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Searches */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <History className="h-5 w-5" />
              <span>Recent Searches</span>
            </CardTitle>
            <CardDescription>Your recent search queries</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentSearches.map((search, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className="w-full justify-start text-left h-auto p-2"
                  onClick={() => {
                    setSearchQuery(search);
                    handleSearch(search);
                  }}
                >
                  <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="truncate">{search}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Saved Searches */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Star className="h-5 w-5" />
              <span>Saved Searches</span>
            </CardTitle>
            <CardDescription>Your bookmarked search queries</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {savedSearches.map((search) => (
                <div key={search.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50">
                  {search.starred && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                  <div className="flex-1">
                    <div className="font-medium">{search.name}</div>
                    <div className="text-xs text-muted-foreground">{search.description}</div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSearchQuery(search.query);
                      handleSearch(search.query);
                    }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Search Results</CardTitle>
            <CardDescription>
              Found {searchResults.length} results for &quot;{searchQuery}&quot;
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="all" className="relative">
                  All
                  {tabCounts.all > 0 && (
                    <Badge variant="secondary" className="ml-2 h-4 w-4 p-0 text-xs">
                      {tabCounts.all}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="employee" className="relative">
                  Employees
                  {tabCounts.employee > 0 && (
                    <Badge variant="secondary" className="ml-2 h-4 w-4 p-0 text-xs">
                      {tabCounts.employee}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="activity" className="relative">
                  Activities
                  {tabCounts.activity > 0 && (
                    <Badge variant="secondary" className="ml-2 h-4 w-4 p-0 text-xs">
                      {tabCounts.activity}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="alert" className="relative">
                  Alerts
                  {tabCounts.alert > 0 && (
                    <Badge variant="secondary" className="ml-2 h-4 w-4 p-0 text-xs">
                      {tabCounts.alert}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="restriction" className="relative">
                  Restrictions
                  {tabCounts.restriction > 0 && (
                    <Badge variant="secondary" className="ml-2 h-4 w-4 p-0 text-xs">
                      {tabCounts.restriction}
                    </Badge>
                  )}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-4">
                <div className="space-y-4">
                  {searchResults.map((result, index) => (
                    <div key={index} className="flex items-center space-x-4 p-4 rounded-lg border hover:bg-muted/50">
                      <div className="flex-shrink-0">
                        {getResultIcon(result._type)}
                      </div>
                      
                      <div className="flex-1">
                        <h4 className="font-medium">{getResultTitle(result)}</h4>
                        <p className="text-sm text-muted-foreground">{getResultDescription(result)}</p>
                        
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge variant="outline" className="text-xs capitalize">
                            {result._type}
                          </Badge>
                          
                          {result._type === 'employee' && (
                            <Badge variant={result.riskLevel === 'CRITICAL' ? 'destructive' : 'secondary'} className="text-xs">
                              {result.riskLevel} Risk
                            </Badge>
                          )}
                          
                          {result._type === 'activity' && (
                            <Badge variant={result.status === 'BLOCKED' ? 'destructive' : 'secondary'} className="text-xs">
                              {result.status}
                            </Badge>
                          )}
                          
                          {result._type === 'alert' && (
                            <Badge variant={result.severity === 'CRITICAL' ? 'destructive' : 'secondary'} className="text-xs">
                              {result.severity}
                            </Badge>
                          )}
                          
                          {(result._type === 'activity' || result._type === 'alert') && (
                            <span className="text-xs text-muted-foreground">
                              {new Date(result.timestamp).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <Button variant="ghost" size="sm">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </TabsContent>

              {['employee', 'activity', 'alert', 'restriction'].map(type => (
                <TabsContent key={type} value={type} className="mt-4">
                  <div className="space-y-4">
                    {searchResults
                      .filter(result => result._type === type)
                      .map((result, index) => (
                        <div key={index} className="flex items-center space-x-4 p-4 rounded-lg border hover:bg-muted/50">
                          <div className="flex-shrink-0">
                            {getResultIcon(result._type)}
                          </div>
                          
                          <div className="flex-1">
                            <h4 className="font-medium">{getResultTitle(result)}</h4>
                            <p className="text-sm text-muted-foreground">{getResultDescription(result)}</p>
                          </div>
                          
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* Search Tips */}
      {searchResults.length === 0 && searchQuery === '' && (
        <Card>
          <CardHeader>
            <CardTitle>Search Tips</CardTitle>
            <CardDescription>Get the most out of your searches</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="font-medium mb-2">Basic Search</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Enter names, IDs, or keywords</li>
                  <li>• Use quotes for exact phrases</li>
                  <li>• Search is case-insensitive</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Advanced Filters</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Use category filters to narrow results</li>
                  <li>• Set date ranges for time-based searches</li>
                  <li>• Combine multiple filters for precision</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Search Examples</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• &quot;Ibrahim Musa&quot; - exact name match</li>
                  <li>• Treasury high risk - department and risk level</li>
                  <li>• USB blocked - activity type and status</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Save & Export</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Save frequently used searches</li>
                  <li>• Export results to CSV</li>
                  <li>• Access recent searches quickly</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}