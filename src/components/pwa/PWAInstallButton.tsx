import React, { useState } from 'react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { Download, Share2, PlusSquare, X, Smartphone, CheckCircle } from 'lucide-react';

interface Props {
  variant?: 'nav' | 'banner' | 'floating';
}

export const PWAInstallButton: React.FC<Props> = ({ variant = 'nav' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [justInstalled, setJustInstalled] = useState(false);

  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      const ok = await install();
      if (ok) {
        setJustInstalled(true);
        setTimeout(() => setJustInstalled(false), 4000);
      }
    } else if (isIOS) {
      setShowIOSGuide(true);
    } else {
      // Ambient guide for desktop or unsupported browsers
      setShowIOSGuide(true);
    }
  };

  return (
    <>
      {variant === 'nav' && (
        <button
          onClick={handleInstallClick}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#E6C665] bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/30 rounded-lg transition-all duration-200 cursor-pointer"
          title="Installer l'application PWA BANORA sur votre appareil"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Installer l'App</span>
          <span className="sm:hidden">App</span>
        </button>
      )}

      {variant === 'banner' && (
        <div className="bg-gradient-to-r from-[#1c1917] via-[#26221c] to-[#1c1917] border-y border-[#D4AF37]/20 px-4 py-2.5 text-xs flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-[#D6D0C5]">
            <Smartphone className="w-4 h-4 text-[#D4AF37] shrink-0" />
            <span>
              <strong className="text-[#FAF8F5] font-medium">Expérience Galerie PWA :</strong> Installez la galerie BANORA sur votre écran d'accueil pour naviguer sans connexion et admirer les toiles en plein écran.
            </span>
          </div>
          <button
            onClick={handleInstallClick}
            className="flex items-center gap-1.5 px-3 py-1 bg-[#D4AF37] hover:bg-[#E6C665] text-[#121110] font-semibold rounded text-xs transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Installer la PWA
          </button>
        </div>
      )}

      {/* iOS & Manual Install Guide Modal */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-[#1A1815] border border-[#D4AF37]/30 p-6 shadow-2xl text-[#E8E4DF] animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-[#2C2923]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center">
                  <Smartphone className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-[#FAF8F5]">Installer la PWA BANORA</h3>
                  <p className="text-xs text-[#A8A29E]">Accès direct plein écran et mode hors-ligne</p>
                </div>
              </div>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="text-[#A8A29E] hover:text-white p-1 rounded-lg hover:bg-[#25221B] transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3.5 text-xs text-[#D6D0C5]">
              <p className="leading-relaxed">
                Profitez d'un confort de visite fluide, instantané et autonome sur votre smartphone, tablette ou ordinateur :
              </p>

              <div className="p-3 rounded-xl bg-[#141311] border border-[#2A2722] space-y-2.5">
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">1</span>
                  <span>
                    Sur iPhone/iPad dans <strong>Safari</strong>, appuyez sur le bouton de partage <Share2 className="w-3.5 h-3.5 inline mx-1 text-[#D4AF37]" /> dans la barre de navigation.
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">2</span>
                  <span>
                    Faites défiler vers le bas puis touchez <strong className="text-white">Sur l'écran d'accueil</strong> <PlusSquare className="w-3.5 h-3.5 inline mx-1 text-[#D4AF37]" />.
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">3</span>
                  <span>
                    Sur Android / Chrome / Edge : touchez le menu ⋮ puis <strong className="text-white">« Installer l'application »</strong>.
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-[#A8A29E]">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Aucun téléchargement lourd, mise à jour automatique en arrière-plan.</span>
              </div>
            </div>

            <button
              onClick={() => setShowIOSGuide(false)}
              className="mt-5 w-full rounded-xl bg-[#D4AF37] py-2.5 text-xs font-semibold text-[#121110] hover:bg-[#E6C665] transition cursor-pointer"
            >
              Compris
            </button>
          </div>
        </div>
      )}

      {justInstalled && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-xl bg-emerald-900/90 border border-emerald-500/40 px-4 py-2.5 text-xs font-medium text-emerald-100 shadow-xl">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>Application BANORA installée avec succès !</span>
        </div>
      )}
    </>
  );
};
