import { useState, useEffect } from 'react';
import { Heart, Activity, Pill, Utensils, Video, Bell, CreditCard, Calendar, LogOut, User, TrendingUp, AlertTriangle, Phone, MessageSquare, Plus } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { VideoCallDialog } from './VideoCallDialog';
import { PhotoUpdates } from './PhotoUpdates';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
);

interface FamilyDashboardProps {
  user: any;
  onLogout: () => void;
}

export function FamilyDashboard({ user, onLogout }: FamilyDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [showVideoDialog, setShowVideoDialog] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showServiceRequestDialog, setShowServiceRequestDialog] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [serviceRequestType, setServiceRequestType] = useState('');
  const [serviceRequestDetails, setServiceRequestDetails] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [photoUpdates, setPhotoUpdates] = useState<any[]>([]);

  useEffect(() => {
    fetchPhotoUpdates();
  }, []);

  const fetchPhotoUpdates = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) return;

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-f835a0b6/photos`,
        {
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setPhotoUpdates(data.photos || []);
      }
    } catch (error) {
      console.error('Error fetching photo updates:', error);
    }
  };

  // Mock data - would be fetched from backend
  const residentInfo = {
    name: 'Mrs. Lakshmi Devi',
    age: 72,
    room: 'A-204',
    photo: null,
  };

  const todaysCare = {
    meals: {
      breakfast: { taken: true, time: '8:30 AM', items: 'Idli, Sambar, Chutney' },
      lunch: { taken: true, time: '1:00 PM', items: 'Rice, Dal, Vegetables' },
      dinner: { taken: false, time: '7:30 PM', items: 'Chapati, Paneer Curry' },
    },
    medications: [
      { name: 'BP Medicine', taken: true, time: '9:00 AM', dosage: '1 tablet' },
      { name: 'Diabetes Med', taken: true, time: '2:00 PM', dosage: '1 tablet' },
      { name: 'Vitamin D', taken: false, time: '8:00 PM', dosage: '1 capsule' },
    ],
    vitals: {
      bp: '128/82',
      sugar: '112 mg/dL',
      heartRate: '76 bpm',
      temperature: '98.2°F',
      lastUpdated: '2:30 PM',
    },
    activities: [
      { name: 'Morning Yoga', attended: true, time: '7:00 AM' },
      { name: 'Garden Walk', attended: true, time: '5:00 PM' },
    ],
    notes: 'Had a good day. Participated actively in yoga session. Appetite normal.',
  };

  const healthTrends = [
    { date: '01/12', bp: 130, sugar: 115 },
    { date: '02/12', bp: 128, sugar: 110 },
    { date: '03/12', bp: 132, sugar: 118 },
  ];

  const alerts = [
    { id: 1, type: 'info', message: 'Physiotherapy session scheduled for tomorrow at 10 AM', time: '2 hours ago' },
  ];

  const upcomingBills = {
    monthlyStay: 35000,
    medicalExpenses: 2500,
    optionalServices: 1500,
    total: 39000,
    dueDate: '10 Dec 2025',
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Heart className="size-6 text-green-600" />
              <span className="text-xl text-green-900">AuraHome</span>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm">
                <Bell className="size-5" />
                {alerts.length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </Button>
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm text-neutral-900">{user?.user_metadata?.name || 'Family Member'}</p>
                  <p className="text-xs text-neutral-500">Family Account</p>
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
        {/* Resident Info Card */}
        <Card className="p-6 mb-8">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-blue-100 rounded-full flex items-center justify-center">
                <User className="size-8 text-green-700" />
              </div>
              <div>
                <h1 className="text-2xl text-neutral-900 mb-1">{residentInfo.name}</h1>
                <div className="flex items-center gap-4 text-sm text-neutral-600">
                  <span>Age: {residentInfo.age}</span>
                  <span>•</span>
                  <span>Room: {residentInfo.room}</span>
                </div>
              </div>
            </div>
            <Button className="bg-green-600 hover:bg-green-700" onClick={() => setShowVideoDialog(true)}>
              <Video className="size-4 mr-2" />
              Video Call
            </Button>
          </div>
        </Card>

        {/* Alerts */}
        {alerts.length > 0 && (
          <div className="mb-6 space-y-3">
            {alerts.map((alert) => (
              <Card key={alert.id} className="p-4 border-blue-200 bg-blue-50">
                <div className="flex items-start gap-3">
                  <Bell className="size-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-neutral-900">{alert.message}</p>
                    <p className="text-xs text-neutral-500 mt-1">{alert.time}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Daily Care</TabsTrigger>
            <TabsTrigger value="photos">Photo Updates</TabsTrigger>
            <TabsTrigger value="health">Health Monitoring</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
            <TabsTrigger value="requests">Service Requests</TabsTrigger>
          </TabsList>

          {/* Daily Care Overview */}
          <TabsContent value="overview" className="space-y-6">
            {/* Vitals */}
            <div>
              <h2 className="text-xl text-neutral-900 mb-4">Today's Vitals</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <VitalCard icon={<Activity />} label="Blood Pressure" value={todaysCare.vitals.bp} status="normal" />
                <VitalCard icon={<Activity />} label="Blood Sugar" value={todaysCare.vitals.sugar} status="normal" />
                <VitalCard icon={<Heart />} label="Heart Rate" value={todaysCare.vitals.heartRate} status="normal" />
                <VitalCard icon={<Activity />} label="Temperature" value={todaysCare.vitals.temperature} status="normal" />
              </div>
              <p className="text-xs text-neutral-500 mt-2">Last updated: {todaysCare.vitals.lastUpdated}</p>
            </div>

            {/* Meals & Medications */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Meals */}
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Utensils className="size-5 text-amber-600" />
                  <h3 className="text-lg text-neutral-900">Meals</h3>
                </div>
                <div className="space-y-4">
                  <MealItem meal="Breakfast" data={todaysCare.meals.breakfast} />
                  <MealItem meal="Lunch" data={todaysCare.meals.lunch} />
                  <MealItem meal="Dinner" data={todaysCare.meals.dinner} />
                </div>
              </Card>

              {/* Medications */}
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Pill className="size-5 text-blue-600" />
                  <h3 className="text-lg text-neutral-900">Medications</h3>
                </div>
                <div className="space-y-4">
                  {todaysCare.medications.map((med, index) => (
                    <MedicationItem key={index} medication={med} />
                  ))}
                </div>
              </Card>
            </div>

            {/* Activities & Notes */}
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="size-5 text-green-600" />
                  <h3 className="text-lg text-neutral-900">Activities</h3>
                </div>
                <div className="space-y-3">
                  {todaysCare.activities.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                      <div>
                        <p className="text-sm text-neutral-900">{activity.name}</p>
                        <p className="text-xs text-neutral-500">{activity.time}</p>
                      </div>
                      <Badge variant={activity.attended ? 'default' : 'secondary'}>
                        {activity.attended ? 'Attended' : 'Scheduled'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <User className="size-5 text-purple-600" />
                  <h3 className="text-lg text-neutral-900">Staff Notes</h3>
                </div>
                <p className="text-sm text-neutral-700">{todaysCare.notes}</p>
                <div className="mt-4 pt-4 border-t border-neutral-200">
                  <p className="text-xs text-neutral-500">Updated by Nurse Priya • 4:30 PM</p>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Photo Updates */}
          <TabsContent value="photos">
            <Card className="p-6">
              <h2 className="text-xl text-neutral-900 mb-4">Photo Updates</h2>
              <PhotoUpdates photos={photoUpdates} />
            </Card>
          </TabsContent>

          {/* Health Monitoring */}
          <TabsContent value="health" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl text-neutral-900 mb-4">Health Trends (Last 7 Days)</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm text-neutral-700 mb-3">Blood Pressure</h3>
                  <div className="h-48 bg-gradient-to-t from-green-50 to-transparent rounded-lg flex items-end justify-around p-4">
                    {healthTrends.map((day, index) => (
                      <div key={index} className="flex flex-col items-center gap-2">
                        <div className="w-12 bg-green-600 rounded-t" style={{ height: `${day.bp / 2}px` }} />
                        <span className="text-xs text-neutral-600">{day.date}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="size-5 text-orange-600" />
                  <h3 className="text-lg text-neutral-900">Recent Alerts</h3>
                </div>
                <p className="text-sm text-neutral-600">No abnormal vitals in the last 7 days</p>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Phone className="size-5 text-blue-600" />
                  <h3 className="text-lg text-neutral-900">Emergency Contacts</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-700">Doctor on Call</span>
                    <span className="text-sm text-green-600">+91 98765 43210</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-700">Facility Manager</span>
                    <span className="text-sm text-green-600">+91 98765 43211</span>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Billing */}
          <TabsContent value="billing">
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <CreditCard className="size-5 text-green-600" />
                <h2 className="text-xl text-neutral-900">Billing Summary</h2>
              </div>

              <div className="space-y-4 mb-6">
                <BillingRow label="Monthly Stay" amount={upcomingBills.monthlyStay} />
                <BillingRow label="Medical Expenses" amount={upcomingBills.medicalExpenses} />
                <BillingRow label="Optional Services" amount={upcomingBills.optionalServices} />
                <div className="pt-4 border-t-2 border-neutral-300">
                  <BillingRow label="Total Amount" amount={upcomingBills.total} bold />
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-amber-900">Due Date: {upcomingBills.dueDate}</p>
              </div>

              <Button className="w-full bg-green-600 hover:bg-green-700" onClick={() => setShowPaymentDialog(true)}>
                Pay Now
              </Button>
            </Card>
          </TabsContent>

          {/* Service Requests */}
          <TabsContent value="requests">
            <Card className="p-6">
              <h2 className="text-xl text-neutral-900 mb-6">Service Requests</h2>
              
              <div className="space-y-4 mb-6">
                <div className="p-4 border border-neutral-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-neutral-900">Haircut Appointment</span>
                    <Badge>Scheduled</Badge>
                  </div>
                  <p className="text-xs text-neutral-600">Scheduled for Dec 5, 2025 at 2:00 PM</p>
                </div>
              </div>

              <Button className="w-full" variant="outline" onClick={() => setShowServiceRequestDialog(true)}>
                + New Service Request
              </Button>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Video Call Dialog */}
      <VideoCallDialog open={showVideoDialog} onOpenChange={setShowVideoDialog} residentName={residentInfo.name} />

      {/* Payment Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Payment for {residentInfo.name}</DialogTitle>
            <DialogDescription>
              Please select a payment method and review the billing summary before proceeding.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <CreditCard className="size-5 text-green-600" />
                <h3 className="text-lg text-neutral-900">Payment Method</h3>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    id="card"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                  />
                  <label className="text-sm text-neutral-700" htmlFor="card">Credit Card</label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    id="netbanking"
                    value="netbanking"
                    checked={paymentMethod === 'netbanking'}
                    onChange={() => setPaymentMethod('netbanking')}
                  />
                  <label className="text-sm text-neutral-700" htmlFor="netbanking">Net Banking</label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    id="upi"
                    value="upi"
                    checked={paymentMethod === 'upi'}
                    onChange={() => setPaymentMethod('upi')}
                  />
                  <label className="text-sm text-neutral-700" htmlFor="upi">UPI</label>
                </div>
              </div>
            </div>
            <div className="space-y-4 mt-6">
              <div className="flex items-center gap-2">
                <CreditCard className="size-5 text-green-600" />
                <h3 className="text-lg text-neutral-900">Billing Summary</h3>
              </div>
              <div className="space-y-4">
                <BillingRow label="Monthly Stay" amount={upcomingBills.monthlyStay} />
                <BillingRow label="Medical Expenses" amount={upcomingBills.medicalExpenses} />
                <BillingRow label="Optional Services" amount={upcomingBills.optionalServices} />
                <div className="pt-4 border-t-2 border-neutral-300">
                  <BillingRow label="Total Amount" amount={upcomingBills.total} bold />
                </div>
              </div>
            </div>
            <div className="mt-6">
              <Button className="w-full bg-green-600 hover:bg-green-700">
                Pay Now
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Service Request Dialog */}
      <Dialog open={showServiceRequestDialog} onOpenChange={setShowServiceRequestDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>New Service Request for {residentInfo.name}</DialogTitle>
            <DialogDescription>
              Please select the type of service and provide any additional details.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Plus className="size-5 text-green-600" />
                <h3 className="text-lg text-neutral-900">Service Type</h3>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    id="haircut"
                    value="haircut"
                    checked={serviceRequestType === 'haircut'}
                    onChange={() => setServiceRequestType('haircut')}
                  />
                  <label className="text-sm text-neutral-700" htmlFor="haircut">Haircut</label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    id="physiotherapy"
                    value="physiotherapy"
                    checked={serviceRequestType === 'physiotherapy'}
                    onChange={() => setServiceRequestType('physiotherapy')}
                  />
                  <label className="text-sm text-neutral-700" htmlFor="physiotherapy">Physiotherapy</label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    id="medication"
                    value="medication"
                    checked={serviceRequestType === 'medication'}
                    onChange={() => setServiceRequestType('medication')}
                  />
                  <label className="text-sm text-neutral-700" htmlFor="medication">Medication</label>
                </div>
              </div>
            </div>
            <div className="space-y-4 mt-6">
              <div className="flex items-center gap-2">
                <MessageSquare className="size-5 text-green-600" />
                <h3 className="text-lg text-neutral-900">Details</h3>
              </div>
              <textarea
                className="w-full p-2 border border-neutral-300 rounded-lg"
                value={serviceRequestDetails}
                onChange={(e) => setServiceRequestDetails(e.target.value)}
                placeholder="Enter details of the service request"
              />
            </div>
            <div className="mt-6">
              <Button className="w-full bg-green-600 hover:bg-green-700">
                Submit Request
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function VitalCard({ icon, label, value, status }: { icon: React.ReactNode; label: string; value: string; status: string }) {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between mb-2">
        <div className="text-green-600">{icon}</div>
        <Badge variant={status === 'normal' ? 'default' : 'destructive'} className="text-xs">
          {status}
        </Badge>
      </div>
      <p className="text-2xl text-neutral-900 mb-1">{value}</p>
      <p className="text-xs text-neutral-600">{label}</p>
    </Card>
  );
}

function MealItem({ meal, data }: { meal: string; data: any }) {
  return (
    <div className="flex items-start justify-between p-3 bg-neutral-50 rounded-lg">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <p className="text-sm text-neutral-900">{meal}</p>
          <Badge variant={data.taken ? 'default' : 'secondary'} className="text-xs">
            {data.taken ? 'Taken' : 'Pending'}
          </Badge>
        </div>
        <p className="text-xs text-neutral-600">{data.items}</p>
        {data.taken && <p className="text-xs text-neutral-500 mt-1">{data.time}</p>}
      </div>
    </div>
  );
}

function MedicationItem({ medication }: { medication: any }) {
  return (
    <div className="flex items-start justify-between p-3 bg-neutral-50 rounded-lg">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <p className="text-sm text-neutral-900">{medication.name}</p>
          <Badge variant={medication.taken ? 'default' : 'secondary'} className="text-xs">
            {medication.taken ? 'Taken' : 'Pending'}
          </Badge>
        </div>
        <p className="text-xs text-neutral-600">{medication.dosage} • {medication.time}</p>
      </div>
    </div>
  );
}

function BillingRow({ label, amount, bold }: { label: string; amount: number; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className={`text-sm ${bold ? 'text-neutral-900' : 'text-neutral-700'}`}>
        {label}
      </span>
      <span className={`${bold ? 'text-lg text-neutral-900' : 'text-sm text-neutral-700'}`}>
        ₹{amount.toLocaleString('en-IN')}
      </span>
    </div>
  );
}