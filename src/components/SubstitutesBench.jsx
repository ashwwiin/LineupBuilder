import React from 'react';
import JerseySVG from './JerseySVG';
import { UserPlus, Trash2, ArrowLeftRight, Edit3 } from 'lucide-react';

export default function SubstitutesBench({
  bench = [],
  pitchPlayers = [],
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
          <h3 className="font-heading text-sm font-bold text-slate-200 tracking-wide uppercase my-0">
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
                draggable={true}
                onDragStart={(e) => {
                  e.dataTransfer.setData(
                    'application/json',
                    JSON.stringify({ id: sub.id, isSub: true })
                  );
                  e.dataTransfer.effectAllowed = 'move';
                }}
                onClick={() => onSelectSub(sub)}
                className={`relative group p-2.5 rounded-xl border transition-all cursor-grab active:cursor-grabbing flex flex-col justify-between ${
                  isSelected
                    ? 'bg-emerald-950/60 border-emerald-500 ring-2 ring-emerald-500/30 shadow-lg'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center gap-2.5 w-full">
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

                  {/* Trash Icon on Hover */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveSub(sub.id);
                      }}
                      title="Remove Substitute"
                      className="p-1 text-slate-500 hover:text-rose-400 rounded cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Inline Quick Swap Dropdown when Selected */}
                {isSelected && onSwapWithPitch && pitchPlayers.length > 0 && (
                  <div
                    className="mt-2 pt-2 border-t border-emerald-500/30 flex flex-col gap-1 w-full animate-in fade-in duration-150"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span className="text-[9px] font-bold text-emerald-400 flex items-center gap-1">
                      <ArrowLeftRight className="w-3 h-3 text-emerald-400" /> Swap into XI:
                    </span>
                    <select
                      onChange={(e) => {
                        if (e.target.value) {
                          onSwapWithPitch(sub.id, Number(e.target.value));
                          e.target.value = '';
                        }
                      }}
                      className="w-full bg-slate-950 border border-slate-700 text-slate-200 text-[10px] font-bold rounded px-1.5 py-1 focus:outline-none focus:border-emerald-500"
                    >
                      <option value="">Select XI player...</option>
                      {pitchPlayers.map((p) => (
                        <option key={p.id} value={p.id}>
                          #{p.number} {p.name} ({p.pos})
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
