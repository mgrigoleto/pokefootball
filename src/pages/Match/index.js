import React, { useEffect, useRef, useState } from 'react'
import './styles.css'
import field from '../../assets/field.png'
import { IoFootball } from "react-icons/io5"

const Match = () => {

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

    const userTeam = [
        { id: 6, name: "Charizard", position: Position.GK, overall: 82 },
        { id: 25, name: "Pikachu", position: Position.LB, overall: 79 },
        { id: 143, name: "Snorlax", position: Position.LCB, overall: 85 },
        { id: 149, name: "Dragonite", position: Position.RCB, overall: 81 },
        { id: 448, name: "Lucario", position: Position.RB, overall: 78 },
        { id: 3, name: "Venusaur", position: Position.CDM, overall: 84 },
        { id: 9, name: "Blastoise", position: Position.CM, overall: 80 },
        { id: 150, name: "Mewtwo", position: Position.CAM, overall: 86 },
        { id: 135, name: "Jolteon", position: Position.LW, overall: 88 },
        { id: 445, name: "Garchomp", position: Position.ST, overall: 90 },
        { id: 282, name: "Gardevoir", position: Position.RW, overall: 87 },
    ]

    const enemyTeam = [
        { id: 230, name: "Kingdra", position: Position.GK, overall: 73 },
        { id: 53, name: "Persian", position: Position.LB, overall: 70 },
        { id: 89, name: "Muk", position: Position.LCB, overall: 75 },
        { id: 112, name: "Rhydon", position: Position.RCB, overall: 72 },
        { id: 214, name: "Heracross", position: Position.RB, overall: 69 },
        { id: 282, name: "Gardevoir", position: Position.CDM, overall: 74 },
        { id: 62, name: "Poliwrath", position: Position.CM, overall: 71 },
        { id: 65, name: "Alakazam", position: Position.CAM, overall: 76 },
        { id: 334, name: "Altaria", position: Position.LW, overall: 72 },
        { id: 160, name: "Feraligatr", position: Position.ST, overall: 73 },
        { id: 242, name: "Blissey", position: Position.RW, overall: 65 },
    ]

    const [score, setScore] = useState({ player: 0, enemy: 0 })
    const [activities, setActivities] = useState([])
    const [time, setTime] = useState(0)
    const [currentlySimulating, setCurrentlySimulating] = useState(false)

    const simulateMatch = () => {

        setCurrentlySimulating(true)

        setScore({ player: 0, enemy: 0 })

        //#region possible events
        const attemptGoal = (attackerPower, defenderPower) => {
            const powerDifferencePercentage = (((attackerPower - defenderPower) / (attackerPower + defenderPower)))

            const random = Math.random()
            if (random <= (powerDifferencePercentage)) {
                return true
            } else {
                return false
            }
        }

        const isGoalPenalty = () => {
            return Math.random() < 0.1
        }

        //#endregion

        //#region team powers
        const powers = ["attack", "midfield", "defense"]

        const playerPower = {
            defense: userTeam
                .filter(player =>
                    [
                        Position.GK,
                        Position.LB,
                        Position.RB,
                        Position.LCB,
                        Position.RCB
                    ].includes(player.position)
                )
                .reduce((total, player) => total + player.overall, 0),
            midfield: userTeam
                .filter(player =>
                    [
                        Position.CDM,
                        Position.CM,
                        Position.CAM,
                    ].includes(player.position)
                )
                .reduce((total, player) => total + player.overall, 0),
            attack: userTeam
                .filter(player =>
                    [
                        Position.LW,
                        Position.ST,
                        Position.RW,
                    ].includes(player.position)
                )
                .reduce((total, player) => total + player.overall, 0),
        }

        const enemyPower = {
            defense: enemyTeam
                .filter(player =>
                    [
                        Position.GK,
                        Position.LB,
                        Position.RB,
                        Position.LCB,
                        Position.RCB
                    ].includes(player.position)
                )
                .reduce((total, player) => total + player.overall, 0),
            midfield: enemyTeam
                .filter(player =>
                    [
                        Position.CDM,
                        Position.CM,
                        Position.CAM,
                    ].includes(player.position)
                )
                .reduce((total, player) => total + player.overall, 0),
            attack: enemyTeam
                .filter(player =>
                    [
                        Position.LW,
                        Position.ST,
                        Position.RW,
                    ].includes(player.position)
                )
                .reduce((total, player) => total + player.overall, 0),
        }

        //#endregion

        const eventMinutes = Array.from(
            new Set(
                Array.from({ length: 20 }, () => Math.floor(Math.random() * 90) + 1)
            )
        ).sort((a, b) => a - b);


        //#region simulate events
        setActivities([])
        const auxActivities = []

        // Closer to zero means harder
        const difficultyMultipler = 0.8

        for (let minute of eventMinutes) {

            // Get a random power value from the teams and apply the difficulty multiplier on it
            // Since the player will most likely always have a stronger team than the AI, I multiply the user's power by a random number between the difficulty base and 1 
            // Let's say the difficulty is set to 0.8 => the power will be multiplied by a random number between 0.8 and 1
            // The AI will then have its power multiplied by a random number between 1 and 1.2
            const playerPowerValue = playerPower[powers[Math.floor(Math.random() * powers.length)]] * (Math.random() * (1 - difficultyMultipler) + difficultyMultipler)
            const enemyPowerValue = enemyPower[powers[Math.floor(Math.random() * powers.length)]] * (Math.random() * (1 + (difficultyMultipler - 1) - 1) + 1)

            if (playerPowerValue > enemyPowerValue) {
                const goal = attemptGoal(playerPowerValue, enemyPowerValue)
                if (goal) {
                    const wasItPenalty = isGoalPenalty()

                    const playersWithoutGK = userTeam.filter(player => player.position !== Position.GK)

                    const randomPlayer = playersWithoutGK[Math.floor(Math.random() * playersWithoutGK.length)]

                    const actObj = {
                        actor: 'player',
                        minute: minute,
                        description: `${randomPlayer.name} ${wasItPenalty ? ' (P)' : ''}`,
                    }

                    auxActivities.push(actObj)
                }
            } else {
                const goal = attemptGoal(enemyPowerValue, playerPowerValue)
                if (goal) {
                    const wasItPenalty = isGoalPenalty()

                    const playersWithoutGK = enemyTeam.filter(player => player.position !== Position.GK)

                    const randomPlayer = playersWithoutGK[Math.floor(Math.random() * playersWithoutGK.length)]

                    const actObj = {
                        actor: 'enemy',
                        minute: minute,
                        description: `${randomPlayer.name} ${wasItPenalty ? ' (P)' : ''}`,
                    }

                    auxActivities.push(actObj)
                }
            }
        }

        for (let i = 0; i <= 90; i++) {
            setTimeout(() => {
                setTime(i)
                const eventAtThisMinute = auxActivities.filter((act) => act.minute == i)
                if (eventAtThisMinute?.[0]?.actor == 'player') {
                    setScore((prev) => ({ ...prev, player: prev.player + 1 }))
                } else if (eventAtThisMinute?.[0]?.actor == 'enemy') {
                    setScore((prev) => ({ ...prev, enemy: prev.enemy + 1 }))
                }
                setActivities((curr) => [...curr, ...eventAtThisMinute])

                if (i == 90) {
                    setCurrentlySimulating(false)
                }
            }, i * 100)
        }
    }

    return (
        <div className='match-container'>
            <div className='team-list'>
                {userTeam?.map((player) => {
                    return (
                        <label key={player.position}>
                            <b>{player.position}</b>
                            {player.name}
                            <span>({player.overall})</span>
                        </label>
                    )
                })}
            </div>
            <div className='field-activities'>
                <div className='match-header'>
                    <label className='score'>
                        <span className='player-name'>Bodde</span>
                        <span className='live-score'>{score.player} - {score.enemy}</span>
                        <span className='enemy-name'>AI Trainer</span>
                    </label>
                    <span className='timer'>{time}'</span>
                </div>
                <img src={field}></img>
                <div className='match-activities'>
                    {activities?.map((event) => {
                        return (
                            <>
                                <label className={`${event.actor}-event `}>
                                    <IoFootball />
                                    {event.minute}' {event.description}
                                </label>
                            </>
                        )
                    })}
                </div>
                <button
                    className='start-game-button'
                    onClick={() => simulateMatch()}
                    disabled={currentlySimulating}
                >
                    Start Game
                </button>
            </div>
            <div className='team-list'>
                {enemyTeam?.map((player) => {
                    return (
                        <label key={player.position}>
                            <b>{player.position}</b>
                            {player.name}
                            <span>({player.overall})</span>
                        </label>
                    )
                })}
            </div>
        </div>
    )
}

export default Match
