import { useState } from 'react';
import { ArrowLeft, Heart, Users, User, Activity, ClipboardCheck } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { useMockData } from './MockDataContext';

interface StaffClientListProps {
  onNavigate: (page: string, data?: any) => void;
  currentStaffId?: number;
}

export function StaffClientList({ onNavigate, currentStaffId }: StaffClientListProps) {
  const { staff, getClientsByStaff } = useMockData();

  // If currentStaffId is provided, show only that staff member's clients
  const displayStaff = currentStaffId ? staff.filter(s => s.id === currentStaffId) : staff;

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
            <Badge>Staff – Client List</Badge>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl text-neutral-900 mb-2">Staff Members & Their Clients</h1>
          <p className="text-neutral-600">View all staff members and the clients assigned to them</p>
        </div>

        <div className="space-y-6">
          {displayStaff.map((staffMember) => {
            const assignedClients = getClientsByStaff(staffMember.id);
            
            return (
              <Card key={staffMember.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                      <User className="size-8 text-green-600" />
                    </div>
                    <div>
                      <h2 className="text-xl text-neutral-900">{staffMember.name}</h2>
                      <p className="text-sm text-neutral-600">{staffMember.role}</p>
                      <p className="text-xs text-neutral-500 mt-1">{staffMember.email}</p>
                    </div>
                  </div>
                  <Button 
                    onClick={() => onNavigate('clientOverview', { staffId: staffMember.id })}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Users className="size-4 mr-2" />
                    View Clients ({assignedClients.length})
                  </Button>
                </div>

                <div className="border-t border-neutral-200 pt-4">
                  <h3 className="text-sm text-neutral-700 mb-3">Assigned Clients:</h3>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {assignedClients.map((client) => (
                      <div 
                        key={client.id}
                        className="p-3 bg-neutral-50 rounded-lg hover:bg-neutral-100 cursor-pointer transition-colors"
                        onClick={() => onNavigate('clientOverview', { staffId: staffMember.id })}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <User className="size-5 text-blue-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-neutral-900 truncate">{client.name}</p>
                            <p className="text-xs text-neutral-500">Room {client.room}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-neutral-600">Age {client.age}</span>
                          <Badge 
                            variant="secondary" 
                            className="text-xs"
                          >
                            {client.careLevel}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}