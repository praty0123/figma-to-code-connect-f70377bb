import { useState } from 'react';
import { Video, AlertCircle, Calendar, Pill, Utensils, MessageCircle, LogOut, Heart, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface ResidentDashboardProps {
  user: any;
  onLogout: () => void;
}

export function ResidentDashboard({ user, onLogout }: ResidentDashboardProps) {
  const [showSOSDialog, setShowSOSDialog] = useState(false);
  const [showActivitiesDialog, setShowActivitiesDialog] = useState(false);
  const [showMealsDialog, setShowMealsDialog] = useState(false);

  const upcomingActivities = [
    { id: 1, name: 'Morning Yoga', time: '7:00 AM', icon: '🧘' },
    { id: 2, name: 'Bhajan Session', time: '10:00 AM', icon: '🎵' },
    { id: 3, name: 'Movie Time', time: '4:00 PM', icon: '🎬' },
    { id: 4, name: 'Evening Walk', time: '6:00 PM', icon: '🚶' },
  ];

  const todaysMeals = [
    { meal: 'Breakfast', time: '8:00 AM', items: 'Idli, Sambar, Chutney', icon: '🍽️' },
    { meal: 'Lunch', time: '1:00 PM', items: 'Rice, Dal, Vegetables', icon: '🍛' },
    { meal: 'Dinner', time: '7:30 PM', items: 'Chapati, Paneer Curry', icon: '🥘' },
  ];

  const upcomingMedications = [
    { name: 'BP Medicine', time: '9:00 AM', icon: '💊' },
    { name: 'Vitamin D', time: '8:00 PM', icon: '💊' },
  ];

  const handleSOS = (type: string) => {
    alert(`${type} help request sent! Staff will be with you shortly.`);
    setShowSOSDialog(false);
  };

  const handleBookActivity = async (activityId: number) => {
    alert('Activity booked successfully!');
    setShowActivitiesDialog(false);
  };

  const handleOpenFeedback = () => {
    alert('Opening feedback form...');
  };

  const handleOpenMedicines = () => {
    alert('Showing your medication schedule...');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-amber-50">
      {/* Large, Simple Header */}
      <header className="bg-white border-b-4 border-green-600 p-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-blue-100 rounded-full flex items-center justify-center">
              <User className="size-8 text-green-700" />
            </div>
            <div>
              <h1 className="text-3xl text-green-900">Welcome Back!</h1>
              <p className="text-xl text-neutral-600">{user?.user_metadata?.name || 'Resident'}</p>
            </div>
          </div>
          <Button variant="ghost" size="lg" onClick={onLogout}>
            <LogOut className="size-6" />
          </Button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Medication Reminder */}
        {upcomingMedications.length > 0 && (
          <Card className="p-6 bg-blue-50 border-2 border-blue-300">
            <div className="flex items-center gap-4">
              <Pill className="size-12 text-blue-600" />
              <div className="flex-1">
                <h3 className="text-2xl text-blue-900 mb-1">Medication Reminder</h3>
                <p className="text-xl text-blue-700">
                  {upcomingMedications[0].name} at {upcomingMedications[0].time}
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Main Action Cards - Large Buttons */}
        <div className="grid sm:grid-cols-2 gap-6">
          <ActionCard
            icon={<Video className="size-16" />}
            title="Video Call Family"
            description="Call your loved ones"
            bgColor="bg-green-100"
            textColor="text-green-900"
            iconColor="text-green-600"
            onClick={() => alert('Starting video call...')}
          />

          <ActionCard
            icon={<AlertCircle className="size-16" />}
            title="Request Help"
            description="Get immediate assistance"
            bgColor="bg-red-100"
            textColor="text-red-900"
            iconColor="text-red-600"
            onClick={() => setShowSOSDialog(true)}
          />

          <ActionCard
            icon={<Calendar className="size-16" />}
            title="Activities"
            description="View and book activities"
            bgColor="bg-purple-100"
            textColor="text-purple-900"
            iconColor="text-purple-600"
            onClick={() => setShowActivitiesDialog(true)}
          />

          <ActionCard
            icon={<Utensils className="size-16" />}
            title="Meals"
            description="Today's menu"
            bgColor="bg-amber-100"
            textColor="text-amber-900"
            iconColor="text-amber-600"
            onClick={() => setShowMealsDialog(true)}
          />

          <ActionCard
            icon={<MessageCircle className="size-16" />}
            title="Feedback"
            description="Share your thoughts"
            bgColor="bg-blue-100"
            textColor="text-blue-900"
            iconColor="text-blue-600"
            onClick={handleOpenFeedback}
          />

          <ActionCard
            icon={<Pill className="size-16" />}
            title="My Medicines"
            description="View medication schedule"
            bgColor="bg-teal-100"
            textColor="text-teal-900"
            iconColor="text-teal-600"
            onClick={handleOpenMedicines}
          />
        </div>
      </div>

      {/* SOS Dialog */}
      <Dialog open={showSOSDialog} onOpenChange={setShowSOSDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-3xl text-center mb-4">What help do you need?</DialogTitle>
          </DialogHeader>
          <div className="grid sm:grid-cols-2 gap-4">
            <Button
              size="lg"
              className="h-32 text-xl bg-red-600 hover:bg-red-700 flex-col gap-2"
              onClick={() => handleSOS('Emergency')}
            >
              <AlertCircle className="size-12" />
              Emergency
            </Button>
            <Button
              size="lg"
              className="h-32 text-xl bg-blue-600 hover:bg-blue-700 flex-col gap-2"
              onClick={() => handleSOS('Nurse')}
            >
              <User className="size-12" />
              Call Nurse
            </Button>
            <Button
              size="lg"
              className="h-32 text-xl bg-amber-600 hover:bg-amber-700 flex-col gap-2"
              onClick={() => handleSOS('Bathroom')}
            >
              <Heart className="size-12" />
              Bathroom Help
            </Button>
            <Button
              size="lg"
              className="h-32 text-xl bg-green-600 hover:bg-green-700 flex-col gap-2"
              onClick={() => handleSOS('General')}
            >
              <MessageCircle className="size-12" />
              General Help
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Activities Dialog */}
      <Dialog open={showActivitiesDialog} onOpenChange={setShowActivitiesDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-3xl mb-4">Today's Activities</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            {upcomingActivities.map((activity) => (
              <Card key={activity.id} className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-4xl">{activity.icon}</span>
                    <div>
                      <h3 className="text-2xl text-neutral-900">{activity.name}</h3>
                      <p className="text-xl text-neutral-600">{activity.time}</p>
                    </div>
                  </div>
                  <Button size="lg" className="text-xl px-8" onClick={() => handleBookActivity(activity.id)}>
                    Book
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Meals Dialog */}
      <Dialog open={showMealsDialog} onOpenChange={setShowMealsDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-3xl mb-4">Today's Menu</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {todaysMeals.map((meal, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-start gap-4">
                  <span className="text-4xl">{meal.icon}</span>
                  <div className="flex-1">
                    <h3 className="text-2xl text-neutral-900 mb-1">{meal.meal}</h3>
                    <p className="text-xl text-neutral-600 mb-2">{meal.time}</p>
                    <p className="text-lg text-neutral-700">{meal.items}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ActionCard({
  icon,
  title,
  description,
  bgColor,
  textColor,
  iconColor,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  bgColor: string;
  textColor: string;
  iconColor: string;
  onClick: () => void;
}) {
  return (
    <Card
      className={`p-8 ${bgColor} border-2 hover:shadow-xl transition-all cursor-pointer`}
      onClick={onClick}
    >
      <div className="flex flex-col items-center text-center gap-4">
        <div className={iconColor}>{icon}</div>
        <div>
          <h2 className={`text-3xl ${textColor} mb-2`}>{title}</h2>
          <p className={`text-xl ${textColor} opacity-80`}>{description}</p>
        </div>
      </div>
    </Card>
  );
}
