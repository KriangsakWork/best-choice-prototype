export type SearchSuggestion = {
  label: string;
  trend: string;
};

export const searchSuggestions: SearchSuggestion[] = [
  { label: "รองเท้าวิ่ง", trend: "+32%" },
  { label: "รองเท้าผ้าใบ", trend: "+18%" },
  { label: "Nike Air Force 1", trend: "+16%" },
  { label: "รองเท้าแตะ", trend: "+11%" }
];

export const recentSearches = [
  "Nike Air Force 1",
  "Adidas Ultraboost",
  "Crocs"
];

const catalogTerms = [
  "รองเท้าวิ่ง",
  "รองเท้าผ้าใบ",
  "รองเท้าแตะ",
  "รองเท้าผู้หญิง",
  "nike",
  "nike air force 1",
  "air force 1",
  "af1",
  "converse",
  "chuck taylor",
  "vans",
  "old skool",
  "new balance 740",
  "nb 740",
  "hoka",
  "hoka clifton",
  "adidas",
  "ultraboost",
  "crocs",
  "birkenstock",
  "kito",
  "womenager",
  "flynn",
  "ballet flats",
  "labotte",
  "mary jane",
  "แมรี่เจน",
  "คัทชู",
  "coach",
  "coin wallet",
  "กระเป๋าสตางค์",
  "กระเป๋าตังค์",
  "เสื้อคลุม",
  "แจ็คเก็ต",
  "jacket",
  "หมวก",
  "หมวกแก๊ป",
  "cap"
];

function normalize(value: string) {
  return value.trim().toLocaleLowerCase("th-TH").replace(/\s+/g, " ");
}

export function matchesCatalogSearch(value: string) {
  const query = normalize(value);
  if (!query) return true;

  return catalogTerms.some((term) => {
    const normalizedTerm = normalize(term);
    return normalizedTerm.includes(query) || query.includes(normalizedTerm);
  });
}
