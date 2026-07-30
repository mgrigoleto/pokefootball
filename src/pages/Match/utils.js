import { Position } from "../../helpers/Enums"
import { randomAttackDescription, randomFoulDescription, randomGoalDescription } from "./eventDescriptions"

// Closer to zero means harder
const difficultyMultipler = 0.9

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

const giveCard = (player) => {
    let card = { color: null }
    const random = Math.random()
    if (random <= 0.05) {
        card.color = 'red'
    } else if (random <= 0.3) {
        card.color = 'yellow'
    }
    return card
}

//#endregion

//#region team powers
const getTeamPowers = (userTeam, enemyTeam) => {

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
                    Position.LM,
                    Position.CM,
                    Position.RM,
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
                    Position.LM,
                    Position.CM,
                    Position.RM,
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

    return { playerPower, enemyPower }
}

//#endregion

//#region simulate goals
export const simulateGoals = (userTeam, enemyTeam) => {
    const auxActivities = []
    const powers = ["attack", "midfield", "defense"]
    const playerPower = getTeamPowers(userTeam, enemyTeam).playerPower
    const enemyPower = getTeamPowers(userTeam, enemyTeam).enemyPower

    const possibleGoalsMinutes = Array.from(
        new Set(
            Array.from({ length: 25 }, () => Math.floor(Math.random() * 90) + 1)
        )
    ).sort((a, b) => a - b);

    for (let minute of possibleGoalsMinutes) {

        // Get a random power value from the teams and apply the difficulty multiplier on it
        // Since the player will most likely always have a stronger team than the AI, I multiply the user's power by a random number between the difficulty base and 1 
        // Let's say the difficulty is set to 0.8 => the power will be multiplied by a random number between 0.8 and 1
        // The AI will then have its power multiplied by a random number between 1 and 1.2
        const playerPowerValue = playerPower[powers[Math.floor(Math.random() * powers.length)]] * difficultyMultipler
        const enemyPowerValue = enemyPower[powers[Math.floor(Math.random() * powers.length)]] * (2-difficultyMultipler)

        if (playerPowerValue > enemyPowerValue) {
            const goal = attemptGoal(playerPowerValue, enemyPowerValue)
            const playersWithoutGK = userTeam.filter(player => player.position !== Position.GK)
            const randomPlayer = playersWithoutGK[Math.floor(Math.random() * playersWithoutGK.length)]

            if (goal) {
                const actObj = {
                    type: 'goal',
                    actor: 'player',
                    minute: minute,
                    agentPlayer: randomPlayer.name,
                    description: randomGoalDescription(randomPlayer.name, 'player'),
                }

                auxActivities.push(actObj)

            } else {

                const actObj = {
                    type: 'attack',
                    actor: 'player',
                    minute: minute,
                    agentPlayer: randomPlayer.name,
                    description: randomAttackDescription(randomPlayer.name, 'player'),
                }

                auxActivities.push(actObj)
            }
        } else {
            const goal = attemptGoal(enemyPowerValue, playerPowerValue)
            const playersWithoutGK = enemyTeam?.filter(player => player.position !== Position.GK)
            const randomPlayer = playersWithoutGK[Math.floor(Math.random() * playersWithoutGK.length)]

            if (goal) {
                const actObj = {
                    type: 'goal',
                    actor: 'enemy',
                    minute: minute,
                    agentPlayer: randomPlayer.name,
                    description: randomGoalDescription(randomPlayer.name, 'enemy'),
                }

                auxActivities.push(actObj)
            } else {

                const actObj = {
                    type: 'attack',
                    actor: 'enemy',
                    minute: minute,
                    agentPlayer: randomPlayer.name,
                    description: randomAttackDescription(randomPlayer.name, 'enemy'),
                }

                auxActivities.push(actObj)
            }
        }
    }

    return auxActivities
}

//#endregion

//#region simulate cards

let yellowedUserPlayers = []
let yellowedEnemyPlayers = []

export const simulateCards = (userTeam, enemyTeam) => {
    yellowedUserPlayers = []
    yellowedEnemyPlayers = []
    const auxActivities = []

    const possibleCardMinutes = Array.from(
        new Set(
            Array.from({ length: 10 }, () => Math.floor(Math.random() * 90) + 1)
        )
    ).sort((a, b) => a - b);

    for (let minute of possibleCardMinutes) {
        const card = giveCard()
        if (card.color) {
            const random = Math.random()

            const userPlayersWithoutGK = userTeam.filter(player => player.position !== Position.GK)

            const randomUserPlayer = userPlayersWithoutGK[Math.floor(Math.random() * userPlayersWithoutGK.length)]

            const enemyPlayersWithoutGK = enemyTeam.filter(player => player.position !== Position.GK)

            const randomEnemyPlayer = enemyPlayersWithoutGK[Math.floor(Math.random() * enemyPlayersWithoutGK.length)]

            // Give the card randomly between the player and the enemy
            if (random <= 0.5) {
                const hasMultipleYellows = yellowedUserPlayers.filter(name => name === randomUserPlayer.name).length > 1

                const actObj = {
                    type: `${card.color}-card`,
                    actor: 'player',
                    minute: minute,
                    agentPlayer: randomUserPlayer.name,
                    description: randomFoulDescription(randomUserPlayer.name, randomEnemyPlayer.name, card.color, 'player'),
                }

                !hasMultipleYellows && auxActivities.push(actObj)

                // second yellow
                if (card.color == 'yellow' && yellowedUserPlayers.includes(randomUserPlayer.name)) {
                    const actObj = {
                        type: 'red-card',
                        actor: 'player',
                        minute: minute,
                        agentPlayer: randomUserPlayer.name,
                        description: <label><b className={'user-player'}>{randomUserPlayer.name}</b> got its second yellow and it's out of the match!</label>,
                    }

                    !hasMultipleYellows && auxActivities.push(actObj)
                }

                card.color == 'yellow' && yellowedUserPlayers.push(randomUserPlayer.name)
                card.color == 'red' && yellowedUserPlayers.push(randomUserPlayer.name, randomUserPlayer.name)
            } else {
                const hasMultipleYellows = yellowedEnemyPlayers.filter(name => name === randomEnemyPlayer.name).length > 1

                const actObj = {
                    type: `${card.color}-card`,
                    actor: 'enemy',
                    minute: minute,
                    agentPlayer: randomEnemyPlayer.name,
                    description: randomFoulDescription(randomEnemyPlayer.name, randomUserPlayer.name, card.color, 'enemy'),
                }

                !hasMultipleYellows && auxActivities.push(actObj)

                // second yellow
                if (card.color == 'yellow' && yellowedEnemyPlayers.includes(randomEnemyPlayer.name)) {
                    const actObj = {
                        type: 'red-card',
                        actor: 'player',
                        minute: minute,
                        agentPlayer: randomEnemyPlayer.name,
                        description: <label><b className={'enemy-player'}>{randomEnemyPlayer.name}</b> got its second yellow and it's out of the match!</label>,
                    }

                    !hasMultipleYellows && auxActivities.push(actObj)
                }

                card.color == 'yellow' && yellowedEnemyPlayers.push(randomEnemyPlayer.name)
                card.color == 'red' && yellowedEnemyPlayers.push(randomEnemyPlayer.name, randomEnemyPlayer.name)
            }
        }
    }

    return auxActivities
}

//#endregion