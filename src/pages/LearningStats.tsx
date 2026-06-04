import React, { useMemo } from 'react';
import { BarChart3, Activity, Clock, Target, Rocket, Calendar, Check, X, Download } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import jsPDF from 'jspdf';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-navy border-none shadow-xl text-white p-3 rounded-xl text-sm font-bold">
        <p className="text-gray-300 text-xs uppercase tracking-wider mb-1">{label}</p>
        <p className="text-primary-blue">{payload[0].value} Menit</p>
      </div>
    );
  }
  return null;
};

export default function LearningStats() {
  const { t, progress } = useAppContext();
  
  const xp = progress.xp || 0;
  const streak = progress.streak || 0;
  const lessons = progress.completedLessons?.length || 0;
  const time = progress.studyTime || 0;

  const formatTime = (mins: number) => {
    if (mins < 60) return `${mins} Menit`;
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return m > 0 ? `${h} Jam ${m} Menit` : `${h} Jam`;
  };

  const isNewUser = xp === 0 && lessons === 0;

  const stats = [
    { label: 'Total XP', value: xp.toString(), icon: Target, color: 'text-primary-blue', bg: 'bg-blue-50 dark:bg-primary-blue/10' },
    { label: 'Streak Harian', value: `${streak} Hari`, icon: Activity, color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-500/10' },
    { label: 'Waktu Belajar', value: formatTime(time), icon: Clock, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
    { label: 'Modul Selesai', value: lessons.toString(), icon: BarChart3, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-500/10' },
  ];

  // Generate last 7 days for the calendar and chart
  const { weekDays, chartData } = useMemo(() => {
    const today = new Date();
    const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
    const wDays = [];
    const cData = [];
    
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      
      const daysAgo = i;
      const isActive = daysAgo < streak; 
      
      wDays.push({
        dayStr: dayNames[d.getDay()],
        dateNum: d.getDate(),
        isActive
      });

      const minutes = progress.studyHistory?.[dateStr] || 0;
      cData.push({
        name: dayNames[d.getDay()],
        minutes
      });
    }
    return { weekDays: wDays, chartData: cData };
  }, [streak, progress.studyHistory]);

  const handleDownloadReport = () => {
    const doc = new jsPDF();
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("LUMORA - Learning Progress Report", 20, 30);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(14);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 45);
    
    doc.text(`Level: ${progress.level || 1}`, 20, 60);
    doc.text(`Total XP: ${xp}`, 20, 70);
    doc.text(`Current Streak: ${streak} Hari`, 20, 80);
    doc.text(`Completed Lessons: ${lessons}`, 20, 90);
    doc.text(`Total Study Time: ${formatTime(time)}`, 20, 100);
    
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text("Keep learning coding from zero to hero!", 20, 120);
    
    doc.save("lumora-progress-report.pdf");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto pb-24 relative">
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4 text-center md:text-left">
        <div>
          <h1 className="text-3xl font-bold text-navy dark:text-white mb-2">{t('stats.title')}</h1>
          <p className="text-gray-500 dark:text-gray-400">{t('ui_18')}</p>
        </div>
        <button 
          onClick={handleDownloadReport}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-primary-blue text-white font-bold rounded-xl hover:bg-blue-600 transition-colors shadow-sm"
        >
          <Download className="w-4 h-4" />
          Download Report
        </button>
      </div>

      {isNewUser && (
         <div className="mb-8 p-6 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-2xl flex flex-col items-center text-center">
         <Rocket className="w-12 h-12 text-primary-blue mb-3 opacity-80" />
         <h3 className="font-bold text-navy dark:text-white mb-2">{t('ui_19')}</h3>
         <p className="text-sm text-gray-500">{t('ui_20')}</p>
       </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((st, i) => (
          <div key={i} className="bg-white dark:bg-slate border border-gray-100 dark:border-gray-800 p-5 rounded-2xl text-center flex flex-col items-center justify-center shadow-sm hover:scale-105 transition-transform duration-300">
            <div className={`p-3 rounded-full mb-3 ${st.bg}`}>
              <st.icon className={`w-6 h-6 ${st.color}`} />
            </div>
            <div className="text-2xl font-bold text-navy dark:text-white mb-1">{st.value}</div>
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">{st.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-slate border border-gray-100 dark:border-gray-800 p-6 rounded-3xl shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <Calendar className="w-5 h-5 text-primary-blue" />
            <h3 className="font-bold text-lg text-navy dark:text-white">{t('ui_22')}</h3>
          </div>
          <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl">
            {weekDays.map((wd, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <span className="text-xs font-bold text-gray-500 dark:text-gray-400">{wd.dayStr}</span>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${wd.isActive ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-500' : 'bg-gray-100 dark:bg-gray-800 text-gray-300 dark:text-gray-600'}`}>
                  {wd.isActive ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-slate border border-gray-100 dark:border-gray-800 p-6 rounded-3xl shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <Clock className="w-5 h-5 text-orange-500" />
            <h3 className="font-bold text-lg text-navy dark:text-white">{t('ui_21')}</h3>
          </div>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorMinutes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" opacity={0.5} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#9CA3AF', fontWeight: 'bold' }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#9CA3AF', fontWeight: 'bold' }} 
                />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#2563EB', strokeWidth: 1, strokeDasharray: '3 3' }} />
                <Area 
                  type="monotone" 
                  dataKey="minutes" 
                  stroke="#2563EB" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorMinutes)" 
                  activeDot={{ r: 6, fill: '#2563EB', stroke: '#fff', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
