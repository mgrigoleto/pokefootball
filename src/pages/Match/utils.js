import { Position } from "../../helpers/Enums"

// Closer to zero means harder
const difficultyMultipler = 0.8

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

const randomGoalDescription = (actor, agent) => {
    const actorClassName = agent === 'player' ? 'user-player' : 'enemy-player'

    const possibleGoals = [
        <label><b className={actorClassName}>{actor}</b> scored with a blindfolded bicycle kick!</label>,
        <label><b className={actorClassName}>{actor}</b> sneezed and accidentally blew the ball into the net!</label>,
        <label><b className={actorClassName}>{actor}</b> tripped, fell, and butt-bumped the ball into the goal!</label>,
        <label><b className={actorClassName}>{actor}</b> hip-thrusted the ball right past the keeper!</label>,
        <label><b className={actorClassName}>{actor}</b> headed the ball in while taking a mid-game selfie!</label>,
        <label><b className={actorClassName}>{actor}</b> shot so hard the ball literally popped on impact!</label>,

        <label><b className={actorClassName}>{actor}</b> moonwalked past the keeper and tapped it in!</label>,
        <label><b className={actorClassName}>{actor}</b> hit a hit-and-hope lob while casually eating a snack!</label>,
        <label><b className={actorClassName}>{actor}</b> hit a curved shot that broke the laws of physics!</label>,
        <label><b className={actorClassName}>{actor}</b> did three backflips and volleyed it into the top corner!</label>,
        <label><b className={actorClassName}>{actor}</b> celebrated before the ball even crossed the line!</label>,

        <label><b className={actorClassName}>{actor}</b> megistered the keeper from 40 yards out!</label>,
        <label><b className={actorClassName}>{actor}</b> chipped the keeper so slowly everyone just watched it roll in!</label>,
        <label><b className={actorClassName}>{actor}</b> hit a shot that bounced off both posts, the crossbar, and in!</label>,
        <label><b className={actorClassName}>{actor}</b> fake-shot so hard the goalkeeper dove into the wrong dimension!</label>,

        <label><b className={actorClassName}>{actor}</b> blasted a missile straight from the center circle!</label>,
        <label><b className={actorClassName}>{actor}</b> ricocheted the ball off a seagull and into the net!</label>,
        <label><b className={actorClassName}>{actor}</b> scored directly from a scorpion kick corner!</label>,
        <label><b className={actorClassName}>{actor}</b> slipped on a banana peel and accidentally scored a banger!</label>,
        <label><b className={actorClassName}>{actor}</b> trick-shot the ball off the referee's head and into the goal!</label>
    ]

    const randomIndex = Math.floor(Math.random() * possibleGoals.length)
    return possibleGoals[randomIndex]
};

