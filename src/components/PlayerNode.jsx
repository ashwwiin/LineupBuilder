import React, { useRef } from 'react';
import JerseySVG from './JerseySVG';

export default function PlayerNode({
  player,
  isSelected,
  onSelect,
  onDragStart,
  kitStyle,
  gkKitStyle,
  pitchTheme
}) {
  const nodeRef = useRef(null);
  const isGK = player.isGoalkeeper || player.pos === 'GK';
  const currentKit = isGK ? gkKitStyle : kitStyle;
  const isScore90 = pitchTheme === 'score90';

  const handlePointerDown = (e) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    onSelect(player);
    if (onDragStart) {
      onDragStart(e, player.id);
    }
  };

  return (
    <div
      ref={nodeRef}
      onPointerDown={handlePointerDown}
      style={{
        left: `${player.x}%`,
        top: `${player.y}%`,
        transform: 'translate(-50%, -50%)',
      }}
      className={`absolute z-20 cursor-grab active:cursor-grabbing transition-transform duration-75 select-none group touch-none ${
        isSelected ? 'z-30 scale-110' : 'hover:scale-105'
      }`}
      title={`${player.name} (${player.pos}) - #${player.number}`}
    >
      <div className="flex flex-col items-center">
        {/* PLAYER BADGE / PHOTO / JERSEY */}
        <div className="relative flex flex-col items-center justify-center">
          {/* Captain Armband Badge */}
          {player.isCaptain && (
            <div className="absolute -top-3 -left-3 z-30 bg-amber-400 text-slate-950 text-xs font-black w-7 h-7 rounded-full flex items-center justify-center border-2 border-slate-950 shadow-2xl">
              C
            </div>
          )}

          {/* Direct Large Photo Avatar or Custom Jersey SVG */}
          {player.photo ? (
            <div
              className={`relative rounded-full overflow-hidden border-4 shadow-2xl bg-slate-950 transition-all ${
                isScore90 ? 'w-22 h-22 sm:w-28 sm:h-28' : 'w-20 h-20 sm:w-24 sm:h-24'
              } ${
                isSelected
                  ? 'border-emerald-400 ring-4 ring-emerald-500/60 scale-105'
                  : isScore90
                  ? 'border-white shadow-2xl'
                  : isGK
                  ? 'border-amber-400'
                  : 'border-slate-100'
              }`}
            >
              <img
                src={player.photo}
                alt={player.name}
                crossOrigin="anonymous"
                loading="eager"
                className="w-full h-full object-cover object-top"
                style={{
                  transform: `scale(${player.photoZoom || 1.15}) translate(${player.photoOffsetX || 0}px, ${player.photoOffsetY || 0}px)`
                }}
              />
            </div>
          ) : (
            <div
              className={`relative p-1 rounded-2xl transition-all ${
                isSelected ? 'ring-4 ring-emerald-400/60 scale-105' : ''
              }`}
            >
              <JerseySVG
                primaryColor={currentKit.primaryColor}
                secondaryColor={currentKit.secondaryColor}
                collarColor={currentKit.collarColor || '#ffffff'}
                sleeveColor={currentKit.sleeveColor || currentKit.primaryColor}
                pattern={currentKit.pattern}
                numberColor={currentKit.numberColor}
                number={player.number}
                size={isScore90 ? 76 : 68}
              />
            </div>
          )}
        </div>

        {/* PLAYER NAME & POSITION TAG */}
        <div className="mt-1 flex flex-col items-center max-w-[160px]">
          {isScore90 ? (
            /* SCORE 90 BROADCAST STYLE NAME BANNER */
            <div className="flex items-center bg-white text-slate-950 rounded-md border border-slate-300 shadow-2xl px-2.5 py-1 max-w-[150px] font-black uppercase text-xs leading-tight tracking-wide">
              <span className="truncate max-w-[110px] text-slate-950 font-black">
                {player.name || `PLAYER ${player.number}`}
              </span>
              <span className={`ml-1.5 text-[9px] font-black px-1.5 py-0.5 rounded text-white ${
                isGK ? 'bg-amber-600' : 'bg-slate-950'
              }`}>
                {player.pos}
              </span>
            </div>
          ) : (
            /* CLASSIC TACTIX NAME BADGE */
            <div className="flex items-center gap-1.5 bg-slate-950/95 px-3 py-1 rounded-lg border border-slate-700 shadow-2xl">
              <span
                className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${
                  isGK
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                }`}
              >
                {player.pos}
              </span>
              <span className="text-xs font-extrabold text-slate-100 truncate tracking-tight max-w-[100px]">
                {player.name || `Player ${player.number}`}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
