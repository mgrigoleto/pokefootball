import { Position } from "../../helpers/Enums"

export const recalculateStats = (pokemon) => {
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
        Position.CM,
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
        Position.LM,
        Position.RM,
    ].includes(pokemon.position)) {
        const hp = Math.round(pokemon.original_hp * 0.9)
        const attack = Math.round(pokemon.original_attack * 0.9)
        const defense = Math.round(pokemon.original_defense * 0.9)
        const special_attack = Math.round(pokemon.original_special_attack * 1.1)
        const special_defense = Math.round(pokemon.original_special_defense * 1.1)
        const speed = Math.round(pokemon.original_speed * 1.1)

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
    } else if ([
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