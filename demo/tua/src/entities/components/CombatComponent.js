import Component from './Component.js'
import AttributeComponent from './AttributeComponent.js'
import Vector from '../../utils/Vector.js'
import AnimationComponent from './AnimationComponent.js'
import { ANIMATIONS as ANIMS, DIRECTIONS } from '../../utils/Const.js'
import MovementComponent from './MovementComponent.js'
import EquippedItemsComponent from './EquippedItemsComponent.js'
import Entity from '../Entity.js'
import ArcherEffectData from '../effects/ArcherEffectDefaultData.js'
import MageEffectData from '../effects/MageEffectDefaultData.js'
import ProjectileBehaviorComponent from './BehaviorComponent/ProjectileBehaviorComponent.js'
import CollisionComponent from './CollisionComponent.js'
import ChiefEffectData from '../effects/ChiefEffectDefaultData.js'

export default class CombatComponent extends Component {
    constructor(entity) {
        super(entity)
        this.attributeComponent = this.entity.getComponent(AttributeComponent)
        this.dmgTimer = 0
        this.combatTarget = false
        this.damageDisplay = this.setDamageDisplay(-1, false)
        this.damageDisplay.timer = 0
        this.statis = false
    }

    setStasis(bool) {
        this.statis = bool
    }
    /**
     * Update's the entity's attack timer to mitigate time between attacks.
     * Checks if the entity is dead.
     */
    // eslint-disable-next-line complexity
    update() {
        this.dmgTimer -= this.entity.game.clockTick
        this.damageDisplay.timer -= this.entity.game.clockTick
        if (!this.statis) {
            if (this.checkDead()) {
                if (this.entity.game.getCurrentScene().isPlayable() && this.entity.game.getCurrentScene() === 'level1') {
                    this.entity.game.getCurrentScene().spawnReward(this.entity)
                    this.entity.game.removeEntityByRef(this.entity)
                }
    
            }
            if (this.hasCombatTarget()) {
                if (this.attributeComponent.isMelee) {
                    if (this.inRange() && this.timerCooled() && this.notMoving()) {
                        this.entity.game.soundManager.playAttack(this.entity.UUID)
                        this.meleeAttack()
                    }
                }
                if (!this.attributeComponent.isMelee) {
                    if (this.inRange() && this.timerCooled()) {
                        this.entity.getComponent(MovementComponent).halt()
                        this.entity.game.soundManager.playAttack(this.entity.UUID)
                        this.doAttackAnimation()
                        this.createProjectile()
                    }
                }
            }
        }

    }

    /**
     * Draws the last damage above the entities head.
     * TODO: This currently draws above the player's head. Find better place to display? Above victim's head?
     */
    draw() {
        const ctx = this.entity.game.ctx
        if (this.damageDisplay.timer > 0) {
            const pos = this.entity.game.worldToScreen(this.entity)
            ctx.font = '26px arcade'
            ctx.textAlign = 'center'
            const op = this.damageDisplay.timer > 1? 1:this.damageDisplay.timer
            const clr1 = 'rgba(180,0,0,'+op+')'
            const clr2 = 'rgba(0,0,180,'+op+')'
            ctx.fillStyle = this.damageDisplay.isMagic ? clr2 : clr1
            ctx.fillText(this.damageDisplay.value.toFixed(1), pos.x - 1, pos.y - 150 - (this.damageDisplay.timer * -10))
        }
    }

    /**
     * Checks if it is possible to execute a melee attack
     */
    canAttack() {
        return this.hasCombatTarget() && this.inRange() && this.timerCooled() && this.notMoving()
    }

    /**
     * Checks if this Entity has a combat target
     * @returns {boolean}
     */
    hasCombatTarget() {
        return this.combatTarget !== false && this.combatTarget !== null
    }

    /**
     * Checks if the attack timer is cooled.
     * @returns {boolean}
     */
    timerCooled() {
        return this.dmgTimer <= 0
    }

    notMoving() {
        const movementComponent = this.entity.getComponent(MovementComponent)
        if (movementComponent) {
            return movementComponent.moving === false
        }
    }

    /**
     * Checks if the Entity is in range of combat
     * @returns {boolean}
     */
    inRange() {
        return Vector.vectorFromEntity(this.combatTarget).distance(Vector.vectorFromEntity(this.entity)) < this.attributeComponent.Range
    }

