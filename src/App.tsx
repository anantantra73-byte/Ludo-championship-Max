/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Player, 
  PlayerColor, 
  Token, 
  GameMode, 
  MatchType, 
  UserProfile, 
  GameSettings, 
  DailyMission, 
  PowerUpType, 
  DiceSkin, 
  TokenSkin, 
  BoardTheme,
  AdConfig
} from './types';
import { 
  loadProfile, 
  saveProfile, 
  loadSettings, 
  saveSettings, 
  loadMissions, 
  saveMissions,
  loadAdConfig,
  saveAdConfig,
  getRankTierFromPoints
} from './utils/storage';
import { sound } from './utils/audio';
import { getGlobalTrackIndex, isSafeZone } from './utils/ludoBoardCoordinates';
import { getMovableTokens, chooseBotTokenMove } from './utils/botAi';

import { HeaderNav } from './components/HeaderNav';
import { LobbyView } from './components/LobbyView';
import { LudoBoard } from './components/LudoBoard';
import { DiceRoller } from './components/DiceRoller';
import { PlayerCard } from './components/PlayerCard';
import { PowerUpsPanel } from './components/PowerUpsPanel';
import { EmotePicker } from './components/EmotePicker';
import { GameVictoryModal } from './components/GameVictoryModal';
import { ShopModal } from './components/ShopModal';
import { MissionsDrawer } from './components/MissionsDrawer';
import { LeaderboardModal } from './components/LeaderboardModal';
import { ProfileModal } from './components/ProfileModal';
import { DailySpinModal } from './components/DailySpinModal';
import { TournamentModal } from './components/TournamentModal';
import { SettingsModal } from './components/SettingsModal';
import { MatchmakingModal } from './components/MatchmakingModal';
import { TopLeftBannerAd } from './components/TopLeftBannerAd';
import { AdMonetizationModal } from './components/AdMonetizationModal';
import { RewardedAdModal } from './components/RewardedAdModal';
import { ReplayAdRewardModal } from './components/ReplayAdRewardModal';
import { AndroidApkModal } from './components/AndroidApkModal';

