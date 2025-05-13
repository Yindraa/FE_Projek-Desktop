export default function ReceiptTemplate({ order, items }) {
  // Calculate subtotal
  const subtotal = items.reduce((total, item) => {
    const price = Number.parseFloat(item.price.replace("$", ""));
    return total + price * item.quantity;
  }, 0);

  // Calculate tax (assuming 10%)
  const taxRate = 0.1;
  const tax = subtotal * taxRate;

  // Calculate total
  const total = subtotal + tax;

  // Format date
  const today = new Date();
  const dateString = today.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  const timeString = today.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="receipt-container">
      <div className="receipt-header">
        <h2>DineFlow Restaurant</h2>
        <p>123 Food Street, Culinary City</p>
        <p>Tel: (123) 456-7890</p>
        <p>
          {dateString} - {timeString}
        </p>
        <p>
          Order: {order.id} - Table: {order.table}
        </p>
      </div>

      <div className="receipt-divider"></div>

      <div>
        {items.map((item) => (
          <div key={item.id} className="receipt-item">
            <div className="receipt-item-details">
              {item.quantity} x {item.name}
              {item.notes && (
                <div style={{ fontSize: "10px" }}>{item.notes}</div>
              )}
            </div>
            <div className="receipt-item-price">{item.price}</div>
          </div>
        ))}
      </div>

      <div className="receipt-divider"></div>

      <div className="receipt-item">
        <div>Subtotal</div>
        <div>${subtotal.toFixed(2)}</div>
      </div>

      <div className="receipt-item">
        <div>Tax ({(taxRate * 100).toFixed(0)}%)</div>
        <div>${tax.toFixed(2)}</div>
      </div>

      <div className="receipt-total">
        <div>TOTAL</div>
        <div>${total.toFixed(2)}</div>
      </div>

      <div className="receipt-divider"></div>

      <div className="receipt-footer">
        <p>Thank you for dining with us!</p>
        <p>Please come again</p>
      </div>
    </div>
  );
}
