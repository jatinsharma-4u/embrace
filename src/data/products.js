// Catalogue data — frontend only. Images are transparent cutouts in /public/img/p.
const img = (f) => `/img/p/${f}.webp`
const photo = (f) => `/img/photo/${f}.webp`

export const collections = [
  {
    slug: 'emerald-atelier',
    name: 'Emerald Atelier',
    tagline: 'Colombian green, set in eighteen-carat gold.',
    description:
      'Our signature house stones — hand-selected Colombian and Zambian emeralds framed in pavé diamonds and warm yellow gold. Each stone is cut to hold the light like deep forest water.',
    cover: photo('emerald-rings'),
    hero: img('necklace_119'),
    tone: 'emerald',
  },
  {
    slug: 'golden-hour',
    name: 'Golden Hour',
    tagline: 'Sculpted gold for every day, every evening.',
    description:
      'Fluid chains, wrapped bands and woven cuffs in polished 18k gold. Pieces designed to be layered, stacked and worn from first light to last.',
    cover: photo('swirl-earrings'),
    hero: img('necklace_110'),
    tone: 'gold',
  },
  {
    slug: 'radiant-bloom',
    name: 'Radiant Bloom',
    tagline: 'Rubies, sapphires and citrine in full flower.',
    description:
      'A garden of colour — pigeon-blood rubies, cornflower sapphires and honeyed citrine arranged into blossoms, drops and clusters.',
    cover: photo('citrine-pendant'),
    hero: img('jewelry_6705'),
    tone: 'ruby',
  },
  {
    slug: 'heritage-temple',
    name: 'Heritage Temple',
    tagline: 'Hand-wrought 22k gold in the temple tradition.',
    description:
      'Inspired by South Asian temple jewellery: granulated 22k gold, kundan settings and cascading gold beads made by master artisans over hundreds of hours.',
    cover: photo('temple-set'),
    hero: img('necklace_45'),
    tone: 'gold',
  },
  {
    slug: 'bridal-diamonds',
    name: 'Bridal Diamonds',
    tagline: 'Brilliance for the moments that last forever.',
    description:
      'Solitaires, halos and chandelier drops in ethically sourced diamonds — certified, conflict-free and finished by hand in our London workshop.',
    cover: photo('flower-studs'),
    hero: img('jewelry_6809'),
    tone: 'diamond',
  },
]

export const categories = [
  { slug: 'rings', name: 'Rings', image: img('ring_21') },
  { slug: 'earrings', name: 'Earrings', image: img('jewelry_6707') },
  { slug: 'necklaces', name: 'Necklaces', image: img('necklace_65') },
  { slug: 'bracelets', name: 'Bracelets', image: img('jewelry_6835') },
]

const METALS = {
  yellow: { id: 'yellow', name: '18k Yellow Gold', swatch: 'linear-gradient(135deg,#f6dd9a,#c9962f)', delta: 0 },
  white: { id: 'white', name: '18k White Gold', swatch: 'linear-gradient(135deg,#f4f4f2,#b9bcbf)', delta: 0 },
  rose: { id: 'rose', name: '18k Rose Gold', swatch: 'linear-gradient(135deg,#f6cdb7,#c27f63)', delta: 0 },
  plat: { id: 'plat', name: 'Platinum', swatch: 'linear-gradient(135deg,#eceef0,#9aa1a8)', delta: 450 },
}

const SIZES = {
  rings: ['H', 'J', 'L', 'N', 'P', 'R'],
  necklaces: ['40 cm', '45 cm', '50 cm'],
  bracelets: ['S', 'M', 'L'],
  earrings: null,
}

