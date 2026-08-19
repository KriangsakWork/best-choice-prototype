export type ResultPlatform = "Shopee" | "Lazada" | "TikTok";

export type ResultCardData = {
  id: number;
  productName: string;
  imageUrl: string;
  mainPlatform: ResultPlatform;
  otherPlatforms?: ResultPlatform[];
  price: number;
  originalPrice: number;
  rating: number;
  savings: number;
  storeCount: number;
};

const PLATFORM_ORDER: ResultPlatform[] = ["Shopee", "Lazada", "TikTok"];

const platformMeta: Record<ResultPlatform, { mark: string; label: string }> = {
  Shopee: { mark: "/assets/product-card/shopee-mark.svg", label: "Shopee" },
  Lazada: { mark: "/assets/product-card/lazada-mark.svg", label: "Lazada" },
  TikTok: { mark: "/assets/product-card/tiktok-mark.svg", label: "TikTok" }
};

function formatBaht(value: number) {
  return `฿${value.toLocaleString("en-US")}`;
}

export function ResultCard({
  product,
  favorite = false,
  onFavoriteToggle,
  onOpen
}: {
  product: ResultCardData;
  favorite?: boolean;
  onFavoriteToggle?: () => void;
  onOpen?: () => void;
}) {
  const otherPlatforms = product.otherPlatforms
    ?? PLATFORM_ORDER.filter((platform) => platform !== product.mainPlatform);

  return (
    <article className="result-card">
      <div
        className="result-card__body"
        role="button"
        tabIndex={0}
        onClick={onOpen}
        onKeyDown={(event) => {
          if (event.key !== "Enter" && event.key !== " ") return;
          event.preventDefault();
          onOpen?.();
        }}
        aria-label={`${product.productName} ${formatBaht(product.price)} ดูราคาทั้งหมด`}
      >
        <div className="result-card__media">
          <img src={product.imageUrl} alt={product.productName} referrerPolicy="no-referrer" />
        </div>

        <div className="result-card__info">
          <h3>{product.productName}</h3>

          <div className="result-card__tags">
            <span className="result-card__score">
              <img src="/assets/product-card/star.svg" alt="" width={11} height={11} aria-hidden="true" />
              {product.rating}
            </span>

            <span className="result-card__platform result-card__platform--label" data-platform={product.mainPlatform}>
              <img src={platformMeta[product.mainPlatform].mark} alt="" width={10} height={10} />
              <span>{platformMeta[product.mainPlatform].label}</span>
            </span>

            {otherPlatforms.map((platform) => (
              <span key={platform} className="result-card__platform result-card__platform--icon" data-platform={platform} aria-label={platform}>
                <img src={platformMeta[platform].mark} alt="" width={10} height={10} />
              </span>
            ))}
          </div>

          <div className="result-card__price">
            <strong>{formatBaht(product.price)}</strong>
            <del>{formatBaht(product.originalPrice)}</del>
          </div>

          <p className="result-card__savings">
            <span className="result-card__save">ประหยัด {formatBaht(product.savings)}</span>
            {` · เทียบ ${product.storeCount} ร้าน`}
          </p>

          <div className="result-card__divider" />

          <span className="result-card__cta">ดูราคาทั้งหมด ›</span>
        </div>
      </div>

      {onFavoriteToggle && (
        <button
          className="result-card__heart"
          type="button"
          aria-label={favorite ? "นำออกจากรายการสนใจ" : "เพิ่มในรายการสนใจ"}
          aria-pressed={favorite}
          onClick={(event) => {
            event.stopPropagation();
            onFavoriteToggle();
          }}
        >
          <img
            src={favorite ? "/assets/SVG/Like/Property 1=Like.svg" : "/assets/SVG/Like/Property 1=Normal.svg"}
            alt=""
            width={17.44}
            height={16}
          />
        </button>
      )}
    </article>
  );
}
