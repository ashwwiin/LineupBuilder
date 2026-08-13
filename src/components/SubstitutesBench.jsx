import React from 'react';
import JerseySVG from './JerseySVG';
import { UserPlus, Trash2, ArrowLeftRight, Edit3 } from 'lucide-react';

export default function SubstitutesBench({
  bench = [],
  onAddSub,
  onRemoveSub,
  onSelectSub,
  selectedSubId,
  selectedPitchPlayer,
  onSwapWithPitch,
  kitStyle,
  gkKitStyle
}) {
  return (
    <div className="bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-800 p-4 shadow-xl">
      <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <h3 className="font-heading text-sm font-bold text-slate-200 tracking-wide uppercase">
            Substitutes Bench ({bench.length})
          </h3>
        </div>

        <button
          onClick={onAddSub}
          className="flex items-center gap-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold px-2.5 py-1 rounded-lg transition-all cursor-pointer"
        >
          <UserPlus className="w-3.5 h-3.5" />
          Add Sub
        </button>
      </div>

      {bench.length === 0 ? (
        <div className="text-center py-4 text-xs text-slate-500 italic">
          No substitutes added. Click "Add Sub" to populate the bench.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
          {bench.map((sub) => {
            const isGK = sub.pos === 'GK';
            const currentKit = isGK ? gkKitStyle : kitStyle;
            const isSelected = selectedSubId === sub.id;

            return (
              <div
                key={sub.id}
                onClick={() => onSelectSub(sub)}
                className={`relative group p-2 rounded-xl border transition-all cursor-pointer flex items-center gap-2.5 ${
                  isSelected
                    ? 'bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500/30'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                }`}
              >
                {/* Visual Icon / Photo */}
                <div className="relative shrink-0">
                  {sub.photo ? (
                    <img
                      src={sub.photo}
                      alt={sub.name}
                      className="w-9 h-9 rounded-full object-cover border border-slate-700"
                    />
                  ) : (
                    <JerseySVG
                      primaryColor={currentKit.primaryColor}
                      secondaryColor={currentKit.secondaryColor}
                      collarColor={currentKit.collarColor || '#ffffff'}
                      sleeveColor={currentKit.sleeveColor || currentKit.primaryColor}
                      pattern={currentKit.pattern}
                      numberColor={currentKit.numberColor}
                      number={sub.number}
                      size={36}
                    />
                  )}
                  <span className="absolute -bottom-1 -right-1 text-[8px] font-black bg-slate-900 text-slate-300 px-1 rounded border border-slate-700">
                    {sub.pos || 'SUB'}
                  </span>
                </div>

                {/* Sub Info */}
                <div className="overflow-hidden min-w-0 flex-1">
                  <div className="text-xs font-bold text-slate-200 truncate">
                    {sub.name || `Sub #${sub.number}`}
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium">
                    Shirt #{sub.number}
                  </div>
                </div>

                {/* Quick Actions overlay on hover or selection */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {selectedPitchPlayer && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSwapWithPitch(sub.id, selectedPitchPlayer.id);
                      }}
                      title={`Swap with ${selectedPitchPlayer.name}`}
                      className="p-1 text-emerald-400 hover:bg-emerald-500/20 rounded cursor-pointer"
                    >
                      <ArrowLeftRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveSub(sub.id);
                    }}
                    title="Remove Substitute"
                    className="p-1 text-rose-400 hover:bg-rose-500/20 rounded cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
