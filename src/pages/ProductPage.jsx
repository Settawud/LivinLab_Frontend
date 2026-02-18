import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/organisms/Navbar";
import Footer from "../components/organisms/Footer";
import { api, patchForm, postForm, putForm } from "../lib/api";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { extractPublicId } from 'cloudinary-build-url'

export const ProductPage = () => {
    const navigate = useNavigate();
    const { id: editProductId } = useParams(); // Get productId from URL params
  const isEditing = !!editProductId; // Determine if it's an edit operation
  
    // --- Role-based Access Control ---
    useEffect(() => {
        try {
            const rawUser = localStorage.getItem("user");
            if (!rawUser) throw new Error("Not logged in");
            const user = JSON.parse(rawUser);
            if (user?.role !== "admin") {
                toast.error("You do not have permission to access this page.");
                navigate("/"); // Redirect to home for non-admins
            }
        } catch (e) {
            toast.error("Authentication error. Please log in.");
            navigate("/login");
        }
    }, [navigate]);

    const [colors, setColors] = useState([]);
    const [addColorOpen, setAddColorOpen] = useState(null); // variant index or null
    const [newColor, setNewColor] = useState({ name_th: "", name_en: "", hex: "" });
    const [savingColor, setSavingColor] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        category: "",
        tags: "",
        material: "",
        trial: false,
        thumbnails: [],
        dimension: {
            width: "",
            height: "",
            depth: "",
            weight: "",
        },
        variants: [
            {
                colorId: "",
                price: "",
                quantityInStock: "",
                trial: false,
                image: null,
            },
        ],
    });

    const [initialThumbnails, setInitialThumbnails] = useState([]);

    const fetchProductData = useCallback(async () => {
        if (!editProductId) return; // Only fetch if we have a productId
        try {
            const productId = editProductId
            const { data } = await api.get(`/products/${productId}`); // Assuming your API endpoint for single product is /products/:id
            // Format data to match the form state structure
            const formattedData = {
                name: data.item.name,
                description: data.item.description,
                category: data.item.category,
                tags: data.item.tags.join(", "), // Join tags back into a string
                material: data.item.material,
                trial: data.item.trial,
                thumbnails: data.item.thumbnails.map(thumb => thumb.url),
                thumbnailsPublicId: data.item.thumbnails.map(thumb => thumb.publicId),// Will be handled separately if needed, or assume API returns URLs
                dimension: {
                    width: data.item.dimension?.width || "",
                    height: data.item.dimension?.height || "",
                    depth: data.item.dimension?.depth || "",
                    weight: data.item.dimension?.weight || "",
                },
                variants: data.item.variants.map((v) => ({
                    _id: v._id, // Keep variant ID for potential updates
                    colorId: v.colorId,
                    price: v.price,
                    quantityInStock: v.quantityInStock,
                    trial: v.trial,
                    image: v.image.url,
                })),
            };

            setInitialThumbnails(formattedData.thumbnailsPublicId)
            setFormData(formattedData);

        } catch (err) {
            const status = err?.response?.status;
            const msg = err?.response?.data?.message || err?.message || "Failed to fetch product data";
            toast.error(`Failed to load product: ${msg}`);
            if (status === 404) {
                alert("Product not found")
                console.error("404 not found :", err)
                navigate("/products"); // Redirect if product not found
            }
        }
    }, [editProductId, navigate]);

    useEffect(() => {
        fetchProductData();
    }, [fetchProductData]);

    // --- Load colors for dropdown ---
    useEffect(() => {
        (async () => {
            try {
                const { data } = await api.get("/colors");
                // Accept { items: [...] } or direct array fallback
                const items = Array.isArray(data) ? data : (data?.items || []);
                setColors(items);
            } catch (e) {
                console.warn("Failed to load colors", e);
            }
        })();
    }, []);

    // --- Field Handlers ---
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const openAddColor = (variantIndex) => {
        setAddColorOpen(variantIndex);
        setNewColor({ name_th: "", name_en: "", hex: "" });
    };

    const cancelAddColor = () => {
        setAddColorOpen(null);
    };

    const saveNewColor = async (variantIndex) => {
        try {
            const hexOk = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(String(newColor.hex || "").trim());
            if (!newColor.name_th && !newColor.name_en) {
                alert("Please enter at least one name (TH or EN)");
                return;
            }
            if (!hexOk) {
                alert("Invalid color hex (e.g., #FF0000)");
                return;
            }
            setSavingColor(true);
            const resp = await api.post("/colors", {
                name_th: newColor.name_th,
                name_en: newColor.name_en,
                hex: String(newColor.hex || "").trim(),
            });
            const item = resp?.data?.item || resp?.data?.color || resp?.data;
            if (!item?._id) {
                alert("Failed to create color");
                setSavingColor(false);
                return;
            }
            setColors((prev) => [...prev, item]);
            const newVariants = [...formData.variants];
            newVariants[variantIndex].colorId = item._id;
            setFormData({ ...formData, variants: newVariants });
            setAddColorOpen(null);
        } catch (e) {
            console.error("Failed to add color", e);
            alert("Failed to add color. You may need admin permissions.");
        } finally {
            setSavingColor(false);
        }
    };

    const handleDimensionChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            dimension: { ...formData.dimension, [name]: value },
        });
    };

    const handleThumbnailChange = (e) => {
        const picked = Array.from(e.target.files || []);
        if (!picked.length) return;
        setFormData({ ...formData, thumbnails: [...formData.thumbnails, ...picked] });
        e.target.value = "";
    };

    const removeThumbnail = (index) => {
        const next = formData.thumbnails.filter((_, i) => i !== index);
        setFormData({ ...formData, thumbnails: next });
    };

    const handleVariantChange = (e, index) => {
        const { name, value, type, checked } = e.target;
        
        let newVariants = [...formData.variants];
        const currentVariant = newVariants[index];

        // Store the original colorId before the change is applied
        const originalColorId = currentVariant.colorId;

        // Apply the change to the newVariants array
        currentVariant[name] = type === "checkbox" ? checked : type === "number" ? Number(value) : value;

        // NEW LOGIC: Check if the color of a standard product has been changed
        if (name === "colorId" && !currentVariant.trial) {
            // Count how many variants with the originalColorId still exist
            const variantsWithOriginalColor = newVariants.filter(
                (v, i) => v.colorId === originalColorId
            );

            // If there's only one remaining variant of that color,
            // and it is a trial product, we should remove it.
            if (variantsWithOriginalColor.length === 1 && variantsWithOriginalColor[0].trial) {
                const trialVariantIndex = newVariants.findIndex(
                    v => v.colorId === originalColorId && v.trial
                );
                if (trialVariantIndex !== -1) {
                    newVariants = newVariants.filter((_, i) => i !== trialVariantIndex);
                }
            }
        }
        
        setFormData({ ...formData, variants: newVariants });
    };

    const handleVariantImageChange = (e, index) => {
        const file = e.target.files[0] || null;
        const newVariants = [...formData.variants];
        newVariants[index].image = file;
        setFormData({ ...formData, variants: newVariants });
    };

    const handleAddVariant = () => {
        setFormData({
            ...formData,
            variants: [
                ...formData.variants,
                {
                    colorId: "",
                    price: "",
                    quantityInStock: "",
                    trial: false,
                    image: null,
                },
            ],
        });
    };

    // --- NEW: Trial Product Logic ---
    const handleAddTrialVariant = (baseVariant) => {
        const originalPrice = Number(baseVariant.price || 0);
        // Calculate 10% of the original price, ensuring it's not less than 0.01 if original price is very small
        const trialPrice = originalPrice > 0 ? Math.max(originalPrice * 0.10, 0.01) : 0.01;

        const newTrialVariant = {
            ...baseVariant,
            trial: true,
            colorId: baseVariant.colorId, // Keep the original color ID
            price: trialPrice.toFixed(2), // Set to 10% of the price, formatted to 2 decimal places
            quantityInStock: "", // Trial products typically don't have stock managed this way
            image: null, // Reset image for trial variant
        };

        setFormData(prevData => ({
            ...prevData,
            variants: [...prevData.variants, newTrialVariant]
        }));
    };

    const hasTrialVariant = (colorId) => {
        // Check if a trial variant with the same colorId already exists
        return formData.variants.some(v => v.colorId === colorId && v.trial);
    };

    const handleRemoveVariant = (index) => {
        const updatedVariants = formData.variants.filter((_, i) => i !== index);
        setFormData({
            ...formData,
            variants: updatedVariants,
        });
    };

    // --- Submit Handler ---
    const handleSubmit = async (e) => {
        e.preventDefault();

        const allVariantsHaveImages = formData.variants.every(v => v.image !== null && v.image !== "")

        if (!formData.thumbnails.length || !allVariantsHaveImages) {
            toast.error("Please upload images for all variants and thumbnails.");
            setSubmitting(false); // Stop submission
            return;
        }

        try {
            setSubmitting(true);
            const tags = String(formData.tags || "")
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean);

            const dimension = {
                width: Number(formData.dimension.width || 0),
                height: Number(formData.dimension.height || 0),
                depth: Number(formData.dimension.depth || 0),
                weight: Number(formData.dimension.weight || 0),
            };

            const variants = formData.variants.map((v) => ({
                ...(v._id && { _id: v._id }),
                colorId: v.colorId,
                price: Number(v.price || 0),
                quantityInStock: Number(v.quantityInStock || 0),
                trial: !!v.trial,
            }));

            if (!variants.length) {
                alert("At least one variant is required");
                return;
            }
            if (variants.some((v) => !v.colorId)) {
                alert("Please select a color for every variant");
                return;
            }

            const payload = {
                name: formData.name,
                description: formData.description,
                category: formData.category,
                trial: !!formData.trial,
                tags,
                material: formData.material,
                dimension,
                variants,
            };

            let productId = isEditing ? editProductId : null
            const productRes = isEditing ? await api.patch(`/products/${productId}`, payload) : await api.post("/products", payload);
            productId = productRes?.data?.item?._id;
            const createdVariants = productRes?.data?.item?.variants || [];
            if (!productId) throw new Error("Missing productId in response");

            if (formData.thumbnails.length > 0) {
                const thumbnailFormData = new FormData();
                const publicIdsToKeep = [];

                formData.thumbnails.forEach(fileOrUrl => {
                    if (fileOrUrl instanceof File) {
                        thumbnailFormData.append("images", fileOrUrl);
                    } else if (typeof fileOrUrl === 'string') {
                        const publicId = extractPublicId(fileOrUrl);
                        if (publicId) {
                            publicIdsToKeep.push(publicId);
                        }
                    }
                });

                thumbnailFormData.append("currentPublicIds", JSON.stringify(publicIdsToKeep));

                try {
                    await patchForm(`/products/${productId}/images`, thumbnailFormData);
                } catch (err) {
                    const status = err?.response?.status;
                    const msg = err?.response?.data?.message || err?.message || "Upload failed";
                    console.warn("Thumbnail update failed:", status, msg);
                    toast.error(`Some images failed to update: ${msg}`);
                }
            }

            for (let i = 0; i < formData.variants.length; i++) {
                try {
                    const fileOrUrl = formData.variants[i]?.image;
                    const variantId = createdVariants[i]?._id;

                    if (!variantId) {
                        continue;
                    }
                    if (fileOrUrl instanceof File) {
                        const fd = new FormData();
                        fd.append("image", fileOrUrl);
                        await putForm(`/products/${productId}/variants/${variantId}/images`, fd);
                    }
                } catch (err) {
                    const status = err?.response?.status;
                    const msg = err?.response?.data?.message || err?.message || "Upload failed";
                    console.warn("Variant image upload failed:", status, msg);
                }
            }

            try { toast.success("Product saved successfully"); } catch {}
            setSubmitting(false);
            handleCancel();
        } catch (err) {
            const status = err?.response?.status;
            const msg = err?.response?.data?.message || err?.message || "Failed to save product";
            console.error("Error saving product:", status, msg, err?.response?.data);
            if (status === 401) {
                alert("Unauthorized. Please sign in.");
            } else if (status === 403) {
                alert("Forbidden. Admin role required.");
            } else {
                alert(`Failed to save product: ${msg}`);
            }
        } finally {
            setSubmitting(false);
        }
    };

    const handleCancel = () => {
        navigate('/adminproductmanagement')
    };

    const tooltipRef = useRef(null);
    const [tooltipVisible, setTooltipVisible] = useState(false);
    const [tooltipText, setTooltipText] = useState("");
    const showTooltip = (text, e) => {
        setTooltipText(text);
        setTooltipVisible(true);
    };
    const hideTooltip = () => {
        setTooltipVisible(false);
    };

    return (
        <div className="min-h-screen flex flex-col overflow-x-hidden">
            <Navbar />
            <main className="flex-1">
                <div className="py-10 px-4">
                    <div className="max-w-4xl mx-auto w-full">
                        <form onSubmit={handleSubmit} className="space-y-8 w-full">
                            {/* Product Info */}
                            <div className="space-y-6">
                                {/* Product Name */}
                                <div className="grid grid-cols-1 gap-6">
                                    <div>
                                        <label className="block text-gray-700 font-medium mb-2">Product Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border rounded-xl"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">Description</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        rows="4"
                                        className="w-full px-4 py-3 border rounded-xl"
                                        required
                                    ></textarea>
                                </div>

                                {/* Category / Tags / Material */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <div>
                                        <label className="block text-gray-700 font-medium mb-2">Category</label>
                                        <select
                                            name="category"
                                            value={formData.category}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border rounded-xl"
                                            required
                                        >
                                            <option value="" disabled>Select category</option>
                                            <option value="Chairs">Chairs</option>
                                            <option value="Tables">Tables</option>
                                            <option value="Accessories">Accessories</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 font-medium mb-2">Tags</label>
                                        <input
                                            type="text"
                                            name="tags"
                                            value={formData.tags}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border rounded-xl"
                                            placeholder="e.g., mouse pad, wrist rest"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 font-medium mb-2">Material</label>
                                        <input
                                            type="text"
                                            name="material"
                                            value={formData.material}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border rounded-xl"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Trial Checkbox */}
                                <div className="flex items-center space-x-2 mt-4">
                                    <input
                                        type="checkbox"
                                        name="trial"
                                        checked={formData.trial}
                                        onChange={handleChange}
                                        className="h-4 w-4"
                                    />
                                    <label className="text-gray-700">Trial product</label>
                                </div>

                                {/* Dimensions (dimension) */}
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">Dimensions</label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                                        {["width", "height", "depth", "weight"].map((key) => (
                                            <div key={key}>
                                                <label className="block text-gray-700 text-sm mb-1">
                                                    {key === 'width' ? 'Width (cm)' : key === 'height' ? 'Height (cm)' : key === 'depth' ? 'Depth (cm)' : 'Weight (kg)'}
                                                </label>
                                                <input
                                                    type="number"
                                                    name={key}
                                                    value={formData.dimension[key]}
                                                    onChange={handleDimensionChange}
                                                    className="w-full px-4 py-3 border rounded-xl"
                                                    min="0"
                                                    required/>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Thumbnails Upload */}
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">
                                        Upload main images (multiple allowed)
                                    </label>
                                    <input
                                        type="file"
                                        id="thumbnail-upload"
                                        name="thumbnails"
                                        accept="image/*"
                                        onChange={handleThumbnailChange}
                                        multiple
                                        className="hidden"/>
                                    <div className="flex items-center space-x-4">
                                        <label
                                            htmlFor="thumbnail-upload"
                                            className="bg-[#E7E2D8] py-3 px-6 rounded-xl cursor-pointer">
                                            Choose files
                                        </label>
                                        {formData.thumbnails.length > 0 && (
                                            <span className="text-sm text-gray-600">
                                                {formData.thumbnails.length} files selected
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Thumbnail Previews */}
                                {formData.thumbnails.length > 0 && (
                                    <div className="flex flex-wrap gap-6 mt-4">
                                        {formData.thumbnails.map((fileOrUrl, index) => (
                                            <div key={index} className="relative w-32 h-32 border rounded-lg overflow-hidden group">
                                                <img
                                                    src={fileOrUrl instanceof File ? URL.createObjectURL(fileOrUrl) : fileOrUrl}
                                                    alt={`Preview ${index + 1}`}
                                                    className="w-full h-full object-cover"
                                                    onLoad={(e) => {
                                                        if (fileOrUrl instanceof File) {
                                                            URL.revokeObjectURL(e.currentTarget.src);}
                                                    }}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeThumbnail(index)}
                                                    className="absolute top-1 right-1 bg-white/80 hover:bg-white text-red-600 rounded-full px-2 py-0.5 text-xs shadow"
                                                    aria-label="Remove this image">
                                                    Remove
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Variants Section */}
                            <div className="space-y-6">
                                <h3 className="text-2xl font-light text-gray-800 border-b pb-2">Variants</h3>

                                {formData.variants.map((variant, variantIndex) => (
                                    <div
                                        key={variantIndex}
                                        className="space-y-4 border p-6 rounded-2xl bg-gray-50 relative">
                                        <h4 className="text-lg font-bold">Variant #{variantIndex + 1}</h4>

                                        {formData.variants.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveVariant(variantIndex)}
                                                className="absolute top-4 right-4 text-red-500">
                                                ✕
                                            </button>
                                        )}

                                        {/* Variant Inputs */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-x-8 gap-y-6">
                                            {/* Color */}
                                            <div className="relative lg:col-span-2">
                                                <label htmlFor={`color-${variantIndex}`} className="block text-gray-700 font-medium mb-2">
                                                    Color
                                                </label>
                                                <div className="flex items-center gap-4 min-w-0">
                                                    <select
                                                        id={`color-${variantIndex}`}
                                                        name="colorId"
                                                        value={variant.colorId}
                                                        onChange={(e) => handleVariantChange(e, variantIndex)}
                                                        required
                                                        disabled={variant.trial} // Disable color selection for trial products
                                                        className="flex-1 min-w-0 h-12 px-4 text-base border-2 border-[#B29674]/50 rounded-2xl focus:ring-2 focus:ring-[#B29674]/40 disabled:bg-gray-200 disabled:cursor-not-allowed"
                                                    >
                                                        <option value="" disabled>Select color (colorId)</option>
                                                        {colors.map((c) => (
                                                            <option key={c._id} value={c._id}>
                                                                {c.name_th || c.name_en || c.hex || c._id}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <button
                                                        type="button"
                                                        onClick={() => openAddColor(variantIndex)}
                                                        className="h-12 px-4 bg-[#E7E2D8] rounded-xl hover:bg-[#ddd7cb] whitespace-nowrap shrink-0"
                                            title="Add new color"
                                            disabled={variant.trial}>
                                                        + New Color
                                                    </button>
                                                </div>

                                                {addColorOpen === variantIndex && (
                                                    <div className="absolute z-40 right-0 top-[calc(100%+0.5rem)] w-[30rem] max-w-[95vw] border rounded-xl p-4 bg-white space-y-3 shadow-lg">
                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                                            <div>
                                                                <label className="block text-sm text-gray-700 mb-1">Color name (TH)</label>
                                                                <input
                                                                    type="text"
                                                                    value={newColor.name_th}
                                                                    onChange={(e) => setNewColor({ ...newColor, name_th: e.target.value })}
                                                                    className="w-full px-3 py-2 border rounded-md"
                                                                    placeholder="เทา"/>
                                                            </div>
                                                            <div>
                                                                <label className="block text-sm text-gray-700 mb-1">Color name (EN)</label>
                                                                <input
                                                                    type="text"
                                                                    value={newColor.name_en}
                                                                    onChange={(e) => setNewColor({ ...newColor, name_en: e.target.value })}
                                                                    className="w-full px-3 py-2 border rounded-md"
                                                                    placeholder="Gray"/>
                                                            </div>
                                                            <div>
                                                                <label className="block text-sm text-gray-700 mb-1">Hex</label>
                                                                <input
                                                                    type="text"
                                                                    value={newColor.hex}
                                                                    onChange={(e) => setNewColor({ ...newColor, hex: e.target.value })}
                                                                    className="w-full px-3 py-2 border rounded-md"
                                                                    placeholder="#000000"/>
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-2 justify-end">
                                                            <button type="button" onClick={cancelAddColor} className="px-4 py-2 rounded-lg border">
                                                                Cancel
                                                            </button>
                                                            <button
                                                                type="button"
                                                                disabled={savingColor}
                                                                onClick={() => saveNewColor(variantIndex)}
                                                                className="px-4 py-2 rounded-lg bg-[#B29674] text-white disabled:opacity-50"
                                                            >
                                                                {savingColor ? "Saving..." : "Save color"}
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Price */}
                                            <div>
                                                <label htmlFor={`price-${variantIndex}`} className="block text-gray-700 font-medium mb-2">
                                                    Price
                                                </label>
                                                <input
                                                    id={`price-${variantIndex}`}
                                                    type="number"
                                                    name="price"
                                                    value={variant.price}
                                                    onChange={(e) => handleVariantChange(e, variantIndex)}
                                                    onWheel={(e) => e.currentTarget.blur()}
                                                    inputMode="decimal"
                                                    step="0.01" // Allow for decimal input
                                                    min="0"
                                                    required // Keep price editable, but visual cue if it was trial
                                                    className={`w-full h-12 px-4 text-base border-2 border-[#B29674]/50 rounded-2xl focus:ring-2 focus:ring-[#B29674]/40 ${variant.trial ? 'disabled:bg-gray-200 disabled:cursor-not-allowed' : ''}`}/>
                                            </div>

                                            {/* Stock */}
                                            <div>
                                                <label htmlFor={`stock-${variantIndex}`} className="block text-gray-700 font-medium mb-2">
                                                    Stock Quantity
                                                </label>
                                                <input
                                                    id={`stock-${variantIndex}`}
                                                    type="number"
                                                    name="quantityInStock"
                                                    value={variant.quantityInStock}
                                                    onChange={(e) => handleVariantChange(e, variantIndex)}
                                                    onWheel={(e) => e.currentTarget.blur()}
                                                    inputMode="numeric"
                                                    step="1"
                                                    min="0"
                                                    required // Disable stock for trial products
                                                    className={`w-full h-12 px-4 text-base border-2 border-[#B29674]/50 rounded-2xl focus:ring-2 focus:ring-[#B29674]/40 ${variant.trial ? 'disabled:bg-gray-200 disabled:cursor-not-allowed' : ''}`}
                                                />
                                            </div>

                                            <div className="flex items-center space-x-2 mt-4">
                                                <input
                                                    id={`trial-${variantIndex}`}
                                                    type="checkbox"
                                                    name="trial"
                                                    checked={variant.trial}
                                                    onChange={(e) => handleVariantChange(e, variantIndex)}
                                                    className="h-4 w-4"
                                                    disabled={true} // Trial is now system-controlled, cannot be unchecked here
                                                />
                                                <label className="text-gray-700">Trial product</label>
                                            </div>

                                            {/* Variant Image Upload */}
                                            <div className="col-span-1 md:col-span-2 lg:col-span-5">
                                                <label className="block text-gray-700 font-medium mb-2">Variant image (only one image allowed)</label>
                                                <div className="flex items-center gap-4">
                                                    <input
                                                        type="file"
                                                        id={`variant-image-${variantIndex}`}
                                                        accept="image/*"
                                                        onChange={(e) => handleVariantImageChange(e, variantIndex)}
                                                        className="hidden"
                                                    />
                                                    <label
                                                        htmlFor={`variant-image-${variantIndex}`}
                                                        className="bg-[#E7E2D8] py-3 px-6 rounded-xl cursor-pointer hover:bg-[#ddd7cb]"
                                                    >
                                                        Choose image
                                                    </label>

                                                    {variant.image && (
                                                        <span
                                                            className="text-sm text-gray-600 inline-block max-w-[60vw] md:max-w-xs truncate align-middle"
                                                            title={variant.image.name}
                                                        >
                                                            {variant.image.name}
                                                        </span>
                                                    )}
                                                </div>

                                                {variant.image && (
                                                    <div className="mt-4 w-32 h-32 border rounded-lg">
                                                        <img
                                                            src={
                                                                variant.image instanceof File
                                                                    ? URL.createObjectURL(variant.image)
                                                                    : variant.image
                                                            }
                                                            onLoad={(e) => {
                                                                if (variant.image instanceof File) {
                                                                    URL.revokeObjectURL(e.currentTarget.src);
                                                                }
                                                            }}
                                                            alt="Variant Image Preview"
                                                            className="w-full h-full object-cover"/>
                                                    </div>)}
                                            </div>
                                        </div>
                                        {/* NEW: Add Trial Product Button */}
                                        {!variant.trial && (
                                            <div className="mt-4">
                                                <button
                                                    type="button"
                                                    onClick={() => handleAddTrialVariant(variant)}
                                                    disabled={hasTrialVariant(variant.colorId)}
                                                    className="py-2 px-4 rounded-xl text-white transition-colors duration-200"
                                                    style={{ backgroundColor: hasTrialVariant(variant.colorId) ? '#9CA3AF' : '#849E91' }}
                                                    onMouseEnter={(e) => {
                                                        if (hasTrialVariant(variant.colorId)) {
                                                            showTooltip("A trial variant for this color already exists.", e);
                                                        }
                                                    }}
                                                    onMouseLeave={hideTooltip}
                                                >
                                                   + Add Trial Product
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}

                                <button
                                    type="button"
                                    onClick={handleAddVariant}
                                    className="w-full py-3 px-8 border border-dashed rounded-3xl text-[#B29674] hover:bg-[#E7E2D8]">
                                    + Add variant
                                </button>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-center space-x-4 pt-4">
                                <button
                                    type="submit"
                                    className="bg-[#B29674] text-white py-3 px-8 rounded-3xl shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
                                    disabled={submitting}>
                                    {submitting ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 inline-block animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        "Save product"
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="bg-gray-300 text-gray-800 py-3 px-8 rounded-3xl shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
                                    disabled={submitting}>
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
            {submitting && (
                <div className="fixed inset-0 z-[60] bg-white/70 backdrop-blur-sm flex items-center justify-center">
                    <div className="flex items-center gap-3 text-[#49453A]">
                        <Loader2 className="w-6 h-6 animate-spin" />
                        <span className="text-base font-medium">กำลังสร้างสินค้า...</span>
                    </div>
                </div>
            )}
            {tooltipVisible && (
                <div
                    ref={tooltipRef}
                    className="absolute z-50 px-3 py-1 text-sm text-white bg-gray-800 rounded-md"
                    style={{ top: tooltipRef.current?.offsetTop, left: tooltipRef.current?.offsetLeft }}
                >
                    {tooltipText}
                </div>
            )}
            <Footer />
        </div>
    );
};