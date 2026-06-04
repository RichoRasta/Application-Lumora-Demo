import React, { useState, useEffect } from 'react';
import { ArrowLeft, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';
import { lessons } from '../data/lessons';
import { motion, AnimatePresence } from 'motion/react';
import ConsoleOutput, { ConsoleLog } from '../components/ConsoleOutput';

export default function LessonView() {
  const { view, setView, activeLessonId, language, t, markLessonComplete, progress, updateLastActiveLesson } = useAppContext();
  const [showAi, setShowAi] = useState(false);
  const [code, setCode] = useState('');
  const [srcDoc, setSrcDoc] = useState('');
  const [errorObj, setErrorObj] = useState<string | null>(null);
  const [logs, setLogs] = useState<ConsoleLog[]>([]);

  const lesson = lessons.find(l => l.id === activeLessonId);

  useEffect(() => {
    if (activeLessonId) {
      updateLastActiveLesson(activeLessonId);
    }
  }, [activeLessonId, updateLastActiveLesson]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'CONSOLE') {
        let message = event.data.message;
        if (event.data.level === 'error' && typeof message === 'string') {
          const lowerMsg = message.toLowerCase();
          
          if (lowerMsg.includes('syntaxerror')) {
            if (lowerMsg.includes('missing )') || lowerMsg.includes('unexpected token )')) {
              message += '\n\n💡 Hint: Sepertinya kamu lupa menambahkan kurung tutup ")" atau kelebihan.';
            } else if (lowerMsg.includes('unexpected token {') || lowerMsg.includes('unexpected token }')) {
              message += '\n\n💡 Hint: Ada kurung kurawal "{ }" yang salah tempat atau tidak tertutup dengan benar.';
            } else if (lowerMsg.includes('missing }') || lowerMsg.includes('unexpected end of input')) {
              message += '\n\n💡 Hint: Sepertinya ada blok kode yang terpotong. Cek apakah kurung kurawal "{" sudah ditutup dengan "}".';
            } else if (lowerMsg.includes('unexpected string') || lowerMsg.includes('invalid or unexpected token')) {
              message += '\n\n💡 Hint: Mungkin kamu lupa menutup tanda kutip " " pada teksmu, atau lupa koma/titik koma (;) pembatas antar baris.';
            } else if (lowerMsg.includes('unexpected identifier')) {
              message += '\n\n💡 Hint: Ada kata yang tidak dikenal oleh komputer. Coba cek ejaan kode (seperti document.getElementById) atau pastikan tidak ada kutip yang terlewat.';
            } else {
              message += '\n\n💡 Hint: Ada kesalahan penulisan (syntax). Coba baca perlahan kodemu, cari titik koma atau kurung yang hilang.';
            }
          } else if (lowerMsg.includes('referenceerror') || lowerMsg.includes('is not defined')) {
            message += '\n\n💡 Hint: Kamu mencoba memanggil kotak penyimpanan (variabel) yang belum dibuat. Cek typonya ya (huruf besar/kecil sangat berpengaruh)!';
          } else if (lowerMsg.includes('typeerror')) {
            if (lowerMsg.includes('null') || lowerMsg.includes('undefined') || lowerMsg.includes('reading')) {
              message += '\n\n💡 Hint: Kamu mencoba mengubah elemen yang tidak ditemukan. Jika pakai querySelector, pastikan "id" atau "class" sama persis dengan yang ada di HTML.';
            } else if (lowerMsg.includes('is not a function')) {
              message += '\n\n💡 Hint: Kode yang kamu panggil bukanlah sebuah perintah. Misalnya, cek apakah kamu salah mengetik (contoh: textContent() padahal harusnya textContent="").';
            }
          }
        }
        setLogs(prev => [...prev, { id: Date.now().toString() + Math.random(), level: event.data.level, message }]);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const generatePreview = (html: string, css: string, js: string = '') => {
    return `
      <html>
        <head>
          <style>body{font-family:sans-serif;} ${css}</style>
          <script>
            const originalLog = console.log;
            const originalError = console.error;
            const originalWarn = console.warn;
            const originalInfo = console.info;

            function sendLog(level, args) {
              const message = Array.from(args).map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' ');
              window.parent.postMessage({ type: 'CONSOLE', level, message }, '*');
            }

            console.log = function(...args) { sendLog('info', args); originalLog.apply(console, args); };
            console.error = function(...args) { sendLog('error', args); originalError.apply(console, args); };
            console.warn = function(...args) { sendLog('warn', args); originalWarn.apply(console, args); };
            console.info = function(...args) { sendLog('info', args); originalInfo.apply(console, args); };

            window.onerror = function(message, source, lineno, colno, error) {
              window.parent.postMessage({ type: 'CONSOLE', level: 'error', message: message });
              return false;
            };
          </script>
        </head>
        <body>
          ${html}
          <script>${js}</script>
        </body>
      </html>
    `;
  };

  useEffect(() => {
    if (lesson?.starterCode) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCode(lesson.starterCode.html);
      setSrcDoc(generatePreview(lesson.starterCode.html, lesson.starterCode.css, lesson.starterCode.js || ''));
    }
  }, [lesson]);

  const handleRunCode = () => {
    // Basic humanized error handling for beginners
    if (code.includes('<') && !code.includes('>')) {
      setErrorObj(language === 'id' ? 'Sepertinya kamu lupa menutup tanda kurang dari (<) dengan tanda lebih dari (>).' : 'Looks like you forgot to close the less-than sign (<) with a greater-than sign (>).');
      return;
    }
    if (code.includes('<button') && !code.includes('</button>')) {
      setErrorObj(language === 'id' ? 'Kamu sudah membuka kode <button>, tapi lupa menutupnya. Jangan lupa tambahkan </button> di akhir ya.' : 'You wrote an opening <button> tag, but forgot the closing </button> tag.');
      return;
    }
    
    // Check for unmatched brackets in code
    const openBraces = (code.match(/\{/g) || []).length;
    const closeBraces = (code.match(/\}/g) || []).length;
    if (openBraces > closeBraces) {
      setErrorObj(language === 'id' ? 'Ada kurung kurawal buka "{" yang belum memiliki pasangan penutup "}".' : 'There is an opening curly brace "{" without a closing pair "}".');
      return;
    } else if (closeBraces > openBraces) {
      setErrorObj(language === 'id' ? 'Ada kurung kurawal tutup "}" yang berlebih atau salah tempat.' : 'There is an extra or misplaced closing curly brace "}".');
      return;
    }

    setLogs([]); // Clear logs on run
    setErrorObj(null);
    setSrcDoc(generatePreview(code, lesson?.starterCode?.css || '', lesson?.starterCode?.js || ''));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        handleRunCode();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code, language, lesson]);

  const handleComplete = () => {
    if (activeLessonId) markLessonComplete(activeLessonId);
    
    const levelLessons = lessons.filter(l => l.level === lesson?.level);
    const wasLevelCompleteBefore = levelLessons.length > 0 && levelLessons.every(l => progress.completedLessons.includes(l.id));
    
    const completedSet = new Set(progress.completedLessons);
    if (activeLessonId) completedSet.add(activeLessonId);
    
    const isLevelNowComplete = levelLessons.length > 0 && levelLessons.every(l => completedSet.has(l.id));
    
    if (isLevelNowComplete && !wasLevelCompleteBefore) {
      sessionStorage.setItem('showConfetti', 'true');
    }
    
    setView('home');
  };

  if (view !== 'lesson' || !lesson) return null;

  const levelLessons = lessons.filter(l => l.level === lesson.level);
  const completedInLevel = levelLessons.filter(l => progress.completedLessons.includes(l.id));
  const completionRate = levelLessons.length > 0 ? completedInLevel.length / levelLessons.length : 0;
  
  let badge = null;
  if (completionRate === 1) {
    badge = '🏆 Master';
  } else if (completionRate >= 0.5) {
    badge = '🌟 Explorer';
  } else if (completionRate > 0) {
    badge = '🌱 Beginner';
  }

  return (
    <div className="fixed inset-0 z-[100] bg-white dark:bg-navy flex flex-col md:flex-row">
      {/* Mobile/Left Top Header & Content Window */}
      <div className="flex-1 flex flex-col overflow-y-auto border-r border-gray-100 dark:border-gray-800">
        <div className="sticky top-0 bg-white/80 dark:bg-navy/80 backdrop-blur-md px-4 py-4 flex items-center justify-between border-b border-gray-100 dark:border-gray-800 z-10">
          <div className="flex items-center">
            <button onClick={() => setView('home')} className="p-2 mr-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
            <div className="font-semibold text-sm text-gray-500 uppercase tracking-widest">{lesson.category}</div>
          </div>
          {badge && (
            <div className="px-3 py-1 rounded-full bg-soft-blue/20 dark:bg-primary-blue/20 border border-primary-blue/30 text-primary-blue text-xs font-bold shadow-sm">
              Level {lesson.level} {badge}
            </div>
          )}
        </div>

        <div className="p-6 md:p-8 md:max-w-xl md:mx-auto">
          <h1 className="text-3xl font-bold text-navy dark:text-white mb-3 flex items-center flex-wrap gap-3 leading-tight">
            {language === 'id' ? lesson.title : lesson.titleEn}
          </h1>
          <div className="flex items-center gap-3 mb-6">
            <span className="inline-flex items-center text-[10px] uppercase tracking-wider font-bold bg-gray-100 dark:bg-gray-800 text-gray-500 px-2.5 py-1 rounded">
              ⏱ Estimasi: {lesson.duration} Menit
            </span>
            {progress.completedLessons.includes(lesson.id) && (
              <span className="inline-flex items-center text-[10px] uppercase tracking-wider font-bold bg-green-50 dark:bg-green-900/20 text-green-600 px-2.5 py-1 rounded">
                <CheckCircle2 className="w-3 h-3 mr-1" /> Selesai
              </span>
            )}
          </div>

          <div className="bg-soft-purple/50 dark:bg-primary-purple/10 p-5 rounded-2xl mb-8 border border-soft-purple-border/50 dark:border-primary-purple/20">
            <h3 className="font-bold text-primary-purple flex items-center mb-2">
              <span className="text-xl mr-2">🎯</span> {t('lesson.why')}
            </h3>
            <p className="text-navy dark:text-gray-200 font-medium leading-relaxed">
              {language === 'id' ? lesson.whyLearnThis : lesson.whyLearnThisEn}
            </p>
          </div>

          {(lesson.whatYouWillLearn && lesson.whatYouWillLearn.length > 0) && (
            <div className="bg-blue-50/50 dark:bg-blue-900/10 p-5 rounded-2xl mb-8 border border-blue-100 dark:border-blue-800/30">
              <h3 className="font-bold text-primary-blue flex items-center mb-3">
                <span className="text-xl mr-2">📌</span> {language === 'id' ? 'Di materi ini kamu akan belajar:' : 'In this lesson you will learn:'}
              </h3>
              <ul className="space-y-2">
                {(language === 'id' ? lesson.whatYouWillLearn : (lesson.whatYouWillLearnEn || lesson.whatYouWillLearn)).map((item, idx) => (
                  <li key={idx} className="flex items-start text-gray-700 dark:text-gray-300 font-medium">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mr-2 mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {lesson.finalResultPreview && (
            <div className="mb-8">
              <h3 className="font-bold text-navy dark:text-white mb-3 text-lg">{language === 'id' ? 'Hasil Akhir yang Akan Dibuat ✨' : 'Final Result Preview ✨'}</h3>
              <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl border border-gray-200 dark:border-gray-800 p-4 shadow-sm flex items-center justify-center">
                 <img src={lesson.finalResultPreview} alt="Final Result" className="max-w-full h-auto rounded-xl shadow-sm" />
              </div>
            </div>
          )}

          <div className="prose dark:prose-invert max-w-none text-lg text-gray-700 dark:text-gray-300 mb-8 font-medium leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mt-2 [&_li]:mb-1" 
            dangerouslySetInnerHTML={{ __html: language === 'id' ? lesson.content.replace(/\*\*(.*?)\*\*/g, '<b class="text-navy dark:text-white">$1</b>').replace(/`(.*?)`/g, '<code class="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-primary-blue">$1</code>') : lesson.contentEn.replace(/\*\*(.*?)\*\*/g, '<b class="text-navy dark:text-white">$1</b>').replace(/`(.*?)`/g, '<code class="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-primary-blue">$1</code>') }} 
          />

          <button 
            onClick={() => setShowAi(!showAi)}
            className="w-full bg-slate-900 dark:bg-white text-white dark:text-navy py-4 rounded-2xl font-bold flex items-center justify-center shadow-md active:scale-95 transition-all mb-8 relative overflow-hidden"
          >
            <Sparkles className="w-5 h-5 mr-2 text-yellow-400 dark:text-primary-blue" />
            {t('lesson.ai_simplify')}
          </button>

          <AnimatePresence>
            {showAi && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-5 rounded-2xl border border-yellow-200 dark:border-yellow-700/30 mb-8 flex">
                  <div className="text-2xl mr-3">💡</div>
                  <p className="text-gray-800 dark:text-gray-200 font-medium text-lg leading-relaxed">
                    {language === 'id' ? lesson.analogy : lesson.analogyEn}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {(lesson.codeExplanation || lesson.codeExplanationEn) && (
            <div className="mb-8 p-5 bg-blue-50 dark:bg-primary-blue/10 rounded-2xl border border-blue-100 dark:border-primary-blue/20">
              <h3 className="font-bold text-primary-blue flex items-center mb-3">
                <span className="text-xl mr-2">🔍</span> Penjelasan Kode
              </h3>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed">
                {language === 'id' ? lesson.codeExplanation : lesson.codeExplanationEn}
              </p>
            </div>
          )}

          {(lesson.commonErrors || lesson.commonErrorsEn) && (
            <div className="mb-8 p-5 bg-red-50 dark:bg-red-900/10 rounded-2xl border border-red-100 dark:border-red-900/20">
              <h3 className="font-bold text-red-600 dark:text-red-400 flex items-center mb-3">
                <AlertCircle className="w-5 h-5 mr-2" /> Kesalahan Umum Pemula
              </h3>
              <p className="text-red-800 dark:text-red-300 font-medium mb-3">
                {language === 'id' ? lesson.commonErrors : lesson.commonErrorsEn}
              </p>
              <div className="bg-white/50 dark:bg-black/20 p-3 rounded-xl border border-red-100 dark:border-red-900/30 text-sm text-red-700 dark:text-red-200">
                <strong>💡 Cara Fix:</strong> {language === 'id' ? lesson.errorFix : lesson.errorFixEn}
              </div>
            </div>
          )}

          <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-800">
            {!lesson.starterCode ? (
              <button 
                onClick={handleComplete}
                className="w-full bg-primary-blue text-white py-4 rounded-xl font-bold shadow-lg hover:shadow-primary-blue/30 active:scale-95 transition-all mb-4 flex items-center justify-center"
              >
                <CheckCircle2 className="w-5 h-5 mr-2" />
                {t('lesson.complete')}
              </button>
            ) : (
              <p className="text-sm text-gray-500 font-medium text-center mb-6">
                ✨ Selesaikan praktek coding di sebelah kanan untuk melanjutkan materi.
              </p>
            )}
            
            {progress.completedLessons.includes(lesson.id) && (
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 mt-4 text-center">
                 <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">Lanjut Belajar</h4>
                 <button 
                   onClick={() => setView('home')}
                   className="text-primary-blue font-bold hover:underline"
                 >
                   Kembali ke Dashboard 👋
                 </button>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Editor & Preview Split Panel for interactive lessons */}
      {lesson.starterCode && (
        <div className="flex-1 max-h-[50vh] md:max-h-none flex flex-col bg-gray-50 dark:bg-[#1E1E1E] md:border-l border-t md:border-t-0 border-gray-200 dark:border-gray-800">
          <div className="p-4 bg-white dark:bg-slate border-b border-gray-200 dark:border-gray-800">
            <h3 className="font-bold text-navy dark:text-white text-sm mb-1">{t('lesson.practice')}</h3>
            <p className="text-sm text-gray-500">{language === 'id' ? lesson.challenge : lesson.challengeEn}</p>
          </div>
          
          <div className="flex-1 flex flex-col overflow-hidden">
            <textarea 
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="flex-1 w-full bg-slate-50 dark:bg-[#1A1A1A] text-blue-800 dark:text-blue-300 border-x border-gray-200 dark:border-transparent p-5 font-mono text-base md:text-lg focus:outline-none resize-none transition-colors"
              spellCheck="false"
            />
          </div>

          <div className="bg-white dark:bg-slate border-y border-gray-200 dark:border-gray-800 p-2 flex justify-between items-center">
            <button 
              onClick={handleRunCode}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2.5 rounded-lg font-bold text-sm tracking-wide shadow-md transition-colors flex items-center"
            >
              {t('playground.run')} <span className="hidden sm:inline-block ml-2 opacity-70 text-xs font-normal">(Cmd/Ctrl + Enter)</span>
            </button>
            <button 
              onClick={handleComplete}
              className="text-gray-500 dark:text-gray-400 font-medium text-sm hover:text-navy dark:hover:text-white px-4"
            >
              {t('lesson.complete')}
            </button>
          </div>

          {errorObj && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 border-b border-red-200 dark:border-red-900/50 flex items-start text-sm font-medium">
              <AlertCircle className="w-5 h-5 mr-2 shrink-0 mt-0.5" />
              {errorObj}
            </div>
          )}

          <div className="flex-1 max-h-[50%] flex flex-col bg-white">
            <div className="flex-1 relative bg-white border-b border-gray-200 dark:border-gray-800">
              <div className="absolute top-0 right-0 bg-black/60 text-white text-[10px] px-2 py-1 rounded-bl-lg z-10 font-medium uppercase mix-blend-difference">Live Preview</div>
              <iframe 
                srcDoc={srcDoc}
                title="Interactive Preview"
                className="w-full h-full border-none"
                sandbox="allow-scripts"
              />
            </div>
            <div className="h-1/3 min-h-[100px]">
              <ConsoleOutput logs={logs} onClear={() => setLogs([])} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
