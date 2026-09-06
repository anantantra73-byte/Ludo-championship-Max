import React, { useState } from 'react';
import { GameSettings } from '../types';
import { Settings, Volume2, VolumeX, Globe, Zap, Shield, AlertTriangle, X, Check, Smartphone, Download } from 'lucide-react';
import { sound } from '../utils/audio';

interface SettingsModalProps {
  settings: GameSettings;
  onUpdateSettings: (newSettings: GameSettings) => void;
  onClose: () => void;
  onOpenAndroidApk?: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  onUpdateSettings,
  onClose,
  onOpenAndroidApk,
}) => {
  const [reportSuccess, setReportSuccess] = useState(false);
  const [reportReason, setReportReason] = useState('');

  const languages: { id: GameSettings['language']; label: string }[] = [
    { id: 'en', label: 'English' },
    { id: 'hi', label: 'हिंदी (Hindi)' },
    { id: 'es', label: 'Español' },
    { id: 'fr', label: 'Français' },
    { id: 'de', label: 'Deutsch' },
    { id: 'ja', label: '日本語' },
  ];

  const handleReportSubmit = () => {
    if (reportReason.trim()) {
      sound.playClick();
      setReportSuccess(true);
      setTimeout(() => {
        setReportSuccess(false);
        setReportReason('');
      }, 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl relative flex flex-col max-h-[88vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-slate-800 text-amber-400">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-black text-lg text-white">Game Settings</h3>
              <p className="text-xs text-slate-400">Audio, language, speed & privacy controls</p>
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

        {/* Options List */}
        <div className="flex-1 overflow-y-auto py-4 flex flex-col gap-4 pr-1">
          {/* Android APK Banner */}
          <div className="bg-gradient-to-r from-emerald-950/60 to-slate-950 p-3.5 rounded-2xl border border-emerald-500/40 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  Android APK Package
                  <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded border border-emerald-500/40 font-black">
                    WEBAPK
                  </span>
                </h4>
                <p className="text-[11px] text-slate-300">
                  Install standalone app on phone or download APK
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <a
                href="/Ludo-King-v1.0.apk"
                download="Ludo-King-v1.0.apk"
                onClick={() => sound.playReward()}
                className="py-1.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download APK</span>
              </a>
              {onOpenAndroidApk && (
                <button
                  onClick={() => {
                    sound.playClick();
                    onOpenAndroidApk();
                  }}
                  className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all cursor-pointer"
                  title="More APK & Install Options"
                >
                  Guide
                </button>
              )}
            </div>
          </div>

          {/* Audio FX */}
          <div className="bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-amber-400" />
                Sound FX & Dice Audio
              </span>
              <button
                onClick={() => {
                  const updated = !settings.soundEnabled;
                  onUpdateSettings({ ...settings, soundEnabled: updated });
                  sound.setVolumes(settings.soundVolume, settings.musicVolume, !updated);
                }}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  settings.soundEnabled ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {settings.soundEnabled ? 'Enabled' : 'Muted'}
              </button>
            </div>

            {settings.soundEnabled && (
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={settings.soundVolume}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    onUpdateSettings({ ...settings, soundVolume: val });
                    sound.setVolumes(val, settings.musicVolume, !settings.soundEnabled);
                  }}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <span className="text-xs font-mono text-slate-400 w-8">
                  {Math.round(settings.soundVolume * 100)}%
                </span>
              </div>
            )}
          </div>

          {/* Animation Speed */}
          <div className="bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800 flex flex-col gap-2">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              Token Animation Speed
            </span>
            <div className="grid grid-cols-3 gap-2 mt-1">
              {(['normal', 'fast', 'turbo'] as const).map((spd) => (
                <button
                  key={spd}
                  onClick={() => {
                    sound.playClick();
                    onUpdateSettings({ ...settings, animSpeed: spd });
                  }}
                  className={`py-2 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                    settings.animSpeed === spd
                      ? 'bg-amber-500 text-black font-black shadow-sm'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {spd}
                </button>
              ))}
            </div>
          </div>

          {/* Language Selector */}
          <div className="bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800 flex flex-col gap-2">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-2">
              <Globe className="w-4 h-4 text-sky-400" />
              Language Selection
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-1">
              {languages.map((lang) => (
                <button
                  key={lang.id}
                  onClick={() => {
                    sound.playClick();
                    onUpdateSettings({ ...settings, language: lang.id });
                  }}
                  className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all truncate cursor-pointer ${
                    settings.language === lang.id
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>

          {/* Auto-Move Single Token */}
          <div className="bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-300">Auto-Move Single Token</div>
              <div className="text-[11px] text-slate-400">
                Automatically moves your token if only 1 move is possible
              </div>
            </div>
            <button
              onClick={() => {
                sound.playClick();
                onUpdateSettings({
                  ...settings,
                  autoMoveSingleToken: !settings.autoMoveSingleToken,
                });
              }}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                settings.autoMoveSingleToken
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              {settings.autoMoveSingleToken ? 'ON' : 'OFF'}
            </button>
          </div>

          {/* Report or Feedback */}
          <div className="bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800 flex flex-col gap-2">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              Fair Play & Player Report
            </span>
            <p className="text-[11px] text-slate-400">
              Report suspicious behavior or abusive names to our moderation queue.
            </p>
            <div className="flex gap-2 mt-1">
              <input
                type="text"
                placeholder="Reason or player tag..."
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
              />
              <button
                onClick={handleReportSubmit}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Submit
              </button>
            </div>
            {reportSuccess && (
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 mt-1">
                <Check className="w-3.5 h-3.5" /> Report filed securely. Thank you!
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
