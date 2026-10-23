import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import {
  Artwork,
  ArtistProfile,
  Order,
  ClientInquiry,
  FrameOption,
  ArtworkStatus,
  Testimonial,
} from '../types/artwork';
import {
  INITIAL_ARTWORKS,
  INITIAL_ARTIST_PROFILE,
  INITIAL_ORDERS,
  INITIAL_INQUIRIES,
  INITIAL_TESTIMONIALS,
} from '../data/initialArtworks';

export interface CartItem {
  artwork: Artwork;
  frame: FrameOption;
  frameCostEUR: number;
  frameCostFCFA: number;
}

export interface LiveAlert {
  id: string;
  type: 'new_artwork' | 'order' | 'general';
  title: string;
  message: string;
  artwork?: Artwork;
}

interface ArtContextType {
  artworks: Artwork[];
  orders: Order[];
  inquiries: ClientInquiry[];
  testimonials: Testimonial[];
  artistProfile: ArtistProfile;
  cart: CartItem[];
  currency: 'EUR' | 'XOF';
  setCurrency: (c: 'EUR' | 'XOF') => void;
  formatPrice: (eur: number, fcfa?: number) => string;
  isAdmin: boolean;
  setIsAdmin: (val: boolean) => void;
  loginAdmin: (passcode: string) => Promise<boolean>;
  logoutAdmin: () => void;
  // Artwork CRUD
  addArtwork: (artwork: Omit<Artwork, 'id' | 'createdAt'>) => Promise<Artwork>;
  updateArtwork: (id: string, updates: Partial<Artwork>) => Promise<void>;
  deleteArtwork: (id: string) => Promise<void>;
  toggleArtworkStatus: (id: string, status: ArtworkStatus) => Promise<void>;
  // Galleries / Collections Management
  galleries: string[];
  deleteGallery: (galleryName: string, options?: { reassignTo?: string; deleteArtworks?: boolean }) => Promise<void>;
  renameGallery: (oldName: string, newName: string) => Promise<void>;
  createGallery: (galleryName: string) => void;
  // Orders
  addOrder: (order: Omit<Order, 'id' | 'orderNumber' | 'date'>) => Promise<Order>;
  updateOrderStatus: (id: string, status: Order['status']) => Promise<void>;
  // Inquiries
  addInquiry: (inquiry: Omit<ClientInquiry, 'id' | 'date' | 'status'>) => Promise<void>;
  updateInquiryStatus: (id: string, status: ClientInquiry['status']) => Promise<void>;
  // Testimonials
  addTestimonial: (t: Omit<Testimonial, 'id' | 'date'>) => Promise<void>;
  deleteTestimonial: (id: string) => Promise<void>;
  // Profile
  updateArtistProfile: (profile: ArtistProfile) => Promise<void>;
  // Cart
  addToCart: (artwork: Artwork, frame?: FrameOption) => void;
  removeFromCart: (artworkId: string) => void;
  clearCart: () => void;
  // Active modals
  selectedArtwork: Artwork | null;
  setSelectedArtwork: (artwork: Artwork | null) => void;
  visualizerArtwork: Artwork | null;
  setVisualizerArtwork: (artwork: Artwork | null) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCommissionOpen: boolean;
  setIsCommissionOpen: (open: boolean) => void;
  // Live cross-device synchronization & alerts
  isRealtimeConnected: boolean;
  liveAlert: LiveAlert | null;
  dismissLiveAlert: () => void;
  requestNotificationPermission: () => Promise<boolean>;
  notificationsEnabled: boolean;
  syncWithServer: () => Promise<void>;
  // Theme (Dark / Luminous Gallery)
  theme: 'dark' | 'light';
  setTheme: (t: 'dark' | 'light') => void;
  toggleTheme: () => void;
  // Data reset / export / import
  resetToDefault: () => Promise<void>;
  exportDataJSON: () => void;
  importDataJSON: (jsonString: string) => boolean;
}

const ArtContext = createContext<ArtContextType | undefined>(undefined);

