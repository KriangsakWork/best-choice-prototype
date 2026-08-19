"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ProductCardData } from "./ProductCard";
import { ResultCard, ResultCardData } from "./ResultCard";
import { recentSearches, searchSuggestions } from "../data/catalog";
import { useFavorites } from "../data/favorite-store";

type Category = "Sneakers" | "RunShoes" | "Sandals" | "WomanShoes";
type FlowScreen = "results" | "compare" | "no-results" | null;
type SortMode = "relevance" | "best-selling" | "price-desc" | "price-asc" | "bc-score";
type CompareOrigin = "results" | "interest";

type ProductGroup = {
  id: string;
  category: Category;
  name: string;
  aliases: string[];
  representative: ProductCardData;
  offers: ProductCardData[];
};

type OfferSeed = {
  platform: ProductCardData["platform"];
  price: number;
  discount: number;
  rating: number;
  sold: number | string;
  freeShip: boolean;
  mall: boolean;
  image: string;
};

type GroupSeed = {
  id: string;
  category: Category;
  name: string;
  aliases: string[];
  average: number;
  offers: OfferSeed[];
};

const ASSET = "/assets/products/product-pic";
const SEARCH_ICON = "/assets/SVG/Search Bar/icon/Icon Search2.svg";
const CLOSE_ICON = "/assets/SVG/Search Bar/icon/Icon Close.svg";
const FILTER_ICON = "/assets/SVG/Search Bar/icon/Filter.svg";
const TARGET_CARD_COUNT = 6;

const SORT_OPTIONS: Array<{ value: SortMode; label: string }> = [
  { value: "price-asc", label: "ราคา (จากน้อยไปมาก)" },
  { value: "price-desc", label: "ราคา (จากมากไปน้อย)" },
  { value: "bc-score", label: "BC Score (คะแนนสูงสุด)" },
  { value: "best-selling", label: "สินค้าขายดี" },
  { value: "relevance", label: "เกี่ยวข้อง" }
];

const NAV_ITEMS = [
  { label: "หน้าหลัก", icon: "/assets/SVG/Nav Bar/HIC01.svg" },
  { label: "สนใจ", icon: "/assets/SVG/Nav Bar/HIC02.svg" },
  { label: "ประหยัด", icon: "/assets/SVG/Nav Bar/HIC03.svg" },
  { label: "โปรไฟล์", icon: "/assets/SVG/Nav Bar/HIC04.svg" }
];

