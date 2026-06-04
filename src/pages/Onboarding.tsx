import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, TerminalSquare, Sparkles, ChevronRight } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';

export default function Onboarding() {
  const { t, setView } = useAppContext();
  const [step, setStep] = useState(0);

  const slides = [
    {
      icon: BookOpen,
      title: t('onboard.1.title'),
      desc: t('onboard.1.desc'),
      color: 'bg-soft-blue',
      iconColor: 'text-primary-blue'
    },
    {
      icon: TerminalSquare,
      title: t('onboard.2.title'),
      desc: t('onboard.2.desc'),
      color: 'bg-soft-purple',
      iconColor: 'text-primary-purple'
    },
    {
      icon: Sparkles,
      title: t('onboard.3.title'),
      desc: t('onboard.3.desc'),
      color: 'bg-green-50 dark:bg-green-900/20',
      iconColor: 'text-green-600 dark:text-green-400'
    }
  ];

  const handleNext = () => {
    if (step < slides.length - 1) {
      setStep(step + 1);
    } else {
      setView('login');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-navy">
      <div className="flex-1 flex flex-col justify-center items-center px-8 text-center max-w-md mx-auto w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center w-full"
          >
            <div className={`w-32 h-32 rounded-[2rem] ${slides[step].color} dark:bg-opacity-10 mb-8 flex items-center justify-center`}>
              {React.createElement(slides[step].icon, { className: `w-14 h-14 ${slides[step].iconColor}` })}
            </div>
            <h2 className="text-2xl font-bold mb-4 text-navy dark:text-white leading-tight">
              {slides[step].title}
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              {slides[step].desc}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="p-8 w-full max-w-md mx-auto">
        <div className="flex justify-center space-x-2 mb-8">
          {slides.map((_, i) => (
            <div 
              key={i} 
              className={`h-2 rounded-full transition-all duration-300 ${
                i === step ? 'w-8 bg-primary-blue' : 'w-2 bg-gray-200 dark:bg-gray-700'
              }`}
            />
          ))}
        </div>
        <button
          onClick={handleNext}
          className="w-full bg-navy dark:bg-primary-blue text-white py-4 rounded-2xl font-semibold flex items-center justify-center shadow-lg active:scale-[0.98] transition-transform"
        >
          <span>{step === slides.length - 1 ? t('onboard.btn.start') : t('onboard.btn.next')}</span>
          {step < slides.length - 1 && <ChevronRight className="w-5 h-5 ml-2" />}
        </button>
      </div>
    </div>
  );
}
