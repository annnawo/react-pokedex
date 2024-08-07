import React, { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import { Link } from "react-router-dom";

const PokemonList = ({ currentCards }) => {
  return (
    <div>
      {currentCards.map((pokemon) => (
        <PokemonCard
          key={pokemon.id}
          pokemonNumber={pokemon.id}
          pokemonName={pokemon.name}
          pokemonTypes={pokemon.types}
          pokemonSprites={pokemon.sprites.other["official-artwork"].front_default}
        />
      ))}
    </div>
  );
};

function PokemonCard(props) {
  return (
    <div>
      <Link to={`/pokemon-details/${props.pokemonName.toLowerCase()}`}>
      <div className="card-name-and-number">
        <h3 className="pokemon-number">{props.pokemonNumber}</h3>
        <h2 className="pokemon-name">{props.pokemonName}</h2>
      </div>
      <div className="card-types">
        <ul>
          {props.pokemonTypes.map((typeInfo, index) => (
            <li key={index}>{typeInfo.type.name}</li>
          ))}
        </ul>
      </div>
      <div>
        <img src={props.pokemonSprites} alt={props.pokemonName} />
      </div>
      </Link>
    </div>
  );
}

const fetchPokemonData = async (offset) => {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=20`);
  const data = await response.json();
  const pokemonDetails = await Promise.all(data.results.map(async (pokemon) => {
    const res = await fetch(pokemon.url);
    return await res.json();
  }));
  return { pokemonDetails, totalCount: data.count };
};

const PaginatedPokemonList = ({ allPokemon, setAllPokemon }) => {
  // const [allPokemon, setAllPokemon] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [searchInputText, setSearchInputText] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllPokemonData = async () => {
      try {
        const limit = 20;
        let offset = 0;
        let allPokemonData = [];
        let totalCount = 0;

        do {
          const { pokemonDetails, totalCount: newTotalCount } = await fetchPokemonData(offset);
          allPokemonData = [...allPokemonData, ...pokemonDetails];
          totalCount = newTotalCount;
          offset += limit;
        } while (offset < totalCount);

        setAllPokemon(allPokemonData);
        setPageCount(Math.ceil(totalCount / limit));
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchAllPokemonData();
  }, []);

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  const filteredPokemon = allPokemon.filter(pokemon =>
    pokemon.name.toLowerCase().includes(searchInputText.toLowerCase()) ||
    pokemon.id.toString() === searchInputText
  );

  const currentCards = filteredPokemon.slice(currentPage * 20, (currentPage + 1) * 20);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="search-and-filter-bar">
        <h1>Pokédex</h1>
        <div>
          <SearchBar searchInputText={searchInputText} onSearchInputText={setSearchInputText} />
        </div>
        <div>
          <button>Advanced Filters</button>
        </div>
      </div>
      <PokemonList currentCards={currentCards} />
      <ReactPaginate
        breakLabel="..."
        nextLabel="next >"
        onPageChange={handlePageClick}
        pageRangeDisplayed={5}
        pageCount={pageCount}
        previousLabel="< previous"
        renderOnZeroPageCount={null}
      />
    </>
  );
}

function SearchBar({ searchInputText, onSearchInputText }) {
  return (
    <>
      <label htmlFor="name-number-search">Search by Name or Number</label>
      <input type="text" id="name-number-search" value={searchInputText} name="name-number-search" onChange={(e) => {
        onSearchInputText(e.target.value);
      }} />
    </>
  )
}

export default PaginatedPokemonList;
