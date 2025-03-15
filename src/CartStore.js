import { atom, useAtom } from 'jotai';
import axios from 'axios';
import { produce } from 'immer';
import { useEffect, useRef } from "react";
import { useJwt } from "./UserStore";

// Define the initial state of the cart. We put in one piece of test data
const initialCart = [
{
    "id": 1,
    "product_id": 1,
    "quantity": 10,
    "productName": "Organic Green Tea",
    "price": 12.99,
    "imageUrl": "https://picsum.photos/id/225/300/200",
    "description": "Premium organic green tea leaves, rich in antioxidants and offering a smooth, refreshing taste."
  },
];

// Create an atom for the cart
export const cartAtom = atom(initialCart);

export const cartLoadingAtom = atom(false);

// Custom hook for cart operations
export const useCart = () => {
  const [cart, setCart] = useAtom(cartAtom);
  const [isLoading, setIsLoading] = useAtom(cartLoadingAtom);
  const { getJwt } = useJwt();

  // Function to calculate the total price of items in the cart
  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  };

  const addToCart = (product) => {
    // Define the updater explicitly as a separate function variable
    const updateFunc = (prevCart) => {
      const updatedCart = produce(prevCart, (draft) => {
        const existingItemIndex = draft.findIndex(
          (item) => item.product_id === product.id
        );

        if (existingItemIndex !== -1) {
          draft[existingItemIndex].quantity += 1;
        } else {
          draft.push({
            ...product,
            product_id: product.id,
            quantity: 1,
          });
        }
      });
      return updatedCart;
    }
   
    // Call the explicitly defined updater
    setCart(updateFunc);
  };

  const modifyQuantity = (product_id, quantity) => {
    setCart((currentCart) => {
      const existingItemIndex = currentCart.findIndex(item => item.product_id === product_id);
      if (existingItemIndex !== -1) {

        // check if the quantity will be reduced to 0 or less, if so remove the item
        if (quantity < 0) {
          return currentCart.filter(item => item.product_id !== product_id);
        } else {                      
            return currentCart.setIn([existingItemIndex, 'quantity'], quantity);
        }

      }
    });
  }

  const removeFromCart = (product_id) => {
    setCart((currentCart) => {
      return currentCart.filter(item => item.product_id !== product_id);
    });
  }

  const fetchCart = async () => {
    const jwt = getJwt();
    setIsLoading(true);
    try {
        const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/cart`,
            {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            }
        );
        setCart(Immutable(response.data));
    } catch (error) {
        console.error("Error fetching cart:", error);
    } finally {
        setIsLoading(false);
    }
    };

    const updateCart = async (updatedCart) => {
      const jwt = getJwt();
      setIsLoading(true);
      try {
          // .map  will generate the new array
          // which will consist of the elements from the
          // original array but transformed somehow
          const updatedCartItems = updatedCart.map(item => ({
              product_id: item.product_id,
              quantity: item.quantity
          })
          );
          await axios.put(import.meta.env.VITE_API_URL + '/api/cart', {
              cartItems: updatedCartItems
          }, {
              headers: {
                  Authorization: 'Bearer ' + jwt
              }
          })

      } catch (e) {
          console.error("Error updating cart:", error);
      } finally {
          setIsLoading(false);
      }
  }
  
  return {
    cart,
    addToCart,
    getCartTotal,
    modifyQuantity,
    removeFromCart, 
    fetchCart
  };
};