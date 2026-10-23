import React, { useState, useRef } from 'react';
import { useArt } from '../../context/ArtContext';
import {
  X,
  Send,
  CheckCircle,
  Paintbrush,
  Image as ImageIcon,
  Camera,
  Trash2,
  RefreshCw,
  Eye,
  Check
} from 'lucide-react';

export const CommissionModal: React.FC = () => {
  const { isCommissionOpen, setIsCommissionOpen, addInquiry, artistProfile } = useArt();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dimensions, setDimensions] = useState('120 x 100 cm');
  const [palette, setPalette] = useState('Ocres chauds, sable et or');
  const [message, setMessage] = useState('');
  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null);
  const [photoFileName, setPhotoFileName] = useState<string | null>(null);
  const [isProcessingPhoto, setIsProcessingPhoto] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const galleryInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  if (!isCommissionOpen) return null;

  // Compress photo so phone photos (10-40MP) load immediately and store smoothly
  const processAndCompressFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner un fichier image valide (JPG, PNG, WebP).');
      return;
    }

    setIsProcessingPhoto(true);
    setPhotoFileName(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const maxWidth = 1600;
        const maxHeight = 1600;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL('image/jpeg', 0.88);
          setPhotoDataUrl(compressed);
        } else {
          setPhotoDataUrl(e.target?.result as string);
        }
        setIsProcessingPhoto(false);
      };
      img.onerror = () => {
        setPhotoDataUrl(e.target?.result as string);
        setIsProcessingPhoto(false);
      };
      img.src = e.target?.result as string;
    };
    reader.onerror = () => {
      setIsProcessingPhoto(false);
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processAndCompressFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processAndCompressFile(file);
    }
  };

  const handleRemovePhoto = () => {
    setPhotoDataUrl(null);
    setPhotoFileName(null);
    if (galleryInputRef.current) galleryInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fullMessage = `Demande de création sur mesure :\n- Dimensions souhaitées : ${dimensions}\n- Teintes / Inspiration : ${palette}\n- Détails du projet : ${message}${
      photoDataUrl ? `\n- Photo de référence fournie : Oui (${photoFileName || 'Photo importée'})` : ''
    }`;

    addInquiry({
      name,
      email,
      phone,
      message: fullMessage,
      isCommission: true,
      photoUrl: photoDataUrl || undefined,
      photoName: photoFileName || undefined,
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setIsCommissionOpen(false);
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
      setPhotoDataUrl(null);
      setPhotoFileName(null);
    }, 3200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      {/* Hidden native inputs for Gallery and Camera */}
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        className="hidden"
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileInputChange}
        className="hidden"
      />

      <div className="relative w-full max-w-lg rounded-2xl bg-[#141311] border border-[#D4AF37]/30 shadow-2xl text-[#E8E4DF] p-6 sm:p-8 overflow-hidden my-auto max-h-[92vh] overflow-y-auto">
        <button
          onClick={() => setIsCommissionOpen(false)}
          className="absolute top-4 right-4 text-[#A8A29E] hover:text-white p-1 rounded-lg hover:bg-white/5 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="py-12 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 flex items-center justify-center">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-serif text-[#FAF8F5]">Demande envoyée avec succès !</h3>
            <p className="text-xs text-[#A8A29E] max-w-sm mx-auto leading-relaxed">
              Merci pour votre confiance. L'artiste <strong>{artistProfile.name}</strong> a bien reçu votre projet
              {photoDataUrl ? ' et votre photo de référence' : ''}. Il étudiera personnellement votre demande de commande sur-mesure et reviendra vers vous très rapidement.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="flex items-center gap-2.5 text-[#D4AF37]">
              <Paintbrush className="w-5 h-5" />
              <span className="uppercase tracking-widest text-[11px] font-semibold">Création Sur-Mesure</span>
            </div>

            <div>
              <h2 className="text-2xl font-serif text-[#FAF8F5]">Créer Votre Commande</h2>
              <p className="text-[#A8A29E] mt-1 text-xs leading-relaxed">
                Vous avez un mur spécifique, une inspiration ou un format précis en tête ? Confiez la réalisation de votre toile exclusive à BANORA.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-[#A8A29E] mb-1">Votre Nom *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="M./Mme..."
                  className="w-full bg-[#1A1815] border border-[#2C2923] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
              <div>
                <label className="block text-[#A8A29E] mb-1">Téléphone / WhatsApp *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+221..."
                  className="w-full bg-[#1A1815] border border-[#2C2923] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[#A8A29E] mb-1">Email *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="contact@exemple.com"
                className="w-full bg-[#1A1815] border border-[#2C2923] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[#A8A29E] mb-1">Dimensions envisagées</label>
                <input
                  type="text"
                  value={dimensions}
                  onChange={(e) => setDimensions(e.target.value)}
                  placeholder="Ex: 150 x 120 cm ou diptyque"
                  className="w-full bg-[#1A1815] border border-[#2C2923] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
              <div>
                <label className="block text-[#A8A29E] mb-1">Teintes ou Série de référence</label>
                <input
                  type="text"
                  value={palette}
                  onChange={(e) => setPalette(e.target.value)}
                  placeholder="Ex: Série Sahel, Bleu indigo..."
                  className="w-full bg-[#1A1815] border border-[#2C2923] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>

            {/* Photo Import Section */}
            <div className="space-y-2 pt-1">
              <label className="block text-[#FAF8F5] font-medium flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-[#D4AF37]" />
                  Photo de votre intérieur ou inspiration
                </span>
                <span className="text-[10px] text-[#D4AF37] bg-[#2A241A] px-2 py-0.5 rounded border border-[#D4AF37]/30">
                  Recommandé pour la précision
                </span>
              </label>

              {!photoDataUrl ? (
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  className="p-4 rounded-xl border border-dashed border-[#D4AF37]/40 bg-[#1A1815]/80 hover:bg-[#1E1B17] transition text-center space-y-3"
                >
                  <p className="text-[#A8A29E] text-[11px] leading-relaxed">
                    Importez une photo de votre mur, de votre pièce ou d'une toile d'inspiration pour adapter au mieux l'œuvre à votre décor.
                  </p>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => galleryInputRef.current?.click()}
                      disabled={isProcessingPhoto}
                      className="w-full sm:w-auto px-4 py-2 bg-[#26231E] hover:bg-[#332E27] text-[#FAF8F5] border border-[#D4AF37]/40 rounded-xl flex items-center justify-center gap-2 transition cursor-pointer text-xs font-medium"
                    >
                      <ImageIcon className="w-4 h-4 text-[#D4AF37]" />
                      <span>Choisir depuis la galerie</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => cameraInputRef.current?.click()}
                      disabled={isProcessingPhoto}
                      className="w-full sm:w-auto px-4 py-2 bg-[#26231E] hover:bg-[#332E27] text-[#FAF8F5] border border-[#2D2A24] rounded-xl flex items-center justify-center gap-2 transition cursor-pointer text-xs font-medium"
                    >
                      <Camera className="w-4 h-4 text-[#D4AF37]" />
                      <span>Prendre une photo</span>
                    </button>
                  </div>

                  {isProcessingPhoto && (
                    <div className="text-[11px] text-[#D4AF37] flex items-center justify-center gap-1.5 pt-1">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Optimisation de votre image en cours...
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-3 rounded-xl border border-[#D4AF37]/40 bg-[#1B1916] flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative shrink-0">
                      <img
                        src={photoDataUrl}
                        alt="Photo de référence importée"
                        className="w-14 h-14 rounded-lg object-cover border border-[#D4AF37]/50 shadow"
                      />
                      <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-emerald-500 text-black flex items-center justify-center text-[10px]">
                        <Check className="w-2.5 h-2.5" />
                      </span>
                    </div>

                    <div className="min-w-0">
                      <div className="font-semibold text-[#FAF8F5] text-xs truncate">
                        {photoFileName || 'Photo de référence'}
                      </div>
                      <div className="text-[11px] text-emerald-400 mt-0.5 flex items-center gap-1">
                        <span>✓ Photo prête pour votre commande</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => galleryInputRef.current?.click()}
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-[#C8C2B7] hover:text-white transition cursor-pointer"
                      title="Changer la photo"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className="p-2 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 hover:text-rose-100 border border-rose-500/30 transition cursor-pointer"
                      title="Supprimer cette photo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-[#A8A29E] mb-1">Décrivez votre projet & l'espace prévu</label>
              <textarea
                rows={3}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Explication de votre envie, pièce de destination, ambiance souhaitée..."
                className="w-full bg-[#1A1815] border border-[#2C2923] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div className="pt-2 flex gap-2">
              <button
                type="button"
                onClick={() => setIsCommissionOpen(false)}
                className="w-1/3 py-2.5 border border-[#2C2923] rounded-xl text-xs text-[#A8A29E] hover:text-white transition cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 bg-[#D4AF37] hover:bg-[#E6C665] text-[#121110] font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-lg shadow-[#D4AF37]/20"
              >
                <Send className="w-3.5 h-3.5" /> Transmettre ma demande
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
