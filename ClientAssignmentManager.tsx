import { ArrowLeft, Heart, User, Users } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useMockData } from './MockDataContext';
import { toast } from 'sonner@2.0.3';

interface ClientAssignmentManagerProps {
  onNavigate: (page: string, data?: any) => void;
}

export function ClientAssignmentManager({ onNavigate }: ClientAssignmentManagerProps) {
  const { clients, staff, reassignClient } = useMockData();

  const handleReassign = (clientId: number, newStaffId: string) => {
    const staffId = parseInt(newStaffId);
    const client = clients.find(c => c.id === clientId);
    const newStaff = staff.find(s => s.id === staffId);
    
    if (client && newStaff) {
      reassignClient(clientId, staffId);
      toast.success(`${client.name} reassigned to ${newStaff.name}`);
    }
  };

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
            <Badge>Client Assignment Manager</Badge>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl text-neutral-900 mb-2">Client Assignment Manager</h1>
          <p className="text-neutral-600">Reassign clients to different staff members</p>
        </div>

        {/* Staff Overview Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {staff.map((staffMember) => {
            const assignedClients = clients.filter(c => c.assignedStaffId === staffMember.id);
            
            return (
              <Card key={staffMember.id} className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                    <User className="size-6 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm text-neutral-900 truncate">{staffMember.name}</h3>
                    <p className="text-xs text-neutral-600">{staffMember.role}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-neutral-600">Assigned Clients</span>
                  <Badge variant="secondary">{assignedClients.length}</Badge>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Client Assignment List */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Users className="size-5 text-blue-600" />
            <h2 className="text-xl text-neutral-900">Client Assignments</h2>
          </div>

          <div className="space-y-3">
            {clients.map((client) => {
              const assignedStaff = staff.find(s => s.id === client.assignedStaffId);
              
              return (
                <div 
                  key={client.id}
                  className="p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <User className="size-7 text-blue-600" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="text-neutral-900">{client.name}</h3>
                        <div className="flex items-center gap-3 mt-1">
                          <p className="text-sm text-neutral-600">Age {client.age}</p>
                          <p className="text-sm text-neutral-600">Room {client.room}</p>
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
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right hidden sm:block">
                        <p className="text-xs text-neutral-600">Currently assigned to</p>
                        <p className="text-sm text-neutral-900">{assignedStaff?.name || 'Unassigned'}</p>
                      </div>
                      
                      <Select
                        value={client.assignedStaffId.toString()}
                        onValueChange={(value) => handleReassign(client.id, value)}
                      >
                        <SelectTrigger className="w-48">
                          <SelectValue placeholder="Select staff" />
                        </SelectTrigger>
                        <SelectContent>
                          {staff.map((staffMember) => (
                            <SelectItem key={staffMember.id} value={staffMember.id.toString()}>
                              {staffMember.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}
