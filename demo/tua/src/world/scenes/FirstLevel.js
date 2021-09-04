import Scene from './Scene.js'
import Map from '../Map.js'
import Dungeon from '../generators/Dungeon.js'
import Entity from '../../entities/Entity.js'
import { ASSET_PATHS } from '../../utils/Const.js'

import PlayerCharacterData from '../../entities/characters/PlayerCharacterDefaultData.js'
import ArcherData from '../../entities/characters/ArcherDefaultData.js'
import MarriottData from '../../entities/characters/MarriottDefaultData.js'

import MovementComponent from '../../entities/components/MovementComponent.js'
import MarriottMovementComponent from '../../entities/components/MarriottMovementComponent.js'
import PlayerInputComponent from '../../entities/components/PlayerInputComponent.js'
import AnimationComponent from '../../entities/components/AnimationComponent.js'

import CollisionComponent from '../../entities/components/CollisionComponent.js'
import AttributeComponent from '../../entities/components/AttributeComponent.js'
import CombatComponent from '../../entities/components/CombatComponent.js'

import EnemyInteractionComponent from '../../entities/components/InteractionComponent/EnemyInteractionComponent.js'
import MarriottInteractionComponent from '../../entities/components/InteractionComponent/MarriottInteractionComponent.js'
import Vector from '../../utils/Vector.js'

import PlayerCharacterCombatComponent from '../../entities/components/PlayerCharacterCombatComponent.js'

import WolfDefaultData from '../../entities/characters/WolfDefaultData.js'

import EquipmentComponent from '../../entities/components/EquipmentComponent.js'
import EquippedItemsComponent from '../../entities/components/EquippedItemsComponent.js'

export default class FirstLevel extends Scene {
    constructor(game) {
        super(game, 1)
        this.name = 'level1'
        this.spawnedMobs = 0
        this.mobs = 0
        
        //Initialize a dungeon with options, possibly move to the scene superclass w/ parameters.
        const dungeon = new Dungeon({
            size: [2000, 2000],
            // seed: 'abcd', //omit for generated seed
            rooms: {
                initial: {
                    min_size: [14, 18], //Floor size
                    max_size: [14, 18],
                    max_exits: 4,
                    position: [100, 100] //OPTIONAL pos of initial room 
                },
                any: {
                    min_size: [12, 12],
                    max_size: [16, 16],
                    max_exits: 4
                },
                corridor: { 
                    min_size: [26, 12],
                    max_size: [26, 12],
                    max_exits: 4
                },
                exit: {
                    min_size: [15, 15],
                    max_size: [20, 20],
                    max_exits: 4
                },
                treasure: {
                    min_size: [20, 16],
                    max_size: [20, 16],
                    max_exits: 3
                },
                maze: {
                    min_size: [18, 18],
                    max_size: [18, 18], 
                    max_exits: 4
                }

            },
            max_corridor_length: 15,
            min_corridor_length: 15,
            corridor_density: 0, //corridors per room, remove corridors? They'll be tagged as such.
            symmetric_rooms: true, // exits must be in the center of a wall if true. Setting true will make design easier
            interconnects: 1, //extra corridors to connect rooms and make circular paths. not 100% guaranteed
            max_interconnect_length: 10,
            room_count: 20
        })

        dungeon.generate()

        const map = new Map(game, game.getAsset(ASSET_PATHS.Dungeon), 64, 16, dungeon, this)
        this.setMap(map)
        const start = this.map.getStartPos()

        const playerCharacter = this.createPlayerCharacter(game, start)
        const marriott = this.createMarriott(game, start, playerCharacter)

        this.setPlayer(playerCharacter)
        this.addEntity(playerCharacter)
        this.addEntity(marriott)
        this.setCamera(playerCharacter)
        // const test = this.createArcher(game, start, playerCharacter)
        // this.addEntity(test)

        this.createMapEntities(game, map)

        const testEq = new Entity(game, start)
        testEq.addComponent(new EquipmentComponent(testEq, {
            name: 'Thunderfury of the Windseeker',
            type: 'weapon',
            atk: 3,
            def: 0,
            matk: 2,
            mdef: 1
        }))
        testEq.addComponent(new AnimationComponent(testEq, {
            Spritesheet: ASSET_PATHS.EquipmentWeapon,
            Width: 32,
            Height: 32,
            Scale: 1.5
        }))
        testEq.addComponent(new CollisionComponent(testEq))
        this.addItem(testEq)

    }

