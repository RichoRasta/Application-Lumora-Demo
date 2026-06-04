import React, { useState, useRef, useEffect } from 'react';
import { Search, PlusCircle, Calendar, Download, FileText, File } from 'lucide-react';
import { jsPDF } from 'jspdf';

export default function Notes() {
  const [notes] = useState([
    { id: 1, title: 'Menyingkat tag HTML', content: 'Tag HTML selalu berpasangan, <p> harus ditutup </p>. Ada yang jomblo seperti <img>.', date: 'Hari ini' },
    { id: 2, title: 'Warna Hex CSS', content: 'Format hex menggunakan awalan tagar, contoh #FFFFFF itu putih, #000000 hitam.', date: 'Kemarin' }
  ]);
  
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const downloadMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (downloadMenuRef.current && !downloadMenuRef.current.contains(event.target as Node)) {
        setShowDownloadMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const downloadText = () => {
    let content = "Catatan Pribadi LUMORA\n\n";
    notes.forEach(n => {
      content += `=== ${n.title} ===\n`;
      content += `Tanggal: ${n.date}\n`;
      content += `${n.content}\n\n`;
    });
    
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "catatan_lumora.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setShowDownloadMenu(false);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    let y = 20;
    
    doc.setFontSize(16);
    doc.text("Catatan Pribadi - LUMORA", 20, y);
    y += 15;
    
    notes.forEach(n => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(n.title, 20, y);
      y += 8;
      
      doc.setFontSize(10);
      doc.setFont("helvetica", "italic");
      doc.text(`Tanggal: ${n.date}`, 20, y);
      y += 8;
      
      doc.setFont("helvetica", "normal");
      const splitContent = doc.splitTextToSize(n.content, 170);
      doc.text(splitContent, 20, y);
      y += (splitContent.length * 6) + 10;
    });
    
    doc.save("catatan_lumora.pdf");
    setShowDownloadMenu(false);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto pb-24">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-navy dark:text-white mb-2">Catatan Pribadi</h1>
          <p className="text-gray-500 dark:text-gray-400">Tulis rahasia atau rumus cepat dari apa yang kamu pelajari.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative" ref={downloadMenuRef}>
            <button 
              onClick={() => setShowDownloadMenu(!showDownloadMenu)}
              className="flex items-center gap-2 bg-white dark:bg-slate border border-gray-200 dark:border-gray-800 text-navy dark:text-white px-4 py-2.5 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-sm"
            >
              <Download className="w-5 h-5 text-gray-500" />
              <span className="hidden sm:inline">Unduh</span>
            </button>
            
            {showDownloadMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate border border-gray-100 dark:border-gray-800 rounded-xl shadow-lg overflow-hidden z-20">
                <button 
                  onClick={downloadPDF}
                  className="w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors border-b border-gray-50 dark:border-gray-800"
                >
                  <File className="w-4 h-4 text-red-500" />
                  <span className="text-sm font-medium text-navy dark:text-white">Unduh PDF</span>
                </button>
                <button 
                  onClick={downloadText}
                  className="w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <FileText className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-medium text-navy dark:text-white">Unduh Text (.txt)</span>
                </button>
              </div>
            )}
          </div>
          <button className="flex items-center gap-2 bg-primary-blue text-white px-4 py-2.5 rounded-xl font-bold hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/20">
            <PlusCircle className="w-5 h-5" />
            <span className="hidden sm:inline">Kertas Baru</span>
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate border border-gray-100 dark:border-gray-800 p-2 rounded-xl flex items-center gap-3 mb-6 shadow-sm">
        <Search className="w-5 h-5 text-gray-400 ml-2" />
        <input 
          type="text" 
          placeholder="Cari catatan..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-transparent flex-1 p-2 outline-none text-navy dark:text-white placeholder-gray-400"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {notes.filter(note => note.title.toLowerCase().includes(searchQuery.toLowerCase()) || note.content.toLowerCase().includes(searchQuery.toLowerCase())).map(note => (
          <div key={note.id} className="group bg-yellow-50/50 dark:bg-yellow-900/10 border border-yellow-200/50 dark:border-yellow-700/30 p-5 rounded-2xl hover:shadow-md transition-all cursor-pointer relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-yellow-400"></div>
            <h3 className="font-bold text-navy dark:text-white text-lg mb-2">{note.title}</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 leading-relaxed line-clamp-3">
              {note.content}
            </p>
            <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
              <Calendar className="w-3.5 h-3.5" />
              {note.date}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
