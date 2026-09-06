import React, { useState } from 'react';
import { UserProfile } from '../types';
import { User, Trophy, Award, Shield, Flame, CheckCircle, Edit2, X, Sparkles } from 'lucide-react';
import { sound } from '../utils/audio';

interface ProfileModalProps {
  profile: UserProfile;
  onUpdateName: (newName: string) => void;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ profile, onUpdateName, onClose }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [nameInput, setNameInput] = useState(profile.name);

  const winRate = Math.round((profile.gamesWon / Math.max(1, profile.gamesPlayed)) * 100);

  const ACHIEVEMENTS = [
    { title: 'First Blood', desc: 'Capture your first opponent token', unlocked: profile.tokensCaptured >= 1, icon: '⚔️' },
    { title: 'Roll Master', desc: 'Roll 100 sixes across all games', unlocked: profile.sixesRolled >= 100, icon: '🎲' },
    { title: 'Hunter Extraordinaire', desc: 'Capture 50 tokens', unlocked: profile.tokensCaptured >= 50, icon: '🏹' },
    { title: 'Arena Champion', desc: 'Win 20 matches', unlocked: profile.gamesWon >= 20, icon: '👑' },
    { title: 'Dedicated Striver', desc: 'Reach 5 day streak', unlocked: profile.currentStreak >= 5, icon: '🔥' },
  ];

  const handleSaveName = () => {
    if (nameInput.trim()) {
      sound.playClick();
      onUpdateName(nameInput.trim());
      setIsEditing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl relative flex flex-col max-h-[88vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-black text-lg text-white">Player Profile & Records</h3>
              <p className="text-xs text-slate-400">Career progression & achievements</p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Card Summary */}
        <div className="py-4 flex items-center gap-4 border-b border-slate-800">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 p-0.5 shadow-xl flex items-center justify-center text-3xl">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              {profile.avatar}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            {isEditing ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  maxLength={16}
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="bg-slate-950 border border-amber-400 rounded-xl px-2.5 py-1 text-sm font-bold text-white focus:outline-none"
                />
                <button
                  onClick={handleSaveName}
                  className="px-3 py-1 bg-amber-500 text-black font-bold text-xs rounded-xl cursor-pointer"
                >
                  Save
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h4 className="font-display font-black text-lg text-white truncate">
                  {profile.name}
                </h4>
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-slate-400 hover:text-amber-400 p-1 cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                {profile.rankTier} Tier ({profile.rankPoints} RP)
              </span>
              <span>•</span>
              <span className="text-purple-400 font-bold">Level {profile.level}</span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2.5 py-4 border-b border-slate-800">
          <div className="bg-slate-950/70 p-3 rounded-2xl border border-slate-800 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400">Wins / Played</span>
            <div className="font-display font-black text-base text-white mt-0.5">
              {profile.gamesWon} / {profile.gamesPlayed}
            </div>
          </div>

          <div className="bg-slate-950/70 p-3 rounded-2xl border border-slate-800 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400">Win Rate</span>
            <div className="font-display font-black text-base text-emerald-400 mt-0.5">
              {winRate}%
            </div>
          </div>

          <div className="bg-slate-950/70 p-3 rounded-2xl border border-slate-800 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400">Captures</span>
            <div className="font-display font-black text-base text-rose-400 mt-0.5">
              {profile.tokensCaptured}
            </div>
          </div>

          <div className="bg-slate-950/70 p-3 rounded-2xl border border-slate-800 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400">Sixes Rolled</span>
            <div className="font-display font-black text-base text-amber-400 mt-0.5">
              {profile.sixesRolled}
            </div>
          </div>

          <div className="bg-slate-950/70 p-3 rounded-2xl border border-slate-800 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400">Current Streak</span>
            <div className="font-display font-black text-base text-orange-400 mt-0.5 flex items-center justify-center gap-1">
              <Flame className="w-4 h-4 fill-orange-400" />
              {profile.currentStreak}d
            </div>
          </div>

          <div className="bg-slate-950/70 p-3 rounded-2xl border border-slate-800 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400">Battle Pass</span>
            <div className="font-display font-black text-base text-purple-400 mt-0.5">
              Tier {profile.battlePassTier}
            </div>
          </div>
        </div>

        {/* Career Achievements */}
        <div className="flex-1 overflow-y-auto pt-3 flex flex-col gap-2 pr-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Badges & Achievements
          </span>
          {ACHIEVEMENTS.map((ach) => (
            <div
              key={ach.title}
              className={`p-3 rounded-2xl border flex items-center justify-between gap-3 ${
                ach.unlocked
                  ? 'bg-slate-950/80 border-slate-700'
                  : 'bg-slate-950/40 border-slate-850 opacity-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="text-2xl p-1.5 rounded-xl bg-slate-900 border border-slate-800">
                  {ach.icon}
                </div>
                <div>
                  <div className="font-bold text-xs text-white flex items-center gap-1.5">
                    {ach.title}
                    {ach.unlocked && <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />}
                  </div>
                  <div className="text-[11px] text-slate-400">{ach.desc}</div>
                </div>
              </div>

              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                ach.unlocked ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-500'
              }`}>
                {ach.unlocked ? 'Unlocked' : 'In Progress'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