const OFFER_LINKS: Record<string, string> = {
  "nike-air-force-1-07|Shopee": "https://shopee.co.th/product/1676687866/56408537514",
  "nike-air-force-1-07|Lazada": "https://www.lazada.co.th/products/pdp-i16106542551-s126914129880.html",
  "nike-air-force-1-07|TikTok": "https://vt.tiktok.com/ZS9MEAdLRKL3w-mZLJy/",
  "converse-chuck-taylor|Shopee": "https://shopee.co.th/search?keyword=Converse%20Chuck%20Taylor",
  "converse-chuck-taylor|Lazada": "https://www.lazada.co.th/products/pdp-i16096804530-s126814426909.html",
  "converse-chuck-taylor|TikTok": "https://vt.tiktok.com/ZS9MEP85MRvTD-My8Pf/",
  "vans-old-skool|Shopee": "https://shopee.co.th/search?keyword=Vans%20Old%20Skool",
  "vans-old-skool|Lazada": "https://www.lazada.co.th/products/pdp-i2328548110-s7873986440.html",
  "vans-old-skool|TikTok": "https://vt.tiktok.com/ZS9ME5qxWMTjb-QiyCS/",
  "new-balance-740|Shopee": "https://shopee.co.th/NEW-BALANCE-740-%E0%B8%A3%E0%B8%AD%E0%B8%87%E0%B9%80%E0%B8%97%E0%B9%89%E0%B8%B2%E0%B8%A5%E0%B8%B3%E0%B8%A5%E0%B8%AD%E0%B8%87%E0%B8%9C%E0%B8%B9%E0%B9%89%E0%B9%83%E0%B8%AB%E0%B8%8D%E0%B9%88-i.295338991.52412795912",
  "new-balance-740|Lazada": "https://www.lazada.co.th/products/authentic-new-balance-nb-740-black-u740bm2-sneakers-i16106881076-s126924904221.html",
  "new-balance-740|TikTok": "https://www.tiktok.com/view/product/1736524162440266949",
  "hoka-clifton-one9|Shopee": "https://shopee.co.th/search?keyword=HOKA%20CLIFTON%20ONE9",
  "hoka-clifton-one9|Lazada": "https://www.lazada.co.th/products/pdp-i5963228282-s25613775480.html",
  "hoka-clifton-one9|TikTok": "https://vt.tiktok.com/ZS9MEmcfmGcxr-rMU3c/",
  "adidas-ultraboost-light|Shopee": "https://shopee.co.th/adidas-%E0%B8%A7%E0%B8%B4%E0%B9%88%E0%B8%87-%E0%B8%A3%E0%B8%AD%E0%B8%87%E0%B9%80%E0%B8%97%E0%B9%89%E0%B8%B2-Ultraboost-Light-%E0%B8%9C%E0%B8%B9%E0%B9%89%E0%B8%AB%E0%B8%8D%E0%B8%B4%E0%B8%87-%E0%B8%AA%E0%B8%B5%E0%B8%AA%E0%B9%89%E0%B8%A1-HQ8598-i.217077552.29356820353",
  "adidas-ultraboost-light|Lazada": "https://www.lazada.co.th/products/pdp-i5276577093-s22439527940.html",
  "adidas-ultraboost-light|TikTok": "https://vt.tiktok.com/ZS9MEHs2xSQLU-QpXHo/",
  "crocs-classic-clog|Shopee": "https://shopee.co.th/CROCS-Classic-Clog-%E0%B8%A3%E0%B8%AD%E0%B8%87%E0%B9%80%E0%B8%97%E0%B9%89%E0%B8%B2%E0%B8%A5%E0%B8%B3%E0%B8%A5%E0%B8%AD%E0%B8%87%E0%B8%9C%E0%B8%B9%E0%B9%89%E0%B9%83%E0%B8%AB%E0%B8%8D%E0%B9%88-i.295338991.24903381653",
  "crocs-classic-clog|Lazada": "https://www.lazada.co.th/products/pdp-i5031090015-s21271454906.html",
  "crocs-classic-clog|TikTok": "https://vt.tiktok.com/ZS9MExYEsKCpv-PDkfo/",
  "birkenstock-arizona|Shopee": "https://shopee.co.th/BIRKENSTOCK-Arizona-BF-Black-%E0%B8%A3%E0%B8%AD%E0%B8%87%E0%B9%80%E0%B8%97%E0%B9%89%E0%B8%B2%E0%B9%81%E0%B8%95%E0%B8%B0-Unisex-%E0%B8%AA%E0%B8%B5%E0%B8%94%E0%B8%B3-%E0%B8%A3%E0%B8%B8%E0%B9%88%E0%B8%99-51791-(regular)-i.241098047.3232243174",
  "birkenstock-arizona|Lazada": "https://www.lazada.co.th/products/birkenstock-arizona-birko-flor-soft-footbed-bf-sfb-black-i4893158604-s20607623120.html",
  "birkenstock-arizona|TikTok": "https://vt.tiktok.com/ZS9MEQSbgQMQL-gE17o/",
  "kito-biocare|Shopee": "https://shopee.co.th/Kito-%E0%B8%81%E0%B8%B5%E0%B9%82%E0%B8%95%E0%B9%89-%E0%B8%A3%E0%B8%AD%E0%B8%87%E0%B9%80%E0%B8%97%E0%B9%89%E0%B8%B2%E0%B9%81%E0%B8%95%E0%B8%B0-%E0%B8%A3%E0%B8%B8%E0%B9%88%E0%B8%99-BioCare-BC3-Size-40-43-i.34539611.47507754810",
  "kito-biocare|Lazada": "https://www.lazada.co.th/products/pdp-i16110630870-s126961340188.html",
  "kito-biocare|TikTok": "https://vt.tiktok.com/ZS9MEX1nGb8pf-ON4nL/",
  "womenager-jane-original|Shopee": "https://shopee.co.th/womenager-Jane-Original-%E0%B8%AA%E0%B8%B5-Black-%E0%B8%A3%E0%B8%AD%E0%B8%87%E0%B9%80%E0%B8%97%E0%B9%89%E0%B8%B2%E0%B9%81%E0%B8%95%E0%B8%B0%E0%B8%84%E0%B8%B1%E0%B8%97%E0%B8%8A%E0%B8%B9%E0%B9%80%E0%B8%9B%E0%B8%B4%E0%B8%94%E0%B8%AA%E0%B9%89%E0%B8%99-%E0%B8%AA%E0%B8%A7%E0%B8%A1%E0%B9%83%E0%B8%AA%E0%B9%88%E0%B8%87%E0%B9%88%E0%B8%B2%E0%B8%A2-i.1258482371.51450158383",
  "womenager-jane-original|Lazada": "https://www.lazada.co.th/products/womenager-jane-classic-black-leather-i4437413798-s17845714417.html",
  "womenager-jane-original|TikTok": "https://vt.tiktok.com/ZS9MEXbspFngS-Q68ZX/",
  "flynn-ballet-flats|Shopee": "https://shopee.co.th/-New!-Baozi%F0%9F%A5%A0%F0%9F%A4%8E-Flynn-Ballet-Flats-Room-Service-Collection-%E0%B8%84%E0%B8%B1%E0%B8%97%E0%B8%8A%E0%B8%B9%E0%B8%88%E0%B8%B8%E0%B8%94%E0%B8%99%E0%B8%B8%E0%B9%88%E0%B8%A1%E0%B8%A1%E0%B8%B2%E0%B8%81-%E0%B8%82%E0%B8%B2%E0%B8%A2%E0%B8%94%E0%B8%B5-no.1-i.1605904.19079072019",
  "flynn-ballet-flats|Lazada": "https://www.lazada.co.th/products/pdp-i4215601986-s16608659654.html",
  "flynn-ballet-flats|TikTok": "https://www.tiktok.com/view/product/1729560312589486476",
  "labotte-the-rookie|Shopee": "https://shopee.co.th/The-Rookie-Labotte.bkk-%E0%B8%A3%E0%B8%AD%E0%B8%87%E0%B9%80%E0%B8%97%E0%B9%89%E0%B8%B2%E0%B9%81%E0%B8%A1%E0%B8%A3%E0%B8%B5%E0%B9%88%E0%B9%80%E0%B8%88%E0%B8%99-%E0%B8%AA%E0%B8%99%E0%B8%B4%E0%B8%81%E0%B9%80%E0%B8%81%E0%B9%89%E0%B8%AD-mary-jane-sneaker-(YHM8128-2)-i.105436413.43660704638",
  "labotte-the-rookie|Lazada": "https://www.lazada.co.th/products/pdp-i5819783497-s24842971125.html",
  "labotte-the-rookie|TikTok": "https://vt.tiktok.com/ZS9MEqRfaceds-8gGiX/",
};

function buildOffer(id: number, name: string, offer: OfferSeed, average: number, groupId: string): ProductCardData {
  return {
    id,
    productName: name,
    platform: offer.platform,
    price: offer.price,
    discountPrice: offer.discount,
    percent: offer.price > 0 ? Math.round((offer.price - offer.discount) / offer.price * 100) : 0,
    rating: offer.rating,
    sold: offer.sold,
    freeShip: offer.freeShip,
    mall: offer.mall,
    imageUrl: `${ASSET}/${offer.image}`,
    productUrl: OFFER_LINKS[`${groupId}|${offer.platform}`] ?? "",
    averagePrice: average,
    trendLabel: offer.discount <= average ? "ลดจากค่าเฉลี่ย" : "เพิ่มจากค่าเฉลี่ย",
    trendPercent: average > 0 ? Math.round(Math.abs(offer.discount - average) / average * 100) : 0
  };
}

function createGroup(seed: GroupSeed, startId: number): ProductGroup {
  const offers = seed.offers
    .map((offer, index) => buildOffer(startId + index, seed.name, offer, seed.average, seed.id))
    .sort((a, b) => a.discountPrice - b.discountPrice);

  return {
    id: seed.id,
    category: seed.category,
    name: seed.name,
    aliases: seed.aliases,
    representative: offers[0],
    offers
  };
}

