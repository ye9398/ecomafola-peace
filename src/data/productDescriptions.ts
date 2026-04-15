/**
* EcoMafola Peace -
* Empowerment + Partnership
*/
export interface ProductDescription {
category: string;
handle: string;
title: string;
subtitle: string;
story: string;
environmental: string;
partnership: string;
features: string[];
specifications: {
size: string;
weight: string;
material: string;
origin: string;
care: string;
};
guarantee: string;
shipping: string;
faqs: Array<{ question: string; answer: string }>;
images?: {
story?: string;
environmental?: string;
partnership?: string;
features?: string;
specifications?: string;
guarantee?: string;
shipping?: string;
faqs?: string;
};
}
export const productDescriptions: ProductDescription[] = [
{
category: "coconut-bowls",
handle: "coconutbowl",
title: "Handcrafted Coconut Bowl",
subtitle: "Nature's Perfect Vessel, Crafted by Samoan Artisans",
story: `Every Coconut Bowl tells a story of renewal and respect for nature. Hand-carved by skilled artisans in Samoa, each bowl begins its journey as a discarded coconut shell — transformed through generations-old techniques into a vessel of beauty and purpose.\n\nOur Samoan partners have perfected this craft over decades. The process is entirely manual: cleaning, sanding, polishing with natural coconut oil, and finishing with intricate traditional patterns that honor Pacific Island heritage.\n\nNo two bowls are identical — nature's signature reminding you that you're holding something truly one-of-a-kind.`,
environmental: ` **From Waste to Wonder**\n\nEach year, millions of coconut shells are burned as agricultural waste across the Pacific. By rescuing these shells, we prevent unnecessary burning and give new life to what nature already provided.\n\n **Plastic-Free Alternative**\n\nEvery coconut bowl replaces a plastic or mass-produced alternative, preventing hundreds of disposable containers from entering landfills and oceans.\n\n **100% Biodegradable**\n\nAt the end of its long life, your coconut bowl returns to the earth completely — no microplastics, no toxins.`,
partnership: ` **Fair Trade, Direct Partnership**\n\nWe partner with Samoan artisans as equals. Every bowl purchased directly supports:\n- Fair wages paid upfront\n- Skills preservation for traditional carving techniques\n- Community investment in local tools and workspace\n- Intergenerational knowledge transfer from elders to youth\n\n **Transparent Revenue Sharing**\n\n60% of every sale goes directly to our artisan partners in Samoa. When you pay $25 for a bowl, $15 goes straight to the hands that crafted it.`,
features: [
" Unique Natural Patterns - No two bowls are alike",
" 100% Organic Coconut Shell - Zero synthetic materials",
" Hand-Polished Finish - Smooth, food-safe surface",
" Durable & Long-Lasting - Properly cared for, lasts decades",
" Food-Safe Certified - Safe for hot and cold foods",
" Water-Resistant - Naturally repels moisture when oiled"
],
specifications: {
size: "Approximately 5 inches (13cm) diameter × 2.4 inches (6cm) height",
weight: "Approximately 0.3 lbs (140g)",
material: "100% natural coconut shell, polished with virgin coconut oil",
origin: "Handcrafted in Apia, Samoa by local artisan partners",
care: "Hand wash only with mild soap. Air dry completely. Reapply coconut oil monthly. Avoid dishwasher and microwave."
},
guarantee: `Lifetime Craftsmanship Guarantee

We stand behind the quality and integrity of every handcrafted piece. If your coconut bowl ever cracks, splits, or breaks due to craftsmanship issues — even years down the road — we'll replace it free of charge.

This guarantee reflects our commitment to honoring the relationship between you, the artisan who created it, and nature itself. Each piece is inspected before shipping to ensure it meets our high standards.

Should any issue arise, simply reach out to our support team. We'll guide you through a hassle-free replacement process, because your satisfaction and trust mean everything to us.`,
shipping: `**Fast, Carbon-Conscious Shipping**\n\n Processing Time: Orders ship within 24 hours from our Samoa warehouse\n\n Delivery Times:\n- Australia & New Zealand: 2-5 business days\n- United States & Canada: 5-8 business days\n- United Kingdom & Europe: 7-10 business days\n- Asia Pacific: 3-7 business days\n\n Carbon Offset: Every shipment includes carbon offset credits\n Tracking: All orders include full tracking via DHL Express`,
faqs: [
{ question: "Is the bowl safe for hot foods and liquids?", answer: "Yes! Coconut bowls are completely safe for hot foods like soups, curries, and smoothie bowls. However, avoid microwaving as extreme direct heat can cause cracking over time." },
{ question: "How do I clean and maintain my bowl?", answer: "Simply hand wash with warm soapy water after each use and air dry completely. Once a month, rub a small amount of coconut oil on the surface to restore shine. Never put in dishwasher." },
{ question: "Are the bowls all the same size?", answer: "Since each bowl is made from a natural coconut shell, there will be slight variations in size (±0.5 inches) and shape. This uniqueness is part of the charm!" }
],
images: {
story: "/product-images/coconutbowl-v5/product-story.jpg",
environmental: "/product-images/coconutbowl-v5/eco-value.jpg",
partnership: "/product-images/coconutbowl-v5/partnership-model.jpg",
features: "/product-images/coconutbowl-v5/product-features.jpg",
specifications: "/product-images/coconutbowl-v5/specifications.jpg",
guarantee: "/product-images/coconutbowl-v5/quality-assurance.jpg",
shipping: "/product-images/coconutbowl-v5/shipping-info.jpg",
faqs: "/product-images/coconutbowl-v5/faq.jpg"
}
},
{
category: "woven-baskets",
handle: "wovenbasket",
title: "Traditional Woven Basket",
subtitle: "Woven with Pandanus Leaves by Samoan Master Weavers",
story: `For centuries, Samoan women have passed down the art of weaving from mother to daughter. Our baskets are crafted using pandanus leaves harvested from coastal villages, following techniques unchanged for generations.\n\nThe weaving process is meditative and meticulous. Each leaf is dried, dyed with natural plant-based colors, split into fine strips, and woven into intricate geometric patterns that tell stories of family lineage and island life. A single basket can take 3-5 days to complete.\n\nMaster weaver Leilani, who leads our artisan collective in Savai'i, learned to weave at age 7 from her grandmother. Today, she teaches 15 younger women in her village.`,
environmental: ` **Sustainable Plant Materials**\n\nPandanus leaves grow abundantly along Samoa's coastlines and regenerate quickly. No trees are cut down — only fallen or mature leaves are collected.\n\n **Natural Dyes Only**\n\nAll colors come from traditional plant sources: turmeric (yellow), hibiscus flowers (pink/red), indigo leaves (blue). Zero synthetic chemicals.\n\n **Fully Biodegradable**\n\nAt the end of its useful life, your basket decomposes naturally, returning nutrients to the soil.`,
partnership: `‍ **Women-Led Artisan Collective**\n\nOur basket weaving program is 100% women-owned and operated. Every weaver receives:\n- Base payment per completed basket (fair wage, paid upfront)\n- Profit-sharing dividends quarterly\n- Leadership opportunities to train apprentices\n- Childcare support enabling flexible work\n\n **Direct Trade Model**\n\nWe eliminate middlemen entirely. Payments go straight to the weaving collective's bank account in Apia with transparent accounting.`,
features: [
" Handwoven by Master Artisans - Decades of expertise",
" 100% Natural Pandanus Leaves - Sustainably harvested",
" Traditional Geometric Patterns - Cultural meaning",
" Reinforced Construction - Double-woven for durability",
" Versatile Storage - Fruits, blankets, toys, or decor",
" Natural Plant-Based Dyes - Vibrant without chemicals"
],
specifications: {
size: "Small: 8\" dia × 4\" H | Medium: 12\" dia × 6\" H | Large: 16\" dia × 8\" H",
weight: "Varies: Small 0.4 lbs, Medium 0.8 lbs, Large 1.2 lbs",
material: "100% natural pandanus leaves, plant-based dyes",
origin: "Handwoven in Savai'i and Upolu islands, Samoa",
care: "Dust regularly with soft brush. Avoid prolonged moisture. Store in dry place. Not waterproof."
},
guarantee: `**Artisan Quality Promise**\n\nWe guarantee your woven basket against defects in craftsmanship for 2 years. If seams unravel, handles break, or weaving fails under normal use, we'll repair or replace it free of charge.\n\nAfter 2 years, we offer discounted repair services through our artisan collective.`,
shipping: `**Careful Packaging for Delicate Items**\n\n Processing: Ships within 24-48 hours with biodegradable padding\n\n Delivery Times:\n- Australia & NZ: 2-5 days\n- US & Canada: 5-8 days\n- UK & Europe: 7-10 days\n- Asia Pacific: 3-7 days\n\n Flat-Rate Shipping: $8.95 worldwide for baskets\n Tracking Included: Full DHL tracking`,
faqs: [
{ question: "Can I use this basket outdoors?", answer: "While pandanus is durable, we recommend indoor use or covered outdoor areas. Prolonged exposure to rain or direct sunlight may cause fading." },
{ question: "How do I clean my woven basket?", answer: "Use a soft, dry brush to remove dust. For stuck-on debris, lightly dampen a cloth and gently wipe. Never submerge in water." },
{ question: "Can I order custom sizes or patterns?", answer: "Yes! For bulk orders (10+ pieces), contact us with your specifications and we'll coordinate with the weaving collective for a quote." }
],
images: {
story: "/product-images/wovenbasket-v5/product-story.jpg",
environmental: "/product-images/wovenbasket-v5/eco-value.jpg",
partnership: "/product-images/wovenbasket-v5/partnership-model.jpg",
features: "/product-images/wovenbasket-v5/product-features.jpg",
specifications: "/product-images/wovenbasket-v5/specifications.jpg",
guarantee: "/product-images/wovenbasket-v5/quality-assurance.jpg",
shipping: "/product-images/wovenbasket-v5/shipping-info.jpg",
faqs: "/product-images/wovenbasket-v5/faq.jpg"
}
},
{
category: "beach-bags",
handle: "beachbag",
title: "Handwoven Beach Bag",
subtitle: "Spacious Pandanus Tote for Sun & Sand Adventures",
story: `Designed for coastal living, our handwoven beach bag combines traditional Samoan weaving techniques with modern beach-day functionality. Each bag is crafted by master weavers who have perfected their art over generations.\n\nThe extra-large design easily accommodates beach towels, sunscreen, water bottles, and all your seaside essentials. The open-weave pattern allows sand to fall through naturally, while the reinforced handles support heavy loads without stretching.\n\nMaster weaver Sina, who leads our beach bag collective in Falease'ela, developed the signature diamond weave pattern specifically for beach use — tight enough to hold small items, yet breathable enough to dry quickly after ocean dips.`,
environmental: ` **Sustainable Pandanus Harvesting**\n\nPandanus leaves are collected from coastal groves without harming the plants. Only mature leaves are harvested, allowing natural regeneration.\n\n **Natural & Biodegradable**\n\nUnlike synthetic beach bags made from petroleum-based materials, our pandanus bags decompose naturally at end of life — no microplastics, no environmental guilt.\n\n **Ocean-Safe Production**\n\nNo chemical treatments, no synthetic dyes, no plastic coatings. What touches the ocean is 100% natural and ocean-safe.`,
partnership: ` **Coastal Artisan Collective**\n\nOur beach bag program employs 14 weavers from coastal villages. Each artisan receives:\n- Fair piece-rate compensation per completed bag\n- Quarterly bonuses for quality excellence\n- Flexible schedules accommodating fishing seasons\n- Access to design workshops for skill development\n\n **Community Investment**\n\n15% of beach bag sales fund coastal cleanup initiatives in our partner villages, keeping Samoa's beaches pristine for future generations.`,
features: [
" Extra-Large Capacity - Fits towels, bottles, and beach gear",
" Sand-Through Weave - Natural drainage, easy shake-out",
" Quick-Dry Material - Pandanus dries faster than cotton",
" Reinforced Handles - Triple-woven for heavy loads",
" Lightweight & Foldable - Packs flat in luggage",
" Saltwater-Resistant - Naturally withstands ocean exposure"
],
specifications: {
size: "20\" width × 16\" height × 6\" depth | Handle drop: 12\"",
weight: "Approximately 0.8 lbs (360g)",
material: "100% natural pandanus leaves, cotton thread reinforcement",
origin: "Handwoven in Falease'ela village, Savai'i island, Samoa",
care: "Rinse with fresh water after beach use. Air dry in shade. Do not machine wash."
},
guarantee: `**Beach-Ready Guarantee**\n\nWe guarantee your beach bag against weaving defects and handle failure for 2 years. If seams unravel or handles break under normal beach use, we'll repair or replace it free.\n\nNatural wear from sand and saltwater exposure is expected and adds character to your bag.`,
shipping: `**Flat-Pack Shipping**\n\n Processing: Orders ship within 24 hours, flattened for efficient packaging\n\n Delivery Times:\n- Australia & NZ: 2-5 days\n- US & Canada: 5-8 days\n- UK & Europe: 7-10 days\n- Asia Pacific: 3-7 days\n\n Eco-Packaging: Shipped in compostable mailers with zero plastic`,
faqs: [
{ question: "Will sand get stuck in the weave?", answer: "The open-weave design actually allows sand to fall through naturally. A quick shake removes most sand, and rinsing with fresh water clears the rest." },
{ question: "Can this bag get wet?", answer: "Absolutely! Pandanus is naturally water-resistant and dries quickly. Just rinse with fresh water after saltwater exposure and air dry." },
{ question: "How much weight can it hold?", answer: "Tested to safely carry up to 25 lbs (11 kg) — perfect for beach towels, coolers, umbrellas, and all your beach day essentials." }
],
images: {
story: "/product-images/coconutbowl-v5/product-story.jpg",
environmental: "/product-images/coconutbowl-v5/eco-value.jpg",
partnership: "/product-images/coconutbowl-v5/partnership-model.jpg",
features: "/product-images/coconutbowl-v5/product-features.jpg",
specifications: "/product-images/coconutbowl-v5/specifications.jpg",
guarantee: "/product-images/coconutbowl-v5/quality-assurance.jpg",
shipping: "/product-images/coconutbowl-v5/shipping-info.jpg",
faqs: "/product-images/coconutbowl-v5/faq.jpg"
}
},
{
category: "home-decor",
handle: "doormat",
title: "Natural Coir Doormat",
subtitle: "Coconut Fiber Welcome Mat, Handwoven by Samoan Artisans",
story: `Our natural coir doormats transform coconut husk fibers — a traditional agricultural byproduct — into durable, beautiful welcome mats that honor both function and heritage.\n\nCoconut coir has been used throughout the Pacific for centuries due to its remarkable durability and natural resistance to moisture and pests. Our artisans collect husks from local coconut groves, extract the fibers through traditional retting methods, and hand-spin them into thick, resilient strands.\n\nThe weaving process creates a naturally abrasive surface that effectively scrapes dirt and debris from shoes, while the dense construction ensures years of daily use. Master weaver Paulo has been crafting coir mats for over 30 years, perfecting the tight weave pattern that defines our signature quality.`,
environmental: ` **Upcycled Coconut Waste**\n\nCoconut husks are typically burned as agricultural waste. By utilizing these fibers, we prevent unnecessary burning and give new purpose to what would be discarded.\n\n **100% Biodegradable**\n\nAt end of life, your coir mat can be composted or left to decompose naturally — no synthetic materials, no landfill persistence.\n\n **Natural Pest Resistance**\n\nCoconut coir naturally repels dust mites, mold, and common household pests without chemical treatments.`,
partnership: ` **Husker & Weaver Cooperative**\n\nOur doormat program supports a cooperative of 10 families who handle every step from husk collection to final weaving. Each family receives:\n- Fair compensation per kilogram of fiber processed\n- Additional premium for finished woven mats\n- Equipment stipends for maintaining tools\n- Healthcare contributions for all family members\n\n **Skills Preservation**\n\nWe sponsor apprenticeship programs where master weavers teach traditional coir processing and weaving techniques to younger generations.`,
features: [
" Heavy-Duty Construction - Withstands high-traffic entryways",
" Natural Dirt Scraper - Coarse fibers effectively clean shoes",
" Moisture-Resistant - Naturally repels water and humidity",
" Non-Slip Backing - Optional rubber backing for stability",
" Weather-Resistant - Suitable for covered outdoor use",
" Easy Maintenance - Shake or vacuum to clean"
],
specifications: {
size: "Standard: 18\" × 30\" | Large: 24\" × 36\" | Custom sizes available",
weight: "Standard: 2.5 lbs | Large: 4.0 lbs",
material: "100% natural coconut coir fiber, optional rubber backing",
origin: "Handwoven in Leulumoega village, Upolu island, Samoa",
care: "Shake regularly or vacuum to remove dirt. Hose down for deep cleaning. Air dry completely. Avoid prolonged direct sunlight."
},
guarantee: `**Durability Promise**\n\nWe guarantee your coir doormat against premature wear and weaving failure for 3 years. If the mat falls apart or fibers shed excessively under normal use, we'll replace it free.\n\nNatural fiber shedding in the first few weeks is normal and will decrease with use.`,
shipping: `**Flat-Ship Packaging**\n\n Processing: Orders ship within 24-48 hours, rolled for efficient packaging\n\n Delivery Times:\n- Australia & NZ: 2-5 days\n- US & Canada: 5-8 days\n- UK & Europe: 7-10 days\n- Asia Pacific: 3-7 days\n\n Rubber Backing Option: Add non-slip rubber backing for +$5`,
faqs: [
{ question: "How do I clean my coir doormat?", answer: "Simply shake it out regularly or vacuum on a low setting. For deep cleaning, hose it down and let it air dry completely before placing it back." },
{ question: "Will this mat shed fibers?", answer: "Some initial shedding is normal for natural coir mats. This will decrease significantly after the first few weeks of use. Vacuum or sweep around the mat during this period." },
{ question: "Can I use this outdoors?", answer: "Yes! Coir is naturally weather-resistant. However, we recommend covered outdoor areas (porches, entryways) to extend the mat's lifespan. Prolonged direct sun may cause fading." }
],
images: {
story: "/product-images/wovenbasket-v5/product-story.jpg",
environmental: "/product-images/wovenbasket-v5/eco-value.jpg",
partnership: "/product-images/wovenbasket-v5/partnership-model.jpg",
features: "/product-images/wovenbasket-v5/product-features.jpg",
specifications: "/product-images/wovenbasket-v5/specifications.jpg",
guarantee: "/product-images/wovenbasket-v5/quality-assurance.jpg",
shipping: "/product-images/wovenbasket-v5/shipping-info.jpg",
faqs: "/product-images/wovenbasket-v5/faq.jpg"
}
},
{
category: "natural-soaps",
handle: "naturalsoap",
title: "Samoan Virgin Coconut Oil Soap",
subtitle: "Cold-Pressed with Traditional Botanical Infusions",
story: `In the lush villages of Samoa, the art of soap-making blends ancient Polynesian botanical knowledge with time-honored saponification techniques. Our soaps are crafted in small batches by artisan soap-makers who learned their craft from family elders.\n\nThe base is pure, cold-pressed virgin coconut oil — the same oil used traditionally for healing and cleansing across the Pacific Islands. To this foundation, master soap-makers add infusions of local plants: noni fruit enzymes, moringa leaf powder, turmeric root extract, and frangipani flower essential oils.\n\nEach batch is poured into wooden molds, cut by hand, and cured for 6 weeks to achieve the perfect balance of hardness and lather.`,
environmental: ` **Zero-Waste Coconut Sourcing**\n\nOur coconut oil is extracted from meat that would otherwise be discarded after water extraction. We utilize 100% of each coconut.\n\n **Biodegradable Formula**\n\nEvery ingredient breaks down safely in water systems. Unlike commercial soaps containing microplastics, our formula is greywater-safe and ocean-friendly.\n\n **Plastic-Free Packaging**\n\nSoaps are wrapped in compostable paper bands and shipped in recycled cardboard boxes. Zero plastic.`,
partnership: ` **Village Cooperative Model**\n\nOur soap is produced by a cooperative of 12 families in Falealupo village. Each family receives:\n- Guaranteed minimum price per bar\n- Quarterly profit-sharing based on sales volume\n- Health insurance contributions\n- Education scholarships for artisans' children\n\n **Business Skills Training**\n\nBeyond crafting, artisans receive training in quality control, inventory management, and financial literacy.`,
features: [
" 100% Natural Ingredients - No sulfates, parabens, or synthetic fragrances",
" Virgin Coconut Oil Base - Deeply moisturizing and antimicrobial",
" Botanical Infusions - Noni, moringa, turmeric, frangipani",
" Cold-Process Method - Preserves beneficial glycerin naturally",
" Gentle for Sensitive Skin - pH-balanced, hypoallergenic",
" Hand-Cut & Hand-Stamped - Each bar is unique"
],
specifications: {
size: "Each bar: 3.5 oz (100g), approximately 3.5\" × 2.5\" × 1\"",
weight: "3.5 oz (100g) per bar. Sets available in 3-bar and 6-bar packs.",
material: "Saponified virgin coconut oil, noni extract, moringa powder, turmeric, frangipani essential oil",
origin: "Handcrafted in Falealupo village, Savai'i island, Samoa",
care: "Store in cool, dry place. Use soap dish with drainage. Avoid direct sunlight."
},
guarantee: `**30-Day Satisfaction Guarantee**\n\nWe're confident you'll love how our coconut oil soap feels on your skin. If you're not completely satisfied within 30 days, return the unused portion for a full refund — no questions asked.\n\nFor quality issues, we offer immediate replacement plus return shipping coverage.`,
shipping: `**Temperature-Controlled Shipping**\n\n Processing: Soaps cure for 6 weeks before shipping. Orders dispatch within 48 hours.\n\n Climate Protection: During summer months, shipped with insulated liners to prevent melting.\n\n Delivery Times:\n- Australia & NZ: 2-5 days\n- US & Canada:5-8 days\n- UK & Europe: 7-10 days\n- Asia Pacific: 3-7 days\n\n Gift Sets Available: Beautiful gift boxes with 3 or 6 bars`,
faqs: [
{ question: "Is this soap suitable for facial cleansing?", answer: "Yes! Our coconut oil soap is gentle enough for face and body. However, if you have very oily or acne-prone skin, start with patch testing." },
{ question: "How long does one bar last?", answer: "With daily use, one3.5oz bar typically lasts 3-4 weeks. To maximize lifespan, store on a draining soap dish between uses." },
{ question: "Does the soap contain lye?", answer: "All true soaps require lye for saponification. However, no lye remains in the finished product — it's completely consumed in the chemical reaction." }
],
images: {
story: "/product-images/naturalsoap-story.jpg",
environmental: "/product-images/naturalsoap-environmental.jpg",
partnership: "/product-images/naturalsoap-partnership.jpg",
features: "/product-images/naturalsoap-features.jpg",
specifications: "/product-images/naturalsoap-specifications.jpg",
guarantee: "/product-images/naturalsoap-guarantee.jpg",
shipping: "/product-images/naturalsoap-shipping.jpg",
faqs: "/product-images/naturalsoap-faqs.jpg"
}
},
{
category: "woven-baskets",
handle: "woven-tote",
title: "Handwoven Pandanus Tote Bag",
subtitle: "Eco-Friendly Market Bag Crafted by Samoan Weavers",
story: `The pandanus tote bag represents the evolution of traditional Samoan weaving into modern, functional art. Originally designed as market bags for carrying fresh produce from village gardens, these totes have been refined by our artisan collective to meet contemporary needs while preserving cultural authenticity.\n\nEach tote begins with the selection of premium pandanus leaves from coastal groves. After harvesting, leaves are sun-dried for 5-7 days until they achieve the perfect flexibility. The weaving process, led by master weaver Malia, creates a tight, durable weave pattern specifically engineered to support heavy loads without stretching.\n\nThe reinforced handles are woven separately using a triple-layer technique for extra strength — a signature innovation developed by our collective. A single tote requires 3-4 days of dedicated weaving.`,
environmental: ` **Zero-Waste Harvesting**\n\nPandanus leaves are harvested sustainably — only mature leaves are collected, allowing plants to regenerate naturally. No trees are ever cut down.\n\n **Natural Pigments Only**\n\nColors are derived from traditional Samoan dye sources: annatto seeds (orange), turmeric root (yellow), and hibiscus petals (pink). No synthetic dyes, no chemical fixatives.\n\n **Completely Biodegradable**\n\nYour tote will decompose naturally if discarded, returning to the earth without leaving microplastics or toxic residue. Unlike synthetic bags that persist for centuries.`,
partnership: `‍ **Women-Run Cooperative**\n\nOur tote weaving program is led by a women's cooperative of 18 artisans in Apia. Every weaver receives:\n- Guaranteed minimum wage per completed tote\n- Performance bonuses for quality excellence\n- Access to international design workshops\n- Healthcare coverage for themselves and their families\n\n **Empowerment Through Enterprise**\n\nBeyond fair pay, we provide business training and leadership development. Three of our current team leaders started as apprentice weavers just 5 years ago.`,
features: [
" Extra-Capacity Design - Holds up to 20 lbs comfortably",
" Premium Pandanus Fibers - Stronger than conventional weaving",
" Customizable Patterns - Choose from 6 traditional designs",
" Triple-Reinforced Handles - Tested for heavy grocery loads",
" Foldable & Lightweight - Fits in purse when not in use",
" Hand-Finished Edges - Professional double-stitching"
],
specifications: {
size: "18\" width × 14\" height × 4\" depth | Handle drop: 10\"",
weight: "Approximately 0.6 lbs (270g)",
material: "100% natural pandanus leaves, cotton thread reinforcement",
origin: "Handwoven in Apia, Upolu island, Samoa",
care: "Spot clean with damp cloth. Air dry away from direct sun. Do not machine wash."
},
guarantee: `**Weaver's Promise**\n\nWe stand behind every stitch. If your tote bag shows any signs of premature wear, handle separation, or weaving failure within 3 years of normal use, we'll repair it free or send a replacement.\n\nThis guarantee honors both our commitment to quality and the skill of the artisans who created it.`,
shipping: `**Protective Packaging for Woven Goods**\n\n Processing: Orders ship within 24 hours, packed in compostable mailers\n\n Delivery Times:\n- Australia & NZ: 2-5 days\n- US & Canada: 5-8 days\n- UK & Europe: 7-10 days\n- Asia Pacific: 3-7 days\n\n Carbon Neutral: All shipments offset through Pacific reforestation projects\n Real-time tracking provided via email`,
faqs: [
{ question: "How much weight can this tote actually hold?", answer: "Tested to safely carry up to 20 lbs (9 kg). The triple-reinforced handles and tight weave pattern distribute weight evenly across the entire bag." },
{ question: "Will the colors fade over time?", answer: "Natural dyes may soften slightly with extended sun exposure, which adds character. To preserve vibrancy, store away from direct sunlight when not in use." },
{ question: "Can I get this bag in a custom size?", answer: "For orders of 5+ bags, we can coordinate custom dimensions with our weaving collective. Contact us with your requirements for a quote." }
],
images: {
story: "/product-images/woventote-story.jpg",
environmental: "/product-images/woventote-environmental.jpg",
partnership: "/product-images/woventote-partnership.jpg",
features: "/product-images/woventote-features.jpg",
specifications: "/product-images/woventote-specifications.jpg",
guarantee: "/product-images/woventote-guarantee.jpg",
shipping: "/product-images/woventote-shipping.jpg",
faqs: "/product-images/woventote-faqs.jpg"
}
},
{
category: "jewelry-accessories",
handle: "shell-necklace",
title: "Samoa Handmade Shell Necklace",
subtitle: "Traditional Ocean Treasures, Polished by Local Artisans",
story: `For generations, Samoan artisans have gathered shells from pristine beaches and coral reefs, transforming them into wearable art that carries the spirit of the Pacific Ocean. Our shell necklaces follow ancestral techniques passed down through matrilineal lines.\n\nThe collection begins at dawn — artisans wade into crystal-clear waters to carefully select shells that have naturally washed ashore or were harvested sustainably from shallow reefs. Each piece is cleaned, sorted by color and texture, then painstakingly drilled by hand using traditional stone tools.\n\nMaster craftswoman Aisha has been making shell jewelry for over 40 years. Her workshop in Fagali'i produces fewer than 20 necklaces per week, ensuring every strand meets her exacting standards.`,
environmental: ` **Sustainable Shell Collection**\n\nWe only use shells that are naturally shed or washed ashore — never taken from living organisms. Our artisans follow strict guidelines to protect marine ecosystems.\n\n **Ocean Conservation Partnership**\n\n10% of all necklace sales fund coral reef restoration projects in Samoa. We've helped replant over 5,000 coral fragments since 2022.\n\n **Zero Chemical Processing**\n\nShells are cleaned using only fresh water and natural brushes. No bleaching, no acids, no synthetic polishes. What you see is nature's original beauty.`,
partnership: ` **Artisan-Led Production**\n\nAisha's workshop employs 8 women from her extended family network. Each artisan receives:\n- Piece-rate compensation (paid weekly)\n- Year-end profit sharing based on total sales\n- Equipment stipends for maintaining tools\n- Flexible schedules accommodating family responsibilities\n\n **Cultural Preservation Initiative**\n\nWe sponsor annual workshops where master artisans teach traditional drilling and stringing techniques to young women interested in continuing this heritage craft.`,
features: [
" Authentic Pacific Shells - Each necklace is one-of-a-kind",
" Natural Color Variations - No artificial coloring",
" Hand-Drilled Perfection - Precision without power tools",
" Premium Cord Material - UV-resistant, saltwater-safe",
" Secure Lobster Clasp - Easy on/off, stays fastened",
" Adjustable Length - 18-22 inch sliding cord"
],
specifications: {
size: "Adjustable length: 18-22 inches (45-56 cm); Shell beads: 0.3-0.8 inches",
weight: "Approximately 0.15 lbs (70g)",
material: "Natural sea shells, braided nylon cord, stainless steel clasp",
origin: "Handcrafted in Fagali'i village, Upolu island, Samoa",
care: "Rinse with fresh water after ocean exposure. Store flat in dry place. Avoid perfumes and lotions."
},
guarantee: `**Ocean-to-You Guarantee**\n\nWe guarantee your shell necklace against defects in workmanship for 1 year. If the cord frays prematurely, the clasp fails, or shells crack under normal wear, we'll repair or replace it.\n\nNote: Natural variations in shell appearance are not defects — they're what make each piece unique.`,
shipping: `**Secure Packaging for Fragile Items**\n\n Processing: Orders ship within 24 hours in protective velvet pouches\n\n Delivery Times:\n- Australia & NZ: 2-5 days\n- US & Canada: 5-8 days\n- UK & Europe: 7-10 days\n- Asia Pacific: 3-7 days\n\n Gift Ready: Includes branded gift box and authenticity card\n Signature confirmation required for international orders`,
faqs: [
{ question: "Are these shells from live animals?", answer: "Absolutely not. We only collect empty shells that have been naturally shed or washed ashore. Our artisans never harvest from living creatures or damage coral reefs." },
{ question: "Can I wear this necklace while swimming?", answer: "Yes! The cord is saltwater-safe and the shells are naturally marine-grade. However, rinse with fresh water afterward and avoid chlorine pools when possible." },
{ question: "Why does my necklace look different from the photo?", answer: "Each shell is naturally unique in shape, size, and color. Your necklace will be equally beautiful but won't be identical to photos — that's the magic of handmade items!" }
],
images: {
story: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800&q=80",
environmental: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800&q=80",
partnership: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800&q=80",
features: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800&q=80",
specifications: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800&q=80",
guarantee: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800&q=80",
shipping: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800&q=80",
faqs: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800&q=80"
}
},
{
category: "home-decor",
handle: "tapa-cloth",
title: "Traditional Tapa Cloth Wall Art",
subtitle: "Centuries-Old Bark Fabric Techniques, Modern Design Application",
story: `Tapa cloth represents one of Oceania's oldest textile traditions, dating back over 3,000 years. Made from the inner bark of the paper mulberry tree, this distinctive fabric was once reserved for ceremonial occasions and royal gatherings throughout the Pacific.\n\nOur tapa artisans practice a nearly extinct craft. The process begins with cultivating paper mulberry trees, then carefully harvesting and steaming the bark. The inner layer is scraped, beaten with four-sided wooden mallets, and felted into sheets. Finally, traditional geometric patterns are stamped using carved wooden blocks dipped in natural dyes.\n\nMaster printer Tui has spent 35 years perfecting this art. His family's patterns have been documented by the Samoa National Museum as culturally significant heritage designs.`,
environmental: ` **Sustainable Tree Cultivation**\n\nPaper mulberry trees grow rapidly and regenerate after harvesting. We maintain a dedicated grove where trees are rotated annually — always leaving sufficient growth for ecological balance.\n\n **Plant-Based Dyes Only**\n\nAll colors come from traditional sources: candlenut soot (black), turmeric (yellow), clay minerals (red-brown), and berry extracts (purple). Zero synthetic chemicals enter our workshop.\n\n **Long-Life Artwork**\n\nProperly cared for, tapa wall art can last generations. By creating heirloom-quality pieces, we reduce demand for mass-produced, short-lived decorations.`,
partnership: ` **Cultural Heritage Preservation**\n\nOur tapa program supports 6 master artisans and 12 apprentices. Compensation includes:\n- Base salary plus piece-rate bonuses\n- Annual cultural exchange trips to other Pacific islands\n- Documentation fees for pattern archiving\n- Retirement savings contributions\n\n **Knowledge Transfer Program**\n\nWe've partnered with the University of the South Pacific to document traditional techniques. Apprentices receive formal training alongside hands-on experience, ensuring these skills survive for future generations.`,
features: [
" Museum-Quality Craftsmanship - Authentic heritage techniques",
" 100% Natural Materials - Paper mulberry bark, plant dyes",
" Ready-to-Hang Design - Includes mounting hardware",
" Hand-Stamped Patterns - Each piece slightly unique",
" Multiple Size Options - From accent pieces to statement walls",
" Award-Winning Designs - Recognized by Pacific Arts Council"
],
specifications: {
size: "Small: 24×36\" | Medium: 36×48\" | Large: 48×72\" | Custom sizes available",
weight: "Small: 1.2 lbs | Medium: 2.0 lbs | Large: 3.5 lbs",
material: "Hand-beaten paper mulberry bark, natural plant dyes, cotton backing",
origin: "Handcrafted in Si'ufaga village, Savai'i island, Samoa",
care: "Hang out of direct sunlight. Dust gently with soft brush. Maintain 40-60% humidity. Do not frame under glass."
},
guarantee: `**Heritage Quality Assurance**\n\nWe guarantee your tapa artwork against manufacturing defects for 5 years. If the backing separates, patterns fade abnormally, or the fabric tears under proper display conditions, we'll repair or replace it.\n\nProper care instructions are included with every piece. Damage from improper hanging or environmental extremes is not covered.`,
shipping: `**Framed-Article Shipping Protocol**\n\n Processing: Allow 3-5 business days for careful rolling and packaging in protective tubes\n\n Delivery Times:\n- Australia & NZ: 3-6 days\n- US & Canada: 6-10 days\n- UK & Europe: 8-14 days\n- Asia Pacific: 4-8 days\n\n Insurance Included: All shipments fully insured up to $500\n White Glove Option: Available for large orders upon request`,
faqs: [
{ question: "Can I hang this in a humid environment like a bathroom?", answer: "We recommend avoiding high-humidity areas. Tapa is a natural fiber that can warp or develop mold in consistently humid conditions. Ideal spaces are living rooms, bedrooms, or offices." },
{ question: "How do I clean the surface without damaging it?", answer: "Use a soft, dry paintbrush to gently remove dust. Never use water, cleaners, or cloths. For stubborn spots, contact us for professional restoration advice." },
{ question: "Are the patterns symmetrical or mirrored?", answer: "Each pattern is hand-stamped, so there will be subtle variations. This imperfection is celebrated in traditional tapa culture — it proves human craftsmanship rather than machine production." }
],
images: {
story: "/product-images/tapacloth-story.jpg",
environmental: "/product-images/tapacloth-environmental.jpg",
partnership: "/product-images/tapacloth-partnership.jpg",
features: "/product-images/tapacloth-features.jpg",
specifications: "/product-images/tapacloth-specifications.jpg",
guarantee: "/product-images/tapacloth-guarantee.jpg",
shipping: "/product-images/tapacloth-shipping.jpg",
faqs: "/product-images/tapacloth-faqs.jpg"
}
},
{
category: "home-decor",
handle: "shell-coasters",
title: "Handcrafted Natural Shell Coasters",
subtitle: "Ocean Treasures from Samoan Artisan Workshops",
story: `Every shell coaster in our collection begins its journey along Samoa's pristine shorelines, where artisans carefully select naturally shed shells that have been polished by the Pacific Ocean's gentle tides.\n\nOur Samoan partners have mastered the art of transforming these ocean-found treasures into functional art pieces. Each shell is cleaned by hand, backed with soft natural cork, and arranged into sets that showcase nature's incredible variety — from iridescent mother-of-pearl to warm amber cowrie and deep crimson clam shells.\n\nNo two coaster sets are identical. The natural variation in shell size, color, and pattern means your set carries nature's unique signature — a reminder that beauty and sustainability can coexist in your everyday rituals.`,
environmental: ` **Ocean-Found Materials**\n\nEvery shell in our coaster sets is collected from beaches and shallow waters — never harvested from living organisms. We follow strict ecological guidelines to protect Samoa's marine habitats.\n\n **Plastic-Free Alternative**\n\nShell coasters replace synthetic cork, rubber, or plastic alternatives that persist in landfills for centuries. At the end of their life, they decompose naturally.\n\n **Carbon-Neutral Craft**\n\nThe entire production process — from collection to finishing — is entirely manual. No machinery, no factory emissions, no carbon footprint beyond shipping.`,
partnership: ` **Coastal Artisan Network**\n\nOur shell coaster program employs 10 artisans from coastal villages around Apia. Each artisan receives:\n- Fair piece-rate compensation per completed set\n- Quarterly quality bonuses\n- Flexible schedules accommodating fishing and farming seasons\n- Access to marine conservation training\n\n **Marine Conservation Partnership**\n\n5% of all shell coaster sales fund Samoa's coral reef restoration programs. We've partnered with local marine biologists to monitor shell populations and beach health.`,
features: [
" Naturally Sourced Shells - Each set is one-of-a-kind",
" Soft Cork Backing - Protects furniture from scratches",
" Heat-Resistant - Handles hot mugs and glasses safely",
" Easy to Clean - Wipe with damp cloth, air dry",
" Set of 4 or 6 Coasters - Mix of shell types",
" Gift-Ready Packaging - Beautiful recycled box"
],
specifications: {
size: "Each coaster: approximately 4 inches (10cm) diameter",
weight: "Set of 4: approximately 0.8 lbs (360g) | Set of 6: 1.2 lbs (540g)",
material: "Natural seashells, cork backing, eco-friendly adhesive",
origin: "Handcrafted in Apia, Upolu island, Samoa",
care: "Wipe clean with damp cloth. Avoid prolonged soaking. Dry completely before stacking. Do not use abrasive cleaners."
},
guarantee: `**Natural Beauty Promise**

We guarantee your shell coasters against craftsmanship defects for 2 years. If shells detach from backing, adhesive fails, or shells crack under normal use, we'll replace the affected pieces free of charge.

Due to the natural origin of materials, slight variations in shell color, size, and pattern are expected and celebrated — they are not defects. Each set is inspected before shipping to ensure quality standards.

If your coasters arrive damaged, contact us within 7 days for immediate replacement.`,
shipping: `**Carefully Packed for Fragile Items**

 Processing: Orders ship within 24 hours in protective packaging

 Delivery Times:
- Australia & New Zealand: 2-5 business days
- United States & Canada: 5-8 business days
- United Kingdom & Europe: 7-10 business days
- Asia Pacific: 3-7 business days

 Packaging: Recycled cardboard inserts with biodegradable padding
 Tracking: Full tracking included on all orders`,
faqs: [
{ question: "Are these shells from live animals?", answer: "No. We only use shells that have been naturally shed or washed ashore. Our artisans never harvest from living creatures or damage marine ecosystems." },
{ question: "Will hot cups damage the coasters?", answer: "Shell coasters are naturally heat-resistant and handle hot mugs and glasses without issue. However, avoid placing extremely hot items directly from the stove or oven." },
{ question: "Can I use these outdoors?", answer: "Yes! Shell coasters work well on patios and outdoor tables. Just bring them inside after use to protect from prolonged moisture exposure." }
],
images: {
story: "/product-images/coconutbowl-v5/product-story.jpg",
environmental: "/product-images/coconutbowl-v5/eco-value.jpg",
partnership: "/product-images/coconutbowl-v5/partnership-model.jpg",
features: "/product-images/coconutbowl-v5/product-features.jpg",
specifications: "/product-images/coconutbowl-v5/specifications.jpg",
guarantee: "/product-images/coconutbowl-v5/quality-assurance.jpg",
shipping: "/product-images/coconutbowl-v5/shipping-info.jpg",
faqs: "/product-images/coconutbowl-v5/faq.jpg"
}
}
];
//  handle
export function getProductDescription(handle: string) {
return productDescriptions.find(p => p.handle === handle) || null;
}