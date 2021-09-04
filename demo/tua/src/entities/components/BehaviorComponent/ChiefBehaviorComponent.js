import Component from '../Component.js'
import Vector from '../../../utils/Vector.js'
import AttributeComponent from '../AttributeComponent.js'
import Random from '../../../utils/Random.js'
import WolfData from '../../characters/WolfDefaultData.js'
import MovementComponent from '../MovementComponent.js'
import AnimationComponent from '../AnimationComponent.js'
import Entity from '../../Entity.js'
import CollisionComponent from '../CollisionComponent.js'
import EnemyInteractionComponent from '../InteractionComponent/EnemyInteractionComponent.js'
import CombatComponent from '../CombatComponent.js'
import TeleportData from '../../effects/TeleportDefaultData.js'
import TeleportBehaviorComponent from './TeleportBehaviorComponent.js'
import { DEFINED_MAPS as DM } from '../../../utils/Const.js'
import Map from '../../../world/Map.js'
import EnemyBehaviorComponent from './EnemyBehaviorComponent.js';

export default class ChiefBehaviorComponent extends Component {
    constructor(entity) {
        super(entity)
        this.attributeComponent = this.entity.getComponent(AttributeComponent)
        this.teleports = 0
        this.HPFull = this.attributeComponent.HP
        this.fled = false
        this.coolDown = 0
        this.coolEnd = 150
        this.rng = new Random()
    }


    update() {
        if (this.checkHP() && !this.fled) {
            this.teleports++
            this.fled = true
            this.teleportOut()
            this.summonWolves()
        }
        if (this.fled) {
            this.coolDown += this.entity.game.clockTick * 10
        }
        if (this.coolDown > this.coolEnd) {
            this.teleportIn()
            this.fled = false
            this.coolDown = 0
        }
    }

    summonWolves() {
        
        const wolves = this.rng.int(2, 5)
        for (let i = 0; i < wolves; i++) {
            const pos = this.getRandomTile(DM.Boss.centerTiles)
            const wolf = new Entity(this.entity.game, new Vector(
                pos.x, pos.y))
            wolf.addComponent(new AnimationComponent(wolf, WolfData.AnimationConfig))
            wolf.addComponent(new MovementComponent(wolf, WolfData.Attributes))
            wolf.addComponent(new AttributeComponent(wolf, WolfData.Attributes))
            wolf.addComponent(new CollisionComponent(wolf))
            wolf.addComponent(new EnemyInteractionComponent(wolf))
            wolf.addComponent(new CombatComponent(wolf))
            wolf.addComponent(new EnemyBehaviorComponent(wolf))
            this.entity.game.sceneManager.currentScene.addEntity(wolf)
        }

    }

    teleportOut() { 
        const origin = Vector.vectorFromEntity(this.entity)    
        const target = this.getRandomTile(DM.Boss.outTiles)
        const teleportEffect = new Entity(this.entity.game, origin)
        teleportEffect.addComponent(new AnimationComponent(teleportEffect, TeleportData.AnimationConfig))
        teleportEffect.addComponent(new TeleportBehaviorComponent(teleportEffect, this.entity, target))
        this.entity.game.sceneManager.currentScene.addEntity(teleportEffect)
    }
    
    teleportIn() {
        const origin = Vector.vectorFromEntity(this.entity)
        const target =this.getRandomTile(DM.Boss.centerTiles)
        const teleportEffect = new Entity(this.entity.game, origin)
        teleportEffect.addComponent(new AnimationComponent(teleportEffect, TeleportData.AnimationConfig))
        teleportEffect.addComponent(new TeleportBehaviorComponent(teleportEffect, this.entity, target))
        this.entity.game.sceneManager.currentScene.addEntity(teleportEffect)
    }
    // eslint-disable-next-line complexity
    checkHP() {
        return (this.attributeComponent.HP < this.HPFull * .8 && this.teleports === 0) ||
            (this.attributeComponent.HP < this.HPFull * .6 && this.teleports === 1) ||
            (this.attributeComponent.HP < this.HPFull * .4 && this.teleports === 2) ||
            (this.attributeComponent.HP < this.HPFull * .2 && this.teleports === 3)      
    }

    getRandomTile(tiles) {
        const index =  this.rng.int(0, tiles.length)
        const tile =  tiles[index]
        const retVal = Map.tileToWorldPosition({x: tile[0], y: tile[1]}, 64)
        return retVal
    }
}
