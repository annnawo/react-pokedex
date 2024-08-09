import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import FemaleSymbol from '../assets/images/icons/noun-female.png';
import MaleSymbol from '../assets/images/icons/noun-male.png';
import GenderlessSymbol from '../assets/images/icons/noun-genderless.png';

// useeffect to call a function that calls the species url for the pokemon

function PokemonDetails({ allPokemon }) {
    const { name } = useParams();
    const pokemon = allPokemon.find(p => p.name.toLowerCase() === name.toLowerCase());
    const [japaneseName, setJapaneseName] = useState('');
    const [flavorText, setFlavorText] = useState('');
    const [genderOptions, setGenderOptions] = useState('');
    const [genus, setGenus] = useState('');

    console.log(genderOptions);
    console.log(genus);

    useEffect(() => {
        const fetchSpeciesData = async () => {
            try {
                const response = await fetch(pokemon.species.url)
                const data = await response.json();
                const nameInJapanese = data.names.find(n => n.language.name === 'ja').name;
                setJapaneseName(nameInJapanese);
                let speciesFlavorText = data.flavor_text_entries[0].flavor_text;
                const newlineFormfeedRegex = /[\n\f]/g;
                speciesFlavorText = speciesFlavorText.replace(newlineFormfeedRegex, ' ');
                setFlavorText(speciesFlavorText);
                setGenderOptions(data.gender_rate);
                const category = data.genera[7].genus;
                setGenus(category);
            }
            catch (error) {
                console.error("Error fetching species data: ", error.message);
            }
        };
        if (pokemon) {
            fetchSpeciesData();
        }
    }, [pokemon]);

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
            <div>
                <div>
                    <div className="gradient-ellipse-main"></div>
                    <img src={pokemon.sprites.other['official-artwork'].front_default} alt={`Official sprite for ${pokemon.name}`} />
                </div>
            </div>
            <div>{japaneseName}</div>
            <div><DetailTable pokemon={pokemon} flavorText={flavorText} genderOptions={genderOptions} genus={genus} /></div>
        </div>
    );
};

