import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('⏳ Clearing existing Harlow Forte catalog...');
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  const categoriesData = [
    {
      name: "Laptops & Computers",
      slug: "laptops-computers",
      tagline: "Power through work, coding, and 4K gaming with ultra-fast laptops, MacBooks, and custom rigs.",
      bannerBg: "from-slate-900 via-blue-950 to-[#0046be]",
      heroImage: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80",
      subcategories: JSON.stringify(["MacBooks", "Windows Gaming Laptops", "2-in-1 Ultrabooks", "Monitors"]),
      products: [
        {
          brand: "Apple",
          model: "MRYU3LL/A",
          sku: "6534606",
          name: "Apple - MacBook Air 15\" Laptop - M3 Chip - 16GB Memory - 512GB SSD - Midnight",
          price: 1299.99,
          oldPrice: 1499.99,
          rating: 4.9,
          reviews: 942,
          badge: "Save $200",
          image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80",
          gallery: JSON.stringify([
            "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=800&q=80"
          ]),
          description: "The 15-inch MacBook Air with the M3 chip balances a spacious Liquid Retina display with an impossibly thin and light chassis.",
          highlights: JSON.stringify([
            "Supercharged by the next-generation Apple M3 8-core processor",
            "15.3-inch Liquid Retina display with True Tone & 500 nits brightness",
            "16GB unified high-bandwidth memory & 512GB PCIe SSD storage"
          ]),
          specs: JSON.stringify({
            "Screen Size": "15.3 inches",
            "Processor Model": "Apple M3 (8-Core CPU, 10-Core GPU)",
            "System Memory (RAM)": "16 gigabytes",
            "Solid State Drive": "512 gigabytes"
          }),
          manuals: JSON.stringify([
            { title: "MacBook Air 15\" Official User Guide (PDF)", size: "4.1 MB", url: "#" },
            { title: "Harlow Forte 1-Year Apple Warranty Guide (PDF)", size: "1.2 MB", url: "#" }
          ])
        },
        {
          brand: "ASUS",
          model: "GU605MV",
          sku: "6570222",
          name: "ASUS - ROG Zephyrus G16 16\" OLED 240Hz Gaming Laptop - RTX 4070",
          price: 1649.99,
          oldPrice: 1999.99,
          rating: 4.7,
          reviews: 412,
          badge: "Save $350",
          image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80",
          gallery: JSON.stringify(["https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80"]),
          description: "Precision-machined CNC aluminum chassis meets a 2.5K 240Hz ROG Nebula OLED display and NVIDIA GeForce RTX 4070 graphics.",
          highlights: JSON.stringify([
            "16-inch ROG Nebula OLED 240Hz 0.2ms Display with G-SYNC",
            "NVIDIA GeForce RTX 4070 8GB GDDR6 Laptop GPU"
          ]),
          specs: JSON.stringify({
            "Display": "16\" 2.5K OLED 240Hz",
            "GPU": "NVIDIA GeForce RTX 4070",
            "Storage": "1TB PCIe 4.0 SSD"
          }),
          manuals: JSON.stringify([
            { title: "ROG Zephyrus G16 Manual & Armoury Crate Guide (PDF)", size: "5.4 MB", url: "#" }
          ])
        }
      ]
    },
    {
      name: "TV & Home Theater",
      slug: "tv-home-theater",
      tagline: "Transform your living room with self-lit 4K OLED TVs, Mini-LED displays, and Dolby Atmos soundbars.",
      bannerBg: "from-indigo-950 via-slate-900 to-[#0046be]",
      heroImage: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=600&q=80",
      subcategories: JSON.stringify(["OLED TVs", "QLED & Mini-LED", "Dolby Atmos Soundbars"]),
      products: [
        {
          brand: "LG",
          model: "OLED65C3PUA",
          sku: "6535929",
          name: "LG - 65\" Class C3 Series OLED evo 4K UHD Smart webOS TV",
          price: 1399.99,
          oldPrice: 1699.99,
          rating: 4.8,
          reviews: 2150,
          badge: "Save $300",
          image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=800&q=80",
          gallery: JSON.stringify(["https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=800&q=80"]),
          description: "Experience self-lit OLED pixels that create infinite contrast, 100% color fidelity, and a 0.1ms response time with native 120Hz refresh rate.",
          highlights: JSON.stringify([
            "a9 AI Processor Gen6 exclusively engineered for LG OLED",
            "Dolby Vision, Dolby Atmos, and Filmmaker Mode built-in"
          ]),
          specs: JSON.stringify({
            "Screen Size": "64.5 inches",
            "Resolution": "4K (2160p) OLED evo",
            "Refresh Rate": "120Hz Native"
          }),
          manuals: JSON.stringify([
            { title: "LG C3 OLED Wall-Mount & Setup Manual (PDF)", size: "6.0 MB", url: "#" }
          ])
        },
        {
          brand: "Sonos",
          model: "ARCG1US1BLK",
          sku: "6411132",
          name: "Sonos - Arc 5.0.2 Channel Smart Soundbar with Dolby Atmos - Black",
          price: 719.99,
          oldPrice: 899.99,
          rating: 4.8,
          reviews: 1890,
          badge: "Save $180",
          image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80",
          gallery: JSON.stringify(["https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80"]),
          description: "Bring all your entertainment to life with the brilliantly realistic sound of Sonos Arc, featuring Dolby Atmos and Trueplay room tuning.",
          highlights: JSON.stringify([
            "11 high-performance drivers including 2 upward-firing height channels",
            "3D Spatial Audio with Dolby Atmos via HDMI eARC"
          ]),
          specs: JSON.stringify({
            "Channels": "5.0.2 Channel",
            "Connectivity": "HDMI eARC, Wi-Fi, AirPlay 2"
          }),
          manuals: JSON.stringify([
            { title: "Sonos Arc HDMI eARC & App Setup Guide (PDF)", size: "2.3 MB", url: "#" }
          ])
        }
      ]
    },
    {
      name: "Cell Phones",
      slug: "cell-phones",
      tagline: "Unlocked flagship 5G smartphones, foldables, and MagSafe accessories ready for any carrier.",
      bannerBg: "from-gray-900 via-blue-900 to-[#0046be]",
      heroImage: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=600&q=80",
      subcategories: JSON.stringify(["iPhone", "Samsung Galaxy", "Unlocked 5G Phones"]),
      products: [
        {
          brand: "Samsung",
          model: "SM-S928U",
          sku: "6570298",
          name: "Samsung - Galaxy S24 Ultra 256GB (Unlocked) - Titanium Gray",
          price: 1099.99,
          oldPrice: 1299.99,
          rating: 4.8,
          reviews: 1620,
          badge: "Save $200",
          image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=800&q=80",
          gallery: JSON.stringify(["https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=800&q=80"]),
          description: "Unleash new ways to create and connect with Galaxy S24 Ultra featuring a Titanium exterior, built-in S Pen, and 200MP camera.",
          highlights: JSON.stringify([
            "6.8-inch QHD+ Dynamic AMOLED 2X Anti-Reflective Display",
            "200MP Wide-angle main camera with 100x Space Zoom"
          ]),
          specs: JSON.stringify({
            "Screen Size": "6.8 inches",
            "Internal Memory": "256GB",
            "Carrier": "Factory Unlocked"
          }),
          manuals: JSON.stringify([
            { title: "Galaxy S24 Ultra User Guide & eSIM Setup (PDF)", size: "3.1 MB", url: "#" }
          ])
        }
      ]
    },
    {
      name: "Audio & Headphones",
      slug: "audio-headphones",
      tagline: "Studio-grade wireless noise-canceling headphones, true wireless earbuds, and portable Hi-Fi speakers.",
      bannerBg: "from-zinc-900 via-blue-950 to-[#0046be]",
      heroImage: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
      subcategories: JSON.stringify(["Over-Ear ANC Headphones", "True Wireless Earbuds", "Bluetooth Speakers"]),
      products: [
        {
          brand: "Apple",
          model: "MTJV3AM/A",
          sku: "6447382",
          name: "Apple - AirPods Pro (2nd Generation) with MagSafe Case (USB-C)",
          price: 189.99,
          oldPrice: 249.99,
          rating: 4.9,
          reviews: 8340,
          badge: "Save $60",
          image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=800&q=80",
          gallery: JSON.stringify(["https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=800&q=80"]),
          description: "AirPods Pro (2nd generation) deliver up to 2x more Active Noise Cancellation with Adaptive Audio and Personalized Spatial Audio.",
          highlights: JSON.stringify([
            "Apple-designed H2 headphone chip",
            "Dust, sweat, and water resistant (IP54)"
          ]),
          specs: JSON.stringify({
            "Noise Canceling": "Yes (Active)",
            "Battery Life": "6 hours (30 hours with Case)"
          }),
          manuals: JSON.stringify([
            { title: "AirPods Pro 2 Pairing & Ear Tip Fit Guide (PDF)", size: "1.9 MB", url: "#" }
          ])
        }
      ]
    },
    {
      name: "Video Games",
      slug: "video-games",
      tagline: "Next-gen PlayStation, Xbox, and handheld consoles, high-refresh monitors, and pro controllers.",
      bannerBg: "from-blue-950 via-indigo-900 to-[#0046be]",
      heroImage: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=600&q=80",
      subcategories: JSON.stringify(["PlayStation 5", "Nintendo Switch", "Xbox Series X"]),
      products: [
        {
          brand: "Sony",
          model: "CFI-2015",
          sku: "6566039",
          name: "Sony - PlayStation 5 Slim Console Disc Edition - White",
          price: 449.99,
          oldPrice: 499.99,
          rating: 4.9,
          reviews: 5412,
          badge: "Top Seller",
          image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=800&q=80",
          gallery: JSON.stringify(["https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=800&q=80"]),
          description: "Experience lightning-fast loading with an ultra-high-speed 1TB SSD, haptic feedback, and adaptive triggers.",
          highlights: JSON.stringify([
            "1TB of built-in ultra-high-speed SSD storage",
            "Includes detachable Ultra HD Blu-ray Disc Drive"
          ]),
          specs: JSON.stringify({
            "Storage Capacity": "1TB SSD",
            "Max Resolution": "4K at 120Hz"
          }),
          manuals: JSON.stringify([
            { title: "PlayStation 5 Slim Safety & Hardware Manual (PDF)", size: "3.8 MB", url: "#" }
          ])
        }
      ]
    },
    {
      name: "Cameras & Drones",
      slug: "cameras-drones",
      tagline: "Capture cinematic 4K aerial footage and crisp mirrorless photography with pro stabilization.",
      bannerBg: "from-slate-900 via-cyan-950 to-[#0046be]",
      heroImage: "https://images.unsplash.com/photo-1579829366248-204fe8413f31?auto=format&fit=crop&w=600&q=80",
      subcategories: JSON.stringify(["Camera Drones", "Mirrorless Cameras", "Action Cameras"]),
      products: [
        {
          brand: "DJI",
          model: "CP.MA.00000735",
          sku: "6558804",
          name: "DJI - Mini 4 Pro Drone with RC 2 Remote Controller - Gray",
          price: 959.99,
          oldPrice: 1099.99,
          rating: 4.7,
          reviews: 318,
          badge: "Save $140",
          image: "https://images.unsplash.com/photo-1579829366248-204fe8413f31?auto=format&fit=crop&w=800&q=80",
          gallery: JSON.stringify(["https://images.unsplash.com/photo-1579829366248-204fe8413f31?auto=format&fit=crop&w=800&q=80"]),
          description: "DJI Mini 4 Pro integrates 4K/60fps HDR vertical shooting, omnidirectional obstacle sensing, and 20km FHD video transmission.",
          highlights: JSON.stringify([
            "Weighs under 249g — ultra-portable foldable design",
            "Includes DJI RC 2 Controller with built-in 5.5-inch FHD display"
          ]),
          specs: JSON.stringify({
            "Weight": "249 grams",
            "Max Flight Time": "34 minutes"
          }),
          manuals: JSON.stringify([
            { title: "DJI Mini 4 Pro Flight Checklist & User Manual (PDF)", size: "7.2 MB", url: "#" }
          ])
        }
      ]
    }
  ];

  for (const cat of categoriesData) {
    const { products, ...catInfo } = cat;
    await prisma.category.create({
      data: {
        ...catInfo,
        products: {
          create: products
        }
      }
    });
  }

  console.log("✅ Harlow Forte Database Seeded Successfully with 6 Categories!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });