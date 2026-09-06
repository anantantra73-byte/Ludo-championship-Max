import React, { useState } from 'react';
import { AdConfig } from '../types';
import { 
  X, 
  DollarSign, 
  TrendingUp, 
  Eye, 
  MousePointerClick, 
  CheckCircle2, 
  HelpCircle, 
  ShieldCheck, 
  ExternalLink, 
  Zap, 
  Save, 
  Tv, 
  Coins,
  Sparkles
} from 'lucide-react';
import { sound } from '../utils/audio';

interface AdMonetizationModalProps {
  adConfig: AdConfig;
  isOpen: boolean;
  onClose: () => void;
  onSaveConfig: (newConfig: AdConfig) => void;
  onWatchRewardedAd: () => void;
}

export const AdMonetizationModal: React.FC<AdMonetizationModalProps> = ({
  adConfig,
  isOpen,
  onClose,
  onSaveConfig,
  onWatchRewardedAd,
}) => {
  const [publisherId, setPublisherId] = useState(adConfig.adSensePublisherId);
  const [slotId, setSlotId] = useState(adConfig.adSenseSlotId);
  const [adSenseEnabled, setAdSenseEnabled] = useState(adConfig.adSenseEnabled);
  const [showSavedToast, setShowSavedToast] = useState(false);
  const [activeTab, setActiveTab] = useState<'earnings' | 'settings' | 'guide'>('earnings');

  if (!isOpen) return null;

  const handleSave = () => {
    sound.playReward();
    onSaveConfig({
      ...adConfig,
      adSensePublisherId: publisherId.trim(),
      adSenseSlotId: slotId.trim(),
      adSenseEnabled: adSenseEnabled,
    });
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 2500);
  };

  const ctr = adConfig.impressions > 0 
    ? ((adConfig.clicks / adConfig.impressions) * 100).toFixed(1) 
    : '0.0';

  const ecpm = adConfig.impressions > 0
    ? ((adConfig.earningsUsd / adConfig.impressions) * 1000).toFixed(2)
    : '2.40';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-amber-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-amber-600/20 via-slate-900 to-amber-600/20 border-b border-slate-800 p-4 sm:p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 p-0.5 shadow-lg shadow-amber-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-amber-400">
                <DollarSign className="w-6 h-6" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-display font-black text-white">
                  Ad Monetization & Earnings
                </h2>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-full">
                  कमाई हब
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Top-Left Corner Banner Ad & Google AdSense Revenue Management
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 px-4 sm:px-6">
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('earnings');
            }}
            className={`py-3 px-4 text-xs font-bold transition-all border-b-2 cursor-pointer ${
              activeTab === 'earnings'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            📊 Live Earning Stats
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('settings');
            }}
            className={`py-3 px-4 text-xs font-bold transition-all border-b-2 cursor-pointer ${
              activeTab === 'settings'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            ⚙️ Google AdSense Setup
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('guide');
            }}
            className={`py-3 px-4 text-xs font-bold transition-all border-b-2 cursor-pointer ${
              activeTab === 'guide'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            📖 कमाई कैसे करें? (Guide)
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: Live Earnings */}
          {activeTab === 'earnings' && (
            <div className="space-y-5">
              {/* Primary Balance Card */}
              <div className="bg-gradient-to-br from-amber-500/15 via-slate-900 to-emerald-500/15 border border-amber-500/30 rounded-2xl p-5 shadow-lg">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Total Estimated Ad Earnings (कुल कमाई)
                    </span>
                    <div className="flex items-baseline gap-3 mt-1">
                      <span className="font-display font-black text-3xl sm:text-4xl text-amber-300">
                        ₹{adConfig.earningsInr.toFixed(2)}
                      </span>
                      <span className="text-lg font-bold text-emerald-400 font-mono">
                        (${adConfig.earningsUsd.toFixed(2)} USD)
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Top-Left Banner Ad + Interactive Game Impressions
                    </p>
                  </div>

                  {/* Rewarded Ad Action */}
                  <button
                    onClick={() => {
                      sound.playClick();
                      onWatchRewardedAd();
                    }}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-500/20 cursor-pointer transition-all hover:scale-105 active:scale-95"
                  >
                    <Tv className="w-4 h-4 text-amber-300" />
                    <span>Watch Rewarded Ad (+500 Coins)</span>
                  </button>
                </div>

                {/* Progress toward AdSense $100 Payout */}
                <div className="mt-4 pt-4 border-t border-slate-800">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-slate-400 font-semibold">
                      Google AdSense Payout Threshold ($100 / ~₹8,500)
                    </span>
                    <span className="text-amber-400 font-bold font-mono">
                      {Math.min(100, Math.round((adConfig.earningsUsd / 100) * 100))}%
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, Math.max(5, (adConfig.earningsUsd / 100) * 100))}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* 4 Metric Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3.5 flex flex-col">
                  <span className="text-slate-400 text-[11px] font-semibold flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5 text-sky-400" />
                    Impressions
                  </span>
                  <span className="font-display font-black text-xl text-white mt-1">
                    {adConfig.impressions.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-slate-500 mt-0.5">Top-Left Banner Views</span>
                </div>

                <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3.5 flex flex-col">
                  <span className="text-slate-400 text-[11px] font-semibold flex items-center gap-1">
                    <MousePointerClick className="w-3.5 h-3.5 text-amber-400" />
                    Ad Clicks
                  </span>
                  <span className="font-display font-black text-xl text-amber-300 mt-1">
                    {adConfig.clicks.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-slate-500 mt-0.5">High-CTR engagement</span>
                </div>

                <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3.5 flex flex-col">
                  <span className="text-slate-400 text-[11px] font-semibold flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                    Click Rate (CTR)
                  </span>
                  <span className="font-display font-black text-xl text-emerald-400 mt-1 font-mono">
                    {ctr}%
                  </span>
                  <span className="text-[10px] text-slate-500 mt-0.5">Industry avg: 1.5%</span>
                </div>

                <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3.5 flex flex-col">
                  <span className="text-slate-400 text-[11px] font-semibold flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5 text-purple-400" />
                    Est. eCPM
                  </span>
                  <span className="font-display font-black text-xl text-purple-300 mt-1 font-mono">
                    ${ecpm}
                  </span>
                  <span className="text-[10px] text-slate-500 mt-0.5">Per 1,000 game views</span>
                </div>
              </div>

              {/* Status Banner */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/15 flex items-center justify-center text-amber-400 flex-shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="text-xs text-slate-300 flex-1">
                  <strong className="text-white font-semibold">Active Ad Placement:</strong> Top-Left Corner Banner Ad is currently visible and collecting impressions as players roll dice and play matches.
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: AdSense Setup */}
          {activeTab === 'settings' && (
            <div className="space-y-5">
              <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-white flex items-center gap-2">
                      <span>Google AdSense Integration</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-sky-500/20 text-sky-400 font-mono">
                        Official SDK
                      </span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Connect your Google AdSense account to earn real money directly into your bank account.
                    </p>
                  </div>

                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={adSenseEnabled}
                      onChange={(e) => setAdSenseEnabled(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                  </label>
                </div>

                <div className="space-y-3 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      AdSense Publisher ID (Client ID)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. ca-pub-1234567890123456"
                      value={publisherId}
                      onChange={(e) => setPublisherId(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 font-mono focus:outline-none focus:border-amber-400"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">
                      Found in your Google AdSense Dashboard under <strong>Account &gt; Settings &gt; Publisher ID</strong>.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Banner Ad Unit Slot ID
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 9876543210"
                      value={slotId}
                      onChange={(e) => setSlotId(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 font-mono focus:outline-none focus:border-amber-400"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">
                      Create a display banner ad unit (320x100 or Responsive) in AdSense and copy its Slot ID.
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {showSavedToast && (
                      <span className="inline-flex items-center gap-1 text-emerald-400 text-xs font-bold animate-in fade-in">
                        <CheckCircle2 className="w-4 h-4" />
                        Settings Saved Successfully!
                      </span>
                    )}
                  </div>

                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-display font-black text-xs cursor-pointer shadow-lg shadow-amber-500/20 transition-all hover:scale-105 active:scale-95"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save & Apply Ads</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Hindi & English Monetization Guide */}
          {activeTab === 'guide' && (
            <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 space-y-2">
                <h4 className="font-display font-black text-sm text-amber-300 flex items-center gap-1.5">
                  <span>💡 इस गेम से पैसे (Earning) कैसे कमाएं?</span>
                </h4>
                <p>
                  आप इस लूडो गेम में एड्स लगाकर 2 तरीकों से मोटी कमाई कर सकते हैं:
                </p>
                <ol className="list-decimal list-inside space-y-1 text-slate-300 font-medium">
                  <li>
                    <strong className="text-white">Top-Left Banner Ad:</strong> स्क्रीन के ऊपर बाएं कोने पर लगातार बैनर एड दिखेगा, जिससे हर 1,000 व्यूज पर इंप्रेशन कमाई (eCPM) मिलेगी।
                  </li>
                  <li>
                    <strong className="text-white">Rewarded Video Ads:</strong> जब कोई खिलाड़ी फ्री कॉइन्स या शील्ड के लिए एड देखेगा, तो सबसे ज्यादा कमाई (High eCPM) होगी।
                  </li>
                </ol>
              </div>

              <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 space-y-3">
                <h4 className="font-bold text-sm text-white flex items-center gap-1.5">
                  <span>Google AdSense शुरू करने के आसान स्टेप्स:</span>
                </h4>
                <div className="space-y-2.5">
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                      1
                    </span>
                    <div>
                      <strong className="text-white">AdSense पर फ्री अकाउंट बनाएं:</strong>
                      <div className="text-slate-400">
                        <a 
                          href="https://adsense.google.com" 
                          target="_blank" 
                          rel="noreferrer" 
                          className="text-amber-400 underline hover:text-amber-300 inline-flex items-center gap-1"
                        >
                          adsense.google.com <ExternalLink className="w-3 h-3" />
                        </a> पर जाएं और अपने Google अकाउंट से साइन अप करें।
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                      2
                    </span>
                    <div>
                      <strong className="text-white">Publisher ID कॉपी करें:</strong>
                      <div className="text-slate-400">
                        AdSense Dashboard &gt; Settings &gt; Account Information से अपना Publisher ID (उदा. <code className="text-amber-300">ca-pub-1234567890123456</code>) कॉपी करें।
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                      3
                    </span>
                    <div>
                      <strong className="text-white">बैनर एड स्लॉट बनाएं:</strong>
                      <div className="text-slate-400">
                        Ad Units &gt; Display Ad (320x100 या Responsive) बनाकर उसका Slot ID निकालें और ऊपर दिए गए बॉक्स में भरें।
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                      4
                    </span>
                    <div>
                      <strong className="text-white">बैंक में पेमेंट कैसे आएगी?</strong>
                      <div className="text-slate-400">
                        जैसे ही आपकी कमाई $100 (~₹8,500) पहुंचती है, Google AdSense हर महीने की 21 से 26 तारीख को सीधे आपके भारतीय बैंक खाते (NEFT/Wire Transfer) में पैसे भेज देता है।
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-950/80 border-t border-slate-800 p-4 px-6 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            Current Banner Position: <strong className="text-amber-400">Top-Left Corner (ऊपर बाएं कोने में)</strong>
          </span>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs cursor-pointer transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
