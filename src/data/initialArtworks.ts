import { Artwork, ArtistProfile, Order, ClientInquiry, Testimonial } from '../types/artwork';

export const INITIAL_ARTWORKS: Artwork[] = [
  {
    id: 'art-001',
    title: 'Symphonie Sahélienne N°4',
    technique: 'Huile, pigments d’ocre et feuilles d’or sur lin brut',
    dimensions: '140 x 110 cm',
    year: 2026,
    category: 'Série Sahel',
    priceEUR: 2800,
    priceFCFA: 1835000,
    imageUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1200&auto=format&fit=crop',
    secondaryImages: [
      'https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1578321272175-109c1480a11e?q=80&w=1200&auto=format&fit=crop'
    ],
    status: 'disponible',
    isFeatured: true,
    description: 'Une composition tellurique puissante qui explore la résilience des étendues désertiques et la chaleur de l’aurore. Les pigments ocres naturels dialoguent avec des éclats de feuille d’or précieux.',
    inspiration: 'Inspiré par les paysages minéraux du Sahel traversés au crépuscule, là où l’horizon s’embrase de reflets ambrés.',
    inventoryNumber: 'BAN-2026-001',
    certificateIncluded: true,
    weightKg: 8.5,
    location: 'Atelier Banora, Dakar',
    createdAt: '2026-01-15'
  },
  {
    id: 'art-002',
    title: 'Mémoire Ancestrale en Bleu Indigo',
    technique: 'Acrylique, encre végétale et pastel gras sur toile montée',
    dimensions: '120 x 100 cm',
    year: 2025,
    category: 'Abstractions Africaines',
    priceEUR: 2200,
    priceFCFA: 1440000,
    imageUrl: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=1200&auto=format&fit=crop',
    secondaryImages: [
      'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1200&auto=format&fit=crop'
    ],
    status: 'disponible',
    isFeatured: true,
    description: 'Une immersion dans la profondeur des bleus indigo ancestraux. Les strates de matière révèlent des symboles graphiques inspirés des écritures et textiles traditionnels.',
    inspiration: 'La teinture indigo artisanale et les secrets transmis de génération en génération au fil des fleuves.',
    inventoryNumber: 'BAN-2025-018',
    certificateIncluded: true,
    weightKg: 6.2,
    location: 'Atelier Banora, Dakar',
    createdAt: '2025-11-20'
  },
  {
    id: 'art-003',
    title: 'Lueur d’Or & Cendres Célestes',
    technique: 'Technique mixte, feuille d’or 24 carats et poudre de marbre',
    dimensions: '100 x 100 cm',
    year: 2026,
    category: 'Lueurs & Or',
    priceEUR: 3100,
    priceFCFA: 2030000,
    imageUrl: 'https://images.unsplash.com/photo-1578321272175-109c1480a11e?q=80&w=1200&auto=format&fit=crop',
    status: 'disponible',
    isFeatured: true,
    description: 'Une œuvre d’une grande intensité méditative où l’or brut émerge de textures sombres et volcaniques, symbolisant l’espérance et la renaissance spirituelle.',
    inspiration: 'La lumière du matin qui transperce les brumes harmonieuses du Fouta.',
    inventoryNumber: 'BAN-2026-002',
    certificateIncluded: true,
    weightKg: 7.0,
    location: 'Atelier Banora, Dakar',
    createdAt: '2026-02-05'
  },
  {
    id: 'art-004',
    title: 'Le Gardien du Silence',
    technique: 'Huile et fusain sur toile texturée',
    dimensions: '150 x 120 cm',
    year: 2025,
    category: 'Portraits & Mémoires',
    priceEUR: 3600,
    priceFCFA: 2360000,
    imageUrl: 'https://images.unsplash.com/photo-1582561424760-0321d75e81fa?q=80&w=1200&auto=format&fit=crop',
    status: 'reserve',
    isFeatured: false,
    description: 'Portrait expressionniste et énigmatique d’une dignité intemporelle. Les regards et les ombres profondes captent l’essence même du sage protecteur de la mémoire.',
    inspiration: 'Hommage aux aînés et aux conteurs des veillées traditionnelles.',
    inventoryNumber: 'BAN-2025-012',
    certificateIncluded: true,
    weightKg: 9.0,
    location: 'En cours de réservation',
    createdAt: '2025-09-14'
  },
  {
    id: 'art-005',
    title: 'Éveil Tellurique',
    technique: 'Acrylique, sable du désert et liant naturel',
    dimensions: '90 x 90 cm',
    year: 2025,
    category: 'Série Sahel',
    priceEUR: 1650,
    priceFCFA: 1080000,
    imageUrl: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1200&auto=format&fit=crop',
    status: 'disponible',
    isFeatured: false,
    description: 'Une texture granuleuse et chaleureuse qui invite au toucher. Les tons terre de Sienne et rouille s’entrelacent dans un mouvement ascendant.',
    inspiration: 'Le vent d’harmattan sculptant les dunes avec une élégance géométrique naturelle.',
    inventoryNumber: 'BAN-2025-015',
    certificateIncluded: true,
    weightKg: 5.4,
    location: 'Atelier Banora, Dakar',
    createdAt: '2025-10-10'
  },
  {
    id: 'art-006',
    title: 'Rythmes Nocturnes & Tambours',
    technique: 'Huile extra-fine et pigments de charbon',
    dimensions: '130 x 95 cm',
    year: 2024,
    category: 'Rituels Contemporains',
    priceEUR: 2400,
    priceFCFA: 1575000,
    imageUrl: 'https://images.unsplash.com/photo-1549887534-1541e9326642?q=80&w=1200&auto=format&fit=crop',
    status: 'vendu',
    isFeatured: false,
    description: 'Une partition visuelle dynamique où le noir intense dialogue avec des éclats de vermillon et de cuivre, évoquant la cadence des percussions sacrées.',
    inspiration: 'Les cérémonies nocturnes et la vibration corporelle de la danse.',
    inventoryNumber: 'BAN-2024-009',
    certificateIncluded: true,
    weightKg: 6.8,
    location: 'Collection privée, Genève',
    createdAt: '2024-12-01'
  },
  {
    id: 'art-007',
    title: 'Harmonie des Éléments II',
    technique: 'Technique mixte et résine dorée sur panneau de chêne',
    dimensions: '80 x 80 cm',
    year: 2026,
    category: 'Lueurs & Or',
    priceEUR: 1950,
    priceFCFA: 1280000,
    imageUrl: 'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?q=80&w=1200&auto=format&fit=crop',
    status: 'disponible',
    isFeatured: false,
    description: 'La rencontre fluide de l’eau et du feu végétal. Des transparences délicates et des reflets métalliques qui évoluent selon l’éclairage de la pièce.',
    inspiration: 'Le fleuve Sénégal au zénith lorsque la surface se transforme en miroir d’or.',
    inventoryNumber: 'BAN-2026-005',
    certificateIncluded: true,
    weightKg: 5.1,
    location: 'Atelier Banora, Dakar',
    createdAt: '2026-02-18'
  },
  {
    id: 'art-008',
    title: 'Danse des Masques Sacrés',
    technique: 'Huile, pigments naturels et cordes végétales incrustées',
    dimensions: '160 x 120 cm',
    year: 2025,
    category: 'Rituels Contemporains',
    priceEUR: 4200,
    priceFCFA: 2755000,
    imageUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=1200&auto=format&fit=crop',
    status: 'vendu',
    isFeatured: true,
    description: 'Œuvre monumentale célébrant la transmission des mystères cosmologiques par l’intermédiaire des masques cérémoniels.',
    inspiration: 'Les rites d’initiation et la sacralité du geste artistique.',
    inventoryNumber: 'BAN-2025-007',
    certificateIncluded: true,
    weightKg: 11.2,
    location: 'Collection privée, Paris',
    createdAt: '2025-06-12'
  }
];

