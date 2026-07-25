"use client";

import { FormEvent, PointerEvent, useMemo, useRef, useState } from "react";

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

const products = [
  { id: 1, image: `${ASSET}/result-1.png`, price: 3328 },
  { id: 2, image: `${ASSET}/result-2.png`, price: 3594 },
  { id: 3, image: `${ASSET}/result-3.png`, price: 3390 },
  { id: 4, image: `${ASSET}/result-4.png`, price: 3750 },
  { id: 5, image: `${ASSET}/result-5.png`, price: 2890 },
  { id: 6, image: `${ASSET}/result-6.png`, price: 4100 }
];

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
      <img src={`${SCREENSHOT}/home.png`} alt="" />
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
      <img className="nav-visual" src={`${SCREENSHOT}/${active === "home" ? "home" : "history"}.png`} alt="" aria-hidden="true" />
      {items.map((item) => (
        <button
          key={item.key}
          className={active === item.key ? "active" : ""}
          onClick={() => go(item.screen)}
          type="button"
        >
          <span className="sr-only">{item.label}</span>
        </button>
      ))}
    </nav>
  );
}

function SearchField({
  value,
  onChange,
  onSubmit,
  onFocus,
  active = false,
  autoFocus = false
}: {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onFocus?: () => void;
  active?: boolean;
  autoFocus?: boolean;
}) {
  const submit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <form className={`search-field ${active ? "active" : ""}`} onSubmit={submit}>
      <button className="search-button" type="submit" aria-label="ค้นหา">
        <Icon name={active ? "search-active" : "search"} />
      </button>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onFocus={onFocus}
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

function HomeScreen({ go, query, setQuery }: { go: (screen: Screen) => void; query: string; setQuery: (value: string) => void }) {
  return (
    <section className="screen home-screen">
      <StatusBar />
      <div className="home-search">
        <SearchField
          value={query}
          onChange={setQuery}
          onFocus={() => go("search")}
          onSubmit={() => go("search")}
        />
      </div>
      <button className="savings-hero" onClick={() => go("total-save")} type="button">
        <img src={`${ASSET}/home-savings.png`} alt="ยอดประหยัดรวม 10,250 บาท" />
      </button>
      <main className="home-content">
        <h2>ค้นหาล่าสุด</h2>
        <div className="home-grid">
          <button onClick={() => go("results")} type="button"><img src={`${ASSET}/home-card-1.png`} alt="Nike Air Force 1" /></button>
          <button onClick={() => go("results")} type="button"><img src={`${ASSET}/home-card-2.png`} alt="Vans Old Skool" /></button>
        </div>
        <h2>สินค้าแนะนำ</h2>
        <div className="home-grid">
          <button onClick={() => go("results")} type="button"><img src={`${ASSET}/result-3.png`} alt="รองเท้าแนะนำ" /></button>
          <button onClick={() => go("results")} type="button"><img src={`${ASSET}/result-4.png`} alt="รองเท้าแนะนำ" /></button>
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
        <SearchField value={query} onChange={setQuery} onSubmit={submit} active autoFocus />
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
              <img src={product.image} alt={`สินค้าราคา ${product.price.toLocaleString()} บาท`} />
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

function CompareScreen({ go, selected }: { go: (screen: Screen) => void; selected: number[] }) {
  const count = Math.max(2, Math.min(3, selected.length));

  return (
    <section className="screen compare-screen">
      <StatusBar />
      <Header title="ผลการเปรียบเทียบ" onBack={() => go("results")} />
      <main className="compare-content">
        {[1, 2, 3].slice(0, count).map((index) => (
          <button key={index} className={`compare-card card-${index}`} onClick={() => go("history")} type="button">
            <img src={`${ASSET}/compare-${index}.png`} alt={`ตัวเลือกที่ ${index}`} />
          </button>
        ))}
      </main>
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
        <strong>฿{selectedPoint.value.toLocaleString()}</strong>
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
      <BottomNav active="savings" go={go} />
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
    { label: "นำสินค้าชิ้นแรกออก", x: 157, y: 178, width: 40, height: 40, target: "interest-confirm" }
  ],
  "interest-confirm": [
    { label: "ยกเลิก", x: 16, y: 780, width: 176, height: 50, target: "interest" },
    { label: "ยืนยันนำออก", x: 210, y: 780, width: 176, height: 50, target: "interest-removed" }
  ],
  "interest-removed": [
    { label: "เลิกทำ", x: 304, y: 732, width: 82, height: 54, target: "interest" },
    { label: "ดูสถานะรายการสุดท้าย", x: 157, y: 178, width: 40, height: 40, target: "interest-last" }
  ],
  "interest-last": [
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
  const nav = [
    { label: "หน้าหลัก", target: "home" as Screen },
    { label: "สนใจ", target: "interest" as Screen },
    { label: "ประหยัด", target: "total-save" as Screen },
    { label: "โปรไฟล์", target: "profile" as Screen }
  ];

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
      {!modalOpen && (
        <nav className="reference-nav" aria-label="เมนูหลัก">
          {nav.map((item) => (
            <button key={item.label} type="button" aria-label={item.label} onClick={() => go(item.target)} />
          ))}
        </nav>
      )}
    </section>
  );
}

export default function BestChoiceApp() {
  const [screen, setScreen] = useState<Screen>("home");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<number[]>([]);

  const go = (next: Screen) => setScreen(next);

  return (
    <main className="prototype-stage">
      <div className="phone-shell">
        {screen === "home" && <HomeScreen go={go} query={query} setQuery={setQuery} />}
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
        {screen === "compare" && <CompareScreen go={go} selected={selected} />}
        {screen === "history" && <HistoryScreen go={go} />}
        {[
          "total-save",
          "profile",
          "interest",
          "interest-confirm",
          "interest-removed",
          "interest-empty",
          "no-results",
          "interest-last",
          "interest-last-confirm"
        ].includes(screen) && <ReferenceScreen screen={screen} go={go} />}
      </div>
      <aside className="demo-note">
        <span>FIGMA-MATCHED PROTOTYPE</span>
        <h2>Best Choice</h2>
        <p>ค้นหา เปรียบเทียบ ลากดูกราฟ และทดลองลบสินค้าในรายการสนใจได้ครบทั้ง loop</p>
        <button onClick={() => { setScreen("home"); setQuery(""); setSelected([]); }} type="button">เริ่ม Demo ใหม่</button>
      </aside>
    </main>
  );
}
