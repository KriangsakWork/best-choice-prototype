"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { ProductCard, ProductCardData } from "./ProductCard";
import { matchesCatalogSearch, recentSearches, searchSuggestions } from "../data/catalog";

type ProductGroup = {
  id: string;
  category: "Sneakers" | "RunShoes" | "Sandals" | "WomanShoes";
  name: string;
  aliases: string[];
  representative: ProductCardData;
  offers: ProductCardData[];
};

type FlowScreen = "results" | "compare" | "no-results" | null;

const ASSET = "/assets/products/product-pic";

const nikeOffers: ProductCardData[] = [
  {
    id: 2,
    productName: "Nike Air Force 1 '07",
    platform: "Lazada",
    price: 4300,
    discountPrice: 3328,
    percent: 23,
    rating: 5,
    sold: 86,
    freeShip: true,
    mall: true,
    imageUrl: `${ASSET}/1-nike-lazada.webp`,
    productUrl: "",
    averagePrice: 3437.33,
    trendLabel: "ลดจากค่าเฉลี่ย",
    trendPercent: 3
  },
  {
    id: 3,
    productName: "Nike Air Force 1 '07",
    platform: "TikTok",
    price: 5290,
    discountPrice: 3390,
    percent: 36,
    rating: 4.3,
    sold: 70,
    freeShip: false,
    mall: false,
    imageUrl: `${ASSET}/1-nike-tiktok.webp`,
    productUrl: "",
    averagePrice: 3437.33,
    trendLabel: "ลดจากค่าเฉลี่ย",
    trendPercent: 1
  },
  {
    id: 1,
    productName: "Nike Air Force 1 '07",
    platform: "Shopee",
    price: 4300,
    discountPrice: 3594,
    percent: 16,
    rating: 5,
    sold: 56,
    freeShip: true,
    mall: true,
    imageUrl: `${ASSET}/1-nike-shopee.webp`,
    productUrl: "https://shopee.co.th/product/1676687866/56408537514",
    averagePrice: 3437.33,
    trendLabel: "เพิ่มจากค่าเฉลี่ย",
    trendPercent: 5
  }
];

function makeOfferSet(
  startId: number,
  productName: string,
  imageBase: string,
  prices: [number, number, number],
  averagePrice: number
): ProductCardData[] {
  const platforms: ProductCardData["platform"][] = ["Lazada", "TikTok", "Shopee"];
  const suffixes = ["lazada", "tiktok", "shopee"];

  return prices
    .map((discountPrice, index) => ({
      id: startId + index,
      productName,
      platform: platforms[index],
      price: Math.round(discountPrice * 1.16),
      discountPrice,
      percent: 14,
      rating: index === 1 ? 4.8 : 4.9,
      sold: index === 0 ? 185 : index === 1 ? 446 : "2k+",
      freeShip: index !== 1,
      mall: index !== 1,
      imageUrl: `${ASSET}/${imageBase}-${suffixes[index]}.webp`,
      productUrl: "",
      averagePrice,
      trendLabel: discountPrice <= averagePrice ? "ลดจากค่าเฉลี่ย" : "เพิ่มจากค่าเฉลี่ย",
      trendPercent: Math.round(Math.abs(discountPrice - averagePrice) / averagePrice * 100)
    }))
    .sort((a, b) => a.discountPrice - b.discountPrice);
}

