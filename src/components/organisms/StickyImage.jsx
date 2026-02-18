import { useEffect, useState } from "react";

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

const StickyImage = ({ src, alt = "Product Image", className = "" }) => {
  const [loaded, setLoaded] = useState(true);
  const url = normalizeImage(src) || "/images/logoCutBackground2.png";

  // useEffect(() => {
  //   setLoaded(false);
  // }, [url]);

  return (
    <div className={`w-full ${className} lg:sticky lg:top-20 self-start`}>
      <div className="w-full flex items-center justify-center">
        {!loaded && (
          <div
            aria-hidden="true"
            className="w-full rounded-xl bg-gray-100 animate-pulse"
            style={{
              height: "min(65vh, 80vw)",
              maxHeight: "80vh",
            }}
          />
        )}

        <img
          src={url}
          alt={alt}
          role="img"
          aria-label={alt}
          loading="lazy"
          decoding="async"
          className={`w-auto h-auto object-contain rounded-xl shadow-lg transition-opacity duration-300 ${
            loaded ? "opacity-100 block" : "opacity-0 hidden"
          }`}
          onLoad={() => setLoaded(true)}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "/images/logoCutBackground2.png";
            setLoaded(true);
          }}
          style={{
            maxHeight: "75vh",
          }}
        />
      </div>
    </div>
  );
};

export default StickyImage;
