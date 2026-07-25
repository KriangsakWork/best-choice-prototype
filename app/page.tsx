"use client";

import { FormEvent, PointerEvent, useMemo, useRef, useState } from "react";

type Screen = "home" | "search" | "results" | "compare" | "history";
type Period = "7 วัน" | "30 วัน" | "2 เดือน" | "3 เดือน";

const products = [
  { id: 1, image: "/assets/result-1.png", name: "Nike Air Force 1 '07", price: 3328, oldPrice: 4300 },
  { id: 2, image: "/assets/result-2.png", name: "Nike Air Force 1 '07", price: 3594, oldPrice: 4300 },
  { id: 3, image: "/assets/result-3.png", name: "Nike Air Force 1 '07", price: 3390, oldPrice: 5290 },
  { id: 4, image: "/assets/result-4.png", name: "Adidas Ultraboost Light", price: 3750, oldPrice: 7000 },
  { id: 5, image: "/assets/result-1.png", name: "Nike Revolution 7", price: 2890, oldPrice: 3790 },
  { id: 6, image: "/assets/result-4.png", name: "Nike Pegasus Trail", price: 4100, oldPrice: 5590 }
];

const suggestions = [
  { label: "รองเท้าวิ่ง Nike", trend: "+32%" },
  { label: "รองเท้าผู้หญิง", trend: "+18%" },
  { label: "รองเท้า Air Force", trend: "+11%" },
  { label: "รองเท้าออกกำลังกาย", trend: "-6%" }
];

const chartData: Record<Period, number[]> = {
  "7 วัน": [6500, 6360, 6460, 6240, 6320, 6150, 6200, 5980],
  "30 วัน": [6820, 6580, 6700, 6410, 6500, 6200, 6280, 5950],
  "2 เดือน": [7100, 6920, 6800, 6550, 6660, 6370, 6120, 5900],
  "3 เดือน": [7350, 7080, 6900, 6650, 6400, 6210, 6050, 5800]
};

function StatusBar() {
  return (
    <div className="status-bar" aria-hidden="true">
      <strong>9:41</strong>
      <span className="status-icons">▮▮▮ ︵ ▰</span>
    </div>
  );
}

function BottomNav({ active, go }: { active: string; go: (screen: Screen) => void }) {
  const items = [
    { key: "home", icon: "⌂", label: "หน้าหลัก", screen: "home" as Screen },
    { key: "interest", icon: "♡", label: "สนใจ", screen: "results" as Screen },
    { key: "savings", icon: "▥", label: "ประหยัด", screen: "history" as Screen },
    { key: "profile", icon: "♙", label: "โปรไฟล์", screen: "home" as Screen }
  ];
  return (
    <nav className="bottom-nav" aria-label="เมนูหลัก">
      {items.map((item) => (
        <button
          key={item.key}
          className={active === item.key ? "active" : ""}
          onClick={() => go(item.screen)}
          type="button"
        >
          <span className="nav-icon">{item.icon}</span>
          <span>{item.label}</span>
        </button>
      ))}
      <span className="home-indicator" />
    </nav>
  );
}

function SearchField({
  value,
  onChange,
  onSubmit,
  onFocus,
  compact = false
}: {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onFocus?: () => void;
  compact?: boolean;
}) {
  const submit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit();
  };
  return (
    <form className={`search-field ${compact ? "compact" : ""}`} onSubmit={submit}>
      <button className="search-orb" type="submit" aria-label="ค้นหา">
        ⌕
      </button>
      <input
        aria-label="ค้นหาสินค้า"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onFocus={onFocus}
        placeholder="ค้นหาสินค้า"
      />
      {value ? (
        <button className="clear-search" type="button" onClick={() => onChange("")} aria-label="ล้างคำค้น">
          ×
        </button>
      ) : (
        <span className="search-tools" aria-hidden="true">⌾ ♩</span>
      )}
    </form>
  );
}

function HeaderBack({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <header className="page-header">
      <button onClick={onBack} type="button" aria-label="ย้อนกลับ">←</button>
      <h1>{title}</h1>
      <span />
    </header>
  );
}

