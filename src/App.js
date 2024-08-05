import { React, useState } from "react";
// import Navbar from "./components/Navbar/Navbar.js";
// import Navbar from "./components/Navbar.js";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PokemonList from "./pages/all-pokemon.js";
// import About from "./pages/about";
// import Cart from "./pages/cart";
// import SignUp from "./pages/signup";
// import Products from "./pages/products";

export default function App() {
  // const [cart, setCart] = useState({});
  return (
    <Router>
      {/* <Navbar /> */}
      <Routes>
        <Route exact path="/" element={<PokemonList />} />
        {/* <Route path="/about" element={<About />} /> */}
        {/* <Route
          path="/products"
          element={<Products cart={cart} onSetCart={setCart} />}
        />
        <Route
          path="/cart"
          element={<Cart cart={cart} onSetCart={setCart} />}
        />
        <Route path="/sign-up" element={<SignUp />} /> */}
      </Routes>
    </Router>
  );
}
