import React from 'react';
import { UserProfile, GameSettings } from '../types';
import { 
  Trophy, 
  Coins, 
  Gem, 
  Settings, 
  Award, 
  ShoppingBag, 
  Scroll, 
  Volume2, 
  VolumeX, 
  Flame,
  User,
  DollarSign,
  Smartphone,
  Download
} from 'lucide-react';
import { sound } from '../utils/audio';

interface HeaderNavProps {
  profile: UserProfile;
  settings: GameSettings;
  activeView: 'game' | 'lobby';
  hasUnclaimedMissions: boolean;
  adEarningsInr?: number;
  onOpenProfile: () => void;
  onOpenShop: () => void;
  onOpenMissions: () => void;
  onOpenLeaderboards: () => void;
  onOpenBattlePass: () => void;
  onOpenSettings: () => void;
  onOpenMonetization: () => void;
  onOpenAndroidApk?: () => void;
  onToggleSound: () => void;
  onReturnToLobby: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  profile,
  settings,
  activeView,
  hasUnclaimedMissions,
  adEarningsInr = 0,
  onOpenProfile,
  onOpenShop,
  onOpenMissions,
  onOpenLeaderboards,
  onOpenBattlePass,
  onOpenSettings,
  onOpenMonetization,
  onOpenAndroidApk,
  onToggleSound,
  onReturnToLobby,
}) => {
  return (
    <header className="w-full bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-3 sm:px-6 py-2.5 flex items-center justify-between sticky top-0 z-40 shadow-xl">
      {/* Brand / Logo */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => {
            sound.playClick();
            onReturnToLobby();
          }}
          className="flex items-center gap-2 group text-left cursor-pointer focus:outline-none"
        >
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl overflow-hidden shadow-lg shadow-amber-500/30 ring-2 ring-amber-400/50 group-hover:scale-105 transition-transform shrink-0 bg-slate-950">
            <img 
              src="/logo.png" 
              alt="Ludo King Logo" 
              className="w-full h-full object-cover" 
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-display font-black text-base sm:text-lg tracking-wide bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 bg-clip-text text-transparent">
                LUDO
              </span>
              <span className="font-display font-black text-base sm:text-lg tracking-wide text-white">
                KING
              </span>
            </div>
            <div className="text-[10px] font-medium text-slate-400 flex items-center gap-2">
              <span>Season 1</span>
              <span>•</span>
              <span className="text-amber-400 font-semibold">{profile.rankTier} Tier</span>
            </div>
          </div>
        </button>

        {activeView === 'game' && (
          <button
            onClick={() => {
              sound.playClick();
              onReturnToLobby();
            }}
            className="hidden md:inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg border border-slate-700/60 transition-colors ml-3"
          >
            ← Back to Lobby
          </button>
        )}
      </div>

      {/* Center - Stats & Currencies */}
      <div className="hidden lg:flex items-center gap-4">
        {/* Streak */}
        <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-950/40 border border-amber-500/30 rounded-full text-xs font-bold text-amber-300">
          <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400 animate-pulse" />
          <span>{profile.currentStreak} Day Streak</span>
        </div>

        {/* Coins */}
        <div className="flex items-center gap-2 px-3 py-1 bg-slate-950/70 border border-amber-500/30 rounded-full shadow-inner">
          <Coins className="w-4 h-4 text-amber-400 fill-amber-400" />
          <span className="font-display font-bold text-xs text-amber-300">
            {profile.coins.toLocaleString()}
          </span>
        </div>

        {/* Gems */}
        <div className="flex items-center gap-2 px-3 py-1 bg-slate-950/70 border border-emerald-500/30 rounded-full shadow-inner">
          <Gem className="w-4 h-4 text-emerald-400 fill-emerald-400" />
          <span className="font-display font-bold text-xs text-emerald-300">
            {profile.gems.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Mobile Currencies */}
        <div className="flex lg:hidden items-center gap-1.5 mr-1 text-[11px] font-bold">
          <div className="flex items-center gap-1 px-2 py-0.5 bg-slate-950/60 border border-amber-500/30 rounded-full text-amber-300">
            <Coins className="w-3 h-3 text-amber-400" />
            <span>{profile.coins}</span>
          </div>
        </div>

        {/* Missions Button */}
        <button
          onClick={() => {
            sound.playClick();
            onOpenMissions();
          }}
          title="Daily Quests & Missions"
          className="relative p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-amber-400 border border-slate-700/60 transition-all cursor-pointer"
        >
          <Scroll className="w-4 h-4" />
          {hasUnclaimedMissions && (
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full ring-2 ring-slate-900 animate-ping" />
          )}
          {hasUnclaimedMissions && (
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full ring-2 ring-slate-900" />
          )}
        </button>

        {/* Battle Pass Button */}
        <button
          onClick={() => {
            sound.playClick();
            onOpenBattlePass();
          }}
          title="Battle Pass"
          className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-purple-400 border border-slate-700/60 transition-all cursor-pointer relative"
        >
          <Award className="w-4 h-4" />
          <span className="absolute -bottom-1 -right-1 text-[9px] font-black bg-purple-600 text-white px-1 rounded-full">
            {profile.battlePassTier}
          </span>
        </button>

        {/* Shop Button */}
        <button
          onClick={() => {
            sound.playClick();
            onOpenShop();
          }}
          title="Customization Shop"
          className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-emerald-400 border border-slate-700/60 transition-all cursor-pointer"
        >
          <ShoppingBag className="w-4 h-4" />
        </button>

        {/* Leaderboards Button */}
        <button
          onClick={() => {
            sound.playClick();
            onOpenLeaderboards();
          }}
          title="Leaderboards"
          className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-yellow-400 border border-slate-700/60 transition-all cursor-pointer"
        >
          <Trophy className="w-4 h-4" />
        </button>

        {/* Sound Toggle */}
        <button
          onClick={() => {
            onToggleSound();
          }}
          title={settings.soundEnabled ? "Mute sound" : "Unmute sound"}
          className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-sky-400 border border-slate-700/60 transition-all cursor-pointer"
        >
          {settings.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-rose-400" />}
        </button>

        {/* Settings */}
        <button
          onClick={() => {
            sound.playClick();
            onOpenSettings();
          }}
          title="Settings"
          className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition-all cursor-pointer"
        >
          <Settings className="w-4 h-4" />
        </button>

        {/* Ad Monetization & Earning Hub */}
        <button
          onClick={() => {
            sound.playClick();
            onOpenMonetization();
          }}
          title="Ad Monetization & Earnings (विज्ञापन कमाई)"
          className="p-1.5 sm:px-2.5 sm:py-1 rounded-xl bg-gradient-to-r from-amber-500/20 to-yellow-500/20 hover:from-amber-500/30 hover:to-yellow-500/30 text-amber-300 border border-amber-500/40 transition-all cursor-pointer flex items-center gap-1.5"
        >
          <DollarSign className="w-4 h-4 text-amber-400" />
          <span className="hidden sm:inline text-xs font-black font-display text-amber-300">
            ₹{adEarningsInr.toFixed(0)}
          </span>
        </button>

        {/* Android APK Download Button */}
        <button
          onClick={() => {
            sound.playClick();
            onOpenAndroidApk?.();
          }}
          title="Download APK / Install Android App (APK डाउनलोड करें)"
          className="px-2.5 py-1 sm:px-3 sm:py-1 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs transition-all cursor-pointer flex items-center gap-1.5 shadow-md shadow-emerald-500/25 shrink-0"
        >
          <Download className="w-3.5 h-3.5 text-slate-950 stroke-[2.5]" />
          <span className="font-display font-black text-slate-950 uppercase tracking-tight">
            Download APK
          </span>
        </button>

        {/* User Profile Avatar */}
        <button
          onClick={() => {
            sound.playClick();
            onOpenProfile();
          }}
          title="Player Profile"
          className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-xl bg-gradient-to-r from-slate-800 to-slate-850 hover:from-slate-700 hover:to-slate-800 border border-slate-700/80 transition-all cursor-pointer ml-1"
        >
          <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-sm shadow-sm">
            {profile.avatar}
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-xs font-bold text-white max-w-[80px] truncate leading-tight">
              {profile.name}
            </div>
            <div className="text-[10px] font-semibold text-amber-400 leading-tight">
              Lv. {profile.level}
            </div>
          </div>
        </button>
      </div>
    </header>
  );
};
