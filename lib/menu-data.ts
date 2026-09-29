// Seed menu for the rotating weekly grid (/current-menu) and the client portal.
// Chef de Serene manages the live menu from /portal/admin/menu; this list seeds
// a fresh database and is the fallback when the database is unreachable.

export const MENU_FILTERS = ['Anti-Inflammatory', 'Low-Glycemic', 'High Protein', 'Athletic Recovery'] as const

export type MenuItemSeed = {
  title: string
  description: string
  imageUrl: string
  category: string
  specs: string[]
  calories: number
  proteinG: number
  carbsG: number
  fatG: number
}

const img = (id: string) => `https://images.unsplash.com/photo-${id}?q=80&w=900&auto=format&fit=crop`

export const MENU_SEED: MenuItemSeed[] = [
  {
    title: 'Wild King Salmon Crudo',
    description: 'Fermented Yuzu, Avocado Oil Emulsion, Sea Cured Botanicals',
    imageUrl: img('1560717845-968823efbee1'),
    category: 'Raw Bar',
    specs: ['High Omega-3', 'Low-Glycemic', 'Anti-Inflammatory'],
    calories: 380,
    proteinG: 32,
    carbsG: 8,
    fatG: 24,
  },
  {
    title: 'Grass-Fed Bison Tenderloin',
    description: 'Sunchoke Purée, Bone Marrow Reduction, Charred Broccolini',
    imageUrl: img('1558030006-450675393462'),
    category: 'Protein Anchor',
    specs: ['High Iron', 'High Protein', 'Athletic Recovery', 'Low-Glycemic'],
    calories: 540,
    proteinG: 48,
    carbsG: 18,
    fatG: 28,
  },
  {
    title: 'Cedar-Roasted Ora King Salmon',
    description: 'Ginger-Turmeric Glaze, Charred Scallion, Wilted Tatsoi',
    imageUrl: img('1519708227418-c8fd9a32b7a2'),
    category: 'Protein Anchor',
    specs: ['High Omega-3', 'Anti-Inflammatory', 'High Protein', 'Athletic Recovery'],
    calories: 490,
    proteinG: 42,
    carbsG: 12,
    fatG: 29,
  },
  {
    title: 'Pan-Seared Pacific Halibut',
    description: 'Saffron Quinoa, Preserved Lemon, Cold-Pressed Olive Oil',
    imageUrl: img('1580476262798-bddd9f4b7369'),
    category: 'Coastal',
    specs: ['High Protein', 'Low-Glycemic', 'Anti-Inflammatory'],
    calories: 460,
    proteinG: 44,
    carbsG: 30,
    fatG: 16,
  },
  {
    title: 'Chicory & Heirloom Beet Salad',
    description: 'Blood Orange, Toasted Pepitas, Aged Balsamic, Microgreens',
    imageUrl: img('1540189549336-e6e99c3679fe'),
    category: 'Clinical Greens',
    specs: ['Anti-Inflammatory', 'Low-Glycemic', 'Antioxidant Dense'],
    calories: 310,
    proteinG: 9,
    carbsG: 24,
    fatG: 21,
  },
  {
    title: 'Heritage Pork Chop',
    description: 'Roasted Honeycrisp, Mustard Greens, Fennel Pollen Jus',
    imageUrl: img('1432139555190-58524dae6a55'),
    category: 'Protein Anchor',
    specs: ['High Protein', 'Athletic Recovery'],
    calories: 520,
    proteinG: 46,
    carbsG: 22,
    fatG: 26,
  },
  {
    title: 'Black Lentil & Avocado Grain Bowl',
    description: 'Sprouted Lentils, Snap Peas, Tahini-Lemon, Sea Salt Seeds',
    imageUrl: img('1623428187969-5da2dcea5ebf'),
    category: 'Clinical Greens',
    specs: ['Low-Glycemic', 'Anti-Inflammatory', 'Plant Protein'],
    calories: 470,
    proteinG: 21,
    carbsG: 44,
    fatG: 22,
  },
  {
    title: 'Wild Gulf Prawns, Coconut-Turmeric Broth',
    description: 'Lemongrass, Jasmine Rice, Thai Basil, Calamansi',
    imageUrl: img('1559847844-5315695dadae'),
    category: 'Coastal',
    specs: ['Anti-Inflammatory', 'High Protein'],
    calories: 480,
    proteinG: 36,
    carbsG: 42,
    fatG: 18,
  },
  {
    title: 'Seared Grass-Fed Flank',
    description: 'Chimichurri Verde, Charred Peppers, Wild Rice Pilaf',
    imageUrl: img('1504674900247-0877df9cc836'),
    category: 'Protein Anchor',
    specs: ['High Protein', 'High Iron', 'Athletic Recovery'],
    calories: 560,
    proteinG: 50,
    carbsG: 34,
    fatG: 24,
  },
  {
    title: 'Soft Pasture Eggs & Smashed Avocado',
    description: 'Sprouted Rye, House Chili Crisp, Watercress',
    imageUrl: img('1482049016688-2d3e1b311543'),
    category: 'Morning Protocol',
    specs: ['High Protein', 'Low-Glycemic'],
    calories: 420,
    proteinG: 22,
    carbsG: 28,
    fatG: 25,
  },
  {
    title: 'Roasted Kabocha Velouté',
    description: 'Coconut Cream, Toasted Pepitas, Turmeric Oil',
    imageUrl: img('1476718406336-bb5a9690ee2a'),
    category: 'Clinical Greens',
    specs: ['Anti-Inflammatory', 'Low-Glycemic'],
    calories: 260,
    proteinG: 6,
    carbsG: 28,
    fatG: 14,
  },
  {
    title: 'Valrhona Dark Chocolate Fondant',
    description: 'Adaptogenic Cacao Nib Dust, Mushroom-Infused Ganache',
    imageUrl: img('1642220618391-72214d19711c'),
    category: 'Dessert',
    specs: ['Antioxidant Dense', 'Low-Glycemic'],
    calories: 290,
    proteinG: 6,
    carbsG: 22,
    fatG: 20,
  },
]
