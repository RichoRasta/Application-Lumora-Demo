import fs from 'fs';
import path from 'path';

const trans = {
  id: {
    'home.coder_beginner': 'Coder Pemula',
    'home.days': 'Hari',
    'home.daily_mission': 'Misi Harian',
    'home.achievements': 'Pencapaian',
    'home.certificates': 'Sertifikat',
    'home.community': 'Komunitas',
    'home.roadmap_title': 'Roadmap',
    'home.leaderboard': 'Leaderboard',
    'home.practice_15_min': 'Praktek 15 Menit',
    'common.see_all': 'Lihat Semua',
    'profile.app_language': 'Bahasa Aplikasi',
    'daily_mission.title': 'Misi Harian',
    'achievements.title': 'Pencapaian',
    'certificates.title': 'Sertifikat',
    'community.title': 'Komunitas',
    'roadmap.title': 'Peta Perjalanan Belajar',
    'roadmap.page_title': 'Alur Belajar',
    'stats.title': 'Statistik Belajarmu',
    'challenges.title': 'Mini Project Challenges',
  },
  en: {
    'home.coder_beginner': 'Beginner Coder',
    'home.days': 'Days',
    'home.daily_mission': 'Daily Mission',
    'home.achievements': 'Achievements',
    'home.certificates': 'Certificates',
    'home.community': 'Community',
    'home.roadmap_title': 'Roadmap',
    'home.leaderboard': 'Leaderboard',
    'home.practice_15_min': '15 Min Practice',
    'common.see_all': 'See All',
    'profile.app_language': 'App Language',
    'daily_mission.title': 'Daily Mission',
    'achievements.title': 'Achievements',
    'certificates.title': 'Certificates',
    'community.title': 'Community',
    'roadmap.title': 'Learning Roadmap',
    'roadmap.page_title': 'Learning Path',
    'stats.title': 'Learning Stats',
    'challenges.title': 'Mini Project Challenges',
  }
};

let content = fs.readFileSync('src/data/translations.ts', 'utf8');

const insertKeys = (lang) => {
    let toInsert = '';
    for(let k in trans[lang]) {
        if (!content.includes("'" + k + "':")) {
            toInsert += "    '" + k + "': '" + trans[lang][k] + "',\n";
        }
    }
    return toInsert;
};

content = content.replace(/id: \{/, 'id: {\n' + insertKeys('id'));
content = content.replace(/en: \{/, 'en: {\n' + insertKeys('en'));

fs.writeFileSync('src/data/translations.ts', content);
console.log('Translations updated.');
