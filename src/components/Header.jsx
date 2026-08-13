import React, { useState } from 'react';
import { toPng, toJpeg } from 'html-to-image';
import confetti from 'canvas-confetti';
import {
  Download,
  Share2,
  RotateCcw,
  Sparkles,
  Check,
  Camera,
  Image as ImageIcon,
  Maximize2,
  Minimize2,
  Bookmark,
  FolderOpen
} from 'lucide-react';

export default function Header({
  exportRef,
  squadState,
  onResetSquad,
  onCopyShareLink,
  isHalfPitch,
  onToggleHalfPitch,
  onSaveSquad,
  savedSquads = [],
  onLoadSavedSquad
}) {
  const [isExporting, setIsExporting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [savedToast, setSavedToast] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showSavedMenu, setShowSavedMenu] = useState(false);

  // Reliable High-Resolution Export Handler with Image Pre-loading & Dual-Pass Rendering
  const handleExport = async (format = 'png') => {
    const node = exportRef.current;
    if (!node) return;
    setIsExporting(true);
    setShowExportMenu(false);

    try {
      // 1. Wait for all <img> elements inside export container to be fully decoded/loaded
      const images = Array.from(node.querySelectorAll('img'));
      await Promise.all(
        images.map((img) => {
          if (img.complete && img.naturalHeight !== 0) return Promise.resolve();
          return new Promise((resolve) => {
            img.onload = resolve;
            img.onerror = resolve;
          });
        })
      );

      // Filter export-hide elements (like edit buttons)
      const filter = (domNode) => {
        if (domNode.classList && domNode.classList.contains('export-hide')) {
          return false;
        }
        return true;
      };

      const exportOptions = {
        quality: 0.98,
        pixelRatio: 2.5,
        cacheBust: true,
        backgroundColor: '#070a12',
        filter,
        style: {
          transform: 'none',
          borderRadius: '24px'
        }
      };

      // 2. Dual-Pass Warmup: First run loads data URLs & fonts into canvas memory
      await toPng(node, { quality: 0.9, pixelRatio: 1.5, cacheBust: true, filter });
      await new Promise((resolve) => setTimeout(resolve, 100));

      // 3. Second run generates the final crisp export image
      const dataUrl = format === 'jpeg' 
        ? await toJpeg(node, exportOptions)
        : await toPng(node, exportOptions);

      // Create download link
      const link = document.createElement('a');
      const filename = `${(squadState.teamInfo.teamName || 'tactix-lineup')
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')}-${Date.now()}.${format}`;
      link.download = filename;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Celebration confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (err) {
      console.error('Export error:', err);
      try {
        const fallbackUrl = await toPng(node, { quality: 0.9, cacheBust: true });
        const link = document.createElement('a');
        link.download = `tactix-lineup-${Date.now()}.png`;
        link.href = fallbackUrl;
        link.click();
      } catch (fallbackErr) {
        alert('Could not export image. Please try again.');
      }
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyLink = () => {
    onCopyShareLink();
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleQuickSave = () => {
    const squadName = squadState.teamInfo.teamName || 'Saved Squad';
    onSaveSquad(squadName);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
  };

  return (
    <header className="w-full bg-slate-900/90 backdrop-blur-xl border-b border-slate-800 px-4 py-3 sticky top-0 z-40 shadow-2xl">
      <div className="max-w-[1600px] mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* LOGO & BRAND */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-lg shadow-emerald-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-emerald-400" />
            </div>
          </div>

          <div>
            <h1 className="font-heading text-base sm:text-lg font-black text-slate-100 tracking-tight leading-none my-0 flex items-center gap-2">
              Tactix
              <span className="text-emerald-400 text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                PRO
              </span>
            </h1>
            <p className="text-[10px] text-slate-400 font-medium hidden sm:block my-0 mt-0.5">
              Tactical Football Lineup & Matchday Graphics Builder
            </p>
          </div>
        </div>

        {/* ACTION TOOLBAR */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Pitch Mode Toggle */}
          <button
            onClick={onToggleHalfPitch}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
              isHalfPitch
                ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/20'
                : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border-slate-800'
            }`}
            title="Toggle between Full Ground and Half Pitch view"
          >
            {isHalfPitch ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            <span className="hidden xs:inline sm:inline">{isHalfPitch ? 'Half Pitch' : 'Full Pitch'}</span>
          </button>

          {/* Quick Save Squad Button */}
          <button
            onClick={handleQuickSave}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
              savedToast
                ? 'bg-amber-500/20 text-amber-300 border-amber-500'
                : 'bg-slate-950 hover:bg-slate-800 text-slate-200 border-slate-800'
            }`}
            title="Save current squad lineup to LocalStorage"
          >
            <Bookmark className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">{savedToast ? 'Squad Saved!' : 'Save Lineup'}</span>
          </button>

          {/* Load Saved Squads Dropdown */}
          {savedSquads.length > 0 && (
            <div className="relative">
              <button
                onClick={() => setShowSavedMenu(!showSavedMenu)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-bold transition-all cursor-pointer"
                title="Load a saved squad"
              >
                <FolderOpen className="w-4 h-4 text-sky-400" />
                <span className="hidden sm:inline">Saved ({savedSquads.length})</span>
              </button>

              {showSavedMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="text-[10px] font-black uppercase text-slate-400 px-2 py-1 border-b border-slate-800">
                    Load Saved Squad
                  </div>
                  <div className="max-h-48 overflow-y-auto space-y-1 mt-1">
                    {savedSquads.map((squad) => (
                      <button
                        key={squad.id}
                        onClick={() => {
                          onLoadSavedSquad(squad);
                          setShowSavedMenu(false);
                        }}
                        className="w-full text-left px-2.5 py-1.5 text-xs font-bold text-slate-200 hover:bg-slate-800 hover:text-emerald-400 rounded-lg flex items-center justify-between cursor-pointer"
                      >
                        <span className="truncate">{squad.name}</span>
                        <span className="text-[9px] text-emerald-400 font-mono">{squad.formationId}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Reset Squad */}
          <button
            onClick={onResetSquad}
            className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 transition-all cursor-pointer"
            title="Reset Squad to Default"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Share Link */}
          <button
            onClick={handleCopyLink}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
              copied
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500'
                : 'bg-slate-950 hover:bg-slate-800 text-slate-200 border-slate-800'
            }`}
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            <span className="hidden sm:inline">{copied ? 'Link Copied!' : 'Share'}</span>
          </button>

          {/* High-Res Export Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              disabled={isExporting}
              className="flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-500/25 transition-all cursor-pointer disabled:opacity-50"
            >
              {isExporting ? (
                <div className="w-4 h-4 rounded-full border-2 border-slate-950 border-t-transparent animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              <span>{isExporting ? 'Exporting...' : 'Export Graphic'}</span>
            </button>

            {/* Format Dropdown Menu */}
            {showExportMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <button
                  onClick={() => handleExport('png')}
                  className="w-full text-left px-3 py-2 text-xs font-bold text-slate-200 hover:bg-slate-800 hover:text-emerald-400 rounded-lg flex items-center justify-between cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
                    High-Res PNG
                  </span>
                  <span className="text-[10px] text-slate-400">Best</span>
                </button>

                <button
                  onClick={() => handleExport('jpeg')}
                  className="w-full text-left px-3 py-2 text-xs font-bold text-slate-200 hover:bg-slate-800 hover:text-emerald-400 rounded-lg flex items-center justify-between cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Camera className="w-3.5 h-3.5 text-amber-400" />
                    JPEG Image
                  </span>
                  <span className="text-[10px] text-slate-400">Compact</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
