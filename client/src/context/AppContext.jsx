import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from 'axios';

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND__URL;

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const currency = import.meta.env.VITE_CURRENCY;
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [isSeller, setIsSeller] = useState(false);
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [searchQuery, setSearchQuery] = useState({});

  // Load user info + cart from backend
  const fetchUser = async () => {
  try {
    const { data } = await axios.get('/api/user/is-auth');
    if (data.success) {
      setUser(data.user);
      setCartItems(data.user.cartItems || {});
    }
  } catch (err) {
    setUser(null);
  }
};


  // Fetch seller auth status
  const fetchSeller = async () => {
    try {
      const { data } = await axios.get('/api/seller/auth');
      setIsSeller(data.success);
    } catch (error) {
      setIsSeller(false);
    }
  };

  // Fetch product list
  const fetchProducts = async () => {
    try {
      const { data } = await axios.get('/api/product/list');
      if (data.success) {
        setProducts(data.products);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message || 'Failed to fetch products');
    }
  };

  // Add to cart function
  const addToCart = (itemId) => {
    const updatedCart = { ...cartItems };
    updatedCart[itemId] = (updatedCart[itemId] || 0) + 1;
    setCartItems(updatedCart);
    localStorage.setItem('cartItems', JSON.stringify(updatedCart));
    toast.success("Added to Cart");
  };

  // Update cart item quantity
  const updateCartItem = (itemId, quantity) => {
    const updatedCart = { ...cartItems };
    if (quantity <= 0) {
      delete updatedCart[itemId];
    } else {
      updatedCart[itemId] = quantity;
    }
    setCartItems(updatedCart);
    localStorage.setItem('cartItems', JSON.stringify(updatedCart));
    toast.success("Cart Updated");
  };

  // Remove one quantity of item from cart
  const removeFromCart = (itemId) => {
    const updatedCart = { ...cartItems };
    if (updatedCart[itemId]) {
      updatedCart[itemId] -= 1;
      if (updatedCart[itemId] <= 0) {
        delete updatedCart[itemId];
      }
      setCartItems(updatedCart);
      localStorage.setItem('cartItems', JSON.stringify(updatedCart));
      toast.success("Removed from Cart");
    }
  };

  // Get total count of items in cart
  const getCartCount = () => {
    return Object.values(cartItems).reduce((total, qty) => total + qty, 0);
  };

  // Get total cart amount based on products list
  const getCartAmount = () => {
    let totalAmount = 0;
    for (const id in cartItems) {
      const product = products.find(p => p._id === id);
      if (product) {
        totalAmount += product.offerPrice * cartItems[id];
      }
    }
    return Math.floor(totalAmount * 100) / 100; // rounding to 2 decimals
  };

  // On app load, fetch user, seller, products & load cart from localStorage if no user
  useEffect(() => {
    fetchUser();
    fetchSeller();
    fetchProducts();

    // Only load cart from localStorage if user not logged in
    if (!user) {
      const savedCart = localStorage.getItem('cartItems');
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
    }
  }, []);

  // When user changes (login/logout), fetch cart from backend or fallback to localStorage
useEffect(() => {
  const syncCart = async () => {
    if (user && Object.keys(cartItems).length > 0) {
      try {
        await axios.post('/api/cart/update', { cartItems });
      } catch (error) {
        console.error("Failed to sync cart", error);
      }
    }
  };
  syncCart();
}, [cartItems]);

  return (
    <AppContext.Provider
      value={{
        navigate,
        user,
        setUser,
        isSeller,
        setIsSeller,
        showUserLogin,
        setShowUserLogin,
        products,
        currency,
        addToCart,
        updateCartItem,
        removeFromCart,
        cartItems,
        searchQuery,
        setSearchQuery,
        getCartAmount,
        getCartCount,
        axios,
        fetchProducts,
        setCartItems
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);

export default AppContextProvider;
