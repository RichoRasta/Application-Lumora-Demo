import React from 'react';
import { AlertCircle, CheckCircle2, ChevronRight } from 'lucide-react';

export type LogLevel = 'info' | 'error' | 'success' | 'warn';

export interface ConsoleLog {
  id: string;
  level: LogLevel;
  message: string;
}

interface ConsoleOutputProps {
  logs: ConsoleLog[];
  onClear: () => void;
}

export default function ConsoleOutput({ logs, onClear }: ConsoleOutputProps) {
  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-[#0F172A] text-gray-800 dark:text-gray-300 font-mono text-sm rounded-xl overflow-hidden shadow-inner border border-gray-200 dark:border-gray-800 transition-colors duration-300">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-100 dark:bg-[#1E293B] border-b border-gray-200 dark:border-gray-800 shrink-0 transition-colors duration-300">
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Console Output</span>
        <button onClick={onClear} className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">Clear</button>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {logs.length === 0 ? (
          <div className="text-gray-400 dark:text-gray-500 px-2 py-1 text-xs italic tracking-wide">Menunggu output...</div>
        ) : (
          logs.map((log) => (
            <div key={log.id} className={`flex items-start px-2 py-1.5 rounded border border-transparent transition-colors ${
              log.level === 'error' ? 'text-red-600 bg-red-50 border-red-100 dark:text-red-400 dark:bg-red-950/40 dark:border-red-900/50' :
              log.level === 'success' ? 'text-green-600 bg-green-50 border-green-100 dark:text-green-400 dark:bg-green-950/40 dark:border-green-900/50' :
              log.level === 'warn' ? 'text-yellow-600 bg-yellow-50 border-yellow-100 dark:text-yellow-400 dark:bg-yellow-950/40 dark:border-yellow-900/50' :
              'text-blue-600 bg-blue-50 border-blue-100 dark:text-blue-300 dark:bg-slate-800/50 dark:border-slate-700/50'
            }`}>
              <span className="shrink-0 mt-0.5 mr-2 opacity-80">
                {log.level === 'error' && <AlertCircle className="w-4 h-4" />}
                {log.level === 'success' && <CheckCircle2 className="w-4 h-4" />}
                {log.level === 'warn' && <AlertCircle className="w-4 h-4" />}
                {log.level === 'info' && <ChevronRight className="w-4 h-4" />}
              </span>
              <span className="break-all whitespace-pre-wrap font-mono text-xs">{log.message}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
