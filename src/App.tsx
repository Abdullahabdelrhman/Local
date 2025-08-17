
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Navbar from './components/navbar';
import Cart from './components/Cart';
import Products from './components/Products';
import ProductDetails from "./components/ProductDetails";
import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';
import Categories from './components/Categories';
import Contact from './components/Contact';
import Checkout from './components/Checkout';


function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<Home />} />
        <Route path="/Home" element={<Home />} />
        <Route path="Home" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/checkout" element={<Checkout />} />
        
      </Routes>
    </>
  );
}

export default App;
