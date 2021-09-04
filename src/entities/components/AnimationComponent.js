import Component from './Component.js'
import { DIRECTIONS } from '../../utils/Const.js'
import CollisionComponent from './CollisionComponent.js'
import Vector from '../../utils/Vector.js'
import Animation from '../../Animation.js'

export default class AnimationComponent extends Component {
    /**
     * @param {Entity} entity A reference to the Entity this Component is attached to
     * @param {Object} animationConfig Animation configuration object for this character.
     */
    constructor(entity, config) {
        super(entity)
        this.animations = []
        if (config.AnimationData) {
            this.animations = this.getAnimations(config)
            this.setAnimation(config.InitialAnimation)
        } else {
            const asset = this.entity.game.getAsset(config.Spritesheet)
            this.animations['static'] = new Animation(asset,
                config.Width, config.Height,
                /*startY*/ 0,
                /*frames*/ 1,
                /*offset*/ { x: 0, y: 0 },
                /*rate*/ 1,
                /*loop*/ true,
                config.Scale)
            this.setAnimation('static')
        }
        this.angle = 0
    }

    /**
     * Called each update cycle
     */
    update() { }

    /**
     * Called each draw cycle
     */
    draw() {
        this.animations[this.animation].drawFrame(this.entity.game, this.entity.x, this.entity.y, this.angle)
    }

    /**
     * Parses the animation data and returns a collection of Animations
     * @param {Object} config The animation configuration object for this character
     */
    // eslint-disable-next-line complexity
    getAnimations(config) {
        const animations = []
        const spritesheet = this.entity.game.getAsset(config.Spritesheet)
        const animationFactory = new AnimationFactory(spritesheet, config.Width, config.Height, config.Scale)
        // Create an animation for each property in AnimationData
        for (const symbolKey of Object.getOwnPropertySymbols(config.AnimationData)) {
            const anim = config.AnimationData[symbolKey]
            // If this animation datum has these properties then it's a derivative animation
            // from the frames of a different animation and we need to move back to that row.
            if (anim.hasOwnProperty('goBackRows') && anim.hasOwnProperty('goBackHeight')) {
                animationFactory.rewindFactory(anim.goBackRows, anim.goBackHeight)
            }
            // If this animation is optional for the spritesheet then the spritesheet may
            // not contain these sprites
            if (anim.hasOwnProperty('optional')) {
                const height = anim.options.hasOwnProperty('height') ? anim.options.height : config.Height
                if (animationFactory.hasNextRow(height) == false) {
                    return animations
                }
            }
            animations[symbolKey] = animationFactory.getNextRow(anim.frames, config.AnimationRates[anim.rate], anim.options)
        }
        return animations
    }

    /**
     * Sets animation rate during run-time. Used for increasing rate of the run speed animation, e.t.c
     * @param {Symbol} animation The Symbol representing the animation found in Constants file
     * @param {Number} rate The new rate of the specified animation
     */
    setAnimationRate(animation, rate) {
        this.animations[animation].frameDuration = rate
    }

    /**
     * Sets the currently active Animation
     * @param {Symbol} animation The Symbol representing the Animation to set
     */
    setAnimation(animation, cb = null) {
        this.animation = animation
        if (this.animations[animation].loop === false) this.animations[animation].elapsedTime = 0
        const collisionComponent = this.entity.getComponent(CollisionComponent)
        if (collisionComponent) {
            collisionComponent.setCollidableHitbox()
        }
        this.animations[animation].setCallback(cb)
    }

    /**
     * Sets the angle of rotation for this animation.
     * @param {Number} angle Angle animation should be rotated.
     */
    setAngle(angle) {
        this.angle = angle
    }

    /**
     * Sets the active moving animation according to direction
     * @param {Symbol} direction The direction to walk in
     * @param {Object} anims An object with four properties (North, East, South, West)
     *                       containing the directional Animation
     */
    setDirectionalAnimation(direction, directionalAnims, cb = null) {
        const animComponent = this.entity.getComponent(AnimationComponent)
        switch (direction) {
            case DIRECTIONS.North:
                animComponent.setAnimation(directionalAnims.north, cb)
                break
            case DIRECTIONS.East:
                animComponent.setAnimation(directionalAnims.east, cb)
                break
            case DIRECTIONS.West:
                animComponent.setAnimation(directionalAnims.west, cb)
                break
            case DIRECTIONS.South:
            default:
                animComponent.setAnimation(directionalAnims.south, cb)
                break
        }
    }

    getCurrentAnimation() {
        return this.animations[this.animation]
    }

}

class AnimationFactory {
    /**
     * Slices the spritesheet into rows and returns Animation objects using getNextRow(...)
     * @param {HTMLImageElement} spritesheet The entire spritesheet for this Entity
     * @param {number} scale The scale at which to draw the sprites
     */
    constructor(spritesheet, height, width, scale = 1) {
        this.spritesheet = spritesheet
        this.scale = scale
        this.height = height
        this.width = width
        this.startY = 0
        this.row = 1
    }

    /**
     * Returns the next row of sprites as a single Animation object.
     * @param {Number} frames The number of sprite frames in this row
     * @param {number} rate Duration before switching to the next sprite frame
     * @returns The animation on the next row, or false if no more rows of sprites exist.
     */
    getNextRow(frameCount, rate, options = {}) {
        const defaults = {
            loop: true,
            yOffset: 0,
            xOffset: 0
        }
        options = Object.assign({}, defaults, options)
        const width = options.width ? options.width : this.width
        const height = options.height ? options.height : this.height
        const scale = options.scale ? options.scale : this.scale
        if (this.startY + width <= this.spritesheet.height) {
            const offset = new Vector(options.xOffset, options.yOffset)
            const animation = new Animation(this.spritesheet, width, height, this.startY, frameCount, offset, rate, options.loop, scale)
            this.startY += height
            this.row += 1
            return animation
        } else {
            return false
        }
    }

    /**
     * Checks whether the spritesheet has another row of sprites
     * @param {Number} frameHeight The height of the expected next row
     */
    hasNextRow(frameHeight) {
        return this.startY + frameHeight <= this.spritesheet.height
    }

    /**
     * Moves the AnimationFactory back to a previous row. This can be useful to create alternative animations
     * based on the frame of a different animation. For example, LPC Standing is a modified Walking animation
     * @param {number} rows The number of rows to reverse
     * @param {number} totalHeight The total height to reverse
     */
    rewindFactory(rows, totalHeight) {
        this.rows -= rows
        this.startY -= totalHeight
    }
}