import React, { useState } from 'react';
import { Sparkles, X, Coins, Gem, Shield, Dices } from 'lucide-react';
import { sound } from '../utils/audio';

interface DailySpinModalProps {
  onRewardClaimed: (type: 'coins' | 'gems' | 'powerup', amount: number, powerUpType?: string) => void;
  onClose: () => void;
}

const WHEEL_SEGMENTS = [
  { label: '500 Coins', type: 'coins', amount: 500, color: '#f59e0b', icon: '🪙' },
  { label: '20 Gems', type: 'gems', amount: 20, color: '#10b981', icon: '💎' },
  { label: '1,000 Coins', type: 'coins', amount: 1000, color: '#eab308', icon: '🪙' },
  { label: '2x Shield', type: 'powerup', amount: 2, powerUpType: 'shield', color: '#06b6d4', icon: '🛡️' },
  { label: '2,500 Coins', type: 'coins', amount: 2500, color: '#f97316', icon: '💰' },
  { label: '35 Gems', type: 'gems', amount: 35, color: '#059669', icon: '💎' },
  { label: '2x Extra Dice', type: 'powerup', amount: 2, powerUpType: 'extra_dice', color: '#8b5cf6', icon: '🎲' },
  { label: 'JACKPOT 5K', type: 'coins', amount: 5000, color: '#ec4899', icon: '👑' },
];

export const DailySpinModal: React.FC<DailySpinModalProps> = ({ onRewardClaimed, onClose }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [wonSegment, setWonSegment] = useState<typeof WHEEL_SEGMENTS[0] | null>(null);

  const handleSpin = () => {
    if (isSpinning) return;
    sound.playDiceRoll();
    setIsSpinning(true);
    setWonSegment(null);

    // Pick random segment
    const targetIdx = Math.floor(Math.random() * WHEEL_SEGMENTS.length);
    const segmentAngle = 360 / WHEEL_SEGMENTS.length;
    // Extra 5 full rotations + segment center
    const totalRotation = rotation + 1800 + (360 - targetIdx * segmentAngle - segmentAngle / 2);

    setRotation(totalRotation);

    setTimeout(() => {
      sound.playPowerUp();
      setIsSpinning(false);
      const selected = WHEEL_SEGMENTS[targetIdx];
      setWonSegment(selected);
      onRewardClaimed(selected.type as any, selected.amount, selected.powerUpType);
    }, 3800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in">
      <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative flex flex-col items-center text-center">
        {/* Close Button */}
        <button
          disabled={isSpinning}
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-black uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          Lucky Prize Wheel
        </div>
        <h3 className="font-display font-black text-xl text-white">Daily Streak Spin</h3>
        <p className="text-xs text-slate-400 mt-0.5 mb-4">Spin to win coins, gems & power-ups!</p>

        {/* Wheel Container */}
        <div className="relative w-64 h-64 my-2 flex items-center justify-center">
          {/* Top Pointer arrow */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[18px] border-t-amber-400 drop-shadow-md" />

          {/* Rotating Wheel Disk */}
          <div
            className="w-full h-full rounded-full border-4 border-amber-400/80 shadow-2xl overflow-hidden relative"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: isSpinning ? 'transform 3.8s cubic-bezier(0.15, 0.9, 0.2, 1)' : 'none',
            }}
          >
            {/* SVG Wheel slices */}
            <svg className="w-full h-full" viewBox="0 0 100 100">
              {WHEEL_SEGMENTS.map((seg, idx) => {
                const angle = 360 / WHEEL_SEGMENTS.length;
                const startAngle = (idx * angle * Math.PI) / 180;
                const endAngle = (((idx + 1) * angle) * Math.PI) / 180;

                const x1 = 50 + 50 * Math.cos(startAngle);
                const y1 = 50 + 50 * Math.sin(startAngle);
                const x2 = 50 + 50 * Math.cos(endAngle);
                const y2 = 50 + 50 * Math.sin(endAngle);

                const pathData = `M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`;

                return (
                  <path
                    key={idx}
                    d={pathData}
                    fill={seg.color}
                    stroke="#0f172a"
                    strokeWidth="0.8"
                  />
                );
              })}
            </svg>

            {/* Icons over each segment */}
            {WHEEL_SEGMENTS.map((seg, idx) => {
              const angle = (idx * 360) / WHEEL_SEGMENTS.length + 360 / (2 * WHEEL_SEGMENTS.length);
              return (
                <div
                  key={idx}
                  className="absolute inset-0 flex items-start justify-center pointer-events-none pt-2.5 font-bold text-[10px] text-slate-950 select-none"
                  style={{
                    transform: `rotate(${angle + 90}deg)`,
                  }}
                >
                  <span className="transform -rotate-90 text-sm">{seg.icon}</span>
                </div>
              );
            })}
          </div>

          {/* Center Hub Button */}
          <button
            disabled={isSpinning}
            onClick={handleSpin}
            className="absolute z-30 w-14 h-14 rounded-full bg-slate-950 border-2 border-amber-400 text-amber-300 font-display font-black text-xs shadow-xl flex items-center justify-center cursor-pointer active:scale-95 hover:bg-slate-900"
          >
            {isSpinning ? '...' : 'SPIN'}
          </button>
        </div>

        {/* Won Banner */}
        {wonSegment && (
          <div className="mt-4 p-3 rounded-2xl bg-amber-950/50 border border-amber-400 w-full animate-bounce">
            <span className="text-xs font-bold text-amber-200">Congratulations! You won:</span>
            <div className="font-display font-black text-lg text-amber-400 flex items-center justify-center gap-1.5 mt-0.5">
              <span>{wonSegment.icon}</span>
              <span>{wonSegment.label}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
