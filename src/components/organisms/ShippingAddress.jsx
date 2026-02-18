const ShippingAddress = ({ name, phone, address }) => {
  return (
    <section className="mx-auto px-4 py-3">
      <div className="mb-3 text-3xl font-semibold">Shipping Address</div>
      <div className="overflow-hidden rounded-lg border border-[#B29675] text-sm">
        <table className="w-full table-auto">
          <thead className="bg-[#B29675] text-sm uppercase tracking-wide text-white">
            <tr>
              <th className="px-6 py-3 text-left">Name, Phone, Address</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            <tr>
              <td className="px-6 py-4 text-left">{`${name} - ${phone}`}</td>
            </tr>
            <tr>
              <td className="px-6 py-4 text-left">{address}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default ShippingAddress;
