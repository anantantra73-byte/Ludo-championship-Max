import React, { useState } from 'react';
import { LeaderboardUser, UserProfile } from '../types';
import { Trophy, Medal, Globe, Users, Flame, X } from 'lucide-react';
import { sound } from '../utils/audio';

interface LeaderboardModalProps {
  profile: UserProfile;
  onClose: () => void;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({ profile, onClose }) => {
  const [activeTab, setActiveTab] = useState<'global' | 'weekly' | 'friends'>('global');

  const GLOBAL_PLAYERS: LeaderboardUser[] = [
    { rank: 1, name: 'Aarav "DiceKing"', avatar: '👑', frame: 'diamond', tier: 'Grandmaster', points: 4850, wins: 412, winRate: '78%' },
    { rank: 2, name: 'Elena_V', avatar: '⚡', frame: 'gold', tier: 'Master', points: 4420, wins: 380, winRate: '74%' },
    { rank: 3, name: 'Marcus_Prime', avatar: '🐉', frame: 'gold', tier: 'Master', points: 4190, wins: 355, winRate: '71%' },
    { rank: 4, name: 'Rohan_Strategist', avatar: '🦁', frame: 'silver', tier: 'Diamond', points: 3950, wins: 310, winRate: '68%' },
    { rank: 5, name: 'Sakura_Ludo', avatar: '🌸', frame: 'silver', tier: 'Diamond', points: 3720, wins: 295, winRate: '69%' },
    { rank: 6, name: profile.name, avatar: profile.avatar, frame: 'gold', tier: profile.rankTier, points: profile.rankPoints, wins: profile.gamesWon, winRate: `${Math.round((profile.gamesWon / Math.max(1, profile.gamesPlayed)) * 100)}%`, isCurrentPlayer: true },
    { rank: 7, name: 'Vikram_Shield', avatar: '🛡️', frame: 'silver', tier: 'Platinum', points: 2840, wins: 215, winRate: '63%' },
    { rank: 8, name: 'Chloe_99', avatar: '🦊', frame: 'silver', tier: 'Platinum', points: 2650, wins: 198, winRate: '61%' },
    { rank: 9, name: 'CyberKnight', avatar: '🚀', frame: 'bronze', tier: 'Gold', points: 2310, wins: 160, winRate: '58%' },
    { rank: 10, name: 'PixelStar', avatar: '⭐', frame: 'bronze', tier: 'Gold', points: 2140, wins: 145, winRate: '56%' },
  ];

  const WEEKLY_PLAYERS: LeaderboardUser[] = [
    { rank: 1, name: 'Elena_V', avatar: '⚡', frame: 'gold', tier: 'Master', points: 1420, wins: 48, winRate: '82%' },
    { rank: 2, name: profile.name, avatar: profile.avatar, frame: 'gold', tier: profile.rankTier, points: 1240, wins: 23, winRate: '75%', isCurrentPlayer: true },
    { rank: 3, name: 'Aarav "DiceKing"', avatar: '👑', frame: 'diamond', tier: 'Grandmaster', points: 1190, wins: 39, winRate: '71%' },
    { rank: 4, name: 'Chloe_99', avatar: '🦊', frame: 'silver', tier: 'Platinum', points: 980, wins: 31, winRate: '65%' },
    { rank: 5, name: 'Marcus_Prime', avatar: '🐉', frame: 'gold', tier: 'Master', points: 890, wins: 27, winRate: '62%' },
  ];

  const FRIENDS_PLAYERS: LeaderboardUser[] = [
    { rank: 1, name: profile.name, avatar: profile.avatar, frame: 'gold', tier: profile.rankTier, points: profile.rankPoints, wins: profile.gamesWon, winRate: `${Math.round((profile.gamesWon / Math.max(1, profile.gamesPlayed)) * 100)}%`, isCurrentPlayer: true },
    { rank: 2, name: 'Rohan_Strategist', avatar: '🦁', frame: 'silver', tier: 'Diamond', points: 3950, wins: 310, winRate: '68%' },
    { rank: 3, name: 'Chloe_99', avatar: '🦊', frame: 'silver', tier: 'Platinum', points: 2650, wins: 198, winRate: '61%' },
    { rank: 4, name: 'PixelStar', avatar: '⭐', frame: 'bronze', tier: 'Gold', points: 2140, wins: 145, winRate: '56%' },
  ];

  const currentList =
    activeTab === 'global' ? GLOBAL_PLAYERS : activeTab === 'weekly' ? WEEKLY_PLAYERS : FRIENDS_PLAYERS;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl relative flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-yellow-500/20 text-yellow-400">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-black text-lg text-white">Championship Leaderboard</h3>
              <p className="text-xs text-slate-400">Compete with global players</p>
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

        {/* Tab switcher */}
        <div className="flex items-center gap-2 py-3 border-b border-slate-800">
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('global');
            }}
            className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'global' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            Global
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('weekly');
            }}
            className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'weekly' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            Weekly Cup
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('friends');
            }}
            className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'friends' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            Friends
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto py-3 flex flex-col gap-2 pr-1">
          {currentList.map((user) => {
            const isTop3 = user.rank <= 3;
            const medalColor =
              user.rank === 1
                ? 'text-yellow-400 fill-yellow-400'
                : user.rank === 2
                ? 'text-slate-300 fill-slate-300'
                : user.rank === 3
                ? 'text-amber-600 fill-amber-600'
                : 'text-slate-500';

            return (
              <div
                key={user.name}
                className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                  user.isCurrentPlayer
                    ? 'bg-amber-950/40 border-amber-500/50 shadow-md ring-1 ring-amber-400/30'
                    : isTop3
                    ? 'bg-slate-950/80 border-slate-700'
                    : 'bg-slate-950/50 border-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-6 flex items-center justify-center font-display font-black text-sm">
                    {isTop3 ? <Medal className={`w-5 h-5 ${medalColor}`} /> : `#${user.rank}`}
                  </div>
                  <div className="text-2xl">{user.avatar}</div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-sm text-white truncate max-w-[120px] sm:max-w-[150px]">
                        {user.name}
                      </span>
                      {user.isCurrentPlayer && (
                        <span className="text-[9px] font-black px-1.5 py-0.2 bg-amber-500 text-black rounded-full">
                          YOU
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-400 flex items-center gap-2">
                      <span className="text-amber-400 font-semibold">{user.tier}</span>
                      <span>•</span>
                      <span>{user.wins} Wins ({user.winRate})</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-display font-black text-sm text-amber-300">
                    {user.points.toLocaleString()} RP
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
