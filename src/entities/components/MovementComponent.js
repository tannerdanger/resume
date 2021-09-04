import Component from './Component.js'
import AnimationComponent from './AnimationComponent.js'
import AStarPathfinding from '../../utils/AStarPathfinding.js'
import Map from '../../world/Map.js'
import { DIRECTIONS, ANIMATIONS as ANIMS } from '../../utils/Const.js'
import Vector from '../../utils/Vector.js'

export default class MovementComponent extends Component {
    /**
     * @param {Entity} entity A reference to the Entity this Component is attached to
     * @param {Object} attributesConfig Attributes configuration object for this character.
     */
    constructor(entity, attributes, walkable) {
        super(entity)
        this.direction = DIRECTIONS.East
        this.speed = attributes.Speed
        this.path = []

        this.followTarget = null
        this.followTargetLastPos = null
        this.followFunction = this.getTileBehind
        this.following = false
        this.moving = false
        this.walkable = walkable ? walkable : 4
        this.stasis = false
    }

    setStasis(bool) {
        this.stasis = bool
    }
    /**
     * Called each update cycle
     */
    update() {
        if (!this.stasis) {
            if (this.path.length > 0) {
                this.handlePathMovement()
            }
            if (this.following) {
                this.handleFollowing()
            }
        }

    }

    /**
     * Called each draw cycle
     */
    draw() { }

    /**
     * Checks whether the follow target has moved and calculates new path if necessary
     */
    handleFollowing() {
        const followTargetPos = Map.worldToTilePosition(this.followTarget, this.entity.game.getTileSize())
        if (this.followTargetLastPos == null || this.followTargetLastPos.x != followTargetPos.x || this.followTargetLastPos.y != followTargetPos.y) {
            this.followTargetLastPos = followTargetPos
            this.setPathfindingTarget(this.followFunction(this.followTarget))
        }
    }

    /**
     * Handles movement according to previously calculated path.
     * Removes a tile from the path array when the Entity is close enough to it.
     * Updates this.direction
     */
    handlePathMovement() {
        this.moving = true
        const tile = this.path[0]
        if(this.entity.game.sceneManager.currentScene.isPlayable()){// === this.entity.game.sceneManager.getScene('firstLevel')){
            const tilePosition = Map.tileToWorldPosition(tile, this.entity.game.sceneManager.currentScene.map.tileSize)
            let dx = tilePosition.x - this.entity.x
            let dy = tilePosition.y - this.entity.y
            const distance = Math.sqrt(dx * dx + dy * dy)
            if (distance < 10) {
                this.path.splice(0, 1)
                if (this.path.length < 1) {
                    this.moving = false
                    this.setStandingAnimation()
                    return
                }
            }
            dx = dx / distance
            dy = dy / distance
            this.move(new Vector(dx, dy))
            this.direction = this.calculateDirection(dx, dy)
            this.setWalkingAnimation()
        }
        // dx and dy are the x and y distances between this Entity and the tile in world position (pixels)
        
    }

    setWalkingAnimation() {
        this.entity.getComponent(AnimationComponent).setDirectionalAnimation(this.direction, {
            north: ANIMS.WalkNorth,
            east: ANIMS.WalkEast,
            south: ANIMS.WalkSouth,
            west: ANIMS.WalkWest
        })
    }

    setStandingAnimation() {
        this.entity.getComponent(AnimationComponent).setDirectionalAnimation(this.direction, {
            north: ANIMS.StandNorth,
            east: ANIMS.StandEast,
            south: ANIMS.StandSouth,
            west: ANIMS.StandWest
        })
    }

    /**
     * Moves the Entity according to its speed and the game's clock tick
     * @param {Vector} vec The vector representing the direction to move
     */
    move(vec) {
        this.entity.x += vec.x * this.entity.game.clockTick * this.speed
        this.entity.y += vec.y * this.entity.game.clockTick * this.speed
    }

    /**
     * Calculates the direction of the Entity based on current movement
     * @param {Number} dx The change in x this frame 
     * @param {Number} dy The change in y this frame
     */
    calculateDirection(dx, dy) {
        if (Math.abs(dx) > Math.abs(dy)) {
            if (dx > 0) {
                return DIRECTIONS.East
            } else {
                return DIRECTIONS.West
            }
        } else {
            if (dy > 0) {
                return DIRECTIONS.South
            } else {
                return DIRECTIONS.North
            }
        }
    }

