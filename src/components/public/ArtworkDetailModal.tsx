import React, { useState } from 'react';
import { useArt, FRAME_PRICES } from '../../context/ArtContext';
import { FrameOption } from '../../types/artwork';
import {
  X,
  Eye,
  ShoppingBag,
  ShieldCheck,
  CheckCircle2,
  Share2,
  MessageCircle,
  Truck,
  Sparkles,
  Maximize2
} from 'lucide-react';

export const ArtworkDetailModal: React.FC = () => {
  const {
    selectedArtwork,
    setSelectedArtwork,
    setVisualizerArtwork,
    addToCart,
    formatPrice,
    artistProfile,
    currency
  } = useArt();

  const [activeFrame, setActiveFrame] = useState<FrameOption>('Sans cadre');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  if (!selectedArtwork) return null;

  const images = [selectedArtwork.imageUrl, ...(selectedArtwork.secondaryImages || [])];
  const frameCost = FRAME_PRICES[activeFrame];
  const totalPriceEUR = selectedArtwork.priceEUR + frameCost.eur;
  const totalPriceFCFA = selectedArtwork.priceFCFA + frameCost.fcfa;

  const handleShare = async () => {
    const shareData = {
      title: `${selectedArtwork.title} — BANORA Galerie`,
      text: `Découvrez "${selectedArtwork.title}", œuvre originale de l'artiste BANORA (${selectedArtwork.dimensions}, ${selectedArtwork.technique}).`,
      url: window.location.href,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // Ignored
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const getStatusBadge = () => {
    switch (selectedArtwork.status) {
      case 'disponible':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-1 rounded-md">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Œuvre originale disponible
          </span>
        );
      case 'reserve':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-400 bg-amber-950/60 border border-amber-500/30 px-2.5 py-1 rounded-md">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            Réservé (Option d'achat en cours)
          </span>
        );
      case 'vendu':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-400 bg-stone-900 border border-stone-700 px-2.5 py-1 rounded-md">
            <span className="w-1.5 h-1.5 rounded-full bg-stone-400" />
            Acquis · Collection privée
          </span>
        );
    }
  };

  const cleanWhatsappNumber = (artistProfile.whatsapp || '').replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${cleanWhatsappNumber}?text=${encodeURIComponent(
    `Bonjour BANORA, je suis très intéressé par votre tableau "${selectedArtwork.title}" (Réf: ${selectedArtwork.inventoryNumber}, ${selectedArtwork.dimensions}). Est-il possible d'échanger au sujet de cette œuvre ?`
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-5 md:p-8 overflow-y-auto">
      <div className="relative w-full max-w-5xl rounded-2xl bg-[#141311] border border-[#D4AF37]/30 shadow-2xl text-[#E8E4DF] overflow-hidden my-auto">
        {/* Close Button */}
        <button
          onClick={() => setSelectedArtwork(null)}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-[#1C1A17]/80 hover:bg-[#2C2924] border border-white/10 text-[#C8C2B7] hover:text-white flex items-center justify-center transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 max-h-[90vh] overflow-y-auto">
          {/* Left Column: Visuals & Thumbnails */}
          <div className="lg:col-span-7 bg-[#100F0E] p-4 sm:p-6 md:p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#24211C]">
            <div className="space-y-4">
              {/* Primary Image View with Zoom Toggle */}
              <div
                className={`relative rounded-xl overflow-hidden bg-[#181614] flex items-center justify-center transition-all ${
                  isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'
                }`}
                onClick={() => setIsZoomed(!isZoomed)}
              >
                <img
                  src={images[activeImageIndex]}
                  alt={selectedArtwork.title}
                  className={`w-full max-h-[500px] object-contain transition-transform duration-300 ${
                    isZoomed ? 'scale-150' : 'scale-100 hover:scale-102'
                  }`}
                />
                {!isZoomed && (
                  <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white/80 px-2 py-1 rounded text-[11px] flex items-center gap-1 pointer-events-none">
                    <Maximize2 className="w-3 h-3" /> Cliquer pour zoomer
                  </div>
                )}
              </div>

              {/* Secondary Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-2">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setActiveImageIndex(idx);
                        setIsZoomed(false);
                      }}
                      className={`relative w-16 h-16 rounded-lg overflow-hidden border transition cursor-pointer ${
                        activeImageIndex === idx
                          ? 'border-[#D4AF37] ring-2 ring-[#D4AF37]/30'
                          : 'border-white/10 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="Vue secondaire" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Visualizer & Share Quick Actions */}
            <div className="mt-6 pt-4 border-t border-[#221F1B] flex flex-wrap items-center justify-between gap-3 text-xs">
              <button
                onClick={() => {
                  setVisualizerArtwork(selectedArtwork);
                  setSelectedArtwork(null);
                }}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#221E19] hover:bg-[#2F2922] border border-[#D4AF37]/40 text-[#E6C665] font-medium transition cursor-pointer"
              >
                <Eye className="w-4 h-4 text-[#D4AF37]" />
                <span>Voir au mur (Visualiseur de salon)</span>
              </button>

              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#C8C2B7] transition cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{copied ? 'Lien copié !' : 'Partager'}</span>
              </button>
            </div>
          </div>

          {/* Right Column: Details, Specifications, Pricing & Cart */}
          <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-medium">
                  {selectedArtwork.category}
                </span>
                {getStatusBadge()}
              </div>

              <div>
                <h1 className="text-2xl sm:text-3xl font-serif text-[#FAF8F5] leading-snug">
                  {selectedArtwork.title}
                </h1>
                <p className="text-xs text-[#A8A29E] mt-1">
                  Par <strong>{artistProfile.name}</strong> · Année {selectedArtwork.year}
                </p>
              </div>

              {/* Price & Frame breakdown */}
              <div className="p-4 rounded-xl bg-[#1A1815] border border-[#2D2A24] space-y-2">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-[#A8A29E]">Prix de l'œuvre :</span>
                  <div className="text-right">
                    <span className="text-xl sm:text-2xl font-serif font-bold text-[#E6C665]">
                      {formatPrice(totalPriceEUR, totalPriceFCFA)}
                    </span>
                    {currency === 'EUR' ? (
                      <span className="block text-[11px] text-[#A8A29E]">
                        ≈ {formatPrice(0, totalPriceFCFA)}
                      </span>
                    ) : (
                      <span className="block text-[11px] text-[#A8A29E]">
                        ≈ {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(totalPriceEUR)}
                      </span>
                    )}
                  </div>
                </div>

                {activeFrame !== 'Sans cadre' && (
                  <div className="text-[11px] text-[#D4AF37] pt-1 border-t border-[#2A2722] flex justify-between">
                    <span>Option : {activeFrame}</span>
                    <span>+{formatPrice(frameCost.eur, frameCost.fcfa)} inclus</span>
                  </div>
                )}
              </div>

              {/* Frame selection */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-[#C8C2B7] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                  Option d'encadrement atelier :
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {(
                    [
                      'Sans cadre',
                      'Caisse américaine noire',
                      'Caisse américaine chêne naturel',
                      'Caisse américaine dorée',
                    ] as FrameOption[]
                  ).map((frame) => (
                    <button
                      key={frame}
                      onClick={() => setActiveFrame(frame)}
                      className={`p-2.5 rounded-lg border text-left transition cursor-pointer min-h-[44px] flex flex-col justify-center ${
                        activeFrame === frame
                          ? 'bg-[#2A251E] border-[#D4AF37] text-[#FAF8F5]'
                          : 'bg-[#181614] border-[#2A2722] text-[#A8A29E] hover:border-white/20'
                      }`}
                    >
                      <div className="font-medium truncate">{frame}</div>
                      <div className="text-[10px] text-[#A8A29E]">
                        {frame === 'Sans cadre'
                          ? 'Inclus'
                          : `+${formatPrice(FRAME_PRICES[frame].eur, FRAME_PRICES[frame].fcfa)}`}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Technical Specifications */}
              <div className="space-y-2 text-xs border-t border-[#24211C] pt-4">
                <h4 className="font-semibold text-[#FAF8F5] text-xs uppercase tracking-wider text-[11px]">
                  Fiche Technique
                </h4>
                <div className="grid grid-cols-2 gap-y-2 text-[#C8C2B7]">
                  <div>
                    <span className="text-[#8F8A81] block text-[11px]">Technique :</span>
                    <span className="font-medium text-white">{selectedArtwork.technique}</span>
                  </div>
                  <div>
                    <span className="text-[#8F8A81] block text-[11px]">Dimensions :</span>
                    <span className="font-mono font-medium text-white">{selectedArtwork.dimensions}</span>
                  </div>
                  <div>
                    <span className="text-[#8F8A81] block text-[11px]">N° Inventaire :</span>
                    <span className="font-mono text-white">{selectedArtwork.inventoryNumber}</span>
                  </div>
                  <div>
                    <span className="text-[#8F8A81] block text-[11px]">Poids estimé :</span>
                    <span className="text-white">{selectedArtwork.weightKg || 7} kg</span>
                  </div>
                </div>
              </div>

              {/* Artwork Description & Inspiration */}
              <div className="space-y-2 text-xs text-[#C8C2B7] border-t border-[#24211C] pt-3 leading-relaxed">
                <p>{selectedArtwork.description}</p>
                {selectedArtwork.inspiration && (
                  <p className="italic text-[#A8A29E] text-[11px] bg-[#181613] p-2.5 rounded-lg border-l-2 border-[#D4AF37]">
                    « {selectedArtwork.inspiration} »
                  </p>
                )}
              </div>

              {/* Trust badges */}
              <div className="p-3 rounded-xl bg-[#181613] border border-[#24211C] space-y-2 text-[11px] text-[#A8A29E]">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <span>Certificat d'authenticité original signé par BANORA inclus</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <span>Expédition d'art sécurisée sous caisse en bois sur mesure</span>
                </div>
              </div>
            </div>

            {/* Bottom Purchase & WhatsApp Contact Buttons */}
            <div className="pt-4 border-t border-[#24211C] space-y-2">
              {selectedArtwork.status === 'disponible' ? (
                <button
                  onClick={() => {
                    addToCart(selectedArtwork, activeFrame);
                    setSelectedArtwork(null);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-[#D4AF37] hover:bg-[#E6C665] text-[#121110] font-bold rounded-xl text-xs sm:text-sm tracking-wide transition cursor-pointer shadow-lg shadow-[#D4AF37]/20"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Acquérir cette œuvre ({formatPrice(totalPriceEUR, totalPriceFCFA)})
                </button>
              ) : selectedArtwork.status === 'reserve' ? (
                <div className="p-3 text-center bg-amber-950/40 border border-amber-600/30 rounded-xl text-xs text-amber-200">
                  Cette œuvre fait l'objet d'une option d'achat en cours. Vous pouvez contacter BANORA pour être placé sur liste d'attente.
                </div>
              ) : (
                <div className="p-3 text-center bg-stone-900 border border-stone-800 rounded-xl text-xs text-stone-400">
                  Cette œuvre a été acquise par une collection privée.
                </div>
              )}

              {/* Direct WhatsApp Contact Button */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#1F2C24] hover:bg-[#283B30] border border-emerald-600/40 text-emerald-300 font-medium rounded-xl text-xs transition cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                Contacter BANORA via WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
