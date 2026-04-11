/**
 * HowTo Schema Generator for Product Care Instructions
 *
 * Generates Schema.org HowTo structured data for product care guides.
 * Optimized for GEO (AI search) citation readiness.
 *
 * Example output:
 * {
 *   "@context": "https://schema.org",
 *   "@type": "HowTo",
 *   "name": "How to Clean and Maintain a Coconut Bowl",
 *   "description": "Step-by-step guide to clean and maintain your handcrafted coconut bowl",
 *   "totalTime": "PT5M",
 *   "step": [
 *     { "@type": "HowToStep", "text": "Rinse the bowl with warm water after each use..." }
 *   ]
 * }
 */

export interface HowToStep {
  text: string
  image?: string
  name?: string
}

export interface HowToSchema {
  "@context": "https://schema.org"
  "@type": "HowTo"
  name: string
  description: string
  totalTime: string
  step: HowToStep[]
  supply?: {
    "@type": "HowToSupply"
    name: string
  }[]
  tool?: {
    "@type": "HowToTool"
    name: string
  }[]
}

/**
 * Generate HowTo Schema for coconut bowl care
 */
export function generateCoconutBowlHowTo(): HowToSchema {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Clean and Maintain a Coconut Bowl",
    "description": "Complete step-by-step guide to clean, dry, and maintain your handcrafted coconut bowl for long-lasting use",
    "totalTime": "PT5M",
    "supply": [
      {
        "@type": "HowToSupply",
        "name": "Warm water"
      },
      {
        "@type": "HowToSupply",
        "name": "Mild dish soap"
      },
      {
        "@type": "HowToSupply",
        "name": "Coconut oil or food-safe mineral oil"
      },
      {
        "@type": "HowToSupply",
        "name": "Soft cloth or sponge"
      }
    ],
    "tool": [
      {
        "@type": "HowToTool",
        "name": "Soft drying towel"
      }
    ],
    "step": [
      {
        "@type": "HowToStep",
        "name": "Rinse After Use",
        "text": "Rinse the coconut bowl with warm water immediately after each use. This removes food residue and prevents staining."
      },
      {
        "@type": "HowToStep",
        "name": "Hand Wash Gently",
        "text": "Use a soft cloth or sponge with mild dish soap to gently clean the bowl. Avoid abrasive scrubbers that can damage the natural finish."
      },
      {
        "@type": "HowToStep",
        "name": "Air Dry Completely",
        "text": "Place the bowl upside down on a drying rack or towel. Allow it to air dry completely before storing. Never leave water sitting in the bowl."
      },
      {
        "@type": "HowToStep",
        "name": "Monthly Oil Treatment",
        "text": "Once a month (or when the bowl looks dry), apply a small amount of coconut oil or food-safe mineral oil to the entire surface. Rub gently with a soft cloth and let it absorb overnight."
      },
      {
        "@type": "HowToStep",
        "name": "Store Properly",
        "text": "Store in a cool, dry place away from direct sunlight. Avoid extreme temperature changes that can cause cracking."
      }
    ]
  }
}

/**
 * Generate HowTo Schema for woven basket care
 */
export function generateWovenBasketHowTo(): HowToSchema {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Clean and Maintain a Woven Basket",
    "description": "Step-by-step guide to clean and preserve your handwoven pandanus basket",
    "totalTime": "PT10M",
    "supply": [
      {
        "@type": "HowToSupply",
        "name": "Soft brush or dry cloth"
      },
      {
        "@type": "HowToSupply",
        "name": "Mild soap solution (optional)"
      }
    ],
    "tool": [
      {
        "@type": "HowToTool",
        "name": "Soft-bristled brush"
      },
      {
        "@type": "HowToTool",
        "name": "Vacuum with brush attachment (optional)"
      }
    ],
    "step": [
      {
        "@type": "HowToStep",
        "name": "Dust Regularly",
        "text": "Use a soft, dry cloth or soft-bristled brush to gently remove dust from the woven surface. Pay attention to the crevices between weave patterns."
      },
      {
        "@type": "HowToStep",
        "name": "Vacuum for Deep Cleaning",
        "text": "For deeper cleaning, use a vacuum cleaner with a brush attachment on low suction. Gently move across the surface following the weave direction."
      },
      {
        "@type": "HowToStep",
        "name": "Spot Clean Stains",
        "text": "For stubborn stains, lightly dampen a cloth with mild soapy water and blot (do not rub) the affected area. Immediately dry with a clean cloth."
      },
      {
        "@type": "HowToStep",
        "name": "Air Dry Thoroughly",
        "text": "After any cleaning, place the basket in a well-ventilated area away from direct sunlight. Allow it to dry completely before use."
      },
      {
        "@type": "HowToStep",
        "name": "Store in Dry Place",
        "text": "Store in a cool, dry location. Avoid humid areas like bathrooms which can cause the natural fibers to weaken or develop mold."
      }
    ]
  }
}

/**
 * Generate HowTo Schema for shell jewelry care
 */
export function generateShellJewelryHowTo(): HowToSchema {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Clean and Store Shell Jewelry",
    "description": "Gentle cleaning and storage methods for natural shell necklaces and earrings",
    "totalTime": "PT5M",
    "supply": [
      {
        "@type": "HowToSupply",
        "name": "Lukewarm water"
      },
      {
        "@type": "HowToSupply",
        "name": "Mild soap"
      },
      {
        "@type": "HowToSupply",
        "name": "Soft lint-free cloth"
      }
    ],
    "tool": [],
    "step": [
      {
        "@type": "HowToStep",
        "name": "Prepare Cleaning Solution",
        "text": "Fill a small bowl with lukewarm water and add a drop of mild soap. Mix gently to create a mild cleaning solution."
      },
      {
        "@type": "HowToStep",
        "name": "Wipe Shell Surface",
        "text": "Dip a soft cloth in the solution and wring out excess water. Gently wipe each shell piece, following the natural contours and patterns."
      },
      {
        "@type": "HowToStep",
        "name": "Dry Immediately",
        "text": "Use a dry, lint-free cloth to immediately dry each shell piece. Ensure no moisture remains, especially around string or cord connections."
      },
      {
        "@type": "HowToStep",
        "name": "Store Separately",
        "text": "Store shell jewelry in a soft pouch or separate compartment to prevent scratching. Avoid hanging necklaces for long periods to prevent cord stretching."
      },
      {
        "@type": "HowToStep",
        "name": "Avoid Chemicals",
        "text": "Remove shell jewelry before swimming, showering, or applying perfumes and lotions. Salt water, chlorine, and chemicals can damage the natural shell surface."
      }
    ]
  }
}

/**
 * Get HowTo Schema by product handle
 */
export function getHowToByHandle(handle: string): HowToSchema | null {
  const handleMap: Record<string, () => HowToSchema> = {
    'samoan-handcrafted-coconut-bowl': generateCoconutBowlHowTo,
    'samoan-handwoven-grass-tote-bag': generateWovenBasketHowTo,
    'samoan-woven-basket': generateWovenBasketHowTo,
    'samoan-handcrafted-shell-necklace': generateShellJewelryHowTo,
    'artisan-alloy-shell-earrings': generateShellJewelryHowTo,
    'polynesian-shell-necklace': generateShellJewelryHowTo,
  }

  const generator = handleMap[handle]
  return generator ? generator() : null
}
