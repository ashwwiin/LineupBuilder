import React, { useRef, useState } from 'react';
import PlayerNode from './PlayerNode';
import { Trophy, Shield, Maximize2, Minimize2, Star } from 'lucide-react';

export default function PitchCanvas({
  exportRef,
  teamInfo,
  players = [],
  selectedPlayerId,
  onSelectPlayer,
  onUpdatePlayerPosition,
  kitStyle,
  gkKitStyle,
  pitchTheme = 'classic',
  is3DView = false,
  isHalfPitch = false,
  onToggleHalfPitch,
  aspectRatio = 'square'
}) {
  const pitchRef = useRef(null);
  const [activeDragId, setActiveDragId] = useState(null);
  const isScore90 = pitchTheme === 'score90';

  // Pointer event drag handler
  const handlePointerStart = (e, playerId) => {
    setActiveDragId(playerId);

    const pitchElement = pitchRef.current;
    if (!pitchElement) return;

    const handlePointerMove = (moveEvent) => {
      const rect = pitchElement.getBoundingClientRect();
      let x = ((moveEvent.clientX - rect.left) / rect.width) * 100;
      let y = ((moveEvent.clientY - rect.top) / rect.height) * 100;

      x = Math.max(4, Math.min(96, x));
      y = Math.max(5, Math.min(95, y));

      onUpdatePlayerPosition(playerId, Math.round(x * 10) / 10, Math.round(y * 10) / 10);
    };

    const handlePointerUp = () => {
      setActiveDragId(null);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  // Theme Styles
  const getThemeStyles = () => {
    switch (pitchTheme) {
      case 'score90':
        return {
          bgClass: 'pitch-lawn-score90',
          lineColor: 'rgba(255, 255, 255, 0.85)',
          netColor: 'rgba(255, 255, 255, 0.3)'
        };
      case 'dark':
        return {
          bgClass: 'pitch-lawn-dark',
          lineColor: 'rgba(255, 255, 255, 0.75)',
          netColor: 'rgba(255, 255, 255, 0.2)'
        };
      case 'cyber':
        return {
          bgClass: 'pitch-lawn-cyber',
          lineColor: '#10b981',
          netColor: 'rgba(16, 185, 129, 0.3)'
        };
      case 'blueprint':
        return {
          bgClass: 'pitch-lawn-blueprint',
          lineColor: '#38bdf8',
          netColor: 'rgba(56, 189, 248, 0.25)'
        };
      case 'stripe-v':
        return {
          bgClass: 'pitch-lawn-striped-v',
          lineColor: '#ffffff',
          netColor: 'rgba(255, 255, 255, 0.4)'
        };
      case 'classic':
      default:
        return {
          bgClass: 'pitch-lawn-classic',
          lineColor: '#ffffff',
          netColor: 'rgba(255, 255, 255, 0.45)'
        };
    }
  };

  const theme = getThemeStyles();

  // Aspect Ratio Sizing
  const getAspectClass = () => {
    if (isHalfPitch) {
      return 'aspect-[4/3.8] max-w-2xl';
    }
    switch (aspectRatio) {
      case 'landscape':
        return 'aspect-[16/10] max-w-4xl';
      case 'story':
        return 'aspect-[9/14] max-w-md';
      case 'square':
      default:
        return 'aspect-[4/5] max-w-2xl';
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center p-2">
      {/* EXPORTABLE CANVAS WRAPPER */}
      <div
        ref={exportRef}
        id="tactix-export-canvas"
        className={`w-full ${getAspectClass()} relative rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-800 bg-slate-950 transition-all duration-300 ${
          is3DView || isScore90 ? 'pitch-perspective' : ''
        }`}
      >
        {/* PITCH SURFACE */}
        <div
          ref={pitchRef}
          className={`w-full h-full relative select-none ${theme.bgClass} ${
            is3DView || isScore90 ? 'pitch-3d-tilt' : ''
          }`}
        >
          <div className="stadium-lights" />

          {/* SCORE 90 BROADCAST TOP HEADER BANNER */}
          {isScore90 ? (
            <div className="absolute top-4 left-0 right-0 z-25 flex flex-col items-center justify-center px-4 pointer-events-none">
              <div className="flex items-center justify-between w-full max-w-lg mb-1">
                {/* Team Name Title */}
                <h1 className="text-xl sm:text-2xl font-black text-white uppercase tracking-wider font-heading drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] my-0">
                  {teamInfo.teamName || 'ARGENTINA'}
                  <span className="text-sky-300 font-extrabold ml-2 text-sm sm:text-base">
                    - MATCHDAY XI
                  </span>
                </h1>

                {/* Team Crest with 3 Gold Stars */}
                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-0.5 mb-0.5">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  </div>
                  {teamInfo.logo ? (
                    <img src={teamInfo.logo} alt="Crest" crossOrigin="anonymous" className="w-9 h-9 object-contain drop-shadow-md" />
                  ) : (
                    <div className="w-9 h-9 rounded-xl bg-amber-400/20 border-2 border-amber-400 flex items-center justify-center text-amber-400 shadow-xl">
                      <Shield className="w-5 h-5" />
                    </div>
                  )}
                </div>
              </div>

              {/* Subtitle Pill Badge (e.g. POSSIBLE LINEUP) */}
              <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 px-4 py-0.5 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-widest shadow-xl border border-amber-300">
                {teamInfo.matchInfo || 'POSSIBLE LINEUP'}
              </div>
            </div>
          ) : (
            /* STANDARD TEAM HEADER BANNER */
            <div className="absolute top-3 left-0 right-0 z-15 flex items-center justify-between px-6 pointer-events-none">
              <div className="flex items-center gap-3 bg-slate-950 px-3.5 py-1.5 rounded-xl border border-slate-800 shadow-2xl pointer-events-auto">
                {teamInfo.logo ? (
                  <img
                    src={teamInfo.logo}
                    alt={teamInfo.teamName}
                    crossOrigin="anonymous"
                    className="w-8 h-8 object-contain rounded"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400">
                    <Shield className="w-5 h-5" />
                  </div>
                )}

                <div className="flex flex-col">
                  <h2 className="text-sm font-extrabold text-slate-100 uppercase tracking-wider leading-none my-0">
                    {teamInfo.teamName || 'Custom Lineup'}
                  </h2>
                  {teamInfo.managerName && (
                    <span className="text-[10px] text-emerald-400 font-semibold mt-0.5">
                      Manager: {teamInfo.managerName}
                    </span>
                  )}
                </div>
              </div>

              {/* ACTION UI BUTTONS */}
              <div className="flex items-center gap-2 pointer-events-auto">
                {onToggleHalfPitch && (
                  <button
                    onClick={onToggleHalfPitch}
                    className="export-hide flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-950 text-slate-200 border border-slate-700 text-[11px] font-bold shadow-xl hover:bg-slate-800 cursor-pointer"
                    title={isHalfPitch ? 'Switch to Full Pitch View' : 'Switch to Half Pitch View'}
                  >
                    {isHalfPitch ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                    <span>{isHalfPitch ? 'Half Pitch' : 'Full Pitch'}</span>
                  </button>
                )}

                {teamInfo.matchInfo && (
                  <div className="hidden sm:flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 shadow-2xl text-[11px] font-bold text-amber-300">
                    <Trophy className="w-3.5 h-3.5 text-amber-400" />
                    <span>{teamInfo.matchInfo}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SVG PITCH MARKINGS */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none z-10"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            {!isHalfPitch ? (
              /* ================= FULL PITCH MARKINGS ================= */
              <g stroke={theme.lineColor} strokeWidth="1" fill="none">
                <rect x="5" y="4" width="90" height="92" />
                <line x1="5" y1="50" x2="95" y2="50" />
                <circle cx="50" cy="50" r="12" />
                <circle cx="50" cy="50" r="1.2" fill={theme.lineColor} />
                <rect x="22" y="4" width="56" height="18" />
                <rect x="36" y="4" width="28" height="6" />
                <circle cx="50" cy="16" r="1" fill={theme.lineColor} />
                <path d="M 40 22 A 10 10 0 0 0 60 22" />
                <rect x="42" y="1" width="16" height="3" fill={theme.netColor} strokeWidth="0.6" strokeDasharray="0.5 0.5" />
                <rect x="22" y="78" width="56" height="18" />
                <rect x="36" y="90" width="28" height="6" />
                <circle cx="50" cy="84" r="1" fill={theme.lineColor} />
                <path d="M 40 78 A 10 10 0 0 1 60 78" />
                <rect x="42" y="96" width="16" height="3" fill={theme.netColor} strokeWidth="0.6" strokeDasharray="0.5 0.5" />
                <path d="M 5 7 A 3 3 0 0 0 8 4" />
                <path d="M 92 4 A 3 3 0 0 0 95 7" />
                <path d="M 5 93 A 3 3 0 0 1 8 96" />
                <path d="M 95 93 A 3 3 0 0 0 92 96" />
              </g>
            ) : (
              /* ================= HALF PITCH MARKINGS ================= */
              <g stroke={theme.lineColor} strokeWidth="1.2" fill="none">
                <rect x="5" y="4" width="90" height="92" />
                <path d="M 34 4 A 16 16 0 0 0 66 4" />
                <circle cx="50" cy="4" r="1.2" fill={theme.lineColor} />
                <rect x="20" y="62" width="60" height="34" />
                <rect x="34" y="82" width="32" height="14" />
                <circle cx="50" cy="74" r="1.2" fill={theme.lineColor} />
                <path d="M 37 62 A 13 13 0 0 1 63 62" />
                <rect x="40" y="96" width="20" height="3" fill={theme.netColor} strokeWidth="0.8" strokeDasharray="0.5 0.5" />
                <path d="M 5 91 A 5 5 0 0 1 10 96" />
                <path d="M 95 91 A 5 5 0 0 0 90 96" />
              </g>
            )}
          </svg>

          {/* WATERMARK */}
          <div className="absolute bottom-2 right-4 z-15 text-[10px] font-black text-slate-100/60 tracking-widest uppercase pointer-events-none select-none">
            {isScore90 ? 'SCORE 90 × TACTIX' : 'Tactix Board'}
          </div>

          {/* PLAYER NODES LAYER */}
          {players.map((player) => (
            <PlayerNode
              key={player.id}
              player={player}
              isSelected={selectedPlayerId === player.id}
              onSelect={onSelectPlayer}
              onDragStart={handlePointerStart}
              kitStyle={kitStyle}
              gkKitStyle={gkKitStyle}
              pitchTheme={pitchTheme}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
