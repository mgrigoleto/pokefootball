export const randomGoalDescription = (actor, agent) => {
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

export const randomAttackDescription = (actor, agent) => {
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

export const randomFoulDescription = (actor1, actor2, cardColor, agent) => {
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