import React, { useState, useMemo } from 'react';
import { useArt } from '../../context/ArtContext';
import { ArtworkCategory, ArtworkStatus } from '../../types/artwork';
import { ArtworkCard } from './ArtworkCard';
import { Search, SlidersHorizontal, Sparkles, Filter } from 'lucide-react';

export const GalleryGrid: React.FC = () => {
  const { artworks, galleries } = useArt();

  // Dynamically extract all available collections in real-time (no hardcoded list)
  const categories = useMemo(() => {
    const fromArtworks = artworks.map((a) => a.category).filter(Boolean);
    const set = new Set([...galleries, ...fromArtworks]);
    return ['Toutes', ...Array.from(set)];
  }, [galleries, artworks]);

  const [selectedCategory, setSelectedCategory] = useState<'Toutes' | string>('Toutes');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'disponible' | 'vendu'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'price_asc' | 'price_desc' | 'title'>('recent');

  React.useEffect(() => {
    if (selectedCategory !== 'Toutes' && !categories.includes(selectedCategory)) {
      setSelectedCategory('Toutes');
    }
  }, [categories, selectedCategory]);

  const filteredArtworks = useMemo(() => {
    return artworks
      .filter((art) => {
        // Category
        if (selectedCategory !== 'Toutes' && art.category !== selectedCategory) {
          return false;
        }
        // Status
        if (selectedStatus === 'disponible' && art.status !== 'disponible') {
          return false;
        }
        if (selectedStatus === 'vendu' && art.status === 'disponible') {
          return false;
        }
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = art.title.toLowerCase().includes(q);
          const matchTechnique = art.technique.toLowerCase().includes(q);
          const matchRef = art.inventoryNumber.toLowerCase().includes(q);
          const matchDesc = art.description.toLowerCase().includes(q);
          if (!matchTitle && !matchTechnique && !matchRef && !matchDesc) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price_asc') return a.priceEUR - b.priceEUR;
        if (sortBy === 'price_desc') return b.priceEUR - a.priceEUR;
        if (sortBy === 'title') return a.title.localeCompare(b.title);
        // Default: recent
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [artworks, selectedCategory, selectedStatus, searchQuery, sortBy]);

  return (
    <section id="catalogue" className="py-16 sm:py-20 bg-[#121110]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#25221B] pb-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-[#D4AF37]">
              <span className="w-5 h-[1px] bg-[#D4AF37]" />
              <span>Catalogue & Toiles Originales</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif text-[#FAF8F5]">
              La Collection de BANORA
            </h2>
            <p className="text-xs sm:text-sm text-[#A8A29E] max-w-xl">
              Chaque pièce est unique, façonnée avec des pigments rares, des reliures naturelles et signée de la main de l’artiste.
            </p>
          </div>

          <div className="text-xs text-[#8F8A81]">
            <span className="text-[#E6C665] font-semibold">{filteredArtworks.length}</span> œuvre(s) répertoriée(s)
          </div>
        </div>

        {/* Filter Bar & Controls */}
        <div className="space-y-4">
          {/* Category Tabs (Interactive buttons allowed per design constitution) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#D4AF37] text-[#121110] font-semibold shadow-sm'
                    : 'bg-[#1A1815] text-[#A8A29E] hover:text-white border border-[#2B2721]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search, Availability & Sort Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#161513] p-3 rounded-xl border border-[#24211C]">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8F8A81]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher par titre, matière, ocre, lin, référence..."
                className="w-full bg-[#1C1A17] border border-[#2C2822] rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-[#6E6961] focus:outline-none focus:border-[#D4AF37]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#8F8A81] hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Availability Filter */}
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as any)}
                className="bg-[#1C1A17] border border-[#2C2822] text-[#FAF8F5] text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#D4AF37] cursor-pointer"
              >
                <option value="all">Toutes disponibilités</option>
                <option value="disponible">Disponibles seulement</option>
                <option value="vendu">Réservés & Collections privées</option>
              </select>

              {/* Sort By */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-[#1C1A17] border border-[#2C2822] text-[#FAF8F5] text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#D4AF37] cursor-pointer"
              >
                <option value="recent">Plus récentes d'abord</option>
                <option value="price_asc">Prix : croissant</option>
                <option value="price_desc">Prix : décroissant</option>
                <option value="title">Titre alphabétique</option>
              </select>
            </div>
          </div>
        </div>

        {/* Artworks Grid */}
        {filteredArtworks.length === 0 ? (
          <div className="py-20 text-center space-y-3 bg-[#151412] rounded-2xl border border-[#221F1B]">
            <Filter className="w-10 h-10 text-[#8F8A81] mx-auto" />
            <h3 className="text-base font-serif text-[#FAF8F5]">Aucune œuvre ne correspond à vos filtres</h3>
            <p className="text-xs text-[#A8A29E] max-w-sm mx-auto">
              Essayez de réinitialiser vos termes de recherche ou de sélectionner une autre collection.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('Toutes');
                setSelectedStatus('all');
                setSearchQuery('');
              }}
              className="mt-2 px-4 py-1.5 bg-[#25221B] hover:bg-[#322C23] text-xs text-[#E6C665] rounded-lg transition"
            >
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredArtworks.map((art) => (
              <ArtworkCard key={art.id} artwork={art} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
