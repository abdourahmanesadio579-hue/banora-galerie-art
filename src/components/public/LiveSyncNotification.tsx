import React, { useState } from 'react';
import { useArt } from '../../context/ArtContext';
import { Sparkles, Bell, X, ArrowRight, Eye, CheckCircle } from 'lucide-react';

export const LiveSyncNotification: React.FC = () => {
  const {
    liveAlert,
    dismissLiveAlert,
    setSelectedArtwork,
    notificationsEnabled,
    requestNotificationPermission,
    isRealtimeConnected,
  } = useArt();

  const [promptDismissed, setPromptDismissed] = useState(() => {
    try {
      return localStorage.getItem('banora_notif_banner_dismissed') === 'true';
    } catch {
      return false;
    }
  });

  const handleDismissPrompt = () => {
    setPromptDismissed(true);
    try {
      localStorage.setItem('banora_notif_banner_dismissed', 'true');
    } catch {}
  };

  const handleEnableNotifications = async () => {
    const granted = await requestNotificationPermission();
    if (granted) {
      setPromptDismissed(true);
    }
  };

  return (
    <>
      {/* 1. Real-time Incoming New Artwork Toast Alert */}
      {liveAlert && (
        <aside
          role="region"
          aria-label="Alerte nouvelle œuvre"
          className="fixed top-22 right-4 left-4 sm:left-auto sm:w-[420px] z-50 animate-in slide-in-from-top-4 fade-in duration-300"
        >
          <div className="bg-[#181614] border-2 border-[#D4AF37] rounded-2xl p-4 shadow-[0_20px_50px_rgba(0,0,0,0.8)] text-[#FAF8F5] relative overflow-hidden backdrop-blur-xl">
            {/* Ambient gold glow */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#D4AF37]/20 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-start justify-between gap-3 relative z-10">
              <div className="flex items-start gap-3 min-w-0">
                {liveAlert.artwork?.imageUrl ? (
                  <img
                    src={liveAlert.artwork.imageUrl}
                    alt={liveAlert.artwork.title}
                    className="w-14 h-14 rounded-xl object-cover border border-[#D4AF37]/40 shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] shrink-0">
                    <Sparkles className="w-6 h-6" />
                  </div>
                )}

                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wider uppercase text-[#E6C665]">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Nouvelle Toile Publiée !</span>
                  </div>
                  <h4 className="font-serif font-bold text-sm text-white truncate">
                    {liveAlert.artwork?.title || liveAlert.title}
                  </h4>
                  <p className="text-xs text-[#C8C2B7] line-clamp-2">
                    {liveAlert.message}
                  </p>
                </div>
              </div>

              <button
                onClick={dismissLiveAlert}
                className="text-[#A8A29E] hover:text-white p-1 rounded-lg hover:bg-white/10 transition shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {liveAlert.artwork && (
              <div className="mt-3 pt-2.5 border-t border-[#2A2722] flex items-center justify-between gap-2 relative z-10">
                <span className="text-[11px] text-[#A8A29E]">
                  Disponible à l'atelier · {liveAlert.artwork.dimensions}
                </span>
                <button
                  onClick={() => {
                    if (liveAlert.artwork) {
                      setSelectedArtwork(liveAlert.artwork);
                      dismissLiveAlert();
                    }
                  }}
                  className="px-3 py-1 bg-[#D4AF37] hover:bg-[#E6C665] text-[#121110] font-bold rounded-lg text-xs flex items-center gap-1 transition cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  Voir l'œuvre
                </button>
              </div>
            )}
          </div>
        </aside>
      )}

      {/* 2. Discreet Notification Opt-In Prompt for Mobile/PWA Visitors */}
      {!notificationsEnabled && !promptDismissed && isRealtimeConnected && (
        <aside
          role="region"
          aria-label="Notification d'alerte en direct"
          className="fixed bottom-14 sm:bottom-4 right-4 left-4 sm:left-auto sm:max-w-md z-40 animate-in fade-in slide-in-from-bottom-2"
        >
          <div className="bg-[#1C1A17]/95 border border-[#D4AF37]/40 rounded-xl p-3 shadow-xl backdrop-blur-md flex items-center justify-between gap-3 text-xs text-[#E8E4DF]">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] shrink-0">
                <Bell className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-[#FAF8F5] truncate text-[11px]">
                  Alertes En Direct sur Mobile
                </div>
                <div className="text-[10px] text-[#A8A29E] truncate">
                  Recevez une alerte dès que BANORA publie une nouvelle toile.
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={handleEnableNotifications}
                className="px-2.5 py-1 bg-[#D4AF37] hover:bg-[#E6C665] text-[#121110] font-semibold rounded text-[11px] transition cursor-pointer"
              >
                Activer
              </button>
              <button
                onClick={handleDismissPrompt}
                className="text-[#8F8A81] hover:text-white p-1"
                title="Fermer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </aside>
      )}
    </>
  );
};
