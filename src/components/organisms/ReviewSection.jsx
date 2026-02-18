import { useState, useEffect } from "react";
import { api } from "../../lib/api";

const ReviewSection = ({ productId, orderStatus }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [hasReviewed, setHasReviewed] = useState(false);

  const [userName, setUserName] = useState("");

  const toggleReview = () => setIsOpen((prev) => !prev);
  const handleMouseEnter = (index) => setHovered(index);
  const handleMouseLeave = () => setHovered(0);
  const handleRatingClick = (index) => setRating(index);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await api.get("/users/me");
        const fullName = `${res.data.user.firstName} ${res.data.user.lastName}`.trim();
        setUserName(fullName || "");
      } catch (err) {
        console.error("Error fetching user profile:", err);
      }
    };

    fetchUserProfile();
  }, []);

  useEffect(() => {
    const fetchMyReviews = async () => {
      try {
        const res = await api.get("/reviews/me");
        const myReviews = res.data.items || [];
        const alreadyReviewed = myReviews.some(
          (review) => review.productId === productId
        );
        setHasReviewed(alreadyReviewed);
      } catch (err) {
        console.error("Error fetching user reviews:", err);
      }
    };

    if (productId) {
      fetchMyReviews();
    }
  }, [productId]);

  const submitReview = async () => {
    if (!rating || !comment) {
      setErrorMessage("Please write comment...");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await api.post("/reviews", {
        productId,
        name: userName,
        rating,
        comment,
      });

      setSuccessMessage("Success!");
      setHasReviewed(true);
      setRating(0);
      setComment("");
    } catch (err) {
      console.error("Error submitting review:", err);
      setErrorMessage("Error!");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderStatus !== "Complete") {
    return (
      <p className="text-red-500 text-sm mt-2 text-right">
        You can review only after order is completed
      </p>
    );
  }

  return (
    <div className="review-container">
      <div className="text-end">
        {!hasReviewed && (
          <button
            className="mt-2 text-sm border border-[#B29675] text-[#B29675] px-4 py-1 rounded hover:bg-[#B2967510] transition"
            onClick={toggleReview}
          >
            Review
          </button>
        )}
      </div>

      {hasReviewed && (
        <p className="text-green-600 text-sm mt-2 text-right">
          You have already reviewed this product
        </p>
      )}

      {isOpen && !hasReviewed && (
        <div className="review-section pt-4">
          <div className="flex items-center gap-1">
            <span className="text-sm">Rating:</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((index) => (
                <svg
                  key={index}
                  onMouseEnter={() => handleMouseEnter(index)}
                  onMouseLeave={handleMouseLeave}
                  onClick={() => handleRatingClick(index)}
                  className={`w-5 h-5 cursor-pointer ${
                    index <= (hovered || rating)
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 15l-5.878 3.09L5.91 12 1 7.909l6.09-.909L10 1l2.91 6L19 7.909 14.09 12l1.788 6.09z" />
                </svg>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <textarea
              rows="3"
              className="w-full rounded border border-[#B29675] p-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#B29675]"
              placeholder="Please write comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>

          {errorMessage && (
            <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
          )}
          {successMessage && (
            <p className="text-green-600 text-sm mt-2">{successMessage}</p>
          )}

          <div className="text-right pt-2">
            <button
              onClick={submitReview}
              disabled={isSubmitting || !userName}
              className="bg-[#B29675] text-white px-4 py-2 rounded hover:bg-[#9e8460] transition disabled:opacity-50"
            >
              {isSubmitting ? "กำลังส่ง..." : "ส่งรีวิว"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewSection;
