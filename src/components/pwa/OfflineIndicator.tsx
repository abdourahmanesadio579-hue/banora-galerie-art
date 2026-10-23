import React from 'react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import { WifiOff, Database } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2.5 rounded-xl bg-[#261E16] border border-[#D4AF37]/50 px-3.5 py-2 text-xs font-medium text-[#FAF8F5] shadow-2xl backdrop-blur-md animate-pulse">
      <WifiOff className="w-4 h-4 text-amber-400 shrink-0" />
      <div className="flex items-center gap-1.5">
        <span>Mode Hors-Ligne</span>
        <span className="text-[#A8A29E]">·</span>
        <span className="text-[#C8C2B7] flex items-center gap-1 text-[11px]">
          <Database className="w-3 h-3 text-[#D4AF37]" />
          Catalogue mis en cache
        </span>
      </div>
    </div>
  );
};
