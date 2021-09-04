import Component from '../Component.js'
import AnimationComponent from '../AnimationComponent.js'
import { ANIMATIONS as ANIMS } from '../../../utils/Const.js'
import Vector from '../../../utils/Vector.js'
import Map from '../../../world/Map.js'
import MovementComponent from '../MovementComponent.js'
import CombatComponent from '../CombatComponent.js'
import PlayerInputComponent from '../PlayerInputComponent.js'

export default class TeleportBehaviorComponent extends Component {
    constructor(entity, targetEntity, target) {
        super(entity)
        this.targetEntity = targetEntity
        this.target = target
        this.targetEntity.getComponent(MovementComponent).halt()
        this.targetEntity.getComponent(MovementComponent).setStasis(true)
        const combatComponent = this.targetEntity.getComponent(CombatComponent)
        if (combatComponent) {
            combatComponent.unsetCombatTarget()
            combatComponent.setStasis(true)
        }
        this.setStasis(true)
        if (!this.checkValidTarget()) {
            this.target = Vector.vectorFromEntity(targetEntity)
        }
        this.setTelportAnims()
    }

    /**
     * Sets teleport animations and callback functions.
     */
    setTelportAnims() {
        this.animComp = this.entity.getComponent(AnimationComponent)
        this.animComp.setAnimation(ANIMS.TeleportOut, () => {
            this.entity.x = this.target.x                
            this.entity.y = this.target.y 
            this.animComp.setAnimation(ANIMS.TeleportIn, () => {
                this.targetEntity.x = this.target.x
                this.targetEntity.y = this.target.y
                this.setStasis(false)
                this.entity.removeFromWorld = true
                const combatComponent = this.targetEntity.getComponent(CombatComponent)
                if (combatComponent) {
                    combatComponent.unsetCombatTarget()
                    combatComponent.setStasis(false)
                }
                this.targetEntity.getComponent(MovementComponent).halt()
                this.targetEntity.getComponent(MovementComponent).setStasis(false)
            })
        })
    }

    /**
     * Puts the caster into stasis. Unable to give input or move.
     * @param {Boolean} bool True for entering teleport/ false for exiting. 
     */
    setStasis(bool) {
        if (this.targetEntity.UUID.includes('PLAYER')) {
            this.targetEntity.getComponent(PlayerInputComponent).setBlocked(bool)
        }


        this.targetEntity.getComponent(AnimationComponent).getCurrentAnimation().setDraw(!bool)
    }
    
    /**
     * Checks the target tile to ensure it's player walkable.
     */
    checkValidTarget() {
        const checkTile = Map.worldToTilePosition(this.target, 64)
        return this.entity.game.getWorld()[checkTile.y][checkTile.x] <= 4
    }
}