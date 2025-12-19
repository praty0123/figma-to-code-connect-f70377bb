import { useState } from 'react';
import { ArrowLeft, Heart, User, Activity, Pill, ClipboardList, Camera, Save, Check, X } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { useMockData } from './MockDataContext';
import { toast } from 'sonner@2.0.3';

interface ClientDashboardStaffViewProps {
  clientId: number;
  staffId: number;
  onNavigate: (page: string, data?: any) => void;
}

export function ClientDashboardStaffView({ clientId, staffId, onNavigate }: ClientDashboardStaffViewProps) {
  const { 
    clients, 
    staff,
    getVitalsByClient, 
    getMedicationsByClient, 
    getActivitiesByClient, 
    getNotesByClient,
    addVital,
    updateMedication,
    updateActivity,
    addNote
  } = useMockData();

  const client = clients.find(c => c.id === clientId);
  const staffMember = staff.find(s => s.id === staffId);
  const latestVital = getVitalsByClient(clientId)[0];
  const medications = getMedicationsByClient(clientId);
  const activities = getActivitiesByClient(clientId);
  const notes = getNotesByClient(clientId);

  // Vitals form state
  const [temperature, setTemperature] = useState(latestVital?.temperature || '');
  const [bp, setBp] = useState(latestVital?.bp || '');
  const [hr, setHr] = useState(latestVital?.hr || '');
  const [oxygen, setOxygen] = useState(latestVital?.oxygen || '');
  const [sugar, setSugar] = useState(latestVital?.sugar || '');
  const [weight, setWeight] = useState(latestVital?.weight || '');

  // Notes form state
  const [noteText, setNoteText] = useState('');

  if (!client || !staffMember) return null;

  const handleSaveVitals = () => {
    if (!temperature || !bp || !hr || !oxygen || !sugar || !weight) {
      toast.error('Please fill in all vital fields');
      return;
    }

    addVital({
      clientId,
      temperature,
      bp,
      hr,
      oxygen,
      sugar,
      weight,
      timestamp: new Date().toISOString()
    });

    toast.success('Vitals saved successfully');
  };

  const handleToggleMedication = (medicationId: number, currentStatus: boolean) => {
    updateMedication(medicationId, !currentStatus);
    toast.success(`Medication ${!currentStatus ? 'marked as taken' : 'marked as missed'}`);
  };

  const handleToggleActivity = (activityId: number, currentStatus: boolean) => {
    updateActivity(activityId, !currentStatus);
    toast.success(`Activity ${!currentStatus ? 'marked as completed' : 'marked as incomplete'}`);
  };

  const handleAddNote = () => {
    if (!noteText.trim()) {
      toast.error('Please enter a note');
      return;
    }

    addNote({
      id: Date.now(),
      clientId,
      text: noteText,
      timestamp: new Date().toISOString(),
      staffName: staffMember.name
    });

    setNoteText('');
    toast.success('Note added successfully');
  };

  const handlePhotoUpload = (type: 'medication' | 'activity', id: number) => {
    // Simulate photo upload
    const photoUrl = `https://via.placeholder.com/150?text=Photo+${Date.now()}`;
    
    if (type === 'medication') {
      const medication = medications.find(m => m.id === id);
      if (medication) {
        updateMedication(id, medication.taken, photoUrl);
        toast.success('Photo uploaded for medication');
      }
    } else {
      const activity = activities.find(a => a.id === id);
      if (activity) {
        updateActivity(id, activity.completed, photoUrl);
        toast.success('Photo uploaded for activity');
      }
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => onNavigate('clientOverview', { staffId })}>
                <ArrowLeft className="size-5" />
              </Button>
              <div className="flex items-center gap-2">
                <Heart className="size-6 text-green-600" />
                <span className="text-xl text-green-900">AuraHome</span>
              </div>
            </div>
            <Badge>Client Dashboard</Badge>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Client Profile Summary */}
        <Card className="p-6 mb-6">
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <User className="size-10 text-blue-600" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl text-neutral-900 mb-2">{client.name}</h1>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-neutral-600">Age</p>
                  <p className="text-neutral-900">{client.age} years</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-600">Room</p>
                  <p className="text-neutral-900">{client.room}</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-600">Care Level</p>
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
                <div>
                  <p className="text-sm text-neutral-600">Assigned to</p>
                  <p className="text-neutral-900">{staffMember.name}</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Vitals Input Module */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Activity className="size-5 text-green-600" />
              <h2 className="text-xl text-neutral-900">Vitals Input</h2>
            </div>

            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="temperature">Temperature (°F)</Label>
                  <Input 
                    id="temperature"
                    type="text"
                    placeholder="98.6"
                    value={temperature}
                    onChange={(e) => setTemperature(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="bp">Blood Pressure</Label>
                  <Input 
                    id="bp"
                    type="text"
                    placeholder="120/80"
                    value={bp}
                    onChange={(e) => setBp(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="hr">Heart Rate (bpm)</Label>
                  <Input 
                    id="hr"
                    type="text"
                    placeholder="72"
                    value={hr}
                    onChange={(e) => setHr(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="oxygen">Oxygen Level (%)</Label>
                  <Input 
                    id="oxygen"
                    type="text"
                    placeholder="98"
                    value={oxygen}
                    onChange={(e) => setOxygen(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sugar">Blood Sugar</Label>
                  <Input 
                    id="sugar"
                    type="text"
                    placeholder="110"
                    value={sugar}
                    onChange={(e) => setSugar(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input 
                    id="weight"
                    type="text"
                    placeholder="65"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                  />
                </div>
              </div>

              <Button 
                className="w-full bg-green-600 hover:bg-green-700"
                onClick={handleSaveVitals}
              >
                <Save className="size-4 mr-2" />
                Save Vitals
              </Button>

              {latestVital && (
                <div className="mt-4 p-3 bg-neutral-50 rounded-lg">
                  <p className="text-xs text-neutral-600">Last updated:</p>
                  <p className="text-sm text-neutral-900">
                    {new Date(latestVital.timestamp).toLocaleString('en-IN', {
                      dateStyle: 'medium',
                      timeStyle: 'short'
                    })}
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Medication Tracking */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Pill className="size-5 text-blue-600" />
              <h2 className="text-xl text-neutral-900">Medication Tracking</h2>
            </div>

            <div className="space-y-3">
              {medications.length === 0 ? (
                <p className="text-neutral-600 text-center py-4">No medications scheduled for today</p>
              ) : (
                medications.map((medication) => (
                  <div 
                    key={medication.id} 
                    className="p-4 border border-neutral-200 rounded-lg"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-neutral-900">{medication.name}</h3>
                        <p className="text-sm text-neutral-600">
                          {medication.time} • {medication.dosage}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant={medication.taken ? "default" : "outline"}
                        className={medication.taken ? 'bg-green-600 hover:bg-green-700' : ''}
                        onClick={() => handleToggleMedication(medication.id, medication.taken)}
                      >
                        {medication.taken ? (
                          <>
                            <Check className="size-4 mr-1" />
                            Taken
                          </>
                        ) : (
                          <>
                            <X className="size-4 mr-1" />
                            Missed
                          </>
                        )}
                      </Button>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handlePhotoUpload('medication', medication.id)}
                      >
                        <Camera className="size-4 mr-1" />
                        {medication.photo ? 'Update Photo' : 'Add Photo'}
                      </Button>
                      {medication.photo && (
                        <Badge variant="secondary" className="text-xs">Photo attached</Badge>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* Activity Tracking */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Activity className="size-5 text-purple-600" />
              <h2 className="text-xl text-neutral-900">Activity Tracking</h2>
            </div>

            <div className="space-y-3">
              {activities.length === 0 ? (
                <p className="text-neutral-600 text-center py-4">No activities scheduled for today</p>
              ) : (
                activities.map((activity) => (
                  <div 
                    key={activity.id} 
                    className="p-4 border border-neutral-200 rounded-lg"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-neutral-900">{activity.name}</h3>
                      </div>
                      <Button
                        size="sm"
                        variant={activity.completed ? "default" : "outline"}
                        className={activity.completed ? 'bg-purple-600 hover:bg-purple-700' : ''}
                        onClick={() => handleToggleActivity(activity.id, activity.completed)}
                      >
                        {activity.completed ? (
                          <>
                            <Check className="size-4 mr-1" />
                            Completed
                          </>
                        ) : (
                          'Mark Complete'
                        )}
                      </Button>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handlePhotoUpload('activity', activity.id)}
                      >
                        <Camera className="size-4 mr-1" />
                        {activity.photo ? 'Update Photo' : 'Add Photo'}
                      </Button>
                      {activity.photo && (
                        <Badge variant="secondary" className="text-xs">Photo attached</Badge>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* Notes */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <ClipboardList className="size-5 text-orange-600" />
              <h2 className="text-xl text-neutral-900">Care Notes</h2>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="note">Add a note</Label>
                <Textarea 
                  id="note"
                  placeholder="Enter observations, care notes, or updates..."
                  rows={4}
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                />
              </div>

              <Button 
                className="w-full bg-orange-600 hover:bg-orange-700"
                onClick={handleAddNote}
              >
                Submit Note
              </Button>

              <div className="border-t border-neutral-200 pt-4">
                <h3 className="text-sm text-neutral-700 mb-3">Recent Notes</h3>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {notes.length === 0 ? (
                    <p className="text-neutral-600 text-sm">No notes yet</p>
                  ) : (
                    notes.map((note) => (
                      <div key={note.id} className="p-3 bg-neutral-50 rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <p className="text-sm text-neutral-900">{note.staffName}</p>
                          <p className="text-xs text-neutral-500">
                            {new Date(note.timestamp).toLocaleString('en-IN', {
                              dateStyle: 'short',
                              timeStyle: 'short'
                            })}
                          </p>
                        </div>
                        <p className="text-sm text-neutral-700">{note.text}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
