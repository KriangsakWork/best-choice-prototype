"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { ProductCard, ProductCardData } from "./ProductCard";
import { recentSearches, searchSuggestions } from "../data/catalog";

type ProductCategory = "Sneakers" | "RunShoes" | "Sandals" | "WomanShoes";
type FlowScreen = "results" | "compare" | "no-results" | null;

type ProductGroup = {
  id: string;
  category: ProductCategory;
  name: string;
  aliases: string[];
  representative: ProductCardData;
  offers: ProductCardData[];
};

const ASSET = "/assets/products/product-pic";

function makeOffer(
  id: number,
  productName: string,
  platform: ProductCardData["platform"],
  discountPrice: number,
  averagePrice: number,
  imageUrl: string,
  sold: number | string,
  freeShip = true,
  mall = true
): ProductCardData {
  const difference = Math.round(Math.abs(discountPrice - averagePrice) / averagePrice * 100);

  return {
    id,
    productName,
    platform,
    price: Math.round(discountPrice * 1.16),
    discountPrice,
    percent: 14,
    rating: platform === "TikTok" ? 4.8 : 4.9,
    sold,
    freeShip,
    mall,
    imageUrl,
    productUrl: "",
    averagePrice,
    trendLabel: discountPrice <= averagePrice ? "ลดจากค่าเฉลี่ย" : "เพิ่มจากค่าเฉลี่ย",
    trendPercent: difference
  };
}

function makeGroup(
  id: string,
  category: ProductCategory,
  name: string,
  aliases: string[],
  imageUrl: string,
  prices: [number, number, number],
  averagePrice: number,
  startId: number
): ProductGroup {
  const offers = [
    makeOffer(startId, name, "Lazada", prices[0], averagePrice, imageUrl, 185, false, true),
    makeOffer(startId + 1, name, "TikTok", prices[1], averagePrice, imageUrl, 446, true, false),
    makeOffer(startId + 2, name, "Shopee", prices[2], averagePrice, imageUrl, "2k+", true, true)
  ].sort((a, b) => a.discountPrice - b.discountPrice);

  return {
    id,
    category,
    name,
    aliases,
    representative: offers[0],
    offers
  };
}

const nikeOffers: ProductCardData[] = [
  makeOffer(1, "Nike Air Force 1 '07", "Lazada", 3328, 3437.33, `${ASSET}/1-nike-lazada.webp`, 86, true, true),
  makeOffer(2, "Nike Air Force 1 '07", "TikTok", 3390, 3437.33, `${ASSET}/1-nike-tiktok.webp`, 70, false, false),
  makeOffer(3, "Nike Air Force 1 '07", "Shopee", 3594, 3437.33, `${ASSET}/1-nike-shopee.webp`, 56, true, true)
].sort((a, b) => a.discountPrice - b.discountPrice);

