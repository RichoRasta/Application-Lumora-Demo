/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useAppContext } from './contexts/AppContext';
import Navigation from './components/Navigation';
import Splash from './pages/Splash';
import Onboarding from './pages/Onboarding';
import Home from './pages/Home';
import Explore from './pages/Explore';
import Practice from './pages/Practice';
import Profile from './pages/Profile';
import LessonView from './pages/LessonView';
import Login from './pages/Login';
import Achievements from './pages/Achievements';
import Leaderboard from './pages/Leaderboard';
import DailyMission from './pages/DailyMission';
import Roadmap from './pages/Roadmap';
import SavedLessons from './pages/SavedLessons';
import Notes from './pages/Notes';
import Challenges from './pages/Challenges';
import Community from './pages/Community';
import Certificates from './pages/Certificates';
import LearningStats from './pages/LearningStats';
import AchievementToast from './components/AchievementToast';

function AppShell() {
  const { view } = useAppContext();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-navy text-slate-800 dark:text-white font-sans selection:bg-primary-blue/30 w-full transition-colors duration-300 relative">
      <Splash />
      {view === 'onboarding' && <Onboarding />}
      {view === 'login' && <Login />}
      
      {view !== 'splash' && view !== 'onboarding' && view !== 'login' && (
        <div className="flex h-screen bg-transparent w-full">
          <Navigation />
          <main className="flex-1 h-screen overflow-y-auto w-full relative pt-0 pb-16 md:pb-0 md:pl-24 xl:pl-64">
            {view === 'home' && <Home />}
            {view === 'explore' && <Explore />}
            {view === 'practice' && <Practice />}
            {view === 'profile' && <Profile />}
            
            {view === 'achievements' && <Achievements />}
            {view === 'leaderboard' && <Leaderboard />}
            {view === 'daily_mission' && <DailyMission />}
            {view === 'roadmap' && <Roadmap />}
            {view === 'saved_lessons' && <SavedLessons />}
            {view === 'notes' && <Notes />}
            {view === 'challenges' && <Challenges />}
            {view === 'community' && <Community />}
            {view === 'certificates' && <Certificates />}
            {view === 'learning_stats' && <LearningStats />}
          </main>
        </div>
      )}

      {/* Lesson View takes over full screen via z-index when active */}
      <LessonView />
      <AchievementToast />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}

