import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

// Blueprint of diverse brands & realistic models per category type
const CATALOG_BLUEPRINTS: Record<
  string,
  {
    images: string[];
    items: { brand: string; name: string; model: string; price: number; specs: Record<string, string> }[];
  }
> = {
  laptops: {
    images: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=900&q=80",
    ],
    items: [
      { brand: "Apple", name: "MacBook Pro 16-inch M4 Max (48GB RAM, 1TB SSD)", model: "MBP16-M4MAX", price: 3499, specs: { Processor: "Apple M4 Max 16-Core", RAM: "48GB Unified", Storage: "1TB NVMe SSD", Display: "16.2-inch Liquid Retina XDR" } },
      { brand: "Apple", name: "MacBook Pro 14-inch M4 Pro (24GB RAM, 512GB SSD)", model: "MBP14-M4PRO", price: 1999, specs: { Processor: "Apple M4 Pro 12-Core", RAM: "24GB Unified", Storage: "512GB SSD", Display: "14.2-inch Liquid Retina XDR" } },
      { brand: "Apple", name: "MacBook Air 15-inch M3 (16GB RAM, 512GB SSD) - Midnight", model: "MBA15-M3-16", price: 1499, specs: { Processor: "Apple M3 8-Core", RAM: "16GB Unified", Storage: "512GB SSD", Display: "15.3-inch Liquid Retina" } },
      { brand: "Apple", name: "MacBook Air 13-inch M3 (16GB RAM, 256GB SSD) - Starlight", model: "MBA13-M3-16", price: 1099, specs: { Processor: "Apple M3 8-Core", RAM: "16GB Unified", Storage: "256GB SSD", Display: "13.6-inch Liquid Retina" } },
      { brand: "Dell", name: "Dell XPS 16 9640 OLED Touch (Intel Core Ultra 9, RTX 4070)", model: "XPS9640-U9", price: 2699, specs: { Processor: "Intel Core Ultra 9 185H", RAM: "32GB LPDDR5x", Storage: "1TB PCIe Gen4", Display: "16.3-inch 4K+ OLED Touch" } },
      { brand: "Dell", name: "Dell XPS 14 9440 (Intel Core Ultra 7, 16GB RAM, 512GB)", model: "XPS9440-U7", price: 1699, specs: { Processor: "Intel Core Ultra 7 155H", RAM: "16GB LPDDR5x", Storage: "512GB SSD", Display: "14.5-inch FHD+ InfinityEdge" } },
      { brand: "Dell", name: "Alienware m18 R2 Gaming Laptop (i9-14900HX, RTX 4090)", model: "AW-M18-R2", price: 3299, specs: { Processor: "Intel Core i9-14900HX", RAM: "64GB DDR5", Storage: "2TB RAID0 SSD", Graphics: "NVIDIA RTX 4090 16GB" } },
      { brand: "HP", name: "HP Spectre x360 16 2-in-1 OLED (Core Ultra 7, 32GB, 1TB)", model: "HP-SPEC16-U7", price: 1849, specs: { Processor: "Intel Core Ultra 7", RAM: "32GB LPDDR5x", Storage: "1TB Gen4 SSD", Display: "16-inch 2.8K OLED 120Hz Touch" } },
      { brand: "HP", name: "HP Omen Transcend 14 Gaming (Core Ultra 9, RTX 4070)", model: "HP-OMEN14-U9", price: 1999, specs: { Processor: "Intel Core Ultra 9 185H", RAM: "32GB RAM", Storage: "1TB SSD", Graphics: "NVIDIA GeForce RTX 4070" } },
      { brand: "HP", name: "HP EliteBook 840 G11 Business Notebook (Core Ultra 7, 16GB)", model: "HP-EB840-G11", price: 1399, specs: { Processor: "Intel Core Ultra 7 165U vPro", RAM: "16GB DDR5", Storage: "512GB Enterprise SSD", Security: "HP Wolf Pro Security" } },
      { brand: "Lenovo", name: "Lenovo ThinkPad X1 Carbon Gen 12 (Core Ultra 7, 32GB, 1TB)", model: "TP-X1C-G12", price: 2199, specs: { Processor: "Intel Core Ultra 7 165U", RAM: "32GB LPDDR5x", Storage: "1TB SSD", Weight: "1.09 kg Carbon Fiber Chassis" } },
      { brand: "Lenovo", name: "Lenovo Legion Pro 7i Gen 9 16-inch (i9-14900HX, RTX 4080)", model: "LEG-PRO7I-G9", price: 2599, specs: { Processor: "Intel Core i9-14900HX", RAM: "32GB DDR5", Storage: "2TB SSD", Graphics: "NVIDIA RTX 4080 12GB" } },
      { brand: "Lenovo", name: "Lenovo Yoga Book 9i Dual-Screen OLED 2-in-1 (16GB, 1TB)", model: "YOGA-BK9I", price: 1999, specs: { Processor: "Intel Core Ultra 7", RAM: "16GB LPDDR5x", Storage: "1TB SSD", Display: "Dual 13.3-inch 2.8K OLED" } },
      { brand: "ASUS", name: "ASUS ROG Zephyrus G16 OLED (Core Ultra 9, RTX 4080)", model: "ROG-G16-OLED", price: 2699, specs: { Processor: "Intel Core Ultra 9 185H", RAM: "32GB RAM", Storage: "1TB SSD", Display: "16-inch ROG Nebula OLED 240Hz" } },
      { brand: "ASUS", name: "ASUS Zenbook Duo UX8406 Dual 14-inch 3K OLED Touch", model: "UX8406-DUO", price: 1699, specs: { Processor: "Intel Core Ultra 9", RAM: "32GB LPDDR5x", Storage: "1TB SSD", Display: "Dual 14-inch 120Hz OLED" } },
      { brand: "ASUS", name: "ASUS ProArt P16 Creator Laptop 4K OLED (Ryzen AI 9, RTX 4070)", model: "PROART-P16", price: 2299, specs: { Processor: "AMD Ryzen AI 9 HX 370", RAM: "32GB RAM", Storage: "2TB SSD", Display: "16-inch 4K ASUS Lumina OLED" } },
      { brand: "Microsoft", name: "Surface Laptop 7th Edition 15-inch Copilot+ PC (Snapdragon X Elite)", model: "SURF-LAP7-15", price: 1699, specs: { Processor: "Snapdragon X Elite 12-Core", RAM: "16GB LPDDR5x", Storage: "512GB SSD", Battery: "Up to 22 Hours" } },
      { brand: "Microsoft", name: "Surface Pro 11th Edition OLED 2-in-1 + Flex Keyboard Bundle", model: "SURF-PRO11-OLED", price: 1799, specs: { Processor: "Snapdragon X Elite", RAM: "16GB RAM", Storage: "512GB SSD", Display: "13-inch PixelSense Flow OLED" } },
      { brand: "Razer", name: "Razer Blade 16 Gaming Laptop Dual-Mode Mini-LED (RTX 4090)", model: "RZ-BLADE16-4090", price: 3599, specs: { Processor: "Intel Core i9-14900HX", RAM: "32GB DDR5", Storage: "2TB NVMe", Graphics: "NVIDIA RTX 4090" } },
      { brand: "MSI", name: "MSI Stealth 18 AI Studio (Core Ultra 9, RTX 4080, 32GB)", model: "MSI-ST18-AI", price: 2499, specs: { Processor: "Intel Core Ultra 9 185H", RAM: "32GB DDR5", Storage: "1TB NVMe", Display: "18-inch UHD+ 120Hz MiniLED" } },
      { brand: "Acer", name: "Acer Swift Go 14 AI OLED Ultrabook (Core Ultra 7, 16GB, 1TB)", model: "ACER-SG14-AI", price: 999, specs: { Processor: "Intel Core Ultra 7 155H", RAM: "16GB LPDDR5x", Storage: "1TB SSD", Display: "14-inch 2.8K OLED 90Hz" } },
      { brand: "Samsung", name: "Samsung Galaxy Book4 Ultra 16-inch AMOLED (Core Ultra 9, RTX 4070)", model: "GB4-ULTRA-16", price: 2399, specs: { Processor: "Intel Core Ultra 9", RAM: "32GB RAM", Storage: "1TB SSD", Display: "16-inch Dynamic AMOLED 2X Touch" } },
    ],
  },
  phones: {
    images: [
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=900&q=80",
    ],
    items: [
      { brand: "Apple", name: "iPhone 16 Pro Max 512GB - Desert Titanium (Physical SIM + eSIM)", model: "IP16PM-512-DT", price: 1499, specs: { Storage: "512GB", Display: "6.9-inch Super Retina XDR ProMotion", Chip: "A18 Pro", SIM: "Physical Nano-SIM + eSIM" } },
      { brand: "Apple", name: "iPhone 16 Pro Max 256GB - Natural Titanium (Factory Unlocked)", model: "IP16PM-256-NT", price: 1249, specs: { Storage: "256GB", Display: "6.9-inch Super Retina XDR", Chip: "A18 Pro", Camera: "48MP Fusion + 5x Telephoto" } },
      { brand: "Apple", name: "iPhone 16 Pro 256GB - Black Titanium (Factory Unlocked)", model: "IP16P-256-BT", price: 1099, specs: { Storage: "256GB", Display: "6.3-inch ProMotion 120Hz", Chip: "A18 Pro", Warranty: "1-Year Apple + Harlow Forte" } },
      { brand: "Apple", name: "iPhone 16 Plus 256GB - Ultramarine (Physical SIM)", model: "IP16PL-256-UM", price: 999, specs: { Storage: "256GB", Display: "6.7-inch Super Retina XDR", Chip: "A18 Bionic", Battery: "All-Day 27hr Video Playback" } },
      { brand: "Apple", name: "iPhone 15 Pro Max 512GB - Natural Titanium", model: "IP15PM-512-NT", price: 1199, specs: { Storage: "512GB", Chip: "A17 Pro 3nm", Frame: "Grade 5 Titanium", Port: "USB-C 10Gb/s" } },
      { brand: "Apple", name: "iPad Pro 13-inch M4 OLED (512GB, Wi-Fi + 5G Cellular)", model: "IPAD-PRO13-M4", price: 1599, specs: { Chip: "Apple M4", Display: "13-inch Ultra Retina XDR Tandem OLED", Connectivity: "5G Cellular + Wi-Fi 6E", Storage: "512GB" } },
      { brand: "Samsung", name: "Samsung Galaxy S24 Ultra 5G (512GB, 12GB RAM) - Titanium Gray", model: "SM-S928B-512", price: 1299, specs: { Processor: "Snapdragon 8 Gen 3 for Galaxy", Camera: "200MP Quad Telephoto", Stylus: "Built-in S-Pen", SIM: "Dual Physical SIM + eSIM" } },
      { brand: "Samsung", name: "Samsung Galaxy Z Fold6 5G (512GB, 12GB RAM) - Crafted Black", model: "SM-F956B-512", price: 1799, specs: { MainDisplay: "7.6-inch Dynamic AMOLED 2X 120Hz", CoverDisplay: "6.3-inch 120Hz", RAM: "12GB", Durability: "IP48 Water Resistant + Armor Aluminum" } },
      { brand: "Samsung", name: "Samsung Galaxy Z Flip6 5G (256GB, 12GB RAM) - Mint", model: "SM-F741B-256", price: 999, specs: { MainDisplay: "6.7-inch Foldable AMOLED", FlexWindow: "3.4-inch Super AMOLED", Camera: "50MP Wide + 12MP Ultrawide", Battery: "4000mAh" } },
      { brand: "Samsung", name: "Samsung Galaxy S24+ 5G (256GB, 12GB RAM) - Onyx Black", model: "SM-S926B-256", price: 899, specs: { Display: "6.7-inch QHD+ Dynamic AMOLED 2X", RAM: "12GB", Storage: "256GB", Battery: "4900mAh Super Fast Charging" } },
      { brand: "Samsung", name: "Samsung Galaxy Tab S9 Ultra 14.6-inch AMOLED (512GB + S-Pen)", model: "SM-X910-512", price: 1149, specs: { Display: "14.6-inch Dynamic AMOLED 2X", Protection: "IP68 Water & Dust Resistant", Included: "In-box S-Pen", Storage: "512GB" } },
      { brand: "Google", name: "Google Pixel 9 Pro XL 5G (512GB, 16GB RAM) - Obsidian", model: "PIX9-PROXL-512", price: 1199, specs: { Processor: "Google Tensor G4", RAM: "16GB", Display: "6.8-inch Super Actua LTPO OLED", Camera: "50MP Main + 48MP 5x Telephoto" } },
      { brand: "Google", name: "Google Pixel 9 Pro Fold 5G (256GB, 16GB RAM) - Porcelain", model: "PIX9-FOLD-256", price: 1699, specs: { InnerDisplay: "8-inch Super Actua Flex OLED", OuterDisplay: "6.3-inch Actua", RAM: "16GB", AI: "Built-in Gemini Nano" } },
      { brand: "Google", name: "Google Pixel 9 5G (256GB, 12GB RAM) - Peony", model: "PIX9-256", price: 799, specs: { Processor: "Tensor G4", Display: "6.3-inch Actua 120Hz", Camera: "50MP Main + 48MP Ultrawide", Updates: "7 Years OS Upgrades" } },
      { brand: "OnePlus", name: "OnePlus 12 5G (512GB, 16GB RAM) - Flowy Emerald (100W SuperVOOC)", model: "OP12-512-EM", price: 849, specs: { Processor: "Snapdragon 8 Gen 3", RAM: "16GB LPDDR5X", Charging: "100W SuperVOOC (1-100% in 26 mins)", Camera: "4th Gen Hasselblad" } },
      { brand: "OnePlus", name: "OnePlus Open Apex Edition Foldable (1TB, 16GB RAM) - Crimson Shadow", model: "OP-OPEN-1TB", price: 1599, specs: { Storage: "1TB UFS 4.0", RAM: "16GB", Display: "7.82-inch 2K 120Hz ProXDR", Charger: "67W Fast Charger in Box" } },
      { brand: "Xiaomi", name: "Xiaomi 14 Ultra 5G Leica Quad-Camera (512GB, 16GB RAM)", model: "XM-14U-512", price: 1149, specs: { Camera: "Leica Summilux 1-inch Sensor Quad 50MP", Processor: "Snapdragon 8 Gen 3", Charging: "90W HyperCharge", RAM: "16GB" } },
      { brand: "Xiaomi", name: "Xiaomi Redmi Note 13 Pro+ 5G (512GB, 12GB RAM, 200MP, 120W)", model: "RN13-PROPLUS", price: 449, specs: { Camera: "200MP OIS Main", Charging: "120W HyperCharge Charger Included", Protection: "IP68 Waterproof", Storage: "512GB" } },
      { brand: "Nothing", name: "Nothing Phone (2) 5G Glyph Interface (512GB, 12GB RAM) - Dark Grey", model: "NTH-PH2-512", price: 649, specs: { Interface: "Programmable LED Glyph Back", Display: "6.7-inch LTPO OLED 120Hz", Processor: "Snapdragon 8+ Gen 1", Storage: "512GB" } },
      { brand: "ASUS", name: "ASUS ROG Phone 8 Pro Gaming Smartphone (512GB, 16GB, 165Hz)", model: "ROG-PH8-PRO", price: 1199, specs: { Display: "6.78-inch 165Hz Samsung AMOLED", Processor: "Snapdragon 8 Gen 3", Battery: "5500mAh Dual-Cell", Triggers: "AirTrigger Ultrasonic Buttons" } },
      { brand: "Honor", name: "Honor Magic V3 Ultra-Slim Foldable 5G (512GB, 12GB RAM)", model: "HNR-MV3-512", price: 1649, specs: { Thickness: "9.2mm Folded / 4.35mm Unfolded", Battery: "5150mAh Silicon-Carbon", Charging: "66W Wired + 50W Wireless", Processor: "Snapdragon 8 Gen 3" } },
      { brand: "Sony", name: "Sony Xperia 1 VI 4K Creator Smartphone (256GB, Snapdragon 8 Gen 3)", model: "XPERIA-1M6", price: 1249, specs: { Camera: "85-170mm True Optical Telephoto Zoom", Audio: "3.5mm Hi-Res Jack + Front Stereo", Battery: "5000mAh 2-Day Life", Storage: "256GB + microSD" } },
    ],
  },
  tvs: {
    images: [
      "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1461151304267-38535e780c79?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1509281373149-e957c6296406?auto=format&fit=crop&w=900&q=80",
    ],
    items: [
      { brand: "LG", name: "LG OLED evo C4 65-inch 4K Smart TV (144Hz Gaming, Dolby Vision)", model: "OLED65C4PUA", price: 1699, specs: { Panel: "4K Self-Lit OLED evo", Processor: "Alpha 9 AI Processor Gen7", Gaming: "4x HDMI 2.1, 144Hz VRR, G-Sync", Voltage: "100-240V Nigeria Ready" } },
      { brand: "LG", name: "LG OLED evo G4 77-inch Gallery Edition 4K TV (One Wall Design)", model: "OLED77G4SUB", price: 3299, specs: { Panel: "77-inch Brightness Booster Max MLA OLED", Processor: "Alpha 11 AI Processor", Mount: "Zero-Gap Flush Wall Mount Included", Audio: "Dolby Atmos AI Sound Pro" } },
      { brand: "LG", name: "LG QNED85 86-inch 4K Mini-LED Smart WebOS Cinema TV", model: "86QNED85T", price: 2199, specs: { ScreenSize: "86-inch Giant Screen", Panel: "Quantum Dot NanoCell Mini-LED", RefreshRate: "120Hz Native", SmartOS: "webOS 24 + Magic Remote" } },
      { brand: "LG", name: "LG StanbyME 27-inch Rollable Wireless Touch Smart Screen", model: "27ART10AKPL", price: 949, specs: { Mobility: "Built-in 3-Hour Battery & Hidden Wheels", Screen: "27-inch Swivel & Tilt Touchscreen", Connectivity: "AirPlay 2, NFC, HDMI, USB", Design: "Fabric-Clad Lifestyle Stand" } },
      { brand: "Samsung", name: "Samsung 75-inch Neo QLED 8K QN900D Infinity Air Design TV", model: "QN75QN900D", price: 4299, specs: { Resolution: "Real 8K (7680 x 4320) AI Upscaling Pro", Processor: "NQ8 AI Gen3", Motion: "Motion Xcelerator 240Hz", Box: "Slim One Connect Box" } },
      { brand: "Samsung", name: "Samsung 65-inch S95D OLED 4K Glare-Free Smart TV (2025/2026)", model: "QN65S95D", price: 2499, specs: { Panel: "QD-OLED with OLED Glare-Free Coating", RefreshRate: "144Hz 4K HDMI 2.1", Audio: "70W 4.2.2ch Object Tracking Sound+", Design: "11mm LaserSlim Profile" } },
      { brand: "Samsung", name: "Samsung The Frame 65-inch QLED 4K Matte Art Mode Smart TV", model: "QN65LS03D", price: 1599, specs: { Display: "Matte Anti-Reflection QLED Art Display", Feature: "Pantone Validated Art Mode", Mount: "Slim Fit Wall Mount Included", SmartOS: "Tizen OS + SmartThings Hub" } },
      { brand: "Samsung", name: "Samsung The Premiere 4K Ultra Short Throw Triple Laser Projector", model: "SP-LSP9TFAX", price: 3499, specs: { Projection: "Up to 130-inch 4K HDR10+ from 11cm away", Brightness: "2800 ANSI Lumens Triple Laser", Audio: "Built-in 40W 4.2ch Acoustic Beam", LampLife: "20,000+ Hours" } },
      { brand: "Sony", name: "Sony BRAVIA 9 75-inch XR Mini-LED 4K HDR Google TV", model: "K-75XR90", price: 3199, specs: { Backlight: "XR Backlight Master Drive High Peak Luminance", Audio: "Acoustic Multi-Audio+ with Beam Tweeters", Gaming: "Perfect for PlayStation 5 Auto HDR", OS: "Google TV with Voice Control" } },
      { brand: "Sony", name: "Sony BRAVIA 8 65-inch XR OLED 4K Smart Google TV", model: "K-65XR80", price: 1999, specs: { Panel: "XR Contrast Booster OLED", Sound: "Acoustic Surface Audio+ (Screen is the Speaker)", Cinema: "IMAX Enhanced & Dolby Vision", Voltage: "220-240V AC" } },
      { brand: "Sony", name: "Sony BRAVIA XR A95L 65-inch Master Series QD-OLED 4K TV", model: "XR-65A95L", price: 2699, specs: { Panel: "Flagship Master Series QD-OLED", Camera: "BRAVIA Cam Included", Gaming: "4K 120Hz + VRR + ALLM", Color: "XR Triluminos Max" } },
      { brand: "Hisense", name: "Hisense 100-inch U8K 4K Mini-LED ULED 144Hz Giant Home Theater TV", model: "100U8K-NG", price: 2899, specs: { Size: "100-inch Commercial/Cinema Grade", Brightness: "1500+ Nits Local Dimming Mini-LED", Audio: "2.1.2 Multi-Channel Dolby Atmos", Warranty: "2-Year Official Nigeria Warranty" } },
      { brand: "Hisense", name: "Hisense 75-inch U7N Mini-LED Pro 144Hz 4K Smart VIDA/Google TV", model: "75U7N", price: 1199, specs: { Panel: "Mini-LED Pro with Quantum Dot", Gaming: "144Hz Game Mode Pro + FreeSync Premium", HDR: "Dolby Vision IQ & HDR10+ Adaptive", Subwoofer: "Built-in Rear Subwoofer" } },
      { brand: "Hisense", name: "Hisense 65-inch A7N 4K UHD Frameless Smart TV (Dolby Vision)", model: "65A7N", price: 649, specs: { Resolution: "4K Ultra HD Direct Full Array", Smart: "Built-in Vidaa / Netflix / YouTube / DSTV App", Audio: "DTS Virtual:X", Connectivity: "Dual-Band Wi-Fi + Bluetooth 5.0" } },
      { brand: "TCL", name: "TCL 98-inch QM851G 4K QD-Mini LED 5000-Nit Flagship Smart TV", model: "98QM851G", price: 3399, specs: { Dimming: "5000+ Local Dimming Zones", PeakBrightness: "Up to 5000 Nits HDR", Audio: "Onkyo 2.1.2ch Speaker System with Subwoofer", RefreshRate: "144Hz VRR" } },
      { brand: "TCL", name: "TCL 65-inch C855 Premium QD-Mini LED 144Hz 4K Google TV", model: "65C855", price: 1149, specs: { Display: "QD-Mini LED 4K 144Hz", Sound: "Onkyo 60W Dolby Atmos Sound", HDR: "HDR10+, Dolby Vision IQ, IMAX Enhanced", Design: "Ultra-Slim Uni-Body" } },
      { brand: "TCL", name: "TCL 55-inch C655 QLED Pro 4K UHD Google Smart TV", model: "55C655", price: 529, specs: { Panel: "QLED Pro 95% DCI-P3 Color Gamut", Processor: "AiPQ Pro Processor", Gaming: "120Hz Game Accelerator", Audio: "Onkyo 2.1ch with Subwoofer" } },
      { brand: "Epson", name: "Epson Pro Cinema LS12000 4K PRO-UHD Laser Home Theater Projector", model: "V11HA47020", price: 3999, specs: { Technology: "3LCD True 3-Chip 4K PRO-UHD", RefreshRate: "4K at 120fps Gaming Support", Brightness: "2700 Lumens Color & White", Lens: "Motorized 2.1x Zoom & Lens Shift" } },
      { brand: "XGIMI", name: "XGIMI Horizon Ultra 4K Dolby Vision Dual-Light Smart Projector", model: "XG-HZ-ULTRA", price: 1599, specs: { LightSource: "Laser + LED Dual Light (2300 ISO Lumens)", Audio: "Harman Kardon 24W Speakers", Setup: "Intelligent Screen Obstacle Avoidance & Auto Focus", OS: "Android TV 11" } },
      { brand: "Apple", name: "Apple TV 4K (3rd Gen) 128GB Wi-Fi + Gigabit Ethernet + Siri Remote", model: "MN893LL/A", price: 169, specs: { Chip: "A15 Bionic", Storage: "128GB", SmartHome: "Built-in Thread Border Router & Matter Hub", HDR: "Dolby Vision & HDR10+" } },
    ],
  },
  audio: {
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=900&q=80",
    ],
    items: [
      { brand: "Sony", name: "Sony WH-1000XM5 Wireless Industry-Leading Noise Canceling Headphones", model: "WH1000XM5/B", price: 349, specs: { ANC: "8 Microphones + Dual Processor Auto NC", Battery: "30 Hours (3 min charge = 3 hrs playback)", Audio: "LDAC Hi-Res Wireless", Calls: "Precise Voice Pickup Technology" } },
      { brand: "Sony", name: "Sony WF-1000XM5 True Wireless Noise Canceling Earbuds", model: "WF1000XM5/B", price: 269, specs: { Driver: "Dynamic Driver X", ANC: "Integrated Processor V2 + QN2e", Battery: "8 Hours Earbuds + 16 Hours Case", Resistance: "IPX4 Water Resistant" } },
      { brand: "Sony", name: "Sony Bravia Theater Quad Flagship 16-Speaker Wireless Surround System", model: "HT-A9M2", price: 2199, specs: { Technology: "360 Spatial Sound Mapping (16 Drivers)", Channels: "4 Wireless Slim Speakers", Support: "Dolby Atmos, DTS:X, IMAX Enhanced", HDMI: "HDMI 2.1 8K / 4K120 Pass-Through" } },
      { brand: "Apple", name: "AirPods Max (USB-C 2024 Edition) - Midnight", model: "AP-MAX-USBC", price: 549, specs: { Audio: "Apple H1 Dual Chips + Personalized Spatial Audio", ANC: "Pro-Level Active Noise Cancellation + Transparency", Port: "USB-C Charging", Build: "Anodized Aluminum Cups & Knit Mesh Canopy" } },
      { brand: "Apple", name: "AirPods Pro 2 (USB-C MagSafe Case with Hearing Health & Lossless)", model: "MTJV3AM/A", price: 249, specs: { Chip: "Apple H2 + U1 Case Finder", ANC: "2x Active Noise Cancellation + Adaptive Audio", Resistance: "IP54 Dust, Sweat & Water Resistant", Battery: "Up to 30 Hours Total" } },
      { brand: "Apple", name: "Apple HomePod (2nd Generation) High-Fidelity Smart Speaker - Midnight", model: "MQJ73LL/A", price: 299, specs: { Woofer: "4-inch High-Excursion Woofer + 5 Horn Tweeters", Spatial: "Room Sensing + Dolby Atmos Spatial Audio", Pairing: "Stereo Pair & Apple TV eARC Home Theater", Smart: "Temperature & Humidity Sensor Built-in" } },
      { brand: "Bose", name: "Bose QuietComfort Ultra Wireless Noise Cancelling Headphones", model: "BOSE-QC-ULTRA", price: 429, specs: { Audio: "Bose Immersive Spatial Audio + CustomTune", Modes: "Quiet, Aware & Immersion Modes", Battery: "24 Hours USB-C", Connectivity: "Bluetooth 5.3 Multipoint + Snapdragon Sound" } },
      { brand: "Bose", name: "Bose Smart Ultra Dolby Atmos Soundbar with AI Dialogue Mode", model: "BOSE-SB-ULTRA", price: 899, specs: { Speakers: "9 Speakers including 2 Upward-Firing Dipole Transducers", Feature: "AI Dialogue Mode for Crystal-Clear Vocals", Calibration: "ADAPTiQ Audio Room Calibration", Voice: "Works with AirPlay 2, Chromecast, Spotify Connect" } },
      { brand: "Bose", name: "Bose SoundLink Max Portable Heavy-Duty Bluetooth Speaker", model: "BOSE-SL-MAX", price: 399, specs: { Rating: "IP67 Waterproof, Dustproof & Floats", Battery: "20 Hours + USB-C Phone Charging Out", Audio: "Articulated Array Stereo + Deep Bass", Handle: "Removable Climbing Rope Handle" } },
      { brand: "Sonos", name: "Sonos Arc Ultra 9.1.4 Sound Motion Dolby Atmos Soundbar", model: "SONOS-ARC-U", price: 999, specs: { Architecture: "14 Sonos-Engineered Drivers + Sound Motion Woofer", Channels: "9.1.4 Spatial Audio Experience", Tuning: "Trueplay Room Tuning (iOS & Android)", Control: "HDMI eARC, Wi-Fi, Bluetooth, AirPlay 2" } },
      { brand: "Sonos", name: "Sonos Era 300 Spatial Audio Dolby Atmos Smart Speaker", model: "SONOS-ERA300", price: 449, specs: { Drivers: "6 Class-D Amplifiers Projecting Sound Left, Right, Forward & Up", Connectivity: "Wi-Fi 6, Bluetooth 5.0, USB-C Line-In", Pairing: "Pairs with Sonos Arc for 7.1.4 Rear Surrounds", Color: "Matte Black / White" } },
      { brand: "Sonos", name: "Sonos Sub 4 Wireless Dual-Force-Cancelling Subwoofer", model: "SONOS-SUB4", price: 799, specs: { Design: "Zero-Buzz Dual Force-Cancelling Woofers", Finish: "Updated Matte Finish", Placement: "Stand Upright or Lay Flat Under Sofa", Connection: "1-Button Wi-Fi Sync with Sonos Soundbars" } },
      { brand: "JBL", name: "JBL PartyBox Ultimate 1100W Wi-Fi & Bluetooth Dolby Atmos Party Speaker", model: "JBL-PB-ULT", price: 1499, specs: { Power: "Massive 1100W RMS Original JBL Pro Sound", Drivers: "Dual 9-inch Subwoofers + Dual Midrange + Tweeters", Effects: "Multi-Dimensional Starry Lightshow + DJ Pad", Protection: "IPX4 Splashproof + Sturdy Wheels" } },
      { brand: "JBL", name: "JBL Bar 1300X 11.1.4-Channel Soundbar with Detachable Wireless Surrounds", model: "JBL-BAR1300X", price: 1399, specs: { Power: "1170W Total Output Power", Subwoofer: "12-inch Wireless Down-Firing Subwoofer", Surrounds: "2 Battery-Powered Detachable Rear Speakers", Audio: "True Dolby Atmos, DTS:X & MultiBeam" } },
      { brand: "JBL", name: "JBL Boombox 3 Wi-Fi & Bluetooth Portable Speaker (24-Hr Battery)", model: "JBL-BB3-WIFI", price: 449, specs: { Sound: "3-Way Speakers with Built-in Subwoofer", Connectivity: "Wi-Fi (Dolby Atmos 3D) + Bluetooth 5.3", Durability: "IP67 Waterproof & Dustproof", Battery: "24 Hours + Built-in Powerbank" } },
      { brand: "Sennheiser", name: "Sennheiser Momentum 4 Wireless Audiophile Headphones (60-Hr Battery)", model: "SENN-M4-BLK", price: 329, specs: { Battery: "Unmatched 60 Hours Playback with ANC On", Transducer: "42mm Audiophile Driver System", Codecs: "aptX Adaptive, AAC, SBC", Comfort: "Lightweight Padded Headband & Deep Cushions" } },
      { brand: "Sennheiser", name: "Sennheiser AMBEO Soundbar Plus 7.1.4 Immersive 3D Home Theater Bar", model: "SENN-AMBEO-PL", price: 1299, specs: { Drivers: "9 High-End Drivers including Dual 4-inch Subwoofers", Virtualization: "AMBEO 3D 7.1.4 Virtualization developed with Fraunhofer", Calibration: "Automatic 4-Mic Room Self-Calibration", Ports: "HDMI eARC + 2x HDMI 2.0a Inputs" } },
      { brand: "Marshall", name: "Marshall Woburn III Bluetooth Home Speaker (Iconic Vintage Amp Design)", model: "MRSH-WOB3", price: 579, specs: { Amp: "90W Class D Woofer + Dual 15W Mids + Dual 15W Tweeters", Inputs: "Bluetooth 5.2, HDMI ARC (for TV), RCA & 3.5mm", Controls: "Brass Analog Bass, Treble & Volume Knobs", Eco: "70% Recycled PVC-Free Vegan Build" } },
      { brand: "Harman Kardon", name: "Harman Kardon Aura Studio 4 360-Degree Bluetooth Speaker with Ambient Dome", model: "HK-AURA4", price: 329, specs: { Subwoofer: "5.2-inch Down-Firing Subwoofer + 6-Speaker Array", Lighting: "5 Animated Diamond-Effect Ambient Light Themes", Design: "Iconic Transparent Tinted Dome", Controls: "Touch-Sensitive Rim" } },
      { brand: "Bang & Olufsen", name: "Bang & Olufsen Beosound A9 5th Gen Iconic Room-Filling Wireless Speaker", model: "BO-A9-GEN5", price: 3499, specs: { Power: "1500 Watts Total Across 7 Custom Drivers", Materials: "Solid Oak Legs, Pearl-Blasted Aluminum & Kvadrat Wool", RoomCompensation: "Active Room Compensation", Streaming: "Mozart Platform (AirPlay 2, Chromecast, Tidal, B&O Radio)" } },
    ],
  },
  gaming: {
    images: [
      "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1607853202273-797f1c22a38e?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1592840496694-26d035b52b48?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?auto=format&fit=crop&w=900&q=80",
    ],
    items: [
      { brand: "Sony", name: "PlayStation 5 Pro Console (2TB SSD, PSSR AI Upscaling, Wi-Fi 7)", model: "CFI-7000B01", price: 799, specs: { Storage: "2TB Ultra-High Speed Custom SSD", GPU: "Upgraded 67% More Compute Units + Advanced Ray Tracing", Upscaling: "PlayStation Spectral Super Resolution (PSSR)", Included: "DualSense Wireless Controller + Astro's Playroom" } },
      { brand: "Sony", name: "PlayStation 5 Slim Disc Edition 1TB + Extra DualSense Controller Bundle", model: "CFI-2000A-BND", price: 599, specs: { Storage: "1TB Custom NVMe SSD", Drive: "4K UHD Blu-ray Disc Drive Attached", Controllers: "2x Official DualSense Wireless Controllers", Output: "4K 120Hz HDMI 2.1 + Tempest 3D AudioTech" } },
      { brand: "Sony", name: "PlayStation Portal Remote Player 8-inch 1080p 60fps Handheld", model: "CFI-Y1001", price: 229, specs: { Screen: "8-inch Full HD 1080p 60fps LCD", Features: "Full DualSense Adaptive Triggers & Haptic Feedback", Connectivity: "PS5 Wi-Fi Remote Play + Cloud Streaming Support", Port: "USB-C + 3.5mm Audio" } },
      { brand: "Sony", name: "PlayStation VR2 Horizon Call of the Mountain Bundle (4K HDR OLED)", model: "CFI-ZVR1BX", price: 549, specs: { Display: "2000 x 2040 Per Eye 120Hz OLED", Tracking: "4 Integrated Cameras + IR Eye Tracking + Headset Feedback", Controllers: "PS VR2 Sense Left & Right Controllers Included", Cable: "Single USB-C Plug-and-Play to PS5" } },
      { brand: "Sony", name: "Sony DualSense Edge Pro Customizable Wireless Controller + Carrying Case", model: "CFI-ZCP1", price: 199, specs: { Customization: "Swappable Stick Caps, Remappable Back Paddles & Trigger Stops", Modules: "Replaceable Stick Modules", Extras: "Braided Locking USB-C Cable + Hard Shell Case", Compatibility: "PS5 & PC" } },
      { brand: "Microsoft", name: "Xbox Series X 2TB Galaxy Black Special Edition Disc Console", model: "RRT-00051-2TB", price: 649, specs: { Storage: "2TB Custom NVMe Velocity Architecture SSD", Performance: "12 Teraflops RDNA 2 True 4K 120FPS", Finish: "Galaxy Black Celestial Effect + Velocity Green Base", Drive: "4K UHD Blu-Ray Optical Drive" } },
      { brand: "Microsoft", name: "Xbox Series S 1TB Carbon Black All-Digital Next-Gen Console", model: "XXU-00001-1TB", price: 379, specs: { Storage: "1TB Custom SSD (Double Standard Series S)", Resolution: "1440p up to 120FPS + 4K Media Streaming", Feature: "Quick Resume for Multiple Games", Size: "Ultra-Compact Travel-Friendly Footprint" } },
      { brand: "Microsoft", name: "Xbox Elite Wireless Controller Series 2 Complete Component Pack", model: "FST-00008", price: 179, specs: { Tension: "Adjustable-Tension Thumbsticks + 4 Rear Paddles", Battery: "Up to 40 Hours + Charging Dock in Case", Profiles: "Save 3 Custom Profiles on Controller", Connectivity: "Xbox Wireless, Bluetooth & USB-C" } },
      { brand: "Nintendo", name: "Nintendo Switch OLED Model (White Joy-Con, 64GB, LAN Dock)", model: "HEG-S-KAAAA", price: 349, specs: { Screen: "7-inch Vibrant OLED Screen", Stand: "Wide Adjustable Tabletop Stand", Dock: "Includes Wired LAN Ethernet Port for Stable Online Play", Storage: "64GB Internal + microSDXC Expandable" } },
      { brand: "Nintendo", name: "Nintendo Switch OLED Mario Red Edition + Super Mario Bros. Wonder", model: "HEG-S-RAAAD", price: 389, specs: { Edition: "Limited Mario Red Dock with Hidden Coin Detail", Screen: "7-inch OLED Handheld / TV Hybrid", Audio: "Enhanced Onboard Stereo Speakers", Bundle: "Includes Full Game Download / Cartridge" } },
      { brand: "Valve", name: "Steam Deck OLED 1TB Limited Edition (Anti-Glare Etched Glass + Dual Case)", model: "SD-OLED-1TB", price: 699, specs: { Screen: "7.4-inch 90Hz 1000-Nit HDR OLED (Anti-Glare Glass)", Storage: "1TB NVMe SSD + High-Speed microSD Slot", Battery: "50Wh Battery (3–12 Hours Gameplay)", Connectivity: "Wi-Fi 6E + Bluetooth 5.3 Dedicated Antenna" } },
      { brand: "ASUS", name: "ASUS ROG Ally X Handheld Gaming PC (Ryzen Z1 Extreme, 24GB RAM, 1TB, 80Wh)", model: "RC72LA-ALLYX", price: 849, specs: { APU: "AMD Ryzen Z1 Extreme 8-Core/16-Thread", Memory: "24GB LPDDR5X-7500 RAM + 1TB M.2 2280 SSD", Battery: "Massive 80Wh Battery (Double Original Ally)", Ports: "Dual USB-C (1x USB4 Thunderbolt Compatible)" } },
      { brand: "Lenovo", name: "Lenovo Legion Go 8.8-inch QHD+ 144Hz Handheld Gaming PC (Detaching Controllers)", model: "83E10000US", price: 749, specs: { Display: "8.8-inch 2560x1600 144Hz PureSight Touch", Processor: "AMD Ryzen Z1 Extreme + 16GB RAM + 1TB SSD", Controllers: "Detachable TrueStrike Hall-Effect Controllers + FPS Mouse Mode", Stand: "Built-in Kickstand" } },
      { brand: "Meta", name: "Meta Quest 3 512GB Mixed Reality Wireless VR Headset", model: "META-Q3-512", price: 549, specs: { Processor: "Snapdragon XR2 Gen 2 (2x GPU Power of Quest 2)", Lenses: "4K+ Infinite Display Pancake Optics", Passthrough: "Full-Color High-Res Mixed Reality Passthrough", Storage: "512GB" } },
      { brand: "Meta", name: "Meta Quest 3S 256GB All-in-One VR & Mixed Reality Headset", model: "META-Q3S-256", price: 399, specs: { Chip: "Snapdragon XR2 Gen 2 + 8GB RAM", Storage: "256GB", Controllers: "Touch Plus Ring-Free Haptic Controllers", Library: "Backwards Compatible with All Quest Apps & PCVR Link" } },
      { brand: "Logitech", name: "Logitech G29 / G923 TRUEFORCE Racing Wheel & Floor Pedals (PS5/PC)", model: "941-000147", price: 379, specs: { ForceFeedback: "Next-Gen TRUEFORCE High-Definition Haptics", Wheel: "Hand-Stitched Leather Wheel + Brushed Metal Paddle Shifters", Pedals: "Progressive Brake Pedal + Clutch + Gas", LaunchControl: "Dual-Clutch Programmable Launch Assist" } },
      { brand: "Logitech", name: "Logitech G PRO X Superlight 2 Wireless Esports Gaming Mouse + G915 TKL Combo", model: "LOGI-PRO-CMB", price: 349, specs: { MouseWeight: "60g Ultra-Lightweight HERO 2 32K Sensor", Switches: "LIGHTFORCE Hybrid Optical-Mechanical", Keyboard: "Low-Profile GL Tactile LIGHTSPEED Wireless", PollRate: "Up to 4000Hz Wireless Polling" } },
      { brand: "Razer", name: "Razer BlackShark V2 Pro Wireless Esports Headset (2024 PS5/PC Edition)", model: "RZ04-045301", price: 199, specs: { Drivers: "Razer TriForce Titanium 50mm Drivers", Mic: "HyperClear Super Wideband Detachable Boom Mic", Battery: "Up to 70 Hours + Type-C Fast Charge", Profiles: "On-Headset Call of Duty / Apex / Valorant Pro Audio Profiles" } },
      { brand: "SteelSeries", name: "SteelSeries Arctis Nova Pro Wireless Multi-System Gaming Headset (Hot-Swap Batteries)", model: "61520-NOVA", price: 349, specs: { BatterySystem: "Infinity Power System (2 Hot-Swappable Batteries Included)", DAC: "OLED Wireless Base Station with Dual USB (PS5 + PC Simultaneously)", Audio: "Active Noise Cancellation + Simultaneous 2.4GHz & Bluetooth", Drivers: "Neodymium Magnetic Hi-Res Drivers" } },
      { brand: "Elgato", name: "Elgato 4K X External Capture Card (4K144 HDR10 HDMI 2.1) + Stream Deck MK.2 Bundle", model: "ELG-4KX-BUNDLE", price: 369, specs: { Capture: "Up to 4K144 or 1080p240 VRR Passthrough & Capture", Interface: "USB 3.2 Gen 2 10Gbps Type-C", StreamDeck: "15 Customizable LCD Keys for OBS, Twitch, YouTube & Macros", Compatibility: "PS5, Xbox, Switch, PC, Mac & iPad" } },
    ],
  },
  smart_home_power: {
    images: [
      "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1544717302-de2939b7ef71?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=900&q=80",
    ],
    items: [
      { brand: "Starlink", name: "Starlink Standard Actuated / Gen 3 Flat High-Speed Satellite Internet Kit (Nigeria Ready)", model: "STL-KIT-GEN3", price: 499, specs: { Speed: "Up to 250+ Mbps Download anywhere in Nigeria", Router: "Wi-Fi 6 Tri-Band Router with 2 Latching Ethernet Ports", Weather: "IP67 Heavy Rain & Heat Rated Dish", Cable: "15m Starlink Cable + Kickstand + Power Supply" } },
      { brand: "Starlink", name: "Starlink Mini Compact Portable Kit with Built-in Wi-Fi Router (DC / Powerbank Ready)", model: "STL-MINI-KIT", price: 399, specs: { Size: "Fits in a Backpack (1.1 kg)", Power: "Runs on 20–40W (Can run off 100W USB-C PD Power Bank)", Speed: "100+ Mbps Low-Latency Satellite Internet", Router: "Integrated Wi-Fi Router Inside Dish" } },
      { brand: "EcoFlow", name: "EcoFlow DELTA 2 Max 2048Wh LFP Portable Power Station (2400W AC Output for Home/Office)", model: "EF-DELTA2-MAX", price: 1399, specs: { Capacity: "2048Wh (Expandable up to 6kWh)", Output: "2400W Pure Sine Wave (X-Boost 3400W) — Runs Fridges, TVs, Laptops", BatteryChemistry: "LiFePO4 (3000+ Cycles / 10 Years Daily Use)", Recharge: "0–80% in 43 Mins via AC + Solar Dual Input" } },
      { brand: "EcoFlow", name: "EcoFlow DELTA Pro 3600Wh Whole-Home Backup Power Station (3600W AC Output)", model: "EF-DELTA-PRO", price: 2499, specs: { Capacity: "3600Wh LFP Battery", Output: "3600W AC (Surge 7200W) — Powers 1.5HP AC, Freezer & Office", Mobility: "Heavy-Duty Wheels & Telescopic Handle", Control: "EcoFlow Smart App via Wi-Fi & Bluetooth" } },
      { brand: "EcoFlow", name: "EcoFlow RIVER 2 Pro 768Wh Portable Power Station (800W Output, 70-Min Full Charge)", model: "EF-RIVER2-PRO", price: 549, specs: { Capacity: "768Wh LiFePO4", Output: "800W AC (X-Boost 1600W) + 100W USB-C Laptop Port", RechargeSpeed: "0–100% in just 70 Minutes on NEPA/Generator", Weight: "Only 7.8 kg — Ideal for Remote Work & Starlink" } },
      { brand: "Bluetti", name: "Bluetti AC200L 2048Wh Expandable LiFePO4 Power Station (2400W Inverter)", model: "BLU-AC200L", price: 1349, specs: { Capacity: "2048Wh LiFePO4 (3500+ Life Cycles)", Inverter: "2400W Pure Sine Wave + 3600W Power Lifting Mode", UPS: "20ms Seamless Uninterruptible Power Supply Switchover", Solar: "Supports up to 1200W Solar Input" } },
      { brand: "Anker", name: "Anker SOLIX F2000 (PowerHouse 767) 2048Wh GaNPrime Portable Power Station", model: "ANK-F2000", price: 1449, specs: { Technology: "GaNPrime Cooler & Higher Efficiency Inverter", Capacity: "2048Wh LFP with 2400W AC Output", Design: "Drop-Proof Unibody with All-Terrain Wheels", Warranty: "Anker 5-Year InfiniPower Design" } },
      { brand: "Anker", name: "Anker Prime 27,650mAh (250W) Smart Display Laptop Power Bank + Charging Base", model: "ANK-A1340", price: 189, specs: { Capacity: "27,650mAh (99.54Wh TSA Airline Approved)", Output: "250W Total (Dual 140W USB-C PD 3.1 for MacBook Pro 16)", SmartApp: "Bluetooth App Locator & Real-Time Wattage OLED Screen", Included: "100W Pogo-Pin Desktop Charging Base" } },
      { brand: "Dyson", name: "Dyson V15 Detect Absolute Cordless Laser Vacuum Cleaner", model: "DYS-V15-ABS", price: 699, specs: { Laser: "Fluffy Optic Cleaner Head Reveals Microscopic Dust", Sensor: "Piezo Sensor Counts & Sizes Dust Particles on LCD Screen", Suction: "240 AW Hyperdymium Motor", Runtime: "Up to 60 Minutes Fade-Free Power" } },
      { brand: "Dyson", name: "Dyson Purifier Cool Formaldehyde TP09 Smart Air Purifier & Tower Fan", model: "DYS-TP09-GLD", price: 649, specs: { Filtration: "HEPA H13 + Catalytic Filter Destroys Formaldehyde Continuously", AirMultiplier: "Projects 290 Liters of Purified Cooling Air Per Second", Smart: "Dyson Link App + Voice Control (Siri/Alexa)", Voltage: "220–240V Official Spec" } },
      { brand: "Dyson", name: "Dyson Airwrap Multi-Styler Complete Long (220V–240V Nigerian Spec)", model: "DYS-AW-LONG", price: 599, specs: { Voltage: "220V–240V UK/Nigeria 3-Pin Plug Ready", Technology: "Coanda Airflow Styling without Extreme Heat", Attachments: "6 Engineered Barrels, Brushes & Coanda Smoothing Dryer", Case: "Prussian Blue Presentation Case Included" } },
      { brand: "Roborock", name: "Roborock S8 MaxV Ultra Robot Vacuum & Sonic Mop with Self-Washing/Drying Dock", model: "RBR-S8-MAXV", price: 1299, specs: { Suction: "10,000Pa HyperForce Suction + FlexiArm Corner Brush", Dock: "8-in-1 RockDock Ultra (Auto-Empty, Hot Water Mop Wash & Heated Dry)", AI: "Reactive AI 2.0 Obstacle Recognition + Pet Camera", Mop: "VibraRise 3.0 Sonic Mopping (Lifts on Carpets)" } },
      { brand: "DJI", name: "DJI Air 3S Fly More Combo Drone (RC 2 Screen Controller, 3 Batteries, 1-Inch CMOS)", model: "DJI-AIR3S-FMC", price: 1599, specs: { Camera: "Dual Primary Cameras (1-inch CMOS 50MP Wide + 70mm 3x Medium Tele)", FlightTime: "45 Minutes Max Per Battery (3 Batteries Included)", ObstacleSensing: "Nightscape Omnidirectional LiDAR + Vision Sensing", Transmission: "DJI O4 20km 1080p/60fps Video Transmission" } },
      { brand: "DJI", name: "DJI Osmo Pocket 3 Creator Combo (1-Inch CMOS 4K/120fps Gimbal + DJI Mic 2)", model: "DJI-POCKET3-CC", price: 699, specs: { Sensor: "1-inch CMOS Sensor 4K/120fps + 10-Bit D-Log M", Screen: "2-inch Rotatable OLED Touchscreen (Horizontal & Vertical)", Audio: "Includes Wireless Clip-On DJI Mic 2 Transmitter", Extras: "Battery Handle, Wide-Angle Lens, Mini Tripod & Carrying Bag" } },
      { brand: "GoPro", name: "GoPro HERO13 Black Creator Edition Bundle (Volta Grip, Media Mod, Light Mod)", model: "CHDFB-131", price: 599, specs: { Video: "5.3K60 & 4K120 HLG HDR Video + HyperSmooth 6.0", Lenses: "Compatible with HB-Series Auto-Detect Macro & Ultra-Wide Lenses", Battery: "1900mAh Enduro Battery + Volta 4K 5-Hour Battery Grip", Waterproof: "10m (33ft) Waterproof Without Housing" } },
      { brand: "Canon", name: "Canon EOS R6 Mark II Mirrorless Camera with RF 24-105mm f/4L IS USM Lens", model: "CAN-R6M2-24105L", price: 3199, specs: { Sensor: "24.2MP Full-Frame CMOS + DIGIC X", Video: "6K 60p RAW External / 4K 60p 10-Bit Internal Oversampled", Autofocus: "Dual Pixel CMOS AF II (40fps Electronic Shutter)", Stabilization: "Up to 8-Stop In-Body Image Stabilizer" } },
      { brand: "Sony", name: "Sony Alpha a7 IV Full-Frame Hybrid Camera with 28-70mm Lens Kit", model: "ILCE7M4K/B", price: 2599, specs: { Sensor: "33MP Exmor R Back-Illuminated Full-Frame CMOS", Video: "4K 60p 10-bit 4:2:2 with S-Cinetone Color Science", Autofocus: "759-Point Real-Time Eye AF for Humans, Animals & Birds", Streaming: "4K 15p / 1080p 60p Plug-and-Play USB-C Webcam" } },
      { brand: "Ring", name: "Ring Spotlight Cam Pro Solar Bundle (3D Motion Detection, 2K HDR, Two-Way Talk)", model: "RING-SPOT-SOLAR", price: 269, specs: { Power: "Quick-Release Battery Pack + Ring USB-C Solar Panel Included", Radar: "3D Radar Motion Detection + Bird's Eye View Map", Video: "2K HDR Color Night Vision + Dual LED Spotlights", Siren: "Remote-Activated 110dB Security Siren" } },
      { brand: "TP-Link", name: "TP-Link Deco BE85 Wi-Fi 7 Tri-Band Whole Home Mesh System (2-Pack, 22Gbps)", model: "DECO-BE85-2PK", price: 899, specs: { Speed: "BE22000 Tri-Band Wi-Fi 7 (6GHz + 5GHz + 2.4GHz)", Coverage: "Covers up to 6,000 sq. ft. Duplexes & Concrete Homes", Ports: "Dual 10Gbps Ports (1x SFP+/RJ45 Combo + 1x 10GbE) per Unit", Capacity: "Connects 200+ Smart Devices Simultaneously" } },
      { brand: "Samsung", name: "Samsung T9 4TB Portable USB 3.2 Gen 2x2 External SSD (2000MB/s for ProRes)", model: "MU-PG4T0B/AM", price: 379, specs: { Capacity: "4TB NVMe Flash Storage", Speed: "Up to 2,000 MB/s Read & Write Speeds", Recording: "Direct iPhone 15/16 Pro ProRes 4K60 Recording Ready", Durability: "3-Meter Drop Resistant Rubberized Exterior" } },
    ],
  },
};

