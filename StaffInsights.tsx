import { ArrowLeft, Heart, User, TrendingUp, CheckCircle, AlertTriangle, Activity, Clock } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { useMockData } from './MockDataContext';

interface StaffInsightsProps {
  onNavigate: (page: string, data?: any) => void;
}

export function StaffInsights({ onNavigate }: StaffInsightsProps) {
  const { staff, clients, getClientsByStaff, getVitalsByClient, getMedicationsByClient, getActivitiesByClient } = useMockData();

  // Calculate insights for each staff member
  const staffInsights = staff.map((staffMember) => {
    const assignedClients = getClientsByStaff(staffMember.id);
    const clientCount = assignedClients.length;

    let totalMedications = 0;
    let takenMedications = 0;
    let missedMedications = 0;
    let totalActivities = 0;
    let completedActivities = 0;
    let latestVitalTimestamp: string | null = null;

    assignedClients.forEach((client) => {
      const medications = getMedicationsByClient(client.id);
      const activities = getActivitiesByClient(client.id);
      const vitals = getVitalsByClient(client.id);

      totalMedications += medications.length;
      takenMedications += medications.filter(m => m.taken).length;
      missedMedications += medications.filter(m => !m.taken).length;

      totalActivities += activities.length;
      completedActivities += activities.filter(a => a.completed).length;

      if (vitals.length > 0 && vitals[0].timestamp) {
        if (!latestVitalTimestamp || new Date(vitals[0].timestamp) > new Date(latestVitalTimestamp)) {
          latestVitalTimestamp = vitals[0].timestamp;
        }
      }
    });

    const medicationCompletionRate = totalMedications > 0 ? (takenMedications / totalMedications) * 100 : 0;
    const activityCompletionRate = totalActivities > 0 ? (completedActivities / totalActivities) * 100 : 0;

    // Mock tasks data
    const tasksCompleted = Math.floor(Math.random() * 50) + 100;
    const tasksPending = Math.floor(Math.random() * 20) + 5;
    const totalTasks = tasksCompleted + tasksPending;

    return {
      ...staffMember,
      clientCount,
      tasksCompleted,
      tasksPending,
      totalTasks,
      totalMedications,
      takenMedications,
      missedMedications,
      medicationCompletionRate,
      totalActivities,
      completedActivities,
      activityCompletionRate,
      latestVitalTimestamp,
    };
  });

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => onNavigate('dashboard')}>
                <ArrowLeft className="size-5" />
              </Button>
              <div className="flex items-center gap-2">
                <Heart className="size-6 text-green-600" />
                <span className="text-xl text-green-900">AuraHome</span>
              </div>
            </div>
            <Badge>Staff Insights</Badge>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl text-neutral-900 mb-2">Staff Performance Insights</h1>
          <p className="text-neutral-600">Monitor staff workload, task completion, and care quality metrics</p>
        </div>

        {/* Overall Summary */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <User className="size-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-neutral-600">Total Staff</p>
                <p className="text-2xl text-neutral-900">{staff.length}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="size-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-neutral-600">Total Clients</p>
                <p className="text-2xl text-neutral-900">{clients.length}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                <Activity className="size-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-neutral-600">Avg Tasks/Staff</p>
                <p className="text-2xl text-neutral-900">
                  {Math.round(staffInsights.reduce((acc, s) => acc + s.totalTasks, 0) / staff.length)}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                <TrendingUp className="size-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-neutral-600">Avg Completion</p>
                <p className="text-2xl text-neutral-900">
                  {Math.round(staffInsights.reduce((acc, s) => acc + (s.tasksCompleted / s.totalTasks * 100), 0) / staff.length)}%
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Individual Staff Cards */}
        <div className="space-y-6">
          {staffInsights.map((insight) => (
            <Card key={insight.id} className="p-6">
              {/* Staff Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                    <User className="size-8 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-xl text-neutral-900">{insight.name}</h2>
                    <p className="text-sm text-neutral-600">{insight.role}</p>
                    <p className="text-xs text-neutral-500 mt-1">{insight.email}</p>
                  </div>
                </div>
                <Badge variant="secondary" className="text-sm">
                  {insight.clientCount} clients assigned
                </Badge>
              </div>

              {/* Metrics Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {/* Tasks */}
                <div className="p-4 bg-neutral-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="size-4 text-green-600" />
                    <h3 className="text-sm text-neutral-700">Tasks</h3>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-neutral-600">Completed:</span>
                      <span className="text-green-600">{insight.tasksCompleted}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-neutral-600">Pending:</span>
                      <span className="text-orange-600">{insight.tasksPending}</span>
                    </div>
                    <Progress 
                      value={(insight.tasksCompleted / insight.totalTasks) * 100} 
                      className="mt-2"
                    />
                  </div>
                </div>

                {/* Medications */}
                <div className="p-4 bg-neutral-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="size-4 text-blue-600" />
                    <h3 className="text-sm text-neutral-700">Medications</h3>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-neutral-600">Taken:</span>
                      <span className="text-green-600">{insight.takenMedications}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-neutral-600">Missed:</span>
                      <span className="text-red-600">{insight.missedMedications}</span>
                    </div>
                    <Progress 
                      value={insight.medicationCompletionRate} 
                      className="mt-2"
                    />
                  </div>
                </div>

                {/* Activities */}
                <div className="p-4 bg-neutral-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="size-4 text-purple-600" />
                    <h3 className="text-sm text-neutral-700">Activities</h3>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-neutral-600">Completed:</span>
                      <span className="text-green-600">{insight.completedActivities}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-neutral-600">Pending:</span>
                      <span className="text-orange-600">{insight.totalActivities - insight.completedActivities}</span>
                    </div>
                    <Progress 
                      value={insight.activityCompletionRate} 
                      className="mt-2"
                    />
                  </div>
                </div>

                {/* Latest Update */}
                <div className="p-4 bg-neutral-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="size-4 text-orange-600" />
                    <h3 className="text-sm text-neutral-700">Latest Vital Entry</h3>
                  </div>
                  <div className="space-y-1">
                    {insight.latestVitalTimestamp ? (
                      <>
                        <p className="text-xs text-neutral-600">
                          {new Date(insight.latestVitalTimestamp).toLocaleDateString('en-IN', {
                            month: 'short',
                            day: 'numeric'
                          })}
                        </p>
                        <p className="text-sm text-neutral-900">
                          {new Date(insight.latestVitalTimestamp).toLocaleTimeString('en-IN', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                        <Badge variant="secondary" className="mt-2 text-xs">
                          {Math.round((Date.now() - new Date(insight.latestVitalTimestamp).getTime()) / (1000 * 60 * 60))} hrs ago
                        </Badge>
                      </>
                    ) : (
                      <p className="text-sm text-neutral-600">No vitals recorded</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Performance Summary */}
              <div className="flex items-center gap-4 pt-4 border-t border-neutral-200">
                <div className="flex-1">
                  <p className="text-xs text-neutral-600 mb-1">Overall Completion Rate</p>
                  <div className="flex items-center gap-3">
                    <Progress 
                      value={(insight.tasksCompleted / insight.totalTasks) * 100} 
                      className="flex-1"
                    />
                    <span className="text-sm text-neutral-900">
                      {Math.round((insight.tasksCompleted / insight.totalTasks) * 100)}%
                    </span>
                  </div>
                </div>
                
                {insight.missedMedications > 0 && (
                  <div className="flex items-center gap-2 text-orange-600">
                    <AlertTriangle className="size-4" />
                    <span className="text-sm">{insight.missedMedications} missed medication{insight.missedMedications !== 1 ? 's' : ''}</span>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