function DetailTable({ pokemon, flavorText, genderOptions, genus }) {
    const [detailTab, setDetailTab] = useState('about');
    const [detailTabContents, setDetailTabContents] = useState()

    useEffect(() => {
        handleChangeTab({ target: { value: 'about' } });
    }, []);

    const handleChangeTab = (e) => {
        setDetailTab(e.target.value);
        if (detailTab === 'about') {
            setDetailTabContents(<>
                <div>{flavorText}</div>
                <div>
                    <div>Category: {genus}</div>
                    <div>{decimeterToImperial(pokemon.height)}</div>
                    <div>{hectogramToPound(pokemon.weight)}</div>
                    <ul>
                        {pokemon.abilities.map((ability) => {
                            return <li key={ability.ability.name}>{ability.ability.name}</li>;
                        })}
                    </ul>
                    <div>
                        {genderOptions === -1 ? <img src={GenderlessSymbol} alt="Genderless/Gender Unknown" /> : genderOptions === 8 ? <img src={FemaleSymbol} alt="Only Female" /> : genderOptions === 0 ? <img src={MaleSymbol} alt="Only Male" /> : <div><img src={FemaleSymbol} alt="Female symbol" /><img src={MaleSymbol} alt="Male symbol" /></div>}
                    </div>
                </div>
            </>)
        } else if (detailTab === 'stats') {
            setDetailTabContents(<>
                <div><p>Super effective against:</p></div>
                <div><p>Not very effective against:</p></div>
                <div><p>Weak against:</p></div>
                <div><table>
                    <tbody>
                        <tr>
                            <td>HP</td>
                            <td>{pokemon.stats.find(n => n.stat.name === 'hp').base_stat}</td>
                            <td>
                                {[...Array(Math.round(pokemon.stats.find(n => n.stat.name === 'hp').base_stat / 15)).keys()].map(key => (
                                    <span key={key}>test</span>
                                ))}
                                {[...Array(15 - Math.round(pokemon.stats.find(n => n.stat.name === 'hp').base_stat / 15)).keys()].map(key => (
                                    <span key={key}>test2</span>
                                ))}
                            </td>
                        </tr>
                        <tr>
                            <td>ATTACK</td>
                            <td>{pokemon.stats.find(n => n.stat.name === 'attack').base_stat}</td>
                            <td>
                                {[...Array(Math.round(pokemon.stats.find(n => n.stat.name === 'attack').base_stat / 15)).keys()].map(key => (
                                    <span key={key}>test</span>
                                ))}
                                {[...Array(15 - Math.round(pokemon.stats.find(n => n.stat.name === 'attack').base_stat / 15)).keys()].map(key => (
                                    <span key={key}>test2</span>
                                ))}
                            </td>
                        </tr>
                        <tr>
                            <td>DEFENSE</td>
                            <td>{pokemon.stats.find(n => n.stat.name === 'defense').base_stat}</td>
                            <td>
                                {[...Array(Math.round(pokemon.stats.find(n => n.stat.name === 'defense').base_stat / 15)).keys()].map(key => (
                                    <span key={key}>test</span>
                                ))}
                                {[...Array(15 - Math.round(pokemon.stats.find(n => n.stat.name === 'defense').base_stat / 15)).keys()].map(key => (
                                    <span key={key}>test2</span>
                                ))}
                            </td>
                        </tr>
                        <tr>
                            <td>SP. ATK</td>
                            <td>{pokemon.stats.find(n => n.stat.name === 'special-attack').base_stat}</td>
                            <td>
                                {[...Array(Math.round(pokemon.stats.find(n => n.stat.name === 'special-attack').base_stat / 15)).keys()].map(key => (
                                    <span key={key}>test</span>
                                ))}
                                {[...Array(15 - Math.round(pokemon.stats.find(n => n.stat.name === 'special-attack').base_stat / 15)).keys()].map(key => (
                                    <span key={key}>test2</span>
                                ))}
                            </td>
                        </tr>
                        <tr>
                            <td>SP. DEF</td>
                            <td>{pokemon.stats.find(n => n.stat.name === 'special-defense').base_stat}</td>
                            <td>
                                {[...Array(Math.round(pokemon.stats.find(n => n.stat.name === 'special-defense').base_stat / 15)).keys()].map(key => (
                                    <span key={key}>test</span>
                                ))}
                                {[...Array(15 - Math.round(pokemon.stats.find(n => n.stat.name === 'special-defense').base_stat / 15)).keys()].map(key => (
                                    <span key={key}>test2</span>
                                ))}
                            </td>
                        </tr>
                        <tr>
                            <td>SPEED</td>
                            <td>{pokemon.stats.find(n => n.stat.name === 'speed').base_stat}</td>
                            <td>
                                {[...Array(Math.round(pokemon.stats.find(n => n.stat.name === 'speed').base_stat / 15)).keys()].map(key => (
                                    <span key={key}>test</span>
                                ))}
                                {[...Array(15 - Math.round(pokemon.stats.find(n => n.stat.name === 'speed').base_stat / 15)).keys()].map(key => (
                                    <span key={key}>test2</span>
                                ))}
                            </td>
                        </tr>
                    </tbody>
                </table></div>
            </>)
        } else if (detailTab === 'evolutions') {
            setDetailTabContents(<>
            
            </>)
        }
    }

    function decimeterToImperial(decimeters) {
        let totalInches = Math.ceil(decimeters * 3.937);
        let feet = Math.floor(totalInches / 12);
        let inches = totalInches % 12;
        inches = inches < 10 ? `0${inches}` : inches;
        return `${feet}' ${inches}"`
    }

    function hectogramToPound(hectograms) {
        return (hectograms / 4.536).toFixed(1);
    }
    console.log(pokemon.abilities);
    {
        pokemon.abilities.map((ability) => {
            console.log(ability.ability.name);
        })
    }

    return (
        <div>
            <div>
                <button value="about" onClick={handleChangeTab}>About</button>
                <button value="stats" onClick={handleChangeTab}>Stats</button>
                <button value="evolutions" onClick={handleChangeTab}>Evolutions</button>
            </div>
            {detailTabContents}
        </div>
    );
}

const fetchJapaneseName = async (url) => {
    const response = await fetch({ url });
    const data = await response.json();
    const pokemonSpeciesDetails = await Promise.all(data.results.map(async (pokemon) => {
        const res = await fetch(pokemon.url);
        return await res.json();
    }));
    return { pokemonSpeciesDetails }
}

export default PokemonDetails;