const STORAGE_KEYS = {
  ARTWORKS: 'banora_artworks_v1',
  ORDERS: 'banora_orders_v1',
  INQUIRIES: 'banora_inquiries_v1',
  TESTIMONIALS: 'banora_testimonials_v1',
  PROFILE: 'banora_profile_v1',
  CURRENCY: 'banora_currency_v1',
  ADMIN_AUTH: 'banora_admin_auth_v1',
  NOTIFS_REQUESTED: 'banora_notifs_requested_v1',
  THEME: 'banora_theme_v1',
  CUSTOM_GALLERIES: 'banora_custom_galleries_v1',
};

export const FRAME_PRICES: Record<FrameOption, { eur: number; fcfa: number }> = {
  'Sans cadre': { eur: 0, fcfa: 0 },
  'Caisse américaine noire': { eur: 280, fcfa: 185000 },
  'Caisse américaine chêne naturel': { eur: 320, fcfa: 210000 },
  'Caisse américaine dorée': { eur: 350, fcfa: 230000 },
};

export const ArtProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Artworks state
  const [artworks, setArtworks] = useState<Artwork[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ARTWORKS);
      return saved ? JSON.parse(saved) : INITIAL_ARTWORKS;
    } catch {
      return INITIAL_ARTWORKS;
    }
  });

  // Orders state
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  // Inquiries state
  const [inquiries, setInquiries] = useState<ClientInquiry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.INQUIRIES);
      return saved ? JSON.parse(saved) : INITIAL_INQUIRIES;
    } catch {
      return INITIAL_INQUIRIES;
    }
  });

  // Testimonials state
  const [testimonials, setTestimonials] = useState<Testimonial[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TESTIMONIALS);
      return saved ? JSON.parse(saved) : INITIAL_TESTIMONIALS;
    } catch {
      return INITIAL_TESTIMONIALS;
    }
  });

  // Profile state
  const [artistProfile, setArtistProfile] = useState<ArtistProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
      return saved ? JSON.parse(saved) : INITIAL_ARTIST_PROFILE;
    } catch {
      return INITIAL_ARTIST_PROFILE;
    }
  });

  // Real-time synchronization & live notifications
  const [isRealtimeConnected, setIsRealtimeConnected] = useState(false);
  const [liveAlert, setLiveAlert] = useState<LiveAlert | null>(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const lastSyncTimestampRef = useRef<number>(0);

  // Currency
  const [currency, setCurrencyState] = useState<'EUR' | 'XOF'>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CURRENCY);
      return saved === 'XOF' ? 'XOF' : 'EUR';
    } catch {
      return 'EUR';
    }
  });

  const setCurrency = (c: 'EUR' | 'XOF') => {
    setCurrencyState(c);
    localStorage.setItem(STORAGE_KEYS.CURRENCY, c);
  };

  // Admin state
  const [isAdmin, setIsAdminState] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.ADMIN_AUTH) === 'true';
    } catch {
      return false;
    }
  });

  const setIsAdmin = (val: boolean) => {
    setIsAdminState(val);
    localStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, val ? 'true' : 'false');
  };

  const loginAdmin = async (passcode: string): Promise<boolean> => {
    try {
      if (passcode === 'KSNcd64g&&') {
        setIsAdmin(true);
        return true;
      }

      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode }),
      });
      const data = await res.json();
      if (data.success) {
        setIsAdmin(true);
        return true;
      }
    } catch {
      if (passcode === 'KSNcd64g&&') {
        setIsAdmin(true);
        return true;
      }
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdmin(false);
  };

  // Theme State (Dark Atelier / Luminous Gallery)
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.THEME);
      return saved === 'light' || saved === 'dark' ? saved : 'dark';
    } catch {
      return 'dark';
    }
  });

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, theme);
    } catch {}

    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.add('theme-light');
      root.classList.remove('theme-dark');
      root.setAttribute('data-theme', 'light');
    } else {
      root.classList.remove('theme-light');
      root.classList.add('theme-dark');
      root.setAttribute('data-theme', 'dark');
    }
  }, [theme]);

  // Galleries / Collections State
  const [customGalleries, setCustomGalleries] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CUSTOM_GALLERIES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return [
      'Série Sahel',
      'Abstractions Africaines',
      'Lueurs & Or',
      'Portraits & Mémoires',
      'Rituels Contemporains',
    ];
  });

  const galleries = React.useMemo(() => {
    const fromArtworks = artworks.map((a) => a.category).filter(Boolean);
    const set = new Set([...customGalleries, ...fromArtworks]);
    return Array.from(set);
  }, [customGalleries, artworks]);

  // Cart
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCommissionOpen, setIsCommissionOpen] = useState(false);

  // Modals
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [visualizerArtwork, setVisualizerArtwork] = useState<Artwork | null>(null);

  // Check notification permission
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setNotificationsEnabled(Notification.permission === 'granted');
    }
  }, []);

  const requestNotificationPermission = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const perm = await Notification.requestPermission();
        const granted = perm === 'granted';
        setNotificationsEnabled(granted);
        return granted;
      } catch (e) {
        console.warn('Error requesting notification permission:', e);
      }
    }
    return false;
  };

  const triggerSystemNotification = useCallback((title: string, body: string, icon?: string) => {
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        const options: NotificationOptions = {
          body,
          icon: icon || '/pwa-192x192.png',
          badge: '/pwa-192x192.png',
        };
        new Notification(title, options);
      } catch (err) {
        console.warn('System notification trigger error:', err);
      }
    }
  }, []);

  // Fetch full data from server API
  const syncWithServer = useCallback(async () => {
    try {
      const res = await fetch('/api/data');
      if (res.ok) {
        const data = await res.json();
        if (data.artworks && Array.isArray(data.artworks)) {
          setArtworks(data.artworks);
          localStorage.setItem(STORAGE_KEYS.ARTWORKS, JSON.stringify(data.artworks));
        }
        if (data.orders && Array.isArray(data.orders)) {
          setOrders(data.orders);
          localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(data.orders));
        }
        if (data.inquiries && Array.isArray(data.inquiries)) {
          setInquiries(data.inquiries);
          localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(data.inquiries));
        }
        if (data.testimonials && Array.isArray(data.testimonials)) {
          setTestimonials(data.testimonials);
          localStorage.setItem(STORAGE_KEYS.TESTIMONIALS, JSON.stringify(data.testimonials));
        }
        if (data.artistProfile) {
          setArtistProfile(data.artistProfile);
          localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(data.artistProfile));
        }
        if (data.lastUpdated) {
          lastSyncTimestampRef.current = data.lastUpdated;
        }
      }
    } catch (err) {
      // Offline mode: keep local storage
      console.log('Sync with server skipped (offline or loading)');
    }
  }, []);

  // Set up real-time SSE & reconnection
  useEffect(() => {
    // Initial sync
    syncWithServer();

    let eventSource: EventSource | null = null;
    let reconnectTimeout: any = null;

    const connectSSE = () => {
      try {
        eventSource = new EventSource('/api/events');

        eventSource.onopen = () => {
          setIsRealtimeConnected(true);
        };

        eventSource.addEventListener('ARTWORK_ADDED', (e) => {
          try {
            const payload = JSON.parse(e.data);
            const newArt: Artwork = payload.artwork;
            if (newArt) {
              setArtworks((prev) => {
                const exists = prev.some((a) => a.id === newArt.id);
                if (exists) return prev;
                return [newArt, ...prev];
              });

              // Trigger Live Alert Banner in the app
              setLiveAlert({
                id: 'alert-' + Date.now(),
                type: 'new_artwork',
                title: '✨ Nouvelle Œuvre Disponible !',
                message: `L'artiste BANORA vient de publier "${newArt.title}" (${newArt.dimensions}, ${newArt.category}).`,
                artwork: newArt,
              });

              // Trigger system notification if mobile device/browser has granted permission
              triggerSystemNotification(
                'BANORA — Nouvelle Œuvre Disponible !',
                `Découvrez "${newArt.title}", nouvelle toile originale ajoutée par l'artiste BANORA.`,
                newArt.imageUrl
              );
            }
          } catch (err) {
            console.error('Error handling ARTWORK_ADDED event:', err);
          }
        });

        eventSource.addEventListener('ARTWORK_UPDATED', (e) => {
          try {
            const payload = JSON.parse(e.data);
            const updated = payload.artwork;
            if (updated) {
              setArtworks((prev) =>
                prev.map((a) => (a.id === updated.id ? updated : a))
              );
            }
          } catch (err) {
            console.error('Error handling ARTWORK_UPDATED event:', err);
          }
        });

        eventSource.addEventListener('ARTWORK_DELETED', (e) => {
          try {
            const payload = JSON.parse(e.data);
            if (payload.id) {
              setArtworks((prev) => prev.filter((a) => a.id !== payload.id));
            }
          } catch (err) {
            console.error('Error handling ARTWORK_DELETED event:', err);
          }
        });

        eventSource.addEventListener('ORDER_CREATED', (e) => {
          try {
            const payload = JSON.parse(e.data);
            if (payload.order) {
              setOrders((prev) => [payload.order, ...prev.filter((o) => o.id !== payload.order.id)]);
            }
          } catch (err) {
            console.error('Error handling ORDER_CREATED event:', err);
          }
        });

        eventSource.addEventListener('TESTIMONIAL_ADDED', (e) => {
          try {
            const payload = JSON.parse(e.data);
            if (payload.testimonial) {
              setTestimonials((prev) => [
                payload.testimonial,
                ...prev.filter((t) => t.id !== payload.testimonial.id),
              ]);
            }
          } catch (err) {
            console.error('Error handling TESTIMONIAL_ADDED event:', err);
          }
        });

        eventSource.addEventListener('GALLERY_DELETED', (e) => {
          try {
            const payload = JSON.parse(e.data);
            const { galleryName, artworks: updatedArtworks } = payload;
            if (galleryName) {
              setCustomGalleries((prev) => {
                const updated = prev.filter((g) => g !== galleryName);
                try {
                  localStorage.setItem(STORAGE_KEYS.CUSTOM_GALLERIES, JSON.stringify(updated));
                } catch {}
                return updated;
              });
            }
            if (updatedArtworks && Array.isArray(updatedArtworks)) {
              setArtworks(updatedArtworks);
              try {
                localStorage.setItem(STORAGE_KEYS.ARTWORKS, JSON.stringify(updatedArtworks));
              } catch {}
            }
          } catch (err) {
            console.error('Error handling GALLERY_DELETED event:', err);
          }
        });

        eventSource.addEventListener('GALLERY_RENAMED', (e) => {
          try {
            const payload = JSON.parse(e.data);
            const { oldName, newName, artworks: updatedArtworks } = payload;
            if (oldName && newName) {
              setCustomGalleries((prev) => {
                const updated = prev.map((g) => (g === oldName ? newName : g));
                try {
                  localStorage.setItem(STORAGE_KEYS.CUSTOM_GALLERIES, JSON.stringify(updated));
                } catch {}
                return updated;
              });
            }
            if (updatedArtworks && Array.isArray(updatedArtworks)) {
              setArtworks(updatedArtworks);
              try {
                localStorage.setItem(STORAGE_KEYS.ARTWORKS, JSON.stringify(updatedArtworks));
              } catch {}
            }
          } catch (err) {
            console.error('Error handling GALLERY_RENAMED event:', err);
          }
        });

        eventSource.onerror = () => {
          setIsRealtimeConnected(false);
          eventSource?.close();
          // Attempt reconnection after 5 seconds
          clearTimeout(reconnectTimeout);
          reconnectTimeout = setTimeout(connectSSE, 5000);
        };
      } catch (err) {
        setIsRealtimeConnected(false);
      }
    };

    connectSSE();

    // Fast automatic background sync check every 3.5s to ensure phone apps that sleep/wake up stay 100% in sync without any user click
    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/version');
        if (res.ok) {
          const v = await res.json();
          if (v.lastUpdated && v.lastUpdated > lastSyncTimestampRef.current) {
            syncWithServer();
          }
        }
      } catch {
        // Ignored in offline mode
      }
    }, 3500);

    // Sync immediately when phone app comes back to foreground
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        syncWithServer();
      }
    };
    window.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('online', syncWithServer);

    return () => {
      if (eventSource) eventSource.close();
      clearTimeout(reconnectTimeout);
      clearInterval(interval);
      window.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('online', syncWithServer);
    };
  }, [syncWithServer, triggerSystemNotification]);

  // Price formatting
  const formatPrice = (eur: number, fcfa?: number): string => {
    if (currency === 'XOF') {
      const amount = fcfa !== undefined ? fcfa : Math.round(eur * 655.957);
      return (
        new Intl.NumberFormat('fr-FR', {
          style: 'decimal',
          maximumFractionDigits: 0,
        }).format(amount) + ' FCFA'
      );
    }
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(eur);
  };

  // CRUD actions for artworks (optimistic update + server persistence)
  const addArtwork = async (newArt: Omit<Artwork, 'id' | 'createdAt'>): Promise<Artwork> => {
    const id = 'art-' + Date.now();
    const createdAt = new Date().toISOString().split('T')[0];
    const fullArtwork: Artwork = {
      ...newArt,
      id,
      createdAt,
    };

    // Optimistic local update
    setArtworks((prev) => [fullArtwork, ...prev]);

    try {
      const res = await fetch('/api/artworks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fullArtwork),
      });
      if (res.ok) {
        const saved = await res.json();
        return saved;
      }
    } catch (e) {
      console.warn('Server artwork save failed, using local persistence:', e);
    }
    return fullArtwork;
  };

  const updateArtwork = async (id: string, updates: Partial<Artwork>) => {
    setArtworks((prev) =>
      prev.map((art) => (art.id === id ? { ...art, ...updates } : art))
    );
    if (selectedArtwork && selectedArtwork.id === id) {
      setSelectedArtwork((prev) => (prev ? { ...prev, ...updates } : null));
    }

    try {
      await fetch(`/api/artworks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
    } catch (e) {
      console.warn('Server artwork update failed:', e);
    }
  };

  const deleteArtwork = async (id: string) => {
    setArtworks((prev) => prev.filter((art) => art.id !== id));
    if (selectedArtwork && selectedArtwork.id === id) {
      setSelectedArtwork(null);
    }
    if (visualizerArtwork && visualizerArtwork.id === id) {
      setVisualizerArtwork(null);
    }
    removeFromCart(id);

    try {
      await fetch(`/api/artworks/${id}`, { method: 'DELETE' });
    } catch (e) {
      console.warn('Server artwork deletion failed:', e);
    }
  };

  const toggleArtworkStatus = async (id: string, status: ArtworkStatus) => {
    await updateArtwork(id, { status });
  };

  // Galleries / Collections Management
  const createGallery = (galleryName: string) => {
    const trimmed = galleryName.trim();
    if (!trimmed) return;
    setCustomGalleries((prev) => {
      if (prev.includes(trimmed)) return prev;
      const updated = [...prev, trimmed];
      try {
        localStorage.setItem(STORAGE_KEYS.CUSTOM_GALLERIES, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const renameGallery = async (oldName: string, newName: string) => {
    const trimmedOld = oldName.trim();
    const trimmedNew = newName.trim();
    if (!trimmedNew || trimmedOld === trimmedNew) return;

    // Update custom galleries list
    setCustomGalleries((prev) => {
      const updated = prev.map((g) => (g === trimmedOld ? trimmedNew : g));
      if (!updated.includes(trimmedNew)) updated.push(trimmedNew);
      try {
        localStorage.setItem(STORAGE_KEYS.CUSTOM_GALLERIES, JSON.stringify(updated));
      } catch {}
      return updated;
    });

    // Update artworks in local state
    setArtworks((prev) => {
      const updated = prev.map((art) =>
        art.category === trimmedOld ? { ...art, category: trimmedNew } : art
      );
      try {
        localStorage.setItem(STORAGE_KEYS.ARTWORKS, JSON.stringify(updated));
      } catch {}
      return updated;
    });

    // Synchronize with server API
    try {
      await fetch(`/api/galleries/${encodeURIComponent(trimmedOld)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newName: trimmedNew }),
      });
    } catch (err) {
      console.warn('Failed to rename gallery on server:', err);
    }
  };

  const deleteGallery = async (
    galleryName: string,
    options?: { reassignTo?: string; deleteArtworks?: boolean }
  ) => {
    const trimmed = galleryName.trim();
    const { reassignTo, deleteArtworks } = options || {};

    // Remove from custom galleries
    setCustomGalleries((prev) => {
      const updated = prev.filter((g) => g !== trimmed);
      try {
        localStorage.setItem(STORAGE_KEYS.CUSTOM_GALLERIES, JSON.stringify(updated));
      } catch {}
      return updated;
    });

    // Update artworks state
    setArtworks((prev) => {
      let updated: Artwork[];
      if (deleteArtworks) {
        updated = prev.filter((art) => art.category !== trimmed);
      } else {
        const target = reassignTo || 'Série Sahel';
        updated = prev.map((art) =>
          art.category === trimmed ? { ...art, category: target } : art
        );
      }
      try {
        localStorage.setItem(STORAGE_KEYS.ARTWORKS, JSON.stringify(updated));
      } catch {}
      return updated;
    });

    // Send to server API
    try {
      await fetch(`/api/galleries/${encodeURIComponent(trimmed)}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reassignTo, deleteArtworks }),
      });
    } catch (err) {
      console.warn('Failed to delete gallery on server:', err);
    }
  };

  // Orders
  const addOrder = async (orderData: Omit<Order, 'id' | 'orderNumber' | 'date'>): Promise<Order> => {
    const count = orders.length + 90;
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const orderNumber = `CMD-2026-${count}-${randomSuffix}`;
    const date = new Date().toISOString().split('T')[0];
    const fullOrder: Order = {
      ...orderData,
      id: 'ord-' + Date.now(),
      orderNumber,
      date,
    };

    setOrders((prev) => [fullOrder, ...prev]);

    // Automatically reserve purchased artworks locally
    orderData.items.forEach((item) => {
      toggleArtworkStatus(item.artworkId, 'reserve');
    });

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fullOrder),
      });
      if (res.ok) {
        const saved = await res.json();
        return saved;
      }
    } catch (e) {
      console.warn('Server order save failed:', e);
    }

    return fullOrder;
  };

  const updateOrderStatus = async (id: string, status: Order['status']) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status } : o))
    );

    try {
      await fetch(`/api/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
    } catch (e) {
      console.warn('Server order update failed:', e);
    }
  };

  // Inquiries
  const addInquiry = async (inquiryData: Omit<ClientInquiry, 'id' | 'date' | 'status'>) => {
    const fullInquiry: ClientInquiry = {
      ...inquiryData,
      id: 'inq-' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      status: 'nouveau',
    };

    setInquiries((prev) => [fullInquiry, ...prev]);

    try {
      await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fullInquiry),
      });
    } catch (e) {
      console.warn('Server inquiry save failed:', e);
    }
  };

  const updateInquiryStatus = async (id: string, status: ClientInquiry['status']) => {
    setInquiries((prev) =>
      prev.map((inq) => (inq.id === id ? { ...inq, status } : inq))
    );

    try {
      await fetch(`/api/inquiries/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
    } catch (e) {
      console.warn('Server inquiry update failed:', e);
    }
  };

  // Testimonials
  const addTestimonial = async (testimonialData: Omit<Testimonial, 'id' | 'date'>) => {
    const newT: Testimonial = {
      ...testimonialData,
      id: 'test-' + Date.now(),
      date: new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }),
    };

    setTestimonials((prev) => [newT, ...prev]);

    try {
      await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newT),
      });
    } catch (e) {
      console.warn('Server testimonial save failed:', e);
    }
  };

  const deleteTestimonial = async (id: string) => {
    setTestimonials((prev) => prev.filter((t) => t.id !== id));
    try {
      await fetch(`/api/testimonials/${id}`, { method: 'DELETE' });
    } catch (e) {
      console.warn('Server testimonial delete failed:', e);
    }
  };

  // Profile
  const updateArtistProfile = async (profile: ArtistProfile) => {
    setArtistProfile(profile);
    try {
      await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });
    } catch (e) {
      console.warn('Server profile update failed:', e);
    }
  };

  // Cart
  const addToCart = (artwork: Artwork, frame: FrameOption = 'Sans cadre') => {
    const frameCosts = FRAME_PRICES[frame];
    setCart((prev) => {
      const existing = prev.find((item) => item.artwork.id === artwork.id);
      if (existing) {
        return prev.map((item) =>
          item.artwork.id === artwork.id
            ? {
                ...item,
                frame,
                frameCostEUR: frameCosts.eur,
                frameCostFCFA: frameCosts.fcfa,
              }
            : item
        );
      }
      return [
        ...prev,
        {
          artwork,
          frame,
          frameCostEUR: frameCosts.eur,
          frameCostFCFA: frameCosts.fcfa,
        },
      ];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (artworkId: string) => {
    setCart((prev) => prev.filter((item) => item.artwork.id !== artworkId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const dismissLiveAlert = () => {
    setLiveAlert(null);
  };

  // Data helpers
  const resetToDefault = async () => {
    setArtworks(INITIAL_ARTWORKS);
    setOrders(INITIAL_ORDERS);
    setInquiries(INITIAL_INQUIRIES);
    setTestimonials(INITIAL_TESTIMONIALS);
    setArtistProfile(INITIAL_ARTIST_PROFILE);
    localStorage.removeItem(STORAGE_KEYS.ARTWORKS);
    localStorage.removeItem(STORAGE_KEYS.ORDERS);
    localStorage.removeItem(STORAGE_KEYS.INQUIRIES);
    localStorage.removeItem(STORAGE_KEYS.TESTIMONIALS);
    localStorage.removeItem(STORAGE_KEYS.PROFILE);

    try {
      await fetch('/api/reset', { method: 'POST' });
    } catch (e) {
      console.warn('Server reset failed:', e);
    }
  };

  const exportDataJSON = () => {
    const data = {
      artworks,
      orders,
      inquiries,
      testimonials,
      artistProfile,
      exportDate: new Date().toISOString(),
      author: 'BANORA Art Studio',
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `banora-galerie-sauvegarde-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importDataJSON = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.artworks && Array.isArray(parsed.artworks)) {
        setArtworks(parsed.artworks);
      }
      if (parsed.orders && Array.isArray(parsed.orders)) {
        setOrders(parsed.orders);
      }
      if (parsed.inquiries && Array.isArray(parsed.inquiries)) {
        setInquiries(parsed.inquiries);
      }
      if (parsed.testimonials && Array.isArray(parsed.testimonials)) {
        setTestimonials(parsed.testimonials);
      }
      if (parsed.artistProfile && parsed.artistProfile.name) {
        setArtistProfile(parsed.artistProfile);
      }
      return true;
    } catch (e) {
      console.error('Invalid JSON file', e);
      return false;
    }
  };

  return (
    <ArtContext.Provider
      value={{
        artworks,
        orders,
        inquiries,
        testimonials,
        addTestimonial,
        deleteTestimonial,
        artistProfile,
        cart,
        currency,
        setCurrency,
        formatPrice,
        isAdmin,
        setIsAdmin,
        loginAdmin,
        logoutAdmin,
        addArtwork,
        updateArtwork,
        deleteArtwork,
        toggleArtworkStatus,
        galleries,
        deleteGallery,
        renameGallery,
        createGallery,
        addOrder,
        updateOrderStatus,
        addInquiry,
        updateInquiryStatus,
        updateArtistProfile,
        addToCart,
        removeFromCart,
        clearCart,
        selectedArtwork,
        setSelectedArtwork,
        visualizerArtwork,
        setVisualizerArtwork,
        isCartOpen,
        setIsCartOpen,
        isCommissionOpen,
        setIsCommissionOpen,
        isRealtimeConnected,
        liveAlert,
        dismissLiveAlert,
        requestNotificationPermission,
        notificationsEnabled,
        syncWithServer,
        resetToDefault,
        exportDataJSON,
        importDataJSON,
        theme,
        setTheme,
        toggleTheme,
      }}
    >
      {children}
    </ArtContext.Provider>
  );
};

export const useArt = () => {
  const context = useContext(ArtContext);
  if (!context) {
    throw new Error('useArt must be used within an ArtProvider');
  }
  return context;
};
