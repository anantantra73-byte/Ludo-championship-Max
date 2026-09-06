import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Sparkles, 
  Gem, 
  TrendingUp, 
  CheckCircle2, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  ExternalLink,
  ShieldCheck,
  Zap
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../utils/audio';

interface ReplayAdRewardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCompleteAndReplay: (reward: { diamonds: number; rankPointsBonus: number }) => void;
}

interface AdCreative {
  title: string;
  sponsor: string;
  category: string;
  tagline: string;
  ctaText: string;
  rating: string;
  downloads: string;
  accentGradient: string;
  icon: string;
}

const AD_CREATIVES: AdCreative[] = [
  {
    title: 'Dragon Siege: Kingdom War',
    sponsor: 'Google Play Games',
    category: 'Epic Strategy 3D',
    tagline: 'Defend your kingdom, train mythical dragons, and conquer rival clans worldwide!',
    ctaText: 'Play Free on Play Store',
    rating: '4.8 ★',
    downloads: '10M+ Downloads',
    accentGradient: 'from-amber-600 via-orange-600 to-red-700',
    icon: '🐉',
  },
  {
    title: 'Cyber Strike: Tactical Ops',
    sponsor: 'AdChoices Verified',
    category: 'Action Multiplayer',
    tagline: 'High-octane futuristic team battle. Unlock legendary skins, weapons, and rank rewards!',
    ctaText: 'Install & Get 500 Gold',
    rating: '4.9 ★',
    downloads: '25M+ Players',
    accentGradient: 'from-purple-600 via-indigo-600 to-blue-700',
    icon: '⚡',
  },
];

