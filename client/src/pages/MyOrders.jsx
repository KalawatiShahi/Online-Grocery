import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";

const MyOrders = () => {
  const [myOrders, setMyOrders] = useState([]);
  const { axios, user, currency } = useAppContext();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get("/api/orders/user");
        if (data.success) setMyOrders(data.orders);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    if (user) fetchOrders();
  }, [user]);

  return (
    <div className="max-w-4xl mx-auto mt-16 px-4 pb-16">
      <h2 className="text-2xl font-bold mb-6">My Orders</h2>

      {!user ? (
        <p className="text-gray-500">Please log in to see your orders.</p>
      ) : myOrders.length === 0 ? (
        <p className="text-gray-500">You have no orders yet.</p>
      ) : (
        myOrders.map((order) => {
          const tax = +(order.amount * 0.02).toFixed(2); // 2% tax
          const total = +(order.amount + tax).toFixed(2);

          return (
            <div
              key={order._id}
              className="border border-gray-300 rounded-lg p-4 mb-8 bg-white"
            >
              {/* Top Header */}
              <div className="grid grid-cols-3 gap-4 text-sm font-semibold mb-4">
                <p>Order ID: {order._id}</p>
                <p>
  Payment: {order.paymentType === "Stripe" ? "Online" : order.paymentType} (
  {order.items.reduce((acc, i) => acc + i.quantity, 0)} items)
</p>

                <div className="text-right">
                  <p>Subtotal: {currency}{order.amount}</p>
                  <p>Tax (2%): {currency}{tax}</p>
                  <p className="font-bold">
                    Total: {currency}{total}
                  </p>
                </div>
              </div>

              {/* Items Grid */}
              <div className="space-y-4">
                {order.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="grid grid-cols-3 items-start gap-4 border-t pt-4 text-sm"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          item.product?.image?.[0]?.startsWith("http")
                            ? item.product.image[0]
                            : "/no-image.png"
                        }
                        alt={item.product?.name}
                        className="w-14 h-14 object-cover rounded border"
                      />
                      <div>
                        <p>{item.product?.name}</p>
                        <p>Quantity: {item.quantity}</p>
                      </div>
                    </div>

                    <div>
                      <p>Status: {order.status}</p>
                      <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>

                    <div className="text-right font-semibold">
                      Amount: {currency}
                      {item.product?.offerPrice * item.quantity}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default MyOrders;
