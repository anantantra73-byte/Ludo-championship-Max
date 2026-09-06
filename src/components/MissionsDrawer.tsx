import React from 'react';
import { DailyMission } from '../types';
import { X, CheckCircle2, Award, Coins, Gem, Sparkles } from 'lucide-react';
import { sound } from '../utils/audio';

interface MissionsDrawerProps {
  missions: DailyMission[];
  onClaim: (missionId: string) => void;
  onClose: () => void;
}

export const MissionsDrawer: React.FC<MissionsDrawerProps> = ({
  missions,
  onClaim,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl relative flex flex-col gap-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-black text-lg text-white">Daily Missions & Challenges</h3>
              <p className="text-xs text-slate-400">Resets daily with new rewards</p>
            </div>
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

        {/* Mission List */}
        <div className="flex flex-col gap-2.5 max-h-[60vh] overflow-y-auto pr-1">
          {missions.map((mission) => {
            const isCompleted = mission.progress >= mission.target;
            const canClaim = isCompleted && !mission.isClaimed;

            return (
              <div
                key={mission.id}
                className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                  mission.isClaimed
                    ? 'bg-slate-950/40 border-slate-850 opacity-65'
                    : canClaim
                    ? 'bg-amber-950/30 border-amber-500/40 shadow-md'
                    : 'bg-slate-950/70 border-slate-800'
                }`}
              >
                <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-white truncate">
                      {mission.title}
                    </span>
                    {mission.isClaimed && (
                      <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-0.5">
                        <CheckCircle2 className="w-3 h-3" /> Claimed
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400">{mission.description}</p>

                  {/* Progress Bar */}
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          isCompleted ? 'bg-emerald-400' : 'bg-amber-400'
                        }`}
                        style={{
                          width: `${Math.min(100, (mission.progress / mission.target) * 100)}%`,
                        }}
                      />
                    </div>
                    <span className="text-[10px] font-bold text-slate-400">
                      {mission.progress}/{mission.target}
                    </span>
                  </div>
                </div>

                {/* Reward & Button */}
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-1 text-xs font-bold text-amber-300">
                    {mission.rewardType === 'coins' && <Coins className="w-3.5 h-3.5 text-amber-400" />}
                    {mission.rewardType === 'gems' && <Gem className="w-3.5 h-3.5 text-emerald-400" />}
                    {mission.rewardType === 'xp' && <Award className="w-3.5 h-3.5 text-purple-400" />}
                    <span>+{mission.rewardAmount}</span>
                  </div>

                  <button
                    disabled={!canClaim}
                    onClick={() => {
                      sound.playPowerUp();
                      onClaim(mission.id);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      canClaim
                        ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20 active:scale-95 animate-pulse'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    {mission.isClaimed ? 'Done' : canClaim ? 'Claim' : 'In Progress'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
