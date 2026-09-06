import React, { useState, useEffect } from 'react';
import { AdConfig, AdCampaign } from '../types';
import { 
  DollarSign, 
  ExternalLink, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Info, 
  Settings, 
  TrendingUp, 
  X,
  Eye,
  MousePointerClick
} from 'lucide-react';
import { sound } from '../utils/audio';

interface TopLeftBannerAdProps {
  adConfig: AdConfig;
  onAdClick: () => void;
  onOpenMonetization: () => void;
  onToggleCollapse?: () => void;
}

const SAMPLE_CAMPAIGNS: AdCampaign[] = [
  {
    id: 'ad_1',
    brand: 'Google Play Pass',
    headline: 'Play 1,000+ Games Ad-Free',
    subtext: 'Try 1 month free. Cancel anytime.',
    ctaText: 'Claim Free Pass',
    tag: 'SPONSORED',
    badgeColor: 'bg-emerald-500',
    icon: '🎮',
    targetUrl: 'https://play.google.com/store/games',
  },
  {
    id: 'ad_2',
    brand: 'Samsung Galaxy Gaming',
    headline: 'Next-Gen Ultra Display',
    subtext: 'Super AMOLED 120Hz smooth gameplay.',
    ctaText: 'Explore Now',
    tag: 'SPECIAL OFFER',
    badgeColor: 'bg-sky-500',
    icon: '📱',
    targetUrl: 'https://www.samsung.com',
  },
  {
    id: 'ad_3',
    brand: 'Zomato Gaming Snacks',
    headline: 'Flat 50% Off On Game Nights',
    subtext: 'Get hot pizza & cold drinks in 20 mins.',
    ctaText: 'Order Food',
    tag: '50% OFF',
    badgeColor: 'bg-rose-500',
    icon: '🍕',
    targetUrl: 'https://www.zomato.com',
  },
  {
    id: 'ad_4',
    brand: 'CryptoLoot Web3 Arena',
    headline: 'Win NFT Skins & Mystery Box',
    subtext: 'Daily airdrops for top board players.',
    ctaText: 'Open Box',
    tag: 'HOT PROMO',
    badgeColor: 'bg-amber-500',
    icon: '🪙',
    targetUrl: 'https://bitcoin.org',
  },
];

