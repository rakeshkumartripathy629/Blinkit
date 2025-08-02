import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { valideURLConvert } from '../utils/valideURLConvert';
import { useNavigate } from 'react-router-dom';

// Desktop banners
import banner1 from '../assets/banner.jpg';
import banner2 from '../assets/banner1.jpg';
import banner3 from '../assets/banner3.jpg';

// Mobile banners
import bannerMobile1 from '../assets/banner-mobile.jpg';


import CategoryWiseProductDisplay from '../components/CategoryWiseProductDisplay';

const Home = () => {
  const loadingCategory = useSelector(state => state.product.loadingCategory);
  const categoryData = useSelector(state => state.product.allCategory);
  const subCategoryData = useSelector(state => state.product.allSubCategory);
  const navigate = useNavigate();

  const handleRedirectProductListpage = (id, cat) => {
    const subcategory = subCategoryData.find(sub => {
      const filterData = sub.category.some(c => c._id === id);
      return filterData ? true : null;
    });
    if (!subcategory) return;

    const url = `/${valideURLConvert(cat)}-${id}/${valideURLConvert(subcategory.name)}-${subcategory._id}`;
    navigate(url);
  };

  // ✅ Banner images array
  const bannerImages = [
    { desktop: banner1, mobile: bannerMobile1 },
    { desktop: banner2},
       { desktop: banner3},
  ];

  // ✅ Auto slide logic
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % bannerImages.length);
    }, 3000); // Change every 3s
    return () => clearInterval(slideInterval);
  }, [bannerImages.length]);

  return (
    <section className="bg-white">
      {/* ✅ Auto-swiping banner without slick */}
      <div className="container mx-auto relative overflow-hidden rounded min-h-48 h-[300px]">
        {bannerImages.map((b, index) => (
          <div
            key={index}
            className={`absolute top-0 left-0 w-full h-full transition-opacity duration-700 ease-in-out ${
              currentSlide === index ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <img src={b.desktop} className="w-full h-full hidden lg:block object-cover" alt={`banner-${index}`} />
            <img src={b.mobile} className="w-full h-full lg:hidden object-cover" alt={`banner-mobile-${index}`} />
          </div>
        ))}
      </div>

      {/* ✅ Category Grid */}
      <div className="container mx-auto px-4 my-2 grid grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-2">
        {loadingCategory ? (
          new Array(12).fill(null).map((_, index) => (
            <div key={index + 'loadingcategory'} className="bg-white rounded p-4 min-h-36 grid gap-2 shadow animate-pulse">
              <div className="bg-blue-100 min-h-24 rounded"></div>
              <div className="bg-blue-100 h-8 rounded"></div>
            </div>
          ))
        ) : (
          categoryData.map((cat) => (
            <div
              key={cat._id + 'displayCategory'}
              className="w-full h-full cursor-pointer"
              onClick={() => handleRedirectProductListpage(cat._id, cat.name)}
            >
              <div>
                <img src={cat.image} className="w-full h-full object-scale-down" alt={cat.name} />
              </div>
            </div>
          ))
        )}
      </div>

      {/* ✅ Category-wise Products */}
      {categoryData?.map((c) => (
        <CategoryWiseProductDisplay key={c?._id + 'CategorywiseProduct'} id={c?._id} name={c?.name} />
      ))}
    </section>
  );
};

export default Home;
