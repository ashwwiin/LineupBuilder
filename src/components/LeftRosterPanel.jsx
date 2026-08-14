import React from 'react';
import { Shield, Users, Trophy, Crown, Sparkles, ArrowLeftRight, UserPlus, Trash2 } from 'lucide-react';

export default function LeftRosterPanel({
  teamInfo,
  players = [],
  bench = [],
  selectedPlayerId,
  selectedSubId,
  onSelectPlayer,
  onSelectSub,
  onAddSub,
  onRemoveSub,
  formationId,
  onSwapPlayers,
  onSwapWithPitch
}) {
  return (
    <div className="w-full shrink-0 bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-2xl p-4 shadow-2xl flex flex-col justify-between h-full select-none">
      <div className="flex flex-col h-full overflow-hidden">
        {/* HEADER: Team Crest & Name */}
        <div className="flex items-center gap-3 border-b border-slate-800/90 pb-3.5 mb-3.5">
          {teamInfo.logo ? (
            <img
              src={teamInfo.logo}
              alt={teamInfo.teamName}
              className="w-9 h-9 object-contain rounded-lg border border-slate-700 p-0.5 bg-slate-950"
            />
          ) : (
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400 shrink-0 shadow-lg shadow-emerald-500/10">
              <Shield className="w-5 h-5" />
            </div>
          )}
          <div className="overflow-hidden flex-1">
            <h3 className="text-xs font-black text-slate-100 truncate uppercase tracking-wider my-0 leading-tight">
              {teamInfo.teamName || 'Starting XI'}
            </h3>
            {teamInfo.managerName && (
              <p className="text-[10px] text-emerald-400 font-bold truncate my-0 flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Coach: {teamInfo.managerName}
              </p>
            )}
          </div>
        </div>

        {/* SCROLLABLE ROSTER & BENCH CONTAINER */}
        <div className="flex-1 space-y-4 overflow-y-auto pr-1 scrollbar-thin">
          {/* SECTION 1: STARTING XI PLAYERS */}
          <div>
            <div className="flex items-center justify-between mb-2 px-1">
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-black uppercase tracking-wider text-slate-200">
                  Starting XI
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-black bg-slate-950 text-slate-400 px-2 py-0.5 rounded-lg border border-slate-800">
                  {formationId || '4-3-3'}
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              {players.map((p) => {
                const isGK = p.isGoalkeeper || p.pos === 'GK';
                const isSelected = selectedPlayerId === p.id;

                return (
                  <div
                    key={p.id}
                    draggable={true}
                    onDragStart={(e) => {
                      e.dataTransfer.setData(
                        'application/json',
                        JSON.stringify({ id: p.id, isSub: false })
                      );
                      e.dataTransfer.effectAllowed = 'move';
                    }}
                    onClick={() => onSelectPlayer(p)}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-xl border transition-all cursor-grab active:cursor-grabbing group ${
                      isSelected
                        ? 'bg-gradient-to-r from-emerald-950/90 to-slate-900 border-emerald-500 text-emerald-200 font-extrabold shadow-lg shadow-emerald-500/10 border-l-4 border-l-emerald-400 scale-[1.01]'
                        : 'bg-slate-950/70 border-slate-800/80 text-slate-300 hover:bg-slate-800/60 hover:border-slate-700'
                    }`}
                  >
                    {/* Mini Photo Headshot or Number Pill */}
                    {p.photo ? (
                      <div className="relative w-9 h-9 rounded-full overflow-hidden border-2 border-emerald-400 shrink-0 shadow-md">
                        <img
                          src={p.photo}
                          alt={p.name}
                          className="w-full h-full object-cover object-top"
                          style={{
                            transform: `scale(${p.photoZoom || 1.15}) translate(${p.photoOffsetX || 0}px, ${p.photoOffsetY || 0}px)`
                          }}
                        />
                      </div>
                    ) : (
                      <span className={`text-[10px] font-black w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${
                        isGK
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      }`}>
                        #{p.number}
                      </span>
                    )}

                    {/* Name & Position */}
                    <div className="overflow-hidden flex-1 flex flex-col justify-center">
                      <div className="flex items-center justify-between gap-1.5">
                        <div className="flex items-center gap-1.5 truncate">
                          <span className="text-xs font-bold truncate leading-tight">
                            {p.name || `Player ${p.number}`}
                          </span>
                          {p.isCaptain && (
                            <span
                              className="bg-amber-400 text-slate-950 text-[9px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 shadow-md"
                              title="Team Captain"
                            >
                              C
                            </span>
                          )}
                        </div>

                        <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded shrink-0 ${
                          isGK
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : 'bg-slate-800 text-slate-400 border border-slate-700'
                        }`}>
                          {p.pos}
                        </span>
                      </div>

                      {/* Inline Player Swap Option */}
                      {isSelected && onSwapPlayers && (
                        <div
                          className="mt-2 pt-1.5 border-t border-emerald-500/30 flex items-center justify-between gap-1.5 animate-in fade-in duration-150"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                            <ArrowLeftRight className="w-3 h-3 text-emerald-400" /> Swap spot:
                          </span>
                          <select
                            onChange={(e) => {
                              if (e.target.value) {
                                onSwapPlayers(p.id, Number(e.target.value));
                                e.target.value = '';
                              }
                            }}
                            className="bg-slate-950 border border-slate-700 text-slate-200 text-[10px] font-bold rounded-lg px-2 py-0.5 focus:outline-none focus:border-emerald-500 max-w-[130px]"
                          >
                            <option value="">Choose player...</option>
                            {players
                              .filter((other) => other.id !== p.id)
                              .map((other) => (
                                <option key={other.id} value={other.id}>
                                  #{other.number} {other.name} ({other.pos})
                                </option>
                              ))}
                          </select>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SECTION 2: SUBSTITUTES BENCH */}
          <div className="pt-2 border-t border-slate-800/80">
            <div className="flex items-center justify-between mb-2 px-1">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-black uppercase tracking-wider text-slate-200">
                  Substitutes ({bench.length})
                </span>
              </div>
              {onAddSub && (
                <button
                  onClick={onAddSub}
                  className="flex items-center gap-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-lg transition-all cursor-pointer"
                >
                  <UserPlus className="w-3 h-3" /> Add Sub
                </button>
              )}
            </div>

            {bench.length === 0 ? (
              <div className="text-center py-3 text-[11px] text-slate-500 italic bg-slate-950/40 rounded-xl border border-slate-800/60 p-2">
                No subs. Click "+ Add Sub" to populate bench.
              </div>
            ) : (
              <div className="space-y-1.5">
                {bench.map((sub) => {
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
                      onClick={() => onSelectSub && onSelectSub(sub)}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-xl border transition-all cursor-grab active:cursor-grabbing group ${
                        isSelected
                          ? 'bg-emerald-950/50 border-emerald-500 text-emerald-200 font-extrabold shadow-lg shadow-emerald-500/10 border-l-4 border-l-emerald-400'
                          : 'bg-slate-950/60 border-slate-800/80 text-slate-300 hover:bg-slate-800/60 hover:border-slate-700'
                      }`}
                    >
                      {/* Photo or Number Pill */}
                      {sub.photo ? (
                        <img
                          src={sub.photo}
                          alt={sub.name}
                          className="w-8 h-8 rounded-full object-cover border border-slate-700 shrink-0"
                        />
                      ) : (
                        <span className="text-[10px] font-black w-6 h-6 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center justify-center shrink-0">
                          #{sub.number}
                        </span>
                      )}

                      {/* Info */}
                      <div className="overflow-hidden flex-1 flex items-center justify-between gap-1">
                        <div className="truncate">
                          <span className="text-xs font-bold truncate block leading-tight text-slate-200">
                            {sub.name || `Sub #${sub.number}`}
                          </span>
                          <span className="text-[9px] text-slate-400 font-medium">
                            Shirt #{sub.number}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                            {sub.pos || 'SUB'}
                          </span>
                          {onRemoveSub && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onRemoveSub(sub.id);
                              }}
                              className="p-1 text-slate-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                              title="Remove Sub"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* BOTTOM MATCHDAY INFO */}
        {teamInfo.matchInfo && (
          <div className="mt-3 pt-3 border-t border-slate-800/90 flex items-center justify-between text-[11px] font-bold text-amber-300 shrink-0">
            <span className="flex items-center gap-1.5 truncate">
              <Trophy className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="truncate">{teamInfo.matchInfo}</span>
            </span>
            <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          </div>
        )}
      </div>
    </div>
  );
}
