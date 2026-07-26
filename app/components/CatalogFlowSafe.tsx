"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ProductCard, ProductCardData } from "./ProductCard";
import { recentSearches, searchSuggestions } from "../data/catalog";

type Category = "Sneakers" | "RunShoes" | "Sandals" | "WomanShoes";
type FlowScreen = "results" | "compare" | "no-results" | null;

type ProductGroup = {
  id: string;
  category: Category;
  name: string;
  aliases: string[];
  representative: ProductCardData;
  offers: ProductCardData[];
};

type GroupSeed = {
  id: string;
  category: Category;
  name: string;
  aliases: string[];
  image: string;
  prices: [number, number, number];
  average: number;
};

const ASSET = "/assets/products/product-pic";

function makeOffer(
  id: number,
  name: string,
  platform: ProductCardData["platform"],
  price: number,
  average: number,
  imageUrl: string,
  sold: number | string,
  freeShip: boolean,
  mall: boolean
): ProductCardData {
  return {
    id,
    productName: name,
    platform,
    price: Math.round(price * 1.16),
    discountPrice: price,
    percent: 14,
    rating: platform === "TikTok" ? 4.8 : 4.9,
    sold,
    freeShip,
    mall,
    imageUrl,
    productUrl: "",
    averagePrice: average,
    trendLabel: price <= average ? "ลดจากค่าเฉลี่ย" : "เพิ่มจากค่าเฉลี่ย",
    trendPercent: Math.round(Math.abs(price - average) / average * 100)
  };
}

function createGroup(seed: GroupSeed, startId: number): ProductGroup {
  const offers = [
    makeOffer(startId, seed.name, "Lazada", seed.prices[0], seed.average, seed.image, 185, true, true),
    makeOffer(startId + 1, seed.name, "TikTok", seed.prices[1], seed.average, seed.image, 446, false, false),
    makeOffer(startId + 2, seed.name, "Shopee", seed.prices[2], seed.average, seed.image, "2k+", true, true)
  ].sort((a, b) => a.discountPrice - b.discountPrice);

  return {
    id: seed.id,
    category: seed.category,
    name: seed.name,
    aliases: seed.aliases,
    representative: offers[0],
    offers
  };
}

const nikeOffers = [
  makeOffer(1, "Nike Air Force 1 '07", "Lazada", 3328, 3437.33, `${ASSET}/1-nike-lazada.webp`, 86, true, true),
  makeOffer(2, "Nike Air Force 1 '07", "TikTok", 3390, 3437.33, `${ASSET}/1-nike-tiktok.webp`, 70, false, false),
  makeOffer(3, "Nike Air Force 1 '07", "Shopee", 3594, 3437.33, `${ASSET}/1-nike-shopee.webp`, 56, true, true)
].sort((a, b) => a.discountPrice - b.discountPrice);

