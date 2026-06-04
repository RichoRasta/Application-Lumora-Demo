import React from 'react';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';

export default function Splash() {
  const { view, t } = useAppContext();

  if (view !== 'splash') return null;

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white dark:bg-navy z-[100]">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col items-center"
      >
        <div className="w-20 h-20 bg-primary-blue rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-primary-blue/20">
          <Sparkles className="text-white w-10 h-10" />
        </div>
        <motion.h1 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-4xl font-bold tracking-tight text-navy dark:text-white"
        >
          LUMORA
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="text-gray-500 dark:text-gray-400 mt-2 text-sm font-medium tracking-wide"
        >
          {t('app.tagline')}
        </motion.p>
      </motion.div>
    </div>
  );
}