const groups: ProductGroup[] = [
  {
    id: "nike-air-force-1-07",
    category: "Sneakers",
    name: "Nike Air Force 1 '07",
    aliases: ["nike", "air force", "air force 1", "af1", "รองเท้าผ้าใบ", "รองเท้า nike"],
    representative: nikeOffers[0],
    offers: nikeOffers
  },
  makeGroup(
    "converse-chuck-taylor",
    "Sneakers",
    "Converse Chuck Taylor",
    ["converse", "chuck taylor", "chuck 70", "รองเท้าผ้าใบ"],
    `${ASSET}/2-converse-shopee.webp`,
    [2950, 3040, 3090],
    3026.67,
    10
  ),
  makeGroup(
    "vans-old-skool",
    "Sneakers",
    "Vans Old Skool",
    ["vans", "old skool", "old school", "รองเท้าผ้าใบ"],
    `${ASSET}/3-vans-tiktok.webp`,
    [2190, 2565, 2590],
    2448.33,
    20
  ),
  makeGroup(
    "new-balance-740",
    "RunShoes",
    "New Balance 740",
    ["new balance", "new balance 740", "nb 740", "รองเท้าวิ่ง"],
    `${ASSET}/4-nb-lazada.webp`,
    [1949, 4050, 4150],
    3383,
    30
  ),
  makeGroup(
    "adidas-ultraboost-light",
    "RunShoes",
    "Adidas Ultraboost Light",
    ["adidas", "ultraboost", "adidas ultraboost", "รองเท้าวิ่ง"],
    `${ASSET}/6-adidas-lazada.webp`,
    [3750, 4410, 4500],
    4220,
    40
  ),
  makeGroup(
    "crocs-classic-clog",
    "Sandals",
    "Crocs Classic Clog",
    ["crocs", "classic clog", "รองเท้าแตะ"],
    `${ASSET}/7-crocs-shopee.webp`,
    [2040, 2040, 2190],
    2090,
    50
  ),
  makeGroup(
    "birkenstock-arizona",
    "Sandals",
    "Birkenstock Arizona",
    ["birkenstock", "arizona", "รองเท้าแตะ"],
    `${ASSET}/8-birken-tiktok.webp`,
    [3311, 3990, 5190],
    4163.67,
    60
  ),
  makeGroup(
    "kito-biocare",
    "Sandals",
    "Kito BioCare",
    ["kito", "กีโต้", "รองเท้าแตะ"],
    `${ASSET}/9-kito-tiktok.png`,
    [486, 524, 529],
    513,
    70
  ),
  makeGroup(
    "womenager-jane-original",
    "WomanShoes",
    "Womenager - Jane Original",
    ["womenager", "jane original", "รองเท้าผู้หญิง", "คัทชู"],
    `${ASSET}/10-womanager-shopee.webp`,
    [1740, 1790, 2541],
    2023.67,
    80
  ),
  makeGroup(
    "flynn-ballet-flats",
    "WomanShoes",
    "Flynn - Ballet Flats",
    ["flynn", "ballet flats", "รองเท้าผู้หญิง", "คัทชู"],
    `${ASSET}/11-flynn-shopee.webp`,
    [1352, 1440, 1490],
    1427.33,
    90
  )
];

function normalize(value: string) {
  return value.trim().toLocaleLowerCase("th-TH").replace(/\s+/g, " ");
}

function findGroups(query: string) {
  const normalized = normalize(query);
  if (!normalized) return groups.slice(0, 6);

  const categoryMap: Record<string, ProductCategory> = {
    "รองเท้าวิ่ง": "RunShoes",
    "รองเท้าผ้าใบ": "Sneakers",
    "รองเท้าแตะ": "Sandals",
    "รองเท้าผู้หญิง": "WomanShoes"
  };

  const category = categoryMap[normalized];
  if (category) return groups.filter((group) => group.category === category);

  return groups.filter((group) => {
    const terms = [group.name, ...group.aliases].map(normalize);
    return terms.some((term) => term.includes(normalized) || normalized.includes(term));
  });
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

  const resultGroups = useMemo(() => findGroups(query), [query]);
  const selectedGroup = groups.find((group) => group.id === selectedGroupId) ?? null;

  useEffect(() => {
    const syncSearchScreen = () => {
      const nextPortalTarget = document.querySelector(".phone-shell");
      setPortalTarget((current) => current === nextPortalTarget ? current : nextPortalTarget);

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
        `${ASSET}/6-adidas-shopee.webp`,
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

    syncSearchScreen();
    const syncTimer = window.setInterval(syncSearchScreen, 250);

    const handleSubmit = (event: Event) => {
      const form = event.target as HTMLFormElement;
      if (!form.matches(".search-screen .search-field")) return;

      event.preventDefault();
      event.stopPropagation();

      const input = form.querySelector<HTMLInputElement>("input");
      const nextQuery = input?.value.trim() || "รองเท้าวิ่ง";
      const matches = findGroups(nextQuery);

      setQuery(nextQuery);
      setSelectedGroupId(null);
      setFlowScreen(matches.length ? "results" : "no-results");
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
      setQuery(nextQuery);
      setSelectedGroupId(null);
      setFlowScreen(findGroups(nextQuery).length ? "results" : "no-results");
    };

    document.addEventListener("submit", handleSubmit, true);
    document.addEventListener("click", handleClick, true);

    return () => {
      window.clearInterval(syncTimer);
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
