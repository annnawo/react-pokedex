import React, { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";

const PokemonList = ({ currentCards }) => {
  return (
    <div>
      <div className="search-and-filter-bar">
        <h1>Pokédex</h1>
        <div>
          <label htmlFor="name-number-search">Search by Name or Number</label>
          <input type="text" id="name-number-search" />
        </div>
        <div>
          <button>Advanced Filters</button>
        </div>
      </div>

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
    </div>
  );
}

function PaginatedPokemonList() {
  const [allPokemon, setPokemon] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [error, setError] = useState(null);

  const cacheKey = `pokemon_page_${currentPage}`;

  useEffect(() => {
    const fetchData = async (offset = 0) => {
      try {
        const cachedData = localStorage.getItem(cacheKey);

        if (cachedData) {
          const parsedData = JSON.parse(cachedData);
          setPokemon(parsedData.pokemonDetails);
          setPageCount(Math.ceil(parsedData.totalCount / 20));
        } else {
          const response = await fetch(
            `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=20`
          );
          if (!response.ok) {
            throw new Error(`HTTP error! status ${response.status}`);
          }
          const data = await response.json();

          // Fetch detailed data for each Pokemon
          const pokemonDetails = await Promise.all(
            data.results.map(async (pokemon) => {
              const res = await fetch(pokemon.url);
              return await res.json();
            })
          );

          setPokemon(pokemonDetails);
          setPageCount(Math.ceil(data.count / 20));

          // Cache the fetched data
          localStorage.setItem(
            cacheKey,
            JSON.stringify({ pokemonDetails, totalCount: data.count })
          );
        }
      } catch (error) {
        console.error("Fetch error: ", error);
        setError(error.message);
      }
    };

    fetchData(currentPage * 20);
  }, [currentPage, cacheKey]);

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  return (
    <>
      <PokemonList currentCards={allPokemon} />
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

export default PaginatedPokemonList;
