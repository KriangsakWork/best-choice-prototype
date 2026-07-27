"use client";

import { CSSProperties, FormEvent, PointerEvent, useEffect, useMemo, useRef, useState } from "react";
import { PlatformBadge } from "./components/PlatformBadge";
import { ProductCard, ProductCardData } from "./components/ProductCard";

type Screen =
  | "home"
  | "search"
  | "results"
  | "compare"
  | "history"
  | "total-save"
  | "profile"
  | "interest"
  | "interest-confirm"
  | "interest-removed"
  | "interest-empty"
  | "no-results"
  | "interest-last"
  | "interest-last-confirm";
type Period = "7 วัน" | "30 วัน" | "2 เดือน" | "3 เดือน";

const ASSET = "/assets";
const SCREENSHOT = `${ASSET}/screens`;
const COMPARE_UP_PATH = "M 0.12493379885236716 5.9561254139706055 C 0.03928101676383822 5.8723198587761605 -0.0023299528911366724 5.775923769625623 0.00010060280919057689 5.666937654151906 C 0.0025311585095178263 5.557951538678188 0.04428816867549995 5.462868236909857 0.12537150358748023 5.38168767930816 L 3.0319758045999308 2.4488331737975857 C 3.2209758107810487 2.2566248289739357 3.454746591546436 2.1605212685031527 3.7332882720658502 2.1605212685031527 C 4.011732737406743 2.1605212685031527 4.248030904197436 2.2566248289739357 4.442183690349486 2.4488331737975857 L 5.905767298665333 3.9223333523795536 C 5.93940618776724 3.955972241712397 5.9805315113728215 3.97279200799556 6.029142622771663 3.97279200799556 C 6.077753734170504 3.97279200799556 6.120725461211271 3.955972241712397 6.158058794821213 3.9223333523795536 L 9.309080273791277 0.8160836836578436 L 7.976893090182617 0.8160836836578436 C 7.863629194677753 0.8160836836578436 7.767086852280934 0.7766115324029321 7.687267405090118 0.6976670838617243 C 7.6073507357669055 0.6188198574535811 7.5673928287686385 0.5227154068867368 7.5673928287686385 0.4093542884712298 C 7.5673928287686385 0.2960903921887875 7.6073507357669055 0.19954893922524863 7.687267405090118 0.11972949148645798 C 7.767086852280934 0.03991004374766734 7.863629194677753 0 7.976893090182617 0 L 10.185101240007295 0 C 10.322476245208318 0 10.439579917740783 0.048319483579686864 10.536413252008877 0.14495837424643035 C 10.633149364144574 0.24159726491317385 10.681517601013184 0.359673340380987 10.681517601013184 0.49918723345253846 L 10.681517601013184 2.707395843485006 C 10.681517601013184 2.820659739767448 10.641413433152982 2.9167641903342925 10.561205097432577 2.9957086388755005 C 10.480899539579775 3.0745558652836436 10.384990097201412 3.1139792629175753 10.273476207033573 3.1139792629175753 C 10.161962316865734 3.1139792629175753 10.06610073801196 3.075479513794074 9.985892402291555 2.998479507914161 C 9.905586844438753 2.921479502034248 9.86543481305396 2.826298699977834 9.86543481305396 2.712937581562327 L 9.86543481305396 1.3836667885526286 L 6.734538405890518 4.5145627721622255 C 6.545052296001289 4.70492388950377 6.310746539691263 4.800104253466029 6.031621540285216 4.800104253466029 C 5.7523992978851455 4.800104253466029 5.518531009878467 4.70492388950377 5.330017121313212 4.5145627721622255 L 3.8655589936231936 3.0528750584090605 C 3.8319201045212874 3.0192361690762173 3.788899178811848 3.002416847841085 3.7364964007725736 3.002416847841085 C 3.6841908448656966 3.002416847841085 3.641218895300916 3.0192361690762173 3.6075800061990098 3.0528750584090605 L 0.7043297818308232 5.951604616075534 C 0.6198436653310618 6.034243505673203 0.5228158172594187 6.075562953948975 0.413246369739527 6.075562953948975 C 0.30367692221963527 6.075562953948975 0.20757268788270428 6.035750417443267 0.12493379885236716 5.9561254139706055 Z";
const TRENDING_UP_ICON = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAOdEVYdFNvZnR3YXJlAEZpZ21hnrGWYwAAARpJREFUeAHd0y1vwkAcBvDn4FbKmJmYQe3FDbdkbmLJXtTkxr7BzL4EX2LT6Ba3zEAJBgVY0ChCgIACroVSerxcaDkIhCoe1f7T/PL8ry0Z9zoOAkgIASUwiO7zsMP6ABt4h+opiBrbHRoV/8H+0mtzepNA9Cu1z2rb34kUsnIarKzmmZ08vOEslYby/C6FqAwxDV3cK69JcT2ulmAZmXmD8wtMem15Iz9i5nXRbFQpgOm/83Z3j4i8JOWNVhHl6QMg7sy955jdrLttygJRP79h18oeiPAv249EFuuY/KxWGi6RZWwXD13fgkRjIMzIOEPtZw0R6y0wP+IPnXRbGxEefhY0foVw4h7bMlvNbtQRjl/ikJDj/fsDg6aoAnbaNoJXUgAAAABJRU5ErkJggg==";
const PROFILE_ICONS = {
  "profile": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAOdEVYdFNvZnR3YXJlAEZpZ21hnrGWYwAAAtxJREFUeAGlVUtME0EY/lsW7EsomhhKor2IBxKaqBc0tlxLaS+aKLEmXkg0tDFysdHoSUPEi5JYw0VPaJAEL1JMvNGaeLJEDF56orwUoqV0S2kp1vmn3e3M9kELX7KZnZmd7/vnf61q+YI+Bwy4iRK5qtOyUNd7oB4gn8BOStQNRtA6roPmnBUaOywgmMx0Pbu2CJnIPKRmp2F75m1FchU+6CJpworoet1gvDsC6qNGqIbs6iLEXw9zQiyfakkRA4TxzjMw9A/S93Q4BMmZcciEv1DLEQ3kNk3kMTjdcOSsla5tvfdD/IWPEwH2Bkryf4k4JN4MQ2LCX2IVy2K45oWWgfvkpi2wRb7dHPVxxqqVbpHINzx2mbyh3Qwn/J+g/fMynPwqQuvDMRDazFRRnHwJvz299Exzvwf0DjcnwLmobWqBBjL+3AeJyaLlpg8LcoBZ36/fvAh7YpzODVe90Dr0lAqtXO6EXGFdzVqPJDvhIEeOFinJEQK5lcbmkl2WIDdJz4WoqwyOG0UXSS/aHhcdU4F3PFEZcgkNplPcXJzOZ5Lm/KVSgcaOLjpmIt+5Q7trUaiELNljA5+eCxa4LAqBXNHSTOQHPSAdSgU/UqIS8tUoTd+cQhDB3lq9X3/AYK0P2iEZyF8fg7hDamPDa4f9wLUKLCJUFohflRbv/YrC3ye36MMeVqLpjEXmKt6ggF3iGoTG6oJqFrHuKxE4LcVxXv5GkA6mv4VAa3OSbOojxZNPU2x2Glsf6HqcFZtdkulBzQMP6JiaDchrqmh3vtAwf01TP+kYI4WWEzfranYqYsyxoREa/JUrnUWBpe5iL9KRAjn+aAwOgz+Pb4NIsksC14u2yYY48QoOCmx2LDkVkN8KSrHRewcSQfKYopMi5BiwwAV0l5EETVC0AyWwLpBYDIyX3a8oIAGF9DSLurgswrTGgkOXoEgllAjU+uMv+wMqA3W5Q7WgFnLc/w81cE86WIs6JwAAAABJRU5ErkJggg==",
  "orders": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAOdEVYdFNvZnR3YXJlAEZpZ21hnrGWYwAAAZVJREFUeAHtVj1MwkAU/qhgKRj8G3BQF0djHNxw9W9FTSQx4oYRVxxxwU1mjW7+JbAQNxVdcdHFRBcTNhcGYzRACyHUuzM0NC0tljRx4Esube/dfV/fe/de66iLJRk2wtnOomruGmLmBLXnh99N0wHwCyG4F9dM9zrMPCifH0A8TerahHAMnvCu0XZwRsbKbUoh90QTGLp6Y8Ozk2Bz4lkSFeKdZQEpm1bIheUIHH39bAjBiCIikdBZFmjEXC/W/HxItaYVVDmQsimUD+OQi9+wAm5kDMJGjLxQSF/gc30G9cI7OgENIc2TItps7JScQi5+qZ4Nc0CTO3DxBM7r09hoOAYvHyFsxowojAWcE5PoIUT8akRj6w0sgfOPwzU1C8sC1dwNu7qDW3Cv0GPqY4MWmDe6z2zSXdqIQp3kjzm/ZoF3O8HI9SBmjsmp29PMD98XlHvTXlQ6iqOWfwFPjp6L9CCaxFr+lRVY1aSK2/LACpo94GAzugL/TECvJfyZkFR+SwH6EeH8o7CKRpWr5uz+q7A9Bz8eWYqw7XPXuwAAAABJRU5ErkJggg==",
  "history": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAOdEVYdFNvZnR3YXJlAEZpZ21hnrGWYwAAAOtJREFUeAHtlj0OgjAYhj8aBkFD4qSDegn1Iq4obi6uMDo5yuzgiDFx8QJewVuog0yiQWABFMcWbAExIfFZSD4oT9q3f1zgPkIoEAQFw+MFb78FZzmD0L4nNuJqElQGExAVDWhw+BBd5S4E5hlYEBSVKiGGiOXnwlh9P11DB8dYpBOwII40ZknmkFkluWYRLvF2q+8IfPMYK3HWOvEtDxmw5H5sPbRvRK3whfb7lYxT3xwANTqx7/zLCaxh72N7ag/y7oTUHiQFyso/Ayrlz4AQoKoEWUHNNl0gTuevUFuQlugYjU44ol76W8UT4KVTfDhJqtEAAAAASUVORK5CYII=",
  "settings": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAOdEVYdFNvZnR3YXJlAEZpZ21hnrGWYwAAAhlJREFUeAHVVj1M20AU/uySYDcRVCx0aKeqU6UydGq6VrQw8TOAhPhZiAQLCxkzwZas/AgmYAEk/iYUJEayI8GCxAQDDICC4sQJxOG9SDlysY0tIgY+ydL5fO/e3Xff986KlTfKeEOoeGP4SmAerOO25ztu/rZXHm6bW0t+QqH4oehu6Bes60s5MNyKtt0zr1DvHVjZe9vkjHI2g7KR8QpHU32HsRBH8WgfgZ8R6P1R5LaXXYONuTgCf7rxcHyEh/Q+gpEuhCZnpDESRYXUOrKJKTSC0MQMNFpYFYKi0tUFcqsJNIrcWlKiTiR4pG06cV3Fh28/0NwXhT4yDbX9i+s4PhsztSHexRmUFdcYaH3jxO2seP84EqOVJpBfSTqOZ4XZdqB1DkIfnbYNVj9/lSYXSYZjaOqIOC5G6xywJ6gGBf8NSgHByH+4IVCXgCmsX4zNB0qoBa+FArtnpQTsgcK2XAIKB5twA/ulFiZ5pl6JIgF7wKm+sCqM+bitnw+5dH5q68+vJqXEQkXWC7Y3aVdFcmqAnMoonZ+QrNOu4y3jXrSFk7nmZLio1Xx8DVh1nxYPhVQFRWq4BdpYDI1CJ4/U+kAqdnpvFBaVjEqxIzqCHb9RSKdQpPNxQjPpXSNp5neWK5WAJV3rAYbnfcDU3dEF44S2vTOSdetL4d73AVOnOniDufaa3FcCBp+NEn5Owm0uen6gvPu/iifXAcq6D6EJ8gAAAABJRU5ErkJggg==",
  "help": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAOdEVYdFNvZnR3YXJlAEZpZ21hnrGWYwAAAhFJREFUeAHVVjssQ1EY/vqSW23aYGDAgI3EYPKYSAiTx2AQNhUMBuloqq0MFhKbIGFQRsRaCwMJi2DAoJNnKXVvnf9Kb3vdc+5V0cG39Nzbc77//7//ca5NeY2nkEfYkWc4zf5MPT8gsbOO5HEU8uUplNvrL6/KKuCoqkVBcxekjn4zCthEEr3trCG+MMWMPJoSkDH3YFBoiGuAiBMbi8gFUm8AnrGQ0YG/ICckIouIz0+ZGyBZeOQkg282guKtM5TsxeCbicBeWs41QjnLhk6iu4EGKLEbw8Gi1QNGWAn54gQKy4mrvkn9fZzsZu9O9YRev7rf5vHrIyDveeR0gBL9shzG/UgbI+1Ro7R7fayKOg3705WXhlamb/vb4IEOEHE25NgVzJA8isLNkq6LQD4/wU+glmVfADLrCYqah2zZtAiU2LUVt0ruZ8kmfUkqnqTfuZzIAd7gnJrsp/CEIblCp7RFaYXlZko4SfMukIbHpUXgqKmzlIlk+Qkc1bUZY+mFq77R8mBBUydcbMBZ7mvJ7NEajRrngRotzh9uTtZc/tlNdX0/0irMARVC0cph5llbsMZxj4cgAhFS/VMOUrdiKd1DQd2zYZr+dtgRpN5hNlGnde8M09QzGoLUF8BfkBOEF05idw2vS2FhM2kETNpCRiy153DhfDeUjG7jgyZp1pXprK5TE0/E1B9CB/79V8Unl+v1kuC1K6EAAAAASUVORK5CYII=",
  "security": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAOdEVYdFNvZnR3YXJlAEZpZ21hnrGWYwAAAbdJREFUeAHtVb9PwkAUfi3WUiEwOOCii24aZXCRbsYQcYNFB4NO8AcIjv4DwMJgIpu64CCOinEVZw1uOukggwkS+S3guyMQy7WUarr5JU3b17vve3337juuXS13wETwYDLGRhnU+fyAWvYMGrlL+i56t0Bwr4DFNaM7lxtWouZ9DionMWg951GkxHwXvZsgyBsgyuswsgDJtppJQQ2vn6TCkgekYARKewGGhJ+aBmERv+9EmL9iBIrhVcz4sU8qyD6wYqac3Ulj72su0MIYjncmLpSxwUE9ckcigwIyGMEXlnQQml1klFwLprfpv4AumC7ibQ5ol0ua7Th5U2BirbcXKG4v91tZwccE5hbAKFpPeXq3zM7rCwhuDxhF/e6K3sdxU+oKWP1hMAJSnkY2TZ/VPIktkd1Bt/yoqJzGu+RoJ7yKu6p2kT2apIuth2rmiGbPYVITaHRqUBWwoDtad6OgR145PKDPUjCqmj2B5oEj+UNd6z6OK+K9M6JnbMTCpUBIi2b4gUNQu06jSAzahVflRCyLbT8Josc3bLq+AAHplObDLdTPU3QTkgUlWattrF8J/AWme9E36byb8MZzsBIAAAAASUVORK5CYII=",
  "chevron": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAOdEVYdFNvZnR3YXJlAEZpZ21hnrGWYwAAAKRJREFUeAHN1L0KwjAUhuEvBTuYXISIu0MRdBMEL1ocdBGE4uBevAPTwTjUIaZLh8Jpz+kP9IVAhvAMJyTKhzBAEQZqfCi3Fl/3QW/oej7hEhYXI6F1ksA5x8ZIaLFcYbPdsbHGYUuw1lurY7+i6AaVea+q/SyOu0GvLEN6v0Frjf3hSJ6LJMjcGDkkQRqh5yNlI2WKev25fQfIkMNlQ9Km9438AacKVw5qfVAAAAAAAElFTkSuQmCC"
} as const;
const PROTOTYPE_WIDTH = 402;
const PROTOTYPE_HEIGHT = 874;
const MOBILE_STATUS_BAR_CROP = 50;
const SEARCH_GRADIENT_SEGMENTS = 192;

