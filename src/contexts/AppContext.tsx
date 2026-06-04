import React, { createContext, useContext, useState, useEffect } from "react";
import {
  Theme,
  Language,
  ViewState,
  LearningStyle,
  UserProgress,
} from "../types";
import { translations } from "../data/translations";
import { onAuthStateChanged, User, signOut } from "firebase/auth";
import { auth, db } from "../lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

const defaultProgress: UserProgress = {
  completedLessons: [],
  completedChallenges: [],
  bookmarks: [],
  streak: 0,
  longestStreak: 0,
  lastActive: new Date().toISOString(),
  achievements: [],
  xp: 0,
  level: 1,
  studyTime: 0,
  dailyGoal: 30,
};

// eslint-disable-next-line react-refresh/only-export-components
export const AppContext = createContext<any>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem("theme");
    if (saved === 'light') return 'light-modern';
    if (saved === 'dark') return 'github-dark';
    return (saved as Theme) || "github-dark";
  });
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem("language");
    return (saved as Language) || "id";
  });
  const [view, setView] = useState<ViewState>("splash");
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [learningStyle, setLearningStyle] = useState<LearningStyle>("step");

  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isDataLoaded, setIsDataLoaded] = useState<boolean>(false);

  const [progress, setProgress] = useState<UserProgress>(defaultProgress);
  const [recentAchievement, setRecentAchievement] = useState<string | null>(null);

  // Auth Listener
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setIsAuthenticated(!!currentUser);
      
      if (currentUser) {
        try {
          const userRef = doc(db, "users", currentUser.uid);
          const userDoc = await getDoc(userRef);
  
          if (userDoc.exists()) {
            const data = userDoc.data();
            
            // Maintain nested legacy `progress` or flat structure
            const loadedProgress: UserProgress = data.progress 
              ? data.progress // old format
              : {
                  ...defaultProgress,
                  completedLessons: data.completedLessons || [],
                  completedChallenges: data.completedChallenges || [],
                  bookmarks: data.bookmarks || [],
                  streak: data.streak || 0,
                  longestStreak: data.longestStreak || 0,
                  lastActive: data.lastLoginAt || new Date().toISOString(),
                  lastActiveLessonId: data.lastActiveLessonId,
                  achievements: data.achievements || [],
                  achievementDates: data.achievementDates,
                  xp: data.xp || 0,
                  level: data.level || 1,
                  studyTime: data.studyTime || 0,
                  dailyGoal: data.dailyGoal || 30,
                  studyHistory: data.studyHistory,
                };
            
            setProgress(loadedProgress);
            
            // Update lastLoginAt
            await setDoc(userRef, { lastLoginAt: new Date().toISOString() }, { merge: true });
          } else {
            // Create user document with flat schema
            const newDoc = {
              uid: currentUser.uid,
              email: currentUser.email || '',
              displayName: currentUser.displayName || '',
              photoURL: currentUser.photoURL || '',
              createdAt: new Date().toISOString(),
              lastLoginAt: new Date().toISOString(),
              streak: 0,
              longestStreak: 0,
              xp: 0,
              level: 1,
              completedLessons: [],
              completedModules: [],
              completedChallenges: [],
              achievements: [],
              bookmarks: [],
              progressPercentage: 0
            };
            await setDoc(userRef, newDoc);
            setProgress(defaultProgress);
          }
          
          setIsDataLoaded(true);
        } catch (error) {
          console.error("Firebase Auth Config Error:", error);
          setProgress(defaultProgress); // Fallback so app doesn't crash
          setIsDataLoaded(true);
        }
      } else {
        setProgress(defaultProgress);
        setIsDataLoaded(true);
      }
      setIsAuthLoading(false);
    });

    return () => {
      unsubscribeAuth();
    };
  }, []);

  // Sync language with localStorage

  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  // Sync theme with document class
  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.documentElement.setAttribute('data-theme', theme);
    if (theme !== "light-modern") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  // Splash screen transition
  useEffect(() => {
    if (view === "splash" && !isAuthLoading) {
      setTimeout(() => {
        if (user) {
          setView("home");
        } else {
          setView("onboarding");
        }
      }, 2500);
    }
  }, [view, isAuthLoading, user]);

  const loginState = (isGuest: boolean) => {
    if (isGuest) {
      setIsAuthenticated(false);
      setView("home");
    }
  };

  const logout = async () => {
    await signOut(auth);
    setIsAuthenticated(false);
    setView("login");
  };

  const toggleBookmark = (id: string) => {
    setProgress((prev) => {
      const isM = prev.bookmarks.includes(id);
      return {
        ...prev,
        bookmarks: isM
          ? prev.bookmarks.filter((b) => b !== id)
          : [...prev.bookmarks, id],
      };
    });
  };

  const markLessonComplete = (id: string) => {
    setProgress((prev) => {
      if (!prev.completedLessons.includes(id)) {
        return { ...prev, completedLessons: [...prev.completedLessons, id] };
      }
      return prev;
    });
  };

  const markChallengeComplete = (id: string) => {
    setProgress((prev) => {
      // Handle the case where completedChallenges might be undefined from older Firestore data
      const completedChallenges = prev.completedChallenges || [];
      if (!completedChallenges.includes(id)) {
        return { ...prev, completedChallenges: [...completedChallenges, id] };
      }
      return prev;
    });
  };

  const addXp = (amount: number) => {
    setProgress((prev) => {
      const currentXp = (prev.xp || 0) + amount;
      let newLevel = prev.level || 1;
      
      // Level calculation: next level requires 500 XP
      // (Simple formula for prototype: every 500 XP = 1 level)
      while (currentXp >= newLevel * 500) {
        newLevel++;
      }
      
      return { ...prev, xp: currentXp, level: newLevel };
    });
  };

  const updateStudyTime = (minutes: number) => {
    const today = new Date().toISOString().split('T')[0];
    setProgress((prev) => {
      const currentHistory = prev.studyHistory || {};
      const todayMinutes = (currentHistory[today] || 0) + minutes;
      return {
        ...prev,
        studyTime: (prev.studyTime || 0) + minutes,
        studyHistory: {
          ...currentHistory,
          [today]: todayMinutes
        }
      };
    });
  };

  const setDailyGoal = (minutes: number) => {
    setProgress((prev) => ({
      ...prev,
      dailyGoal: minutes
    }));
  };

  const addAchievement = (id: string, notify: boolean = true) => {
    setProgress((prev) => {
      const existing = prev.achievements || [];
      if (!existing.includes(id)) {
        const now = new Date().toISOString();
        if (notify) {
          setRecentAchievement(id);
          setTimeout(() => setRecentAchievement(null), 4000);
        }
        return { 
          ...prev, 
          achievements: [...existing, id],
          achievementDates: {
            ...(prev.achievementDates || {}),
            [id]: now
          }
        };
      }
      return prev;
    });
  };

  // Check achievements automatically
  useEffect(() => {
    const newlyUnlocked: string[] = [];
    import('../data/achievements').then(({ ACHIEVEMENTS }) => {
      ACHIEVEMENTS.forEach((badge) => {
        if (!progress.achievements?.includes(badge.id) && badge.condition(progress)) {
          newlyUnlocked.push(badge.id);
        }
      });
      if (newlyUnlocked.length > 0) {
        newlyUnlocked.forEach(id => {
          setTimeout(() => addAchievement(id, true), 0);
        });
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress.xp, progress.level, progress.completedLessons?.length, progress.streak]);

  // Sync Progress to Firestore when authenticated
  useEffect(() => {
    if (user && !isAuthLoading && isDataLoaded) {
      const updateProgress = async () => {
        try {
          const userRef = doc(db, "users", user.uid);
          
          // Total items check for arbitrary percentage calculation if real count varies
          const maxLessons = 50; 
          const progressPercentage = Math.min(100, Math.round((progress.completedLessons.length / maxLessons) * 100));

          await setDoc(userRef, { 
            uid: user.uid,
            streak: progress.streak,
            longestStreak: progress.longestStreak,
            xp: progress.xp,
            level: progress.level,
            completedLessons: progress.completedLessons,
            completedChallenges: progress.completedChallenges,
            bookmarks: progress.bookmarks,
            lastActiveLessonId: progress.lastActiveLessonId || null,
            achievements: progress.achievements,
            achievementDates: progress.achievementDates || null,
            studyTime: progress.studyTime,
            dailyGoal: progress.dailyGoal,
            studyHistory: progress.studyHistory || null,
            progressPercentage,
            // Only update if changes occur to prevent infinite loops, merge true maintains backward compat.
            progress 
          }, { merge: true });
        } catch (error) {
          console.error("Firebase Sync Error: Could not save progress.", error);
        }
      };
      
      // Debounce writing
      const timeoutId = setTimeout(() => {
        updateProgress();
      }, 800);
      
      return () => clearTimeout(timeoutId);
    }
  }, [progress, user, isAuthLoading, isDataLoaded]);

  const updateLastActiveLesson = (id: string) => {
    setProgress((prev) => {
      if (prev.lastActiveLessonId === id) return prev;
      return {
        ...prev,
        lastActiveLessonId: id
      };
    });
  };

  const isBookmarked = (id: string) => progress.bookmarks.includes(id);

  const t = (key: string) => {
    const langDict = (translations as any)[language];
    const idDict = (translations as any)['id'];
    
    if (langDict && langDict[key]) return langDict[key];
    if (idDict && idDict[key]) return idDict[key];
    
    return language === 'en' ? "Text unavailable" : "Teks tidak tersedia";
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        setTheme,
        language,
        setLanguage,
        view,
        setView,
        activeLessonId,
        setActiveLessonId,
        progress,
        recentAchievement,
        setRecentAchievement,
        markLessonComplete,
        markChallengeComplete,
        updateLastActiveLesson,
        toggleBookmark,
        isBookmarked,
        addXp,
        updateStudyTime,
        setDailyGoal,
        addAchievement,
        learningStyle,
        setLearningStyle,
        user,
        isAuthLoading,
        isAuthenticated,
        loginState,
        logout,
        t,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAppContext = () => useContext(AppContext);
