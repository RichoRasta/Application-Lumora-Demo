import React, { useState } from 'react';
import { Home, Compass, TerminalSquare, User, Award, Trophy, Target, Map, Bookmark, FileText, Zap, Users, ShieldCheck, BarChart3, LogOut, Menu, X, Moon, Sun } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';

export default function Navigation() {
  const { view, setView, t, logout, isAuthenticated, theme, setTheme } = useAppContext();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleMenuClick = (id: string) => {
    setView(id as any);
    setIsMobileOpen(false);
  };

  if (view === 'splash' || view === 'onboarding' || view === 'lesson' || view === 'login') {
    return null;
  }

  const primaryItems = [
    { id: 'home', icon: Home, label: t('nav.home') },
    { id: 'explore', icon: Compass, label: t('nav.explore') },
    { id: 'practice', icon: TerminalSquare, label: t('nav.practice') || t('nav.practice') },
  ];

  const secondaryItems = [
    { id: 'roadmap', icon: Map, label: t('nav.roadmap') },
    { id: 'daily_mission', icon: Target, label: t('nav.mission') },
    { id: 'challenges', icon: Zap, label: t('nav.challenges') },
    { id: 'achievements', icon: Award, label: t('nav.achievements') },
    { id: 'leaderboard', icon: Trophy, label: t('nav.leaderboard') },
    { id: 'community', icon: Users, label: t('nav.community') },
  ];

  const personalItems = [
    { id: 'saved_lessons', icon: Bookmark, label: t('nav.saved_lessons') },
    { id: 'notes', icon: FileText, label: t('nav.notes') },
    { id: 'learning_stats', icon: BarChart3, label: t('nav.stats') },
    { id: 'certificates', icon: ShieldCheck, label: t('nav.certificates') },
  ];

  const renderMenuItem = (item: any, isMobile = false) => {
    const Icon = item.icon;
    const isActive = view === item.id;
    
    if (isMobile) {
      return (
        <button
          key={item.id}
          onClick={() => handleMenuClick(item.id)}
          className={`flex items-center space-x-3 w-full px-4 py-3 rounded-xl transition-all ${
            isActive 
              ? 'bg-soft-blue dark:bg-primary-blue/20 text-primary-blue dark:text-soft-blue-border font-bold' 
              : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-navy dark:hover:text-gray-200'
          }`}
        >
          <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'fill-primary-blue/10 dark:fill-soft-blue-border/10 text-primary-blue' : ''}`} strokeWidth={isActive ? 2.5 : 2} />
          <span className="text-sm truncate">{item.label}</span>
        </button>
      );
    }
    
    return (
      <button
        key={item.id}
        onClick={() => handleMenuClick(item.id)}
        className={`flex flex-col xl:flex-row items-center xl:gap-4 w-full p-2 py-3 xl:px-5 xl:py-3 rounded-xl transition-all ${
          isActive 
            ? 'bg-soft-blue dark:bg-primary-blue/20 text-primary-blue dark:text-soft-blue-border font-bold' 
            : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-navy dark:hover:text-gray-200'
        }`}
      >
        <Icon className={`w-6 h-6 xl:w-5 xl:h-5 mx-auto xl:mx-0 shrink-0 transition-transform ${isActive ? 'fill-primary-blue/10 dark:fill-soft-blue-border/10 text-primary-blue scale-110' : 'group-hover:scale-110'}`} strokeWidth={isActive ? 2.5 : 2} />
        <span className="text-[10px] xl:text-sm mt-1 xl:mt-0 block truncate w-full text-center xl:text-left">{item.label}</span>
      </button>
    );
  };

  return (
    <>
      {/* Mobile Bottom Nav - Main Tab Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate border-t border-gray-100 dark:border-gray-800 pb-safe z-[60]">
        <div className="flex justify-around items-center h-16">
          {primaryItems.map((item) => {
            const Icon = item.icon;
            const isActive = view === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setView(item.id as any)}
                className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-all ${
                  isActive ? 'text-primary-blue' : 'text-gray-400 hover:text-gray-500'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'fill-primary-blue/20 text-primary-blue' : ''}`} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[10px] font-bold">{item.label}</span>
              </button>
            );
          })}
          <button
            onClick={() => setIsMobileOpen(true)}
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-all ${isMobileOpen ? 'text-primary-blue' : 'text-gray-400 hover:text-gray-500'}`}
          >
            <Menu className="w-5 h-5" strokeWidth={isMobileOpen ? 2.5 : 2} />
            <span className="text-[10px] font-bold">Menu</span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-[70] transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <div 
        className={`md:hidden fixed inset-y-0 left-0 w-[280px] bg-white dark:bg-slate z-[80] transform transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        } overflow-y-auto no-scrollbar pb-24 shadow-2xl flex flex-col`}
      >
        <div className="p-5 sticky top-0 bg-white/90 dark:bg-slate/90 backdrop-blur-md z-10 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
          <h1 className="text-xl font-bold tracking-tight text-navy dark:text-white flex items-center gap-2">
            <span className="bg-primary-blue text-white p-1.5 rounded-lg shadow-sm shadow-blue-500/30"><TerminalSquare className="w-4 h-4" /></span>
            LUMORA
          </h1>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setTheme(theme === 'light-modern' ? 'github-dark' : 'light-modern')} 
              className="p-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              {theme === 'light-modern' ? <Moon className="w-5 h-5 text-gray-500" /> : <Sun className="w-5 h-5 text-gray-400" />}
            </button>
            <button onClick={() => setIsMobileOpen(false)} className="p-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors">
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        </div>
        
        <div className="flex-1 px-4 py-4 space-y-6">
          <div>
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-1">Main</div>
            <div className="space-y-1">
              {primaryItems.map(item => renderMenuItem(item, true))}
            </div>
          </div>
          
          <div>
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-1">Explore</div>
            <div className="space-y-1">
              {secondaryItems.map(item => renderMenuItem(item, true))}
            </div>
          </div>
          
          <div>
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-1">My Learning</div>
            <div className="space-y-1">
              {personalItems.map(item => renderMenuItem(item, true))}
            </div>
          </div>
        </div>

        <div className="mt-auto px-4 pb-6 pt-4 border-t border-gray-100 dark:border-gray-800 space-y-1 bg-gray-50/50 dark:bg-slate/50">
          {renderMenuItem({ id: 'profile', icon: User, label: t('nav.profile_settings') }, true)}
          {isAuthenticated && (
            <button
              onClick={() => {
                logout();
                setIsMobileOpen(false);
              }}
              className="flex items-center space-x-3 w-full px-4 py-3 rounded-xl transition-all text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 font-bold"
            >
              <LogOut className="w-5 h-5 shrink-0" strokeWidth={2} />
              <span className="text-sm">{t('nav.logout')}</span>
            </button>
          )}
        </div>
      </div>

      {/* Desktop/Tablet Sidebar */}
      <div className="hidden md:flex flex-col fixed top-0 left-0 bottom-0 w-24 xl:w-64 bg-white dark:bg-slate border-r border-gray-100 dark:border-gray-800 z-50 overflow-y-auto no-scrollbar pb-6 shadow-[4px_0_24px_rgba(0,0,0,0.02)] dark:shadow-none">
        <div className="p-4 xl:p-6 sticky top-0 bg-white/90 dark:bg-slate/90 backdrop-blur-md z-10 border-b border-gray-100 dark:border-gray-800 flex justify-center xl:justify-start">
          <h1 className="text-2xl font-bold tracking-tight text-navy dark:text-white flex items-center gap-2">
            <span className="bg-primary-blue text-white p-2 xl:p-1.5 rounded-xl xl:rounded-lg shrink-0 shadow-sm shadow-blue-500/30">
              <TerminalSquare className="w-6 h-6 xl:hidden block" />
              <TerminalSquare className="w-5 h-5 hidden xl:block" />
            </span>
            <span className="hidden xl:block">LUMORA</span>
          </h1>
        </div>

        <div className="flex-1 flex flex-col pt-6 px-3 xl:px-4">
          <div className="text-[10px] xl:text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 text-center xl:text-left px-1 xl:px-4">Main</div>
          <div className="space-y-1 mb-6">
            {primaryItems.map(item => renderMenuItem(item))}
          </div>

          <div className="text-[10px] xl:text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 text-center xl:text-left px-1 xl:px-4">Explore</div>
          <div className="space-y-1 mb-6">
            {secondaryItems.map(item => renderMenuItem(item))}
          </div>

          <div className="text-[10px] xl:text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 text-center xl:text-left px-1 xl:px-4">My Learning</div>
          <div className="space-y-1 mb-6">
            {personalItems.map(item => renderMenuItem(item))}
          </div>

          <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-800 space-y-1">
            <button
              onClick={() => setTheme(theme === 'light-modern' ? 'github-dark' : 'light-modern')}
              className="flex flex-col xl:flex-row items-center xl:space-x-3 w-full p-2 py-3 xl:px-4 xl:py-3 rounded-xl transition-all text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-navy dark:hover:text-gray-200"
            >
              <div className="w-6 h-6 xl:w-5 xl:h-5 mx-auto xl:mx-0 shrink-0 flex items-center justify-center">
                {theme === 'light-modern' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </div>
              <span className="text-[10px] xl:text-sm mt-1 xl:mt-0 block truncate w-full text-center xl:text-left">
                {theme === 'light-modern' ? 'Dark Mode' : 'Light Mode'}
              </span>
            </button>
            {renderMenuItem({ id: 'profile', icon: User, label: t('nav.profile_settings') })}
            {isAuthenticated && (
              <button
                onClick={logout}
                className="flex flex-col xl:flex-row items-center xl:space-x-3 w-full p-2 py-3 xl:px-4 xl:py-2.5 rounded-xl transition-all text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 font-bold"
              >
                <LogOut className="w-6 h-6 xl:w-5 xl:h-5 mx-auto xl:mx-0 shrink-0" strokeWidth={2} />
                <span className="text-[10px] xl:text-sm mt-1 xl:mt-0 block truncate w-full text-center xl:text-left">{t('nav.logout')}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

