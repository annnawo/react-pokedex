import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

// useeffect to call a function that calls the species url for the pokemon

function PokemonDetails({ allPokemon }) {
    const { name } = useParams();
    console.log(allPokemon);
    const pokemon = allPokemon.find(p => p.name.toLowerCase() === name.toLowerCase());

    if (!pokemon) {
        return <div>Sorry, there isn't any data available for that Pokémon. </div>;
    }
    return (
        <div>
            <div>
            <div>
                <Link to='/'>Back To All Pokémon</Link>
            </div>
            <div>
                <div>
                <h2>#{pokemon.id}</h2>
                {pokemon.types.map((typeInfo, index) => (
                <button key={index}>{typeInfo.type.name}</button>
                 ))}
            </div>
            <div><h1>{pokemon.name}</h1></div>
            </div>
            </div>

        </div>
    );
};

export default PokemonDetails;