const seeds: GroupSeed[] = [
  {
    id: "nike-air-force-1-07",
    category: "Sneakers",
    name: "Nike Air Force 1 '07",
    aliases: ["nike", "air force", "air force 1", "af1", "รองเท้าผ้าใบ", "รองเท้า nike"],
    average: 3437,
    offers: [
      { platform: "Lazada", price: 4300, discount: 3328, rating: 5, sold: 22, freeShip: true, mall: true, image: "1-nike-lazada.webp" },
      { platform: "TikTok", price: 5290, discount: 3390, rating: 4.3, sold: 70, freeShip: false, mall: false, image: "1-nike-tikok.webp" },
      { platform: "Shopee", price: 4300, discount: 3594, rating: 5, sold: 56, freeShip: true, mall: true, image: "1-nike-shopee.webp" },
    ]
  },
  {
    id: "converse-chuck-taylor",
    category: "Sneakers",
    name: "Converse Chuck Taylor",
    aliases: ["converse", "chuck taylor", "chuck 70", "คอนเวิร์ส", "รองเท้าผ้าใบ"],
    average: 3027,
    offers: [
      { platform: "Shopee", price: 3090, discount: 3090, rating: 4.6, sold: 2000, freeShip: true, mall: true, image: "2-converse-shopee.webp" },
      { platform: "Lazada", price: 2950, discount: 2950, rating: 2, sold: 0, freeShip: false, mall: true, image: "2-converse-lazada.png" },
      { platform: "TikTok", price: 3090, discount: 3040, rating: 4.4, sold: 3120, freeShip: true, mall: true, image: "2-converse-tiktok.webp" },
    ]
  },
  {
    id: "vans-old-skool",
    category: "Sneakers",
    name: "Vans Old Skool",
    aliases: ["vans", "old skool", "old school", "รองเท้าวานส์", "รองเท้าผ้าใบ"],
    average: 2448,
    offers: [
      { platform: "TikTok", price: 2690, discount: 2190, rating: 4.3, sold: 151, freeShip: true, mall: true, image: "3-vans-tiktok.webp" },
      { platform: "Lazada", price: 2690, discount: 2565, rating: 5, sold: 664, freeShip: true, mall: true, image: "3-vans-lazada.webp" },
      { platform: "Shopee", price: 2590, discount: 2590, rating: 4.9, sold: "5k+", freeShip: true, mall: true, image: "3-vans-shopee.webp" },
    ]
  },
  {
    id: "new-balance-740",
    category: "RunShoes",
    name: "NEW BALANCE 740",
    aliases: ["new balance", "new balance 740", "nb 740", "นิวบาลานซ์", "รองเท้าวิ่ง"],
    average: 3383,
    offers: [
      { platform: "Lazada", price: 7000, discount: 1949, rating: 5, sold: 16, freeShip: true, mall: false, image: "4-nb-lazada.webp" },
      { platform: "TikTok", price: 4300, discount: 4050, rating: 0, sold: 0, freeShip: true, mall: true, image: "4-nb-tiktok.webp" },
      { platform: "Shopee", price: 4150, discount: 4150, rating: 5, sold: 16, freeShip: true, mall: true, image: "4-nb-shopee.webp" },
    ]
  },
  {
    id: "hoka-clifton-one9",
    category: "RunShoes",
    name: "HOKA CLIFTON ONE9",
    aliases: ["hoka", "clifton", "clifton one9", "โฮก้า", "รองเท้าวิ่ง"],
    average: 3294,
    offers: [
      { platform: "Shopee", price: 5990, discount: 3294, rating: 4.9, sold: 38, freeShip: true, mall: true, image: "5-hoka-shopee.webp" },
      { platform: "Lazada", price: 5990, discount: 3293, rating: 4.6, sold: 4, freeShip: false, mall: true, image: "5-hoka-lazada.webp" },
      { platform: "TikTok", price: 5990, discount: 2793, rating: 4.2, sold: 34, freeShip: false, mall: false, image: "5-hoka-tiktok.webp" },
    ]
  },
  {
    id: "adidas-ultraboost-light",
    category: "RunShoes",
    name: "Adidas Ultraboost Light",
    aliases: ["adidas", "ultraboost", "adidas ultraboost", "อาดิดาส", "รองเท้าวิ่ง"],
    average: 4220,
    offers: [
      { platform: "Lazada", price: 7000, discount: 3750, rating: 5, sold: 2, freeShip: true, mall: true, image: "6-adidas-lazada.webp" },
      { platform: "Shopee", price: 7000, discount: 4410, rating: 4.9, sold: 83, freeShip: true, mall: true, image: "6-adidas-shopee.webp" },
      { platform: "TikTok", price: 7000, discount: 4500, rating: 0, sold: 2, freeShip: true, mall: true, image: "6-adidas-tiktok.webp" },
    ]
  },
  {
    id: "crocs-classic-clog",
    category: "Sandals",
    name: "Crocs Classic Clog",
    aliases: ["crocs", "classic clog", "คร็อคส์", "รองเท้าแตะ"],
    average: 2090,
    offers: [
      { platform: "Shopee", price: 2190, discount: 2040, rating: 4.9, sold: 9000, freeShip: true, mall: true, image: "7-crocs-shopee.webp" },
      { platform: "Lazada", price: 2190, discount: 2040, rating: 4.5, sold: 154, freeShip: false, mall: true, image: "7-crocs-lazada.webp" },
      { platform: "TikTok", price: 2190, discount: 2190, rating: 4.1, sold: 32200, freeShip: true, mall: true, image: "7-crocs-tiktok.webp" },
    ]
  },
  {
    id: "birkenstock-arizona",
    category: "Sandals",
    name: "Birkenstock Arizona",
    aliases: ["birkenstock", "arizona", "เบียร์เคนสต็อก", "รองเท้าแตะ"],
    average: 4164,
    offers: [
      { platform: "Shopee", price: 3990, discount: 3990, rating: 4.8, sold: 2000, freeShip: true, mall: true, image: "8-birken-shopee.webp" },
      { platform: "Lazada", price: 5290, discount: 5190, rating: 4.6, sold: 21, freeShip: false, mall: true, image: "8-birken-lazada.png" },
      { platform: "TikTok", price: 3990, discount: 3311, rating: 3.8, sold: 157, freeShip: true, mall: true, image: "8-birken-tiktok.webp" },
    ]
  },
  {
    id: "kito-biocare",
    category: "Sandals",
    name: "Kito BioCare",
    aliases: ["kito", "biocare", "กีโต้", "รองเท้าแตะ"],
    average: 513,
    offers: [
      { platform: "Shopee", price: 628, discount: 529, rating: 4.4, sold: 16, freeShip: true, mall: true, image: "9-kito-shopee.webp" },
      { platform: "Lazada", price: 628, discount: 524, rating: 3.9, sold: 3, freeShip: false, mall: true, image: "9-kito-lazada.webp" },
      { platform: "TikTok", price: 628, discount: 486, rating: 2.6, sold: 95, freeShip: true, mall: true, image: "9-kito-tiktok.png" },
    ]
  },
  {
    id: "womenager-jane-original",
    category: "WomanShoes",
    name: "womenager - Jane Original",
    aliases: ["womenager", "jane original", "รองเท้าผู้หญิง", "คัทชู"],
    average: 2024,
    offers: [
      { platform: "Shopee", price: 1790, discount: 1790, rating: 4.6, sold: 47, freeShip: true, mall: true, image: "10-womanager-shopee.webp" },
      { platform: "Lazada", price: 1790, discount: 1740, rating: 4.1, sold: 185, freeShip: false, mall: true, image: "10-womanager-lazada.webp" },
      { platform: "TikTok", price: 2912, discount: 2541, rating: 2.4, sold: 0, freeShip: true, mall: false, image: "10-womanager-tiktok.webp" },
    ]
  },
  {
    id: "flynn-ballet-flats",
    category: "WomanShoes",
    name: "Flynn - Ballet Flats",
    aliases: ["flynn", "ballet flats", "รองเท้าผู้หญิง", "คัทชู"],
    average: 1427,
    offers: [
      { platform: "Shopee", price: 1490, discount: 1352, rating: 4.7, sold: 4000, freeShip: true, mall: true, image: "11-flynn-shopee.webp" },
      { platform: "Lazada", price: 1590, discount: 1490, rating: 4.3, sold: 162, freeShip: false, mall: true, image: "11-flynn-lazada.webp" },
      { platform: "TikTok", price: 1490, discount: 1440, rating: 3.6, sold: 446, freeShip: true, mall: true, image: "11-flynn-tiktok.webp" },
    ]
  },
  {
    id: "labotte-the-rookie",
    category: "WomanShoes",
    name: "Labotte.bkk - The Rookie",
    aliases: ["labotte", "the rookie", "รองเท้าผู้หญิง", "คัทชู"],
    average: 1521,
    offers: [
      { platform: "Shopee", price: 1690, discount: 1519, rating: 4.8, sold: 10000, freeShip: true, mall: false, image: "12-labotte-shopee.webp" },
      { platform: "Lazada", price: 1690, discount: 1690, rating: 4.4, sold: 100, freeShip: false, mall: false, image: "12-labotte-lazada.webp" },
      { platform: "TikTok", price: 1690, discount: 1354, rating: 3.3, sold: 23600, freeShip: true, mall: false, image: "12-labotte-tiktok.webp" },
    ]
  },
];

const groups: ProductGroup[] = seeds.map((seed, index) => createGroup(seed, index * 3 + 1));

function normalize(value: string) {
  return value.trim().toLocaleLowerCase("th-TH").replace(/\s+/g, " ");
}

function findGroups(query: string) {
  const normalized = normalize(query);
  if (!normalized) return groups.slice(0, TARGET_CARD_COUNT);

  const categoryMap: Record<string, Category> = {
    "รองเท้าวิ่ง": "RunShoes",
    "รองเท้าผ้าใบ": "Sneakers",
    "รองเท้าแตะ": "Sandals",
    "รองเท้าผู้หญิง": "WomanShoes"
  };

  const category = categoryMap[normalized];
  if (category) return groups.filter((group) => group.category === category);

  const terms = [normalized, ...normalized.split(" ").filter((term) => term.length > 1)];
  return groups.filter((group) => {
    const aliases = [group.name, ...group.aliases].map(normalize);
    return terms.some((term) => aliases.some((alias) => alias.includes(term) || term.includes(alias)));
  });
}

function setControlledInputValue(input: HTMLInputElement | null, value: string) {
  if (!input) return;
  const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
  setter?.call(input, value);
  input.dispatchEvent(new Event("input", { bubbles: true }));
}

function getPriceRange(group: ProductGroup) {
  const prices = group.offers.map((offer) => offer.discountPrice);
  return {
    min: Math.min(...prices),
    max: Math.max(...prices)
  };
}

function passesFilters(group: ProductGroup, mallOnly: boolean, freeShipOnly: boolean) {
  if (mallOnly && !group.offers.some((offer) => offer.mall)) return false;
  if (freeShipOnly && !group.offers.some((offer) => offer.freeShip)) return false;
  return true;
}

function soldToNumber(sold: number | string) {
  if (typeof sold === "number") return sold;
  const normalized = sold.toLocaleLowerCase("en-US").replace(/,/g, "");
  const match = normalized.match(/([\d.]+)\s*(k)?/);
  if (!match) return 0;
  const value = Number(match[1]);
  return match[2] ? value * 1000 : value;
}

function bestSellerScore(group: ProductGroup) {
  return group.offers.reduce((total, offer) => total + soldToNumber(offer.sold), 0);
}

function sortGroups(items: ProductGroup[], mode: SortMode) {
  if (mode === "relevance") return items;

  return [...items].sort((a, b) => {
    if (mode === "best-selling") return bestSellerScore(b) - bestSellerScore(a);
    if (mode === "bc-score") return b.representative.rating - a.representative.rating;
    if (mode === "price-desc") return getPriceRange(b).min - getPriceRange(a).min;
    return getPriceRange(a).min - getPriceRange(b).min;
  });
}

function groupToResultCard(group: ProductGroup): ResultCardData {
  const best = group.representative;
  const platformsInGroup = group.offers.map((offer) => offer.platform);

  return {
    id: best.id,
    productName: group.name,
    imageUrl: best.imageUrl,
    mainPlatform: best.platform,
    otherPlatforms: platformsInGroup.filter((platform) => platform !== best.platform),
    price: best.discountPrice,
    originalPrice: best.price,
    rating: best.rating,
    savings: Math.max(0, best.price - best.discountPrice),
    storeCount: group.offers.length
  };
}

function ProductGroupCard({ group, onOpen }: { group: ProductGroup; onOpen: () => void }) {
  const favorites = useFavorites();

  return (
    <ResultCard
      product={groupToResultCard(group)}
      favorite={favorites.isFavorite(group.representative)}
      onFavoriteToggle={() => favorites.toggleFavorite(group.representative)}
      onOpen={onOpen}
    />
  );
}


const catalogCompareDiscountDetails = [
  { label: "ส่วนลดร้านค้า", amount: 48 },
  { label: "ส่วนลดแคมเปญ 8.8", amount: 52 },
  { label: "โค้ดแคมเปญช็อปต่อเนื่อง", amount: 20 }
];

