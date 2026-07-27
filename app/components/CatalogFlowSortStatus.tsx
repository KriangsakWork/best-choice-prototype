"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ProductCard, ProductCardData } from "./ProductCard";
import { recentSearches, searchSuggestions } from "../data/catalog";

type Category = "Sneakers" | "RunShoes" | "Sandals" | "WomanShoes";
type FlowScreen = "results" | "compare" | "no-results" | null;
type SortMode = "relevance" | "best-selling" | "price-desc" | "price-asc";

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
const SEARCH_ICON = "/assets/SVG/Search Bar/icon/Icon Search2.svg";
const CLOSE_ICON = "/assets/SVG/Search Bar/icon/Icon Close.svg";
const FILTER_ICON = "/assets/SVG/Search Bar/icon/Filter.svg";
const TARGET_CARD_COUNT = 6;

const SORT_OPTIONS: Array<{ value: SortMode; label: string }> = [
  { value: "relevance", label: "เกี่ยวข้อง" },
  { value: "best-selling", label: "สินค้าขายดี" },
  { value: "price-desc", label: "ราคา (จากมากไปน้อย)" },
  { value: "price-asc", label: "ราคา (จากน้อยไปมาก)" }
];

const NAV_ITEMS = [
  { label: "หน้าหลัก", icon: "/assets/SVG/Nav Bar/HIC01.svg" },
  { label: "สนใจ", icon: "/assets/SVG/Nav Bar/HIC02.svg" },
  { label: "ประหยัด", icon: "/assets/SVG/Nav Bar/HIC03.svg" },
  { label: "โปรไฟล์", icon: "/assets/SVG/Nav Bar/HIC04.svg" }
];

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
  if (!normalized) return groups.slice(0, TARGET_CARD_COUNT);

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
    if (mode === "price-desc") return getPriceRange(b).min - getPriceRange(a).min;
    return getPriceRange(a).min - getPriceRange(b).min;
  });
}

function ProductGroupCard({ group, onOpen }: { group: ProductGroup; onOpen: () => void }) {
  const range = getPriceRange(group);

  return (
    <button
      type="button"
      className="catalog-result-card"
      onClick={onOpen}
      aria-label={`เปรียบเทียบราคา ${group.name} จาก ${group.offers.length} แพลตฟอร์ม`}
    >
      <ProductCard product={group.representative} favorite />
      <span className="catalog-result-summary">
        <span className="catalog-platform-count">
          ดูราคาจาก <b>{group.offers.length}</b> แพลตฟอร์ม <span aria-hidden="true">›</span>
        </span>
        <span className="catalog-price-range">
          ฿{range.min.toLocaleString("th-TH")}–฿{range.max.toLocaleString("th-TH")}
        </span>
      </span>
    </button>
  );
}


const catalogPlatformBadges: Record<ProductCardData["platform"], { src: string; width: number; label: string }> = {
  Lazada: { src: "/assets/App/Platform=Lazada.jpg", width: 58, label: "Lazada" },
  Shopee: { src: "/assets/App/Platform=Shopee.jpg", width: 59, label: "Shopee" },
  TikTok: { src: "/assets/App/Platform=TikTok Shop.jpg", width: 54, label: "TikTok Shop" }
};