const randomAttackDescription = (actor, agent) => {
    const actorClassName = agent === 'player' ? 'user-player' : 'enemy-player';

    const possibleAttacks = [
        // Misses & Blunders (1-15)
        <label><b className={actorClassName}>{actor}</b> kicked thin air on a bicycle kick!</label>,
        <label><b className={actorClassName}>{actor}</b> shot it straight into the parking lot!</label>,
        <label><b className={actorClassName}>{actor}</b> slipped on a banana peel and missed completely!</label>,
        <label><b className={actorClassName}>{actor}</b> hit a fan sitting all the way in row 30!</label>,
        <label><b className={actorClassName}>{actor}</b> tripped over their own feet mid-strike!</label>,
        <label><b className={actorClassName}>{actor}</b> lost a shoe mid-dribble and kicked it instead of the ball!</label>,
        <label><b className={actorClassName}>{actor}</b> passed the ball directly to a bird on the pitch!</label>,
        <label><b className={actorClassName}>{actor}</b> got distracted by the crowd and ran out of bounds!</label>,
        <label><b className={actorClassName}>{actor}</b> tried a knuckleball that ended up in the concessions stand!</label>,
        <label><b className={actorClassName}>{actor}</b> tried a rabona and somehow hit themselves in the shins!</label>,
        <label><b className={actorClassName}>{actor}</b> swung so hard they spun 360 degrees and fell over!</label>,
        <label><b className={actorClassName}>{actor}</b> launched the ball clean over the entire stadium roof!</label>,
        <label><b className={actorClassName}>{actor}</b> accidentally backheeled the ball behind them into open space!</label>,
        <label><b className={actorClassName}>{actor}</b> tried to fake out the keeper but faked out themselves instead!</label>,
        <label><b className={actorClassName}>{actor}</b> whiffed so hard they kicked up a massive cloud of turf!</label>,

        // Saves & Woodwork (16-30)
        <label><b className={actorClassName}>{actor}</b>'s shot was miraculously saved by the keeper's face!</label>,
        <label><b className={actorClassName}>{actor}</b> smashed a missile right off the crossbar!</label>,
        <label><b className={actorClassName}>{actor}</b>'s curling shot was tipped over the bar for a corner!</label>,
        <label><b className={actorClassName}>{actor}</b> tried a sneaky chip, but it was caught easily by the keeper!</label>,
        <label><b className={actorClassName}>{actor}</b> hit a rocket that rattled the left post!</label>,
        <label><b className={actorClassName}>{actor}</b> fired a low driven shot that the keeper pinched on the goal line!</label>,
        <label><b className={actorClassName}>{actor}</b>'s powerful header was clawed away by the goalkeeper!</label>,
        <label><b className={actorClassName}>{actor}</b> unleashed a thunderbolt that hit the keeper right in the chest!</label>,
        <label><b className={actorClassName}>{actor}</b> tried a scorpion kick, but the keeper plucked it out of the air!</label>,
        <label><b className={actorClassName}>{actor}</b> hit the inside of the post, but it bounced right back out!</label>,
        <label><b className={actorClassName}>{actor}</b> attempted a diving header, but the keeper tipped it past the post!</label>,
        <label><b className={actorClassName}>{actor}</b> tried a cheeky panenka, but the keeper stayed completely still!</label>,
        <label><b className={actorClassName}>{actor}</b>'s shot ricocheted off the keeper's knee and cleared!</label>,
        <label><b className={actorClassName}>{actor}</b> aimed for the top corner, but the keeper pulled off a world-class save!</label>,
        <label><b className={actorClassName}>{actor}</b> hit a volley that hit the crossbar twice before bouncing away!</label>,

        // Deflections, Set Pieces & Offsides (31-40)
        <label><b className={actorClassName}>{actor}</b>'s shot deflected off a defender for a corner kick!</label>,
        <label><b className={actorClassName}>{actor}</b> forced a corner kick after a desperate goal-line tackle!</label>,
        <label><b className={actorClassName}>{actor}</b> won a dangerous free kick just outside the 18-yard box!</label>,
        <label><b className={actorClassName}>{actor}</b> scored, but was flagged offside by a mile!</label>,
        <label><b className={actorClassName}>{actor}</b>'s shot hit the referee and completely stopped the play!</label>,
        <label><b className={actorClassName}>{actor}</b>'s strike was blocked by a heroic sliding defender!</label>,
        <label><b className={actorClassName}>{actor}</b> won a throw-in high up the pitch after pressing!</label>,
        <label><b className={actorClassName}>{actor}</b> caught the keeper off their line, but the defender cleared it off the line!</label>,
        <label><b className={actorClassName}>{actor}</b> was called for a hand ball right before unleashing a volley!</label>,
        <label><b className={actorClassName}>{actor}</b> strayed offside just as they were about to tap it in!</label>,

        // Absurd & Funny Scenarios (41-50)
        <label><b className={actorClassName}>{actor}</b> celebrated early, but the shot trickled wide of the net!</label>,
        <label><b className={actorClassName}>{actor}</b> tried to pass to a teammate who was currently tying their shoes!</label>,
        <label><b className={actorClassName}>{actor}</b> tried a half-way line lob, but it barely reached the penalty box!</label>,
        <label><b className={actorClassName}>{actor}</b> hit a shot so slow the keeper walked over to pick it up!</label>,
        <label><b className={actorClassName}>{actor}</b> accidentally passed to the opponent's manager on the sideline!</label>,
        <label><b className={actorClassName}>{actor}</b> tried to step-over five times and dribbled the ball out of bounds!</label>,
        <label><b className={actorClassName}>{actor}</b> hit the ball so hard it popped mid-air!</label>,
        <label><b className={actorClassName}>{actor}</b> tried to head the ball and ended up heading their teammate's shoulder!</label>,
        <label><b className={actorClassName}>{actor}</b> tried a volley, missed, and hit a stunning dance move by accident!</label>,
        <label><b className={actorClassName}>{actor}</b> tried to lob the keeper, but the wind blew the ball backward!</label>
    ];

    const randomIndex = Math.floor(Math.random() * possibleAttacks.length);
    return possibleAttacks[randomIndex];
};

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

