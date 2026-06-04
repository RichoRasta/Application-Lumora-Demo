import fs from 'fs';

const trans = {
  id: {
    'profile.appearance': 'Penampilan',
    'profile.appearance_desc': 'Mode gelap dan tema UI.',
    'profile.language_desc': 'Indonesia atau Inggris.',
    'profile.account': 'Pengaturan Akun',
    'profile.account_desc': 'Kelola profil dan email.',
    'profile.security': 'Keamanan',
    'profile.security_desc': 'Kata sandi dan autentikasi.',
    'profile.notification': 'Notifikasi',
    'profile.notification_desc': 'Pengingat harian.',
    'profile.privacy': 'Privasi',
    'profile.privacy_desc': 'Kontrol data publik.',
  },
  en: {
    'profile.appearance': 'Appearance',
    'profile.appearance_desc': 'Dark mode and UI themes.',
    'profile.language_desc': 'Indonesian or English.',
    'profile.account': 'Account Settings',
    'profile.account_desc': 'Manage your profile details.',
    'profile.security': 'Security',
    'profile.security_desc': 'Password and 2FA.',
    'profile.notification': 'Notification',
    'profile.notification_desc': 'Daily reminders.',
    'profile.privacy': 'Privacy',
    'profile.privacy_desc': 'Control your visibility.',
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

// Edit Profile.tsx
let profile = fs.readFileSync('src/pages/Profile.tsx', 'utf8');
profile = profile.replace(
  /const settingsMenu = \[[\s\S]*?\];/,
  `const settingsMenu = [
    { id: 'Account', icon: Settings, label: t('profile.account'), desc: t('profile.account_desc') },
    { id: 'Security', icon: Shield, label: t('profile.security'), desc: t('profile.security_desc') },
    { id: 'Notification', icon: Bell, label: t('profile.notification'), desc: t('profile.notification_desc') },
    { id: 'Appearance', icon: Palette, label: t('profile.appearance'), desc: t('profile.appearance_desc') },
    { id: 'Language', icon: Globe, label: t('profile.app_language'), desc: t('profile.language_desc') },
    { id: 'Privacy', icon: Lock, label: t('profile.privacy'), desc: t('profile.privacy_desc') },
  ];`
);
profile = profile.replace(/{t\('profile\.app_language'\)}/, 'Bahasa Aplikasi'); // rollback just in case to match
profile = profile.replace(/<h3 className="text-xl font-bold text-navy dark:text-white">Bahasa Aplikasi<\/h3>/, '<h3 className="text-xl font-bold text-navy dark:text-white">{t(\'profile.app_language\')}</h3>');
profile = profile.replace(/<p className="text-sm text-gray-500">Pilih bahasa yang paling mudah kamu pahami\.<\/p>/, '<p className="text-sm text-gray-500">{t(\'profile.language_desc\')}</p>');
fs.writeFileSync('src/pages/Profile.tsx', profile);
