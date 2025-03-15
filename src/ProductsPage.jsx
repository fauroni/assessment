import React, { useEffect, useState } from 'react'
import axios from 'axios'
import ProductCard from './ProductCard'
import { useCart } from './CartStore';
import { useLocation } from 'wouter';
import { useFlashMessage } from './FlashMessageStore';


export default function ProductPage() {

    const [products, setProducts] = useState([]);
    const { addToCart} = useCart();
    const [, setLocation] = useLocation();
    const { showMessage} = useFlashMessage();

    const handleAddToCart = (product) => {
        addToCart({
            id: Math.floor(Math.random()* 9999 + 1),
            product_id: product.id,
            productName: product.name,
            imageUrl: product.image,
            price: product.price,
            description: product.description
        });
        showMessage("Product added to cart", "success");
        setLocation("/cart");
    }

    useEffect(() => {
      const fetchProducts = async () => {
        try {
          const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/products`);
          setProducts(response.data);
        } catch (error) {
          console.error('Error fetching products:', error);
        }
      };
    useEffect(() => {
  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/products`);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  fetchProducts();
}, []);



      fetchProducts();
    }, []);

    return (
        <div className="container mt-5">
            <h1>Our Products</h1>
            <div className="row">
                {
                    products.map(p =>
                        (
                            <div className="col-md-3 mb-4" key={p.id}>
                                <ProductCard
                                    imageUrl={p.image}
                                    productName={p.name}
                                    price={p.price}
                                    onAddToCart={()=>{
                                        handleAddToCart(p)
                                    }}
                                />
                            </div>
                        )
                    )
                }
            </div>
        </div>
    )
}