function resolveBlueprintKey(name: string, slug: string): string {
  const text = `${name} ${slug}`.toLowerCase();
  if (text.includes("laptop") || text.includes("comp") || text.includes("mac") || text.includes("pc")) return "laptops";
  if (text.includes("phone") || text.includes("mobile") || text.includes("tablet") || text.includes("ipad")) return "phones";
  if (text.includes("tv") || text.includes("tele") || text.includes("display") || text.includes("theater") || text.includes("cinema")) return "tvs";
  if (text.includes("audio") || text.includes("sound") || text.includes("headphone") || text.includes("speaker")) return "audio";
  if (text.includes("gam") || text.includes("console") || text.includes("playstation") || text.includes("vr")) return "gaming";
  return "smart_home_power";
}

async function main() {
  console.log("🚀 Fetching existing categories from Neon PostgreSQL...");
  const categories = await prisma.category.findMany();

  if (categories.length === 0) {
    console.error("❌ No categories found! Run `npx tsx prisma/seed.ts` first.");
    process.exit(1);
  }

  let totalCreated = 0;

  for (const cat of categories) {
    const key = resolveBlueprintKey(cat.name, cat.slug);
    const blueprint = CATALOG_BLUEPRINTS[key];
    console.log(`\n📦 Populating Category: "${cat.name}" (${blueprint.items.length} multi-brand items)...`);

    for (let i = 0; i < blueprint.items.length; i++) {
      const item = blueprint.items[i];
      const sku = `HF-${cat.id}-${item.model}`.toUpperCase();
      const mainImage = blueprint.images[i % blueprint.images.length];
      const badges = ["Best Seller", "New Arrival", "Lekki Showroom Stock", "Official Warranty", "Top Rated", "Hot Deal"];

      await prisma.product.upsert({
        where: { sku },
        update: {
          brand: item.brand,
          model: item.model,
          name: item.name,
          price: item.price,
          oldPrice: Math.round(item.price * 1.15),
          categoryId: cat.id,
        },
        create: {
          brand: item.brand,
          model: item.model,
          sku,
          name: item.name,
          price: item.price,
          oldPrice: Math.round(item.price * 1.15),
          rating: Number((4.6 + (i % 4) * 0.1).toFixed(1)),
          reviews: 45 + i * 17,
          badge: badges[i % badges.length],
          image: mainImage,
          gallery: JSON.stringify(blueprint.images),
          description: `Authentic factory-sealed ${item.name} by ${item.brand}. Certified for 220V–240V Nigerian power standards and backed by Harlow Forte's 1-Year Official Warranty with same-day delivery in Lagos or 1-hour pickup at our Lekki Phase 1 showroom.`,
          highlights: JSON.stringify([
            `100% Brand New & Factory Sealed ${item.brand} Original`,
            "1-Year Harlow Forte Official Warranty + Printable Receipt",
            "Available for 1-Hour Store Pickup in Lekki Phase 1, Lagos",
            "Fast Insured Doorstep Delivery via GIG & DHL Nationwide",
          ]),
          specs: JSON.stringify({
            Brand: item.brand,
            "Model Number": item.model,
            ...item.specs,
            Condition: "Brand New (Factory Sealed)",
            Warranty: "1 Year Official Warranty",
          }),
          manuals: JSON.stringify([
            { title: `${item.brand} Quick Start & Warranty Guide (PDF)`, size: "1.8 MB", url: "#" },
          ]),
          categoryId: cat.id,
        },
      });
      totalCreated++;
    }
  }

  console.log(`\n✅ Done! Successfully synced ${totalCreated} products across ${categories.length} categories.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });