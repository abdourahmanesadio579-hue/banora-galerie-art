import React, { useState } from 'react';
import { useArt } from '../../context/ArtContext';
import { Testimonial } from '../../types/artwork';
import {
  Quote,
  Star,
  ShieldCheck,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  Send,
  Building,
  HeartHandshake,
  Sparkles,
  MapPin
} from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const { testimonials, addTestimonial, artworks } = useArt();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  // New review form
  const [authorName, setAuthorName] = useState('');
  const [roleOrCity, setRoleOrCity] = useState('');
  const [artworkAcquired, setArtworkAcquired] = useState('');
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? Math.max(0, testimonials.length - 1) : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= testimonials.length - 1 ? 0 : prev + 1));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName || !content) return;

    addTestimonial({
      authorName,
      roleOrCity: roleOrCity || 'Collectionneur Particulier',
      artworkAcquired: artworkAcquired || 'Œuvre Originale de BANORA',
      rating,
      content,
      verifiedPurchase: true,
      avatarUrl: `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 1000)}?q=80&w=200&auto=format&fit=crop`,
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setIsSubmitModalOpen(false);
      setAuthorName('');
      setRoleOrCity('');
      setArtworkAcquired('');
      setContent('');
    }, 2500);
  };

  return (
    <section id="temoignages" className="py-20 bg-[#121110] relative overflow-hidden border-b border-[#24211C]">
      {/* Background canvas texture */}
      <div className="absolute inset-0 bg-canvas-texture opacity-30 pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[radial-gradient(circle,rgba(212,175,55,0.05)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-[#D4AF37]">
              <span className="w-5 h-[1px] bg-[#D4AF37]" />
              <span>Preuve Sociale & Témoignages de Collectionneurs</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif text-[#FAF8F5]">
              La Confiance des Amateurs d'Art & Galeries
            </h2>
            <p className="text-xs sm:text-sm text-[#A8A29E] leading-relaxed">
              De Dakar à Paris, en passant par Genève et Abidjan, découvrez les impressions authentiques des acquéreurs ayant fait entrer une toile originale de BANORA dans leur collection.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSubmitModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#1C1A17] hover:bg-[#2A2620] text-[#E6C665] border border-[#D4AF37]/40 rounded-xl text-xs font-medium transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Déposer un Avis de Collectionneur</span>
            </button>
          </div>
        </div>

        {/* Trust Badges Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 px-5 rounded-2xl bg-[#161412] border border-[#25221B] text-xs">
          <div className="flex items-center gap-2.5 text-[#C8C2B7]">
            <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="font-semibold text-white">Certificat Inclus</div>
              <div className="text-[11px] text-[#8F8A81]">Signé de la main de BANORA</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 text-[#C8C2B7]">
            <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] shrink-0">
              <Building className="w-4 h-4" />
            </div>
            <div>
              <div className="font-semibold text-white">Caisse Bois d'Art</div>
              <div className="text-[11px] text-[#8F8A81]">Protection renforcée sur mesure</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 text-[#C8C2B7]">
            <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] shrink-0">
              <HeartHandshake className="w-4 h-4" />
            </div>
            <div>
              <div className="font-semibold text-white">Contact Direct</div>
              <div className="text-[11px] text-[#8F8A81]">Échange direct avec l'artiste</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 text-[#C8C2B7]">
            <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="font-semibold text-white">Pièces Uniques 1/1</div>
              <div className="text-[11px] text-[#8F8A81]">Tirage original non reproductible</div>
            </div>
          </div>
        </div>

        {/* Testimonials Grid / Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="p-6 rounded-2xl bg-[#161412] border border-[#25221B] hover:border-[#D4AF37]/40 transition-all duration-300 flex flex-col justify-between space-y-4 shadow-lg group"
            >
              <div className="space-y-3">
                {/* Top Quote Icon & Rating */}
                <div className="flex items-center justify-between">
                  <Quote className="w-6 h-6 text-[#D4AF37]/50 group-hover:text-[#D4AF37] transition" />
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < t.rating ? 'text-[#D4AF37] fill-[#D4AF37]' : 'text-[#3E3931]'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Testimonial Content */}
                <p className="text-xs text-[#C8C2B7] leading-relaxed italic font-light">
                  « {t.content} »
                </p>
              </div>

              {/* Author & Acquired Artwork Metadata */}
              <div className="pt-4 border-t border-[#221F1B] space-y-2 text-xs">
                {t.artworkAcquired && (
                  <div className="text-[11px] text-[#D4AF37] font-medium flex items-center gap-1 truncate">
                    <span className="text-[#8F8A81]">Œuvre acquise :</span>
                    <span className="truncate">{t.artworkAcquired}</span>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  {t.avatarUrl ? (
                    <img
                      src={t.avatarUrl}
                      alt={t.authorName}
                      className="w-9 h-9 rounded-full object-cover border border-[#D4AF37]/30 shrink-0"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-[#201D19] border border-[#D4AF37]/30 flex items-center justify-center font-bold text-xs text-[#E6C665] shrink-0">
                      {t.authorName.charAt(0)}
                    </div>
                  )}

                  <div className="min-w-0">
                    <div className="font-serif font-bold text-[#FAF8F5] text-sm truncate flex items-center gap-1.5">
                      <span>{t.authorName}</span>
                      {t.verifiedPurchase && (
                        <span title="Acquisition vérifiée">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-[#8F8A81] truncate">{t.roleOrCity}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal to submit a collector testimonial */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-md rounded-2xl bg-[#141311] border border-[#D4AF37]/40 shadow-2xl text-[#E8E4DF] p-6 space-y-4 my-auto">
            <button
              onClick={() => setIsSubmitModalOpen(false)}
              className="absolute top-4 right-4 text-[#A8A29E] hover:text-white p-1 rounded-lg hover:bg-white/5 transition"
            >
              <X className="w-5 h-5" />
            </button>

            {submitted ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-14 h-14 mx-auto rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 flex items-center justify-center">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-serif text-[#FAF8F5]">Merci pour votre témoignage !</h3>
                <p className="text-xs text-[#A8A29E]">
                  Votre retour d'expérience enrichit la galerie et témoigne de l'authenticité du travail de BANORA.
                </p>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-3.5 text-xs">
                <div className="flex items-center gap-2 text-[#D4AF37]">
                  <Quote className="w-4 h-4" />
                  <span className="uppercase tracking-widest text-[10px] font-semibold">Témoignage de Collectionneur</span>
                </div>

                <div>
                  <h3 className="text-lg font-serif text-[#FAF8F5]">Partager Votre Expérience</h3>
                  <p className="text-xs text-[#A8A29E]">
                    Vous avez acquis un tableau ou commandé une création sur-mesure ? Partagez vos impressions.
                  </p>
                </div>

                <div>
                  <label className="block text-[#A8A29E] mb-1 font-medium">Votre Nom / Institution *</label>
                  <input
                    type="text"
                    required
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="Ex: Sophie de Montalembert"
                    className="w-full bg-[#1A1815] border border-[#2D2A24] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[#A8A29E] mb-1">Qualité ou Ville</label>
                    <input
                      type="text"
                      value={roleOrCity}
                      onChange={(e) => setRoleOrCity(e.target.value)}
                      placeholder="Ex: Collectionneuse · Paris"
                      className="w-full bg-[#1A1815] border border-[#2D2A24] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div>
                    <label className="block text-[#A8A29E] mb-1">Œuvre acquise</label>
                    <input
                      type="text"
                      value={artworkAcquired}
                      onChange={(e) => setArtworkAcquired(e.target.value)}
                      placeholder="Ex: Symphonie Sahélienne..."
                      className="w-full bg-[#1A1815] border border-[#2D2A24] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#A8A29E] mb-1">Évaluation globale</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        className="cursor-pointer p-1"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            star <= rating ? 'text-[#D4AF37] fill-[#D4AF37]' : 'text-[#3E3931]'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs text-[#FAF8F5] ml-2 font-medium">{rating} / 5 étoiles</span>
                  </div>
                </div>

                <div>
                  <label className="block text-[#A8A29E] mb-1">Votre témoignage *</label>
                  <textarea
                    rows={3}
                    required
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Écrivez vos impressions sur la matière, les finitions, l'emballage et la présence de la toile..."
                    className="w-full bg-[#1A1815] border border-[#2D2A24] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsSubmitModalOpen(false)}
                    className="w-1/3 py-2 rounded-xl border border-[#2D2A24] text-xs text-[#A8A29E] hover:text-white transition"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-[#D4AF37] hover:bg-[#E6C665] text-[#121110] font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-lg shadow-[#D4AF37]/15"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Publier mon avis
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
