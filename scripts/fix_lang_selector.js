import fs from 'fs';

const idKeys = {
  'profile.lang.id': 'Bahasa Indonesia',
  'profile.lang.id_desc': 'Default (Diutamakan untuk pemula lokal)',
  'profile.lang.en': 'English',
  'profile.lang.en_desc': 'Gunakan ini untuk terbiasa dengan bahasa asli coding',
};

const enKeys = {
  'profile.lang.id': 'Bahasa Indonesia',
  'profile.lang.id_desc': 'Default (Recommended for locals)',
  'profile.lang.en': 'English',
  'profile.lang.en_desc': 'Use this to get used to native coding terminology',
};

let content = fs.readFileSync('src/data/translations.ts', 'utf8');

const idIdx = content.indexOf('id: {');
if (idIdx !== -1) {
  let toInsert = '';
  for(let k in idKeys) {
    if (content.indexOf(`'${k}':`) === -1 || content.indexOf(`'${k}':`) > content.indexOf('en: {')) {
      toInsert += `\n    '${k}': '${idKeys[k]}',`;
    }
  }
  content = content.slice(0, idIdx + 5) + toInsert + content.slice(idIdx + 5);
}

const enIdx = content.indexOf('en: {');
if (enIdx !== -1) {
  let toInsert = '';
  for(let k in enKeys) {
    if (content.indexOf(`'${k}':`) === -1 || content.lastIndexOf(`'${k}':`) < enIdx) {
      toInsert += `\n    '${k}': '${enKeys[k]}',`;
    }
  }
  content = content.slice(0, enIdx + 5) + toInsert + content.slice(enIdx + 5);
}
fs.writeFileSync('src/data/translations.ts', content);

let profile = fs.readFileSync('src/pages/Profile.tsx', 'utf8');
profile = profile.replace(/Bahasa Indonesia/, '{t(\\\'profile.lang.id\\\')}');
profile = profile.replace(/Default \(Diutamakan untuk pemula lokal\)/, '{t(\\\'profile.lang.id_desc\\\')}');
profile = profile.replace(/>English</, '>{t(\\\'profile.lang.en\\\')}<');
profile = profile.replace(/Gunakan ini untuk terbiasa dengan bahasa asli coding/, '{t(\\\'profile.lang.en_desc\\\')}');
fs.writeFileSync('src/pages/Profile.tsx', profile);

console.log("Updated Profile strings");
