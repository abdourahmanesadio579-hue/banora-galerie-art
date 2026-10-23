/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ArtProvider, useArt } from './context/ArtContext';
import { Navbar } from './components/public/Navbar';
import { Hero } from './components/public/Hero';
import { GalleryGrid } from './components/public/GalleryGrid';
import { ArtistBioSection } from './components/public/ArtistBioSection';
import { TestimonialsSection } from './components/public/TestimonialsSection';
import { Footer } from './components/public/Footer';
import { ArtworkDetailModal } from './components/public/ArtworkDetailModal';
import { RoomVisualizer } from './components/public/RoomVisualizer';
import { CartDrawer } from './components/public/CartDrawer';
import { CommissionModal } from './components/public/CommissionModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminLoginModal } from './components/admin/AdminLoginModal';
import { InternetRequiredGate } from './components/pwa/InternetRequiredGate';
import { LiveSyncNotification } from './components/public/LiveSyncNotification';
import { MobileBottomNav } from './components/public/MobileBottomNav';
import { Sparkles, ArrowRight, ShieldCheck, Palette, Lock } from 'lucide-react';

const GalleryAppContent: React.FC = () => {
  const { isAdmin, setIsAdmin } = useArt();
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [previewAsClient, setPreviewAsClient] = useState(false);

  // If user is admin and not in temporary client preview mode, render the Admin Dashboard
  if (isAdmin && !previewAsClient) {
    return (
      <div className="relative min-h-screen bg-[#100F0E]">
        {/* Top Floating Switcher to see Public Gallery Preview */}
        <div className="bg-[#1C1813] border-b border-[#362E22] px-3 sm:px-4 py-2.5 flex items-center justify-between text-xs text-[#E6C665] gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="truncate">Connecté : <strong>BANORA</strong></span>
          </div>
          <button
            onClick={() => setPreviewAsClient(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#D4AF37] hover:bg-[#E6C665] text-[#121110] font-semibold rounded-lg text-xs transition cursor-pointer shrink-0"
          >
            <Palette className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Aperçu Galerie (Mode Visiteur)</span>
            <span className="sm:hidden">Mode Visiteur</span>
          </button>
        </div>

        <AdminDashboard />
        <InternetRequiredGate />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121110] text-[#E8E4DF] flex flex-col font-sans selection:bg-[#D4AF37]/30 selection:text-white">
      {/* If admin is viewing the site in visitor preview mode, show top return banner */}
      {isAdmin && previewAsClient && (
        <div className="bg-amber-950/90 border-b border-amber-500/40 px-4 py-2.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-amber-200 sticky top-0 z-50 backdrop-blur-md">
          <span className="leading-snug">Mode Aperçu Visiteur — Vous naviguez sur votre galerie comme un client.</span>
          <button
            onClick={() => setPreviewAsClient(false)}
            className="px-3 py-1.5 bg-amber-400 text-black font-semibold rounded-lg text-xs hover:bg-amber-300 transition cursor-pointer flex items-center gap-1 shrink-0"
          >
            <Lock className="w-3.5 h-3.5" />
            Retourner au Tableau de Bord
          </button>
        </div>
      )}

      {/* Main Public Navigation */}
      <Navbar onOpenAdminLogin={() => setIsAdminLoginOpen(true)} />

      {/* Main Content Sections with bottom safe padding for mobile bottom nav */}
      <main className="flex-1 pb-16 md:pb-0">
        <Hero />
        <GalleryGrid />
        <ArtistBioSection />
        <TestimonialsSection />
      </main>

      {/* Footer */}
      <div className="pb-16 md:pb-0">
        <Footer onOpenAdminLogin={() => setIsAdminLoginOpen(true)} />
      </div>

      {/* Mobile Bottom Thumb Navigation */}
      <MobileBottomNav onOpenAdminLogin={() => setIsAdminLoginOpen(true)} />

      {/* Global Modals & Drawers */}
      <ArtworkDetailModal />
      <RoomVisualizer />
      <CartDrawer />
      <CommissionModal />
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onSuccess={() => {
          setIsAdminLoginOpen(false);
          setPreviewAsClient(false);
        }}
      />
      <LiveSyncNotification />
      <InternetRequiredGate />
    </div>
  );
};

export default function App() {
  return (
    <ArtProvider>
      <GalleryAppContent />
    </ArtProvider>
  );
}
