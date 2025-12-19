import { useState } from 'react';
import { Users, Activity, AlertTriangle, DollarSign, LogOut, Heart, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface AdminDashboardProps {
  user: any;
  onLogout: () => void;
}

export function AdminDashboard({ user, onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const stats = { totalResidents: 45, activeStaff: 18, openIncidents: 3, monthlyRevenue: 1575000 };

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Heart className="size-6 text-green-600" />
              <span className="text-xl text-green-900">AuraHome</span>
              <Badge className="ml-2">Admin</Badge>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm text-neutral-900">{user?.user_metadata?.name || 'Administrator'}</p>
                <p className="text-xs text-neutral-500">Community Manager</p>
              </div>
              <Button variant="ghost" size="icon" onClick={onLogout}><LogOut className="size-5" /></Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="p-4 bg-blue-50"><div className="flex items-center gap-3"><Users className="size-6 text-blue-600" /><div><p className="text-sm text-neutral-600">Total Residents</p><p className="text-2xl text-neutral-900">{stats.totalResidents}</p></div></div></Card>
          <Card className="p-4 bg-green-50"><div className="flex items-center gap-3"><Activity className="size-6 text-green-600" /><div><p className="text-sm text-neutral-600">Active Staff</p><p className="text-2xl text-neutral-900">{stats.activeStaff}</p></div></div></Card>
          <Card className="p-4 bg-orange-50"><div className="flex items-center gap-3"><AlertTriangle className="size-6 text-orange-600" /><div><p className="text-sm text-neutral-600">Open Incidents</p><p className="text-2xl text-neutral-900">{stats.openIncidents}</p></div></div></Card>
          <Card className="p-4 bg-purple-50"><div className="flex items-center gap-3"><DollarSign className="size-6 text-purple-600" /><div><p className="text-sm text-neutral-600">Monthly Revenue</p><p className="text-2xl text-neutral-900">₹{(stats.monthlyRevenue / 100000).toFixed(1)}L</p></div></div></Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6"><TabsTrigger value="overview">Overview</TabsTrigger><TabsTrigger value="residents">Residents</TabsTrigger><TabsTrigger value="staff">Staff</TabsTrigger></TabsList>
          <TabsContent value="overview"><Card className="p-6"><div className="flex items-center gap-2 mb-4"><BarChart3 className="size-5 text-green-600" /><h2 className="text-xl text-neutral-900">Facility Overview</h2></div><p className="text-neutral-600">All systems operational. No critical alerts.</p></Card></TabsContent>
          <TabsContent value="residents"><Card className="p-6"><h2 className="text-xl text-neutral-900 mb-4">Resident Profiles</h2><p className="text-neutral-600">{stats.totalResidents} residents currently in the facility.</p></Card></TabsContent>
          <TabsContent value="staff"><Card className="p-6"><h2 className="text-xl text-neutral-900 mb-4">Staff Management</h2><p className="text-neutral-600">{stats.activeStaff} staff members on duty.</p></Card></TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
