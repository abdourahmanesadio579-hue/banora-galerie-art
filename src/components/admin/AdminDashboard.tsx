import React, { useState } from 'react';
import { useArt } from '../../context/ArtContext';
import { Artwork, Order, ClientInquiry } from '../../types/artwork';
import { ArtworkEditModal } from './ArtworkEditModal';
import { CertificateModal } from './CertificateModal';
import {
  LayoutDashboard,
  Palette,
  ShoppingBag,
  MessageSquare,
  User,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  Clock,
  Truck,
  ArrowUpRight,
  TrendingUp,
  Award,
  Download,
  Upload,
  RotateCcw,
  LogOut,
  ExternalLink,
  MessageCircle,
  FileCheck,
  Sparkles,
  DollarSign,
  Quote,
  Star,
  Layers,
  AlertTriangle,
  FolderPlus,
  FolderX,
  ArrowRight,
  X
} from 'lucide-react';

type AdminTab = 'overview' | 'catalog' | 'galleries' | 'orders' | 'inquiries' | 'testimonials' | 'profile';

export const AdminDashboard: React.FC = () => {
  const {
    artworks,
    orders,
    inquiries,
    testimonials,
    deleteTestimonial,
    artistProfile,
    updateArtistProfile,
    updateArtwork,
    deleteArtwork,
    toggleArtworkStatus,
    updateOrderStatus,
    updateInquiryStatus,
    formatPrice,
    logoutAdmin,
    exportDataJSON,
    importDataJSON,
    resetToDefault,
    galleries,
    deleteGallery,
    renameGallery,
    createGallery,
  } = useArt();

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [artworkToEdit, setArtworkToEdit] = useState<Artwork | null>(null);
  const [certificateArtwork, setCertificateArtwork] = useState<Artwork | null>(null);
  const [certificateOrder, setCertificateOrder] = useState<Order | undefined>(undefined);

  // Gallery Management States
  const [galleryToDelete, setGalleryToDelete] = useState<string | null>(null);
  const [deleteArtworksWithGallery, setDeleteArtworksWithGallery] = useState(false);
  const [reassignTargetGallery, setReassignTargetGallery] = useState<string>('');
  const [galleryToRename, setGalleryToRename] = useState<string | null>(null);
  const [newGalleryName, setNewGalleryName] = useState('');
  const [newGalleryInput, setNewGalleryInput] = useState('');
  const [isCreatingGallery, setIsCreatingGallery] = useState(false);
  const [galleryActionSuccess, setGalleryActionSuccess] = useState<string | null>(null);
  const [previewInquiryPhoto, setPreviewInquiryPhoto] = useState<{ url: string; title: string } | null>(null);

  const handleInitiateDeleteGallery = (galleryName: string) => {
    setGalleryToDelete(galleryName);
    setDeleteArtworksWithGallery(false);
    const otherGalleries = galleries.filter((g) => g !== galleryName);
    setReassignTargetGallery(otherGalleries[0] || 'Série Sahel');
  };

  const handleConfirmDeleteGallery = async () => {
    if (!galleryToDelete) return;
    const targetName = galleryToDelete;
    await deleteGallery(targetName, {
      reassignTo: deleteArtworksWithGallery ? undefined : reassignTargetGallery,
      deleteArtworks: deleteArtworksWithGallery,
    });
    setGalleryToDelete(null);
    setGalleryActionSuccess(
      deleteArtworksWithGallery
        ? `La galerie « ${targetName} » et ses tableaux ont été supprimés avec succès.`
        : `La galerie « ${targetName} » a été supprimée. Les tableaux ont été réassignés à « ${reassignTargetGallery} » avec succès.`
    );
    setTimeout(() => setGalleryActionSuccess(null), 6000);
  };

  const handleConfirmRenameGallery = async () => {
    if (!galleryToRename || !newGalleryName.trim()) return;
    const old = galleryToRename;
    const n = newGalleryName.trim();
    await renameGallery(old, n);
    setGalleryToRename(null);
    setGalleryActionSuccess(`La galerie « ${old} » a été renommée en « ${n} ».`);
    setTimeout(() => setGalleryActionSuccess(null), 5000);
  };

  const handleCreateGallery = () => {
    if (!newGalleryInput.trim()) return;
    const name = newGalleryInput.trim();
    createGallery(name);
    setNewGalleryInput('');
    setIsCreatingGallery(false);
    setGalleryActionSuccess(`La collection « ${name} » a été créée avec succès.`);
    setTimeout(() => setGalleryActionSuccess(null), 5000);
  };

  // Search & Filters in catalog tab
  const [catalogSearch, setCatalogSearch] = useState('');
  const [catalogCategoryFilter, setCatalogCategoryFilter] = useState('all');
  const [catalogStatusFilter, setCatalogStatusFilter] = useState('all');

  // Profile Form state
  const [profileName, setProfileName] = useState(artistProfile.name);
  const [profileTitle, setProfileTitle] = useState(artistProfile.title);
  const [profileBio, setProfileBio] = useState(artistProfile.bio);
  const [profilePhilosophy, setProfilePhilosophy] = useState(artistProfile.philosophy);
  const [profilePhone, setProfilePhone] = useState(artistProfile.phone);
  const [profileWhatsapp, setProfileWhatsapp] = useState(artistProfile.whatsapp);
  const [profileEmail, setProfileEmail] = useState(artistProfile.email);
  const [profileAddress, setProfileAddress] = useState(artistProfile.studioAddress);
  const [profileStudioImageUrl, setProfileStudioImageUrl] = useState(artistProfile.studioImageUrl || '');
  const [profileSaved, setProfileSaved] = useState(false);

  const profileStudioInputRef = React.useRef<HTMLInputElement>(null);

  // JSON Import ref
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Metrics calculations
  const totalArtworksCount = artworks.length;
  const availableCount = artworks.filter((a) => a.status === 'disponible').length;
  const reservedCount = artworks.filter((a) => a.status === 'reserve').length;
  const soldCount = artworks.filter((a) => a.status === 'vendu').length;

  const totalCatalogValueEUR = artworks.reduce((acc, a) => acc + a.priceEUR, 0);
  const totalCatalogValueFCFA = artworks.reduce((acc, a) => acc + a.priceFCFA, 0);

  const totalSalesRevenueEUR = orders
    .filter((o) => o.status !== 'annulee')
    .reduce((acc, o) => acc + o.totalEUR, 0);
  const totalSalesRevenueFCFA = orders
    .filter((o) => o.status !== 'annulee')
    .reduce((acc, o) => acc + o.totalFCFA, 0);

  const pendingInquiriesCount = inquiries.filter((i) => i.status === 'nouveau').length;
  const pendingOrdersCount = orders.filter((o) => o.status === 'en_attente').length;

  // Catalog filtered list
  const filteredCatalog = artworks.filter((art) => {
    if (catalogCategoryFilter !== 'all' && art.category !== catalogCategoryFilter) return false;
    if (catalogStatusFilter !== 'all' && art.status !== catalogStatusFilter) return false;
    if (catalogSearch.trim()) {
      const q = catalogSearch.toLowerCase();
      return (
        art.title.toLowerCase().includes(q) ||
        art.inventoryNumber.toLowerCase().includes(q) ||
        art.technique.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleOpenNewArtwork = () => {
    setArtworkToEdit(null);
    setIsEditModalOpen(true);
  };

  const handleOpenEdit = (art: Artwork) => {
    setArtworkToEdit(art);
    setIsEditModalOpen(true);
  };

  const handleDelete = (art: Artwork) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer définitivement le tableau "${art.title}" ?`)) {
      deleteArtwork(art.id);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateArtistProfile({
      ...artistProfile,
      name: profileName,
      title: profileTitle,
      bio: profileBio,
      philosophy: profilePhilosophy,
      phone: profilePhone,
      whatsapp: profileWhatsapp,
      email: profileEmail,
      studioAddress: profileAddress,
      studioImageUrl: profileStudioImageUrl,
    });
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result;
        if (typeof content === 'string') {
          if (importDataJSON(content)) {
            alert('Données et catalogue importés avec succès !');
          } else {
            alert("Erreur lors de l'importation du fichier JSON.");
          }
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="min-h-screen bg-[#100F0E] text-[#E8E4DF] flex flex-col">
      {/* Top Admin Navbar */}
      <header className="bg-[#161412] border-b border-[#26231E] sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
              <Palette className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-lg font-bold text-[#FAF8F5] tracking-wide">
                  Atelier BANORA
                </span>
                <span className="text-[10px] bg-[#D4AF37]/20 text-[#E6C665] border border-[#D4AF37]/40 px-1.5 py-0.5 rounded font-medium">
                  Espace Gestionnaire
                </span>
              </div>
              <p className="text-[10px] text-[#8F8A81] -mt-0.5">
                Tableau de bord de vente, catalogue et commandes
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick backup actions */}
            <button
              onClick={exportDataJSON}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#1F1D1A] hover:bg-[#2B2721] text-[#A8A29E] hover:text-white border border-[#2D2A24] text-xs transition cursor-pointer"
              title="Exporter une sauvegarde du catalogue et des commandes"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Sauvegarder</span>
            </button>

            <button
              onClick={() => logoutAdmin()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#C8C2B7] text-xs transition cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Quitter l'Admin</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-1 overflow-x-auto border-t border-[#201E1A] scrollbar-none text-xs">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-3.5 font-medium border-b-2 flex items-center gap-2 transition cursor-pointer whitespace-nowrap ${
              activeTab === 'overview'
                ? 'border-[#D4AF37] text-[#FAF8F5] bg-white/5'
                : 'border-transparent text-[#8F8A81] hover:text-[#C8C2B7]'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-[#D4AF37]" />
            Tableau de Bord
          </button>

          <button
            onClick={() => setActiveTab('catalog')}
            className={`py-3 px-3.5 font-medium border-b-2 flex items-center gap-2 transition cursor-pointer whitespace-nowrap ${
              activeTab === 'catalog'
                ? 'border-[#D4AF37] text-[#FAF8F5] bg-white/5'
                : 'border-transparent text-[#8F8A81] hover:text-[#C8C2B7]'
            }`}
          >
            <Palette className="w-3.5 h-3.5 text-[#D4AF37]" />
            Mes Tableaux ({totalArtworksCount})
          </button>

          <button
            onClick={() => setActiveTab('galleries')}
            className={`py-3 px-3.5 font-medium border-b-2 flex items-center gap-2 transition cursor-pointer whitespace-nowrap ${
              activeTab === 'galleries'
                ? 'border-[#D4AF37] text-[#FAF8F5] bg-white/5'
                : 'border-transparent text-[#8F8A81] hover:text-[#C8C2B7]'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-[#D4AF37]" />
            Mes Galeries & Séries ({galleries.length})
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3 px-3.5 font-medium border-b-2 flex items-center gap-2 transition cursor-pointer whitespace-nowrap ${
              activeTab === 'orders'
                ? 'border-[#D4AF37] text-[#FAF8F5] bg-white/5'
                : 'border-transparent text-[#8F8A81] hover:text-[#C8C2B7]'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5 text-[#D4AF37]" />
            Ventes & Commandes ({orders.length})
            {pendingOrdersCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-amber-500 text-black text-[10px] font-bold flex items-center justify-center">
                {pendingOrdersCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('inquiries')}
            className={`py-3 px-3.5 font-medium border-b-2 flex items-center gap-2 transition cursor-pointer whitespace-nowrap ${
              activeTab === 'inquiries'
                ? 'border-[#D4AF37] text-[#FAF8F5] bg-white/5'
                : 'border-transparent text-[#8F8A81] hover:text-[#C8C2B7]'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-[#D4AF37]" />
            Demandes Clients ({inquiries.length})
            {pendingInquiriesCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-emerald-500 text-black text-[10px] font-bold flex items-center justify-center">
                {pendingInquiriesCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('testimonials')}
            className={`py-3 px-3.5 font-medium border-b-2 flex items-center gap-2 transition cursor-pointer whitespace-nowrap ${
              activeTab === 'testimonials'
                ? 'border-[#D4AF37] text-[#FAF8F5] bg-white/5'
                : 'border-transparent text-[#8F8A81] hover:text-[#C8C2B7]'
            }`}
          >
            <Quote className="w-3.5 h-3.5 text-[#D4AF37]" />
            Avis & Témoignages ({testimonials.length})
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`py-3 px-3.5 font-medium border-b-2 flex items-center gap-2 transition cursor-pointer whitespace-nowrap ${
              activeTab === 'profile'
                ? 'border-[#D4AF37] text-[#FAF8F5] bg-white/5'
                : 'border-transparent text-[#8F8A81] hover:text-[#C8C2B7]'
            }`}
          >
            <User className="w-3.5 h-3.5 text-[#D4AF37]" />
            Profil & Paramètres
          </button>
        </div>
      </header>

      {/* Main Tab Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* ===================== TAB 1: OVERVIEW ===================== */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Top Quick Actions Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#161412] p-4 rounded-2xl border border-[#26231E]">
              <div>
                <h2 className="text-xl font-serif text-[#FAF8F5]">
                  Bienvenue dans votre atelier, {artistProfile.name}
                </h2>
                <p className="text-xs text-[#A8A29E] mt-0.5">
                  Gérez vos toiles, suivez vos acquéreurs et partagez vos nouvelles œuvres avec les collectionneurs.
                </p>
              </div>
              <button
                onClick={handleOpenNewArtwork}
                className="px-4 py-2.5 bg-[#D4AF37] hover:bg-[#E6C665] text-[#121110] font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-lg shadow-[#D4AF37]/15"
              >
                <Plus className="w-4 h-4" />
                Publier un Nouveau Tableau
              </button>
            </div>

            {/* KPI Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1: Ventes Totales */}
              <div className="p-5 rounded-2xl bg-[#161412] border border-[#26231E] space-y-2">
                <div className="flex items-center justify-between text-xs text-[#A8A29E]">
                  <span>Chiffre d'Affaires Réalisé</span>
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="font-serif text-2xl font-bold text-[#E6C665]">
                  {formatPrice(totalSalesRevenueEUR, totalSalesRevenueFCFA)}
                </div>
                <div className="text-[11px] text-emerald-400 font-medium">
                  {orders.length} commande(s) enregistrée(s)
                </div>
              </div>

              {/* Card 2: Valeur du Catalogue Actif */}
              <div className="p-5 rounded-2xl bg-[#161412] border border-[#26231E] space-y-2">
                <div className="flex items-center justify-between text-xs text-[#A8A29E]">
                  <span>Valeur Totale du Catalogue</span>
                  <DollarSign className="w-4 h-4 text-[#D4AF37]" />
                </div>
                <div className="font-serif text-2xl font-bold text-[#FAF8F5]">
                  {formatPrice(totalCatalogValueEUR, totalCatalogValueFCFA)}
                </div>
                <div className="text-[11px] text-[#A8A29E]">
                  {totalArtworksCount} toiles au total
                </div>
              </div>

              {/* Card 3: État des Toiles */}
              <div className="p-5 rounded-2xl bg-[#161412] border border-[#26231E] space-y-2">
                <div className="flex items-center justify-between text-xs text-[#A8A29E]">
                  <span>Disponibilité du Catalogue</span>
                  <Palette className="w-4 h-4 text-[#D4AF37]" />
                </div>
                <div className="font-serif text-2xl font-bold text-emerald-400">
                  {availableCount} <span className="text-sm font-sans font-normal text-[#8F8A81]">en vente</span>
                </div>
                <div className="text-[11px] text-[#8F8A81] flex gap-2">
                  <span className="text-amber-400">{reservedCount} réservée(s)</span>
                  <span>·</span>
                  <span className="text-stone-400">{soldCount} vendue(s)</span>
                </div>
              </div>

              {/* Card 4: Demandes Clients */}
              <div className="p-5 rounded-2xl bg-[#161412] border border-[#26231E] space-y-2">
                <div className="flex items-center justify-between text-xs text-[#A8A29E]">
                  <span>Contacts & Sur-Mesure</span>
                  <MessageSquare className="w-4 h-4 text-sky-400" />
                </div>
                <div className="font-serif text-2xl font-bold text-sky-400">
                  {pendingInquiriesCount} <span className="text-sm font-sans font-normal text-[#8F8A81]">en attente</span>
                </div>
                <div className="text-[11px] text-[#8F8A81]">
                  {inquiries.length} message(s) au total
                </div>
              </div>
            </div>

            {/* Recent Orders and Quick Artworks Preview */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Recent Orders */}
              <div className="lg:col-span-7 bg-[#161412] p-5 rounded-2xl border border-[#26231E] space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-lg text-[#FAF8F5]">Dernières Ventes & Réservations</h3>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs text-[#D4AF37] hover:underline cursor-pointer"
                  >
                    Voir toutes ({orders.length}) →
                  </button>
                </div>

                {orders.length === 0 ? (
                  <p className="text-xs text-[#8F8A81] py-8 text-center">Aucune commande pour le moment.</p>
                ) : (
                  <div className="space-y-3">
                    {orders.slice(0, 4).map((order) => (
                      <div
                        key={order.id}
                        className="p-3 rounded-xl bg-[#1B1916] border border-[#28241F] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-[#FAF8F5]">{order.orderNumber}</span>
                            <span className="text-[10px] text-[#8F8A81]">· {order.date}</span>
                          </div>
                          <div className="text-[#C8C2B7]">
                            <strong>{order.customerName}</strong> ({order.deliveryCity})
                          </div>
                          <div className="text-[11px] text-[#A8A29E] truncate max-w-xs">
                            {order.items.map((i) => i.title).join(', ')}
                          </div>
                        </div>

                        <div className="text-right sm:shrink-0 space-y-1">
                          <div className="font-serif font-bold text-[#E6C665]">
                            {formatPrice(order.totalEUR, order.totalFCFA)}
                          </div>
                          <select
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
                            className="bg-[#121110] border border-[#2A2722] text-[11px] rounded px-2 py-0.5 text-white focus:outline-none focus:border-[#D4AF37]"
                          >
                            <option value="en_attente">En attente</option>
                            <option value="confirmee">Confirmée</option>
                            <option value="en_cours_expedition">En expédition</option>
                            <option value="livree">Livrée</option>
                            <option value="annulee">Annulée</option>
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Status of Paintings */}
              <div className="lg:col-span-5 bg-[#161412] p-5 rounded-2xl border border-[#26231E] space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-lg text-[#FAF8F5]">Toiles Récentes</h3>
                  <button
                    onClick={() => setActiveTab('catalog')}
                    className="text-xs text-[#D4AF37] hover:underline cursor-pointer"
                  >
                    Gérer le catalogue →
                  </button>
                </div>

                <div className="space-y-2.5">
                  {artworks.slice(0, 4).map((art) => (
                    <div
                      key={art.id}
                      className="p-2.5 rounded-xl bg-[#1B1916] border border-[#28241F] flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={art.imageUrl}
                          alt={art.title}
                          className="w-10 h-10 rounded-lg object-cover border border-white/10 shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="font-serif font-semibold text-[#FAF8F5] truncate">
                            {art.title}
                          </div>
                          <div className="text-[11px] text-[#8F8A81] truncate">
                            {art.dimensions} · {art.category}
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="font-serif font-bold text-[#E6C665]">
                          {formatPrice(art.priceEUR, art.priceFCFA)}
                        </div>
                        <span
                          className={`text-[10px] font-medium capitalize ${
                            art.status === 'disponible'
                              ? 'text-emerald-400'
                              : art.status === 'reserve'
                              ? 'text-amber-400'
                              : 'text-stone-400'
                          }`}
                        >
                          {art.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===================== TAB 2: CATALOG MANAGEMENT ===================== */}
        {activeTab === 'catalog' && (
          <div className="space-y-6">
            {/* Header with Search, Filter & New Button */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#161412] p-4 rounded-2xl border border-[#26231E]">
              <div className="flex items-center gap-3 flex-1 flex-wrap">
                {/* Search */}
                <div className="relative min-w-[220px] flex-1">
                  <Search className="w-4 h-4 text-[#8F8A81] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={catalogSearch}
                    onChange={(e) => setCatalogSearch(e.target.value)}
                    placeholder="Filtrer par titre, référence..."
                    className="w-full bg-[#1C1A17] border border-[#2D2A24] rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-[#6E6961] focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                {/* Status Filter */}
                <select
                  value={catalogStatusFilter}
                  onChange={(e) => setCatalogStatusFilter(e.target.value)}
                  className="bg-[#1C1A17] border border-[#2D2A24] text-[#FAF8F5] text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#D4AF37] cursor-pointer"
                >
                  <option value="all">Tous les états</option>
                  <option value="disponible">Disponibles</option>
                  <option value="reserve">Réservés</option>
                  <option value="vendu">Vendus</option>
                </select>

                {/* Collection Filter */}
                <select
                  value={catalogCategoryFilter}
                  onChange={(e) => setCatalogCategoryFilter(e.target.value)}
                  className="bg-[#1C1A17] border border-[#2D2A24] text-[#FAF8F5] text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#D4AF37] cursor-pointer"
                >
                  <option value="all">Toutes les collections</option>
                  {Array.from(new Set(artworks.map((a) => a.category)))
                    .filter(Boolean)
                    .map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                </select>
              </div>

              <button
                onClick={handleOpenNewArtwork}
                className="px-4 py-2 bg-[#D4AF37] hover:bg-[#E6C665] text-[#121110] font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition cursor-pointer shrink-0 shadow-lg shadow-[#D4AF37]/15"
              >
                <Plus className="w-4 h-4" />
                Publier un Nouveau Tableau
              </button>
            </div>

            {/* Catalog Artworks: Responsive Mobile Cards (< md) & Full Table (>= md) */}
            <div className="bg-[#161412] rounded-2xl border border-[#26231E] overflow-hidden">
              {filteredCatalog.length === 0 ? (
                <div className="py-12 text-center text-[#8F8A81] text-xs">
                  Aucun tableau ne correspond à cette recherche.
                </div>
              ) : (
                <>
                  {/* MOBILE VIEW: Touch-friendly cards for phones and compact tablets (< 768px) */}
                  <div className="block md:hidden divide-y divide-[#24211C]">
                    {filteredCatalog.map((art) => (
                      <div key={art.id} className="p-4 space-y-3">
                        <div className="flex items-start gap-3">
                          <img
                            src={art.imageUrl}
                            alt={art.title}
                            className="w-16 h-16 rounded-xl object-cover border border-white/10 shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-1">
                              <h4 className="font-serif font-bold text-sm text-[#FAF8F5] truncate">
                                {art.title}
                              </h4>
                              <button
                                onClick={() => updateArtwork(art.id, { isFeatured: !art.isFeatured })}
                                className={`p-1.5 rounded-lg border transition shrink-0 ${
                                  art.isFeatured
                                    ? 'bg-[#2A251D] border-[#D4AF37] text-[#D4AF37]'
                                    : 'border-[#2C2923] text-[#6E6961]'
                                }`}
                                title="Mettre en Coup de Cœur"
                              >
                                <Sparkles className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <div className="text-[11px] text-[#D4AF37] font-medium">
                              {art.category} · {art.year}
                            </div>
                            <div className="text-[11px] text-[#8F8A81] truncate">
                              {art.dimensions} · {art.inventoryNumber}
                            </div>
                            <div className="font-serif font-bold text-[#E6C665] text-sm mt-0.5">
                              {formatPrice(art.priceEUR, art.priceFCFA)}
                            </div>
                          </div>
                        </div>

                        {/* Status selector & Actions Bar */}
                        <div className="pt-2 border-t border-[#221F1B] flex flex-wrap items-center justify-between gap-2">
                          <select
                            value={art.status}
                            onChange={(e) => toggleArtworkStatus(art.id, e.target.value as any)}
                            className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold focus:outline-none cursor-pointer border ${
                              art.status === 'disponible'
                                ? 'bg-emerald-950/70 border-emerald-500/40 text-emerald-300'
                                : art.status === 'reserve'
                                ? 'bg-amber-950/70 border-amber-500/40 text-amber-300'
                                : 'bg-stone-900 border-stone-700 text-stone-300'
                            }`}
                          >
                            <option value="disponible">✓ Disponible</option>
                            <option value="reserve">⏳ Réservé</option>
                            <option value="vendu">✕ Vendu</option>
                          </select>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => {
                                setCertificateArtwork(art);
                                setCertificateOrder(undefined);
                              }}
                              className="p-2 rounded-lg bg-white/5 hover:bg-[#D4AF37]/20 text-[#D4AF37] border border-white/10 transition cursor-pointer min-h-[38px] min-w-[38px] flex items-center justify-center"
                              title="Certificat d'Authenticité"
                            >
                              <Award className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleOpenEdit(art)}
                              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#C8C2B7] hover:text-white border border-white/10 text-xs font-medium transition cursor-pointer flex items-center gap-1 min-h-[38px]"
                            >
                              <Edit className="w-3.5 h-3.5" />
                              <span>Modifier</span>
                            </button>
                            <button
                              onClick={() => handleDelete(art)}
                              className="p-2 rounded-lg bg-white/5 hover:bg-rose-950/50 text-[#8F8A81] hover:text-rose-400 border border-white/10 transition cursor-pointer min-h-[38px] min-w-[38px] flex items-center justify-center"
                              title="Supprimer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* DESKTOP & TABLET VIEW: High-density Table (>= md) */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left text-xs text-[#E8E4DF]">
                      <thead className="bg-[#1B1916] text-[#A8A29E] uppercase tracking-wider text-[10px] border-b border-[#26231E]">
                        <tr>
                          <th className="py-3 px-4">Œuvre</th>
                          <th className="py-3 px-3">Référence</th>
                          <th className="py-3 px-3">Technique & Dimensions</th>
                          <th className="py-3 px-3">Prix</th>
                          <th className="py-3 px-3">Statut Vente</th>
                          <th className="py-3 px-3">Coup de Cœur</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#24211C]">
                        {filteredCatalog.map((art) => (
                          <tr key={art.id} className="hover:bg-white/5 transition">
                            {/* Image & Title */}
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <img
                                  src={art.imageUrl}
                                  alt={art.title}
                                  className="w-12 h-12 rounded-lg object-cover border border-white/10 shrink-0"
                                />
                                <div>
                                  <div className="font-serif font-bold text-sm text-[#FAF8F5]">{art.title}</div>
                                  <div className="text-[11px] text-[#D4AF37]">{art.category} · {art.year}</div>
                                </div>
                              </div>
                            </td>

                            {/* Reference */}
                            <td className="py-3 px-3 font-mono text-[#A8A29E]">
                              {art.inventoryNumber}
                            </td>

                            {/* Tech & Dimensions */}
                            <td className="py-3 px-3">
                              <div className="text-white font-medium">{art.dimensions}</div>
                              <div className="text-[11px] text-[#8F8A81] truncate max-w-[180px]">{art.technique}</div>
                            </td>

                            {/* Price */}
                            <td className="py-3 px-3">
                              <div className="font-serif font-bold text-[#E6C665]">
                                {formatPrice(art.priceEUR, art.priceFCFA)}
                              </div>
                            </td>

                            {/* Status toggle dropdown */}
                            <td className="py-3 px-3">
                              <select
                                value={art.status}
                                onChange={(e) => toggleArtworkStatus(art.id, e.target.value as any)}
                                className={`rounded px-2 py-1 text-xs font-medium focus:outline-none cursor-pointer border ${
                                  art.status === 'disponible'
                                    ? 'bg-emerald-950/70 border-emerald-500/40 text-emerald-300'
                                    : art.status === 'reserve'
                                    ? 'bg-amber-950/70 border-amber-500/40 text-amber-300'
                                    : 'bg-stone-900 border-stone-700 text-stone-300'
                                }`}
                              >
                                <option value="disponible">Disponible</option>
                                <option value="reserve">Réservé</option>
                                <option value="vendu">Vendu</option>
                              </select>
                            </td>

                            {/* Featured toggle */}
                            <td className="py-3 px-3">
                              <button
                                onClick={() => updateArtwork(art.id, { isFeatured: !art.isFeatured })}
                                className={`p-1.5 rounded-lg border transition cursor-pointer ${
                                  art.isFeatured
                                    ? 'bg-[#2A251D] border-[#D4AF37] text-[#D4AF37]'
                                    : 'border-[#2C2923] text-[#6E6961] hover:text-white'
                                }`}
                                title="Activer/Désactiver en Coup de Cœur sur l'accueil"
                              >
                                <Sparkles className="w-3.5 h-3.5" />
                              </button>
                            </td>

                            {/* Actions */}
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                {/* Certificate Generator */}
                                <button
                                  onClick={() => {
                                    setCertificateArtwork(art);
                                    setCertificateOrder(undefined);
                                  }}
                                  className="p-1.5 rounded-lg bg-white/5 hover:bg-[#D4AF37]/20 text-[#D4AF37] transition cursor-pointer"
                                  title="Imprimer le Certificat d'Authenticité"
                                >
                                  <Award className="w-4 h-4" />
                                </button>

                                {/* Edit */}
                                <button
                                  onClick={() => handleOpenEdit(art)}
                                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#C8C2B7] hover:text-white transition cursor-pointer"
                                  title="Modifier les détails de la toile"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>

                                {/* Delete */}
                                <button
                                  onClick={() => handleDelete(art)}
                                  className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-950/50 text-[#8F8A81] hover:text-rose-400 transition cursor-pointer"
                                  title="Supprimer du catalogue"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* ===================== TAB: GALLERIES & COLLECTIONS MANAGEMENT ===================== */}
        {activeTab === 'galleries' && (
          <div className="space-y-6">
            {/* Header with New Gallery / Collection */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#161412] p-5 rounded-2xl border border-[#26231E]">
              <div>
                <h3 className="font-serif text-lg text-[#FAF8F5] flex items-center gap-2">
                  <Layers className="w-5 h-5 text-[#D4AF37]" />
                  Gestion des Galeries & Collections ({galleries.length})
                </h3>
                <p className="text-xs text-[#A8A29E] mt-1">
                  Créez de nouvelles séries artistiques, renommez vos collections, ou supprimez définitivement une galerie avec option de transférer ou supprimer ses tableaux.
                </p>
              </div>

              <button
                onClick={() => setIsCreatingGallery((prev) => !prev)}
                className="px-4 py-2 bg-[#D4AF37] hover:bg-[#E6C665] text-[#121110] font-bold rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-1.5 shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Nouvelle Galerie / Collection</span>
              </button>
            </div>

            {/* Notification alert on action */}
            {galleryActionSuccess && (
              <div className="p-4 bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{galleryActionSuccess}</span>
                </div>
                <button
                  onClick={() => setGalleryActionSuccess(null)}
                  className="text-emerald-400 hover:text-white text-xs cursor-pointer ml-4"
                >
                  Fermer
                </button>
              </div>
            )}

            {/* Inline Creation Box if toggled */}
            {isCreatingGallery && (
              <div className="bg-[#1B1916] p-5 rounded-2xl border border-[#D4AF37]/40 space-y-3">
                <h4 className="text-xs font-semibold text-[#FAF8F5] uppercase tracking-wider flex items-center gap-2">
                  <FolderPlus className="w-4 h-4 text-[#D4AF37]" />
                  Ajouter une nouvelle série ou galerie
                </h4>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    value={newGalleryInput}
                    onChange={(e) => setNewGalleryInput(e.target.value)}
                    placeholder="Nom de la nouvelle galerie (ex: Série Terres Brûlées, Rituels Nomades...)"
                    className="flex-1 bg-[#141210] border border-[#2D2A24] rounded-xl px-3.5 py-2 text-xs text-white placeholder-[#6E6961] focus:outline-none focus:border-[#D4AF37]"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleCreateGallery();
                      }
                    }}
                  />
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={handleCreateGallery}
                      className="px-4 py-2 bg-[#D4AF37] hover:bg-[#E6C665] text-[#121110] font-bold rounded-xl text-xs transition cursor-pointer"
                    >
                      Enregistrer
                    </button>
                    <button
                      onClick={() => {
                        setIsCreatingGallery(false);
                        setNewGalleryInput('');
                      }}
                      className="px-3 py-2 bg-white/5 hover:bg-white/10 text-[#A8A29E] rounded-xl text-xs transition cursor-pointer"
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Galleries Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {galleries.map((galleryName) => {
                const galleryArtworks = artworks.filter((a) => a.category === galleryName);
                const count = galleryArtworks.length;
                const totalEUR = galleryArtworks.reduce((acc, a) => acc + a.priceEUR, 0);
                const totalFCFA = galleryArtworks.reduce((acc, a) => acc + a.priceFCFA, 0);
                const availableCount = galleryArtworks.filter((a) => a.status === 'disponible').length;

                return (
                  <div
                    key={galleryName}
                    className="bg-[#161412] p-5 rounded-2xl border border-[#26231E] hover:border-[#D4AF37]/30 transition flex flex-col justify-between space-y-4"
                  >
                    <div>
                      {/* Title & Badges */}
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] uppercase tracking-wider text-[#D4AF37] font-semibold">
                            Collection
                          </span>
                          <h4 className="font-serif text-base text-[#FAF8F5] font-bold mt-0.5">
                            {galleryName}
                          </h4>
                        </div>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                            count > 0
                              ? 'bg-[#1F1C18] text-[#D4AF37] border-[#D4AF37]/30'
                              : 'bg-stone-900 text-stone-400 border-stone-800'
                          }`}
                        >
                          {count} {count > 1 ? 'toiles' : 'toile'}
                        </span>
                      </div>

                      {/* Financial valuation & stats */}
                      <div className="mt-3 flex items-center justify-between text-xs py-2 px-3 rounded-xl bg-[#1B1916] border border-[#24211C]">
                        <div>
                          <div className="text-[10px] text-[#8F8A81]">Valeur totale</div>
                          <div className="font-serif font-bold text-[#FAF8F5]">
                            {count > 0 ? formatPrice(totalEUR, totalFCFA) : '0 €'}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-[10px] text-[#8F8A81]">Disponibles</div>
                          <div className="font-semibold text-emerald-400">
                            {availableCount} en vente
                          </div>
                        </div>
                      </div>

                      {/* Artworks Previews */}
                      <div className="mt-4">
                        <div className="text-[10px] text-[#8F8A81] mb-1.5 uppercase tracking-wider">
                          Aperçu des œuvres
                        </div>
                        {count > 0 ? (
                          <div className="flex items-center gap-2 overflow-hidden">
                            {galleryArtworks.slice(0, 4).map((art) => (
                              <img
                                key={art.id}
                                src={art.imageUrl}
                                alt={art.title}
                                title={art.title}
                                className="w-12 h-12 rounded-lg object-cover border border-white/10 shrink-0"
                              />
                            ))}
                            {count > 4 && (
                              <div className="w-12 h-12 rounded-lg bg-[#221F1B] border border-white/10 flex items-center justify-center text-[10px] font-bold text-[#D4AF37] shrink-0">
                                +{count - 4}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="p-3 rounded-xl bg-[#181614] border border-dashed border-[#2D2A24] text-center text-xs text-[#6E6961]">
                            Aucun tableau dans cette galerie
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="pt-3 border-t border-[#24211C] flex items-center justify-between gap-2">
                      <button
                        onClick={() => {
                          setCatalogCategoryFilter(galleryName);
                          setActiveTab('catalog');
                        }}
                        className="text-xs text-[#FAF8F5] hover:text-[#D4AF37] flex items-center gap-1 transition cursor-pointer"
                        title="Voir les tableaux de cette galerie"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Voir ({count})</span>
                      </button>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            setGalleryToRename(galleryName);
                            setNewGalleryName(galleryName);
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#C8C2B7] hover:text-white border border-white/10 text-xs transition cursor-pointer flex items-center gap-1"
                          title="Renommer cette galerie"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Renommer</span>
                        </button>

                        <button
                          onClick={() => handleInitiateDeleteGallery(galleryName)}
                          className="px-2.5 py-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 hover:text-rose-100 border border-rose-500/30 text-xs transition cursor-pointer flex items-center gap-1"
                          title="Supprimer cette galerie"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                          <span>Supprimer</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ===================== TAB 3: ORDERS & SALES ===================== */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-[#161412] p-4 rounded-2xl border border-[#26231E]">
              <div>
                <h3 className="font-serif text-lg text-[#FAF8F5]">Suivi des Ventes & Réservations</h3>
                <p className="text-xs text-[#A8A29E]">
                  Gérez les expéditions de toiles, préparez les certificats et contactez directement les acquéreurs.
                </p>
              </div>
              <div className="font-serif font-bold text-sm text-[#E6C665]">
                Total cumulé : {formatPrice(totalSalesRevenueEUR, totalSalesRevenueFCFA)}
              </div>
            </div>

            {orders.length === 0 ? (
              <div className="bg-[#161412] p-12 text-center rounded-2xl border border-[#26231E] space-y-2">
                <ShoppingBag className="w-10 h-10 text-[#8F8A81] mx-auto" />
                <h4 className="font-serif text-base text-[#FAF8F5]">Aucune commande pour le moment</h4>
                <p className="text-xs text-[#A8A29E]">
                  Dès qu'un visiteur réserve un tableau en ligne, sa commande apparaîtra ici instantanément.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => {
                  const cleanPhone = (order.customerPhone || '').replace(/[^0-9]/g, '');
                  const clientWhatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                    `Bonjour ${order.customerName}, c'est l'artiste BANORA au sujet de votre commande ${order.orderNumber}. Je vous remercie chaleureusement pour votre acquisition de : ${order.items
                      .map((i) => i.title)
                      .join(', ')}.`
                  )}`;

                  return (
                    <div
                      key={order.id}
                      className="p-5 rounded-2xl bg-[#161412] border border-[#26231E] space-y-4"
                    >
                      {/* Top Header of Order */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#24211C]">
                        <div className="flex items-center gap-3">
                          <span className="font-mono font-bold text-base text-[#FAF8F5]">
                            {order.orderNumber}
                          </span>
                          <span className="text-xs text-[#8F8A81]">· Passée le {order.date}</span>
                        </div>

                        {/* Status selector */}
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-[#8F8A81]">Statut :</span>
                          <select
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
                            className="bg-[#1C1A17] border border-[#2D2A24] text-xs font-semibold rounded-lg px-2.5 py-1 text-[#E6C665] focus:outline-none focus:border-[#D4AF37] cursor-pointer"
                          >
                            <option value="en_attente">⏳ En attente de règlement</option>
                            <option value="confirmee">✓ Confirmée / Paiement reçu</option>
                            <option value="en_cours_expedition">📦 En cours d'expédition d'art</option>
                            <option value="livree">✨ Livrée au collectionneur</option>
                            <option value="annulee">✕ Annulée</option>
                          </select>
                        </div>
                      </div>

                      {/* Items & Client info */}
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 text-xs">
                        {/* Artwork items */}
                        <div className="md:col-span-7 space-y-3">
                          <span className="font-semibold uppercase tracking-wider text-[10px] text-[#D4AF37] block">
                            Œuvres commandées :
                          </span>
                          <div className="space-y-2">
                            {order.items.map((item, idx) => {
                              const correspondingArt = artworks.find((a) => a.id === item.artworkId);
                              return (
                                <div
                                  key={idx}
                                  className="p-2.5 rounded-xl bg-[#1B1916] border border-[#28241F] flex items-center justify-between gap-3"
                                >
                                  <div className="flex items-center gap-2.5">
                                    <img
                                      src={item.imageUrl}
                                      alt={item.title}
                                      className="w-12 h-12 rounded object-cover border border-white/10"
                                    />
                                    <div>
                                      <div className="font-serif font-bold text-sm text-[#FAF8F5]">
                                        {item.title}
                                      </div>
                                      <div className="text-[11px] text-[#A8A29E]">
                                        Option : {item.frame}
                                      </div>
                                    </div>
                                  </div>

                                  <div className="text-right">
                                    <div className="font-serif font-bold text-[#E6C665]">
                                      {formatPrice(
                                        item.priceEUR + item.frameCostEUR,
                                        item.priceFCFA + item.frameCostFCFA
                                      )}
                                    </div>
                                    {correspondingArt && (
                                      <button
                                        onClick={() => {
                                          setCertificateArtwork(correspondingArt);
                                          setCertificateOrder(order);
                                        }}
                                        className="text-[10px] text-[#D4AF37] hover:underline flex items-center gap-1 mt-0.5"
                                      >
                                        <Award className="w-3 h-3" /> Certificat
                                      </button>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Collector info */}
                        <div className="md:col-span-5 space-y-2 bg-[#1A1815] p-3.5 rounded-xl border border-[#28241F]">
                          <span className="font-semibold uppercase tracking-wider text-[10px] text-[#D4AF37] block">
                            Coordonnées de l'acquéreur :
                          </span>
                          <div className="text-[#C8C2B7] space-y-1">
                            <div className="font-semibold text-white text-sm">{order.customerName}</div>
                            <div>Email : {order.customerEmail}</div>
                            <div>Tél / WhatsApp : {order.customerPhone}</div>
                            <div>
                              Adresse : {order.deliveryAddress}, {order.deliveryCity} ({order.deliveryCountry})
                            </div>
                            <div className="text-[11px] text-[#A8A29E] pt-1">
                              Règlement souhaité : <strong className="text-white capitalize">{order.paymentMethod.replace('_', ' ')}</strong>
                            </div>
                            {order.notes && (
                              <div className="text-[11px] italic text-[#A8A29E] bg-[#141311] p-2 rounded border border-[#24211C] mt-2">
                                Note : {order.notes}
                              </div>
                            )}
                          </div>

                          <div className="pt-2 flex gap-2">
                            <a
                              href={clientWhatsappUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 py-1.5 px-3 bg-[#1F2C24] hover:bg-[#283B30] text-emerald-300 border border-emerald-600/40 rounded-lg text-center flex items-center justify-center gap-1.5 transition"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              Contacter WhatsApp
                            </a>
                          </div>
                        </div>
                      </div>

                      {/* Total */}
                      <div className="pt-3 border-t border-[#24211C] flex justify-between items-center">
                        <span className="text-[#8F8A81]">Total de la commande :</span>
                        <span className="font-serif text-lg font-bold text-[#E6C665]">
                          {formatPrice(order.totalEUR, order.totalFCFA)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ===================== TAB 4: CLIENT INQUIRIES ===================== */}
        {activeTab === 'inquiries' && (
          <div className="space-y-6">
            <div className="bg-[#161412] p-4 rounded-2xl border border-[#26231E]">
              <h3 className="font-serif text-lg text-[#FAF8F5]">Messages & Demandes Sur-Mesure</h3>
              <p className="text-xs text-[#A8A29E]">
                Questions sur les toiles exposées ou demandes de création personnalisée pour les intérieurs et galeries.
              </p>
            </div>

            {inquiries.length === 0 ? (
              <div className="bg-[#161412] p-12 text-center rounded-2xl border border-[#26231E] space-y-2">
                <MessageSquare className="w-10 h-10 text-[#8F8A81] mx-auto" />
                <h4 className="font-serif text-base text-[#FAF8F5]">Aucune demande pour l'instant</h4>
                <p className="text-xs text-[#A8A29E]">
                  Les messages envoyés depuis le formulaire de sur-mesure ou de contact apparaîtront ici.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {inquiries.map((inq) => {
                  const cleanPhone = (inq.phone || '').replace(/[^0-9]/g, '');
                  const replyUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                    `Bonjour ${inq.name}, c'est BANORA. J'ai bien reçu votre message : "${inq.message.slice(0, 80)}..."`
                  )}`;

                  return (
                    <div
                      key={inq.id}
                      className="p-4 rounded-2xl bg-[#161412] border border-[#26231E] space-y-3 text-xs"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#24211C]">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white text-sm">{inq.name}</span>
                          {inq.isCommission && (
                            <span className="bg-[#D4AF37]/20 text-[#E6C665] border border-[#D4AF37]/40 px-2 py-0.5 rounded text-[10px] font-medium">
                              Commande Sur-Mesure
                            </span>
                          )}
                          <span className="text-[#8F8A81] text-[11px]">· {inq.date}</span>
                        </div>

                        <select
                          value={inq.status}
                          onChange={(e) => updateInquiryStatus(inq.id, e.target.value as any)}
                          className="bg-[#1A1815] border border-[#2D2A24] text-[11px] rounded px-2 py-1 text-white focus:outline-none focus:border-[#D4AF37]"
                        >
                          <option value="nouveau">Nouveau message</option>
                          <option value="repondu">Répondu</option>
                          <option value="archive">Archivé</option>
                        </select>
                      </div>

                      <div className="text-[#C8C2B7] space-y-2">
                        <div className="text-[11px] text-[#A8A29E]">
                          Email : {inq.email} · Tél : {inq.phone}
                        </div>
                        <div className="p-3 bg-[#1B1916] rounded-xl border border-[#28241F] whitespace-pre-line leading-relaxed text-[#FAF8F5]">
                          {inq.message}
                        </div>

                        {inq.photoUrl && (
                          <div className="p-3 bg-[#1B1916] rounded-xl border border-[#D4AF37]/40 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                            <div
                              className="relative group cursor-pointer shrink-0"
                              onClick={() =>
                                setPreviewInquiryPhoto({
                                  url: inq.photoUrl!,
                                  title: `Photo de commande sur-mesure — ${inq.name}`,
                                })
                              }
                            >
                              <img
                                src={inq.photoUrl}
                                alt="Photo du client"
                                className="w-16 h-16 rounded-lg object-cover border border-[#D4AF37]/50 group-hover:opacity-90 transition shadow-md"
                              />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-lg transition">
                                <Eye className="w-4 h-4 text-white" />
                              </div>
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-semibold text-[#D4AF37] bg-[#2A241A] px-2 py-0.5 rounded border border-[#D4AF37]/30">
                                  Photo de référence jointe
                                </span>
                                {inq.photoName && (
                                  <span className="text-[11px] text-[#A8A29E] truncate">
                                    {inq.photoName}
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-[#8F8A81] mt-1">
                                Photo importée depuis la galerie ou l'appareil du client pour guider les dimensions et teintes de sa commande.
                              </p>
                              <button
                                type="button"
                                onClick={() =>
                                  setPreviewInquiryPhoto({
                                    url: inq.photoUrl!,
                                    title: `Photo de commande sur-mesure — ${inq.name}`,
                                  })
                                }
                                className="mt-1 text-xs text-[#D4AF37] hover:underline flex items-center gap-1 cursor-pointer font-medium"
                              >
                                <Eye className="w-3.5 h-3.5" /> Agrandir la photo
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex justify-end gap-2 pt-1">
                        <a
                          href={replyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 bg-[#1F2C24] hover:bg-[#283B30] text-emerald-300 border border-emerald-600/40 rounded-lg flex items-center gap-1.5 transition"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          Répondre sur WhatsApp
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ===================== TAB 5: TESTIMONIALS MANAGEMENT ===================== */}
        {activeTab === 'testimonials' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#161412] p-4 rounded-2xl border border-[#26231E]">
              <div>
                <h3 className="font-serif text-lg text-[#FAF8F5]">Témoignages & Avis des Collectionneurs</h3>
                <p className="text-xs text-[#A8A29E]">
                  Consultez et modérez les retours d'expérience affichés publiquement sous votre biographie d'artiste.
                </p>
              </div>
              <div className="text-xs text-[#D4AF37] font-semibold bg-[#1C1A17] px-3 py-1.5 rounded-lg border border-[#2D2A24]">
                {testimonials.length} avis actif(s)
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {testimonials.map((t) => (
                <div
                  key={t.id}
                  className="p-5 rounded-2xl bg-[#161412] border border-[#26231E] flex flex-col justify-between space-y-4 text-xs"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-serif font-bold text-sm text-[#FAF8F5]">{t.authorName}</span>
                        {t.verifiedPurchase && (
                          <span className="text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-1.5 py-0.5 rounded">
                            Vérifié
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < t.rating ? 'text-[#D4AF37] fill-[#D4AF37]' : 'text-stone-700'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="text-[11px] text-[#A8A29E]">
                      {t.roleOrCity} {t.artworkAcquired && `· Œuvre : ${t.artworkAcquired}`} · {t.date}
                    </div>

                    <p className="text-[#C8C2B7] leading-relaxed italic bg-[#1B1916] p-3 rounded-xl border border-[#28241F]">
                      « {t.content} »
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[#24211C] flex justify-end">
                    <button
                      onClick={() => {
                        if (window.confirm(`Supprimer l'avis de ${t.authorName} ?`)) {
                          deleteTestimonial(t.id);
                        }
                      }}
                      className="px-2.5 py-1 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 rounded border border-rose-900/30 transition flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Supprimer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================== TAB 6: ARTIST PROFILE & SETTINGS ===================== */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <div className="bg-[#161412] p-5 rounded-2xl border border-[#26231E]">
              <h3 className="font-serif text-lg text-[#FAF8F5]">Profil Public & Paramètres de BANORA</h3>
              <p className="text-xs text-[#A8A29E]">
                Mettez à jour votre biographie, votre citation philosophique, vos coordonnées d'atelier et sauvegardez vos données.
              </p>
            </div>

            <form onSubmit={handleSaveProfile} className="bg-[#161412] p-6 rounded-2xl border border-[#26231E] space-y-4 text-xs">
              {profileSaved && (
                <div className="p-3 bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 rounded-xl flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Profil de l'artiste mis à jour avec succès !
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#A8A29E] mb-1">Nom d'Artiste</label>
                  <input
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full bg-[#1A1815] border border-[#2D2A24] rounded-lg px-3 py-2 text-white font-serif text-sm focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-[#A8A29E] mb-1">Titre Professionnel</label>
                  <input
                    type="text"
                    value={profileTitle}
                    onChange={(e) => setProfileTitle(e.target.value)}
                    className="w-full bg-[#1A1815] border border-[#2D2A24] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-[#A8A29E] mb-1">Numéro WhatsApp Officiel (format international)</label>
                  <input
                    type="text"
                    value={profileWhatsapp}
                    onChange={(e) => setProfileWhatsapp(e.target.value)}
                    placeholder="+221774508920"
                    className="w-full bg-[#1A1815] border border-[#2D2A24] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-[#A8A29E] mb-1">Email de l'Atelier</label>
                  <input
                    type="email"
                    value={profileEmail}
                    onChange={(e) => setProfileEmail(e.target.value)}
                    className="w-full bg-[#1A1815] border border-[#2D2A24] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[#A8A29E] mb-1">Adresse de la Galerie / Atelier</label>
                  <input
                    type="text"
                    value={profileAddress}
                    onChange={(e) => setProfileAddress(e.target.value)}
                    className="w-full bg-[#1A1815] border border-[#2D2A24] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[#A8A29E] mb-1">Citation ou Démarche Philosophique</label>
                  <input
                    type="text"
                    value={profilePhilosophy}
                    onChange={(e) => setProfilePhilosophy(e.target.value)}
                    className="w-full bg-[#1A1815] border border-[#2D2A24] rounded-lg px-3 py-2 text-white italic focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div className="sm:col-span-2 space-y-2">
                  <label className="block text-[#A8A29E] mb-1">
                    Photo de l'Atelier / Présentation (Page d'accueil)
                  </label>
                  <div className="flex flex-col sm:flex-row items-center gap-4 p-3.5 rounded-xl bg-[#1A1815] border border-[#2D2A24]">
                    {profileStudioImageUrl ? (
                      <img
                        src={profileStudioImageUrl}
                        alt="Aperçu atelier"
                        className="w-20 h-20 rounded-lg object-cover border border-[#D4AF37]/40 shrink-0"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-lg bg-[#221F1B] border border-[#2D2A24] flex items-center justify-center text-[10px] text-[#8F8A81] shrink-0 text-center p-1">
                        Aucune photo
                      </div>
                    )}
                    <div className="flex-1 w-full space-y-2">
                      <input
                        type="text"
                        value={profileStudioImageUrl}
                        onChange={(e) => setProfileStudioImageUrl(e.target.value)}
                        placeholder="URL de l'image de l'atelier..."
                        className="w-full bg-[#141210] border border-[#2D2A24] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                      />
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => profileStudioInputRef.current?.click()}
                          className="px-3 py-1.5 bg-[#26231E] hover:bg-[#332E27] text-[#FAF8F5] border border-[#D4AF37]/40 rounded-lg text-xs font-medium transition cursor-pointer flex items-center gap-1.5"
                        >
                          <span>Importer depuis l'appareil</span>
                        </button>
                        <input
                          type="file"
                          ref={profileStudioInputRef}
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                if (typeof reader.result === 'string') {
                                  setProfileStudioImageUrl(reader.result);
                                }
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="hidden"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[#A8A29E] mb-1">Biographie Complète</label>
                  <textarea
                    rows={4}
                    value={profileBio}
                    onChange={(e) => setProfileBio(e.target.value)}
                    className="w-full bg-[#1A1815] border border-[#2D2A24] rounded-lg px-3 py-2 text-white leading-relaxed focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#D4AF37] hover:bg-[#E6C665] text-[#121110] font-bold rounded-xl text-xs transition cursor-pointer"
                >
                  Enregistrer les Informations
                </button>
              </div>
            </form>

            {/* Expositions & Galeries d'Art Partenaires */}
            <div className="bg-[#161412] p-6 rounded-2xl border border-[#26231E] space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-serif text-base text-[#FAF8F5]">Expositions & Galeries Partenaires</h4>
                  <p className="text-xs text-[#A8A29E]">
                    Gérez les galeries d'art et foires internationales où vos œuvres ont été exposées.
                  </p>
                </div>
              </div>

              <div className="space-y-2.5">
                {artistProfile.exhibitions?.map((exh, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-[#1B1916] border border-[#28241F] flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="font-serif font-bold text-[#FAF8F5]">
                        {exh.year} · {exh.title}
                      </div>
                      <div className="text-[11px] text-[#A8A29E] mt-0.5">
                        Galerie : <span className="text-[#D4AF37] font-semibold">{exh.gallery}</span> · {exh.location}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm(`Supprimer l'exposition à la galerie « ${exh.gallery} » ?`)) {
                          const updated = artistProfile.exhibitions.filter((_, i) => i !== idx);
                          updateArtistProfile({ ...artistProfile, exhibitions: updated });
                        }
                      }}
                      className="p-2 rounded-lg bg-rose-950/30 hover:bg-rose-950/60 text-rose-400 hover:text-rose-200 border border-rose-900/30 transition cursor-pointer"
                      title="Supprimer cette galerie / exposition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Data Backup & Restore Center */}
            <div className="bg-[#161412] p-6 rounded-2xl border border-[#26231E] space-y-4 text-xs">
              <h4 className="font-serif text-base text-[#FAF8F5]">Gestion & Sauvegarde des Données</h4>
              <p className="text-xs text-[#A8A29E]">
                Vous pouvez exporter l'intégralité de vos toiles, descriptions, photos et commandes sous forme de fichier de sauvegarde JSON pour ne rien perdre.
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  type="button"
                  onClick={exportDataJSON}
                  className="px-4 py-2 bg-[#201E1A] hover:bg-[#2C2721] text-[#E6C665] border border-[#D4AF37]/40 rounded-xl flex items-center gap-2 transition cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  Exporter la Sauvegarde JSON
                </button>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-[#201E1A] hover:bg-[#2C2721] text-[#FAF8F5] border border-[#2D2A24] rounded-xl flex items-center gap-2 transition cursor-pointer"
                >
                  <Upload className="w-4 h-4" />
                  Importer un fichier JSON
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".json"
                  onChange={handleImportFile}
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm("Voulez-vous restaurer les tableaux et commandes d'exemple d'origine ?")) {
                      resetToDefault();
                    }
                  }}
                  className="px-4 py-2 bg-rose-950/30 hover:bg-rose-950/60 text-rose-300 border border-rose-500/30 rounded-xl flex items-center gap-2 transition cursor-pointer ml-auto"
                >
                  <RotateCcw className="w-4 h-4" />
                  Réinitialiser le catalogue d'exemple
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Artwork Edit Modal */}
      <ArtworkEditModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setArtworkToEdit(null);
        }}
        artworkToEdit={artworkToEdit}
      />

      {/* Certificate Modal */}
      {certificateArtwork && (
        <CertificateModal
          artwork={certificateArtwork}
          order={certificateOrder}
          onClose={() => {
            setCertificateArtwork(null);
            setCertificateOrder(undefined);
          }}
        />
      )}

      {/* ===================== MODAL DE SUPPRESSION DE GALERIE ===================== */}
      {galleryToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#181614] border border-rose-500/40 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl text-xs">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-400 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-serif text-lg text-[#FAF8F5] font-bold">
                  Supprimer la galerie « {galleryToDelete} »
                </h3>
                <p className="text-xs text-[#A8A29E] mt-1">
                  Confirmez la suppression de cette galerie. L'action sera immédiatement synchronisée en direct sur le site et toutes les applications mobiles installées.
                </p>
              </div>
            </div>

            {(() => {
              const countInGallery = artworks.filter((a) => a.category === galleryToDelete).length;
              const otherGalleries = galleries.filter((g) => g !== galleryToDelete);

              return (
                <div className="space-y-4">
                  {countInGallery > 0 ? (
                    <div className="p-4 rounded-xl bg-[#201C19] border border-[#332C25] space-y-3">
                      <div className="font-semibold text-amber-300 flex items-center gap-2">
                        <span>Cette galerie contient actuellement {countInGallery} œuvre{countInGallery > 1 ? 's' : ''}.</span>
                      </div>
                      <p className="text-[#C8C2B7] text-xs">
                        Que souhaitez-vous faire des {countInGallery} tableau{countInGallery > 1 ? 'x' : ''} associés ?
                      </p>

                      <div className="space-y-2.5 pt-1">
                        <label className="flex items-start gap-2.5 p-2.5 rounded-lg border border-[#2D2822] bg-[#161412] cursor-pointer hover:border-[#D4AF37]/50 transition">
                          <input
                            type="radio"
                            name="artworkAction"
                            checked={!deleteArtworksWithGallery}
                            onChange={() => setDeleteArtworksWithGallery(false)}
                            className="mt-0.5 accent-[#D4AF37]"
                          />
                          <div className="flex-1">
                            <span className="font-medium text-[#FAF8F5] block">
                              Conserver les {countInGallery} œuvre{countInGallery > 1 ? 's' : ''} et les transférer
                            </span>
                            <span className="text-[11px] text-[#8F8A81] block mt-0.5">
                              Déplace les toiles vers une autre collection de votre choix
                            </span>
                            {!deleteArtworksWithGallery && otherGalleries.length > 0 && (
                              <div className="mt-2">
                                <label className="text-[10px] text-[#D4AF37] uppercase tracking-wider block mb-1">
                                  Sélectionner la galerie de destination :
                                </label>
                                <select
                                  value={reassignTargetGallery || otherGalleries[0]}
                                  onChange={(e) => setReassignTargetGallery(e.target.value)}
                                  className="w-full bg-[#1F1C18] border border-[#D4AF37]/40 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none"
                                >
                                  {otherGalleries.map((g) => (
                                    <option key={g} value={g}>
                                      {g}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            )}
                          </div>
                        </label>

                        <label className="flex items-start gap-2.5 p-2.5 rounded-lg border border-rose-900/30 bg-rose-950/20 cursor-pointer hover:border-rose-500/50 transition">
                          <input
                            type="radio"
                            name="artworkAction"
                            checked={deleteArtworksWithGallery}
                            onChange={() => setDeleteArtworksWithGallery(true)}
                            className="mt-0.5 accent-rose-500"
                          />
                          <div>
                            <span className="font-medium text-rose-300 block">
                              Supprimer également les {countInGallery} œuvre{countInGallery > 1 ? 's' : ''}
                            </span>
                            <span className="text-[11px] text-[#A8A29E] block mt-0.5">
                              Ces toiles seront définitivement effacées du catalogue et de la base de données.
                            </span>
                          </div>
                        </label>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3.5 rounded-xl bg-[#201C19] border border-[#332C25] text-stone-300 text-xs">
                      ✓ Cette galerie ne contient actuellement aucun tableau (0 œuvre). Elle sera supprimée sans affecter le catalogue existant.
                    </div>
                  )}

                  <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[#26231E]">
                    <button
                      type="button"
                      onClick={() => setGalleryToDelete(null)}
                      className="px-4 py-2 bg-white/5 hover:bg-white/10 text-[#C8C2B7] rounded-xl text-xs transition cursor-pointer"
                    >
                      Annuler
                    </button>
                    <button
                      type="button"
                      onClick={handleConfirmDeleteGallery}
                      className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs transition cursor-pointer flex items-center gap-1.5 shadow-lg shadow-rose-950"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Confirmer la suppression</span>
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* ===================== MODAL DE RENOMMAGE DE GALERIE ===================== */}
      {galleryToRename && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#181614] border border-[#2D2A24] rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl text-xs">
            <h3 className="font-serif text-base text-[#FAF8F5] font-bold">
              Renommer la collection « {galleryToRename} »
            </h3>
            <p className="text-xs text-[#A8A29E]">
              Tous les tableaux appartenant à cette collection seront automatiquement mis à jour avec le nouveau nom.
            </p>
            <input
              type="text"
              value={newGalleryName}
              onChange={(e) => setNewGalleryName(e.target.value)}
              className="w-full bg-[#13110F] border border-[#D4AF37]/50 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
              placeholder="Nouveau nom de la galerie..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleConfirmRenameGallery();
                }
              }}
            />
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#24211C]">
              <button
                type="button"
                onClick={() => setGalleryToRename(null)}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-[#C8C2B7] rounded-xl text-xs transition cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleConfirmRenameGallery}
                className="px-4 py-2 bg-[#D4AF37] hover:bg-[#E6C665] text-[#121110] font-bold rounded-xl text-xs transition cursor-pointer"
              >
                Enregistrer le nouveau nom
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================== MODAL DE VISUALISATION PHOTO DU CLIENT ===================== */}
      {previewInquiryPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
          onClick={() => setPreviewInquiryPhoto(null)}
        >
          <div
            className="bg-[#181614] border border-[#D4AF37]/50 rounded-2xl max-w-3xl w-full p-4 sm:p-6 space-y-4 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-[#28241F]">
              <h3 className="font-serif text-sm sm:text-base text-[#FAF8F5] font-bold">
                {previewInquiryPhoto.title}
              </h3>
              <button
                type="button"
                onClick={() => setPreviewInquiryPhoto(null)}
                className="p-1 rounded-lg hover:bg-white/10 text-[#A8A29E] hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center justify-center max-h-[75vh] overflow-hidden rounded-xl bg-black/40">
              <img
                src={previewInquiryPhoto.url}
                alt="Aperçu agrandi"
                className="max-h-[72vh] w-auto max-w-full object-contain rounded-lg shadow-lg"
              />
            </div>

            <div className="flex justify-between items-center pt-2 text-xs text-[#8F8A81]">
              <span>Photo importée par le client depuis sa galerie ou son appareil</span>
              <a
                href={previewInquiryPhoto.url}
                download="photo-reference-banora.jpg"
                className="px-3 py-1.5 bg-[#201E1A] hover:bg-[#2C2721] text-[#D4AF37] border border-[#D4AF37]/30 rounded-lg flex items-center gap-1.5 transition cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" /> Télécharger la photo
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
