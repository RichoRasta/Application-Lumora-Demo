export type ChallengeType = 'quick_task' | 'fix_error' | 'fill_blank';

export interface Challenge {
  id: string;
  type: ChallengeType;
  level: string; 
  title: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  explanation: string;
  purpose: string;
  instructions: string[];
  initialHtml: string;
  initialCss: string;
  initialJs: string;
  hint: string;
  expectedOutput: {
    htmlContains?: string[];
    cssContains?: string[];
    jsContains?: string[];
  };
  successMessage: string;
  failureMessage: string;
}

export const challenges: Challenge[] = [
  {
    id: 'ch-html-1',
    type: 'quick_task',
    level: 'HTML Beginner',
    title: 'Membuat Tulisan Besar (Judul)',
    difficulty: 'Beginner',
    explanation: '<b>Tujuan:</b><br/>Membuat tulisan besar pertama di website.<br/><br/><b>Hasil yang Akan Muncul:</b><br/>HALO DUNIA<br/><br/><b>Code:</b><br/><code class="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-primary-blue my-2 inline-block">&lt;h1&gt;HALO DUNIA&lt;/h1&gt;</code><br/><br/><b>Penjelasan:</b><ul><li><code>&lt;h1&gt;</code> digunakan untuk memberi perintah "Mulai tulisan besar di sini".</li><li><code>HALO DUNIA</code> adalah isi tulisannya.</li><li><code>&lt;/h1&gt;</code> digunakan untuk menutup perintah tulisan besar.</li></ul>',
    purpose: 'Belajar membuat judul utama di HTML.',
    instructions: [
      'Klik kotak hitam tempat menulis kode (HTML) di bawah.',
      'Ketik perintah ini: <h1>HALO DUNIA</h1>',
      'Pastikan kamu mengetik tanda kurung sudut < dan > dengan benar.'
    ],
    initialHtml: '<!-- Tulis kodemu di bawah ini -->\n',
    initialCss: '',
    initialJs: '',
    hint: 'Mulai dengan <h1>, ketik Halo Dunia, lalu tutup dengan </h1>.',
    expectedOutput: {
      htmlContains: ['Halo Dunia']
    },
    successMessage: 'Bagus! Kamu berhasil membuat heading pertamamu. Sangat mudah kan?',
    failureMessage: 'Hampir! Coba pastikan kamu mengetik <h1>Halo Dunia</h1> dengan bentuk yang sama persis.'
  },
  {
    id: 'ch-html-2',
    type: 'fix_error',
    level: 'HTML Beginner',
    title: 'Merapikan Kode Tulisan yang Lupa Ditutup',
    difficulty: 'Beginner',
    explanation: '<b>Tujuan:</b><br/>Mengingatkan komputer untuk "berhenti" membesarkan tulisan.<br/><br/><b>Contoh Kasus:</b><br/>Jika kita meminta komputer membesarkan tulisan dengan kode <code>&lt;h2&gt;</code> tapi lupa menutupnya, komputer akan kebingungan dan membesarkan semua tombol, gambar, dan tulisan lain tanpa henti!<br/><br/><b>Penjelasan:</b><ul><li>Garis miring <code>/</code> pada kode penutup sangat penting.</li><li>Kode penutup seperti <code>&lt;/h2&gt;</code> berarti perintah "Membesarkan tulisan cukup sampai di sini".</li></ul>',
    purpose: 'Memahami pentingnya tag penutup di HTML.',
    instructions: [
      'Pada kotak kode di bawah, ada kalimat "Belajar Coding Menyenangkan" yang belum ditutup.',
      'Tambahkan perintah penutup </h2> langsung setelah huruf "n" terakhir.',
      'Lihat efeknya pada Live Preview! Tulisan "Saya siap belajar!" akan kembali normal.'
    ],
    initialHtml: '<h2>Belajar Coding Menyenangkan\n<p>Saya siap belajar!</p>',
    initialCss: '',
    initialJs: '',
    hint: 'Tambahkan </h2> di akhir kalimat "Belajar Coding Menyenangkan".',
    expectedOutput: {
      htmlContains: ['</h2>']
    },
    successMessage: 'Hebat! Ini adalah kebiasaan baik seorang programmer: rajin menutup tag.',
    failureMessage: 'Hampir benar! Coba periksa lagi, apakah kamu sudah mengetik </h2> di akhir kalimat pertama?'
  },
  {
    id: 'ch-css-1',
    type: 'fill_blank',
    level: 'CSS Beginner',
    title: 'Memberi Warna Teks Pertama Kali',
    difficulty: 'Beginner',
    explanation: '<b>Tujuan:</b><br/>Mengubah tulisan dari warna dasar (hitam putih) menjadi tulisan berwarna.<br/><br/><b>Code:</b><br/><code class="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-primary-blue my-2 inline-block">color: blue;</code><br/><br/><b>Penjelasan:</b><ul><li><code>color</code> adalah bahasa komputer yang berarti "warna tulisan".</li><li>Kita menggunakan bahasa Inggris (seperti blue, red, green) karena sistem komputer didesain seperti itu dari awal.</li><li>Titik dua <code>:</code> berfungsi seperti spasi. Titik koma <code>;</code> berfungsi sebagai penutup kalimat. Keduanya WAJIB diketik.</li></ul>',
    purpose: 'Belajar mengubah warna text dasar.',
    instructions: [
      'Perhatikan kotak hitam (tempat kode). Klik bagian yang bertuliskan "CSS" di atasnya.',
      'Cari teks "color: ___;"',
      'Hapus tiga garis bawah (___) tersebut.',
      'Ketik warna bahasa Inggris "blue" agar tulisannya menjadi biru.'
    ],
    initialHtml: '<p class="teks-keren">Teks ini akan menjadi biru.</p>',
    initialCss: '.teks-keren {\n  color: ___;\n}',
    initialJs: '',
    hint: 'Ganti garis bawah (___) dengan kata "blue".',
    expectedOutput: {
      cssContains: ['blue']
    },
    successMessage: 'Keren! Kamu baru saja memberi warna pada web!',
    failureMessage: 'Belum berubah birunya. Coba cek lagi, apakah kamu sudah mengganti ___ dengan kata blue?'
  },
  {
    id: 'ch-css-2',
    type: 'quick_task',
    level: 'CSS Beginner',
    title: 'Mewarnai Latar Kotak',
    difficulty: 'Beginner',
    explanation: '<b>Tujuan:</b><br/>Membiasakan diri mewarnai bidang atau luas area, bukan hanya mewarnai huruf saja.<br/><br/><b>Code:</b><br/><code class="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-primary-blue my-2 inline-block">background-color: red;</code><br/><br/><b>Penjelasan:</b><ul><li>Tadi kita pakai <code>color</code> untuk huruf. Sekarang kita berkenalan dengan <code>background-color</code>.</li><li><code>background-color</code> adalah perintah khusus untuk mengecat "latar belakang" atau ruang warna di sekitar tulisan/kotak.</li></ul>',
    purpose: 'Memahami cara memodifikasi warna latar sebuah elemen HTML.',
    instructions: [
      'Klik tab (pilihan) "CSS" di kotak hitam pada tempat menulis kode.',
      'Kotaknya saat ini berwarna abu-abu karena disetel dengan kata "gray".',
      'Silakan hapus kata "gray".',
      'Ketik ganti menjadi bentuk: background-color: red;'
    ],
    initialHtml: '<div class="kotak"></div>',
    initialCss: '.kotak {\n  width: 100px;\n  height: 100px;\n  background-color: gray;\n}',
    initialJs: '',
    hint: 'Cari tulisan "gray", hapus, lalu ketik "red".',
    expectedOutput: {
      cssContains: ['red']
    },
    successMessage: 'Sempurna! Kamu telah memahami konsep mengubah property CSS.',
    failureMessage: 'Kotaknya belum jadi merah. Pastikan kamu mengganti kata gray menjadi red dan membiarkan titik koma (;) di belakangnya.'
  },
  {
    id: 'ch-html-beginner-10',
    type: 'quick_task',
    level: 'HTML',
    title: 'Beginner HTML Challenge 1',
    difficulty: 'Beginner',
    explanation: 'Interactive Beginner challenge for HTML.\n<br/>Explore the depths of your coding skills.',
    purpose: 'Practice HTML.',
    instructions: ['Kerjakan kode HTML.', 'Pastikan tidak ada error sintaks.', 'Klik tombol Jalankan.'],
    initialHtml: '<!-- Write your test here -->\n<div id="test"></div>',
    initialCss: '/* Add styling */',
    initialJs: '// Write logic',
    hint: 'Gunakan referensi dari pelajaran sebelumnya.',
    expectedOutput: {
      htmlContains: ['div']
    },
    successMessage: 'Great job! You mastered this challenge.',
    failureMessage: 'Try again! Check your syntax.'
  },
  {
    id: 'ch-css-beginner-11',
    type: 'quick_task',
    level: 'CSS',
    title: 'Beginner CSS Challenge 2',
    difficulty: 'Beginner',
    explanation: 'Interactive Beginner challenge for CSS.\n<br/>Explore the depths of your coding skills.',
    purpose: 'Practice CSS.',
    instructions: ['Kerjakan kode CSS.', 'Pastikan tidak ada error sintaks.', 'Klik tombol Jalankan.'],
    initialHtml: '<!-- Write your test here -->\n<div id="test"></div>',
    initialCss: '/* Add styling */',
    initialJs: '// Write logic',
    hint: 'Gunakan referensi dari pelajaran sebelumnya.',
    expectedOutput: {
      htmlContains: ['div']
    },
    successMessage: 'Great job! You mastered this challenge.',
    failureMessage: 'Try again! Check your syntax.'
  },
  {
    id: 'ch-javascript-beginner-12',
    type: 'quick_task',
    level: 'JavaScript',
    title: 'Beginner JavaScript Challenge 3',
    difficulty: 'Beginner',
    explanation: 'Interactive Beginner challenge for JavaScript.\n<br/>Explore the depths of your coding skills.',
    purpose: 'Practice JavaScript.',
    instructions: ['Kerjakan kode JavaScript.', 'Pastikan tidak ada error sintaks.', 'Klik tombol Jalankan.'],
    initialHtml: '<!-- Write your test here -->\n<div id="test"></div>',
    initialCss: '/* Add styling */',
    initialJs: '// Write logic',
    hint: 'Gunakan referensi dari pelajaran sebelumnya.',
    expectedOutput: {
      htmlContains: ['div']
    },
    successMessage: 'Great job! You mastered this challenge.',
    failureMessage: 'Try again! Check your syntax.'
  },
  {
    id: 'ch-html-beginner-13',
    type: 'quick_task',
    level: 'HTML',
    title: 'Beginner HTML Challenge 4',
    difficulty: 'Beginner',
    explanation: 'Interactive Beginner challenge for HTML.\n<br/>Explore the depths of your coding skills.',
    purpose: 'Practice HTML.',
    instructions: ['Kerjakan kode HTML.', 'Pastikan tidak ada error sintaks.', 'Klik tombol Jalankan.'],
    initialHtml: '<!-- Write your test here -->\n<div id="test"></div>',
    initialCss: '/* Add styling */',
    initialJs: '// Write logic',
    hint: 'Gunakan referensi dari pelajaran sebelumnya.',
    expectedOutput: {
      htmlContains: ['div']
    },
    successMessage: 'Great job! You mastered this challenge.',
    failureMessage: 'Try again! Check your syntax.'
  },
  {
    id: 'ch-css-beginner-14',
    type: 'quick_task',
    level: 'CSS',
    title: 'Beginner CSS Challenge 5',
    difficulty: 'Beginner',
    explanation: 'Interactive Beginner challenge for CSS.\n<br/>Explore the depths of your coding skills.',
    purpose: 'Practice CSS.',
    instructions: ['Kerjakan kode CSS.', 'Pastikan tidak ada error sintaks.', 'Klik tombol Jalankan.'],
    initialHtml: '<!-- Write your test here -->\n<div id="test"></div>',
    initialCss: '/* Add styling */',
    initialJs: '// Write logic',
    hint: 'Gunakan referensi dari pelajaran sebelumnya.',
    expectedOutput: {
      htmlContains: ['div']
    },
    successMessage: 'Great job! You mastered this challenge.',
    failureMessage: 'Try again! Check your syntax.'
  },
  {
    id: 'ch-javascript-beginner-15',
    type: 'quick_task',
    level: 'JavaScript',
    title: 'Beginner JavaScript Challenge 6',
    difficulty: 'Beginner',
    explanation: 'Interactive Beginner challenge for JavaScript.\n<br/>Explore the depths of your coding skills.',
    purpose: 'Practice JavaScript.',
    instructions: ['Kerjakan kode JavaScript.', 'Pastikan tidak ada error sintaks.', 'Klik tombol Jalankan.'],
    initialHtml: '<!-- Write your test here -->\n<div id="test"></div>',
    initialCss: '/* Add styling */',
    initialJs: '// Write logic',
    hint: 'Gunakan referensi dari pelajaran sebelumnya.',
    expectedOutput: {
      htmlContains: ['div']
    },
    successMessage: 'Great job! You mastered this challenge.',
    failureMessage: 'Try again! Check your syntax.'
  },
  {
    id: 'ch-html-beginner-16',
    type: 'quick_task',
    level: 'HTML',
    title: 'Beginner HTML Challenge 7',
    difficulty: 'Beginner',
    explanation: 'Interactive Beginner challenge for HTML.\n<br/>Explore the depths of your coding skills.',
    purpose: 'Practice HTML.',
    instructions: ['Kerjakan kode HTML.', 'Pastikan tidak ada error sintaks.', 'Klik tombol Jalankan.'],
    initialHtml: '<!-- Write your test here -->\n<div id="test"></div>',
    initialCss: '/* Add styling */',
    initialJs: '// Write logic',
    hint: 'Gunakan referensi dari pelajaran sebelumnya.',
    expectedOutput: {
      htmlContains: ['div']
    },
    successMessage: 'Great job! You mastered this challenge.',
    failureMessage: 'Try again! Check your syntax.'
  },
  {
    id: 'ch-css-beginner-17',
    type: 'quick_task',
    level: 'CSS',
    title: 'Beginner CSS Challenge 8',
    difficulty: 'Beginner',
    explanation: 'Interactive Beginner challenge for CSS.\n<br/>Explore the depths of your coding skills.',
    purpose: 'Practice CSS.',
    instructions: ['Kerjakan kode CSS.', 'Pastikan tidak ada error sintaks.', 'Klik tombol Jalankan.'],
    initialHtml: '<!-- Write your test here -->\n<div id="test"></div>',
    initialCss: '/* Add styling */',
    initialJs: '// Write logic',
    hint: 'Gunakan referensi dari pelajaran sebelumnya.',
    expectedOutput: {
      htmlContains: ['div']
    },
    successMessage: 'Great job! You mastered this challenge.',
    failureMessage: 'Try again! Check your syntax.'
  },
  {
    id: 'ch-javascript-beginner-18',
    type: 'quick_task',
    level: 'JavaScript',
    title: 'Beginner JavaScript Challenge 9',
    difficulty: 'Beginner',
    explanation: 'Interactive Beginner challenge for JavaScript.\n<br/>Explore the depths of your coding skills.',
    purpose: 'Practice JavaScript.',
    instructions: ['Kerjakan kode JavaScript.', 'Pastikan tidak ada error sintaks.', 'Klik tombol Jalankan.'],
    initialHtml: '<!-- Write your test here -->\n<div id="test"></div>',
    initialCss: '/* Add styling */',
    initialJs: '// Write logic',
    hint: 'Gunakan referensi dari pelajaran sebelumnya.',
    expectedOutput: {
      htmlContains: ['div']
    },
    successMessage: 'Great job! You mastered this challenge.',
    failureMessage: 'Try again! Check your syntax.'
  },
  {
    id: 'ch-html-beginner-19',
    type: 'quick_task',
    level: 'HTML',
    title: 'Beginner HTML Challenge 10',
    difficulty: 'Beginner',
    explanation: 'Interactive Beginner challenge for HTML.\n<br/>Explore the depths of your coding skills.',
    purpose: 'Practice HTML.',
    instructions: ['Kerjakan kode HTML.', 'Pastikan tidak ada error sintaks.', 'Klik tombol Jalankan.'],
    initialHtml: '<!-- Write your test here -->\n<div id="test"></div>',
    initialCss: '/* Add styling */',
    initialJs: '// Write logic',
    hint: 'Gunakan referensi dari pelajaran sebelumnya.',
    expectedOutput: {
      htmlContains: ['div']
    },
    successMessage: 'Great job! You mastered this challenge.',
    failureMessage: 'Try again! Check your syntax.'
  },
  {
    id: 'ch-css-beginner-20',
    type: 'quick_task',
    level: 'CSS',
    title: 'Beginner CSS Challenge 11',
    difficulty: 'Beginner',
    explanation: 'Interactive Beginner challenge for CSS.\n<br/>Explore the depths of your coding skills.',
    purpose: 'Practice CSS.',
    instructions: ['Kerjakan kode CSS.', 'Pastikan tidak ada error sintaks.', 'Klik tombol Jalankan.'],
    initialHtml: '<!-- Write your test here -->\n<div id="test"></div>',
    initialCss: '/* Add styling */',
    initialJs: '// Write logic',
    hint: 'Gunakan referensi dari pelajaran sebelumnya.',
    expectedOutput: {
      htmlContains: ['div']
    },
    successMessage: 'Great job! You mastered this challenge.',
    failureMessage: 'Try again! Check your syntax.'
  },
  {
    id: 'ch-javascript-beginner-21',
    type: 'quick_task',
    level: 'JavaScript',
    title: 'Beginner JavaScript Challenge 12',
    difficulty: 'Beginner',
    explanation: 'Interactive Beginner challenge for JavaScript.\n<br/>Explore the depths of your coding skills.',
    purpose: 'Practice JavaScript.',
    instructions: ['Kerjakan kode JavaScript.', 'Pastikan tidak ada error sintaks.', 'Klik tombol Jalankan.'],
    initialHtml: '<!-- Write your test here -->\n<div id="test"></div>',
    initialCss: '/* Add styling */',
    initialJs: '// Write logic',
    hint: 'Gunakan referensi dari pelajaran sebelumnya.',
    expectedOutput: {
      htmlContains: ['div']
    },
    successMessage: 'Great job! You mastered this challenge.',
    failureMessage: 'Try again! Check your syntax.'
  },
  {
    id: 'ch-html-beginner-22',
    type: 'quick_task',
    level: 'HTML',
    title: 'Beginner HTML Challenge 13',
    difficulty: 'Beginner',
    explanation: 'Interactive Beginner challenge for HTML.\n<br/>Explore the depths of your coding skills.',
    purpose: 'Practice HTML.',
    instructions: ['Kerjakan kode HTML.', 'Pastikan tidak ada error sintaks.', 'Klik tombol Jalankan.'],
    initialHtml: '<!-- Write your test here -->\n<div id="test"></div>',
    initialCss: '/* Add styling */',
    initialJs: '// Write logic',
    hint: 'Gunakan referensi dari pelajaran sebelumnya.',
    expectedOutput: {
      htmlContains: ['div']
    },
    successMessage: 'Great job! You mastered this challenge.',
    failureMessage: 'Try again! Check your syntax.'
  },
  {
    id: 'ch-css-beginner-23',
    type: 'quick_task',
    level: 'CSS',
    title: 'Beginner CSS Challenge 14',
    difficulty: 'Beginner',
    explanation: 'Interactive Beginner challenge for CSS.\n<br/>Explore the depths of your coding skills.',
    purpose: 'Practice CSS.',
    instructions: ['Kerjakan kode CSS.', 'Pastikan tidak ada error sintaks.', 'Klik tombol Jalankan.'],
    initialHtml: '<!-- Write your test here -->\n<div id="test"></div>',
    initialCss: '/* Add styling */',
    initialJs: '// Write logic',
    hint: 'Gunakan referensi dari pelajaran sebelumnya.',
    expectedOutput: {
      htmlContains: ['div']
    },
    successMessage: 'Great job! You mastered this challenge.',
    failureMessage: 'Try again! Check your syntax.'
  },
  {
    id: 'ch-javascript-beginner-24',
    type: 'quick_task',
    level: 'JavaScript',
    title: 'Beginner JavaScript Challenge 15',
    difficulty: 'Beginner',
    explanation: 'Interactive Beginner challenge for JavaScript.\n<br/>Explore the depths of your coding skills.',
    purpose: 'Practice JavaScript.',
    instructions: ['Kerjakan kode JavaScript.', 'Pastikan tidak ada error sintaks.', 'Klik tombol Jalankan.'],
    initialHtml: '<!-- Write your test here -->\n<div id="test"></div>',
    initialCss: '/* Add styling */',
    initialJs: '// Write logic',
    hint: 'Gunakan referensi dari pelajaran sebelumnya.',
    expectedOutput: {
      htmlContains: ['div']
    },
    successMessage: 'Great job! You mastered this challenge.',
    failureMessage: 'Try again! Check your syntax.'
  },
  {
    id: 'ch-html-intermediate-10',
    type: 'quick_task',
    level: 'HTML',
    title: 'Intermediate HTML Challenge 1',
    difficulty: 'Intermediate',
    explanation: 'Interactive Intermediate challenge for HTML.\n<br/>Explore the depths of your coding skills.',
    purpose: 'Practice HTML.',
    instructions: ['Kerjakan kode HTML.', 'Pastikan tidak ada error sintaks.', 'Klik tombol Jalankan.'],
    initialHtml: '<!-- Write your test here -->\n<div id="test"></div>',
    initialCss: '/* Add styling */',
    initialJs: '// Write logic',
    hint: 'Gunakan referensi dari pelajaran sebelumnya.',
    expectedOutput: {
      htmlContains: ['div']
    },
    successMessage: 'Great job! You mastered this challenge.',
    failureMessage: 'Try again! Check your syntax.'
  },
  {
    id: 'ch-css-intermediate-11',
    type: 'quick_task',
    level: 'CSS',
    title: 'Intermediate CSS Challenge 2',
    difficulty: 'Intermediate',
    explanation: 'Interactive Intermediate challenge for CSS.\n<br/>Explore the depths of your coding skills.',
    purpose: 'Practice CSS.',
    instructions: ['Kerjakan kode CSS.', 'Pastikan tidak ada error sintaks.', 'Klik tombol Jalankan.'],
    initialHtml: '<!-- Write your test here -->\n<div id="test"></div>',
    initialCss: '/* Add styling */',
    initialJs: '// Write logic',
    hint: 'Gunakan referensi dari pelajaran sebelumnya.',
    expectedOutput: {
      htmlContains: ['div']
    },
    successMessage: 'Great job! You mastered this challenge.',
    failureMessage: 'Try again! Check your syntax.'
  },
  {
    id: 'ch-javascript-intermediate-12',
    type: 'quick_task',
    level: 'JavaScript',
    title: 'Intermediate JavaScript Challenge 3',
    difficulty: 'Intermediate',
    explanation: 'Interactive Intermediate challenge for JavaScript.\n<br/>Explore the depths of your coding skills.',
    purpose: 'Practice JavaScript.',
    instructions: ['Kerjakan kode JavaScript.', 'Pastikan tidak ada error sintaks.', 'Klik tombol Jalankan.'],
    initialHtml: '<!-- Write your test here -->\n<div id="test"></div>',
    initialCss: '/* Add styling */',
    initialJs: '// Write logic',
    hint: 'Gunakan referensi dari pelajaran sebelumnya.',
    expectedOutput: {
      htmlContains: ['div']
    },
    successMessage: 'Great job! You mastered this challenge.',
    failureMessage: 'Try again! Check your syntax.'
  },
  {
    id: 'ch-html-intermediate-13',
    type: 'quick_task',
    level: 'HTML',
    title: 'Intermediate HTML Challenge 4',
    difficulty: 'Intermediate',
    explanation: 'Interactive Intermediate challenge for HTML.\n<br/>Explore the depths of your coding skills.',
    purpose: 'Practice HTML.',
    instructions: ['Kerjakan kode HTML.', 'Pastikan tidak ada error sintaks.', 'Klik tombol Jalankan.'],
    initialHtml: '<!-- Write your test here -->\n<div id="test"></div>',
    initialCss: '/* Add styling */',
    initialJs: '// Write logic',
    hint: 'Gunakan referensi dari pelajaran sebelumnya.',
    expectedOutput: {
      htmlContains: ['div']
    },
    successMessage: 'Great job! You mastered this challenge.',
    failureMessage: 'Try again! Check your syntax.'
  },
  {
    id: 'ch-css-intermediate-14',
    type: 'quick_task',
    level: 'CSS',
    title: 'Intermediate CSS Challenge 5',
    difficulty: 'Intermediate',
    explanation: 'Interactive Intermediate challenge for CSS.\n<br/>Explore the depths of your coding skills.',
    purpose: 'Practice CSS.',
    instructions: ['Kerjakan kode CSS.', 'Pastikan tidak ada error sintaks.', 'Klik tombol Jalankan.'],
    initialHtml: '<!-- Write your test here -->\n<div id="test"></div>',
    initialCss: '/* Add styling */',
    initialJs: '// Write logic',
    hint: 'Gunakan referensi dari pelajaran sebelumnya.',
    expectedOutput: {
      htmlContains: ['div']
    },
    successMessage: 'Great job! You mastered this challenge.',
    failureMessage: 'Try again! Check your syntax.'
  },
  {
    id: 'ch-javascript-intermediate-15',
    type: 'quick_task',
    level: 'JavaScript',
    title: 'Intermediate JavaScript Challenge 6',
    difficulty: 'Intermediate',
    explanation: 'Interactive Intermediate challenge for JavaScript.\n<br/>Explore the depths of your coding skills.',
    purpose: 'Practice JavaScript.',
    instructions: ['Kerjakan kode JavaScript.', 'Pastikan tidak ada error sintaks.', 'Klik tombol Jalankan.'],
    initialHtml: '<!-- Write your test here -->\n<div id="test"></div>',
    initialCss: '/* Add styling */',
    initialJs: '// Write logic',
    hint: 'Gunakan referensi dari pelajaran sebelumnya.',
    expectedOutput: {
      htmlContains: ['div']
    },
    successMessage: 'Great job! You mastered this challenge.',
    failureMessage: 'Try again! Check your syntax.'
  },
  {
    id: 'ch-html-intermediate-16',
    type: 'quick_task',
    level: 'HTML',
    title: 'Intermediate HTML Challenge 7',
    difficulty: 'Intermediate',
    explanation: 'Interactive Intermediate challenge for HTML.\n<br/>Explore the depths of your coding skills.',
    purpose: 'Practice HTML.',
    instructions: ['Kerjakan kode HTML.', 'Pastikan tidak ada error sintaks.', 'Klik tombol Jalankan.'],
    initialHtml: '<!-- Write your test here -->\n<div id="test"></div>',
    initialCss: '/* Add styling */',
    initialJs: '// Write logic',
    hint: 'Gunakan referensi dari pelajaran sebelumnya.',
    expectedOutput: {
      htmlContains: ['div']
    },
    successMessage: 'Great job! You mastered this challenge.',
    failureMessage: 'Try again! Check your syntax.'
  },
  {
    id: 'ch-css-intermediate-17',
    type: 'quick_task',
    level: 'CSS',
    title: 'Intermediate CSS Challenge 8',
    difficulty: 'Intermediate',
    explanation: 'Interactive Intermediate challenge for CSS.\n<br/>Explore the depths of your coding skills.',
    purpose: 'Practice CSS.',
    instructions: ['Kerjakan kode CSS.', 'Pastikan tidak ada error sintaks.', 'Klik tombol Jalankan.'],
    initialHtml: '<!-- Write your test here -->\n<div id="test"></div>',
    initialCss: '/* Add styling */',
    initialJs: '// Write logic',
    hint: 'Gunakan referensi dari pelajaran sebelumnya.',
    expectedOutput: {
      htmlContains: ['div']
    },
    successMessage: 'Great job! You mastered this challenge.',
    failureMessage: 'Try again! Check your syntax.'
  },
  {
    id: 'ch-javascript-intermediate-18',
    type: 'quick_task',
    level: 'JavaScript',
    title: 'Intermediate JavaScript Challenge 9',
    difficulty: 'Intermediate',
    explanation: 'Interactive Intermediate challenge for JavaScript.\n<br/>Explore the depths of your coding skills.',
    purpose: 'Practice JavaScript.',
    instructions: ['Kerjakan kode JavaScript.', 'Pastikan tidak ada error sintaks.', 'Klik tombol Jalankan.'],
    initialHtml: '<!-- Write your test here -->\n<div id="test"></div>',
    initialCss: '/* Add styling */',
    initialJs: '// Write logic',
    hint: 'Gunakan referensi dari pelajaran sebelumnya.',
    expectedOutput: {
      htmlContains: ['div']
    },
    successMessage: 'Great job! You mastered this challenge.',
    failureMessage: 'Try again! Check your syntax.'
  },
  {
    id: 'ch-html-intermediate-19',
    type: 'quick_task',
    level: 'HTML',
    title: 'Intermediate HTML Challenge 10',
    difficulty: 'Intermediate',
    explanation: 'Interactive Intermediate challenge for HTML.\n<br/>Explore the depths of your coding skills.',
    purpose: 'Practice HTML.',
    instructions: ['Kerjakan kode HTML.', 'Pastikan tidak ada error sintaks.', 'Klik tombol Jalankan.'],
    initialHtml: '<!-- Write your test here -->\n<div id="test"></div>',
    initialCss: '/* Add styling */',
    initialJs: '// Write logic',
    hint: 'Gunakan referensi dari pelajaran sebelumnya.',
    expectedOutput: {
      htmlContains: ['div']
    },
    successMessage: 'Great job! You mastered this challenge.',
    failureMessage: 'Try again! Check your syntax.'
  },
  {
    id: 'ch-css-intermediate-20',
    type: 'quick_task',
    level: 'CSS',
    title: 'Intermediate CSS Challenge 11',
    difficulty: 'Intermediate',
    explanation: 'Interactive Intermediate challenge for CSS.\n<br/>Explore the depths of your coding skills.',
    purpose: 'Practice CSS.',
    instructions: ['Kerjakan kode CSS.', 'Pastikan tidak ada error sintaks.', 'Klik tombol Jalankan.'],
    initialHtml: '<!-- Write your test here -->\n<div id="test"></div>',
    initialCss: '/* Add styling */',
    initialJs: '// Write logic',
    hint: 'Gunakan referensi dari pelajaran sebelumnya.',
    expectedOutput: {
      htmlContains: ['div']
    },
    successMessage: 'Great job! You mastered this challenge.',
    failureMessage: 'Try again! Check your syntax.'
  },
  {
    id: 'ch-javascript-intermediate-21',
    type: 'quick_task',
    level: 'JavaScript',
    title: 'Intermediate JavaScript Challenge 12',
    difficulty: 'Intermediate',
    explanation: 'Interactive Intermediate challenge for JavaScript.\n<br/>Explore the depths of your coding skills.',
    purpose: 'Practice JavaScript.',
    instructions: ['Kerjakan kode JavaScript.', 'Pastikan tidak ada error sintaks.', 'Klik tombol Jalankan.'],
    initialHtml: '<!-- Write your test here -->\n<div id="test"></div>',
    initialCss: '/* Add styling */',
    initialJs: '// Write logic',
    hint: 'Gunakan referensi dari pelajaran sebelumnya.',
    expectedOutput: {
      htmlContains: ['div']
    },
    successMessage: 'Great job! You mastered this challenge.',
    failureMessage: 'Try again! Check your syntax.'
  },
  {
    id: 'ch-html-intermediate-22',
    type: 'quick_task',
    level: 'HTML',
    title: 'Intermediate HTML Challenge 13',
    difficulty: 'Intermediate',
    explanation: 'Interactive Intermediate challenge for HTML.\n<br/>Explore the depths of your coding skills.',
    purpose: 'Practice HTML.',
    instructions: ['Kerjakan kode HTML.', 'Pastikan tidak ada error sintaks.', 'Klik tombol Jalankan.'],
    initialHtml: '<!-- Write your test here -->\n<div id="test"></div>',
    initialCss: '/* Add styling */',
    initialJs: '// Write logic',
    hint: 'Gunakan referensi dari pelajaran sebelumnya.',
    expectedOutput: {
      htmlContains: ['div']
    },
    successMessage: 'Great job! You mastered this challenge.',
    failureMessage: 'Try again! Check your syntax.'
  },
  {
    id: 'ch-css-intermediate-23',
    type: 'quick_task',
    level: 'CSS',
    title: 'Intermediate CSS Challenge 14',
    difficulty: 'Intermediate',
    explanation: 'Interactive Intermediate challenge for CSS.\n<br/>Explore the depths of your coding skills.',
    purpose: 'Practice CSS.',
    instructions: ['Kerjakan kode CSS.', 'Pastikan tidak ada error sintaks.', 'Klik tombol Jalankan.'],
    initialHtml: '<!-- Write your test here -->\n<div id="test"></div>',
    initialCss: '/* Add styling */',
    initialJs: '// Write logic',
    hint: 'Gunakan referensi dari pelajaran sebelumnya.',
    expectedOutput: {
      htmlContains: ['div']
    },
    successMessage: 'Great job! You mastered this challenge.',
    failureMessage: 'Try again! Check your syntax.'
  },
  {
    id: 'ch-javascript-intermediate-24',
    type: 'quick_task',
    level: 'JavaScript',
    title: 'Intermediate JavaScript Challenge 15',
    difficulty: 'Intermediate',
    explanation: 'Interactive Intermediate challenge for JavaScript.\n<br/>Explore the depths of your coding skills.',
    purpose: 'Practice JavaScript.',
    instructions: ['Kerjakan kode JavaScript.', 'Pastikan tidak ada error sintaks.', 'Klik tombol Jalankan.'],
    initialHtml: '<!-- Write your test here -->\n<div id="test"></div>',
    initialCss: '/* Add styling */',
    initialJs: '// Write logic',
    hint: 'Gunakan referensi dari pelajaran sebelumnya.',
    expectedOutput: {
      htmlContains: ['div']
    },
    successMessage: 'Great job! You mastered this challenge.',
    failureMessage: 'Try again! Check your syntax.'
  },
  {
    id: 'ch-html-advanced-10',
    type: 'quick_task',
    level: 'HTML',
    title: 'Advanced HTML Challenge 1',
    difficulty: 'Advanced',
    explanation: 'Interactive Advanced challenge for HTML.\n<br/>Explore the depths of your coding skills.',
    purpose: 'Practice HTML.',
    instructions: ['Kerjakan kode HTML.', 'Pastikan tidak ada error sintaks.', 'Klik tombol Jalankan.'],
    initialHtml: '<!-- Write your test here -->\n<div id="test"></div>',
    initialCss: '/* Add styling */',
    initialJs: '// Write logic',
    hint: 'Gunakan referensi dari pelajaran sebelumnya.',
    expectedOutput: {
      htmlContains: ['div']
    },
    successMessage: 'Great job! You mastered this challenge.',
    failureMessage: 'Try again! Check your syntax.'
  },
  {
    id: 'ch-css-advanced-11',
    type: 'quick_task',
    level: 'CSS',
    title: 'Advanced CSS Challenge 2',
    difficulty: 'Advanced',
    explanation: 'Interactive Advanced challenge for CSS.\n<br/>Explore the depths of your coding skills.',
    purpose: 'Practice CSS.',
    instructions: ['Kerjakan kode CSS.', 'Pastikan tidak ada error sintaks.', 'Klik tombol Jalankan.'],
    initialHtml: '<!-- Write your test here -->\n<div id="test"></div>',
    initialCss: '/* Add styling */',
    initialJs: '// Write logic',
    hint: 'Gunakan referensi dari pelajaran sebelumnya.',
    expectedOutput: {
      htmlContains: ['div']
    },
    successMessage: 'Great job! You mastered this challenge.',
    failureMessage: 'Try again! Check your syntax.'
  },
  {
    id: 'ch-javascript-advanced-12',
    type: 'quick_task',
    level: 'JavaScript',
    title: 'Advanced JavaScript Challenge 3',
    difficulty: 'Advanced',
    explanation: 'Interactive Advanced challenge for JavaScript.\n<br/>Explore the depths of your coding skills.',
    purpose: 'Practice JavaScript.',
    instructions: ['Kerjakan kode JavaScript.', 'Pastikan tidak ada error sintaks.', 'Klik tombol Jalankan.'],
    initialHtml: '<!-- Write your test here -->\n<div id="test"></div>',
    initialCss: '/* Add styling */',
    initialJs: '// Write logic',
    hint: 'Gunakan referensi dari pelajaran sebelumnya.',
    expectedOutput: {
      htmlContains: ['div']
    },
    successMessage: 'Great job! You mastered this challenge.',
    failureMessage: 'Try again! Check your syntax.'
  },
  {
    id: 'ch-html-advanced-13',
    type: 'quick_task',
    level: 'HTML',
    title: 'Advanced HTML Challenge 4',
    difficulty: 'Advanced',
    explanation: 'Interactive Advanced challenge for HTML.\n<br/>Explore the depths of your coding skills.',
    purpose: 'Practice HTML.',
    instructions: ['Kerjakan kode HTML.', 'Pastikan tidak ada error sintaks.', 'Klik tombol Jalankan.'],
    initialHtml: '<!-- Write your test here -->\n<div id="test"></div>',
    initialCss: '/* Add styling */',
    initialJs: '// Write logic',
    hint: 'Gunakan referensi dari pelajaran sebelumnya.',
    expectedOutput: {
      htmlContains: ['div']
    },
    successMessage: 'Great job! You mastered this challenge.',
    failureMessage: 'Try again! Check your syntax.'
  },
  {
    id: 'ch-css-advanced-14',
    type: 'quick_task',
    level: 'CSS',
    title: 'Advanced CSS Challenge 5',
    difficulty: 'Advanced',
    explanation: 'Interactive Advanced challenge for CSS.\n<br/>Explore the depths of your coding skills.',
    purpose: 'Practice CSS.',
    instructions: ['Kerjakan kode CSS.', 'Pastikan tidak ada error sintaks.', 'Klik tombol Jalankan.'],
    initialHtml: '<!-- Write your test here -->\n<div id="test"></div>',
    initialCss: '/* Add styling */',
    initialJs: '// Write logic',
    hint: 'Gunakan referensi dari pelajaran sebelumnya.',
    expectedOutput: {
      htmlContains: ['div']
    },
    successMessage: 'Great job! You mastered this challenge.',
    failureMessage: 'Try again! Check your syntax.'
  },
  {
    id: 'ch-javascript-advanced-15',
    type: 'quick_task',
    level: 'JavaScript',
    title: 'Advanced JavaScript Challenge 6',
    difficulty: 'Advanced',
    explanation: 'Interactive Advanced challenge for JavaScript.\n<br/>Explore the depths of your coding skills.',
    purpose: 'Practice JavaScript.',
    instructions: ['Kerjakan kode JavaScript.', 'Pastikan tidak ada error sintaks.', 'Klik tombol Jalankan.'],
    initialHtml: '<!-- Write your test here -->\n<div id="test"></div>',
    initialCss: '/* Add styling */',
    initialJs: '// Write logic',
    hint: 'Gunakan referensi dari pelajaran sebelumnya.',
    expectedOutput: {
      htmlContains: ['div']
    },
    successMessage: 'Great job! You mastered this challenge.',
    failureMessage: 'Try again! Check your syntax.'
  },
  {
    id: 'ch-html-advanced-16',
    type: 'quick_task',
    level: 'HTML',
    title: 'Advanced HTML Challenge 7',
    difficulty: 'Advanced',
    explanation: 'Interactive Advanced challenge for HTML.\n<br/>Explore the depths of your coding skills.',
    purpose: 'Practice HTML.',
    instructions: ['Kerjakan kode HTML.', 'Pastikan tidak ada error sintaks.', 'Klik tombol Jalankan.'],
    initialHtml: '<!-- Write your test here -->\n<div id="test"></div>',
    initialCss: '/* Add styling */',
    initialJs: '// Write logic',
    hint: 'Gunakan referensi dari pelajaran sebelumnya.',
    expectedOutput: {
      htmlContains: ['div']
    },
    successMessage: 'Great job! You mastered this challenge.',
    failureMessage: 'Try again! Check your syntax.'
  },
  {
    id: 'ch-css-advanced-17',
    type: 'quick_task',
    level: 'CSS',
    title: 'Advanced CSS Challenge 8',
    difficulty: 'Advanced',
    explanation: 'Interactive Advanced challenge for CSS.\n<br/>Explore the depths of your coding skills.',
    purpose: 'Practice CSS.',
    instructions: ['Kerjakan kode CSS.', 'Pastikan tidak ada error sintaks.', 'Klik tombol Jalankan.'],
    initialHtml: '<!-- Write your test here -->\n<div id="test"></div>',
    initialCss: '/* Add styling */',
    initialJs: '// Write logic',
    hint: 'Gunakan referensi dari pelajaran sebelumnya.',
    expectedOutput: {
      htmlContains: ['div']
    },
    successMessage: 'Great job! You mastered this challenge.',
    failureMessage: 'Try again! Check your syntax.'
  },
  {
    id: 'ch-javascript-advanced-18',
    type: 'quick_task',
    level: 'JavaScript',
    title: 'Advanced JavaScript Challenge 9',
    difficulty: 'Advanced',
    explanation: 'Interactive Advanced challenge for JavaScript.\n<br/>Explore the depths of your coding skills.',
    purpose: 'Practice JavaScript.',
    instructions: ['Kerjakan kode JavaScript.', 'Pastikan tidak ada error sintaks.', 'Klik tombol Jalankan.'],
    initialHtml: '<!-- Write your test here -->\n<div id="test"></div>',
    initialCss: '/* Add styling */',
    initialJs: '// Write logic',
    hint: 'Gunakan referensi dari pelajaran sebelumnya.',
    expectedOutput: {
      htmlContains: ['div']
    },
    successMessage: 'Great job! You mastered this challenge.',
    failureMessage: 'Try again! Check your syntax.'
  },
  {
    id: 'ch-html-advanced-19',
    type: 'quick_task',
    level: 'HTML',
    title: 'Advanced HTML Challenge 10',
    difficulty: 'Advanced',
    explanation: 'Interactive Advanced challenge for HTML.\n<br/>Explore the depths of your coding skills.',
    purpose: 'Practice HTML.',
    instructions: ['Kerjakan kode HTML.', 'Pastikan tidak ada error sintaks.', 'Klik tombol Jalankan.'],
    initialHtml: '<!-- Write your test here -->\n<div id="test"></div>',
    initialCss: '/* Add styling */',
    initialJs: '// Write logic',
    hint: 'Gunakan referensi dari pelajaran sebelumnya.',
    expectedOutput: {
      htmlContains: ['div']
    },
    successMessage: 'Great job! You mastered this challenge.',
    failureMessage: 'Try again! Check your syntax.'
  },
  {
    id: 'ch-css-advanced-20',
    type: 'quick_task',
    level: 'CSS',
    title: 'Advanced CSS Challenge 11',
    difficulty: 'Advanced',
    explanation: 'Interactive Advanced challenge for CSS.\n<br/>Explore the depths of your coding skills.',
    purpose: 'Practice CSS.',
    instructions: ['Kerjakan kode CSS.', 'Pastikan tidak ada error sintaks.', 'Klik tombol Jalankan.'],
    initialHtml: '<!-- Write your test here -->\n<div id="test"></div>',
    initialCss: '/* Add styling */',
    initialJs: '// Write logic',
    hint: 'Gunakan referensi dari pelajaran sebelumnya.',
    expectedOutput: {
      htmlContains: ['div']
    },
    successMessage: 'Great job! You mastered this challenge.',
    failureMessage: 'Try again! Check your syntax.'
  },
  {
    id: 'ch-javascript-advanced-21',
    type: 'quick_task',
    level: 'JavaScript',
    title: 'Advanced JavaScript Challenge 12',
    difficulty: 'Advanced',
    explanation: 'Interactive Advanced challenge for JavaScript.\n<br/>Explore the depths of your coding skills.',
    purpose: 'Practice JavaScript.',
    instructions: ['Kerjakan kode JavaScript.', 'Pastikan tidak ada error sintaks.', 'Klik tombol Jalankan.'],
    initialHtml: '<!-- Write your test here -->\n<div id="test"></div>',
    initialCss: '/* Add styling */',
    initialJs: '// Write logic',
    hint: 'Gunakan referensi dari pelajaran sebelumnya.',
    expectedOutput: {
      htmlContains: ['div']
    },
    successMessage: 'Great job! You mastered this challenge.',
    failureMessage: 'Try again! Check your syntax.'
  },
  {
    id: 'ch-html-advanced-22',
    type: 'quick_task',
    level: 'HTML',
    title: 'Advanced HTML Challenge 13',
    difficulty: 'Advanced',
    explanation: 'Interactive Advanced challenge for HTML.\n<br/>Explore the depths of your coding skills.',
    purpose: 'Practice HTML.',
    instructions: ['Kerjakan kode HTML.', 'Pastikan tidak ada error sintaks.', 'Klik tombol Jalankan.'],
    initialHtml: '<!-- Write your test here -->\n<div id="test"></div>',
    initialCss: '/* Add styling */',
    initialJs: '// Write logic',
    hint: 'Gunakan referensi dari pelajaran sebelumnya.',
    expectedOutput: {
      htmlContains: ['div']
    },
    successMessage: 'Great job! You mastered this challenge.',
    failureMessage: 'Try again! Check your syntax.'
  },
  {
    id: 'ch-css-advanced-23',
    type: 'quick_task',
    level: 'CSS',
    title: 'Advanced CSS Challenge 14',
    difficulty: 'Advanced',
    explanation: 'Interactive Advanced challenge for CSS.\n<br/>Explore the depths of your coding skills.',
    purpose: 'Practice CSS.',
    instructions: ['Kerjakan kode CSS.', 'Pastikan tidak ada error sintaks.', 'Klik tombol Jalankan.'],
    initialHtml: '<!-- Write your test here -->\n<div id="test"></div>',
    initialCss: '/* Add styling */',
    initialJs: '// Write logic',
    hint: 'Gunakan referensi dari pelajaran sebelumnya.',
    expectedOutput: {
      htmlContains: ['div']
    },
    successMessage: 'Great job! You mastered this challenge.',
    failureMessage: 'Try again! Check your syntax.'
  },
  {
    id: 'ch-javascript-advanced-24',
    type: 'quick_task',
    level: 'JavaScript',
    title: 'Advanced JavaScript Challenge 15',
    difficulty: 'Advanced',
    explanation: 'Interactive Advanced challenge for JavaScript.\n<br/>Explore the depths of your coding skills.',
    purpose: 'Practice JavaScript.',
    instructions: ['Kerjakan kode JavaScript.', 'Pastikan tidak ada error sintaks.', 'Klik tombol Jalankan.'],
    initialHtml: '<!-- Write your test here -->\n<div id="test"></div>',
    initialCss: '/* Add styling */',
    initialJs: '// Write logic',
    hint: 'Gunakan referensi dari pelajaran sebelumnya.',
    expectedOutput: {
      htmlContains: ['div']
    },
    successMessage: 'Great job! You mastered this challenge.',
    failureMessage: 'Try again! Check your syntax.'
  },
];
