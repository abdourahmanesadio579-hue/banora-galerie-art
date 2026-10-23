import React, { useState } from 'react';
import { useArt } from '../../context/ArtContext';
import { FrameOption } from '../../types/artwork';
import { X, Sliders, Check, ShoppingBag, Eye, Maximize2 } from 'lucide-react';

interface WallColor {
  id: string;
  name: string;
  hex: string;
  isDark: boolean;
}

const WALL_COLORS: WallColor[] = [
  { id: 'white', name: 'Blanc Galerie', hex: '#F6F5F2', isDark: false },
  { id: 'cream', name: 'Lin Naturel', hex: '#EAE5D9', isDark: false },
  { id: 'graphite', name: 'Anthracite Musée', hex: '#24272C', isDark: true },
  { id: 'terracotta', name: 'Ocre Terracotta', hex: '#874E3C', isDark: true },
  { id: 'midnight', name: 'Bleu Nuit Céleste', hex: '#162238', isDark: true },
  { id: 'sage', name: 'Vert Sauge Serti', hex: '#3E4E45', isDark: true },
];

type RoomType = 'salon' | 'gallery' | 'bureau';

export const RoomVisualizer: React.FC = () => {
  const { visualizerArtwork, setVisualizerArtwork, addToCart, formatPrice } = useArt();
  const [selectedColor, setSelectedColor] = useState<WallColor>(WALL_COLORS[0]);
  const [selectedFrame, setSelectedFrame] = useState<FrameOption>('Caisse américaine noire');
  const [roomType, setRoomType] = useState<RoomType>('salon');
  const [showHumanScale, setShowHumanScale] = useState(true);

  if (!visualizerArtwork) return null;

  const getFrameStyle = () => {
    switch (selectedFrame) {
      case 'Caisse américaine noire':
        return 'p-3 bg-[#111111] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] border border-neutral-800';
      case 'Caisse américaine chêne naturel':
        return 'p-3 bg-[#C89D66] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)] border border-[#a67c48]';
      case 'Caisse américaine dorée':
        return 'p-3 bg-gradient-to-tr from-[#A67C1E] via-[#E2C76A] to-[#8C6412] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)] border border-[#D4AF37]';
      case 'Sans cadre':
      default:
        return 'shadow-[0_25px_50px_-12px_rgba(0,0,0,0.55)] border-4 border-[#121110]/20';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-2 sm:p-4 md:p-6 overflow-y-auto">
      <div className="relative w-full max-w-6xl rounded-2xl bg-[#141311] border border-[#D4AF37]/30 shadow-2xl overflow-hidden flex flex-col max-h-[96vh]">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#2A2722] bg-[#181613] text-[#FAF8F5]">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37] animate-pulse" />
            <div>
              <h2 className="text-sm font-semibold tracking-wide flex items-center gap-2">
                Visualiseur Mural & Mise en Situation
                <span className="text-xs font-normal text-[#A8A29E] hidden sm:inline">
                  — {visualizerArtwork.title} ({visualizerArtwork.dimensions})
                </span>
              </h2>
            </div>
          </div>
          <button
            onClick={() => setVisualizerArtwork(null)}
            className="text-[#A8A29E] hover:text-white p-1.5 rounded-lg hover:bg-[#26231C] transition cursor-pointer"
            title="Fermer le visualiseur"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Stage Viewport */}
        <div
          className="relative flex-1 min-h-[260px] sm:min-h-[400px] md:min-h-[480px] transition-colors duration-500 flex flex-col justify-between overflow-hidden"
          style={{ backgroundColor: selectedColor.hex }}
        >
          {/* Subtle lighting / spotlight effect on wall */}
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_40%,rgba(255,255,255,0.22)_0%,transparent_65%)]" />

          {/* Wall Moldings / Coving for Architectural realism */}
          <div className="w-full h-3 sm:h-4 border-b border-black/10 bg-black/5" />

          {/* Center Stage: Artwork hanging on the wall */}
          <div className="relative z-10 flex flex-col items-center justify-center my-auto px-4 py-4 sm:py-8">
            <div className="relative transition-all duration-300 max-w-[85vw] sm:max-w-[480px] md:max-w-[540px]">
              {/* Picture Hanging Wire & Nail illusion */}
              <div className="mx-auto w-1 h-2 sm:h-3 bg-neutral-600/40 rounded-full mb-1" />

              {/* Framed Canvas */}
              <div className={`transition-all duration-300 rounded ${getFrameStyle()}`}>
                <img
                  src={visualizerArtwork.imageUrl}
                  alt={visualizerArtwork.title}
                  className="max-h-[200px] xs:max-h-[250px] sm:max-h-[340px] md:max-h-[400px] w-auto object-contain block select-none mx-auto"
                />
              </div>

              {/* Museum Placard on the side (desktop only) */}
              <div
                className={`hidden md:block absolute -right-32 bottom-2 p-2.5 rounded shadow-sm text-[10px] w-28 border ${
                  selectedColor.isDark
                    ? 'bg-[#181818]/90 text-neutral-200 border-neutral-700'
                    : 'bg-white/90 text-neutral-800 border-neutral-200'
                }`}
              >
                <div className="font-serif font-bold text-xs truncate">{visualizerArtwork.title}</div>
                <div className="text-[9px] opacity-75">{visualizerArtwork.year}</div>
                <div className="mt-1 text-[9px] leading-tight opacity-90">{visualizerArtwork.technique}</div>
                <div className="mt-1 font-mono font-medium text-[9px]">{visualizerArtwork.dimensions}</div>
              </div>
            </div>
          </div>

          {/* Interior Flooring & Decor based on Room Type */}
          <div className="relative z-0 w-full">
            {/* Baseboard / Plinthe */}
            <div className="w-full h-3 sm:h-5 bg-[#1F1E1C] border-t border-black/20" />

            {/* Flooring */}
            <div className="w-full h-16 sm:h-24 md:h-28 bg-gradient-to-b from-[#2E2822] via-[#211C18] to-[#15120F] border-t-2 border-[#1A1613] relative overflow-hidden flex items-end justify-between px-4 sm:px-12 pb-2">
              {/* Hardwood parquet lines simulation */}
              <div className="absolute inset-0 opacity-15 bg-[linear-gradient(90deg,transparent_0%,rgba(0,0,0,0.6)_50%,transparent_100%)] bg-[length:60px_100%]" />

              {/* Human scale silhouette reference (optional) */}
              {showHumanScale ? (
                <div className="relative z-10 flex items-end gap-1.5 text-xs text-white/50 select-none pb-1">
                  <div className="flex flex-col items-center">
                    <span className="text-[9px] sm:text-[10px] mb-0.5 text-white/60">Échelle (1m75)</span>
                    <div className="w-5 sm:w-6 h-14 sm:h-20 border-b-2 border-white/40 flex flex-col items-center justify-end">
                      <div className="w-2.5 sm:w-3 h-2.5 sm:h-3 rounded-full bg-white/40 mb-1" />
                      <div className="w-3.5 sm:w-4 h-6 sm:h-9 bg-white/30 rounded-t" />
                      <div className="w-2.5 sm:w-3 h-4 sm:h-6 bg-white/30" />
                    </div>
                  </div>
                </div>
              ) : <div />}

              {/* Room Furniture silhouette based on roomType */}
              {roomType === 'salon' && (
                <div className="hidden sm:flex items-end opacity-70">
                  <div className="w-64 h-14 bg-gradient-to-t from-[#1b1713] to-[#3a3229] rounded-t-xl border-t border-[#4f4336] shadow-xl flex items-center justify-center">
                    <span className="text-[10px] text-white/30 tracking-widest uppercase">Canapé Minimaliste</span>
                  </div>
                </div>
              )}

              {roomType === 'gallery' && (
                <div className="hidden sm:flex items-end opacity-70">
                  <div className="w-52 h-10 bg-[#1e1c19] rounded-t border-t border-neutral-600 flex items-center justify-center">
                    <span className="text-[10px] text-white/30 tracking-widest uppercase">Banquette de Galerie</span>
                  </div>
                </div>
              )}

              {roomType === 'bureau' && (
                <div className="hidden sm:flex items-end opacity-70">
                  <div className="w-56 h-12 bg-neutral-900 border-t border-neutral-700 rounded-t flex items-center justify-center">
                    <span className="text-[10px] text-white/30 tracking-widest uppercase">Bureau Ébène</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Interactive Controls Bar */}
        <div className="bg-[#181613] border-t border-[#2A2722] p-3 sm:p-5 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 sm:gap-4 text-xs">
          {/* Wall Paint Colors */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[#A8A29E] font-medium flex items-center gap-1.5 mr-1 text-[11px] sm:text-xs">
              <Sliders className="w-3.5 h-3.5 text-[#D4AF37]" />
              Teinte :
            </span>
            <div className="flex items-center gap-2">
              {WALL_COLORS.map((color) => (
                <button
                  key={color.id}
                  onClick={() => setSelectedColor(color)}
                  className={`group relative w-8 h-8 sm:w-7 sm:h-7 rounded-full border transition-all duration-200 cursor-pointer flex items-center justify-center min-h-[32px] min-w-[32px] ${
                    selectedColor.id === color.id
                      ? 'border-[#D4AF37] scale-110 shadow-[0_0_10px_rgba(212,175,55,0.4)]'
                      : 'border-white/20 hover:scale-105'
                  }`}
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                >
                  {selectedColor.id === color.id && (
                    <Check className={`w-3.5 h-3.5 ${color.isDark ? 'text-white' : 'text-black'}`} />
                  )}
                  <span className="sr-only">{color.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Framing Selector */}
          <div className="flex items-center gap-2 flex-wrap flex-1 max-w-md">
            <span className="text-[#A8A29E] font-medium text-[11px] sm:text-xs shrink-0">Cadre :</span>
            <select
              value={selectedFrame}
              onChange={(e) => setSelectedFrame(e.target.value as FrameOption)}
              className="flex-1 bg-[#24211C] border border-[#3A352D] text-[#FAF8F5] rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-[#D4AF37] cursor-pointer"
            >
              <option value="Sans cadre">Toile brute (Sans cadre)</option>
              <option value="Caisse américaine noire">Caisse noire (+280 € / 185 000 FCFA)</option>
              <option value="Caisse américaine chêne naturel">Caisse chêne (+320 € / 210 000 FCFA)</option>
              <option value="Caisse américaine dorée">Caisse dorée (+350 € / 230 000 FCFA)</option>
            </select>
          </div>

          {/* Ambiance Scene selector & Human scale toggle */}
          <div className="flex items-center gap-2 w-full lg:w-auto">
            <button
              onClick={() => setShowHumanScale(!showHumanScale)}
              className={`px-3 py-2 rounded-lg border text-xs transition cursor-pointer flex items-center gap-1.5 min-h-[38px] ${
                showHumanScale
                  ? 'bg-[#2E2922] text-[#E6C665] border-[#D4AF37]/50'
                  : 'bg-[#1E1C18] text-[#A8A29E] border-[#2E2A23] hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              Échelle
            </button>

            <button
              onClick={() => {
                addToCart(visualizerArtwork, selectedFrame);
                setVisualizerArtwork(null);
              }}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-[#D4AF37] hover:bg-[#E6C665] text-[#121110] font-semibold rounded-lg text-xs transition cursor-pointer shadow-lg shadow-[#D4AF37]/15 min-h-[38px]"
            >
              <ShoppingBag className="w-4 h-4" />
              Acquérir ({formatPrice(visualizerArtwork.priceEUR, visualizerArtwork.priceFCFA)})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