    createMarriott(game, start, playerCharacter) {
        const marriott = new Entity(game, start, MarriottData.Attributes)
        marriott.addComponent(new AnimationComponent(marriott, MarriottData.AnimationConfig))
        marriott.addComponent(new MarriottMovementComponent(marriott, MarriottData.Attributes))
        marriott.addComponent(new AttributeComponent(marriott, MarriottData.Attributes))
        marriott.addComponent(new CollisionComponent(marriott))
        marriott.addComponent(new MarriottInteractionComponent(marriott))
        marriott.getComponent(MovementComponent).setFollowTarget(playerCharacter)
        return marriott
    }

    createArcher(game, start, playerCharacter) {
        const archer = new Entity(game, { x: start.x - 300, y: start.y - 350})
        archer.addComponent(new AnimationComponent(archer, WolfDefaultData.AnimationConfig))
        archer.addComponent(new MovementComponent(archer, ArcherData.Attributes))
        archer.addComponent(new AttributeComponent(archer, ArcherData.Attributes))
        archer.addComponent(new CollisionComponent(archer))
        archer.addComponent(new EnemyInteractionComponent(archer))
        archer.addComponent(new CombatComponent(archer))
        // archer.getComponent(MovementComponent).setFollowTarget(playerCharacter)
        return archer
    }

    createPlayerCharacter(game, start) {
        const pc = new Entity(game, start, PlayerCharacterData.Attributes)
        pc.addComponent(new AnimationComponent(pc, PlayerCharacterData.AnimationConfig))
        pc.addComponent(new AttributeComponent(pc, PlayerCharacterData.Attributes))
        pc.addComponent(new MovementComponent(pc, PlayerCharacterData.Attributes))
        pc.addComponent(new CollisionComponent(pc))
        pc.addComponent(new MarriottInteractionComponent(pc))
        pc.addComponent(new PlayerCharacterCombatComponent(pc))
        pc.addComponent(new PlayerInputComponent(pc))
        pc.addComponent(new EquippedItemsComponent(pc))
        return pc
    }