    /**
     * Sets the current combat target to attack
     *
     * @param {Entity} foe The Entity to begin attacking
     */
    setCombatTarget(foe) {
        this.combatTarget = foe
        const movementComponent = this.entity.getComponent(MovementComponent)
        if (movementComponent) {
            movementComponent.setAttackFollowTarget(this.combatTarget)
        }
    }

    /**
     * Unsets the current combat target
     */
    unsetCombatTarget() {
        const movementComponent = this.entity.getComponent(MovementComponent)
        if (this.hasCombatTarget() && movementComponent) {
            const currentFollowTarget = movementComponent.followTarget
            if (currentFollowTarget && currentFollowTarget.getUUID() === this.combatTarget.getUUID()) {
                movementComponent.stopFollowing()
            }
        }
        this.combatTarget = false
    }

    /**
     * Initiates a melee attack from this Entity to Entity foe
     */
    meleeAttack() {
        //this.entity.game.soundManager.playAttack(this.entity.UUID)
        const dmg = this.calculatePhysicalDamage()
        const killed = this.combatTarget.getComponent(CombatComponent).applyPhysicalDamage(dmg)
        this.dmgTimer = 3 //Weird, each entity's attack speed was separately defined and working like, 2 weeks ago.
        this.doAttackAnimation()
        if (killed) {
            this.unsetCombatTarget()
        }
    }

    /**
     * Initiates a magic attack from this Entity to Entity foe
     * 
     * @param {Entity} foe  The Entity being attacked
     */
    magicAttack(foe) {
        const dmg = this.calculateMagicDamage()
        const killed = foe.getComponent(CombatComponent).applyMagicDamage(dmg)
        if (killed) {
            this.unsetCombatTarget()
        }
    }

    /**
     * Sets the cooresponding attack animation for Entities
     */
    doAttackAnimation() {
        const movementComponent = this.entity.getComponent(MovementComponent)
        movementComponent.setFacing(this.combatTarget)
        this.entity.getComponent(AnimationComponent).setDirectionalAnimation(movementComponent.direction, {
            north: ANIMS.AttackNorth,
            east: ANIMS.AttackEast,
            south: ANIMS.AttackSouth,
            west: ANIMS.AttackWest
        }, () => {
            this.entity.getComponent(AnimationComponent).setDirectionalAnimation(movementComponent.direction, {
                north: ANIMS.StandNorth,
                east: ANIMS.StandEast,
                south: ANIMS.StandSouth,
                west: ANIMS.StandWest
            })
        })
    }

    /**
     * Calculates the damage output of this entity so it can be applied onto it's target
     *
     * @returns {number} the damage to apply
     */
    calculatePhysicalDamage(modifiers = {}) {
        Object.assign(modifiers, { Str: 0, Atk: 0 }, modifiers)
        const equippedItems = this.entity.getComponent(EquippedItemsComponent)
        if (equippedItems) {
            modifiers.Atk += equippedItems.getEquipmentAtk()
        }
        const appliedStr = modifiers.Str + this.attributeComponent.Str
        const appliedAtk = modifiers.Atk + this.attributeComponent.Atk
        return Math.random() * appliedStr + appliedAtk
    }

    /**
     * Calculates the damage output of this entity so it can be applied onto it's target
     *
     * @returns {number} the damage to apply
     */
    calculateMagicDamage(modifiers = {}) {
        Object.assign(modifiers, { Int: 0, Matk: 0 }, modifiers)
        const equippedItems = this.entity.getComponent(EquippedItemsComponent)
        if (equippedItems) {
            modifiers.Matk += equippedItems.getEquipmentMatk()
        }
        const appliedInt = modifiers.Int + this.attributeComponent.Int
        const appliedMatk = modifiers.Matk + this.attributeComponent.Matk
        return Math.random() * appliedInt + appliedMatk
    }

    /**
     * Applies INCOMING damage to the entity.
     *
     * @param damage - the damage to be applied, BEFORE it is mitigated by defense
     *
     * @returns {boolean} true if entity is killed, false if still alive
     */
    applyPhysicalDamage(damage) {
        const modifiers = { Def: 0 }
        const equippedItems = this.entity.getComponent(EquippedItemsComponent)
        if (equippedItems) {
            modifiers.Def += equippedItems.getEquipmentDef()
        }
        damage = Math.max(0, damage)
        damage = damage * damage / (damage + this.attributeComponent.Def + modifiers.Def)
        this.damageDisplay = this.setDamageDisplay(damage, false)
        this.damageColor = 'red'
        this.lastDamage = damage
        this.attributeComponent.HP -= damage
        //check if dead
        if (this.checkDead()) {
            this.removeByCombat()
            return true
        }
        return false
    }