const raw = [
  // Emerald Atelier
  ['emerald-cascade-necklace', 'Emerald Cascade Necklace', 'necklaces', 'emerald-atelier', 18400, 'necklace_119', ['white', 'yellow'], 'Bestseller',
    'A collar of graduated emerald-cut emeralds, each encircled by brilliant diamonds, flowing into a cascade at the throat.'],
  ['verdant-drop-necklace', 'Verdant Drop Necklace', 'necklaces', 'emerald-atelier', 9800, 'necklace_65', ['white', 'plat'], 'New',
    'A pear-shaped emerald suspended from a rivière of round diamonds — our most photographed piece.'],
  ['emerald-teardrop-earrings', 'Emerald Teardrop Earrings', 'earrings', 'emerald-atelier', 6250, 'jewelry_6707', ['white', 'yellow'], 'New',
    'Long, articulated drops ending in polished emerald teardrops that catch the light with every movement.'],
  ['forest-halo-pendant', 'Forest Halo Pendant', 'necklaces', 'emerald-atelier', 4350, 'jewelry_6719', ['white', 'yellow', 'rose'], null,
    'An oval emerald wrapped in a double halo of diamonds on a fine trace chain.'],
  ['emerald-pear-pendant', 'Emerald Pear Pendant', 'necklaces', 'emerald-atelier', 3900, 'jewelry_6724', ['white', 'yellow'], null,
    'A pear-cut emerald with a pavé diamond frame, hung from a delicate diamond-set bail.'],
  ['emerald-swirl-pendant', 'Emerald Swirl Pendant', 'necklaces', 'emerald-atelier', 3450, 'jewelry_6720', ['white', 'yellow'], null,
    'Calibré emeralds trace an open teardrop silhouette — light, graphic and endlessly wearable.'],
  ['regent-emerald-necklace', 'Regent Emerald Necklace', 'necklaces', 'emerald-atelier', 12600, 'necklace_44', ['white'], 'Limited',
    'A sweeping diamond garland that gathers into twin emerald drops. Made to order in an edition of twelve.'],

  // Golden Hour
  ['serpentine-wrap-ring', 'Serpentine Wrap Ring', 'rings', 'golden-hour', 2150, 'ring_21', ['yellow', 'rose', 'white'], 'Bestseller',
    'A double wrap of polished gold finished with a pavé diamond tip that coils around the finger.'],
  ['aurelia-filigree-band', 'Aurelia Filigree Band', 'rings', 'golden-hour', 1450, 'jewelry_6713', ['yellow', 'rose'], null,
    'Hand-pierced filigree lace in 18k gold, set with scattered brilliant diamonds.'],
  ['ribbon-stack-ring', 'Ribbon Stack Ring', 'rings', 'golden-hour', 1890, 'jewelry_6746', ['yellow', 'rose'], null,
    'Four fluid ribbons of gold folded into a single sculptural band.'],
  ['twist-gold-ring', 'Twist Gold Ring', 'rings', 'golden-hour', 1650, 'jewelry_6745', ['yellow', 'rose'], null,
    'A single strand of polished gold twisted back on itself — minimal, modern, effortless.'],
  ['woven-mesh-cuff', 'Woven Mesh Cuff', 'bracelets', 'golden-hour', 5400, 'jewelry_6835', ['yellow', 'rose'], 'New',
    'A supple woven-gold cuff ending in two pavé-set leaves that cross at the wrist.'],
  ['golden-hour-bangles', 'Golden Hour Bangles', 'bracelets', 'golden-hour', 3200, 'jewelry_6805', ['yellow'], null,
    'A pair of engraved 18k gold bangles designed to be worn together.'],
  ['hammered-gold-bangle', 'Hammered Gold Bangle', 'bracelets', 'golden-hour', 2350, 'jewelry_6818', ['yellow', 'rose'], null,
    'A slim oval bangle, hand-hammered to scatter the light across its 18k gold surface.'],
  ['soleil-fringe-collar', 'Soleil Fringe Collar', 'necklaces', 'golden-hour', 7850, 'necklace_110', ['yellow'], 'Bestseller',
    'Hundreds of hand-linked gold batons fan into a radiant collar that sits like sunlight on the skin.'],
  ['cuban-link-chain', 'Cuban Link Chain', 'necklaces', 'golden-hour', 4600, 'necklace_97', ['yellow', 'white'], null,
    'Heavy, polished curb links with a hidden box clasp — the essential statement chain.'],
  ['eternal-circle-pendant', 'Eternal Circle Pendant', 'necklaces', 'golden-hour', 1280, 'jewelry_6750', ['yellow', 'rose'], null,
    'Three rolling rings of gold suspended on a fine chain — a symbol of enduring love.'],

  // Radiant Bloom
  ['ruby-rose-choker', 'Ruby Rosette Choker', 'necklaces', 'radiant-bloom', 14200, 'jewelry_6705', ['yellow'], 'Limited',
    'An openwork lattice of diamonds and gold blossoming into a single cabochon ruby.'],
  ['ruby-garland-collar', 'Ruby Garland Collar', 'necklaces', 'radiant-bloom', 16800, 'necklace_4', ['white'], null,
    'A diamond garland punctuated with oval rubies, tapering to a point at the décolletage.'],
  ['ruby-flame-earrings', 'Ruby Flame Earrings', 'earrings', 'radiant-bloom', 5750, 'jewelry_6811', ['white'], null,
    'Briolette rubies hang beneath diamond-set hoops, flickering like candlelight.'],
  ['sapphire-nocturne-earrings', 'Sapphire Nocturne Earrings', 'earrings', 'radiant-bloom', 5900, 'jewelry_6751', ['white', 'plat'], null,
    'Pear-cut Ceylon sapphires framed in diamonds, suspended from articulated huggies.'],
  ['ruby-blossom-ring', 'Ruby Blossom Ring', 'rings', 'radiant-bloom', 2950, 'ring_27', ['yellow', 'rose'], null,
    'A cluster of round rubies blooming across a split gold shank.'],
  ['ruby-eternity-band', 'Ruby Eternity Band', 'rings', 'radiant-bloom', 2400, 'ring_79', ['rose', 'yellow'], 'New',
    'Alternating rubies and diamonds set in a slender rose-gold band.'],
  ['crimson-halo-ring', 'Crimson Halo Ring', 'rings', 'radiant-bloom', 4100, 'ring_90', ['yellow', 'white'], null,
    'An oval ruby crowned by a scalloped halo of brilliant diamonds.'],

  // Heritage Temple
  ['maharani-temple-necklace', 'Maharani Temple Necklace', 'necklaces', 'heritage-temple', 11800, 'necklace_45', ['yellow'], 'Bestseller',
    'A 22k gold bib necklace with granulated motifs and a cascade of gold bead drops, made over 300 hours.'],
  ['kundan-bloom-necklace', 'Kundan Bloom Necklace', 'necklaces', 'heritage-temple', 8900, 'necklace_36', ['yellow'], null,
    'Kundan-set florals and seed pearls gathered into a regal ceremonial collar.'],

  // Bridal Diamonds
  ['chandelier-diamond-earrings', 'Chandelier Diamond Earrings', 'earrings', 'bridal-diamonds', 7600, 'jewelry_6809', ['white', 'plat'], null,
    'Tiers of pear and marquise diamonds that move like a chandelier in candlelight.'],
  ['snowflower-earrings', 'Snowflower Earrings', 'earrings', 'bridal-diamonds', 6800, 'jewelry_6823', ['white', 'plat'], 'Bestseller',
    'Clusters of brilliant diamonds arranged into frosted blossoms on a diamond hook.'],
  ['celeste-princess-ring', 'Celeste Princess Ring', 'rings', 'bridal-diamonds', 6900, 'jewelry_6797', ['yellow', 'white', 'plat'], null,
    'A princess-cut diamond held in platinum claws above a pavé-set gold band.'],
  ['heirloom-solitaire', 'Heirloom Solitaire', 'rings', 'bridal-diamonds', 5200, 'ring_110', ['yellow', 'rose'], null,
    'A vintage-inspired round solitaire with milgrain shoulders in warm gold.'],
  ['classic-gold-solitaire', 'Classic Gold Solitaire', 'rings', 'bridal-diamonds', 3800, 'ring_23', ['yellow', 'white', 'plat'], null,
    'A brilliant-cut diamond lifted in a four-claw setting above a channel-set band.'],
  ['pearl-luna-pendant', 'Pearl Luna Pendant', 'necklaces', 'bridal-diamonds', 2650, 'necklace_102', ['yellow'], null,
    'A lustrous South Sea pearl beneath an aquamarine-set gold bail on a belcher chain.'],
  ['pearl-drop-earrings', 'Pearl Drop Earrings', 'earrings', 'bridal-diamonds', 1950, 'jewelry_6759', ['white', 'yellow'], null,
    'Tahitian and white pearls suspended from diamond-set studs.'],
]

