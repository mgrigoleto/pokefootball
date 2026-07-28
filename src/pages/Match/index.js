import React, { useEffect, useRef, useState } from 'react'
import './styles.css'
import field from '../../assets/field.png'
import { IoFootball } from "react-icons/io5"
import { useLocation } from "react-router-dom";
import { Position } from '../../helpers/Enums';

const Match = () => {

    const { state } = useLocation();

    const [userTeam, setUserTeam] = useState(state.userTeam)

    const [enemyTeams, setEnemyTeams] = useState(state.aiTeams)

    const [currEnemyTeam, setCurrEnemyTeam] = useState(state.aiTeams?.[0] ? state.aiTeams[0].players : [])

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
            defense: currEnemyTeam
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
            midfield: currEnemyTeam
                .filter(player =>
                    [
                        Position.CDM,
                        Position.CM,
                        Position.CAM,
                    ].includes(player.position)
                )
                .reduce((total, player) => total + player.overall, 0),
            attack: currEnemyTeam
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

        const possibleGoalsMinutes = Array.from(
            new Set(
                Array.from({ length: 20 }, () => Math.floor(Math.random() * 90) + 1)
            )
        ).sort((a, b) => a - b);

        const possibleYellowCardsMinutes = Array.from(
            new Set(
                Array.from({ length: 20 }, () => Math.floor(Math.random() * 90) + 1)
            )
        ).sort((a, b) => a - b);


        //#region simulate events
        setActivities([])
        const auxActivities = []

        // Closer to zero means harder
        const difficultyMultipler = 0.8

        for (let minute of possibleGoalsMinutes) {

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

                    const playersWithoutGK = currEnemyTeam?.filter(player => player.position !== Position.GK)

                    const randomPlayer = playersWithoutGK[Math.floor(Math.random() * playersWithoutGK.length)]

                    const actObj = {
                        type: 'goal',
                        actor: 'enemy',
                        minute: minute,
                        description: `${randomPlayer.name} ${wasItPenalty ? ' (P)' : ''}`,
                    }

                    auxActivities.push(actObj)
                }
            }
        }

        // Show the events
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
                <div className='match-activities'>
                    {activities?.map((event) => {
                        return (
                            <>
                                <label className={`${event.actor}-event ${event.type}`}>
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
                {currEnemyTeam?.map((player) => {
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
