import { atom, useAtom } from 'jotai';
import axios from 'axios';
import { produce } from 'immer';
import { useEffect, useRef } from "react";
import { useJwt } from "./UserStore";
import Immutable from "seamless-immutable";

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

    setCart(currentCart => {
        // find if the item already exists in the shopping item
        const existingItemIndex = cart.findIndex(i => i.product_id === product.product_id);
        if (existingItemIndex !== -1) {
            let newQuantity = cart[existingItemIndex].quantity + 1;

            // existing item
            console.log(existingItemIndex, newQuantity)
            const modifiedCart = currentCart.setIn([existingItemIndex, 'quantity'], newQuantity);
            
            // send the modified cart to our RESTFul API
            updateCart(modifiedCart);
            return modifiedCart;
        } else {
            // new item
            const modifiedCart =  currentCart.concat({
                ...product,
                quantity: 1
            })
            updateCart(modifiedCart);
            return modifiedCart;
            
        }
    })
}

  



const modifyQuantity = (product_id, quantity) => {
  // updating the atom in Jotai is asynchronous
  setCart(currentCart => {

      // 1. find the index of the cart item for the product_id
      const existingItemIndex = currentCart.findIndex(i => i.product_id === product_id);

      // 2. If the new quantity is more than 0, then we'll just update the new quantity
      if (quantity > 0) {
          // .setIn will return a modified copy of the original array
          const modifiedCart = currentCart.setIn([existingItemIndex, "quantity"], quantity);
          updateCart(modifiedCart);
          return modifiedCart;
      } else {
          // 3. If the new quantity is 0
          // const lhs = currentCart.slice(0,existingItemIndex-1);
          // const rhs = currentCart.slice(existingItemIndex+1);
          // return [...lhs, ...rhs];
          const modifiedCart = currentCart.filter(cartItem => cartItem.product_id != product_id);
          updateCart(modifiedCart);
          return modifiedCart;
      }
  })

}

const removeFromCart = (product_id) => {
  setCart(currentCart => {
      const modifiedCart = currentCart.filter(cartItem => cartItem.product_id != product_id);
      updateCart(modifiedCart)
      return modifiedCart;
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
          console.log(jwt);
          await axios.put(import.meta.env.VITE_API_URL + '/api/cart', {
              cartItems: updatedCartItems
          }, {
              headers: {
                  Authorization: 'Bearer ' + jwt
              }
          })

      } catch (e) {
          console.error("Error updating cart:", e);
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