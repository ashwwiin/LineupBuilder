import React, { useState } from 'react';
import JerseySVG from './JerseySVG';
import ImageZoomModal from './ImageZoomModal';
import { SQUAD_PRESETS } from '../data/presets';
import {
  Users,
  UserCheck,
  Shirt,
  Settings,
  Upload,
  Crown,
  Trash2,
  Bookmark,
  Plus,
  RotateCcw,
  Sparkles,
  Move,
  ZoomIn,
  ZoomOut,
  ArrowLeftRight
} from 'lucide-react';

export default function Sidebar({
  activeTab,
  setActiveTab,
  teamInfo,
  setTeamInfo,
  currentFormationId,
  onChangeFormation,
  onLoadPreset,
  players = [],
  selectedPlayer,
  onUpdatePlayer,
  kitStyle,
  setKitStyle,
  gkKitStyle,
  setGkKitStyle,
  pitchTheme,
  setPitchTheme,
  is3DView,
  setIs3DView,
  isHalfPitch,
  onToggleHalfPitch,
  aspectRatio,
  setAspectRatio,
  savedSquads = [],
  onSaveSquad,
  onLoadSavedSquad,
  onDeleteSavedSquad,
  onSwapPlayers,
  bench = [],
  onSwapWithPitch
}) {
  const [newSquadName, setNewSquadName] = useState('');
  const [cropImageSrc, setCropImageSrc] = useState(null);
  const [swapTargetId, setSwapTargetId] = useState('');

  // Handle Photo File Select (Opens Zoom & Crop Modal)
  const handlePhotoUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCropImageSrc(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Team Logo Upload
  const handleLogoUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setTeamInfo({ ...teamInfo, logo: event.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full shrink-0 bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-2xl p-4 shadow-2xl flex flex-col h-full overflow-hidden select-none">
      {/* IMAGE ZOOM & CROP MODAL */}
      {cropImageSrc && (
        <ImageZoomModal
          imageSrc={cropImageSrc}
          initialZoom={selectedPlayer?.photoZoom || 1.15}
          initialX={selectedPlayer?.photoOffsetX || 0}
          initialY={selectedPlayer?.photoOffsetY || 0}
          onConfirm={(data) => {
            if (selectedPlayer) {
              onUpdatePlayer({
                ...selectedPlayer,
                photo: data.photo,
                photoZoom: data.photoZoom,
                photoOffsetX: data.photoOffsetX,
                photoOffsetY: data.photoOffsetY
              });
            }
            setCropImageSrc(null);
          }}
          onClose={() => setCropImageSrc(null)}
        />
      )}

      {/* NAVIGATION TABS HEADER */}
      <div className="grid grid-cols-4 gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800 mb-4">
        {[
          { id: 'squad', label: 'Squad', icon: Users },
          { id: 'player', label: 'Player', icon: UserCheck },
          { id: 'kit', label: 'Kits', icon: Shirt },
          { id: 'team', label: 'Pitch', icon: Settings }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                isActive
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT PANELS */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-4 scrollbar-thin">
        {/* ==================== TAB 1: SQUAD FORMATION & PRESETS ==================== */}
        {activeTab === 'squad' && (
          <div className="space-y-4">
            {/* Formation Selector */}
            <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 space-y-2">
              <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider">
                Select Formation
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  '4-3-3',
                  '4-2-3-1',
                  '4-4-2',
                  '3-5-2',
                  '5-3-2',
                  '4-1-2-1-2'
                ].map((fId) => (
                  <button
                    key={fId}
                    onClick={() => onChangeFormation(fId)}
                    className={`py-2 px-3 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                      currentFormationId === fId
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500'
                        : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    {fId}
                  </button>
                ))}
              </div>
            </div>

            {/* Tactical Presets */}
            <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 space-y-2">
              <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider">
                Famous Team Presets
              </label>
              <div className="space-y-1.5 max-h-56 overflow-y-auto scrollbar-thin pr-1">
                {SQUAD_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => onLoadPreset(preset)}
                    className="w-full text-left px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center justify-between transition-all cursor-pointer group"
                  >
                    <div className="flex flex-col truncate pr-2">
                      <span className="font-bold text-slate-100 group-hover:text-emerald-300 truncate">{preset.name}</span>
                      <span className="text-[10px] text-emerald-400 font-mono truncate">{preset.matchInfo}</span>
                    </div>
                    <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                  </button>
                ))}
              </div>
            </div>

            {/* Saved Squads Section */}
            <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 space-y-3">
              <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider">
                Saved Lineup Squads
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSquadName}
                  onChange={(e) => setNewSquadName(e.target.value)}
                  placeholder="Squad Name (e.g. UCL Final XI)"
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                />
                <button
                  onClick={() => {
                    if (newSquadName.trim()) {
                      onSaveSquad(newSquadName.trim());
                      setNewSquadName('');
                    }
                  }}
                  className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Save
                </button>
              </div>

              {savedSquads.length > 0 && (
                <div className="space-y-1.5 max-h-40 overflow-y-auto pt-1">
                  {savedSquads.map((squad) => (
                    <div
                      key={squad.id}
                      className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200"
                    >
                      <span className="font-semibold truncate max-w-[160px]">
                        {squad.name}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => onLoadSavedSquad(squad)}
                          className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold hover:bg-emerald-500/30 cursor-pointer"
                        >
                          Load
                        </button>
                        <button
                          onClick={() => onDeleteSavedSquad(squad.id)}
                          className="p-1 text-slate-500 hover:text-rose-400 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ==================== TAB 2: PLAYER EDITOR ==================== */}
        {activeTab === 'player' && (
          <div className="space-y-4">
            {selectedPlayer ? (
              <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                    Editing #{selectedPlayer.number} {selectedPlayer.name}
                  </span>
                  <span className="text-[10px] font-black bg-slate-900 text-slate-400 px-2 py-0.5 rounded border border-slate-800">
                    POS: {selectedPlayer.pos}
                  </span>
                </div>

                {/* Player Headshot / Photo Upload & Live Zoom */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1.5">
                    Player Headshot / Custom Photo
                  </label>
                  <div className="flex items-center gap-3">
                    {selectedPlayer.photo ? (
                      <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-emerald-400 shrink-0 bg-slate-950">
                        <img
                          src={selectedPlayer.photo}
                          alt={selectedPlayer.name}
                          className="w-full h-full object-cover object-top"
                          style={{
                            transform: `scale(${selectedPlayer.photoZoom || 1.15}) translate(${selectedPlayer.photoOffsetX || 0}px, ${selectedPlayer.photoOffsetY || 0}px)`
                          }}
                        />
                        <button
                          onClick={() => onUpdatePlayer({ ...selectedPlayer, photo: '' })}
                          className="absolute inset-0 bg-slate-950/70 text-rose-400 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                          title="Remove Photo"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-500 shrink-0">
                        <Upload className="w-5 h-5" />
                      </div>
                    )}

                    <div className="flex-1 flex flex-col gap-1.5">
                      <label className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold cursor-pointer transition-all">
                        <Upload className="w-3.5 h-3.5" />
                        {selectedPlayer.photo ? 'Change Headshot' : 'Upload Headshot'}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          className="hidden"
                        />
                      </label>

                      {selectedPlayer.photo && (
                        <button
                          onClick={() => setCropImageSrc(selectedPlayer.photo)}
                          className="flex items-center justify-center gap-1 px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 text-[10px] font-bold border border-slate-700 transition-all cursor-pointer"
                        >
                          <Move className="w-3 h-3 text-emerald-400" />
                          Adjust Zoom & Crop
                        </button>
                      )}
                    </div>
                  </div>

                  {/* INLINE PHOTO ZOOM SLIDER (WHEN PHOTO EXISTS) */}
                  {selectedPlayer.photo && (
                    <div className="mt-3 p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between text-[11px] font-bold text-slate-300">
                        <span className="flex items-center gap-1">
                          <ZoomIn className="w-3.5 h-3.5 text-emerald-400" /> Photo Zoom Level
                        </span>
                        <span className="text-emerald-400 font-mono">
                          {Math.round((selectedPlayer.photoZoom || 1.15) * 100)}%
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ZoomOut className="w-3.5 h-3.5 text-slate-400" />
                        <input
                          type="range"
                          min="0.8"
                          max="3.0"
                          step="0.05"
                          value={selectedPlayer.photoZoom || 1.15}
                          onChange={(e) =>
                            onUpdatePlayer({
                              ...selectedPlayer,
                              photoZoom: parseFloat(e.target.value)
                            })
                          }
                          className="w-full accent-emerald-400 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
                        />
                        <ZoomIn className="w-3.5 h-3.5 text-emerald-400" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Player Name */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">
                    Player Name
                  </label>
                  <input
                    type="text"
                    value={selectedPlayer.name || ''}
                    onChange={(e) =>
                      onUpdatePlayer({ ...selectedPlayer, name: e.target.value })
                    }
                    placeholder="e.g. Lionel Messi"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Shirt Number & Position Label */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-1 flex items-center justify-between">
                      <span>Shirt Number</span>
                      <span className="text-[9px] text-emerald-400 font-semibold">Pitch Auto-Swap</span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="99"
                      value={selectedPlayer.number || ''}
                      onChange={(e) =>
                        onUpdatePlayer({ ...selectedPlayer, number: parseInt(e.target.value) || '' })
                      }
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-1">
                      Position Label
                    </label>
                    <input
                      type="text"
                      value={selectedPlayer.pos || ''}
                      onChange={(e) =>
                        onUpdatePlayer({ ...selectedPlayer, pos: e.target.value.toUpperCase() })
                      }
                      placeholder="e.g. ST, CAM, CB"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 uppercase focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                {/* Single Captain Toggle Button */}
                <div className="pt-1">
                  <button
                    onClick={() =>
                      onUpdatePlayer({ ...selectedPlayer, isCaptain: !selectedPlayer.isCaptain })
                    }
                    className={`w-full py-2 px-3 rounded-lg border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      selectedPlayer.isCaptain
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-md shadow-amber-500/10'
                        : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <Crown className="w-4 h-4 text-amber-400" />
                    {selectedPlayer.isCaptain ? 'Captain (Armband C Active)' : 'Assign as Team Captain'}
                  </button>
                </div>

                {/* SWAP TACTICAL PLAYER SPOT */}
                {(onSwapPlayers || onSwapWithPitch) && (() => {
                  const isSubSelected = bench.some((b) => b.id === selectedPlayer.id);

                  return (
                    <div className="pt-2 border-t border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                          <ArrowLeftRight className="w-3.5 h-3.5 text-emerald-400" />
                          Swap Player Spot
                        </label>
                        <span className="text-[10px] font-mono text-emerald-400">
                          {isSubSelected ? 'Bench ↔ Pitch' : 'Fixed Pitch Spot'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 my-0">
                        Swap #{selectedPlayer.number} {selectedPlayer.name} with a player on the pitch.
                      </p>
                      <div className="flex gap-2">
                        <select
                          value={swapTargetId}
                          onChange={(e) => setSwapTargetId(e.target.value)}
                          className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                        >
                          <option value="">Select player to swap...</option>
                          {players
                            .filter((p) => p.id !== selectedPlayer.id)
                            .map((p) => (
                              <option key={p.id} value={p.id}>
                                #{p.number} {p.name} ({p.pos})
                              </option>
                            ))}
                        </select>
                        <button
                          disabled={!swapTargetId}
                          onClick={() => {
                            if (swapTargetId) {
                              if (isSubSelected && onSwapWithPitch) {
                                onSwapWithPitch(selectedPlayer.id, Number(swapTargetId));
                              } else if (onSwapPlayers) {
                                onSwapPlayers(selectedPlayer.id, Number(swapTargetId));
                              }
                              setSwapTargetId('');
                            }
                          }}
                          className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 disabled:opacity-40 cursor-pointer shadow-md shadow-emerald-500/20"
                        >
                          <ArrowLeftRight className="w-3.5 h-3.5" /> Swap
                        </button>
                      </div>
                    </div>
                  );
                })()}
              </div>
            ) : (
              <div className="text-center py-8 text-xs text-slate-500 italic bg-slate-950/40 p-4 rounded-xl border border-slate-800">
                Click on any player node on the pitch to customize their name, photo, number, and position.
              </div>
            )}
          </div>
        )}

        {/* ==================== TAB 3: KIT CUSTOMIZER ==================== */}
        {activeTab === 'kit' && (
          <div className="space-y-4">
            {/* Quick Kit Presets */}
            <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 space-y-2">
              <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider">
                Quick Kit Presets
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { name: 'Emerald Classic', primary: '#10b981', secondary: '#064e3b', pattern: 'solid' },
                  { name: 'Argentina Sky', primary: '#38bdf8', secondary: '#ffffff', pattern: 'stripes' },
                  { name: 'Barcelona Blaugrana', primary: '#1e3a8a', secondary: '#991b1b', pattern: 'stripes' },
                  { name: 'Real Pure White', primary: '#ffffff', secondary: '#0284c7', pattern: 'solid' },
                  { name: 'Brazil Gold', primary: '#eab308', secondary: '#15803d', pattern: 'solid' },
                  { name: 'Cyber Neon', primary: '#06b6d4', secondary: '#f43f5e', pattern: 'hoops' }
                ].map((kPreset, idx) => (
                  <button
                    key={idx}
                    onClick={() =>
                      setKitStyle({
                        ...kitStyle,
                        primaryColor: kPreset.primary,
                        secondaryColor: kPreset.secondary,
                        sleeveColor: kPreset.primary,
                        pattern: kPreset.pattern
                      })
                    }
                    className="flex items-center gap-2 p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] font-bold text-slate-200 cursor-pointer"
                  >
                    <div
                      className="w-4 h-4 rounded-full border border-slate-700 shrink-0"
                      style={{ background: `linear-gradient(135deg, ${kPreset.primary} 50%, ${kPreset.secondary} 50%)` }}
                    />
                    <span className="truncate">{kPreset.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Outfield Kit Customizer */}
            <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  Outfield Kit Colors
                </span>
                <JerseySVG
                  primaryColor={kitStyle.primaryColor}
                  secondaryColor={kitStyle.secondaryColor}
                  collarColor={kitStyle.collarColor}
                  sleeveColor={kitStyle.sleeveColor}
                  pattern={kitStyle.pattern}
                  numberColor={kitStyle.numberColor}
                  number={10}
                  size={32}
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1.5">
                  Jersey Pattern Style
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {['solid', 'stripes', 'hoops'].map((p) => (
                    <button
                      key={p}
                      onClick={() => setKitStyle({ ...kitStyle, pattern: p })}
                      className={`py-1.5 text-xs font-bold capitalize rounded-md border transition-all cursor-pointer ${
                        kitStyle.pattern === p
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500'
                          : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Primary Color Picker + Swatches */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-400">
                  Primary Shirt Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={kitStyle.primaryColor}
                    onChange={(e) => setKitStyle({ ...kitStyle, primaryColor: e.target.value, sleeveColor: e.target.value })}
                    className="w-10 h-10 rounded-lg border border-slate-700 bg-transparent cursor-pointer shrink-0"
                  />
                  {/* Quick Color Swatches for Mobile */}
                  <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
                    {['#10b981', '#3b82f6', '#ef4444', '#f59e0b', '#06b6d4', '#ffffff', '#0f172a', '#8b5cf6', '#991b1b', '#38bdf8'].map((c) => (
                      <button
                        key={c}
                        onClick={() => setKitStyle({ ...kitStyle, primaryColor: c, sleeveColor: c })}
                        className={`w-6 h-6 rounded-full border shadow cursor-pointer shrink-0 ${
                          kitStyle.primaryColor === c ? 'ring-2 ring-emerald-400 scale-110' : 'border-slate-700'
                        }`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Secondary Color Picker + Swatches */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-400">
                  Secondary Stripe Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={kitStyle.secondaryColor}
                    onChange={(e) => setKitStyle({ ...kitStyle, secondaryColor: e.target.value })}
                    className="w-10 h-10 rounded-lg border border-slate-700 bg-transparent cursor-pointer shrink-0"
                  />
                  <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
                    {['#ffffff', '#0f172a', '#064e3b', '#1e3a8a', '#991b1b', '#f59e0b', '#38bdf8', '#0284c7', '#15803d'].map((c) => (
                      <button
                        key={c}
                        onClick={() => setKitStyle({ ...kitStyle, secondaryColor: c })}
                        className={`w-6 h-6 rounded-full border shadow cursor-pointer shrink-0 ${
                          kitStyle.secondaryColor === c ? 'ring-2 ring-emerald-400 scale-110' : 'border-slate-700'
                        }`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Goalkeeper Kit Customizer */}
            <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  Goalkeeper Kit Colors
                </span>
                <JerseySVG
                  primaryColor={gkKitStyle.primaryColor}
                  secondaryColor={gkKitStyle.secondaryColor}
                  collarColor={gkKitStyle.collarColor || '#ffffff'}
                  sleeveColor={gkKitStyle.sleeveColor || gkKitStyle.primaryColor}
                  pattern={gkKitStyle.pattern}
                  numberColor={gkKitStyle.numberColor}
                  number={1}
                  size={32}
                />
              </div>

              {/* GK Primary Color Picker + Swatches */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-400">
                  GK Main Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={gkKitStyle.primaryColor}
                    onChange={(e) => setGkKitStyle({ ...gkKitStyle, primaryColor: e.target.value, sleeveColor: e.target.value })}
                    className="w-10 h-10 rounded-lg border border-slate-700 bg-transparent cursor-pointer shrink-0"
                  />
                  <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
                    {['#f59e0b', '#10b981', '#06b6d4', '#ec4899', '#8b5cf6', '#ffffff', '#0f172a', '#e11d48'].map((c) => (
                      <button
                        key={c}
                        onClick={() => setGkKitStyle({ ...gkKitStyle, primaryColor: c, sleeveColor: c })}
                        className={`w-6 h-6 rounded-full border shadow cursor-pointer shrink-0 ${
                          gkKitStyle.primaryColor === c ? 'ring-2 ring-amber-400 scale-110' : 'border-slate-700'
                        }`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 4: TEAM & PITCH SETTINGS ==================== */}
        {activeTab === 'team' && (
          <div className="space-y-4">
            {/* Team Info Form */}
            <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 space-y-3">
              <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider border-b border-slate-800 pb-2">
                Team Header Information
              </label>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">
                  Team Name
                </label>
                <input
                  type="text"
                  value={teamInfo.teamName}
                  onChange={(e) => setTeamInfo({ ...teamInfo, teamName: e.target.value })}
                  placeholder="e.g. Manchester City"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">
                  Manager Name
                </label>
                <input
                  type="text"
                  value={teamInfo.managerName}
                  onChange={(e) => setTeamInfo({ ...teamInfo, managerName: e.target.value })}
                  placeholder="e.g. Pep Guardiola"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">
                  Match Details / Competition
                </label>
                <input
                  type="text"
                  value={teamInfo.matchInfo}
                  onChange={(e) => setTeamInfo({ ...teamInfo, matchInfo: e.target.value })}
                  placeholder="e.g. vs. Real Madrid - Aug 15"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">
                  Team Logo / Crest Upload
                </label>
                <label className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-semibold cursor-pointer transition-all">
                  <Upload className="w-3.5 h-3.5 text-emerald-400" />
                  {teamInfo.logo ? 'Change Crest Logo' : 'Upload Team Logo'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Pitch Theme & View Settings */}
            <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 space-y-3">
              <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider border-b border-slate-800 pb-2">
                Pitch Surface Theme & Mode
              </label>

              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'classic', label: 'Classic Grass' },
                  { id: 'dark', label: 'Tactical Dark' },
                  { id: 'cyber', label: 'Cyber Stadium' },
                  { id: 'blueprint', label: 'Tactical Grid' },
                  { id: 'stripe-v', label: 'Vertical Lawn' }
                ].map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => setPitchTheme(theme.id)}
                    className={`py-2 px-2.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                      pitchTheme === theme.id
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500'
                        : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    {theme.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
