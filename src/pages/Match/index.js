import React, { useEffect, useRef, useState } from 'react'
import './styles.css'
import field from '../../assets/field.png'
import { IoFootball } from "react-icons/io5"
import { GiWhistle } from "react-icons/gi";
import { useLocation, useNavigate } from "react-router-dom";
import { Position } from '../../helpers/Enums';
import { simulateCards, simulateGoals } from './utils';

const Match = () => {

    const { state } = useLocation();

    const navigate = useNavigate()

    const [userTeam, setUserTeam] = useState(state.userTeam)

    const [enemyTeams, setEnemyTeams] = useState(state.aiTeams)

    const [currEnemyTeam, setCurrEnemyTeam] = useState(state.aiTeams?.[0] ? state.aiTeams[0] : [])
    const [currEnemyTeamIndex, setCurrEnemyTeamIndex] = useState(0)

    const [score, setScore] = useState({ player: 0, enemy: 0 })
    const [simulationSpeed, setSimulationSpeed] = useState(200)
    const [activities, setActivities] = useState([])
    const [time, setTime] = useState(0)
    const [currentlySimulating, setCurrentlySimulating] = useState(false)

    const activitiesRef = useRef(null)

    const simulateMatch = () => {
        const seenRedCards = {}

        const filterRepeteadRedCards = (cards) => {
            const filteredCards = cards.filter((event) => {
                if (event.type !== 'red-card') return true
                
                if (seenRedCards[event.agentPlayer]) {
                    return false
                }
                seenRedCards[event.agentPlayer] = true
                return true
            })

            return filteredCards
        }

        const filterOutRedCardPlayers = (cardEvents) => {
            const userPlayersOutOfMatch = cardEvents.filter((event) => event.type === 'red-card' && event.actor === 'player')
            const outUserPlayerNames = new Set(userPlayersOutOfMatch.map((event) => event.agentPlayer))
            const enemyPlayersOutOfMatch = cardEvents.filter((event) => event.type === 'red-card' && event.actor === 'enemy')
            const outEnemyUserPlayerNames = new Set(enemyPlayersOutOfMatch.map((event) => event.agentPlayer))

            const filteredUserTeam = userTeam.filter((player) => !outUserPlayerNames.has(player.name))
            const filteredCurrEnemyTeam = currEnemyTeam.players.filter((player) => !outEnemyUserPlayerNames.has(player.name))

            return { filteredUserTeam, filteredCurrEnemyTeam }
        }

        setCurrentlySimulating(true)

        setScore({ player: 0, enemy: 0 })

        //#region simulate events
        setActivities([])
        const cards = simulateCards(userTeam, currEnemyTeam.players)
        const filteredCards = filterRepeteadRedCards(cards)
        const filteredTeams = filterOutRedCardPlayers(filteredCards)
        const goals = simulateGoals(filteredTeams.filteredUserTeam, filteredTeams.filteredCurrEnemyTeam)
        const allEvents = [...goals, ...cards]
        const playerGoals = allEvents.filter((event) => event.type === 'goal' && event.actor === 'player').length
        const enemyGoals = allEvents.filter((event) => event.type === 'goal' && event.actor === 'enemy').length
        const winner = playerGoals > enemyGoals ? 'player' : playerGoals == enemyGoals ? 'draw' : 'enemy'

        const finishEvent = {
            type: 'ending',
            actor: 'player',
            minute: 90,
            description: winner === 'player' ?
                <label>The match is over! <b className={'user-player'}>Player</b> Wins!</label>
                : winner === 'enemy' ?
                    <label>The match is over! <b className={'enemy-player'}>Trainer {currEnemyTeam.name}</b> Wins!</label>
                    :
                    <label>The match is over! It's a Draw!</label>,
        }

        const auxActivities = [...allEvents, finishEvent]

        // Show the events
        for (let i = 0; i <= 90; i++) {
            setTimeout(() => {
                setTime(i)

                const eventAtThisMinute = auxActivities?.filter((act) => act.minute === i) || []

                for (let event of eventAtThisMinute) {

                    // refresh score
                    if (event.actor === 'player' && event.type === 'goal') {
                        setScore((prev) => ({ ...prev, player: prev.player + 1 }))
                    } else if (event.actor === 'enemy' && event.type === 'goal') {
                        setScore((prev) => ({ ...prev, enemy: prev.enemy + 1 }))
                    }

                    setActivities((curr) => [...curr, event])
                }

                if (i === 90) {
                    setCurrentlySimulating(false)
                }
            }, i * simulationSpeed);
        }
    }

    useEffect(() => {
        if (activitiesRef.current) {
            activitiesRef.current.scrollTo({
                top: activitiesRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [activities])

    useEffect(() => {
        currEnemyTeamIndex > 0 && simulateMatch()
    }, [currEnemyTeam])

    return (
        <div className='match-container'>
            <div className='team-list'>
                <h2>OVERALL: {
                    userTeam && userTeam.length > 0
                        ? Math.round(userTeam.reduce((acc, player) => acc + (player.overall || 0), 0) / userTeam.length)
                        : 0
                }</h2>
                {userTeam?.map((player) => {
                    return (
                        <div key={player.position} className='item'>
                            <img src={player.image}></img>
                            <div>
                                <h5>{player.name}</h5>
                                <label>
                                    <b>{player.position}</b>
                                    <span>OVR: {player.overall}</span>
                                </label>
                            </div>
                        </div>
                    )
                })}
            </div>
            <div className='field-activities'>
                <div className='match-header'>
                    <label className='score'>
                        <span className='player-name'>Player</span>
                        <span className='live-score'>{score.player} - {score.enemy}</span>
                        <span className='enemy-name'>Trainer {currEnemyTeam.name}</span>
                    </label>
                    <span className='timer'>{time}'</span>
                </div>
                <div className='match-activities' ref={activitiesRef}>
                    {activities?.map((event) => {
                        const eventIcon = () => {
                            switch (event.type) {
                                case 'goal':
                                    return <IoFootball />
                                case 'yellow-card':
                                    return <span className='yellow-card'></span>
                                case 'red-card':
                                    return <span className='red-card'></span>
                                case 'ending':
                                    return <GiWhistle />
                                default:
                                    return <></>
                            }
                        }

                        return (
                            <>
                                <label className={`${event.actor}-event ${event.type}`}>
                                    {eventIcon()}
                                    {event.minute}' {event.description}
                                </label>
                            </>
                        )
                    })}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'flex-start' }}>
                    <div className='button-line'>
                        <button
                            className={`${simulationSpeed == 200 ? 'selected-' : ''}speed-button`}
                            onClick={() => setSimulationSpeed(200)}
                            disabled={currentlySimulating}
                        >
                            1x
                        </button>
                        <button
                            className={`${simulationSpeed == 100 ? 'selected-' : ''}speed-button`}
                            onClick={() => setSimulationSpeed(100)}
                            disabled={currentlySimulating}
                        >
                            2x
                        </button>
                        <button
                            className={`${simulationSpeed == 50 ? 'selected-' : ''}speed-button`}
                            onClick={() => setSimulationSpeed(50)}
                            disabled={currentlySimulating}
                        >
                            4x
                        </button>
                    </div>
                    {
                        !currentlySimulating &&
                        !(score.player > score.enemy) &&
                        <button
                            className='start-game-button'
                            onClick={() => simulateMatch()}
                        >
                            Play Match
                        </button>
                    }
                    {
                        enemyTeams[currEnemyTeamIndex + 1] &&
                        !currentlySimulating &&
                        score.player > score.enemy &&
                        <button
                            className='start-game-button'
                            onClick={() => {
                                setCurrEnemyTeam(enemyTeams[currEnemyTeamIndex + 1])
                                setCurrEnemyTeamIndex((prev) => prev + 1)
                            }}
                        >
                            Next Rival
                        </button>
                    }
                    {
                        !enemyTeams[currEnemyTeamIndex + 1] &&
                        <button
                            className='start-game-button'
                            onClick={() => {
                                navigate("/")
                            }}
                        >
                            Finish Tournament
                        </button>
                    }

                </div>
            </div>
            <div className='team-list'>
                <h2>OVERALL: {
                    currEnemyTeam?.players && currEnemyTeam.players.length > 0
                        ? Math.round(currEnemyTeam.players.reduce((acc, player) => acc + (player.overall || 0), 0) / currEnemyTeam.players.length)
                        : 0
                }</h2>
                {currEnemyTeam?.players?.map((player) => {
                    return (
                        <div key={player.position} className='item'>
                            <img src={player.image}></img>
                            <div>
                                <h5>{player.name}</h5>
                                <label>
                                    <b>{player.position}</b>
                                    <span>OVR: {player.overall}</span>
                                </label>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div >
    )
}

export default Match
