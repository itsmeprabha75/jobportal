import './index.css';
import ResumeEditor from './components/ResumeEditor';
import ResumePreview from './components/ResumePreview';
import ATSScorePanel from './components/ATSScorePanel';
import { useRef, type ChangeEvent } from 'react';
import { useResumeStore } from './store/resumeStore';
import { Download, FileDown, Upload } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

function App() {
  const printRef = useRef<HTMLDivElement>(null);
  const { exportToJson, importFromJson } = useResumeStore();

  async function exportPdf() {
    const node = printRef.current;
    if (!node) return;
    const canvas = await html2canvas(node, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * pageWidth) / canvas.width;

    let position = 0;
    let heightLeft = imgHeight;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save('resume.pdf');
  }

  function exportJson() {
    const data = exportToJson();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'resume.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  function importJson(ev: ChangeEvent<HTMLInputElement>) {
    const file = ev.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result || '');
      importFromJson(text);
    };
    reader.readAsText(file);
    ev.currentTarget.value = '';
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 border-b bg-white/70 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
          <div className="h1">Resume Builder + ATS</div>
          <div className="flex items-center gap-2">
            <label className="button-ghost cursor-pointer">
              <Upload size={16} /> Import JSON
              <input type="file" accept="application/json" className="hidden" onChange={importJson} />
            </label>
            <button className="button-ghost" onClick={exportJson}><Download size={16} /> Export JSON</button>
            <button className="button" onClick={exportPdf}><FileDown size={16} /> Export PDF</button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <ResumeEditor />
          </div>
        </div>
        <div className="space-y-6">
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <ATSScorePanel />
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <div className="label mb-2">Preview</div>
            <ResumePreview ref={printRef} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
