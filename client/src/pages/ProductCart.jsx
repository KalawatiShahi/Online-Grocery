import React from "react";
import { useAppContext } from "../context/AppContext";

const ProductCart = () => {
  const { products, addToCart, currency } = useAppContext();

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6">
      {products.map(product => (
        <div key={product._id} className="border p-4 rounded shadow">
          <img src={product.image[0]} alt={product.name} className="w-full h-40 object-cover mb-2" />
          <h3 className="font-semibold text-lg">{product.name}</h3>
          <p className="text-gray-600">Price: {currency}{product.offerPrice}</p>
          <button
            onClick={() => addToCart(product._id)}
            className="mt-3 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Add to Cart
          </button>
        </div>
      ))}
    </div>
  );
};

export default ProductCart;
