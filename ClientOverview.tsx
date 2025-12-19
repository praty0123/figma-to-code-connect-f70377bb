import { ArrowLeft, Heart, User, Activity, TrendingUp } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { useMockData } from './MockDataContext';

interface ClientOverviewProps {
  staffId: number;
  onNavigate: (page: string, data?: any) => void;
}

export function ClientOverview({ staffId, onNavigate }: ClientOverviewProps) {
  const { staff, getClientsByStaff, getVitalsByClient, getActivitiesByClient } = useMockData();
  
  const staffMember = staff.find(s => s.id === staffId);
  const clients = getClientsByStaff(staffId);

  if (!staffMember) return null;

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => onNavigate('staffClientList')}>
                <ArrowLeft className="size-5" />
              </Button>
              <div className="flex items-center gap-2">
                <Heart className="size-6 text-green-600" />
                <span className="text-xl text-green-900">AuraHome</span>
              </div>
            </div>
            <Badge>Client Overview</Badge>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl text-neutral-900 mb-2">{staffMember.name}&apos;s Clients</h1>
          <p className="text-neutral-600">{staffMember.role} • {clients.length} clients assigned</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clients.map((client) => {
            const latestVital = getVitalsByClient(client.id)[0];
            const todaysActivities = getActivitiesByClient(client.id);
            const completedActivities = todaysActivities.filter(a => a.completed).length;

            return (
              <Card 
                key={client.id} 
                className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => onNavigate('clientDashboard', { clientId: client.id, staffId })}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center">
                      <User className="size-7 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-lg text-neutral-900">{client.name}</h2>
                      <p className="text-sm text-neutral-600">Age {client.age}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-600">Room:</span>
                    <span className="text-neutral-900">{client.room}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-600">Care Level:</span>
                    <Badge 
                      variant="secondary"
                      className={
                        client.careLevel === 'High' ? 'bg-red-100 text-red-700' :
                        client.careLevel === 'Medium' ? 'bg-orange-100 text-orange-700' :
                        'bg-green-100 text-green-700'
                      }
                    >
                      {client.careLevel}
                    </Badge>
                  </div>
                </div>

                {latestVital && (
                  <div className="border-t border-neutral-200 pt-4 mb-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Activity className="size-4 text-green-600" />
                      <h3 className="text-sm text-neutral-700">Latest Vitals</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2 bg-neutral-50 rounded">
                        <span className="text-neutral-600">BP:</span>
                        <p className="text-neutral-900">{latestVital.bp}</p>
                      </div>
                      <div className="p-2 bg-neutral-50 rounded">
                        <span className="text-neutral-600">HR:</span>
                        <p className="text-neutral-900">{latestVital.hr} bpm</p>
                      </div>
                      <div className="p-2 bg-neutral-50 rounded">
                        <span className="text-neutral-600">Sugar:</span>
                        <p className="text-neutral-900">{latestVital.sugar}</p>
                      </div>
                      <div className="p-2 bg-neutral-50 rounded">
                        <span className="text-neutral-600">O2:</span>
                        <p className="text-neutral-900">{latestVital.oxygen}%</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="border-t border-neutral-200 pt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="size-4 text-blue-600" />
                    <h3 className="text-sm text-neutral-700">Today&apos;s Activity</h3>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-600">
                      {completedActivities} of {todaysActivities.length} completed
                    </span>
                    <Badge variant="secondary">
                      {todaysActivities.length > 0 
                        ? `${Math.round((completedActivities / todaysActivities.length) * 100)}%`
                        : '0%'
                      }
                    </Badge>
                  </div>
                </div>

                <Button 
                  className="w-full mt-4 bg-green-600 hover:bg-green-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigate('clientDashboard', { clientId: client.id, staffId });
                  }}
                >
                  Open Dashboard
                </Button>
              </Card>
            );
          })}
        </div>

        {clients.length === 0 && (
          <Card className="p-8 text-center">
            <User className="size-12 text-neutral-400 mx-auto mb-4" />
            <p className="text-neutral-600">No clients assigned to this staff member</p>
          </Card>
        )}
      </div>
    </div>
  );
}