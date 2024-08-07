import { React, useState } from "react";
// import Navbar from "./components/Navbar/Navbar.js";
// import Navbar from "./components/Navbar.js";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PaginatedPokemonList from "./pages/all-pokemon.js";
import PokemonDetails from "./pages/pokemon-detail.js";

export default function App() {
  const [allPokemon, setAllPokemon] = useState([]);
  return (
    <Router>
      {/* <Navbar /> */}
      <Routes>
        <Route exact path="/" element={<PaginatedPokemonList allPokemon={allPokemon} setAllPokemon={setAllPokemon} />} />
        <Route path="/pokemon-details/:name" element={<PokemonDetails allPokemon={allPokemon} />} />

        {/* <Route path="/about" element={<About />} /> */}
      </Routes>
    </Router>
  );
}
