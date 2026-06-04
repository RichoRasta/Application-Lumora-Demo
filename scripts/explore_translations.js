import fs from 'fs';
import path from 'path';

const trans = {
  id: {
    'explore.subtitle': 'Temukan materi baru, tantangan, dan rekomendasi belajar.',
    'explore.categories_header': 'Eksplor Kategori',
    'explore.recommended': 'Rekomendasi Untukmu',
    'explore.mini_projects': 'Mini Projects & Tantangan'
  },
  en: {
    'explore.subtitle': 'Discover new topics, challenges, and learning recommendations.',
    'explore.categories_header': 'Explore Categories',
    'explore.recommended': 'Recommended For You',
    'explore.mini_projects': 'Mini Projects & Challenges'
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

let explore = fs.readFileSync('src/pages/Explore.tsx', 'utf8');
explore = explore.replace(/>Temukan materi baru, tantangan, dan rekomendasi belajar\.</g, '>{t(\'explore.subtitle\')}<');
explore = explore.replace(/>Eksplor Kategori</g, '>{t(\'explore.categories_header\')}<');
explore = explore.replace(/>Rekomendasi Untukmu</g, '>{t(\'explore.recommended\')}<');
explore = explore.replace(/>Mini Projects & Tantangan</g, '>{t(\'explore.mini_projects\')}<');
// Fix Explore import for t
if(!explore.includes('const { t, language } = useAppContext();')) {
    explore = explore.replace('const { language, setView, activeLessonId, setActiveLessonId } = useAppContext();', 'const { t, language, setView, activeLessonId, setActiveLessonId } = useAppContext();');
}
fs.writeFileSync('src/pages/Explore.tsx', explore);

console.log('Explore translated.');
