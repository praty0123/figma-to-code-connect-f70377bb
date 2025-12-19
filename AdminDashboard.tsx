import { useState } from 'react';
import { Users, Activity, AlertTriangle, DollarSign, TrendingUp, FileText, Shield, Package, LogOut, Heart, BarChart3, Calendar, UserCog, CalendarRange } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ClientAssignmentManager } from './ClientAssignmentManager';
import { StaffRosterEditor } from './StaffRosterEditor';
import { StaffInsights } from './StaffInsights';

interface AdminDashboardProps {
  user: any;
  onLogout: () => void;
}

export function AdminDashboard({ user, onLogout }: AdminDashboardProps) {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [navigationData, setNavigationData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddResidentDialog, setShowAddResidentDialog] = useState(false);
  const [showResidentDetailsDialog, setShowResidentDetailsDialog] = useState(false);
  const [showAddInventoryDialog, setShowAddInventoryDialog] = useState(false);
  const [selectedResident, setSelectedResident] = useState<any>(null);

  const stats = {
    totalResidents: 45,
    activeStaff: 18,
    openIncidents: 3,
    monthlyRevenue: 1575000,
  };

  const residents = [
    { id: 1, name: 'Mrs. Lakshmi Devi', age: 72, room: 'A-204', status: 'healthy', lastCheckup: '2 days ago' },
    { id: 2, name: 'Mr. Ramesh Kumar', age: 78, room: 'A-301', status: 'monitoring', lastCheckup: '1 day ago' },
    { id: 3, name: 'Mrs. Sita Reddy', age: 70, room: 'B-102', status: 'healthy', lastCheckup: '3 days ago' },
    { id: 4, name: 'Mr. Anil Sharma', age: 75, room: 'A-205', status: 'healthy', lastCheckup: '1 day ago' },
  ];

  const staffPerformance = [
    { name: 'Nurse Priya', tasksCompleted: 142, rating: 4.8, efficiency: 95 },
    { name: 'Caregiver Raj', tasksCompleted: 138, rating: 4.6, efficiency: 92 },
    { name: 'Nurse Meena', tasksCompleted: 135, rating: 4.9, efficiency: 94 },
    { name: 'Caregiver Suresh', tasksCompleted: 128, rating: 4.5, efficiency: 88 },
  ];

  const healthTrendsData = [
    { month: 'Aug', avgBP: 128, avgSugar: 115, incidents: 5 },
    { month: 'Sep', avgBP: 130, avgSugar: 112, incidents: 3 },
    { month: 'Oct', avgBP: 127, avgSugar: 110, incidents: 4 },
    { month: 'Nov', avgBP: 129, avgSugar: 113, incidents: 2 },
    { month: 'Dec', avgBP: 128, avgSugar: 111, incidents: 3 },
  ];

  const revenueData = [
    { month: 'Aug', revenue: 1520000, expenses: 980000 },
    { month: 'Sep', revenue: 1545000, expenses: 995000 },
    { month: 'Oct', revenue: 1568000, expenses: 1010000 },
    { month: 'Nov', revenue: 1590000, expenses: 1025000 },
    { month: 'Dec', revenue: 1575000, expenses: 1015000 },
  ];

  const inventory = [
    { item: 'BP Medicines', quantity: 450, reorderLevel: 200, status: 'good' },
    { item: 'Diabetes Medicines', quantity: 180, reorderLevel: 200, status: 'low' },
    { item: 'Vitamins', quantity: 520, reorderLevel: 300, status: 'good' },
    { item: 'First Aid Supplies', quantity: 150, reorderLevel: 100, status: 'good' },
  ];

  const complianceLogs = [
    { type: 'Fire Safety Drill', date: '25 Nov 2025', status: 'completed' },
    { type: 'Medical Equipment Check', date: '28 Nov 2025', status: 'completed' },
    { type: 'Staff Training', date: '1 Dec 2025', status: 'completed' },
    { type: 'Health Inspection', date: '15 Dec 2025', status: 'scheduled' },
  ];

  const handleNavigation = (page: string, data?: any) => {
    setCurrentPage(page);
    setNavigationData(data || null);
  };

  // Render different pages based on navigation
  if (currentPage === 'clientAssignment') {
    return <ClientAssignmentManager onNavigate={handleNavigation} />;
  }

  if (currentPage === 'rosterEditor') {
    return <StaffRosterEditor onNavigate={handleNavigation} />;
  }

  if (currentPage === 'staffInsights') {
    return <StaffInsights onNavigate={handleNavigation} />;
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Heart className="size-6 text-green-600" />
              <span className="text-xl text-green-900">AuraHome</span>
              <Badge className="ml-2">Admin</Badge>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm text-neutral-900">{user?.user_metadata?.name || 'Administrator'}</p>
                  <p className="text-xs text-neutral-500">Community Manager</p>
                </div>
                <Button variant="ghost" size="icon" onClick={onLogout}>
                  <LogOut className="size-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={<Users className="size-6 text-blue-600" />}
            label="Total Residents"
            value={stats.totalResidents.toString()}
            change="+2 this month"
            bgColor="bg-blue-50"
          />
          <StatCard
            icon={<Activity className="size-6 text-green-600" />}
            label="Active Staff"
            value={stats.activeStaff.toString()}
            change="18 on duty"
            bgColor="bg-green-50"
          />
          <StatCard
            icon={<AlertTriangle className="size-6 text-orange-600" />}
            label="Open Incidents"
            value={stats.openIncidents.toString()}
            change="-2 from last week"
            bgColor="bg-orange-50"
          />
          <StatCard
            icon={<DollarSign className="size-6 text-purple-600" />}
            label="Monthly Revenue"
            value={`₹${(stats.monthlyRevenue / 100000).toFixed(1)}L`}
            change="+5% from last month"
            bgColor="bg-purple-50"
          />
        </div>

        {/* Quick Actions for Staff Management */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleNavigation('clientAssignment')}>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <UserCog className="size-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-neutral-900">Client Assignment Manager</h3>
                <p className="text-sm text-neutral-600">Reassign clients to staff</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleNavigation('rosterEditor')}>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                <CalendarRange className="size-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-neutral-900">Weekly Roster Editor</h3>
                <p className="text-sm text-neutral-600">Manage staff schedules</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleNavigation('staffInsights')}>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <BarChart3 className="size-6 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-neutral-900">Staff Insights</h3>
                <p className="text-sm text-neutral-600">View performance metrics</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="residents">Residents</TabsTrigger>
            <TabsTrigger value="staff">Staff</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Health Trends */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="size-5 text-green-600" />
                <h2 className="text-xl text-neutral-900">Health Trends</h2>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={healthTrendsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="avgBP" stroke="#10b981" name="Avg BP" />
                  <Line type="monotone" dataKey="avgSugar" stroke="#3b82f6" name="Avg Sugar" />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            {/* Revenue Analysis */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <BarChart3 className="size-5 text-purple-600" />
                <h2 className="text-xl text-neutral-900">Revenue & Expenses</h2>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="revenue" fill="#10b981" name="Revenue" />
                  <Bar dataKey="expenses" fill="#f59e0b" name="Expenses" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </TabsContent>

          {/* Residents Tab */}
          <TabsContent value="residents">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl text-neutral-900">Resident Profiles</h2>
                <Button className="bg-green-600 hover:bg-green-700" onClick={() => setShowAddResidentDialog(true)}>
                  + Add Resident
                </Button>
              </div>

              <div className="space-y-3">
                {residents.map((resident) => (
                  <div key={resident.id} className="p-4 border border-neutral-200 rounded-lg hover:shadow-md transition-shadow" onClick={() => { setSelectedResident(resident); setShowResidentDetailsDialog(true); }}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-blue-100 rounded-full flex items-center justify-center">
                          <Users className="size-6 text-green-700" />
                        </div>
                        <div>
                          <h3 className="text-neutral-900">{resident.name}</h3>
                          <p className="text-sm text-neutral-600">
                            Age: {resident.age} • Room: {resident.room} • Last checkup: {resident.lastCheckup}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={resident.status === 'healthy' ? 'default' : 'secondary'}>
                          {resident.status}
                        </Badge>
                        <Button variant="outline" size="sm">View Profile</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Staff Tab */}
          <TabsContent value="staff">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl text-neutral-900">Staff Performance</h2>
                <Button className="bg-green-600 hover:bg-green-700">
                  View Full Report
                </Button>
              </div>

              <div className="space-y-4">
                {staffPerformance.map((staff, index) => (
                  <div key={index} className="p-4 border border-neutral-200 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-neutral-900">{staff.name}</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-neutral-600">Rating:</span>
                        <Badge>{staff.rating} ⭐</Badge>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-neutral-600">Tasks Completed:</span>
                        <span className="ml-2 text-neutral-900">{staff.tasksCompleted}</span>
                      </div>
                      <div>
                        <span className="text-neutral-600">Efficiency:</span>
                        <span className="ml-2 text-neutral-900">{staff.efficiency}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Inventory Tab */}
          <TabsContent value="inventory">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Package className="size-5 text-blue-600" />
                  <h2 className="text-xl text-neutral-900">Inventory Management</h2>
                </div>
                <Button className="bg-green-600 hover:bg-green-700" onClick={() => setShowAddInventoryDialog(true)}>
                  + Add Item
                </Button>
              </div>

              <div className="space-y-3">
                {inventory.map((item, index) => (
                  <div key={index} className="p-4 border border-neutral-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-neutral-900">{item.item}</h3>
                          <Badge variant={item.status === 'good' ? 'default' : 'destructive'}>
                            {item.status === 'good' ? 'In Stock' : 'Low Stock'}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-6 text-sm text-neutral-600">
                          <span>Quantity: {item.quantity}</span>
                          <span>Reorder Level: {item.reorderLevel}</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">Reorder</Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Compliance Tab */}
          <TabsContent value="compliance">
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Shield className="size-5 text-green-600" />
                <h2 className="text-xl text-neutral-900">Compliance & Safety Logs</h2>
              </div>

              <div className="space-y-3">
                {complianceLogs.map((log, index) => (
                  <div key={index} className="p-4 border border-neutral-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Calendar className="size-5 text-neutral-600" />
                        <div>
                          <h3 className="text-neutral-900">{log.type}</h3>
                          <p className="text-sm text-neutral-600">{log.date}</p>
                        </div>
                      </div>
                      <Badge variant={log.status === 'completed' ? 'default' : 'secondary'}>
                        {log.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>

              <Button className="w-full mt-6" variant="outline">
                <FileText className="size-4 mr-2" />
                Export Compliance Report
              </Button>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  change,
  bgColor,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  change: string;
  bgColor: string;
}) {
  return (
    <Card className={`p-4 ${bgColor}`}>
      <div className="flex items-start justify-between mb-3">
        {icon}
      </div>
      <p className="text-3xl text-neutral-900 mb-1">{value}</p>
      <p className="text-sm text-neutral-700 mb-1">{label}</p>
      <p className="text-xs text-neutral-600">{change}</p>
    </Card>
  );
}