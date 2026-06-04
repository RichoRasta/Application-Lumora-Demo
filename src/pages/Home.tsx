import React, { useState, useEffect } from 'react';
import { Flame, PlaySquare, BrainCircuit, Monitor, Laptop, Blocks, LayoutTemplate, Zap, MousePointerClick, GitBranch, Globe, Paintbrush, Briefcase, CheckCircle2, ChevronDown, Target, Star, Calendar, Award, Pencil } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';
import { lessons } from '../data/lessons';
import { motion, AnimatePresence } from 'motion/react';

export default function Home() {
  const { t, progress, setView, setActiveLessonId, setDailyGoal } = useAppContext();
  const [expandedLevel, setExpandedLevel] = useState<number | null>(
    (lessons.find(l => !progress.completedLessons.includes(l.id)) || lessons[0]).level
  );
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [goalInput, setGoalInput] = useState(progress.dailyGoal?.toString() || '30');

  useEffect(() => {
    if (sessionStorage.getItem('showConfetti') === 'true') {
      import('canvas-confetti').then((confetti) => {
        confetti.default({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#2563EB', '#7C3AED', '#10B981', '#F59E0B']
        });
      });
      sessionStorage.removeItem('showConfetti');
    }
  }, []);

  const handleLessonStart = (id: string) => {
    setActiveLessonId(id);
    setView('lesson');
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('home.greeting.morning');
    if (hour < 18) return t('home.greeting.afternoon');
    return t('home.greeting.evening');
  };

  const lastActiveLesson = progress.lastActiveLessonId ? lessons.find(l => l.id === progress.lastActiveLessonId) : null;
  const nextUpLesson = lessons.find(l => !progress.completedLessons.includes(l.id)) || lessons[0];
  const continueLesson = lastActiveLesson || nextUpLesson;

  const roadmapLevels = [
    { level: 0, title: 'Mindset Digital', desc: 'Pahami cara kerja internet dan komputer.', est: '10 Menit', icon: BrainCircuit, color: 'bg-violet-100 dark:bg-violet-500/20 text-violet-600 dark:text-violet-400' },
    { level: 1, title: 'Dasar Komputer', desc: 'Mengenal file, folder, dan instalasi.', est: '15 Menit', icon: Monitor, color: 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' },
    { level: 2, title: 'HTML Basic', desc: 'Membangun kerangka utama website.', est: '30 Menit', icon: Laptop, color: 'bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400' },
    { level: 3, title: 'CSS Basic', desc: 'Mewarnai dan mempercantik tampilan.', est: '45 Menit', icon: Blocks, color: 'bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400' },
    { level: 4, title: 'CSS Layout', desc: 'Mengatur letak dan posisi elemen web.', est: '60 Menit', icon: LayoutTemplate, color: 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400' },
    { level: 5, title: 'Javascript Basic', desc: 'Membuat website menjadi interaktif.', est: '60 Menit', icon: Zap, color: 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400' },
    { level: 6, title: 'JS Interaction', desc: 'Manipulasi elemen dan event website.', est: '60 Menit', icon: MousePointerClick, color: 'bg-pink-100 dark:bg-pink-500/20 text-pink-600 dark:text-pink-400' },
    { level: 7, title: 'Git & GitHub', desc: 'Menyimpan dan mengelola versi kode.', est: '45 Menit', icon: GitBranch, color: 'bg-stone-200 dark:bg-stone-500/20 text-stone-700 dark:text-stone-300' },
    { level: 8, title: 'Deployment', desc: 'Mempublikasikan website ke internet.', est: '30 Menit', icon: Globe, color: 'bg-cyan-100 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400' },
    { level: 9, title: 'UI/UX Dasar', desc: 'Prinsip desain untuk programmer pemula.', est: '30 Menit', icon: Paintbrush, color: 'bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400' },
    { level: 10, title: 'Mini Projects', desc: 'Tantangan membuat project nyata.', est: '120 Menit', icon: PlaySquare, color: 'bg-teal-100 dark:bg-teal-500/20 text-teal-600 dark:text-teal-400' },
    { level: 11, title: 'Career Roadmap', desc: 'Panduan karir dan profesi IT.', est: '20 Menit', icon: Briefcase, color: 'bg-fuchsia-100 dark:bg-fuchsia-500/20 text-fuchsia-600 dark:text-fuchsia-400' },
  ];

  return (
    <div className="pb-24 lg:pb-8 pt-6 px-4 md:px-6 max-w-5xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0 mb-8 w-full">
        <div>
          <h2 className="text-gray-500 dark:text-gray-400 font-medium text-sm">{getGreeting()}</h2>
          <h1 className="text-2xl font-bold text-navy dark:text-white line-clamp-1">{t('home.coder_beginner')} 👋</h1>
        </div>
        
        {/* Scrollable container for mobile to prevent wrapping, or flex-wrap for small screens */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <motion.div 
            className="flex flex-1 sm:flex-none items-center justify-center bg-blue-50 dark:bg-blue-500/10 text-primary-blue px-3 py-1.5 rounded-xl sm:rounded-full font-bold text-sm border border-blue-100 dark:border-blue-500/20"
          >
            <Star className="w-4 h-4 mr-1.5 fill-primary-blue text-primary-blue shrink-0" />
            <span className="whitespace-nowrap">{progress.xp || 0} XP</span>
          </motion.div>
          
          <motion.div 
            className="flex flex-1 sm:flex-none items-center justify-center bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 px-3 py-1.5 rounded-xl sm:rounded-full font-bold text-sm border border-purple-100 dark:border-purple-500/20 shadow-sm"
          >
            <Award className="w-4 h-4 mr-1.5 fill-purple-600 dark:fill-purple-400 shrink-0" />
            <span className="whitespace-nowrap">Level {progress.level || 1}</span>
          </motion.div>

          <motion.div 
            initial={{ scale: 1 }}
            animate={progress.streak > 0 ? { scale: [1, 1.1, 1] } : { scale: 1 }}
            transition={{ duration: 1, repeat: 2, repeatDelay: 3 }}
            className="flex flex-1 sm:flex-none items-center justify-center bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 px-3 py-1.5 rounded-xl sm:rounded-full font-bold text-sm border border-orange-100 dark:border-orange-500/20 shadow-sm"
          >
            <Flame className="w-4 h-4 mr-1.5 fill-orange-600 dark:fill-orange-400 shrink-0" />
            <span className="whitespace-nowrap">{progress.streak || 0} Hari</span>
          </motion.div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-8">
        {/* Continue Learning Widget (Spans 8 cols on desktop) */}
        <div className="col-span-1 md:col-span-8 group">
          <div className="mb-2 flex items-center justify-between text-sm font-bold tracking-wide text-gray-500 uppercase">
             Lanjutkan Belajar
          </div>
          <div 
            onClick={() => handleLessonStart(continueLesson.id)}
            className="bg-navy dark:bg-primary-blue/10 text-white dark:text-white rounded-3xl p-6 h-[160px] cursor-pointer shadow-lg shadow-navy/20 dark:shadow-primary-blue/5 hover:scale-[1.01] hover:shadow-xl transition-all flex flex-col justify-between border border-transparent dark:border-primary-blue/20 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full pointer-events-none -mr-10 -mt-10 group-hover:scale-110 transition-transform"></div>
            <div>
              <span className="text-[10px] font-bold tracking-wider uppercase text-blue-200 dark:text-primary-blue mb-1 block">{continueLesson.category}</span>
              <h3 className="text-xl font-bold mb-1 line-clamp-1">{continueLesson.title}</h3>
              <p className="text-blue-100 dark:text-blue-200/70 text-sm line-clamp-1 max-w-[80%]">
                {continueLesson.description}
              </p>
            </div>
            <div className="flex items-center justify-between w-full">
               <div className="flex items-center gap-2">
                 <span className="bg-white/10 px-2 py-1 rounded-md text-[10px] font-bold flex items-center gap-1 backdrop-blur-sm">
                    ⏱ {continueLesson.duration} Menit
                 </span>
                 {progress.completedLessons.includes(continueLesson.id) && (
                   <span className="bg-green-500/20 text-green-300 px-2 py-1 rounded-md text-[10px] font-bold flex items-center gap-1 backdrop-blur-sm">
                     <CheckCircle2 className="w-3 h-3" /> Selesai
                   </span>
                 )}
               </div>
               <div className="w-10 h-10 rounded-full bg-white/20 dark:bg-primary-blue/30 flex items-center justify-center shrink-0 backdrop-blur-sm shadow-inner group-hover:bg-primary-blue transition-colors">
                 <PlaySquare className="w-4 h-4 fill-white" />
               </div>
            </div>
          </div>
        </div>

        {/* Daily Goal Widget (Spans 4 cols on desktop) */}
        <div className="col-span-1 md:col-span-4 flex flex-col transition-opacity">
          <div className="mb-2 flex items-center justify-between text-sm font-bold tracking-wide text-gray-500 uppercase">
             Target Belajar Harian
          </div>
          <div className="bg-white dark:bg-slate rounded-3xl p-5 h-[160px] border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/5 rounded-bl-full pointer-events-none group-hover:scale-125 transition-transform"></div>
            
            <div className="flex items-center justify-between mb-3 relative z-10">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-blue-100 dark:bg-blue-500/20 rounded-md text-blue-600 dark:text-blue-400">
                  <Target className="w-4 h-4" />
                </div>
                {isEditingGoal ? (
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    setDailyGoal(parseInt(goalInput, 10) || 30);
                    setIsEditingGoal(false);
                  }} className="flex items-center gap-2">
                    <input 
                      type="number" 
                      value={goalInput}
                      onChange={(e) => setGoalInput(e.target.value)}
                      className="w-16 px-2 py-0.5 text-sm font-bold text-navy dark:text-white bg-gray-100 dark:bg-gray-800 rounded outline-none"
                      autoFocus
                      onBlur={() => {
                        setDailyGoal(parseInt(goalInput, 10) || 30);
                        setIsEditingGoal(false);
                      }}
                    />
                    <span className="text-xs text-gray-400">menit</span>
                  </form>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-navy dark:text-white">{progress.dailyGoal} Menit/Hari</span>
                    <button onClick={() => setIsEditingGoal(true)} className="text-gray-400 hover:text-primary-blue">
                      <Pencil className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-auto relative z-10">
              {(() => {
                const today = new Date().toISOString().split('T')[0];
                const todayMinutes = progress.studyHistory?.[today] || 0;
                const percent = Math.min(100, Math.round((todayMinutes / progress.dailyGoal) * 100));
                
                return (
                  <>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-2xl font-bold text-navy dark:text-white">{todayMinutes}<span className="text-gray-400 text-sm font-medium">/{progress.dailyGoal} mnt</span></span>
                      {percent >= 100 && <span className="text-green-500 font-bold text-xs bg-green-50 dark:bg-green-500/10 px-2 py-1 rounded-md">Selesai!</span>}
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-gray-800 h-2 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-1000 ${percent >= 100 ? 'bg-green-500' : 'bg-primary-blue'}`} style={{ width: `${percent}%` }}></div>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
         {/* Learning Heatmap / Streak Overview */}
         <div 
           className="bg-white dark:bg-slate border border-gray-100 dark:border-gray-800 rounded-3xl p-5 shadow-sm cursor-pointer hover:shadow-md transition-all flex flex-col"
           onClick={() => setView('learning_stats')}
         >
            <h4 className="font-bold text-navy dark:text-white text-base mb-1 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary-blue" />
              Konsistensi Belajar
            </h4>
            <p className="text-xs text-gray-500 mb-4">Aktivitasmu minggu ini.</p>
            <div className="flex gap-2 justify-between mt-auto px-2">
              {['S','S','R','K','J','S','M'].map((day, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${i < 3 ? 'bg-primary-blue text-white shadow-sm shadow-blue-500/30' : i === 3 ? 'bg-primary-blue/20 text-primary-blue border border-primary-blue/30' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'}`}>
                    {day}
                  </div>
                </div>
              ))}
            </div>
         </div>

         {/* Daily Action */}
         <div 
           onClick={() => setView('practice')}
           className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 rounded-3xl p-5 border border-indigo-100 dark:border-indigo-800/30 shadow-sm cursor-pointer hover:shadow-md transition-all flex items-center gap-4 relative overflow-hidden group"
         >
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary-blue/5 rounded-bl-full pointer-events-none group-hover:scale-125 transition-transform"></div>
            <div className="w-14 h-14 rounded-2xl bg-primary-blue/20 text-primary-blue dark:text-blue-400 flex items-center justify-center shrink-0">
               <Laptop className="w-7 h-7" />
            </div>
            <div>
               <h4 className="font-bold text-navy dark:text-white text-base">Mini Challenge Hari Ini</h4>
               <p className="text-sm text-gray-500 mt-1 line-clamp-2">Latih ingatanmu dengan menyelesaikan 1 tugas coding praktis hari ini.</p>
            </div>
         </div>
      </div>

      {/* Modern Learning Roadmap */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-navy dark:text-white">Learning Journey</h3>
      </div>
      
      <div className="space-y-4">
        {roadmapLevels.map((item) => {
          const levelLessons = lessons.filter(l => l.level === item.level);
          const completedInLevel = levelLessons.filter(l => progress.completedLessons.includes(l.id));
          const isCompleted = levelLessons.length > 0 && completedInLevel.length === levelLessons.length;
          const isExpanded = expandedLevel === item.level;
          const progressPercent = levelLessons.length > 0 ? (completedInLevel.length / levelLessons.length) * 100 : 0;
          
          return (
             <div key={item.level} className={`bg-white dark:bg-slate rounded-2xl border ${isExpanded ? 'border-primary-blue/30 shadow-md' : 'border-gray-100 dark:border-gray-800 shadow-sm'} overflow-hidden transition-all duration-300`}>
                <div 
                   onClick={() => setExpandedLevel(isExpanded ? null : item.level)}
                   className="p-4 sm:p-5 flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                    <div className="flex items-center flex-1">
                        <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center shrink-0 mr-4 ${item.color}`}>
                           <item.icon className="w-6 h-6 sm:w-7 sm:h-7" />
                        </div>
                        <div className="flex-1 pr-4">
                           <div className="flex items-center justify-between mb-1">
                               <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-gray-400">Level {item.level}</span>
                               {isCompleted ? (
                                 <span className="bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 text-[10px] font-bold px-2 py-0.5 rounded flex items-center shrink-0"><CheckCircle2 className="w-3 h-3 mr-1" /> Sukses</span>
                               ) : (
                                 <span className="bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400 text-[10px] font-bold px-2 py-0.5 rounded shrink-0">⏱ {item.est}</span>
                               )}
                           </div>
                           <h4 className="text-base sm:text-lg font-bold text-navy dark:text-white leading-tight">{item.title}</h4>
                           <p className="text-xs sm:text-sm text-gray-500 mt-1 line-clamp-1">{item.desc}</p>
                           
                           {/* Progress Bar */}
                           <div className="mt-3 bg-gray-100 dark:bg-gray-800 rounded-full h-1.5 w-full overflow-hidden flex">
                               <div className="bg-primary-blue h-full rounded-full transition-all duration-700 ease-out" style={{ width: `${progressPercent}%` }}></div>
                           </div>
                        </div>
                    </div>
                    <div className="shrink-0 p-2">
                       <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                    </div>
                </div>
                
                <AnimatePresence>
                  {isExpanded && (
                     <motion.div 
                       initial={{ height: 0, opacity: 0 }}
                       animate={{ height: 'auto', opacity: 1 }}
                       exit={{ height: 0, opacity: 0 }}
                       transition={{ duration: 0.3, ease: 'easeInOut' }}
                       className="border-t border-gray-100 dark:border-gray-800 overflow-hidden"
                     >
                       <div className="p-4 sm:p-5 bg-gray-50/50 dark:bg-gray-800/20">
                          {levelLessons.length === 0 ? (
                             <p className="text-sm text-gray-400 italic text-center py-4">⏳ Materi untuk level ini sedang diracik...</p>
                          ) : (
                             <div className="space-y-3">
                                {levelLessons.map(lesson => {
                                   const isLessonCompleted = progress.completedLessons.includes(lesson.id);
                                   return (
                                     <div 
                                        key={lesson.id}
                                        onClick={() => handleLessonStart(lesson.id)}
                                        className={`group bg-white dark:bg-slate p-3 sm:p-4 rounded-xl border ${isLessonCompleted ? 'border-primary-blue/30 ring-1 ring-primary-blue/10 dark:ring-primary-blue/20' : 'border-gray-200 dark:border-gray-700'} flex items-center justify-between cursor-pointer hover:shadow-md transition-all hover:border-primary-blue/50`}
                                     >
                                         <div className="pr-4">
                                            <h5 className="font-bold text-navy dark:text-white text-sm mb-1 flex items-center">
                                               {lesson.title}
                                               {isLessonCompleted && <CheckCircle2 className="w-4 h-4 text-green-500 ml-2 shrink-0" />}
                                            </h5>
                                            <p className="text-xs text-gray-500 line-clamp-1 mb-1.5">{lesson.description}</p>
                                            <span className="inline-flex items-center text-[9px] uppercase tracking-wide font-bold bg-gray-100 dark:bg-gray-800 text-gray-500 px-1.5 py-0.5 rounded">
                                               ⏱ {lesson.duration} Menit
                                            </span>
                                         </div>
                                         <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${isLessonCompleted ? 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400' : 'bg-soft-blue text-primary-blue dark:bg-gray-800'} group-hover:bg-primary-blue group-hover:text-white`}>
                                            <PlaySquare className="w-3.5 h-3.5 ml-0.5" />
                                         </div>
                                     </div>
                                   );
                                })}
                             </div>
                          )}
                       </div>
                     </motion.div>
                  )}
                </AnimatePresence>
             </div>
          );
        })}
      </div>
    </div>
  );
}
