import fs from 'fs';

let content = fs.readFileSync('src/data/translations.ts', 'utf8');

// Replace literal "\n" strings followed by spaces and 'ui_ with actual newlines
content = content.replace(/\\n/g, '\n');
content = content.replace(/\n    'ui_[0-9]+': '.*?',/g, ''); // just remove all the broken ui_ strings

fs.writeFileSync('src/data/translations.ts', content);
