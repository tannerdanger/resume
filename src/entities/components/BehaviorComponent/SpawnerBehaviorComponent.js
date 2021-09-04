import Component from '../Component.js'
import Random from '../../../utils/Random.js'
import Entity from '../../Entity.js'
import Vector from '../../../utils/Vector.js'
import MovementComponent from '../MovementComponent.js'
import AnimationComponent from '../AnimationComponent.js'
import ArcherData from '../../characters/ArcherDefaultData.js'
import RobotData from '../../characters/RobotDefaultData.js'
import MageData from '../../characters/MageDefaultData.js'
import ChiefData from '../../characters/ChiefDefaultData.js'
import WolfData from '../../characters/WolfDefaultData.js'
import KnightData from '../../characters/KnightDefaultData.js'
import WarriorData from '../../characters/WarriorDefaultData.js'
import AttributeComponent from '../AttributeComponent.js'
import CollisionComponent from '../CollisionComponent.js'
import EnemyInteractionComponent from '../InteractionComponent/EnemyInteractionComponent.js'
import CombatComponent from '../CombatComponent.js'
import { STATES } from '../../../utils/Const.js'
import EnemyBehaviorComponent from './EnemyBehaviorComponent.js'

export default class SpawnComponentBehavior extends Component {
    /**
     * @param {Entity} entity A reference to the Entity this Component is attached to.
     * @param {Scene} scene The scene this spawn component will add mobs to.
     * @param {Object} spawnConfig Spawn configuration for this spawner.
     */
    constructor(entity, scene, spawnConfig, radius, difficulty, room) {
        super(entity)
        this.v = Vector.vectorFromEntity(entity)
        this.scene = scene
        this.cfg = spawnConfig
        this.mobs = []
        this.rng = new Random()
        this.spawnTimer = 0
        this.delay = 400
        this.radius = radius
        this.difficulty = difficulty
        this.active = false
        this.mages = 0
        this.archers = 0
        this.robots = 0
        this.warriors = 0
        this.chiefs = 0
        this.wolves = 0
        this.knights = 0
        this.room = room
        this.spawnedMobs = 0
        this.totalMobs = 0
    }


    /**
     * Called ach update cycle.
     * Spawns mobs at a steady pace. In random order from mobs array.
     */
    update() {
        if (this.active === false && this.scene.map.getRoom(this.room)) {
            const opened = this.scene.map.getRoom(this.room).states[STATES.Opened]

            if (opened) {
                this.getMobs()
                this.generateMobs()
                this.active = true
            }
        }
        if (this.active) {
            this.spawnTimer++
            if (this.spawnTimer >= 250) {
                this.addMob()
            }
            // Display mobs/total mobs or mo
            // this.scene.updateSpawnerDisplay(this.spawnedMobs, this.totalMobs)
            this.scene.updateSpawnerDisplay(this.spawnedMobs, this.mobs.length)
        }
    }

    draw() { }

    addMob() {
        if (this.mobs.length > 0) {
            const index = this.rng.int(0, this.mobs.length)
            const entity = this.mobs[index]
            this.scene.addEntity(entity)
            this.mobs.splice(index, 1)
            this.entity.game.soundManager.spawnSound()
            this.spawnedMobs++
        }
        this.spawnTimer = 0
    }

    /**
     * Gets mobs from spawnConfig
     */
    getMobs() {
        this.mages = Math.ceil(this.cfg.mage * this.difficulty)
        this.archers = Math.ceil(this.cfg.archer * this.difficulty)
        this.robots = Math.ceil(this.cfg.robot * this.difficulty)
        this.wolves = Math.ceil(this.cfg.wolf * this.difficulty)
        this.knights = Math.ceil(this.cfg.knight * this.difficulty)
        this.chiefs = Math.ceil(this.cfg.chief * this.difficulty)
        this.warriors = Math.ceil(this.cfg.warrior * this.difficulty)
        const totalMobs = this.mages + this.archers + this.robots + this.warriors + this.knights + this.chiefs + this.wolves
        this.scene.addMobs(totalMobs)
        this.totalMobs = totalMobs
    }

