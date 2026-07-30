import React, { useEffect, useRef, useState, useCallback } from 'react'
import './styles.css'
import flag from '../../assets/japan-flag.png'
import { FiPlusCircle } from "react-icons/fi";
import { LuRefreshCw } from "react-icons/lu";
import { FaTrash } from "react-icons/fa";
import { BsStars } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { Position } from '../../helpers/Enums';

const Drafting = () => {

    const navigate = useNavigate()

    const initialTeamArray = [
        {
            index: 1,
            position: Position.GK,
        },
        {
            index: 2,
            position: Position.LB,
        },
        {
            index: 3,
            position: Position.LCB,
        },
        {
            index: 4,
            position: Position.RCB,
        },
        {
            index: 5,
            position: Position.RB,
        },
        {
            index: 6,
            position: Position.CDM,
        },
        {
            index: 7,
            position: Position.CM,
        },
        {
            index: 8,
            position: Position.CAM,
        },
        {
            index: 9,
            position: Position.LW,
        },
        {
            index: 10,
            position: Position.ST,
        },
        {
            index: 11,
            position: Position.RW,
        }
    ]

    const [pokemons, setPokemons] = useState([])
    const [gotPokemonPool, setGotPokemonPool] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [userTeam, setUserTeam] = useState(initialTeamArray)
    const [refreshUsed, setRefreshUsed] = useState(0)
    const [loadingAiTeams, setLoadingAiTeams] = useState(false)

    const fetchPokemons = useCallback(async (amount = 16) => {
        const TOTAL_POKEMONS = 1025
        let foundPokemons = []

        try {
            const randomIds = new Set()
            while (randomIds.size < amount) {
                const randomId = Math.floor(Math.random() * TOTAL_POKEMONS) + 1
                randomIds.add(randomId)
            }

            const promises = Array.from(randomIds).map(id =>
                fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then(res => {
                    if (!res.ok) throw new Error(`Erro ao buscar o Pokémon ID: ${id}`)
                    return res.json()
                })
            );

            const results = await Promise.all(promises)

            const formattedPokemons = results.map(poke => {
                const hp = poke.stats.find(s => s.stat.name === 'hp')?.base_stat || 0;
                const attack = poke.stats.find(s => s.stat.name === 'attack')?.base_stat || 0;
                const defense = poke.stats.find(s => s.stat.name === 'defense')?.base_stat || 0;
                const special_attack = poke.stats.find(s => s.stat.name === 'special-attack')?.base_stat || 0;
                const special_defense = poke.stats.find(s => s.stat.name === 'special-defense')?.base_stat || 0;
                const speed = poke.stats.find(s => s.stat.name === 'speed')?.base_stat || 0;

                const overall = Math.floor((hp + attack + defense + special_attack + special_defense + speed) / 6);

                const isShiny = Math.random() < 0.04

                return {
                    ...poke,
                    id: poke.id,
                    name: poke.name.charAt(0).toUpperCase() + poke.name.slice(1),
                    image: isShiny ? poke.sprites.other?.[`official-artwork`]?.front_shiny : poke.sprites.other?.[`official-artwork`]?.front_default,
                    shiny: isShiny,
                    types: poke.types.map(t => t.type.name),
                    hp: isShiny ? Math.round(hp * 1.1) : hp,
                    attack: isShiny ? Math.round(attack * 1.1) : attack,
                    defense: isShiny ? Math.round(defense * 1.1) : defense,
                    special_attack: isShiny ? Math.round(special_attack * 1.1) : special_attack,
                    special_defense: isShiny ? Math.round(special_defense * 1.1) : special_defense,
                    speed: isShiny ? Math.round(speed * 1.1) : speed,
                    original_hp: isShiny ? Math.round(hp * 1.1) : hp,
                    original_attack: isShiny ? Math.round(attack * 1.1) : attack,
                    original_defense: isShiny ? Math.round(defense * 1.1) : defense,
                    original_special_attack: isShiny ? Math.round(special_attack * 1.1) : special_attack,
                    original_special_defense: isShiny ? Math.round(special_defense * 1.1) : special_defense,
                    original_speed: isShiny ? Math.round(speed * 1.1) : speed,
                    overall: isShiny ? Math.round(overall * 1.1) : overall,
                };
            });

            foundPokemons = formattedPokemons
        } catch (err) {
            console.error("Error:", err)
            setError("Unable to load Pokémons.")
        } finally {
            setGotPokemonPool(true)
            setLoading(false)
        }

        return foundPokemons
    }, []);

    const getRandomPokemons = useCallback(async (amount = 16) => {
        setPokemons([])
        const TOTAL_POKEMONS = 1025
        setError(null)
        setLoading(true)

        try {
            const formattedPokemons = await fetchPokemons(amount)

            setPokemons(formattedPokemons)
        } catch (err) {
            console.error("Error:", err)
            setError("Unable to load Pokémons.")
        } finally {
            setGotPokemonPool(true)
            setLoading(false)
        }
    }, []);

    const generateAITeams = async () => {
        const aiNames = ["Red", "Blue", "Cynthia", "Lance", "Brock", "Misty", "Steven"]
        let enemies = []
        for (let i = 0; i < 7; i++) {
            const enemyPokemons = await fetchPokemons(11)
            enemies.push({
                name: aiNames[i],
                players:
                    initialTeamArray.map((slot, idx) => {
                        const rawPokemon = enemyPokemons[idx];

                        const pokemonInSlot = {
                            ...rawPokemon,
                            index: slot.index,
                            position: slot.position
                        };

                        return recalculateStats(pokemonInSlot);
                    })
            })
        }
        console.log('enemies', enemies)
        return enemies
    };

    useEffect(() => {
        !gotPokemonPool && getRandomPokemons();
    }, []);

    const recalculateStats = (pokemon) => {
        let updatedPokemon = pokemon
        if ([
            Position.GK,
        ].includes(pokemon.position)) {
            const hp = Math.round(pokemon.original_hp * 1.4)
            const attack = Math.round(pokemon.original_attack * 0.6)
            const defense = Math.round(pokemon.original_defense * 1.4)
            const special_attack = Math.round(pokemon.original_special_attack * 0.6)
            const special_defense = Math.round(pokemon.original_special_defense * 1.4)
            const speed = Math.round(pokemon.original_speed * 0.6)

            const overall = Math.floor((hp + attack + defense + special_attack + special_defense + speed) / 6);

            updatedPokemon = {
                ...updatedPokemon,
                hp,
                attack,
                defense,
                special_attack,
                special_defense,
                speed,
                overall
            }
        } else if ([
            Position.LB,
            Position.RB,
        ].includes(pokemon.position)) {
            const hp = Math.round(pokemon.original_hp * 0.7)
            const attack = Math.round(pokemon.original_attack * 0.9)
            const defense = Math.round(pokemon.original_defense * 1.1)
            const special_attack = Math.round(pokemon.original_special_attack * 0.9)
            const special_defense = Math.round(pokemon.original_special_defense * 1.1)
            const speed = Math.round(pokemon.original_speed * 1.3)

            const overall = Math.floor((hp + attack + defense + special_attack + special_defense + speed) / 6);

            updatedPokemon = {
                ...updatedPokemon,
                hp,
                attack,
                defense,
                special_attack,
                special_defense,
                speed,
                overall
            }
        } else if ([
            Position.LCB,
            Position.RCB
        ].includes(pokemon.position)) {
            const hp = Math.round(pokemon.original_hp * 1.2)
            const attack = Math.round(pokemon.original_attack * 0.8)
            const defense = Math.round(pokemon.original_defense * 1.2)
            const special_attack = Math.round(pokemon.original_special_attack * 0.8)
            const special_defense = Math.round(pokemon.original_special_defense * 1.2)
            const speed = Math.round(pokemon.original_speed * 0.8)

            const overall = Math.floor((hp + attack + defense + special_attack + special_defense + speed) / 6);

            updatedPokemon = {
                ...updatedPokemon,
                hp,
                attack,
                defense,
                special_attack,
                special_defense,
                speed,
                overall
            }
        } else if ([
            Position.CDM,
            Position.CM,
            Position.CAM,
        ].includes(pokemon.position)) {
            const hp = Math.round(pokemon.original_hp * 1.1)
            const attack = Math.round(pokemon.original_attack * 1.1)
            const defense = Math.round(pokemon.original_defense * 1.1)
            const special_attack = Math.round(pokemon.original_special_attack * 0.9)
            const special_defense = Math.round(pokemon.original_special_defense * 0.9)
            const speed = Math.round(pokemon.original_speed * 0.9)

            const overall = Math.floor((hp + attack + defense + special_attack + special_defense + speed) / 6);

            updatedPokemon = {
                ...updatedPokemon,
                hp,
                attack,
                defense,
                special_attack,
                special_defense,
                speed,
                overall
            }
        } else if ([
            Position.LW,
            Position.RW,
        ].includes(pokemon.position)) {
            const hp = Math.round(pokemon.original_hp * 0.7)
            const attack = Math.round(pokemon.original_attack * 1.2)
            const defense = Math.round(pokemon.original_defense * 0.8)
            const special_attack = Math.round(pokemon.original_special_attack * 1.2)
            const special_defense = Math.round(pokemon.original_special_defense * 0.8)
            const speed = Math.round(pokemon.original_speed * 1.3)

            const overall = Math.floor((hp + attack + defense + special_attack + special_defense + speed) / 6);

            updatedPokemon = {
                ...updatedPokemon,
                hp,
                attack,
                defense,
                special_attack,
                special_defense,
                speed,
                overall
            }
        }  else if ([
            Position.ST
        ].includes(pokemon.position)) {
            const hp = Math.round(pokemon.original_hp * 1.1)
            const attack = Math.round(pokemon.original_attack * 1.3)
            const defense = Math.round(pokemon.original_defense * 0.7)
            const special_attack = Math.round(pokemon.original_special_attack * 1.3)
            const special_defense = Math.round(pokemon.original_special_defense * 0.7)
            const speed = Math.round(pokemon.original_speed * 0.9)

            const overall = Math.floor((hp + attack + defense + special_attack + special_defense + speed) / 6);

            updatedPokemon = {
                ...updatedPokemon,
                hp,
                attack,
                defense,
                special_attack,
                special_defense,
                speed,
                overall
            }
        }
        return updatedPokemon
    }

    const handleDragFromPool = (e, pokemon) => {
        e.dataTransfer.setData("pokemon", JSON.stringify(pokemon));
        e.dataTransfer.setData("source", "pool");
    };

    const handleDragFromTeam = (e, slotIndex) => {
        e.dataTransfer.setData("sourceIndex", slotIndex.toString());
        e.dataTransfer.setData("source", "team");
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e, targetIndex) => {
        e.preventDefault();
        const source = e.dataTransfer.getData("source");

        if (source === "team") {
            const sourceIndex = parseInt(e.dataTransfer.getData("sourceIndex"), 10);
            if (sourceIndex === targetIndex) return;

            setUserTeam(prevTeam => {
                const newTeam = [...prevTeam];
                const sourceSlotIdx = newTeam.findIndex(s => s.index === sourceIndex);
                const targetSlotIdx = newTeam.findIndex(s => s.index === targetIndex);

                const sourceCard = { ...newTeam[sourceSlotIdx] };
                const targetCard = { ...newTeam[targetSlotIdx] };

                newTeam[sourceSlotIdx] = recalculateStats({
                    ...targetCard,
                    index: sourceCard.index,
                    position: sourceCard.position
                });

                newTeam[targetSlotIdx] = recalculateStats({
                    ...sourceCard,
                    index: targetCard.index,
                    position: targetCard.position
                });

                return newTeam;
            });
        }

        else if (source === "pool") {
            const pokemonData = e.dataTransfer.getData("pokemon");
            if (!pokemonData) return;
            const droppedPokemon = JSON.parse(pokemonData);

            setUserTeam(prevTeam => prevTeam.map(slot => {

                if (slot.index === targetIndex) {
                    const updatedStats = recalculateStats({
                        ...droppedPokemon,
                        index: slot.index,
                        position: slot.position
                    })
                    return updatedStats;
                }
                return slot;
            }));
        }
    };

    const getRankingClass = (overall) => {
        if (!overall) return '';
        return overall > 94 ? 'legend' : overall > 74 ? 'gold' : overall > 64 ? 'silver' : 'bronze';
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div className='drafting-container'>
                <div style={{ width: '50%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                        <h1>BUILD YOUR TEAM TEAM</h1>
                        <button
                            className='reset-button'
                            onClick={() => setUserTeam(initialTeamArray)}
                        >
                            <FaTrash />
                        </button>
                    </div>
                    <div className='team-wrapper'>
                        {userTeam?.map((pokemon) => {
                            const ranking = getRankingClass(pokemon.overall);

                            return (
                                <div
                                    key={pokemon.index}
                                    className={`fifa-card-container`}
                                    onDragOver={handleDragOver}
                                    onDrop={(e) => handleDrop(e, pokemon.index)}
                                    draggable={!!pokemon.name}
                                    onDragStart={(e) => handleDragFromTeam(e, pokemon.index)}
                                >
                                    {
                                        pokemon.name ?
                                            <div className={`fifa-card-content ${ranking}`}>
                                                <div className="card-top">
                                                    <div className="card-badge">
                                                        <span className="rating">{pokemon.overall}</span>
                                                        <span className="position">{pokemon.position}</span>
                                                    </div>
                                                    <button
                                                        className='remove-pokemon-button'
                                                        onClick={() => setUserTeam((prev) =>
                                                            prev.map((pkm) =>
                                                                pkm.name === pokemon.name
                                                                    ? { index: pokemon.index, position: pokemon.position }
                                                                    : pkm
                                                            )
                                                        )}
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                </div>
                                                <div className='img-skeleton'>
                                                </div>
                                                <div className="player-image-container">
                                                    <img className="player-image" src={pokemon.image} alt={pokemon.name} />
                                                    {pokemon.shiny && <div className='shiny-badge'><BsStars /></div>}
                                                </div>

                                                <label className="name">{pokemon.name}</label>

                                                <div className="stats-grid">
                                                    <div className="stat-col">
                                                        <span
                                                            className={pokemon.original_hp > pokemon.hp ? 'nerfed' : pokemon.original_hp < pokemon.hp ? 'buffed' : ''}
                                                        ><b>HP</b> </span>
                                                        <span
                                                            className={pokemon.original_attack > pokemon.attack ? 'nerfed' : pokemon.original_attack < pokemon.attack ? 'buffed' : ''}
                                                        ><b>ATK</b> </span>
                                                        <span
                                                            className={pokemon.original_defense > pokemon.defense ? 'nerfed' : pokemon.original_defense < pokemon.defense ? 'buffed' : ''}
                                                        ><b>DEF</b> </span>
                                                        <span
                                                            className={pokemon.original_special_attack > pokemon.special_attack ? 'nerfed' : pokemon.original_special_attack < pokemon.special_attack ? 'buffed' : ''}
                                                        ><b>SPA</b> </span>
                                                        <span
                                                            className={pokemon.original_special_defense > pokemon.special_defense ? 'nerfed' : pokemon.original_special_defense < pokemon.special_defense ? 'buffed' : ''}
                                                        ><b>SPD</b> </span>
                                                        <span
                                                            className={pokemon.original_speed > pokemon.speed ? 'nerfed' : pokemon.original_speed < pokemon.speed ? 'buffed' : ''}
                                                        ><b>SPE</b> </span>
                                                    </div>
                                                    <div className="stat-col">
                                                        <span
                                                            className={pokemon.original_hp > pokemon.hp ? 'nerfed' : pokemon.original_hp < pokemon.hp ? 'buffed' : ''}
                                                        >{pokemon.hp}</span>
                                                        <span
                                                            className={pokemon.original_attack > pokemon.attack ? 'nerfed' : pokemon.original_attack < pokemon.attack ? 'buffed' : ''}
                                                        >{pokemon.attack}</span>
                                                        <span
                                                            className={pokemon.original_defense > pokemon.defense ? 'nerfed' : pokemon.original_defense < pokemon.defense ? 'buffed' : ''}
                                                        >{pokemon.defense}</span>
                                                        <span
                                                            className={pokemon.original_special_attack > pokemon.special_attack ? 'nerfed' : pokemon.original_special_attack < pokemon.special_attack ? 'buffed' : ''}
                                                        >{pokemon.special_attack}</span>
                                                        <span
                                                            className={pokemon.original_special_defense > pokemon.special_defense ? 'nerfed' : pokemon.original_special_defense < pokemon.special_defense ? 'buffed' : ''}
                                                        >{pokemon.special_defense}</span>
                                                        <span
                                                            className={pokemon.original_speed > pokemon.speed ? 'nerfed' : pokemon.original_speed < pokemon.speed ? 'buffed' : ''}
                                                        >{pokemon.speed}</span>
                                                    </div>
                                                </div>
                                                <img className='flag-card' src={flag}></img>
                                            </div>
                                            :
                                            <div className="fifa-chosen-card-content">
                                                <div className="card-top">
                                                    <div className="card-badge">
                                                        <span className="rating">??</span>
                                                        <span className="position">{pokemon.position}</span>
                                                    </div>
                                                </div>
                                                <div className='img-skeleton'>
                                                </div>
                                                <label className='add-pokemon-icon'><FiPlusCircle /></label>
                                                <label className="name">POKÉMON NAME</label>

                                                <div className="stats-grid">
                                                    <div className="stat-col">
                                                        <span><b>HP</b></span>
                                                        <span><b>ATK</b> </span>
                                                        <span><b>DEF</b> </span>
                                                        <span><b>SPA</b> </span>
                                                        <span><b>SPD</b> </span>
                                                        <span><b>SPE</b> </span>
                                                    </div>
                                                    <div className="stat-col">
                                                        <span>??</span>
                                                        <span>??</span>
                                                        <span>??</span>
                                                        <span>??</span>
                                                        <span>??</span>
                                                        <span>??</span>
                                                    </div>
                                                </div>
                                                <img className='flag-card' src={flag}></img>

                                            </div>
                                    }
                                </div>
                            )
                        })
                        }
                    </div>

                </div>
                <div style={{ width: '50%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                        <h1>DRAG THE POKÉMONS TO YOUR TEAM</h1>
                        <button
                            className='reset-button'
                            onClick={() => {
                                setRefreshUsed(prev => prev + 1)
                                getRandomPokemons()
                            }}
                            disabled={refreshUsed === 2}
                        >
                            <LuRefreshCw />
                        </button>
                        <h2>{refreshUsed}/2</h2>
                    </div>
                    <div className='pokemon-wrapper'>
                        {
                            loading &&
                            Array.from({ length: 16 }, (_, index) => ({
                                id: index + 1,
                            })).map((item) => {
                                return (
                                    <div
                                        key={item.id}
                                        className="fifa-card-container"
                                        draggable={false}
                                    >
                                        <div className={`fifa-card-content skeleton`}>
                                            <span className="spinner-card"></span>

                                        </div>
                                    </div>
                                )

                            })
                        }
                        {pokemons?.map((pokemon) => {
                            const ranking = getRankingClass(pokemon.overall);
                            const blockedCard = userTeam.filter((pkm) => pkm.name == pokemon.name)?.length > 0

                            return (
                                <div
                                    key={pokemon.id}
                                    className={`fifa-card-container ` + `${blockedCard ? 'blocked' : ''}`}
                                    draggable={!blockedCard}
                                    onDragStart={(e) => handleDragFromPool(e, pokemon)}
                                >
                                    <div className={`fifa-card-content ` + ranking}>

                                        <div className="card-top">
                                            <div className="card-badge">
                                                <span className="rating">{pokemon.overall}</span>
                                                <span className="position">??</span>
                                            </div>
                                        </div>
                                        <div className='img-skeleton'>
                                        </div>
                                        <div className="player-image-container">
                                            <img className="player-image" src={pokemon.image} alt={pokemon.name} />
                                            {pokemon.shiny && <div className='shiny-badge'><BsStars /></div>}
                                        </div>

                                        <label className="name">{pokemon.name}</label>

                                        <div className="stats-grid">
                                            <div className="stat-col">
                                                <span><b>HP</b></span>
                                                <span><b>ATK</b> </span>
                                                <span><b>DEF</b> </span>
                                                <span><b>SPA</b> </span>
                                                <span><b>SPD</b> </span>
                                                <span><b>SPE</b> </span>
                                            </div>
                                            <div className="stat-col">
                                                <span>{pokemon.hp}</span>
                                                <span>{pokemon.attack}</span>
                                                <span>{pokemon.defense}</span>
                                                <span>{pokemon.special_attack}</span>
                                                <span>{pokemon.special_defense}</span>
                                                <span>{pokemon.speed}</span>
                                            </div>
                                        </div>
                                        <img className='flag-card' src={flag}></img>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div >


            <button
                className='ready-button'
                onClick={async () => {
                    setLoadingAiTeams(true)
                    const aiTeams = await generateAITeams()

                    navigate("/match", {
                        state: {
                            userTeam,
                            aiTeams
                        },
                    })
                }}
                disabled={!userTeam.every((pkm) => pkm.name != undefined)}
            >
                {loadingAiTeams ? <span className="spinner-card-black"></span> : "I'M READY!"}
            </button>
        </div>
    )
}

export default Drafting
