import fs from 'fs';

const enKeys = {
  'explore.subtitle': 'Discover new topics, challenges, and learning recommendations.',
  'explore.categories_header': 'Explore Categories',
  'explore.recommended': 'Recommended For You',
  'explore.mini_projects': 'Mini Projects & Challenges',
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
  'nav.logout': 'Logout',
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
};

let content = fs.readFileSync('src/data/translations.ts', 'utf8');

// Find the index of "en: {"
const idx = content.indexOf('en: {');
if (idx !== -1) {
  let toInsert = '';
  for(let k in enKeys) {
    if (content.indexOf(`'${k}':`) === -1 || content.indexOf(`'${k}':`) < idx) {
      toInsert += `\n    '${k}': '${enKeys[k]}',`;
    }
  }
  content = content.slice(0, idx + 5) + toInsert + content.slice(idx + 5);
  fs.writeFileSync('src/data/translations.ts', content);
  console.log("Updated en translations");
}
