import React from 'react';
import { Player, PlayerColor } from '../types';
import { Shield, Trophy, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PlayerCardProps {
  player: Player;
  isActive: boolean;
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  isTeamMode?: boolean;
}

export const PlayerCard: React.FC<PlayerCardProps> = ({
  player,
  isActive,
  position,
  isTeamMode,
}) => {
  const getColorClasses = (color: PlayerColor) => {
    switch (color) {
      case 'red':
        return {
          border: 'border-red-500/50',
          activeRing: 'ring-2 ring-red-400 shadow-[0_0_20px_rgba(239,68,68,0.4)]',
          badge: 'bg-red-500/20 text-red-300 border-red-500/30',
          accent: 'from-red-600 to-rose-700',
        };
      case 'green':
        return {
          border: 'border-emerald-500/50',
          activeRing: 'ring-2 ring-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.4)]',
          badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
          accent: 'from-emerald-600 to-teal-700',
        };
      case 'yellow':
        return {
          border: 'border-amber-500/50',
          activeRing: 'ring-2 ring-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.4)]',
          badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
          accent: 'from-amber-500 to-yellow-600',
        };
      case 'blue':
        return {
          border: 'border-sky-500/50',
          activeRing: 'ring-2 ring-sky-400 shadow-[0_0_20px_rgba(14,165,233,0.4)]',
          badge: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
          accent: 'from-sky-600 to-blue-700',
        };
    }
  };

  const style = getColorClasses(player.color);

  // Counts
  const homeTokens = player.tokens.filter(t => t.step === 57).length;
  const trackTokens = player.tokens.filter(t => t.step >= 0 && t.step < 57).length;
  const yardTokens = player.tokens.filter(t => t.step === -1).length;

  return (
    <div
      className={`relative flex items-center gap-2 p-2 sm:p-2.5 rounded-2xl bg-slate-900/90 backdrop-blur-md border ${
        style.border
      } transition-all duration-300 select-none ${
        isActive ? `${style.activeRing} scale-105 bg-slate-850 z-20` : 'opacity-85'
      }`}
    >
      {/* Emote Speech Bubble */}
      <AnimatePresence>
        {player.activeEmote && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: -45 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute -top-3 left-1/2 -translate-x-1/2 z-50 bg-slate-800/95 border border-amber-400/80 px-3 py-1.5 rounded-2xl shadow-xl flex items-center gap-1.5 whitespace-nowrap"
          >
            <span className="text-base">{player.activeEmote.emoji}</span>
            <span className="text-xs font-bold text-amber-200">
              {player.activeEmote.text}
            </span>
            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-800 border-r border-b border-amber-400/80 transform rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Avatar with Frame */}
      <div className="relative">
        <div
          className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr ${style.accent} p-0.5 shadow-md flex items-center justify-center`}
        >
          <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-lg sm:text-xl">
            {player.avatar}
          </div>
        </div>

        {/* Turn indicator pulse */}
        {isActive && (
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-xs sm:text-sm font-bold text-white truncate max-w-[90px] sm:max-w-[110px]">
            {player.name}
          </span>
          {player.level && (
            <span className="text-[9px] font-bold px-1.5 py-0.2 bg-slate-800 text-amber-300 rounded border border-slate-750">
              Lv.{player.level}
            </span>
          )}
          {isTeamMode && player.team && (
            <span className="text-[9px] font-black px-1.5 py-0.2 bg-purple-900/60 text-purple-300 rounded border border-purple-500/40 flex items-center gap-0.5">
              <Users className="w-2.5 h-2.5" />
              T{player.team}
            </span>
          )}
        </div>

        {/* Tokens progress pills */}
        <div className="flex items-center gap-1 mt-1 text-[10px] font-medium text-slate-300">
          <span title="In Home" className="flex items-center text-amber-400 font-bold">
            🏠 {homeTokens}/4
          </span>
          <span>•</span>
          <span title="On Board" className="text-slate-400">
            🏃 {trackTokens}
          </span>
        </div>
      </div>
    </div>
  );
};
