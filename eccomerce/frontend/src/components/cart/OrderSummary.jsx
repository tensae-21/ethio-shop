/**
 * OrderSummary.jsx
 * Shows subtotal, tax, shipping, and total cost.
 * Used by Cart.jsx and Checkout.jsx to display order totals.
 */

import { formatPrice } from "../../utils/formatPrice";

export default function OrderSummary({
  subtotal = 0,
  tax = 0,
  shipping = 0,
  discount = 0,
  children, // Allow custom content (e.g., apply coupon button)
}) {
  const total = subtotal + tax + shipping - discount;

  return (
    <div className="bg-gray-100 rounded-lg p-6 space-y-3">
      <h3 className="font-bold text-lg mb-4">Order Summary</h3>

      {/* Subtotal */}
      <div className="flex justify-between">
        <span className="text-gray-700">Subtotal:</span>
        <span>{formatPrice(subtotal)}</span>
      </div>

      {/* Discount */}
      {discount > 0 && (
        <div className="flex justify-between text-green-600">
          <span>Discount:</span>
          <span>-{formatPrice(discount)}</span>
        </div>
      )}

      {/* Shipping */}
      <div className="flex justify-between">
        <span className="text-gray-700">Shipping:</span>
        <span>{shipping > 0 ? formatPrice(shipping) : "Free"}</span>
      </div>

      {/* Tax */}
      <div className="flex justify-between">
        <span className="text-gray-700">Tax:</span>
        <span>{formatPrice(tax)}</span>
      </div>

      {/* Divider */}
      <hr className="my-2" />

      {/* Total */}
      <div className="flex justify-between font-bold text-lg">
        <span>Total:</span>
        <span className="text-blue-600">{formatPrice(total)}</span>
      </div>

      {/* Slot for additional content */}
      {children && <div className="mt-4 pt-4 border-t">{children}</div>}
    </div>
  );
}
