export default function OrderConfirmationMessage({ orderId }) {
  return (
    <section className="bg-yellow-50 text-yellow-800 p-4 rounded-md mx-auto mt-6 max-w-4xl shadow-sm text-center">
      <p className="text-xl font-semibold">Thank you for shopping with us!</p>
      <p className="font-bold text-yellow-900 text-xl">
        Order Number {orderId}
      </p>
    </section>
  );
}
