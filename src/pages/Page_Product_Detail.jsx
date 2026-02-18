import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../lib/api";

import StickyImage from "../components/organisms/StickyImage";
import ProductContent from "../components/organisms/ProductContent";
import ScrollableThumbnails from "../components/organisms/ScrollableThumbnails";
import UsersReviewSection from "../components/organisms/UsersReviewSection";
import Navbar from "../components/organisms/Navbar";

const Page_Product_Detail = () => {
  const { id } = useParams();

  const [productData, setProductData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedImage, setSelectedImage] = useState(null);

  const [images, setImages] = useState([]);

  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewsError, setReviewsError] = useState(null);

  const handleVariantChange = (variantId) => {
    const foundVariant = productData?.variants?.find(v => v._id === variantId);
    if (foundVariant?.image) {
      setSelectedImage(foundVariant.image);
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        const data = res.data.item;

        const variantsArr = Array.isArray(data?.variants) ? data.variants : [];

        const uniqueColorIds = Array.from(
          new Set(variantsArr.map((v) => String(v?.colorId ?? "")).filter(Boolean))
        );

        const colorResponses = await Promise.all(
          uniqueColorIds.map((colorId) =>
            api
              .get(`/colors/${colorId}`)
              .then((r) => ({ id: colorId, hex: r.data?.item?.hex || "#D3D3D3" }))
              .catch(() => ({ id: colorId, hex: "#D3D3D3" }))
          )
        );

        const colorMap = colorResponses.reduce((acc, color) => {
          acc[color.id] = color.hex;
          return acc;
        }, {});

        const mappedProducts = {
          _id: data._id,
          Name: data.name,
          Description: data.description,
          tag: data.tags || [],
          material: data.material,
          variants: variantsArr.map((v) => ({
            _id: v._id,
            trial: v.trial,
            colorId: v.colorId,
            color: colorMap[String(v.colorId)] || v.color || "#D3D3D3",
            price: v.price,
            quantityInStock: v.quantityInStock,
            dimensions: data.dimension,
            image: typeof v.image === "string" ? v.image : v.image?.url || null,
          })),
        };

        const firstThumb = Array.isArray(data?.thumbnails) && data.thumbnails.length
          ? (typeof data.thumbnails[0] === "string" ? data.thumbnails[0] : data.thumbnails[0]?.url)
          : null;

        const uniqueColorVariants = variantsArr.reduce((acc, current) => {
          const idStr = String(current?.colorId ?? "");
          if (!idStr) return acc;
          if (!acc.some((v) => String(v?.colorId ?? "") === idStr)) {
            acc.push(current);
          }
          return acc;
        }, []);

        const variantImages = uniqueColorVariants
          .map((v) => (typeof v.image === "string" ? v.image : v.image?.url))
          .filter(Boolean);

        const thumbnailsToShow = variantImages.length > 0 ? variantImages : (firstThumb ? [firstThumb] : []);

        setProductData({
          ...mappedProducts,
          image: firstThumb,
        });

        setImages(thumbnailsToShow);

        const defaultSelected = firstThumb || thumbnailsToShow[0] || null;
        setSelectedImage(defaultSelected);
      } catch (err) {
        console.error("Error fetching product:", err);
        setProductData(null);
        setImages([]);
        setSelectedImage(null);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchReviews = async () => {
      try {
        setReviewsLoading(true);
        setReviewsError(null);

        const res = await api.get(`/reviews/product/${id}`);
        const reviewItems = Array.isArray(res.data?.items)
          ? res.data.items
          : Array.isArray(res.data)
          ? res.data
          : [];

        setReviews(reviewItems);
      } catch (err) {
        console.error("Error fetching reviews:", err);
        setReviewsError("ไม่สามารถโหลดรีวิวได้");
        setReviews([]);
      } finally {
        setReviewsLoading(false);
      }
    };

    fetchProduct();
    fetchReviews();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="text-xl">Loading product...</span>
      </div>
    );
  }

  if (!productData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="text-xl">ไม่พบข้อมูลสินค้า</span>
      </div>
    );
  }

  return (
    <div className="bg-[#fefdf9]">
      <Navbar />
      <div className="flex flex-col lg:flex-row gap-10 mx-auto px-4 py-10">
        <div className="w-full lg:w-2/3 flex flex-row gap-5">
          <ScrollableThumbnails
            images={images}
            setSelectedImage={setSelectedImage}
            selectedImage={selectedImage}
          />
          <StickyImage src={selectedImage} />
        </div>
        <div className="w-full lg:w-1/3">
          <ProductContent product={productData} onVariantChange={handleVariantChange} />
        </div>
      </div>

      {reviewsLoading && (
        <p className="text-center py-4 text-gray-500">Loading reviews...</p>
      )}
      {reviewsError && (
        <p className="text-center py-4 text-red-500">{reviewsError}</p>
      )}

      {!reviewsLoading && !reviewsError && (
        <UsersReviewSection reviews={reviews} />
      )}
    </div>
  );
};

export default Page_Product_Detail;
