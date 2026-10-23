import React, { useState } from 'react';
import { useArt } from '../../context/ArtContext';
import { X, Lock, Key, RefreshCw } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminLoginModal: React.FC<Props> = ({ isOpen, onClose, onSuccess }) => {
  const { loginAdmin } = useArt();
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const success = await loginAdmin(passcode);
    setIsLoading(false);
    if (success) {
      setError(false);
      onSuccess();
    } else {
      setError(true);
    }
  };

  const handleQuickBypass = async () => {
    setIsLoading(true);
    const success = await loginAdmin('KSNcd64g&&');
    setIsLoading(false);
    if (success) {
      onSuccess();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-sm rounded-2xl bg-[#161513] border border-[#D4AF37]/40 p-6 shadow-2xl text-[#E8E4DF] space-y-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#A8A29E] hover:text-white p-1 rounded-lg hover:bg-white/5 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold text-[#FAF8F5]">Espace Artiste BANORA</h3>
            <p className="text-[11px] text-[#A8A29E]">Connexion sécurisée administrateur</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block text-[#A8A29E] mb-1 font-medium">
              Mot de passe administrateur :
            </label>
            <div className="relative">
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8F8A81]" />
              <input
                type="password"
                autoFocus
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  setError(false);
                }}
                placeholder="Entrez le mot de passe sécurisé..."
                className="w-full bg-[#1A1815] border border-[#2D2A24] rounded-lg pl-9 pr-3 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
            {error && (
              <p className="text-rose-400 text-[11px] mt-1">
                Mot de passe incorrect. Veuillez vérifier vos identifiants.
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 bg-[#D4AF37] hover:bg-[#E6C665] text-[#121110] font-bold rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-2"
          >
            {isLoading && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
            <span>Se Connecter au Tableau de Bord</span>
          </button>
        </form>

        <div className="pt-2 border-t border-[#26231E] flex flex-col gap-2 text-center">
          <button
            type="button"
            onClick={handleQuickBypass}
            disabled={isLoading}
            className="text-[11px] text-[#D4AF37] hover:underline cursor-pointer"
          >
            Connexion rapide (Utiliser le mot de passe par défaut)
          </button>
        </div>
      </div>
    </div>
  );
};