function mixColor(start: [number, number, number], end: [number, number, number], amount: number) {
  const channel = (index: number) => Math.round(start[index] + (end[index] - start[index]) * amount);
  return `rgb(${channel(0)} ${channel(1)} ${channel(2)})`;
}

function searchGradientColor(position: number) {
  const primary: [number, number, number] = [235, 59, 12];
  const goldOrange: [number, number, number] = [255, 202, 104];
  const blend = (1 - Math.cos(position * Math.PI * 2)) / 2;
  return mixColor(primary, goldOrange, blend);
}

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setPrefersReducedMotion(media.matches);

    updatePreference();
    media.addEventListener("change", updatePreference);
    return () => media.removeEventListener("change", updatePreference);
  }, []);

  return prefersReducedMotion;
}

function usePrototypeScale() {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const viewport = window.visualViewport;

    const updateScale = () => {
      const viewportWidth = viewport?.width ?? window.innerWidth;
      const nextScale = viewportWidth <= 820
        ? Math.min(viewportWidth / PROTOTYPE_WIDTH, 1)
        : 1;

      setScale((currentScale) =>
        Math.abs(currentScale - nextScale) < 0.001 ? currentScale : nextScale
      );
    };

    updateScale();
    window.addEventListener("resize", updateScale);
    viewport?.addEventListener("resize", updateScale);

    return () => {
      window.removeEventListener("resize", updateScale);
      viewport?.removeEventListener("resize", updateScale);
    };
  }, []);

  return scale;
}

