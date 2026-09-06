import React, { useState } from 'react';
import { GameMode, MatchType, PlayerColor, UserProfile } from '../types';
import { 
  Play, 
  Users, 
  Bot, 
  Globe, 
  Key, 
  Trophy, 
  Flame, 
  Sparkles, 
  Swords, 
  Zap, 
  ShieldCheck, 
  Coins, 
  Dice5,
  Crown,
  Tv,
  DollarSign,
  Smartphone,
  Download
} from 'lucide-react';
import { sound } from '../utils/audio';

interface LobbyViewProps {
  profile: UserProfile;
  onStartMatch: (config: {
    mode: GameMode;
    matchType: MatchType;
    playerCount: 2 | 3 | 4;
    stake: number;
    roomCode?: string;
    customPlayerNames?: string[];
  }) => void;
  onOpenDailySpin: () => void;
  onOpenTournament: () => void;
  onWatchRewardedAd?: () => void;
  onOpenMonetization?: () => void;
  onOpenAndroidApk?: () => void;
}

export const LobbyView: React.FC<LobbyViewProps> = ({
  profile,
  onStartMatch,
  onOpenDailySpin,
  onOpenTournament,
  onWatchRewardedAd,
  onOpenMonetization,
  onOpenAndroidApk,
}) => {
  const [selectedMode, setSelectedMode] = useState<GameMode>('classic');
  const [selectedMatchType, setSelectedMatchType] = useState<MatchType>('vs_computer');
  const [playerCount, setPlayerCount] = useState<2 | 3 | 4>(4);
  const [selectedStake, setSelectedStake] = useState<number>(500);
  const [roomCodeInput, setRoomCodeInput] = useState<string>('');
  const [isJoiningRoom, setIsJoiningRoom] = useState<boolean>(false);
  const [opponentNames, setOpponentNames] = useState<{ p2: string; p3: string; p4: string }>({
    p2: 'Rohan',
    p3: 'Sneha',
    p4: 'Vikram',
  });

  const STAKE_OPTIONS = [
    { label: 'Practice (Free)', value: 0 },
    { label: '500 Coins', value: 500 },
    { label: '1,500 Coins', value: 1500 },
    { label: '5,000 Coins', value: 5000 },
  ];

  const handleStart = () => {
    sound.playClick();
    if (selectedMode === 'tournament') {
      onOpenTournament();
      return;
    }
    onStartMatch({
      mode: selectedMode,
      matchType: selectedMatchType,
      playerCount,
      stake: selectedStake,
      roomCode: isJoiningRoom && roomCodeInput ? roomCodeInput : undefined,
      customPlayerNames: [
        profile.name,
        opponentNames.p2.trim() || 'Rohan',
        opponentNames.p3.trim() || 'Sneha',
        opponentNames.p4.trim() || 'Vikram',
      ],
    });
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 flex flex-col gap-6">
      {/* Android APK Direct Download Ribbon */}
      <div className="rounded-2xl bg-gradient-to-r from-emerald-950/90 via-slate-900 to-teal-950/90 border border-emerald-500/50 p-3 sm:p-4 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="w-10 h-10 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/25">
            <Download className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-emerald-400 uppercase tracking-wider">
                Android App (APK) Available
              </span>
              <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold border border-emerald-500/30">
                v1.0.0 • 5.3 MB
              </span>
            </div>
            <p className="text-xs text-slate-200">
              Download and play Ludo King offline on Android without lag or browser bars!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
          <a
            href="/Ludo-King-v1.0.apk"
            download="Ludo-King-v1.0.apk"
            onClick={() => sound.playReward()}
            className="flex-1 sm:flex-initial py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-display font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/30 transition-transform active:scale-95 cursor-pointer"
          >
            <Download className="w-4 h-4 stroke-[2.5]" />
            <span>Download APK</span>
          </a>
          {onOpenAndroidApk && (
            <button
              onClick={() => {
                sound.playClick();
                onOpenAndroidApk();
              }}
              className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-xs transition-colors cursor-pointer"
            >
              Install Guide
            </button>
          )}
        </div>
      </div>

      {/* Top Banner: Daily Streak & Special Events */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Special Event Card */}
        <div className="md:col-span-2 relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-600/30 via-purple-900/30 to-slate-900 border border-amber-500/40 p-5 shadow-xl flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-black uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                Live Special Event
              </div>
              <h2 className="font-display font-black text-xl sm:text-2xl text-white">
                Star Collector & Double XP Rush
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-md">
                Earn 2x XP in all matches and gain +250 bonus coins whenever your token lands safely on a Star Zone!
              </p>
            </div>
            <div className="hidden sm:flex w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden shadow-2xl ring-2 ring-amber-400/50 items-center justify-center shrink-0 bg-slate-950">
              <img 
                src="/logo.png" 
                alt="Ludo King Logo" 
                className="w-full h-full object-cover" 
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 mt-4">
            <span className="text-xs text-amber-400 font-bold flex items-center gap-1">
              <Zap className="w-4 h-4" /> Active for next 18h
            </span>
          </div>
        </div>

        {/* Daily Streak & Free Reward Card */}
        <div className="rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-1">
                <Flame className="w-4 h-4 fill-amber-400" />
                Daily Streak
              </span>
              <span className="text-xs font-bold text-slate-400">Day {profile.currentStreak}/7</span>
            </div>
            <h3 className="font-display font-bold text-lg text-white mt-1">
              Lucky Wheel & Gifts
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Spin the wheel for free coins, gems, and power-ups!
            </p>
          </div>

          <div className="mt-4 flex flex-col gap-2">
            <button
              onClick={() => {
                sound.playClick();
                onOpenDailySpin();
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-display font-black text-xs sm:text-sm shadow-md shadow-amber-500/20 transition-transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              Claim Free Daily Spin
            </button>

            {onWatchRewardedAd && (
              <button
                onClick={() => {
                  sound.playClick();
                  onWatchRewardedAd();
                }}
                className="w-full py-2 px-3 rounded-xl bg-purple-950/60 hover:bg-purple-900/80 border border-purple-500/40 text-purple-200 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Tv className="w-3.5 h-3.5 text-purple-400" />
                <span>Watch Ad for +500 Free Coins</span>
              </button>
            )}

            {onOpenAndroidApk && (
              <div className="flex flex-col gap-1.5 w-full">
                <a
                  href="/Ludo-King-v1.0.apk"
                  download="Ludo-King-v1.0.apk"
                  onClick={() => sound.playReward()}
                  className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-display font-black text-xs uppercase tracking-wider transition-transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-emerald-500/25"
                >
                  <Download className="w-4 h-4 stroke-[2.5]" />
                  <span>Download APK (5.3 MB)</span>
                </a>
                <button
                  onClick={() => {
                    sound.playClick();
                    onOpenAndroidApk();
                  }}
                  className="text-[11px] text-emerald-400 hover:text-emerald-300 font-semibold text-center cursor-pointer py-0.5"
                >
                  How to install on phone &rarr;
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Game Mode Select Grid */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-black text-lg sm:text-xl text-white flex items-center gap-2">
            <Swords className="w-5 h-5 text-amber-400" />
            Select Game Mode
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {/* Classic */}
          <button
            onClick={() => {
              sound.playClick();
              setSelectedMode('classic');
            }}
            className={`p-4 rounded-2xl border text-left transition-all relative flex flex-col justify-between cursor-pointer ${
              selectedMode === 'classic'
                ? 'bg-amber-950/40 border-amber-400 ring-2 ring-amber-400/40 shadow-lg shadow-amber-500/20'
                : 'bg-slate-900/80 hover:bg-slate-850 border-slate-800'
            }`}
          >
            <div className="text-2xl mb-2">🎲</div>
            <div>
              <div className="font-display font-bold text-sm text-white">Classic Ludo</div>
              <div className="text-[11px] text-slate-400 leading-snug mt-0.5">
                Traditional rules: 4 tokens home to win.
              </div>
            </div>
            {selectedMode === 'classic' && (
              <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-amber-400 rounded-full" />
            )}
          </button>

          {/* Quick */}
          <button
            onClick={() => {
              sound.playClick();
              setSelectedMode('quick');
            }}
            className={`p-4 rounded-2xl border text-left transition-all relative flex flex-col justify-between cursor-pointer ${
              selectedMode === 'quick'
                ? 'bg-amber-950/40 border-amber-400 ring-2 ring-amber-400/40 shadow-lg shadow-amber-500/20'
                : 'bg-slate-900/80 hover:bg-slate-850 border-slate-800'
            }`}
          >
            <div className="text-2xl mb-2">⚡</div>
            <div>
              <div className="font-display font-bold text-sm text-white">Quick Ludo</div>
              <div className="text-[11px] text-slate-400 leading-snug mt-0.5">
                Fast action: 1 token home takes the crown!
              </div>
            </div>
            {selectedMode === 'quick' && (
              <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-amber-400 rounded-full" />
            )}
          </button>

          {/* Team 2v2 */}
          <button
            onClick={() => {
              sound.playClick();
              setSelectedMode('team');
              setPlayerCount(4); // Team mode requires 4 players
            }}
            className={`p-4 rounded-2xl border text-left transition-all relative flex flex-col justify-between cursor-pointer ${
              selectedMode === 'team'
                ? 'bg-amber-950/40 border-amber-400 ring-2 ring-amber-400/40 shadow-lg shadow-amber-500/20'
                : 'bg-slate-900/80 hover:bg-slate-850 border-slate-800'
            }`}
          >
            <div className="text-2xl mb-2">🤝</div>
            <div>
              <div className="font-display font-bold text-sm text-white">Team 2v2</div>
              <div className="text-[11px] text-slate-400 leading-snug mt-0.5">
                Red & Yellow vs Green & Blue alliance.
              </div>
            </div>
            {selectedMode === 'team' && (
              <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-amber-400 rounded-full" />
            )}
          </button>

          {/* Ranked */}
          <button
            onClick={() => {
              sound.playClick();
              setSelectedMode('ranked');
            }}
            className={`p-4 rounded-2xl border text-left transition-all relative flex flex-col justify-between cursor-pointer ${
              selectedMode === 'ranked'
                ? 'bg-amber-950/40 border-amber-400 ring-2 ring-amber-400/40 shadow-lg shadow-amber-500/20'
                : 'bg-slate-900/80 hover:bg-slate-850 border-slate-800'
            }`}
          >
            <div className="text-2xl mb-2">🏆</div>
            <div>
              <div className="font-display font-bold text-sm text-white">Ranked Mode</div>
              <div className="text-[11px] text-slate-400 leading-snug mt-0.5">
                Compete for RP rank tier points.
              </div>
            </div>
            {selectedMode === 'ranked' && (
              <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-amber-400 rounded-full" />
            )}
          </button>

          {/* Tournament */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenTournament();
            }}
            className="p-4 rounded-2xl border border-slate-800 bg-slate-900/80 hover:bg-slate-850 text-left transition-all relative flex flex-col justify-between cursor-pointer col-span-2 sm:col-span-1"
          >
            <div className="text-2xl mb-2">👑</div>
            <div>
              <div className="font-display font-bold text-sm text-white">Tournament</div>
              <div className="text-[11px] text-slate-400 leading-snug mt-0.5">
                8-Player Bracket Championship.
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Match Type & Configuration Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 bg-slate-900/90 rounded-3xl border border-slate-800 p-5 sm:p-6 shadow-xl">
        {/* Match Type Selector */}
        <div className="flex flex-col gap-3">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            1. Match Type
          </span>
          <div className="grid grid-cols-1 gap-2">
            <button
              onClick={() => {
                sound.playClick();
                setSelectedMatchType('vs_computer');
                setIsJoiningRoom(false);
              }}
              className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                selectedMatchType === 'vs_computer'
                  ? 'bg-amber-950/40 border-amber-400 text-white'
                  : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Users className="w-5 h-5 text-amber-400" />
              <div>
                <div className="text-sm font-bold">Challenger Match</div>
                <div className="text-[11px] text-slate-400">Play with custom named players</div>
              </div>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                setSelectedMatchType('local_pass_n_play');
                setIsJoiningRoom(false);
              }}
              className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                selectedMatchType === 'local_pass_n_play'
                  ? 'bg-amber-950/40 border-amber-400 text-white'
                  : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Users className="w-5 h-5 text-emerald-400" />
              <div>
                <div className="text-sm font-bold">Local Pass 'N Play</div>
                <div className="text-[11px] text-slate-400">Play together on one device</div>
              </div>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                setSelectedMatchType('online_matchmaking');
                setIsJoiningRoom(false);
              }}
              className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                selectedMatchType === 'online_matchmaking'
                  ? 'bg-amber-950/40 border-amber-400 text-white'
                  : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Globe className="w-5 h-5 text-sky-400" />
              <div>
                <div className="text-sm font-bold">Online Matchmaking</div>
                <div className="text-[11px] text-slate-400">Quick match with players</div>
              </div>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                setSelectedMatchType('private_room');
                setIsJoiningRoom(true);
              }}
              className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                selectedMatchType === 'private_room'
                  ? 'bg-amber-950/40 border-amber-400 text-white'
                  : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Key className="w-5 h-5 text-purple-400" />
              <div>
                <div className="text-sm font-bold">Private Room / Code</div>
                <div className="text-[11px] text-slate-400">Create or join with room code</div>
              </div>
            </button>
          </div>
        </div>

        {/* Player Count & Stake Selector */}
        <div className="flex flex-col gap-4">
          {/* Player Count (disabled in team mode which requires 4) */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              2. Player Count
            </span>
            <div className="grid grid-cols-3 gap-2">
              {([2, 3, 4] as const).map((cnt) => (
                <button
                  key={cnt}
                  disabled={selectedMode === 'team' && cnt !== 4}
                  onClick={() => {
                    sound.playClick();
                    setPlayerCount(cnt);
                  }}
                  className={`py-2.5 rounded-xl border font-bold text-sm transition-all cursor-pointer ${
                    playerCount === cnt
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800'
                  } ${selectedMode === 'team' && cnt !== 4 ? 'opacity-30 cursor-not-allowed' : ''}`}
                >
                  {cnt} Players
                </button>
              ))}
            </div>
            {selectedMode === 'team' && (
              <span className="text-[11px] text-purple-300 font-semibold">
                * 2v2 Team mode is locked to 4 players.
              </span>
            )}
          </div>

          {/* Stake / Entry Fee */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              3. Match Stake
            </span>
            <div className="grid grid-cols-2 gap-2">
              {STAKE_OPTIONS.map((stk) => (
                <button
                  key={stk.value}
                  onClick={() => {
                    sound.playClick();
                    setSelectedStake(stk.value);
                  }}
                  className={`py-2 px-2.5 rounded-xl border text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                    selectedStake === stk.value
                      ? 'bg-amber-950/40 border-amber-400 text-amber-300'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <span>{stk.label}</span>
                  {stk.value > 0 && <Coins className="w-3.5 h-3.5 text-amber-400" />}
                </button>
              ))}
            </div>
          </div>

          {/* Player Names Input Box (खिलाड़ी जो नाम लिखेगा वही रहेगा) */}
          <div className="flex flex-col gap-2 bg-slate-950/70 p-3 rounded-2xl border border-slate-800">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>4. Player Names</span>
              <span className="text-[10px] text-amber-400 font-normal">Custom Names</span>
            </span>
            <div className="flex flex-col gap-1.5 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-16 font-bold text-red-400 truncate">P1 (You):</span>
                <span className="flex-1 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-750 text-white font-semibold">
                  {profile.name}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-16 font-bold text-amber-400 truncate">Player 2:</span>
                <input
                  type="text"
                  maxLength={14}
                  value={opponentNames.p2}
                  onChange={(e) => setOpponentNames((prev) => ({ ...prev, p2: e.target.value }))}
                  placeholder="Player 2 Name"
                  className="flex-1 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>
              {playerCount >= 3 && (
                <div className="flex items-center gap-2">
                  <span className="w-16 font-bold text-emerald-400 truncate">Player 3:</span>
                  <input
                    type="text"
                    maxLength={14}
                    value={opponentNames.p3}
                    onChange={(e) => setOpponentNames((prev) => ({ ...prev, p3: e.target.value }))}
                    placeholder="Player 3 Name"
                    className="flex-1 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
              )}
              {playerCount === 4 && (
                <div className="flex items-center gap-2">
                  <span className="w-16 font-bold text-sky-400 truncate">Player 4:</span>
                  <input
                    type="text"
                    maxLength={14}
                    value={opponentNames.p4}
                    onChange={(e) => setOpponentNames((prev) => ({ ...prev, p4: e.target.value }))}
                    placeholder="Player 4 Name"
                    className="flex-1 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Summary & Launch CTA */}
        <div className="flex flex-col justify-between bg-slate-950/80 rounded-2xl border border-slate-800 p-4">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs text-slate-400">Mode</span>
              <span className="text-xs font-bold text-white capitalize">{selectedMode} Ludo</span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs text-slate-400">Match</span>
              <span className="text-xs font-bold text-white">
                {selectedMatchType === 'vs_computer' ? 'Challenger Match' : selectedMatchType === 'local_pass_n_play' ? 'Pass \'N Play' : selectedMatchType === 'online_matchmaking' ? 'Online Matchmaking' : 'Private Room'}
              </span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs text-slate-400">Players</span>
              <span className="text-xs font-bold text-white">{playerCount} Competitors</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">Prize Pool</span>
              <span className="text-xs font-bold text-amber-300 flex items-center gap-1">
                <Coins className="w-3.5 h-3.5 text-amber-400" />
                {selectedStake > 0 ? `${(selectedStake * playerCount).toLocaleString()} Coins` : 'Bragging Rights'}
              </span>
            </div>

            {/* Room code input if private room */}
            {selectedMatchType === 'private_room' && (
              <div className="mt-2 flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-300">
                  Enter Room Code (or leave blank to create):
                </label>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="e.g. 842910"
                  value={roomCodeInput}
                  onChange={(e) => setRoomCodeInput(e.target.value.toUpperCase())}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-center font-mono tracking-widest text-amber-300 focus:outline-none focus:border-amber-400"
                />
              </div>
            )}
          </div>

          <button
            onClick={handleStart}
            className="mt-6 w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-display font-black text-base shadow-xl shadow-amber-500/25 transition-transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Play className="w-5 h-5 fill-slate-950" />
            {selectedMatchType === 'online_matchmaking'
              ? 'Find Online Match'
              : selectedMatchType === 'private_room' && roomCodeInput
              ? 'Join Room'
              : 'Start Game'}
          </button>
        </div>
      </div>
    </div>
  );
};