export const TopLeftBannerAd: React.FC<TopLeftBannerAdProps> = ({
  adConfig,
  onAdClick,
  onOpenMonetization,
}) => {
  const [currentCampIndex, setCurrentCampIndex] = useState(0);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [adSenseLoaded, setAdSenseLoaded] = useState(false);

  // Auto-rotate promotional campaigns every 12 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentCampIndex((prev) => (prev + 1) % SAMPLE_CAMPAIGNS.length);
    }, 12000);
    return () => clearInterval(timer);
  }, []);

  // Google AdSense Script Injection if live Publisher ID is configured
  useEffect(() => {
    if (adConfig.adSenseEnabled && adConfig.adSensePublisherId) {
      const scriptId = 'google-adsense-script';
      if (!document.getElementById(scriptId)) {
        const script = document.createElement('script');
        script.id = scriptId;
        script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(
          adConfig.adSensePublisherId
        )}`;
        script.async = true;
        script.crossOrigin = 'anonymous';
        script.onload = () => setAdSenseLoaded(true);
        script.onerror = () => setAdSenseLoaded(false);
        document.head.appendChild(script);
      } else {
        setAdSenseLoaded(true);
      }
    }
  }, [adConfig.adSenseEnabled, adConfig.adSensePublisherId]);

  const campaign = SAMPLE_CAMPAIGNS[currentCampIndex];

  const handleBannerClick = () => {
    sound.playClick();
    onAdClick();
    // Open target in new tab safely
    if (campaign.targetUrl) {
      window.open(campaign.targetUrl, '_blank', 'noopener,noreferrer');
    }
  };

  // If collapsed, show a sleek pill button in the top-left corner
  if (isCollapsed) {
    return (
      <div className="fixed top-14 sm:top-16 left-2 sm:left-4 z-30 animate-in fade-in slide-in-from-left-4">
        <button
          onClick={() => {
            sound.playClick();
            setIsCollapsed(false);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-amber-500/40 text-xs font-bold text-amber-300 shadow-xl backdrop-blur-md hover:bg-slate-850 hover:border-amber-400 transition-all cursor-pointer group"
          title="Show Banner Ad & Monetization Stats"
        >
          <span className="text-xs">📢</span>
          <span className="font-display">Banner Ad</span>
          <span className="px-1 py-0.2 bg-emerald-500/20 text-emerald-300 text-[10px] rounded font-mono">
            ₹{adConfig.earningsInr.toFixed(1)}
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed top-14 sm:top-16 left-2 sm:left-4 z-30 max-w-[340px] w-[calc(100vw-16px)] sm:w-[330px] animate-in fade-in slide-in-from-left-4 select-none">
      <div className="bg-slate-900/95 backdrop-blur-xl border border-amber-500/30 rounded-2xl shadow-2xl p-2.5 flex flex-col gap-1.5 transition-all hover:border-amber-500/50">
        {/* Top Mini Header: Ad Badge, Earnings & Controls */}
        <div className="flex items-center justify-between text-[10px] text-slate-400 border-b border-slate-800 pb-1 px-1">
          <div className="flex items-center gap-1.5">
            <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 font-black tracking-wider border border-amber-500/30">
              AD
            </span>
            <span className="text-slate-400 font-medium hidden sm:inline">
              Sponsored
            </span>
            <span className="inline-flex items-center gap-0.5 text-emerald-400 font-bold ml-1 bg-emerald-950/40 px-1.5 py-0.2 rounded border border-emerald-500/20">
              <TrendingUp className="w-2.5 h-2.5" />
              <span>₹{adConfig.earningsInr.toFixed(1)} (${adConfig.earningsUsd.toFixed(2)})</span>
            </span>
          </div>

          <div className="flex items-center gap-1">
            {/* Monetization / Earning Settings Button */}
            <button
              onClick={() => {
                sound.playClick();
                onOpenMonetization();
              }}
              title="Ad Monetization & Earning Settings (कमाई और AdSense)"
              className="p-1 rounded-lg bg-slate-800/80 hover:bg-amber-500/20 text-slate-300 hover:text-amber-300 border border-slate-700/60 transition-colors cursor-pointer flex items-center gap-1 text-[10px] font-bold px-1.5"
            >
              <DollarSign className="w-2.5 h-2.5 text-amber-400" />
              <span className="hidden xs:inline">Earning</span>
            </button>

            {/* Minimize / Close */}
            <button
              onClick={() => {
                sound.playClick();
                setIsCollapsed(true);
              }}
              title="Minimize Banner"
              className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Live Google AdSense Banner (If configured and enabled) */}
        {adConfig.adSenseEnabled && adConfig.adSensePublisherId && adConfig.adSenseSlotId ? (
          <div className="w-full h-[75px] bg-slate-950 rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center relative">
            <ins
              className="adsbygoogle"
              style={{ display: 'inline-block', width: '320px', height: '75px' }}
              data-ad-client={adConfig.adSensePublisherId}
              data-ad-slot={adConfig.adSenseSlotId}
            />
          </div>
        ) : (
          /* Interactive High-CTR Sponsored Banner Display */
          <div
            onClick={handleBannerClick}
            className="group relative w-full bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-800 hover:border-amber-400/50 rounded-xl p-2 flex items-center justify-between gap-2.5 cursor-pointer transition-all hover:shadow-lg hover:shadow-amber-500/10 active:scale-[0.99]"
          >
            {/* Campaign Icon */}
            <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700/70 flex items-center justify-center text-xl flex-shrink-0 group-hover:scale-105 transition-transform">
              {campaign.icon}
            </div>

            {/* Content Text */}
            <div className="flex-1 min-w-0 flex flex-col justify-center">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-xs text-white truncate leading-tight group-hover:text-amber-300 transition-colors">
                  {campaign.headline}
                </span>
              </div>
              <div className="text-[10px] text-slate-400 truncate leading-tight mt-0.5">
                {campaign.subtext}
              </div>
              <div className="flex items-center gap-1 mt-1 text-[9px] text-slate-500 font-semibold">
                <span>{campaign.brand}</span>
                <span>•</span>
                <span className="text-amber-400/90 font-bold">{campaign.tag}</span>
              </div>
            </div>

            {/* CTA Button */}
            <div className="flex flex-col items-end justify-center flex-shrink-0">
              <div className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-display font-black text-[10px] flex items-center gap-1 shadow-sm group-hover:brightness-110 transition-all">
                <span>{campaign.ctaText}</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </div>
            </div>
          </div>
        )}

        {/* Bottom micro footer with Earning Tip */}
        <div className="flex items-center justify-between px-1 text-[9px] text-slate-500">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-0.5">
              <Eye className="w-2.5 h-2.5 text-slate-400" />
              <span>{adConfig.impressions} Views</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-0.5">
              <MousePointerClick className="w-2.5 h-2.5 text-slate-400" />
              <span>{adConfig.clicks} Clicks</span>
            </span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              sound.playClick();
              onOpenMonetization();
            }}
            className="text-amber-400/90 hover:text-amber-300 font-semibold cursor-pointer underline hover:no-underline"
          >
            AdSense Setup ⚙️
          </button>
        </div>
      </div>
    </div>
  );
};