    /**
     * Applies INCOMING magic dmg to the entity.
     *
     * @param damage - the damage to be applied, BEFORE it is mitigated by defense
     *
     * @returns {boolean} true if entity is killed, false if still alive
     */
    applyMagicDamage(damage) {
        const modifiers = { Mdef: 0 }
        const equippedItems = this.entity.getComponent(EquippedItemsComponent)
        if (equippedItems) {
            modifiers.Mdef += equippedItems.getEquipmentMdef()
        }
        damage = Math.max(0, damage)
        damage = damage * damage / (damage + this.attributeComponent.Mdef + modifiers.Mdef)
        this.damageDisplay = this.setDamageDisplay(damage, true)
        this.displayDamage = true
        this.damageColor = 'blue'
        this.lastDamage = damage
        this.attributeComponent.HP = this.attributeComponent.HP - damage
        if (this.checkDead()) {
            this.removeByCombat()
            return true
        }

        return false
    }

    setDamageDisplay(value, isMagic) {
        return {
            value: value,
            timer: 2,
            isMagic: isMagic
        }
    }

    /**
     * Performs a check to see if this Entity is dead
     */
    checkDead() {
        return this.attributeComponent.HP <= 0 || this.entity.removeFromWorld
    }

    removeByCombat() {
        this.entity.game.addScore(this.attributeComponent.Name, true)
        this.entity.game.removeEntityByRef(this.entity)
        if (this.attributeComponent.Name === 'PLAYER') {
            this.entity.game.sceneManager.change('scoredisplay')
            this.entity.game.sceneManager.currentScene.updateText()
        }
    }

    createProjectile() {
        this.dmgTimer = 3
        const origin = this.getEffectOffsetPos()
        const target = Vector.vectorFromEntity(this.entity.game.sceneManager.currentScene.getPlayer())
        const proj = new Entity(this.entity.game, origin)
        const attributes = this.entity.getComponent(AttributeComponent)

        if (this.entity.UUID.includes('MAGE')) {
            proj.addComponent(new AnimationComponent(proj, MageEffectData.AnimationConfig))
            proj.addComponent(new MovementComponent(proj, MageEffectData.Attributes))
            proj.addComponent(new ProjectileBehaviorComponent(proj, target, false, this.entity))
            proj.addComponent(new AttributeComponent(proj, attributes))
            proj.addComponent(new CollisionComponent(proj))
            proj.addComponent(new CombatComponent(proj))
        }
        if (this.entity.UUID.includes('ARCHER')) {
            proj.addComponent(new AnimationComponent(proj, ArcherEffectData.AnimationConfig))
            proj.addComponent(new MovementComponent(proj, ArcherEffectData.Attributes))
            proj.addComponent(new ProjectileBehaviorComponent(proj, target, false, this.entity))
            proj.addComponent(new AttributeComponent(proj, attributes))
            proj.addComponent(new CollisionComponent(proj))
            proj.addComponent(new CombatComponent(proj))
        }
        if (this.entity.UUID.includes('CHIEF')) {
            proj.addComponent(new AnimationComponent(proj, ChiefEffectData.AnimationConfig))
            proj.addComponent(new MovementComponent(proj, ArcherEffectData.Attributes))
            proj.addComponent(new ProjectileBehaviorComponent(proj, target, false, this.entity))
            proj.addComponent(new AttributeComponent(proj, attributes))
            proj.addComponent(new CollisionComponent(proj))
            proj.addComponent(new CombatComponent(proj))
        }
        this.entity.game.sceneManager.currentScene.addEntity(proj)
    }

    /**
     * Get the target based off mouse position.
     */
    getTarget() {
        return this
    }

    /**
     * Returns an offset off the caster for the spells animation to originate.
     */
    getEffectOffsetPos() {
        const pos = new Vector(
            this.entity.x,
            this.entity.y
        )
        const direction = this.entity.getComponent(MovementComponent).direction
        if (direction === DIRECTIONS.West) {
            pos.x -= 20
        } else if (direction === DIRECTIONS.East) {
            pos.x += 20
        } else if (direction === DIRECTIONS.North) {
            pos.y -= 20
        } else {
            pos.y += 20
        }
        return pos
    }

    isAlly() {
        return this.entity.UUID.includes('PLAYER')
    }
}
