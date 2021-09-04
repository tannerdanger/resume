import Component from '../Component.js'
import CollisionComponent from '../CollisionComponent.js'

export default class InteractionComponent extends Component {
    constructor(entity) {
        super(entity)
        if (new.target === InteractionComponent) {
            throw new TypeError('Cannot instantiate InteractionComponent directly')
        }
        this.hovered = false
    }

    update() {
        super.update()
        this.hovered = this.checkMouseover()
    }

    draw() {
        super.draw()
    }

    checkMouseover() {
        const inputManager = this.entity.game.inputManager
        const mouseVector = inputManager.mousePosition
        const collisionComponent = this.entity.getComponent(CollisionComponent)
        return mouseVector && collisionComponent && collisionComponent.checkCollisionScreen(mouseVector)
    }

    setRightClick() {
    }

    unsetRightClick() {
    }

    setLeftClick() {
    }

    unsetLeftClick() {
    }
}