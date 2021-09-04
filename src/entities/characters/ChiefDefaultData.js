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
const attackHeight = 288
const attackYOffset = 24
const attackXOffset = -24
const impactSizeSm = 96
const impactSizeLrg = 288
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
        HP: 100,
        Mana: 10,
        Str: 5,
        Int: 5,
        Atk: 10,
        Matk: 30,
        Def: 75,
        Mdef: 45,
        Speed: 50,
        Range: 500,
        Name: 'CHIEF',
        isCombat: true,
        isMelee: false
    },
    // Animation Component Configuration
    AnimationConfig: {
        // Values are repeated here for export
        Width: 192,
        Height: 192,
        Scale: 0.5,
        Spritesheet: ASSET_PATHS.Chief,
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
                frames: 7,
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
                frames: 7,
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
                frames: 7,
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
                frames: 7,
                rate: AR.Attack,
                options: {
                    yOffset: attackYOffset,
                    xOffset: attackXOffset * -1,
                    width: attackWidth,
                    height: attackHeight,
                    loop: false
                }
            },
            // Effect0 'burn effect'
            [ANIMS.Projectile]: {
                frames: 11,
                rate: AR.Impact,
                options: {
                    loop: true,
                    width: impactSizeSm,
                    height: impactSizeSm,
                }
            },
            // Standing
            [ANIMS.StandWest]: {
                frames: 8,
                rate: AR.Stand,
                options: {
                    width: width,
                    height: height,
                    yOffset: yOffset,
                }
            },
            [ANIMS.StandEast]: {
                frames: 8,
                rate: AR.Stand,
                options: {
                    width: width,
                    height: height,
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
                    width: width,
                    height: height,
                    yOffset: yOffset,
                }
            },
            // Copy of StandEast
            [ANIMS.StandSouth]: {
                frames: 8,
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
                    width: impactSizeLrg,
                    height: impactSizeLrg,
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