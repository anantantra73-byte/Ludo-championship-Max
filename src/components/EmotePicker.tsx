import React, { useState } from 'react';
import { Smile, MessageSquare, X } from 'lucide-react';
import { sound } from '../utils/audio';

interface EmotePickerProps {
  onSendEmote: (emoji: string, text: string) => void;
}

const EMOTES = [
  { emoji: '😎', label: 'Cool' },
  { emoji: '🔥', label: 'Fire' },
  { emoji: '👑', label: 'King' },
  { emoji: '🥳', label: 'Party' },
  { emoji: '😭', label: 'Cry' },
  { emoji: '😡', label: 'Angry' },
  { emoji: '😱', label: 'Shocked' },
  { emoji: '💀', label: 'Dead' },
];

const QUICK_CHATS = [
  'Good Luck! 🍀',
  'Well Played! 👏',
  'Oops! 😅',
  'Hurry Up! ⏰',
  'Nice Roll! 🎲',
  'Watch Out! ⚠️',
  'GG! 🏆',
  'Thanks! 🙏',
];

export const EmotePicker: React.FC<EmotePickerProps> = ({ onSendEmote }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => {
          sound.playClick();
          setIsOpen(!isOpen);
        }}
        title="Emotes & Quick Chat"
        className="p-2.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-amber-400 border border-slate-700/80 shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center"
      >
        <Smile className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="absolute bottom-12 right-0 sm:left-0 z-50 w-64 bg-slate-900/95 backdrop-blur-md rounded-2xl border border-slate-700 shadow-2xl p-3 flex flex-col gap-2.5">
          <div className="flex items-center justify-between pb-1.5 border-b border-slate-800">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
              Emotes & Chat
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white p-0.5 rounded cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Emote Grid */}
          <div className="grid grid-cols-4 gap-1.5">
            {EMOTES.map((em) => (
              <button
                key={em.label}
                onClick={() => {
                  sound.playEmote();
                  onSendEmote(em.emoji, em.label);
                  setIsOpen(false);
                }}
                className="h-10 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 flex items-center justify-center text-xl hover:scale-110 active:scale-95 transition-all cursor-pointer shadow-sm"
              >
                {em.emoji}
              </button>
            ))}
          </div>

          {/* Quick Chat List */}
          <div className="flex flex-col gap-1 max-h-36 overflow-y-auto pt-1">
            {QUICK_CHATS.map((phrase) => (
              <button
                key={phrase}
                onClick={() => {
                  sound.playEmote();
                  onSendEmote('💬', phrase);
                  setIsOpen(false);
                }}
                className="text-left px-2.5 py-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-700 text-xs font-medium text-slate-200 hover:text-amber-300 transition-colors cursor-pointer"
              >
                {phrase}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
