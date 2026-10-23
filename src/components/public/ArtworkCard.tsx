import React from 'react';
import { Artwork } from '../../types/artwork';
import { useArt } from '../../context/ArtContext';
import { Eye, ShoppingBag, Sparkles } from 'lucide-react';

interface Props {
  artwork: Artwork;
}

export const ArtworkCard: React.FC<Props> = ({ artwork }) => {
  const { setSelectedArtwork, setVisualizerArtwork, addToCart, formatPrice } = useArt();

  const getStatusIndicator = () => {
    switch (artwork.status) {
      case 'disponible':
        return (
          <span className="text-emerald-400 font-medium text-xs flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            Disponible
          </span>
        );
      case 'reserve':
        return (
          <span className="text-amber-400 font-medium text-xs flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            Réservé
          </span>
        );
      case 'vendu':
        return (
          <span className="text-stone-400 font-medium text-xs flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-stone-500" />
            Collection privée
          </span>
        );
    }
  };

  return (
    <div className="group relative rounded-2xl bg-[#161513] border border-[#26231E] hover:border-[#D4AF37]/50 transition-all duration-300 flex flex-col overflow-hidden shadow-lg hover:shadow-2xl">
      {/* Artwork Image Container */}
      <div
        onClick={() => setSelectedArtwork(artwork)}
        className="relative aspect-[4/3] bg-[#0E0D0C] overflow-hidden cursor-pointer"
      >
        <img
          src={artwork.imageUrl}
          alt={artwork.title}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-106 transition-transform duration-700 ease-out select-none"
        />

        {/* Ambient Dark Gradient on Bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        {/* Quick Room View Floating Icon */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setVisualizerArtwork(artwork);
          }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#141311]/85 hover:bg-[#D4AF37] text-white hover:text-[#121110] border border-white/10 flex items-center justify-center transition shadow-md cursor-pointer"
          title="Voir cette œuvre au mur"
        >
          <Eye className="w-4 h-4" />
        </button>

        {artwork.isFeatured && (
          <div className="absolute top-3 left-3 bg-[#121110]/85 border border-[#D4AF37]/40 px-2 py-0.5 rounded text-[10px] font-medium text-[#E6C665] flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#D4AF37]" />
            Coup de Cœur
          </div>
        )}
      </div>

      {/* Artwork Content Info */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-1.5">
          {/* Clean Unboxed Metadata per Design Constitution */}
          <div className="flex items-center gap-2 text-xs text-[#A8A29E]">
            <span className="text-[#D4AF37] font-medium">{artwork.category}</span>
            <span aria-hidden="true">·</span>
            <span>{artwork.year}</span>
            <span aria-hidden="true">·</span>
            {getStatusIndicator()}
          </div>

          <h3
            onClick={() => setSelectedArtwork(artwork)}
            className="font-serif text-xl text-[#FAF8F5] group-hover:text-[#E6C665] transition line-clamp-1 cursor-pointer"
          >
            {artwork.title}
          </h3>

          <p className="text-xs sm:text-sm text-[#A8A29E] line-clamp-1">
            {artwork.technique}
          </p>

          <p className="text-xs font-mono text-[#8F8A81]">
            {artwork.dimensions} · Réf. {artwork.inventoryNumber}
          </p>
        </div>

        {/* Bottom Price & Buttons */}
        <div className="pt-3 border-t border-[#23201B] flex items-center justify-between gap-2">
          <div>
            <span className="text-[10px] text-[#8F8A81] uppercase tracking-wider block">Prix d'art</span>
            <span className="font-serif text-lg font-bold text-[#E6C665]">
              {formatPrice(artwork.priceEUR, artwork.priceFCFA)}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setSelectedArtwork(artwork)}
              className="px-3 py-1.5 rounded-lg bg-[#201E1A] hover:bg-[#2B2721] text-[#E8E4DF] text-xs font-medium border border-[#302B23] transition cursor-pointer"
            >
              Détails
            </button>

            {artwork.status === 'disponible' && (
              <button
                onClick={() => addToCart(artwork)}
                className="p-2 rounded-lg bg-[#D4AF37] hover:bg-[#E6C665] text-[#121110] transition cursor-pointer"
                title="Ajouter à ma sélection"
              >
                <ShoppingBag className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
