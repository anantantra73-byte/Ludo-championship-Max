import { UserProfile, GameSettings, DailyMission, BoardTheme, DiceSkin, TokenSkin, AdConfig } from '../types';

const PROFILE_KEY = 'champ_ludo_profile';
const SETTINGS_KEY = 'champ_ludo_settings';
const MISSIONS_KEY = 'champ_ludo_missions';
const AD_CONFIG_KEY = 'champ_ludo_ad_config';

export const DEFAULT_AD_CONFIG: AdConfig = {
  adSensePublisherId: '',
  adSenseSlotId: '',
  adSenseEnabled: false,
  testMode: true,
  bannerVisible: true,
  impressions: 142,
  clicks: 18,
  earningsUsd: 1.84,
  earningsInr: 156.40,
};

export const DEFAULT_PROFILE: UserProfile = {
  id: 'user_local_1',
  name: 'Champion Player',
  avatar: '👑',
  frame: 'gold_laurel',
  level: 8,
  xp: 1450,
  nextLevelXp: 2000,
  coins: 3500,
  gems: 120,
  rankTier: 'Gold',
  rankPoints: 1420,
  gamesPlayed: 34,
  gamesWon: 23,
  tokensCaptured: 58,
  sixesRolled: 114,
  currentStreak: 5,
  lastDailyClaim: null,
  equippedDice: 'ivory',
  equippedToken: 'crown',
  equippedBoard: 'classic',
  unlockedDice: ['ivory', 'cyber', 'wooden'],
  unlockedTokens: ['crown', 'gem', 'pawn'],
  unlockedBoards: ['classic', 'cyberpunk', 'royal'],
  unlockedAvatars: ['👑', '🦁', '⚡', '🐉', '🎯', '🔥', '🦊', '🚀'],
  unlockedFrames: ['silver_ring', 'gold_laurel', 'neon_pulse'],
  battlePassTier: 7,
  battlePassXp: 450,
  isBattlePassPremium: false,
};

export const DEFAULT_SETTINGS: GameSettings = {
  soundEnabled: true,
  musicEnabled: true,
  soundVolume: 0.8,
  musicVolume: 0.5,
  language: 'en',
  animSpeed: 'normal',
  vibration: true,
  autoMoveSingleToken: true,
};

export const DEFAULT_MISSIONS: DailyMission[] = [
  {
    id: 'm1',
    title: 'Dice Master',
    description: 'Roll a six 3 times in any game mode',
    progress: 1,
    target: 3,
    rewardType: 'coins',
    rewardAmount: 300,
    isClaimed: false,
  },
  {
    id: 'm2',
    title: 'Hunter Strike',
    description: 'Capture 2 opponent tokens in a match',
    progress: 0,
    target: 2,
    rewardType: 'coins',
    rewardAmount: 500,
    isClaimed: false,
  },
  {
    id: 'm3',
    title: 'Home Bound',
    description: 'Bring 2 tokens safely into home',
    progress: 1,
    target: 2,
    rewardType: 'gems',
    rewardAmount: 20,
    isClaimed: false,
  },
  {
    id: 'm4',
    title: 'Quick Match Victor',
    description: 'Win 1 Quick Ludo match',
    progress: 0,
    target: 1,
    rewardType: 'xp',
    rewardAmount: 400,
    isClaimed: false,
  },
];

export function loadProfile(): UserProfile {
  try {
    const saved = localStorage.getItem(PROFILE_KEY);
    if (saved) {
      return { ...DEFAULT_PROFILE, ...JSON.parse(saved) };
    }
  } catch {
    // Ignore error and return default
  }
  return DEFAULT_PROFILE;
}

export function saveProfile(profile: UserProfile): void {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch {
    // ignore
  }
}

export function loadSettings(): GameSettings {
  try {
    const saved = localStorage.getItem(SETTINGS_KEY);
    if (saved) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
    }
  } catch {
    // ignore
  }
  return DEFAULT_SETTINGS;
}

export function saveSettings(settings: GameSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    // ignore
  }
}

export function loadMissions(): DailyMission[] {
  try {
    const saved = localStorage.getItem(MISSIONS_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch {
    // ignore
  }
  return DEFAULT_MISSIONS;
}

export function saveMissions(missions: DailyMission[]): void {
  try {
    localStorage.setItem(MISSIONS_KEY, JSON.stringify(missions));
  } catch {
    // ignore
  }
}

export function loadAdConfig(): AdConfig {
  try {
    const saved = localStorage.getItem(AD_CONFIG_KEY);
    if (saved) {
      return { ...DEFAULT_AD_CONFIG, ...JSON.parse(saved) };
    }
  } catch {
    // ignore
  }
  return DEFAULT_AD_CONFIG;
}

export function saveAdConfig(config: AdConfig): void {
  try {
    localStorage.setItem(AD_CONFIG_KEY, JSON.stringify(config));
  } catch {
    // ignore
  }
}

export function getRankTierFromPoints(points: number): UserProfile['rankTier'] {
  if (points >= 3000) return 'Grandmaster';
  if (points >= 2400) return 'Master';
  if (points >= 1900) return 'Diamond';
  if (points >= 1500) return 'Platinum';
  if (points >= 1100) return 'Gold';
  if (points >= 700) return 'Silver';
  return 'Bronze';
}