export default function App() {
  // Persistence & Config
  const [profile, setProfile] = useState<UserProfile>(loadProfile);
  const [settings, setSettings] = useState<GameSettings>(loadSettings);
  const [missions, setMissions] = useState<DailyMission[]>(loadMissions);
  const [adConfig, setAdConfig] = useState<AdConfig>(loadAdConfig);

  // App Navigation & Modals
  const [activeView, setActiveView] = useState<'lobby' | 'game'>('lobby');
  const [showShop, setShowShop] = useState(false);
  const [shopInitialTab, setShopInitialTab] = useState<'dice' | 'tokens' | 'boards' | 'avatars' | 'pass'>('dice');
  const [showMissions, setShowMissions] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showDailySpin, setShowDailySpin] = useState(false);
  const [showTournament, setShowTournament] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showMatchmaking, setShowMatchmaking] = useState(false);
  const [showAdMonetization, setShowAdMonetization] = useState(false);
  const [showRewardedAd, setShowRewardedAd] = useState(false);
  const [showReplayAdModal, setShowReplayAdModal] = useState(false);
  const [showAndroidApkModal, setShowAndroidApkModal] = useState(false);
  const [currentMatchPlayerNames, setCurrentMatchPlayerNames] = useState<string[]>([]);

  // Game Engine State
  const [gameMode, setGameMode] = useState<GameMode>('classic');
  const [matchType, setMatchType] = useState<MatchType>('vs_computer');
  const [matchStake, setMatchStake] = useState<number>(500);
  const [players, setPlayers] = useState<Player[]>([]);
  const [activePlayerIndex, setActivePlayerIndex] = useState<number>(0);

  const [diceValue, setDiceValue] = useState<number>(1);
  const [secondDiceValue, setSecondDiceValue] = useState<number | null>(null);
  const [isRolling, setIsRolling] = useState<boolean>(false);
  const [canRoll, setCanRoll] = useState<boolean>(true);
  const [consecutiveSixes, setConsecutiveSixes] = useState<number>(0);
  const [movableTokens, setMovableTokens] = useState<Token[]>([]);

  const [turnTimerRemaining, setTurnTimerRemaining] = useState<number>(15);
  const MAX_TURN_TIME = 15;

  const [activePowerUp, setActivePowerUp] = useState<PowerUpType | null>(null);
  const [winner, setWinner] = useState<Player | null>(null);

  // Save changes
  useEffect(() => {
    saveProfile(profile);
  }, [profile]);

  useEffect(() => {
    saveSettings(settings);
    sound.setVolumes(settings.soundVolume, settings.musicVolume, !settings.soundEnabled);
  }, [settings]);

  useEffect(() => {
    saveMissions(missions);
  }, [missions]);

  useEffect(() => {
    saveAdConfig(adConfig);
  }, [adConfig]);

  // Periodic ad impression and earnings accumulation (~$2.40 eCPM)
  useEffect(() => {
    const timer = setInterval(() => {
      setAdConfig((prev) => {
        const newImp = prev.impressions + 1;
        const additionalUsd = 0.0024;
        const additionalInr = additionalUsd * 85;
        return {
          ...prev,
          impressions: newImp,
          earningsUsd: +(prev.earningsUsd + additionalUsd).toFixed(2),
          earningsInr: +(prev.earningsInr + additionalInr).toFixed(2),
        };
      });
    }, 35000);

    return () => clearInterval(timer);
  }, []);

  const handleAdClick = () => {
    setAdConfig((prev) => {
      const additionalUsd = 0.18;
      const additionalInr = additionalUsd * 85;
      return {
        ...prev,
        clicks: prev.clicks + 1,
        earningsUsd: +(prev.earningsUsd + additionalUsd).toFixed(2),
        earningsInr: +(prev.earningsInr + additionalInr).toFixed(2),
      };
    });
  };

  const handleRewardedAdClaimed = (reward: { coins: number; gems: number }) => {
    setProfile((p) => ({
      ...p,
      coins: p.coins + reward.coins,
      gems: p.gems + reward.gems,
    }));
    // High Rewarded Ad eCPM payout
    setAdConfig((prev) => {
      const additionalUsd = 0.05;
      const additionalInr = additionalUsd * 85;
      return {
        ...prev,
        impressions: prev.impressions + 1,
        clicks: prev.clicks + 1,
        earningsUsd: +(prev.earningsUsd + additionalUsd).toFixed(2),
        earningsInr: +(prev.earningsInr + additionalInr).toFixed(2),
      };
    });
  };

  // Turn Timer countdown
  useEffect(() => {
    if (activeView !== 'game' || winner || isRolling) return;

    const timer = setInterval(() => {
      setTurnTimerRemaining((prev) => {
        if (prev <= 1) {
          // Time expired, forfeit turn
          handleTurnTimeout();
          return MAX_TURN_TIME;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activeView, winner, isRolling, activePlayerIndex]);

  // Bot Turn Automation
  useEffect(() => {
    if (activeView !== 'game' || winner || isRolling) return;
    if (players.length === 0) return;

    const currentPlayer = players[activePlayerIndex];
    if (!currentPlayer || currentPlayer.type !== 'bot') return;

    // Bot needs to roll if canRoll
    if (canRoll) {
      const rollDelay = setTimeout(() => {
        rollDice();
      }, 750);
      return () => clearTimeout(rollDelay);
    }

    // Bot needs to choose a move if movableTokens available
    if (!canRoll && movableTokens.length > 0) {
      const moveDelay = setTimeout(() => {
        const chosenToken = chooseBotTokenMove(
          currentPlayer,
          players,
          diceValue,
          gameMode
        );
        if (chosenToken) {
          handleTokenMove(chosenToken);
        } else {
          passTurnToNext();
        }
      }, 700);
      return () => clearTimeout(moveDelay);
    }
  }, [activeView, winner, isRolling, canRoll, activePlayerIndex, movableTokens, players]);

  // Setup a match
  const startMatch = (config: {
    mode: GameMode;
    matchType: MatchType;
    playerCount: 2 | 3 | 4;
    stake: number;
    roomCode?: string;
    customPlayerNames?: string[];
  }) => {
    const resolvedNames = config.customPlayerNames || [profile.name, 'Rohan', 'Sneha', 'Vikram'];
    setCurrentMatchPlayerNames(resolvedNames);

    if (config.matchType === 'online_matchmaking') {
      setGameMode(config.mode);
      setMatchType(config.matchType);
      setMatchStake(config.stake);
      setShowMatchmaking(true);
      return;
    }

    initializeBoard(config.mode, config.matchType, config.playerCount, config.stake, resolvedNames);
  };

  const initializeBoard = (
    mode: GameMode,
    type: MatchType,
    count: 2 | 3 | 4,
    stake: number,
    customNames?: string[]
  ) => {
    setGameMode(mode);
    setMatchType(type);
    setMatchStake(stake);
    setWinner(null);
    setActivePowerUp(null);
    setConsecutiveSixes(0);
    setDiceValue(6);
    setCanRoll(true);
    setIsRolling(false);
    setMovableTokens([]);
    setTurnTimerRemaining(MAX_TURN_TIME);

    // Build players array
    // Colors order: Red, Green, Yellow, Blue
    let colorList: PlayerColor[] = ['red', 'green', 'yellow', 'blue'];
    if (count === 2) {
      // 2-player opposite colors: Red and Yellow
      colorList = ['red', 'yellow'];
    } else if (count === 3) {
      colorList = ['red', 'green', 'yellow'];
    }

    const fallbackOpponents = ['Rohan', 'Sneha', 'Vikram', 'Aman'];
    const friendlyAvatars = ['⚡', '🐉', '🎯', '🦁'];

    const createdPlayers: Player[] = colorList.map((col, idx) => {
      const isUser = idx === 0;
      const isHuman = type === 'local_pass_n_play' ? true : isUser;

      // Keep exact name the user entered or fallback without any "bot" text
      const assignedName = isUser 
        ? profile.name 
        : (customNames && customNames[idx] ? customNames[idx] : fallbackOpponents[idx - 1] || `Player ${idx + 1}`);

      return {
        id: isUser ? profile.id : `p_${col}_${idx}`,
        name: assignedName,
        color: col,
        type: isHuman ? 'human' : 'bot',
        avatar: isUser ? profile.avatar : friendlyAvatars[idx % friendlyAvatars.length],
        frame: isUser ? profile.frame : 'silver_ring',
        rankTier: isUser ? profile.rankTier : 'Gold',
        level: isUser ? profile.level : 5 + idx * 2,
        tokens: [
          { id: 0, color: col, step: -1 },
          { id: 1, color: col, step: -1 },
          { id: 2, color: col, step: -1 },
          { id: 3, color: col, step: -1 },
        ],
        isReady: true,
        team: mode === 'team' ? (col === 'red' || col === 'yellow' ? 1 : 2) : undefined,
        powerUps: {
          shield: 2,
          extra_dice: 2,
          dice_control: 1,
          teleport: 1,
          token_boost: 2,
        },
      };
    });

    setPlayers(createdPlayers);
    setActivePlayerIndex(0);
    setActiveView('game');
  };

  // Roll Dice Action
  const rollDice = (forcedValue?: number) => {
    if (!canRoll || isRolling) return;

    sound.playDiceRoll();
    setIsRolling(true);
    setCanRoll(false);
    setMovableTokens([]);

    // Roll duration
    setTimeout(() => {
      const finalVal = forcedValue || Math.floor(Math.random() * 6) + 1;
      setDiceValue(finalVal);

      let secondVal: number | null = null;
      if (activePowerUp === 'extra_dice') {
        secondVal = Math.floor(Math.random() * 6) + 1;
        setSecondDiceValue(secondVal);
      } else {
        setSecondDiceValue(null);
      }

      setIsRolling(false);
      evaluateRollResult(finalVal, secondVal);
    }, 600);
  };

  // Evaluate roll result
  const evaluateRollResult = (rolledVal: number, secondVal: number | null) => {
    const effectiveRoll = secondVal ? Math.min(6, Math.max(rolledVal, secondVal)) : rolledVal;
    const currentPlayer = players[activePlayerIndex];

    if (effectiveRoll === 6) {
      sound.playSixRolled();
      setConsecutiveSixes((prev) => prev + 1);
      // Mission progress for Rolling 6
      updateMissionProgress('m1', 1);

      // 3rd Six cancellation rule
      if (consecutiveSixes + 1 >= 3) {
        setConsecutiveSixes(0);
        setTimeout(() => {
          passTurnToNext();
        }, 900);
        return;
      }
    } else {
      setConsecutiveSixes(0);
    }

    const movable = getMovableTokens(currentPlayer, effectiveRoll);
    setMovableTokens(movable);

    if (movable.length === 0) {
      // No legal moves
      setTimeout(() => {
        passTurnToNext();
      }, 800);
    } else if (
      movable.length === 1 &&
      settings.autoMoveSingleToken &&
      currentPlayer.type === 'human'
    ) {
      // Auto move single token
      setTimeout(() => {
        handleTokenMove(movable[0]);
      }, 400);
    }
  };

  // Move Token
  const handleTokenMove = (token: Token) => {
    if (movableTokens.length === 0) return;
    sound.playTokenStep();

    const currentPlayer = players[activePlayerIndex];
    let effectiveSteps = diceValue;
    if (secondDiceValue) {
      effectiveSteps = Math.max(diceValue, secondDiceValue);
    }
    if (activePowerUp === 'token_boost') {
      effectiveSteps += 3;
    }

    const currentStep = token.step;
    let targetStep = currentStep === -1 ? 0 : currentStep + effectiveSteps;
    if (activePowerUp === 'teleport' && currentStep >= 0) {
      targetStep = Math.min(57, targetStep + 3);
    }
    if (targetStep > 57) return;

    let hasCaptured = false;
    let hasReachedHome = false;

    // Apply move and check collisions
    setPlayers((prevPlayers) => {
      const updatedPlayers = prevPlayers.map((p) => {
        // Update current player's token
        if (p.id === currentPlayer.id) {
          const updatedTokens = p.tokens.map((t) => {
            if (t.id === token.id) {
              const reachedHome = targetStep === 57;
              if (reachedHome) hasReachedHome = true;

              return {
                ...t,
                step: targetStep,
                isShielded: activePowerUp === 'shield' ? true : t.isShielded,
              };
            }
            return t;
          });
          return { ...p, tokens: updatedTokens };
        }
        return p;
      });

      // Check capture on outer track
      if (targetStep >= 0 && targetStep <= 51) {
        const targetGlobal = getGlobalTrackIndex(currentPlayer.color, targetStep);
        const targetIsSafe = isSafeZone(targetGlobal);

        if (targetGlobal !== null && !targetIsSafe) {
          return updatedPlayers.map((p) => {
            // Teammates or self cannot be captured
            if (p.id === currentPlayer.id) return p;
            if (gameMode === 'team' && p.team === currentPlayer.team) return p;

            const capturedTokens = p.tokens.map((oppT) => {
              if (oppT.step >= 0 && oppT.step <= 51) {
                const oppGlobal = getGlobalTrackIndex(oppT.color, oppT.step);
                if (oppGlobal === targetGlobal && !oppT.isShielded) {
                  // Capture!
                  hasCaptured = true;
                  sound.playCapture();
                  return { ...oppT, step: -1 }; // back to yard
                }
              }
              return oppT;
            });

            return { ...p, tokens: capturedTokens };
          });
        }
      }

      return updatedPlayers;
    });

    // Landing sound effects & mission stats
    if (hasReachedHome) {
      sound.playTokenHome();
      updateMissionProgress('m3', 1);
    } else if (targetStep >= 0 && targetStep <= 51) {
      const globalIdx = getGlobalTrackIndex(currentPlayer.color, targetStep);
      if (isSafeZone(globalIdx)) {
        sound.playSafeStar();
      }
    }

    if (hasCaptured) {
      updateMissionProgress('m2', 1);
      setProfile((prev) => ({
        ...prev,
        tokensCaptured: prev.tokensCaptured + 1,
      }));
    }

    // Reset move state & powerup
    setMovableTokens([]);
    setActivePowerUp(null);

    // Check Victory condition
    setTimeout(() => {
      checkGameEnd(currentPlayer, hasCaptured, hasReachedHome);
    }, 300);
  };

  // Check Game End
  const checkGameEnd = (
    player: Player,
    hasCaptured: boolean,
    hasReachedHome: boolean
  ) => {
    // Check if player or team has won
    const latestPlayer = players.find((p) => p.id === player.id) || player;
    const finishedTokensCount = latestPlayer.tokens.filter((t) => t.step === 57).length;

    let isGameWon = false;
    if (gameMode === 'quick' && finishedTokensCount >= 1) {
      isGameWon = true;
    } else if (gameMode === 'classic' || gameMode === 'ranked') {
      if (finishedTokensCount >= 4) {
        isGameWon = true;
      }
    } else if (gameMode === 'team') {
      // Both team players tokens finished
      const teamMates = players.filter((p) => p.team === player.team);
      const allTokensHome = teamMates.every(
        (tm) => tm.tokens.filter((t) => t.step === 57).length === 4
      );
      if (allTokensHome) {
        isGameWon = true;
      }
    }

    if (isGameWon) {
      handleMatchWon(latestPlayer);
      return;
    }

    // Extra Turn Rules:
    // 1. Rolled a 6 (and not forfeited by 3 sixes)
    // 2. Captured an opponent
    // 3. Reached home with a token
    const getsExtraTurn = diceValue === 6 || hasCaptured || hasReachedHome;

    if (getsExtraTurn) {
      setCanRoll(true);
      setTurnTimerRemaining(MAX_TURN_TIME);
    } else {
      passTurnToNext();
    }
  };

  // Pass Turn
  const passTurnToNext = () => {
    setConsecutiveSixes(0);
    setActivePowerUp(null);
    setMovableTokens([]);
    setActivePlayerIndex((prev) => (prev + 1) % players.length);
    setCanRoll(true);
    setTurnTimerRemaining(MAX_TURN_TIME);
  };

  const handleTurnTimeout = () => {
    passTurnToNext();
  };

  // Match Won
  const handleMatchWon = (winnerPlayer: Player) => {
    setWinner(winnerPlayer);
    const isUser = winnerPlayer.id === profile.id;

    // Coins & XP rewards
    const coinsWon = matchStake > 0 ? matchStake * players.length : 300;
    const xpWon = 350;
    const rpGained = isUser ? 45 : -15;

    if (isUser) {
      if (gameMode === 'quick') {
        updateMissionProgress('m4', 1);
      }
      setProfile((prev) => ({
        ...prev,
        coins: prev.coins + coinsWon,
        xp: prev.xp + xpWon,
        gamesPlayed: prev.gamesPlayed + 1,
        gamesWon: prev.gamesWon + 1,
        rankPoints: Math.max(0, prev.rankPoints + rpGained),
        battlePassXp: prev.battlePassXp + 250,
        battlePassTier: Math.min(10, Math.floor((prev.battlePassXp + 250) / 300) + 1),
      }));
    } else {
      setProfile((prev) => ({
        ...prev,
        gamesPlayed: prev.gamesPlayed + 1,
        rankPoints: Math.max(0, prev.rankPoints + rpGained),
      }));
    }
  };

  // Power Up Trigger
  const handleActivatePowerUp = (type: PowerUpType) => {
    const currentPlayer = players[activePlayerIndex];
    if (currentPlayer.type !== 'human') return;
    if (currentPlayer.powerUps[type] <= 0) return;

    setActivePowerUp(type);
    setPlayers((prev) =>
      prev.map((p) => {
        if (p.id === currentPlayer.id) {
          return {
            ...p,
            powerUps: {
              ...p.powerUps,
              [type]: p.powerUps[type] - 1,
            },
          };
        }
        return p;
      })
    );
  };

  // Send Emote
  const handleSendEmote = (emoji: string, text: string) => {
    const currentPlayer = players[activePlayerIndex];
    setPlayers((prev) =>
      prev.map((p) => {
        if (p.id === currentPlayer.id) {
          return {
            ...p,
            activeEmote: { emoji, text, timestamp: Date.now() },
          };
        }
        return p;
      })
    );

    setTimeout(() => {
      setPlayers((prev) =>
        prev.map((p) => {
          if (p.id === currentPlayer.id) {
            return { ...p, activeEmote: null };
          }
          return p;
        })
      );
    }, 2800);
  };

  // Update Mission Progress
  const updateMissionProgress = (missionId: string, amount: number) => {
    setMissions((prev) =>
      prev.map((m) => {
        if (m.id === missionId && !m.isClaimed) {
          return { ...m, progress: Math.min(m.target, m.progress + amount) };
        }
        return m;
      })
    );
  };

  const handleClaimMission = (missionId: string) => {
    const target = missions.find((m) => m.id === missionId);
    if (!target) return;

    setMissions((prev) =>
      prev.map((m) => (m.id === missionId ? { ...m, isClaimed: true } : m))
    );

    if (target.rewardType === 'coins') {
      setProfile((prev) => ({ ...prev, coins: prev.coins + target.rewardAmount }));
    } else if (target.rewardType === 'gems') {
      setProfile((prev) => ({ ...prev, gems: prev.gems + target.rewardAmount }));
    } else if (target.rewardType === 'xp') {
      setProfile((prev) => ({ ...prev, xp: prev.xp + target.rewardAmount }));
    }
  };

  const hasUnclaimedMissions = missions.some(
    (m) => m.progress >= m.target && !m.isClaimed
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-amber-500 selection:text-slate-950 relative">
      {/* Top Universal Navbar */}
      <HeaderNav
        profile={profile}
        settings={settings}
        activeView={activeView}
        hasUnclaimedMissions={hasUnclaimedMissions}
        adEarningsInr={adConfig.earningsInr}
        onOpenProfile={() => setShowProfile(true)}
        onOpenShop={() => setShowShop(true)}
        onOpenMissions={() => setShowMissions(true)}
        onOpenLeaderboards={() => setShowLeaderboard(true)}
        onOpenBattlePass={() => {
          setShopInitialTab('pass');
          setShowShop(true);
        }}
        onOpenSettings={() => setShowSettings(true)}
        onOpenMonetization={() => setShowAdMonetization(true)}
        onOpenAndroidApk={() => setShowAndroidApkModal(true)}
        onToggleSound={() => {
          setSettings((prev) => ({ ...prev, soundEnabled: !prev.soundEnabled }));
        }}
        onReturnToLobby={() => setActiveView('lobby')}
      />

      {/* Top-Left Banner Advertisement: Sirf First/Lobby screen par rahega, Game start hone par automatically band ho jayega */}
      {activeView === 'lobby' && adConfig.bannerVisible && (
        <TopLeftBannerAd
          adConfig={adConfig}
          onAdClick={handleAdClick}
          onOpenMonetization={() => setShowAdMonetization(true)}
        />
      )}

      {/* Main Viewport Container */}
      <main className="flex-1 flex flex-col items-center justify-center p-2 sm:p-4 relative">
        {activeView === 'lobby' ? (
          <LobbyView
            profile={profile}
            onStartMatch={startMatch}
            onOpenDailySpin={() => setShowDailySpin(true)}
            onOpenTournament={() => setShowTournament(true)}
            onWatchRewardedAd={() => setShowRewardedAd(true)}
            onOpenMonetization={() => setShowAdMonetization(true)}
            onOpenAndroidApk={() => setShowAndroidApkModal(true)}
          />
        ) : (
          /* Active Gameplay Arena */
          <div className="w-full max-w-5xl flex flex-col items-center gap-3">
            {/* Top HUD Players Row */}
            <div className="w-full max-w-[620px] grid grid-cols-2 gap-2 sm:gap-4 px-1">
              {players[0] && (
                <PlayerCard
                  player={players[0]}
                  isActive={activePlayerIndex === 0}
                  position="top-left"
                  isTeamMode={gameMode === 'team'}
                />
              )}
              {players[1] && (
                <PlayerCard
                  player={players[1]}
                  isActive={activePlayerIndex === 1}
                  position="top-right"
                  isTeamMode={gameMode === 'team'}
                />
              )}
            </div>

            {/* Central Board Area */}
            <div className="w-full flex items-center justify-center relative">
              <LudoBoard
                players={players}
                activePlayerColor={players[activePlayerIndex]?.color || 'red'}
                movableTokens={movableTokens}
                boardTheme={profile.equippedBoard}
                tokenSkin={profile.equippedToken}
                onTokenClick={handleTokenMove}
              />
            </div>

            {/* Bottom HUD Players Row (for 3 or 4 players) */}
            {players.length > 2 && (
              <div className="w-full max-w-[620px] grid grid-cols-2 gap-2 sm:gap-4 px-1">
                {players[2] && (
                  <PlayerCard
                    player={players[2]}
                    isActive={activePlayerIndex === 2}
                    position="bottom-left"
                    isTeamMode={gameMode === 'team'}
                  />
                )}
                {players[3] && (
                  <PlayerCard
                    player={players[3]}
                    isActive={activePlayerIndex === 3}
                    position="bottom-right"
                    isTeamMode={gameMode === 'team'}
                  />
                )}
              </div>
            )}

            {/* Bottom Control Deck: Dice, Emotes, Power-ups */}
            <div className="w-full max-w-[620px] flex items-center justify-between gap-3 p-3 bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-800 shadow-xl mt-1">
              {/* Emote Picker */}
              <EmotePicker onSendEmote={handleSendEmote} />

              {/* Central Dice Roller */}
              {players[activePlayerIndex] && (
                <DiceRoller
                  currentValue={diceValue}
                  secondValue={secondDiceValue}
                  isRolling={isRolling}
                  canRoll={canRoll && (players[activePlayerIndex].type === 'human')}
                  playerColor={players[activePlayerIndex].color}
                  playerName={players[activePlayerIndex].name}
                  diceSkin={profile.equippedDice}
                  isDoubleDiceActive={activePowerUp === 'extra_dice'}
                  isDiceControlActive={activePowerUp === 'dice_control'}
                  consecutiveSixes={consecutiveSixes}
                  turnTimeRemaining={turnTimerRemaining}
                  maxTurnTime={MAX_TURN_TIME}
                  onRoll={() => rollDice()}
                  onSelectExactDice={(val) => rollDice(val)}
                />
              )}

              {/* Power-Ups Selector */}
              {players[activePlayerIndex] && (
                <PowerUpsPanel
                  availablePowerUps={players[activePlayerIndex].powerUps}
                  activePowerUp={activePowerUp}
                  canUsePowerUp={canRoll && players[activePlayerIndex].type === 'human'}
                  onActivatePowerUp={handleActivatePowerUp}
                />
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer info bar */}
      <footer className="w-full text-center py-2 text-[11px] text-slate-500 border-t border-slate-900 bg-slate-950/60">
        <span>Championship Ludo • Original Strategic Board Game • Season 1 Arena</span>
      </footer>

      {/* MODALS */}
      {/* 1. Victory / Match Completion Modal */}
      {winner && (
        <GameVictoryModal
          winner={winner}
          players={players}
          gameMode={gameMode}
          userPlayerId={profile.id}
          coinsEarned={matchStake > 0 ? matchStake * players.length : 300}
          xpEarned={350}
          rpChange={winner.id === profile.id ? 45 : -15}
          onWatchAdsReplay={() => {
            setShowReplayAdModal(true);
          }}
          onPlayAgain={() => {
            initializeBoard(gameMode, matchType, players.length as any, matchStake, currentMatchPlayerNames);
          }}
          onReturnToLobby={() => {
            setWinner(null);
            setActiveView('lobby');
          }}
        />
      )}

      {/* 2. Shop & Customization Modal */}
      {showShop && (
        <ShopModal
          profile={profile}
          initialTab={shopInitialTab}
          onEquipDice={(dice) => setProfile((p) => ({ ...p, equippedDice: dice }))}
          onEquipToken={(token) => setProfile((p) => ({ ...p, equippedToken: token }))}
          onEquipBoard={(board) => setProfile((p) => ({ ...p, equippedBoard: board }))}
          onEquipAvatar={(av) => setProfile((p) => ({ ...p, avatar: av }))}
          onBuyItem={(type, id, costType, cost) => {
            if (costType === 'coins' && profile.coins >= cost) {
              setProfile((p) => ({
                ...p,
                coins: p.coins - cost,
                unlockedDice: type === 'dice' ? [...p.unlockedDice, id as DiceSkin] : p.unlockedDice,
                unlockedTokens: type === 'token' ? [...p.unlockedTokens, id as TokenSkin] : p.unlockedTokens,
                unlockedBoards: type === 'board' ? [...p.unlockedBoards, id as BoardTheme] : p.unlockedBoards,
                unlockedAvatars: type === 'avatar' ? [...p.unlockedAvatars, id] : p.unlockedAvatars,
              }));
            } else if (costType === 'gems' && profile.gems >= cost) {
              setProfile((p) => ({
                ...p,
                gems: p.gems - cost,
                unlockedDice: type === 'dice' ? [...p.unlockedDice, id as DiceSkin] : p.unlockedDice,
                unlockedTokens: type === 'token' ? [...p.unlockedTokens, id as TokenSkin] : p.unlockedTokens,
                unlockedBoards: type === 'board' ? [...p.unlockedBoards, id as BoardTheme] : p.unlockedBoards,
              }));
            }
          }}
          onUnlockPremiumPass={() => {
            if (profile.gems >= 100) {
              setProfile((p) => ({
                ...p,
                gems: p.gems - 100,
                isBattlePassPremium: true,
              }));
            }
          }}
          onClose={() => setShowShop(false)}
        />
      )}

      {/* 3. Missions Drawer */}
      {showMissions && (
        <MissionsDrawer
          missions={missions}
          onClaim={handleClaimMission}
          onClose={() => setShowMissions(false)}
        />
      )}

      {/* 4. Leaderboard Modal */}
      {showLeaderboard && (
        <LeaderboardModal
          profile={profile}
          onClose={() => setShowLeaderboard(false)}
        />
      )}

      {/* 5. Profile Modal */}
      {showProfile && (
        <ProfileModal
          profile={profile}
          onUpdateName={(newName) => setProfile((p) => ({ ...p, name: newName }))}
          onClose={() => setShowProfile(false)}
        />
      )}

      {/* 6. Daily Spin Modal */}
      {showDailySpin && (
        <DailySpinModal
          onRewardClaimed={(type, amount) => {
            if (type === 'coins') {
              setProfile((p) => ({ ...p, coins: p.coins + amount }));
            } else if (type === 'gems') {
              setProfile((p) => ({ ...p, gems: p.gems + amount }));
            }
          }}
          onClose={() => setShowDailySpin(false)}
        />
      )}

      {/* 7. Tournament Modal */}
      {showTournament && (
        <TournamentModal
          profile={profile}
          onStartTournamentMatch={(round, opponent) => {
            initializeBoard('classic', 'vs_computer', 2, 1000);
          }}
          onClose={() => setShowTournament(false)}
        />
      )}

      {/* 8. Settings Modal */}
      {showSettings && (
        <SettingsModal
          settings={settings}
          onUpdateSettings={setSettings}
          onClose={() => setShowSettings(false)}
          onOpenAndroidApk={() => {
            setShowSettings(false);
            setShowAndroidApkModal(true);
          }}
        />
      )}

      {/* 9. Matchmaking Modal */}
      {showMatchmaking && (
        <MatchmakingModal
          playerCount={4}
          onMatchFound={() => {
            setShowMatchmaking(false);
            initializeBoard(gameMode, 'vs_computer', 4, matchStake);
          }}
          onCancel={() => setShowMatchmaking(false)}
        />
      )}

      {/* 10. Ad Monetization & Earning Hub Modal */}
      <AdMonetizationModal
        adConfig={adConfig}
        isOpen={showAdMonetization}
        onClose={() => setShowAdMonetization(false)}
        onSaveConfig={(newConfig) => setAdConfig(newConfig)}
        onWatchRewardedAd={() => {
          setShowAdMonetization(false);
          setShowRewardedAd(true);
        }}
      />

      {/* 11. Rewarded Video Ad Modal */}
      <RewardedAdModal
        isOpen={showRewardedAd}
        onClose={() => setShowRewardedAd(false)}
        onRewardClaimed={handleRewardedAdClaimed}
      />

      {/* 12. Replay 2x 30s Ads, +10 Diamonds & Rank Push Modal */}
      <ReplayAdRewardModal
        isOpen={showReplayAdModal}
        onClose={() => setShowReplayAdModal(false)}
        onCompleteAndReplay={({ diamonds, rankPointsBonus }) => {
          // 1. Give 10 diamonds and push rank
          const updatedDiamonds = profile.gems + diamonds;
          const updatedPoints = profile.rankPoints + rankPointsBonus;
          const updatedTier = getRankTierFromPoints(updatedPoints);

          const updatedProfile: UserProfile = {
            ...profile,
            gems: updatedDiamonds,
            rankPoints: updatedPoints,
            rankTier: updatedTier,
          };
          setProfile(updatedProfile);
          saveProfile(updatedProfile);

          // 2. Track ad impressions and creator revenue
          const updatedAdConfig: AdConfig = {
            ...adConfig,
            impressions: adConfig.impressions + 2,
            revenueEarned: Number((adConfig.revenueEarned + 0.08).toFixed(2)),
          };
          setAdConfig(updatedAdConfig);
          saveAdConfig(updatedAdConfig);

          // 3. Clear winner and replay match immediately
          setShowReplayAdModal(false);
          setWinner(null);
          initializeBoard(
            gameMode,
            matchType,
            players.length as any,
            matchStake,
            currentMatchPlayerNames
          );
        }}
      />

      {/* 13. Android APK & Install Modal */}
      <AndroidApkModal
        isOpen={showAndroidApkModal}
        onClose={() => setShowAndroidApkModal(false)}
      />
    </div>
  );
}
