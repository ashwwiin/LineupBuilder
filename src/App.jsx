import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import PitchCanvas from './components/PitchCanvas';
import LeftRosterPanel from './components/LeftRosterPanel';
import SubstitutesBench from './components/SubstitutesBench';
import Sidebar from './components/Sidebar';
import AuthModal from './components/AuthModal';
import { supabase, isSupabaseConfigured } from './lib/supabase';
import { FORMATIONS } from './data/formations';
import { SQUAD_PRESETS } from './data/presets';
import { serializeSquadState, deserializeSquadState } from './utils/serialization';
import { Users, LayoutGrid, Sliders, X } from 'lucide-react';

export default function App() {
  const exportRef = useRef(null);

  // Auth & Cloud User State
  const [user, setUser] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

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
    matchInfo: 'Matchday Starting XI'
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
  const [pitchTheme, setPitchTheme] = useState('classic');
  const [is3DView, setIs3DView] = useState(false);
  const [isHalfPitch, setIsHalfPitch] = useState(false);
  const [aspectRatio, setAspectRatio] = useState('square');
  const [activeTab, setActiveTab] = useState('squad');
  const [isMobileControlsOpen, setIsMobileControlsOpen] = useState(false);
  const [isMobileRosterOpen, setIsMobileRosterOpen] = useState(false);

  // Saved Squads LocalStorage / Cloud State
  const [savedSquads, setSavedSquads] = useState(() => {
    try {
      const stored = localStorage.getItem('tactix_saved_squads');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Supabase Auth listener & cloud squad sync
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchCloudSquads(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchCloudSquads(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchCloudSquads = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('squads')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (!error && data) {
        const mapped = data.map((s) => ({
          id: s.id,
          name: s.name,
          teamInfo: s.team_info,
          formationId: s.formation_id,
          kitStyle: s.kit_style,
          gkKitStyle: s.gk_kit_style,
          players: s.players,
          bench: s.bench
        }));
        setSavedSquads(mapped);
      }
    } catch (e) {
      console.error('Error fetching cloud squads:', e);
    }
  };

  const handleSignOut = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
      setUser(null);
      setSavedSquads([]);
    }
  };

  // Save squads to localStorage on update
  useEffect(() => {
    try {
      localStorage.setItem('tactix_saved_squads', JSON.stringify(savedSquads));
    } catch {
      // ignore write error
    }
  }, [savedSquads]);

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

  // Player Detail Edit (Supports both Starting XI and Bench Substitutes)
  const handleUpdatePlayer = (updatedPlayer) => {
    const isXI = players.some((p) => p.id === updatedPlayer.id);

    if (isXI) {
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
    } else {
      // Update substitute bench player
      setBench((prev) =>
        prev.map((b) => (b.id === updatedPlayer.id ? { ...b, ...updatedPlayer } : b))
      );
    }
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
    setBench((prev) => prev.map((b) => (b.id === subId ? updatedSub : b)));
  };

  // Swap Player details between two starting XI pitch players (tactical pitch coordinates x,y stay fixed)
  const handleSwapPitchPlayers = (player1Id, player2Id) => {
    const p1Id = Number(player1Id);
    const p2Id = Number(player2Id);
    if (!p1Id || !p2Id || p1Id === p2Id) return;

    setPlayers((prevPlayers) => {
      const idx1 = prevPlayers.findIndex((p) => p.id === p1Id);
      const idx2 = prevPlayers.findIndex((p) => p.id === p2Id);
      if (idx1 === -1 || idx2 === -1) return prevPlayers;

      const updated = [...prevPlayers];
      const p1 = updated[idx1];
      const p2 = updated[idx2];

      // Keep tactical pitch positions (x, y) fixed, swap player details (name, number, photo, etc.)
      updated[idx1] = {
        ...p1,
        name: p2.name,
        number: p2.number,
        photo: p2.photo,
        photoZoom: p2.photoZoom,
        photoOffsetX: p2.photoOffsetX,
        photoOffsetY: p2.photoOffsetY,
        isCaptain: p2.isCaptain
      };

      updated[idx2] = {
        ...p2,
        name: p1.name,
        number: p1.number,
        photo: p1.photo,
        photoZoom: p1.photoZoom,
        photoOffsetX: p1.photoOffsetX,
        photoOffsetY: p1.photoOffsetY,
        isCaptain: p1.isCaptain
      };

      return updated;
    });
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

  // Save Squad to LocalStorage & Supabase Cloud
  const handleSaveSquad = async (name) => {
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

    if (isSupabaseConfigured && user) {
      try {
        await supabase.from('squads').insert({
          user_id: user.id,
          name: squadName,
          formation_id: formationId,
          team_info: teamInfo,
          kit_style: kitStyle,
          gk_kit_style: gkKitStyle,
          players: players,
          bench: bench
        });
      } catch (err) {
        console.error('Error saving squad to Supabase:', err);
      }
    }
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
  const handleDeleteSavedSquad = async (id) => {
    setSavedSquads((prev) => prev.filter((s) => s.id !== id));
    if (isSupabaseConfigured && user && typeof id === 'string') {
      try {
        await supabase.from('squads').delete().eq('id', id);
      } catch (err) {
        console.error('Error deleting squad from Supabase:', err);
      }
    }
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

  const selectedPlayer = selectedPlayerId
    ? players.find((p) => p.id === selectedPlayerId)
    : bench.find((b) => b.id === selectedSubId);

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
        user={user}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onSignOut={handleSignOut}
        onOpenMobileControls={() => setIsMobileControlsOpen(true)}
        onOpenMobileRoster={() => setIsMobileRosterOpen(true)}
      />

      {/* AUTHENTICATION MODAL */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={(loggedUser) => {
          setUser(loggedUser);
          if (loggedUser) fetchCloudSquads(loggedUser.id);
        }}
      />

      {/* MOBILE / TABLET QUICK ACTION BAR (Visible on screens < 1024px) */}
      <div className="lg:hidden max-w-[1600px] w-full mx-auto px-3 pt-3">
        <div className="flex items-center gap-2 p-1.5 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
          <button
            onClick={() => setIsMobileRosterOpen(true)}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-200 border border-slate-800 text-xs font-bold transition-all cursor-pointer shadow-sm"
          >
            <Users className="w-4 h-4 text-emerald-400" />
            <span>📋 Roster & Subs</span>
          </button>

          <button
            onClick={() => setIsMobileControlsOpen(true)}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold transition-all cursor-pointer shadow-lg shadow-emerald-500/20"
          >
            <Sliders className="w-4 h-4" />
            <span>⚙️ Lineup Controls</span>
          </button>
        </div>
      </div>

      {/* MAIN APP WORKSPACE CONTENT */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto p-3 sm:p-6 flex flex-col lg:flex-row gap-4 sm:gap-6 overflow-hidden">
        {/* DESKTOP / LAPTOP LEFT COLUMN: ROSTER LIST PANEL */}
        <div className="hidden lg:block w-64 xl:w-72 shrink-0">
          <LeftRosterPanel
            teamInfo={teamInfo}
            setTeamInfo={setTeamInfo}
            players={players}
            bench={bench}
            selectedPlayerId={selectedPlayerId}
            selectedSubId={selectedSubId}
            onSelectPlayer={(p) => {
              setSelectedPlayerId(p?.id || p);
              setSelectedSubId(null);
              setActiveTab('player');
            }}
            onSelectSub={(sub) => {
              if (sub) {
                setSelectedSubId(sub.id);
                setSelectedPlayerId(null);
                setActiveTab('player');
              }
            }}
            onAddSub={handleAddSub}
            onRemoveSub={handleRemoveSub}
            formationId={formationId}
            onSwapPlayers={handleSwapPitchPlayers}
            onSwapWithPitch={handleSwapSubWithPitch}
          />
        </div>

        {/* CENTER COLUMN: MAIN PITCH CANVAS & BENCH PANEL (ALWAYS VISIBLE & INTERACTIVE) */}
        <div className="flex-1 flex flex-col gap-4 min-w-0">
          <PitchCanvas
            exportRef={exportRef}
            teamInfo={teamInfo}
            formationId={formationId}
            players={players}
            selectedPlayerId={selectedPlayerId}
            onSelectPlayer={(p, opts = {}) => {
              const pId = typeof p === 'object' && p !== null ? p.id : p;
              setSelectedPlayerId(pId);
              setSelectedSubId(null);
              setActiveTab('player');
              if (opts.openMobileDrawer && window.innerWidth < 1024) {
                setIsMobileControlsOpen(true);
              }
            }}
            onUpdatePlayerPosition={handleUpdatePlayerPosition}
            onSwapPlayers={handleSwapPitchPlayers}
            onSwapSubWithPitch={handleSwapSubWithPitch}
            kitStyle={kitStyle}
            gkKitStyle={gkKitStyle}
            pitchTheme={pitchTheme}
            is3DView={is3DView}
            isHalfPitch={isHalfPitch}
            onToggleHalfPitch={handleToggleHalfPitch}
            aspectRatio={aspectRatio}
          />

          <SubstitutesBench
            bench={bench}
            pitchPlayers={players}
            selectedSubId={selectedSubId}
            onSelectSub={(sub, opts = {}) => {
              if (sub) {
                const subId = typeof sub === 'object' ? sub.id : sub;
                setSelectedSubId(subId);
                setSelectedPlayerId(null);
                setActiveTab('player');
                if (opts.openMobileDrawer && window.innerWidth < 1024) {
                  setIsMobileControlsOpen(true);
                }
              } else {
                setSelectedSubId(null);
              }
            }}
            onAddSub={handleAddSub}
            onRemoveSub={handleRemoveSub}
            onSwapWithPitch={handleSwapSubWithPitch}
            selectedPitchPlayer={selectedPlayer}
            kitStyle={kitStyle}
            gkKitStyle={gkKitStyle}
          />
        </div>

        {/* DESKTOP / LAPTOP RIGHT COLUMN: CONTROL SIDEBAR PANEL */}
        <div className="hidden lg:block w-80 xl:w-96 shrink-0">
          <Sidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            teamInfo={teamInfo}
            setTeamInfo={setTeamInfo}
            currentFormationId={formationId}
            onChangeFormation={handleChangeFormation}
            onLoadPreset={handleLoadPreset}
            players={players}
            bench={bench}
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
            onSwapPlayers={handleSwapPitchPlayers}
            onSwapWithPitch={handleSwapSubWithPitch}
          />
        </div>
      </main>

      {/* MOBILE FULL-HEIGHT LEFT SLIDE-OVER DRAWER FOR ROSTER & BENCH */}
      {isMobileRosterOpen && (
        <div
          onClick={() => setIsMobileRosterOpen(false)}
          className="lg:hidden fixed inset-0 z-[90] flex justify-start bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm h-full bg-slate-900 border-r border-slate-800 p-4 overflow-y-auto flex flex-col animate-in slide-in-from-left duration-300"
          >
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-black text-slate-100 uppercase tracking-wider my-0">
                  Roster & Bench
                </h3>
              </div>
              <button
                onClick={() => setIsMobileRosterOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-100 bg-slate-800 rounded-xl cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <LeftRosterPanel
              teamInfo={teamInfo}
              setTeamInfo={setTeamInfo}
              players={players}
              bench={bench}
              selectedPlayerId={selectedPlayerId}
              selectedSubId={selectedSubId}
              onSelectPlayer={(p) => {
                const pId = typeof p === 'object' && p !== null ? p.id : p;
                setSelectedPlayerId(pId);
                setSelectedSubId(null);
                setActiveTab('player');
                setIsMobileRosterOpen(false);
                setIsMobileControlsOpen(true);
              }}
              onSelectSub={(sub) => {
                if (sub) {
                  const subId = typeof sub === 'object' && sub !== null ? sub.id : sub;
                  setSelectedSubId(subId);
                  setSelectedPlayerId(null);
                  setActiveTab('player');
                  setIsMobileRosterOpen(false);
                  setIsMobileControlsOpen(true);
                }
              }}
              onAddSub={handleAddSub}
              onRemoveSub={handleRemoveSub}
              formationId={formationId}
              onSwapPlayers={handleSwapPitchPlayers}
              onSwapWithPitch={handleSwapSubWithPitch}
            />
          </div>
        </div>
      )}

      {/* MOBILE FULL-HEIGHT RIGHT SLIDE-OVER DRAWER FOR CONTROLS & PLAYER EDITOR */}
      {isMobileControlsOpen && (
        <div
          onClick={() => setIsMobileControlsOpen(false)}
          className="lg:hidden fixed inset-0 z-[90] flex justify-end bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md h-full bg-slate-900 border-l border-slate-800 p-4 overflow-y-auto flex flex-col animate-in slide-in-from-right duration-300"
          >
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-black text-slate-100 uppercase tracking-wider my-0">
                  Lineup Controls & Editor
                </h3>
              </div>
              <button
                onClick={() => setIsMobileControlsOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-100 bg-slate-800 rounded-xl cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <Sidebar
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              teamInfo={teamInfo}
              setTeamInfo={setTeamInfo}
              currentFormationId={formationId}
              onChangeFormation={handleChangeFormation}
              onLoadPreset={handleLoadPreset}
              players={players}
              bench={bench}
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
              onSwapPlayers={handleSwapPitchPlayers}
              onSwapWithPitch={handleSwapSubWithPitch}
            />
          </div>
        </div>
      )}
    </div>
  );
}
