import { ANIMATIONS as ANIMS, ANIMATION_RATES as AR, ASSET_PATHS } from '../../utils/Const.js'

/**
 * ANIMATIONS
 */
// Values defined here for use in export object
const yOffset = 0
const oversizedYOffset = 64

/** 
 * Animations should be defined in the order they appear in the spritesheet
 * With derivative animations appearing after the main animation, with 2 properties:
 * goBackRows, goBackHeight appearing in the first derivative animation. See PlayerCharacter's
 * ANIMS.StandNorth for usage example
 */
export default {
    // Attributes Component Configuration
    Attributes: {
        HP: 200,
        Mana: 10,
        Str: 5,
        Int: 5,
        Atk: 50,
        Matk: 10,
        Def: 25,
        Mdef: 25,
        Range: 128,
        Speed: 180,
        Name: 'PLAYER',
        isCombat: true,
        isMelee: true
    },
    // Animation Component Configuration
    AnimationConfig: {
        // Values are repeated here for export
        Width: 64,
        Height: 64,
        Scale: 1,
        Spritesheet: ASSET_PATHS.MikesChar,
        InitialAnimation: ANIMS.StandEast,
        AnimationRates: {
            [AR.Walk]: 0.06,
            [AR.Stand]: 0.6,
            [AR.Death]: 0.15,
            [AR.Spellcast]: 0.15,
            [AR.Thrust]: 0.1,
            [AR.Slash]: 0.08,
            [AR.Shoot]: 0.1,
            [AR.Oversize]: 0.1
        },
        AnimationData: {
            [ANIMS.SpellcastNorth]: {
                frames: 7,
                rate: AR.Spellcast,
                options: { yOffset: yOffset, loop: false }
            },
            [ANIMS.SpellcastWest]: {
                frames: 7,
                rate: AR.Spellcast,
                options: { yOffset: yOffset, loop: false }
            },
            [ANIMS.SpellcastSouth]: {
                frames: 7,
                rate: AR.Spellcast,
                options: { yOffset: yOffset, loop: false }
            },
            [ANIMS.SpellcastEast]: {
                frames: 7,
                rate: AR.Spellcast,
                options: { yOffset: yOffset, loop: false }
            },
            [ANIMS.ThrustNorth]: {
                frames: 8,
                rate: AR.Thrust,
                options: { yOffset: yOffset, loop: false }
            },
            [ANIMS.ThrustWest]: {
                frames: 8,
                rate: AR.Thrust,
                options: { yOffset: yOffset, loop: false }
            },
            [ANIMS.ThrustSouth]: {
                frames: 8,
                rate: AR.Thrust,
                options: { yOffset: yOffset, loop: false }
            },
            [ANIMS.ThrustEast]: {
                frames: 8,
                rate: AR.Thrust,
                options: { yOffset: yOffset, loop: false }
            },
            // Walk cycle
            [ANIMS.WalkNorth]: {
                frames: 9,
                rate: AR.Walk,
                options: { yOffset: yOffset }
            },
            [ANIMS.WalkWest]: {
                frames: 9,
                rate: AR.Walk,
                options: { yOffset: yOffset }
            },
            [ANIMS.WalkSouth]: {
                frames: 9,
                rate: AR.Walk,
                options: { yOffset: yOffset }
            },
            [ANIMS.WalkEast]: {
                frames: 9,
                rate: AR.Walk,
                options: { yOffset: yOffset }
            },
            // Slashing
            [ANIMS.SlashNorth]: {
                frames: 6,
                rate: AR.Slash,
                options: { yOffset: yOffset, loop: false }
            },
            [ANIMS.SlashWest]: {
                frames: 6,
                rate: AR.Slash,
                options: { yOffset: yOffset, loop: false }
            },
            [ANIMS.SlashSouth]: {
                frames: 6,
                rate: AR.Slash,
                options: { yOffset: yOffset, loop: false }
            },
            [ANIMS.SlashEast]: {
                frames: 6,
                rate: AR.Slash,
                options: { yOffset: yOffset, loop: false }
            },

            // Standing (modified slashing)
            [ANIMS.StandNorth]: {
                goBackRows: 4,
                goBackHeight: 4 * 64,
                frames: 2,
                rate: AR.Stand,
                options: { yOffset: yOffset }
            },
            [ANIMS.StandWest]: {
                frames: 2,
                rate: AR.Stand,
                options: { yOffset: yOffset }
            },
            [ANIMS.StandSouth]: {
                frames: 2,
                rate: AR.Stand,
                options: { yOffset: yOffset }
            },
            [ANIMS.StandEast]: {
                frames: 2,
                rate: AR.Stand,
                options: { yOffset: yOffset }
            },
            // Shooting
            [ANIMS.ShootNorth]: {
                frames: 13,
                rate: AR.Shoot,
                options: { yOffset: yOffset }
            },
            [ANIMS.ShootWest]: {
                frames: 13,
                rate: AR.Shoot,
                options: { yOffset: yOffset }
            },
            [ANIMS.ShootSouth]: {
                frames: 13,
                rate: AR.Shoot,
                options: { yOffset: yOffset }
            },
            [ANIMS.ShootEast]: {
                frames: 13,
                rate: AR.Shoot,
                options: { yOffset: yOffset }
            },
            // Hurt
            [ANIMS.DeathSouth]: {
                frames: 6,
                rate: AR.Death,
                options: { yOffset: yOffset,loop: false }
            },
            // Oversized animations
            [ANIMS.OversizeNorth]: {
                optional: true,
                frames: 6,
                rate: AR.Oversize,
                options: { yOffset: oversizedYOffset, width: 192, height: 192, loop: false }
            },
            [ANIMS.OversizeWest]: {
                optional: true,
                frames: 6,
                rate: AR.Oversize,
                options: { yOffset: oversizedYOffset, width: 192, height: 192, loop: false }

            },
            [ANIMS.OversizeSouth]: {
                optional: true,
                frames: 6,
                rate: AR.Oversize,
                options: { yOffset: oversizedYOffset, width: 192, height: 192, loop: false }

            },
            [ANIMS.OversizeEast]: {
                optional: true,
                frames: 6,
                rate: AR.Oversize,
                options: { yOffset: oversizedYOffset, width: 192, height: 192, loop: false }
            }
        }
    }
}