const seeds: GroupSeed[] = [
  {
    id: "converse-chuck-taylor",
    category: "Sneakers",
    name: "Converse Chuck Taylor",
    aliases: ["converse", "chuck taylor", "chuck 70", "รองเท้าผ้าใบ"],
    image: `${ASSET}/2-converse-shopee.webp`,
    prices: [2950, 3040, 3090],
    average: 3026.67
  },
  {
    id: "vans-old-skool",
    category: "Sneakers",
    name: "Vans Old Skool",
    aliases: ["vans", "old skool", "old school", "รองเท้าผ้าใบ"],
    image: `${ASSET}/3-vans-tiktok.webp`,
    prices: [2190, 2565, 2590],
    average: 2448.33
  },
  {
    id: "new-balance-740",
    category: "RunShoes",
    name: "New Balance 740",
    aliases: ["new balance", "new balance 740", "nb 740", "รองเท้าวิ่ง"],
    image: `${ASSET}/4-nb-lazada.webp`,
    prices: [1949, 4050, 4150],
    average: 3383
  },
  {
    id: "adidas-ultraboost-light",
    category: "RunShoes",
    name: "Adidas Ultraboost Light",
    aliases: ["adidas", "ultraboost", "adidas ultraboost", "รองเท้าวิ่ง"],
    image: `${ASSET}/6-adidas-lazada.webp`,
    prices: [3750, 4410, 4500],
    average: 4220
  },
  {
    id: "crocs-classic-clog",
    category: "Sandals",
    name: "Crocs Classic Clog",
    aliases: ["crocs", "classic clog", "รองเท้าแตะ"],
    image: `${ASSET}/7-crocs-shopee.webp`,
    prices: [2040, 2040, 2190],
    average: 2090
  },
  {
    id: "birkenstock-arizona",
    category: "Sandals",
    name: "Birkenstock Arizona",
    aliases: ["birkenstock", "arizona", "รองเท้าแตะ"],
    image: `${ASSET}/8-birken-tiktok.webp`,
    prices: [3311, 3990, 5190],
    average: 4163.67
  },
  {
    id: "kito-biocare",
    category: "Sandals",
    name: "Kito BioCare",
    aliases: ["kito", "กีโต้", "รองเท้าแตะ"],
    image: `${ASSET}/9-kito-tiktok.png`,
    prices: [486, 524, 529],
    average: 513
  },
  {
    id: "womenager-jane-original",
    category: "WomanShoes",
    name: "Womenager - Jane Original",
    aliases: ["womenager", "jane original", "รองเท้าผู้หญิง", "คัทชู"],
    image: `${ASSET}/10-womanager-shopee.webp`,
    prices: [1740, 1790, 2541],
    average: 2023.67
  },
  {
    id: "flynn-ballet-flats",
    category: "WomanShoes",
    name: "Flynn - Ballet Flats",
    aliases: ["flynn", "ballet flats", "รองเท้าผู้หญิง", "คัทชู"],
    image: `${ASSET}/11-flynn-shopee.webp`,
    prices: [1352, 1440, 1490],
    average: 1427.33
  }
];

const groups: ProductGroup[] = [
  {
    id: "nike-air-force-1-07",
    category: "Sneakers",
    name: "Nike Air Force 1 '07",
    aliases: ["nike", "air force", "air force 1", "af1", "รองเท้าผ้าใบ", "รองเท้า nike"],
    representative: nikeOffers[0],
    offers: nikeOffers
  },
  ...seeds.map((seed, index) => createGroup(seed, 10 + index * 3))
];

function normalize(value: string) {
  return value.trim().toLocaleLowerCase("th-TH").replace(/\s+/g, " ");
}

function findGroups(query: string) {
  const normalized = normalize(query);
  if (!normalized) return groups.slice(0, 6);

  const categoryMap: Record<string, Category> = {
    "รองเท้าวิ่ง": "RunShoes",
    "รองเท้าผ้าใบ": "Sneakers",
    "รองเท้าแตะ": "Sandals",
    "รองเท้าผู้หญิง": "WomanShoes"
  };

  const category = categoryMap[normalized];
  if (category) return groups.filter((group) => group.category === category);

  return groups.filter((group) =>
    [group.name, ...group.aliases]
      .map(normalize)
      .some((term) => term.includes(normalized) || normalized.includes(term))
  );
}

function setControlledInputValue(input: HTMLInputElement | null, value: string) {
  if (!input) return;
  const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
  setter?.call(input, value);
  input.dispatchEvent(new Event("input", { bubbles: true }));
}

export function CatalogFlowSafe() {
  const [portalTarget, setPortalTarget] = useState<Element | null>(null);
  const [flowScreen, setFlowScreen] = useState<FlowScreen>(null);
  const [query, setQuery] = useState("");
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const syncFrame = useRef<number | null>(null);

  const resultGroups = useMemo(() => findGroups(query), [query]);
  const selectedGroup = groups.find((group) => group.id === selectedGroupId) ?? null;

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

    const openCatalogResults = (nextQuery: string) => {
      const cleanQuery = nextQuery.trim() || "รองเท้าวิ่ง";
      setQuery(cleanQuery);
      setSelectedGroupId(null);
      setFlowScreen(findGroups(cleanQuery).length ? "results" : "no-results");
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
      const button = target.closest<HTMLButtonElement>(
        ".search-screen .suggestions button, .search-screen .recent-list button"
      );
      if (!button) return;

      event.preventDefault();
      event.stopPropagation();

      const nextQuery = button.querySelector<HTMLElement>(":scope > span")?.textContent?.trim() || "";
      setControlledInputValue(
        document.querySelector<HTMLInputElement>(".search-screen .search-field input"),
        nextQuery
      );
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