export const ReplayAdRewardModal: React.FC<ReplayAdRewardModalProps> = ({
  isOpen,
  onClose,
  onCompleteAndReplay,
}) => {
  // 1 = first ad, 2 = second ad, 3 = both completed / celebration screen
  const [adStage, setAdStage] = useState<1 | 2 | 3>(1);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(30);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [adInteracted, setAdInteracted] = useState<boolean>(false);
  const timerRef = useRef<number | null>(null);

  const AD_DURATION = 30; // 30 seconds as requested by user

  // Reset when opening
  useEffect(() => {
    if (isOpen) {
      setAdStage(1);
      setSecondsRemaining(AD_DURATION);
      setAdInteracted(false);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
  }, [isOpen]);

  // 30-Second Countdown logic
  useEffect(() => {
    if (!isOpen || adStage === 3) return;

    timerRef.current = window.setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          // Current ad completed
          if (adStage === 1) {
            // Move to Ad 2
            sound.playSafeStar();
            setAdStage(2);
            return AD_DURATION;
          } else if (adStage === 2) {
            // Both ads completed!
            sound.playReward();
            try {
              confetti({
                particleCount: 110,
                spread: 80,
                origin: { y: 0.55 },
              });
            } catch {
              // ignore
            }
            setAdStage(3);
            return 0;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isOpen, adStage]);

  if (!isOpen) return null;

  const currentAd = AD_CREATIVES[adStage === 2 ? 1 : 0];
  const progressPercent = Math.max(0, Math.min(100, ((AD_DURATION - secondsRemaining) / AD_DURATION) * 100));

  // Quick test skip handler so user and testers don't have to wait full 60 seconds
  const handleFastForwardDemo = () => {
    sound.playClick();
    if (adStage === 1) {
      setAdStage(2);
      setSecondsRemaining(AD_DURATION);
    } else if (adStage === 2) {
      sound.playReward();
      try {
        confetti({ particleCount: 100, spread: 70 });
      } catch {
        // ignore
      }
      setAdStage(3);
      setSecondsRemaining(0);
    }
  };

  const handleClaimAndReplay = () => {
    sound.playReward();
    onCompleteAndReplay({
      diamonds: 10,
      rankPointsBonus: 60, // Rank push boost
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-slate-900 border border-purple-500/50 rounded-3xl p-5 sm:p-6 shadow-2xl relative overflow-hidden flex flex-col">
        {/* Glow ambient */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-36 bg-purple-500/20 blur-3xl pointer-events-none rounded-full" />

        {adStage !== 3 ? (
          /* ================= ACTIVE 30s AD VIEW ================= */
          <div className="flex flex-col gap-4 relative z-10">
            {/* Top Bar with Stage & Timer */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 font-display font-bold text-xs border border-purple-500/30">
                  Ad {adStage} of 2
                </span>
                <span className="text-[11px] text-slate-400 font-medium">
                  Watch 2x 30s Ads for +10 💎 & Rank Push
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors"
                  title="Toggle Sound"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* 30-Second Countdown Pill & Progress */}
            <div className="bg-slate-950/80 rounded-2xl p-3 border border-slate-800 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-purple-600/30 text-purple-300 border border-purple-500/50 flex items-center justify-center font-black text-xs animate-pulse">
                    {secondsRemaining}s
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-white">
                      {secondsRemaining > 0 ? `Reward in ${secondsRemaining} seconds` : 'Ad Completed!'}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {adStage === 1 ? 'Ad 1 of 2 running' : 'Final Ad 2 of 2 running'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 bg-amber-500/20 px-2 py-1 rounded-xl border border-amber-500/30 text-amber-300 text-xs font-black">
                  <Gem className="w-3.5 h-3.5 fill-amber-300 text-amber-400" />
                  <span>+10 Diamonds</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 to-amber-400 transition-all duration-300 ease-linear rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Video Creative Player Simulation */}
            <div className={`w-full rounded-2xl bg-gradient-to-br ${currentAd.accentGradient} p-5 text-white flex flex-col justify-between min-h-[220px] shadow-xl relative overflow-hidden`}>
              <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/40 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-bold text-slate-300">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>Sponsored Video</span>
              </div>

              {/* Creative Header */}
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-black/30 border border-white/20 backdrop-blur-md flex items-center justify-center text-3xl shadow-lg">
                  {currentAd.icon}
                </div>
                <div>
                  <h4 className="font-display font-black text-lg text-white drop-shadow">
                    {currentAd.title}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-white/80">
                    <span>{currentAd.sponsor}</span>
                    <span>•</span>
                    <span className="text-yellow-300 font-bold">{currentAd.rating}</span>
                    <span>•</span>
                    <span>{currentAd.downloads}</span>
                  </div>
                </div>
              </div>

              {/* Tagline / Video Animation Scene */}
              <div className="my-2 bg-black/25 backdrop-blur-sm p-3 rounded-xl border border-white/10 text-xs text-white/90 leading-relaxed">
                <p>{currentAd.tagline}</p>
                <div className="flex items-center gap-2 mt-2 text-[10px] text-amber-300 font-semibold">
                  <Zap className="w-3 h-3 fill-amber-300" />
                  <span>Interactive Ad • High Reward Payout Verified</span>
                </div>
              </div>

              {/* Install / Interaction CTA */}
              <button
                onClick={() => {
                  sound.playClick();
                  setAdInteracted(true);
                  // Open sponsor showcase
                  window.open('https://play.google.com', '_blank', 'noopener,noreferrer');
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-white text-slate-950 font-display font-black text-xs sm:text-sm hover:bg-slate-100 shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{currentAd.ctaText}</span>
                <ExternalLink className="w-4 h-4 text-slate-700" />
              </button>
            </div>

            {/* Quick Demo Test Option */}
            <div className="flex items-center justify-between pt-1">
              <button
                onClick={onClose}
                className="text-xs text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
              >
                Cancel Replay
              </button>

              <button
                onClick={handleFastForwardDemo}
                className="text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1 cursor-pointer bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20"
                title="Skip timer for instant preview testing"
              >
                <Zap className="w-3 h-3 fill-amber-400" />
                <span>⚡ Skip 30s (Fast Test)</span>
              </button>
            </div>
          </div>
        ) : (
          /* ================= CELEBRATION REWARD SCREEN ================= */
          <div className="flex flex-col items-center text-center gap-4 py-3 relative z-10 animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-purple-500 via-amber-400 to-yellow-300 p-1 shadow-2xl shadow-purple-500/40 animate-bounce">
              <div className="w-full h-full bg-slate-950 rounded-[20px] flex items-center justify-center text-3xl">
                💎
              </div>
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold mb-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>2 Ads Completed Successfully!</span>
              </div>
              <h3 className="font-display font-black text-2xl sm:text-3xl text-white">
                10 Diamonds & Rank Pushed!
              </h3>
              <p className="text-xs sm:text-sm text-purple-300 mt-1">
                आपके खाते में 10 डायमंड्स जोड़ दिए गए हैं और रैंक बूस्ट हो गई है!
              </p>
            </div>

            {/* Reward Summary Cards */}
            <div className="w-full grid grid-cols-2 gap-3 my-2">
              <div className="p-3 rounded-2xl bg-slate-950/80 border border-amber-500/40 flex flex-col items-center gap-1">
                <Gem className="w-6 h-6 text-amber-400 fill-amber-400" />
                <span className="font-display font-black text-xl text-amber-300">+10 💎</span>
                <span className="text-[11px] text-slate-400 font-medium">Diamonds Added</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950/80 border border-purple-500/40 flex flex-col items-center gap-1">
                <TrendingUp className="w-6 h-6 text-purple-400" />
                <span className="font-display font-black text-xl text-purple-300">+60 RP</span>
                <span className="text-[11px] text-slate-400 font-medium">Rank Pushed 🚀</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="w-full flex flex-col gap-2 pt-2">
              <button
                onClick={handleClaimAndReplay}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-amber-500 to-yellow-400 hover:from-purple-500 hover:to-yellow-300 text-slate-950 font-display font-black text-sm shadow-xl shadow-amber-500/30 transition-transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Replay Match Now (नया मैच खेलें)</span>
              </button>

              <button
                onClick={onClose}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors cursor-pointer"
              >
                Back to Lobby
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
