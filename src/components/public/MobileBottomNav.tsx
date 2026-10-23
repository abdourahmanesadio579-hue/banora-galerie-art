import React from 'react';
import { useArt } from '../../context/ArtContext';
import {
  ShoppingBag,
  Lock,
  Paintbrush
} from 'lucide-react';

interface Props {
  onOpenAdminLogin: () => void;
}

export const MobileBottomNav: React.FC<Props> = ({ onOpenAdminLogin }) => {
  const { cart, setIsCartOpen, setIsCommissionOpen, isAdmin } = useArt();
  const totalCartCount = cart.length;

  return (
    <nav
      aria-label="Navigation mobile"
      className="fixed bottom-0 left-0 right-0 z-40 bg-[#12110F]/95 backdrop-blur-xl border-t border-[#2A261F] md:hidden px-3 pt-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-[0_-8px_30px_rgba(0,0,0,0.6)]"
    >
      <div className="grid grid-cols-3 items-center gap-2 max-w-md mx-auto">
        {/* Tab 1: Sur-Mesure / Créer commande */}
        <button
          onClick={() => setIsCommissionOpen(true)}
          className="flex flex-col items-center justify-center min-h-[44px] py-1 text-[#D4AF37] hover:text-white active:text-[#E6C665] transition group cursor-pointer text-center"
        >
          <Paintbrush className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span className="text-[9px] sm:text-[10px] font-semibold tracking-tight mt-1 whitespace-nowrap">Créer votre commande</span>
        </button>

        {/* Tab 2: Panier */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="relative flex flex-col items-center justify-center min-h-[44px] py-1 text-[#A8A29E] hover:text-[#FAF8F5] active:text-[#D4AF37] transition group cursor-pointer"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 group-hover:text-[#D4AF37] transition" />
            {totalCartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-[#D4AF37] text-[#121110] text-[9px] font-bold flex items-center justify-center shadow-sm">
                {totalCartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-medium tracking-tight mt-1">Panier</span>
        </button>

        {/* Tab 3: Admin */}
        <button
          onClick={onOpenAdminLogin}
          className={`flex flex-col items-center justify-center min-h-[44px] py-1 transition group cursor-pointer ${
            isAdmin ? 'text-amber-300' : 'text-[#8F8A81] hover:text-white'
          }`}
        >
          <Lock className="w-5 h-5 text-[#D4AF37] group-hover:scale-110 transition-transform" />
          <span className="text-[10px] font-medium tracking-tight mt-1">
            {isAdmin ? 'Admin' : 'Espace'}
          </span>
        </button>
      </div>
    </nav>
  );
};
