import { createBrowserRouter } from 'react-router';

import Landing from './pages/Landing';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';

import StudentLayout from './components/layout/StudentLayout';
import StudentDashboard from './pages/student/Dashboard';
import Assessment from './pages/student/Assessment';
import AthleteProfile from './pages/student/AthleteProfile';
import Progress from './pages/student/Progress';
import MatchRecords from './pages/student/MatchRecords';
import Opportunities from './pages/student/Opportunities';
import Wellness from './pages/student/Wellness';

import CoachLayout from './components/layout/CoachLayout';
import CoachDashboard from './pages/coach/Dashboard';
import Discover from './pages/coach/Discover';
import SavedAthletes from './pages/coach/SavedAthletes';
import Verification from './pages/coach/Verification';

import AdminLayout from './components/layout/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import CoachVerification from './pages/admin/CoachVerification';
import AdminOpportunities from './pages/admin/Opportunities';
import Reports from './pages/admin/Reports';
import Activity from './pages/admin/Activity';

function Placeholder({ title }: { title: string }) {
  return (
    <div className="p-6 flex flex-col items-center justify-center min-h-64">
      <p className="text-lg font-bold text-[var(--color-text)]">{title}</p>
      <p className="text-sm text-[var(--color-text-muted)] mt-1">Coming soon</p>
    </div>
  );
}

export const router = createBrowserRouter([
  { path: '/', Component: Landing },
  { path: '/login', Component: Login },
  { path: '/signup', Component: Signup },
  {
    path: '/student',
    Component: StudentLayout,
    children: [
      { index: true, Component: StudentDashboard },
      { path: 'assessments', Component: Assessment },
      { path: 'profile', Component: AthleteProfile },
      { path: 'progress', Component: Progress },
      { path: 'records', Component: MatchRecords },
      { path: 'opportunities', Component: Opportunities },
      { path: 'wellness', Component: Wellness },
      { path: 'notifications', Component: () => <Placeholder title="Notifications" /> },
      { path: 'settings', Component: () => <Placeholder title="Settings" /> },
    ],
  },
  {
    path: '/coach',
    Component: CoachLayout,
    children: [
      { index: true, Component: CoachDashboard },
      { path: 'discover', Component: Discover },
      { path: 'saved', Component: SavedAthletes },
      { path: 'verification', Component: Verification },
      { path: 'opportunities', Component: () => <Placeholder title="Coach Opportunities" /> },
      { path: 'notifications', Component: () => <Placeholder title="Notifications" /> },
      { path: 'settings', Component: () => <Placeholder title="Settings" /> },
    ],
  },
  {
    path: '/admin',
    Component: AdminLayout,
    children: [
      { index: true, Component: AdminDashboard },
      { path: 'users', Component: AdminUsers },
      { path: 'coaches', Component: () => <Placeholder title="Coach Management" /> },
      { path: 'verification', Component: CoachVerification },
      { path: 'opportunities', Component: AdminOpportunities },
      { path: 'reports', Component: Reports },
      { path: 'activity', Component: Activity },
      { path: 'settings', Component: () => <Placeholder title="Admin Settings" /> },
    ],
  },
]);
