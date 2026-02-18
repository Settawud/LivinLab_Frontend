import { useEffect, useMemo, useRef } from "react";

function normalizeImage(img) {
  if (!img) return null;
  if (typeof img === "object" && img.url) return img.url;
  const s = String(img);
  if (/^(https?:|data:|blob:)/i.test(s)) return s;
  let cleaned = s.replace(/^\.\/+/, "");
  if (cleaned.startsWith("/images/")) return cleaned;
  if (cleaned.startsWith("images/")) return "/" + cleaned;
  const idx = cleaned.indexOf("images/");
  if (idx >= 0) return "/" + cleaned.slice(idx);
  return `/images/${cleaned.split("/").pop()}`;
}

const ScrollableThumbnails = ({
  images = [],
  setSelectedImage = () => {},
  selectedImage = null,
  horizontal = false,
  className = "",
}) => {
  const list = useMemo(() => {
    const seen = new Set();
    return (Array.isArray(images) ? images : [])
      .map(normalizeImage)
      .filter(Boolean)
      .filter((url) => {
        if (seen.has(url)) return false;
        seen.add(url);
        return true;
      });
  }, [images]);

  if (list.length === 0) return null;

  const normalizedSelectedImage = normalizeImage(selectedImage);

  const itemRefs = useRef({});

  useEffect(() => {
    if (!normalizedSelectedImage) return;
    const el = itemRefs.current[normalizedSelectedImage];
    if (el && typeof el.scrollIntoView === "function") {
      el.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
    }
  }, [normalizedSelectedImage]);

  const deriveAlt = (url, index) => {
    try {
      const parts = url.split("/");
      const filename = parts[parts.length - 1] || `image-${index + 1}`;
      return `Thumbnail ${index + 1} — ${filename}`;
    } catch {
      return `Thumbnail ${index + 1}`;
    }
  };

  return (
    <div
      className={`${className} ${
        horizontal
          ? "flex gap-3 overflow-x-auto py-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200"
          : "flex flex-col overflow-y-auto lg:w-28 w-20 h-[70vh] lg:h-[75vh] sticky top-20 self-start p-1"
      }`}
      role="list"
      aria-label="Product thumbnails"
    >
      {list.map((src, idx) => {
        const isActive = src === normalizedSelectedImage;
        const btnClassBase =
          "rounded-md flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-1 transition-all";
        const sizeClasses = horizontal
          ? "w-24 h-24 flex-shrink-0"
          : "w-16 h-16 mb-4 lg:w-20 lg:h-20";
        const borderClass = isActive
          ? "ring-2 ring-black border-0 shadow-md scale-105"
          : "border border-gray-300 hover:border-black";

        return (
          <button
            key={src}
            ref={(el) => (itemRefs.current[src] = el)}
            type="button"
            role="listitem"
            aria-pressed={isActive}
            title={`Thumbnail ${idx + 1}`}
            onClick={() => setSelectedImage(src)}
            className={`${btnClassBase} ${sizeClasses} ${borderClass}`}
            style={{ background: "transparent" }}
          >
            <img
              src={src}
              alt={deriveAlt(src, idx)}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover rounded-md"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "/images/logoCutBackground2.png";
              }}
            />
          </button>
        );
      })}
    </div>
  );
};

export default ScrollableThumbnails;
