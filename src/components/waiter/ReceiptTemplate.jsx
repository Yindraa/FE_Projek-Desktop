export default function ReceiptTemplate({ order, items }) {
  // Calculate subtotal
  const subtotal = items.reduce((total, item) => {
    // Support both old and new structure
    let price = 0;
    if (item.menuItem && item.menuItem.price !== undefined) {
      price =
        typeof item.menuItem.price === "string"
          ? parseFloat(item.menuItem.price)
          : item.menuItem.price;
    } else if (item.price !== undefined) {
      price =
        typeof item.price === "string"
          ? parseFloat(item.price.replace("$", "").replace("Rp", ""))
          : item.price;
    }
    return total + (price || 0) * (item.quantity || 0);
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
          Order: {order?.id} - Table:{" "}
          {order?.table?.tableNumber || order?.table || "-"}
        </p>
      </div>

      <div className="receipt-divider"></div>

      <div>
        {items.map((item, idx) => {
          const name = item.menuItem?.name || item.name || "-";
          const notes = item.notes;
          let price = 0;
          if (item.menuItem && item.menuItem.price !== undefined) {
            price =
              typeof item.menuItem.price === "string"
                ? parseFloat(item.menuItem.price)
                : item.menuItem.price;
          } else if (item.price !== undefined) {
            price =
              typeof item.price === "string"
                ? parseFloat(item.price.replace("$", "").replace("Rp", ""))
                : item.price;
          }
          return (
            <div key={idx} className="receipt-item">
              <div className="receipt-item-details">
                {item.quantity} x {name}
                {notes && <div style={{ fontSize: "10px" }}>{notes}</div>}
              </div>
              <div className="receipt-item-price">
                {price ? `Rp ${price.toLocaleString("id-ID")}` : "-"}
              </div>
            </div>
          );
        })}
      </div>

      <div className="receipt-divider"></div>

      <div className="receipt-item">
        <div>Subtotal</div>
        <div>Rp {subtotal.toLocaleString("id-ID")}</div>
      </div>

      <div className="receipt-item">
        <div>Tax ({(taxRate * 100).toFixed(0)}%)</div>
        <div>Rp {tax.toLocaleString("id-ID")}</div>
      </div>

      <div className="receipt-total">
        <div>TOTAL</div>
        <div>Rp {total.toLocaleString("id-ID")}</div>
      </div>

      <div className="receipt-divider"></div>

      <div className="receipt-footer">
        <p>Thank you for dining with us!</p>
        <p>Please come again</p>
      </div>
    </div>
  );
}
