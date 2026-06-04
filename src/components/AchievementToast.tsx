import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Award, X } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';
import { ACHIEVEMENTS } from '../data/achievements';

const playPing = () => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
    
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.5);
  } catch {
    // Ignore audio errors
  }
};

export default function AchievementToast() {
  const { recentAchievement, setRecentAchievement } = useAppContext();

  const badge = recentAchievement ? ACHIEVEMENTS.find(a => a.id === recentAchievement) : null;

  useEffect(() => {
    if (badge) {
      playPing();
    }
  }, [badge]);

  return (
    <AnimatePresence>
      {badge && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-sm pointer-events-auto"
        >
          <div className="bg-white dark:bg-slate border-2 border-amber-400/50 dark:border-amber-500/50 p-4 rounded-2xl shadow-2xl flex items-start gap-4 relative overflow-hidden">
            {/* Shimmer effect */}
            <motion.div 
              initial={{ opacity: 0, x: '-100%' }}
              animate={{ opacity: [0, 0.5, 0], x: '100%' }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 dark:via-white/10 to-transparent -skew-x-12"
            />
            
            <button 
              onClick={() => setRecentAchievement(null)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <X className="w-4 h-4" />
            </button>

            <div className={`p-3 rounded-xl shrink-0 ${badge.bg}`}>
              <badge.icon className={`w-6 h-6 ${badge.color}`} />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <Award className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-[10px] uppercase tracking-wider font-bold text-amber-500">Pencapaian Baru!</span>
              </div>
              <h4 className="font-bold text-navy dark:text-white text-sm">{badge.title}</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-snug">{badge.desc}</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
