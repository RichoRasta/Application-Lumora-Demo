import fs from 'fs';
let categories = ['HTML', 'CSS', 'JavaScript'];
let difficulties = ['Beginner', 'Intermediate', 'Advanced'];
let newChallengesStr = "";
difficulties.forEach(diff => {
    for(let i=0; i<15; i++) {
        let cat = categories[i % categories.length];
        newChallengesStr += `
  {
    id: 'ch-${cat.toLowerCase()}-${diff.toLowerCase()}-${i+10}',
    type: 'quick_task',
    level: '${cat}',
    title: '${diff} ${cat} Challenge ${i+1}',
    difficulty: '${diff}',
    explanation: 'Interactive ${diff} challenge for ${cat}.\\n<br/>Explore the depths of your coding skills.',
    purpose: 'Practice ${cat}.',
    instructions: ['Kerjakan kode ${cat}.', 'Pastikan tidak ada error sintaks.', 'Klik tombol Jalankan.'],
    initialHtml: '<!-- Write your test here -->\\n<div id="test"></div>',
    initialCss: '/* Add styling */',
    initialJs: '// Write logic',
    hint: 'Gunakan referensi dari pelajaran sebelumnya.',
    expectedOutput: {
      htmlContains: ['div']
    },
    successMessage: 'Great job! You mastered this challenge.',
    failureMessage: 'Try again! Check your syntax.'
  },`;
    }
});
let content = fs.readFileSync('src/data/challenges.ts', 'utf-8');
content = content.replace(/\];(\s*)$/, newChallengesStr + '\n];$1');
fs.writeFileSync('src/data/challenges.ts', content);
console.log("Added challenges");
