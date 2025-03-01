import React from 'react';
import ProductCard from './ProductCard';

function HomePage() {
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
          <div className="col-md-3 mb-4">
            <ProductCard
              imageUrl="https://picsum.photos/id/20/300/200"
              productName="Product 1"
              price="19.99"
            />
          </div>
          {/* Other ProductCard components... */}
        </div>
      </main>

   
    </>
  );
}

export default HomePage;