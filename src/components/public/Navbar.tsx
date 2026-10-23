import React, { useState } from 'react';
import { useArt } from '../../context/ArtContext';
import { PWAInstallButton } from '../pwa/PWAInstallButton';
import {
  ShoppingBag,
  Lock,
  Menu,
  X,
  Paintbrush,
  Sun,
  Moon,
} from 'lucide-react';

interface Props {
  onOpenAdminLogin: () => void;
}

export const Navbar: React.FC<Props> = ({ onOpenAdminLogin }) => {
  const {
    cart,
    setIsCartOpen,
    isAdmin,
    setIsCommissionOpen,
    theme,
    toggleTheme,
  } = useArt();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const totalCartCount = cart.length;

  return (
    <header className="sticky top-0 z-40 bg-[#121110]/95 backdrop-blur-md border-b border-[#25221B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <a
              href="#"
              className="group flex flex-col cursor-pointer"
            >
              <span className="font-serif text-2xl sm:text-3xl tracking-[0.25em] text-[#FAF8F5] group-hover:text-[#D4AF37] transition font-normal uppercase">
                BANORA
              </span>
              <span className="text-[9px] tracking-[0.35em] text-[#D4AF37] uppercase font-light -mt-1">
                Atelier & Galerie d'Art
              </span>
            </a>

            <div className="hidden lg:flex items-center gap-1.5 text-[10px] text-emerald-400 bg-emerald-950/50 border border-emerald-500/30 px-2 py-0.5 rounded-full select-none" title="Connexion permanente avec l'atelier de BANORA (Mises à jour instantanées)">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Direct Atelier</span>
            </div>
          </div>

          {/* Desktop Navigation Link */}
          <nav className="hidden md:flex items-center gap-8 text-xs tracking-wider uppercase text-[#C8C2B7]">
            <button
              onClick={() => setIsCommissionOpen(true)}
              className="hover:text-[#FAF8F5] transition py-1 border-b border-transparent hover:border-[#D4AF37] cursor-pointer flex items-center gap-2 font-medium"
            >
              <Paintbrush className="w-3.5 h-3.5 text-[#D4AF37]" />
              Créer votre commande
            </button>
          </nav>

          {/* Controls: Theme toggle, PWA Install, Cart, Admin toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme Toggle Button (Dark / Light Gallery) */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-[#1A1815] border border-[#2D2A24] text-[#C8C2B7] hover:text-[#FAF8F5] hover:border-[#D4AF37]/50 transition cursor-pointer flex items-center justify-center group"
              title={
                theme === 'dark'
                  ? 'Passer au thème Galerie Lumineuse (Blanc musée)'
                  : 'Passer au thème Atelier Sombre (Nocturne)'
              }
              aria-label={
                theme === 'dark'
                  ? 'Activer le thème Galerie Lumineuse'
                  : 'Activer le thème Atelier Sombre'
              }
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-[#E6C665] group-hover:rotate-45 transition-transform duration-300" />
              ) : (
                <Moon className="w-4 h-4 text-[#9C6E12] group-hover:-rotate-12 transition-transform duration-300" />
              )}
            </button>

            {/* PWA Install Button */}
            <PWAInstallButton variant="nav" />

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 rounded-lg bg-[#1A1815] border border-[#2D2A24] text-[#C8C2B7] hover:text-white hover:border-[#D4AF37]/40 transition cursor-pointer"
              title="Panier d'acquisition"
            >
              <ShoppingBag className="w-4 h-4" />
              {totalCartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#D4AF37] text-[#121110] text-[10px] font-bold flex items-center justify-center">
                  {totalCartCount}
                </span>
              )}
            </button>

            {/* Admin Portal Button */}
            <button
              onClick={onOpenAdminLogin}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer border ${
                isAdmin
                  ? 'bg-amber-950/40 border-amber-500/50 text-amber-300'
                  : 'bg-[#181613] border-[#2A2722] text-[#A8A29E] hover:text-white hover:border-[#D4AF37]/40'
              }`}
              title={isAdmin ? 'Accéder au Tableau de Bord de BANORA' : 'Connexion Espace Artiste BANORA'}
            >
              <Lock className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="hidden sm:inline">
                {isAdmin ? 'Espace Admin' : 'Admin'}
              </span>
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-[#1A1815] border border-[#2D2A24] text-[#C8C2B7]"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-[#25221B] space-y-2 bg-[#121110] text-xs uppercase tracking-wider text-[#C8C2B7]">
            {/* Theme switch in mobile menu */}
            <button
              onClick={toggleTheme}
              className="flex items-center justify-between w-full text-left py-2.5 px-3 rounded-lg bg-[#1A1815] border border-[#2D2A24] text-[#FAF8F5] transition"
            >
              <span className="flex items-center gap-2">
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-[#E6C665]" />
                ) : (
                  <Moon className="w-4 h-4 text-[#9C6E12]" />
                )}
                <span>
                  {theme === 'dark' ? 'Thème Galerie Lumineuse' : 'Thème Atelier Sombre'}
                </span>
              </span>
              <span className="text-[10px] font-bold text-[#D4AF37]">
                Basculer
              </span>
            </button>

            {/* Créer votre commande */}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setIsCommissionOpen(true);
              }}
              className="flex items-center gap-2 w-full text-left py-2.5 px-3 rounded-lg bg-[#1A1815] border border-[#2D2A24] text-[#D4AF37] font-medium"
            >
              <Paintbrush className="w-4 h-4" />
              Créer votre commande
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
