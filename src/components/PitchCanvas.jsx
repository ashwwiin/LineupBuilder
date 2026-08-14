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
  onSwapPlayers,
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
  const [hoveredSwapId, setHoveredSwapId] = useState(null);
  const isScore90 = pitchTheme === 'score90';

  // Pointer event drag handler with Drag-to-Swap detection
  const handlePointerStart = (e, playerId) => {
    setActiveDragId(playerId);

    const pitchElement = pitchRef.current;
    if (!pitchElement) return;

    // Initial position of dragged player before move
    const initialPlayer = players.find((p) => p.id === playerId);
    const startX = initialPlayer ? initialPlayer.x : 50;
    const startY = initialPlayer ? initialPlayer.y : 50;

    let currentTargetId = null;

    const handlePointerMove = (moveEvent) => {
      const rect = pitchElement.getBoundingClientRect();
      let x = ((moveEvent.clientX - rect.left) / rect.width) * 100;
      let y = ((moveEvent.clientY - rect.top) / rect.height) * 100;

      x = Math.max(4, Math.min(96, x));
      y = Math.max(12, Math.min(94, y));

      // Proximity check against all other pitch players (distance < 8.5%)
      const nearbyPlayer = players.find((p) => {
        if (p.id === playerId) return false;
        const dx = p.x - x;
        const dy = p.y - y;
        return Math.sqrt(dx * dx + dy * dy) < 8.5;
      });

      if (nearbyPlayer) {
        currentTargetId = nearbyPlayer.id;
        setHoveredSwapId(nearbyPlayer.id);
      } else {
        currentTargetId = null;
        setHoveredSwapId(null);
      }

      onUpdatePlayerPosition(playerId, Math.round(x * 10) / 10, Math.round(y * 10) / 10);
    };

    const handlePointerUp = () => {
      setActiveDragId(null);
      setHoveredSwapId(null);

      if (currentTargetId && onSwapPlayers) {
        // Revert dragged player position to original spot
        onUpdatePlayerPosition(playerId, startX, startY);
        // Execute player spot swap
        onSwapPlayers(playerId, currentTargetId);
      }

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
          <div className="stadium-lights export-hide" />

          {/* STANDARD TEAM HEADER BANNER */}
          <div className="absolute top-1.5 sm:top-3 left-0 right-0 z-15 flex items-center justify-between px-1.5 sm:px-4 pointer-events-none">
            <div className="flex items-center gap-1.5 sm:gap-2.5 bg-slate-950 border border-slate-800 px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl shadow-2xl pointer-events-auto max-w-[65%] sm:max-w-none">
              {teamInfo.logo ? (
                <img
                  src={teamInfo.logo}
                  alt={teamInfo.teamName}
                  crossOrigin="anonymous"
                  className="w-4 h-4 sm:w-7 sm:h-7 object-contain rounded shrink-0"
                />
              ) : (
                <div className="w-4 h-4 sm:w-7 sm:h-7 rounded sm:rounded-lg bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400 shrink-0">
                  <Shield className="w-3 h-3 sm:w-4 sm:h-4" />
                </div>
              )}

              <div className="flex flex-col truncate">
                <h2 className="text-[9px] sm:text-xs font-extrabold text-slate-100 uppercase tracking-wider leading-none my-0 truncate">
                  {teamInfo.teamName || 'Custom Lineup'}
                </h2>
                {teamInfo.managerName && (
                  <span className="text-[7.5px] sm:text-[9px] text-emerald-400 font-semibold mt-0.5 truncate">
                    Manager: {teamInfo.managerName}
                  </span>
                )}
              </div>
            </div>

            {/* ACTION UI BUTTONS */}
            <div className="flex items-center gap-1 sm:gap-2 pointer-events-auto shrink-0">
              {onToggleHalfPitch && (
                <button
                  onClick={onToggleHalfPitch}
                  className="export-hide flex items-center gap-1 px-1.5 py-1 sm:px-2.5 sm:py-1.5 rounded-lg sm:rounded-xl bg-slate-950/90 text-slate-200 border border-slate-700 text-[8.5px] sm:text-[11px] font-bold shadow-xl hover:bg-slate-800 cursor-pointer"
                  title={isHalfPitch ? 'Switch to Full Pitch View' : 'Switch to Half Pitch View'}
                >
                  {isHalfPitch ? <Minimize2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> : <Maximize2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
                  <span className="hidden xs:inline">{isHalfPitch ? 'Half Pitch' : 'Full Pitch'}</span>
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
            Tactix Board
          </div>

          {/* PLAYER NODES LAYER */}
          {players.map((player) => (
            <PlayerNode
              key={player.id}
              player={player}
              isSelected={selectedPlayerId === player.id}
              isSwapTarget={hoveredSwapId === player.id}
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