const randomFoulDescription = (actor1, actor2, cardColor, agent) => {
    const actor1ClassName = agent == 'player' ? 'user-player' : 'enemy-player'
    const actor2ClassName = agent == 'player' ? 'enemy-player' : 'user-player'

    const possibleYellowCardFouls = [
        <label><b className={actor1ClassName}>{actor1}</b> tickled <b className={actor2ClassName}>{actor2}</b> to steal the ball.</label>,
        <label><b className={actor1ClassName}>{actor1}</b> untied <b className={actor2ClassName}>{actor2}</b>'s shoelaces on purpose.</label>,
        <label><b className={actor1ClassName}>{actor1}</b> spit at <b className={actor2ClassName}>{actor2}</b>.</label>,
        <label><b className={actor1ClassName}>{actor1}</b> accidentally slapped <b className={actor2ClassName}>{actor2}</b>'s butt.</label>,
        <label><b className={actor1ClassName}>{actor1}</b> stole <b className={actor2ClassName}>{actor2}</b>'s underwear and ran away.</label>,
        <label><b className={actor1ClassName}>{actor1}</b> tried a WWE move on <b className={actor2ClassName}>{actor2}</b>.</label>,
        <label><b className={actor1ClassName}>{actor1}</b> pulled <b className={actor2ClassName}>{actor2}</b>'s socks all the way up to their knees.</label>,
        <label><b className={actor1ClassName}>{actor1}</b> whispered a fake pass call directly into <b className={actor2ClassName}>{actor2}</b>'s ear.</label>,
        <label><b className={actor1ClassName}>{actor1}</b> deliberately stepped on <b className={actor2ClassName}>{actor2}</b>'s new shiny cleats.</label>,
        <label><b className={actor1ClassName}>{actor1}</b> gave <b className={actor2ClassName}>{actor2}</b> a wet willy while defending a corner.</label>,
        <label><b className={actor1ClassName}>{actor1}</b> pulled <b className={actor2ClassName}>{actor2}</b>'s shirt over their head like a hockey fight.</label>,
        <label><b className={actor1ClassName}>{actor1}</b> aggressively pinched <b className={actor2ClassName}>{actor2}</b>'s cheek mid-dribble.</label>,
        <label><b className={actor1ClassName}>{actor1}</b> tried to steal <b className={actor2ClassName}>{actor2}</b>'s shin guards mid-sprint.</label>,
        <label><b className={actor1ClassName}>{actor1}</b> splashed water from their bottle right into <b className={actor2ClassName}>{actor2}</b>'s eyes.</label>,
        <label><b className={actor1ClassName}>{actor1}</b> hit <b className={actor2ClassName}>{actor2}</b> with a tactical hip-check out of bounds.</label>
    ]

    const possibleRedCardFouls = [
        <label><b className={actor1ClassName}>{actor1}</b> bit <b className={actor2ClassName}>{actor2}</b> like Luis Suárez!</label>,
        <label><b className={actor1ClassName}>{actor1}</b> dropkicked <b className={actor2ClassName}>{actor2}</b> into the third row!</label>,
        <label><b className={actor1ClassName}>{actor1}</b> stole the referee's whistle and ate it!</label>,
        <label><b className={actor1ClassName}>{actor1}</b> body-slammed <b className={actor2ClassName}>{actor2}</b> through the turf!</label>,
        <label><b className={actor1ClassName}>{actor1}</b> pulled out a banana peel and slipped <b className={actor2ClassName}>{actor2}</b>!</label>,
        <label><b className={actor1ClassName}>{actor1}</b> threw a shoe directly at <b className={actor2ClassName}>{actor2}</b>'s face!</label>,
        <label><b className={actor1ClassName}>{actor1}</b> headbutted <b className={actor2ClassName}>{actor2}</b> Zidane-style in the middle of the pitch!</label>,
        <label><b className={actor1ClassName}>{actor1}</b> summoned a Pokéball and threw it straight at <b className={actor2ClassName}>{actor2}</b>!</label>,
        <label><b className={actor1ClassName}>{actor1}</b> stole the VAR monitor and smashed it over <b className={actor2ClassName}>{actor2}</b>'s head!</label>,
        <label><b className={actor1ClassName}>{actor1}</b> tackled <b className={actor2ClassName}>{actor2}</b> using a full-force RKO out of nowhere!</label>,
        <label><b className={actor1ClassName}>{actor1}</b> straight up suplexed <b className={actor2ClassName}>{actor2}</b> into the corner flag!</label>,
        <label><b className={actor1ClassName}>{actor1}</b> stole the match ball, threw it out of the stadium, and challenged <b className={actor2ClassName}>{actor2}</b> to a duel!</label>,
        <label><b className={actor1ClassName}>{actor1}</b> pulled out a red card and handed it to the referee first!</label>,
        <label><b className={actor1ClassName}>{actor1}</b> hit <b className={actor2ClassName}>{actor2}</b> with a double-axe handle off the crossbar!</label>,
        <label><b className={actor1ClassName}>{actor1}</b> tackled <b className={actor2ClassName}>{actor2}</b> so hard they both clipped through the game physics!</label>
    ]

    const possibleNoCardFouls = [
        <label><b className={actor1ClassName}>{actor1}</b> blew air into <b className={actor2ClassName}>{actor2}</b>'s ear.</label>,
        <label><b className={actor1ClassName}>{actor1}</b> aggressively high-fived <b className={actor2ClassName}>{actor2}</b>'s face.</label>,
        <label><b className={actor1ClassName}>{actor1}</b> poked <b className={actor2ClassName}>{actor2}</b>'s belly button.</label>,
        <label><b className={actor1ClassName}>{actor1}</b> sneezed loudly right next to <b className={actor2ClassName}>{actor2}</b> during a jump.</label>,
        <label><b className={actor1ClassName}>{actor1}</b> nudged <b className={actor2ClassName}>{actor2}</b> slightly while asking for their jersey number.</label>,
        <label><b className={actor1ClassName}>{actor1}</b> accidentally tripped over <b className={actor2ClassName}>{actor2}</b>'s shadow.</label>,
        <label><b className={actor1ClassName}>{actor1}</b> stared menacingly into <b className={actor2ClassName}>{actor2}</b>'s eyes until they lost balance.</label>,
        <label><b className={actor1ClassName}>{actor1}</b> gently patted <b className={actor2ClassName}>{actor2}</b>'s head after a missed shot.</label>,
        <label><b className={actor1ClassName}>{actor1}</b> tried to tie <b className={actor2ClassName}>{actor2}</b>'s laces mid-sprint and failed miserably.</label>,
        <label><b className={actor1ClassName}>{actor1}</b> bumped shoulders with <b className={actor2ClassName}>{actor2}</b> while admiring the crowd.</label>,
        <label><b className={actor1ClassName}>{actor1}</b> tried to high-five <b className={actor2ClassName}>{actor2}</b> after stealing the ball.</label>,
        <label><b className={actor1ClassName}>{actor1}</b> accidentally stepped on <b className={actor2ClassName}>{actor2}</b>'s pinky toe.</label>,
        <label><b className={actor1ClassName}>{actor1}</b> aggressively offered a fist bump to <b className={actor2ClassName}>{actor2}</b> mid-tackle.</label>,
        <label><b className={actor1ClassName}>{actor1}</b> yawned so loudly that <b className={actor2ClassName}>{actor2}</b> got distracted.</label>,
        <label><b className={actor1ClassName}>{actor1}</b> gently brushed some grass off <b className={actor2ClassName}>{actor2}</b>'s shoulder.</label>
    ]

    let selectedArray

    if (cardColor === 'red') {
        selectedArray = possibleRedCardFouls
    } else if (cardColor === 'yellow') {
        selectedArray = possibleYellowCardFouls
    } else {
        selectedArray = possibleNoCardFouls
    }

    const randomIndex = Math.floor(Math.random() * selectedArray.length)
    return selectedArray[randomIndex]
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
        const playerPowerValue = playerPower[powers[Math.floor(Math.random() * powers.length)]] * (Math.random() * (1 - difficultyMultipler) + difficultyMultipler)
        const enemyPowerValue = enemyPower[powers[Math.floor(Math.random() * powers.length)]] * (Math.random() * (1 + (difficultyMultipler - 1) - 1) + 1)

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
            }
        }
    }

    return auxActivities
}

//#endregion