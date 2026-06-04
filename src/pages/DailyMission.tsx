import React, { useState } from 'react';
import { Target, CheckCircle2, Gift } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';

export default function DailyMission() {
  const { t, progress, addXp } = useAppContext();
  
  // Real progress state
  const missionProgress = {
    lessons: Math.min(1, progress.completedLessons?.length || 0),
    quizzes: 0,
    practice: Math.min(15, (progress.completedChallenges?.length || 0) * 5),
  };

  const [claimed, setClaimed] = useState<number[]>([]);
  const [showRewardAnim, setShowRewardAnim] = useState<{show: boolean, amount: number}>({ show: false, amount: 0 });

  const missions = [
    { id: 1, title: 'Selesaikan 1 Materi', target: 1, progress: missionProgress.lessons, icon: Target, reward: 20 },
    { id: 2, title: 'Jawab 3 Kuis dengan Benar', target: 3, progress: missionProgress.quizzes, icon: CheckCircle2, reward: 30 },
    { id: 3, title: 'Praktik Coding 15 Menit', target: 15, progress: missionProgress.practice, icon: Target, reward: 50 },
  ];

  const handleClaim = (id: number, reward: number) => {
    if (claimed.includes(id)) return;
    
    // Process claim
    setClaimed(prev => [...prev, id]);
    addXp(reward);
    
    // Show animation
    setShowRewardAnim({ show: true, amount: reward });
    setTimeout(() => {
      setShowRewardAnim({ show: false, amount: 0 });
    }, 1500);
  };

  const allCompleted = missions.every(m => m.progress >= m.target);

  return (
    <div className="p-6 max-w-3xl mx-auto pb-24 relative">
      {/* Reward Animation Overlay */}
      {showRewardAnim.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="animate-bounce bg-yellow-500 text-white font-black text-4xl px-8 py-4 rounded-full shadow-[0_0_40px_rgba(234,179,8,0.5)] transform transition-all duration-300 scale-110 flex items-center gap-2">
            <Gift className="w-8 h-8" />
            +{showRewardAnim.amount} XP
          </div>
        </div>
      )}

      {/* All Missions Completed Banner */}
      {allCompleted && (
        <div className="mb-6 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-2xl p-6 text-white flex flex-col items-center justify-center text-center shadow-lg shadow-emerald-500/30 transform transition-all animate-in fade-in slide-in-from-top-4">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-2">{t('ui_25')}</h2>
          <p className="text-emerald-50">{t('ui_26')}</p>
        </div>
      )}

      <div className="flex bg-gradient-to-r from-blue-500 to-indigo-600 rounded-3xl p-8 text-white items-center justify-between mb-8 shadow-lg shadow-blue-500/20">
        <div>
          <h1 className="text-3xl font-bold mb-2">{t('daily_mission.title')}</h1>
          <p className="text-blue-100 opacity-90 max-w-md">{t('ui_27')}</p>
        </div>
        <Gift className="w-20 h-20 text-white/20 hidden md:block" />
      </div>

      <div className="space-y-4">
        {missions.map(mission => {
          const isCompleted = mission.progress >= mission.target;
          const isClaimed = claimed.includes(mission.id);
          return (
            <div key={mission.id} className="bg-white dark:bg-slate border border-gray-100 dark:border-gray-800 rounded-2xl p-5 shadow-sm flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2 rounded-lg ${isCompleted ? 'bg-emerald-500/10 text-emerald-500' : 'bg-blue-50 dark:bg-blue-900/20 text-primary-blue'}`}>
                    <mission.icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-navy dark:text-white text-lg">{mission.title}</h3>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex-1 bg-gray-100 dark:bg-gray-800 h-3 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${isCompleted ? 'bg-emerald-500' : 'bg-primary-blue'}`}
                      style={{ width: `${Math.min(100, (mission.progress / mission.target) * 100)}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold text-gray-500 dark:text-gray-400 min-w-[50px] text-right">
                    {mission.progress} / {mission.target}
                  </span>
                </div>
              </div>
              
              <div className="ml-6 flex flex-col items-center">
                <span className="text-xl font-bold text-yellow-500 mb-2">+{mission.reward} XP</span>
                <button 
                  onClick={() => handleClaim(mission.id, mission.reward)}
                  disabled={!isCompleted || isClaimed}
                  className={`px-5 py-2 rounded-xl font-bold text-sm transition-all ${
                    isClaimed
                      ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                      : isCompleted 
                        ? 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-md shadow-emerald-500/20' 
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {isClaimed ? 'Diklaim' : 'Klaim'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
