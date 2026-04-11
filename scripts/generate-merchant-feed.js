// Google Merchant Center Feed Generator
// Run: node scripts/generate-merchant-feed.js
// Output: public/google-merchant-feed.txt (TSV format)

const fs = require('fs')
const path = require('path')

const STORE_URL = 'https://ecomafola.com'
const SHOPIFY_CDN = 'https://cdn.shopify.com/s/files/1/0686/4375/3417/products'

const products = [
  { id: 'samoan-handcrafted-coconut-bowl',           title: 'Samoan Handcrafted Coconut Bowl',              price: '29.99', category: 'Home & Garden > Kitchen & Dining > Dinnerware' },
  { id: 'samoan-handwoven-grass-tote-bag',           title: 'Samoan Handwoven Grass Tote Bag',              price: '49.99', category: 'Apparel & Accessories > Handbags, Wallets & Cases > Handbags' },
  { id: 'handwoven-papua-new-guinea-beach-bag',      title: 'Handwoven Papua New Guinea Beach Bag',         price: '259.99', category: 'Apparel & Accessories > Handbags, Wallets & Cases > Handbags' },
  { id: 'samoan-handcrafted-shell-necklace',         title: 'Ocean Whisper Seashell Necklace',              price: '24.99', category: 'Apparel & Accessories > Jewelry > Necklaces' },
  { id: 'samoan-woven-basket',                       title: 'Samoan Woven Basket',                          price: '39.99', category: 'Home & Garden > Decor > Baskets' },
  { id: 'natural-coir-handwoven-coconut-palm-doormat', title: 'Natural Coir Handwoven Coconut Palm Doormat', price: '39.99', category: 'Home & Garden > Decor > Doormats & Floor Mats' },
  { id: 'samoan-handcrafted-natural-shell-coasters', title: 'Tapa Sun Coaster Set (4pc)',                   price: '15.99', category: 'Home & Garden > Kitchen & Dining > Table Linens, Napkins & Tablecloths' },
  { id: 'polynesian-rattan-chandelier',              title: 'Polynesian Artisan Rattan Chandelier',         price: '148.99', category: 'Home & Garden > Lighting > Ceiling Lights & Fans > Chandeliers' },
  { id: 'artisan-rattan-coastal-mirror',             title: 'Artisan Rattan Coastal Mirror',                price: '98.99', category: 'Home & Garden > Decor > Mirrors' },
  { id: 'mother-of-pearl-inlaid-tray',               title: 'Nacre Artisan Mother of Pearl Tray',           price: '88.99', category: 'Home & Garden > Kitchen & Dining > Serveware' },
  { id: 'handwoven-seagrass-basket',                 title: 'Artisan-Woven Seagrass Archive Basket',        price: '38.99', category: 'Home & Garden > Decor > Baskets' },
  { id: 'samoan-handwoven-half-moon-bag',            title: 'Artisan Half Moon Woven Tote',                 price: '49.99', category: 'Apparel & Accessories > Handbags, Wallets & Cases > Handbags' },
  { id: 'polynesian-shell-necklace',                 title: 'Moana Coconut Shell Pendant Necklace',         price: '19.99', category: 'Apparel & Accessories > Jewelry > Necklaces' },
  { id: 'artisan-alloy-shell-earrings',              title: 'Lagoon Pearl Drop Earrings',                   price: '16.99', category: 'Apparel & Accessories > Jewelry > Earrings' },
  { id: 'hand-woven-husk-coasters',                  title: 'Samoan Tide Pool Shell Coasters',              price: '17.99', category: 'Home & Garden > Kitchen & Dining > Table Linens, Napkins & Tablecloths' },
  { id: 'ceramic-soul-incense-holder',               title: 'Aiga Coconut Incense Holder',                  price: '24.99', category: 'Home & Garden > Decor > Candles & Holders > Incense Holders' },
  { id: 'pacific-artisan-gift-set',                  title: 'Pacific Artisan Gift Set',                     price: '59.99', category: 'Home & Garden > Decor' },
]

