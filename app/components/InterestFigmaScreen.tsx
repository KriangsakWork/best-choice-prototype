"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ProductCard, ProductCardData, ProductCategory } from "./ProductCard";
import { DEMO_PRODUCTS } from "../data/demo-products";
import { productFavoriteKey, useFavorites } from "../data/favorite-store";

type CategoryFilter = "ทั้งหมด" | ProductCategory;

type RemovedItem = {
  product: ProductCardData;
  index: number;
};

const ASSET = "/assets/products/product-pic";

const INITIAL_SAVED_PRODUCTS: ProductCardData[] = [
  {
    id: 101,
    productName: "Nike Air Force 1 '07",
    platform: "Lazada",
    price: 4300,
    discountPrice: 3328,
    percent: 23,
    rating: 5,
    sold: 22,
    freeShip: true,
    mall: true,
    imageUrl: `${ASSET}/1-nike-lazada.webp`,
    productUrl: "",
    averagePrice: 3437.33,
    trendLabel: "ลดจากค่าเฉลี่ย",
    trendPercent: 3
  },
  {
    id: 102,
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
    productUrl: "",
    averagePrice: 3437.33,
    trendLabel: "เพิ่มจากค่าเฉลี่ย",
    trendPercent: 5
  },
  {
    id: 103,
    productName: "Nike Air Force 1 '07",
    platform: "TikTok",
    price: 5290,
    discountPrice: 3390,
    percent: 36,
    rating: 4.3,
    sold: 70,
    freeShip: true,
    mall: false,
    imageUrl: `${ASSET}/1-nike-lazada.webp`,
    productUrl: "",
    averagePrice: 3437.33,
    trendLabel: "ลดจากค่าเฉลี่ย",
    trendPercent: 1
  },
  {
    id: 104,
    productName: "Adidas Ultraboost Light",
    platform: "Lazada",
    price: 7000,
    discountPrice: 3750,
    percent: 46,
    rating: 5,
    sold: 2,
    freeShip: true,
    mall: true,
    imageUrl: `${ASSET}/6-adidas-lazada.webp`,
    productUrl: "",
    averagePrice: 4220,
    trendLabel: "ลดจากค่าเฉลี่ย",
    trendPercent: 11
  },
  {
    id: 105,
    productName: "NEW BALANCE 740",
    platform: "Shopee",
    price: 4150,
    discountPrice: 4150,
    percent: 0,
    rating: 5,
    sold: 16,
    freeShip: true,
    mall: false,
    imageUrl: `${ASSET}/4-nb-lazada.webp`,
    productUrl: "",
    averagePrice: 3383,
    trendLabel: "เพิ่มจากค่าเฉลี่ย",
    trendPercent: 23
  },
  {
    id: 106,
    productName: "HOKA CLIFTON ONE9",
    platform: "Shopee",
    price: 5990,
    discountPrice: 3294,
    percent: 45,
    rating: 5,
    sold: 38,
    freeShip: true,
    mall: true,
    imageUrl: `${ASSET}/5-hoka-shopee.webp`,
    productUrl: "",
    averagePrice: 3294,
    trendLabel: "เท่าค่าเฉลี่ย",
    trendPercent: 0
  },
  {
    id: 107,
    productName: "Converse Chuck Taylor",
    platform: "Shopee",
    price: 3290,
    discountPrice: 3090,
    percent: 6,
    rating: 4.9,
    sold: "2k+",
    freeShip: true,
    mall: true,
    imageUrl: `${ASSET}/2-converse-shopee.webp`,
    productUrl: "",
    averagePrice: 3026.67,
    trendLabel: "เพิ่มจากค่าเฉลี่ย",
    trendPercent: 2
  },
  {
    id: 108,
    productName: "Vans Old Skool",
    platform: "TikTok",
    price: 2690,
    discountPrice: 2190,
    percent: 19,
    rating: 4.3,
    sold: 151,
    freeShip: true,
    mall: true,
    imageUrl: `${ASSET}/3-vans-tiktok.webp`,
    productUrl: "",
    averagePrice: 2448.33,
    trendLabel: "ลดจากค่าเฉลี่ย",
    trendPercent: 11
  },
  {
    id: 109,
    productName: "Crocs Classic Clog",
    platform: "Shopee",
    price: 2190,
    discountPrice: 2040,
    percent: 7,
    rating: 4.9,
    sold: "9k+",
    freeShip: true,
    mall: true,
    imageUrl: `${ASSET}/7-crocs-shopee.webp`,
    productUrl: "",
    averagePrice: 2090,
    trendLabel: "ลดจากค่าเฉลี่ย",
    trendPercent: 2
  },
  {
    id: 110,
    productName: "Birkenstock Arizona",
    platform: "TikTok",
    price: 3990,
    discountPrice: 3311,
    percent: 17,
    rating: 5,
    sold: 157,
    freeShip: true,
    mall: true,
    imageUrl: `${ASSET}/8-birken-tiktok.webp`,
    productUrl: "",
    averagePrice: 4163.67,
    trendLabel: "ลดจากค่าเฉลี่ย",
    trendPercent: 20
  },
  {
    id: 111,
    productName: "womenager - Jane Original",
    platform: "Shopee",
    price: 1790,
    discountPrice: 1790,
    percent: 0,
    rating: 5,
    sold: 47,
    freeShip: true,
    mall: true,
    imageUrl: `${ASSET}/10-womanager-shopee.webp`,
    productUrl: "",
    averagePrice: 2023.67,
    trendLabel: "ลดจากค่าเฉลี่ย",
    trendPercent: 12
  },
  {
    id: 112,
    productName: "Flynn - Ballet Flats",
    platform: "Shopee",
    price: 1490,
    discountPrice: 1352,
    percent: 9,
    rating: 4.9,
    sold: "4k+",
    freeShip: true,
    mall: true,
    imageUrl: `${ASSET}/11-flynn-shopee.webp`,
    productUrl: "",
    averagePrice: 1427.33,
    trendLabel: "ลดจากค่าเฉลี่ย",
    trendPercent: 5
  }
];

