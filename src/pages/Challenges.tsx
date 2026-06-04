import React from 'react';
import { TerminalSquare, Zap, Play } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';

export default function Challenges() {
  const { setView, t } = useAppContext();
  
  const chs = [
    { title: 'Buat Tombol Login', diff: 'Easy', xp: 50, desc: 'Bikin tombol biru yang ada tulisan "Login Akun".' },
    { title: 'Bikin Profil Instagram', diff: 'Medium', xp: 150, desc: 'Gunakan HTML & CSS buat tiru desain profil foto bundar.' },
    { title: 'Animasi Loading Merah', diff: 'Hard', xp: 300, desc: 'Bikin kotak kecil yang berputar-putar tanpa henti pakai CSS.' }
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto pb-24">
      <div className="flex bg-gradient-to-br from-violet-500 to-fuchsia-600 rounded-3xl p-8 text-white items-center justify-between mb-8 shadow-lg shadow-violet-500/20">
        <div>
          <h1 className="text-3xl font-bold mb-2">{t('challenges.title')}</h1>
          <p className="text-violet-100 opacity-90 max-w-md">{t('ui_29')}</p>
        </div>
        <TerminalSquare className="w-20 h-20 text-white/20 hidden md:block" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {chs.map((c, i) => (
          <div key={i} className="bg-white dark:bg-slate border border-gray-100 dark:border-gray-800 rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all flex flex-col group">
            <div className="flex justify-between items-center mb-4">
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                c.diff === 'Easy' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20' : 
                c.diff === 'Medium' ? 'bg-orange-100 text-orange-600 dark:bg-orange-500/20' : 
                'bg-red-100 text-red-600 dark:bg-red-500/20'
              }`}>{c.diff}</span>
              <span className="flex items-center gap-1 text-xs font-bold text-yellow-500 bg-yellow-50 dark:bg-yellow-500/10 px-2 py-1 rounded-lg">
                <Zap className="w-3.5 h-3.5" /> {c.xp} XP
              </span>
            </div>
            <h3 className="font-bold text-navy dark:text-white text-lg mb-2">{c.title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 flex-1 line-clamp-3">
              {c.desc}
            </p>
            <button 
              onClick={() => setView('practice')}
              className="w-full py-3 flex items-center justify-center gap-2 bg-gray-50 dark:bg-gray-800 text-navy dark:text-white font-bold rounded-xl group-hover:bg-primary-blue group-hover:text-white transition-colors"
            >
              <Play className="w-4 h-4" />
              {t('ui_30')}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
