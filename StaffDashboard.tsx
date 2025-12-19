import { useState, useEffect } from 'react';
import { CheckCircle, AlertTriangle, Users, ClipboardList, Calendar, LogOut, Heart, Pill, Activity, Home, Bell, Camera, User } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { PhotoUpdates } from './PhotoUpdates';
import { StaffClientList } from './StaffClientList';
import { ClientOverview } from './ClientOverview';
import { ClientDashboardStaffView } from './ClientDashboardStaffView';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
);

interface StaffDashboardProps {
  user: any;
  onLogout: () => void;
}

export function StaffDashboard({ user, onLogout }: StaffDashboardProps) {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [navigationData, setNavigationData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('tasks');
  const [showIncidentDialog, setShowIncidentDialog] = useState(false);
  const [incidentType, setIncidentType] = useState('');
  const [incidentDescription, setIncidentDescription] = useState('');
  const [photoUpdates, setPhotoUpdates] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) return;

      // Fetch photos
      const photosResponse = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-f835a0b6/photos`,
        {
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
          },
        }
      );

      if (photosResponse.ok) {
        const photosData = await photosResponse.json();
        setPhotoUpdates(photosData.photos || []);
      }

      // Fetch tasks
      const tasksResponse = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-f835a0b6/staff/tasks`,
        {
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
          },
        }
      );

      if (tasksResponse.ok) {
        const tasksData = await tasksResponse.json();
        setTasks(tasksData.tasks || []);
      }

      // If no tasks exist, add sample tasks
      if (!tasksResponse.ok || (tasksResponse.ok && tasksData.tasks.length === 0)) {
        setTasks([
          {
            id: 1,
            type: 'medication',
            resident: 'Mrs. Lakshmi Devi',
            room: 'A-204',
            task: 'BP Medicine',
            time: '9:00 AM',
            status: 'completed',
          },
          {
            id: 2,
            type: 'vitals',
            resident: 'Mr. Ramesh Kumar',
            room: 'A-301',
            task: 'Check Blood Pressure',
            time: '10:00 AM',
            status: 'pending',
          },
          {
            id: 3,
            type: 'grooming',
            resident: 'Mrs. Sita Reddy',
            room: 'B-102',
            task: 'Bathing Assistance',
            time: '11:00 AM',
            status: 'pending',
          },
          {
            id: 4,
            type: 'mobility',
            resident: 'Mr. Anil Sharma',
            room: 'A-205',
            task: 'Physical Therapy Session',
            time: '2:00 PM',
            status: 'pending',
          },
        ]);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const recentIncidents = [
    {
      id: 1,
      type: 'Fall',
      resident: 'Mr. Kumar',
      time: '2 hours ago',
      severity: 'medium',
      status: 'resolved',
    },
    {
      id: 2,
      type: 'Missed Meal',
      resident: 'Mrs. Patel',
      time: '5 hours ago',
      severity: 'low',
      status: 'open',
    },
  ];

  const emergencyAlerts: any[] = [];

  const handleCompleteTask = async (taskId: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) return;

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-f835a0b6/tasks/${taskId}/update`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ status: 'completed' }),
        }
      );

      if (response.ok) {
        // Update local state
        setTasks(tasks.map(task => 
          task.id === taskId ? { ...task, status: 'completed' } : task
        ));
        alert('Task completed successfully!');
      } else {
        alert('Failed to complete task');
      }
    } catch (error) {
      console.error('Error completing task:', error);
      alert('Error completing task');
    }
  };

  const handleReportIncident = async () => {
    if (!incidentType || !incidentDescription) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) return;

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-f835a0b6/staff/incident`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            residentId: 'default-resident',
            type: incidentType,
            description: incidentDescription,
            severity: 'medium',
          }),
        }
      );

      if (response.ok) {
        alert('Incident reported successfully');
        setShowIncidentDialog(false);
        setIncidentType('');
        setIncidentDescription('');
      } else {
        alert('Failed to report incident');
      }
    } catch (error) {
      console.error('Error reporting incident:', error);
      alert('Error reporting incident');
    }
  };

  const handlePhotoUpload = (photo: any) => {
    setPhotoUpdates([photo, ...photoUpdates]);
  };

  const handleNavigation = (page: string, data?: any) => {
    setCurrentPage(page);
    setNavigationData(data || null);
  };

  // Render different pages based on navigation
  if (currentPage === 'staffClientList') {
    // For demo purposes, we'll use staff ID 1 (Nurse Priya)
    // In a real app, this would be based on the logged-in user
    return <StaffClientList onNavigate={handleNavigation} currentStaffId={1} />;
  }

  if (currentPage === 'clientOverview' && navigationData?.staffId) {
    return <ClientOverview staffId={navigationData.staffId} onNavigate={handleNavigation} />;
  }

  if (currentPage === 'clientDashboard' && navigationData?.clientId && navigationData?.staffId) {
    return <ClientDashboardStaffView clientId={navigationData.clientId} staffId={navigationData.staffId} onNavigate={handleNavigation} />;
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
              <Badge className="ml-2">Staff</Badge>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="size-5" />
                {emergencyAlerts.length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                )}
              </Button>
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm text-neutral-900">{user?.user_metadata?.name || 'Staff Member'}</p>
                  <p className="text-xs text-neutral-500">Caregiver</p>
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
        {/* Emergency Alerts */}
        {emergencyAlerts.length > 0 && (
          <div className="mb-6">
            {emergencyAlerts.map((alert) => (
              <Card key={alert.id} className="p-4 bg-red-50 border-2 border-red-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                    <div>
                      <p className="text-red-900">
                        <span className="font-medium">EMERGENCY: {alert.type}</span>
                      </p>
                      <p className="text-sm text-red-700">
                        {alert.resident} • Room {alert.room} • {alert.time}
                      </p>
                    </div>
                  </div>
                  <Button className="bg-red-600 hover:bg-red-700">
                    Respond
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        <div className="mb-6">
          <Button 
            className="bg-green-600 hover:bg-green-700"
            onClick={() => handleNavigation('staffClientList')}
          >
            <Users className="size-4 mr-2" />
            View My Clients
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={<ClipboardList className="size-6 text-blue-600" />}
            label="Tasks Today"
            value={tasks.length.toString()}
            bgColor="bg-blue-50"
          />
          <StatCard
            icon={<CheckCircle className="size-6 text-green-600" />}
            label="Completed"
            value={tasks.filter(t => t.status === 'completed').length.toString()}
            bgColor="bg-green-50"
          />
          <StatCard
            icon={<AlertTriangle className="size-6 text-orange-600" />}
            label="Pending"
            value={tasks.filter(t => t.status === 'pending').length.toString()}
            bgColor="bg-orange-50"
          />
          <StatCard
            icon={<Users className="size-6 text-purple-600" />}
            label="Residents"
            value="25"
            bgColor="bg-purple-50"
          />
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="tasks">Care Tasks</TabsTrigger>
            <TabsTrigger value="photos">Photo Updates</TabsTrigger>
            <TabsTrigger value="incidents">Incidents</TabsTrigger>
            <TabsTrigger value="schedule">My Schedule</TabsTrigger>
            <TabsTrigger value="facility">Facility</TabsTrigger>
          </TabsList>

          {/* Care Tasks */}
          <TabsContent value="tasks" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl text-neutral-900">Today's Care Tasks</h2>
            </div>

            {tasks.map((task) => (
              <Card key={task.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      task.type === 'medication' ? 'bg-blue-100' :
                      task.type === 'vitals' ? 'bg-green-100' :
                      task.type === 'grooming' ? 'bg-purple-100' :
                      'bg-amber-100'
                    }`}>
                      {task.type === 'medication' && <Pill className="size-6 text-blue-600" />}
                      {task.type === 'vitals' && <Activity className="size-6 text-green-600" />}
                      {task.type === 'grooming' && <Users className="size-6 text-purple-600" />}
                      {task.type === 'mobility' && <Activity className="size-6 text-amber-600" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-neutral-900">{task.task}</h3>
                        <Badge variant={task.status === 'completed' ? 'default' : 'secondary'}>
                          {task.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-neutral-600">
                        {task.resident} • Room {task.room} • {task.time}
                      </p>
                    </div>
                  </div>
                  {task.status === 'pending' && (
                    <Button onClick={() => handleCompleteTask(task.id)}>
                      Complete
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </TabsContent>

          {/* Photo Updates */}
          <TabsContent value="photos">
            <PhotoUpdates
              photos={photoUpdates}
              canUpload={true}
              onUpload={handlePhotoUpload}
            />
          </TabsContent>

          {/* Incidents */}
          <TabsContent value="incidents" className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl text-neutral-900">Incident Reports</h2>
              <Button
                className="bg-orange-600 hover:bg-orange-700"
                onClick={() => setShowIncidentDialog(true)}
              >
                <AlertTriangle className="size-4 mr-2" />
                Report Incident
              </Button>
            </div>

            {recentIncidents.map((incident) => (
              <Card key={incident.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-3 h-3 rounded-full ${
                      incident.severity === 'high' ? 'bg-red-500' :
                      incident.severity === 'medium' ? 'bg-orange-500' :
                      'bg-yellow-500'
                    }`} />
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-neutral-900">{incident.type}</h3>
                        <Badge variant={incident.status === 'resolved' ? 'default' : 'secondary'}>
                          {incident.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-neutral-600">
                        {incident.resident} • {incident.time}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline">View Details</Button>
                </div>
              </Card>
            ))}
          </TabsContent>

          {/* Schedule */}
          <TabsContent value="schedule">
            <Card className="p-6">
              <h2 className="text-xl text-neutral-900 mb-6">This Week's Schedule</h2>
              <div className="space-y-4">
                <ScheduleDay day="Monday" shift="Morning" hours="7:00 AM - 3:00 PM" />
                <ScheduleDay day="Tuesday" shift="Morning" hours="7:00 AM - 3:00 PM" />
                <ScheduleDay day="Wednesday" shift="Evening" hours="3:00 PM - 11:00 PM" />
                <ScheduleDay day="Thursday" shift="Off" hours="-" />
                <ScheduleDay day="Friday" shift="Morning" hours="7:00 AM - 3:00 PM" />
              </div>
            </Card>
          </TabsContent>

          {/* Facility Management */}
          <TabsContent value="facility">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Home className="size-5 text-blue-600" />
                  <h3 className="text-lg text-neutral-900">Cleaning Checklist</h3>
                </div>
                <div className="space-y-3">
                  <ChecklistItem task="Common Areas" completed={true} />
                  <ChecklistItem task="Resident Rooms (A Wing)" completed={true} />
                  <ChecklistItem task="Dining Hall" completed={false} />
                  <ChecklistItem task="Garden Area" completed={false} />
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="size-5 text-orange-600" />
                  <h3 className="text-lg text-neutral-900">Maintenance Requests</h3>
                </div>
                <div className="space-y-3">
                  <MaintenanceItem issue="AC not working - Room B-203" priority="high" />
                  <MaintenanceItem issue="Leaking tap - Room A-105" priority="medium" />
                </div>
                <Button className="w-full mt-4" variant="outline">
                  + New Request
                </Button>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Report Incident Dialog */}
      <Dialog open={showIncidentDialog} onOpenChange={setShowIncidentDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Report Incident</DialogTitle>
            <DialogDescription>
              Please provide details about the incident.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-neutral-700 mb-2">Incident Type</label>
              <select
                value={incidentType}
                onChange={(e) => setIncidentType(e.target.value)}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Select type...</option>
                <option value="fall">Fall</option>
                <option value="missed-meal">Missed Meal</option>
                <option value="behavioral">Behavioral Change</option>
                <option value="medical">Medical Emergency</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-neutral-700 mb-2">Description</label>
              <textarea
                value={incidentDescription}
                onChange={(e) => setIncidentDescription(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Describe what happened..."
              />
            </div>
            <Button
              onClick={handleReportIncident}
              className="w-full bg-orange-600 hover:bg-orange-700"
            >
              Submit Report
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function StatCard({ icon, label, value, bgColor }: { icon: React.ReactNode; label: string; value: string; bgColor: string }) {
  return (
    <Card className={`p-4 ${bgColor}`}>
      <div className="flex items-center gap-3">
        {icon}
        <div>
          <p className="text-2xl text-neutral-900">{value}</p>
          <p className="text-sm text-neutral-600">{label}</p>
        </div>
      </div>
    </Card>
  );
}

function ScheduleDay({ day, shift, hours }: { day: string; shift: string; hours: string }) {
  return (
    <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
      <div className="flex items-center gap-4">
        <Calendar className="size-5 text-neutral-600" />
        <div>
          <p className="text-sm text-neutral-900">{day}</p>
          <p className="text-xs text-neutral-600">{shift}</p>
        </div>
      </div>
      <p className="text-sm text-neutral-700">{hours}</p>
    </div>
  );
}

function ChecklistItem({ task, completed }: { task: string; completed: boolean }) {
  return (
    <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
      <span className="text-sm text-neutral-900">{task}</span>
      <Badge variant={completed ? 'default' : 'secondary'}>
        {completed ? 'Done' : 'Pending'}
      </Badge>
    </div>
  );
}

function MaintenanceItem({ issue, priority }: { issue: string; priority: string }) {
  return (
    <div className="p-3 bg-neutral-50 rounded-lg">
      <div className="flex items-center gap-2 mb-1">
        <span className={`w-2 h-2 rounded-full ${
          priority === 'high' ? 'bg-red-500' :
          priority === 'medium' ? 'bg-orange-500' :
          'bg-yellow-500'
        }`} />
        <p className="text-sm text-neutral-900">{issue}</p>
      </div>
    </div>
  );
}