const FILTERS: Array<{ value: CategoryFilter; label: string }> = [
  { value: "ทั้งหมด", label: "ทั้งหมด" },
  { value: "รองเท้า", label: "รองเท้า" },
  { value: "Accessory", label: "Accessory" }
];

const NAV_ITEMS = [
  { label: "หน้าหลัก", icon: "/assets/SVG/Nav Bar/HIC01.svg" },
  { label: "ยอดฮิต", icon: "/assets/SVG/Nav Bar/HIC06.svg" },
  { label: "สนใจ", icon: "/assets/SVG/Nav Bar/HIC02B.svg", active: true },
  { label: "ประหยัด", icon: "/assets/SVG/Nav Bar/HIC03.svg" },
  { label: "โปรไฟล์", icon: "/assets/SVG/Nav Bar/HIC04.svg" }
];

export function InterestFigmaScreen() {
  const [portalTarget, setPortalTarget] = useState<Element | null>(null);
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<CategoryFilter>("ทั้งหมด");
  const [removedItem, setRemovedItem] = useState<RemovedItem | null>(null);
  const toastTimer = useRef<number | null>(null);
  const favorites = useFavorites();
  const savedProducts = useMemo(() => {
    const cheapestByProduct = new Map<string, ProductCardData>();

    for (const product of DEMO_PRODUCTS) {
      const key = productFavoriteKey(product);
      if (!favorites.keys.has(key)) continue;

      const current = cheapestByProduct.get(key);
      if (!current || product.discountPrice < current.discountPrice) cheapestByProduct.set(key, product);
    }

    return [...cheapestByProduct.values()];
  }, [favorites.keys]);

  const visibleProducts = useMemo(
    () => filter === "ทั้งหมด" ? savedProducts : savedProducts.filter((product) => product.category === filter),
    [filter, savedProducts]
  );

  useEffect(() => {
    setPortalTarget(document.querySelector(".phone-shell"));

    const openFromNavigation = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target.closest(".interest-figma-screen")) return;

      const button = target.closest<HTMLButtonElement>(".bottom-nav button, .catalog-bottom-nav button");
      const nav = button?.closest("nav");
      if (!button || !nav) return;

      const buttons = Array.from(nav.querySelectorAll<HTMLButtonElement>(":scope > button"));
      const interestIndex = buttons.findIndex((b) => b.textContent?.trim() === "สนใจ");
      if (interestIndex < 0 || buttons.indexOf(button) !== interestIndex) return;

      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      setOpen(true);
    };

    document.addEventListener("click", openFromNavigation, true);
    return () => document.removeEventListener("click", openFromNavigation, true);
  }, []);

  useEffect(() => {
    const reopenInterest = () => setOpen(true);
    document.addEventListener("best-choice:open-interest", reopenInterest);
    return () => document.removeEventListener("best-choice:open-interest", reopenInterest);
  }, []);

  useEffect(() => () => {
    if (toastTimer.current !== null) window.clearTimeout(toastTimer.current);
  }, []);

  const navigateTo = (label: string) => {
    setOpen(false);
    window.requestAnimationFrame(() => {
      const nav = document.querySelector<HTMLElement>(".catalog-bottom-nav, .bottom-nav");
      if (!nav) return;
      const buttons = Array.from(nav.querySelectorAll<HTMLButtonElement>(":scope > button"));
      const target = buttons.find((b) => b.textContent?.trim() === label);
      if (target && target.textContent?.trim() !== "สนใจ") target.click();
    });
  };

  const removeProduct = (product: ProductCardData) => {
    const index = savedProducts.findIndex((item) => item.id === product.id);
    if (index < 0) return;

    favorites.setFavorite(product, false);
    setRemovedItem({ product, index });

    if (toastTimer.current !== null) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setRemovedItem(null), 3500);
  };

  const undoRemoval = () => {
    if (!removedItem) return;

    favorites.setFavorite(removedItem.product, true);
    setRemovedItem(null);
    if (toastTimer.current !== null) window.clearTimeout(toastTimer.current);
  };

  const openProductComparison = (product: ProductCardData) => {
    setOpen(false);
    window.requestAnimationFrame(() => {
      document.dispatchEvent(new CustomEvent("best-choice:open-compare", {
        detail: { product }
      }));
    });
  };

  const startSearching = () => {
    setOpen(false);
    window.requestAnimationFrame(() => {
      document.dispatchEvent(new Event("best-choice:start-search"));
    });
  };

  if (!portalTarget || !open) return null;

  return createPortal(
    <section className="interest-figma-screen" aria-label="สินค้าที่สนใจ">
      <div className="interest-status-bar" aria-hidden="true" />

      <header className="interest-page-heading">
        <h1>สินค้าที่สนใจ</h1>
        <p>บันทึกไว้ {savedProducts.length.toLocaleString("th-TH")} รายการ</p>
      </header>

      <div className="interest-platform-filters" role="group" aria-label="กรองตามแพลตฟอร์ม">
        {FILTERS.map((item) => (
          <button
            key={item.value}
            type="button"
            className={filter === item.value ? "selected" : ""}
            aria-pressed={filter === item.value}
            onClick={() => setFilter(item.value)}
          >
            {item.label}
          </button>
        ))}
      </div>

      {visibleProducts.length > 0 ? (
        <main className="interest-products-scroll">
          {visibleProducts.map((product) => (
            <div
              className="interest-product-item"
              key={product.id}
              role="button"
              tabIndex={0}
              aria-label={`เปรียบเทียบราคา ${product.productName}`}
              onClick={() => openProductComparison(product)}
              onKeyDown={(event) => {
                if (event.key !== "Enter" && event.key !== " ") return;
                event.preventDefault();
                openProductComparison(product);
              }}
            >
              <ProductCard
                product={product}
                favorite
                onFavoriteToggle={() => removeProduct(product)}
              />
            </div>
          ))}
        </main>
      ) : (
        <main className="interest-filter-empty">
          <strong>ไม่พบสินค้าจาก {filter}</strong>
          <p>ลองเลือกแพลตฟอร์มอื่นหรือดูรายการทั้งหมด</p>
          <button type="button" onClick={() => setFilter("ทั้งหมด")}>ดูทั้งหมด</button>
        </main>
      )}

      <nav className="bottom-nav interest-bottom-nav" aria-label="เมนูหลัก">
        {NAV_ITEMS.map((item, index) => (
          <button
            type="button"
            key={item.label}
            className={item.active ? "active" : ""}
            aria-current={item.active ? "page" : undefined}
            onClick={() => navigateTo(item.label)}
          >
            <img src={item.icon} alt="" aria-hidden="true" />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {savedProducts.length === 0 && (
        <div className="interest-empty-reference" aria-label="ยังไม่มีสินค้าที่สนใจ">
          <img src="/assets/screens/interest-empty.png" alt="" aria-hidden="true" />
          <button
            className="interest-empty-start"
            type="button"
            onClick={startSearching}
          >
            <span className="sr-only">เริ่มค้นหาสินค้า</span>
          </button>
          <div className="interest-empty-nav" aria-label="เมนูหลัก">
            {NAV_ITEMS.map((item, index) => (
              <button
                type="button"
                key={item.label}
                aria-label={item.label}
                onClick={() => navigateTo(item.label)}
              />
            ))}
          </div>
        </div>
      )}

      {removedItem && (
        <div className="interest-snackbar" role="status" aria-live="polite">
          <span>นำสินค้าออกแล้ว</span>
          <button type="button" onClick={undoRemoval}>เลิกทำ</button>
        </div>
      )}
    </section>,
    portalTarget
  );
}
