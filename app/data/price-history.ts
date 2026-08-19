import { ProductCardData } from "../components/ProductCard";

export type Period = "7 วัน" | "30 วัน" | "2 เดือน" | "3 เดือน";

export type PriceHistoryRecord = {
  min: number;
  max: number;
  current: number;
  original: number;
  average: number;
};

export const priceHistoryData: Record<string, PriceHistoryRecord> = {
  "nikeairforce107|Shopee": { min: 2980, max: 4210, current: 3594, original: 4300, average: 3437.33 },
  "nikeairforce107|Lazada": { min: 2460, max: 3830, current: 3328, original: 4300, average: 3437.33 },
  "nikeairforce107|TikTok": { min: 2370, max: 4170, current: 3390, original: 5290, average: 3437.33 },
  "conversechucktaylor|Shopee": { min: 2470, max: 3500, current: 3090, original: 3090, average: 3026.67 },
  "conversechucktaylor|Lazada": { min: 2300, max: 3280, current: 2950, original: 2950, average: 3026.67 },
  "conversechucktaylor|TikTok": { min: 2150, max: 3620, current: 3040, original: 3090, average: 3026.67 },
  "vansoldskool|Shopee": { min: 2140, max: 3040, current: 2590, original: 2590, average: 2448.33 },
  "vansoldskool|Lazada": { min: 1890, max: 2950, current: 2565, original: 2690, average: 2448.33 },
  "vansoldskool|TikTok": { min: 1550, max: 2570, current: 2190, original: 2690, average: 2448.33 },
  "newbalance740|Shopee": { min: 3270, max: 4860, current: 4150, original: 4150, average: 3383 },
  "newbalance740|Lazada": { min: 1500, max: 2250, current: 1949, original: 7000, average: 3383 },
  "newbalance740|TikTok": { min: 2910, max: 4740, current: 4050, original: 4300, average: 3383 },
  "hokacliftonone9|Shopee": { min: 2760, max: 3890, current: 3294, original: 5990, average: 3294 },
  "hokacliftonone9|Lazada": { min: 2460, max: 3560, current: 3293, original: 5990, average: 3294 },
  "hokacliftonone9|TikTok": { min: 1980, max: 3360, current: 2793, original: 5990, average: 3294 },
  "adidasultraboostlight|Shopee": { min: 3700, max: 5080, current: 4410, original: 7000, average: 4220 },
  "adidasultraboostlight|Lazada": { min: 2810, max: 4240, current: 3750, original: 7000, average: 4220 },
  "adidasultraboostlight|TikTok": { min: 3370, max: 5270, current: 4500, original: 7000, average: 4220 },
  "crocsclassicclog|Shopee": { min: 1690, max: 2290, current: 2040, original: 2190, average: 2090 },
  "crocsclassicclog|Lazada": { min: 1500, max: 2250, current: 2040, original: 2190, average: 2090 },
  "crocsclassicclog|TikTok": { min: 1570, max: 2680, current: 2190, original: 2190, average: 2090 },
  "birkenstockarizona|Shopee": { min: 3310, max: 4750, current: 3990, original: 3990, average: 4163.67 },
  "birkenstockarizona|Lazada": { min: 3840, max: 5660, current: 5190, original: 5290, average: 4163.67 },
  "birkenstockarizona|TikTok": { min: 2410, max: 3850, current: 3311, original: 3990, average: 4163.67 },
  "kitobiocare|Shopee": { min: 410, max: 620, current: 529, original: 628, average: 513 },
  "kitobiocare|Lazada": { min: 390, max: 600, current: 524, original: 628, average: 513 },
  "kitobiocare|TikTok": { min: 340, max: 570, current: 486, original: 628, average: 513 },
  "womenagerjaneoriginal|Shopee": { min: 1460, max: 2010, current: 1790, original: 1790, average: 2023.67 },
  "womenagerjaneoriginal|Lazada": { min: 1390, max: 1920, current: 1740, original: 1790, average: 2023.67 },
  "womenagerjaneoriginal|TikTok": { min: 1800, max: 3080, current: 2541, original: 2912, average: 2023.67 },
  "flynnballetflats|Shopee": { min: 1080, max: 1600, current: 1352, original: 1490, average: 1427.33 },
  "flynnballetflats|Lazada": { min: 1160, max: 1610, current: 1490, original: 1590, average: 1427.33 },
  "flynnballetflats|TikTok": { min: 1060, max: 1730, current: 1440, original: 1490, average: 1427.33 },
  "labottebkktherookie|Shopee": { min: 1230, max: 1720, current: 1519, original: 1690, average: 1521 },
  "labottebkktherookie|Lazada": { min: 1330, max: 1880, current: 1690, original: 1690, average: 1521 },
  "labottebkktherookie|TikTok": { min: 970, max: 1670, current: 1354, original: 1690, average: 1521 }
};

export function normalizeHistoryName(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

export function getPriceHistory(product: ProductCardData): PriceHistoryRecord {
  return priceHistoryData[`${normalizeHistoryName(product.productName)}|${product.platform}`] || {
    min: Math.min(product.discountPrice, product.averagePrice),
    max: Math.max(product.discountPrice, product.averagePrice),
    current: product.discountPrice,
    original: product.price,
    average: product.averagePrice
  };
}

export function createPriceSeries(history: PriceHistoryRecord, period: Period) {
  const rangeFactor: Record<Period, number> = {
    "7 วัน": 0.35,
    "30 วัน": 0.58,
    "2 เดือน": 0.8,
    "3 เดือน": 1
  };
  const factor = rangeFactor[period];
  const visibleMin = history.current - (history.current - history.min) * factor;
  const visibleMax = history.current + (history.max - history.current) * factor;
  const range = Math.max(1, visibleMax - visibleMin);
  const shape = [0.86, 0.98, 0.64, 0.78, 0.42, 0.2, 0.55, 1];

  return shape.map((position, index) => {
    if (index === shape.length - 1) return history.current;
    return Math.round(visibleMin + range * position);
  });
}
