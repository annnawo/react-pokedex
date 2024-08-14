import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import FemaleSymbol from '../assets/images/icons/noun-female.png';
import MaleSymbol from '../assets/images/icons/noun-male.png';
import GenderlessSymbol from '../assets/images/icons/noun-genderless.png';


function PokemonDetails({ allPokemon }) {
    const { name } = useParams();
    const pokemon = allPokemon.find(p => p.name.toLowerCase() === name.toLowerCase());
    const [japaneseName, setJapaneseName] = useState('');
    const [flavorText, setFlavorText] = useState('');
    const [genderOptions, setGenderOptions] = useState('');
    const [genus, setGenus] = useState('');
    const [evolutionURL, setEvolutionURL] = useState('');
    const [evolutionDetails, setEvolutionDetails] = useState([]);

    useEffect(() => {
        const fetchSpeciesData = async () => {
            try {
                const response = await fetch(pokemon.species.url);
                const data = await response.json();
    
                // Extract relevant data and update states
                const nameInJapanese = data.names.find(n => n.language.name === 'ja').name;
                setJapaneseName(nameInJapanese);
                let speciesFlavorText = data.flavor_text_entries.find(n => n.language.name === 'en').flavor_text;
                const newlineFormfeedRegex = /[\n\f]/g;
                speciesFlavorText = speciesFlavorText.replace(newlineFormfeedRegex, ' ');
                setFlavorText(speciesFlavorText);
                setGenderOptions(data.gender_rate);
                const category = data.genera[7].genus;
                setGenus(category);
    
                // Set the evolution chain URL
                setEvolutionURL(data.evolution_chain.url);
            } catch (error) {
                console.error("Error fetching species data: ", error.message);
            }
        };
    
        if (pokemon) {
            fetchSpeciesData();
        }
    }, [pokemon]); 
    
    useEffect(() => {
        const fetchEvolutionData = async () => {
            try {
                const response = await fetch(evolutionURL);
                const data = await response.json();
                
                // Array to store evolution details
                const newEvolutionDetails = []; 
    
                const processEvolutionChain = async (chain) => {
                    const pokemonName = chain.species.name;
                    
                    // Fetch details for this Pokemon
                    const detailsResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
                    const detailsData = await detailsResponse.json();
                    
                    // Add evolution details
                    newEvolutionDetails.push({
                        name: pokemonName,
                        details: detailsData,
                        evolutionDetails: chain.evolution_details.map(detail => ({
                            trigger: detail.trigger.name,
                            item: detail.item ? detail.item.name : null,
                            location: detail.location ? detail.location.name : null,
                            min_affection: detail.min_affection ? detail.min_affection : null,
                            min_beauty: detail.min_beauty ? detail.min_beauty : null,
                            min_happiness: detail.min_happiness ? detail.min_happiness: null,
                            min_level: detail.min_level ? detail.min_level : null,
                            time_of_day: detail.time_of_day ? detail.time_of_day : null,
                        }))
                    });
                    
                    // Process next evolutions recursively
                    if (chain.evolves_to.length > 0) {
                        for (const nextStage of chain.evolves_to) {
                            await processEvolutionChain(nextStage);
                        }
                    }
                };
    
                // Start processing the evolution chain
                await processEvolutionChain(data.chain);
                
                // Update state with all evolution details
                setEvolutionDetails(newEvolutionDetails);
            } catch (error) {
                console.error("Error fetching evolution data:", error.message);
            }
        };
        
        if (evolutionURL) {
            fetchEvolutionData();
        }
    }, [evolutionURL]);
    

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
            <div><DetailTable pokemon={pokemon} flavorText={flavorText} genderOptions={genderOptions} genus={genus} evolutionDetails={evolutionDetails} /></div> 
        </div>
    );
};

function DetailTable({ pokemon, flavorText, genderOptions, genus, evolutionDetails }) {
    const [detailTab, setDetailTab] = useState('about');
    const [detailTabContents, setDetailTabContents] = useState(null)

    useEffect(() => {
        handleChangeTab({ target: { value: 'about' } });
    });

    const handleChangeTab = (e) => {
        const selectedTab = e.target.value;
        setDetailTab(selectedTab);
        if (selectedTab === 'about') {
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
            </>);
        } else if (selectedTab === 'stats') {
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
            </>);
        } else if (selectedTab === 'evolutions') {
            setDetailTabContents(<div>
            <h3>Evolution Chain</h3>
            {evolutionDetails.map((evolution, index) => (
                <div key={index}>
                     <ul>
                        {evolution.evolutionDetails.map((detail, detailIndex) => (
                           <React.Fragment key={detailIndex}>
                            {detail.item != null && detail.item.trim() != "" ? <li>
                               Item: {detail.item.replace('-', ' ')}
                           </li> : <></>}
                           {detail.location != null && detail.location.trim() != "" ? <li>
                               Location: {detail.location.replace('-', ' ')}
                           </li> : <></>}
                           {detail.min_affection != null ? <li>
                               Min. Affection: {detail.min_affection}
                           </li> : <></>}
                           {detail.min_beauty != null ? <li>
                               Min. Beauty: {detail.min_beauty}
                           </li> : <></>}
                           {detail.min_happiness != null ? <li>
                               Min. Happiness: {detail.min_happiness}
                           </li> : <></>}
                           {detail.min_level != null ? <li>
                               Level: {detail.min_level}
                           </li> : <></>}
                           {detail.time_of_day != null && detail.time_of_day.trim() != "" ? <li>
                               Time of Day: {detail.time_of_day}
                           </li> : <></>}
                           <li>
                               Trigger: {detail.trigger.replace('-', ' ')}
                           </li> <br />
                       </React.Fragment>
                        ))}
                    </ul>
                    <h4>{evolution.name}</h4>
                    <img src={evolution.details.sprites.front_default} alt={`Sprite for ${evolution.name}`} />
                    <p>Type: {evolution.details.types.map(type => type.type.name).join(', ')}</p>
                   
                </div>
            ))}
            </div>);
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

const fetchEvolutionChain = async (url) => {
    const response = await fetch({ url });
    const data = await response.json();
    const evolutionDetails = await Promise.all(data.results.map(async (pokemon) => {
        const res = await fetch(pokemon.url);
        return await res.json();
    }));
    return { evolutionDetails }
}



export default PokemonDetails;