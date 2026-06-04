import React, { useState, useRef, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { lessons } from '../data/lessons';
import { Play, CheckCircle2, Flame, Sparkles, BookOpen, Search, X } from 'lucide-react';

export default function Explore() {
  const { t, language, setView, setActiveLessonId, progress } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLessonStart = (id: string) => {
    setActiveLessonId(id);
    setView('lesson');
  };

  const trendingLessons = lessons.slice(2, 4);
  const recommendedLessons = lessons.slice(0, 2);
  const miniProjects = lessons.filter(l => l.level === 10);
  
  const categoriesList = [
    { name: 'HTML', color: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400' },
    { name: 'CSS', color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' },
    { name: 'JavaScript', color: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400' },
    { name: 'GitHub', color: 'bg-stone-200 text-stone-700 dark:bg-stone-800 dark:text-stone-300' },
  ];

  const searchResults = searchQuery.trim() !== '' 
    ? lessons.filter(lesson => {
        const query = searchQuery.toLowerCase();
        const titleMatch = (language === 'id' ? lesson.title : lesson.titleEn).toLowerCase().includes(query);
        const descMatch = (language === 'id' ? lesson.description : lesson.descriptionEn)?.toLowerCase().includes(query) || false;
        const categoryMatch = lesson.category.toLowerCase().includes(query);
        return titleMatch || descMatch || categoryMatch;
      })
    : [];

  const suggestions = searchQuery.trim() !== ''
    ? [
        ...Array.from(new Set(lessons.map(l => l.category))).filter(category => category.toLowerCase().includes(searchQuery.toLowerCase())),
        ...Array.from(new Set(lessons.map(l => language === 'id' ? l.title : l.titleEn))).filter(title => title.toLowerCase().includes(searchQuery.toLowerCase()))
      ].slice(0, 5)
    : [];

  const LessonCard = ({ lesson, layout = 'horizontal' }: { lesson: any, layout?: 'horizontal' | 'vertical' }) => {
    const isCompleted = progress.completedLessons.includes(lesson.id);
    if (layout === 'vertical') {
      return (
        <div 
          onClick={() => handleLessonStart(lesson.id)}
          className={`group bg-white dark:bg-slate p-5 rounded-2xl border ${isCompleted ? 'border-primary-blue/30 dark:border-primary-blue/30 bg-blue-50/10 dark:bg-primary-blue/5' : 'border-gray-100 dark:border-gray-800'} cursor-pointer hover:shadow-md transition-all duration-300 hover:border-primary-blue/50 flex flex-col h-full`}
        >
          <div className="flex justify-between items-start mb-3">
             <span className="inline-flex items-center text-[10px] uppercase tracking-wide font-bold bg-gray-100 dark:bg-gray-800 text-gray-500 px-2 py-0.5 rounded">
                ⏱ {lesson.duration} Menit
             </span>
             {isCompleted && <CheckCircle2 className="w-5 h-5 text-green-500" />}
          </div>
          <h3 className="font-bold text-navy dark:text-white text-base leading-tight mb-2">{language === 'id' ? lesson.title : lesson.titleEn}</h3>
          <p className="text-sm text-gray-500 line-clamp-2 mb-4">{language === 'id' ? lesson.description : lesson.descriptionEn}</p>
          <div className="mt-auto flex justify-between items-center w-full">
            <span className="text-xs font-bold text-primary-blue opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-300">
              Mulai Belajar &rarr;
            </span>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors shadow-sm ${isCompleted ? 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400' : 'bg-blue-50 text-primary-blue dark:bg-gray-800/50'} group-hover:bg-primary-blue group-hover:text-white`}>
              <Play className="w-4 h-4 ml-0.5" />
            </div>
          </div>
        </div>
      );
    }
    
    return (
      <div 
        onClick={() => handleLessonStart(lesson.id)}
        className={`group bg-white dark:bg-slate p-5 rounded-2xl border ${isCompleted ? 'border-primary-blue/30 dark:border-primary-blue/30 bg-blue-50/10 dark:bg-primary-blue/5' : 'border-gray-100 dark:border-gray-800'} flex items-center justify-between cursor-pointer hover:shadow-md transition-all duration-300 hover:border-primary-blue/50 flex-col sm:flex-row gap-4 sm:gap-0`}
      >
        <div className="flex-1 w-full relative">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center text-[10px] uppercase tracking-wide font-bold bg-gray-100 dark:bg-gray-800 text-gray-500 px-2 py-0.5 rounded">
              ⏱ {lesson.duration} Menit
            </span>
            {isCompleted && (
              <span className="inline-flex items-center text-[10px] uppercase tracking-wide font-bold bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-2 py-0.5 rounded gap-1">
                <CheckCircle2 className="w-3 h-3" /> Selesai
              </span>
            )}
          </div>
          <h3 className="font-bold text-navy dark:text-white text-base leading-tight mb-1">
            {language === 'id' ? lesson.title : lesson.titleEn}
          </h3>
          <p className="text-sm text-gray-500 line-clamp-2">
            {language === 'id' ? lesson.description : lesson.descriptionEn}
          </p>
        </div>
        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shrink-0 sm:ml-6 transition-colors shadow-sm self-end sm:self-center ${isCompleted ? 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400' : 'bg-blue-50 text-primary-blue dark:bg-gray-800/50'} group-hover:bg-primary-blue group-hover:text-white`}>
          <Play className="w-4 h-4 ml-0.5" />
        </div>
      </div>
    );
  };

  return (
    <div className="pb-24 lg:pb-8 pt-8 px-6 max-w-5xl mx-auto w-full focus:outline-none">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-navy dark:text-white mb-2">{t('explore.title')}</h1>
        <p className="text-gray-500 font-medium">{t('explore.subtitle')}</p>
      </div>
      
      {/* Search Bar */}
      <div className="mb-8 relative" ref={searchRef}>
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder={language === 'id' ? "Cari materi atau topik..." : "Search lessons or topics..."}
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setShowSuggestions(true);
            setSelectedIndex(-1);
          }}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={(e) => {
            if (!showSuggestions || suggestions.length === 0) return;
            if (e.key === 'ArrowDown') {
              e.preventDefault();
              setSelectedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev));
            } else if (e.key === 'ArrowUp') {
              e.preventDefault();
              setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev));
            } else if (e.key === 'Enter' && selectedIndex >= 0) {
              e.preventDefault();
              setSearchQuery(suggestions[selectedIndex]);
              setShowSuggestions(false);
              setSelectedIndex(-1);
            } else if (e.key === 'Escape') {
              setShowSuggestions(false);
              setSelectedIndex(-1);
            }
          }}
          className="w-full bg-white dark:bg-slate border border-gray-200 dark:border-gray-800 rounded-2xl py-3.5 pl-11 pr-10 outline-none focus:border-primary-blue focus:ring-1 focus:ring-primary-blue text-navy dark:text-white transition-all shadow-sm"
        />
        {searchQuery && (
          <button
            onClick={() => {
              setSearchQuery('');
              setShowSuggestions(false);
            }}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        )}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute z-20 w-full mt-2 bg-white dark:bg-slate border border-gray-100 dark:border-gray-800 rounded-xl shadow-lg overflow-hidden">
            {suggestions.map((suggestion, idx) => (
              <div 
                key={idx}
                className={`px-4 py-3 cursor-pointer flex items-center gap-3 border-b border-gray-50 dark:border-gray-800 last:border-0 transition-colors ${selectedIndex === idx ? 'bg-blue-50 dark:bg-gray-800' : 'hover:bg-blue-50 dark:hover:bg-gray-800'}`}
                onClick={() => {
                  setSearchQuery(suggestion);
                  setShowSuggestions(false);
                  setSelectedIndex(-1);
                }}
              >
                <Search className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium text-navy dark:text-white">{suggestion}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {searchQuery.trim() !== '' ? (
        <div className="mb-10">
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center">
            <Search className="w-4 h-4 mr-2" />
            {language === 'id' ? 'Hasil Pencarian' : 'Search Results'}
          </h2>
          {searchResults.length > 0 ? (
            <div className="flex flex-col gap-3">
              {searchResults.map(lesson => <LessonCard key={lesson.id} lesson={lesson} layout="horizontal" />)}
            </div>
          ) : (
            <div className="py-12 bg-white dark:bg-slate border border-dashed border-gray-200 dark:border-gray-800 rounded-2xl text-center">
              <p className="text-gray-500 font-medium">{language === 'id' ? 'Tidak ada materi yang cocok.' : 'No lessons found matching your criteria.'}</p>
            </div>
          )}
        </div>
      ) : (
        <>
          {/* Categories Horizontal */}
          <div className="mb-10">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">{t('explore.categories_header')}</h2>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {categoriesList.map(cat => (
                 <div 
                  key={cat.name} 
                  onClick={() => setSearchQuery(cat.name)}
                  className={`px-5 py-3 rounded-xl font-bold text-sm shrink-0 cursor-pointer hover:opacity-80 transition-opacity ${cat.color}`}
                 >
                    {cat.name}
                 </div>
              ))}
            </div>
          </div>

          {/* Recommended for you */}
          <div className="mb-10">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center">
              <Sparkles className="w-4 h-4 mr-2 text-yellow-500" />
              Rekomendasi Untukmu
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {recommendedLessons.map(lesson => <LessonCard key={lesson.id} lesson={lesson} layout="vertical" />)}
            </div>
          </div>

          {/* Trending Topics */}
          <div className="mb-10">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center">
              <Flame className="w-4 h-4 mr-2 text-orange-500" />
              Sedang Trending
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {trendingLessons.map(lesson => <LessonCard key={lesson.id} lesson={lesson} layout="vertical" />)}
            </div>
          </div>

          {/* Mini Projects */}
          <div className="mb-10">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center">
              <BookOpen className="w-4 h-4 mr-2 text-primary-blue" />
              Mini Projects Pilihan
            </h2>
            <div className="flex flex-col gap-3">
              {miniProjects.map(lesson => <LessonCard key={lesson.id} lesson={lesson} layout="horizontal" />)}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
