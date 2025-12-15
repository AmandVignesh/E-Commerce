import React from 'react'
import { useEffect, useState } from 'react'
import ProductCard from './ProductCard.jsx'
function SampleProducts({category}) {
  const [product, setProduct] = useState([])
  useEffect(()=>{
    const fetchi = async()=>{
      const response = await fetch(`http://localhost:5000/product/productsbycategory/${category}?limit=4`);
      console.log(response)
      const data = await response.json()
      if(response.ok){
        setProduct(data.products)
      }
    }
    fetchi();
  },[category])
  return (
    <div className='flex flex-wrap justify-between '>
      {product.map((i) => (
        <ProductCard key={i.id} product={i} />
      ))}

    </div>
  )
}

export default SampleProducts
