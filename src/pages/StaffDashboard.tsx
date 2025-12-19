import { useState } from 'react';
import { CheckCircle, AlertTriangle, Users, ClipboardList, LogOut, Heart, Pill, Activity, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface StaffDashboardProps {
  user: any;
  onLogout: () => void;
}

export function StaffDashboard({ user, onLogout }: StaffDashboardProps) {
  const [activeTab, setActiveTab] = useState('tasks');
  
  const tasks = [
    { id: 1, type: 'medication', resident: 'Mrs. Lakshmi Devi', room: 'A-204', task: 'BP Medicine', time: '9:00 AM', status: 'completed' },
    { id: 2, type: 'vitals', resident: 'Mr. Ramesh Kumar', room: 'A-301', task: 'Check Blood Pressure', time: '10:00 AM', status: 'pending' },
    { id: 3, type: 'grooming', resident: 'Mrs. Sita Reddy', room: 'B-102', task: 'Bathing Assistance', time: '11:00 AM', status: 'pending' },
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Heart className="size-6 text-green-600" />
              <span className="text-xl text-green-900">AuraHome</span>
              <Badge className="ml-2">Staff</Badge>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm"><Bell className="size-5" /></Button>
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm text-neutral-900">{user?.user_metadata?.name || 'Staff Member'}</p>
                  <p className="text-xs text-neutral-500">Caregiver</p>
                </div>
                <Button variant="ghost" size="icon" onClick={onLogout}><LogOut className="size-5" /></Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="p-4 bg-blue-50"><div className="flex items-center gap-3"><ClipboardList className="size-6 text-blue-600" /><div><p className="text-sm text-neutral-600">Tasks Today</p><p className="text-2xl text-neutral-900">{tasks.length}</p></div></div></Card>
          <Card className="p-4 bg-green-50"><div className="flex items-center gap-3"><CheckCircle className="size-6 text-green-600" /><div><p className="text-sm text-neutral-600">Completed</p><p className="text-2xl text-neutral-900">{tasks.filter(t => t.status === 'completed').length}</p></div></div></Card>
          <Card className="p-4 bg-orange-50"><div className="flex items-center gap-3"><AlertTriangle className="size-6 text-orange-600" /><div><p className="text-sm text-neutral-600">Pending</p><p className="text-2xl text-neutral-900">{tasks.filter(t => t.status === 'pending').length}</p></div></div></Card>
          <Card className="p-4 bg-purple-50"><div className="flex items-center gap-3"><Users className="size-6 text-purple-600" /><div><p className="text-sm text-neutral-600">Residents</p><p className="text-2xl text-neutral-900">25</p></div></div></Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6"><TabsTrigger value="tasks">Care Tasks</TabsTrigger><TabsTrigger value="schedule">My Schedule</TabsTrigger></TabsList>
          <TabsContent value="tasks" className="space-y-4">
            <h2 className="text-xl text-neutral-900">Today's Care Tasks</h2>
            {tasks.map((task) => (
              <Card key={task.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${task.type === 'medication' ? 'bg-blue-100' : task.type === 'vitals' ? 'bg-green-100' : 'bg-purple-100'}`}>
                      {task.type === 'medication' && <Pill className="size-6 text-blue-600" />}
                      {task.type === 'vitals' && <Activity className="size-6 text-green-600" />}
                      {task.type === 'grooming' && <Users className="size-6 text-purple-600" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-neutral-900">{task.task}</h3>
                        <Badge variant={task.status === 'completed' ? 'default' : 'secondary'}>{task.status}</Badge>
                      </div>
                      <p className="text-sm text-neutral-600">{task.resident} • Room {task.room} • {task.time}</p>
                    </div>
                  </div>
                  {task.status === 'pending' && <Button>Complete</Button>}
                </div>
              </Card>
            ))}
          </TabsContent>
          <TabsContent value="schedule"><Card className="p-6"><h2 className="text-xl text-neutral-900 mb-4">This Week's Schedule</h2><p className="text-neutral-600">Monday - Friday: 7:00 AM - 3:00 PM</p></Card></TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
