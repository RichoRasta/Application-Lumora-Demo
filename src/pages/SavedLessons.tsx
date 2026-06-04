import React from 'react';
import { BookOpen, Search, ArrowRight, BookmarkX } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';
import { lessons } from '../data/lessons';

export default function SavedLessons() {
  const { progress, setView, setActiveLessonId } = useAppContext();
  
  const savedLessons = lessons.filter(l => progress.bookmarks.includes(l.id));

  const handleLessonStart = (id: string) => {
    setActiveLessonId(id);
    setView('lesson');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto pb-24">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-navy dark:text-white mb-2">Bookmark Modul</h1>
          <p className="text-gray-500 dark:text-gray-400">Kumpulan modul dan materi yang kamu simpan.</p>
        </div>
        <div className="bg-primary-blue/10 dark:bg-primary-blue/20 p-3 rounded-xl">
          <BookOpen className="w-8 h-8 text-primary-blue" />
        </div>
      </div>

      <div className="bg-white dark:bg-slate border border-gray-100 dark:border-gray-800 p-2 rounded-xl flex items-center gap-3 mb-6 shadow-sm">
        <Search className="w-5 h-5 text-gray-400 ml-2" />
        <input 
          type="text" 
          placeholder="Cari materi tersimpan..." 
          className="bg-transparent flex-1 p-2 outline-none text-navy dark:text-white placeholder-gray-400"
        />
      </div>

      {savedLessons.length === 0 ? (
        <div className="bg-white dark:bg-slate border border-gray-100 dark:border-gray-800 rounded-3xl p-10 flex flex-col items-center justify-center text-center shadow-sm">
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-full mb-4">
            <BookmarkX className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="font-bold text-navy dark:text-white mb-2">Belum ada materi tersimpan</h3>
          <p className="text-gray-500 text-sm max-w-xs">Kamu bisa menyimpan materi favoritmu saat membacanya, dan materi tersebut akan muncul di halaman ini.</p>
          <button onClick={() => setView('explore')} className="mt-6 px-6 py-2 bg-primary-blue text-white rounded-xl font-bold hover:opacity-90 active:scale-95 transition-all">Jelajahi Materi</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {savedLessons.map((l) => (
            <div key={l.id} className="border border-gray-100 dark:border-gray-800 bg-white dark:bg-slate p-5 rounded-2xl flex flex-col hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-bold px-3 py-1 bg-orange-100 dark:bg-orange-500/10 text-orange-600 rounded-full">
                  Level {l.level}
                </span>
                <span className="text-[10px] uppercase font-bold text-gray-400 bg-gray-50 dark:bg-gray-800 px-2 py-0.5 rounded">{l.category}</span>
              </div>
              <h3 className="font-bold tracking-tight text-xl text-navy dark:text-white mb-2">{l.title}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 flex-1 line-clamp-2">
                {l.description}
              </p>
              <button 
                onClick={() => handleLessonStart(l.id)}
                className="flex items-center justify-center gap-2 w-full py-3 bg-gray-50 dark:bg-gray-800 text-primary-blue font-bold rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
              >
                Lanjutkan Membaca
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
