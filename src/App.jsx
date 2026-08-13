import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import PitchCanvas from './components/PitchCanvas';
import LeftRosterPanel from './components/LeftRosterPanel';
import SubstitutesBench from './components/SubstitutesBench';
import Sidebar from './components/Sidebar';
import { FORMATIONS } from './data/formations';
import { SQUAD_PRESETS } from './data/presets';
import { serializeSquadState, deserializeSquadState } from './utils/serialization';
import { Users, LayoutGrid, Sliders } from 'lucide-react';

export default function App() {
  const exportRef = useRef(null);

  // Responsive View Mode for Mobile/Tablet ('pitch' | 'roster' | 'sidebar')
  const [mobileTab, setMobileTab] = useState('pitch');

  // Default Kit Styles
  const defaultKit = {
    primaryColor: '#10b981',
    secondaryColor: '#064e3b',
    collarColor: '#ffffff',
    sleeveColor: '#10b981',
    pattern: 'solid',
    numberColor: '#ffffff'
  };

  const defaultGkKit = {
    primaryColor: '#f59e0b',
    secondaryColor: '#b45309',
    collarColor: '#ffffff',
    sleeveColor: '#f59e0b',
    pattern: 'solid',
    numberColor: '#ffffff'
  };

  // Helper to initialize players from formation template
  const createDefaultPlayersForFormation = (formationId) => {
    const formation = FORMATIONS.find((f) => f.id === formationId) || FORMATIONS[0];
    return formation.players.map((p) => ({
      id: p.id,
      name: p.pos === 'GK' ? 'M. Neuer' : `Player ${p.defaultNumber}`,
      number: p.defaultNumber,
      pos: p.pos,
      isCaptain: p.id === 7, // Default captain
      photo: '',
      photoZoom: 1.15,
      photoOffsetX: 0,
      photoOffsetY: 0,
      x: p.x,
      y: p.y,
      isGoalkeeper: p.isGoalkeeper || false
    }));
  };

  // Core Squad State
  const [teamInfo, setTeamInfo] = useState({
    teamName: 'Tactix Dream Team',
    managerName: 'Head Coach',
    matchInfo: 'Matchday Starting XI',
    logo: ''
  });

  const [formationId, setFormationId] = useState('4-3-3');
  const [players, setPlayers] = useState(() => createDefaultPlayersForFormation('4-3-3'));
  const [bench, setBench] = useState([
    { id: 101, name: 'S. Ramos', number: 4, pos: 'CB', photo: '' },
    { id: 102, name: 'K. De Bruyne', number: 17, pos: 'CAM', photo: '' },
    { id: 103, name: 'E. Haaland', number: 9, pos: 'ST', photo: '' },
    { id: 104, name: 'M. Salah', number: 11, pos: 'RW', photo: '' },
  ]);

  const [selectedPlayerId, setSelectedPlayerId] = useState(1);
  const [selectedSubId, setSelectedSubId] = useState(null);
  const [kitStyle, setKitStyle] = useState(defaultKit);
  const [gkKitStyle, setGkKitStyle] = useState(defaultGkKit);

  // Pitch View & Display Settings
  const [pitchTheme, setPitchTheme] = useState('score90');
  const [is3DView, setIs3DView] = useState(false);
  const [isHalfPitch, setIsHalfPitch] = useState(false);
  const [aspectRatio, setAspectRatio] = useState('square');
  const [activeTab, setActiveTab] = useState('squad');

  // Saved Squads LocalStorage State
  const [savedSquads, setSavedSquads] = useState(() => {
    try {
      const stored = localStorage.getItem('tactix_saved_squads');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Check URL parameters for shared squad state on load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sharedData = params.get('squad');
    if (sharedData) {
      const deserialized = deserializeSquadState(sharedData);
      if (deserialized) {
        setTeamInfo(deserialized.teamInfo);
        setFormationId(deserialized.formationId);
        setKitStyle(deserialized.kitStyle);
        setGkKitStyle(deserialized.gkKitStyle);
        setPlayers(deserialized.players);
        setBench(deserialized.bench);
      }
    }
  }, []);

  // Save to LocalStorage whenever savedSquads updates
  useEffect(() => {
    try {
      localStorage.setItem('tactix_saved_squads', JSON.stringify(savedSquads));
    } catch (e) {
      console.error(e);
    }
  }, [savedSquads]);

  // Toggle Half-Pitch Mode
  const handleToggleHalfPitch = () => {
    setIsHalfPitch((prev) => !prev);
  };

  // Formation Change Handler
  const handleChangeFormation = (newFormationId) => {
    setFormationId(newFormationId);
    const newFormationObj = FORMATIONS.find((f) => f.id === newFormationId) || FORMATIONS[0];

    setPlayers((prevPlayers) => {
      return newFormationObj.players.map((slot, index) => {
        const existingPlayer = prevPlayers[index];
        return {
          id: slot.id,
          name: existingPlayer ? existingPlayer.name : `Player ${slot.defaultNumber}`,
          number: existingPlayer ? existingPlayer.number : slot.defaultNumber,
          pos: slot.pos,
          isCaptain: existingPlayer ? existingPlayer.isCaptain : false,
          photo: existingPlayer ? existingPlayer.photo : '',
          photoZoom: existingPlayer ? existingPlayer.photoZoom : 1.15,
          photoOffsetX: existingPlayer ? existingPlayer.photoOffsetX : 0,
          photoOffsetY: existingPlayer ? existingPlayer.photoOffsetY : 0,
          x: slot.x,
          y: slot.y,
          isGoalkeeper: slot.isGoalkeeper || false
        };
      });
    });
  };

  // Drag & Drop Position Update
  const handleUpdatePlayerPosition = (id, newX, newY) => {
    setPlayers((prev) =>
      prev.map((p) => (p.id === id ? { ...p, x: newX, y: newY } : p))
    );
  };

  // Player Detail Edit (Smart Same-Lineup Uniqueness via Swap)
  const handleUpdatePlayer = (updatedPlayer) => {
    setPlayers((prev) => {
      const existingPitchPlayer = prev.find(
        (p) => p.id !== updatedPlayer.id && p.number === updatedPlayer.number
      );
      const currentPlayer = prev.find((p) => p.id === updatedPlayer.id);

      return prev.map((p) => {
        if (p.id === updatedPlayer.id) {
          return updatedPlayer;
        }

        if (existingPitchPlayer && p.id === existingPitchPlayer.id && currentPlayer) {
          return {
            ...p,
            number: currentPlayer.number
          };
        }

        if (updatedPlayer.isCaptain) {
          return { ...p, isCaptain: false };
        }

        return p;
      });
    });
  };

  // Select Pitch Player
  const handleSelectPitchPlayer = (player) => {
    setSelectedPlayerId(player.id);
    setSelectedSubId(null);
    setActiveTab('player');
    if (window.innerWidth < 1280) {
      setMobileTab('sidebar');
    }
  };

  // Add Substitute Player
  const handleAddSub = () => {
    if (bench.length >= 12) {
      alert('Maximum 12 substitute players allowed on the bench.');
      return;
    }
    const newSubId = Date.now();
    const newSub = {
      id: newSubId,
      name: `Substitute ${bench.length + 1}`,
      number: 12 + bench.length,
      pos: 'SUB',
      photo: ''
    };
    setBench((prev) => [...prev, newSub]);
  };

  // Remove Substitute Player
  const handleRemoveSub = (subId) => {
    setBench((prev) => prev.filter((b) => b.id !== subId));
    if (selectedSubId === subId) {
      setSelectedSubId(null);
    }
  };

  // Swap Substitute with Starting XI Pitch Player
  const handleSwapSubWithPitch = (subId, pitchPlayerId) => {
    const subIndex = bench.findIndex((b) => b.id === subId);
    const pitchIndex = players.findIndex((p) => p.id === pitchPlayerId);

    if (subIndex === -1 || pitchIndex === -1) return;

    const sub = bench[subIndex];
    const pitchPlayer = players[pitchIndex];

    const updatedPitchPlayer = {
      ...pitchPlayer,
      name: sub.name,
      number: sub.number,
      photo: sub.photo,
      photoZoom: sub.photoZoom || 1.15,
      photoOffsetX: sub.photoOffsetX || 0,
      photoOffsetY: sub.photoOffsetY || 0
    };

    const updatedSub = {
      ...sub,
      name: pitchPlayer.name,
      number: pitchPlayer.number,
      photo: pitchPlayer.photo,
      photoZoom: pitchPlayer.photoZoom || 1.15,
      photoOffsetX: pitchPlayer.photoOffsetX || 0,
      photoOffsetY: pitchPlayer.photoOffsetY || 0
    };

    setPlayers((prev) => prev.map((p) => (p.id === pitchPlayerId ? updatedPitchPlayer : p)));
    setBench((prev) => prev.map((b) => (b.id === subId ? updatedSub : p)));
  };

  // Load Preset
  const handleLoadPreset = (preset) => {
    setTeamInfo({
      teamName: preset.teamName,
      managerName: preset.managerName,
      matchInfo: preset.matchInfo,
      logo: ''
    });
    setFormationId(preset.formationId);
    setKitStyle(preset.kitStyle);
    setGkKitStyle(preset.gkKitStyle);

    const formationTemplate = FORMATIONS.find((f) => f.id === preset.formationId) || FORMATIONS[0];
    const newPlayers = preset.players.map((p, idx) => {
      const slot = formationTemplate.players[idx] || formationTemplate.players[0];
      return {
        ...p,
        x: slot.x,
        y: slot.y
      };
    });

    setPlayers(newPlayers);
    setBench(preset.bench || []);
    setSelectedPlayerId(newPlayers[0]?.id || 1);
  };

  // Reset Squad to Default
  const handleResetSquad = () => {
    setTeamInfo({
      teamName: 'Tactix Starting XI',
      managerName: 'Head Coach',
      matchInfo: 'Matchday Graphics',
      logo: ''
    });
    setFormationId('4-3-3');
    setKitStyle(defaultKit);
    setGkKitStyle(defaultGkKit);
    setPlayers(createDefaultPlayersForFormation('4-3-3'));
    setBench([
      { id: 101, name: 'Sub 1', number: 12, pos: 'CB' },
      { id: 102, name: 'Sub 2', number: 14, pos: 'CM' },
      { id: 103, name: 'Sub 3', number: 17, pos: 'ST' },
    ]);
  };

  // Save Squad to LocalStorage
  const handleSaveSquad = (name) => {
    const squadName = name || teamInfo.teamName || 'Saved Squad';
    const newSquad = {
      id: Date.now(),
      name: squadName,
      teamInfo,
      formationId,
      kitStyle,
      gkKitStyle,
      players,
      bench
    };
    setSavedSquads((prev) => [newSquad, ...prev]);
  };

  // Load Saved Squad
  const handleLoadSavedSquad = (squad) => {
    setTeamInfo(squad.teamInfo);
    setFormationId(squad.formationId);
    setKitStyle(squad.kitStyle);
    setGkKitStyle(squad.gkKitStyle);
    setPlayers(squad.players);
    setBench(squad.bench || []);
  };

  // Delete Saved Squad
  const handleDeleteSavedSquad = (id) => {
    setSavedSquads((prev) => prev.filter((s) => s.id !== id));
  };

  // Generate Shareable Link
  const handleCopyShareLink = () => {
    const serialized = serializeSquadState({
      teamInfo,
      formationId,
      kitStyle,
      gkKitStyle,
      players,
      bench
    });

    const shareUrl = `${window.location.origin}${window.location.pathname}?squad=${serialized}`;
    navigator.clipboard.writeText(shareUrl);
  };

  const selectedPlayer = players.find((p) => p.id === selectedPlayerId);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* HEADER BAR */}
      <Header
        exportRef={exportRef}
        squadState={{ teamInfo, formationId, kitStyle, players }}
        onResetSquad={handleResetSquad}
        onCopyShareLink={handleCopyShareLink}
        isHalfPitch={isHalfPitch}
        onToggleHalfPitch={handleToggleHalfPitch}
        onSaveSquad={handleSaveSquad}
        savedSquads={savedSquads}
        onLoadSavedSquad={handleLoadSavedSquad}
      />

      {/* MOBILE / TABLET SEGMENTED TAB SELECTOR (Visible on screens < 1280px) */}
      <div className="xl:hidden max-w-[1600px] w-full mx-auto px-4 pt-3">
        <div className="flex items-center justify-center p-1 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
          <button
            onClick={() => setMobileTab('roster')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              mobileTab === 'roster'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>XI Roster</span>
          </button>

          <button
            onClick={() => setMobileTab('pitch')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              mobileTab === 'pitch'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span>Tactical Pitch</span>
          </button>

          <button
            onClick={() => setMobileTab('sidebar')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              mobileTab === 'sidebar'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Edit Controls</span>
          </button>
        </div>
      </div>

      {/* MAIN WORKSPACE CONTENT - FLUID RESPONSIVE 3-COLUMN LAYOUT */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto p-4 md:p-6 flex flex-col xl:flex-row gap-6 items-stretch justify-center">
        {/* LEFT COLUMN: STARTING XI SQUAD ROSTER PANEL */}
        <div className={`w-full xl:w-72 shrink-0 ${mobileTab === 'roster' ? 'block' : 'hidden xl:block'}`}>
          <LeftRosterPanel
            teamInfo={teamInfo}
            players={players}
            selectedPlayerId={selectedPlayerId}
            onSelectPlayer={handleSelectPitchPlayer}
            formationId={formationId}
          />
        </div>

        {/* CENTER COLUMN: PITCH CANVAS AREA & BENCH */}
        <div className={`flex-1 w-full flex flex-col gap-6 items-center ${mobileTab === 'pitch' ? 'block' : 'hidden xl:flex'}`}>
          <PitchCanvas
            exportRef={exportRef}
            teamInfo={teamInfo}
            players={players}
            selectedPlayerId={selectedPlayerId}
            onSelectPlayer={handleSelectPitchPlayer}
            onUpdatePlayerPosition={handleUpdatePlayerPosition}
            kitStyle={kitStyle}
            gkKitStyle={gkKitStyle}
            pitchTheme={pitchTheme}
            is3DView={is3DView}
            isHalfPitch={isHalfPitch}
            onToggleHalfPitch={handleToggleHalfPitch}
            aspectRatio={aspectRatio}
          />

          {/* SUBSTITUTES BENCH GRID */}
          <div className="w-full max-w-2xl">
            <SubstitutesBench
              bench={bench}
              onAddSub={handleAddSub}
              onRemoveSub={handleRemoveSub}
              onSelectSub={(sub) => setSelectedSubId(sub.id)}
              selectedSubId={selectedSubId}
              selectedPitchPlayer={selectedPlayer}
              onSwapWithPitch={handleSwapSubWithPitch}
              kitStyle={kitStyle}
              gkKitStyle={gkKitStyle}
            />
          </div>
        </div>

        {/* RIGHT COLUMN: CONTROL SIDEBAR PANEL */}
        <div className={`w-full xl:w-96 shrink-0 ${mobileTab === 'sidebar' ? 'block' : 'hidden xl:block'}`}>
          <Sidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            teamInfo={teamInfo}
            setTeamInfo={setTeamInfo}
            currentFormationId={formationId}
            onChangeFormation={handleChangeFormation}
            onLoadPreset={handleLoadPreset}
            players={players}
            selectedPlayer={selectedPlayer}
            onUpdatePlayer={handleUpdatePlayer}
            kitStyle={kitStyle}
            setKitStyle={setKitStyle}
            gkKitStyle={gkKitStyle}
            setGkKitStyle={setGkKitStyle}
            pitchTheme={pitchTheme}
            setPitchTheme={setPitchTheme}
            is3DView={is3DView}
            setIs3DView={setIs3DView}
            isHalfPitch={isHalfPitch}
            onToggleHalfPitch={handleToggleHalfPitch}
            aspectRatio={aspectRatio}
            setAspectRatio={setAspectRatio}
            savedSquads={savedSquads}
            onSaveSquad={handleSaveSquad}
            onLoadSavedSquad={handleLoadSavedSquad}
            onDeleteSavedSquad={handleDeleteSavedSquad}
          />
        </div>
      </main>
    </div>
  );
}