function CatalogCompareTags({ offer }: { offer: ProductCardData }) {
  const platformBadge = catalogPlatformBadges[offer.platform];

  return (
    <div className="compare-tags" aria-label={offer.platform + (offer.mall ? " Mall" : "")}>
      <img
        className="compare-platform-badge"
        src={platformBadge.src}
        alt={platformBadge.label}
        width={platformBadge.width}
        height={16}
      />
      {offer.mall && (
        <img className="compare-mall-badge" src="/assets/App/Platform=MALL.jpg" alt="MALL" />
      )}
      {offer.freeShip && <span className="compare-tag free">ส่งฟรี</span>}
    </div>
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

function CatalogCompareTrend({ price }: { price: number }) {
  const values = [price + 500, price + 390, price + 420, price + 260, price + 310, price + 120, price + 170, price];
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

function CatalogCompareUpIcon() {
  return (
    <svg viewBox="0 0 14 14" aria-hidden="true">
      <path d="M2 10.5 5.1 7.4l2.1 2.1L12 4.7V8h1V3H8v1h3.3L7.2 8.1 5.1 6 1.3 9.8z" />
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

export function CatalogFlowSortStatus() {
  const [portalTarget, setPortalTarget] = useState<Element | null>(null);
  const [flowScreen, setFlowScreen] = useState<FlowScreen>(null);
  const [query, setQuery] = useState("");
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [mallOnly, setMallOnly] = useState(true);
  const [freeShipOnly, setFreeShipOnly] = useState(true);
  const [sortMode, setSortMode] = useState<SortMode>("relevance");
  const [sortOpen, setSortOpen] = useState(false);
  const [favoriteGroupIds, setFavoriteGroupIds] = useState<string[]>(["nike-air-force-1-07"]);
  const [compareToast, setCompareToast] = useState("");
  const syncFrame = useRef<number | null>(null);
  const sortControlRef = useRef<HTMLDivElement | null>(null);

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
    setSortOpen(false);
    setFlowScreen(findGroups(cleanQuery).length ? "results" : "no-results");
  };

  const openCompare = (group: ProductGroup) => {
    setSelectedGroupId(group.id);
    setSortOpen(false);
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
        const favorite = favoriteGroupIds.includes(selectedGroup.id);
        const bestSaving = Math.max(0, bestOffer.price - bestOffer.discountPrice);
        const flash = (message: string) => {
          setCompareToast(message);
          window.setTimeout(() => setCompareToast(""), 1800);
        };

        return (
          <section className="catalog-compare-screen">
            <header className="catalog-compare-header">
              <button type="button" onClick={() => setFlowScreen("results")} aria-label="ย้อนกลับ">‹</button>
              <strong>ผลการเปรียบเทียบ</strong>
            </header>

            <main className="compare-content">
              <section className="compare-product-summary">
                <img src={bestOffer.imageUrl} alt="" />
                <div className="compare-summary-copy">
                  <span>สินค้าที่กำลังเปรียบเทียบ</span>
                  <strong>{selectedGroup.name}</strong>
                </div>
                <button
                  className={favorite ? "compare-track active" : "compare-track"}
                  type="button"
                  aria-label={favorite ? "ยกเลิกติดตามราคา" : "ติดตามราคา"}
                  aria-pressed={favorite}
                  onClick={() => setFavoriteGroupIds((current) =>
                    current.includes(selectedGroup.id)
                      ? current.filter((id) => id !== selectedGroup.id)
                      : [...current, selectedGroup.id]
                  )}
                >
                  <img
                    src={favorite ? "/assets/SVG/Like/Property 1=Like.svg" : "/assets/SVG/Like/Property 1=Normal.svg"}
                    alt=""
                  />
                  {favorite ? "กำลังติดตาม" : "ติดตามราคา"}
                </button>
                <div className="compare-summary-stats" aria-label={`เปรียบเทียบ ${offers.length} แพลตฟอร์ม ราคาต่ำสุด ${bestOffer.discountPrice.toLocaleString("en-US")} บาท`}>
                  <span>
                    <small>ราคาต่ำสุด</small>
                    <b>฿{bestOffer.discountPrice.toLocaleString("en-US")}</b>
                  </span>
                  <span>
                    <small>ประหยัดได้</small>
                    <b>฿{bestSaving.toLocaleString("en-US")}</b>
                  </span>
                  <span>
                    <small>แพลตฟอร์มที่เทียบ</small>
                    <b>{offers.length} แห่ง</b>
                  </span>
                </div>
              </section>

              <div className="compare-list-heading">
                <h2>ราคาจากแต่ละแพลตฟอร์ม</h2>
                <span>เรียงจากราคาต่ำสุด</span>
              </div>

              <section className="compare-offer-board" aria-label="ราคาจากแต่ละแพลตฟอร์ม">
                <article className="compare-offer-row best">
                  <div className="compare-row-top">
                    <CatalogCompareTags offer={bestOffer} />
                    <span className="compare-best-label">คุ้มที่สุด</span>
                  </div>
                  <div className="compare-row-main">
                    <div className="compare-row-price">
                      <strong>฿{bestOffer.discountPrice.toLocaleString("en-US")}</strong>
                      <del>฿{bestOffer.price.toLocaleString("en-US")}</del>
                    </div>
                    <CatalogCompareBuy
                      offer={bestOffer}
                      onUnavailable={() => flash("ยังไม่มีลิงก์ร้านค้านี้ใน Prototype")}
                    />
                  </div>
                  <div className="compare-row-meta">
                    <span>★ {bestOffer.rating} <i>• ขายแล้ว {bestOffer.sold} ชิ้น</i></span>
                    <b>ประหยัด ฿{bestSaving.toLocaleString("en-US")}</b>
                  </div>
                  <button
                    className="compare-best-history"
                    type="button"
                    onClick={() => flash(`กำลังเปิดกราฟราคา ${bestOffer.platform}`)}
                  >
                    <CatalogCompareTrend price={bestOffer.discountPrice} />
                    <span>
                      <small>แนวโน้มราคา 30 วัน</small>
                      <strong>ราคาลดลง {bestOffer.trendPercent}%</strong>
                    </span>
                    <b>ดูกราฟ <i aria-hidden="true">›</i></b>
                  </button>
                  <div className="compare-discount-details">
                    <div className="compare-discount-heading">
                      <span>ส่วนลดเพิ่มเติมที่ได้รับ</span>
                      <b>รวม ฿{catalogCompareDiscountTotal.toLocaleString("en-US")}</b>
                    </div>
                    <div className="compare-discount-list">
                      {catalogCompareDiscountDetails.map((detail) => (
                        <div className="compare-discount-row" key={detail.label}>
                          <span>{detail.label}</span>
                          <b>-฿{detail.amount.toLocaleString("en-US")}</b>
                        </div>
                      ))}
                    </div>
                  </div>
                </article>

                {otherOffers.map((offer) => (
                  <article className="compare-offer-row" key={offer.id}>
                    <div className="compare-row-top">
                      <CatalogCompareTags offer={offer} />
                    </div>
                    <div className="compare-row-main">
                      <div className="compare-row-price">
                        <strong>฿{offer.discountPrice.toLocaleString("en-US")}</strong>
                        <del>฿{offer.price.toLocaleString("en-US")}</del>
                      </div>
                      <div className="compare-row-actions">
                        <button
                          className="compare-graph-icon"
                          type="button"
                          aria-label={`ดูกราฟราคา ${offer.platform}`}
                          onClick={() => flash(`กำลังเปิดกราฟราคา ${offer.platform}`)}
                        >
                          <img src="/assets/SVG/Nav Bar/HIC03.svg" alt="" />
                        </button>
                        <CatalogCompareBuy
                          offer={offer}
                          onUnavailable={() => flash("ยังไม่มีลิงก์ร้านค้านี้ใน Prototype")}
                        />
                      </div>
                    </div>
                    <div className="compare-row-meta">
                      <span>★ {offer.rating} <i>• ขายแล้ว {offer.sold} ชิ้น</i></span>
                      <b className="higher">+฿{(offer.discountPrice - bestOffer.discountPrice).toLocaleString("en-US")}</b>
                    </div>
                  </article>
                ))}
              </section>

              <small className="compare-updated">อัปเดตราคาล่าสุด 10 นาทีที่แล้ว</small>
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
