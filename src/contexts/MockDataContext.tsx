import { createContext, useContext, useState, ReactNode } from 'react';

interface Vital {
  clientId: number;
  temperature: string;
  bp: string;
  hr: string;
  oxygen: string;
  sugar: string;
  weight: string;
  timestamp: string;
}

interface Medication {
  id: number;
  clientId: number;
  name: string;
  time: string;
  dosage: string;
  taken: boolean;
  photo?: string;
  date: string;
}

interface Activity {
  id: number;
  clientId: number;
  name: string;
  completed: boolean;
  photo?: string;
  date: string;
}

interface Note {
  id: number;
  clientId: number;
  text: string;
  timestamp: string;
  staffName: string;
}

interface Client {
  id: number;
  name: string;
  age: number;
  room: string;
  photo: string | null;
  careLevel: string;
  assignedStaffId: number;
}

interface Staff {
  id: number;
  name: string;
  role: string;
  photo: string | null;
  email: string;
}

interface Shift {
  staffId: number;
  day: string;
  shift: 'Morning' | 'Evening' | 'Night' | 'Off';
  hours: string;
}

interface MockDataContextType {
  clients: Client[];
  staff: Staff[];
  vitals: Vital[];
  medications: Medication[];
  activities: Activity[];
  notes: Note[];
  shifts: Shift[];
  addVital: (vital: Vital) => void;
  updateMedication: (medicationId: number, taken: boolean, photo?: string) => void;
  updateActivity: (activityId: number, completed: boolean, photo?: string) => void;
  addNote: (note: Note) => void;
  reassignClient: (clientId: number, newStaffId: number) => void;
  updateShift: (staffId: number, day: string, shift: 'Morning' | 'Evening' | 'Night' | 'Off', hours: string) => void;
  getClientsByStaff: (staffId: number) => Client[];
  getVitalsByClient: (clientId: number) => Vital[];
  getMedicationsByClient: (clientId: number) => Medication[];
  getActivitiesByClient: (clientId: number) => Activity[];
  getNotesByClient: (clientId: number) => Note[];
}

const MockDataContext = createContext<MockDataContextType | undefined>(undefined);

