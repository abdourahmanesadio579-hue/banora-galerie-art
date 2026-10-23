import React, { useState, useEffect } from 'react';
import { useArt } from '../../context/ArtContext';
import { Artwork, ArtworkCategory, ArtworkStatus } from '../../types/artwork';
import { X, Upload, Image as ImageIcon, Sparkles, Check, DollarSign } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  artworkToEdit?: Artwork | null;
}

const CATEGORIES: ArtworkCategory[] = [
  'Série Sahel',
  'Abstractions Africaines',
  'Lueurs & Or',
  'Portraits & Mémoires',
  'Rituels Contemporains',
];

const PRESET_SAMPLE_IMAGES = [
  { label: 'Symphonie Ocre', url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1200&auto=format&fit=crop' },
  { label: 'Indigo Abstrait', url: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=1200&auto=format&fit=crop' },
  { label: 'Feuille d’Or', url: 'https://images.unsplash.com/photo-1578321272175-109c1480a11e?q=80&w=1200&auto=format&fit=crop' },
  { label: 'Portrait Expressif', url: 'https://images.unsplash.com/photo-1582561424760-0321d75e81fa?q=80&w=1200&auto=format&fit=crop' },
  { label: 'Texture Sahel', url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1200&auto=format&fit=crop' },
  { label: 'Rituels Sombre', url: 'https://images.unsplash.com/photo-1549887534-1541e9326642?q=80&w=1200&auto=format&fit=crop' },
];

export const ArtworkEditModal: React.FC<Props> = ({ isOpen, onClose, artworkToEdit }) => {
  const { addArtwork, updateArtwork, artworks, galleries, createGallery } = useArt();

  const [title, setTitle] = useState('');
  const [technique, setTechnique] = useState('');
  const [dimensions, setDimensions] = useState('');
  const [year, setYear] = useState(new Date().getFullYear());
  const [category, setCategory] = useState<string>(() => (galleries[0] || 'Série Sahel'));
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [customCategoryName, setCustomCategoryName] = useState('');
  const [priceEUR, setPriceEUR] = useState(1500);
  const [priceFCFA, setPriceFCFA] = useState(985000);
  const [imageUrl, setImageUrl] = useState('');
  const [status, setStatus] = useState<ArtworkStatus>('disponible');
  const [isFeatured, setIsFeatured] = useState(false);
  const [description, setDescription] = useState('');
  const [inspiration, setInspiration] = useState('');
  const [inventoryNumber, setInventoryNumber] = useState('');
  const [weightKg, setWeightKg] = useState(6.5);

  // Collect all unique categories from galleries + artworks
  const availableCategories = React.useMemo(() => {
    const fromArtworks = artworks.map((a) => a.category).filter(Boolean);
    const list = Array.from(new Set([...galleries, ...fromArtworks]));
    return list.filter(Boolean);
  }, [galleries, artworks]);

  useEffect(() => {
    if (artworkToEdit) {
      setTitle(artworkToEdit.title);
      setTechnique(artworkToEdit.technique);
      setDimensions(artworkToEdit.dimensions);
      setYear(artworkToEdit.year);
      setCategory(artworkToEdit.category);
      setPriceEUR(artworkToEdit.priceEUR);
      setPriceFCFA(artworkToEdit.priceFCFA);
      setImageUrl(artworkToEdit.imageUrl);
      setStatus(artworkToEdit.status);
      setIsFeatured(!!artworkToEdit.isFeatured);
      setDescription(artworkToEdit.description);
      setInspiration(artworkToEdit.inspiration || '');
      setInventoryNumber(artworkToEdit.inventoryNumber);
      setWeightKg(artworkToEdit.weightKg || 6.5);
    } else {
      // Defaults for a new artwork
      const nextNum = artworks.length + 1;
      const ref = `BAN-${new Date().getFullYear()}-${String(nextNum).padStart(3, '0')}`;
      setTitle('');
      setTechnique('Huile et pigments naturels sur lin brut');
      setDimensions('120 x 100 cm');
      setYear(new Date().getFullYear());
      setCategory('Série Sahel');
      setPriceEUR(1800);
      setPriceFCFA(1180000);
      setImageUrl(PRESET_SAMPLE_IMAGES[0].url);
      setStatus('disponible');
      setIsFeatured(false);
      setDescription('');
      setInspiration('');
      setInventoryNumber(ref);
      setWeightKg(6.5);
    }
  }, [artworkToEdit, isOpen, artworks.length]);

  if (!isOpen) return null;

  // Auto-sync FCFA on EUR change
  const handlePriceEURChange = (eur: number) => {
    setPriceEUR(eur);
    setPriceFCFA(Math.round(eur * 655.957));
  };

  // Image file upload handler (converts to base64 DataURL for local preview & persistence)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setImageUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !imageUrl) return;

    const finalCategory =
      isCustomCategory && customCategoryName.trim()
        ? customCategoryName.trim()
        : category;

    if (finalCategory) {
      createGallery(finalCategory);
    }

    if (artworkToEdit) {
      updateArtwork(artworkToEdit.id, {
        title,
        technique,
        dimensions,
        year,
        category: finalCategory,
        priceEUR: Number(priceEUR),
        priceFCFA: Number(priceFCFA),
        imageUrl,
        status,
        isFeatured,
        description: description || `Œuvre originale ${title} par l'artiste peintre BANORA.`,
        inspiration,
        inventoryNumber,
        weightKg: Number(weightKg),
        certificateIncluded: true,
      });
    } else {
      addArtwork({
        title,
        technique,
        dimensions,
        year,
        category: finalCategory,
        priceEUR: Number(priceEUR),
        priceFCFA: Number(priceFCFA),
        imageUrl,
        status,
        isFeatured,
        description: description || `Œuvre originale ${title} par l'artiste peintre BANORA.`,
        inspiration,
        inventoryNumber,
        weightKg: Number(weightKg),
        certificateIncluded: true,
        location: 'Atelier Banora, Dakar',
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-3 sm:p-5 overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-2xl bg-[#141311] border border-[#D4AF37]/40 shadow-2xl text-[#E8E4DF] overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#24211C] bg-[#181613]">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37]" />
            <h2 className="text-base font-serif font-bold text-[#FAF8F5]">
              {artworkToEdit ? `Modifier la Toile : ${artworkToEdit.title}` : 'Publier une Nouvelle Œuvre au Catalogue'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-[#A8A29E] hover:text-white p-1 rounded-lg hover:bg-white/5 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
          {/* Main Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-[#A8A29E] mb-1 font-medium">Titre du tableau *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Reflets d'Harmattan sur Toile d'Or"
                className="w-full bg-[#1A1815] border border-[#2D2A24] rounded-lg px-3 py-2 text-white font-serif text-sm focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="block text-[#A8A29E] mb-1">Collection / Série *</label>
              {!isCustomCategory ? (
                <div className="space-y-1.5">
                  <select
                    value={category}
                    onChange={(e) => {
                      if (e.target.value === '__NEW__') {
                        setIsCustomCategory(true);
                        setCustomCategoryName('');
                      } else {
                        setCategory(e.target.value);
                      }
                    }}
                    className="w-full bg-[#1A1815] border border-[#2D2A24] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#D4AF37] cursor-pointer"
                  >
                    {availableCategories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                    <option value="__NEW__" className="text-[#D4AF37] font-semibold">
                      + Créer une nouvelle collection...
                    </option>
                  </select>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      autoFocus
                      required
                      value={customCategoryName}
                      onChange={(e) => setCustomCategoryName(e.target.value)}
                      placeholder="Nom de la nouvelle collection..."
                      className="flex-1 bg-[#1A1815] border border-[#D4AF37] rounded-lg px-3 py-2 text-white focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setIsCustomCategory(false);
                      }}
                      className="px-2.5 py-1 text-xs border border-[#2D2A24] text-[#A8A29E] hover:text-white rounded-lg"
                    >
                      Annuler
                    </button>
                  </div>
                  <span className="text-[10px] text-[#D4AF37]">
                    Cette collection sera automatiquement ajoutée aux filtres de la galerie pour tous les utilisateurs.
                  </span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-[#A8A29E] mb-1">Disponibilité actuelle *</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ArtworkStatus)}
                className="w-full bg-[#1A1815] border border-[#2D2A24] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
              >
                <option value="disponible">Disponible à l'acquisition</option>
                <option value="reserve">Réservé (Option d'achat)</option>
                <option value="vendu">Vendu (Collection privée)</option>
              </select>
            </div>

            <div>
              <label className="block text-[#A8A29E] mb-1">Technique & Médium *</label>
              <input
                type="text"
                required
                value={technique}
                onChange={(e) => setTechnique(e.target.value)}
                placeholder="Ex: Huile, pigments d'ocre et feuilles d'or"
                className="w-full bg-[#1A1815] border border-[#2D2A24] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="block text-[#A8A29E] mb-1">Dimensions (Largeur x Hauteur) *</label>
              <input
                type="text"
                required
                value={dimensions}
                onChange={(e) => setDimensions(e.target.value)}
                placeholder="Ex: 140 x 110 cm"
                className="w-full bg-[#1A1815] border border-[#2D2A24] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="block text-[#A8A29E] mb-1">Année de création</label>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="w-full bg-[#1A1815] border border-[#2D2A24] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="block text-[#A8A29E] mb-1">Numéro d'inventaire / Référence</label>
              <input
                type="text"
                value={inventoryNumber}
                onChange={(e) => setInventoryNumber(e.target.value)}
                placeholder="BAN-2026-001"
                className="w-full bg-[#1A1815] border border-[#2D2A24] rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>

          {/* Pricing in EUR and FCFA */}
          <div className="p-4 rounded-xl bg-[#1A1815] border border-[#2C2923] space-y-3">
            <h4 className="font-semibold text-[#D4AF37] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <DollarSign className="w-4 h-4" />
              Tarification de l'Œuvre
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[#A8A29E] mb-1">Prix en Euros (€) *</label>
                <input
                  type="number"
                  min="0"
                  step="50"
                  required
                  value={priceEUR}
                  onChange={(e) => handlePriceEURChange(Number(e.target.value))}
                  className="w-full bg-[#141311] border border-[#2D2A24] rounded-lg px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
              <div>
                <label className="block text-[#A8A29E] mb-1">Prix en Francs CFA (FCFA) *</label>
                <input
                  type="number"
                  min="0"
                  step="5000"
                  required
                  value={priceFCFA}
                  onChange={(e) => setPriceFCFA(Number(e.target.value))}
                  className="w-full bg-[#141311] border border-[#2D2A24] rounded-lg px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>
          </div>

          {/* Image selection and Upload */}
          <div className="space-y-3">
            <label className="block text-[#A8A29E] mb-1 font-medium">Photographie de l'œuvre *</label>
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
              <div className="sm:col-span-8 space-y-2">
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Collez l'URL de l'image (ex: Unsplash, hébergement web...)"
                  className="w-full bg-[#1A1815] border border-[#2D2A24] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                />
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-1.5 px-3 py-1.5 bg-[#25211B] hover:bg-[#342D24] text-[#E6C665] rounded-lg border border-[#D4AF37]/30 cursor-pointer transition">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Téléverser depuis mon appareil / photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Preview Box */}
              <div className="sm:col-span-4">
                <div className="aspect-[4/3] rounded-xl bg-[#100F0E] border border-[#2A2722] overflow-hidden flex items-center justify-center">
                  {imageUrl ? (
                    <img src={imageUrl} alt="Aperçu" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center text-[#8F8A81] p-2">
                      <ImageIcon className="w-8 h-8 mx-auto mb-1 opacity-50" />
                      <span>Aucune image</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Sample Presets */}
            <div className="pt-1">
              <span className="text-[11px] text-[#8F8A81] block mb-1">Ou choisir parmi des toiles modèles haute résolution :</span>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {PRESET_SAMPLE_IMAGES.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setImageUrl(preset.url)}
                    className="shrink-0 text-[10px] px-2 py-1 rounded bg-[#1C1A17] hover:bg-[#2A2620] border border-[#2D2922] text-[#C8C2B7] transition cursor-pointer"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Text descriptions */}
          <div className="space-y-3">
            <div>
              <label className="block text-[#A8A29E] mb-1">Description & Démarche artistique</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Racontez la composition, les pigments, l'effet de texture..."
                className="w-full bg-[#1A1815] border border-[#2D2A24] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="block text-[#A8A29E] mb-1">Inspiration de l'artiste (citation ou genèse)</label>
              <input
                type="text"
                value={inspiration}
                onChange={(e) => setInspiration(e.target.value)}
                placeholder="Ex: Inspiré des dunes de Lompoul sous le vent d'harmattan..."
                className="w-full bg-[#1A1815] border border-[#2D2A24] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>

          {/* Featured checkbox */}
          <div className="flex items-center gap-2 p-3 rounded-xl bg-[#1A1815] border border-[#2C2923]">
            <input
              type="checkbox"
              id="isFeatured"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="w-4 h-4 rounded text-[#D4AF37] focus:ring-0 bg-[#121110] border-[#2D2A24]"
            />
            <label htmlFor="isFeatured" className="text-[#FAF8F5] cursor-pointer flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              Mettre en avant cette œuvre (« Coup de Cœur » sur la page d'accueil)
            </label>
          </div>

          {/* Action buttons */}
          <div className="pt-3 border-t border-[#24211C] flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-[#2D2A24] text-xs text-[#A8A29E] hover:text-white transition"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#D4AF37] hover:bg-[#E6C665] text-[#121110] font-bold rounded-xl text-xs transition cursor-pointer shadow-lg shadow-[#D4AF37]/20"
            >
              {artworkToEdit ? 'Enregistrer les Modifications' : 'Publier au Catalogue'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