function HomeScreen({ go, query, setQuery }: { go: (s: Screen) => void; query: string; setQuery: (q: string) => void }) {
  return (
    <section className="screen home-screen">
      <StatusBar />
      <div className="top-search">
        <SearchField value={query} onChange={setQuery} onFocus={() => go("search")} onSubmit={() => go("results")} />
      </div>
      <button className="savings-hero" onClick={() => go("history")} type="button">
        <img src="/assets/home-savings.png" alt="ยอดประหยัดรวม 10,250 บาท" />
      </button>
      <main className="home-scroll">
        <h2>ค้นหาล่าสุด</h2>
        <div className="home-grid">
          <button onClick={() => go("results")} type="button"><img src="/assets/home-card-1.png" alt="Nike Air Force 1" /></button>
          <button onClick={() => go("results")} type="button"><img src="/assets/home-card-2.png" alt="Vans Old Skool" /></button>
        </div>
        <h2>สินค้าแนะนำ</h2>
        <div className="home-grid">
          <button onClick={() => go("results")} type="button"><img src="/assets/result-3.png" alt="Hoka Clifton" /></button>
          <button onClick={() => go("results")} type="button"><img src="/assets/result-4.png" alt="Womenager shoes" /></button>
        </div>
      </main>
      <BottomNav active="home" go={go} />
    </section>
  );
}

function SearchScreen({ go, query, setQuery }: { go: (s: Screen) => void; query: string; setQuery: (q: string) => void }) {
  const filtered = useMemo(
    () => suggestions.filter((item) => item.label.toLowerCase().includes(query.toLowerCase())),
    [query]
  );
  const submitSearch = () => {
    if (!query.trim()) setQuery("รองเท้าวิ่ง Nike");
    go("results");
  };
  return (
    <section className="screen search-screen">
      <StatusBar />
      <div className="top-search">
        <SearchField value={query} onChange={setQuery} onSubmit={submitSearch} />
      </div>
      <main className="suggestion-scroll">
        <h2>{query ? "คำค้นหาที่แนะนำ" : "สินค้าแนะนำ"}</h2>
        <div className="suggestion-list">
          {(query ? filtered : suggestions).map((item) => (
            <button key={item.label} onClick={() => { setQuery(item.label); go("results"); }} type="button">
              <span>{item.label}</span>
              <small className={item.trend.startsWith("-") ? "down" : ""}>⌁ นิยม {item.trend}</small>
            </button>
          ))}
          {query && filtered.length === 0 && (
            <div className="no-suggestion">
              <strong>ยังไม่พบคำค้นนี้</strong>
              <span>กด Enter เพื่อดูหน้าผลลัพธ์เปล่า</span>
            </div>
          )}
        </div>
        <h2 className="recent-title">ค้นหาล่าสุด</h2>
        <div className="recent-list">
          {[
            ["รองเท้าวิ่ง", "/assets/search-recent-1.png"],
            ["เลโก้", "/assets/search-recent-2.png"],
            ["หมวก", "/assets/search-recent-3.png"]
          ].map(([label, image]) => (
            <button key={label} onClick={() => { setQuery(label); go("results"); }} type="button">
              <span>{label}</span><img src={image} alt="" />
            </button>
          ))}
        </div>
      </main>
      <BottomNav active="" go={go} />
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
  go: (s: Screen) => void;
  query: string;
  setQuery: (q: string) => void;
  selected: number[];
  setSelected: (ids: number[]) => void;
}) {
  const [filters, setFilters] = useState(["ส่งฟรี"]);
  const [sortLow, setSortLow] = useState(false);
  const visibleProducts = useMemo(
    () => sortLow ? [...products].sort((a, b) => a.price - b.price) : products,
    [sortLow]
  );
  const toggleFilter = (filter: string) => {
    setFilters((current) => current.includes(filter) ? current.filter((item) => item !== filter) : [...current, filter]);
  };
  const toggleProduct = (id: number) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((item) => item !== id));
    } else if (selected.length < 3) {
      setSelected([...selected, id]);
    }
  };
  return (
    <section className="screen results-screen">
      <StatusBar />
      <div className="results-head">
        <div className="results-search-row">
          <SearchField value={query} onChange={setQuery} onSubmit={() => undefined} compact />
          <button className={`sort-button ${sortLow ? "on" : ""}`} onClick={() => setSortLow(!sortLow)} type="button" aria-label="เรียงราคา">≡</button>
        </div>
        <div className="chips">
          {["Mall", "ส่งฟรี", "ราคาถูก"].map((filter) => (
            <button key={filter} className={filters.includes(filter) ? "selected" : ""} onClick={() => toggleFilter(filter)} type="button">{filter}</button>
          ))}
        </div>
        <small>พบ {filters.length ? 989 - filters.length * 104 : 989} รายการ</small>
      </div>
      <main className="results-grid">
        {visibleProducts.map((product) => {
          const isSelected = selected.includes(product.id);
          return (
            <button
              className={`result-card ${isSelected ? "selected" : ""}`}
              key={product.id}
              onClick={() => toggleProduct(product.id)}
              type="button"
              aria-pressed={isSelected}
            >
              <img src={product.image} alt={`${product.name} ราคา ${product.price} บาท`} />
              <span className="selection-dot">{isSelected ? "✓" : "+"}</span>
            </button>
          );
        })}
      </main>
      <button
        className={`compare-fab ${selected.length >= 2 ? "ready" : ""}`}
        disabled={selected.length < 2}
        onClick={() => go("compare")}
        type="button"
      >
        {selected.length >= 2 ? `เปรียบเทียบ ${selected.length} รายการ` : "เลือกอย่างน้อย 2 รายการ"}
      </button>
      <BottomNav active="" go={go} />
    </section>
  );
}

