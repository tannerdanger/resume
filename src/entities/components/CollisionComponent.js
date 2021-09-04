import Component from './Component.js'
import { STATES } from '../../utils/Const.js'
import { HitCircle } from '../../utils/Collision.js'
import AnimationComponent from './AnimationComponent.js'
import Vector from '../../utils/Vector.js'

export default class CollisionComponent extends Component {
    constructor(entity, staticHitBox) {
        super(entity)
        this.animationComponent = this.entity.getComponent(AnimationComponent)
        this.isStatic = false

        if (staticHitBox) {
            this.setStaticHitbox(staticHitBox)
            this.isStatic = true
            this.width = staticHitBox.width
            this.height = staticHitBox.height
        } else {
            this.setCollidableHitbox()
        }
    }

    update() {
        const pos = Vector.vectorFromEntity(this.entity)
        this.hitbox.update(pos.x, pos.y)
    }

    /**
     * Creates a static hitbox for map interaction objects.
     * @param {Object} staticHit Contains width and height of the static hitbox.
     */
    setStaticHitbox(staticHit) {
        this.entity.states[STATES.Collidable] = true
        this.radius = Math.max(staticHit.width, staticHit.height) / 2
        this.hitbox = new HitCircle(
            this.radius, this.entity.x + staticHit.width / 2, this.entity.y + staticHit.height / 2
        )
    }

    /**
     * Sets an entities state to be collidable and creates a hitbox from it's dimensions.
     * This may be replaced and moved to attribute component.
     *
     * Depreciated
     */
    setCollidableHitbox() {
        this.entity.states[STATES.Collidable] = true
        const animation = this.animationComponent.getCurrentAnimation()
        const width = animation.getWidth()
        const height = animation.getHeight()
        const yOffset = animation.offset.y
        const xOffset = animation.offset.x
        const radius = Math.max(width, height) / 2
        this.hitbox = new HitCircle(radius, this.entity.x + xOffset, this.entity.y - height + yOffset)
    }

    /**
     * Uses the WORLD-TO-SCREEN converter in the game engine to determine if an entity is at a certain location.
     *
     * @param vector
     * @returns {boolean}
     */
    checkCollisionScreen(vector) {
        if (this.isStatic) {
            return this.checkStaticCollisionScreen(vector)
        } else {
            const currentAnim = this.entity.getComponent(AnimationComponent).getCurrentAnimation()
            const height = currentAnim.getHeight()
            const width = currentAnim.getWidth()
            const hitboxScreenPos = this.entity.game.worldToScreen(this.hitbox.location) // get position on screen
            const dist = vector.distance(hitboxScreenPos)
            if (dist < this.hitbox.radius) {
                const distY = vector.absdistanceY(hitboxScreenPos)
                const distX = vector.absdistanceX(hitboxScreenPos)
                return (distX < width && distY < height)
            }
        }
    }

    /**
     * I belive this method is only used for checking projectiles on impact so far.
     * Do distances need to be returned here?
     * TODO add collision checks so projectiles collide in flight.
     * @param vector
     * @returns {boolean} True if collides.
     */
    checkCollisionWorld(vector) {
        if (!this.isStatic) {
            const hitboxScreenPos = this.hitbox.location
            const dist = vector.distance(hitboxScreenPos)
            // if (dist < this.hitbox.radius) {
            //     // TODO do we need these distances? 
            //     const distY = vector.absdistanceY(hitboxScreenPos)
            //     const distX = vector.absdistanceX(hitboxScreenPos)
            // } 
            return (dist < this.hitbox.radius)
        }
     
    }

    checkStaticCollisionScreen(vector) {
        const hitboxScreenPos = this.entity.game.worldToScreen(
            new Vector(this.entity.x + this.width / 2, this.entity.y + this.height / 2)
        )
        const dist = vector.distance(hitboxScreenPos)
        if (dist < this.hitbox.radius) {
            const distY = vector.absdistanceY(hitboxScreenPos)
            const distX = vector.absdistanceX(hitboxScreenPos)
            return (distX < this.width && distY < this.height)
        }
    }

}