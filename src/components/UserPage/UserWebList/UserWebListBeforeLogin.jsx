import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // untuk redirect login

// Data Produk
const productsData = [
  { id: 1, category: 'Portfolio', uploader: 'John Doe', profile: '/images/fynsec.png', image: '/images/fynsec.png', likes: 0 },
  { id: 2, category: 'E-commerce', uploader: 'Jane Smith', profile: '/images/ocamba.png', image: '/images/ocamba.png', likes: 0 },
  { id: 3, category: 'Landing Page', uploader: 'Alex Brown', profile: '/images/sapforce.png', image: '/images/sapforce.png', likes: 0 },
  { id: 4, category: 'Company Profile', uploader: 'Lisa Green', profile: '/images/fynsec.png', image: '/images/fynsec.png', likes: 0 },
  { id: 5, category: 'Portfolio', uploader: 'David Lee', profile: '/images/ocamba.png', image: '/images/ocamba.png', likes: 0 },
  { id: 6, category: 'Event', uploader: 'Emma White', profile: '/images/sapforce.png', image: '/images/sapforce.png', likes: 0 },
];

const category = ['All', 'Portfolio', 'E-commerce', 'Landing Page', 'Company Profile', 'Event'];

const UserWebListBeforeLogin = () => {
  const [products, setProducts] = useState(productsData);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [visibleCount, setVisibleCount] = useState(6);
  const [indicatorStyle, setIndicatorStyle] = useState({ width: 0, left: 0 });
  const buttonsRef = useRef({});
  
  const navigate = useNavigate();

  // Simulasi status login
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Ganti jadi 'true' kalau user sudah login

  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter(product => product.category === selectedCategory);

  const visibleProducts = filteredProducts.slice(0, visibleCount);

  const handleLike = (id) => {
    if (!isLoggedIn) return; // Blokir like kalau belum login
    const updatedProducts = products.map(product =>
      product.id === id ? { ...product, likes: product.likes + 1 } : product
    );
    setProducts(updatedProducts);
  };

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 3);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setVisibleCount(6);
  };

  useEffect(() => {
    const currentButton = buttonsRef.current[selectedCategory];
    if (currentButton) {
      setIndicatorStyle({
        width: currentButton.offsetWidth,
        left: currentButton.offsetLeft,
      });
    }
  }, [selectedCategory]);

  return (
    <section id="WebList" className="relative flex flex-col items-center justify-center w-full min-h-screen py-20 bg-gradient-to-b from-blue-100 to-blue-300 backdrop-blur-lg">
      <h2 className="mt-4 mb-2 text-4xl font-bold font-poppins md:text-4xl ">Daftar Website</h2>

      <p className="max-w-2xl mb-8 text-sm text-center text-gray-500 opacity-70 font-poppins">
        Temukan berbagai website menarik dari kategori pilihan. Scroll dan jelajahi karya terbaik kami.
      </p>

      {/* Kategori dengan Glide Background */}
      <div className="relative flex flex-wrap justify-center mb-8 space-x-2">
        {/* Glide Background */}
        <motion.div
          layout
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className="absolute h-full bg-white rounded-full backdrop-blur-md"
          style={{ width: indicatorStyle.width, left: indicatorStyle.left }}
        ></motion.div>

        {category.map((category) => (
          <button
            key={category}
            ref={el => buttonsRef.current[category] = el}
            onClick={() => handleCategoryChange(category)}
            className={`relative z-10 px-4 py-2 m-1 rounded-full text-sm font-medium transition 
              ${selectedCategory === category ? 'text-black' : 'text-black hover:bg-invaPink hover:text-white'}`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Produk */}
      <div className={`grid w-full grid-cols-1 gap-6 px-8 max-w-7xl md:grid-cols-3 ${!isLoggedIn && 'pointer-events-none blur-sm brightness-75'}`}>
        <AnimatePresence>
          {visibleProducts.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col overflow-hidden text-black transition-transform duration-300 transform shadow-lg bg-white/20 rounded-2xl hover:scale-105 hover:shadow-2xl"
            >
              {/* Gambar Website */}
              <div className="w-full overflow-hidden aspect-video">
                <img src={product.image} alt={product.uploader} className="object-cover w-full h-full" />
              </div>

              {/* Uploader Info + Like */}
              <div className="flex items-center justify-between px-4 py-4 bg-invaGray bg-opacity-80 backdrop-blur-md">
                <div className="flex items-center space-x-3">
                  <img src={product.profile} alt={product.uploader} className="object-cover w-10 h-10 rounded-full" />
                  <span className="text-sm font-medium text-black">{product.uploader}</span>
                </div>

                {/* Tombol Like */}
                <motion.button
                  whileTap={{ scale: 1.2 }}
                  onClick={() => handleLike(product.id)}
                  className="flex items-center px-3 py-1 space-x-1 text-sm text-white transition rounded-lg bg-invaPurple hover:bg-invaPink"
                >
                  <Heart className="w-4 h-4" />
                  <span>{product.likes}</span>
                </motion.button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Load More */}
      {visibleCount < filteredProducts.length && (
        <button
          onClick={handleLoadMore}
          className="px-6 py-2 mt-10 text-white transition rounded-lg bg-invaPurple hover:bg-invaPink"
        >
          Load More
        </button>
      )}

      {/* Overlay Jika Belum Login */}
      {!isLoggedIn && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 flex flex-col items-center justify-center text-center bg-gradient-to-t from-black/80 to-transparent backdrop-blur-sm"
        >
          <h3 className="mb-4 text-2xl font-bold text-white">Silakan Login Terlebih Dahulu</h3>
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-2 text-white transition rounded-lg bg-invaPurple hover:bg-invaPink"
          >
            Login Sekarang
          </button>
        </motion.div>
      )}
    </section>
  );
};

export default UserWebListBeforeLogin;