const groups: ProductGroup[] = [
  {
    id: "nike-air-force-1-07",
    category: "Sneakers",
    name: "Nike Air Force 1 '07",
    aliases: ["nike", "air force", "af1", "รองเท้าผ้าใบ"],
    representative: nikeOffers[0],
    offers: nikeOffers
  },
  {
    id: "converse-chuck-taylor",
    category: "Sneakers",
    name: "Converse Chuck Taylor",
    aliases: ["converse", "chuck taylor", "chuck 70", "รองเท้าผ้าใบ"],
    representative: makeOfferSet(10, "Converse Chuck Taylor", "2-converse", [2950, 3040, 3090], 3026.67)[0],
    offers: makeOfferSet(10, "Converse Chuck Taylor", "2-converse", [2950, 3040, 3090], 3026.67)
  },
  {
    id: "vans-old-skool",
    category: "Sneakers",
    name: "Vans Old Skool",
    aliases: ["vans", "old skool", "old school", "รองเท้าผ้าใบ"],
    representative: makeOfferSet(20, "Vans Old Skool", "3-vans", [2190, 2565, 2590], 2448.33)[0],
    offers: makeOfferSet(20, "Vans Old Skool", "3-vans", [2190, 2565, 2590], 2448.33)
  },
  {
    id: "new-balance-740",
    category: "RunShoes",
    name: "New Balance 740",
    aliases: ["new balance", "nb 740", "รองเท้าวิ่ง"],
    representative: makeOfferSet(30, "New Balance 740", "4-nb", [1949, 4050, 4150], 3383)[0],
    offers: makeOfferSet(30, "New Balance 740", "4-nb", [1949, 4050, 4150], 3383)
  },
  {
    id: "adidas-ultraboost-light",
    category: "RunShoes",
    name: "Adidas Ultraboost Light",
    aliases: ["adidas", "ultraboost", "รองเท้าวิ่ง"],
    representative: makeOfferSet(40, "Adidas Ultraboost Light", "6-adidas", [3750, 4410, 4500], 4220)[0],
    offers: makeOfferSet(40, "Adidas Ultraboost Light", "6-adidas", [3750, 4410, 4500], 4220)
  },
  {
    id: "crocs-classic-clog",
    category: "Sandals",
    name: "Crocs Classic Clog",
    aliases: ["crocs", "classic clog", "รองเท้าแตะ"],
    representative: makeOfferSet(50, "Crocs Classic Clog", "7-crocs", [2040, 2040, 2190], 2090)[0],
    offers: makeOfferSet(50, "Crocs Classic Clog", "7-crocs", [2040, 2040, 2190], 2090)
  },
  {
    id: "birkenstock-arizona",
    category: "Sandals",
    name: "Birkenstock Arizona",
    aliases: ["birkenstock", "arizona", "รองเท้าแตะ"],
    representative: makeOfferSet(60, "Birkenstock Arizona", "8-birken", [3311, 3990, 5190], 4163.67)[0],
    offers: makeOfferSet(60, "Birkenstock Arizona", "8-birken", [3311, 3990, 5190], 4163.67)
  },
  {
    id: "kito-biocare",
    category: "Sandals",
    name: "Kito BioCare",
    aliases: ["kito", "กีโต้", "รองเท้าแตะ"],
    representative: makeOfferSet(70, "Kito BioCare", "9-kito", [486, 524, 529], 513)[0],
    offers: makeOfferSet(70, "Kito BioCare", "9-kito", [486, 524, 529], 513)
  },
  {
    id: "womenager-jane-original",
    category: "WomanShoes",
    name: "Womenager - Jane Original",
    aliases: ["womenager", "jane original", "รองเท้าผู้หญิง", "คัทชู"],
    representative: makeOfferSet(80, "Womenager - Jane Original", "10-womanager", [1740, 1790, 2541], 2023.67)[0],
    offers: makeOfferSet(80, "Womenager - Jane Original", "10-womanager", [1740, 1790, 2541], 2023.67)
  },
  {
    id: "flynn-ballet-flats",
    category: "WomanShoes",
    name: "Flynn - Ballet Flats",
    aliases: ["flynn", "ballet flats", "รองเท้าผู้หญิง", "คัทชู"],
    representative: makeOfferSet(90, "Flynn - Ballet Flats", "11-flynn", [1352, 1440, 1490], 1427.33)[0],
    offers: makeOfferSet(90, "Flynn - Ballet Flats", "11-flynn", [1352, 1440, 1490], 1427.33)
  }
];

function normalize(value: string) {
  return value.trim().toLocaleLowerCase("th-TH").replace(/\s+/g, " ");
}

function findGroups(query: string) {
  const normalized = normalize(query);
  if (!normalized) return groups.slice(0, 6);

  const categoryMap: Record<string, ProductGroup["category"]> = {
    "รองเท้าวิ่ง": "RunShoes",
    "รองเท้าผ้าใบ": "Sneakers",
    "รองเท้าแตะ": "Sandals",
    "รองเท้าผู้หญิง": "WomanShoes"
  };

  const category = categoryMap[normalized];
  if (category) return groups.filter((group) => group.category === category);

  return groups.filter((group) => {
    const haystack = normalize([group.name, ...group.aliases].join(" "));
    return haystack.includes(normalized) || normalized.includes(normalize(group.name));
  });
}

