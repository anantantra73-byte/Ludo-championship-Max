import { Player, PlayerColor, Token, GameMode } from '../types';
import { getGlobalTrackIndex, isSafeZone, SAFE_TRACK_INDICES } from './ludoBoardCoordinates';

export function getMovableTokens(player: Player, diceRoll: number): Token[] {
  return player.tokens.filter((t) => {
    // If in yard, can only move if rolled 6
    if (t.step === -1) {
      return diceRoll === 6;
    }
    // If already in home (57), cannot move
    if (t.step === 57) {
      return false;
    }
    // Cannot exceed 57
    return t.step + diceRoll <= 57;
  });
}

export function chooseBotTokenMove(
  botPlayer: Player,
  allPlayers: Player[],
  diceRoll: number,
  gameMode: GameMode
): Token | null {
  const movable = getMovableTokens(botPlayer, diceRoll);
  if (movable.length === 0) return null;
  if (movable.length === 1) return movable[0];

  let bestScore = -999999;
  let bestToken = movable[0];

  for (const token of movable) {
    let score = 0;
    const currentStep = token.step;
    const targetStep = currentStep === -1 ? 0 : currentStep + diceRoll;

    // 1. Moving token out of yard on a 6
    if (currentStep === -1 && targetStep === 0) {
      // Very valuable if bot has no tokens on board, or good general priority
      const tokensOnBoard = botPlayer.tokens.filter(t => t.step >= 0 && t.step < 57).length;
      score += tokensOnBoard === 0 ? 500 : 320;
    }

    // 2. Reaching exact home (step 57)
    if (targetStep === 57) {
      score += 1000;
    } else if (targetStep >= 52) {
      // Reaching home path (safe from all captures)
      score += 300 + targetStep;
    }

    // 3. Track captures and safe zones
    if (targetStep >= 0 && targetStep <= 51) {
      const targetGlobal = getGlobalTrackIndex(botPlayer.color, targetStep);
      const isTargetSafe = isSafeZone(targetGlobal);

      if (targetGlobal !== null) {
        // Check opponent captures
        for (const opp of allPlayers) {
          if (opp.id === botPlayer.id) continue;
          if (gameMode === 'team' && opp.team === botPlayer.team) continue; // don't capture teammate

          for (const oppToken of opp.tokens) {
            if (oppToken.step >= 0 && oppToken.step <= 51) {
              const oppGlobal = getGlobalTrackIndex(opp.color, oppToken.step);
              if (oppGlobal === targetGlobal) {
                if (!isTargetSafe && !oppToken.isShielded) {
                  // Capture opportunity!
                  score += 650 + oppToken.step * 4;
                }
              }
            }
          }
        }

        // Landing on safe zone
        if (isTargetSafe) {
          score += 180;
        }

        // Check danger: will target square be vulnerable to an opponent?
        if (!isTargetSafe) {
          for (const opp of allPlayers) {
            if (opp.id === botPlayer.id) continue;
            if (gameMode === 'team' && opp.team === botPlayer.team) continue;

            for (const oppToken of opp.tokens) {
              if (oppToken.step >= 0 && oppToken.step <= 51) {
                const oppGlobal = getGlobalTrackIndex(opp.color, oppToken.step);
                if (oppGlobal !== null) {
                  // Distance behind target
                  const dist = (targetGlobal - oppGlobal + 52) % 52;
                  if (dist >= 1 && dist <= 6) {
                    score -= (7 - dist) * 25; // Closer opponent is more dangerous
                  }
                }
              }
            }
          }
        }
      }
    }

    // 4. Escaping danger from current position
    if (currentStep >= 0 && currentStep <= 51) {
      const currentGlobal = getGlobalTrackIndex(botPlayer.color, currentStep);
      if (currentGlobal !== null && !isSafeZone(currentGlobal)) {
        for (const opp of allPlayers) {
          if (opp.id === botPlayer.id) continue;
          if (gameMode === 'team' && opp.team === botPlayer.team) continue;

          for (const oppToken of opp.tokens) {
            if (oppToken.step >= 0 && oppToken.step <= 51) {
              const oppGlobal = getGlobalTrackIndex(opp.color, oppToken.step);
              if (oppGlobal !== null) {
                const dist = (currentGlobal - oppGlobal + 52) % 52;
                if (dist >= 1 && dist <= 6) {
                  score += 240; // High incentive to escape!
                }
              }
            }
          }
        }
      }
    }

    // 5. General progression toward goal
    if (currentStep >= 0) {
      score += targetStep * 2;
    }

    // Add tiny human-like noise factor (+-10%)
    score += (Math.random() - 0.5) * 30;

    if (score > bestScore) {
      bestScore = score;
      bestToken = token;
    }
  }

  return bestToken;
}
