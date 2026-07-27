"use client";

import { useSyncExternalStore } from "react";
import type { ProductCardData } from "../components/ProductCard";
import { DEMO_PRODUCTS } from "./demo-products";

export function productFavoriteKey(product: Pick<ProductCardData, "productName" | "platform">) {
  const normalizedName = product.productName
    .trim()
    .toLocaleLowerCase("th-TH")
    .replace(/\s+/g, " ");

  return `${normalizedName}::${product.platform}`;
}

const INITIAL_FAVORITE_KEYS = new Set(
  DEMO_PRODUCTS
    .filter((_, index) => index % 2 === 0)
    .map(productFavoriteKey)
);

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

export function setFavorite(product: Pick<ProductCardData, "productName" | "platform">, favorite: boolean) {
  const key = productFavoriteKey(product);
  const next = new Set(favoriteKeys);

  if (favorite) next.add(key);
  else next.delete(key);

  if (next.size === favoriteKeys.size && next.has(key) === favoriteKeys.has(key)) return;
  favoriteKeys = next;
  emitChange();
}

export function toggleFavorite(product: Pick<ProductCardData, "productName" | "platform">) {
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
    isFavorite: (product: Pick<ProductCardData, "productName" | "platform">) =>
      keys.has(productFavoriteKey(product)),
    setFavorite,
    toggleFavorite,
    resetFavorites
  };
}