const spriteIcons: Record<string, { screen: string; x: number; y: number; width: number; height: number }> = {
  search: { screen: "home", x: 27, y: 76, width: 32, height: 32 },
  "search-active": { screen: "search", x: 28, y: 76, width: 32, height: 32 },
  camera: { screen: "home", x: 328, y: 80, width: 24, height: 24 },
  mic: { screen: "home", x: 357, y: 80, width: 24, height: 24 },
  close: { screen: "search", x: 356, y: 80, width: 24, height: 24 },
  sort: { screen: "results", x: 357, y: 75, width: 32, height: 32 },
  back: { screen: "history", x: 17, y: 60, width: 33, height: 33 },
  heart: { screen: "history", x: 47, y: 701, width: 20, height: 20 },
  bag: { screen: "history", x: 246, y: 701, width: 20, height: 20 },
  ai: { screen: "history", x: 37, y: 576, width: 39, height: 39 }
};

const realIconAssets: Record<string, string> = {
  search: `${ASSET}/SVG/Search Bar/icon/Icon Search1.svg`,
  "search-active": `${ASSET}/SVG/Search Bar/icon/Icon Search2.svg`,
  camera: `${ASSET}/SVG/Search Bar/icon/Icon Cam.svg`,
  mic: `${ASSET}/SVG/Search Bar/icon/Icon Mic.svg`,
  close: `${ASSET}/SVG/Search Bar/icon/Icon Close.svg`,
  sort: `${ASSET}/SVG/Search Bar/icon/Filter.svg`,
  back: `${ASSET}/SVG/arrow_back.svg`
};

const navIconAssets: Record<string, { default: string; active: string }> = {
  home: {
    default: `${ASSET}/SVG/Nav Bar/HIC01.svg`,
    active: `${ASSET}/SVG/Nav Bar/HIC01A.svg`
  },
  interest: {
    default: `${ASSET}/SVG/Nav Bar/HIC02.svg`,
    active: `${ASSET}/SVG/Nav Bar/HIC02B.svg`
  },
  savings: {
    default: `${ASSET}/SVG/Nav Bar/HIC03.svg`,
    active: `${ASSET}/SVG/Nav Bar/HIC03B.svg`
  },
  profile: {
    default: `${ASSET}/SVG/Nav Bar/HIC04.svg`,
    active: `${ASSET}/SVG/Nav Bar/HIC04B.svg`
  }
};

type ProductResult = {
  id: number;
  image?: string;
  price: number;
  data?: ProductCardData;
};

const nikeAirForceOne: ProductCardData = {
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
  imageUrl: `${ASSET}/products/product-pic/1-nike-shopee.webp`,
  productUrl: "https://shopee.co.th/product/1676687866/56408537514",
  averagePrice: 3437.33,
  trendLabel: "เพิ่มจากค่าเฉลี่ย",
  trendPercent: 5
};

const homeRecentProducts: ProductCardData[] = [
  {
    ...nikeAirForceOne
  },
  {
    id: 28,
    productName: "womenager - Jane Original",
    platform: "Shopee",
    price: 1790,
    discountPrice: 1790,
    percent: 0,
    rating: 5,
    sold: 47,
    freeShip: true,
    mall: true,
    imageUrl: `${ASSET}/products/product-pic/10-womanager-shopee.webp`,
    productUrl: "",
    averagePrice: 2023.67,
    trendLabel: "ลดจากค่าเฉลี่ย",
    trendPercent: 12
  }
];

const homeRecommendedProducts: ProductCardData[] = [
  {
    id: 4,
    productName: "Converse Chuck Taylor",
    platform: "Shopee",
    price: 3090,
    discountPrice: 3090,
    percent: 0,
    rating: 4.9,
    sold: "2k+",
    freeShip: true,
    mall: true,
    imageUrl: `${ASSET}/products/product-pic/2-converse-shopee.webp`,
    productUrl: "",
    averagePrice: 3026.67,
    trendLabel: "เพิ่มจากค่าเฉลี่ย",
    trendPercent: 2
  },
  {
    id: 9,
    productName: "Vans Old Skool",
    platform: "TikTok",
    price: 2690,
    discountPrice: 2190,
    percent: 19,
    rating: 4.3,
    sold: 151,
    freeShip: true,
    mall: true,
    imageUrl: `${ASSET}/products/product-pic/3-vans-tiktok.webp`,
    productUrl: "",
    averagePrice: 2448.33,
    trendLabel: "ลดจากค่าเฉลี่ย",
    trendPercent: 11
  },
  {
    id: 11,
    productName: "NEW BALANCE 740",
    platform: "Lazada",
    price: 7000,
    discountPrice: 1949,
    percent: 72,
    rating: 5,
    sold: 16,
    freeShip: true,
    mall: false,
    imageUrl: `${ASSET}/products/product-pic/4-nb-lazada.webp`,
    productUrl: "",
    averagePrice: 3383,
    trendLabel: "ลดจากค่าเฉลี่ย",
    trendPercent: 42
  },
  {
    id: 17,
    productName: "Adidas Ultraboost Light",
    platform: "Lazada",
    price: 7000,
    discountPrice: 3750,
    percent: 46,
    rating: 5,
    sold: 2,
    freeShip: true,
    mall: true,
    imageUrl: `${ASSET}/products/product-pic/6-adidas-lazada.webp`,
    productUrl: "",
    averagePrice: 4220,
    trendLabel: "ลดจากค่าเฉลี่ย",
    trendPercent: 11
  },
  {
    id: 19,
    productName: "Crocs Classic Clog",
    platform: "Shopee",
    price: 2190,
    discountPrice: 2040,
    percent: 7,
    rating: 4.9,
    sold: "9k+",
    freeShip: true,
    mall: true,
    imageUrl: `${ASSET}/products/product-pic/7-crocs-shopee.webp`,
    productUrl: "",
    averagePrice: 2090,
    trendLabel: "ลดจากค่าเฉลี่ย",
    trendPercent: 2
  },
  {
    id: 24,
    productName: "Birkenstock Arizona",
    platform: "TikTok",
    price: 3990,
    discountPrice: 3311,
    percent: 17,
    rating: 5,
    sold: 157,
    freeShip: true,
    mall: true,
    imageUrl: `${ASSET}/products/product-pic/8-birken-tiktok.webp`,
    productUrl: "",
    averagePrice: 4163.67,
    trendLabel: "ลดจากค่าเฉลี่ย",
    trendPercent: 20
  },
  {
    id: 27,
    productName: "Kito BioCare",
    platform: "TikTok",
    price: 628,
    discountPrice: 486,
    percent: 23,
    rating: 5,
    sold: 95,
    freeShip: true,
    mall: true,
    imageUrl: `${ASSET}/products/product-pic/9-kito-tiktok.png`,
    productUrl: "",
    averagePrice: 513,
    trendLabel: "ลดจากค่าเฉลี่ย",
    trendPercent: 5
  },
  {
    id: 31,
    productName: "Flynn - Ballet Flats",
    platform: "Shopee",
    price: 1490,
    discountPrice: 1352,
    percent: 9,
    rating: 4.9,
    sold: "4k+",
    freeShip: true,
    mall: true,
    imageUrl: `${ASSET}/products/product-pic/11-flynn-shopee.webp`,
    productUrl: "",
    averagePrice: 1427.33,
    trendLabel: "ลดจากค่าเฉลี่ย",
    trendPercent: 5
  }
];

const products: ProductResult[] = [
  { id: 1, price: nikeAirForceOne.discountPrice, data: nikeAirForceOne },
  { id: 2, image: `${ASSET}/result-2.png`, price: 3594 },
  { id: 3, image: `${ASSET}/result-3.png`, price: 3390 },
  { id: 4, image: `${ASSET}/result-4.png`, price: 3750 },
  { id: 5, image: `${ASSET}/result-5.png`, price: 2890 },
  { id: 6, image: `${ASSET}/result-6.png`, price: 4100 }
];

type CompareOffer = {
  id: number;
  platform: "Shopee" | "Lazada" | "TikTok";
  price: number;
  originalPrice: number;
  rating: number;
  sold: string;
  freeShip: boolean;
  mall: boolean;
  productName: string;
  productImage: string;
  productUrl: string;
};

