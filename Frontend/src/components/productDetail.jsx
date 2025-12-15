import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom'
import { Heart, ShoppingCart, Star } from "lucide-react";
import ImageMagnifier from './Zoom.jsx';
import { useNavigate } from 'react-router-dom';
function ProductDetail() {
    const {id} = useParams();
    const [product, setProduct] = useState([])
    const [reviews, setReviews] = useState([])
    const [relatedProducts, setRelatedProducts] = useState([])
    const originalPrice = Number(product?.price) || 0;
    const discountPercentage = 25;
    const discountAmount = (originalPrice * discountPercentage) / 100;
    const discountedPrice = Number(originalPrice - discountAmount).toFixed(2);
    const navigate = useNavigate();
    const goBack = () => navigate(-1);

    
    const getStarFill = (rating, starIndex) => {
        const full = starIndex + 1 <= rating;
        const partial = rating > starIndex && rating < starIndex + 1;
        
        if (full) return "100%";       // full fill star
        if (partial) return `${(rating - starIndex) * 100}%`; // partial fill (like 0.8 → 80%)
        return "0%";                   // empty star
    };


    useEffect(()=>{
         window.scrollTo(0, 0);
        const fetchProducts = async()=>{
            const response = await fetch(`http://localhost:5000/product/products/getProductById/${id}`);
            const data = await response.json();
            console.log(data)
            if(response.ok){
                setProduct(data.product);
                setReviews(data.product.reviews)
            }
        }
        fetchProducts()
    },[id])
  
    




  return (
    <main className="bg-background min-h-screen">
        {/* Back Button */}
            <button onClick={goBack} className="w-fit px-4 py-2 mt-15 ml-10 bg-black text-white rounded-md hover:bg-gray-800 transition flex items-center gap-2">
                ← Back
            </button>

      {/* Product Showcase Section */}
      <section className="px-6 py-16 md:py-2 max-w-7xl mx-auto">
            
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16">
           
        


          {/* Product Image */}
          
          <ImageMagnifier 
            src={product?.image} 
            alt={product?.title} 
            zoom={2.5} 
            lensSize={180}
          />



          {/* Product Details */}
          <div className="flex flex-col justify-center space-y-6">

            {/* Category Badge */}
            <span className="text-sm font-medium text-accent uppercase tracking-widest bg-accent/10 px-3 py-1 rounded-full w-fit">
              {product?.category}
            </span>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-serif font-bold leading-tight">
              {product?.title}
            </h1>

            {/* Rating */}
           
            <div className="flex items-center gap-3">
                    {/* Stars */}
                    <div className="flex items-center gap-1">
                        {[0, 1, 2, 3, 4].map((star) => {
                        const width = getStarFill(product.rating || 0, star);

                        return (
                            <div key={star} className="relative w-6 h-6">
                            {/* Empty Star */}
                            <Star className="w-6 h-6 text-gray-300 absolute top-0 left-0" />

                            {/* Filled Portion */}
                            <div
                                className="absolute top-0 left-0 h-full overflow-hidden"
                                style={{ width }}
                            >
                                <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                            </div>
                            </div>
                        );
                        })}
                    </div>

                    {/* ⭐ Rating Text */}
                    <span className="text-sm text-muted-foreground font-medium">
                        {product.rating ? product.rating.toFixed(1) : "0.0"} 
                    </span>

                    {/* ⭐ Review Count */}
                    <span className="text-sm text-muted-foreground">
                        ({product.numReviews} reviews)
                    </span>
            </div>






            {/* Price */}
            
            <div className="flex items-baseline gap-3 py-4 border-y border-border">
            <span className="text-3xl md:text-4xl font-bold text-foreground">
                ${discountedPrice}
            </span>

            <span className="text-xl text-muted-foreground line-through">
                ${originalPrice}
            </span>

            <span className="text-sm font-semibold text-accent bg-accent/10 px-2 py-1 rounded">
                {discountPercentage}% OFF
            </span>
            </div>


            {/* Description */}
            <p className="text-base text-muted-foreground leading-relaxed">{product?.description}</p>

            {/* Availability */}
           
            <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm font-medium text-green-700">
                In Stock 
            </span>
            </div>


            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">

              <button
                disabled={!product?.inStock}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-md 
                  bg-foreground text-white hover:bg-foreground/90 font-semibold"
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </button>

              <button
                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-md 
                  border-2 border-foreground text-foreground hover:bg-foreground/5 font-semibold"
              >
                <Heart className="w-5 h-5" />
                Wishlist
              </button>

            </div>

            {/* Trust Badges */}
            <div className="pt-4 grid grid-cols-3 gap-4 border-t">
              {["Free Shipping", "30-Day Returns", "2-Year Warranty"].map((text, idx) => (
                <div className="text-center" key={idx}>
                  <div className="text-xl font-semibold text-accent mb-1">✓</div>
                  <p className="text-xs text-muted-foreground">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      {product?.aboutSections?.length > 0 && (
        <section className="px-6 py-16 md:py-24 bg-secondary/50">
          <div className="max-w-3xl mx-auto">

            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-8">
              About This Product
            </h2>

            <div className="space-y-6 text-muted-foreground leading-relaxed">

              {product.aboutSections.map((section, i) => (
                <p key={i}>{section}</p>
              ))}

              {product.features?.length > 0 && (
                <div className="bg-background rounded-lg p-6 mt-8 border">
                  <h3 className="font-semibold mb-4">Key Features</h3>

                  <ul className="space-y-2 text-sm">
                    {product.features.map((feature, i) => (
                      <li key={i} className="flex gap-3">
                        <span className="text-accent font-bold">•</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                </div>
              )}

            </div>
          </div>
        </section>
      )}

      {/* Reviews */}
      <section className="px-6 py-16 md:py-24 max-w-7xl mx-auto">

        <div className="flex flex-col md:flex-row justify-between mb-12 gap-4">
          <h2 className="text-3xl md:text-4xl font-serif font-bold">Customer Reviews</h2>

          <button className="bg-foreground text-white hover:bg-foreground/90 font-semibold px-6 py-3 rounded-md">
            Add a Review
          </button>
        </div>

        {/* No Reviews */}
        {reviews.length === 0 && (
          <div className="text-center py-16 bg-secondary/50 border-2 border-dashed rounded-lg">

            <p className="text-lg text-muted-foreground mb-4">No reviews yet</p>
            <p className="text-sm text-muted-foreground mb-6">
              Be the first to share your experience
            </p>

            <button className="border-2 border-foreground text-foreground px-6 py-3 rounded-md hover:bg-foreground/5">
              Write a Review
            </button>

          </div>
        )}

        {/* Review List */}
        {reviews.length > 0 && (
          <div className="grid gap-6">
            {reviews.map((review) => (
              <div key={review.id} className="border rounded-lg p-6 bg-background">

                <div className="flex justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold">{review.author}</h3>

                      {review.verified && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                          Verified Purchase
                        </span>
                      )}
                    </div>

                    <div className="flex gap-2 items-center">
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < review.rating ? "fill-accent" : "text-muted"}`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground">{review.date}</span>
                    </div>
                  </div>
                </div>

                <p className="text-muted-foreground leading-relaxed">{review.comment}</p>

              </div>
            ))}
          </div>
        )}

      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="px-6 py-16 md:py-24 bg-secondary/50">
          <div className="max-w-7xl mx-auto">

            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-8">
              Our Customers Also Liked
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

              {relatedProducts.map((rp) => (
                <div
                  key={rp.id}
                  className="border rounded-lg overflow-hidden bg-background hover:shadow-lg transition flex flex-col"
                >

                  {/* Image */}
                  <div className="w-full aspect-square bg-muted overflow-hidden">
                    <img
                      src={rp.image}
                      alt={rp.name}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </div>

                  {/* Info */}
                  <div className="p-5 flex flex-col flex-1">

                    <p className="text-xs font-medium uppercase text-accent mb-2">{rp.category}</p>

                    <h3 className="font-serif font-semibold mb-3 line-clamp-2 text-sm">
                      {rp.name}
                    </h3>

                    <div className="flex gap-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < rp.rating ? "fill-accent" : "text-muted"}`}
                        />
                      ))}
                    </div>

                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="font-bold">{rp.price}</span>
                      {rp.oldPrice && (
                        <span className="text-sm line-through text-muted-foreground">
                          {rp.oldPrice}
                        </span>
                      )}
                    </div>

                    <button
                      className="w-full mt-auto flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-foreground text-white hover:bg-foreground/90"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Add to Cart
                    </button>

                  </div>
                </div>
              ))}

            </div>
          </div>
        </section>
      )}

    </main>
  );
}


export default ProductDetail
