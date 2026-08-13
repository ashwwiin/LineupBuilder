import React, { useState } from 'react';
import JerseySVG from './JerseySVG';
import ImageZoomModal from './ImageZoomModal';
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
  ZoomOut
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
  onDeleteSavedSquad
}) {
  const [newSquadName, setNewSquadName] = useState('');
  const [cropImageSrc, setCropImageSrc] = useState(null);

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
    <div className="w-full lg:w-96 shrink-0 bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-2xl p-4 shadow-2xl flex flex-col h-full overflow-hidden select-none">
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
              <div className="space-y-1.5">
                {[
                  { name: 'Prime Barcelona 2011', id: 'barca-2011' },
                  { name: 'Real Madrid 3-Peat', id: 'rm-2017' },
                  { name: 'Man City Treble 2023', id: 'mancity-2023' }
                ].map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => {
                      const found = SQUAD_PRESETS.find((p) => p.id === preset.id);
                      if (found) onLoadPreset(found);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center justify-between transition-all cursor-pointer"
                  >
                    <span>{preset.name}</span>
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
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
            {/* Outfield Kit Customizer */}
            <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  Outfield Kit Customizer
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

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-1">
                    Primary Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={kitStyle.primaryColor}
                      onChange={(e) => setKitStyle({ ...kitStyle, primaryColor: e.target.value })}
                      className="w-8 h-8 rounded border border-slate-700 bg-transparent cursor-pointer"
                    />
                    <span className="text-[11px] font-mono text-slate-300">{kitStyle.primaryColor}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-1">
                    Secondary Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={kitStyle.secondaryColor}
                      onChange={(e) => setKitStyle({ ...kitStyle, secondaryColor: e.target.value })}
                      className="w-8 h-8 rounded border border-slate-700 bg-transparent cursor-pointer"
                    />
                    <span className="text-[11px] font-mono text-slate-300">{kitStyle.secondaryColor}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Goalkeeper Kit Customizer */}
            <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  Goalkeeper Kit
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

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-1">
                    GK Primary Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={gkKitStyle.primaryColor}
                      onChange={(e) => setGkKitStyle({ ...gkKitStyle, primaryColor: e.target.value })}
                      className="w-8 h-8 rounded border border-slate-700 bg-transparent cursor-pointer"
                    />
                    <span className="text-[11px] font-mono text-slate-300">{gkKitStyle.primaryColor}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-1">
                    GK Accent Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={gkKitStyle.secondaryColor}
                      onChange={(e) => setGkKitStyle({ ...gkKitStyle, secondaryColor: e.target.value })}
                      className="w-8 h-8 rounded border border-slate-700 bg-transparent cursor-pointer"
                    />
                    <span className="text-[11px] font-mono text-slate-300">{gkKitStyle.secondaryColor}</span>
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
                  { id: 'score90', label: 'Score 90 Graphic' },
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
