import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

// useeffect to call a function that calls the species url for the pokemon

function PokemonDetails({ allPokemon }) {
    const { name } = useParams();
    const pokemon = allPokemon.find(p => p.name.toLowerCase() === name.toLowerCase());
    const [japaneseName, setJapaneseName] = useState('');

    useEffect(() => {
        const fetchSpeciesData = async () => {
            try {
                const response = await fetch(pokemon.species.url)
                const data = await response.json();
                const nameInJapanese = data.names.find(n => n.language.name === 'ja').name;
                setJapaneseName(nameInJapanese);
            } 
            catch (error) {
                console.error("Error fetching species data: ", error.message);
            }
        };
        if (pokemon) {
            fetchSpeciesData();
        }
    }, [pokemon]);

    //  if (!pokemon) {
    //     return <div>Sorry, there isn't any data available for that Pokémon. </div>;
    // }

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
                 {japaneseName}
            </div>
            </div>

        </div>
    );
};

const fetchJapaneseName = async (url) => {
    const response = await fetch({url});
    const data = await response.json();
    const pokemonSpeciesDetails = await Promise.all(data.results.map(async (pokemon) => {
        const res = await fetch(pokemon.url);
        return await res.json();
        }));
        return { pokemonSpeciesDetails }
    }

export default PokemonDetails;