export function CatalogFlow() {
  const [portalTarget, setPortalTarget] = useState<Element | null>(null);
  const [flowScreen, setFlowScreen] = useState<FlowScreen>(null);
  const [query, setQuery] = useState("");
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);

  const resultGroups = useMemo(() => findGroups(query), [query]);
  const selectedGroup = groups.find((group) => group.id === selectedGroupId) ?? null;

  useEffect(() => {
    const updateSearchScreenCopy = () => {
      const suggestionButtons = Array.from(document.querySelectorAll<HTMLButtonElement>(".search-screen .suggestions button"));
      suggestionButtons.forEach((button, index) => {
        const suggestion = searchSuggestions[index];
        if (!suggestion) return;
        const label = button.querySelector<HTMLElement>(":scope > span");
        const trend = button.querySelector<HTMLElement>("small");
        if (label) label.textContent = suggestion.label;
        if (trend) trend.innerHTML = `<span aria-hidden=\"true\">⌁</span> นิยม ${suggestion.trend}`;
      });

      const recentButtons = Array.from(document.querySelectorAll<HTMLButtonElement>(".search-screen .recent-list button"));
      recentButtons.forEach((button, index) => {
        const label = button.querySelector<HTMLElement>(":scope > span");
        const image = button.querySelector<HTMLImageElement>("img");
        if (label && recentSearches[index]) label.textContent = recentSearches[index];
        if (image && index === 0) image.src = `${ASSET}/1-nike-shopee.webp`;
        if (image && index === 1) image.src = `${ASSET}/6-adidas-shopee.webp`;
        if (image && index === 2) image.src = `${ASSET}/7-crocs-shopee.webp`;
      });
    };

    const observer = new MutationObserver(() => {
      setPortalTarget(document.querySelector(".phone-shell"));
      updateSearchScreenCopy();
    });

    observer.observe(document.body, { childList: true, subtree: true });
    setPortalTarget(document.querySelector(".phone-shell"));
    updateSearchScreenCopy();

    const handleSubmit = (event: Event) => {
      const form = event.target as HTMLFormElement;
      if (!form.matches(".search-screen .search-field")) return;

      event.preventDefault();
      event.stopPropagation();
      const input = form.querySelector<HTMLInputElement>("input");
      const nextQuery = input?.value.trim() || "รองเท้าวิ่ง";
      setQuery(nextQuery);
      setSelectedGroupId(null);
      setFlowScreen(matchesCatalogSearch(nextQuery) && findGroups(nextQuery).length ? "results" : "no-results");
    };

    const handleClick = (event: Event) => {
      const target = event.target as HTMLElement;
      const button = target.closest<HTMLButtonElement>(".search-screen .suggestions button, .search-screen .recent-list button");
      if (!button) return;

      event.preventDefault();
      event.stopPropagation();
      const label = button.querySelector<HTMLElement>(":scope > span")?.textContent?.trim() || "";
      setQuery(label);
      setSelectedGroupId(null);
      setFlowScreen(findGroups(label).length ? "results" : "no-results");
    };

    document.addEventListener("submit", handleSubmit, true);
    document.addEventListener("click", handleClick, true);

    return () => {
      observer.disconnect();
      document.removeEventListener("submit", handleSubmit, true);
      document.removeEventListener("click", handleClick, true);
    };
  }, []);

  if (!portalTarget || !flowScreen) return null;

  return createPortal(
    <section className="catalog-flow-screen" aria-label="ผลการค้นหาและเปรียบเทียบราคา">
      <div className="catalog-flow-status" aria-hidden="true" />

      {flowScreen === "results" && (
        <>
          <header className="catalog-flow-header">
            <button type="button" onClick={() => setFlowScreen(null)} aria-label="ย้อนกลับ">‹</button>
            <div>
              <strong>{query}</strong>
              <small>เลือกสินค้า 1 รุ่นเพื่อเปรียบเทียบราคา</small>
            </div>
          </header>

          <main className="catalog-results-grid">
            {resultGroups.map((group) => {
              const selected = selectedGroupId === group.id;
              const prices = group.offers.map((offer) => offer.discountPrice);
              return (
                <button
                  key={group.id}
                  type="button"
                  className={`catalog-result-card ${selected ? "selected" : ""}`}
                  onClick={() => setSelectedGroupId(group.id)}
                  aria-pressed={selected}
                >
                  <ProductCard product={group.representative} favorite={false} />
                  <span className="catalog-result-summary">
                    พบ {group.offers.length} แพลตฟอร์ม · ฿{Math.min(...prices).toLocaleString("th-TH")}–฿{Math.max(...prices).toLocaleString("th-TH")}
                  </span>
                  {selected && <span className="catalog-selected-mark">✓</span>}
                </button>
              );
            })}
          </main>

          <button
            className={`catalog-compare-button ${selectedGroupId ? "ready" : ""}`}
            type="button"
            disabled={!selectedGroupId}
            onClick={() => selectedGroupId && setFlowScreen("compare")}
          >
            เปรียบเทียบราคา
          </button>
        </>
      )}

      {flowScreen === "compare" && selectedGroup && (
        <>
          <header className="catalog-flow-header compare">
            <button type="button" onClick={() => setFlowScreen("results")} aria-label="ย้อนกลับ">‹</button>
            <div>
              <strong>เปรียบเทียบราคา</strong>
              <small>{selectedGroup.name}</small>
            </div>
          </header>

          <main className="catalog-offers-list">
            {selectedGroup.offers.map((offer, index) => (
              <div className="catalog-offer" key={`${offer.platform}-${offer.id}`}>
                {index === 0 && <span className="catalog-best-badge">ราคาถูกที่สุด</span>}
                <ProductCard product={offer} favorite={index !== 1} />
                <button type="button" className="catalog-offer-action">ดูประวัติราคา</button>
              </div>
            ))}
          </main>
        </>
      )}

      {flowScreen === "no-results" && (
        <>
          <header className="catalog-flow-header">
            <button type="button" onClick={() => setFlowScreen(null)} aria-label="ย้อนกลับ">‹</button>
            <div><strong>{query}</strong><small>ผลการค้นหา</small></div>
          </header>
          <main className="catalog-empty-state">
            <span aria-hidden="true">⌕</span>
            <h2>ไม่พบสินค้าที่ค้นหา</h2>
            <p>ไม่พบผลลัพธ์สำหรับ “{query}”<br />ลองตรวจสอบการสะกดหรือใช้คำที่สั้นลง</p>
            <button type="button" onClick={() => setFlowScreen(null)}>แก้ไขคำค้นหา</button>
          </main>
        </>
      )}
    </section>,
    portalTarget
  );
}
