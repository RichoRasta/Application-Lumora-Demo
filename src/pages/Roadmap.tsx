import React, { useMemo } from 'react';
import { Map, Lock, CheckCircle2, PlayCircle, GraduationCap } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';

export default function Roadmap() {
  const { progress, t } = useAppContext();
  const completed = progress.completedLessons.length;

  const htmlCompleted = completed >= 8;
  const cssCompleted = completed >= 15;
  const jsCompleted = completed >= 23;

  const steps = useMemo(() => {
    return [
      { 
        title: 'HTML Dasar', 
        topics: 'Tag, Heading, Paragraph, Link, Image, List, Table, Form',
        status: htmlCompleted ? 'completed' : (completed > 0 ? 'current' : 'locked'), 
        icon: htmlCompleted ? CheckCircle2 : (completed > 0 ? PlayCircle : Lock), 
        color: htmlCompleted ? 'text-emerald-500' : (completed > 0 ? 'text-primary-blue' : 'text-gray-400'), 
        bg: htmlCompleted ? 'bg-emerald-500' : (completed > 0 ? 'bg-primary-blue' : 'bg-gray-300 dark:bg-gray-700') 
      },
      { 
        title: 'CSS Dasar', 
        topics: 'Color, Margin, Padding, Border, Flexbox, Grid, Responsive Design',
        status: cssCompleted ? 'completed' : (htmlCompleted ? 'current' : 'locked'), 
        icon: cssCompleted ? CheckCircle2 : (htmlCompleted ? PlayCircle : Lock), 
        color: cssCompleted ? 'text-emerald-500' : (htmlCompleted ? 'text-primary-blue' : 'text-gray-400'), 
        bg: cssCompleted ? 'bg-emerald-500' : (htmlCompleted ? 'bg-primary-blue' : 'bg-gray-300 dark:bg-gray-700') 
      },
      { 
        title: 'JavaScript Dasar', 
        topics: 'Variable, Data Type, Function, Condition, Loop, Array, Object, DOM',
        status: jsCompleted ? 'completed' : (cssCompleted ? 'current' : 'locked'), 
        icon: jsCompleted ? CheckCircle2 : (cssCompleted ? PlayCircle : Lock), 
        color: jsCompleted ? 'text-emerald-500' : (cssCompleted ? 'text-primary-blue' : 'text-gray-400'), 
        bg: jsCompleted ? 'bg-emerald-500' : (cssCompleted ? 'bg-primary-blue' : 'bg-gray-300 dark:bg-gray-700') 
      },
      { 
        title: 'Mini Project Web', 
        topics: 'Gabungkan HTML, CSS, dan JS membuat Portofolio',
        status: completed >= 25 ? 'completed' : (jsCompleted ? 'current' : 'locked'), 
        icon: completed >= 25 ? CheckCircle2 : (jsCompleted ? PlayCircle : Lock), 
        color: completed >= 25 ? 'text-emerald-500' : (jsCompleted ? 'text-primary-blue' : 'text-gray-400'), 
        bg: completed >= 25 ? 'bg-emerald-500' : (jsCompleted ? 'bg-primary-blue' : 'bg-gray-300 dark:bg-gray-700') 
      },
    ];
  }, [completed, htmlCompleted, cssCompleted, jsCompleted]);

  return (
    <div className="p-6 max-w-2xl mx-auto pb-24 relative">
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-3xl font-bold text-navy dark:text-white mb-3 flex items-center justify-center md:justify-start gap-3">
          <Map className="w-8 h-8 text-primary-blue" /> {t('roadmap.title')}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base">{t('ui_31')}</p>
      </div>

      {completed === 0 && (
        <div className="mb-8 p-6 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-2xl flex flex-col items-center text-center">
          <GraduationCap className="w-12 h-12 text-primary-blue mb-3 opacity-80" />
          <h3 className="font-bold text-navy dark:text-white mb-2">{t('ui_32')}</h3>
          <p className="text-sm text-gray-500">{t('ui_33')}</p>
        </div>
      )}

      <div className="relative pl-8 space-y-12 before:absolute before:inset-0 before:ml-[39px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-1 before:bg-gradient-to-b before:from-emerald-500 before:via-primary-blue before:to-gray-200 dark:before:to-gray-800">
        {steps.map((step, idx) => (
          <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-white dark:border-slate shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 ${step.bg} absolute -left-[20px] md:relative md:left-0 z-10`}>
              <step.icon className={`w-5 h-5 text-white`} />
            </div>
            
            <div className={`w-[calc(100%-2.5rem)] md:w-[calc(50%-2.5rem)] p-5 rounded-2xl border shadow-sm ${
              step.status === 'current' 
                ? 'bg-blue-50/50 dark:bg-primary-blue/10 border-primary-blue dark:border-primary-blue/50 transform md:scale-105 transition-transform' 
                : step.status === 'completed'
                  ? 'bg-white dark:bg-slate border-emerald-500/30'
                  : 'bg-gray-50/50 dark:bg-slate/30 border-gray-100 dark:border-gray-800 opacity-60'
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div className={`font-bold text-lg leading-tight ${step.status === 'locked' ? 'text-gray-500' : 'text-navy dark:text-white'}`}>{step.title}</div>
                {step.status === 'completed' && <span className="text-[10px] w-fit font-bold text-emerald-500 bg-emerald-100 dark:bg-emerald-500/20 px-2 py-1 rounded-full uppercase tracking-wider">{t('ui_34')}</span>}
                {step.status === 'current' && <span className="text-[10px] w-fit font-bold text-white bg-primary-blue px-2 py-1 rounded-full shadow-md shadow-blue-500/30 uppercase tracking-wider">{t('ui_35')}</span>}
              </div>
              <div className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                {step.topics}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
