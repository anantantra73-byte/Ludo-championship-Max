export type PlayerColor = 'red' | 'green' | 'yellow' | 'blue';

export type PlayerType = 'human' | 'bot';

export interface Token {
  id: number; // 0, 1, 2, 3
  color: PlayerColor;
  step: number; // -1 = base/yard, 0..50 = track, 51 = entry, 52..56 = home path, 57 = home (finished)
  isShielded?: boolean; // Power-up: immune to capture for 1 round
  isBoosted?: boolean;
}

export type PowerUpType = 'shield' | 'extra_dice' | 'dice_control' | 'teleport' | 'token_boost';

export interface PowerUpItem {
  type: PowerUpType;
  name: string;
  description: string;
  icon: string;
  cost: number;
}

export interface Player {
  id: string;
  name: string;
  color: PlayerColor;
  type: PlayerType;
  avatar: string;
  frame: string;
  rankTier: string;
  level: number;
  tokens: Token[];
  isReady: boolean;
  team?: 1 | 2; // for 2v2 team mode
  activeEmote?: { text: string; emoji: string; timestamp: number } | null;
  powerUps: Record<PowerUpType, number>;
  finishedRank?: number; // 1st, 2nd, 3rd, 4th
}

export type GameMode = 
  | 'classic'     // 4 tokens to home
  | 'quick'       // 1 token to home wins
  | 'team'        // 2v2: Red & Yellow vs Green & Blue
  | 'ranked'      // Ranked competitive with rank rating (RP)
  | 'tournament'; // 8-player bracket tournament

export type MatchType = 
  | 'vs_computer'
  | 'local_pass_n_play'
  | 'online_matchmaking'
  | 'private_room';

export type BoardTheme = 'classic' | 'cyberpunk' | 'royal' | 'mystic' | 'cosmic';
export type DiceSkin = 'ivory' | 'cyber' | 'gold' | 'obsidian' | 'cosmic' | 'wooden';
export type TokenSkin = 'crown' | 'gem' | 'pawn' | 'star' | 'dragon';

export interface GameSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  soundVolume: number;
  musicVolume: number;
  language: 'en' | 'hi' | 'es' | 'fr' | 'de' | 'ja';
  animSpeed: 'normal' | 'fast' | 'turbo';
  vibration: boolean;
  autoMoveSingleToken: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  frame: string;
  level: number;
  xp: number;
  nextLevelXp: number;
  coins: number;
  gems: number;
  rankTier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond' | 'Master' | 'Grandmaster';
  rankPoints: number;
  gamesPlayed: number;
  gamesWon: number;
  tokensCaptured: number;
  sixesRolled: number;
  currentStreak: number;
  lastDailyClaim: string | null;
  equippedDice: DiceSkin;
  equippedToken: TokenSkin;
  equippedBoard: BoardTheme;
  unlockedDice: DiceSkin[];
  unlockedTokens: TokenSkin[];
  unlockedBoards: BoardTheme[];
  unlockedAvatars: string[];
  unlockedFrames: string[];
  battlePassTier: number;
  battlePassXp: number;
  isBattlePassPremium: boolean;
}

export interface DailyMission {
  id: string;
  title: string;
  description: string;
  progress: number;
  target: number;
  rewardType: 'coins' | 'gems' | 'xp';
  rewardAmount: number;
  isClaimed: boolean;
}

export interface LeaderboardUser {
  rank: number;
  name: string;
  avatar: string;
  frame: string;
  tier: string;
  points: number;
  wins: number;
  winRate: string;
  isCurrentPlayer?: boolean;
}

export interface TournamentMatch {
  id: string;
  round: 'Quarterfinals' | 'Semifinals' | 'Grand Final';
  player1: string;
  player2: string;
  winner?: string;
  isUserMatch: boolean;
  isCompleted: boolean;
}

export interface AdCampaign {
  id: string;
  brand: string;
  headline: string;
  subtext: string;
  ctaText: string;
  tag: string;
  badgeColor: string;
  icon: string;
  targetUrl: string;
}

export interface AdConfig {
  adSensePublisherId: string; // e.g. "ca-pub-1234567890123456"
  adSenseSlotId: string;      // e.g. "9876543210"
  adSenseEnabled: boolean;
  testMode: boolean;
  bannerVisible: boolean;
  impressions: number;
  clicks: number;
  earningsUsd: number;
  earningsInr: number;
}
