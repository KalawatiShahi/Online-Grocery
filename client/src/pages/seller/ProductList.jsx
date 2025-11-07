import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const ProductList = () => {
  const { products, currency, fetchProducts, axios } = useAppContext();
  const [editablePrices, setEditablePrices] = useState({});

  useEffect(() => {
    fetchProducts();
  }, []);

  const handlePriceChange = (id, value) => {
    setEditablePrices((prev) => ({
      ...prev,
      [id]: value,
    }));
  };
   
  const updateProductPrice = async (id) => {
    const newPrice = editablePrices[id];
    if (!newPrice || isNaN(newPrice)) {
      toast.error("Invalid price");
      return;
    }

    try {
      const { data } = await axios.put(`/api/product/update/${id}`, {
        offerPrice: parseFloat(newPrice),
      });

      if (data.success) {
        toast.success("Price updated");
        fetchProducts(); // Refresh product list
      } else {
        toast.error(data.message || "Failed to update");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      const { data } = await axios.delete(`/api/product/delete/${id}`);
      if (data.success) {
        toast.success("Product deleted");
        fetchProducts();
      } else {
        toast.error(data.message || "Failed to delete");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="no-scrollbar flex-1 h-[95vh] overflow-y-scroll 
    flex flex-col justify-between">
      <div className="w-full md:p-10 p-4">
        <h2 className="pb-4 text-lg font-medium">All Products</h2>
        <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden 
        rounded-md bg-white border border-gray-500/20">
          <table className="md:table-auto table-fixed w-full overflow-hidden">
            <thead className="text-gray-900 text-sm text-left">
              <tr>
                <th className="px-4 py-3 font-semibold truncate">Product</th>
                <th className="px-4 py-3 font-semibold truncate">Category</th>
                <th className="px-4 py-3 font-semibold truncate">Price</th>
                <th className="px-4 py-3 font-semibold truncate">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-500">
              {products.map((product) => (
                <tr key={product._id} className="border-t border-gray-500/20">
                  <td className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3 truncate">
                    <div className="border border-gray-300 rounded p-2">
                      <img
                        src={
                          product.image?.[0] ||
                          product.images?.[0] ||
                          'https://via.placeholder.com/150'
                        }
                        alt={product.name}
                        className="w-16"
                      />
                    </div>
                    <span className="truncate max-sm:hidden w-full">{product.name}</span>
                  </td>
                  <td className="px-4 py-3">{product.category}</td>
                  <td className="px-4 py-3 max-sm:hidden">
                    <input
                      type="number"
                      value={editablePrices[product._id] ?? product.offerPrice}
                      onChange={(e) => handlePriceChange(product._id, e.target.value)}
                      className="border border-gray-300 px-2 py-1 w-24 text-black rounded"
                    />
                  </td>
                  <td className="px-4 py-3 flex gap-2">
                    <button
                      onClick={() => updateProductPrice(product._id)}
                      className="bg-blue-500 text-white text-xs px-3 py-1 rounded
                       hover:bg-blue-600 transition"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => deleteProduct(product._id)}
                      className="bg-red-500 text-white text-xs px-3 py-1 rounded
                       hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
