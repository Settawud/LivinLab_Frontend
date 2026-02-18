const OrderNumberWithCopy = ({ orderNumber }) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(orderNumber);
  };

  return (
    <div className="m-3 flex justify-start items-center gap-3">
      <h1 className="text-3xl font-semibold text-black">
        ORDER <span className="text-[#B29675]">#{orderNumber}</span>
      </h1>
      <button onClick={copyToClipboard} title="Copy Order Number">
        <img
          src="./icon/copy.svg"
          alt="Copy Icon"
          className="h-6 w-6 opacity-70 hover:opacity-100 transition duration-200"
        />
      </button>
    </div>
  );
};

export default OrderNumberWithCopy;
