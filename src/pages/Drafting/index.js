import React, { useEffect, useRef, useState, useCallback } from 'react'
import './styles.css'
import flag from '../../assets/japan-flag.png'
import { MdCatchingPokemon } from "react-icons/md";
import { LuRefreshCw } from "react-icons/lu";
import { FaTrash } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import { BsStars } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { Position } from '../../helpers/Enums';
import { recalculateStats } from './utils';
import { FaLongArrowAltUp } from "react-icons/fa";
import { FaLongArrowAltDown } from "react-icons/fa";

const Drafting = () => {

    const navigate = useNavigate()

    const initialTeamArray = [
        { index: 1, position: Position.GK, },
        { index: 2, position: Position.LB, },
        { index: 3, position: Position.LCB, },
        { index: 4, position: Position.RCB, },
        { index: 5, position: Position.RB, },
        { index: 6, position: Position.LM, },
        { index: 7, position: Position.CM, },
        { index: 8, position: Position.RM, },
        { index: 9, position: Position.LW, },
        { index: 10, position: Position.ST, },
        { index: 11, position: Position.RW, }
    ]

    const [pokemons, setPokemons] = useState([])
    const [gotPokemonPool, setGotPokemonPool] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [userTeam, setUserTeam] = useState(initialTeamArray)
    const [refreshUsed, setRefreshUsed] = useState(0)
    const [loadingAiTeams, setLoadingAiTeams] = useState(false)

    const fetchPokemons = useCallback(async (amount = 24) => {
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

    const getRandomPokemons = useCallback(async (amount = 24) => {
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
        return enemies
    };

    useEffect(() => {
        !gotPokemonPool && getRandomPokemons();
    }, []);

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

    const customMarginPerPosition = {
        GK: "-5px 0 0 0",
        LB: "0 90px 15px 0",
        LCB: "20px 45px 0 0",
        RCB: "20px 0 0 45px",
        RB: "0 0 15px 90px",
        LM: "0 50px -20px 0",
        CM: "0 0 -20px 0",
        RM: "0 0 -20px 50px",
        LW: "20px 150px 0 0",
        ST: "0 0 20px 0",
        RW: "20px 0 0 150px",
    }

    const getBuffDebuff = (position, status) => {
        let arrows = <></>
        let isBuffed = false
        let isVeryBuffed = false
        let isNerfed = false
        let isVeryNerfed = false

        if (status == 'SPE') {
            isBuffed = ["LM", "RM"].includes(position)
            isVeryBuffed = ["LB", "RB", "LW", "RW"].includes(position)
            isNerfed = ["LCB", "RCB", "ST", "CM"].includes(position)
            isVeryNerfed = ["GK"].includes(position)
        }
        if (status == 'SPD') {
            isBuffed = ["LB", "RB", "LCB", "RCB", "LM", "RM"].includes(position)
            isVeryBuffed = ["GK"].includes(position)
            isNerfed = ["LW", "RW", "CM"].includes(position)
            isVeryNerfed = ["ST"].includes(position)
        }
        if (status == 'SPA') {
            isBuffed = ["LW", "RW", "LM", "RM"].includes(position)
            isVeryBuffed = ["ST"].includes(position)
            isNerfed = ["LB", "RB", "LCB", "RCB", "CM"].includes(position)
            isVeryNerfed = ["GK"].includes(position)
        }
        if (status == 'HP') {
            isBuffed = ["LCB", "RCB", "CM", "ST"].includes(position)
            isVeryBuffed = ["GK"].includes(position)
            isNerfed = ["LM", "RM"].includes(position)
            isVeryNerfed = ["LB", "RB", "LW", "RW"].includes(position)
        }
        if (status == 'ATK') {
            isBuffed = ["CM", "LW", "RW"].includes(position)
            isVeryBuffed = ["ST"].includes(position)
            isNerfed = ["LB", "RB", "LCB", "RCB", "LM", "RM"].includes(position)
            isVeryNerfed = ["GK"].includes(position)
        }
        if (status == 'DEF') {
            isBuffed = ["LB", "RB", "LCB", "RCB", "CM"].includes(position)
            isVeryBuffed = ["GK"].includes(position)
            isNerfed = ["LM", "RM", "LW", "RW"].includes(position)
            isVeryNerfed = ["ST"].includes(position)
        }

        arrows =
            isBuffed ?
                <><FaLongArrowAltUp /><FaLongArrowAltUp /></>
                : isVeryBuffed ?
                    <><FaLongArrowAltUp /><FaLongArrowAltUp /><FaLongArrowAltUp /></>
                    : isNerfed ?
                        <><FaLongArrowAltDown /><FaLongArrowAltDown /></>
                        : isVeryNerfed ?
                            <><FaLongArrowAltDown /><FaLongArrowAltDown /><FaLongArrowAltDown /></>
                            : <></>

        return arrows
    }

    const renderPokemonCard = (pokemon) => {

        const ranking = getRankingClass(pokemon.overall);

        return (
            <div
                key={pokemon.index}
                style={{ margin: customMarginPerPosition[pokemon.position] }}
                className={`fifa-card-container ${!pokemon.name && `empty-card`}`}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, pokemon.index)}
                draggable={!!pokemon.name}
                onDragStart={(e) => handleDragFromTeam(e, pokemon.index)}
            >
                {
                    pokemon.name ?
                        <div className={`fifa-card-content ${ranking}`}>
                            {pokemon.shiny && <div className='shiny-badge'>SHINY <BsStars /></div>}
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
                                    <FaXmark />
                                </button>
                            </div>
                            <div className='img-skeleton'>
                            </div>
                            <div className="player-image-container">
                                <img className="player-image" src={pokemon.image} alt={pokemon.name} />
                            </div>

                            <label className="name">{pokemon.name}</label>

                            <div className="stats-grid">
                                <div className="stat-col">
                                    <div>
                                        <span
                                            className={pokemon.original_hp > pokemon.hp ? 'nerfed' : pokemon.original_hp < pokemon.hp ? 'buffed' : ''}
                                        ><b>HP</b> </span>
                                        <span
                                            className={pokemon.original_hp > pokemon.hp ? 'nerfed' : pokemon.original_hp < pokemon.hp ? 'buffed' : ''}
                                        >{pokemon.hp}</span>
                                    </div>
                                    <div>
                                        <span
                                            className={pokemon.original_attack > pokemon.attack ? 'nerfed' : pokemon.original_attack < pokemon.attack ? 'buffed' : ''}
                                        ><b>ATK</b> </span>
                                        <span
                                            className={pokemon.original_attack > pokemon.attack ? 'nerfed' : pokemon.original_attack < pokemon.attack ? 'buffed' : ''}
                                        >{pokemon.attack}</span>
                                    </div>
                                    <div>
                                        <span
                                            className={pokemon.original_defense > pokemon.defense ? 'nerfed' : pokemon.original_defense < pokemon.defense ? 'buffed' : ''}
                                        ><b>DEF</b> </span>
                                        <span
                                            className={pokemon.original_defense > pokemon.defense ? 'nerfed' : pokemon.original_defense < pokemon.defense ? 'buffed' : ''}
                                        >{pokemon.defense}</span>
                                    </div>
                                </div>
                                <hr></hr>
                                <div className="stat-col">
                                    <div>
                                        <span
                                            className={pokemon.original_special_attack > pokemon.special_attack ? 'nerfed' : pokemon.original_special_attack < pokemon.special_attack ? 'buffed' : ''}
                                        ><b>SPA</b> </span>
                                        <span
                                            className={pokemon.original_special_attack > pokemon.special_attack ? 'nerfed' : pokemon.original_special_attack < pokemon.special_attack ? 'buffed' : ''}
                                        >{pokemon.special_attack}</span>
                                    </div>
                                    <div>
                                        <span
                                            className={pokemon.original_special_defense > pokemon.special_defense ? 'nerfed' : pokemon.original_special_defense < pokemon.special_defense ? 'buffed' : ''}
                                        ><b>SPD</b> </span>
                                        <span
                                            className={pokemon.original_special_defense > pokemon.special_defense ? 'nerfed' : pokemon.original_special_defense < pokemon.special_defense ? 'buffed' : ''}
                                        >{pokemon.special_defense}</span>
                                    </div>
                                    <div>
                                        <span
                                            className={pokemon.original_speed > pokemon.speed ? 'nerfed' : pokemon.original_speed < pokemon.speed ? 'buffed' : ''}
                                        ><b>SPE</b> </span>
                                        <span
                                            className={pokemon.original_speed > pokemon.speed ? 'nerfed' : pokemon.original_speed < pokemon.speed ? 'buffed' : ''}
                                        >{pokemon.speed}</span>
                                    </div>
                                </div>
                            </div>
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
                            <label className='add-pokemon-icon'><MdCatchingPokemon /></label>
                            <label className="name"></label>

                            <div className="stats-grid">
                                <div className="stat-col">
                                    <div>
                                        <span><b>HP</b></span>
                                        <small>{getBuffDebuff(pokemon.position, "HP")}</small>
                                    </div>
                                    <div>
                                        <span><b>ATK</b> </span>
                                        <small>{getBuffDebuff(pokemon.position, "ATK")}</small>
                                    </div>
                                    <div>
                                        <span><b>DEF</b> </span>
                                        <small>{getBuffDebuff(pokemon.position, "DEF")}</small>
                                    </div>
                                </div>
                                <hr></hr>
                                <div className="stat-col">
                                    <div>
                                        <span><b>SPA</b> </span>
                                        <small>{getBuffDebuff(pokemon.position, "SPA")}</small>
                                    </div>
                                    <div>
                                        <span><b>SPD</b> </span>
                                        <small>{getBuffDebuff(pokemon.position, "SPD")}</small>
                                    </div>
                                    <div>
                                        <span><b>SPE</b> </span>
                                        <small>{getBuffDebuff(pokemon.position, "SPE")}</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                }
            </div>
        )
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div className='drafting-container'>
                <div style={{ width: '50%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                        <h1>BUILD YOUR TEAM</h1>
                        <button
                            className='reset-button'
                            onClick={() => setUserTeam(initialTeamArray)}
                        >
                            <FaTrash />
                        </button>
                    </div>
                    <div className='team-wrapper'>
                        <div className='team-wrapper-line'>
                            {userTeam && userTeam.slice(8, 11).map((pokemon) => {
                                return renderPokemonCard(pokemon)
                            })
                            }
                        </div>
                        <div className='team-wrapper-line'>
                            {userTeam && userTeam.slice(5, 8).map((pokemon) => {
                                return renderPokemonCard(pokemon)
                            })
                            }
                        </div>
                        <div className='team-wrapper-line'>
                            {userTeam && userTeam.slice(1, 5).map((pokemon) => {
                                return renderPokemonCard(pokemon)
                            })
                            }
                        </div>
                        <div className='team-wrapper-line'>
                            {userTeam && [userTeam[0]].map((pokemon) => {
                                return renderPokemonCard(pokemon)
                            })
                            }
                        </div>
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
                            disabled={refreshUsed === 1}
                        >
                            <LuRefreshCw />
                        </button>
                        <h2>{refreshUsed}/1</h2>
                    </div>
                    <div className='pokemon-wrapper'>
                        {
                            loading &&
                            Array.from({ length: 24 }, (_, index) => ({
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
                                            {pokemon.shiny && <div className='shiny-badge'>SHINY <BsStars /></div>}

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
                                                <div>
                                                    <span><b>HP</b></span>
                                                    <span>{pokemon.hp}</span>
                                                </div>
                                                <div>
                                                    <span><b>ATK</b> </span>
                                                    <span>{pokemon.attack}</span>
                                                </div>
                                                <div>
                                                    <span><b>DEF</b> </span>
                                                    <span>{pokemon.defense}</span>
                                                </div>
                                            </div>
                                            <hr></hr>
                                            <div className="stat-col">
                                                <div>
                                                    <span><b>SPA</b> </span>
                                                    <span>{pokemon.special_attack}</span>
                                                </div>
                                                <div>
                                                    <span><b>SPD</b> </span>
                                                    <span>{pokemon.special_defense}</span>
                                                </div>
                                                <div>
                                                    <span><b>SPE</b> </span>
                                                    <span>{pokemon.speed}</span>
                                                </div>
                                            </div>
                                        </div>
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
