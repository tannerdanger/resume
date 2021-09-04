import Component from '../Component.js'
import CombatComponent from '../CombatComponent.js'
import AttributeComponent from '../AttributeComponent.js'
import Vector from '../../../utils/Vector.js'

export default class EnemyBehaviorComponent extends Component {
    constructor(entity) {
        super(entity)
        this.combatComponent = this.entity.getComponent(CombatComponent)
        this.attributeComponent = this.entity.getComponent(AttributeComponent)
    }

    update() {
        const player = this.entity.game.sceneManager.currentScene.getPlayer()
        if (player) {
            const pVec = Vector.vectorFromEntity(player)
            const dist = pVec.distance(Vector.vectorFromEntity(this.entity))
            if (dist < this.attributeComponent.Los) {
                if (!this.combatComponent.hasCombatTarget()) {
                    this.combatComponent.setCombatTarget(player)
                }
            }
        }

    }
    draw() {}

}