import React, { useEffect } from 'react';
import { Player, GameMode } from '../types';
import confetti from 'canvas-confetti';
import { Trophy, Coins, Award, ArrowRight, RotateCcw, Sparkles, Gem, TrendingUp, Tv, Skull } from 'lucide-react';
import { sound } from '../utils/audio';

interface GameVictoryModalProps {
  winner: Player;
  players: Player[];
  gameMode: GameMode;
  userPlayerId: string;
  coinsEarned: number;
  xpEarned: number;
  rpChange: number;
  onPlayAgain: () => void;
  onReturnToLobby: () => void;
  onWatchAdsReplay?: () => void;
}

export const GameVictoryModal: React.FC<GameVictoryModalProps> = ({
  winner,
  players,
  gameMode,
  userPlayerId,
  coinsEarned,
  xpEarned,
  rpChange,
  onPlayAgain,
  onReturnToLobby,
  onWatchAdsReplay,
}) => {
  const isUserWinner = winner.id === userPlayerId;

  useEffect(() => {
    if (isUserWinner) {
      sound.playVictory();
      // Burst confetti
      try {
        confetti({
          particleCount: 90,
          spread: 70,
          origin: { y: 0.6 },
        });
        setTimeout(() => {
          confetti({
            particleCount: 50,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
          });
          confetti({
            particleCount: 50,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
          });
        }, 300);
      } catch {
        // ignore
      }
    } else {
      sound.playCapture(); // Defeat sound cue
    }
  }, [isUserWinner]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="w-full max-w-md bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-2 border-amber-500/50 rounded-3xl p-6 shadow-2xl relative overflow-hidden text-center">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-amber-500/15 blur-3xl pointer-events-none rounded-full" />

        {/* Trophy / Emblem */}
        <div className="relative inline-flex items-center justify-center mb-3">
          <div className={`w-20 h-20 rounded-2xl p-1 shadow-xl animate-bounce ${
            isUserWinner 
              ? 'bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-200 shadow-amber-500/30'
              : 'bg-gradient-to-tr from-rose-500 via-purple-600 to-indigo-600 shadow-rose-500/25'
          }`}>
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              {isUserWinner ? (
                <Trophy className="w-10 h-10 text-amber-400 fill-amber-400" />
              ) : (
                <RotateCcw className="w-10 h-10 text-rose-400" />
              )}
            </div>
          </div>
          {isUserWinner && (
            <Sparkles className="w-6 h-6 text-yellow-300 absolute -top-2 -right-2 animate-spin" style={{ animationDuration: '4s' }} />
          )}
        </div>

        {/* Title */}
        <h2 className={`font-display font-black text-2xl sm:text-3xl tracking-wide ${
          isUserWinner ? 'text-white' : 'text-rose-200'
        }`}>
          {isUserWinner ? 'VICTORY ROYALE!' : 'DEFEAT! (मैच समाप्त)'}
        </h2>
        <p className="text-sm font-semibold text-slate-300 mt-1">
          {isUserWinner 
            ? 'शानदार जीत! You won the championship match!' 
            : `${winner.name} won this round. हार गए कोई बात नहीं, Replay करके रैंक पुश करें!`}
        </p>

        {/* Rewards Box */}
        <div className="grid grid-cols-3 gap-2 my-5 bg-slate-950/70 p-3 rounded-2xl border border-slate-800 shadow-inner">
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Coins</span>
            <div className="flex items-center gap-1 mt-1 text-amber-400 font-display font-black text-base">
              <Coins className="w-4 h-4 fill-amber-400" />
              <span>+{coinsEarned}</span>
            </div>
          </div>

          <div className="flex flex-col items-center border-x border-slate-800">
            <span className="text-[10px] text-slate-400 font-bold uppercase">XP</span>
            <div className="flex items-center gap-1 mt-1 text-purple-400 font-display font-black text-base">
              <Award className="w-4 h-4" />
              <span>+{xpEarned}</span>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Rank RP</span>
            <div className={`flex items-center gap-1 mt-1 font-display font-black text-base ${rpChange >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              <span>{rpChange >= 0 ? `+${rpChange}` : rpChange}</span>
            </div>
          </div>
        </div>

        {/* Player Finish List */}
        <div className="flex flex-col gap-1.5 mb-6 text-left">
          <span className="text-xs font-bold text-slate-400 px-1">Final Standings:</span>
          {players.map((p, idx) => {
            const isFirst = p.id === winner.id;
            return (
              <div
                key={p.id}
                className={`flex items-center justify-between px-3 py-2 rounded-xl border ${
                  isFirst
                    ? 'bg-amber-950/40 border-amber-500/50 text-amber-200'
                    : 'bg-slate-900 border-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-display font-black text-xs text-slate-400 w-4">
                    #{idx + 1}
                  </span>
                  <span className="text-lg">{p.avatar}</span>
                  <span className="text-xs font-bold truncate max-w-[140px]">
                    {p.name}
                  </span>
                </div>
                <span className="text-[11px] font-bold text-slate-400">
                  {p.tokens.filter(t => t.step === 57).length}/4 Home
                </span>
              </div>
            );
          })}
        </div>

        {/* Special 2-Ad Replay & Rank Push Option (हारने या मैच खत्म होने पर Replay + 10 Diamonds + Rank Push) */}
        {onWatchAdsReplay && (
          <div className="flex flex-col gap-2 mb-4">
            <button
              onClick={() => {
                sound.playClick();
                onWatchAdsReplay();
              }}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-amber-500 hover:from-purple-500 hover:to-amber-400 text-white font-display font-black text-xs sm:text-sm shadow-xl shadow-purple-500/25 transition-transform active:scale-95 flex items-center justify-between border border-purple-400/50 cursor-pointer"
            >
              <div className="flex items-center gap-2 text-left">
                <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center text-lg">
                  💎
                </div>
                <div className="flex flex-col">
                  <span className="font-extrabold text-white text-xs sm:text-sm">
                    Replay + Rank Push (Watch 2 Ads)
                  </span>
                  <span className="text-[10px] text-amber-200 font-semibold">
                    Get 10 Diamonds 💎 + 60 RP Rank Boost & Rematch
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1 bg-amber-400 text-slate-950 px-2 py-1 rounded-lg text-[10px] font-black uppercase shadow">
                <Tv className="w-3 h-3" />
                <span>2 Ads (30s)</span>
              </div>
            </button>
          </div>
        )}

        {/* Standard Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sound.playClick();
              onReturnToLobby();
            }}
            className="flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm border border-slate-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            Lobby
          </button>
          <button
            onClick={() => {
              sound.playClick();
              onPlayAgain();
            }}
            className="flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 font-display font-bold text-sm border border-slate-700 hover:border-slate-600 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-slate-400" />
            Quick Rematch
          </button>
        </div>
      </div>
    </div>
  );
};
