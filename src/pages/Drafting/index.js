import React, { useEffect, useRef, useState, useCallback } from 'react'
import './styles.css'
import flag from '../../assets/japan-flag.png'
import { FiPlusCircle } from "react-icons/fi";
import { LuRefreshCw } from "react-icons/lu";

const Drafting = () => {

    const Position = Object.freeze({
        GK: "GK",
        LB: "LB",
        LCB: "LCB",
        RCB: "RCB",
        RB: "RB",
        CDM: "CDM",
        CM: "CM",
        CAM: "CAM",
        LW: "LW",
        ST: "ST",
        RW: "RW",
    })

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
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [userTeam, setUserTeam] = useState(initialTeamArray)

    const getRandomPokemons = useCallback(async (amount = 30) => {
        const TOTAL_POKEMONS = 493
        setLoading(true)
        setError(null)

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

                return {
                    ...poke,
                    id: poke.id,
                    name: poke.name.charAt(0).toUpperCase() + poke.name.slice(1),
                    image: poke.sprites.other?.[`official-artwork`]?.front_default,
                    types: poke.types.map(t => t.type.name),
                    hp,
                    attack,
                    defense,
                    special_attack,
                    special_defense,
                    speed,
                    overall
                };
            });

            setPokemons(formattedPokemons)
        } catch (err) {
            console.error("Error:", err)
            setError("Unable to load Pokémons.")
        } finally {
            setLoading(false)
        }
    }, []);

    useEffect(() => {
        getRandomPokemons(30);
    }, [getRandomPokemons]);

    const recalculateOverall = (pokemon) => {
        let newOverall = 0
        if ([
            Position.GK,
            Position.LB,
            Position.RB,
            Position.LCB,
            Position.RCB
        ].includes(pokemon.position)) {
            newOverall = Math.floor(((pokemon.hp * 1.2) + (pokemon.attack * 0.8) + (pokemon.defense * 1.2) + (pokemon.special_attack * 0.8) + (pokemon.special_defense * 1.2) + (pokemon.speed * 0.8)) / 6);
        } else if ([
            Position.CDM,
            Position.CM,
            Position.CAM,
        ].includes(pokemon.position)) {
            newOverall = Math.floor(((pokemon.hp * 1) + (pokemon.attack * 1) + (pokemon.defense * 1) + (pokemon.special_attack * 1) + (pokemon.special_defense * 1) + (pokemon.speed * 1)) / 6);
        } else if ([
            Position.LW,
            Position.ST,
            Position.RW,
        ].includes(pokemon.position)) {
            newOverall = Math.floor(((pokemon.hp * 0.8) + (pokemon.attack * 1.2) + (pokemon.defense * 0.8) + (pokemon.special_attack * 1.2) + (pokemon.special_defense * 0.8) + (pokemon.speed * 1.2)) / 6);
        }
        return newOverall
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

                newTeam[sourceSlotIdx] = {
                    ...targetCard,
                    index: sourceCard.index,
                    position: sourceCard.position
                };

                newTeam[targetSlotIdx] = {
                    ...sourceCard,
                    index: targetCard.index,
                    position: targetCard.position
                };

                return newTeam;
            });
        }

        else if (source === "pool") {
            const pokemonData = e.dataTransfer.getData("pokemon");
            if (!pokemonData) return;
            const droppedPokemon = JSON.parse(pokemonData);

            setUserTeam(prevTeam => prevTeam.map(slot => {

                if (slot.index === targetIndex) {
                    const newOverall = recalculateOverall({
                        ...droppedPokemon,
                        index: slot.index,
                        position: slot.position
                    })
                    return {
                        ...droppedPokemon,
                        overall: newOverall,
                        index: slot.index,
                        position: slot.position
                    };
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
        <div className='drafting-container'>
            <div style={{ width: '40%' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                    <h1>BUILD YOUR TEAM TEAM</h1>
                    <button
                        className='reset-button'
                        onClick={() => setUserTeam(initialTeamArray)}
                    >
                        <LuRefreshCw />
                    </button>
                </div>
                <div className='team-wrapper'>
                    {userTeam?.map((pokemon) => {
                        const ranking = getRankingClass(pokemon.overall);

                        return (
                            <div
                                key={pokemon.index}
                                class={`fifa-card-container`}
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
                                            </div>
                                            <div className='img-skeleton'>
                                            </div>
                                            <div className="player-image-container">
                                                <img className="player-image" src={pokemon.image} alt={pokemon.name} />
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
            <div style={{ width: '60%' }}>
                <h1>GRAB THE POKÉMONS YOU WANT IN YOUR TEAM</h1>
                <div className='pokemon-wrapper'>
                    {pokemons?.map((pokemon) => {
                        const ranking = getRankingClass(pokemon.overall);

                        return (
                            <div
                                key={pokemon.id}
                                class="fifa-card-container"
                                draggable={true}
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

            {/* <button
                className='ready-button'
                // onClick={() => simulateMatch()}
                disabled={false}
            >
                I'm ready
            </button> */}
        </div >
    )
}

export default Drafting
