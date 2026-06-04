import React, { useMemo, useState } from 'react';
import { Award, Share2, Lock, X, Search, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppContext } from '../contexts/AppContext';

import { ACHIEVEMENTS } from '../data/achievements';

type FilterType = 'all' | 'unlocked' | 'locked';

export default function Achievements() {
  const { progress, t } = useAppContext();
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'default' | 'rarity-desc' | 'rarity-asc'>('default');
  const [selectedBadge, setSelectedBadge] = useState<any | null>(null);
  
  const xp = progress.xp || 0;
  const level = progress.level || 1;

  const badges = useMemo(() => {
    return ACHIEVEMENTS.map(badge => {
      const unlocked = progress.achievements?.includes(badge.id) || badge.condition(progress);
      return { ...badge, unlocked };
    });
  }, [progress]);

  const unlockedCount = badges.filter(b => b.unlocked).length;

  const filteredBadges = useMemo(() => {
    let result = badges;

    // Filter by type
    if (filter === 'unlocked') result = result.filter(b => b.unlocked);
    if (filter === 'locked') result = result.filter(b => !b.unlocked);

    // Filter by search query
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter(b => b.title.toLowerCase().includes(q) || b.desc.toLowerCase().includes(q));
    }

    // Sort
    if (sortOrder !== 'default') {
      const rarityRank: Record<string, number> = { 'Legendary': 4, 'Epic': 3, 'Rare': 2, 'Common': 1 };
      result = [...result].sort((a, b) => {
        const rankA = rarityRank[a.rarity] || 0;
        const rankB = rarityRank[b.rarity] || 0;
        return sortOrder === 'rarity-desc' ? rankB - rankA : rankA - rankB;
      });
    }

    return result;
  }, [badges, filter, searchQuery, sortOrder]);

  const getRarityColors = (rarity: string) => {
    switch(rarity) {
      case 'Legendary': return 'border-orange-400 dark:border-orange-500/50 shadow-[0_0_15px_rgba(251,146,60,0.3)]';
      case 'Epic': return 'border-purple-400 dark:border-purple-500/50 shadow-[0_0_10px_rgba(168,85,247,0.2)]';
      case 'Rare': return 'border-blue-400 dark:border-blue-500/50';
      default: return 'border-gray-200 dark:border-gray-700/50';
    }
  };

  const handleShare = async () => {
    const title = `LUMORA - Level ${level}`;
    const text = `Saya telah mencapai Level ${level} dengan ${xp} XP di LUMORA! Yuk belajar coding bareng dari nol! 🚀`;

    // Dynamically update OG meta tags
    const updateMeta = (property: string, content: string) => {
      let meta = document.querySelector(`meta[property="${property}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('property', property);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    updateMeta('og:title', title);
    updateMeta('og:description', text);
    
    // Fallback share data
    const shareData = {
      title,
      text,
      url: window.location.href,
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch {
        console.log('User cancelled share');
      }
    } else {
      alert(`Text copied to clipboard:\n\n${text}`);
      navigator.clipboard.writeText(text);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto pb-24 relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center p-0.5 shadow-sm">
            <div className="bg-white dark:bg-slate w-full h-full rounded-[14px] flex items-center justify-center">
              <Award className="w-8 h-8 text-orange-500 drop-shadow-sm" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-navy dark:text-white">{t('achievements.title')}</h1>
            <p className="text-gray-500 dark:text-gray-400 font-medium">Total XP: {xp} <span className="mx-2 text-gray-300 dark:text-gray-700">•</span> Level {level}</p>
          </div>
        </div>
        <button 
          onClick={handleShare}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-50 dark:bg-blue-900/20 text-primary-blue font-bold rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
        >
          <Share2 className="w-4 h-4" />
          Bagikan Progress
        </button>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar flex-1">
          {(['all', 'unlocked', 'locked'] as FilterType[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full font-bold text-sm whitespace-nowrap transition-colors ${
                filter === f 
                  ? 'bg-navy dark:bg-primary-blue text-white shadow-sm' 
                  : 'bg-gray-100 dark:bg-slate border border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800'
              }`}
            >
              {f === 'all' && 'Semua Badge'}
              {f === 'unlocked' && `Terbuka (${unlockedCount})`}
              {f === 'locked' && `Terkunci (${badges.length - unlockedCount})`}
            </button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Cari badge..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 w-full rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate text-sm focus:outline-none focus:border-primary-blue dark:focus:border-primary-blue transition-colors text-navy dark:text-white sm:w-48"
            />
          </div>
          <div className="relative">
            <select
              value={sortOrder}
              onChange={e => setSortOrder(e.target.value as any)}
              className="appearance-none pl-4 pr-10 py-2 w-full rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate text-sm focus:outline-none focus:border-primary-blue transition-colors text-navy dark:text-white"
            >
              <option value="default">Urutan Default</option>
              <option value="rarity-desc">Rarity (Highest)</option>
              <option value="rarity-asc">Rarity (Lowest)</option>
            </select>
            <Filter className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {unlockedCount === 0 && filter !== 'locked' && (
        <div className="mb-8 p-6 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-2xl flex flex-col items-center text-center">
          <Award className="w-12 h-12 text-primary-blue mb-3 opacity-80" />
          <h3 className="font-bold text-navy dark:text-white mb-2">{t('ui_2')}</h3>
          <p className="text-sm text-gray-500">{t('ui_3')}</p>
        </div>
      )}
      
      <motion.div 
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        <AnimatePresence mode="popLayout">
          {filteredBadges.map(badge => {
            const Icon = badge.icon;
            return (
              <motion.div 
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                whileHover={badge.unlocked ? { scale: 1.02 } : { scale: 1 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => !badge.unlocked && setSelectedBadge(badge)}
                key={badge.id} 
                className={`p-4 rounded-xl border ${badge.unlocked ? `${getRarityColors(badge.rarity)} bg-white dark:bg-slate hover:shadow-md transition-shadow` : 'border-dashed border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-slate/30 opacity-70 cursor-pointer hover:bg-gray-100 dark:hover:bg-slate/50'} flex gap-4 items-start relative overflow-hidden`}
              >
                {badge.unlocked && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 0.5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-100/30 dark:via-amber-500/10 to-transparent -skew-x-12 translate-x-[-100%]"
                  />
                )}
                <div className={`p-3 rounded-xl ${badge.unlocked ? badge.bg : 'bg-gray-100 dark:bg-gray-800'}`}>
                  <Icon className={`w-6 h-6 ${badge.unlocked ? badge.color : 'text-gray-400'}`} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className={`font-bold text-sm ${badge.unlocked ? 'text-navy dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>{badge.title}</h3>
                    <span className={`text-[9px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded ${badge.unlocked ? 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400' : 'hidden'}`}>{badge.rarity}</span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{badge.desc}</p>
                  {!badge.unlocked ? (
                    <div className="mt-2 text-[10px] font-bold tracking-wider text-gray-400 uppercase flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      LOCKED (Tap for info)
                    </div>
                  ) : progress.achievementDates?.[badge.id] ? (
                    <div className="mt-2 text-[10px] font-medium text-gray-400">
                      Unlocked: {new Date(progress.achievementDates[badge.id]).toLocaleDateString()}
                    </div>
                  ) : null}
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </motion.div>

      {/* Modal for Locked Badges */}
      <AnimatePresence>
        {selectedBadge && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedBadge(null)}
            className="fixed inset-0 z-50 bg-navy/40 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-slate w-full max-w-sm rounded-[24px] shadow-2xl overflow-hidden relative"
            >
              <button 
                onClick={() => setSelectedBadge(null)}
                className="absolute top-4 right-4 w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-gray-500 hover:text-navy dark:hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="p-8 text-center flex flex-col items-center">
                <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mb-5 relative">
                  <Lock className="w-8 h-8 text-gray-400 absolute top-2 right-2 opacity-20" />
                  {selectedBadge.icon && <selectedBadge.icon className="w-10 h-10 text-gray-400" />}
                </div>
                
                <h3 className="text-xl font-bold text-navy dark:text-white mb-2">{selectedBadge.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">Misi yang harus diselesaikan:</p>
                
                <div className="w-full bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-900/30 text-primary-blue font-medium mb-6">
                  {selectedBadge.desc}
                </div>

                {(() => {
                  const prog = selectedBadge.getProgress(progress);
                  const percent = Math.min(100, Math.round((prog.current / prog.target) * 100));
                  return (
                    <>
                      <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden mb-3 relative">
                        <div className="h-full bg-primary-blue rounded-full transition-all duration-500" style={{ width: `${percent}%` }}></div>
                      </div>
                      <p className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-6">Progress: {prog.current} / {prog.target} {prog.label}</p>
                    </>
                  );
                })()}

                <button 
                  onClick={() => setSelectedBadge(null)}
                  className="w-full py-3 bg-navy dark:bg-white text-white dark:text-navy font-bold rounded-xl"
                >
                  Tutup Info
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