    /**
     * Pushes the count of each mob type into mobs array.
     */
    // eslint-disable-next-line complexity
    generateMobs() {
        for (let i = 0; i < this.mages; i++) {
            const angle = this.rng.float() * Math.PI * 2
            const r = this.rng.int(10, this.radius)
            const mage = new Entity(this.entity.game, new Vector(
                this.entity.x + Math.cos(angle) * r,
                this.entity.y + Math.sin(angle) * r
            ), MageData.Attributes)
            mage.addComponent(new AnimationComponent(mage, MageData.AnimationConfig))
            mage.addComponent(new MovementComponent(mage, MageData.Attributes))
            mage.addComponent(new AttributeComponent(mage, MageData.Attributes))
            mage.addComponent(new CollisionComponent(mage))
            mage.addComponent(new EnemyInteractionComponent(mage))
            mage.addComponent(new CombatComponent(mage))
            mage.addComponent(new EnemyBehaviorComponent(mage))
       
            this.mobs.push(mage)
        }
        for (let i = 0; i < this.archers; i++) {
            const angle = this.rng.float() * Math.PI * 2
            const r = this.rng.int(10, this.radius)
            const archer = new Entity(this.entity.game, new Vector(
                this.entity.x + Math.cos(angle) * r,
                this.entity.y + Math.sin(angle) * r
            ), ArcherData.Attributes)
            archer.addComponent(new AnimationComponent(archer, ArcherData.AnimationConfig))
            archer.addComponent(new MovementComponent(archer, ArcherData.Attributes))
            archer.addComponent(new AttributeComponent(archer, ArcherData.Attributes))
            archer.addComponent(new CollisionComponent(archer))
            archer.addComponent(new EnemyInteractionComponent(archer))
            archer.addComponent(new CombatComponent(archer))
            archer.addComponent(new EnemyBehaviorComponent(archer))
            this.mobs.push(archer)
        }
        for (let i = 0; i < this.robots; i++) {
            const angle = this.rng.float() * Math.PI * 2
            const r = this.rng.int(10, this.radius)
            const robot = new Entity(this.entity.game, new Vector(
                this.entity.x + Math.cos(angle) * r,
                this.entity.y + Math.sin(angle) * r
            ), RobotData.Attributes)
            robot.addComponent(new AnimationComponent(robot, RobotData.AnimationConfig))
            robot.addComponent(new MovementComponent(robot, RobotData.Attributes))
            robot.addComponent(new AttributeComponent(robot, RobotData.Attributes))
            robot.addComponent(new CollisionComponent(robot))
            robot.addComponent(new EnemyInteractionComponent(robot))
            robot.addComponent(new CombatComponent(robot))
            robot.addComponent(new EnemyBehaviorComponent(robot))
            this.mobs.push(robot)
        }

        for (let i = 0; i < this.chiefs; i++) {
            const angle = this.rng.float() * Math.PI * 2
            const r = this.rng.int(10, this.radius)
            const chief = new Entity(this.entity.game, new Vector(
                this.entity.x + Math.cos(angle) * r,
                this.entity.y + Math.sin(angle) * r
            ), ChiefData.Attributes)
            chief.addComponent(new AnimationComponent(chief, ChiefData.AnimationConfig))
            chief.addComponent(new MovementComponent(chief, ChiefData.Attributes))
            chief.addComponent(new AttributeComponent(chief, ChiefData.Attributes))
            chief.addComponent(new CollisionComponent(chief))
            chief.addComponent(new EnemyInteractionComponent(chief))
            chief.addComponent(new CombatComponent(chief))
            chief.addComponent(new EnemyBehaviorComponent(chief))
            this.mobs.push(chief)
        }
        
        
        for (let i = 0; i < this.wolves; i++) {
            const angle = this.rng.float() * Math.PI * 2
            const r = this.rng.int(10, this.radius)
            const wolf = new Entity(this.entity.game, new Vector(
                this.entity.x + Math.cos(angle) * r,
                this.entity.y + Math.sin(angle) * r
            ), WolfData.Attributes)
            wolf.addComponent(new AnimationComponent(wolf, WolfData.AnimationConfig))
            wolf.addComponent(new MovementComponent(wolf, WolfData.Attributes))
            wolf.addComponent(new AttributeComponent(wolf, WolfData.Attributes))
            wolf.addComponent(new CollisionComponent(wolf))
            wolf.addComponent(new EnemyInteractionComponent(wolf))
            wolf.addComponent(new CombatComponent(wolf))
            wolf.addComponent(new EnemyBehaviorComponent(wolf))
            this.mobs.push(wolf)
        }

        for (let i = 0; i < this.knights; i++) {
            const angle = this.rng.float() * Math.PI * 2
            const r = this.rng.int(10, this.radius)
            const knight = new Entity(this.entity.game, new Vector(
                this.entity.x + Math.cos(angle) * r,
                this.entity.y + Math.sin(angle) * r
            ), KnightData.Attributes)
            knight.addComponent(new AnimationComponent(knight, KnightData.AnimationConfig))
            knight.addComponent(new MovementComponent(knight, KnightData.Attributes))
            knight.addComponent(new AttributeComponent(knight, KnightData.Attributes))
            knight.addComponent(new CollisionComponent(knight))
            knight.addComponent(new EnemyInteractionComponent(knight))
            knight.addComponent(new CombatComponent(knight))
            knight.addComponent(new EnemyBehaviorComponent(knight))
            this.mobs.push(knight)
        }

        
        for (let i = 0; i < this.warriors; i++) {
            const angle = this.rng.float() * Math.PI * 2
            const r = this.rng.int(10, this.radius)
            const warrior = new Entity(this.entity.game, new Vector(
                this.entity.x + Math.cos(angle) * r,
                this.entity.y + Math.sin(angle) * r
            ), WarriorData.Attributes)
            warrior.addComponent(new AnimationComponent(warrior, WarriorData.AnimationConfig))
            warrior.addComponent(new MovementComponent(warrior, WarriorData.Attributes))
            warrior.addComponent(new AttributeComponent(warrior, WarriorData.Attributes))
            warrior.addComponent(new CollisionComponent(warrior))
            warrior.addComponent(new EnemyInteractionComponent(warrior))
            warrior.addComponent(new CombatComponent(warrior))
            warrior.addComponent(new EnemyBehaviorComponent(warrior))
            this.mobs.push(warrior)
        }

    }
}