    /**
     * Sets the path to the specified tile index
     * @param {Number} x The x index of the tile to pathfind to (x values increase starting from the left going right)
     * @param {Number} y The y index of the tile to pathfind to (y values increase starting from the top going down)
     */
    setPathfindingTarget(tile) {
        const currentTile = this.getCurrentTile()
        const pathfinder = new AStarPathfinding(this.entity.game.getWorld(), [currentTile.x, currentTile.y], [tile.x, tile.y])
        const path = pathfinder.calculatePath()
        if (path.length > 1) {
            path.splice(0, 1)
        }
        this.path = path
    }

    setFacing(entity) {
        const otherMovementComponent = entity.getComponent(MovementComponent)
        if (otherMovementComponent) {
            const dx = otherMovementComponent.entity.x - this.entity.x
            const dy = otherMovementComponent.entity.y - this.entity.y
            const directionToFace = this.calculateDirection(dx, dy)
            this.setDirection(directionToFace)
        }
    }


    /**
     * Sets the follow target and sets following to true
     * @param {Entity} entity The Entity to follow
     */
    setFollowTarget(entity) {
        this.followTarget = entity
        this.following = true
        this.followFunction = this.getTileBehind
    }

    /**
     * Sets the attack-follow target and sets following to true
     * @param {Entity} entity The Entity to follow
     */
    setAttackFollowTarget(entity) {
        this.followTarget = entity
        this.following = true
        this.followFunction = this.getClosestOrthogonalTile
    }

    /**
     * Sets following to false
     */
    stopFollowing() {
        this.following = false
    }

    /**
     * Sets the Entity's current direction
     * @param {Symbol} direction The direction to face the Entity
     */
    setDirection(direction) {
        this.direction = direction
    }

    /**
     * Gets the Entity's current tile position
     * @returns {Object} The current tile position object {x, y}
     */
    getCurrentTile() {
        return Map.worldToTilePosition(this.entity, this.entity.game.getTileSize())
    }

    /**
     * @returns {Symbol} The Entity's current facing
     */
    getDirection() {
        return this.direction
    }

    /**
     * Calculates the tile relative to this Entity's direction
     * Note: Could result in block-ins for the PlayerCharacter
     */
    getTileBehind(entity) {
        const entityTile = Map.worldToTilePosition(entity, this.entity.game.getTileSize())
        switch (entity.getComponent(MovementComponent).direction) {
            case DIRECTIONS.North:
                return new Vector(entityTile.x, entityTile.y + 1)
            case DIRECTIONS.South:
                return new Vector(entityTile.x, entityTile.y - 1)
            case DIRECTIONS.East:
                return new Vector(entityTile.x - 1, entityTile.y)
            case DIRECTIONS.West:
            default:
                return new Vector(entityTile.x + 1, entityTile.y)
        }
    }

    /**
     * Returns the nearest tile 
     */
    getClosestOrthogonalTile(entity) {
        const entityTile = Map.worldToTilePosition(entity, this.entity.game.getTileSize())
        const myTile = Map.worldToTilePosition(this.entity, this.entity.game.getTileSize())
        const dx = entityTile.x - myTile.x
        const dy = entityTile.y - myTile.y
        const direction = this.calculateDirection(dx, dy)
        switch (direction) {
            case DIRECTIONS.North:
                return new Vector(entityTile.x, entityTile.y + 1)
            case DIRECTIONS.South:
                return new Vector(entityTile.x, entityTile.y - 1)
            case DIRECTIONS.East:
                return new Vector(entityTile.x - 1, entityTile.y)
            case DIRECTIONS.West:
            default:
                return new Vector(entityTile.x + 1, entityTile.y)
        }
    }

    /**
     * Calculates the tile relative to this Entity's direction
     * Note: Could result in block-ins for the PlayerCharacter
     */
    getTileFacing(entity) {
        const entityTile = Map.worldToTilePosition(entity, this.entity.game.getTileSize())
        switch (entity.getComponent(MovementComponent).direction) {
            case DIRECTIONS.North:
                return new Vector(entityTile.x, entityTile.y - 1)
            case DIRECTIONS.South:
                return new Vector(entityTile.x, entityTile.y + 1)
            case DIRECTIONS.East:
                return new Vector(entityTile.x + 1, entityTile.y)
            case DIRECTIONS.West:
            default:
                return new Vector(entityTile.x - 1, entityTile.y)
        }
    }

    setSpeed(speed) {
        this.speed = speed
    }

    /**
     * Halts the entity by emptying the path array and standing.
     */
    halt() {
        this.path = []
        this.setStandingAnimation()
    }
}