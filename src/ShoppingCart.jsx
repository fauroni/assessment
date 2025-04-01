import { useCart } from "./CartStore";
import { useJwt } from "./UserStore"; // get the JWT from the user store
import axios from "axios";

export default function ShoppingCart() {

    const { cart, modifyQuantity, removeFromCart, getCartTotal } = useCart();
    const { getJwt } = useJwt();

    const handleCheckout =  async () => {

        const jwt = getJwt();

        // 1. Initialize a POST Request to the endpoint
        // we don't have to send the content of the shopping cart
        // because we taking the content from the serverside (or backen)
        const response = await axios.post(
            `${import.meta.env.VITE_API_URL}/api/checkout`
            , {}, {
                headers: {
                    Authorization: `Bearer ${jwt}`
                }
        })

        // 2. automatically redirect the user to stripe
        // checkout page which is the session object's url key
        window.location = response.data.url;
    }

    return (<>
        <div className="container">
            <h2>Shopping Cart</h2>
            <ul className="list-group">
                {cart.map(item => (
                    <li className="list-group-item d-flex justify-content-between align-items-center"
                        key={item.id}
                    >
                        <img src={item.imageUrl} />
                        <div>
                            <h5>{item.productName}</h5>
                            <div className="d-flex align-items-center">
                            <button className="btn btn-sm btn-secondary me-2"
                                onClick={()=>{
                                    modifyQuantity(item.product_id, item.quantity + 1)
                                }}
                            >
                                +
                            </button>
                            <p className="mb-0">Quantity: {item.quantity}</p>
                            <button className="btn btn-sm btn-secondary ms-2"
                                onClick={()=>{
                                    modifyQuantity(item.product_id, item.quantity -1);
                                }}
                            >
                                -
                            </button>
                            <button className="btn btn-sm btn-danger ms-2"
                                onClick={()=>{
                                    removeFromCart(item.product_id);
                                }}
                            >
                                Remove
                            </button>
                            </div>
                        </div>
                        <span>
                            ${ (item.price * item.quantity).toFixed(2) }
                        </span>

                    </li>
                ))}
            </ul>
            <div className="mt-3 text-end mb-3">
                <h4>Total: ${getCartTotal()}</h4>
                <button className="btn btn-primary mt-2"
                    onClick={handleCheckout}
                >
                    Checkout
                </button>
            </div>
        </div>

    </>)
}