const descriptions = {
  'samoan-handcrafted-coconut-bowl': 'Handcrafted from sustainably harvested coconut shells by Samoan artisans. Each bowl is unique, eco-friendly, and perfect for serving salads, snacks, or as a decorative piece. Polished smooth with natural oils. No two bowls are the same.',
  'samoan-handwoven-grass-tote-bag': 'Woven by hand from natural grass fibers in the tradition of Samoan craftswomen. This durable tote bag is perfect for the beach, market, or everyday use. Eco-friendly, spacious, and effortlessly stylish.',
  'handwoven-papua-new-guinea-beach-bag': 'An extraordinary handwoven beach bag sourced from Papua New Guinea artisans. Made from natural plant fibers using age-old weaving techniques, it is both a functional carry-all and a collector piece of Pacific heritage.',
  'samoan-handcrafted-shell-necklace': 'The Ocean Whisper Seashell Necklace is handcrafted from genuine Pacific shells strung on a durable cord. Each piece carries the spirit of the South Pacific Ocean. Lightweight, hypoallergenic, and beautifully unique.',
  'samoan-woven-basket': 'Traditionally woven by Samoan artisans from pandanus leaves, this basket is perfect for storage, gifting, or home decoration. A sustainable alternative to plastic, rooted in Pacific Island culture.',
  'natural-coir-handwoven-coconut-palm-doormat': 'Made from natural coconut palm coir fiber, this handwoven doormat is durable, biodegradable, and anti-slip. Keeps your entryway clean while making an eco-conscious style statement.',
  'samoan-handcrafted-natural-shell-coasters': 'Set of 4 coasters handcrafted with natural shells inspired by Samoan tapa patterns. Protects your surfaces in style while celebrating Pacific artisanship. Each set is unique and makes a perfect gift.',
  'polynesian-rattan-chandelier': 'A stunning rattan chandelier handwoven by Polynesian artisans. This statement lighting piece brings warmth, texture, and island-inspired elegance to any dining room, living space, or entryway.',
  'artisan-rattan-coastal-mirror': 'Handwoven rattan frame surrounds a crystal-clear mirror, blending coastal charm with artisan craftsmanship. Perfect for entryways, bedrooms, or living rooms seeking a natural, bohemian aesthetic.',
  'mother-of-pearl-inlaid-tray': 'A luxurious serving tray featuring intricate mother-of-pearl inlay work by Pacific artisans. Ideal for serving, display, or as a centerpiece. Combines natural beauty with traditional craftsmanship.',
  'handwoven-seagrass-basket': 'Artisan-woven from sustainably harvested seagrass, this archive basket is ideal for organizing blankets, magazines, or household items. Natural, durable, and beautifully textured.',
  'samoan-handwoven-half-moon-bag': 'A chic half-moon shaped tote handwoven from natural fibers by Samoan craftswomen. Carries your essentials in effortless Pacific Island style. Lightweight and eco-friendly.',
  'polynesian-shell-necklace': 'The Moana Coconut Shell Pendant features a hand-shaped coconut shell charm on a natural cord. A timeless piece of Polynesian jewelry that connects the wearer to the spirit of the ocean.',
  'artisan-alloy-shell-earrings': 'Lagoon Pearl Drop Earrings combine artisan alloy settings with delicate shell accents. Lightweight and hypoallergenic, they add a touch of Pacific coastal elegance to any outfit.',
  'hand-woven-husk-coasters': 'Samoan Tide Pool Shell Coasters are handwoven from natural coconut husk and shell pieces. A set of beautiful, functional coasters that protect surfaces while evoking the textures of the Pacific shore.',
  'ceramic-soul-incense-holder': 'The Aiga Coconut Incense Holder is crafted from ceramic with coconut-inspired motifs. Aiga means family in Samoan. This piece brings grounding, calm, and Pacific soul to any space.',
  'pacific-artisan-gift-set': 'A curated Pacific Artisan Gift Set featuring handcrafted eco-friendly goods from the South Pacific. Perfect for gifting — includes a selection of our most-loved artisan pieces in beautiful eco-packaging.',
}

// TSV header — required + recommended attributes per Google spec
const header = [
  'id', 'title', 'description', 'link', 'image_link',
  'price', 'availability', 'condition', 'brand',
  'google_product_category', 'shipping', 'identifier_exists'
].join('\t')

const rows = products.map(p => {
  const imgHandle = p.id.replace(/-/g, '-')
  const imageLink = `${SHOPIFY_CDN}/${imgHandle}.jpg`
  const desc = (descriptions[p.id] || p.title).replace(/\t/g, ' ').replace(/\n/g, ' ')

  return [
    p.id,
    p.title,
    desc,
    `${STORE_URL}/products/${p.id}`,
    imageLink,
    `${p.price} USD`,
    'in stock',
    'new',
    'EcoMafola Peace',
    p.category,
    'US::Standard Shipping:Free',  // free shipping over $45 — all items qualify for Google's "free" label
    'FALSE'  // handmade artisan items — no GTIN/MPN required
  ].join('\t')
})

const tsv = [header, ...rows].join('\n')
const outPath = path.join(__dirname, '..', 'public', 'google-merchant-feed.txt')
fs.writeFileSync(outPath, '\uFEFF' + tsv, 'utf8')  // BOM for Excel compatibility
console.log(`✅ Feed generated: ${outPath}`)
console.log(`   Products: ${products.length}`)
console.log(`   URL: ${STORE_URL}/google-merchant-feed.txt`)
