import { useState } from 'react';
import { ArrowLeft, Heart, Calendar, User } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useMockData } from './MockDataContext';
import { toast } from 'sonner@2.0.3';

interface StaffRosterEditorProps {
  onNavigate: (page: string, data?: any) => void;
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const SHIFT_TYPES = [
  { value: 'Morning', label: 'Morning', hours: '7:00 AM - 3:00 PM', color: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
  { value: 'Evening', label: 'Evening', hours: '3:00 PM - 11:00 PM', color: 'bg-orange-100 text-orange-800 border-orange-300' },
  { value: 'Night', label: 'Night', hours: '11:00 PM - 7:00 AM', color: 'bg-blue-100 text-blue-800 border-blue-300' },
  { value: 'Off', label: 'Off', hours: '-', color: 'bg-neutral-100 text-neutral-600 border-neutral-300' },
];

export function StaffRosterEditor({ onNavigate }: StaffRosterEditorProps) {
  const { staff, shifts, updateShift } = useMockData();
  const [draggedItem, setDraggedItem] = useState<{ staffId: number; day: string } | null>(null);

  const getShift = (staffId: number, day: string) => {
    return shifts.find(s => s.staffId === staffId && s.day === day);
  };

  const getShiftColor = (shiftType: string) => {
    return SHIFT_TYPES.find(s => s.value === shiftType)?.color || 'bg-neutral-100';
  };

  const handleShiftChange = (staffId: number, day: string, shiftType: string) => {
    const shiftInfo = SHIFT_TYPES.find(s => s.value === shiftType);
    if (shiftInfo) {
      updateShift(staffId, day, shiftType as any, shiftInfo.hours);
      toast.success('Shift updated successfully');
    }
  };

  const handleDragStart = (staffId: number, day: string) => {
    setDraggedItem({ staffId, day });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (targetStaffId: number, targetDay: string) => {
    if (!draggedItem) return;

    // Get source and target shifts
    const sourceShift = getShift(draggedItem.staffId, draggedItem.day);
    const targetShift = getShift(targetStaffId, targetDay);

    if (sourceShift && targetShift) {
      // Swap shifts
      updateShift(draggedItem.staffId, draggedItem.day, targetShift.shift, targetShift.hours);
      updateShift(targetStaffId, targetDay, sourceShift.shift, sourceShift.hours);
      toast.success('Shifts swapped successfully');
    }

    setDraggedItem(null);
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
            <Badge>Staff Roster Editor</Badge>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl text-neutral-900 mb-2">Weekly Staff Roster</h1>
          <p className="text-neutral-600">Click to edit shifts or drag and drop to swap shifts between staff</p>
        </div>

        {/* Legend */}
        <Card className="p-4 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="size-4 text-neutral-600" />
            <h3 className="text-sm text-neutral-700">Shift Types</h3>
          </div>
          <div className="flex flex-wrap gap-3">
            {SHIFT_TYPES.map((shiftType) => (
              <div key={shiftType.value} className="flex items-center gap-2">
                <div className={`px-3 py-1 rounded border ${shiftType.color} text-xs`}>
                  {shiftType.label}
                </div>
                <span className="text-xs text-neutral-600">{shiftType.hours}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Roster Table */}
        <Card className="p-6 overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Table Header */}
            <div className="grid grid-cols-8 gap-2 mb-4">
              <div className="p-3">
                <h3 className="text-sm text-neutral-700">Staff Member</h3>
              </div>
              {DAYS.map((day) => (
                <div key={day} className="p-3 text-center">
                  <h3 className="text-sm text-neutral-700">{day}</h3>
                </div>
              ))}
            </div>

            {/* Table Body */}
            <div className="space-y-2">
              {staff.map((staffMember) => (
                <div key={staffMember.id} className="grid grid-cols-8 gap-2">
                  {/* Staff Info */}
                  <div className="p-3 bg-neutral-50 rounded-lg flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <User className="size-5 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-neutral-900 truncate">{staffMember.name}</p>
                      <p className="text-xs text-neutral-600 truncate">{staffMember.role}</p>
                    </div>
                  </div>

                  {/* Shifts for each day */}
                  {DAYS.map((day) => {
                    const shift = getShift(staffMember.id, day);
                    const shiftType = shift?.shift || 'Off';
                    const shiftColor = getShiftColor(shiftType);

                    return (
                      <div key={day} className="p-2">
                        <div
                          draggable
                          onDragStart={() => handleDragStart(staffMember.id, day)}
                          onDragOver={handleDragOver}
                          onDrop={() => handleDrop(staffMember.id, day)}
                          className={`p-2 rounded border ${shiftColor} cursor-move hover:opacity-80 transition-opacity`}
                        >
                          <Select
                            value={shiftType}
                            onValueChange={(value) => handleShiftChange(staffMember.id, day, value)}
                          >
                            <SelectTrigger className="h-auto border-0 bg-transparent p-0 hover:bg-transparent focus:ring-0 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {SHIFT_TYPES.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                  {type.label} ({type.hours})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Summary Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {staff.map((staffMember) => {
            const staffShifts = DAYS.map(day => getShift(staffMember.id, day));
            const morningShifts = staffShifts.filter(s => s?.shift === 'Morning').length;
            const eveningShifts = staffShifts.filter(s => s?.shift === 'Evening').length;
            const nightShifts = staffShifts.filter(s => s?.shift === 'Night').length;
            const offDays = staffShifts.filter(s => s?.shift === 'Off').length;

            return (
              <Card key={staffMember.id} className="p-4">
                <h3 className="text-sm text-neutral-900 mb-3">{staffMember.name}</h3>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-600">Morning:</span>
                    <Badge variant="secondary">{morningShifts}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-600">Evening:</span>
                    <Badge variant="secondary">{eveningShifts}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-600">Night:</span>
                    <Badge variant="secondary">{nightShifts}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-600">Off Days:</span>
                    <Badge variant="secondary">{offDays}</Badge>
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
