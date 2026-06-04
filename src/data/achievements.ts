import { Award, Star, Zap, Shield, Crown, Terminal, MessageCircle, Heart, Clock, Code, BookOpen, Target, Rocket } from 'lucide-react';
import type { ElementType } from 'react';

export type Rarity = 'Common' | 'Rare' | 'Epic' | 'Legendary';

export interface BadgeDef {
  id: string;
  title: string;
  desc: string;
  icon: ElementType;
  color: string;
  bg: string;
  rarity: Rarity;
  condition: (progress: any) => boolean;
  getProgress: (progress: any) => { current: number; target: number; label: string };
}

export const ACHIEVEMENTS: BadgeDef[] = [
  // Learning
  { id: 'l1', title: 'First Lesson', desc: 'Selesaikan materi pertama', icon: Star, color: 'text-yellow-500', bg: 'bg-yellow-500/10', rarity: 'Common', condition: p => (p.completedLessons?.length || 0) >= 1, getProgress: p => ({ current: p.completedLessons?.length || 0, target: 1, label: 'materi' }) },
  { id: 'l2', title: '10 Lessons', desc: 'Selesaikan 10 materi', icon: BookOpen, color: 'text-orange-500', bg: 'bg-orange-500/10', rarity: 'Rare', condition: p => (p.completedLessons?.length || 0) >= 10, getProgress: p => ({ current: p.completedLessons?.length || 0, target: 10, label: 'materi' }) },
  { id: 'l3', title: '25 Lessons', desc: 'Selesaikan 25 materi', icon: Target, color: 'text-red-500', bg: 'bg-red-500/10', rarity: 'Epic', condition: p => (p.completedLessons?.length || 0) >= 25, getProgress: p => ({ current: p.completedLessons?.length || 0, target: 25, label: 'materi' }) },
  { id: 'l4', title: '50 Lessons', desc: 'Selesaikan 50 materi', icon: Award, color: 'text-pink-500', bg: 'bg-pink-500/10', rarity: 'Legendary', condition: p => (p.completedLessons?.length || 0) >= 50, getProgress: p => ({ current: p.completedLessons?.length || 0, target: 50, label: 'materi' }) },
  // XP
  { id: 'x1', title: '100 XP', desc: 'Kumpulkan 100 XP pertamamu', icon: Zap, color: 'text-blue-500', bg: 'bg-blue-500/10', rarity: 'Common', condition: p => (p.xp || 0) >= 100, getProgress: p => ({ current: p.xp || 0, target: 100, label: 'XP' }) },
  { id: 'x2', title: '500 XP', desc: 'Kumpulkan 500 XP', icon: Zap, color: 'text-blue-600', bg: 'bg-blue-600/10', rarity: 'Rare', condition: p => (p.xp || 0) >= 500, getProgress: p => ({ current: p.xp || 0, target: 500, label: 'XP' }) },
  { id: 'x3', title: '1000 XP', desc: 'Kumpulkan 1000 XP', icon: Zap, color: 'text-indigo-500', bg: 'bg-indigo-500/10', rarity: 'Epic', condition: p => (p.xp || 0) >= 1000, getProgress: p => ({ current: p.xp || 0, target: 1000, label: 'XP' }) },
  { id: 'x4', title: '5000 XP', desc: 'Kumpulkan 5000 XP', icon: Crown, color: 'text-purple-500', bg: 'bg-purple-500/10', rarity: 'Legendary', condition: p => (p.xp || 0) >= 5000, getProgress: p => ({ current: p.xp || 0, target: 5000, label: 'XP' }) },
  // Streak
  { id: 's1', title: '3 Day Streak', desc: 'Belajar 3 hari berturut-turut', icon: Clock, color: 'text-emerald-500', bg: 'bg-emerald-500/10', rarity: 'Rare', condition: p => (p.streak || 0) >= 3, getProgress: p => ({ current: p.streak || 0, target: 3, label: 'hari' }) },
  { id: 's2', title: '7 Day Streak', desc: 'Belajar 7 hari berturut-turut', icon: Clock, color: 'text-emerald-500', bg: 'bg-emerald-500/10', rarity: 'Epic', condition: p => (p.streak || 0) >= 7, getProgress: p => ({ current: p.streak || 0, target: 7, label: 'hari' }) },
  { id: 's3', title: '30 Day Streak', desc: 'Belajar 30 hari berturut-turut', icon: Shield, color: 'text-teal-500', bg: 'bg-teal-500/10', rarity: 'Legendary', condition: p => (p.streak || 0) >= 30, getProgress: p => ({ current: p.streak || 0, target: 30, label: 'hari' }) },
  // Community
  { id: 'c1', title: 'First Like', desc: 'Sukai satu postingan', icon: Heart, color: 'text-rose-500', bg: 'bg-rose-500/10', rarity: 'Common', condition: () => false, getProgress: () => ({ current: 0, target: 1, label: 'like' }) },
  { id: 'c2', title: 'First Comment', desc: 'Tulis komentar pertamamu', icon: MessageCircle, color: 'text-sky-500', bg: 'bg-sky-500/10', rarity: 'Common', condition: () => false, getProgress: () => ({ current: 0, target: 1, label: 'komentar' }) },
  { id: 'c3', title: '10 Likes Received', desc: 'Dapatkan 10 Like dari orang lain', icon: Heart, color: 'text-red-500', bg: 'bg-red-500/10', rarity: 'Rare', condition: () => false, getProgress: () => ({ current: 0, target: 10, label: 'like' }) },
  { id: 'c4', title: '50 Likes Received', desc: 'Dapatkan 50 Like', icon: Heart, color: 'text-red-600', bg: 'bg-red-600/10', rarity: 'Epic', condition: () => false, getProgress: () => ({ current: 0, target: 50, label: 'like' }) },
  // Special
  { id: 'sp1', title: 'First Code', desc: 'Jalankan kode pertama', icon: Terminal, color: 'text-slate-500', bg: 'bg-slate-500/10', rarity: 'Common', condition: p => (p.completedLessons?.length || 0) >= 1, getProgress: p => ({ current: p.completedLessons?.length || 0, target: 1, label: 'kode' }) },
  { id: 'sp2', title: 'HTML Beginner', desc: 'Selesaikan modul HTML Dasar', icon: Code, color: 'text-orange-500', bg: 'bg-orange-500/10', rarity: 'Rare', condition: p => (p.completedLessons?.length || 0) >= 8, getProgress: p => ({ current: p.completedLessons?.length || 0, target: 8, label: 'materi' }) },
  { id: 'sp3', title: 'Night Owl', desc: 'Belajar di atas jam 10 malam', icon: Star, color: 'text-indigo-400', bg: 'bg-indigo-400/10', rarity: 'Epic', condition: () => false, getProgress: () => ({ current: 0, target: 1, label: 'sesi' }) },
  { id: 'sp4', title: 'Early Bird', desc: 'Belajar sebelum jam 6 pagi', icon: Zap, color: 'text-yellow-400', bg: 'bg-yellow-400/10', rarity: 'Epic', condition: () => false, getProgress: () => ({ current: 0, target: 1, label: 'sesi' }) },
  { id: 'sp5', title: 'Fast Learner', desc: 'Naik level dalam waktu singkat', icon: Rocket, color: 'text-red-500', bg: 'bg-red-500/10', rarity: 'Legendary', condition: p => (p.level || 1) >= 2, getProgress: p => ({ current: p.level || 1, target: 2, label: 'level' }) },
];
