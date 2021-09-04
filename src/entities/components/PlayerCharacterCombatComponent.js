import AnimationComponent from './AnimationComponent.js'
import { ANIMATIONS as ANIMS } from '../../utils/Const.js'
import CombatComponent from './CombatComponent.js'
import MovementComponent from './MovementComponent.js'
import AttributeComponent from './AttributeComponent.js'

export default class PlayerCharacterCombatComponent extends CombatComponent {
    constructor(entity) {
        super(entity)
    }

    /**
     * Regenerates players health
     */
    update() {
        super.update()
        const hp = this.entity.getComponent(AttributeComponent).HP
        const hpFull = this.entity.getComponent(AttributeComponent).HPFull
        if(hp > 0 && hp < hpFull) {
            const temp = (1/(hp + 20)* 0.05)
            if((hp + temp) > hpFull){
                this.entity.getComponent(AttributeComponent).HP = hpFull
            } else {
                this.entity.getComponent(AttributeComponent).HP += temp
            }
        }
    }
    /**
     * Sets the cooresponding attack animation for PlayerCharacter
     */
    doAttackAnimation() {
        const movementComponent = this.entity.getComponent(MovementComponent)
        movementComponent.setFacing(this.combatTarget)
        this.entity.getComponent(AnimationComponent).setDirectionalAnimation(movementComponent.direction, {
            north: ANIMS.OversizeNorth,
            east: ANIMS.OversizeEast,
            south: ANIMS.OversizeSouth,
            west: ANIMS.OversizeWest
        }, () => {
            this.entity.getComponent(AnimationComponent).setDirectionalAnimation(movementComponent.direction, {
                north: ANIMS.StandNorth,
                east: ANIMS.StandEast,
                south: ANIMS.StandSouth,
                west: ANIMS.StandWest
            })
        }
        )
    }
}
