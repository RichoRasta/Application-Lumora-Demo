import fs from 'fs';

const pages = [
  'src/pages/Achievements.tsx',
  'src/pages/Certificates.tsx',
  'src/pages/Community.tsx',
  'src/pages/LearningStats.tsx',
  'src/pages/DailyMission.tsx',
  'src/pages/Challenges.tsx',
  'src/pages/Roadmap.tsx'
];

let transContent = fs.readFileSync('src/data/translations.ts', 'utf8');
const dictID = {};
const dictEN = {};
let counter = 1;

pages.forEach(p => {
  let content = fs.readFileSync(p, 'utf8');
  
  content = content.replace(/>([^<{}]+[a-z][^<{}]+)</g, (match, text) => {
    const trimmed = text.trim();
    if (!trimmed || trimmed.length < 2) return match;
    if (trimmed === 'LOCKED' || trimmed === 'Work in Progress') return match;
    
    // Ignore if already translated
    if (trimmed.includes('t(')) return match;
    
    const key = 'ui_' + counter++;
    dictID[key] = trimmed;
    dictEN[key] = trimmed; // Just duplicate for now to prevent breaking anything, but it WILL be wired to toggle
    
    const leadingSpaces = text.match(/^\s*/)[0];
    const trailingSpaces = text.match(/\s*$/)[0];
    
    return '>' + leadingSpaces + '{t(\'' + key + '\')}' + trailingSpaces + '<';
  });

  const extractMatch = content.match(/export default function [A-Za-z0-9]+\(\) {/);
  if (extractMatch && !content.includes('const { t } = useAppContext()') && !content.includes('t,')) {
       content = content.replace(extractMatch[0], extractMatch[0] + "\n  const { t } = useAppContext();");
  }

  fs.writeFileSync(p, content);
});

const idIdx = transContent.indexOf('id: {');
if (idIdx !== -1) {
  let toInsert = '';
  for(let k in dictID) {
    toInsert += "\\n    '" + k + "': '" + dictID[k].replace(/'/g, "\\\\'") + "',";
  }
  transContent = transContent.slice(0, idIdx + 5) + toInsert + transContent.slice(idIdx + 5);
}

const enIdx = transContent.indexOf('en: {');
if (enIdx !== -1) {
  let toInsert = '';
  for(let k in dictEN) {
    toInsert += "\\n    '" + k + "': '" + dictEN[k].replace(/'/g, "\\\\'") + "',";
  }
  transContent = transContent.slice(0, enIdx + 5) + toInsert + transContent.slice(enIdx + 5);
}
fs.writeFileSync('src/data/translations.ts', transContent);
console.log("Processed all files.");
