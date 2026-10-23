import React from 'react';
import { useArt } from '../../context/ArtContext';
import { Award, MapPin, Calendar, ExternalLink, Sparkles } from 'lucide-react';

export const ArtistBioSection: React.FC = () => {
  const { artistProfile, setIsCommissionOpen } = useArt();

  return (
    <section id="artiste" className="py-20 bg-[#161513] border-y border-[#26231D]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Atelier & Texture Canvas Visuals (No personal portrait photo) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="relative rounded-2xl overflow-hidden border border-[#D4AF37]/40 shadow-2xl bg-[#11100E] p-2">
              <div className="aspect-[4/5] rounded-xl overflow-hidden bg-neutral-900 relative">
                <img
                  src={artistProfile.studioImageUrl || 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1200&auto=format&fit=crop'}
                  alt="Atelier Banora — Texture et Matière"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="font-serif text-xl font-bold">Atelier BANORA</div>
                  <div className="text-xs text-[#D4AF37] font-light">Matières, ocres et feuilles d'or</div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#1A1815] border border-[#2A2721] flex items-center gap-3 text-xs text-[#A8A29E]">
              <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <span>{artistProfile.studioAddress}</span>
            </div>
          </div>

          {/* Artist Bio, Philosophy & Exhibitions */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-[#D4AF37]">
              <span className="w-5 h-[1px] bg-[#D4AF37]" />
              <span>L'Artiste & la Démarche</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-serif text-[#FAF8F5] leading-tight">
              À Propos de BANORA
            </h2>

            <p className="text-sm text-[#C8C2B7] leading-relaxed">
              {artistProfile.bio}
            </p>

            <blockquote className="p-4 rounded-xl bg-[#1B1916] border-l-2 border-[#D4AF37] text-xs sm:text-sm italic text-[#FAF8F5] font-serif leading-relaxed">
              {artistProfile.philosophy}
            </blockquote>

            {/* Exhibitions Timeline */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs uppercase tracking-widest font-semibold text-[#D4AF37] flex items-center gap-2">
                <Award className="w-4 h-4" />
                Expositions & Salons d'Art Récents
              </h3>

              <div className="space-y-2.5">
                {artistProfile.exhibitions.map((ex, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-[#141311] border border-[#25221C] flex items-start justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="font-medium text-[#FAF8F5]">{ex.title}</div>
                      <div className="text-[#8F8A81] text-[11px]">
                        {ex.gallery} · {ex.location}
                      </div>
                    </div>
                    <span className="font-mono text-[11px] text-[#D4AF37] shrink-0 bg-[#242018] px-2 py-0.5 rounded">
                      {ex.year}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setIsCommissionOpen(true)}
                className="px-5 py-2.5 bg-[#D4AF37] hover:bg-[#E6C665] text-[#121110] font-semibold text-xs rounded-xl transition cursor-pointer"
              >
                Proposer un projet d'exposition ou commande privée
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
