import {
    ANIMATIONS as ANIMS,
    ANIMATION_RATES as AR,
    ASSET_PATHS
} from '../../utils/Const.js'

/**
 * ANIMATIONS
 */
// Values defined here for use in export object
const attackWidth = 288
const attackHeight = 192
const attackYOffset = 24
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
        HP: 60,
        Mana: 10,
        Str: 5,
        Int: 5,
        Atk: 12,
        Matk: 5,
        Def: 10,
        Mdef: 5,
        Speed: 110,
        Range: 110,
        Name: 'WOLF',
        isCombat: true,
        isMelee: true
    },
    // Animation Component Configuration
    AnimationConfig: {
        // Values are repeated here for export
        Width: 192,
        Height: 192,
        Scale: 0.5,
        Spritesheet: ASSET_PATHS.Wolf,
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
                frames: 15,
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
                frames: 15,
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
                frames: 15,
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
                frames: 15,
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
                frames: 12,
                rate: AR.Stand,
                options: {
                    width: width,
                    height: height,
                    yOffset: yOffset,
                }
            },
            [ANIMS.StandEast]: {
                frames: 12,
                rate: AR.Stand,
                options: {
                    width: width,
                    height: height,
                    yOffset: yOffset,
                }
            },

            // Copy of StandWest
            [ANIMS.StandNorth]: {
                frames: 12,
                goBackRows: 2,
                goBackHeight: 2 * height,
                rate: AR.Stand,
                options: {
                    width: width,
                    height: height,
                    yOffset: yOffset,
                }
            },
            // Copy of StandEast
            [ANIMS.StandSouth]: {
                frames: 12,
                rate: AR.Stand,
                options: {
                    width: width,
                    height: height,
                    yOffset: yOffset,
                }

            },
            [ANIMS.Impact]: {
                frames: 11,
                rate: AR.Impact,
                options: {
                    loop: false,
                    width: impactSize,
                    height: impactSize,
                    maxFrames: 12
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
                    width: width,
                    height: height,
                    yOffset: yOffset,
                }
            },
            [ANIMS.WalkEast]: {
                frames: 12,
                rate: AR.Walk,
                options: {
                    width: width,
                    height: height,
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
                    width: width,
                    height: height,
                    yOffset: yOffset,
                }
            },
            // Copy of WalkEast
            [ANIMS.WalkNorth]: {
                frames: 12,
                width: width,
                height: height,
                rate: AR.Walk,
                options: {
                    width: width,
                    height: height,
                    yOffset: yOffset,
                }
            }
        }
    }
}