    /**
     * Spawns some random equipment at given entity location
     */
    spawnReward(entity) {
        const eq = new Entity(entity.game, new Vector(entity.x, entity.y))
        const namePrefixes = ['Swoll', 'Bizarre', 'Dynamic', 'Fascinating', 'Filty', 'Whimsical', 'Flowing', 'Bubbling']
        const nameSuffixes = ['of Reaching', 'of Decisions', 'of the Jungle', 'of Emptiness', 'of Punishment', 'of Sailing', 'of Strength']
        const eqMap = [{
            asset: ASSET_PATHS.EquipmentChest,
            type: 'head',
            name: ' Tunic ',
            atkMod: 0,
            defMod: 2,
            matkMod: 0,
            mdefMod: 2
        },
        {
            asset: ASSET_PATHS.EquipmentFeet,
            type: 'feet',
            name: ' Sandals ',
            atkMod: 0,
            defMod: 1,
            matkMod: 0,
            mdefMod: 2
        },
        {
            asset: ASSET_PATHS.EquipmentHands,
            type: 'hands',
            name: ' Handwraps ',
            atkMod: 1,
            defMod: 1,
            matkMod: 1,
            mdefMod: 0
        },
        {
            asset: ASSET_PATHS.EquipmentHead,
            type: 'head',
            name: ' Cap ',
            atkMod: 0,
            defMod: 1,
            matkMod: 1,
            mdefMod: 1
        },
        {
            asset: ASSET_PATHS.EquipmentWeapon,
            type: 'weapon',
            name: ' Sword ',
            atkMod: 3,
            defMod: 0,
            matkMod: 1,
            mdefMod: 0
        }]
        const thisEquip = eqMap[Math.min(Math.floor(Math.random() * eqMap.length), eqMap.length - 1)]
        const thisPrefix = namePrefixes[Math.min(Math.floor(Math.random() * namePrefixes.length), namePrefixes.length - 1)]
        const thisSuffix = nameSuffixes[Math.min(Math.floor(Math.random() * nameSuffixes.length), nameSuffixes.length - 1)]
        eq.addComponent(new EquipmentComponent(eq, {
            name: thisPrefix + thisEquip.name + thisSuffix,
            type: thisEquip.type,
            atk: Math.floor(Math.random() * 2 * thisEquip.atkMod),
            def: Math.floor(Math.random() * 2 * thisEquip.defMod),
            matk: Math.floor(Math.random() * 2 * thisEquip.matkMod),
            mdef: Math.floor(Math.random() * 2 * thisEquip.mdefMod)
        }))
        eq.addComponent(new AnimationComponent(eq, {
            Spritesheet: thisEquip.asset,
            Width: 32,
            Height: 32,
            Scale: 1
        }))
        eq.addComponent(new CollisionComponent(eq))
        this.addItem(eq)
    }

    /**
     * Updates this scene.
     */
    update() {
        //NOTE: These two functions were originally done automatically in the super class, but I added them
        //here to reduce confusion, and to allow the order they are updated/rendered to be adjusted.
        this.updateMap()
        this.updateEntities()
        this.game.killDisplay.timer -= this.game.clockTick
        this.game.roomDisplay.timer -= this.game.clockTick
    }

    updateSpawnerDisplay(spawned, mobs) {

        this.spawnedMobs = spawned
        this.mobs = mobs
    }

    /**
     * Draw this scene.
     */
    draw() {
        this.drawBackground()
        this.drawMap()
        this.drawEntities()
        this.drawMapTop()
        this.drawFog()

        if (this.spawnedMobs > 0) {
            const ctx = this.game.ctx
            ctx.fillStyle = 'red'
            ctx.font = '36px arcade'
            ctx.textAlign = 'left'
            ctx.textBaseline = 'top'
            ctx.fillText('Spawned: ' + this.spawnedMobs.toString() + '/' + this.mobs, 30, 50)
        }

        if (this.game.killDisplay.timer > 0) {
            this.game.ctx.font = '50px terminal'
            this.game.ctx.textAlign = 'center'
            const op = this.game.killDisplay.timer
            const clr = 'rgba(255, 255, 255, ' + op + ')'
            this.game.ctx.fillStyle = clr
            this.game.ctx.fillText(this.game.killDisplay.value.toFixed(1), this.game.ctx.canvas.width / 2, this.game.ctx.canvas.height / 5 - (this.game.killDisplay.timer * -30))
        }
        if (this.game.roomDisplay.timer > 0) {
            this.game.ctx.font = '50px terminal'
            this.game.ctx.textAlign = 'center'
            const op = this.game.roomDisplay.timer
            const clr = 'rgba(255, 255, 255, ' + op + ')'
            this.game.ctx.fillStyle = clr
            this.game.ctx.fillText('ROOM CLEARED', this.game.ctx.canvas.width / 2, this.game.ctx.canvas.height / 5 - 100 - (this.game.roomDisplay.timer * -30))
            this.game.ctx.fillText(this.game.roomDisplay.value.toFixed(1), this.game.ctx.canvas.width / 2, this.game.ctx.canvas.height / 5 - 50 -(this.game.roomDisplay.timer * -30))
        }
    }

    enter(){
        this.game.soundManager.playMusic(2)
    }
}