export const INITIAL_ARTIST_PROFILE: ArtistProfile = {
  name: 'BANORA',
  title: 'Artiste Peintre & Plasticien Contemporain',
  bio: 'Né au confluent des cultures africaines et de la modernité internationale, BANORA est un peintre dont les œuvres explorent la matière brute, les pigments telluriques et la résonance de la mémoire ancestrale. Travaillant entre Dakar et les grandes capitales d’art, ses toiles capturent la lumière saharienne et les vibrations chromatiques de l’humanité avec une maîtrise singulière du relief et des textures.',
  philosophy: '« Peindre n’est pas recouvrir une toile blanche, c’est libérer la lumière prisonnière des pigments et donner un visage aux émotions silencieuses de notre terre. »',
  avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop',
  studioImageUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1200&auto=format&fit=crop',
  studioAddress: 'Atelier Banora, Almadies - Route du Méridien, Dakar, Sénégal',
  phone: '+221 77 450 89 20',
  whatsapp: '+221774508920',
  email: 'contact@galerie-banora.art',
  instagram: '@banora.art',
  exhibitions: [
    {
      year: 2026,
      title: '« Terres & Éternité » - Exposition Personnelle',
      gallery: 'Galerie Nationale des Arts',
      location: 'Dakar, Sénégal'
    },
    {
      year: 2025,
      title: 'Biennale de l’Art Africain Contemporain (Dak’Art)',
      gallery: 'Pavillon International',
      location: 'Dakar, Sénégal'
    },
    {
      year: 2024,
      title: '« Résonances d’Or et d’Indigo »',
      gallery: 'Galerie 193',
      location: 'Paris, France'
    },
    {
      year: 2023,
      title: 'Art Dubai - Section Contemporaine',
      gallery: 'Madinat Jumeirah',
      location: 'Dubaï, Émirats Arabes Unis'
    }
  ]
};

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-101',
    orderNumber: 'CMD-2026-089',
    date: '2026-03-10',
    customerName: 'Jean-Marc Delcroix',
    customerEmail: 'jmdelcroix@gmail.com',
    customerPhone: '+33 6 42 18 90 22',
    deliveryAddress: '14 Avenue Montaigne',
    deliveryCity: 'Paris',
    deliveryCountry: 'France',
    paymentMethod: 'virement',
    currency: 'EUR',
    items: [
      {
        artworkId: 'art-006',
        title: 'Rythmes Nocturnes & Tambours',
        priceEUR: 2400,
        priceFCFA: 1575000,
        imageUrl: 'https://images.unsplash.com/photo-1549887534-1541e9326642?q=80&w=1200&auto=format&fit=crop',
        frame: 'Caisse américaine noire',
        frameCostEUR: 280,
        frameCostFCFA: 183000
      }
    ],
    totalEUR: 2680,
    totalFCFA: 1758000,
    status: 'livree',
    notes: 'Livraison sécurisée sous caisse bois certifiée avec certificat d’authenticité signé.'
  },
  {
    id: 'ord-102',
    orderNumber: 'CMD-2026-092',
    date: '2026-03-22',
    customerName: 'Aminata Ndiaye',
    customerEmail: 'aminata.ndiaye@teranga.sn',
    customerPhone: '+221 78 123 45 67',
    deliveryAddress: 'Corniche Ouest, Fann Résidence',
    deliveryCity: 'Dakar',
    deliveryCountry: 'Sénégal',
    paymentMethod: 'mobile_money',
    currency: 'XOF',
    items: [
      {
        artworkId: 'art-008',
        title: 'Danse des Masques Sacrés',
        priceEUR: 4200,
        priceFCFA: 2755000,
        imageUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=1200&auto=format&fit=crop',
        frame: 'Caisse américaine dorée',
        frameCostEUR: 350,
        frameCostFCFA: 230000
      }
    ],
    totalEUR: 4550,
    totalFCFA: 2985000,
    status: 'en_cours_expedition',
    notes: 'Rendez-vous fixé pour remise en main propre à la galerie de Dakar.'
  }
];

