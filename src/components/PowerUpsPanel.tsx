import React from 'react';
import { PowerUpType } from '../types';
import { Shield, Dices, Wand2, Compass, Zap } from 'lucide-react';
import { sound } from '../utils/audio';

interface PowerUpsPanelProps {
  availablePowerUps: Record<PowerUpType, number>;
  activePowerUp: PowerUpType | null;
  canUsePowerUp: boolean;
  onActivatePowerUp: (type: PowerUpType) => void;
}

export const POWER_UP_CONFIG: Record<
  PowerUpType,
  { name: string; desc: string; icon: React.ReactNode; color: string; border: string }
> = {
  shield: {
    name: 'Shield',
    desc: 'Immune to opponent captures for 1 round',
    icon: <Shield className="w-3.5 h-3.5" />,
    color: 'from-cyan-600 to-blue-700',
    border: 'border-cyan-400/50',
  },
  extra_dice: {
    name: 'Extra Dice',
    desc: 'Roll two dice simultaneously',
    icon: <Dices className="w-3.5 h-3.5" />,
    color: 'from-amber-500 to-orange-600',
    border: 'border-amber-400/50',
  },
  dice_control: {
    name: 'Dice Control',
    desc: 'Pick your exact roll value (1 to 6)',
    icon: <Wand2 className="w-3.5 h-3.5" />,
    color: 'from-purple-600 to-pink-600',
    border: 'border-purple-400/50',
  },
  teleport: {
    name: 'Teleport',
    desc: 'Warp token 6 squares forward instantly',
    icon: <Compass className="w-3.5 h-3.5" />,
    color: 'from-emerald-500 to-teal-700',
    border: 'border-emerald-400/50',
  },
  token_boost: {
    name: 'Token Boost',
    desc: '+3 bonus steps added to your next move',
    icon: <Zap className="w-3.5 h-3.5" />,
    color: 'from-rose-500 to-red-700',
    border: 'border-rose-400/50',
  },
};

export const PowerUpsPanel: React.FC<PowerUpsPanelProps> = ({
  availablePowerUps,
  activePowerUp,
  canUsePowerUp,
  onActivatePowerUp,
}) => {
  return (
    <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-800 shadow-xl overflow-x-auto max-w-full">
      <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 pl-1 pr-1 hidden sm:inline">
        ⚡ Power-Ups
      </span>

      {(Object.keys(POWER_UP_CONFIG) as PowerUpType[]).map((type) => {
        const config = POWER_UP_CONFIG[type];
        const count = availablePowerUps[type] || 0;
        const isActive = activePowerUp === type;
        const disabled = !canUsePowerUp || count <= 0;

        return (
          <button
            key={type}
            disabled={disabled}
            onClick={() => {
              sound.playPowerUp();
              onActivatePowerUp(type);
            }}
            title={`${config.name}: ${config.desc} (${count} left)`}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all relative select-none whitespace-nowrap cursor-pointer ${
              isActive
                ? `bg-gradient-to-r ${config.color} text-white ${config.border} shadow-lg shadow-purple-500/30 scale-105 ring-2 ring-white/50`
                : disabled
                ? 'bg-slate-950/60 border-slate-800/80 text-slate-500 opacity-60 cursor-not-allowed'
                : `bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 ${config.border} hover:scale-105 active:scale-95`
            }`}
          >
            <div
              className={`p-1 rounded-lg ${
                isActive ? 'bg-white/20' : 'bg-slate-950/60'
              }`}
            >
              {config.icon}
            </div>
            <span className="hidden md:inline text-[11px] font-bold">{config.name}</span>
            <span
              className={`text-[10px] px-1 py-0.2 rounded-full font-black ${
                count > 0 ? 'bg-amber-500 text-black' : 'bg-slate-700 text-slate-400'
              }`}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
};
