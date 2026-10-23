import React from 'react';
import { useArt } from '../../context/ArtContext';
import {
  Palette,
  Eye,
  User,
  ShoppingBag,
  Lock,
  Paintbrush
} from 'lucide-react';

interface Props {
  onOpenAdminLogin: () => void;
}

export const MobileBottomNav: React.FC<Props> = ({ onOpenAdminLogin }) => {
  const { cart, setIsCartOpen, artworks, setVisualizerArtwork, setIsCommissionOpen, isAdmin } = useArt();
  const totalCartCount = cart.length;

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenVisualizer = () => {
    const available = artworks.filter((a) => a.status === 'disponible');
    if (available.length > 0) {
      setVisualizerArtwork(available[0]);
    } else if (artworks.length > 0) {
      setVisualizerArtwork(artworks[0]);
    }
  };

  return (
    <nav
      aria-label="Navigation mobile"
      className="fixed bottom-0 left-0 right-0 z-40 bg-[#12110F]/95 backdrop-blur-xl border-t border-[#2A261F] md:hidden px-1 pt-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-[0_-8px_30px_rgba(0,0,0,0.6)]"
    >
      <div className="grid grid-cols-6 items-center gap-0.5 max-w-lg mx-auto">
        {/* Tab 1: Galerie */}
        <button
          onClick={() => scrollToSection('catalogue')}
          className="flex flex-col items-center justify-center min-h-[44px] py-1 text-[#A8A29E] hover:text-[#FAF8F5] active:text-[#D4AF37] transition group cursor-pointer"
        >
          <Palette className="w-4 h-4 group-hover:text-[#D4AF37] transition" />
          <span className="text-[9px] font-medium tracking-tight mt-1">Galerie</span>
        </button>

        {/* Tab 2: Sur-Mesure / Créer commande */}
        <button
          onClick={() => setIsCommissionOpen(true)}
          className="flex flex-col items-center justify-center min-h-[44px] py-1 text-[#D4AF37] hover:text-white active:text-[#E6C665] transition group cursor-pointer"
        >
          <Paintbrush className="w-4 h-4 group-hover:scale-110 transition-transform" />
          <span className="text-[9px] font-semibold tracking-tight mt-1">Créer</span>
        </button>

        {/* Tab 3: Voir au mur */}
        <button
          onClick={handleOpenVisualizer}
          className="flex flex-col items-center justify-center min-h-[44px] py-1 text-[#A8A29E] hover:text-[#FAF8F5] active:text-[#D4AF37] transition group cursor-pointer"
        >
          <Eye className="w-4 h-4 text-[#D4AF37] group-hover:scale-110 transition-transform" />
          <span className="text-[9px] font-medium tracking-tight mt-1 text-[#E6C665]">Au Mur</span>
        </button>

        {/* Tab 4: L'Artiste */}
        <button
          onClick={() => scrollToSection('artiste')}
          className="flex flex-col items-center justify-center min-h-[44px] py-1 text-[#A8A29E] hover:text-[#FAF8F5] active:text-[#D4AF37] transition group cursor-pointer"
        >
          <User className="w-4 h-4 group-hover:text-[#D4AF37] transition" />
          <span className="text-[9px] font-medium tracking-tight mt-1">BANORA</span>
        </button>

        {/* Tab 5: Panier */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="relative flex flex-col items-center justify-center min-h-[44px] py-1 text-[#A8A29E] hover:text-[#FAF8F5] active:text-[#D4AF37] transition group cursor-pointer"
        >
          <div className="relative">
            <ShoppingBag className="w-4 h-4 group-hover:text-[#D4AF37] transition" />
            {totalCartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 min-w-[15px] h-3.5 px-0.5 rounded-full bg-[#D4AF37] text-[#121110] text-[8px] font-bold flex items-center justify-center shadow-sm">
                {totalCartCount}
              </span>
            )}
          </div>
          <span className="text-[9px] font-medium tracking-tight mt-1">Panier</span>
        </button>

        {/* Tab 6: Admin */}
        <button
          onClick={onOpenAdminLogin}
          className={`flex flex-col items-center justify-center min-h-[44px] py-1 transition group cursor-pointer ${
            isAdmin ? 'text-amber-300' : 'text-[#8F8A81] hover:text-white'
          }`}
        >
          <Lock className="w-4 h-4 text-[#D4AF37] group-hover:scale-110 transition-transform" />
          <span className="text-[9px] font-medium tracking-tight mt-1">
            {isAdmin ? 'Admin' : 'Espace'}
          </span>
        </button>
      </div>
    </nav>
  );
};
