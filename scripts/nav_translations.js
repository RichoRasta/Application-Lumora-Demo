import fs from 'fs';

const trans = {
  id: {
    'nav.roadmap': 'Alur Belajar',
    'nav.mission': 'Misi Harian',
    'nav.challenges': 'Challenges',
    'nav.achievements': 'Pencapaian',
    'nav.leaderboard': 'Leaderboard',
    'nav.community': 'Komunitas',
    'nav.saved_lessons': 'Tersimpan',
    'nav.notes': 'Catatan',
    'nav.stats': 'Statistik',
    'nav.certificates': 'Sertifikat',
    'nav.profile_settings': 'Pengaturan',
    'nav.logout': 'Keluar'
  },
  en: {
    'nav.roadmap': 'Roadmap',
    'nav.mission': 'Daily Mission',
    'nav.challenges': 'Challenges',
    'nav.achievements': 'Achievements',
    'nav.leaderboard': 'Leaderboard',
    'nav.community': 'Community',
    'nav.saved_lessons': 'Saved',
    'nav.notes': 'Notes',
    'nav.stats': 'Stats',
    'nav.certificates': 'Certificates',
    'nav.profile_settings': 'Settings',
    'nav.logout': 'Logout'
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
