import React from 'react';
import Hero from "./Hero";
import { Header } from './Navbar';
import Footer from './Footer';
import SampleProducts from './SampleProducts';
import { Link } from 'react-router-dom';
function Home() {
  const categories = [
    "Fashion & Apparel",
    "Electronics",
    "Home & Kitchen",
    "Beauty & Personal Care",
    "Sports & Fitness"
  ];

  return (
    <div className="bg-[#F8FAFC]">
      
      <Hero />

      {/* CONTENT SECTION */}
      <div className="relative mt-10 pt-10 bg-black space-y-16 px-6 lg:px-12 pb-20">
        <div>
            <h2 className="text-[#FFFFFF] text-3xl font-bold  uppercase">
              Explore Our Collection
            </h2>
            <div className="w-[30%] h-1 bg-white rounded my-5 mx-1"></div>
        </div>
        
        {categories.map((category, index) => (
          <section key={index} className="sticky top-18 space-y-4 bg-white shadow-2xl py-6 px-8 rounded-lg">
            
            <div className='flex justify-between'>
              <h1 className="text-[#1E293B] font-bold text-3xl md:text-4xl">
                {category}
              </h1>
              
            </div>
            
            <div className="w-16 h-1 bg-[#0EA5E9] rounded"></div>

            <SampleProducts category={category} />
            <div className='flex justify-center '>
              
              <Link to={`/shop?category=${encodeURIComponent(category)}`} className="px-5 py-2 rounded-lg bg-[#000000] my-5 cursor-pointer text-white font-medium hover:bg-gray-800 transition">
                  Show More Related Products
              </Link>
            </div>
          </section>
        ))}

      </div>

      <Footer />

    </div>
  );
}

export default Home;
