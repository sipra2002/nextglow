const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting GlowUp database seeding...');

  // 1. Clean existing records (in order of relations)
  try {
    await prisma.cartItem.deleteMany();
    await prisma.cart.deleteMany();
    await prisma.skinProfile.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
    await prisma.beautyTip.deleteMany();
    await prisma.user.deleteMany();
    console.log('🧹 Cleaned existing database records.');
  } catch (err) {
    console.log('Note on cleanup:', err.message);
  }

  // 2. Seed Admin User and Demo User
  const adminPassword = await bcrypt.hash('Admin@123', 10);
  const userPassword = await bcrypt.hash('User@123', 10);

  const admin = await prisma.user.create({
    data: {
      name: 'GlowUp Admin',
      email: 'admin@glowup.com',
      password: adminPassword,
      phone: '+91 98765 43210',
      role: 'ADMIN',
      cart: { create: {} },
    },
  });

  const demoUser = await prisma.user.create({
    data: {
      name: 'Pooja Sharma',
      email: 'pooja@glowup.com',
      password: userPassword,
      phone: '+91 98123 45678',
      role: 'USER',
      cart: { create: {} },
      skinProfile: {
        create: {
          skinType: 'COMBINATION',
          answers: JSON.stringify({ q1: { COMBINATION: 2 }, q2: { COMBINATION: 1 } }),
        },
      },
    },
  });

  console.log(`👤 Created Admin (${admin.email}) and Demo User (${demoUser.email})`);

  // 3. Seed 5 Categories
  const categoriesData = [
    { name: 'Face Wash' },
    { name: 'Moisturizer' },
    { name: 'Sunscreen' },
    { name: 'Serum' },
    { name: 'Lip Care' },
  ];

  const categories = {};
  for (const cat of categoriesData) {
    const created = await prisma.category.create({ data: cat });
    categories[cat.name] = created.id;
  }
  console.log('📂 Created 5 skincare categories.');

  // 4. Seed 15 Products (3 per category)
  const productsData = [
    // --- Face Wash ---
    {
      name: 'Centella Gentle Foam Cleanser',
      description: 'A low-pH soothing facial cleanser infused with Madagascar Centella Asiatica. Purifies pores without stripping moisture.',
      price: 599,
      imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80',
      skinTypes: 'SENSITIVE,NORMAL,DRY',
      stock: 75,
      featured: true,
      categoryId: categories['Face Wash'],
    },
    {
      name: 'Salicylic Acid Purifying Gel Wash',
      description: 'Formulated with 2% BHA and Tea Tree Oil to dissolve sebum plugs, combat blackheads, and prevent stubborn acne breakouts.',
      price: 649,
      imageUrl: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=600&q=80',
      skinTypes: 'OILY,COMBINATION',
      stock: 90,
      featured: false,
      categoryId: categories['Face Wash'],
    },
    {
      name: 'Hydra-Milky Oat Barrier Cleanser',
      description: 'Ultra-nourishing cream cleanser with colloidal oatmeal and ceramides that gently lifts dirt while repairing compromised skin.',
      price: 699,
      imageUrl: 'https://images.unsplash.com/photo-1556228852-80b6e5eeff06?auto=format&fit=crop&w=600&q=80',
      skinTypes: 'DRY,SENSITIVE',
      stock: 50,
      featured: true,
      categoryId: categories['Face Wash'],
    },

    // --- Moisturizer ---
    {
      name: 'Aqua Surge Gel Hydrator',
      description: 'Weightless oil-free water gel packed with 4 molecular weights of hyaluronic acid and aloe water for 72-hour plumping hydration.',
      price: 799,
      imageUrl: 'https://images.unsplash.com/photo-1608248597359-548480373e44?auto=format&fit=crop&w=600&q=80',
      skinTypes: 'OILY,COMBINATION,NORMAL',
      stock: 120,
      featured: true,
      categoryId: categories['Moisturizer'],
    },
    {
      name: 'Ceramide Barrier Recovery Cream',
      description: 'Rich therapeutic cream with a 3:1:1 physiological ratio of ceramides, cholesterol, and fatty acids to rebuild cracked skin barriers.',
      price: 899,
      imageUrl: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=600&q=80',
      skinTypes: 'DRY,SENSITIVE,NORMAL',
      stock: 85,
      featured: true,
      categoryId: categories['Moisturizer'],
    },
    {
      name: 'Pore-Clarifying Mattifying Fluid',
      description: 'Ultra-matte daily hydrator enriched with zinc PCA and silica to blur pores and control shine all day long.',
      price: 749,
      imageUrl: 'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=600&q=80',
      skinTypes: 'OILY,COMBINATION',
      stock: 65,
      featured: false,
      categoryId: categories['Moisturizer'],
    },

    // --- Sunscreen ---
    {
      name: 'Dewy Finish Sun Fluid SPF 50+ PA++++',
      description: 'Ultra-lightweight invisible chemical sunscreen that leaves no white cast, melts like a serum, and imparts a healthy glass glow.',
      price: 699,
      imageUrl: 'https://images.unsplash.com/photo-1567928805192-d25d64ac7a05?auto=format&fit=crop&w=600&q=80',
      skinTypes: 'NORMAL,DRY,COMBINATION',
      stock: 150,
      featured: true,
      categoryId: categories['Sunscreen'],
    },
    {
      name: 'Mineral Zinc Shield Matte SPF 50',
      description: '100% non-nano zinc oxide physical sunblock that calms redness, soothes inflammation, and protects sensitized skin.',
      price: 799,
      imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80',
      skinTypes: 'SENSITIVE,OILY',
      stock: 100,
      featured: false,
      categoryId: categories['Sunscreen'],
    },
    {
      name: 'Hydro-Cica Water Gel SPF 50',
      description: 'Refreshing cooling sun gel that absorbs in 3 seconds, perfect for hot humid weather and under-makeup application.',
      price: 729,
      imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80',
      skinTypes: 'OILY,COMBINATION,NORMAL',
      stock: 110,
      featured: true,
      categoryId: categories['Sunscreen'],
    },

    // --- Serum ---
    {
      name: '10% Niacinamide + Zinc 1% Clarifying Serum',
      description: 'High-potency clinical serum that tightens pores, fades post-acne dark spots, and regulates sebum output.',
      price: 549,
      imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80',
      skinTypes: 'OILY,COMBINATION,NORMAL',
      stock: 140,
      featured: true,
      categoryId: categories['Serum'],
    },
    {
      name: '15% Vitamin C Brightening Glow Elixir',
      description: 'Pure L-Ascorbic Acid stabilised with Ferulic Acid to illuminate dull complexions and defend against UV photoaging.',
      price: 999,
      imageUrl: 'https://images.unsplash.com/photo-1608248597359-548480373e44?auto=format&fit=crop&w=600&q=80',
      skinTypes: 'NORMAL,DRY,COMBINATION',
      stock: 60,
      featured: true,
      categoryId: categories['Serum'],
    },
    {
      name: 'Triple Peptide & Hyaluronic Plumping Serum',
      description: 'Intense collagen-supporting cocktail that smooths micro-lines, deeply rehydrates dry skin, and restores bouncy firmness.',
      price: 899,
      imageUrl: 'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=600&q=80',
      skinTypes: 'DRY,SENSITIVE,NORMAL',
      stock: 80,
      featured: false,
      categoryId: categories['Serum'],
    },

    // --- Lip Care ---
    {
      name: 'Berry Glaze Overnight Lip Sleeping Mask',
      description: 'Antioxidant berry fruit complex that melts away dead skin flakes overnight, leaving lips kissably soft and plump by morning.',
      price: 399,
      imageUrl: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=600&q=80',
      skinTypes: 'NORMAL,DRY,OILY,COMBINATION,SENSITIVE',
      stock: 200,
      featured: true,
      categoryId: categories['Lip Care'],
    },
    {
      name: 'Peptide Tinted Lip Balm - Rose Blush',
      description: 'Nutritious mango seed butter balm that gives a sheer natural petal-pink tint while cushioning lips from dry air.',
      price: 349,
      imageUrl: 'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?auto=format&fit=crop&w=600&q=80',
      skinTypes: 'NORMAL,DRY,OILY,COMBINATION,SENSITIVE',
      stock: 160,
      featured: true,
      categoryId: categories['Lip Care'],
    },
    {
      name: 'Intensive Honey Ceramide Lip Butter',
      description: 'Healing medical-grade propolis and beeswax formula designed to repair severely chapped, cracked, or bleeding lips.',
      price: 299,
      imageUrl: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=600&q=80',
      skinTypes: 'NORMAL,DRY,OILY,COMBINATION,SENSITIVE',
      stock: 130,
      featured: false,
      categoryId: categories['Lip Care'],
    },
  ];

  for (const product of productsData) {
    await prisma.product.create({ data: product });
  }
  console.log(`🛍️ Created ${productsData.length} skincare products.`);

  // 5. Seed 8 Beauty Tips across categories
  const tipsData = [
    {
      title: 'The Art of Double Cleansing: Why Your Evening Routine Needs It',
      category: 'Articles',
      content: `Double cleansing involves using an oil-based cleanser first to break down makeup, sunscreen, and daily sebum, followed by a water-based cleanser to wash away perspiration and dirt. 
      
If you wear water-resistant SPF or makeup, a single standard cleanser often leaves behind microscopic residue that blocks pores overnight. Start with dry hands and dry face, massage cleansing oil for 60 seconds, emulsify with warm water, rinse, and follow with your gentle foam cleanser.`,
      imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
      popular: true,
    },
    {
      title: 'Glass Skin Makeup: How to Prep Before Foundation',
      category: 'Makeup',
      content: `The secret to dewy 'glass skin' makeup is 80% skincare prep and only 20% foundation. 

1. Exfoliate gently with a mild PHA toner.
2. Layer a hyaluronic acid serum on slightly damp skin.
3. Lock in moisture with an emollient gel-cream.
4. Apply an illuminator or glowing sunscreen as your base primer.
5. Sheer out your foundation with a damp sponge rather than buffing with dense brushes.`,
      imageUrl: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80',
      popular: true,
    },
    {
      title: 'Scalp Detox & Hair Growth: The Rosemary Oil Ritual',
      category: 'Haircare',
      content: `Healthy, lustrous hair begins with a healthy scalp microbiome. Studies show that diluted rosemary essential oil stimulates microcirculation around hair follicles comparable to 2% minoxidil.

Mix 4-5 drops of pure rosemary oil into 2 tablespoons of jojoba or pumpkin seed carrier oil. Warm the blend in your palms and massage firmly into your scalp using circular motions. Leave it on for 45 minutes to 2 hours before shampooing thoroughly. Practice twice weekly for noticeable density improvement.`,
      imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
      popular: true,
    },
    {
      title: 'DIY Soothing Oat & Honey Face Mask for Irritated Skin',
      category: 'Natural Skincare',
      content: `When your skin barrier is inflamed, itchy, or sun-stressed, kitchen ingredients can offer immediate comfort.

Ingredients:
- 2 tbsp finely ground colloidal oats
- 1 tbsp raw unpasteurized honey
- 1 tbsp plain Greek yoghurt or rosewater

Mix into a smooth paste. Oats contain beta-glucan and avenanthramides that suppress inflammation, while honey provides natural humectant and antibacterial healing. Apply for 15 minutes, then rinse gently with lukewarm water.`,
      imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
      popular: false,
    },
    {
      title: 'How to Layer Actives Without Damaging Your Skin Barrier',
      category: 'Articles',
      content: `More actives do not mean faster results. Mixing too many active ingredients can trigger contact dermatitis and barrier destruction.

Key Pairing Rules:
- Vitamin C + SPF: Perfect morning power duo for free radical protection.
- Retinol + Ceramides: Nighttime gold standard. Buffer retinol with a ceramide moisturizer.
- DON'T combine Retinol with AHA/BHA in the same night routine; alternate evenings instead.
- Niacinamide plays well with virtually everything, especially Hyaluronic Acid and Salicylic Acid.`,
      imageUrl: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80',
      popular: true,
    },
    {
      title: '5 Lip Care Secrets for Soft, Non-Flaking Lips All Year',
      category: 'Articles',
      content: `Unlike the rest of your skin, lips do not possess oil glands, making them vulnerable to moisture evaporation.

1. Avoid licking your lips—salivary enzymes actually break down delicate lip tissue.
2. Apply hyaluronic acid to damp lips, then immediately seal with a thick peptide butter.
3. Exfoliate only once weekly using brown sugar and almond oil.
4. Wear an SPF 30 lip balm during outdoor daylight hours.
5. Run an ultrasonic humidifier in your bedroom during dry winter nights.`,
      imageUrl: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=800&q=80',
      popular: false,
    },
    {
      title: 'Rice Water Rinse for High-Shine, Glossy Hair',
      category: 'Haircare',
      content: `Fermented rice water has been treasured for centuries across Asian cultures for strengthening the hair cortex. Rice water is rich in inositol, a carbohydrate that penetrates damaged hair and repairs it from the inside out even after rinsing.

Rinse organic rice, soak in water for 24 hours until slightly fermented, strain, and pour through freshly shampooed hair. Massage for 5 minutes before applying conditioner.`,
      imageUrl: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=800&q=80',
      popular: false,
    },
    {
      title: 'Dewy Cloud Skin: The Trend That Combines Matte & Radiant',
      category: 'Makeup',
      content: `Cloud skin is the sophisticated sister of glass skin. Instead of wet, high-shine reflective skin, cloud skin looks softly diffused, like sunlight filtering through morning clouds.

Apply a hydrating primer, follow with a skin tint, and use translucent setting powder ONLY on the center of the forehead, sides of the nose, and chin while leaving your cheekbones naturally radiant.`,
      imageUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80',
      popular: true,
    },
  ];

  for (const tip of tipsData) {
    await prisma.beautyTip.create({ data: tip });
  }
  console.log(`💡 Created ${tipsData.length} beauty tips & tutorials.`);

  console.log('✅ GlowUp Database Seeding Completed Successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
