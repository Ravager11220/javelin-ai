import Sidebar from '@/components/dashboard/Sidebar';
import TopNavbar from '@/components/dashboard/TopNavbar';
import WelcomeCard from '@/components/dashboard/WelcomeCard';
import QuickStats from '@/components/dashboard/QuickStats';
import PerformanceChart from '@/components/dashboard/PerformanceChart';
import RecentSessions from '@/components/dashboard/RecentSessions';
import GoalsProgress from '@/components/dashboard/GoalsProgress';
import WeatherCard from '@/components/dashboard/WeatherCard';
import AICoach from '@/components/dashboard/AICoach';
import CompetitionCard from '@/components/dashboard/CompetitionCard';
import TrainingCalendar from '@/components/dashboard/TrainingCalendar';
import ActivityTimeline from '@/components/dashboard/ActivityTimeline';

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar />
      <main className="flex-1 lg:ml-64 transition-all duration-300">
        <TopNavbar />
        <div className="p-4 sm:p-6 lg:p-8 pt-20 sm:pt-24">
          <WelcomeCard />
          <QuickStats />
          
          {/* Dashboard Components Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <PerformanceChart />
            <RecentSessions />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="lg:col-span-2">
              <GoalsProgress />
            </div>
            <WeatherCard />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <AICoach />
            <CompetitionCard />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <TrainingCalendar />
            <ActivityTimeline />
          </div>
        </div>
      </main>
    </div>
  );
}
