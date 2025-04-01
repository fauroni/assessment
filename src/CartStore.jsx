import { atom, useAtom } from 'jotai';
import { produce } from 'immer';
import { useJwt } from './UserStore';
import { useEffect, useRef } from 'react';
import axios from 'axios';

// the initial cart will be the starting value of our shopping cart
const initialCart = [

]

// create an atom for the shopping cart (atom == shared state)
const cartAtom = atom(initialCart);
const cartLoadingAtom = atom(false); // store whether we are waiting for the shopping cart data to be loaded

// A custom hook
export const useCart = () => {
    const [cart, setCart] = useAtom(cartAtom);
    // know the current value of cartLoadingAtom and be able to set it
    const [isLoading, setIsLoading] = useAtom(cartLoadingAtom);
    // get the fucntion that can return the current jwt
    const { getJwt } = useJwt();

    // fetch the cart from the API endpoint
    const fetchCart = async () => {
        const jwt = getJwt();
        setIsLoading(true);
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/cart`, {
                headers: {
                    Authorization: 'Bearer ' + jwt
                }
            }
            )
            setCart(response.data);
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    }

    // Don't use useEffect in an attempt to automatically update
    // a shopping cart when there's change
    // useEffect(()=>{
    //     updateCart()
    // }, [cart])

    // update the shopping cart
    const updateCart = async (updatedCart) => {
        const jwt = getJwt();
        setIsLoading(true);
        try {
            const updatedCartItems = updatedCart.map(item => ({
                product_id: item.product_id,
                quantity: item.quantity
            }))
            await axios.put(import.meta.env.VITE_API_URL + '/api/cart', {
                // the API expect the cart items to be in the `cartItems` key
                cartItems: updatedCartItems
            }, {
                headers: {
                    Authorization: 'Bearer ' + jwt
                }
            })


        } catch (e) {
            console.error(e);

        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchCart()
    }, []);

    // Function to calculate the total price of items in the cart
    const getCartTotal = () => {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
    };


    const addToCart = (product) => {

        // the updateCartFunc will recieve the current shopping cart array
        // and return what should the new value of the shopping cart
        // later, this updatedCartFunc will be passed as the first parameter of setCart
        const updateCartFunc = (prevCart) => {


            // produce will call the recipe function for us (the 2nd parameter) and
            // it will pass prevCart to the draft
            const modifiedCart = produce(prevCart, (draft) => {

                // whatever changes is made to draft will be in the new version of the shopping cart

                // check if the product is already in the shopping cart
                const existingIndex = prevCart.findIndex(cartItem => cartItem.product_id === product.product_id);

                // -1 index means doesn't exist
                // so if the product is not in the shopping cart
                if (existingIndex === -1) {
                    draft.push(product); // add the product to the shopping cart
                } else {
                    // if the item is already in the shopping cart
                    draft[existingIndex].quantity += 1;
                }

                // only need to return draft if it is a primitive (i.e, not array or not object)
                //return draft;

            })

            // update the shopping cart in the database
            updateCart(modifiedCart);
            // whatever is returned from the updateFuncFunction will be the new value of the shopping cart
            return modifiedCart;

        }

        // When setCart runs, it will automatically call updateCartFunc, and pass the current value of the cart 
        // as the first parameter to updateCartFunc
        setCart(updateCartFunc);
    }

    const modifyQuantity = (product_id, quantity) => {

        const updateCartFunc = (prevCart) => {
            const modifiedCart = produce(prevCart, (draft) => {

                // find the index of the product that we are updating
                const existingIndex = prevCart.findIndex(cartItem => cartItem.product_id === product_id);

                if (existingIndex === -1) {
                    return;
                } else {

                    if (quantity > 0) {
                        draft[existingIndex].quantity = quantity;
                    } else {
                        draft.splice(existingIndex, 1);
                    }


                }

            })
            // update the shopping cart in the database
            updateCart(modifiedCart);
            return modifiedCart;
        }
        setCart(updateCartFunc);
    }

    const removeFromCart = (product_id) => {
        const updateCartFunc = (prevCart) => {

            // produce will call the recipe function (the arrow function in the second parameter)
            // and pass prevCart as draft, and whatever changes is made to draft, it will return as the new  value
            const modifiedCart = produce(prevCart, (draft) => {

                // find the index of the product that we are updating
                const existingIndex = prevCart.findIndex(cartItem => cartItem.product_id === product_id);

                if (existingIndex !== -1) {
                    draft.splice(existingIndex, 1);
                }

            })

            // update the shopping cart in the database
            updateCart(modifiedCart);

            // because whatever updateCartFunc returns will be the new value for the atom
            return modifiedCart;

        }

        // when setCart is called, it will automatically call the function in its first parameter - in this case, updatedCartFunc
        // and it will pass the current value of the shopping cart to it
        setCart(updateCartFunc);
    }

    return {
        cart,
        getCartTotal,
        addToCart,
        modifyQuantity,
        removeFromCart
    }
}