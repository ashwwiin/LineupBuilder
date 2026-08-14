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
            <div className="absolute -top-1.5 -left-1.5 sm:-top-3 sm:-left-3 z-30 bg-amber-400 text-slate-950 text-[9px] sm:text-xs font-black w-4 h-4 sm:w-7 sm:h-7 rounded-full flex items-center justify-center border border-slate-950 sm:border-2 shadow-2xl">
              C
            </div>
          )}

          {/* Direct Large Photo Avatar or Custom Jersey SVG */}
          {player.photo ? (
            <div
              className={`relative rounded-full overflow-hidden border-2 sm:border-4 shadow-2xl bg-slate-950 transition-all ${
                isScore90
                  ? 'w-11 h-11 sm:w-20 sm:h-20 md:w-24 md:h-24'
                  : 'w-10 h-10 sm:w-16 sm:h-16 md:w-20 md:h-20'
              } ${
                isSelected
                  ? 'border-emerald-400 ring-2 sm:ring-4 ring-emerald-500/60 scale-105'
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
              className={`relative p-0.5 sm:p-1 rounded-xl sm:rounded-2xl transition-all ${
                isSelected ? 'ring-2 sm:ring-4 ring-emerald-400/60 scale-105' : ''
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
                className={
                  isScore90
                    ? 'w-11 h-11 sm:w-18 sm:h-18 md:w-20 md:h-20'
                    : 'w-10 h-10 sm:w-16 sm:h-16 md:w-18 md:h-18'
                }
              />
            </div>
          )}
        </div>

        {/* PLAYER NAME & POSITION TAG */}
        <div className="mt-0.5 sm:mt-1 flex flex-col items-center max-w-[85px] sm:max-w-[160px]">
          {isScore90 ? (
            /* SCORE 90 BROADCAST STYLE NAME BANNER */
            <div className="flex items-center bg-white text-slate-950 rounded-md border border-slate-300 shadow-2xl px-1.5 py-0.5 sm:px-2.5 sm:py-1 max-w-[90px] sm:max-w-[150px] font-black uppercase text-[9px] sm:text-xs leading-tight tracking-wide">
              <span className="truncate max-w-[55px] sm:max-w-[110px] text-slate-950 font-black">
                {player.name || `PLAYER ${player.number}`}
              </span>
              <span className={`ml-1 sm:ml-1.5 text-[7.5px] sm:text-[9px] font-black px-1 py-0.2 sm:px-1.5 sm:py-0.5 rounded text-white shrink-0 ${
                isGK ? 'bg-amber-600' : 'bg-slate-950'
              }`}>
                {player.pos}
              </span>
            </div>
          ) : (
            /* CLASSIC TACTIX NAME BADGE */
            <div className="flex items-center gap-1 sm:gap-1.5 bg-slate-950/95 px-1.5 py-0.5 sm:px-3 sm:py-1 rounded-md sm:rounded-lg border border-slate-700 shadow-2xl">
              <span
                className={`text-[8px] sm:text-[9px] font-black uppercase px-1 py-0.2 sm:px-1.5 sm:py-0.5 rounded shrink-0 ${
                  isGK
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                }`}
              >
                {player.pos}
              </span>
              <span className="text-[10px] sm:text-xs font-extrabold text-slate-100 truncate tracking-tight max-w-[55px] sm:max-w-[100px]">
                {player.name || `Player ${player.number}`}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
