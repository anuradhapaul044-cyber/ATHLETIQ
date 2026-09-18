import { createBrowserRouter, Navigate } from 'react-router';
import type { ComponentType } from 'react';
import { getAuthSession, type UserRole } from './lib/auth';

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
import CoachOpportunities from './pages/coach/CoachOpportunities';
import CoachNotifications from './pages/coach/CoachNotifications';
import CoachSettings from './pages/coach/CoachSettings';

import AdminLayout from './components/layout/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminCoaches from './pages/admin/Coaches';
import CoachVerification from './pages/admin/CoachVerification';
import AdminOpportunities from './pages/admin/Opportunities';
import Reports from './pages/admin/Reports';
import Activity from './pages/admin/Activity';
import AdminSettings from './pages/admin/Settings';

function Placeholder({ title }: { title: string }) {
  return (
    <div className="p-6 flex flex-col items-center justify-center min-h-64">
      <p className="text-lg font-bold text-[var(--color-text)]">{title}</p>
      <p className="text-sm text-[var(--color-text-muted)] mt-1">Coming soon</p>
    </div>
  );
}

function ProtectedLayout({ role, Layout }: { role: UserRole; Layout: ComponentType }) {
  const session = getAuthSession();
  if (!session) return <Navigate to="/login" replace />;
  if (session.user.role !== role) return <Navigate to={`/${session.user.role}`} replace />;
  return <Layout />;
}

function StudentRoute() {
  return <ProtectedLayout role="student" Layout={StudentLayout} />;
}

function CoachRoute() {
  return <ProtectedLayout role="coach" Layout={CoachLayout} />;
}

function AdminRoute() {
  return <ProtectedLayout role="admin" Layout={AdminLayout} />;
}

export const router = createBrowserRouter([
  { path: '/', Component: Landing },
  { path: '/login', Component: Login },
  { path: '/signup', Component: Signup },
  {
    path: '/student',
    Component: StudentRoute,
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
    Component: CoachRoute,
    children: [
      { index: true, Component: CoachDashboard },
      { path: 'discover', Component: Discover },
      { path: 'saved', Component: SavedAthletes },
      { path: 'verification', Component: Verification },
      { path: 'opportunities', Component: CoachOpportunities },
      { path: 'notifications', Component: CoachNotifications },
      { path: 'settings', Component: CoachSettings },
    ],
  },
  {
    path: '/admin',
    Component: AdminRoute,
    children: [
      { index: true, Component: AdminDashboard },
      { path: 'users', Component: AdminUsers },
      { path: 'coaches', Component: AdminCoaches },
      { path: 'verification', Component: CoachVerification },
      { path: 'opportunities', Component: AdminOpportunities },
      { path: 'reports', Component: Reports },
      { path: 'activity', Component: Activity },
      { path: 'settings', Component: AdminSettings },
    ],
  },
]);
