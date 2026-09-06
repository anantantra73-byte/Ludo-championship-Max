import React from 'react';
import { DiceSkin, PlayerColor } from '../types';
import { motion } from 'motion/react';
import { Sparkles, Dices, Wand2 } from 'lucide-react';

interface DiceRollerProps {
  currentValue: number;
  secondValue?: number | null; // For extra dice power-up
  isRolling: boolean;
  canRoll: boolean;
  playerColor: PlayerColor;
  playerName: string;
  diceSkin: DiceSkin;
  isDoubleDiceActive?: boolean;
  isDiceControlActive?: boolean;
  consecutiveSixes: number;
  turnTimeRemaining: number;
  maxTurnTime: number;
  onRoll: () => void;
  onSelectExactDice?: (val: number) => void;
}

export const DiceRoller: React.FC<DiceRollerProps> = ({
  currentValue,
  secondValue,
  isRolling,
  canRoll,
  playerColor,
  playerName,
  diceSkin,
  isDoubleDiceActive = false,
  isDiceControlActive = false,
  consecutiveSixes,
  turnTimeRemaining,
  maxTurnTime,
  onRoll,
  onSelectExactDice,
}) => {
  // Dot pattern coordinates on a 3x3 grid for values 1 to 6
  const getDotPositions = (val: number) => {
    switch (val) {
      case 1:
        return [4]; // center
      case 2:
        return [0, 8]; // top-left, bottom-right
      case 3:
        return [0, 4, 8]; // top-left, center, bottom-right
      case 4:
        return [0, 2, 6, 8]; // four corners
      case 5:
        return [0, 2, 4, 6, 8]; // four corners + center
      case 6:
      default:
        return [0, 2, 3, 5, 6, 8]; // two columns of three
    }
  };

  // Dice skin styles
  const getSkinStyles = () => {
    switch (diceSkin) {
      case 'cyber':
        return {
          bg: 'bg-gradient-to-br from-slate-900 via-cyan-950 to-purple-950 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.5)]',
          dot: 'bg-cyan-300 shadow-[0_0_8px_#22d3ee]',
          text: 'text-cyan-300',
        };
      case 'gold':
        return {
          bg: 'bg-gradient-to-br from-amber-200 via-yellow-400 to-amber-600 border-yellow-100 shadow-[0_0_20px_rgba(245,158,11,0.6)]',
          dot: 'bg-amber-950 shadow-sm',
          text: 'text-amber-950',
        };
      case 'obsidian':
        return {
          bg: 'bg-gradient-to-br from-zinc-950 via-red-950 to-black border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.4)]',
          dot: 'bg-red-500 shadow-[0_0_8px_#ef4444]',
          text: 'text-red-400',
        };
      case 'cosmic':
        return {
          bg: 'bg-gradient-to-br from-indigo-950 via-purple-900 to-slate-950 border-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.5)]',
          dot: 'bg-amber-300 shadow-[0_0_8px_#fde047]',
          text: 'text-indigo-200',
        };
      case 'wooden':
        return {
          bg: 'bg-gradient-to-br from-amber-800 via-amber-900 to-stone-900 border-amber-600 shadow-md',
          dot: 'bg-amber-100 shadow-inner',
          text: 'text-amber-100',
        };
      case 'ivory':
      default:
        return {
          bg: 'bg-gradient-to-br from-slate-100 via-slate-200 to-slate-300 border-white shadow-xl',
          dot: 'bg-slate-900 shadow-sm',
          text: 'text-slate-900',
        };
    }
  };

  const skin = getSkinStyles();

  // Render a single die face
  const renderDie = (val: number, isSecond = false) => {
    const dots = getDotPositions(val);

    return (
      <motion.div
        animate={
          isRolling
            ? {
                rotateX: [0, 360, 720, 1080],
                rotateY: [0, 180, 540, 720],
                rotateZ: [0, 90, 270, 360],
                scale: [1, 1.25, 0.9, 1],
              }
            : {
                rotateX: 0,
                rotateY: 0,
                rotateZ: 0,
                scale: 1,
              }
        }
        transition={{
          duration: 0.65,
          ease: 'easeInOut',
        }}
        className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl border-2 ${skin.bg} p-2.5 grid grid-cols-3 grid-rows-3 gap-1 shadow-2xl relative select-none transform-gpu`}
      >
        {Array.from({ length: 9 }).map((_, idx) => {
          const hasDot = dots.includes(idx);
          return (
            <div key={idx} className="flex items-center justify-center">
              {hasDot && (
                <div
                  className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full ${skin.dot} transition-transform`}
                />
              )}
            </div>
          );
        })}

        {val === 6 && !isRolling && (
          <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-500 text-[9px] font-black text-black items-center justify-center">
              +1
            </span>
          </span>
        )}
      </motion.div>
    );
  };

  // Turn time percentage
  const timeFraction = Math.max(0, turnTimeRemaining / maxTurnTime);

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Turn timer bar */}
      <div className="w-36 sm:w-44 h-1.5 bg-slate-800 rounded-full overflow-hidden shadow-inner">
        <div
          className={`h-full transition-all duration-200 ${
            timeFraction > 0.4 ? 'bg-emerald-400' : timeFraction > 0.2 ? 'bg-amber-400' : 'bg-rose-500 animate-pulse'
          }`}
          style={{ width: `${timeFraction * 100}%` }}
        />
      </div>

      {/* Dice Control Picker (if power-up active) */}
      {isDiceControlActive && onSelectExactDice && (
        <div className="flex items-center gap-1.5 bg-purple-950/90 border border-purple-500/50 px-3 py-1.5 rounded-xl shadow-lg animate-bounce">
          <Wand2 className="w-3.5 h-3.5 text-purple-300" />
          <span className="text-[11px] font-bold text-purple-200 mr-1">Select Roll:</span>
          {[1, 2, 3, 4, 5, 6].map((num) => (
            <button
              key={num}
              onClick={() => onSelectExactDice(num)}
              className="w-6 h-6 rounded-lg bg-purple-800/80 hover:bg-purple-600 text-white text-xs font-black border border-purple-400/60 shadow-sm transition-transform active:scale-90 cursor-pointer"
            >
              {num}
            </button>
          ))}
        </div>
      )}

      {/* Dice Display and Roll trigger */}
      <div className="flex items-center gap-3">
        <button
          disabled={!canRoll || isRolling}
          onClick={onRoll}
          className={`relative group p-1.5 rounded-2xl transition-all focus:outline-none ${
            canRoll && !isRolling
              ? 'cursor-pointer hover:scale-105 active:scale-95'
              : 'opacity-90 cursor-default'
          }`}
        >
          {/* Animated Glow when canRoll */}
          {canRoll && !isRolling && (
            <div className="absolute -inset-2 rounded-2xl bg-amber-400/20 blur-md group-hover:bg-amber-400/35 transition-all animate-pulse" />
          )}

          <div className="flex items-center gap-2 relative">
            {renderDie(currentValue)}
            {isDoubleDiceActive && secondValue && renderDie(secondValue, true)}
          </div>
        </button>
      </div>

      {/* Status & consecutive 6 alert */}
      <div className="text-center">
        {consecutiveSixes === 2 && (
          <div className="text-[11px] font-black text-rose-400 animate-pulse">
            ⚠️ Warning: 3rd Six will forfeit turn!
          </div>
        )}
        {canRoll && !isRolling && (
          <span className="text-xs font-bold text-amber-300 animate-bounce tracking-wide inline-flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            Tap Dice to Roll!
          </span>
        )}
      </div>
    </div>
  );
};
