import { PlayerColor } from '../types';

export interface BoardCoord {
  x: number;
  y: number;
}

// 52 track squares relative to Red start (index 0)
export const TRACK_COORDINATES: BoardCoord[] = [
  /* 0 - Red start */ { x: 1, y: 6 },
  /* 1 */ { x: 2, y: 6 },
  /* 2 */ { x: 3, y: 6 },
  /* 3 */ { x: 4, y: 6 },
  /* 4 */ { x: 5, y: 6 },
  /* 5 */ { x: 6, y: 5 },
  /* 6 */ { x: 6, y: 4 },
  /* 7 */ { x: 6, y: 3 },
  /* 8 - Safe Star */ { x: 6, y: 2 },
  /* 9 */ { x: 6, y: 1 },
  /* 10 */ { x: 6, y: 0 },
  /* 11 */ { x: 7, y: 0 },
  /* 12 */ { x: 8, y: 0 },
  /* 13 - Green start / Safe */ { x: 8, y: 1 },
  /* 14 */ { x: 8, y: 2 },
  /* 15 */ { x: 8, y: 3 },
  /* 16 */ { x: 8, y: 4 },
  /* 17 */ { x: 8, y: 5 },
  /* 18 */ { x: 9, y: 6 },
  /* 19 */ { x: 10, y: 6 },
  /* 20 */ { x: 11, y: 6 },
  /* 21 - Safe Star */ { x: 12, y: 6 },
  /* 22 */ { x: 13, y: 6 },
  /* 23 */ { x: 14, y: 6 },
  /* 24 */ { x: 14, y: 7 },
  /* 25 */ { x: 14, y: 8 },
  /* 26 - Yellow start / Safe */ { x: 13, y: 8 },
  /* 27 */ { x: 12, y: 8 },
  /* 28 */ { x: 11, y: 8 },
  /* 29 */ { x: 10, y: 8 },
  /* 30 */ { x: 9, y: 8 },
  /* 31 */ { x: 8, y: 9 },
  /* 32 */ { x: 8, y: 10 },
  /* 33 */ { x: 8, y: 11 },
  /* 34 - Safe Star */ { x: 8, y: 12 },
  /* 35 */ { x: 8, y: 13 },
  /* 36 */ { x: 8, y: 14 },
  /* 37 */ { x: 7, y: 14 },
  /* 38 */ { x: 6, y: 14 },
  /* 39 - Blue start / Safe */ { x: 6, y: 13 },
  /* 40 */ { x: 6, y: 12 },
  /* 41 */ { x: 6, y: 11 },
  /* 42 */ { x: 6, y: 10 },
  /* 43 */ { x: 6, y: 9 },
  /* 44 */ { x: 5, y: 8 },
  /* 45 */ { x: 4, y: 8 },
  /* 46 */ { x: 3, y: 8 },
  /* 47 - Safe Star */ { x: 2, y: 8 },
  /* 48 */ { x: 1, y: 8 },
  /* 49 */ { x: 0, y: 8 },
  /* 50 */ { x: 0, y: 7 },
  /* 51 */ { x: 0, y: 6 },
];

export const SAFE_TRACK_INDICES = [0, 8, 13, 21, 26, 34, 39, 47];

export const COLOR_START_OFFSETS: Record<PlayerColor, number> = {
  red: 0,
  green: 13,
  yellow: 26,
  blue: 39,
};

// Yard / Base coordinates for 4 tokens in each corner
export const YARD_COORDINATES: Record<PlayerColor, BoardCoord[]> = {
  red: [
    { x: 1.75, y: 1.75 },
    { x: 3.75, y: 1.75 },
    { x: 1.75, y: 3.75 },
    { x: 3.75, y: 3.75 },
  ],
  green: [
    { x: 10.25, y: 1.75 },
    { x: 12.25, y: 1.75 },
    { x: 10.25, y: 3.75 },
    { x: 12.25, y: 3.75 },
  ],
  yellow: [
    { x: 10.25, y: 10.25 },
    { x: 12.25, y: 10.25 },
    { x: 10.25, y: 12.25 },
    { x: 12.25, y: 12.25 },
  ],
  blue: [
    { x: 1.75, y: 10.25 },
    { x: 3.75, y: 10.25 },
    { x: 1.75, y: 12.25 },
    { x: 3.75, y: 12.25 },
  ],
};

// Home columns (step 52..56)
export const HOME_PATHS: Record<PlayerColor, BoardCoord[]> = {
  red: [
    { x: 1, y: 7 },
    { x: 2, y: 7 },
    { x: 3, y: 7 },
    { x: 4, y: 7 },
    { x: 5, y: 7 },
  ],
  green: [
    { x: 7, y: 1 },
    { x: 7, y: 2 },
    { x: 7, y: 3 },
    { x: 7, y: 4 },
    { x: 7, y: 5 },
  ],
  yellow: [
    { x: 13, y: 7 },
    { x: 12, y: 7 },
    { x: 11, y: 7 },
    { x: 10, y: 7 },
    { x: 9, y: 7 },
  ],
  blue: [
    { x: 7, y: 13 },
    { x: 7, y: 12 },
    { x: 7, y: 11 },
    { x: 7, y: 10 },
    { x: 7, y: 9 },
  ],
};

// Center home locations (step 57)
export const HOME_CENTER: Record<PlayerColor, BoardCoord> = {
  red: { x: 6.3, y: 7 },
  green: { x: 7, y: 6.3 },
  yellow: { x: 7.7, y: 7 },
  blue: { x: 7, y: 7.7 },
};

/**
 * Get board coordinate (x, y) for a token based on its color, step, and token index
 */
export function getTokenCoordinate(color: PlayerColor, step: number, tokenId: number): BoardCoord {
  if (step === -1) {
    return YARD_COORDINATES[color][tokenId] || { x: 0, y: 0 };
  }
  if (step >= 0 && step <= 51) {
    const globalIdx = (COLOR_START_OFFSETS[color] + step) % 52;
    return TRACK_COORDINATES[globalIdx];
  }
  if (step >= 52 && step <= 56) {
    const homeIdx = step - 52;
    return HOME_PATHS[color][homeIdx];
  }
  // Step 57 = Home center
  return HOME_CENTER[color];
}

/**
 * Converts relative token step to global track index (0..51) if on outer track, or null if in yard or home
 */
export function getGlobalTrackIndex(color: PlayerColor, step: number): number | null {
  if (step >= 0 && step <= 51) {
    return (COLOR_START_OFFSETS[color] + step) % 52;
  }
  return null;
}

/**
 * Check if a global track index is a safe zone
 */
export function isSafeZone(globalIndex: number | null): boolean {
  if (globalIndex === null) return false;
  return SAFE_TRACK_INDICES.includes(globalIndex);
}
