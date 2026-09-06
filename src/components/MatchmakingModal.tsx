import React, { useEffect, useState } from 'react';
import { Globe, Users, X, Check } from 'lucide-react';
import { sound } from '../utils/audio';

interface MatchmakingModalProps {
  playerCount: number;
  onMatchFound: () => void;
  onCancel: () => void;
}

export const MatchmakingModal: React.FC<MatchmakingModalProps> = ({
  playerCount,
  onMatchFound,
  onCancel,
}) => {
  const [foundCount, setFoundCount] = useState(1);
  const [countdown, setCountdown] = useState<number | null>(null);

  const matchedNames = ['You (Host)', 'Elena_V (Lvl 12)', 'Marcus_Prime (Lvl 15)', 'Aarav (Lvl 20)'];

  useEffect(() => {
    const timer1 = setTimeout(() => {
      sound.playTokenStep();
      setFoundCount(2);
    }, 1200);

    const timer2 = setTimeout(() => {
      sound.playTokenStep();
      setFoundCount(3);
    }, 2200);

    const timer3 = setTimeout(() => {
      sound.playTokenStep();
      setFoundCount(playerCount);
      setCountdown(3);
    }, 3200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [playerCount]);

  useEffect(() => {
    if (countdown === null) return;
    if (countdown > 0) {
      const cdTimer = setTimeout(() => {
        sound.playClick();
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(cdTimer);
    } else {
      sound.playPowerUp();
      onMatchFound();
    }
  }, [countdown, onMatchFound]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 animate-in fade-in">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative flex flex-col items-center text-center">
        <button
          onClick={() => {
            sound.playClick();
            onCancel();
          }}
          className="absolute top-4 right-4 p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Animated Radar */}
        <div className="relative w-36 h-36 my-4 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border border-sky-500/30 animate-ping" style={{ animationDuration: '2s' }} />
          <div className="absolute inset-4 rounded-full border border-sky-500/50 animate-ping" style={{ animationDuration: '2.5s', animationDelay: '0.4s' }} />
          <div className="w-20 h-20 rounded-full bg-sky-950/80 border-2 border-sky-400 flex items-center justify-center shadow-lg shadow-sky-500/30">
            <Globe className="w-9 h-9 text-sky-400 animate-pulse" />
          </div>
        </div>

        <h3 className="font-display font-black text-xl text-white">
          {countdown !== null ? `Match Starting in ${countdown}...` : 'Searching for Opponents...'}
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          Matched {foundCount} of {playerCount} players globally
        </p>

        {/* Matched player cards */}
        <div className="w-full grid grid-cols-2 gap-2 mt-5">
          {Array.from({ length: playerCount }).map((_, idx) => {
            const isFilled = idx < foundCount;
            return (
              <div
                key={idx}
                className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 ${
                  isFilled
                    ? 'bg-sky-950/40 border-sky-500/40 text-sky-200'
                    : 'bg-slate-950/50 border-slate-800 text-slate-500'
                }`}
              >
                <div className={`w-2 h-2 rounded-full ${isFilled ? 'bg-sky-400' : 'bg-slate-700'}`} />
                <span className="truncate">{isFilled ? matchedNames[idx] : 'Connecting...'}</span>
              </div>
            );
          })}
        </div>

        {countdown === null && (
          <button
            onClick={() => {
              sound.playClick();
              onCancel();
            }}
            className="mt-6 px-6 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer"
          >
            Cancel Matchmaking
          </button>
        )}
      </div>
    </div>
  );
};