function CompareScreen({ go, selected }: { go: (s: Screen) => void; selected: number[] }) {
  const count = Math.max(2, selected.length);
  return (
    <section className="screen compare-screen">
      <StatusBar />
      <HeaderBack title="ผลการเปรียบเทียบ" onBack={() => go("results")} />
      <main className="compare-list">
        {[0, 1, 2].slice(0, count).map((_, index) => (
          <button key={index} className={`compare-card ${index === 0 ? "winner" : ""}`} onClick={() => go("history")} type="button">
            <img src={`/assets/compare-${Math.min(index + 1, 3)}.png`} alt={`สินค้าที่เปรียบเทียบลำดับ ${index + 1}`} />
            {index === 0 && <span className="winner-pill">คุ้มที่สุด</span>}
          </button>
        ))}
      </main>
      <BottomNav active="" go={go} />
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
  const chartPoints = data.map((value, index) => {
    const x = 8 + (index / (data.length - 1)) * 304;
    const y = 90 - ((value - min) / Math.max(1, max - min)) * 56;
    return { x, y, value };
  });
  const points = chartPoints.map(({ x, y }) => `${x},${y}`).join(" ");
  const linePath = chartPoints.map(({ x, y }, index) => `${index ? "L" : "M"} ${x} ${y}`).join(" ");
  const areaPath = `${linePath} L 312 104 L 8 104 Z`;
  const selectedPoint = chartPoints[activeIndex ?? chartPoints.length - 1];
  const updateSelectedPoint = (event: PointerEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    if (!svg) return;
    const bounds = svg.getBoundingClientRect();
    const viewBoxX = ((event.clientX - bounds.left) / bounds.width) * 328;
    const nearest = chartPoints.reduce((best, point, index) => (
      Math.abs(point.x - viewBoxX) < Math.abs(chartPoints[best].x - viewBoxX) ? index : best
    ), 0);
    setActiveIndex(nearest);
  };
  const beginDrag = (event: PointerEvent<SVGSVGElement>) => {
    setDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
    updateSelectedPoint(event);
  };
  const endDrag = (event: PointerEvent<SVGSVGElement>) => {
    setDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };
  return (
    <div className="chart-wrap">
      <div className="chart-summary">
        <strong key={`${period}-${activeIndex ?? "latest"}`}>฿{selectedPoint.value.toLocaleString()}</strong>
        <span>-20%</span>
        <em>{activeIndex === null ? "ถูกสุดในรอบ 90 วัน" : `จุดที่ ${activeIndex + 1} จาก ${data.length}`}</em>
      </div>
      <svg
        ref={svgRef}
        className={dragging ? "is-dragging" : ""}
        viewBox="0 0 328 118"
        role="img"
        aria-label={`กราฟราคา ${period} ลากเพื่อดูราคาแต่ละช่วง`}
        onPointerDown={beginDrag}
        onPointerMove={(event) => {
          if (dragging || event.pointerType === "mouse") updateSelectedPoint(event);
        }}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerLeave={() => {
          if (!dragging) setActiveIndex(null);
        }}
      >
        <defs>
          <linearGradient id="priceFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ff9c82" stopOpacity=".45" />
            <stop offset="100%" stopColor="#fff" stopOpacity=".05" />
          </linearGradient>
          <clipPath id="chartReveal">
            <rect className="chart-reveal-clip" x="0" y="0" width="328" height="118" />
          </clipPath>
        </defs>
        <g clipPath="url(#chartReveal)">
          <path className="chart-area" d={areaPath} fill="url(#priceFill)" />
        </g>
        <path
          className="chart-line"
          d={linePath}
          pathLength="1"
          fill="none"
          stroke="#eb3b0c"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {activeIndex !== null && (
          <g className="chart-cursor">
            <line x1={selectedPoint.x} y1="18" x2={selectedPoint.x} y2="104" />
            <rect
              x={Math.min(252, Math.max(4, selectedPoint.x - 36))}
              y={Math.max(3, selectedPoint.y - 29)}
              width="72"
              height="23"
              rx="8"
            />
            <text
              x={Math.min(288, Math.max(40, selectedPoint.x))}
              y={Math.max(19, selectedPoint.y - 14)}
              textAnchor="middle"
            >
              ฿{selectedPoint.value.toLocaleString()}
            </text>
          </g>
        )}
        <circle
          className="chart-current-dot"
          cx={selectedPoint.x}
          cy={selectedPoint.y}
          r="7"
          fill="#eb3b0c"
          stroke="white"
          strokeWidth="2"
        />
        <polyline points={points} fill="none" stroke="transparent" strokeWidth="18" />
      </svg>
      <p className="chart-hint">แตะหรือลากบนกราฟเพื่อดูราคาแต่ละช่วง</p>
      <div className="chart-labels"><span>เม.ย.</span><span>พ.ค.</span><span>มิ.ย.</span><span>ก.ค.</span></div>
    </div>
  );
}

function HistoryScreen({ go }: { go: (s: Screen) => void }) {
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
      <HeaderBack title="ประวัติราคาล่าสุด" onBack={() => go("compare")} />
      <main className="history-content">
        <img className="history-product" src="/assets/history-product.png" alt="รองเท้ากีฬา Nike ราคา 5,800 บาท" />
        <div className="period-tabs" role="tablist" aria-label="ช่วงเวลา">
          {(Object.keys(chartData) as Period[]).map((item) => (
            <button key={item} className={period === item ? "active" : ""} onClick={() => setPeriod(item)} type="button" role="tab">{item}</button>
          ))}
        </div>
        <PriceChart key={period} period={period} />
        <div className="ai-card">
          <span>✦</span>
          <div>
            <strong>ราคาดีที่สุดในรอบ 90 วัน! ✨</strong>
            <p>ซื้อตอนนี้ประหยัดกว่าราคาเฉลี่ยถึง 350 บาท แนะนำให้ตัดสินใจซื้อเพื่อความคุ้มค่าสูงสุด</p>
          </div>
        </div>
        <div className="history-actions">
          <button className={favorite ? "favorited" : ""} onClick={() => { setFavorite(!favorite); flash(favorite ? "นำออกจากรายการโปรดแล้ว" : "บันทึกในรายการโปรดแล้ว"); }} type="button">
            {favorite ? "♥" : "♡"} รายการโปรด
          </button>
          <button onClick={() => flash("กำลังเปิดร้านค้าที่ราคาดีที่สุด")} type="button">▣ ซื้อเลย</button>
        </div>
      </main>
      {toast && <div className="toast" role="status">{toast}</div>}
      <BottomNav active="savings" go={go} />
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
        {screen === "results" && <ResultsScreen go={go} query={query || "รองเท้าวิ่ง Nike"} setQuery={setQuery} selected={selected} setSelected={setSelected} />}
        {screen === "compare" && <CompareScreen go={go} selected={selected} />}
        {screen === "history" && <HistoryScreen go={go} />}
      </div>
      <aside className="demo-note">
        <span>FUNCTIONAL PROTOTYPE</span>
        <h2>Best Choice</h2>
        <p>ลองพิมพ์ค้นหา เลือกสินค้า 2–3 รายการ แล้วเปิดดูกราฟประวัติราคา</p>
        <button onClick={() => { setScreen("home"); setQuery(""); setSelected([]); }} type="button">เริ่ม Demo ใหม่</button>
      </aside>
    </main>
  );
}
