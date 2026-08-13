import React from 'react';
import { Shield, Users, Trophy, Crown, Sparkles } from 'lucide-react';

export default function LeftRosterPanel({
  teamInfo,
  players = [],
  selectedPlayerId,
  onSelectPlayer,
  formationId
}) {
  return (
    <div className="w-full lg:w-72 shrink-0 bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-2xl p-4 shadow-2xl flex flex-col justify-between h-full select-none">
      <div className="flex flex-col h-full">
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

        {/* ROSTER BAR TITLE */}
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-black uppercase tracking-wider text-slate-200">
              Matchday Lineup
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-black bg-slate-950 text-slate-400 px-2 py-0.5 rounded-lg border border-slate-800">
              {formationId || '4-3-3'}
            </span>
            <span className="text-[10px] font-black bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-lg border border-emerald-500/40">
              11 XI
            </span>
          </div>
        </div>

        {/* 11 PLAYERS LIST GRID */}
        <div className="flex-1 space-y-1.5 overflow-y-auto pr-1 scrollbar-thin">
          {players.map((p) => {
            const isGK = p.isGoalkeeper || p.pos === 'GK';
            const isSelected = selectedPlayerId === p.id;

            return (
              <div
                key={p.id}
                onClick={() => onSelectPlayer(p)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl border transition-all cursor-pointer group ${
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
                <div className="overflow-hidden flex-1 flex items-center justify-between gap-1.5">
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
              </div>
            );
          })}
        </div>

        {/* BOTTOM MATCHDAY INFO */}
        {teamInfo.matchInfo && (
          <div className="mt-3 pt-3 border-t border-slate-800/90 flex items-center justify-between text-[11px] font-bold text-amber-300">
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
