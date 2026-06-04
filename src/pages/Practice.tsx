import React, { useState, useEffect, useCallback } from 'react';
import { Code2, Play, CheckCircle2, AlertCircle, Lightbulb, ArrowRight, BookOpen, Layers } from 'lucide-react';
import { challenges } from '../data/challenges';
import { useAppContext } from '../contexts/AppContext';

export default function Practice() {
  const { progress, markChallengeComplete } = useAppContext();
  const [activeId, setActiveId] = useState(challenges[0].id);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const filteredChallenges = challenges.filter(c => 
    activeCategory === 'All' || c.level.includes(activeCategory)
  );

  const [html, setHtml] = useState(challenges[0].initialHtml);
  const [css, setCss] = useState(challenges[0].initialCss);
  const [js, setJs] = useState(challenges[0].initialJs);
  const [srcDoc, setSrcDoc] = useState('');
  
  const [activeTab, setActiveTab] = useState<'html' | 'css' | 'js'>('html');
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: '' });

  const activeChallenge = challenges.find(c => c.id === activeId) || challenges[0];

  const handleSelect = (id: string) => {
    const next = challenges.find(c => c.id === id);
    if (!next) return;
    setActiveId(id);
    setHtml(next.initialHtml);
    setCss(next.initialCss);
    setJs(next.initialJs);
    setActiveTab('html');
    setShowHint(false);
    setFeedback({ type: null, message: '' });
  };

  const handleNextChallenge = () => {
    const currentIndex = challenges.findIndex(c => c.id === activeId);
    const next = challenges[currentIndex + 1];
    if (next) {
      handleSelect(next.id);
    }
  };

  // Debounced live preview update
  useEffect(() => {
    const timeout = setTimeout(() => {
      setSrcDoc(`
        <html>
          <head>
            <style>body{font-family:sans-serif; margin:0; padding:16px;} ${css}</style>
          </head>
          <body>
            ${html}
            <script>${js}</script>
          </body>
        </html>
      `);
      // clear feedback if they start typing again after an error
      if (feedback.type === 'error') {
        setFeedback({ type: null, message: '' });
      }
    }, 500);
    return () => clearTimeout(timeout);
  }, [html, css, js, feedback.type]);

  const checkAnswer = useCallback(() => {
    let isCorrect = true;
    
    if (activeChallenge.expectedOutput) {
      const { htmlContains, cssContains, jsContains } = activeChallenge.expectedOutput;
      
      if (htmlContains) {
        for (const str of htmlContains) {
          if (!html.toLowerCase().includes(str.toLowerCase())) {
            isCorrect = false;
            break;
          }
        }
      }
      
      if (isCorrect && cssContains) {
        for (const str of cssContains) {
          if (!css.toLowerCase().includes(str.toLowerCase())) {
            isCorrect = false;
            break;
          }
        }
      }
      
      if (isCorrect && jsContains) {
        for (const str of jsContains) {
          if (!js.toLowerCase().includes(str.toLowerCase())) {
            isCorrect = false;
            break;
          }
        }
      }
    }

    if (isCorrect) {
      setFeedback({ type: 'success', message: activeChallenge.successMessage });
      markChallengeComplete(activeChallenge.id);
    } else {
      setFeedback({ type: 'error', message: activeChallenge.failureMessage });
    }
  }, [html, css, js, activeChallenge, markChallengeComplete]);

  // Keyboard shortcut to check answer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        checkAnswer();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [checkAnswer]);

  const completedChallenges = progress?.completedChallenges || [];
  const completedCount = filteredChallenges.filter(c => completedChallenges.includes(c.id)).length;
  const totalCount = filteredChallenges.length;
  const completionPercentage = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  return (
    <div className="pb-24 lg:pb-8 pt-8 px-4 sm:px-6 max-w-[1400px] mx-auto w-full h-full lg:h-[calc(100vh)] flex flex-col focus:outline-none overflow-y-auto lg:overflow-hidden">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 shrink-0 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-navy dark:text-white flex items-center">
          <Code2 className="w-8 h-8 mr-3 text-primary-blue" />
          Interactive Practice
        </h1>
        <div className="bg-white dark:bg-slate px-4 py-2 rounded-xl flex items-center shadow-sm border border-gray-100 dark:border-gray-800">
           <Layers className="w-4 h-4 text-gray-400 mr-2" />
           <span className="font-bold text-sm text-navy dark:text-white mr-2">{activeChallenge.level}</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-6 h-full min-h-0 pb-6">
        
        {/* Left Column: Challenge List */}
        <div className="lg:w-[320px] flex flex-col shrink-0 lg:h-full lg:overflow-y-auto pr-2 pb-4 scrollbar-hide">
           {/* Progress Tracker */}
           <div className="mb-6 bg-white dark:bg-slate p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col gap-4">
             <div className="flex justify-between items-center">
               <span className="text-sm font-bold text-navy dark:text-white flex items-center">
                 Progress {activeCategory !== 'All' ? activeCategory : ''}
               </span>
               <span className="text-[10px] uppercase font-bold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-2.5 py-1 rounded-md">{completedCount} / {totalCount} Selesai</span>
             </div>
             <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2 overflow-hidden">
               <div className="bg-green-500 h-full rounded-full transition-all duration-500 ease-out" style={{ width: `${completionPercentage}%` }} />
             </div>
           </div>

           {/* Category Filters */}
           <div className="relative mb-4 w-full">
             <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-3 snap-x touch-pan-x Webkit-overflow-scrolling-touch">
               {['All', 'HTML', 'CSS', 'JavaScript'].map(cat => (
                 <button
                   key={cat}
                   onClick={() => {
                     setActiveCategory(cat);
                     const firstInCat = challenges.find(c => cat === 'All' || c.level.includes(cat));
                     if (firstInCat) handleSelect(firstInCat.id);
                   }}
                   className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap outline-none transition-colors duration-200 shrink-0 snap-start select-none ${activeCategory === cat ? 'bg-navy dark:bg-white text-white dark:text-navy shadow-sm' : 'bg-gray-100 dark:bg-slate border border-gray-200 dark:border-gray-700 text-gray-500 hover:text-navy dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-800'}`}
                 >
                   {cat}
                 </button>
               ))}
             </div>
             {/* Fade edges to indicate scrollability */}
             <div className="absolute top-0 right-0 bottom-3 w-8 bg-gradient-to-l from-[#F8F9FA] dark:from-[#0F172A] to-transparent pointer-events-none rounded-r-md"></div>
           </div>

           <div className="flex flex-col gap-3">
             {filteredChallenges.map((c, index) => {
                const isCompleted = completedChallenges.includes(c.id);
                return (
                  <div 
                    key={c.id} 
                    onClick={() => handleSelect(c.id)}
                    className={`p-4 rounded-xl cursor-pointer border transition-all duration-200 group flex items-start gap-3 ${activeId === c.id ? 'bg-primary-blue text-white shadow-md border-primary-blue' : 'bg-white dark:bg-slate border-gray-100 dark:border-gray-800 hover:border-primary-blue/30 hover:shadow-sm'}`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${activeId === c.id ? 'bg-white/20' : isCompleted ? 'bg-green-50 dark:bg-green-900/20' : 'bg-gray-50 dark:bg-gray-800 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/10'}`}>
                      {isCompleted ? (
                        <CheckCircle2 className={`w-4 h-4 ${activeId === c.id ? 'text-white' : 'text-green-500'}`} />
                      ) : (
                        <Code2 className={`w-4 h-4 ${activeId === c.id ? 'text-white' : 'text-gray-400 group-hover:text-primary-blue'}`} />
                      )}
                    </div>
                    <div className="flex-1 w-full relative pt-0.5">
                       <span className={`text-[10px] font-bold uppercase tracking-widest block mb-1 ${activeId === c.id ? 'text-blue-100' : 'text-gray-400'}`}>Tugas {index + 1}</span>
                       <h4 className={`font-bold text-sm leading-snug w-full ${activeId === c.id ? 'text-white' : 'text-navy dark:text-white'}`}>
                         {c.title}
                       </h4>
                    </div>
                  </div>
                )
             })}
           </div>
        </div>

        {/* Center Column: Instructions & Editor */}
        <div className="flex-[1.5] w-full flex flex-col gap-4 lg:h-full lg:overflow-y-auto">
           {/* Instructions Card */}
           <div className="bg-white dark:bg-slate rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm shrink-0">
              <div className="flex items-center gap-2 mb-2">
                 <span className="bg-soft-blue text-primary-blue px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">
                   {activeChallenge.difficulty}
                 </span>
                 <span className="bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">
                   {activeChallenge.type.replace('_', ' ')}
                 </span>
              </div>
              <h2 className="text-xl font-bold text-navy dark:text-white mb-3">{activeChallenge.title}</h2>
              <div 
                className="text-gray-600 dark:text-gray-300 text-sm mb-4 leading-relaxed space-y-2 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mt-1" 
                dangerouslySetInnerHTML={{ __html: activeChallenge.explanation }} 
              />
              
              <div className="bg-blue-50/50 dark:bg-blue-900/10 rounded-2xl p-4 border border-blue-100/50 dark:border-blue-800/30">
                 <h4 className="font-bold text-primary-blue flex items-center gap-2 mb-2">
                    <BookOpen className="w-4 h-4" /> Instruksi
                 </h4>
                 <ul className="space-y-2">
                    {activeChallenge.instructions.map((inst, i) => (
                       <li key={i} className="flex items-start text-sm text-gray-700 dark:text-gray-300">
                          <span className="bg-white dark:bg-slate w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-primary-blue mr-3 shrink-0 shadow-sm border border-blue-100 dark:border-blue-900/50 mt-0.5">{i + 1}</span>
                          {inst}
                       </li>
                    ))}
                 </ul>
              </div>
           </div>

           {/* Code Editor Tabs Area */}
           <div className="flex-1 flex flex-col bg-[#1E293B] rounded-3xl overflow-hidden shadow-lg border border-gray-800 min-h-[300px]">
              <div className="flex bg-[#0F172A] p-2 gap-2 border-b border-gray-800 overflow-x-auto scrollbar-hide">
                 <button 
                   onClick={() => setActiveTab('html')}
                   className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'html' ? 'bg-primary-blue text-white shadow-md' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                 >
                   HTML
                 </button>
                 <button 
                   onClick={() => setActiveTab('css')}
                   className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'css' ? 'bg-primary-blue text-white shadow-md' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                 >
                   CSS
                 </button>
                 <button 
                   onClick={() => setActiveTab('js')}
                   className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'js' ? 'bg-primary-blue text-white shadow-md' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                 >
                   JavaScript
                 </button>
              </div>
              
              <div className="flex-1 relative font-mono text-sm leading-relaxed">
                 {activeTab === 'html' && (
                   <textarea
                     value={html}
                     onChange={e => setHtml(e.target.value)}
                     className="absolute inset-0 w-full h-full bg-transparent text-gray-100 p-5 outline-none resize-none"
                     spellCheck="false"
                   />
                 )}
                 {activeTab === 'css' && (
                   <textarea
                     value={css}
                     onChange={e => setCss(e.target.value)}
                     className="absolute inset-0 w-full h-full bg-transparent text-blue-300 p-5 outline-none resize-none"
                     spellCheck="false"
                   />
                 )}
                 {activeTab === 'js' && (
                   <textarea
                     value={js}
                     onChange={e => setJs(e.target.value)}
                     className="absolute inset-0 w-full h-full bg-transparent text-yellow-300 p-5 outline-none resize-none"
                     spellCheck="false"
                   />
                 )}
              </div>
           </div>
        </div>

        {/* Right Column: Preview & Feedback */}
        <div className="flex-1 w-full flex flex-col gap-4 lg:h-full">
           
           {/* Hint Toggle */}
           <button 
             onClick={() => setShowHint(!showHint)}
             className="bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-900/50 p-4 rounded-2xl flex items-start gap-3 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-colors w-full text-left outline-none"
           >
              <Lightbulb className={`w-5 h-5 shrink-0 mt-0.5 ${showHint ? 'fill-yellow-500 text-yellow-500' : ''}`} />
              <div>
                 <p className="font-bold text-sm mb-1">Butuh Bantuan?</p>
                 {showHint ? (
                    <p className="text-sm font-medium animate-in fade-in slide-in-from-top-2">{activeChallenge.hint.replace(/&lt;/g, '<').replace(/&gt;/g, '>')}</p>
                 ) : (
                    <p className="text-xs opacity-70">Klik untuk melihat bocoran rahasia petunjuk.</p>
                 )}
              </div>
           </button>

           <div className="flex-1 flex flex-col bg-white dark:bg-slate rounded-3xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800 min-h-[250px]">
             <div className="bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 px-4 py-3 flex items-center justify-between shrink-0">
               <span className="font-bold text-sm text-gray-500 flex items-center gap-2">
                 <Play className="w-4 h-4" /> Live Preview
               </span>
             </div>
             <iframe
               title="Live Code Preview"
               srcDoc={srcDoc}
               sandbox="allow-scripts"
               className="w-full flex-1 bg-white"
             />
           </div>

           {/* Feedback Area */}
           <div className="shrink-0 flex flex-col gap-3">
              {feedback.type && (
                 <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-center gap-3 sm:justify-between animate-in slide-in-from-bottom-2 ${
                    feedback.type === 'success' 
                      ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800/30' 
                      : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800/30'
                 }`}>
                    <div className="flex items-center gap-3 w-full">
                       {feedback.type === 'success' ? (
                          <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0" />
                       ) : (
                          <AlertCircle className="w-6 h-6 text-red-500 shrink-0" />
                       )}
                       <p className={`text-sm font-bold ${feedback.type === 'success' ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
                          {feedback.message}
                       </p>
                    </div>
                    {feedback.type === 'success' && (
                       <button 
                         onClick={handleNextChallenge}
                         className="shrink-0 bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded-xl font-bold flex items-center transition-colors active:scale-95 w-full justify-center sm:w-auto mt-3 sm:mt-0"
                       >
                          Lanjut <ArrowRight className="w-4 h-4 ml-1" />
                       </button>
                    )}
                 </div>
              )}

              <button 
                onClick={checkAnswer}
                className="w-full bg-navy dark:bg-primary-blue text-white p-4 rounded-2xl font-bold text-lg hover:opacity-90 active:scale-95 transition-all shadow-md mt-2 flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                <span>Cek Jawaban Saya</span>
                <span className="hidden sm:inline font-normal text-sm opacity-70 ml-1">(Cmd/Ctrl + Enter)</span>
              </button>
           </div>

        </div>

      </div>
    </div>
  );
}
