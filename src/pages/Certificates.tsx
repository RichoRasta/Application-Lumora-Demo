import React from 'react';
import { Award, Download, Share2, Lock } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';

export default function Certificates() {
  const { progress, t } = useAppContext();
  const completed = progress.completedLessons.length;
  
  // HTML total lessons = 8
  const htmlProgress = Math.min(100, Math.floor((completed / 8) * 100));
  // CSS total lessons = 7 (from index 8 to 15 approx) -> let's say total 15 for HTML+CSS
  const cssProgress = Math.min(100, Math.floor(((Math.max(0, completed - 8)) / 7) * 100));
  // JS total lessons = 8 -> say total 23
  const jsProgress = Math.min(100, Math.floor(((Math.max(0, completed - 15)) / 8) * 100));

  const certs = [
    { title: 'Lulusan HTML Dasar', progress: htmlProgress },
    { title: 'Lulusan CSS Dasar', progress: cssProgress },
    { title: 'Lulusan JavaScript Dasar', progress: jsProgress },
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto pb-24">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-navy dark:text-white mb-2">{t('certificates.title')}</h1>
          <p className="text-gray-500 dark:text-gray-400">{t('ui_4')}</p>
        </div>
        <div className="bg-primary-blue/10 dark:bg-primary-blue/20 p-3 rounded-xl hidden md:block">
          <Award className="w-8 h-8 text-primary-blue" />
        </div>
      </div>

      {completed === 0 && (
        <div className="mb-8 p-6 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-2xl flex flex-col items-center text-center">
          <Award className="w-12 h-12 text-primary-blue mb-3 opacity-80" />
          <h3 className="font-bold text-navy dark:text-white mb-2">{t('ui_5')}</h3>
          <p className="text-sm text-gray-500">{t('ui_6')}</p>
        </div>
      )}

      <div className="space-y-6">
        {certs.map((cert, idx) => (
          <div key={idx} className="bg-white dark:bg-slate border border-gray-100 dark:border-gray-800 rounded-3xl p-6 md:p-10 shadow-sm flex flex-col md:flex-row gap-8 items-center text-center md:text-left">
            <div className="w-full md:w-1/2 aspect-[4/3] bg-gray-50 dark:bg-gray-800 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center p-6 relative overflow-hidden group">
              {cert.progress === 100 ? (
                <>
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent"></div>
                  <Award className="w-16 h-16 text-emerald-500 mb-4 drop-shadow-md" />
                  <p className="font-bold text-emerald-600 dark:text-emerald-400">{t('ui_7')}</p>
                </>
              ) : (
                <>
                  <Lock className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-4" />
                  <p className="font-bold text-gray-400 dark:text-gray-500">{t('ui_8')}</p>
                  <p className="text-sm text-gray-400 mt-2 max-w-[200px] text-center">{t('ui_9')}</p>
                </>
              )}
            </div>
            
            <div className="w-full md:w-1/2 flex flex-col items-center md:items-start">
              <h3 className="text-2xl font-bold text-navy dark:text-white mb-2">{cert.title}</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">{t('ui_10')} 
                <span className={`font-bold ml-1 ${cert.progress === 100 ? 'text-emerald-500' : cert.progress > 0 ? 'text-orange-500' : 'text-gray-400'}`}>
                  {cert.progress === 100 ? 'Selesai' : cert.progress > 0 ? `Dalam Proses (${cert.progress}%)` : 'Belum Dimulai (0%)'}
                </span>
              </p>
              
              <div className="w-full bg-gray-100 dark:bg-gray-800 h-2 rounded-full overflow-hidden mb-6">
                <div className={`h-full transition-all duration-1000 ${cert.progress === 100 ? 'bg-emerald-500' : 'bg-primary-blue'}`} style={{ width: `${cert.progress}%` }}></div>
              </div>
              
              <div className="flex gap-3 w-full">
                <button disabled={cert.progress < 100} className={`flex-1 py-3 flex items-center justify-center gap-2 font-bold rounded-xl transition-colors ${cert.progress === 100 ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-md shadow-emerald-500/20' : 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'}`}>
                  <Download className="w-4 h-4" /> {t('ui_11')}
                </button>
                <button disabled={cert.progress < 100} className={`px-4 flex items-center justify-center border rounded-xl transition-colors ${cert.progress === 100 ? 'border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20' : 'border-gray-200 dark:border-gray-700 text-gray-400 cursor-not-allowed'}`}>
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