const compareOfferById: Record<number, CompareOffer> = {
  1: {
    id: 1,
    platform: "Shopee",
    price: nikeAirForceOne.discountPrice,
    originalPrice: nikeAirForceOne.price,
    rating: nikeAirForceOne.rating,
    sold: String(nikeAirForceOne.sold),
    freeShip: nikeAirForceOne.freeShip,
    mall: nikeAirForceOne.mall,
    productName: nikeAirForceOne.productName,
    productImage: nikeAirForceOne.imageUrl,
    productUrl: nikeAirForceOne.productUrl
  },
  2: {
    id: 2,
    platform: "Lazada",
    price: 3594,
    originalPrice: 4290,
    rating: 4.8,
    sold: "86K",
    freeShip: true,
    mall: true,
    productName: nikeAirForceOne.productName,
    productImage: nikeAirForceOne.imageUrl,
    productUrl: ""
  },
  3: {
    id: 3,
    platform: "TikTok",
    price: 3390,
    originalPrice: 3990,
    rating: 4.7,
    sold: "42K",
    freeShip: true,
    mall: true,
    productName: nikeAirForceOne.productName,
    productImage: nikeAirForceOne.imageUrl,
    productUrl: ""
  },
  4: {
    id: 4,
    platform: "Shopee",
    price: 3750,
    originalPrice: 4390,
    rating: 4.9,
    sold: "120K",
    freeShip: true,
    mall: true,
    productName: nikeAirForceOne.productName,
    productImage: nikeAirForceOne.imageUrl,
    productUrl: ""
  },
  5: {
    id: 5,
    platform: "Lazada",
    price: 2890,
    originalPrice: 3590,
    rating: 4.8,
    sold: "86K",
    freeShip: true,
    mall: true,
    productName: nikeAirForceOne.productName,
    productImage: nikeAirForceOne.imageUrl,
    productUrl: ""
  },
  6: {
    id: 6,
    platform: "TikTok",
    price: 4100,
    originalPrice: 4590,
    rating: 4.7,
    sold: "42K",
    freeShip: false,
    mall: false,
    productName: nikeAirForceOne.productName,
    productImage: nikeAirForceOne.imageUrl,
    productUrl: ""
  }
};

const initialHomeFavorites: Record<string, boolean> = {
  "recent-1": true,
  "recent-28": true,
  "recommended-4": true,
  "recommended-9": false,
  "recommended-11": false,
  "recommended-17": true,
  "recommended-19": true,
  "recommended-24": true,
  "recommended-27": false,
  "recommended-31": false
};

const suggestions = [
  { label: "หมวกไหมพรม", trend: "+32%" },
  { label: "หมวกคาวบอย", trend: "+18%" },
  { label: "หมวกแก๊ป", trend: "-6%" },
  { label: "หมวก", trend: "+11%" }
];

const chartData: Record<Period, number[]> = {
  "7 วัน": [6800, 6600, 6720, 6400, 6480, 6250, 6320, 5950],
  "30 วัน": [7000, 6750, 6870, 6510, 6630, 6300, 6420, 5950],
  "2 เดือน": [7200, 6990, 6820, 6580, 6700, 6410, 6200, 5950],
  "3 เดือน": [7350, 7100, 6900, 6650, 6500, 6280, 6120, 5950]
};

function Icon({ name, className = "" }: { name: string; className?: string }) {
  const asset = realIconAssets[name];

  if (asset) {
    return (
      <span className={`asset-icon ${className}`} aria-hidden="true">
        <img src={asset} alt="" />
      </span>
    );
  }

  const sprite = spriteIcons[name];
  if (!sprite) return null;

  return (
    <span
      className={`sprite-icon ${className}`}
      style={{ width: sprite.width, height: sprite.height }}
      aria-hidden="true"
    >
      <img
        src={`${SCREENSHOT}/${sprite.screen}.png`}
        alt=""
        style={{ left: -sprite.x, top: -sprite.y }}
      />
    </span>
  );
}

function StatusBar() {
  return (
    <div className="status-bar" aria-hidden="true">
      <img src={`${ASSET}/SVG/Status bar.svg`} alt="" />
    </div>
  );
}

