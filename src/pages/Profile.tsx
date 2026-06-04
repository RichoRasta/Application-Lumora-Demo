import React, { useState } from "react";
import { User, LogOut, Settings, Shield, Bell, Palette, Globe, Lock, ChevronRight } from "lucide-react";
import { useAppContext } from "../contexts/AppContext";

export default function Profile() {
  const {
    t,
    theme,
    setTheme,
    language,
    setLanguage,
    logout,
    progress,
    user,
  } = useAppContext();

  const [activeSection, setActiveSection] = useState<string | null>('Appearance');

  const settingsMenu = [
    { id: 'Account', icon: Settings, label: t('profile.account'), desc: t('profile.account_desc') },
    { id: 'Security', icon: Shield, label: t('profile.security'), desc: t('profile.security_desc') },
    { id: 'Notification', icon: Bell, label: t('profile.notification'), desc: t('profile.notification_desc') },
    { id: 'Appearance', icon: Palette, label: t('profile.appearance'), desc: t('profile.appearance_desc') },
    { id: 'Language', icon: Globe, label: t('profile.app_language'), desc: t('profile.language_desc') },
    { id: 'Privacy', icon: Lock, label: t('profile.privacy'), desc: t('profile.privacy_desc') },
  ];

  return (
    <div className="pb-24 lg:pb-8 pt-6 px-4 md:px-6 max-w-5xl mx-auto w-full focus:outline-none">
      <h1 className="text-2xl font-bold text-navy dark:text-white mb-6">
        {t("profile.title")}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Profile Card & Menu */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-gradient-to-br from-primary-blue to-indigo-600 rounded-3xl p-6 text-white shadow-lg shadow-blue-500/20">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center shrink-0 overflow-hidden backdrop-blur-sm border border-white/30">
                {user?.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <User className="w-8 h-8 text-white" />
                )}
              </div>
              <div>
                <h2 className="text-xl font-bold">
                  {user ? user.displayName || "Developer" : "Pelajar Pemula"}
                </h2>
                <p className="text-blue-100 text-sm">
                  {user ? user.email : "Guest Mode"}
                </p>
              </div>
            </div>
            
            <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm border border-white/10 mb-4">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold text-blue-200">Level {progress.level || 1}</span>
                <span className="text-xs font-bold">{progress.xp || 0} / {(progress.level || 1) * 500} XP</span>
              </div>
              <div className="w-full bg-black/20 h-2 rounded-full overflow-hidden">
                <div className="bg-white h-full rounded-full shadow-sm transition-all" style={{ width: `${Math.min(100, ((progress.xp || 0) / ((progress.level || 1) * 500)) * 100)}%` }}></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="bg-white/10 rounded-2xl p-3 backdrop-blur-sm border border-white/5">
                <span className="block text-2xl font-bold leading-tight">{progress.streak}</span>
                <span className="text-[10px] font-medium text-blue-200 uppercase tracking-wider block mt-1">Hari Streak</span>
              </div>
              <div className="bg-white/10 rounded-2xl p-3 backdrop-blur-sm border border-white/5">
                <span className="block text-2xl font-bold leading-tight">{progress.completedLessons?.length || 0}</span>
                <span className="text-[10px] font-medium text-blue-200 uppercase tracking-wider block mt-1">Materi<br/>Selesai</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate border border-gray-100 dark:border-gray-800 rounded-3xl p-3 shadow-sm flex flex-col gap-1">
            {settingsMenu.map(menu => (
              <button 
                key={menu.id}
                onClick={() => setActiveSection(menu.id)}
                className={`flex items-center gap-3 p-3 rounded-2xl transition-all text-left ${activeSection === menu.id ? 'bg-blue-50 dark:bg-primary-blue/10 text-primary-blue' : 'hover:bg-gray-50 dark:hover:bg-gray-800/50 text-gray-600 dark:text-gray-300'}`}
              >
                <div className={`p-2 rounded-xl ${activeSection === menu.id ? 'bg-primary-blue text-white shadow-sm shadow-blue-500/20' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'}`}>
                  <menu.icon className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <h4 className={`font-bold text-sm ${activeSection === menu.id ? 'text-primary-blue dark:text-soft-blue-border' : 'text-navy dark:text-white'}`}>{menu.label}</h4>
                </div>
                {activeSection === menu.id && <ChevronRight className="w-4 h-4" />}
              </button>
            ))}
            
            <div className="h-px bg-gray-100 dark:bg-gray-800 my-2 mx-3"></div>
            
            <button
              onClick={logout}
              className="flex items-center gap-3 p-3 rounded-2xl transition-all text-left hover:bg-red-50 dark:hover:bg-red-900/10 text-red-500"
            >
              <div className="p-2 rounded-xl bg-red-100 dark:bg-red-900/30 text-red-500">
                <LogOut className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-sm">{user ? "Keluar Akun" : "Keluar (Guest Mode)"}</h4>
              </div>
            </button>
          </div>
        </div>

        {/* Right Column: Active Setting Panel */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          <div className="bg-white dark:bg-slate border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-sm min-h-[400px]">
            {activeSection === 'Appearance' && (
              <div className="animate-in fade-in slide-in-from-bottom-2">
                <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100 dark:border-gray-800">
                  <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-500 rounded-xl">
                    <Palette className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-navy dark:text-white">Appearance & Themes</h3>
                    <p className="text-sm text-gray-500">Sesuaikan tampilan editor dan aplikasi sesuai seleramu.</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {[
                      { id: 'light-modern', label: 'Light Modern', icon: '☀️', bg: '#F8FAFC', card: '#FFFFFF', accent: '#2563EB', desc: 'Notion inspired' },
                      { id: 'github-dark', label: 'GitHub Dark', icon: '🐈‍⬛', bg: '#0D1117', card: '#1C2128', accent: '#2F81F7', desc: 'Clean coding gray' },
                      { id: 'dracula', label: 'Dracula', icon: '🦇', bg: '#282A36', card: '#44475A', accent: '#BD93F9', desc: 'Purple neon hacker' },
                      { id: 'nord', label: 'Nord', icon: '❄️', bg: '#2E3440', card: '#3B4252', accent: '#88C0D0', desc: 'Cool nordic calm' },
                      { id: 'solarized-dark', label: 'Solarized Dark', icon: '🌅', bg: '#002B36', card: '#073642', accent: '#B58900', desc: 'Warm terminal retro' },
                      { id: 'cyberpunk', label: 'Cyberpunk', icon: '🤖', bg: '#0F0F1A', card: '#1D1D35', accent: '#00FFFF', desc: 'Futuristic neon state' },
                      { id: 'matrix', label: 'The Matrix', icon: '💻', bg: '#050505', card: '#111111', accent: '#00FF88', desc: 'Classic green terminal' },
                      { id: 'ocean-blue', label: 'Ocean Blue', icon: '🌊', bg: '#0F172A', card: '#1E293B', accent: '#38BDF8', desc: 'Deep modern splash' },
                    ].map((th) => (
                      <button
                        key={th.id}
                        onClick={() => setTheme(th.id as any)}
                        className={`flex items-start gap-4 p-4 rounded-2xl border text-left transition-all duration-300 ${theme === th.id ? 'border-primary-blue bg-blue-50/50 dark:bg-primary-blue/10 ring-1 ring-primary-blue shadow-md' : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-slate/50 hover:border-gray-300 dark:hover:border-gray-700'}`}
                      >
                        <div 
                          className="w-12 h-12 rounded-xl border border-gray-200 dark:border-gray-700 shrink-0 flex items-center justify-center text-xl shadow-inner relative overflow-hidden"
                          style={{ backgroundColor: th.bg }}
                        >
                          <div className="absolute inset-x-2 bottom-2 h-4 rounded opacity-50" style={{ backgroundColor: th.card }}></div>
                          <div className="absolute top-2 left-2 w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: th.accent }}></div>
                          <span className="relative z-10 drop-shadow-md text-2xl">{th.icon}</span>
                        </div>
                        <div className="flex-1">
                          <h4 className={`font-bold text-sm ${theme === th.id ? 'text-primary-blue dark:text-soft-blue-border' : 'text-navy dark:text-white'}`}>{th.label}</h4>
                          <p className="text-xs text-gray-500 mt-0.5">{th.desc}</p>
                        </div>
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${theme === th.id ? 'border-primary-blue bg-primary-blue text-white' : 'border-gray-300 dark:border-gray-600'}`}>
                          {theme === th.id && <div className="w-2 h-2 bg-white rounded-full"></div>}
                        </div>
                      </button>
                    ))}

                  </div>
                </div>
              </div>
            )}

            {activeSection === 'Language' && (
              <div className="animate-in fade-in slide-in-from-bottom-2">
                <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100 dark:border-gray-800">
                  <div className="p-3 bg-cyan-50 dark:bg-cyan-900/20 text-cyan-500 rounded-xl">
                    <Globe className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-navy dark:text-white">{t('profile.app_language')}</h3>
                    <p className="text-sm text-gray-500">{t('profile.language_desc')}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <button 
                    onClick={() => setLanguage("id")}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${language === 'id' ? 'border-primary-blue bg-blue-50 dark:bg-primary-blue/10 ring-1 ring-primary-blue' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-slate'}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🇮🇩</span>
                      <div className="text-left">
                        <h4 className={`font-bold ${language === 'id' ? 'text-primary-blue dark:text-soft-blue-border' : 'text-navy dark:text-white'}`}>{t('profile.lang.id')}</h4>
                        <p className="text-xs text-gray-500">{t('profile.lang.id_desc')}</p>
                      </div>
                    </div>
                    {language === 'id' && <div className="w-5 h-5 bg-primary-blue rounded-full flex items-center justify-center"><div className="w-2 h-2 bg-white rounded-full"></div></div>}
                  </button>
                  
                  <button 
                    onClick={() => setLanguage("en")}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${language === 'en' ? 'border-primary-blue bg-blue-50 dark:bg-primary-blue/10 ring-1 ring-primary-blue' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-slate'}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🇺🇸</span>
                      <div className="text-left">
                        <h4 className={`font-bold ${language === 'en' ? 'text-primary-blue dark:text-soft-blue-border' : 'text-navy dark:text-white'}`}>{t('profile.lang.en')}</h4>
                        <p className="text-xs text-gray-500">{t('profile.lang.en_desc')}</p>
                      </div>
                    </div>
                    {language === 'en' && <div className="w-5 h-5 bg-primary-blue rounded-full flex items-center justify-center"><div className="w-2 h-2 bg-white rounded-full"></div></div>}
                  </button>
                </div>
              </div>
            )}

            {activeSection === 'Notification' && (
              <div className="animate-in fade-in slide-in-from-bottom-2">
                <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100 dark:border-gray-800">
                  <div className="p-3 bg-orange-50 dark:bg-orange-900/20 text-orange-500 rounded-xl">
                    <Bell className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-navy dark:text-white">Notification</h3>
                    <p className="text-sm text-gray-500">Atur pengingat belajarmu.</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {['Daily Reminder Belajar', 'Notifikasi Streak Hampir Putus', 'Pengumuman Challenge Baru'].map((n) => (
                    <div key={n} className="flex items-center justify-between">
                      <h4 className="font-bold text-navy dark:text-white">{n}</h4>
                      <button className="w-12 h-6 rounded-full bg-primary-blue relative flex items-center shadow-inner">
                        <div className="w-4 h-4 bg-white rounded-full absolute translate-x-7 shadow-sm" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {['Account', 'Security', 'Privacy', 'Connected', 'Learning'].includes(activeSection as string) && (
              <div className="flex flex-col items-center justify-center h-full text-center py-12 animate-in fade-in opacity-50">
                <Settings className="w-16 h-16 text-gray-300 mb-4" />
                <h3 className="font-bold text-navy dark:text-white text-lg">Work in Progress</h3>
                <p className="text-gray-500 text-sm max-w-xs mt-2">Halaman pengaturan ini sedang disiapkan dan akan segera tersedia pada update berikutnya.</p>
              </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
}
