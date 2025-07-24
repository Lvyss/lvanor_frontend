// UserWebList.jsx
import React, { useState, useRef, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';
import { AuthApi } from "../../LoginRegister/api/AuthApi";
import { useNavigate } from "react-router-dom";
import routes from '../../../routes';

const UserWebList = () => {
  const { apiRequest } = useContext(AuthApi);
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(['All']);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [visibleCount, setVisibleCount] = useState(6);
  const [indicatorStyle, setIndicatorStyle] = useState({ width: 0, left: 0 });
  const buttonsRef = useRef({});
  const navigate = useNavigate();

  const fetchWeblist = async () => {
    try {
      const response = await apiRequest('explore-weblist', 'GET');
      if (response && response.data) {
        const weblist = response.data.map(item => ({
          id: item.id,
          category: item.category?.name || 'Unknown',
          uploader: item.user?.name || 'Anonymous',
          profile: item.user?.profile_picture || '/images/default-profile.png',
          image: item.image_path,
          likes: 0
        }));
        setProducts(weblist);
      }
    } catch (error) {
      console.error('Gagal mengambil data weblist:', error);
    }
  };

  const fetchCategory = async () => {
    try {
      const response = await apiRequest('category', 'GET');
      if (response && response.data) {
        const categoryNames = response.data.map(cat => cat.name);
        setCategory(['All', ...categoryNames]);
      }
    } catch (error) {
      console.error('Gagal mengambil kategori:', error);
    }
  };

  useEffect(() => {
    fetchWeblist();
    fetchCategory();
  }, []);

  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter(product => product.category === selectedCategory);

  const visibleProducts = filteredProducts.slice(0, visibleCount);

  const handleLike = (id) => {
    const updatedProducts = products.map(product =>
      product.id === id ? { ...product, likes: product.likes + 1 } : product
    );
    setProducts(updatedProducts);
  };

  const handleLoadMore = () => setVisibleCount(prev => prev + 3);

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
    <section className="flex flex-col items-center justify-center w-full min-h-screen py-20 bg-gradient-to-b from-blue-100 to-blue-300 backdrop-blur-lg">
      <h2 className="mt-4 mb-2 text-4xl font-bold font-poppins md:text-4xl">Daftar Website</h2>
      <p className="max-w-2xl mb-8 text-sm text-center text-gray-500 opacity-70 font-poppins">
        Temukan berbagai website menarik dari kategori pilihan. Scroll dan jelajahi karya terbaik kami.
      </p>

      {/* Kategori */}
      <div id='category' className="relative flex flex-wrap justify-center mb-8 space-x-2">
        <motion.div
          layout
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className="absolute h-full bg-white rounded-full backdrop-blur-md"
          style={{ width: indicatorStyle.width, left: indicatorStyle.left }}
        />
        {category.map(cat => (
          <button
            key={cat}
            ref={el => buttonsRef.current[cat] = el}
            onClick={() => handleCategoryChange(cat)}
            className={`relative z-10 px-4 py-2 m-1 rounded-full text-sm font-medium transition 
              ${selectedCategory === cat ? 'text-black' : 'text-black hover:bg-invaPink hover:text-white'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Produk */}
      <div className="grid w-full grid-cols-1 gap-6 px-8 max-w-7xl md:grid-cols-3">
        <AnimatePresence>
          {visibleProducts.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.4 }}
              onClick={() => navigate(routes.userWeblistDetailAll(product.id))}
              className="flex flex-col overflow-hidden text-black transition-transform duration-300 transform shadow-lg cursor-pointer bg-white/20 rounded-2xl hover:scale-105 hover:shadow-2xl"
            >
              <div className="w-full overflow-hidden aspect-video">
                <img src={product.image} alt={product.uploader} className="object-cover w-full h-full" />
              </div>
              <div className="flex items-center justify-between px-4 py-4 bg-invaGray bg-opacity-80 backdrop-blur-md">
                <div className="flex items-center space-x-3">
                  <img src={product.profile} alt={product.uploader} className="object-cover w-10 h-10 rounded-full" />
                  <span className="text-sm font-medium text-black">{product.uploader}</span>
                </div>
                <motion.button
                  whileTap={{ scale: 1.2 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLike(product.id);
                  }}
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

      {visibleCount < filteredProducts.length && (
        <button
          onClick={handleLoadMore}
          className="px-6 py-2 mt-10 text-white transition rounded-lg bg-invaPurple hover:bg-invaPink"
        >
          Load More
        </button>
      )}
    </section>
  );
};

export default UserWebList;