function BottomNav({ active, go }: { active?: string; go: (screen: Screen) => void }) {
  const items = [
    { key: "home", label: "หน้าหลัก", screen: "home" as Screen },
    { key: "interest", label: "สนใจ", screen: "interest" as Screen },
    { key: "savings", label: "ประหยัด", screen: "total-save" as Screen },
    { key: "profile", label: "โปรไฟล์", screen: "profile" as Screen }
  ];

  return (
    <nav className="bottom-nav" aria-label="เมนูหลัก">
      {items.map((item) => {
        const isActive = active === item.key;
        const icons = navIconAssets[item.key];

        return (
          <button
            key={item.key}
            className={isActive ? "active" : ""}
            onClick={() => go(item.screen)}
            type="button"
            aria-current={isActive ? "page" : undefined}
          >
            <img src={isActive ? icons.active : icons.default} alt="" aria-hidden="true" />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

function SearchGradientBorder() {
  const segmentLength = 100 / SEARCH_GRADIENT_SEGMENTS + 0.08;
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <svg
      className="search-gradient-border"
      viewBox="0 0 373 52"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      {Array.from({ length: SEARCH_GRADIENT_SEGMENTS }, (_, index) => {
        const offset = -(index * 100) / SEARCH_GRADIENT_SEGMENTS;

        return (
          <rect
            key={index}
            className="search-gradient-segment"
            x="1"
            y="1"
            width="371"
            height="50"
            rx="25"
            pathLength="100"
            fill="none"
            stroke={searchGradientColor(index / SEARCH_GRADIENT_SEGMENTS)}
            strokeWidth="2"
            strokeDasharray={`${segmentLength} ${100 - segmentLength}`}
            strokeDashoffset={offset}
          >
            {!prefersReducedMotion && (
              <animate
                attributeName="stroke-dashoffset"
                values={`${offset};${offset - 100}`}
                dur="5.6s"
                calcMode="linear"
                repeatCount="indefinite"
              />
            )}
          </rect>
        );
      })}
    </svg>
  );
}

function AnimatedSavingsTotal() {
  const startValue = 1250;
  const targetValue = 10250;
  const duration = 1500;
  const prefersReducedMotion = usePrefersReducedMotion();
  const [value, setValue] = useState(startValue);

  useEffect(() => {
    if (prefersReducedMotion) {
      setValue(targetValue);
      return;
    }

    let animationFrame = 0;
    let startedAt: number | null = null;

    const updateValue = (time: number) => {
      if (startedAt === null) startedAt = time;

      const progress = Math.min((time - startedAt) / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(startValue + (targetValue - startValue) * easedProgress));

      if (progress < 1) {
        animationFrame = window.requestAnimationFrame(updateValue);
      }
    };

    animationFrame = window.requestAnimationFrame(updateValue);
    return () => window.cancelAnimationFrame(animationFrame);
  }, [prefersReducedMotion]);

  return (
    <strong aria-label="ยอดประหยัดรวม 10,250 บาท">
      <span aria-hidden="true">฿{value.toLocaleString("en-US")}</span>
    </strong>
  );
}

function SearchField({
  value,
  onChange,
  onSubmit,
  onFocus,
  onBlur,
  active = false,
  autoFocus = false,
  showLight = false
}: {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
  active?: boolean;
  autoFocus?: boolean;
  showLight?: boolean;
}) {
  const submit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <form className={`search-field ${active ? "active" : ""}`} onSubmit={submit}>
      {showLight && <SearchGradientBorder />}
      <button className="search-button" type="submit" aria-label="ค้นหา">
        <Icon name={active ? "search-active" : "search"} />
      </button>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onFocus={onFocus}
        onBlur={onBlur}
        autoFocus={autoFocus}
        placeholder={active ? "รองเท้า" : "ค้นหาสินค้า"}
        aria-label="ค้นหาสินค้า"
      />
      {value ? (
        <button className="clear-button" type="button" onClick={() => onChange("")} aria-label="ล้างคำค้น">
          <Icon name="close" />
        </button>
      ) : (
        <div className="search-actions" aria-hidden="true">
          <Icon name="camera" />
          <Icon name="mic" />
        </div>
      )}
    </form>
  );
}

function Header({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <header className="page-header">
      <button type="button" onClick={onBack} aria-label="ย้อนกลับ"><Icon name="back" /></button>
      <h1>{title}</h1>
      <span />
    </header>
  );
}

function HomeScreen({
  go,
  query,
  setQuery,
  homeFavorites,
  toggleHomeFavorite
}: {
  go: (screen: Screen) => void;
  query: string;
  setQuery: (value: string) => void;
  homeFavorites: Record<string, boolean>;
  toggleHomeFavorite: (key: string) => void;
}) {
  const [searchFocused, setSearchFocused] = useState(false);

  const openResultsWithKeyboard = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      go("results");
    }
  };

  const renderHomeCard = (product: ProductCardData, section: "recent" | "recommended") => {
    const favoriteKey = `${section}-${product.id}`;

    return (
      <div
        className="home-card-action"
        key={favoriteKey}
        role="link"
        tabIndex={0}
        onClick={() => go("results")}
        onKeyDown={openResultsWithKeyboard}
        aria-label={`ดูผลการค้นหา ${product.productName}`}
      >
        <ProductCard
          product={product}
          favorite={homeFavorites[favoriteKey]}
          onFavoriteToggle={() => toggleHomeFavorite(favoriteKey)}
        />
      </div>
    );
  };

  return (
    <section className="screen home-screen">
      <StatusBar />
      <div className="home-search">
        <SearchField
          value={query}
          onChange={(value) => {
            setQuery(value);
            if (value.length > 0) go("search");
          }}
          onSubmit={() => {
            if (query.trim()) go("search");
          }}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          showLight={searchFocused}
        />
      </div>

      <button className="savings-hero" onClick={() => go("total-save")} type="button" aria-label="ดูยอดประหยัดรวม 10,250 บาท">
        <img
          className="savings-hero__background"
          src={`${ASSET}/SVG/Total Savings BG.jpg`}
          alt=""
          aria-hidden="true"
        />
        <span className="savings-hero__content">
          <span className="savings-hero__eyebrow">Total Save</span>
          <AnimatedSavingsTotal />
          <span className="savings-hero__change">
            <img
              src={`${ASSET}/SVG/Up total.svg`}
              alt=""
              width={12}
              height={12}
              aria-hidden="true"
            />
            <span>+฿1,250</span>
            <small>จากเดือนก่อน</small>
            <small>(+18%)</small>
          </span>
        </span>
      </button>

      <main className="home-content">
        <h2>ค้นหาล่าสุด</h2>
        <div className="home-grid">
          {homeRecentProducts.map((product) => renderHomeCard(product, "recent"))}
        </div>

        <h2>สินค้าแนะนำ</h2>
        <div className="home-grid">
          {homeRecommendedProducts.map((product) => renderHomeCard(product, "recommended"))}
        </div>
      </main>

      <BottomNav active="home" go={go} />
    </section>
  );
}

function SearchScreen({ go, query, setQuery }: { go: (screen: Screen) => void; query: string; setQuery: (value: string) => void }) {
  const filtered = useMemo(
    () => suggestions.filter((item) => item.label.includes(query.trim()) || !query.trim()),
    [query]
  );

  const submit = () => {
    if (!query.trim()) setQuery("รองเท้าวิ่ง Nike");
    go("results");
  };

  return (
    <section className="screen search-screen">
      <StatusBar />
      <div className="search-page-field">
        <SearchField value={query} onChange={setQuery} onSubmit={submit} active autoFocus showLight />
      </div>
      <main className="search-content">
        <h2>สินค้าแนะนำ</h2>
        <div className="suggestions">
          {(filtered.length ? filtered : suggestions).map((item) => (
            <button
              key={item.label}
              onClick={() => { setQuery(item.label); go("results"); }}
              type="button"
            >
              <span>{item.label}</span>
              <small className={item.trend.startsWith("-") ? "down" : ""}>
                <span aria-hidden="true">{item.trend.startsWith("-") ? "⌁" : "⌁"}</span> นิยม {item.trend}
              </small>
            </button>
          ))}
        </div>
        <h2 className="recent-heading">ค้นหาล่าสุด</h2>
        <div className="recent-list">
          {[
            ["รองเท้าวิ่ง", `${ASSET}/search-recent-1.png`],
            ["เลโก้", `${ASSET}/search-recent-2.png`],
            ["หมวก", `${ASSET}/search-recent-3.png`]
          ].map(([label, image]) => (
            <button key={label} onClick={() => { setQuery(label); go("results"); }} type="button">
              <span>{label}</span><img src={image} alt="" />
            </button>
          ))}
        </div>
      </main>
      <BottomNav go={go} />
    </section>
  );
}

function ResultsScreen({
  go,
  query,
  setQuery,
  selected,
  setSelected
}: {
  go: (screen: Screen) => void;
  query: string;
  setQuery: (value: string) => void;
  selected: number[];
  setSelected: (value: number[]) => void;
}) {
  const [filters, setFilters] = useState(["ส่งฟรี"]);
  const [sortLow, setSortLow] = useState(false);
  const visibleProducts = useMemo(
    () => sortLow ? [...products].sort((a, b) => a.price - b.price) : products,
    [sortLow]
  );

  const toggleProduct = (id: number) => {
    if (selected.includes(id)) setSelected(selected.filter((item) => item !== id));
    else if (selected.length < 3) setSelected([...selected, id]);
  };

  return (
    <section className="screen results-screen">
      <StatusBar />
      <header className="results-header">
        <div className="results-search-row">
          <SearchField value={query} onChange={setQuery} onSubmit={() => undefined} active />
          <button className={sortLow ? "sort active" : "sort"} onClick={() => setSortLow(!sortLow)} type="button" aria-label="เรียงราคา">
            <Icon name="sort" />
          </button>
        </div>
        <div className="chips">
          {["Mall", "ส่งฟรี", "ราคาถูก"].map((filter) => (
            <button
              key={filter}
              className={filters.includes(filter) ? "selected" : ""}
              onClick={() => {
                if (filter === "ราคาถูก" && !filters.includes(filter)) {
                  setFilters([...filters, filter]);
                  go("no-results");
                  return;
                }
                setFilters(filters.includes(filter) ? filters.filter((item) => item !== filter) : [...filters, filter]);
              }}
              type="button"
            >
              {filter}
            </button>
          ))}
        </div>
        <small>พบ 989 รายการ</small>
      </header>
      <main className="results-grid">
        {visibleProducts.map((product) => {
          const isSelected = selected.includes(product.id);
          return (
            <button
              className={isSelected ? "product-card selected" : "product-card"}
              key={product.id}
              onClick={() => toggleProduct(product.id)}
              type="button"
              aria-pressed={isSelected}
            >
              {product.data ? (
                <ProductCard product={product.data} />
              ) : (
                <img src={product.image} alt={`สินค้าราคา ${product.price.toLocaleString()} บาท`} />
              )}
              {isSelected && <span className="selected-ring" />}
            </button>
          );
        })}
      </main>
      <button
        className={selected.length >= 2 ? "compare-button ready" : "compare-button"}
        onClick={() => selected.length >= 2 && go("compare")}
        type="button"
        aria-disabled={selected.length < 2}
      >
        เปรียบเทียบ
      </button>
      <BottomNav go={go} />
    </section>
  );
}

function CompareTags({ offer }: { offer: CompareOffer }) {
  return (
    <div className="compare-tags" aria-label={offer.platform + (offer.mall ? " Mall" : "")}>
      <PlatformBadge platform={offer.platform} />
      {offer.mall && <PlatformBadge platform="MALL" />}
      {offer.freeShip && <span className="compare-tag free">ส่งฟรี</span>}
    </div>
  );
}

const compareDiscountDetails = [
  { label: "ส่วนลดร้านค้า", amount: 48 },
  { label: "ส่วนลดแคมเปญ 8.8", amount: 52 },
  { label: "โค้ดแคมเปญช็อปต่อเนื่อง", amount: 20 }
];

const compareDiscountTotal = compareDiscountDetails.reduce((total, item) => total + item.amount, 0);

function CompareMiniTrend({ price }: { price: number }) {
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

function CompareUpIcon() {
  return (
    <svg className="compare-up-icon" viewBox="0 0 14 14" aria-hidden="true">
      <path d={COMPARE_UP_PATH} transform="translate(1.742 4.034)" />
    </svg>
  );
}

function CompareBuyButton({ offer, onUnavailable }: { offer: CompareOffer; onUnavailable: () => void }) {
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

function CompareScreen({
  go,
  selected,
  favorite,
  toggleFavorite,
  backTarget
}: {
  go: (screen: Screen) => void;
  selected: number[];
  favorite: boolean;
  toggleFavorite: () => void;
  backTarget: Screen;
}) {
  const [toast, setToast] = useState("");
  const [discountDetailsOpen, setDiscountDetailsOpen] = useState(false);
  const effectiveIds = selected.length >= 2 ? selected.slice(0, 3) : [1, 2, 3];
  const offers = effectiveIds.map((id) => compareOfferById[id]).filter(Boolean).sort((a, b) => a.price - b.price);
  const bestOffer = offers[0];
  const otherOffers = offers.slice(1);
  const bestSaving = bestOffer ? Math.max(0, bestOffer.originalPrice - bestOffer.price) : 0;

  const flash = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 1800);
  };

  if (!bestOffer) return null;

  return (
    <section className="screen compare-screen">
      <StatusBar />
      <Header title="ผลการเปรียบเทียบ" onBack={() => go(backTarget)} />

      <main className="compare-content">
        <section className="compare-product-summary">
          <img src={bestOffer.productImage} alt="" />
          <div className="compare-summary-copy">
            <span>สินค้าที่กำลังเปรียบเทียบ</span>
            <strong>{bestOffer.productName}</strong>
          </div>
          <button
            className={favorite ? "compare-track active" : "compare-track"}
            type="button"
            aria-label={favorite ? "เลิกติดตามราคา" : "ติดตามราคา"}
            aria-pressed={favorite}
            onClick={toggleFavorite}
          >
            <img
              src={favorite ? `${ASSET}/SVG/Like/Property 1=Like.svg` : `${ASSET}/SVG/Like/Property 1=Normal.svg`}
              alt=""
            />
            {favorite ? "กำลังติดตาม" : "ติดตามราคา"}
          </button>
          <div className="compare-summary-stats" aria-label={`เปรียบเทียบ ${offers.length} แพลตฟอร์ม ราคาต่ำสุด ${bestOffer.price.toLocaleString("en-US")} บาท`}>
            <span>
              <small>ราคาต่ำสุด</small>
              <b>฿{bestOffer.price.toLocaleString("en-US")}</b>
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
          <article className={discountDetailsOpen ? "compare-offer-row best expanded" : "compare-offer-row best"}>
            <div className="compare-row-top">
              <CompareTags offer={bestOffer} />
            </div>
            <div className="compare-row-main">
              <div className="compare-row-price">
                <strong>฿{bestOffer.price.toLocaleString("en-US")}</strong>
                <del>฿{bestOffer.originalPrice.toLocaleString("en-US")}</del>
              </div>
              <CompareBuyButton offer={bestOffer} onUnavailable={() => flash("ยังไม่มีลิงก์ร้านค้านี้ใน Prototype")} />
            </div>
            <div className="compare-row-meta">
              <span>★ {bestOffer.rating} <i>• ขายแล้ว {bestOffer.sold} ชิ้น</i></span>
              <b>ประหยัด ฿{bestSaving.toLocaleString("en-US")}</b>
            </div>
            <button
              className="compare-best-history"
              type="button"
              aria-label={`ดูกราฟราคา ${bestOffer.platform}`}
              onClick={() => go("history")}
            >
              <span className="compare-history-visual">
                <span className="compare-best-label">
                  คุ้มที่สุด
                  <img src={`${ASSET}/SVG/compare-fire.svg`} alt="" />
                </span>
                <CompareMiniTrend price={bestOffer.price} />
              </span>
              <span>
                <small>แนวโน้มราคา 30 วัน</small>
                <strong>ราคาลดลง 20%</strong>
              </span>
              <b aria-hidden="true">
                <img src={`${ASSET}/SVG/arrow_forward.svg`} alt="" />
              </b>
            </button>
            <button
              className="compare-discount-toggle"
              type="button"
              aria-expanded={discountDetailsOpen}
              onClick={() => setDiscountDetailsOpen((current) => !current)}
            >
              <span>รายละเอียดส่วนลด</span>
              <b>
                {discountDetailsOpen ? "ซ่อนรายละเอียด" : "ดูรายละเอียด"}
                <img src={`${ASSET}/SVG/arrow_drop.svg`} alt="" />
              </b>
            </button>
            <div
              className={discountDetailsOpen ? "compare-discount-panel open" : "compare-discount-panel"}
              aria-hidden={!discountDetailsOpen}
            >
              <div className="compare-discount-panel-inner">
                <div className="compare-discount-details">
                  <div className="compare-discount-heading">
                    <span>ส่วนลดเพิ่มเติมที่ได้รับ</span>
                    <b>รวม ฿{compareDiscountTotal.toLocaleString("en-US")}</b>
                  </div>
                  <div className="compare-discount-list">
                    {compareDiscountDetails.map((detail) => (
                      <div className="compare-discount-row" key={detail.label}>
                        <span>{detail.label}</span>
                        <b>-฿{detail.amount.toLocaleString("en-US")}</b>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </article>

          {otherOffers.map((offer) => (
            <article className="compare-offer-row" key={offer.id}>
              <div className="compare-row-top">
                <CompareTags offer={offer} />
              </div>
              <div className="compare-row-main">
                <div className="compare-row-price">
                  <strong>฿{offer.price.toLocaleString("en-US")}</strong>
                  <del>฿{offer.originalPrice.toLocaleString("en-US")}</del>
                </div>
                <div className="compare-row-actions">
                  <button
                    className="compare-graph-icon"
                    type="button"
                    aria-label={`ดูกราฟราคา ${offer.platform}`}
                    onClick={() => go("history")}
                  >
                    <img src={`${ASSET}/SVG/Nav Bar/HIC03.svg`} alt="" />
                  </button>
                  <CompareBuyButton offer={offer} onUnavailable={() => flash("ยังไม่มีลิงก์ร้านค้านี้ใน Prototype")} />
                </div>
              </div>
              <div className="compare-row-meta">
                <span>★ {offer.rating} <i>• ขายแล้ว {offer.sold} ชิ้น</i></span>
                <b className="higher">+฿{(offer.price - bestOffer.price).toLocaleString("en-US")}</b>
              </div>
            </article>
          ))}
        </section>

        <small className="compare-updated">อัปเดตราคาล่าสุด 10 นาทีที่แล้ว</small>
      </main>

      {toast && <div className="toast" role="status">{toast}</div>}
      <BottomNav go={go} />
    </section>
  );
}

function PriceChart({ period }: { period: Period }) {
  const data = chartData[period];
  const min = Math.min(...data);
  const max = Math.max(...data);
  const svgRef = useRef<SVGSVGElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [dragging, setDragging] = useState(false);
  const chartPoints = data.map((value, index) => ({
    value,
    x: 8 + (index / (data.length - 1)) * 320,
    y: 114 - ((value - min) / Math.max(1, max - min)) * 65
  }));
  const linePath = chartPoints.map((point, index) => `${index ? "L" : "M"} ${point.x} ${point.y}`).join(" ");
  const areaPath = `${linePath} L 328 139 L 8 139 Z`;
  const selectedIndex = activeIndex ?? chartPoints.length - 1;
  const selectedPoint = chartPoints[selectedIndex];
  const headlinePrice = activeIndex === null ? 5800 : selectedPoint.value;

  const choosePoint = (event: PointerEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    if (!svg) return;
    const bounds = svg.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width) * 344;
    const nearest = chartPoints.reduce(
      (best, point, index) => Math.abs(point.x - x) < Math.abs(chartPoints[best].x - x) ? index : best,
      0
    );
    setActiveIndex(nearest);
  };

  return (
    <div className="chart-card">
      <div className="chart-head">
        <strong>฿{headlinePrice.toLocaleString()}</strong>
        <span>-20%</span>
        <em>{activeIndex === null ? "ถูกสุดในรอบ 90 วัน" : `ราคา ณ จุดที่ ${selectedIndex + 1}`}</em>
      </div>
      <svg
        ref={svgRef}
        viewBox="0 0 344 150"
        role="img"
        aria-label={`กราฟราคา ${period} แตะหรือลากเพื่อดูราคา`}
        onPointerDown={(event) => {
          setDragging(true);
          event.currentTarget.setPointerCapture(event.pointerId);
          choosePoint(event);
        }}
        onPointerMove={(event) => {
          if (dragging || event.pointerType === "mouse") choosePoint(event);
        }}
        onPointerUp={(event) => {
          setDragging(false);
          if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
        }}
        onPointerLeave={() => !dragging && setActiveIndex(null)}
      >
        <defs>
          <linearGradient id="price-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffb09c" stopOpacity=".56" />
            <stop offset="100%" stopColor="#fff" stopOpacity=".08" />
          </linearGradient>
          <clipPath id="chart-reveal">
            <rect className="chart-reveal" width="344" height="150" />
          </clipPath>
        </defs>
        <g clipPath="url(#chart-reveal)">
          <path className="chart-area" d={areaPath} fill="url(#price-fill)" />
        </g>
        <path className="chart-line" pathLength="1" d={linePath} />
        <text className="average-label" x="174" y="61" textAnchor="middle">ราคาเฉลี่ย</text>
        <rect className="average-pill" x="149" y="66" width="50" height="20" rx="10" />
        <text className="average-price" x="174" y="80" textAnchor="middle">฿6,150</text>
        {activeIndex !== null && <line className="cursor-line" x1={selectedPoint.x} y1="45" x2={selectedPoint.x} y2="139" />}
        <circle className="chart-dot" cx={selectedPoint.x} cy={selectedPoint.y} r="8" />
        <g className="price-label" transform={`translate(${Math.min(286, Math.max(4, selectedPoint.x - 27))} ${Math.max(8, selectedPoint.y - 30)})`}>
          <rect width="55" height="22" rx="11" />
          <text x="27.5" y="15" textAnchor="middle">฿{selectedPoint.value.toLocaleString()}</text>
        </g>
      </svg>
      <div className="month-labels"><span>เม.ย.</span><span>พ.ค.</span><span>มิ.ย.</span><span>ก.ค.</span></div>
    </div>
  );
}

function HistoryScreen({ go }: { go: (screen: Screen) => void }) {
  const [period, setPeriod] = useState<Period>("7 วัน");
  const [favorite, setFavorite] = useState(false);
  const [toast, setToast] = useState("");

  const flash = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 1800);
  };

  return (
    <section className="screen history-screen">
      <StatusBar />
      <Header title="ประวัติราคาล่าสุด" onBack={() => go("compare")} />
      <main className="history-content">
        <img className="history-product" src={`${ASSET}/history-product.png`} alt="รองเท้ากีฬา Nike ราคา 5,800 บาท" />
        <div className="period-tabs" role="tablist" aria-label="ช่วงเวลา">
          {(Object.keys(chartData) as Period[]).map((item) => (
            <button
              key={item}
              className={period === item ? "active" : ""}
              onClick={() => setPeriod(item)}
              type="button"
              role="tab"
              aria-selected={period === item}
            >
              {item}
            </button>
          ))}
        </div>
        <PriceChart key={period} period={period} />
        <div className="ai-card">
          <Icon name="ai" />
          <div>
            <strong>ราคาดีที่สุดในรอบ 90 วัน!✨</strong>
            <span />
            <p>ซื้อตอนนี้ประหยัดกว่าราคาเฉลี่ยถึง 350 บาท แนะนำให้ตัดสินใจซื้อได้เลยเพื่อความคุ้มค่าสูงสุด</p>
          </div>
        </div>
        <div className="history-buttons">
          <button
            className={favorite ? "favorite active" : "favorite"}
            onClick={() => {
              setFavorite(!favorite);
              flash(favorite ? "นำออกจากรายการโปรดแล้ว" : "บันทึกในรายการโปรดแล้ว");
            }}
            type="button"
          >
            <Icon name="heart" /> รายการโปรด
          </button>
          <button onClick={() => flash("กำลังเปิดร้านค้าที่ราคาดีที่สุด")} type="button">
            <Icon name="bag" /> ซื้อเลย
          </button>
        </div>
      </main>
      {toast && <div className="toast" role="status">{toast}</div>}
      <BottomNav go={go} />
    </section>
  );
}


type SavingsPeriod = "3 เดือน" | "6 เดือน" | "ปี" | "ทั้งหมด";

const savingsChartData: Record<SavingsPeriod, { labels: string[]; values: number[] }> = {
  "3 เดือน": { labels: ["เม.ย.", "พ.ค.", "มิ.ย."], values: [1750, 225, 1050] },
  "6 เดือน": { labels: ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย."], values: [520, 930, 680, 1750, 225, 1050] },
  "ปี": { labels: ["ก.ค.", "ก.ย.", "พ.ย.", "ม.ค.", "มี.ค.", "พ.ค."], values: [780, 1100, 650, 1320, 890, 1750] },
  "ทั้งหมด": { labels: ["2566", "2567", "2568", "2569"], values: [2480, 3120, 2600, 2050] }
};

const savingsEntries = [
  {
    name: "Carlyn New Logo Washed Cap Green",
    image: ASSET + "/search-recent-3.png",
    saved: 154,
    price: 615,
    originalPrice: 769
  },
  {
    name: "Nike Air Force 1 '07",
    image: nikeAirForceOne.imageUrl,
    saved: 706,
    price: 3594,
    originalPrice: 4300
  },
  {
    name: "womenager - Jane Original",
    image: homeRecentProducts[1].imageUrl,
    saved: 234,
    price: 1790,
    originalPrice: 2024
  }
];

function TotalSaveScreen({ go }: { go: (screen: Screen) => void }) {
  const [period, setPeriod] = useState<SavingsPeriod>("3 เดือน");
  const chart = savingsChartData[period];
  const periodIndex = (Object.keys(savingsChartData) as SavingsPeriod[]).indexOf(period);
  const chartMax = Math.ceil(Math.max(...chart.values) / 500) * 500;
  const axisLabels = [chartMax, chartMax * .75, chartMax * .5, chartMax * .25, 0];

  return (
    <section className="screen total-save-screen">
      <StatusBar />
      <Header title="คุณประหยัดเงินไปทั้งหมด" onBack={() => go("home")} />

      <main className="total-save-content">
        <section className="total-save-card" aria-label="ยอดประหยัดรวม">
          <span>Total Save</span>
          <AnimatedSavingsTotal />
          <div className="total-save-change">
            <img className="total-save-trend-icon" src={TRENDING_UP_ICON} alt="" aria-hidden="true" />
            <b>฿1,000 จากเดือนก่อน</b>
          </div>
        </section>

        <div
          className="total-save-tabs"
          role="tablist"
          aria-label="เลือกช่วงเวลา"
          style={{ "--savings-tab-index": periodIndex } as CSSProperties}
        >
          <span className="total-save-tab-indicator" aria-hidden="true" />
          {(Object.keys(savingsChartData) as SavingsPeriod[]).map((item) => (
            <button
              key={item}
              className={period === item ? "active" : ""}
              onClick={() => setPeriod(item)}
              type="button"
              role="tab"
              aria-selected={period === item}
            >
              {item}
            </button>
          ))}
        </div>

        <section className="total-save-chart-card" aria-label={"กราฟยอดประหยัด " + period}>
          <div className="total-save-axis" aria-hidden="true">
            {axisLabels.map((value) => (
              <span key={value}>{Math.round(value).toLocaleString("en-US")}</span>
            ))}
          </div>
          <div className="total-save-plot">
            <div className="total-save-grid" aria-hidden="true">
              {axisLabels.map((value) => <span key={value} />)}
            </div>
            <div className="total-save-bars" key={period}>
              {chart.values.map((value, index) => (
                <div className="total-save-bar-column" key={chart.labels[index] + "-" + value}>
                  <div
                    className="total-save-bar"
                    style={{
                      height: Math.max(8, (value / chartMax) * 100) + "%",
                      animationDelay: index * 55 + "ms"
                    }}
                    title={chart.labels[index] + " ประหยัด " + value.toLocaleString("en-US") + " บาท"}
                  />
                </div>
              ))}
            </div>
            <div className="total-save-months">
              {chart.labels.map((label) => <span key={label}>{label}</span>)}
            </div>
          </div>
        </section>

        <section className="total-save-summary">
          <h2>รายการสรุป</h2>
          <div className="total-save-list">
            {savingsEntries.map((entry) => (
              <article className="total-save-list-item" key={entry.name}>
                <img src={entry.image} alt="" />
                <div className="total-save-list-copy">
                  <strong title={entry.name}>{entry.name}</strong>
                  <div>
                    <span>ประหยัด ฿{entry.saved.toLocaleString("en-US")}</span>
                    <p>
                      <b>฿{entry.price.toLocaleString("en-US")}</b>
                      <del>฿{entry.originalPrice.toLocaleString("en-US")}</del>
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      <BottomNav active="savings" go={go} />
    </section>
  );
}


const profileActivityItems = [
  { icon: PROFILE_ICONS.orders, label: "ประวัติคำสั่งซื้อ" },
  { icon: PROFILE_ICONS.history, label: "ประวัติการค้นหา" }
];

const profileServiceItems = [
  {
    icon: PROFILE_ICONS.settings,
    label: "การตั้งค่า",
    description: "ความสนใจ ความปลอดภัย และบัญชีเชื่อมต่อ"
  },
  {
    icon: PROFILE_ICONS.help,
    label: "ศูนย์ช่วยเหลือ",
    description: "FAQ และติดต่อเรา"
  },
  {
    icon: PROFILE_ICONS.security,
    label: "ข้อกำหนดและความเป็นส่วนตัว"
  }
];

function ProfileMenuItem({
  icon,
  label,
  description,
  onClick
}: {
  icon: string;
  label: string;
  description?: string;
  onClick: () => void;
}) {
  return (
    <button className="profile-menu-item" type="button" onClick={onClick}>
      <span className="profile-menu-icon"><img src={icon} alt="" /></span>
      <span className="profile-menu-copy">
        <strong>{label}</strong>
        {description && <small>{description}</small>}
      </span>
      <img className="profile-chevron" src={PROFILE_ICONS.chevron} alt="" aria-hidden="true" />
    </button>
  );
}

function ProfileScreen({ go }: { go: (screen: Screen) => void }) {
  const [toast, setToast] = useState("");

  const flash = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 1800);
  };

  return (
    <section className="screen profile-screen">
      <StatusBar />

      <main className="profile-content">
        <h1>โปรไฟล์</h1>

        <section className="profile-hero">
          <span className="profile-orb profile-orb-one" aria-hidden="true" />
          <span className="profile-orb profile-orb-two" aria-hidden="true" />
          <div className="profile-avatar">
            <img src={PROFILE_ICONS.profile} alt="" />
          </div>
          <div className="profile-identity">
            <strong>มนุษย์คนหนึ่ง</strong>
            <span>สมาชิก Best Choice</span>
          </div>
          <button className="profile-edit" type="button" onClick={() => flash("เปิดหน้าแก้ไขโปรไฟล์")}>
            แก้ไข
          </button>
          <div className="profile-hero-divider" />
          <button className="profile-stat" type="button" onClick={() => go("total-save")}>
            <span>ประหยัดทั้งหมด</span>
            <strong>฿10,250</strong>
          </button>
          <button className="profile-stat profile-stat-interest" type="button" onClick={() => go("interest")}>
            <span>สินค้าที่สนใจ</span>
            <strong>12 รายการ</strong>
          </button>
        </section>

        <section className="profile-section">
          <h2>กิจกรรมของฉัน</h2>
          <div className="profile-menu-card">
            {profileActivityItems.map((item) => (
              <ProfileMenuItem
                key={item.label}
                {...item}
                onClick={() => flash("เปิด" + item.label)}
              />
            ))}
          </div>
        </section>

        <section className="profile-section">
          <h2>บัญชีและบริการ</h2>
          <div className="profile-menu-card profile-service-card">
            {profileServiceItems.map((item) => (
              <ProfileMenuItem
                key={item.label}
                {...item}
                onClick={() => flash("เปิด" + item.label)}
              />
            ))}
          </div>
        </section>

        <button className="profile-logout" type="button" onClick={() => flash("ระบบต้นแบบยังไม่ได้เชื่อมการออกจากระบบ")}>
          ออกจากระบบ
        </button>
      </main>

      {toast && <div className="toast" role="status">{toast}</div>}
      <BottomNav active="profile" go={go} />
    </section>
  );
}

type ReferenceAction = {
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  target: Screen;
};

const referenceActions: Partial<Record<Screen, ReferenceAction[]>> = {
  "total-save": [
    { label: "ย้อนกลับ", x: 12, y: 50, width: 48, height: 52, target: "home" }
  ],
  interest: [
    { label: "เปิดเปรียบเทียบสินค้าชิ้นที่ 1", x: 16, y: 178, width: 181, height: 256, target: "compare" },
    { label: "เปิดเปรียบเทียบสินค้าชิ้นที่ 2", x: 205, y: 178, width: 181, height: 256, target: "compare" },
    { label: "เปิดเปรียบเทียบสินค้าชิ้นที่ 3", x: 16, y: 447, width: 181, height: 256, target: "compare" },
    { label: "เปิดเปรียบเทียบสินค้าชิ้นที่ 4", x: 205, y: 447, width: 181, height: 256, target: "compare" },
    { label: "นำสินค้าชิ้นแรกออก", x: 157, y: 178, width: 40, height: 40, target: "interest-confirm" }
  ],
  "interest-confirm": [
    { label: "ยกเลิก", x: 16, y: 780, width: 176, height: 50, target: "interest" },
    { label: "ยืนยันนำออก", x: 210, y: 780, width: 176, height: 50, target: "interest-removed" }
  ],
  "interest-removed": [
    { label: "เปิดเปรียบเทียบสินค้าชิ้นที่ 1", x: 16, y: 178, width: 181, height: 256, target: "compare" },
    { label: "เปิดเปรียบเทียบสินค้าชิ้นที่ 2", x: 205, y: 178, width: 181, height: 256, target: "compare" },
    { label: "เปิดเปรียบเทียบสินค้าชิ้นที่ 3", x: 16, y: 447, width: 181, height: 256, target: "compare" },
    { label: "เปิดเปรียบเทียบสินค้าชิ้นที่ 4", x: 205, y: 447, width: 181, height: 256, target: "compare" },
    { label: "เลิกทำ", x: 304, y: 732, width: 82, height: 54, target: "interest" },
    { label: "ดูสถานะรายการสุดท้าย", x: 157, y: 178, width: 40, height: 40, target: "interest-last" }
  ],
  "interest-last": [
    { label: "เปิดเปรียบเทียบสินค้าชิ้นสุดท้าย", x: 16, y: 178, width: 181, height: 256, target: "compare" },
    { label: "นำสินค้าชิ้นสุดท้ายออก", x: 157, y: 178, width: 40, height: 40, target: "interest-last-confirm" }
  ],
  "interest-last-confirm": [
    { label: "ยกเลิก", x: 16, y: 780, width: 176, height: 50, target: "interest-last" },
    { label: "ยืนยันนำออก", x: 210, y: 780, width: 176, height: 50, target: "interest-empty" }
  ],
  "interest-empty": [
    { label: "เริ่มค้นหาสินค้า", x: 91, y: 450, width: 220, height: 50, target: "search" }
  ],
  "no-results": [
    { label: "แก้ไขคำค้นหา", x: 18, y: 66, width: 331, height: 50, target: "search" },
    { label: "ล้างตัวกรอง", x: 106, y: 502, width: 190, height: 50, target: "results" }
  ]
};

const referenceLabels: Partial<Record<Screen, string>> = {
  "total-save": "สรุปยอดประหยัดทั้งหมด",
  profile: "โปรไฟล์",
  interest: "สินค้าที่สนใจ 12 รายการ",
  "interest-confirm": "ยืนยันนำสินค้าออกจากรายการสนใจ",
  "interest-removed": "นำสินค้าออกแล้ว พร้อมปุ่มเลิกทำ",
  "interest-empty": "ยังไม่มีสินค้าที่สนใจ",
  "no-results": "ไม่พบผลลัพธ์",
  "interest-last": "สินค้าที่สนใจรายการสุดท้าย",
  "interest-last-confirm": "ยืนยันนำสินค้ารายการสุดท้ายออก"
};

function ReferenceScreen({ screen, go }: { screen: Screen; go: (screen: Screen) => void }) {
  const modalOpen = screen === "interest-confirm" || screen === "interest-last-confirm";
  const activeNav =
    screen === "profile"
      ? "profile"
      : screen === "total-save"
        ? "savings"
        : screen.startsWith("interest")
          ? "interest"
          : undefined;

  return (
    <section className={`screen reference-screen reference-${screen}`} aria-label={referenceLabels[screen]}>
      <img src={`${SCREENSHOT}/${screen}.png`} alt={referenceLabels[screen] || ""} />
      {(referenceActions[screen] || []).map((action) => (
        <button
          key={action.label}
          className="reference-hotspot"
          style={{ left: action.x, top: action.y, width: action.width, height: action.height }}
          type="button"
          aria-label={action.label}
          onClick={() => go(action.target)}
        />
      ))}
      {!modalOpen && <BottomNav active={activeNav} go={go} />}
    </section>
  );
}

export default function BestChoiceApp() {
  const [screen, setScreen] = useState<Screen>("home");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<number[]>([]);
  const [compareBackScreen, setCompareBackScreen] = useState<Screen>("results");
  const [homeFavorites, setHomeFavorites] = useState<Record<string, boolean>>(initialHomeFavorites);
  const prototypeScale = usePrototypeScale();
  const prototypeStyle = {
    "--prototype-scale": prototypeScale,
    "--prototype-scaled-width": `${PROTOTYPE_WIDTH * prototypeScale}px`,
    "--prototype-scaled-height": `${(PROTOTYPE_HEIGHT - MOBILE_STATUS_BAR_CROP) * prototypeScale}px`,
    "--prototype-mobile-offset": `${-MOBILE_STATUS_BAR_CROP * prototypeScale}px`
  } as CSSProperties;

  useEffect(() => {
    const openHistory = () => setScreen("history");
    const openSearch = () => setScreen("search");
    document.addEventListener("best-choice:open-history", openHistory);
    document.addEventListener("best-choice:start-search", openSearch);
    return () => {
      document.removeEventListener("best-choice:open-history", openHistory);
      document.removeEventListener("best-choice:start-search", openSearch);
    };
  }, []);

  const go = (next: Screen) => {
    if (next === "compare" && screen !== "history") {
      setCompareBackScreen(screen);
    }
    setScreen(next);
  };

  return (
    <main className="prototype-stage" style={prototypeStyle}>
      <div className="phone-viewport">
        <div className="phone-shell">
          {screen === "home" && (
            <HomeScreen
              go={go}
              query={query}
              setQuery={setQuery}
              homeFavorites={homeFavorites}
              toggleHomeFavorite={(key) =>
                setHomeFavorites((current) => ({ ...current, [key]: !current[key] }))
              }
            />
          )}
          {screen === "search" && <SearchScreen go={go} query={query} setQuery={setQuery} />}
          {screen === "results" && (
            <ResultsScreen
              go={go}
              query={query || "รองเท้าวิ่ง Nike"}
              setQuery={setQuery}
              selected={selected}
              setSelected={setSelected}
            />
          )}
          {screen === "compare" && (
            <CompareScreen
              go={go}
              selected={selected}
              favorite={Boolean(homeFavorites["recent-1"])}
              toggleFavorite={() =>
                setHomeFavorites((current) => ({ ...current, "recent-1": !current["recent-1"] }))
              }
              backTarget={compareBackScreen}
            />
          )}
          {screen === "history" && <HistoryScreen go={go} />}
          {screen === "total-save" && <TotalSaveScreen go={go} />}
          {screen === "profile" && <ProfileScreen go={go} />}
          {[
            "interest",
            "interest-confirm",
            "interest-removed",
            "interest-empty",
            "no-results",
            "interest-last",
            "interest-last-confirm"
          ].includes(screen) && <ReferenceScreen screen={screen} go={go} />}
        </div>
      </div>
      <aside className="demo-note">
        <span>FIGMA-MATCHED PROTOTYPE</span>
        <h2>Best Choice</h2>
        <p>ค้นหา เปรียบเทียบ ลากดูกราฟ และทดลองลบสินค้าในรายการสนใจได้ครบทั้ง loop</p>
        <button onClick={() => { setScreen("home"); setQuery(""); setSelected([]); setCompareBackScreen("results"); setHomeFavorites(initialHomeFavorites); }} type="button">เริ่ม Demo ใหม่</button>
      </aside>
    </main>
  );
}
