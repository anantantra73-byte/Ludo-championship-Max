import React, { useState } from 'react';
import { 
  X, 
  Smartphone, 
  Download, 
  CheckCircle2, 
  ExternalLink, 
  Copy, 
  Check, 
  ShieldCheck, 
  Zap,
  Sparkles,
  FileDown,
  Info
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { sound } from '../utils/audio';

interface AndroidApkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AndroidApkModal: React.FC<AndroidApkModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, install } = usePWAInstall();
  const [copied, setCopied] = useState(false);
  const [downloadStarted, setDownloadStarted] = useState(false);
  const [installing, setInstalling] = useState(false);
  const [activeTab, setActiveTab] = useState<'download_apk' | 'direct_pwa' | 'pwabuilder' | 'manual'>('download_apk');

  if (!isOpen) return null;

  const currentUrl = window.location.href.split('?')[0];
  const pwaBuilderUrl = `https://www.pwabuilder.com/reportcard?site=${encodeURIComponent(currentUrl)}`;

  const handleCopyLink = () => {
    sound.playClick();
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadClick = () => {
    sound.playReward();
    setDownloadStarted(true);
    setTimeout(() => setDownloadStarted(false), 5000);
  };

  const handleDirectInstall = async () => {
    sound.playClick();
    setInstalling(true);
    try {
      const success = await install();
      if (success) {
        sound.playReward();
      }
    } catch {
      // ignore
    } finally {
      setInstalling(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-emerald-500/40 rounded-3xl p-5 sm:p-6 shadow-2xl relative my-auto">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-24 bg-emerald-500/20 blur-3xl pointer-events-none rounded-full" />

        {/* Close Button */}
        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition-all cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with App Logo */}
        <div className="flex items-center gap-3.5 mb-4">
          <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-xl ring-2 ring-emerald-400/60 shrink-0 bg-slate-950">
            <img 
              src="/logo.png" 
              alt="Ludo King" 
              className="w-full h-full object-cover" 
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[10px] font-black uppercase tracking-wider mb-1">
              <Smartphone className="w-3 h-3" /> Android APK Package
            </div>
            <h2 className="text-xl sm:text-2xl font-display font-black text-white">
              Download Android APK
            </h2>
            <p className="text-xs text-slate-400">
              Ludo King • v1.0.0 Standalone Android Package (5.3 MB)
            </p>
          </div>
        </div>

        {/* PRIMARY DIRECT DOWNLOAD HERO CARD */}
        <div className="mb-5 p-4 rounded-2xl bg-gradient-to-br from-emerald-950/80 via-slate-900 to-slate-950 border-2 border-emerald-500 shadow-xl shadow-emerald-950/50 flex flex-col gap-3 relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-black shrink-0 shadow-lg shadow-emerald-500/30">
                <Download className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-emerald-400 block">
                  Direct Download Available
                </span>
                <span className="text-sm font-bold text-white">
                  Ludo-King-v1.0.apk
                </span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-bold">
              5.3 MB
            </span>
          </div>

          {/* Big Download Button */}
          <a
            href="/Ludo-King-v1.0.apk"
            download="Ludo-King-v1.0.apk"
            onClick={handleDownloadClick}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-display font-black text-base uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-lg shadow-emerald-500/40 transition-all transform active:scale-98 cursor-pointer"
          >
            <Download className="w-5 h-5 stroke-[2.5]" />
            <span>Download APK File Now</span>
          </a>

          {downloadStarted && (
            <div className="flex items-center gap-2 p-2.5 bg-emerald-900/60 border border-emerald-400 rounded-xl text-emerald-200 text-xs font-bold animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Download started! Check your browser downloads to tap &amp; install.</span>
            </div>
          )}

          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
            <span className="flex items-center gap-1 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" /> 100% Virus-Free &amp; Verified
            </span>
            <span>Android 5.0 and above</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="grid grid-cols-4 gap-1 p-1 bg-slate-950 rounded-2xl border border-slate-800 mb-4 text-[11px] font-bold">
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('download_apk');
            }}
            className={`py-2 px-1 rounded-xl transition-all text-center cursor-pointer ${
              activeTab === 'download_apk'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            APK Info
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('direct_pwa');
            }}
            className={`py-2 px-1 rounded-xl transition-all text-center cursor-pointer ${
              activeTab === 'direct_pwa'
                ? 'bg-teal-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            WebAPK Install
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('pwabuilder');
            }}
            className={`py-2 px-1 rounded-xl transition-all text-center cursor-pointer ${
              activeTab === 'pwabuilder'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            PWABuilder
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('manual');
            }}
            className={`py-2 px-1 rounded-xl transition-all text-center cursor-pointer ${
              activeTab === 'manual'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Phone Guide
          </button>
        </div>

        {/* TAB 1: APK Info & How to Install */}
        {activeTab === 'download_apk' && (
          <div className="flex flex-col gap-3 text-xs">
            <div className="bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800 flex flex-col gap-2.5">
              <h3 className="font-bold text-white flex items-center gap-1.5">
                <Info className="w-4 h-4 text-emerald-400" />
                How to install downloaded APK on Android:
              </h3>
              <ol className="list-decimal list-inside space-y-1.5 text-slate-300 pl-1 text-[11px]">
                <li>Click <strong>"Download APK File Now"</strong> above to save <code className="text-emerald-400">Ludo-King-v1.0.apk</code>.</li>
                <li>When download finishes, tap on the completed download notification or open your phone's <strong>Files / Downloads</strong> app.</li>
                <li>Tap <strong>Ludo-King-v1.0.apk</strong>. If prompted, toggle <em>"Allow from this source"</em> to enable APK installation.</li>
                <li>Tap <strong>Install</strong>. Ludo King will be ready in your app drawer!</li>
              </ol>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800">
                <span className="text-slate-500 block">Package Name</span>
                <span className="text-white font-mono font-bold">com.championship.ludoking</span>
              </div>
              <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800">
                <span className="text-slate-500 block">Target Android</span>
                <span className="text-emerald-400 font-bold">API 34 (Android 14 ready)</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: WebAPK Direct Chrome Install */}
        {activeTab === 'direct_pwa' && (
          <div className="flex flex-col gap-3">
            <div className="bg-slate-950/70 p-4 rounded-2xl border border-teal-500/30 flex flex-col gap-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    Direct Android WebAPK Installation
                  </h3>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Google Chrome on Android can automatically compile and install a signed WebAPK directly onto your device with zero warnings.
                  </p>
                </div>
              </div>

              {isInstalled ? (
                <div className="flex items-center gap-2 p-3 bg-emerald-950/40 border border-emerald-500/50 rounded-xl text-emerald-300 text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>App is already installed as a standalone Android app!</span>
                </div>
              ) : isInstallable ? (
                <button
                  onClick={handleDirectInstall}
                  disabled={installing}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-display font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  {installing ? 'Installing App...' : '1-Click Install WebAPK on Phone'}
                </button>
              ) : (
                <p className="text-xs text-slate-400 bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                  Open this website in <strong>Google Chrome</strong> on your Android phone and tap the menu <strong>(⋮) &rarr; Install app</strong> for 1-click WebAPK setup.
                </p>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: PWABuilder & Source */}
        {activeTab === 'pwabuilder' && (
          <div className="flex flex-col gap-3">
            <div className="bg-slate-950/70 p-4 rounded-2xl border border-amber-500/30 flex flex-col gap-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Cloud APK Builder &amp; Play Store Package
              </h3>
              <p className="text-xs text-slate-300">
                Generate an Android App Bundle (.aab) or signed APK using Microsoft &amp; Google's PWABuilder service:
              </p>

              <a
                href={pwaBuilderUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => sound.playClick()}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-display font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all"
              >
                <span>Open in PWABuilder</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <a
                href="/android-project.tar.gz"
                download="ludo-king-android-project.tar.gz"
                onClick={() => sound.playClick()}
                className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 font-bold text-xs flex items-center justify-center gap-2 transition-all"
              >
                <FileDown className="w-3.5 h-3.5 text-emerald-400" />
                <span>Download Android Studio Source Project (.tar.gz)</span>
              </a>
            </div>
          </div>
        )}

        {/* TAB 4: Manual Chrome Phone Guide */}
        {activeTab === 'manual' && (
          <div className="flex flex-col gap-2.5">
            <div className="bg-slate-950/70 p-3.5 rounded-2xl border border-purple-500/30 space-y-2 text-xs text-slate-300">
              <h3 className="font-bold text-white flex items-center gap-2 text-sm">
                <Smartphone className="w-4 h-4 text-purple-400" />
                Phone Installation Guide (हिन्दी)
              </h3>
              <div className="space-y-1.5 text-[11px]">
                <p>1. <strong>Direct APK Download:</strong> ऊपर दिए गए हरे बटन "Download APK File Now" पर टैप करें। फ़ाइल डाउनलोड होते ही उस पर टैप करके <strong>Install</strong> कर लें।</p>
                <p>2. <strong>Chrome में खोलें:</strong> अपने Android फोन में Chrome ब्राउज़र खोलें और नीचे दिए गए लिंक को कॉपी करके खोलें।</p>
                <p>3. <strong>Install App दबाएँ:</strong> Chrome में ऊपर दाएँ कोने में <strong>3 डॉट्स (⋮)</strong> दबाकर <strong>"Install app"</strong> चुनें।</p>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  readOnly
                  value={currentUrl}
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-[11px] text-amber-300 font-mono truncate focus:outline-none select-all"
                />
                <button
                  onClick={handleCopyLink}
                  className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1 transition-all cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <a
            href="/Ludo-King-v1.0.apk"
            download="Ludo-King-v1.0.apk"
            onClick={handleDownloadClick}
            className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Direct APK: Ludo-King-v1.0.apk</span>
          </a>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition-all cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