const catalogCompareDiscountTotal = catalogCompareDiscountDetails.reduce(
  (total, item) => total + item.amount,
  0
);

function CatalogCompareTrend({ offer }: { offer: ProductCardData }) {
  const currentPrice = offer.discountPrice;
  const referencePrice = offer.averagePrice;
  const priceChange = currentPrice - referencePrice;

  // The mini chart follows the actual comparison fields:
  // averagePrice is the reference and discountPrice is the latest price.
  // Intermediate points preserve the small ups and downs without using
  // one hardcoded price series for every product.
  const values = [
    referencePrice,
    referencePrice + priceChange * 0.18,
    referencePrice - priceChange * 0.08,
    referencePrice + priceChange * 0.12,
    referencePrice - priceChange * 0.16,
    currentPrice - priceChange * 0.14,
    currentPrice - priceChange * 0.05,
    currentPrice
  ];
  const min = Math.min(...values);
  const max = Math.max(...values);
  const points = values.map((value, index) => ({
    x: 2 + (index / (values.length - 1)) * 101,
    y: 3 + ((max - value) / Math.max(1, max - min)) * 27
  }));
  const path = points.map((point, index) => (index ? "L" : "M") + " " + point.x + " " + point.y).join(" ");

  return (
    <svg viewBox="0 0 106 34" aria-hidden="true">
      <path d={path} pathLength="1" />
      <circle cx={points[points.length - 1].x} cy={points[points.length - 1].y} r="2.5" />
    </svg>
  );
}

function CatalogCompareBuy({
  offer,
  onUnavailable
}: {
  offer: ProductCardData;
  onUnavailable: () => void;
}) {
  const buy = () => {
    if (offer.productUrl) {
      window.open(offer.productUrl, "_blank", "noopener,noreferrer");
      return;
    }
    onUnavailable();
  };

  return (
    <button className="compare-buy" type="button" onClick={buy}>
      ดูร้านค้า
      <span aria-hidden="true">›</span>
    </button>
  );
}

const COMPARE_PLATFORM: Record<ProductCardData["platform"], { badge: string; label: string }> = {
  Shopee: { badge: "/assets/product-card/shopee-badge.png", label: "Shopee" },
  Lazada: { badge: "/assets/product-card/lazada-badge.png", label: "Lazada" },
  TikTok: { badge: "/assets/product-card/tiktok-badge.png", label: "TikTok" }
};

function ComparePlatformBadge({ platform, size = "sm" }: { platform: ProductCardData["platform"]; size?: "sm" | "lg" }) {
  const meta = COMPARE_PLATFORM[platform];
  return <img className={`cmp-badge cmp-badge--${size}`} src={meta.badge} alt={meta.label} />;
}

function trendIcon(offer: ProductCardData): { src: string; label: string } {
  // Down.svg draws an upward arrow (price up → red); Up.svg draws a downward
  // arrow (price down / cheaper → orange).
  if (offer.discountPrice > offer.averagePrice) return { src: "/assets/SVG/Train/Down.svg", label: "ราคาสูงกว่าค่าเฉลี่ย" };
  if (offer.discountPrice < offer.averagePrice) return { src: "/assets/SVG/Train/Up.svg", label: "ราคาต่ำกว่าค่าเฉลี่ย" };
  return { src: "/assets/SVG/Train/EQ.svg", label: "ราคาเท่าค่าเฉลี่ย" };
}

function CompareThumbIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="cmp-thumb">
      <path d="M4.5 7.1 7 1.9c.6-.1 1.1.1 1.4.6.2.4.2.9.1 1.5l-.4 1.6h2.9c.5 0 .9.2 1.2.6.3.4.3.9.2 1.4l-1 3.6c-.2.8-.9 1.3-1.7 1.3H4.5V7.1Zm-1.3.3v5.7H2.4c-.5 0-.9-.4-.9-.9V8.3c0-.5.4-.9.9-.9h.8Z" fill="currentColor" />
    </svg>
  );
}

