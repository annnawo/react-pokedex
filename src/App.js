import { React, useState } from "react";
// import Navbar from "./components/Navbar/Navbar.js";
// import Navbar from "./components/Navbar.js";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PaginatedPokemonList from "./pages/all-pokemon.js";

export default function App() {
  const [allPokemon, setPokemon] = useState([]);
  return (
    <Router>
      {/* <Navbar /> */}
      <Routes>
        <Route exact path="/" element={<PaginatedPokemonList allPokemon={allPokemon} setPokemon={setPokemon} />} />
        {/* <Route path="/about" element={<About />} /> */}
      </Routes>
    </Router>
  );
}
