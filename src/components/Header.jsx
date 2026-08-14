import React, { useState } from 'react';
import { toPng, toCanvas } from 'html-to-image';
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
  FolderOpen,
  Menu,
  X,
  User,
  LogOut,
  Cloud
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
  onLoadSavedSquad,
  user,
  onOpenAuthModal,
  onSignOut,
  onOpenMobileControls,
  onOpenMobileRoster
}) {
  const [isExporting, setIsExporting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [savedToast, setSavedToast] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showSavedMenu, setShowSavedMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

      // 3. Second run generates a real HTML5 Canvas
      const canvas = await toCanvas(node, exportOptions);
      const mimeType = format === 'jpeg' ? 'image/jpeg' : 'image/png';
      const ext = format === 'jpeg' ? 'jpg' : 'png';
      const cleanTeamName = (squadState?.teamInfo?.teamName || 'tactix-lineup')
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-');
      const filename = `${cleanTeamName}-${Date.now()}.${ext}`;

      // Convert Canvas directly to Blob (Native browser binary image creation)
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            alert('Export failed to generate image blob. Please try again.');
            return;
          }
          const blobUrl = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.download = filename;
          link.href = blobUrl;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          setTimeout(() => {
            URL.revokeObjectURL(blobUrl);
          }, 10000);

          // Celebration confetti
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 }
          });
        },
        mimeType,
        0.98
      );
    } catch (err) {
      console.error('Export error:', err);
      try {
        const fallbackCanvas = await toCanvas(node, { quality: 0.9, cacheBust: true });
        fallbackCanvas.toBlob((fallbackBlob) => {
          if (!fallbackBlob) return;
          const fallbackUrl = URL.createObjectURL(fallbackBlob);
          const link = document.createElement('a');
          link.download = `tactix-lineup-${Date.now()}.png`;
          link.href = fallbackUrl;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          setTimeout(() => URL.revokeObjectURL(fallbackUrl), 10000);
        }, 'image/png');
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
    <header className="w-full bg-slate-900/90 backdrop-blur-xl border-b border-slate-800 px-3 sm:px-4 py-2.5 sm:py-3 sticky top-0 z-40 shadow-2xl">
      <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-2">
        {/* LOGO & BRAND */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-lg shadow-emerald-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
            </div>
          </div>

          <div>
            <h1 className="font-heading text-base sm:text-lg font-black text-slate-100 tracking-tight leading-none my-0 flex items-center gap-1.5 sm:gap-2">
              Tactix
              <span className="text-emerald-400 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                PRO
              </span>
            </h1>
            <p className="text-[10px] text-slate-400 font-medium hidden md:block my-0 mt-0.5">
              Tactical Football Lineup & Matchday Graphics Builder
            </p>
          </div>
        </div>

        {/* DESKTOP ACTION TOOLBAR (Hidden on mobile < 1024px) */}
        <div className="hidden lg:flex items-center gap-2">
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
            <span>{isHalfPitch ? 'Half Pitch' : 'Full Pitch'}</span>
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
            <span>{savedToast ? 'Squad Saved!' : 'Save Lineup'}</span>
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
                <span>Saved ({savedSquads.length})</span>
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
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4 text-slate-300" />}
            <span>{copied ? 'Link Copied!' : 'Share'}</span>
          </button>

          {/* User Authentication Status / Login */}
          {user ? (
            <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] font-black uppercase border border-emerald-500/40">
                  {user.email ? user.email[0] : 'U'}
                </div>
                <span className="max-w-[120px] truncate">{user.email?.split('@')[0]}</span>
              </div>
              <button
                onClick={onSignOut}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-rose-400 cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-emerald-400 border border-emerald-500/40 text-xs font-extrabold transition-all cursor-pointer shadow-md shadow-emerald-500/10"
            >
              <User className="w-4 h-4" />
              <span>Sign In</span>
            </button>
          )}

          {/* High-Res Export Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              disabled={isExporting}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-500/25 transition-all cursor-pointer disabled:opacity-50"
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

        {/* MOBILE CONTROLS BAR (< lg) */}
        <div className="flex lg:hidden items-center gap-2">
          {/* Main Mobile Export Button */}
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              disabled={isExporting}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs shadow-lg cursor-pointer disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>

            {showExportMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-1.5 z-50">
                <button
                  onClick={() => handleExport('png')}
                  className="w-full text-left px-3 py-2 text-xs font-bold text-slate-200 hover:bg-slate-800 hover:text-emerald-400 rounded-lg flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
                    PNG Image
                  </span>
                </button>
                <button
                  onClick={() => handleExport('jpeg')}
                  className="w-full text-left px-3 py-2 text-xs font-bold text-slate-200 hover:bg-slate-800 hover:text-emerald-400 rounded-lg flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <Camera className="w-3.5 h-3.5 text-amber-400" />
                    JPEG Image
                  </span>
                </button>
              </div>
            )}
          </div>

          {/* Hamburger Menu Toggle Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white cursor-pointer"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* MOBILE FULL-HEIGHT RIGHT SLIDE-OVER NAVIGATION MENU */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="lg:hidden fixed inset-0 z-[100] flex justify-end bg-slate-950/95 backdrop-blur-xl animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full sm:max-w-sm h-full bg-slate-950 border-l border-slate-800 p-5 overflow-y-auto flex flex-col justify-between animate-in slide-in-from-right duration-300"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-black shadow-lg">
                    T
                  </div>
                  <span className="font-heading font-black text-sm text-slate-100 tracking-wide uppercase">
                    Tactix Menu
                  </span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Drawer Quick Links */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    if (onOpenMobileControls) onOpenMobileControls();
                  }}
                  className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-emerald-500 text-slate-950 text-xs font-extrabold shadow-md cursor-pointer"
                >
                  <span>⚙️ Controls</span>
                </button>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    if (onOpenMobileRoster) onOpenMobileRoster();
                  }}
                  className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 text-xs font-bold cursor-pointer"
                >
                  <span>📋 Roster</span>
                </button>
              </div>

              {/* User Account / Login Mobile */}
              {user ? (
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-black uppercase border border-emerald-500/40">
                      {user.email ? user.email[0] : 'U'}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-100">{user.email?.split('@')[0]}</span>
                      <span className="text-[9px] text-emerald-400 font-semibold">Cloud Sync Active</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      onSignOut();
                      setIsMobileMenuOpen(false);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-slate-950 text-rose-400 border border-slate-800 text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Sign Out
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    onOpenAuthModal();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-emerald-500 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-500/20 cursor-pointer"
                >
                  <User className="w-4 h-4" />
                  <span>Sign In to Cloud Sync</span>
                </button>
              )}

              {/* Export Graphics Quick Action */}
              <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                <span className="text-[11px] font-bold text-slate-300 flex items-center gap-2">
                  <Download className="w-4 h-4 text-emerald-400" /> Export High-Res Graphic
                </span>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      handleExport('png');
                    }}
                    className="p-2 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <ImageIcon className="w-3.5 h-3.5" /> PNG
                  </button>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      handleExport('jpeg');
                    }}
                    className="p-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Camera className="w-3.5 h-3.5" /> JPG
                  </button>
                </div>
              </div>

              {/* Pitch View Toggle */}
              <button
                onClick={() => {
                  onToggleHalfPitch();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-200 cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  {isHalfPitch ? <Minimize2 className="w-4 h-4 text-emerald-400" /> : <Maximize2 className="w-4 h-4 text-emerald-400" />}
                  <span>Pitch Mode</span>
                </div>
                <span className="text-[11px] font-mono text-emerald-400">
                  {isHalfPitch ? 'Half Pitch' : 'Full Pitch'}
                </span>
              </button>

              {/* Save Lineup */}
              <button
                onClick={() => {
                  handleQuickSave();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-200 cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Bookmark className="w-4 h-4 text-amber-400" />
                  <span>Save Squad Lineup</span>
                </div>
                <span className="text-[10px] text-slate-400">LocalStorage</span>
              </button>

              {/* Share Link */}
              <button
                onClick={() => {
                  handleCopyLink();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-200 cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Share2 className="w-4 h-4 text-sky-400" />
                  <span>Share Squad Link</span>
                </div>
                <span className="text-[10px] text-emerald-400">{copied ? 'Copied!' : 'Copy URL'}</span>
              </button>

              {/* Saved Squads Section */}
              {savedSquads.length > 0 && (
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="text-[11px] font-bold text-slate-300 flex items-center gap-2">
                    <FolderOpen className="w-4 h-4 text-sky-400" />
                    Load Saved Squad ({savedSquads.length})
                  </div>
                  <div className="space-y-1 max-h-36 overflow-y-auto pt-1">
                    {savedSquads.map((squad) => (
                      <button
                        key={squad.id}
                        onClick={() => {
                          onLoadSavedSquad(squad);
                          setIsMobileMenuOpen(false);
                        }}
                        className="w-full text-left p-2 rounded-lg bg-slate-950 hover:bg-slate-800 text-xs font-semibold text-slate-200 flex items-center justify-between cursor-pointer"
                      >
                        <span className="truncate">{squad.name}</span>
                        <span className="text-[9px] text-emerald-400 font-mono">{squad.formationId}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Reset Squad */}
              <button
                onClick={() => {
                  onResetSquad();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-2.5 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-rose-400 hover:bg-rose-500/10 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset Lineup to Default</span>
              </button>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-medium">Tactix PRO • Mobile</span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-slate-300 text-xs font-bold border border-slate-800 cursor-pointer"
              >
                Close Menu
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
