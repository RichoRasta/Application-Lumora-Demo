import React, { useState } from 'react';
import { Trophy, TrendingUp, Medal, Crown } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';

export default function Leaderboard() {
  const { progress, user } = useAppContext();
  const userXp = progress.xp || 0;
  const userStreak = progress.streak || 0;
  const userName = user?.displayName || 'Kamu (Guest)';

  const [timeframe, setTimeframe] = useState<'weekly' | 'monthly' | 'alltime'>('weekly');

  const baseUsers = [
    { name: 'Budi Santoso', xp: 2450, streak: 14 },
    { name: 'Siti Aminah', xp: 2200, streak: 12 },
    { name: 'Reza Rahardian', xp: 1700, streak: 7 },
    { name: 'Dian Sastro', xp: 1650, streak: 3 },
  ];

  // Dummy adjustment for timeframe
  const multiplier = timeframe === 'weekly' ? 1 : timeframe === 'monthly' ? 4 : 10;
  
  const allUsers = baseUsers.map(u => ({
    ...u,
    xp: u.xp * multiplier,
    isCurrentUser: false,
  }));

  allUsers.push({
    name: userName,
    xp: userXp, // userXp is actual, but for a prototype we just use their lifetime XP
    streak: userStreak,
    isCurrentUser: true,
  });

  allUsers.sort((a, b) => b.xp - a.xp);

  const rankedUsers = allUsers.map((u, index) => ({
    ...u,
    rank: index + 1
  }));

  return (
    <div className="p-6 max-w-3xl mx-auto pb-24">
      <div className="text-center mb-10">
        <div className="inline-block p-4 bg-yellow-50 dark:bg-yellow-500/10 rounded-full mb-4 shadow-sm">
          <Trophy className="w-12 h-12 text-yellow-500" />
        </div>
        <h1 className="text-3xl font-bold text-navy dark:text-white mb-2">Leaderboard</h1>
        <p className="text-gray-500 dark:text-gray-400">Peringkat XP. Terus belajar dan naik ke panggung utama!</p>
      </div>

      <div className="mb-6 flex gap-3 overflow-x-auto pb-2 no-scrollbar justify-center">
        <button 
          onClick={() => setTimeframe('weekly')}
          className={`px-5 py-2.5 font-bold rounded-full whitespace-nowrap shadow-sm transition-colors ${timeframe === 'weekly' ? 'bg-navy dark:bg-primary-blue text-white' : 'bg-gray-100 dark:bg-slate border border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800'}`}
        >
          Mingguan
        </button>
        <button 
          onClick={() => setTimeframe('monthly')}
          className={`px-5 py-2.5 font-bold rounded-full whitespace-nowrap shadow-sm transition-colors ${timeframe === 'monthly' ? 'bg-navy dark:bg-primary-blue text-white' : 'bg-gray-100 dark:bg-slate border border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800'}`}
        >
          Bulanan
        </button>
        <button 
          onClick={() => setTimeframe('alltime')}
          className={`px-5 py-2.5 font-bold rounded-full whitespace-nowrap shadow-sm transition-colors ${timeframe === 'alltime' ? 'bg-navy dark:bg-primary-blue text-white' : 'bg-gray-100 dark:bg-slate border border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800'}`}
        >
          All Time
        </button>
      </div>

      <div className="bg-white dark:bg-slate rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="p-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-slate/50 grid grid-cols-12 gap-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">
          <div className="col-span-2">Rank</div>
          <div className="col-span-6 text-left">Nama Learner</div>
          <div className="col-span-4 flex justify-around">
            <span>XP</span>
            <span>Streak</span>
          </div>
        </div>
        
        <div className="divide-y divide-gray-50 dark:divide-gray-800/50">
          {rankedUsers.map((u) => (
            <div key={`${u.rank}-${u.name}`} className={`p-4 grid grid-cols-12 gap-4 items-center transition-colors ${u.isCurrentUser ? 'bg-blue-50/50 dark:bg-primary-blue/10' : 'hover:bg-gray-50 dark:hover:bg-gray-800/20'}`}>
              <div className="col-span-2 flex justify-center">
                {u.rank === 1 ? <Crown className="w-6 h-6 text-yellow-500" /> : 
                 u.rank === 2 ? <Medal className="w-6 h-6 text-gray-400" /> :
                 u.rank === 3 ? <Medal className="w-6 h-6 text-amber-700" /> : 
                 <span className="font-bold text-gray-400">{u.rank}</span>}
              </div>
              <div className="col-span-6 flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-sm ${u.isCurrentUser ? 'bg-primary-blue' : 'bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-700 dark:to-gray-600'}`}>
                  {u.name.charAt(0).toUpperCase()}
                </div>
                <span className={`font-bold ${u.isCurrentUser ? 'text-primary-blue dark:text-soft-blue-border' : 'text-navy dark:text-white'}`}>
                  {u.name}
                </span>
              </div>
              <div className="col-span-4 flex justify-around items-center">
                <span className="font-bold text-emerald-500 dark:text-emerald-400">{u.xp}</span>
                <div className="flex items-center gap-1 text-orange-500">
                  <TrendingUp className="w-4 h-4" />
                  <span className="font-bold">{u.streak}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
