import { useState } from 'react';
import { Copy, Check, Download, FileText } from 'lucide-react';
import jsPDF from 'jspdf';

export default function ExportBar({ data, title = 'Report' }) {
  const [copied, setCopied] = useState(false);

  function flattenData(obj, indent = '') {
    if (!obj) return '';
    if (typeof obj === 'string') return obj;
    if (Array.isArray(obj)) return obj.map((v) => `${indent}- ${flattenData(v)}`).join('\n');
    return Object.entries(obj)
      .map(([k, v]) => `${indent}${k.replace(/_/g, ' ').toUpperCase()}:\n${flattenData(v, indent + '  ')}`)
      .join('\n\n');
  }

  const text = flattenData(data);

  async function handleCopy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handlePDF() {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const margin = 40;
    const maxWidth = doc.internal.pageSize.getWidth() - margin * 2;
    doc.setFontSize(18);
    doc.setTextColor(37, 99, 235);
    doc.text(title, margin, 60);
    doc.setFontSize(9);
    doc.setTextColor(60, 60, 80);
    const lines = doc.splitTextToSize(text, maxWidth);
    doc.text(lines, margin, 90);
    doc.save(`${title.replace(/\s+/g, '_')}.pdf`);
  }

  return (
    <div className="flex flex-wrap items-center gap-2 py-3 border-t border-white/10">
      <span className="text-white/40 text-xs font-medium uppercase tracking-wider mr-1">Export</span>
      <button
        onClick={handleCopy}
        className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-white/8 hover:bg-white/15 border border-white/10 text-white/70 hover:text-white transition-all"
      >
        {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
        {copied ? 'Copied!' : 'Copy'}
      </button>
      <button
        onClick={handlePDF}
        className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-white/8 hover:bg-white/15 border border-white/10 text-white/70 hover:text-white transition-all"
      >
        <FileText size={12} />
        PDF
      </button>
    </div>
  );
}