export function CatalogFlowSortStatus() {
  const [portalTarget, setPortalTarget] = useState<Element | null>(null);
  const [flowScreen, setFlowScreen] = useState<FlowScreen>(null);
  const [compareOrigin, setCompareOrigin] = useState<CompareOrigin>("results");
  const [query, setQuery] = useState("");
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [selectedOffer, setSelectedOffer] = useState<ProductCardData | null>(null);
  const [mallOnly, setMallOnly] = useState(true);
  const [freeShipOnly, setFreeShipOnly] = useState(true);
  const [sortMode, setSortMode] = useState<SortMode>("price-asc");
  const [sortOpen, setSortOpen] = useState(false);
  const [compareToast, setCompareToast] = useState("");
  const [compareDiscountDetailsOpen, setCompareDiscountDetailsOpen] = useState(false);
  const syncFrame = useRef<number | null>(null);
  const sortControlRef = useRef<HTMLDivElement | null>(null);
  const favorites = useFavorites();

  const exactGroups = useMemo(() => findGroups(query), [query]);

  const visibleExactGroups = useMemo(() => {
    const filtered = exactGroups.filter((group) => passesFilters(group, mallOnly, freeShipOnly));
    return sortGroups(filtered, sortMode);
  }, [exactGroups, mallOnly, freeShipOnly, sortMode]);

  const recommendationGroups = useMemo(() => {
    if (visibleExactGroups.length >= TARGET_CARD_COUNT) return [];

    const exactIds = new Set(exactGroups.map((group) => group.id));
    const exactCategories = new Set(exactGroups.map((group) => group.category));
    const candidates = groups
      .filter((group) => !exactIds.has(group.id))
      .filter((group) => passesFilters(group, mallOnly, freeShipOnly))
      .map((group, originalIndex) => ({
        group,
        originalIndex,
        categoryScore: exactCategories.has(group.category) ? 0 : 1
      }))
      .sort((a, b) => a.categoryScore - b.categoryScore || a.originalIndex - b.originalIndex)
      .map((item) => item.group);

    return sortGroups(candidates, sortMode).slice(0, TARGET_CARD_COUNT - visibleExactGroups.length);
  }, [exactGroups, visibleExactGroups.length, mallOnly, freeShipOnly, sortMode]);

  const selectedGroup = groups.find((group) => group.id === selectedGroupId) ?? null;

  const openCatalogResults = (nextQuery: string) => {
    const cleanQuery = nextQuery.trim() || "รองเท้าวิ่ง";
    setQuery(cleanQuery);
    setSelectedGroupId(null);
    setSelectedOffer(null);
    setSortOpen(false);
    setFlowScreen(findGroups(cleanQuery).length ? "results" : "no-results");
  };

  const openCompare = (group: ProductGroup, offer: ProductCardData = group.representative) => {
    setSelectedGroupId(group.id);
    setSelectedOffer(offer);
    setCompareOrigin("results");
    setSortOpen(false);
    setCompareDiscountDetailsOpen(false);
    setFlowScreen("compare");
  };

  const navigateBase = (index: number) => {
    setSortOpen(false);
    setFlowScreen(null);
    window.requestAnimationFrame(() => {
      const navButtons = document.querySelectorAll<HTMLButtonElement>(".search-screen .bottom-nav button");
      navButtons[index]?.click();
    });
  };

  useEffect(() => {
    setPortalTarget(document.querySelector(".phone-shell"));

    const syncSearchScreen = () => {
      const suggestionButtons = Array.from(
        document.querySelectorAll<HTMLButtonElement>(".search-screen .suggestions button")
      );

      suggestionButtons.forEach((button, index) => {
        const suggestion = searchSuggestions[index];
        if (!suggestion) return;

        const label = button.querySelector<HTMLElement>(":scope > span");
        const trend = button.querySelector<HTMLElement>("small");
        const expectedTrend = `⌁ นิยม ${suggestion.trend}`;

        if (label && label.textContent !== suggestion.label) label.textContent = suggestion.label;
        if (trend && trend.textContent?.replace(/\s+/g, " ").trim() !== expectedTrend) {
          trend.textContent = expectedTrend;
        }
      });

      const recentButtons = Array.from(
        document.querySelectorAll<HTMLButtonElement>(".search-screen .recent-list button")
      );
      const recentImages = [
        `${ASSET}/1-nike-shopee.webp`,
        `${ASSET}/6-adidas-lazada.webp`,
        `${ASSET}/7-crocs-shopee.webp`
      ];

      recentButtons.forEach((button, index) => {
        const label = button.querySelector<HTMLElement>(":scope > span");
        const image = button.querySelector<HTMLImageElement>("img");
        const expectedLabel = recentSearches[index];
        const expectedImage = recentImages[index];

        if (label && expectedLabel && label.textContent !== expectedLabel) label.textContent = expectedLabel;
        if (image && expectedImage && image.getAttribute("src") !== expectedImage) image.src = expectedImage;
      });
    };

    const scheduleSearchSync = () => {
      if (syncFrame.current !== null) window.cancelAnimationFrame(syncFrame.current);
      syncFrame.current = window.requestAnimationFrame(() => {
        syncFrame.current = window.requestAnimationFrame(() => {
          syncSearchScreen();
          syncFrame.current = null;
        });
      });
    };

    const handleInput = (event: Event) => {
      const target = event.target as HTMLElement;
      if (target.matches(".home-screen .search-field input")) scheduleSearchSync();
    };

    const handleSubmit = (event: Event) => {
      const form = event.target as HTMLFormElement;

      if (form.matches(".home-screen .search-field")) {
        scheduleSearchSync();
        return;
      }

      if (!form.matches(".search-screen .search-field")) return;

      event.preventDefault();
      event.stopPropagation();
      openCatalogResults(form.querySelector<HTMLInputElement>("input")?.value || "");
    };

    const handleClick = (event: Event) => {
      const target = event.target as HTMLElement;
      const searchChoice = target.closest<HTMLButtonElement>(
        ".search-screen .suggestions button, .search-screen .recent-list button"
      );

      if (searchChoice) {
        event.preventDefault();
        event.stopPropagation();

        const nextQuery = searchChoice.querySelector<HTMLElement>(":scope > span")?.textContent?.trim() || "";
        setControlledInputValue(
          document.querySelector<HTMLInputElement>(".search-screen .search-field input"),
          nextQuery
        );
        openCatalogResults(nextQuery);
        return;
      }

      const homeCard = target.closest<HTMLElement>(".home-card-action");
      if (!homeCard) return;
      if (target.closest(".real-product-card__heart")) return;

      event.preventDefault();
      event.stopPropagation();
      const nextQuery = homeCard.querySelector<HTMLElement>(".real-product-card__info h3")?.textContent?.trim() || "รองเท้าวิ่ง";
      openCatalogResults(nextQuery);
    };

    syncSearchScreen();
    document.addEventListener("input", handleInput, true);
    document.addEventListener("submit", handleSubmit, true);
    document.addEventListener("click", handleClick, true);

    return () => {
      if (syncFrame.current !== null) window.cancelAnimationFrame(syncFrame.current);
      document.removeEventListener("input", handleInput, true);
      document.removeEventListener("submit", handleSubmit, true);
      document.removeEventListener("click", handleClick, true);
    };
  }, []);

  useEffect(() => {
    const openCompareFromInterest = (event: Event) => {
      const detail = (event as CustomEvent<{ product?: ProductCardData; productName?: string }>).detail;
      const product = detail?.product;
      const productName = product?.productName ?? detail?.productName;
      if (!productName) return;

      const normalizedName = normalize(productName);
      const group = groups.find((item) => normalize(item.name) === normalizedName);
      if (!group) return;

      setSelectedGroupId(group.id);
      setSelectedOffer(product ?? group.representative);
      setCompareOrigin("interest");
      setSortOpen(false);
      setCompareDiscountDetailsOpen(false);
      setFlowScreen("compare");
    };

    document.addEventListener("best-choice:open-compare", openCompareFromInterest);
    return () => document.removeEventListener("best-choice:open-compare", openCompareFromInterest);
  }, []);

  useEffect(() => {
    const reopenCompareFromHistory = () => {
      if (!selectedGroupId) return;

      setSortOpen(false);
      setCompareDiscountDetailsOpen(false);
      setFlowScreen("compare");
    };

    document.addEventListener("best-choice:reopen-compare", reopenCompareFromHistory);
    return () => document.removeEventListener("best-choice:reopen-compare", reopenCompareFromHistory);
  }, [selectedGroupId]);

  useEffect(() => {
    if (!sortOpen) return;

    const closeOnOutsidePointer = (event: PointerEvent) => {
      if (!sortControlRef.current?.contains(event.target as Node)) setSortOpen(false);
    };

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSortOpen(false);
    };

    document.addEventListener("pointerdown", closeOnOutsidePointer);
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("pointerdown", closeOnOutsidePointer);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [sortOpen]);

  const submitResultSearch = (event: FormEvent) => {
    event.preventDefault();
    openCatalogResults(query);
  };

  const chooseSort = (mode: SortMode) => {
    setSortMode(mode);
    setSortOpen(false);
  };

  const closeCompare = () => {
    if (compareOrigin === "interest") {
      setFlowScreen(null);
      window.requestAnimationFrame(() => {
        document.dispatchEvent(new Event("best-choice:open-interest"));
      });
      return;
    }
    setFlowScreen("results");
  };

  const openPriceHistory = (offer: ProductCardData) => {
    setFlowScreen(null);
    window.requestAnimationFrame(() => {
      document.dispatchEvent(new CustomEvent("best-choice:open-history", {
        detail: { product: offer }
      }));
    });
  };

  if (!portalTarget || !flowScreen) return null;

  return createPortal(
    <section className="catalog-flow-screen" aria-label="ผลการค้นหาและเปรียบเทียบราคา">
      <div className="catalog-flow-status" aria-hidden="true" />

      {flowScreen === "results" && (
        <>
          <header className="catalog-results-header">
            <div className="catalog-results-search-row">
              <form className="catalog-results-search" onSubmit={submitResultSearch}>
                <button type="submit" className="catalog-search-icon" aria-label="ค้นหา">
                  <img src={SEARCH_ICON} alt="" />
                </button>
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="ค้นหาสินค้า"
                  aria-label="ค้นหาสินค้า"
                />
                {query && (
                  <button
                    type="button"
                    className="catalog-search-clear"
                    onClick={() => setQuery("")}
                    aria-label="ล้างคำค้น"
                  >
                    <img src={CLOSE_ICON} alt="" />
                  </button>
                )}
              </form>

              <div className="catalog-sort-control" ref={sortControlRef}>
                <button
                  type="button"
                  className="catalog-sort-button"
                  onClick={() => setSortOpen((current) => !current)}
                  aria-expanded={sortOpen}
                  aria-haspopup="menu"
                  aria-label="เรียงลำดับสินค้า"
                >
                  <img src={FILTER_ICON} alt="" />
                </button>

                {sortOpen && (
                  <div className="catalog-sort-menu" role="menu" aria-label="ตัวเลือกการเรียงลำดับ">
                    {SORT_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        role="menuitemradio"
                        aria-checked={sortMode === option.value}
                        className={sortMode === option.value ? "selected" : ""}
                        onClick={() => chooseSort(option.value)}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="catalog-filter-chips" aria-label="ตัวกรองสินค้า">
              <button
                type="button"
                className={`mall ${mallOnly ? "selected" : ""}`}
                onClick={() => setMallOnly((current) => !current)}
                aria-pressed={mallOnly}
              >
                Mall
              </button>
              <button
                type="button"
                className={`free-ship ${freeShipOnly ? "selected" : ""}`}
                onClick={() => setFreeShipOnly((current) => !current)}
                aria-pressed={freeShipOnly}
              >
                ส่งฟรี
              </button>
              <button
                type="button"
                className={`low-price ${sortMode === "price-asc" ? "selected" : ""}`}
                onClick={() => chooseSort(sortMode === "price-asc" ? "relevance" : "price-asc")}
                aria-pressed={sortMode === "price-asc"}
              >
                ราคาถูก
              </button>
            </div>

            <p className="catalog-result-count">พบ {visibleExactGroups.length.toLocaleString("th-TH")} รายการ</p>
          </header>

          <main className="catalog-results-grid">
            {visibleExactGroups.map((group) => (
              <ProductGroupCard key={group.id} group={group} onOpen={() => openCompare(group)} />
            ))}

            {recommendationGroups.length > 0 && (
              <h2 className="catalog-recommendation-heading">สินค้าอื่นที่คุณอาจสนใจ</h2>
            )}

            {recommendationGroups.map((group) => (
              <ProductGroupCard key={group.id} group={group} onOpen={() => openCompare(group)} />
            ))}
          </main>

          <nav className="catalog-bottom-nav" aria-label="เมนูหลัก">
            {NAV_ITEMS.map((item, index) => (
              <button type="button" key={item.label} onClick={() => navigateBase(index)}>
                <img src={item.icon} alt="" aria-hidden="true" />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </>
      )}

      {flowScreen === "compare" && selectedGroup && (() => {
        const offers = [...selectedGroup.offers].sort((a, b) => a.discountPrice - b.discountPrice);
        const bestOffer = offers[0];
        const otherOffers = offers.slice(1);
        const trackedOffer = selectedOffer ?? bestOffer;
        const favorite = favorites.isFavorite(trackedOffer);
        const bestSaving = Math.max(0, bestOffer.price - bestOffer.discountPrice);
        const baht = (value: number) => `฿${value.toLocaleString("en-US")}`;
        const flash = (message: string) => {
          setCompareToast(message);
          window.setTimeout(() => setCompareToast(""), 1800);
        };

        return (
          <section className="catalog-compare-screen cmp-screen">
            <div className="cmp-hero">
              <img src={bestOffer.imageUrl} alt={selectedGroup.name} referrerPolicy="no-referrer" />
              <div className="cmp-hero-scrim" aria-hidden="true" />
            </div>

            <div className="cmp-status" aria-hidden="true" />
            <button className="cmp-back" type="button" onClick={closeCompare} aria-label="ย้อนกลับ">
              <img src="/assets/SVG/arrow_back.svg" alt="" />
            </button>

            <header className="cmp-headline">
              <div className="cmp-headline-top">
                <h1>{selectedGroup.name}</h1>
                <button
                  className={favorite ? "cmp-track active" : "cmp-track"}
                  type="button"
                  aria-pressed={favorite}
                  aria-label={favorite ? "กำลังติดตามราคา" : "ติดตามราคา"}
                  onClick={() => favorites.toggleFavorite(trackedOffer)}
                >
                  <img src={favorite ? "/assets/SVG/Like/Property 1=Like.svg" : "/assets/SVG/Like/Property 1=Normal.svg"} alt="" />
                  {favorite ? "กำลังติดตาม" : "สนใจ"}
                </button>
              </div>
              <div className="cmp-stats" aria-label={`ราคาต่ำสุด ${baht(bestOffer.discountPrice)} ประหยัดได้ ${baht(bestSaving)} เทียบ ${offers.length} แพลตฟอร์ม`}>
                <div>
                  <span>ราคาต่ำสุด</span>
                  <b>{baht(bestOffer.discountPrice)}</b>
                </div>
                <i aria-hidden="true" />
                <div>
                  <span>ประหยัดได้</span>
                  <b className="cmp-stat-save">{baht(bestSaving)}</b>
                </div>
                <i aria-hidden="true" />
                <div>
                  <span>แพลตฟอร์มที่เทียบ</span>
                  <b>{offers.length} แห่ง</b>
                </div>
              </div>
            </header>

            <main className="cmp-list">
              <div className="cmp-sortbar">
                <span>เรียงจากคะแนน <b>Best choice Score</b></span>
                <svg className="cmp-info" viewBox="0 0 14 14" aria-hidden="true">
                  <circle cx="7" cy="7" r="6.2" fill="none" stroke="currentColor" strokeWidth="1.1" />
                  <circle cx="7" cy="4.2" r="0.9" fill="currentColor" />
                  <rect x="6.35" y="6" width="1.3" height="4.2" rx="0.65" fill="currentColor" />
                </svg>
                <svg className="cmp-caret" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M7 10l5 5 5-5z" fill="currentColor" />
                </svg>
              </div>

              <article className="cmp-card cmp-card--best">
                <div className="cmp-card-head">
                  <span className="cmp-bc-best">
                    <CompareThumbIcon />
                    Best Choice <b>{bestOffer.rating}</b>
                  </span>
                  <ComparePlatformBadge platform={bestOffer.platform} size="lg" />
                </div>

                <div className="cmp-card-mid">
                  <div className="cmp-price-col">
                    <div className="cmp-price cmp-price--lg">
                      <strong>{baht(bestOffer.discountPrice)}</strong>
                      <del>{baht(bestOffer.price)}</del>
                    </div>
                    <p className="cmp-save">ประหยัด {baht(bestSaving)}</p>
                  </div>
                  <button
                    className="cmp-trend"
                    type="button"
                    aria-label={`ดูแนวโน้มราคา ${bestOffer.platform}`}
                    onClick={() => openPriceHistory(bestOffer)}
                  >
                    <CatalogCompareTrend offer={bestOffer} />
                    <span>แนวโน้มราคา <b aria-hidden="true">›</b></span>
                  </button>
                </div>

                <button
                  className="cmp-discount-bar"
                  type="button"
                  aria-expanded={compareDiscountDetailsOpen}
                  onClick={() => setCompareDiscountDetailsOpen((current) => !current)}
                >
                  <span>รายละเอียดส่วนลด</span>
                  <b>
                    {compareDiscountDetailsOpen ? "ซ่อนรายละเอียด" : "ดูรายละเอียด"}
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 10l5 5 5-5z" fill="currentColor" /></svg>
                  </b>
                </button>
                <div className={compareDiscountDetailsOpen ? "cmp-discount-panel open" : "cmp-discount-panel"} aria-hidden={!compareDiscountDetailsOpen}>
                  <div className="cmp-discount-inner">
                    <div className="cmp-discount-head">
                      <span>ส่วนลดเพิ่มเติมที่ได้รับ</span>
                      <b>รวม ฿{catalogCompareDiscountTotal.toLocaleString("en-US")}</b>
                    </div>
                    {catalogCompareDiscountDetails.map((detail) => (
                      <div className="cmp-discount-row" key={detail.label}>
                        <span>{detail.label}</span>
                        <b>-฿{detail.amount.toLocaleString("en-US")}</b>
                      </div>
                    ))}
                  </div>
                </div>

                <CatalogCompareBuy offer={bestOffer} onUnavailable={() => flash("ยังไม่มีลิงก์ร้านค้านี้ใน Prototype")} />
              </article>

              {otherOffers.map((offer) => (
                <article className="cmp-card cmp-card--offer" key={offer.id}>
                  <div className="cmp-offer-info">
                    <div className="cmp-card-head">
                      <span className="cmp-bc">
                        <img src="/assets/product-card/star.svg" alt="" width={11} height={11} />
                        {offer.rating}
                      </span>
                      <ComparePlatformBadge platform={offer.platform} size="sm" />
                    </div>
                    <div className="cmp-price">
                      <strong>{baht(offer.discountPrice)}</strong>
                      <del>{baht(offer.price)}</del>
                    </div>
                    <p className="cmp-higher">แพงกว่า +{baht(offer.discountPrice - bestOffer.discountPrice)}</p>
                  </div>
                  <div className="cmp-offer-actions">
                    <button
                      className="cmp-graph"
                      type="button"
                      aria-label={`ดูกราฟราคา ${offer.platform} ${trendIcon(offer).label}`}
                      onClick={() => openPriceHistory(offer)}
                    >
                      <img src={trendIcon(offer).src} alt="" />
                    </button>
                    <CatalogCompareBuy offer={offer} onUnavailable={() => flash("ยังไม่มีลิงก์ร้านค้านี้ใน Prototype")} />
                  </div>
                </article>
              ))}
            </main>

            <nav className="catalog-bottom-nav" aria-label="เมนูหลัก">
              {NAV_ITEMS.map((item, index) => (
                <button type="button" key={item.label} onClick={() => navigateBase(index)}>
                  <img src={item.icon} alt="" aria-hidden="true" />
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>

            {compareToast && <div className="toast" role="status">{compareToast}</div>}
          </section>
        );
      })()}

      {flowScreen === "no-results" && (
        <section className="catalog-no-results-reference" aria-label="ไม่พบสินค้าที่ค้นหา">
          <img src="/assets/screens/no-results.png" alt="" aria-hidden="true" />
          <button
            className="catalog-no-results-search"
            type="button"
            aria-label="แก้ไขคำค้นหา"
            onClick={() => setFlowScreen(null)}
          />
          <button
            className="catalog-no-results-clear"
            type="button"
            aria-label="ล้างตัวกรอง"
            onClick={() => {
              setQuery("รองเท้าวิ่ง Nike");
              setMallOnly(false);
              setFreeShipOnly(false);
              setSortMode("price-asc");
              setFlowScreen("results");
            }}
          />
          <div className="catalog-no-results-nav" aria-label="เมนูหลัก">
            {NAV_ITEMS.map((item, index) => (
              <button
                type="button"
                key={item.label}
                aria-label={item.label}
                onClick={() => navigateBase(index)}
              />
            ))}
          </div>
        </section>
      )}
    </section>,
    portalTarget
  );
}
