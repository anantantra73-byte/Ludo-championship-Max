import React, { useState, useEffect } from 'react';
import { 
  X, 
  Tv, 
  Coins, 
  Sparkles, 
  CheckCircle2, 
  Volume2, 
  VolumeX, 
  ExternalLink,
  Shield,
  Play
} from 'lucide-react';
import { sound } from '../utils/audio';

interface RewardedAdModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRewardClaimed: (reward: { coins: number; gems: number }) => void;
}

export const RewardedAdModal: React.FC<RewardedAdModalProps> = ({
  isOpen,
  onClose,
  onRewardClaimed,
}) => {
  const [countdown, setCountdown] = useState(5);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isFinished, setIsFinished] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setCountdown(5);
      setIsPlaying(true);
      setIsFinished(false);
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsFinished(true);
          sound.playReward();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClaim = () => {
    sound.playReward();
    onRewardClaimed({ coins: 500, gems: 5 });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-purple-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Top Ad Info Bar */}
        <div className="bg-slate-950 px-4 py-2.5 flex items-center justify-between border-b border-slate-800 text-xs">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30 text-[10px]">
              REWARDED AD
            </span>
            <span className="text-slate-400 text-[11px]">
              Sponsored Interactive Showcase
            </span>
          </div>

          <div className="flex items-center gap-2">
            {!isFinished ? (
              <span className="px-2.5 py-0.5 bg-slate-800 text-amber-400 font-mono font-bold text-xs rounded-full border border-slate-700">
                Reward in {countdown}s
              </span>
            ) : (
              <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-400 font-bold text-xs rounded-full border border-emerald-500/30 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Reward Ready!
              </span>
            )}

            {isFinished && (
              <button
                onClick={() => {
                  sound.playClick();
                  onClose();
                }}
                className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Video / Interactive Ad Player Canvas */}
        <div className="relative aspect-video w-full bg-gradient-to-br from-indigo-950 via-slate-950 to-purple-950 flex flex-col items-center justify-center p-6 text-center overflow-hidden">
          {/* Decorative Glow */}
          <div className="absolute -top-12 -left-12 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl" />

          {/* Ad Brand Showcase */}
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-purple-500 p-1 shadow-2xl mb-3 animate-bounce">
              <div className="w-full h-full bg-slate-950 rounded-xl flex items-center justify-center text-3xl">
                👑
              </div>
            </div>

            <h3 className="text-xl font-display font-black text-white tracking-wide">
              CHAMPIONSHIP ARENA VIP
            </h3>
            <p className="text-xs text-purple-200 mt-1 max-w-xs">
              Unlock exclusive Golden Dice skins, custom victory emotes, and weekly tournaments!
            </p>

            <div className="mt-4 flex items-center gap-3">
              <span className="px-3 py-1 bg-amber-500/20 border border-amber-500/30 rounded-full text-xs font-bold text-amber-300">
                ★★★★★ 4.9 Rating
              </span>
              <span className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full text-xs font-bold text-purple-300">
                10M+ Players
              </span>
            </div>
          </div>

          {/* Progress bar at bottom of player */}
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-slate-800">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 via-amber-400 to-emerald-400 transition-all duration-1000"
              style={{ width: `${((5 - countdown) / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* Ad Action & Reward Bottom Bar */}
        <div className="p-4 sm:p-5 bg-slate-950 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">
                Reward: <span className="text-amber-400">+500 Free Coins</span> + <span className="text-emerald-400">5 Gems</span>
              </div>
              <div className="text-[10px] text-slate-400">
                Earning generated for game developer
              </div>
            </div>
          </div>

          <div>
            {isFinished ? (
              <button
                onClick={handleClaim}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-display font-black text-xs shadow-lg shadow-emerald-500/20 cursor-pointer transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-4 h-4" />
                <span>Claim Reward!</span>
              </button>
            ) : (
              <button
                disabled
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 text-slate-500 font-bold text-xs cursor-not-allowed flex items-center justify-center gap-1.5"
              >
                <span>Please wait ({countdown}s)...</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
