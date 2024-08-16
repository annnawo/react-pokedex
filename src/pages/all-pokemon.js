import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import ReactPaginate from "react-paginate";
import { Link } from "react-router-dom";


// Fetch all Pokémon data
const fetchAllPokemonData = async () => {
  const limit = 20; // Fetch in chunks of 20 Pokémon
  let offset = 0;
  let allPokemonData = [];
  let totalCount = 0;

  // Fetch initial data to get total count
  const { pokemonDetails, count } = await fetchPokemonData(offset);
  totalCount = count;
  allPokemonData = [...pokemonDetails];

  // Fetch remaining data
  while (offset < totalCount) {
    offset += limit;
    const { pokemonDetails: newPokemonDetails } = await fetchPokemonData(offset);
    allPokemonData = [...allPokemonData, ...newPokemonDetails];
  }

  return allPokemonData;
};

// Fetch Pokémon data with pagination
const fetchPokemonData = async (offset) => {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=20`);
  const data = await response.json();
  const pokemonDetails = await Promise.all(data.results.map(async (pokemon) => {
    const res = await fetch(pokemon.url);
    return await res.json();
  }));
  return { pokemonDetails, count: data.count };
};

const PaginatedPokemonList = ({ allPokemon, setAllPokemon }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [searchInputText, setSearchInputText] = useState('');

  const { data: allPokemonData, error, isLoading } = useQuery({
    queryKey: ['allPokemon'],
    queryFn: fetchAllPokemonData,
    staleTime: Infinity,
    cacheTime: Infinity, 
  });

  const handleAdvancedFilters = () => {
    console.log('test');
  };

  // Set the `allPokemon` state only after data has been fetched
  useEffect(() => {
    if (allPokemonData) {
      setAllPokemon(allPokemonData);
    }
  }, [allPokemonData, setAllPokemon]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const totalCount = allPokemon.length;
  const filteredPokemon = allPokemon.filter(pokemon =>
    pokemon.name.toLowerCase().includes(searchInputText.toLowerCase()) ||
    pokemon.id.toString() === searchInputText
  );

  const currentCards = filteredPokemon.slice(currentPage * 20, (currentPage + 1) * 20);

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  return (
    <div className="dark-grey-background">
      <div className="main-page-navbar">
      <h1 className="pokedex-title">Pokédex</h1>
      <div className="search-bar-w-label"><label htmlFor="search-input-bar"></label>
        Search by Name or Number
      <input
        type="text"
        value={searchInputText}
    id="search-input-bar"
        onChange={(e) => setSearchInputText(e.target.value)}
      />
</div>
      <button onClick={handleAdvancedFilters}>Advanced Filters</button>
      </div>
      <PokemonList currentCards={currentCards} />
      <ReactPaginate
        pageCount={Math.ceil(totalCount / 20)}
        onPageChange={handlePageClick}
        containerClassName={"pagination"}
        activeClassName={"active"}
      />
    </div>
  );
};
const PokemonList = ({ currentCards }) => {
  return (
    <div className="all-pokemon-cards">
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
  const typeBackgrounds = {
    fire: require('../assets/images/backgrounds/fire-type-gradient.jpeg'),
    water: require('../assets/images/backgrounds/water-type-gradient.jpg'),
    grass: require('../assets/images/backgrounds/grass-type-gradient.jpg'),
    
  };
  
  const firstType = props.pokemonTypes[0].type.name;
  // Get the corresponding background image
  const backgroundImage = typeBackgrounds[firstType];
  // Apply the background image as an inline style
  const cardStyle = {
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    borderRadius: '15px',
  };

  return (
    <div className="pokemon-card-div" style={cardStyle}>
      <Link to={`/pokemon-details/${props.pokemonName.toLowerCase()}`}>
      <div className="card-name-number-types">
        <div className="card-name-and-number">
          <h3 className="pokemon-number">#{props.pokemonNumber}</h3>
          <h2 className="pokemon-name">{props.pokemonName}</h2>
        </div>
        <div className="card-types">
          <ul>
            {props.pokemonTypes.map((typeInfo, index) => (
              <li key={index}> <img src={require(`../assets/images/icons/${typeInfo.type.name}-type-icon.png`)} alt={typeInfo.type.name} className="type-symbol" /> </li>
            ))}
          </ul>
        </div>
        </div>
        <div className="card-sprite-holder">
          <img src={props.pokemonSprites} alt={props.pokemonName} className="pokemon-card-sprites" />
        </div>
      </Link>
    </div>
  );
}

export default PaginatedPokemonList;
