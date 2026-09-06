import React, { useState } from 'react';
import { TournamentMatch, UserProfile } from '../types';
import { Trophy, Swords, X, Check, Award, Play } from 'lucide-react';
import { sound } from '../utils/audio';

interface TournamentModalProps {
  profile: UserProfile;
  onStartTournamentMatch: (round: 'Quarterfinals' | 'Semifinals' | 'Grand Final', opponent: string) => void;
  onClose: () => void;
}

export const TournamentModal: React.FC<TournamentModalProps> = ({
  profile,
  onStartTournamentMatch,
  onClose,
}) => {
  const [currentRound, setCurrentRound] = useState<'Quarterfinals' | 'Semifinals' | 'Grand Final'>('Quarterfinals');

  const TOURNAMENT_BRACKET = [
    { id: 'q1', round: 'Quarterfinals', p1: profile.name, p2: 'CyberBot 9000', winner: currentRound !== 'Quarterfinals' ? profile.name : undefined, isUser: true },
    { id: 'q2', round: 'Quarterfinals', p1: 'Elena_V', p2: 'ShadowStriker', winner: 'Elena_V' },
    { id: 'q3', round: 'Quarterfinals', p1: 'Marcus_Prime', p2: 'GoldenDice', winner: 'Marcus_Prime' },
    { id: 'q4', round: 'Quarterfinals', p1: 'Aarav "King"', p2: 'BlazeRunner', winner: 'Aarav "King"' },

    { id: 's1', round: 'Semifinals', p1: profile.name, p2: 'Elena_V', winner: currentRound === 'Grand Final' ? profile.name : undefined, isUser: true },
    { id: 's2', round: 'Semifinals', p1: 'Marcus_Prime', p2: 'Aarav "King"', winner: 'Aarav "King"' },

    { id: 'f1', round: 'Grand Final', p1: profile.name, p2: 'Aarav "King"', isUser: true },
  ];

  const handlePlayCurrent = () => {
    sound.playClick();
    const opponent = currentRound === 'Quarterfinals' ? 'CyberBot 9000' : currentRound === 'Semifinals' ? 'Elena_V' : 'Aarav "King"';
    onStartTournamentMatch(currentRound, opponent);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl relative flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-black text-lg text-white">Championship Bracket Cup</h3>
              <p className="text-xs text-slate-400">8 Players • 3 Rounds • 5,000 Coin Champion Trophy</p>
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

        {/* Bracket Columns */}
        <div className="grid grid-cols-3 gap-3 py-4 flex-1 overflow-y-auto">
          {/* Quarterfinals */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-black text-amber-400 uppercase tracking-wider text-center">
              Quarterfinals
            </span>
            {TOURNAMENT_BRACKET.slice(0, 4).map((m) => (
              <div
                key={m.id}
                className={`p-2.5 rounded-xl border text-xs flex flex-col gap-1 ${
                  m.isUser
                    ? 'bg-amber-950/40 border-amber-500/50'
                    : 'bg-slate-950/60 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between font-bold text-slate-200">
                  <span className="truncate max-w-[80px]">{m.p1}</span>
                  {m.winner === m.p1 && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                </div>
                <div className="flex items-center justify-between font-bold text-slate-400 border-t border-slate-800/80 pt-1">
                  <span className="truncate max-w-[80px]">{m.p2}</span>
                  {m.winner === m.p2 && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                </div>
              </div>
            ))}
          </div>

          {/* Semifinals */}
          <div className="flex flex-col gap-3 justify-around">
            <span className="text-xs font-black text-amber-400 uppercase tracking-wider text-center">
              Semifinals
            </span>
            {TOURNAMENT_BRACKET.slice(4, 6).map((m) => (
              <div
                key={m.id}
                className={`p-2.5 rounded-xl border text-xs flex flex-col gap-1 ${
                  m.isUser
                    ? 'bg-amber-950/40 border-amber-500/50'
                    : 'bg-slate-950/60 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between font-bold text-slate-200">
                  <span className="truncate max-w-[80px]">{m.p1}</span>
                  {m.winner === m.p1 && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                </div>
                <div className="flex items-center justify-between font-bold text-slate-400 border-t border-slate-800/80 pt-1">
                  <span className="truncate max-w-[80px]">{m.p2}</span>
                  {m.winner === m.p2 && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                </div>
              </div>
            ))}
          </div>

          {/* Grand Final */}
          <div className="flex flex-col gap-3 justify-center">
            <span className="text-xs font-black text-amber-400 uppercase tracking-wider text-center">
              Grand Final 👑
            </span>
            <div className="p-3 rounded-2xl bg-amber-950/40 border border-amber-400 text-xs flex flex-col gap-1.5 shadow-lg">
              <div className="flex items-center justify-between font-bold text-amber-200">
                <span>{profile.name} (YOU)</span>
              </div>
              <div className="text-[10px] text-center font-bold text-amber-400">VS</div>
              <div className="flex items-center justify-between font-bold text-amber-100 border-t border-amber-500/30 pt-1">
                <span>Aarav "King"</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            Current Stage: <span className="text-amber-400 font-bold">{currentRound}</span>
          </div>

          <button
            onClick={handlePlayCurrent}
            className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-display font-black text-xs sm:text-sm shadow-md shadow-amber-500/20 active:scale-95 flex items-center gap-2 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            Enter {currentRound} Match
          </button>
        </div>
      </div>
    </div>
  );
};
