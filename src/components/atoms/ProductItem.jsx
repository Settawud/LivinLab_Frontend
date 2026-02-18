export default function ProductItem({
  imageSrc,
  altText,
  name,
  quantity,
  price,
}) {
  return (
    <div className="grid grid-cols-[100px_1fr_auto] gap-6 items-center my-3">
      {/* Image */}
      <div className="bg-gray-100 rounded-lg p-2 shadow-sm">
        <img
          src={imageSrc}
          alt={altText}
          className="w-24 h-24 object-cover rounded-md"
        />
      </div>
      {/* Details */}
      <div>
        <p className="font-medium text-gray-800">{name}</p>
        <p className="text-sm text-gray-500">จำนวน {quantity} รายการ</p>
      </div>
      {/* Price */}
      <div className="text-right font-semibold text-gray-700">฿{price}</div>
    </div>
  );
}
