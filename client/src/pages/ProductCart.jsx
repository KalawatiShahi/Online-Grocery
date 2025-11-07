import React from "react";
import { useAppContext } from "../context/AppContext";

const ProductCart = () => {
  const { products, addToCart, currency } = useAppContext();

  if (!Array.isArray(products) || products.length === 0) {
    return <div className="text-center mt-10 text-gray-500">No products found.</div>;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 p-6">
      {products.map((product) => (
        <div
          key={product._id}
          className="border p-4 rounded shadow-sm hover:shadow-md transition duration-200 bg-white"
        >
          <div className="w-full h-40 mb-3 overflow-hidden rounded">
            <img
              src={product.image?.[0] || product.images?.[0] || "/placeholder.jpg"}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          <h3 className="font-semibold text-base truncate">{product.name}</h3>
          <p className="text-gray-600 text-sm mt-1">
            Price: {currency}
            {parseFloat(product.offerPrice).toFixed(2)}
          </p>

          <button
            onClick={() => addToCart(product._id)}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700 transition"
          >
            Add to Cart
          </button>
        </div>
      ))}
    </div>
  );
};

export default ProductCart;
