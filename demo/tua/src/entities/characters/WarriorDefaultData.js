import {
    ANIMATIONS as ANIMS,
    ANIMATION_RATES as AR,
    ASSET_PATHS
} from '../../utils/Const.js'

/**
 * ANIMATIONS
 */
// Values defined here for use in export object
const attackWidth = 384
const attackHeight = 288
const attackYOffset = 0
const attackXOffset = -24
const impactSize = 192
const height = 192
const width = 192
const yOffset = 20
const portraitX = 232
const portraitY = 176


/** 
 * Animations should be defined in the order they appear in the spritesheet
 * With derivative animations appearing after the main animation, with 2 properties:
 * goBackRows, goBackHeight appearing in the first derivative animation. See PlayerCharacter's
 * ANIMS.StandNorth for usage example
 */
export default {
    // Attributes Component Configuration
    Attributes: {
        HP: 15,
        Mana: 10,
        Str: 5,
        Int: 5,
        Atk: 10,
        Matk: 5,
        Def: 10,
        Mdef: 3,
        Speed: 50,
        Range: 80,
        Name: 'WARRIOR',
        isCombat: true,
        isMelee: true
    },
    // Animation Component Configuration
    AnimationConfig: {
        // Values are repeated here for export
        Width: width,
        Height: height,
        Scale: 0.5,
        Spritesheet: ASSET_PATHS.Warrior,
        InitialAnimation: ANIMS.StandEast,
        AnimationRates: {
            [AR.Walk]: 0.04,
            [AR.Stand]: 0.6,
            [AR.Attack]: 0.15,
            [AR.Impact]: 0.1,
            [AR.Portrait]: 1
        },
        AnimationData: {
            [ANIMS.AttackWest]: {
                frames: 14,
                rate: AR.Attack,
                options: {
                    yOffset: attackYOffset,
                    xOffset: attackXOffset,
                    width: attackWidth,
                    height: attackHeight,
                    loop: false
                }
            },
            [ANIMS.AttackEast]: {
                frames: 14,
                rate: AR.Attack,
                options: {
                    yOffset: attackYOffset,
                    xOffset: attackXOffset * -1,
                    width: attackWidth,
                    height: attackHeight,
                    loop: false
                }
            },
            // Copy of ShootWest
            [ANIMS.AttackNorth]: {
                frames: 14,
                goBackRows: 2,
                goBackHeight: 2 * attackHeight,
                rate: AR.Attack,
                options: {
                    yOffset: attackYOffset,
                    xOffset: attackXOffset,
                    width: attackWidth,
                    height: attackHeight,
                    loop: false
                }
            },
            // Copy of ShootEast
            [ANIMS.AttackSouth]: {
                frames: 14,
                rate: AR.Attack,
                options: {
                    yOffset: attackYOffset,
                    xOffset: attackXOffset * -1,
                    width: attackWidth,
                    height: attackHeight,
                    loop: false
                }
            },

            // Standing
            [ANIMS.StandWest]: {
                frames: 8,
                rate: AR.Stand,
                options: {
                    yOffset: yOffset,
                }
            },
            [ANIMS.StandEast]: {
                frames: 8,
                rate: AR.Stand,
                options: {
                    yOffset: yOffset,
                }
            },

            // Copy of StandWest
            [ANIMS.StandNorth]: {
                frames: 8,
                goBackRows: 2,
                goBackHeight: 2 * height,
                rate: AR.Stand,
                options: {
                    yOffset: yOffset,
                }
            },
            // Copy of StandEast
            [ANIMS.StandSouth]: {
                frames: 8,
                rate: AR.Stand,
                options: {
                    yOffset: yOffset,
                }

            },
            [ANIMS.Impact]: {
                frames: 6,
                rate: AR.Impact,
                options: {
                    width: impactSize,
                    height: impactSize,
                    loop: false,
                }
            },
            [ANIMS.Portrait]: {
                frames: 2,
                rate: AR.Portrait,
                options: {
                    loop: false,
                    width: portraitX,
                    height: portraitY
                }
            },
            // Walking
            [ANIMS.WalkWest]: {
                frames: 12,
                rate: AR.Walk,
                options: {
                    yOffset: yOffset,
                }
            },
            [ANIMS.WalkEast]: {
                frames: 12,
                rate: AR.Walk,
                options: {
                    yOffset: yOffset,
                }
            },
            // Copy of WalkWest
            [ANIMS.WalkSouth]: {
                goBackRows: 2,
                goBackHeight: 2 * height,
                frames: 12,
                rate: AR.Walk,
                options: {
                    yOffset: yOffset,
                }
            },
            // Copy of WalkEast
            [ANIMS.WalkNorth]: {
                frames: 12,
                rate: AR.Walk,
                options: {
                    yOffset: yOffset,
                }
            }
        }
    }
}