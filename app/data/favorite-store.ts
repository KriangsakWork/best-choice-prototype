"use client";

import { useSyncExternalStore } from "react";
import type { ProductCardData } from "../components/ProductCard";
import { DEMO_PRODUCTS } from "./demo-products";

export function productFavoriteKey(product: Pick<ProductCardData, "productName">) {
  return product.productName
    .trim()
    .toLocaleLowerCase("th-TH")
    .replace(/\s+/g, " ");
}

// One key per product now, so seed the demo from every other distinct
// product rather than every other offer.
const INITIAL_FAVORITE_KEYS = new Set(
  [...new Set(DEMO_PRODUCTS.map(productFavoriteKey))].filter((_, index) => index % 2 === 0)
);

const DISTINCT_PRODUCT_KEYS = [...new Set(DEMO_PRODUCTS.map(productFavoriteKey))];

// The saved list shows one card per product, so count distinct products rather
// than raw keys — that keeps every "N รายการ" label in step with the list.
export function countSavedProducts(keys: ReadonlySet<string>) {
  return DISTINCT_PRODUCT_KEYS.filter((key) => keys.has(key)).length;
}

let favoriteKeys = new Set(INITIAL_FAVORITE_KEYS);
const listeners = new Set<() => void>();

function emitChange() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return favoriteKeys;
}

function getServerSnapshot() {
  return INITIAL_FAVORITE_KEYS;
}

export function setFavorite(product: Pick<ProductCardData, "productName">, favorite: boolean) {
  const key = productFavoriteKey(product);
  const next = new Set(favoriteKeys);

  if (favorite) next.add(key);
  else next.delete(key);

  if (next.size === favoriteKeys.size && next.has(key) === favoriteKeys.has(key)) return;
  favoriteKeys = next;
  emitChange();
}

export function toggleFavorite(product: Pick<ProductCardData, "productName">) {
  setFavorite(product, !favoriteKeys.has(productFavoriteKey(product)));
}

export function resetFavorites() {
  favoriteKeys = new Set(INITIAL_FAVORITE_KEYS);
  emitChange();
}

export function useFavorites() {
  const keys = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return {
    keys,
    count: keys.size,
    isFavorite: (product: Pick<ProductCardData, "productName">) =>
      keys.has(productFavoriteKey(product)),
    setFavorite,
    toggleFavorite,
    resetFavorites
  };
}

