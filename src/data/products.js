export const CATEGORIES = [
  {
    id: 'electronics',
    name: 'Electronics',
    iconName: 'Smartphone',
    count: 24,
    description: 'Next-gen audio, smart displays & spatial computing',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'fashion',
    name: 'Fashion',
    iconName: 'Shirt',
    count: 38,
    description: 'Minimalist streetwear, essential hoodies & tailored wear',
    image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'footwear',
    name: 'Footwear',
    iconName: 'Footprints',
    count: 19,
    description: 'Performance runners, luxury sneakers & everyday boots',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'accessories',
    name: 'Accessories',
    iconName: 'Watch',
    count: 31,
    description: 'Precision timepieces, leather goods & polarized optics',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'home',
    name: 'Home & Living',
    iconName: 'Home',
    count: 27,
    description: 'Smart ambient illumination, ceramic artisan & workspace gear',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'beauty',
    name: 'Beauty & Wellness',
    iconName: 'Sparkles',
    count: 15,
    description: 'Botanical skincare serums, organic perfumes & self-care essentials',
    image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80',
  }
];

export const PRODUCTS = [
  {
    id: 'nex-01',
    name: 'Acoustica Ultra Wireless ANC Headphones',
    brand: 'Acoustica',
    category: 'electronics',
    price: 299,
    originalPrice: 399,
    discount: 25,
    rating: 4.9,
    reviewsCount: 342,
    isFeatured: true,
    isTrending: true,
    isSpecialDeal: true,
    inStock: true,
    description: 'Immerse yourself in pure studio audio with hybrid active noise cancellation, custom 40mm titanium drivers, and 60-hour continuous playback.',
    features: [
      'Active Noise Cancellation with Transparency Mode',
      'Custom 40mm Titanium Dynamic Drivers',
      'Up to 60 Hours Battery Life with Fast Charge',
      'Ultra-soft Memory Foam Ear Cushions',
      'Multipoint Bluetooth 5.3 Connection'
    ],
    sizes: ['Matte Black', 'Silver Alloy', 'Midnight Navy'],
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 'nex-02',
    name: 'Horizon Minimalist Titanium Smartwatch',
    brand: 'NEXORA Lab',
    category: 'accessories',
    price: 349,
    originalPrice: 429,
    discount: 18,
    rating: 4.8,
    reviewsCount: 215,
    isFeatured: true,
    isTrending: true,
    isSpecialDeal: false,
    inStock: true,
    description: 'Forged from aerospace-grade titanium with an ultra-bright AMOLED display, sapphire crystal glass, and bio-metric health monitoring.',
    features: [
      'Grade 5 Titanium Unibody Casing',
      'Always-On Sapphire Crystal AMOLED Screen',
      'ECG, SpO2 & Advanced Sleep Tracking',
      '50m Water Resistance (5 ATM)',
      '7-Day Smart Battery Architecture'
    ],
    sizes: ['42mm Silver', '46mm Space Grey', '46mm Titanium Gold'],
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 'nex-03',
    name: 'Velocity Pro Carbon Running Sneakers',
    brand: 'Apex Athletics',
    category: 'footwear',
    price: 189,
    originalPrice: 240,
    discount: 21,
    rating: 4.7,
    reviewsCount: 188,
    isFeatured: true,
    isTrending: false,
    isSpecialDeal: true,
    inStock: true,
    description: 'Engineered for energy return featuring a responsive carbon fiber propulsion plate and breathable woven upper for peak marathon performance.',
    features: [
      'Embedded Full-Length Carbon Plate',
      'High-rebound Nitrogen Infused Midsole Foam',
      'Ultra-breathable FlyWeave Upper Mesh',
      'High-traction Wet Grip Rubber Outsole',
      'Weight: 195 grams (US Size 9)'
    ],
    sizes: ['US 8', 'US 9', 'US 10', 'US 11', 'US 12'],
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 'nex-04',
    name: 'Heavyweight Japanese Cotton Hoodie',
    brand: 'Atelier Studio',
    category: 'fashion',
    price: 120,
    originalPrice: 160,
    discount: 25,
    rating: 4.9,
    reviewsCount: 410,
    isFeatured: true,
    isTrending: true,
    isSpecialDeal: false,
    inStock: true,
    description: 'Crafted from 500 GSM custom Loopback French Terry Japanese cotton. Designed with a relaxed drop-shoulder silhouette and double-lined hood.',
    features: [
      '100% Organic 500 GSM French Terry Cotton',
      'Double-walled Structure Hood',
      'Seamless Side Construction & Pre-shrunk',
      'Heavy-duty Ribbed Cuffs & Hem',
      'Unisex Relaxed Boxy Fit'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 'nex-05',
    name: 'Lumina Smart Ambient Desk Lamp',
    brand: 'Komorebi Design',
    category: 'home',
    price: 145,
    originalPrice: 180,
    discount: 19,
    rating: 4.8,
    reviewsCount: 124,
    isFeatured: true,
    isTrending: false,
    isSpecialDeal: false,
    inStock: true,
    description: 'Architectural desk lamp with adaptive circadian rhythm color tuning, integrated wireless fast charger, and touch-sensitive dimming.',
    features: [
      'Circadian Daylight Auto-Synchronization',
      'CRI > 97 True Color Rendering Index',
      '15W Fast Qi Wireless Charging Pad',
      'Precision Machined Anodized Aluminum Arm',
      'Smart Home Compatible (HomeKit/Alexa)'
    ],
    sizes: ['Matte Black', 'Brushed Brass', 'Anodized Silver'],
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 'nex-06',
    name: 'Botanical Hydrating Serum & Glow Concentrate',
    brand: 'Verdant Skin',
    category: 'beauty',
    price: 85,
    originalPrice: 110,
    discount: 22,
    rating: 4.9,
    reviewsCount: 290,
    isFeatured: true,
    isTrending: true,
    isSpecialDeal: true,
    inStock: true,
    description: 'Formulated with multi-weight hyaluronic acid, niacinamide, and rare alpine rose stem cells for instant radiance and deep barrier repair.',
    features: [
      'Triple-Action Hyaluronic Acid Complex',
      'Cold-pressed Plant Antioxidants',
      'Dermatologist Tested & Non-Comedogenic',
      '100% Vegan & Cruelty-Free Certification',
      'Sustainable Glass Pipette Packaging'
    ],
    sizes: ['30ml Standard', '50ml Deluxe refill'],
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 'nex-07',
    name: 'ErgoMotion Mesh Task Chair',
    brand: 'Komorebi Design',
    category: 'home',
    price: 499,
    originalPrice: 650,
    discount: 23,
    rating: 4.6,
    reviewsCount: 96,
    isFeatured: false,
    isTrending: true,
    isSpecialDeal: false,
    inStock: true,
    description: 'Ergonomic seating masterpiece with dynamic lumbar support, 4D adjustable armrests, and breathable Italian mesh matrix.',
    features: [
      'Self-adjusting Auto-lumbar Cushioning',
      '4D Precision Armrests (Height, Angle, Depth)',
      'Breathable Italian Thermoplastic Mesh',
      'Heavy-duty Class 4 Gas Lift Cylinder',
      '135-degree Synchro-tilt Mechanism'
    ],
    sizes: ['Graphite Black', 'Polar White'],
    image: 'https://images.unsplash.com/photo-1580481072645-022f9a6d83d0?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1580481072645-022f9a6d83d0?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 'nex-08',
    name: 'Craftsman Top-Grain Leather Bifold Wallet',
    brand: 'Atelier Studio',
    category: 'accessories',
    price: 75,
    originalPrice: 95,
    discount: 21,
    rating: 4.8,
    reviewsCount: 154,
    isFeatured: false,
    isTrending: false,
    isSpecialDeal: true,
    inStock: true,
    description: 'Handcrafted from vegetable-tanned Tuscan leather that develops a rich patina over time. Features RFID blocking shielding layer.',
    features: [
      '100% Full Grain Italian Vegetable Tanned Leather',
      'Integrated Military-grade RFID Blocking Shield',
      'Holds up to 10 Cards + Cash Compartment',
      'Hand-stitched Waxed Thread Construction',
      'Compact Slim Profile (10mm thickness)'
    ],
    sizes: ['Cognac Brown', 'Obsidian Black', 'Espresso Dark'],
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 'nex-09',
    name: 'ProGlide Mechanical Gaming Keyboard',
    brand: 'Acoustica',
    category: 'electronics',
    price: 169,
    originalPrice: 210,
    discount: 20,
    rating: 4.9,
    reviewsCount: 520,
    isFeatured: true,
    isTrending: true,
    isSpecialDeal: false,
    inStock: true,
    description: 'Hot-swappable gasket-mounted mechanical keyboard with lubricated tactile switches, per-key RGB lighting, and CNC aluminum case.',
    features: [
      'CNC Machined Anodized Aluminum Chassis',
      'Gasket Mount System with PORON Foam Dampening',
      'Hot-Swappable PCB (3-pin & 5-pin compatible)',
      'Double-shot PBT Cherry Profile Keycaps',
      'Tri-mode Connectivity (Type-C, 2.4Ghz, Bluetooth 5.1)'
    ],
    sizes: ['75% Compact', '100% Full Size'],
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 'nex-10',
    name: 'Urban Transit Waterproof Rolltop Backpack',
    brand: 'NEXORA Lab',
    category: 'accessories',
    price: 135,
    originalPrice: 175,
    discount: 22,
    rating: 4.7,
    reviewsCount: 167,
    isFeatured: false,
    isTrending: false,
    isSpecialDeal: false,
    inStock: true,
    description: 'All-weather commuter bag constructed with recycled Cordura fabric, magnetic Fidlock buckle closures, and padded 16" laptop sleeve.',
    features: [
      '1000D Recycled Waterproof Cordura Outer',
      'Fidlock V-Buckle Magnetic Speed Closures',
      'Dedicated Suspended 16-inch Laptop Pocket',
      'Hidden Passport & Luggage Pass-through Strap',
      '22L to 28L Expandable Rolltop Capacity'
    ],
    sizes: ['Charcoal Grey', 'Stealth Black', 'Olive Drab'],
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 'nex-11',
    name: 'Artisan Pour-Over Ceramic Coffee Kit',
    brand: 'Komorebi Design',
    category: 'home',
    price: 95,
    originalPrice: 120,
    discount: 20,
    rating: 4.8,
    reviewsCount: 89,
    isFeatured: false,
    isTrending: true,
    isSpecialDeal: false,
    inStock: true,
    description: 'Handcrafted stoneware ceramic pour-over dripper paired with a double-walled borosilicate glass carafe and walnut wooden collar.',
    features: [
      'Hand-thrown Ceramic Cone Dripper with Thermal Glaze',
      '600ml Heat-Resistant Borosilicate Carafe',
      'Sustainably Sourced Walnut Wood Collar & Brass Pin',
      'Includes 50 Unbleached Organic Paper Filters',
      'Dishwasher Safe Glass Components'
    ],
    sizes: ['Matte Speckle White', 'Basalt Black'],
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 'nex-12',
    name: 'Heritage Raw Denim Oversized Jacket',
    brand: 'Atelier Studio',
    category: 'fashion',
    price: 175,
    originalPrice: 220,
    discount: 20,
    rating: 4.8,
    reviewsCount: 204,
    isFeatured: false,
    isTrending: true,
    isSpecialDeal: true,
    inStock: true,
    description: 'Constructed from 14.5oz Japanese Selvedge Denim with copper hardware and classic boxy trucker jacket tailoring.',
    features: [
      '14.5 oz Kurabo Mills Japanese Selvedge Denim',
      'Solid Antique Brass Hardware Buttons',
      'Twin Chest Flap Pockets & Hidden Side Hand Pockets',
      'Reinforced Triple Needle Contrast Stitching',
      'Raw Indigo Wash (Will age naturally)'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 'nex-13',
    name: 'AeroFlex Breathable Studio Slip-On Sneakers',
    brand: 'Apex Athletics',
    category: 'footwear',
    price: 130,
    originalPrice: 160,
    discount: 18,
    rating: 4.6,
    reviewsCount: 142,
    isFeatured: false,
    isTrending: false,
    isSpecialDeal: false,
    inStock: true,
    description: 'Featherlight lifestyle sneakers with elastic knit collar, antimicrobial ortholite footbed, and cloud-walk foam sole.',
    features: [
      'Seamless 3D Engineered Stretch Knit Upper',
      'OrthoLite Impressions Memory Foam Insole',
      'Ultralight Injection-Molded EVA Midsole',
      'Machine Washable Design',
      'Easy Slip-on Collar with Reinforced Heel Tab'
    ],
    sizes: ['US 7', 'US 8', 'US 9', 'US 10', 'US 11'],
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 'nex-14',
    name: 'Luminary Niche Eau de Parfum 100ml',
    brand: 'Verdant Skin',
    category: 'beauty',
    price: 155,
    originalPrice: 190,
    discount: 18,
    rating: 4.9,
    reviewsCount: 312,
    isFeatured: false,
    isTrending: false,
    isSpecialDeal: false,
    inStock: true,
    description: 'An evocative olfactory blend of smoked cedarwood, golden amber, wild vetiver, and crisp bergamot notes.',
    features: [
      '22% High Fragrance Oil Concentration (Eau de Parfum)',
      'Sustainably Harvested Essential Botanicals',
      'Long-lasting 12+ Hour Wear',
      'Hand-poured Crystal Glass Bottle with Magnetic Cap',
      'Gender-neutral Warm Woodsy Profile'
    ],
    sizes: ['50ml', '100ml'],
    image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 'nex-15',
    name: 'UltraVision 4K HDR Colorist Monitor',
    brand: 'NEXORA Lab',
    category: 'electronics',
    price: 699,
    originalPrice: 850,
    discount: 17,
    rating: 4.9,
    reviewsCount: 178,
    isFeatured: false,
    isTrending: true,
    isSpecialDeal: true,
    inStock: true,
    description: '27-inch 4K IPS display calibrated for creative professionals with 99% DCI-P3 color gamut and 90W USB-C Single Cable Power Delivery.',
    features: [
      '27" 4K UHD (3840 x 2160) Nano-IPS Panel',
      'Factory Calibrated Delta E < 1.5 Color Precision',
      '99% DCI-P3 & 100% sRGB Wide Color Gamut',
      '90W USB-C Power Delivery & KVM Switch',
      'Ultra-thin 4-sided Bezel-less Aluminum Stand'
    ],
    sizes: ['27-inch 4K', '32-inch 4K'],
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 'nex-16',
    name: 'Polarized Aviator Titanium Sunglasses',
    brand: 'Apex Athletics',
    category: 'accessories',
    price: 140,
    originalPrice: 175,
    discount: 20,
    rating: 4.7,
    reviewsCount: 95,
    isFeatured: false,
    isTrending: false,
    isSpecialDeal: false,
    inStock: true,
    description: 'Ultra-lightweight Japanese beta-titanium frame equipped with 9-layer TAC polarized hydrophobic lenses.',
    features: [
      'Beta-Titanium Super Flexible Frame (Weight: 14g)',
      '9-Layer TAC Polarized Anti-Glare Lenses',
      '100% UV400 Protection (UVA & UVB Shielding)',
      'Hydrophobic & Scratch Resistant Coating',
      'Custom Leather Hard Case & Microfiber Cloth Included'
    ],
    sizes: ['Gold Frame / Emerald Green', 'Black Frame / Dark Grey'],
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80'
    ]
  }
];
