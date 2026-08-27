import type { ProductCardData, ProductCategory } from "../components/ProductCard";

type DemoSeed = {
  name: string;
  category: ProductCategory;
  image: string;
  average: number;
  prices: [number, number, number];
  ratings?: [number, number, number];
  sold?: [number | string, number | string, number | string];
  offerCount?: 2 | 3;
};

const ASSET = "/assets/products/product-pic";
const PLATFORMS: ProductCardData["platform"][] = ["Lazada", "TikTok", "Shopee"];

const seeds: DemoSeed[] = [
  {
    name: "Nike Air Force 1 '07",
    category: "รองเท้า",
    image: `${ASSET}/1-nike-lazada.webp`,
    average: 3437.33,
    prices: [3328, 3390, 3594],
    ratings: [5, 4.3, 5],
    sold: [22, 70, 56]
  },
  {
    name: "Converse Chuck Taylor",
    category: "รองเท้า",
    image: `${ASSET}/2-converse-shopee.webp`,
    average: 3026.67,
    prices: [2950, 3040, 3090],
    ratings: [4.8, 4.7, 4.9],
    sold: [185, 446, "2k+"]
  },
  {
    name: "Vans Old Skool",
    category: "รองเท้า",
    image: `${ASSET}/3-vans-tiktok.webp`,
    average: 2448.33,
    prices: [2190, 2565, 2590],
    ratings: [4.8, 4.3, 4.9],
    sold: [185, 151, "2k+"]
  },
  {
    name: "NEW BALANCE 740",
    category: "รองเท้า",
    image: `${ASSET}/4-nb-lazada.webp`,
    average: 3383,
    prices: [1949, 4050, 4150],
    ratings: [5, 4.8, 5],
    sold: [86, 42, 16]
  },
  {
    name: "HOKA CLIFTON ONE9",
    category: "รองเท้า",
    image: `${ASSET}/5-hoka-shopee.webp`,
    average: 3591.33,
    prices: [3294, 3590, 3890],
    ratings: [4.9, 4.8, 5],
    sold: [38, 74, 120]
  },
  {
    name: "Adidas Ultraboost Light",
    category: "รองเท้า",
    image: `${ASSET}/6-adidas-lazada.webp`,
    average: 4220,
    prices: [3750, 4410, 4500],
    ratings: [5, 4.8, 4.9],
    sold: [2, 42, 86]
  },
  {
    name: "Crocs Classic Clog",
    category: "รองเท้า",
    image: `${ASSET}/7-crocs-shopee.webp`,
    average: 2090,
    prices: [2040, 2040, 2190],
    ratings: [4.8, 4.7, 4.9],
    sold: [185, 446, "9k+"]
  },
  {
    name: "Birkenstock Arizona",
    category: "รองเท้า",
    image: `${ASSET}/8-birken-tiktok.webp`,
    average: 4163.67,
    prices: [3311, 3990, 5190],
    ratings: [4.8, 5, 4.9],
    sold: [185, 157, 446]
  },
  {
    name: "Kito BioCare",
    category: "รองเท้า",
    image: `${ASSET}/9-kito-tiktok.png`,
    average: 513,
    prices: [486, 524, 529],
    ratings: [4.8, 5, 4.9],
    sold: [185, 95, 446]
  },
  {
    name: "womenager - Jane Original",
    category: "รองเท้า",
    image: `${ASSET}/10-womanager-shopee.webp`,
    average: 2023.67,
    prices: [1740, 1790, 2541],
    ratings: [4.8, 4.7, 5],
    sold: [185, 446, 47]
  },
  {
    name: "Flynn - Ballet Flats",
    category: "รองเท้า",
    image: `${ASSET}/11-flynn-shopee.webp`,
    average: 1427.33,
    prices: [1352, 1440, 1490],
    ratings: [4.8, 4.7, 4.9],
    sold: [185, 446, "4k+"]
  },
  {
    name: "Labotte Mary Jane",
    category: "รองเท้า",
    image: `${ASSET}/10-womanager-shopee.webp`,
    average: 1680,
    prices: [1490, 1690, 1860],
    ratings: [4.8, 4.7, 4.9],
    sold: [92, 146, 328]
  },
  {
    name: "Classic Mary Jane",
    category: "รองเท้า",
    image: `${ASSET}/11-flynn-shopee.webp`,
    average: 1590,
    prices: [1490, 1690, 1790],
    ratings: [4.8, 4.7, 4.9],
    sold: [84, 121, 274],
    offerCount: 2
  },
  {
    name: "COACH Coin Wallet In Signature",
    category: "Accessory",
    image: `${ASSET}/13-coach-wallet.jpg`,
    average: 2890,
    prices: [2990, 2890, 2790],
    ratings: [4.5, 4.2, 4.8],
    sold: [88, "3.4k+", "1.2k+"]
  },
  {
    name: "เสื้อคลุม Adidas",
    category: "Accessory",
    image: `${ASSET}/14-adidas-jacket.png`,
    average: 2257,
    prices: [2490, 1990, 2290],
    ratings: [4.3, 3.9, 4.7],
    sold: [35, "2k+", 460]
  },
  {
    name: "หมวก Nike สีดำ Original",
    category: "Accessory",
    image: `${ASSET}/15-nike-cap.png`,
    average: 877,
    prices: [950, 790, 890],
    ratings: [4.4, 2.9, 4.9],
    sold: [210, "15.6k+", "9k+"]
  }
];

function nikeImage(platform: ProductCardData["platform"]) {
  if (platform === "Shopee") return `${ASSET}/1-nike-shopee.webp`;
  if (platform === "TikTok") return `${ASSET}/1-nike-tiktok.webp`;
  return `${ASSET}/1-nike-lazada.webp`;
}

export const DEMO_PRODUCTS: ProductCardData[] = seeds.flatMap((seed, seedIndex) =>
  PLATFORMS.slice(0, seed.offerCount ?? 3).map((platform, platformIndex) => {
    const discountPrice = seed.prices[platformIndex];
    const trendDifference = Math.round(Math.abs(discountPrice - seed.average) / seed.average * 100);

    return {
      id: 1001 + seedIndex * 3 + platformIndex,
      productName: seed.name,
      category: seed.category,
      platform,
      price: Math.round(discountPrice * 1.16),
      discountPrice,
      percent: 14,
      rating: seed.ratings?.[platformIndex] ?? 4.9,
      sold: seed.sold?.[platformIndex] ?? 100 + seedIndex * 17 + platformIndex * 29,
      freeShip: platformIndex !== 1 || seedIndex % 2 === 0,
      mall: platform !== "TikTok" && (seedIndex + platformIndex) % 3 !== 1,
      imageUrl: seedIndex === 0 ? nikeImage(platform) : seed.image,
      productUrl: seedIndex === 0 && platform === "Shopee"
        ? "https://shopee.co.th/product/1676687866/56408537514"
        : "",
      averagePrice: seed.average,
      trendLabel: discountPrice <= seed.average ? "ลดจากค่าเฉลี่ย" : "เพิ่มจากค่าเฉลี่ย",
      trendPercent: trendDifference
    };
  })
);

