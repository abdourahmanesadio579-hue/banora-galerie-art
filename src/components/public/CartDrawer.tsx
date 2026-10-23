import React, { useState } from 'react';
import { useArt } from '../../context/ArtContext';
import {
  X,
  Trash2,
  ShieldCheck,
  MessageCircle,
  Phone,
  Mail,
  Sparkles,
  ExternalLink
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    removeFromCart,
    clearCart,
    isCartOpen,
    setIsCartOpen,
    formatPrice,
    currency,
    artistProfile,
  } = useArt();

  if (!isCartOpen) return null;

  // Compute totals
  const totalEUR = cart.reduce(
    (sum, item) => sum + item.artwork.priceEUR + item.frameCostEUR,
    0
  );
  const totalFCFA = cart.reduce(
    (sum, item) => sum + item.artwork.priceFCFA + item.frameCostFCFA,
    0
  );

  const cleanWhatsapp = (artistProfile.whatsapp || '+221774508920').replace(/[^0-9]/g, '');

  const generateWhatsappMessage = () => {
    let msg = `Bonjour BANORA, je souhaite acquérir les œuvres suivantes depuis votre galerie :\n`;
    cart.forEach((item, idx) => {
      msg += `\n${idx + 1}. *${item.artwork.title}* (${item.artwork.dimensions})\n`;
      msg += `   - Référence : ${item.artwork.inventoryNumber}\n`;
      msg += `   - Cadre : ${item.frame}\n`;
      msg += `   - Prix : ${formatPrice(item.artwork.priceEUR + item.frameCostEUR, item.artwork.priceFCFA + item.frameCostFCFA)}\n`;
    });
    msg += `\n*Total de la sélection : ${formatPrice(totalEUR, totalFCFA)}*\n`;
    msg += `Merci de m'indiquer les modalités pour finaliser l'acquisition et organiser la livraison.`;
    return encodeURIComponent(msg);
  };

  const whatsappUrl = `https://wa.me/${cleanWhatsapp}?text=${generateWhatsappMessage()}`;
  const emailUrl = `mailto:${artistProfile.email || 'contact@galerie-banora.art'}?subject=${encodeURIComponent(
    'Demande d’acquisition d’œuvres — Galerie BANORA'
  )}&body=${encodeURIComponent(
    `Bonjour BANORA,\n\nJe souhaite acquérir les œuvres de ma sélection :\n` +
      cart.map((i) => `- ${i.artwork.title} (${formatPrice(i.artwork.priceEUR + i.frameCostEUR, i.artwork.priceFCFA + i.frameCostFCFA)})`).join('\n') +
      `\n\nTotal : ${formatPrice(totalEUR, totalFCFA)}\n\nMerci de me contacter pour procéder au règlement.`
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#141311] border-l border-[#2C2923] text-[#E8E4DF] flex flex-col h-full shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#24211C] bg-[#181613]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />
            <h2 className="text-base font-serif font-bold text-[#FAF8F5]">
              Sélection d'Œuvres & Contact Atelier
            </h2>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="text-[#A8A29E] hover:text-white p-1 rounded-lg hover:bg-[#25221B] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cart.length === 0 ? (
            <div className="py-20 text-center space-y-3">
              <div className="w-16 h-16 mx-auto rounded-full bg-[#1F1D1A] border border-[#2E2A23] flex items-center justify-center text-[#D4AF37]">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-serif text-[#FAF8F5]">Votre sélection est vide</h3>
              <p className="text-xs text-[#A8A29E] max-w-xs mx-auto">
                Parcourez la galerie et ajoutez une ou plusieurs toiles pour contacter directement l'artiste BANORA en vue d'une acquisition.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-[#1A1815] border border-[#D4AF37]/30 space-y-2">
                <div className="flex items-center gap-2 text-[#D4AF37] font-serif font-semibold text-sm">
                  <Sparkles className="w-4 h-4" />
                  <span>Acquisition directe auprès de l'Artiste</span>
                </div>
                <p className="text-xs text-[#C8C2B7] leading-relaxed">
                  Aucun paiement en ligne n'est requis sur le site. Pour acquérir une œuvre originale de BANORA, veuillez le contacter directement par WhatsApp ou par email afin de convenir du règlement et des modalités d'expédition sécurisée.
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="text-[11px] font-semibold text-[#8F8A81] uppercase tracking-wider">
                  Œuvres sélectionnées ({cart.length})
                </h4>
                {cart.map((item) => (
                  <div
                    key={item.artwork.id}
                    className="p-3.5 rounded-xl bg-[#1A1815] border border-[#26231D] flex gap-3.5 items-start"
                  >
                    <img
                      src={item.artwork.imageUrl}
                      alt={item.artwork.title}
                      className="w-20 h-20 object-cover rounded-lg border border-white/10 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-1">
                        <h4 className="font-serif font-semibold text-sm text-[#FAF8F5] truncate">
                          {item.artwork.title}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.artwork.id)}
                          className="text-[#8F8A81] hover:text-rose-400 p-1 transition cursor-pointer"
                          title="Retirer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="text-[11px] text-[#A8A29E] mt-0.5">
                        {item.artwork.dimensions} · {item.artwork.category}
                      </div>
                      <div className="text-[11px] text-[#D4AF37] mt-0.5">
                        Cadre : {item.frame}
                      </div>
                      <div className="font-serif font-bold text-[#E6C665] mt-1 text-xs">
                        {formatPrice(
                          item.artwork.priceEUR + item.frameCostEUR,
                          item.artwork.priceFCFA + item.frameCostFCFA
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total Box */}
              <div className="p-4 rounded-xl bg-[#181613] border border-[#26231D] space-y-2">
                <div className="flex justify-between items-center text-xs text-[#A8A29E]">
                  <span>Nombre d'œuvres :</span>
                  <span className="text-white font-medium">{cart.length}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-[#26231E]">
                  <span className="font-serif text-sm text-[#FAF8F5]">Valeur Totale :</span>
                  <span className="font-serif text-lg font-bold text-[#E6C665]">
                    {formatPrice(totalEUR, totalFCFA)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        {cart.length > 0 && (
          <div className="p-4 border-t border-[#24211C] bg-[#181613] space-y-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 bg-[#25D366] hover:bg-[#20ba59] text-black font-bold rounded-xl text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-950 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 fill-black" />
              <span>Contacter BANORA sur WhatsApp</span>
            </a>

            <div className="grid grid-cols-2 gap-2">
              <a
                href={emailUrl}
                className="py-2.5 bg-[#201E1A] hover:bg-[#2C2721] text-[#FAF8F5] border border-[#2D2A24] rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <Mail className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Par Email</span>
              </a>

              <a
                href={`tel:${artistProfile.phone || '+221774508920'}`}
                className="py-2.5 bg-[#201E1A] hover:bg-[#2C2721] text-[#FAF8F5] border border-[#2D2A24] rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Appeler</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
