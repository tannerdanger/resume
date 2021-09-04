import {
    ANIMATIONS as ANIMS,
    ANIMATION_RATES as AR,
    ASSET_PATHS
} from '../../utils/Const.js'

const yOffset = 0
const impSize = 288
const projSize = 96


export default {
    Attributes: {
        Damage: 10,
        Radius: 15,
        Speed: 300,
        SpellPower: 12,
        INT: 1,
        Name: 'CHIEFEFFECT'
    },

    AnimationConfig: {
        Scale: 1,
        Spritesheet: ASSET_PATHS.ChiefEffect,
        InitialAnimation: ANIMS.Projectile,
        AnimationRates: {
            [AR.Projectile]: .15,
            [AR.Impact]: .13
        },
        AnimationData: {
            [ANIMS.Impact]: {
                frames: 11,
                rate: AR.Impact,
                options: {
                    width: impSize,
                    height: impSize,
                    maxFrames: 11,
                    yOffset: 30,
                }
            },
            [ANIMS.Projectile]: {
                frames: 7,
                rate: AR.Projectile,
                options: {
                    width: projSize,
                    height: projSize,
                    yOffset: yOffset
                }
            },
        }
    }
}