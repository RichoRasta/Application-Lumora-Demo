import fs from 'fs';
import path from 'path';

// Define translations mapping
const filesToTranslate = {
  'src/components/Navigation.tsx': [
    { target: `'Beranda'`, replacement: `t('nav.home')` },
    { target: `'Eksplor'`, replacement: `t('nav.explore')` },
    { target: `'Practice'`, replacement: `t('nav.practice')` },
    { target: `'Profil'`, replacement: `t('nav.profile')` },
    { target: `>Beranda<`, replacement: `>{t('nav.home')}<` },
    { target: `>Eksplor<`, replacement: `>{t('nav.explore')}<` },
    { target: `>Practice<`, replacement: `>{t('nav.practice')}<` },
    { target: `>Profil<`, replacement: `>{t('nav.profile')}<` },
  ],
  'src/pages/Home.tsx': [
    { target: `>Coder Pemula 👋<`, replacement: `>{t('home.coder_beginner')} 👋<` },
    { target: `>Hari<`, replacement: `>{t('home.days')}<` },
    { target: `>Misi Harian<`, replacement: `>{t('home.daily_mission')}<` },
    { target: `>Pencapaian<`, replacement: `>{t('home.achievements')}<` },
    { target: `>Sertifikat<`, replacement: `>{t('home.certificates')}<` },
    { target: `>Komunitas<`, replacement: `>{t('home.community')}<` },
    { target: `>Roadmap<`, replacement: `>{t('home.roadmap_title')}<` },
    { target: `>Leaderboard<`, replacement: `>{t('home.leaderboard')}<` },
    { target: `>Alur Belajar<`, replacement: `>{t('home.roadmap')}<` },
    { target: `>Materi Populer<`, replacement: `>{t('home.popular')}<` },
    { target: `>Lihat Semua<`, replacement: `>{t('common.see_all')}<` },
    { target: `>Praktek 15 Menit<`, replacement: `>{t('home.practice_15_min')}<` },
  ],
  'src/pages/Profile.tsx': [
    { target: `>Pengaturan<`, replacement: `>{t('profile.settings')}<` },
    { target: `>Profil Kamu<`, replacement: `>{t('profile.title')}<` },
    { target: `>Progress Belajar<`, replacement: `>{t('profile.progress')}<` },
    { target: `>Mode Gelap (Dark Mode)<`, replacement: `>{t('profile.theme')}<` },
    { target: `>Gaya Belajar<`, replacement: `>{t('profile.learningStyle')}<` },
    { target: `>Tersimpan<`, replacement: `>{t('profile.bookmarks')}<` },
    { target: `>Materi Selesai<`, replacement: `>{t('profile.completed')}<` },
    { target: `>Bahasa Aplikasi<`, replacement: `>{t('profile.app_language')}<` },
    { target: `>Masuk / Daftar<`, replacement: `>{t('profile.login')}<` },
    { target: `>Keluar<`, replacement: `>{t('profile.logout')}<` },
  ],
  'src/pages/DailyMission.tsx': [
    { target: `>Misi Harian<`, replacement: `>{t('daily_mission.title')}<` },
  ],
  'src/pages/Achievements.tsx': [
    { target: `>Pencapaian<`, replacement: `>{t('achievements.title')}<` },
  ],
  'src/pages/Certificates.tsx': [
    { target: `>Sertifikat<`, replacement: `>{t('certificates.title')}<` },
  ],
  'src/pages/Community.tsx': [
    { target: `>Komunitas<`, replacement: `>{t('community.title')}<` },
  ],
  'src/pages/Roadmap.tsx': [
    { target: `>Peta Perjalanan Belajar<`, replacement: `>{t('roadmap.title')}<` },
    { target: `>Alur Belajar<`, replacement: `>{t('roadmap.page_title')}<` },
  ],
  'src/pages/LearningStats.tsx': [
    { target: `>Statistik Belajarmu<`, replacement: `>{t('stats.title')}<` },
  ],
  'src/pages/Challenges.tsx': [
    { target: `>Mini Project Challenges<`, replacement: `>{t('challenges.title')}<` },
  ],
};

function processFiles() {
  for (const [filePath, replacements] of Object.entries(filesToTranslate)) {
    const fullPath = path.resolve(process.cwd(), filePath);
    if (fs.existsSync(fullPath)) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Also make sure useAppContext is imported and used
      if (!content.includes('const { t } = useAppContext()')) {
        const contextImport = content.match(/useAppContext\s*(?:,\s*)?[^}]*}/) ? '' : `import { useAppContext } from '../contexts/AppContext';\n`;
        const componentMatch = content.match(/export default function ([A-Za-z0-9_]+)\s*\([^)]*\)\s*{/);
        
        if (componentMatch) {
            content = content.replace(componentMatch[0], componentMatch[0] + `\n  const { t } = useAppContext();\n`);
            if (contextImport && !content.includes('import { useAppContext }')) {
                content = contextImport + content;
            }
        }
      }
      
      let modified = false;
      for (const { target, replacement } of replacements) {
        if (content.includes(target)) {
          content = content.split(target).join(replacement);
          modified = true;
        }
      }
      if (modified) {
        fs.writeFileSync(fullPath, content);
        console.log(`Updated ${filePath}`);
      }
    } else {
      console.log(`Not found: ${fullPath}`);
    }
  }
}

processFiles();
