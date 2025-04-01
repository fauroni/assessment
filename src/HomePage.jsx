import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from './ProductCard';
import { useCart } from './CartStore';
import { useLocation } from 'wouter';


function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const { addToCart } = useCart();
  const [, setLocation] = useLocation();

  const handleAddToCart = (product) => {
    addToCart({
      "id": Math.floor(Math.random() * 10000) + 1,
      "product_id": product.id,
      "productName": product.name,
      "price": product.price,
      "imageUrl": product.image,
      "description": product.description,
      "quantity": 1
    });
    setLocation("/cart");
  }

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await axios.get('/featured.json');
        setFeaturedProducts(response.data);
      } catch (error) {
        console.error('Error fetching featured products:', error);
      }
    };

    fetchFeaturedProducts();
  }, []);

  const renderFeaturedProducts = () => {
    const productElements = [];
    for (const product of featuredProducts) {
      productElements.push(
        <div key={product.id} className="col-md-3 mb-4">
          <ProductCard
            id={product.id}
            imageUrl={product.image}
            productName={product.name}
            price={product.price.toFixed(2)}
            onAddToCart={() => {
              handleAddToCart(product)
            }}
          />
        </div>
      );
    }
    return productElements;
  };

  return (
    <>
      <header className="bg-primary text-white text-center py-5">
        <div className="container">
          <h1 className="display-4">Welcome to E-Shop</h1>
          <p className="lead">Discover amazing products at unbeatable prices!</p>
          <a href="#" className="btn btn-light btn-lg">Shop Now</a>
        </div>
      </header>

      <main className="container my-5">
        <h2 className="text-center mb-4">Featured Products</h2>

        <div className="row">
          {renderFeaturedProducts()}
        </div>
      </main>
    </>
  );
}

export default HomePage;