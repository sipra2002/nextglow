function calculateSkinType(answers) {
  const score = { NORMAL: 0, DRY: 0, OILY: 0, COMBINATION: 0, SENSITIVE: 0 };
  
  if (answers && typeof answers === 'object') {
    Object.values(answers).forEach((points) => {
      if (typeof points === 'object' && points !== null) {
        for (const type in points) {
          if (score[type] !== undefined) {
            score[type] += Number(points[type]) || 0;
          }
        }
      }
    });
  }

  if (score.SENSITIVE >= 3) return 'SENSITIVE';
  return Object.keys(score).reduce((a, b) => (score[a] >= score[b] ? a : b));
}

const skinSuggestions = {
  NORMAL: {
    title: 'Balanced & Radiant',
    description: 'Your skin maintains an ideal moisture and sebum balance with smooth texture and minimal blemishes.',
    dos: [
      'Maintain your healthy barrier with daily broad-spectrum SPF 50',
      'Use antioxidant serums like Vitamin C in the morning',
      'Keep hydration consistent with lightweight hyaluronic acid'
    ],
    donts: [
      'Avoid over-cleansing with high pH soaps',
      'Don’t neglect nighttime moisturization'
    ],
    ingredients: ['Hyaluronic Acid', 'Niacinamide', 'Vitamin C', 'Ceramides']
  },
  DRY: {
    title: 'Deep Hydration & Barrier Repair',
    description: 'Your skin produces less sebum than normal, leading to tightness, flakiness, and a compromised moisture barrier.',
    dos: [
      'Use hydrating, creamy milk or lotion cleansers',
      'Apply humectants (Glycerin, Hyaluronic Acid) on damp skin',
      'Lock in moisture with ceramide-rich creams and facial oils'
    ],
    donts: [
      'Avoid harsh foaming sulfates and hot water showers',
      'Avoid alcohol-based toners or drying astringents'
    ],
    ingredients: ['Ceramides', 'Glycerin', 'Hyaluronic Acid', 'Shea Butter', 'Squalane']
  },
  OILY: {
    title: 'Clarifying & Sebum Regulation',
    description: 'Your sebaceous glands are overactive, causing visible shine, enlarged pores, and congestion.',
    dos: [
      'Cleanse twice daily with gentle salicylic acid or foaming gel',
      'Use oil-free gel or water-based moisturizers',
      'Use Niacinamide and Zinc PCA to balance oil production'
    ],
    donts: [
      'Don’t skip moisturizer—dehydrated oily skin compensates by producing more oil!',
      'Avoid heavy comedogenic oils like coconut oil'
    ],
    ingredients: ['Salicylic Acid (BHA)', 'Niacinamide', 'Zinc PCA', 'Green Tea Extract']
  },
  COMBINATION: {
    title: 'Harmonizing & Zone Care',
    description: 'You have an oily T-zone (forehead, nose, chin) alongside normal or dry cheeks.',
    dos: [
      'Use a gentle balancing gel cleanser',
      'Zone-treat: apply lightweight fluids on T-zone and nourishing cream on cheeks',
      'Use mild BHA on the T-zone to keep pores clean'
    ],
    donts: [
      'Avoid one-size-fits-all ultra-rich creams on your forehead/nose',
      'Avoid harsh stripping agents that irritate dry zones'
    ],
    ingredients: ['Niacinamide', 'Hyaluronic Acid', 'Centella Asiatica', 'Salicylic Acid']
  },
  SENSITIVE: {
    title: 'Soothing & Calming Defense',
    description: 'Your skin barrier reacts easily to external irritants, resulting in redness, tingling, and sensitivity.',
    dos: [
      'Opt for fragrance-free, hypoallergenic, minimal-ingredient formulas',
      'Strengthen skin resilience with Panthenol, Oat Extract, and Centella',
      'Always patch test new products before full application'
    ],
    donts: [
      'Avoid artificial fragrances, essential oils, and high-strength acids',
      'Avoid rough physical exfoliants and harsh washcloths'
    ],
    ingredients: ['Centella Asiatica (Cica)', 'Allantoin', 'Colloidal Oat', 'Ceramides', 'Panthenol']
  }
};

module.exports = { calculateSkinType, skinSuggestions };
