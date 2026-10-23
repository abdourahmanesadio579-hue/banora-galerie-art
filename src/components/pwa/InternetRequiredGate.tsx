import React, { useEffect } from 'react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import { WifiOff, RefreshCw, ShieldAlert, Sparkles, Smartphone, Signal } from 'lucide-react';

export const InternetRequiredGate: React.FC = () => {
  const { isOnline, isChecking, checkConnectivity } = useOnlineStatus();

  // Prevent background scrolling when offline gate is active
  useEffect(() => {
    if (!isOnline) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOnline]);

  if (isOnline) {
    return null;
  }

  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-label="Connexion internet requise"
      className="fixed inset-0 z-[99999] bg-[#100F0E] text-[#E8E4DF] flex flex-col items-center justify-center p-4 sm:p-8 text-center select-none animate-in fade-in duration-300 overflow-y-auto"
    >
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-canvas-texture opacity-30 pointer-events-none" />
      <div className="absolute w-[450px] h-[450px] bg-[radial-gradient(circle,rgba(212,175,55,0.06)_0%,transparent_70%)] pointer-events-none" />

      <div className="relative z-10 max-w-md w-full mx-auto space-y-6">
        {/* Brand header */}
        <div className="space-y-1">
          <span className="font-serif text-3xl sm:text-4xl tracking-[0.25em] text-[#FAF8F5] uppercase">
            BANORA
          </span>
          <p className="text-[10px] tracking-[0.35em] text-[#D4AF37] uppercase font-light">
            Atelier & Galerie d'Art
          </p>
        </div>

        {/* Big Disconnected Icon with golden aura */}
        <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-amber-500/10 border-2 border-amber-500/30 animate-ping opacity-30" />
          <div className="w-20 h-20 rounded-full bg-[#1A1815] border-2 border-[#D4AF37] flex items-center justify-center text-[#E6C665] shadow-[0_0_30px_rgba(212,175,55,0.2)]">
            <WifiOff className="w-10 h-10" />
          </div>
        </div>

        {/* Title and Message */}
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-serif font-normal text-[#FAF8F5]">
            Connexion Internet Requise
          </h2>
          <p className="text-xs sm:text-sm text-[#E6C665] font-medium">
            Cette application est uniquement accessible avec une connexion réseau active.
          </p>
        </div>

        {/* Justification Box */}
        <div className="p-4 rounded-2xl bg-[#161412] border border-[#2D2821] text-left space-y-3 text-xs text-[#C8C2B7] shadow-xl">
          <div className="flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
            <span className="leading-relaxed">
              Pour vous garantir l'<strong>authenticité en temps réel</strong>, le suivi en direct de la disponibilité des toiles et l'accès direct aux nouvelles collections de <strong>BANORA</strong>, l'accès hors-ligne est strictement restreint.
            </span>
          </div>

          <div className="flex items-start gap-2.5 pt-2 border-t border-[#24211C] text-[11px] text-[#A8A29E]">
            <Smartphone className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
            <span>
              Activez vos données mobiles (4G/5G) ou connectez votre téléphone à un réseau Wi-Fi. Dès que le signal sera rétabli, l'application se débloquera automatiquement.
            </span>
          </div>
        </div>

        {/* Real-time status heartbeat */}
        <div className="flex items-center justify-center gap-2 text-xs text-[#8F8A81]">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span>
            {isChecking
              ? 'Test de la connexion réseau...'
              : 'En attente de connexion réseau (détection automatique)...'}
          </span>
        </div>

        {/* Manual retry button */}
        <div className="pt-2">
          <button
            onClick={() => checkConnectivity()}
            disabled={isChecking}
            className="w-full py-3 px-5 bg-[#D4AF37] hover:bg-[#E6C665] text-[#121110] font-bold rounded-xl text-xs uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-[#D4AF37]/20 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isChecking ? 'animate-spin' : ''}`} />
            {isChecking ? 'Vérification en cours...' : 'Vérifier la Connexion'}
          </button>
        </div>
      </div>
    </div>
  );
};
