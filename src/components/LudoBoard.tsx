import React from 'react';
import { Player, PlayerColor, Token, BoardTheme, TokenSkin } from '../types';
import { getTokenCoordinate, getGlobalTrackIndex, isSafeZone, BoardCoord } from '../utils/ludoBoardCoordinates';
import { Shield, Sparkles, Star } from 'lucide-react';
import { motion } from 'motion/react';

interface LudoBoardProps {
  players: Player[];
  activePlayerColor: PlayerColor;
  movableTokens: Token[];
  boardTheme: BoardTheme;
  tokenSkin: TokenSkin;
  onTokenClick: (token: Token) => void;
}

export const LudoBoard: React.FC<LudoBoardProps> = ({
  players,
  activePlayerColor,
  movableTokens,
  boardTheme,
  tokenSkin,
  onTokenClick,
}) => {
  // Theme color definitions
  const getThemeStyles = () => {
    switch (boardTheme) {
      case 'cyberpunk':
        return {
          boardBg: 'bg-slate-950 border-cyan-500/40 shadow-[0_0_40px_rgba(6,182,212,0.15)]',
          gridBorder: 'border-cyan-900/40',
          trackCell: 'bg-slate-900/90 text-cyan-400',
          redYard: 'from-rose-950 via-rose-900 to-black border-rose-500/50',
          greenYard: 'from-emerald-950 via-emerald-900 to-black border-emerald-500/50',
          yellowYard: 'from-amber-950 via-amber-900 to-black border-amber-500/50',
          blueYard: 'from-blue-950 via-blue-900 to-black border-blue-500/50',
          redColor: '#f43f5e',
          greenColor: '#10b981',
          yellowColor: '#f59e0b',
          blueColor: '#0ea5e9',
          starColor: 'text-cyan-300 fill-cyan-300',
        };
      case 'royal':
        return {
          boardBg: 'bg-slate-900 border-amber-500/40 shadow-[0_0_35px_rgba(245,158,11,0.2)]',
          gridBorder: 'border-amber-950/40',
          trackCell: 'bg-slate-800/90 text-amber-200',
          redYard: 'from-red-950 via-red-900 to-slate-950 border-amber-500/40',
          greenYard: 'from-emerald-950 via-emerald-900 to-slate-950 border-amber-500/40',
          yellowYard: 'from-amber-950 via-amber-900 to-slate-950 border-amber-500/40',
          blueYard: 'from-sky-950 via-sky-900 to-slate-950 border-amber-500/40',
          redColor: '#dc2626',
          greenColor: '#059669',
          yellowColor: '#d97706',
          blueColor: '#0284c7',
          starColor: 'text-amber-400 fill-amber-400',
        };
      case 'mystic':
        return {
          boardBg: 'bg-zinc-950 border-purple-500/30 shadow-[0_0_30px_rgba(168,85,247,0.15)]',
          gridBorder: 'border-purple-950/40',
          trackCell: 'bg-zinc-900 text-purple-200',
          redYard: 'from-rose-950 via-zinc-900 to-black border-purple-500/30',
          greenYard: 'from-teal-950 via-zinc-900 to-black border-purple-500/30',
          yellowYard: 'from-yellow-950 via-zinc-900 to-black border-purple-500/30',
          blueYard: 'from-indigo-950 via-zinc-900 to-black border-purple-500/30',
          redColor: '#e11d48',
          greenColor: '#0d9488',
          yellowColor: '#ca8a04',
          blueColor: '#4f46e5',
          starColor: 'text-purple-400 fill-purple-400',
        };
      case 'cosmic':
        return {
          boardBg: 'bg-[#060814] border-indigo-500/40 shadow-[0_0_40px_rgba(99,102,241,0.2)]',
          gridBorder: 'border-indigo-950/60',
          trackCell: 'bg-slate-900/90 text-indigo-200',
          redYard: 'from-red-950 via-slate-900 to-[#060814] border-indigo-500/30',
          greenYard: 'from-emerald-950 via-slate-900 to-[#060814] border-indigo-500/30',
          yellowYard: 'from-amber-950 via-slate-900 to-[#060814] border-indigo-500/30',
          blueYard: 'from-blue-950 via-slate-900 to-[#060814] border-indigo-500/30',
          redColor: '#ef4444',
          greenColor: '#10b981',
          yellowColor: '#f59e0b',
          blueColor: '#3b82f6',
          starColor: 'text-yellow-300 fill-yellow-300',
        };
      case 'classic':
      default:
        return {
          boardBg: 'bg-slate-900 border-slate-700 shadow-2xl',
          gridBorder: 'border-slate-800',
          trackCell: 'bg-slate-800/95 text-slate-300',
          redYard: 'from-red-900/90 via-red-800/80 to-slate-900 border-red-500/40',
          greenYard: 'from-emerald-900/90 via-emerald-800/80 to-slate-900 border-emerald-500/40',
          yellowYard: 'from-amber-900/90 via-amber-800/80 to-slate-900 border-amber-500/40',
          blueYard: 'from-blue-900/90 via-blue-800/80 to-slate-900 border-blue-500/40',
          redColor: '#ef4444',
          greenColor: '#22c55e',
          yellowColor: '#eab308',
          blueColor: '#3b82f6',
          starColor: 'text-amber-400 fill-amber-400',
        };
    }
  };

  const theme = getThemeStyles();

  // Helper to test if a grid cell (x, y) is a safe star
  const getSafeStarAt = (x: number, y: number): boolean => {
    // Check 8 safe cells:
    // Red start: (1, 6)
    // Red 8th: (6, 2)
    // Green start: (8, 1)
    // Green 8th: (12, 6)
    // Yellow start: (13, 8)
    // Yellow 8th: (8, 12)
    // Blue start: (6, 13)
    // Blue 8th: (2, 8)
    const starCoords = [
      { x: 1, y: 6 },
      { x: 6, y: 2 },
      { x: 8, y: 1 },
      { x: 12, y: 6 },
      { x: 13, y: 8 },
      { x: 8, y: 12 },
      { x: 6, y: 13 },
      { x: 2, y: 8 },
    ];
    return starCoords.some(c => c.x === x && c.y === y);
  };

  // Helper for cell styling
  const getCellDetails = (x: number, y: number) => {
    // 1. Yards (handled separately)
    if (x < 6 && y < 6) return null; // Red Yard
    if (x > 8 && y < 6) return null; // Green Yard
    if (x > 8 && y > 8) return null; // Yellow Yard
    if (x < 6 && y > 8) return null; // Blue Yard
    // 2. Center Triangle (handled separately)
    if (x >= 6 && x <= 8 && y >= 6 && y <= 8) return null;

    // Home paths
    // Red home path: row 7, cols 1..5
    if (y === 7 && x >= 1 && x <= 5) {
      return { bg: theme.redColor, isPath: true, color: 'red' };
    }
    // Green home path: col 7, rows 1..5
    if (x === 7 && y >= 1 && y <= 5) {
      return { bg: theme.greenColor, isPath: true, color: 'green' };
    }
    // Yellow home path: row 7, cols 9..13
    if (y === 7 && x >= 9 && x <= 13) {
      return { bg: theme.yellowColor, isPath: true, color: 'yellow' };
    }
    // Blue home path: col 7, rows 9..13
    if (x === 7 && y >= 9 && y <= 13) {
      return { bg: theme.blueColor, isPath: true, color: 'blue' };
    }

    // Start cells
    if (x === 1 && y === 6) return { bg: theme.redColor, isStart: true, color: 'red' };
    if (x === 8 && y === 1) return { bg: theme.greenColor, isStart: true, color: 'green' };
    if (x === 13 && y === 8) return { bg: theme.yellowColor, isStart: true, color: 'yellow' };
    if (x === 6 && y === 13) return { bg: theme.blueColor, isStart: true, color: 'blue' };

    return { bg: 'transparent', isRegular: true };
  };

  // Group tokens currently on the board by their coordinates for stacking offsets
  const tokenCoordinateGroups = new Map<string, { token: Token; player: Player; coord: BoardCoord }[]>();

  players.forEach((player) => {
    player.tokens.forEach((token) => {
      const coord = getTokenCoordinate(token.color, token.step, token.id);
      // Key by rounded cell coordinate
      const key = `${Math.round(coord.x * 10) / 10}_${Math.round(coord.y * 10) / 10}`;
      if (!tokenCoordinateGroups.has(key)) {
        tokenCoordinateGroups.set(key, []);
      }
      tokenCoordinateGroups.get(key)!.push({ token, player, coord });
    });
  });

  return (
    <div className="relative w-full max-w-[540px] sm:max-w-[580px] lg:max-w-[620px] aspect-square mx-auto select-none p-2 sm:p-3">
      {/* Board Outer Container */}
      <div 
        className={`w-full h-full rounded-2xl border-4 ${theme.boardBg} p-2 relative shadow-2xl flex flex-col justify-between overflow-hidden`}
        style={{
          boxShadow: '0 20px 50px rgba(0,0,0,0.6), inset 0 0 20px rgba(255,255,255,0.03)'
        }}
      >
        {/* The 15x15 CSS Grid */}
        <div className="w-full h-full grid grid-cols-15 grid-rows-15 relative border border-slate-700/50 rounded-xl overflow-hidden bg-slate-950/70">
          {/* Top-Left: Red Yard (6x6) */}
          <div className={`col-span-6 row-span-6 bg-gradient-to-br ${theme.redYard} border-r-2 border-b-2 ${theme.gridBorder} p-3 sm:p-4 flex items-center justify-center relative`}>
            <div className="w-full h-full bg-slate-950/80 rounded-2xl border border-red-500/40 p-2 sm:p-3 shadow-inner grid grid-cols-2 grid-rows-2 gap-2 sm:gap-3">
              {[0, 1, 2, 3].map((idx) => (
                <div 
                  key={idx} 
                  className="rounded-full bg-red-950/60 border-2 border-red-500/50 shadow-inner flex items-center justify-center relative"
                >
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/30" />
                </div>
              ))}
            </div>
            <span className="absolute bottom-1 right-2 text-[10px] font-black tracking-widest text-red-400/80 uppercase">RED</span>
          </div>

          {/* Top Arm: Green / Circuit (3 cols x 6 rows: cols 7,8,9, rows 1..6) */}
          <div className="col-span-3 row-span-6 grid grid-cols-3 grid-rows-6 border-b-2 border-slate-700/50">
            {Array.from({ length: 18 }).map((_, i) => {
              const row = Math.floor(i / 3);
              const col = i % 3;
              const gridX = 6 + col;
              const gridY = row;
              const details = getCellDetails(gridX, gridY);
              const hasStar = getSafeStarAt(gridX, gridY);

              return (
                <div
                  key={`top-arm-${i}`}
                  className={`border border-slate-800/70 flex items-center justify-center relative ${
                    details?.bg !== 'transparent' ? '' : theme.trackCell
                  }`}
                  style={{
                    backgroundColor: details?.bg !== 'transparent' ? details?.bg : undefined,
                  }}
                >
                  {hasStar && (
                    <Star className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${theme.starColor} animate-pulse drop-shadow-md`} />
                  )}
                  {details?.isStart && !hasStar && (
                    <div className="w-2 h-2 rounded-full bg-white/60" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Top-Right: Green Yard (6x6) */}
          <div className={`col-span-6 row-span-6 bg-gradient-to-bl ${theme.greenYard} border-l-2 border-b-2 ${theme.gridBorder} p-3 sm:p-4 flex items-center justify-center relative`}>
            <div className="w-full h-full bg-slate-950/80 rounded-2xl border border-emerald-500/40 p-2 sm:p-3 shadow-inner grid grid-cols-2 grid-rows-2 gap-2 sm:gap-3">
              {[0, 1, 2, 3].map((idx) => (
                <div 
                  key={idx} 
                  className="rounded-full bg-emerald-950/60 border-2 border-emerald-500/50 shadow-inner flex items-center justify-center relative"
                >
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/30" />
                </div>
              ))}
            </div>
            <span className="absolute bottom-1 left-2 text-[10px] font-black tracking-widest text-emerald-400/80 uppercase">GREEN</span>
          </div>

          {/* Left Arm (6 cols x 3 rows: cols 1..6, rows 7..9) */}
          <div className="col-span-6 row-span-3 grid grid-cols-6 grid-rows-3 border-r-2 border-slate-700/50">
            {Array.from({ length: 18 }).map((_, i) => {
              const row = Math.floor(i / 6);
              const col = i % 6;
              const gridX = col;
              const gridY = 6 + row;
              const details = getCellDetails(gridX, gridY);
              const hasStar = getSafeStarAt(gridX, gridY);

              return (
                <div
                  key={`left-arm-${i}`}
                  className={`border border-slate-800/70 flex items-center justify-center relative ${
                    details?.bg !== 'transparent' ? '' : theme.trackCell
                  }`}
                  style={{
                    backgroundColor: details?.bg !== 'transparent' ? details?.bg : undefined,
                  }}
                >
                  {hasStar && (
                    <Star className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${theme.starColor} animate-pulse drop-shadow-md`} />
                  )}
                  {details?.isStart && !hasStar && (
                    <div className="w-2 h-2 rounded-full bg-white/60" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Center 3x3 Home Triangle */}
          <div className="col-span-3 row-span-3 relative border-2 border-slate-700/60 bg-slate-950 overflow-hidden shadow-2xl">
            {/* SVG Triangle Segments */}
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              {/* Red Left Triangle */}
              <polygon points="0,0 50,50 0,100" fill={theme.redColor} opacity="0.9" />
              {/* Green Top Triangle */}
              <polygon points="0,0 100,0 50,50" fill={theme.greenColor} opacity="0.9" />
              {/* Yellow Right Triangle */}
              <polygon points="100,0 100,100 50,50" fill={theme.yellowColor} opacity="0.9" />
              {/* Blue Bottom Triangle */}
              <polygon points="0,100 100,100 50,50" fill={theme.blueColor} opacity="0.9" />
              {/* Center emblem circle */}
              <circle cx="50" cy="50" r="15" fill="#0f172a" stroke="#f59e0b" strokeWidth="2" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden shadow-lg ring-1.5 ring-amber-400/80 bg-slate-950">
                <img 
                  src="/logo.png" 
                  alt="Ludo King" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer" 
                />
              </div>
            </div>
          </div>

          {/* Right Arm (6 cols x 3 rows: cols 10..15, rows 7..9) */}
          <div className="col-span-6 row-span-3 grid grid-cols-6 grid-rows-3 border-l-2 border-slate-700/50">
            {Array.from({ length: 18 }).map((_, i) => {
              const row = Math.floor(i / 6);
              const col = i % 6;
              const gridX = 9 + col;
              const gridY = 6 + row;
              const details = getCellDetails(gridX, gridY);
              const hasStar = getSafeStarAt(gridX, gridY);

              return (
                <div
                  key={`right-arm-${i}`}
                  className={`border border-slate-800/70 flex items-center justify-center relative ${
                    details?.bg !== 'transparent' ? '' : theme.trackCell
                  }`}
                  style={{
                    backgroundColor: details?.bg !== 'transparent' ? details?.bg : undefined,
                  }}
                >
                  {hasStar && (
                    <Star className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${theme.starColor} animate-pulse drop-shadow-md`} />
                  )}
                  {details?.isStart && !hasStar && (
                    <div className="w-2 h-2 rounded-full bg-white/60" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Bottom-Left: Blue Yard (6x6) */}
          <div className={`col-span-6 row-span-6 bg-gradient-to-tr ${theme.blueYard} border-r-2 border-t-2 ${theme.gridBorder} p-3 sm:p-4 flex items-center justify-center relative`}>
            <div className="w-full h-full bg-slate-950/80 rounded-2xl border border-sky-500/40 p-2 sm:p-3 shadow-inner grid grid-cols-2 grid-rows-2 gap-2 sm:gap-3">
              {[0, 1, 2, 3].map((idx) => (
                <div 
                  key={idx} 
                  className="rounded-full bg-blue-950/60 border-2 border-sky-500/50 shadow-inner flex items-center justify-center relative"
                >
                  <div className="w-2.5 h-2.5 rounded-full bg-sky-500/30" />
                </div>
              ))}
            </div>
            <span className="absolute top-1 right-2 text-[10px] font-black tracking-widest text-sky-400/80 uppercase">BLUE</span>
          </div>

          {/* Bottom Arm (3 cols x 6 rows: cols 7..9, rows 10..15) */}
          <div className="col-span-3 row-span-6 grid grid-cols-3 grid-rows-6 border-t-2 border-slate-700/50">
            {Array.from({ length: 18 }).map((_, i) => {
              const row = Math.floor(i / 3);
              const col = i % 3;
              const gridX = 6 + col;
              const gridY = 9 + row;
              const details = getCellDetails(gridX, gridY);
              const hasStar = getSafeStarAt(gridX, gridY);

              return (
                <div
                  key={`bottom-arm-${i}`}
                  className={`border border-slate-800/70 flex items-center justify-center relative ${
                    details?.bg !== 'transparent' ? '' : theme.trackCell
                  }`}
                  style={{
                    backgroundColor: details?.bg !== 'transparent' ? details?.bg : undefined,
                  }}
                >
                  {hasStar && (
                    <Star className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${theme.starColor} animate-pulse drop-shadow-md`} />
                  )}
                  {details?.isStart && !hasStar && (
                    <div className="w-2 h-2 rounded-full bg-white/60" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Bottom-Right: Yellow Yard (6x6) */}
          <div className={`col-span-6 row-span-6 bg-gradient-to-tl ${theme.yellowYard} border-l-2 border-t-2 ${theme.gridBorder} p-3 sm:p-4 flex items-center justify-center relative`}>
            <div className="w-full h-full bg-slate-950/80 rounded-2xl border border-amber-500/40 p-2 sm:p-3 shadow-inner grid grid-cols-2 grid-rows-2 gap-2 sm:gap-3">
              {[0, 1, 2, 3].map((idx) => (
                <div 
                  key={idx} 
                  className="rounded-full bg-amber-950/60 border-2 border-amber-500/50 shadow-inner flex items-center justify-center relative"
                >
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/30" />
                </div>
              ))}
            </div>
            <span className="absolute top-1 left-2 text-[10px] font-black tracking-widest text-amber-400/80 uppercase">YELLOW</span>
          </div>

          {/* OVERLAY: Dynamic Tokens Rendered with Motion */}
          {Array.from(tokenCoordinateGroups.values()).map((group) => {
            const count = group.length;

            return group.map(({ token, player, coord }, index) => {
              const isMovable = movableTokens.some(
                (mt) => mt.id === token.id && mt.color === token.color
              );
              const isTurnOwner = player.color === activePlayerColor;

              // Compute slight offset if multiple tokens share the exact cell
              let offsetX = 0;
              let offsetY = 0;
              if (count > 1 && token.step >= 0 && token.step < 57) {
                // Circular offset layout
                const angle = (index / count) * 2 * Math.PI;
                const offsetDistance = 0.22; // cell units
                offsetX = Math.cos(angle) * offsetDistance;
                offsetY = Math.sin(angle) * offsetDistance;
              }

              // Position percentage (15x15 grid => each cell is 100/15%)
              const leftPercent = ((coord.x + offsetX) / 15) * 100;
              const topPercent = ((coord.y + offsetY) / 15) * 100;

              // Token color gradient
              const getTokenColorClasses = () => {
                switch (token.color) {
                  case 'red':
                    return 'from-red-500 via-rose-600 to-red-800 border-red-200 text-red-100 shadow-red-500/50';
                  case 'green':
                    return 'from-emerald-400 via-emerald-600 to-emerald-800 border-emerald-200 text-emerald-100 shadow-emerald-500/50';
                  case 'yellow':
                    return 'from-yellow-400 via-amber-500 to-amber-700 border-yellow-100 text-amber-950 shadow-amber-500/50';
                  case 'blue':
                    return 'from-sky-400 via-blue-600 to-blue-800 border-blue-200 text-blue-100 shadow-blue-500/50';
                }
              };

              // Token skin icon
              const renderTokenSkinIcon = () => {
                switch (tokenSkin) {
                  case 'crown':
                    return <span className="text-[10px] sm:text-xs">👑</span>;
                  case 'gem':
                    return <span className="text-[10px] sm:text-xs">💎</span>;
                  case 'star':
                    return <span className="text-[10px] sm:text-xs">⭐</span>;
                  case 'dragon':
                    return <span className="text-[10px] sm:text-xs">🐉</span>;
                  case 'pawn':
                  default:
                    return (
                      <div className="w-2 h-2 rounded-full bg-white/90 shadow-sm" />
                    );
                }
              };

              return (
                <motion.div
                  key={`${token.color}-${token.id}`}
                  initial={false}
                  animate={{
                    left: `${leftPercent}%`,
                    top: `${topPercent}%`,
                    scale: isMovable ? [1, 1.14, 1] : 1,
                    y: isMovable ? [0, -6, 0] : 0,
                  }}
                  transition={{
                    left: { type: 'spring', stiffness: 220, damping: 20 },
                    top: { type: 'spring', stiffness: 220, damping: 20 },
                    scale: isMovable ? { repeat: Infinity, duration: 1.2 } : { duration: 0.2 },
                    y: isMovable ? { repeat: Infinity, duration: 1.2 } : { duration: 0.2 },
                  }}
                  onClick={() => {
                    if (isMovable) {
                      onTokenClick(token);
                    }
                  }}
                  className={`absolute z-30 transform -translate-x-1/2 -translate-y-1/2 ${
                    isMovable ? 'cursor-pointer' : 'pointer-events-none'
                  }`}
                  style={{
                    width: count > 2 ? '5.4%' : '6.4%',
                    height: count > 2 ? '5.4%' : '6.4%',
                  }}
                >
                  {/* Selectable Halo indicator */}
                  {isMovable && (
                    <div className="absolute -inset-1.5 rounded-full border-2 border-amber-300 bg-amber-400/25 animate-ping" />
                  )}

                  {/* Shield Power-up Visual Ring */}
                  {token.isShielded && (
                    <div className="absolute -inset-2 rounded-full border-2 border-cyan-400 bg-cyan-400/20 flex items-center justify-center animate-spin">
                      <Shield className="w-2.5 h-2.5 text-cyan-300" />
                    </div>
                  )}

                  {/* Main Token Body */}
                  <div
                    className={`w-full h-full rounded-full bg-gradient-to-b ${getTokenColorClasses()} border-2 shadow-lg flex items-center justify-center relative transition-transform active:scale-90`}
                  >
                    {renderTokenSkinIcon()}

                    {/* Finished Home Badge */}
                    {token.step === 57 && (
                      <span className="absolute -top-1 -right-1 text-[8px] bg-amber-400 text-black font-black rounded-full px-0.5">
                        ✓
                      </span>
                    )}
                  </div>
                </motion.div>
              );
            });
          })}
        </div>
      </div>
    </div>
  );
};
