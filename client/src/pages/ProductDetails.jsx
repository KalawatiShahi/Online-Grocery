import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { Link, useParams, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import ProductCard from "../components/ProductCard";

const ProductDetails = () => {
  const { products, currency, addToCart } = useAppContext();
  const { productId } = useParams();
  const navigate = useNavigate();

  const [relatedProducts, setRelatedProducts] = useState([]);
  const [thumbnail, setThumbnail] = useState(null);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const foundProduct = products.find(p => {
      const productIdToCompare = String(productId).trim();
      const pIdString = p._id ? String(p._id).trim() : "";
      return pIdString === productIdToCompare;
    });
    setProduct(foundProduct);
    setLoading(false);
  }, [products, productId]);

  useEffect(() => {
    if (product) {
      let productsCopy = products.slice();
      productsCopy = productsCopy.filter(item => item.category === product.category && item._id !== product._id);
      setRelatedProducts(productsCopy.slice(0, 5));
    } else {
      setRelatedProducts([]);
    }
  }, [products, product]);

  useEffect(() => {
    setThumbnail(product?.images?.[0] ?? null);
  }, [product]);

  if (loading) return <div>Loading product details...</div>;
  if (!product) return <div>Product not found.</div>;

  return (
    <div className="mt-12">
      <p>
        <Link to="/">Home</Link> /
        <Link to="/products"> Products</Link> /
        {product.category} /
        <span className="text-primary"> {product.name}</span>
      </p>

      <div className="flex flex-col md:flex-row gap-16 mt-4">
        <div className="flex gap-3">
          <div className="flex flex-col gap-3">
            {product?.images?.map((image, index) => (
              <div
                key={index}
                onClick={() => setThumbnail(image)}
                className="border max-w-24 border-gray-500/30 rounded overflow-hidden cursor-pointer"
              >
                <img src={image} alt={`Thumbnail ${index + 1}`} />
              </div>
            ))}
          </div>

          <div className="border border-gray-500/30 max-w-100 rounded overflow-hidden">
            <img
              src={thumbnail}
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/300";
              }}
              alt="Selected product"
              className="w-64 h-auto object-contain"
            />
          </div>
        </div>

        <div className="text-sm w-full md:w-1/2">
          <h1 className="text-3xl font-medium">{product.name}</h1>

          <div className="flex items-center gap-0.5 mt-1">
            {Array(5).fill('').map((_, i) => (
              <img key={i} src={i < 4 ? assets.star_icon : assets.star_dull_icon} alt="" className="md:w-4 w-3.5" />
            ))}
            <p className="text-base ml-2">(4)</p>
          </div>

          <div className="mt-6">
            <p className="text-gray-500/70 line-through"> {currency}{product.price}</p>
            <p className="text-2xl font-medium"> {currency}{product.offerPrice}</p>
            <span className="text-gray-500/70">(inclusive of all taxes)</span>
          </div>

          <p className="text-base font-medium mt-6">About Product</p>
          <ul className="list-disc ml-4 text-gray-500/70">
            {product?.description?.map((desc, index) => (
              <li key={index}>{desc}</li>
            ))}
          </ul>

          <div className="flex items-center mt-10 gap-4 text-base">
            <button
              onClick={() => addToCart(product._id)}
              className="w-full py-3.5 cursor-pointer font-medium bg-gray-100 text-gray-800/80 hover:bg-gray-200 transition"
            >
              Add to Cart
            </button>
            <button
              onClick={() => {
                addToCart(product._id);
                navigate("/cart");
              }}
              className="w-full py-3.5 cursor-pointer font-medium bg-primary text-white hover:bg-primary-dull transition"
            >
              Buy now
            </button>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      <div className="flex flex-col items-center mt-20">
        <div className="flex flex-col items-center w-max">
          <p className="text-3xl font-medium">Related Products</p>
          <div className="w-20 h-0.5 bg-primary rounded-full mt-2"></div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-6 lg:grid-cols-5 mt-6 w-full">
          {relatedProducts.filter(product => product.inStock).map((product, index) => (
            <ProductCard key={index} product={product} />
          ))}
        </div>

        <div className="flex justify-center mt-16">
          <button
            onClick={() => {
              navigate("/products");
              window.scrollTo(0, 0);
            }}
            className="cursor-pointer px-12 py-2.5 border rounded text-primary hover:bg-primary/10 transition"
          >
            See More
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
