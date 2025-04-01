import React, { useEffect } from 'react';
import Navbar from './Navbar';
import HomePage from './HomePage';
import { Route, Switch } from 'wouter';
import ProductsPage from './ProductsPage';
import RegisterPage from './RegisterPage';
import { useFlashMessage } from './FlashMessageStore';
import UserLogin from './UserLogin';
import UserProfile from './UserProfile';
import ShoppingCart from './ShoppingCart';

function App() {
  const { getMessage, clearMessage  } = useFlashMessage();
  const flashMessage = getMessage();

  useEffect(() => {

    const timer = setTimeout(() => {
      clearMessage();
    }
    , 3000);
    return () => {
      clearTimeout(timer);
    };
  }
  , [flashMessage]);

  return (
    <>
      <Navbar />
      {flashMessage.message && (
        <div className={`alert alert-${flashMessage.type} text-center flash-alert`} role="alert">
          {flashMessage.message}
        </div>
      )}
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/products" component={ProductsPage} />
        <Route path="/register" component={RegisterPage} />
        <Route path="/login" component={UserLogin} />
        <Route path="/profile" component={UserProfile} />
        <Route path="/cart" component={ShoppingCart} />
      </Switch>

      <footer className="bg-dark text-white text-center py-3">
        <div className="container">
          <p>&copy; 2023 E-Shop. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}

export default App;

// import React, { useEffect } from 'react';
// import Navbar from './Navbar';
// import HomePage from './HomePage';
// import { Route, Switch } from 'wouter';
// import ProductsPage from './ProductsPage';
// import RegisterPage from './RegisterPage';
// import { useFlashMessage } from './FlashMessageStore';

// function App() {
//   const { getMessage, clearMessage  } = useFlashMessage();
//   const flashMessage = getMessage();

//   useEffect(() => {

//     const timer = setTimeout(() => {
//       clearMessage();
//     }
//     , 3000);
//     return () => {
//       clearTimeout(timer);
//     };
//   }
//   , [flashMessage]);

//   return (
//     <>
//       <Navbar />
//       {flashMessage.message && (
//         <div className={`alert alert-${flashMessage.type} text-center flash-alert`} role="alert">
//           {flashMessage.message}
//         </div>
//       )}
//       <Switch>
//         <Route path="/" component={HomePage} />
//         <Route path="/products" component={ProductsPage} />
//         <Route path="/register" component={RegisterPage} />
//       </Switch>

//       <footer className="bg-dark text-white text-center py-3">
//         <div className="container">
//           <p>&copy; 2023 E-Shop. All rights reserved.</p>
//         </div>
//       </footer>
//     </>
//   );
// }

// export default App;