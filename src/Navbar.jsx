import { useState } from "react";
import {Link, useLocation} from "wouter"

export default function Navbar() {

    // state variable are created before the `return` and
    // not within the JSX
    const [showNavBar, setShowNavBar] = useState(false);

    const showNavBarOrNot = () => {
        if (showNavBar) {
            return "show"
        } else {
            return "";
        }
    }

    const showActive = (url) => {
        if (location === url) {
            return "active";
        }
        return "";
    }

    // use the useLocation hook to get the current URL (aka location) of the browser
    // a hook = is a way to add extra functionality to a component
    const [location] = useLocation();

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container">
                <a className="navbar-brand" href="#">E-Shop</a>
                {/* Hamburger Button */}
                <button
                    className="navbar-toggler"
                    type="button"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                    onClick={() => {
                        // toggle showNavBar 
                        // if true, set to false.
                        // if false, set to true.
                        if (showNavBar) {
                            setShowNavBar(false)
                        } else {
                            setShowNavBar(true)
                        }

                        // setShowNavBar(!showNavBar)

                    }}
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                {/* The nav menu */}
                <div className={`collapse navbar-collapse ${showNavBarOrNot()}`} id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <Link className={`nav-link ${location === '/' ? 'active' : ''}`} aria-current="page" href="/">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link className={`nav-link ${showActive("/products")}`} href="/products">Products</Link>
                        </li>
                        <li className="nav-item">
                            <Link className={`nav-link ${showActive("/cart")}`} href="/cart">Cart</Link>
                        </li>
                        <li className="nav-item">
                            <Link className={`nav-link ${location === "/register" ? "active" :""}`} href="/register">Register</Link>
                        </li>
                        <li className="nav-item">
                            <Link className={`nav-link ${location === "/login" ? "active" :""}`} href="/login">Login</Link>
                        </li>
                        <li className="nav-item">
                            <Link className={`nav-link ${location === "/profile" ? "active" :""}`} href="/profile">Profile</Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>);
}