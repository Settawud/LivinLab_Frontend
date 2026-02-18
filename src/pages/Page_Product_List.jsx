import { useState, useEffect, useContext } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../lib/api";

import Container from "../components/layout/Container";
import Navbar from "../components/organisms/Navbar";
import ProductFilterSortTags from "../components/organisms/ProductFilterSortTags";
import ProductGridList from "../components/organisms/ProductGridList";
import { ValueContext } from "../context/ValueContext";
import AddToCartModal from "../components/organisms/AddToCartModal";

const Page_Product_List = () => {
  const [filters, setFilters] = useState({
    category: null,
    price: null,
    availability: null,
  });

  const { isModalOpen, setIsModalOpen, product } = useContext(ValueContext);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();

  const [page, setPage] = useState(1);
  const [hydrated, setHydrated] = useState(false);
  const [totalPages, setTotalPages] = useState(1);

  const [sort, setSort] = useState("New In");

  const handleFiltersChange = (updater) => {
    setPage(1);
    setFilters(updater);
  };

  const handleSortChange = (updater) => {
    setPage(1);
    setSort(updater);
  }
  const search = searchParams.get("search") || "";

  const normalizeCategoryToBackend = (val) => {
    const s = String(val || "").trim().toLowerCase();
    if (!s) return null;
    const base = s.split("(")[0].trim();
    const dict = new Map([
      ["chairs", "Chairs"],
      ["chair", "Chairs"],
      ["เก้าอี้", "Chairs"],
      ["โต๊ะ", "Tables"],
      ["tables", "Tables"],
      ["table", "Tables"],
      ["desk", "Tables"],
      ["desks", "Tables"],
      ["standing desk", "Tables"],
      ["standing desks", "Tables"],
      ["accessories", "Accessories"],
      ["accessory", "Accessories"],
      ["อุปกรณ์เสริม", "Accessories"],
      ["อุปกรณ์", "Accessories"],
    ]);
    return dict.get(base) || null;
  };

  const displayLabelFromBackend = (eng) => {
    const map = { Chairs: "Chairs", Tables: "Tables", Accessories: "Accessories" };
    return map[eng] || eng;
  };

  useEffect(() => {
    const cat = searchParams.get("category");
    const normalized = normalizeCategoryToBackend(cat);
    const label = displayLabelFromBackend(normalized || cat);

    if (cat && filters.category !== label) {
      setFilters((prev) => ({ ...prev, category: label }));
    }

    if (!cat && filters.category) {
      setFilters((prev) => ({ ...prev, category: null }));
    }

    setHydrated(true);
  }, [searchParams]);

  const getSortQuery = (sortValue) => {
    if (sortValue === "Price High to Low") return "variants.price:desc";
    if (sortValue === "Price Low to High") return "variants.price:asc";
    if (sortValue === "New In") return "createdAt:desc";
    return null;
  };

  useEffect(() => {
    if (!hydrated) return;

    const fetchProducts = async () => {
      setLoading(true);
      setError("");
      const query = { page };

      if (filters.category) {
        const eng = normalizeCategoryToBackend(filters.category);
        if (eng) query.category = eng;
      }

      if (filters.availability === "In Stock") {
        query.availability = "instock";
      }

      if (filters.price) {
        query.minPrice = filters.price[0];
        query.maxPrice = filters.price[1];
      }

      const sortQuery = getSortQuery(sort);
      if (sortQuery) {
        query.sort = sortQuery;
      }

      if (search.trim()) {
        query.search = search.trim();
      }

      const current = new URLSearchParams(searchParams);
      const urlParams = { ...query };

      if (filters.category) {
        urlParams.category = filters.category;
      } else {
        current.delete("category");
      }

      Object.entries(urlParams).forEach(([k, v]) => current.set(k, String(v)));
      const nextStr = current.toString();
      if (nextStr !== searchParams.toString()) {
        setSearchParams(current);
      }

      try {
        const { data } = await api.get("/products", { params: query });
        const items = Array.isArray(data?.items) ? data.items : [];

        const withPrice = items.map((p) => ({
          ...p,
          __minPrice: Array.isArray(p.variants) && p.variants.length
            ? Math.min(...p.variants.map((v) => Number(v.price || 0)))
            : 0,
        }));

        setProducts(withPrice);
        setTotalPages(Math.ceil((data.total || 0) / 9));
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(err?.response?.data?.message || err?.message || "Failed to load products");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    }, [filters, sort, page, search, hydrated]);

    const mappedProducts = products.map((product) => {
    const thumb = Array.isArray(product?.thumbnails) ? product.thumbnails[0] : null;
    const thumbUrl = typeof thumb === "string" ? thumb : thumb?.url;
    const variantWithImage = Array.isArray(product?.variants)
      ? product.variants.find((v) => v?.image && (typeof v.image === "string" ? v.image : v.image.url))
      : null;
    const variantUrl = variantWithImage
      ? (typeof variantWithImage.image === "string" ? variantWithImage.image : variantWithImage.image?.url)
      : null;
    const imageSrc = thumbUrl || variantUrl || "/images/logoCutBackground2.png";

    const d = product?.dimension || {};
    const safeSize = [d.width, d.height, d.depth].every((n) => Number.isFinite(n))
      ? `${d.width}x${d.height}x${d.depth} cm`
      : "";

    const variantsNotTrial = Array.isArray(product?.variants)
      ? product.variants.filter((v) => v.trial === false)
      : [];
    const priceNum = variantsNotTrial.length
      ? Math.min(...variantsNotTrial.map((v) => Number(v.price || 0)))
      : 0;

    const trial = !!(product?.trial || (Array.isArray(product?.variants) && product.variants.some((v) => !!v.trial)));

    return {
      _id: product._id,
      imageSrc,
      title: product.name,
      tag: Array.isArray(product.tags) ? product.tags : [],
      size: safeSize,
      price: priceNum ? priceNum.toLocaleString() : "-",
      material: product.material,
      trial,
      variants: product.variants
    };
  });

  useEffect(() => {
    setPage(1);
  }, [filters.category]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page, filters]);

  return (
    <div className="bg-[#fefdf9]">
      <Navbar />
      <Container className="min-h-screen py-10">
        <ProductFilterSortTags
          filters={filters}
          setFilters={handleFiltersChange}
          sort={sort}
          setSort={handleSortChange}
        />
        {loading ? (
          <div className="py-20 text-center text-stone-600">Loading products…</div>
        ) : error ? (
          <div className="py-10 text-center text-red-600">{error}</div>
        ) : mappedProducts.length === 0 ? (
          <div className="py-20 text-center text-stone-500">No products found.</div>
        ) : (
          <ProductGridList
            products={mappedProducts}
            page={page}
            setPage={setPage}
            totalPages={totalPages}
          />
        )}
      </Container>

      <div>
        {isModalOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setIsModalOpen(false)}
          >
            <div
              className="bg-yellow-100 border-4 border-black rounded-2xl shadow-[8px_8px_0_0_#000] p-8 w-full max-w-lg relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-black bg-white border-black border-1 rounded-3xl w-8 h-8 flex items-center justify-center hover:bg-pink-200 transition"
              >
                ✖
              </button>
              <AddToCartModal product={mappedProducts.find(item => item._id === product)} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page_Product_List;
