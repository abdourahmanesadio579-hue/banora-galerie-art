import React from 'react';
import { Artwork, Order } from '../../types/artwork';
import { useArt } from '../../context/ArtContext';
import { X, Printer, ShieldCheck, Award } from 'lucide-react';

interface Props {
  artwork: Artwork;
  order?: Order;
  onClose: () => void;
}

export const CertificateModal: React.FC<Props> = ({ artwork, order, onClose }) => {
  const { artistProfile } = useArt();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl bg-[#141311] border border-[#D4AF37]/40 shadow-2xl text-[#E8E4DF] overflow-hidden my-auto">
        {/* Header actions (hidden in print) */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-[#1A1815] border-b border-[#2C2923] print:hidden">
          <div className="flex items-center gap-2 text-xs text-[#D4AF37]">
            <Award className="w-4 h-4" />
            <span className="font-semibold uppercase tracking-wider">Aperçu du Certificat Officiel d'Authenticité</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 bg-[#D4AF37] hover:bg-[#E6C665] text-[#121110] font-bold rounded-lg text-xs flex items-center gap-1.5 transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" /> Imprimer le Certificat
            </button>
            <button
              onClick={onClose}
              className="text-[#A8A29E] hover:text-white p-1 rounded-lg hover:bg-white/5 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Printable Canvas Body */}
        <div className="p-8 sm:p-12 bg-[#FAF7F0] text-[#1A1815] font-serif border-8 border double border-[#C29B38] m-4 rounded-lg shadow-inner relative overflow-hidden print:m-0 print:border-4">
          {/* Subtle Watermark Seal */}
          <div className="absolute right-6 bottom-6 opacity-10 pointer-events-none select-none">
            <ShieldCheck className="w-48 h-48 text-[#A67C1E]" />
          </div>

          <div className="text-center space-y-2 border-b-2 border-[#D4AF37] pb-6">
            <span className="text-xs uppercase tracking-[0.35em] text-[#8C6D23] font-sans block">
              Atelier d'Art Contemporain
            </span>
            <h1 className="text-3xl sm:text-4xl uppercase tracking-[0.2em] font-normal text-[#121110]">
              Certificat d'Authenticité
            </h1>
            <p className="text-xs italic text-[#595243] font-sans">
              Attestation d'originalité et d'unicité de l'œuvre d'art
            </p>
          </div>

          <div className="py-8 space-y-6 text-sm">
            <p className="text-center text-xs leading-relaxed max-w-lg mx-auto font-sans text-[#383329]">
              Je soussigné, <strong>{artistProfile.name}</strong>, artiste peintre créateur, certifie par la présente que l’œuvre décrite ci-dessous est une création originale, unique et peinte de ma main.
            </p>

            {/* Artwork Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#F2EDE1] p-5 rounded-md border border-[#D9CEB8] text-xs font-sans">
              <div>
                <span className="text-[#7A7160] block text-[10px] uppercase tracking-wider">Titre de l'Œuvre :</span>
                <span className="font-serif text-lg font-bold text-[#141311]">{artwork.title}</span>
              </div>

              <div>
                <span className="text-[#7A7160] block text-[10px] uppercase tracking-wider">N° d'Inventaire Atelier :</span>
                <span className="font-mono text-sm font-semibold text-[#8C6D23]">{artwork.inventoryNumber}</span>
              </div>

              <div>
                <span className="text-[#7A7160] block text-[10px] uppercase tracking-wider">Technique & Médium :</span>
                <span className="font-medium text-[#2C2720]">{artwork.technique}</span>
              </div>

              <div>
                <span className="text-[#7A7160] block text-[10px] uppercase tracking-wider">Dimensions :</span>
                <span className="font-mono font-medium text-[#2C2720]">{artwork.dimensions}</span>
              </div>

              <div>
                <span className="text-[#7A7160] block text-[10px] uppercase tracking-wider">Année de création :</span>
                <span className="font-medium text-[#2C2720]">{artwork.year}</span>
              </div>

              <div>
                <span className="text-[#7A7160] block text-[10px] uppercase tracking-wider">Tirage :</span>
                <span className="font-bold text-[#8C6D23]">Pièce Unique 1/1 (Original)</span>
              </div>
            </div>

            {order && (
              <div className="text-xs font-sans text-[#4A4337] border-t border-[#DFD5C2] pt-3">
                <span className="font-semibold">Acquéreur enregistré :</span> {order.customerName} ({order.deliveryCity}, {order.deliveryCountry})
              </div>
            )}

            {/* Artist Signature & Stamp Area */}
            <div className="pt-8 flex justify-between items-end text-xs font-sans">
              <div>
                <span className="text-[#7A7160] block text-[10px]">Fait à Dakar, Sénégal</span>
                <span className="font-medium">{new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>

              <div className="text-center space-y-1">
                <span className="text-[10px] uppercase text-[#7A7160] tracking-wider block">Signature de l'Artiste</span>
                <div className="font-serif italic text-2xl text-[#8C6D23] font-bold py-1 border-b border-[#2C2720]/40 px-6">
                  {artistProfile.name}
                </div>
                <span className="text-[9px] text-[#7A7160] block">Artiste Peintre BANORA</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
