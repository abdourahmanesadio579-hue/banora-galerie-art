import React from 'react';
import { useArt } from '../../context/ArtContext';
import { ArrowDown, Eye, Sparkles, ShieldCheck, Award } from 'lucide-react';

export const Hero: React.FC = () => {
  const { artworks, setSelectedArtwork, setVisualizerArtwork, formatPrice, artistProfile } = useArt();

  const featured = artworks.find((a) => a.isFeatured && a.status === 'disponible') || artworks[0];

  const scrollToCatalog = () => {
    const el = document.getElementById('catalogue');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative overflow-hidden bg-[#121110] border-b border-[#24211C] pt-6 pb-16 lg:py-20">
      {/* Background ambient canvas texture and subtle warm light */}
      <div className="absolute inset-0 bg-canvas-texture opacity-40 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.08)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Manifesto & Narrative */}
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-[#D4AF37]">
              <span className="w-6 h-[1px] bg-[#D4AF37]" />
              <span>Galerie Officielle & Œuvres Originales</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-normal text-[#FAF8F5] tracking-tight leading-[1.12]">
              L'Artiste Peintre <br />
              <span className="italic font-light text-[#E6C665]">BANORA</span>
            </h1>

            <p className="text-base sm:text-lg text-[#C8C2B7] font-light leading-relaxed max-w-xl">
              Matières telluriques, pigments bruts et feuilles d’or. Chaque tableau est une pièce unique réalisée à la main dans l’atelier, accompagnée de son certificat d’authenticité signé.
            </p>

            {/* Quotation from Banora */}
            <blockquote className="border-l-2 border-[#D4AF37]/60 pl-4 py-1 text-xs sm:text-sm italic text-[#A8A29E] font-serif">
              {artistProfile.philosophy}
            </blockquote>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={scrollToCatalog}
                className="px-6 py-3.5 bg-[#D4AF37] hover:bg-[#E6C665] text-[#121110] font-semibold text-xs uppercase tracking-wider rounded-xl transition cursor-pointer shadow-lg shadow-[#D4AF37]/15 flex items-center gap-2"
              >
                Explorer la Collection
                <ArrowDown className="w-3.5 h-3.5" />
              </button>

              {featured && (
                <button
                  onClick={() => setVisualizerArtwork(featured)}
                  className="px-5 py-3.5 bg-[#1C1A17] hover:bg-[#2A2621] text-[#E8E4DF] hover:text-white border border-[#3A352C] hover:border-[#D4AF37]/40 text-xs uppercase tracking-wider rounded-xl transition cursor-pointer flex items-center gap-2"
                >
                  <Eye className="w-4 h-4 text-[#D4AF37]" />
                  Tester au Mur (3D)
                </button>
              )}
            </div>

            {/* Quiet unboxed metadata hallmarks */}
            <div className="pt-6 border-t border-[#221F1B] grid grid-cols-3 gap-4 text-xs text-[#A8A29E]">
              <div>
                <span className="block font-serif text-xl sm:text-2xl text-[#FAF8F5] font-semibold">100%</span>
                <span className="text-[11px] text-[#8F8A81]">Pièces uniques 1/1</span>
              </div>
              <div>
                <span className="block font-serif text-xl sm:text-2xl text-[#FAF8F5] font-semibold">Certifié</span>
                <span className="text-[11px] text-[#8F8A81]">Authenticité d'art</span>
              </div>
              <div>
                <span className="block font-serif text-xl sm:text-2xl text-[#FAF8F5] font-semibold">Monde</span>
                <span className="text-[11px] text-[#8F8A81]">Caisse sécurisée</span>
              </div>
            </div>
          </div>

          {/* Right Column: Featured Masterpiece Spotlight */}
          {featured && (
            <div className="lg:col-span-6">
              <div className="relative group mx-auto max-w-md lg:max-w-none">
                {/* Golden ambient frame shadow */}
                <div className="absolute -inset-1.5 bg-gradient-to-r from-[#D4AF37]/20 via-[#F3E5AB]/10 to-[#996515]/20 rounded-2xl blur-md opacity-70 group-hover:opacity-100 transition duration-500" />

                <div className="relative rounded-2xl bg-[#181614] border border-[#2D2821] overflow-hidden p-3 shadow-2xl">
                  {/* Artwork Image with Frame Preview */}
                  <div className="relative rounded-xl overflow-hidden aspect-[4/3] sm:aspect-[16/11] bg-[#100F0D]">
                    <img
                      src={featured.imageUrl}
                      alt={featured.title}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 select-none"
                    />

                    {/* Top Tag */}
                    <div className="absolute top-3 left-3 bg-[#121110]/80 backdrop-blur-md border border-[#D4AF37]/40 px-2.5 py-1 rounded text-[11px] font-medium text-[#E6C665] flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                      Œuvre Maîtresse à la Une
                    </div>

                    {/* Quick Room View Button */}
                    <button
                      onClick={() => setVisualizerArtwork(featured)}
                      className="absolute bottom-3 right-3 bg-[#121110]/85 hover:bg-[#D4AF37] hover:text-[#121110] text-[#E8E4DF] border border-white/10 px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition backdrop-blur-sm cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Voir au salon
                    </button>
                  </div>

                  {/* Artwork Card Info */}
                  <div className="p-4 sm:p-5 flex items-end justify-between gap-4">
                    <div className="space-y-1 min-w-0">
                      <div className="text-[11px] uppercase tracking-widest text-[#D4AF37]">
                        {featured.category} · {featured.year}
                      </div>
                      <h3 className="font-serif text-xl sm:text-2xl text-[#FAF8F5] truncate">
                        {featured.title}
                      </h3>
                      <p className="text-xs text-[#A8A29E] truncate">
                        {featured.technique} · {featured.dimensions}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-xs text-[#8F8A81]">Acquisition :</div>
                      <div className="font-serif text-lg sm:text-xl font-bold text-[#E6C665]">
                        {formatPrice(featured.priceEUR, featured.priceFCFA)}
                      </div>
                      <button
                        onClick={() => setSelectedArtwork(featured)}
                        className="mt-1 text-xs text-[#D4AF37] hover:underline font-medium cursor-pointer"
                      >
                        Consulter la fiche →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
