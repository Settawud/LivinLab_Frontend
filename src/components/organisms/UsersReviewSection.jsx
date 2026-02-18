import { useState, useMemo } from "react";

const Star = ({ fillPercent = 100, width = 20, height = 20 }) => {
  return (
    <div className="relative w-6 h-6" style={{ width, height }}>
      <svg
        className="absolute w-full h-full text-gray-300"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M10 15l-5.878 3.09L5.91 12 1 7.909l6.09-.909L10 1l2.91 6L19 7.909 14.09 12l1.788 6.09z" />
      </svg>
      <div
        className="absolute overflow-hidden top-0 left-0 h-full"
        style={{ width: `${fillPercent}%` }}
      >
        <svg
          className="w-full h-full text-yellow-400"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M10 15l-5.878 3.09L5.91 12 1 7.909l6.09-.909L10 1l2.91 6L19 7.909 14.09 12l1.788 6.09z" />
        </svg>
      </div>
    </div>
  );
};

const Review = ({ name, rating, comment }) => {
  const fullStars = Math.floor(rating);
  const partialStarPercent = (rating - fullStars) * 100;

  return (
    <div className="border border-gray-200 rounded-lg p-4 shadow-sm">
      <span className="text-sm font-medium text-gray-700">{name}</span>
      <div className="flex items-center gap-2 mb-2">
        <div className="flex text-[#B29675] text-sm">
          {[...Array(5)].map((_, i) => {
            if (i < fullStars) return <Star key={i} />;
            if (i === fullStars && partialStarPercent > 0)
              return <Star key={i} fillPercent={partialStarPercent} />;
            return <Star key={i} fillPercent={0} />;
          })}
        </div>
        <span className="text-sm text-gray-500">{rating.toFixed(1)}</span>
      </div>
      <p className="text-sm text-gray-800">{comment}</p>
    </div>
  );
};

const UsersReviewSection = ({ reviews }) => {
  const [showAllComments, setShowAllComments] = useState(false);

  const averageRating = useMemo(() => {
    if (!reviews.length) return 0;
    return (
      reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    );
  }, [reviews]);

  const histogram = useMemo(() => {
    const counts = [0, 0, 0, 0, 0];
    reviews.forEach((r) => {
      const starIndex = Math.round(r.rating) - 1;
      if (starIndex >= 0 && starIndex < 5) counts[starIndex]++;
    });
    const maxCount = Math.max(...counts, 1);
    return counts.map((count, idx) => ({
      star: idx + 1,
      count,
      widthPercent: (count / maxCount) * 100,
    }));
  }, [reviews]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="text-2xl font-semibold mb-6">รีวิวจากลูกค้า</div>

      <div className="grid lg:grid-cols-[1fr_2fr] gap-10">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="text-5xl font-bold text-[#B29675]">
            {averageRating.toFixed(1)}
          </div>
          <div className="text-sm text-gray-500 mb-2">จาก 5 คะแนน</div>
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => {
              if (i < Math.floor(averageRating)) return <Star key={i} />;
              if (i === Math.floor(averageRating) && averageRating % 1 !== 0)
                return <Star key={i} fillPercent={(averageRating % 1) * 100} />;
              return <Star key={i} fillPercent={0} />;
            })}
          </div>
        </div>

        <div className="flex flex-col justify-center gap-2">
          {histogram
            .slice()
            .reverse()
            .map(({ star, widthPercent, count }) => (
              <div key={star} className="flex items-center gap-1 text-sm">
                <span>{star}</span>
                <Star width={20} height={20} />
                <div className="w-full bg-gray-200 rounded h-3 overflow-hidden">
                  <div
                    className="bg-[#B29675] h-3"
                    style={{ width: `${widthPercent}%` }}
                  ></div>
                </div>
                <span className="w-10 text-right">{count}</span>
              </div>
            ))}
        </div>
      </div>

      <div className="mt-10 space-y-6">
        {(showAllComments ? reviews : reviews.slice(0, 5)).map((r, index) => (
          <Review key={index} {...r} />
        ))}
      </div>

      <div className="mt-4 text-center">
        <button
          className="text-[#B29675] font-semibold hover:underline"
          onClick={() => setShowAllComments(!showAllComments)}
        >
          {showAllComments ? "ซ่อนรีวิวเพิ่มเติม" : "ดูรีวิวเพิ่มเติม"}
        </button>
      </div>
    </div>
  );
};

export default UsersReviewSection;
