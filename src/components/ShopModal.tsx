import React, { useState } from 'react';
import { UserProfile, DiceSkin, TokenSkin, BoardTheme } from '../types';
import { 
  X, 
  Coins, 
  Gem, 
  Check, 
  ShoppingBag, 
  Sparkles, 
  Dices, 
  ShieldCheck, 
  Layout, 
  User, 
  Award,
  Crown
} from 'lucide-react';
import { sound } from '../utils/audio';

interface ShopModalProps {
  profile: UserProfile;
  initialTab?: 'dice' | 'tokens' | 'boards' | 'avatars' | 'pass';
  onEquipDice: (dice: DiceSkin) => void;
  onEquipToken: (token: TokenSkin) => void;
  onEquipBoard: (board: BoardTheme) => void;
  onEquipAvatar: (avatar: string) => void;
  onBuyItem: (type: 'dice' | 'token' | 'board' | 'avatar', id: string, costType: 'coins' | 'gems', cost: number) => void;
  onUnlockPremiumPass: () => void;
  onClose: () => void;
}

export const ShopModal: React.FC<ShopModalProps> = ({
  profile,
  initialTab = 'dice',
  onEquipDice,
  onEquipToken,
  onEquipBoard,
  onEquipAvatar,
  onBuyItem,
  onUnlockPremiumPass,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'dice' | 'tokens' | 'boards' | 'avatars' | 'pass'>(initialTab);

  const DICE_ITEMS: { id: DiceSkin; name: string; desc: string; costType: 'coins' | 'gems'; cost: number; emoji: string }[] = [
    { id: 'ivory', name: 'Classic Ivory', desc: 'Timeless polished ceramic', costType: 'coins', cost: 0, emoji: '🎲' },
    { id: 'cyber', name: 'Cyber Neon', desc: 'Glowing cyan electric pulse', costType: 'coins', cost: 1500, emoji: '⚡' },
    { id: 'wooden', name: 'Artisan Wood', desc: 'Carved mahogany wood grain', costType: 'coins', cost: 800, emoji: '🪵' },
    { id: 'gold', name: 'Royal Gold', desc: 'Pure 24-karat gilded metal', costType: 'coins', cost: 3000, emoji: '✨' },
    { id: 'obsidian', name: 'Obsidian Flame', desc: 'Forged volcanic crimson rock', costType: 'gems', cost: 40, emoji: '🔥' },
    { id: 'cosmic', name: 'Cosmic Galaxy', desc: 'Starlight nebula crystal', costType: 'gems', cost: 60, emoji: '🌌' },
  ];

  const TOKEN_ITEMS: { id: TokenSkin; name: string; desc: string; costType: 'coins' | 'gems'; cost: number; emoji: string }[] = [
    { id: 'pawn', name: 'Classic Pawn', desc: 'Standard solid token', costType: 'coins', cost: 0, emoji: '♟️' },
    { id: 'crown', name: 'Imperial Crown', desc: 'Royal sovereign emblem', costType: 'coins', cost: 1000, emoji: '👑' },
    { id: 'gem', name: 'Radiant Gem', desc: 'Faceted prismatic jewel', costType: 'coins', cost: 1800, emoji: '💎' },
    { id: 'star', name: 'Celestial Star', desc: 'Five-point astral star', costType: 'gems', cost: 35, emoji: '⭐' },
    { id: 'dragon', name: 'Dragon Crest', desc: 'Ancient serpentine crest', costType: 'gems', cost: 50, emoji: '🐉' },
  ];

  const BOARD_ITEMS: { id: BoardTheme; name: string; desc: string; costType: 'coins' | 'gems'; cost: number; preview: string }[] = [
    { id: 'classic', name: 'Parchment Arena', desc: 'Warm traditional board', costType: 'coins', cost: 0, preview: 'bg-slate-800' },
    { id: 'cyberpunk', name: 'Neon Cyberpunk', desc: 'Dark synthwave aesthetic', costType: 'coins', cost: 2000, preview: 'bg-cyan-950 border-cyan-500' },
    { id: 'royal', name: 'Royal Palace', desc: 'Deep navy velvet and gold', costType: 'coins', cost: 3000, preview: 'bg-amber-950 border-amber-500' },
    { id: 'mystic', name: 'Mystic Forest', desc: 'Enchanted dusk glow', costType: 'gems', cost: 45, preview: 'bg-purple-950 border-purple-500' },
    { id: 'cosmic', name: 'Cosmic Space', desc: 'Deep nebula starry expanse', costType: 'gems', cost: 70, preview: 'bg-indigo-950 border-indigo-500' },
  ];

  const AVATAR_ITEMS = [
    '👑', '🦁', '⚡', '🐉', '🎯', '🔥', '🦊', '🚀', '🐺', '🦅', '💎', '⚔️'
  ];

  const BATTLE_PASS_TIERS = [
    { tier: 1, freeReward: '500 Coins', premiumReward: 'Cyber Dice Skin', icon: '🎁' },
    { tier: 2, freeReward: '50 XP', premiumReward: '3x Shield Power-up', icon: '🛡️' },
    { tier: 3, freeReward: '20 Gems', premiumReward: '5x Extra Dice', icon: '💎' },
    { tier: 4, freeReward: '1,000 Coins', premiumReward: 'Golden Laurel Frame', icon: '👑' },
    { tier: 5, freeReward: '100 XP', premiumReward: 'Dragon Crest Token', icon: '🐉' },
    { tier: 6, freeReward: '30 Gems', premiumReward: 'Cosmic Board Theme', icon: '🌌' },
    { tier: 7, freeReward: '2,500 Coins', premiumReward: 'Obsidian Dice Skin', icon: '🔥' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-3 sm:p-4 animate-in fade-in">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl relative flex flex-col max-h-[88vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-black text-lg text-white">Championship Shop & Pass</h3>
              <p className="text-xs text-slate-400">Cosmetics & customizations (non pay-to-win)</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1 bg-slate-950 rounded-full border border-slate-800 text-xs font-bold text-amber-300">
              <Coins className="w-3.5 h-3.5 text-amber-400" />
              <span>{profile.coins.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-slate-950 rounded-full border border-slate-800 text-xs font-bold text-emerald-300">
              <Gem className="w-3.5 h-3.5 text-emerald-400" />
              <span>{profile.gems.toLocaleString()}</span>
            </div>
            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab navigation */}
        <div className="flex items-center gap-1.5 py-3 border-b border-slate-800 overflow-x-auto">
          {[
            { id: 'dice', label: 'Dice Skins', icon: <Dices className="w-3.5 h-3.5" /> },
            { id: 'tokens', label: 'Token Skins', icon: <Sparkles className="w-3.5 h-3.5" /> },
            { id: 'boards', label: 'Board Themes', icon: <Layout className="w-3.5 h-3.5" /> },
            { id: 'avatars', label: 'Avatars', icon: <User className="w-3.5 h-3.5" /> },
            { id: 'pass', label: 'Battle Pass', icon: <Award className="w-3.5 h-3.5" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                sound.playClick();
                setActiveTab(tab.id as any);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto py-4 pr-1">
          {/* DICE SKINS */}
          {activeTab === 'dice' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {DICE_ITEMS.map((item) => {
                const isUnlocked = profile.unlockedDice.includes(item.id);
                const isEquipped = profile.equippedDice === item.id;
                const canAfford =
                  item.costType === 'coins'
                    ? profile.coins >= item.cost
                    : profile.gems >= item.cost;

                return (
                  <div
                    key={item.id}
                    className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 ${
                      isEquipped
                        ? 'bg-amber-950/40 border-amber-400'
                        : 'bg-slate-950/70 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-3xl p-2 rounded-xl bg-slate-900 border border-slate-800">
                        {item.emoji}
                      </div>
                      <div>
                        <div className="font-bold text-sm text-white">{item.name}</div>
                        <div className="text-xs text-slate-400">{item.desc}</div>
                      </div>
                    </div>

                    <div>
                      {isEquipped ? (
                        <span className="px-3 py-1 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center gap-1">
                          <Check className="w-3 h-3" /> Equipped
                        </span>
                      ) : isUnlocked ? (
                        <button
                          onClick={() => {
                            sound.playClick();
                            onEquipDice(item.id);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all cursor-pointer"
                        >
                          Equip
                        </button>
                      ) : (
                        <button
                          disabled={!canAfford}
                          onClick={() => {
                            sound.playPowerUp();
                            onBuyItem('dice', item.id, item.costType, item.cost);
                          }}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                            canAfford
                              ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 shadow-sm active:scale-95'
                              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                          }`}
                        >
                          {item.costType === 'coins' ? (
                            <Coins className="w-3 h-3 text-amber-950" />
                          ) : (
                            <Gem className="w-3 h-3 text-emerald-950" />
                          )}
                          <span>{item.cost}</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TOKEN SKINS */}
          {activeTab === 'tokens' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {TOKEN_ITEMS.map((item) => {
                const isUnlocked = profile.unlockedTokens.includes(item.id);
                const isEquipped = profile.equippedToken === item.id;
                const canAfford =
                  item.costType === 'coins'
                    ? profile.coins >= item.cost
                    : profile.gems >= item.cost;

                return (
                  <div
                    key={item.id}
                    className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 ${
                      isEquipped
                        ? 'bg-amber-950/40 border-amber-400'
                        : 'bg-slate-950/70 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-3xl p-2 rounded-xl bg-slate-900 border border-slate-800">
                        {item.emoji}
                      </div>
                      <div>
                        <div className="font-bold text-sm text-white">{item.name}</div>
                        <div className="text-xs text-slate-400">{item.desc}</div>
                      </div>
                    </div>

                    <div>
                      {isEquipped ? (
                        <span className="px-3 py-1 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center gap-1">
                          <Check className="w-3 h-3" /> Equipped
                        </span>
                      ) : isUnlocked ? (
                        <button
                          onClick={() => {
                            sound.playClick();
                            onEquipToken(item.id);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all cursor-pointer"
                        >
                          Equip
                        </button>
                      ) : (
                        <button
                          disabled={!canAfford}
                          onClick={() => {
                            sound.playPowerUp();
                            onBuyItem('token', item.id, item.costType, item.cost);
                          }}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                            canAfford
                              ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 shadow-sm active:scale-95'
                              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                          }`}
                        >
                          {item.costType === 'coins' ? (
                            <Coins className="w-3 h-3 text-amber-950" />
                          ) : (
                            <Gem className="w-3 h-3 text-emerald-950" />
                          )}
                          <span>{item.cost}</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* BOARD THEMES */}
          {activeTab === 'boards' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {BOARD_ITEMS.map((item) => {
                const isUnlocked = profile.unlockedBoards.includes(item.id);
                const isEquipped = profile.equippedBoard === item.id;
                const canAfford =
                  item.costType === 'coins'
                    ? profile.coins >= item.cost
                    : profile.gems >= item.cost;

                return (
                  <div
                    key={item.id}
                    className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 ${
                      isEquipped
                        ? 'bg-amber-950/40 border-amber-400'
                        : 'bg-slate-950/70 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl ${item.preview} border flex items-center justify-center text-sm shadow-inner`}>
                        🎯
                      </div>
                      <div>
                        <div className="font-bold text-sm text-white">{item.name}</div>
                        <div className="text-xs text-slate-400">{item.desc}</div>
                      </div>
                    </div>

                    <div>
                      {isEquipped ? (
                        <span className="px-3 py-1 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center gap-1">
                          <Check className="w-3 h-3" /> Active
                        </span>
                      ) : isUnlocked ? (
                        <button
                          onClick={() => {
                            sound.playClick();
                            onEquipBoard(item.id);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all cursor-pointer"
                        >
                          Equip
                        </button>
                      ) : (
                        <button
                          disabled={!canAfford}
                          onClick={() => {
                            sound.playPowerUp();
                            onBuyItem('board', item.id, item.costType, item.cost);
                          }}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                            canAfford
                              ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 shadow-sm active:scale-95'
                              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                          }`}
                        >
                          {item.costType === 'coins' ? (
                            <Coins className="w-3 h-3 text-amber-950" />
                          ) : (
                            <Gem className="w-3 h-3 text-emerald-950" />
                          )}
                          <span>{item.cost}</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* AVATARS */}
          {activeTab === 'avatars' && (
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
              {AVATAR_ITEMS.map((av) => {
                const isUnlocked = profile.unlockedAvatars.includes(av);
                const isEquipped = profile.avatar === av;

                return (
                  <button
                    key={av}
                    onClick={() => {
                      if (isUnlocked) {
                        sound.playClick();
                        onEquipAvatar(av);
                      } else if (profile.coins >= 500) {
                        sound.playPowerUp();
                        onBuyItem('avatar', av, 'coins', 500);
                      }
                    }}
                    className={`p-4 rounded-2xl border text-3xl flex flex-col items-center justify-center gap-2 transition-all cursor-pointer relative ${
                      isEquipped
                        ? 'bg-amber-950/50 border-amber-400 ring-2 ring-amber-400'
                        : isUnlocked
                        ? 'bg-slate-950/70 border-slate-800 hover:bg-slate-800'
                        : 'bg-slate-950/40 border-slate-850 opacity-50'
                    }`}
                  >
                    <span>{av}</span>
                    {isEquipped ? (
                      <span className="text-[10px] font-bold text-amber-400">Equipped</span>
                    ) : isUnlocked ? (
                      <span className="text-[10px] font-bold text-slate-400">Select</span>
                    ) : (
                      <span className="text-[10px] font-bold text-amber-300">500 C</span>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* BATTLE PASS */}
          {activeTab === 'pass' && (
            <div className="flex flex-col gap-4">
              {/* Season Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-900/40 via-amber-900/30 to-slate-900 border border-purple-500/40 flex items-center justify-between">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-black text-purple-300 uppercase tracking-wider mb-1">
                    <Crown className="w-4 h-4 text-amber-400" />
                    Season 1 Battle Pass
                  </div>
                  <h4 className="font-display font-black text-xl text-white">
                    Ludo Champions Arena
                  </h4>
                  <p className="text-xs text-slate-300">
                    Tier {profile.battlePassTier} / 10 • {profile.battlePassXp} XP
                  </p>
                </div>

                {!profile.isBattlePassPremium && (
                  <button
                    onClick={() => {
                      sound.playPowerUp();
                      onUnlockPremiumPass();
                    }}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-display font-black text-xs shadow-lg shadow-amber-500/20 active:scale-95 cursor-pointer"
                  >
                    Unlock Elite Pass (100 Gems)
                  </button>
                )}
              </div>

              {/* Tiers List */}
              <div className="flex flex-col gap-2">
                {BATTLE_PASS_TIERS.map((tier) => {
                  const isUnlocked = profile.battlePassTier >= tier.tier;

                  return (
                    <div
                      key={tier.tier}
                      className={`p-3 rounded-2xl border flex items-center justify-between gap-3 ${
                        isUnlocked
                          ? 'bg-slate-950/80 border-slate-700'
                          : 'bg-slate-950/40 border-slate-850 opacity-60'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center font-display font-black text-xs text-amber-400">
                          T{tier.tier}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-300">
                            Free Track: <span className="text-amber-300">{tier.freeReward}</span>
                          </div>
                          <div className="text-xs font-bold text-purple-300">
                            Elite Track: {tier.premiumReward}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {isUnlocked ? (
                          <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" /> Unlocked
                          </span>
                        ) : (
                          <span className="text-xs text-slate-500 font-medium">Locked</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