export const products = raw.map(([slug, name, category, collection, price, image, metals, badge, description], i) => ({
  id: i + 1,
  slug,
  name,
  category,
  collection,
  price,
  image: img(image),
  metals: metals.map((m) => METALS[m]),
  sizes: SIZES[category],
  badge,
  description,
  rating: [4.9, 5, 4.8, 4.9, 5][i % 5],
  reviews: 18 + ((i * 37) % 140),
  order: i,
}))

export const getProduct = (slug) => products.find((p) => p.slug === slug)
export const getCollection = (slug) => collections.find((c) => c.slug === slug)
export const byCollection = (slug) => products.filter((p) => p.collection === slug)
export const byCategory = (slug) => products.filter((p) => p.category === slug)
export const featured = ['emerald-cascade-necklace', 'serpentine-wrap-ring', 'emerald-teardrop-earrings', 'woven-mesh-cuff', 'snowflower-earrings', 'soleil-fringe-collar', 'ruby-eternity-band', 'maharani-temple-necklace'].map(getProduct)

export const lifestyle = [
  { src: photo('emerald-rings'), title: 'Emerald Atelier', caption: 'Cushion-cut emeralds', to: '/collections#emerald-atelier' },
  { src: photo('citrine-pendant'), title: 'Radiant Bloom', caption: 'Citrine drops on gold', to: '/collections#radiant-bloom' },
  { src: photo('flower-studs'), title: 'Bridal Diamonds', caption: 'Four-petal diamond studs', to: '/collections#bridal-diamonds' },
  { src: photo('swirl-earrings'), title: 'Golden Hour', caption: 'Sculpted swirl drops', to: '/collections#golden-hour' },
  { src: photo('emerald-bracelet-hand'), title: 'The Emerald Line', caption: 'Emerald-cut tennis bracelet', to: '/shop?collection=emerald-atelier' },
  { src: photo('temple-set'), title: 'Heritage Temple', caption: '22k kundan set', to: '/collections#heritage-temple' },
]

export const formatPrice = (n) =>
  new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(n)
