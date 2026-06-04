export type ThemeType = 'light-modern' | 'github-dark' | 'dracula' | 'nord' | 'solarized-dark' | 'cyberpunk' | 'matrix' | 'ocean-blue';
export type Theme = ThemeType;
export type Language = 'id' | 'en';
export type ViewState = 'splash' | 'onboarding' | 'home' | 'explore' | 'practice' | 'profile' | 'lesson' | 'login' | 'achievements' | 'leaderboard' | 'daily_mission' | 'roadmap' | 'saved_lessons' | 'notes' | 'challenges' | 'community' | 'certificates' | 'learning_stats';
export type LearningStyle = 'visual' | 'step' | 'fast';

export interface UserProgress {
  completedLessons: string[];
  completedChallenges: string[];
  bookmarks: string[];
  streak: number;
  longestStreak: number;
  lastActive: string;
  lastActiveLessonId?: string;
  achievements: string[];
  achievementDates?: Record<string, string>;
  xp: number;
  level: number;
  studyTime: number; // in minutes (total)
  dailyGoal: number; // in minutes
  studyHistory?: Record<string, number>; // date "YYYY-MM-DD" -> minutes
}

export interface Lesson {
  id: string;
  level: number;
  title: string;
  titleEn: string;
  category: string;
  duration: string; // e.g., '5' for 5 minutes
  description: string;
  descriptionEn: string;
  whatYouWillLearn?: string[];
  whatYouWillLearnEn?: string[];
  finalResultPreview?: string;
  content: string; // Markdown or simple HTML
  contentEn: string;
  analogy: string;
  analogyEn: string;
  starterCode?: {
    html: string;
    css: string;
    js: string;
  };
  challenge?: string;
  challengeEn?: string;
  whyLearnThis: string;
  whyLearnThisEn: string;
  codeExplanation?: string; // Penjelasan code baris per baris
  codeExplanationEn?: string;
  commonErrors?: string; // Kesalahan umum
  commonErrorsEn?: string;
  errorFix?: string; // Cara memperbaiki error
  errorFixEn?: string;
}

export interface AppContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  view: ViewState;
  setView: (view: ViewState) => void;
  activeLessonId: string | null;
  setActiveLessonId: (id: string | null) => void;
  progress: UserProgress;
  recentAchievement: string | null;
  setRecentAchievement: (id: string | null) => void;
  markLessonComplete: (id: string) => void;
  toggleBookmark: (id: string) => void;
  isBookmarked: (id: string) => boolean;
  addXp: (amount: number) => void;
  updateStudyTime: (minutes: number) => void;
  setDailyGoal: (minutes: number) => void;
  addAchievement: (id: string) => void;
  learningStyle: LearningStyle;
  setLearningStyle: (style: LearningStyle) => void;
  isAuthenticated: boolean;
  loginState: (isGuest: boolean) => void;
  logout: () => void;
  t: (key: string) => string;
}
