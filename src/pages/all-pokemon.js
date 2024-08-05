import React, { useState, useEffect } from "react";

const PokemonList = () => {
    const [allPokemon, setPokemon] = useState([])
    const [error, setError] = useState(null);

    useEffect(() => {
        const getData = async () => {
            try {
                const response = await fetch(
                    "https://api.allorigins.win/raw?url=https://www.pokeapi.co/api/v2/pokemon/jigglypuff"
                );
                if (!response.ok) {
                    throw new Error(`HTTP error! status ${response.status}`);
                }
                const data = await response.json();
                setPokemon([data]);
                console.log(data);
             }catch (error) { 
                console.error("Fetch error: ", error)
                setError(error.message);
            }
            }
            getData();
        }, []);

  return (
    <div>
        <div className="search-and-filter-bar">
            <h1>Pokédex</h1>
            <div>
                    <label htmlFor="name-number-search">Search by Name or Number</label>
                    <input type='text' id="name-number-search"></input>
                </div>
                <div>
                    <button>Advanced Filters</button>
                </div>
        </div>

        {allPokemon.map((pokemon) => {
            console.log(pokemon.sprites.other['official-artwork'].front_default);
            return (<PokemonCard key={pokemon.id} pokemonNumber={pokemon.id} pokemonName={pokemon.name} pokemonTypes={pokemon.types} pokemonSprites={pokemon.sprites.other['official-artwork'].front_default} />);
        })}
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
                {props.pokemonTypes.map((typeInfo, index) => {
                    return <li key={index}>{typeInfo.type.name}</li>;
            })}
            </ul>
            </div>
            <div></div>

        </div>
    );
}

export default PokemonList;