export function MockDataProvider({ children }: { children: ReactNode }) {
  const [clients, setClients] = useState<Client[]>([
    { id: 1, name: 'Mrs. Lakshmi Devi', age: 72, room: 'A-204', photo: null, careLevel: 'Medium', assignedStaffId: 1 },
    { id: 2, name: 'Mr. Ramesh Kumar', age: 78, room: 'A-301', photo: null, careLevel: 'High', assignedStaffId: 1 },
    { id: 3, name: 'Mrs. Sita Reddy', age: 70, room: 'B-102', photo: null, careLevel: 'Low', assignedStaffId: 2 },
    { id: 4, name: 'Mr. Anil Sharma', age: 75, room: 'A-205', photo: null, careLevel: 'Medium', assignedStaffId: 2 },
    { id: 5, name: 'Mrs. Priya Menon', age: 68, room: 'B-203', photo: null, careLevel: 'Low', assignedStaffId: 3 },
    { id: 6, name: 'Mr. Suresh Patel', age: 80, room: 'A-102', photo: null, careLevel: 'High', assignedStaffId: 3 },
  ]);

  const [staff] = useState<Staff[]>([
    { id: 1, name: 'Nurse Priya', role: 'Registered Nurse', photo: null, email: 'priya@aurahome.com' },
    { id: 2, name: 'Caregiver Raj', role: 'Senior Caregiver', photo: null, email: 'raj@aurahome.com' },
    { id: 3, name: 'Nurse Meena', role: 'Registered Nurse', photo: null, email: 'meena@aurahome.com' },
    { id: 4, name: 'Caregiver Suresh', role: 'Caregiver', photo: null, email: 'suresh@aurahome.com' },
  ]);

  const [vitals, setVitals] = useState<Vital[]>([
    { clientId: 1, temperature: '98.2', bp: '128/82', hr: '76', oxygen: '98', sugar: '112', weight: '62', timestamp: new Date().toISOString() },
    { clientId: 2, temperature: '98.6', bp: '135/88', hr: '82', oxygen: '96', sugar: '145', weight: '70', timestamp: new Date().toISOString() },
  ]);

  const [medications, setMedications] = useState<Medication[]>([
    { id: 1, clientId: 1, name: 'BP Medicine', time: '9:00 AM', dosage: '1 tablet', taken: true, date: new Date().toISOString().split('T')[0] },
    { id: 2, clientId: 1, name: 'Diabetes Med', time: '2:00 PM', dosage: '1 tablet', taken: true, date: new Date().toISOString().split('T')[0] },
    { id: 3, clientId: 1, name: 'Vitamin D', time: '8:00 PM', dosage: '1 capsule', taken: false, date: new Date().toISOString().split('T')[0] },
    { id: 4, clientId: 2, name: 'BP Medicine', time: '8:00 AM', dosage: '2 tablets', taken: true, date: new Date().toISOString().split('T')[0] },
    { id: 5, clientId: 2, name: 'Diabetes Med', time: '1:00 PM', dosage: '1 tablet', taken: false, date: new Date().toISOString().split('T')[0] },
  ]);

  const [activities, setActivities] = useState<Activity[]>([
    { id: 1, clientId: 1, name: 'Morning Yoga', completed: true, date: new Date().toISOString().split('T')[0] },
    { id: 2, clientId: 1, name: 'Garden Walk', completed: false, date: new Date().toISOString().split('T')[0] },
    { id: 3, clientId: 2, name: 'Physical Therapy', completed: true, date: new Date().toISOString().split('T')[0] },
    { id: 4, clientId: 2, name: 'Reading Club', completed: false, date: new Date().toISOString().split('T')[0] },
  ]);

  const [notes, setNotes] = useState<Note[]>([
    { id: 1, clientId: 1, text: 'Had a good day. Participated actively in yoga session. Appetite normal.', timestamp: new Date().toISOString(), staffName: 'Nurse Priya' },
    { id: 2, clientId: 2, text: 'BP slightly elevated. Monitoring closely. Good spirits today.', timestamp: new Date().toISOString(), staffName: 'Nurse Priya' },
  ]);

  const [shifts, setShifts] = useState<Shift[]>([
    { staffId: 1, day: 'Monday', shift: 'Morning', hours: '7:00 AM - 3:00 PM' },
    { staffId: 1, day: 'Tuesday', shift: 'Morning', hours: '7:00 AM - 3:00 PM' },
    { staffId: 1, day: 'Wednesday', shift: 'Evening', hours: '3:00 PM - 11:00 PM' },
    { staffId: 1, day: 'Thursday', shift: 'Off', hours: '-' },
    { staffId: 1, day: 'Friday', shift: 'Morning', hours: '7:00 AM - 3:00 PM' },
    { staffId: 1, day: 'Saturday', shift: 'Morning', hours: '7:00 AM - 3:00 PM' },
    { staffId: 1, day: 'Sunday', shift: 'Off', hours: '-' },
    { staffId: 2, day: 'Monday', shift: 'Evening', hours: '3:00 PM - 11:00 PM' },
    { staffId: 2, day: 'Tuesday', shift: 'Evening', hours: '3:00 PM - 11:00 PM' },
    { staffId: 2, day: 'Wednesday', shift: 'Off', hours: '-' },
    { staffId: 2, day: 'Thursday', shift: 'Morning', hours: '7:00 AM - 3:00 PM' },
    { staffId: 2, day: 'Friday', shift: 'Evening', hours: '3:00 PM - 11:00 PM' },
    { staffId: 2, day: 'Saturday', shift: 'Off', hours: '-' },
    { staffId: 2, day: 'Sunday', shift: 'Morning', hours: '7:00 AM - 3:00 PM' },
  ]);

  const addVital = (vital: Vital) => {
    setVitals(prev => [vital, ...prev]);
  };

  const updateMedication = (medicationId: number, taken: boolean, photo?: string) => {
    setMedications(prev => prev.map(med => 
      med.id === medicationId ? { ...med, taken, photo } : med
    ));
  };

  const updateActivity = (activityId: number, completed: boolean, photo?: string) => {
    setActivities(prev => prev.map(act => 
      act.id === activityId ? { ...act, completed, photo } : act
    ));
  };

  const addNote = (note: Note) => {
    setNotes(prev => [note, ...prev]);
  };

  const reassignClient = (clientId: number, newStaffId: number) => {
    setClients(prev => prev.map(client => 
      client.id === clientId ? { ...client, assignedStaffId: newStaffId } : client
    ));
  };

  const updateShift = (staffId: number, day: string, shift: 'Morning' | 'Evening' | 'Night' | 'Off', hours: string) => {
    setShifts(prev => {
      const existing = prev.find(s => s.staffId === staffId && s.day === day);
      if (existing) {
        return prev.map(s => 
          s.staffId === staffId && s.day === day ? { ...s, shift, hours } : s
        );
      } else {
        return [...prev, { staffId, day, shift, hours }];
      }
    });
  };

  const getClientsByStaff = (staffId: number) => {
    return clients.filter(client => client.assignedStaffId === staffId);
  };

  const getVitalsByClient = (clientId: number) => {
    return vitals.filter(vital => vital.clientId === clientId);
  };

  const getMedicationsByClient = (clientId: number) => {
    const today = new Date().toISOString().split('T')[0];
    return medications.filter(med => med.clientId === clientId && med.date === today);
  };

  const getActivitiesByClient = (clientId: number) => {
    const today = new Date().toISOString().split('T')[0];
    return activities.filter(act => act.clientId === clientId && act.date === today);
  };

  const getNotesByClient = (clientId: number) => {
    return notes.filter(note => note.clientId === clientId);
  };

  return (
    <MockDataContext.Provider value={{
      clients,
      staff,
      vitals,
      medications,
      activities,
      notes,
      shifts,
      addVital,
      updateMedication,
      updateActivity,
      addNote,
      reassignClient,
      updateShift,
      getClientsByStaff,
      getVitalsByClient,
      getMedicationsByClient,
      getActivitiesByClient,
      getNotesByClient,
    }}>
      {children}
    </MockDataContext.Provider>
  );
}

export function useMockData() {
  const context = useContext(MockDataContext);
  if (context === undefined) {
    throw new Error('useMockData must be used within a MockDataProvider');
  }
  return context;
}
