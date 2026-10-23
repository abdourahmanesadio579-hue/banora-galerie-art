import React from 'react';
import { useArt } from '../../context/ArtContext';
import { PWAInstallButton } from '../pwa/PWAInstallButton';
import { Phone, Mail, MapPin, Instagram, MessageCircle, ShieldCheck, Heart } from 'lucide-react';

interface Props {
  onOpenAdminLogin: () => void;
}

export const Footer: React.FC<Props> = ({ onOpenAdminLogin }) => {
  const { artistProfile } = useArt();

  const cleanWhatsappNumber = (artistProfile.whatsapp || '').replace(/[^0-9]/g, '');

  return (
    <footer id="contact" className="bg-[#0E0D0C] border-t border-[#201D18] text-[#A8A29E] text-xs">
      {/* Banner */}
      <PWAInstallButton variant="banner" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Col 1: Brand & Atelier */}
          <div className="space-y-4">
            <div>
              <span className="font-serif text-2xl tracking-[0.25em] text-[#FAF8F5] uppercase">
                BANORA
              </span>
              <p className="text-[10px] tracking-[0.3em] text-[#D4AF37] uppercase -mt-0.5">
                Galerie & Toiles d'Art
              </p>
            </div>
            <p className="text-xs text-[#8F8A81] leading-relaxed">
              Atelier contemporain dédié à la création picturale originale, à l'exploration des pigments naturels et à la préservation des émotions artistiques intemporelles.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-[#C8C2B7]">
              <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
              <span>Chaque toile est certifiée authentique et unique.</span>
            </div>
          </div>

          {/* Col 2: Atelier Visits & Address */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-[#FAF8F5] uppercase tracking-wider text-[#D4AF37]">
              L'Atelier de BANORA
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <span>{artistProfile.studioAddress}</span>
              </div>
              <p className="text-[11px] text-[#8F8A81]">
                Visites privées de l'atelier sur rendez-vous pour collectionneurs et amateurs d'art.
              </p>
            </div>
          </div>

          {/* Col 3: Direct Contacts & WhatsApp */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-[#FAF8F5] uppercase tracking-wider text-[#D4AF37]">
              Contact Direct
            </h4>
            <div className="space-y-2.5">
              <a
                href={`https://wa.me/${cleanWhatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp : {artistProfile.phone}</span>
              </a>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#D4AF37]" />
                <a href={`mailto:${artistProfile.email}`} className="hover:text-white transition">
                  {artistProfile.email}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Instagram className="w-4 h-4 text-[#D4AF37]" />
                <span className="hover:text-white transition cursor-pointer">
                  {artistProfile.instagram}
                </span>
              </div>
            </div>
          </div>

          {/* Col 4: Quick Navigation & Admin Access */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-[#FAF8F5] uppercase tracking-wider text-[#D4AF37]">
              Espace Professionnel
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={onOpenAdminLogin}
                  className="text-[#E6C665] hover:underline flex items-center gap-1.5 cursor-pointer font-medium"
                >
                  Accès Espace Gestionnaire BANORA →
                </button>
              </li>
              <li className="text-[11px] text-[#8F8A81]">
                Tableau de bord pour ajouter de nouvelles toiles, modifier les prix et suivre les commandes.
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-10 mt-12 border-t border-[#1C1A16] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#6E6961]">
          <div>
            © {new Date().getFullYear()} BANORA Art Gallery. Tous droits réservés. PWA certifiée.
          </div>
          <div className="flex items-center gap-4">
            <span>Création & Exposition d'Art Contemporain</span>
            <span>·</span>
            <span>Certificat d'Authenticité 1/1</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
