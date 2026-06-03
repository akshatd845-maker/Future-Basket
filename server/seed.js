/**
 * Seed script for MongoDB.
 * Run (from server folder): node seed.js
 */

const dotenv = require("dotenv");
dotenv.config();

const mongoose = require("mongoose");
const dns = require("dns");

// Fix DNS for Node.js
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const Product = require("./models/Product");

// High quality, realistic ecommerce products with verified working Unsplash URLs
const PRODUCTS = [
  // Electronics
  {
    title: "Apple AirPods Pro (2nd Generation)",
    price: 249.0,
    image: "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=800&auto=format&fit=crop&q=80",
    description: "Active Noise Cancellation reduces unwanted background noise. Adaptive Audio dynamically blends Transparency mode and Active Noise Cancellation. Personalized Spatial Audio with dynamic head tracking.",
    category: "Electronics"
  },
  {
    title: "Sony WH-1000XM5 Wireless Headphones",
    price: 398.0,
    image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80",
    description: "Industry-leading noise cancellation optimized to your environment. Magnificent sound, engineered to perfection. Crystal clear hands-free calling with 4 beamforming microphones.",
    category: "Electronics"
  },
  {
    title: "Logitech MX Master 3S Wireless Mouse",
    price: 99.99,
    image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80",
    description: "An icon remastered. Feel every moment of your workflow with even more precision, tactility, and performance, thanks to Quiet Clicks and an 8,000 DPI track-on-glass sensor.",
    category: "Electronics"
  },
  {
    title: "Logitech G PRO X Superlight Gaming Mouse",
    price: 159.99,
    image: "https://images.unsplash.com/photo-1629429408209-1f912961dbd8?w=800&auto=format&fit=crop&q=80",
    description: "Designed with the world's leading pros to engineer the world's finest competitive gaming mouse. Ultra-lightweight under 63 grams, with a state-of-the-art HERO 25K sensor.",
    category: "Electronics"
  },
  {
    title: "Keychron Q1 QMK Custom Mechanical Keyboard",
    price: 189.99,
    image: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&auto=format&fit=crop&q=80",
    description: "A fully customizable 75% layout mechanical keyboard packed with premium features: double-gasket design, full aluminum body, hot-swappable switches, and south-facing RGB.",
    category: "Electronics"
  },
  {
    title: "Dell UltraSharp 27\" 4K USB-C Hub Monitor",
    price: 479.99,
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80",
    description: "Experience brilliant color and superior black performance with a contrast ratio of 2000:1 on the world's first 27-inch 4K monitor with IPS Black technology.",
    category: "Electronics"
  },
  {
    title: "Sonos Era 100 Smart Speaker",
    price: 249.0,
    image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop&q=80",
    description: "Featuring next-generation acoustics and new levels of connectivity, Era 100 transforms any room with the finely tuned stereo sound and rich bass your music deserves.",
    category: "Electronics"
  },
  {
    title: "Anker 3-in-1 MagSafe Charging Cube",
    price: 149.95,
    image: "https://images.unsplash.com/photo-1608156639585-b3a032ef9689?w=800&auto=format&fit=crop&q=80",
    description: "A premium, ultra-compact 3-in-1 wireless charger with MagSafe, designed specifically for Apple devices. Charge your iPhone, Apple Watch, and AirPods simultaneously.",
    category: "Electronics"
  },
  {
    title: "DJI Mini 4 Pro Drone",
    price: 759.0,
    image: "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=800&auto=format&fit=crop&q=80",
    description: "Our most advanced mini camera drone to date. Integrates powerful imaging capabilities, omnidirectional obstacle sensing, and a 20km FHD video transmission range.",
    category: "Electronics"
  },
  {
    title: "Elgato Wave:3 Premium USB Microphone",
    price: 149.99,
    image: "https://images.unsplash.com/photo-1590608897129-79da98d15969?w=800&auto=format&fit=crop&q=80",
    description: "A premium microphone and digital mixing solution that fuses broadcast-grade circuitry with proprietary anti-clipping technology. Perfect for streamers and podcasters.",
    category: "Electronics"
  },

  // Fashion
  {
    title: "Classic Leather Biker Jacket",
    price: 299.99,
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&auto=format&fit=crop&q=80",
    description: "Handcrafted from 100% genuine top-grain lambskin leather. Features asymmetric zip closure, zippered cuffs, and classic quilted shoulder details. A timeless wardrobe staple.",
    category: "Fashion"
  },
  {
    title: "Sherpa-Lined Denim Jacket",
    price: 89.5,
    image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&auto=format&fit=crop&q=80",
    description: "A vintage-inspired denim jacket lined with thick, warm sherpa fleece. Features double chest pockets, button closures, and button cuffs. Perfect for chilly transition weather.",
    category: "Fashion"
  },
  {
    title: "Premium Heavyweight Hoodie",
    price: 65.0,
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&auto=format&fit=crop&q=80",
    description: "Constructed from 450 GSM ultra-soft French terry cotton. Double-layered hood, kangaroo pocket, and flatlock stitching. Pre-shrunk for the perfect fit wash after wash.",
    category: "Fashion"
  },
  {
    title: "Retro Low-Top White Sneakers",
    price: 85.0,
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&auto=format&fit=crop&q=80",
    description: "A clean, minimalist sneaker crafted from premium Italian leather. Features a comfortable OrthoLite footbed and a durable vulcanized rubber outsole.",
    category: "Fashion"
  },
  {
    title: "Floral Print Summer Midi Dress",
    price: 59.99,
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop&q=80",
    description: "Lightweight and breathable viscose summer dress. Features a sweet heart neckline, adjustable spaghetti straps, and a side slit. Perfect for brunch or beach outings.",
    category: "Fashion"
  },
  {
    title: "Classic Wool Trench Coat",
    price: 189.0,
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&auto=format&fit=crop&q=80",
    description: "Tailored double-breasted trench coat made from a warm wool blend. Features a removable waist belt, deep side pockets, and a classic wide lapel.",
    category: "Fashion"
  },
  {
    title: "Stretch Denim Skinny Jeans",
    price: 49.99,
    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&auto=format&fit=crop&q=80",
    description: "Engineered with flexible stretch technology for maximum comfort and shape retention. Classic five-pocket design with a mid-rise fit.",
    category: "Fashion"
  },
  {
    title: "Ribbed Knit Wool Beanie",
    price: 24.5,
    image: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=800&auto=format&fit=crop&q=80",
    description: "Soft, non-itchy merino wool blend knit beanie. Double-cuffed brim for extra ear warmth. Available in a variety of versatile colors.",
    category: "Fashion"
  },
  {
    title: "Athletic Compression Shorts",
    price: 29.99,
    image: "https://images.unsplash.com/photo-1539185441755-769473a23570?w=800&auto=format&fit=crop&q=80",
    description: "Moisture-wicking, four-way stretch compression shorts with an integrated phone pocket. Offers muscle support and prevents chafing during runs.",
    category: "Fashion"
  },
  {
    title: "Linen Button-Down Shirt",
    price: 45.0,
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop&q=80",
    description: "Crafted from 100% European flax linen. Super soft, airy, and naturally cooling. Relaxed fit design with a classic button collar.",
    category: "Fashion"
  },

  // Home & Kitchen
  {
    title: "Breville Barista Express Espresso Machine",
    price: 699.95,
    image: "https://images.unsplash.com/photo-1541167760496-1628856ab772?w=800&auto=format&fit=crop&q=80",
    description: "Deliver third wave specialty coffee at home. All-in-one espresso machine with integrated grinder to go from beans to espresso in under a minute.",
    category: "Home & Kitchen"
  },
  {
    title: "Vitamix 5200 Professional Blender",
    price: 429.99,
    image: "https://images.unsplash.com/photo-1578643463396-0997cb5328c1?w=800&auto=format&fit=crop&q=80",
    description: "The professional standard for kitchen blenders. Variable speed control allows you to refine every texture, from the chunkiest salsas to the smoothest purées.",
    category: "Home & Kitchen"
  },
  {
    title: "Cosori Pro II Air Fryer (5.8QT)",
    price: 119.99,
    image: "https://images.unsplash.com/photo-1621972750749-0fbb1abb7736?w=800&auto=format&fit=crop&q=80",
    description: "Cook your favorite meals with up to 85% less oil than traditional deep frying. Features 12 customizable cooking functions and a non-stick dishwasher-safe basket.",
    category: "Home & Kitchen"
  },
  {
    title: "Lodge Cast Iron Skillet (12-inch)",
    price: 39.9,
    image: "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=800&auto=format&fit=crop&q=80",
    description: "A kitchen essential seasoned with 100% natural vegetable oil for an easy-release finish. Offers unparalleled heat retention and even heating.",
    category: "Home & Kitchen"
  },
  {
    title: "Wüsthof Classic 8-Inch Chef's Knife",
    price: 170.0,
    image: "https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?w=800&auto=format&fit=crop&q=80",
    description: "Precision-forged from a single blank of high-carbon stainless steel. Full tang handle with a triple-riveted design for ultimate balance and control.",
    category: "Home & Kitchen"
  },
  {
    title: "Minimalist Ceramic Teapot Set",
    price: 49.99,
    image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&auto=format&fit=crop&q=80",
    description: "A beautiful, Scandinavian-style matte ceramic teapot with a wooden handle. Includes a removable stainless steel mesh tea infuser and 2 matching cups.",
    category: "Home & Kitchen"
  },
  {
    title: "Handcrafted Stoneware Dinnerware Set",
    price: 129.99,
    image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800&auto=format&fit=crop&q=80",
    description: "A 12-piece stoneware dinnerware set featuring a reactive glaze finish. Every piece is unique, dishwasher and microwave safe.",
    category: "Home & Kitchen"
  },
  {
    title: "Luxury Soy Wax Scented Candle",
    price: 32.0,
    image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800&auto=format&fit=crop&q=80",
    description: "Infused with pure essential oils of lavender, eucalyptus, and sandalwood. Hand-poured natural soy wax with a wooden wick that crackles when lit.",
    category: "Home & Kitchen"
  },
  {
    title: "iRobot Roomba j7 Robot Vacuum",
    price: 599.99,
    image: "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800&auto=format&fit=crop&q=80",
    description: "Cleans the way you want, avoids pet waste and cords, and schedules cleaning automatically. PrecisionVision Navigation identifies obstacles in real-time.",
    category: "Home & Kitchen"
  },
  {
    title: "Retro 2-Slice Stainless Toaster",
    price: 49.99,
    image: "https://images.unsplash.com/photo-1585238342024-78d387f4a707?w=800&auto=format&fit=crop&q=80",
    description: "Bring vintage style to your kitchen counter. Features extra-wide slots for bagels, a removable crumb tray, and 6 browning control settings.",
    category: "Home & Kitchen"
  },

  // Beauty
  {
    title: "The Ordinary Niacinamide 10% + Zinc 1%",
    price: 8.9,
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80",
    description: "A high-strength vitamin and mineral blemish formula. Niacinamide reduces the appearance of skin blemishes and congestion, while zinc balances visible sebum activity.",
    category: "Beauty"
  },
  {
    title: "Fenty Beauty Matte Lipstick",
    price: 28.0,
    image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800&auto=format&fit=crop&q=80",
    description: "An ultra-slim matte lipstick with a long-wear, weightless finish. Delivers high-pigment color in a single stroke, designed to flatter all skin tones.",
    category: "Beauty"
  },
  {
    title: "Urban Decay Naked Nectar Eyeshadow Palette",
    price: 49.0,
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&auto=format&fit=crop&q=80",
    description: "A versatile 12-shade eyeshadow palette featuring velvety, high-pigment neutrals ranging from warm ambers to shimmering honey shades.",
    category: "Beauty"
  },
  {
    title: "CeraVe Facial Moisturizing Lotion PM",
    price: 15.99,
    image: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=800&auto=format&fit=crop&q=80",
    description: "An ultra-lightweight, night-time facial moisturizer formulated with three essential ceramides, hyaluronic acid, and niacinamide to help restore the skin barrier.",
    category: "Beauty"
  },
  {
    title: "Chanel Bleu de Chanel Eau de Parfum",
    price: 125.0,
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&auto=format&fit=crop&q=80",
    description: "An olfactory tribute to freedom. A woody aromatic fragrance with a captivating trail. A timeless scent housed in a deep and mysterious blue bottle.",
    category: "Beauty"
  },
  {
    title: "Dead Sea Mud Mask Cosmecuticals",
    price: 22.5,
    image: "https://images.unsplash.com/photo-1567894340315-735d7c361db0?w=800&auto=format&fit=crop&q=80",
    description: "Formulated with authentic Dead Sea mud to gently draw out impurities, blackheads, and excess oils from the skin, leaving it refreshed and hydrated.",
    category: "Beauty"
  },
  {
    title: "Organic Cold-Pressed Argan Hair Oil",
    price: 18.0,
    image: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=800&auto=format&fit=crop&q=80",
    description: "100% pure organic Moroccan argan oil. Restores shine, tames frizz, and hydrates dry hair strands. Double-filters for a lightweight, fast-absorbing texture.",
    category: "Beauty"
  },
  {
    title: "Exfoliating Coco-Coffee Body Scrub",
    price: 19.99,
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80",
    description: "A natural body scrub blended with roasted coffee grounds and organic cold-pressed coconut oil. Gently exfoliates and deeply moisturizes skin.",
    category: "Beauty"
  },
  {
    title: "Hydrating Cleansing Foam (Hyaluronic Acid)",
    price: 14.5,
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80",
    description: "A gentle foaming facial cleanser infused with multiple weights of hyaluronic acid. Removes dirt and makeup while maintaining the skin's natural moisture balance.",
    category: "Beauty"
  },
  {
    title: "Professional 12-Piece Makeup Brush Set",
    price: 35.0,
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=80",
    description: "Crafted with premium synthetic fibers that feel incredibly soft on the skin. Includes foundation, powder, blending, and detail brushes in a leather wrap.",
    category: "Beauty"
  },

  // Sports
  {
    title: "Lululemon 5mm Reversible Yoga Mat",
    price: 88.0,
    image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&auto=format&fit=crop&q=80",
    description: "Engineered with a polyurethane top layer that absorbs moisture to help you get a grip during sweaty practices. A natural rubber base cushions hands and feet.",
    category: "Sports"
  },
  {
    title: "Bowflex SelectTech Adjustable Dumbbells",
    price: 429.0,
    image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80",
    description: "Replace 15 sets of weights with a single pair of adjustable dumbbells. Weight adjusts from 5 to 52.5 lbs in 2.5-lb increments using a selection dial.",
    category: "Sports"
  },
  {
    title: "Hydro Flask 32oz Wide Mouth Water Bottle",
    price: 44.95,
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&auto=format&fit=crop&q=80",
    description: "TempShield double-wall vacuum insulation keeps drinks cold up to 24 hours or hot up to 12. Constructed with durable pro-grade stainless steel.",
    category: "Sports"
  },
  {
    title: "Wilson Pro Staff 97 Tennis Racket",
    price: 269.0,
    image: "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=800&auto=format&fit=crop&q=80",
    description: "Co-designed by Roger Federer, the Pro Staff delivers the pure, classic feel players love, combined with an all-new design that's sleek and modern.",
    category: "Sports"
  },
  {
    title: "Spalding TF-1000 Legacy Basketball",
    price: 79.99,
    image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&auto=format&fit=crop&q=80",
    description: "Built for championship play, this indoor basketball is engineered with a composite cover that wicks away sweat for ultimate grip and control.",
    category: "Sports"
  },
  {
    title: "Adidas Tiro League Soccer Ball",
    price: 35.0,
    image: "https://images.unsplash.com/photo-1518063319789-7217e6706b04?w=800&auto=format&fit=crop&q=80",
    description: "A FIFA-certified match and training soccer ball. Seamless TSBE construction ensures predictable flight, low water uptake, and excellent durability.",
    category: "Sports"
  },
  {
    title: "Heavy-Duty Resistance Loop Bands Set",
    price: 19.99,
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&auto=format&fit=crop&q=80",
    description: "Includes 5 natural latex bands of varying resistance levels (light to extra-heavy). Includes a carry bag and exercise guide. Perfect for home workouts.",
    category: "Sports"
  },
  {
    title: "Coleman Sundome 4-Person Camping Tent",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&auto=format&fit=crop&q=80",
    description: "Sets up in under 10 minutes. Features WeatherTec system with patented welded floors and inverted seams to help you stay dry during rain.",
    category: "Sports"
  },
  {
    title: "TETON Sports TrailHead Sleeping Bag",
    price: 65.0,
    image: "https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=800&auto=format&fit=crop&q=80",
    description: "Lightweight and comfortable mummy sleeping bag designed for 3-season camping. Breathable, double-brushed liner and water-resistant shell.",
    category: "Sports"
  },
  {
    title: "Osprey Atmos AG 65 Hiking Backpack",
    price: 340.0,
    image: "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800&auto=format&fit=crop&q=80",
    description: "Features Anti-Gravity suspension system for outstanding ventilation and carrying comfort. Perfect for multi-day backpacking trips.",
    category: "Sports"
  },

  // Books
  {
    title: "The Hobbit (Hardcover Deluxe Edition)",
    price: 29.99,
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&auto=format&fit=crop&q=80",
    description: "A beautiful deluxe edition of J.R.R. Tolkien's classic fantasy novel. Features stunning cover art, map illustrations, and high-quality paper.",
    category: "Books"
  },
  {
    title: "Eloquent JavaScript (3rd Edition)",
    price: 34.95,
    image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=800&auto=format&fit=crop&q=80",
    description: "A deep dive into the JavaScript language, showing you how to write beautiful, effective code. Covers variables, control structures, functions, and the DOM.",
    category: "Books"
  },
  {
    title: "The Italian Baker's Secret Cookbook",
    price: 24.99,
    image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=800&auto=format&fit=crop&q=80",
    description: "Over 100 authentic bread, pastry, and dessert recipes straight from the heart of Tuscany. Step-by-step instructions and gorgeous full-color photography.",
    category: "Books"
  },
  {
    title: "Genuine Leather Travel Journal",
    price: 19.99,
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&auto=format&fit=crop&q=80",
    description: "Handcrafted from 100% genuine buffalo leather. Filled with 240 pages of thick, acid-free unlined cotton paper. Vintage key wrap closure.",
    category: "Books"
  },
  {
    title: "Atomic Habits (Hardcover)",
    price: 16.2,
    image: "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=800&auto=format&fit=crop&q=80",
    description: "An easy and proven way to build good habits and break bad ones. James Clear, one of the world's leading experts on habit formation, reveals practical strategies.",
    category: "Books"
  },
  {
    title: "Classic Poetry Collection",
    price: 14.99,
    image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop&q=80",
    description: "An anthology of the world's greatest poetry, featuring works by Shakespeare, Emily Dickinson, Robert Frost, Edgar Allan Poe, and more.",
    category: "Books"
  },
  {
    title: "Graphic Design Principles for Beginners",
    price: 27.5,
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&auto=format&fit=crop&q=80",
    description: "An introduction to grid systems, color theory, layout composition, and typography. Filled with practical visual examples for aspiring designers.",
    category: "Books"
  },
  {
    title: "The Art of War (Deluxe Gift Edition)",
    price: 12.99,
    image: "https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=800&auto=format&fit=crop&q=80",
    description: "Sun Tzu's ancient Chinese military treatise, beautifully bound in a red cloth hardcover cover. The translation is annotated for modern readers.",
    category: "Books"
  },
  {
    title: "Brief Answers to the Big Questions",
    price: 18.0,
    image: "https://images.unsplash.com/photo-1513001900722-370f803f498d?w=800&auto=format&fit=crop&q=80",
    description: "Stephen Hawking's final book, offering his personal views on the universe's greatest mysteries: God, time, black holes, and the future of humanity.",
    category: "Books"
  },
  {
    title: "Modern Architecture: A Visual History",
    price: 45.0,
    image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=800&auto=format&fit=crop&q=80",
    description: "A comprehensive look at the buildings and architects that shaped the 20th and 21st centuries. Over 300 pages of stunning photography.",
    category: "Books"
  },

  // Accessories
  {
    title: "Fossil Minimalist Stainless Steel Watch",
    price: 119.0,
    image: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=800&auto=format&fit=crop&q=80",
    description: "A clean, modern three-hand watch featuring a brushed steel dial, silver indices, and a genuine dark brown leather band. Quartz movement.",
    category: "Accessories"
  },
  {
    title: "Full-Grain Leather Bi-Fold Wallet",
    price: 35.0,
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop&q=80",
    description: "Handcrafted from 100% full-grain cowhide leather. Features RFID-blocking technology, 6 card slots, a clear ID window, and a spacious bill compartment.",
    category: "Accessories"
  },
  {
    title: "Everlane Modern Commuter Backpack",
    price: 88.0,
    image: "https://images.unsplash.com/photo-1581605405669-fcdf81165afa?w=800&auto=format&fit=crop&q=80",
    description: "Designed for daily commutes and weekend travels. Water-resistant recycled polyester shell, 15-inch padded laptop sleeve, and side water bottle pockets.",
    category: "Accessories"
  },
  {
    title: "Tommy Hilfiger Classic Leather Belt",
    price: 29.5,
    image: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=800&auto=format&fit=crop&q=80",
    description: "Constructed with 100% genuine buffalo leather and a polished single-prong buckle. Reversible design features black on one side and brown on the other.",
    category: "Accessories"
  },
  {
    title: "Ray-Ban Classic Aviator Sunglasses",
    price: 163.0,
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80",
    description: "The world's most iconic sunglasses model. G-15 polarized lenses provide clarity, comfort, and 100% UV protection. Durable gold-tone metal frames.",
    category: "Accessories"
  },
  {
    title: "Cashmere Wool Plaid Scarf",
    price: 45.0,
    image: "https://images.unsplash.com/photo-1584030373081-f37b7bb4fa8e?w=800&auto=format&fit=crop&q=80",
    description: "Luxuriously soft scarf woven from 100% premium Mongolian cashmere. Warm, lightweight, and features a classic plaid pattern with fringed edges.",
    category: "Accessories"
  },
  {
    title: "Herschel Novel Weekend Duffel Bag",
    price: 90.0,
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80",
    description: "An ideal weekender bag featuring Herschel's signature shoe compartment. Removable padded shoulder strap and signature striped fabric liner.",
    category: "Accessories"
  },
  {
    title: "Minimalist Leather Card Holder",
    price: 22.0,
    image: "https://images.unsplash.com/photo-1582139329536-e7284fece509?w=800&auto=format&fit=crop&q=80",
    description: "Ultra-slim front pocket wallet made from top-grain leather. Comfortably holds up to 6 cards and folded cash. Sleek and bulk-free design.",
    category: "Accessories"
  },
  {
    title: "Sterling Silver Classic Cufflinks",
    price: 55.0,
    image: "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=800&auto=format&fit=crop&q=80",
    description: "Elegant round cufflinks crafted from polished 925 sterling silver. Features a secure whale-back closure. A perfect touch for formal events.",
    category: "Accessories"
  },
  {
    title: "Hydro Flask Coffee Travel Tumbler (20oz)",
    price: 32.95,
    image: "https://images.unsplash.com/photo-1577937927133-66ef06acdf18?w=800&auto=format&fit=crop&q=80",
    description: "Fits under most coffee brewing systems. Honeycomb insulation in the leakproof Flex Sip Lid ensures extra temperature control.",
    category: "Accessories"
  },

  // Mobile Accessories
  {
    title: "Aluminum Adjustable Desk Phone Stand",
    price: 12.99,
    image: "https://images.unsplash.com/photo-1616440347437-b1c73416efc2?w=800&auto=format&fit=crop&q=80",
    description: "Multi-angle adjustable phone stand compatible with all smartphones and e-readers. Heavy-duty aluminum body with anti-slip rubber pads.",
    category: "Mobile Accessories"
  },
  {
    title: "Anker PowerCore 26800mAh Power Bank",
    price: 65.99,
    image: "https://images.unsplash.com/photo-1609081219090-a6d81d3085bf?w=800&auto=format&fit=crop&q=80",
    description: "High-speed charging power bank with triple USB ports. Charge your phone up to 6 times. Compatible with most smartphones and USB devices.",
    category: "Mobile Accessories"
  },
  {
    title: "Belkin BoostCharge Pro Wireless Charger",
    price: 39.99,
    image: "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&auto=format&fit=crop&q=80",
    description: "Fast wireless charging pad optimized for Apple and Samsung devices. Offers up to 15W of wireless power. Case-compatible with soft-touch grip.",
    category: "Mobile Accessories"
  },
  {
    title: "OtterBox Symmetry Clear Series Case",
    price: 34.99,
    image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&auto=format&fit=crop&q=80",
    description: "Ultra-slim, clear phone case that showcases your phone's design while offering military-grade drop protection. Easy to install.",
    category: "Mobile Accessories"
  },
  {
    title: "Braided Nylon USB-C to Lightning Cable",
    price: 14.99,
    image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80",
    description: "Heavy-duty braided nylon cable with reinforced connectors. Supports Power Delivery fast charging and high-speed data transfer.",
    category: "Mobile Accessories"
  },
  {
    title: "Magnetic Dashboard Car Phone Mount",
    price: 19.99,
    image: "https://images.unsplash.com/photo-1586105251261-72a756497a11?w=800&auto=format&fit=crop&q=80",
    description: "Powerful N52 neodymium magnets hold your phone securely even on bumpy roads. Sticks to any dashboard with high-strength 3M adhesive.",
    category: "Mobile Accessories"
  },
  {
    title: "Selfie Ring Light with Tripod Stand",
    price: 29.99,
    image: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=800&auto=format&fit=crop&q=80",
    description: "10-inch ring light featuring 3 lighting modes (warm, cool, daylight) and 10 brightness levels. Includes bluetooth remote shutter and adjustable tripod.",
    category: "Mobile Accessories"
  },
  {
    title: "Clip-On 3-in-1 Phone Camera Lens Kit",
    price: 24.99,
    image: "https://images.unsplash.com/photo-1612444530582-fc66183b16f7?w=800&auto=format&fit=crop&q=80",
    description: "Includes a 120° Wide Angle, 15x Macro, and 198° Fisheye lens. Easy clip-on design works with all single and dual-camera smartphones.",
    category: "Mobile Accessories"
  },
  {
    title: "Felt Leather Tablet Sleeve Bag",
    price: 18.5,
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop&q=80",
    description: "Minimalist tablet bag crafted from high-quality felt and accents of vegan leather. Thick padding protects your screen from scratches.",
    category: "Mobile Accessories"
  },
  {
    title: "Bluetooth Selfie Stick and Tripod Combo",
    price: 21.99,
    image: "https://images.unsplash.com/photo-1563206767-5b18f218e8de?w=800&auto=format&fit=crop&q=80",
    description: "Extendable selfie stick that converts into a stable tabletop tripod. Rechargeable Bluetooth remote works up to 33 feet away.",
    category: "Mobile Accessories"
  }
];

async function seed() {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error(
      "Missing MONGO_URI in environment. Ensure it is set in your .env file."
    );
  }

  const connection = await mongoose.connect(mongoUri);

  try {
    await Product.deleteMany({});

    await Product.insertMany(PRODUCTS);

    console.log(`✅ Seeded ${PRODUCTS.length} products`);
  } finally {
    await connection.connection.close();
  }
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  });