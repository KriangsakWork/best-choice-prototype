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

export type TermSuggestion = {
  label: string;
  keywords: string[];
};

export const searchTermSuggestions: TermSuggestion[] = [
  { label: "รองเท้าวิ่ง", keywords: ["รองเท้าวิ่ง", "รองเท้า", "วิ่ง", "running", "run shoes"] },
  { label: "รองเท้าผ้าใบ", keywords: ["รองเท้าผ้าใบ", "รองเท้า", "ผ้าใบ", "sneakers", "sneaker"] },
  { label: "รองเท้าแตะ", keywords: ["รองเท้าแตะ", "รองเท้า", "แตะ", "sandals", "slide"] },
  { label: "รองเท้าผู้หญิง", keywords: ["รองเท้าผู้หญิง", "รองเท้า", "ผู้หญิง", "คัทชู", "แมรี่เจน", "ballet flats"] },
  { label: "Nike Air Force 1 '07", keywords: ["nike", "air force", "air force 1", "af1", "ไนกี้", "รองเท้าผ้าใบ"] },
  { label: "Converse Chuck Taylor", keywords: ["converse", "chuck taylor", "chuck 70", "คอนเวิร์ส", "รองเท้าผ้าใบ"] },
  { label: "Vans Old Skool", keywords: ["vans", "old skool", "old school", "แวนส์", "รองเท้าผ้าใบ"] },
  { label: "NEW BALANCE 740", keywords: ["new balance", "nb 740", "740", "นิวบาลานซ์", "รองเท้าวิ่ง"] },
  { label: "HOKA CLIFTON ONE9", keywords: ["hoka", "clifton", "one9", "โฮก้า", "รองเท้าวิ่ง"] },
  { label: "Adidas Ultraboost Light", keywords: ["adidas", "ultraboost", "อาดิดาส", "รองเท้าวิ่ง"] },
  { label: "Crocs Classic Clog", keywords: ["crocs", "classic clog", "คร็อคส์", "รองเท้าแตะ"] },
  { label: "Birkenstock Arizona", keywords: ["birkenstock", "arizona", "เบียร์เคนสต็อก", "รองเท้าแตะ"] },
  { label: "Kito BioCare", keywords: ["kito", "biocare", "กีโต้", "รองเท้าแตะ"] },
  { label: "womenager - Jane Original", keywords: ["womenager", "jane original", "รองเท้าผู้หญิง", "คัทชู"] },
  { label: "Flynn - Ballet Flats", keywords: ["flynn", "ballet flats", "รองเท้าผู้หญิง", "คัทชู"] },
  { label: "Labotte.bkk - The Rookie", keywords: ["labotte", "the rookie", "รองเท้าผู้หญิง", "แมรี่เจน"] },
  { label: "COACH Coin Wallet In Signature", keywords: ["coach", "coin wallet", "signature", "โค้ช", "กระเป๋าสตางค์", "กระเป๋าตังค์"] },
  { label: "เสื้อคลุม Adidas", keywords: ["adidas", "เสื้อคลุม", "แจ็คเก็ต", "jacket", "windbreaker", "อาดิดาส"] },
  { label: "หมวก Nike สีดำ Original", keywords: ["nike", "หมวก", "หมวกแก๊ป", "cap", "ไนกี้"] }
];

export function findTermSuggestions(value: string, limit = 8): TermSuggestion[] {
  const query = normalize(value);
  if (!query) return [];

  const scored = searchTermSuggestions
    .map((term) => {
      const label = normalize(term.label);
      const keywords = term.keywords.map(normalize);

      if (label.startsWith(query)) return { term, score: 0 };
      if (keywords.some((keyword) => keyword.startsWith(query))) return { term, score: 1 };
      if (label.includes(query)) return { term, score: 2 };
      if (keywords.some((keyword) => keyword.includes(query))) return { term, score: 3 };
      return null;
    })
    .filter((entry): entry is { term: TermSuggestion; score: number } => entry !== null);

  return scored
    .sort((a, b) => a.score - b.score)
    .slice(0, limit)
    .map((entry) => entry.term);
}
