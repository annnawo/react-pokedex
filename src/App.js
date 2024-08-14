import { React, useState } from "react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import Navbar from "./components/Navbar/Navbar.js";
// import Navbar from "./components/Navbar.js";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PaginatedPokemonList from "./pages/all-pokemon.js";
import PokemonDetails from "./pages/pokemon-detail.js";
import './css/styles.css';

const queryClient = new QueryClient();

export default function App() {
  const [allPokemon, setAllPokemon] = useState([]);
  return (
    <QueryClientProvider client={queryClient}>
    <Router>
      {/* <Navbar /> */}
      <Routes>
        <Route exact path="/" element={<PaginatedPokemonList  allPokemon={allPokemon} setAllPokemon={setAllPokemon}  />} />
        <Route path="/pokemon-details/:name" element={<PokemonDetails allPokemon={allPokemon} />} />
      </Routes>
    </Router>
    </QueryClientProvider>
  );
}