export const INITIAL_INQUIRIES: ClientInquiry[] = [
  {
    id: 'inq-01',
    date: '2026-03-24',
    artworkId: 'art-001',
    artworkTitle: 'Symphonie Sahélienne N°4',
    name: 'Laurent K.',
    email: 'l.kramer@art-consulting.ch',
    phone: '+41 79 330 12 40',
    message: 'Bonjour Banora, je souhaiterais acquérir cette toile pour un collectionneur privé à Genève. Est-il possible d’organiser un transport sécurisé avec assurance d’art internationale ?',
    isCommission: false,
    status: 'nouveau'
  },
  {
    id: 'inq-02',
    date: '2026-03-20',
    name: 'Cabinet d’Architecture Diop & Associés',
    email: 'contact@diop-archi.sn',
    phone: '+221 77 890 11 22',
    message: 'Nous aménageons le hall d’un grand complexe hôtelier à Saly et souhaitons commander un triptyque sur mesure (3 x 200x120cm) dans l’esprit de la série Lueurs & Or.',
    isCommission: true,
    status: 'repondu'
  }
];

export const INITIAL_TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-01',
    authorName: 'Laurent Kramer',
    roleOrCity: 'Collectionneur Privé · Genève, Suisse',
    artworkAcquired: 'Symphonie Sahélienne N°4',
    rating: 5,
    date: 'Février 2026',
    content: 'L\'acquisition de cette toile a été une révélation. Dès la réception de la caisse d\'art en bois sécurisée et du certificat d\'authenticité signé, tout respirait la perfection. La vibration des ocres et les éclats d\'or sous la lumière naturelle dépassent encore la vue en galerie.',
    verifiedPurchase: true,
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop'
  },
  {
    id: 'test-02',
    authorName: 'Aminata Diop Ndiaye',
    roleOrCity: 'Architecte d’Intérieur · Dakar, Sénégal',
    artworkAcquired: 'Danse des Masques Sacrés',
    rating: 5,
    date: 'Janvier 2026',
    content: 'J\'ai intégré cette œuvre maîtresse dans le salon de réception d\'une résidence aux Almadies. La puissance tellurique et le travail minutieux des cordes végétales sculptent littéralement l\'espace. BANORA est l\'un des artistes les plus prometteurs de notre scène contemporaine.',
    verifiedPurchase: true,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop'
  },
  {
    id: 'test-03',
    authorName: 'Jean-Marc Delcroix',
    roleOrCity: 'Amateur d’Art · Paris, France',
    artworkAcquired: 'Rythmes Nocturnes & Tambours',
    rating: 5,
    date: 'Mars 2026',
    content: 'Processus d\'achat d\'une clarté exemplaire. Le visualiseur mural m\'a permis de choisir avec précision l\'encadrement en caisse américaine noire. La communication directe avec BANORA sur WhatsApp et l\'envoi rapide par transport spécialisé inspirent une totale confiance.',
    verifiedPurchase: true,
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop'
  },
  {
    id: 'test-04',
    authorName: 'Aïssatou & Malik Sow',
    roleOrCity: 'Collectionneurs Particuliers · Abidjan, Côte d’Ivoire',
    artworkAcquired: 'Commande Spéciale Sur-Mesure (Triptyque)',
    rating: 5,
    date: 'Décembre 2025',
    content: 'Nous avons confié à l\'artiste BANORA la création d\'une pièce monumentale pour notre maison. Son écoute, ses propositions chromatiques et la noblesse des matières ont comblé toutes nos attentes. Une pièce patrimoniale qui nous accompagnera toute notre vie.',
    verifiedPurchase: true,
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop'
  }
];
