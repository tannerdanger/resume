/**
 * Scene manager saves all of the game scenes, and calls the correct one.
 */
import FirstLevel from './world/scenes/FirstLevel.js'
import TitleMenuScene from './world/scenes/TitleMenu.js'
import { HitCircle, CollisionLayer } from './utils/Collision.js'
import CollisionComponent from './entities/components/CollisionComponent.js'
import ScoreDisplayScene from './world/scenes/Scores.js'
import BossLevel from './world/scenes/BossLevel.js'
import {PauseMenu} from './world/scenes/pause.js'
import {KEYS} from './utils/Const.js'
import Vector from './utils/Vector.js'

export default class SceneManager {


    constructor() {
        this.game = {}
        this.scenes = []
        this.collisionLayer = {}
        this.currentScene = {}
    }
    init(game) {
        this.game = game
        this.collisionLayer = new CollisionLayer()
        const firstlevel = new FirstLevel(game)
        const title = new TitleMenuScene(game)
        const scores = new ScoreDisplayScene(game)
        const boss = new BossLevel(game)
        this.addScene(title.name, title)
        this.addScene(scores.name, scores)
        this.addScene(firstlevel.name, firstlevel)
        this.addScene(boss.name, boss)
        this.guiScript = false
        this.currentScene = title
        this.pause = new PauseMenu(game)
        this.isPaused = false
        // this.currentScene = boss
        // this.currentScene = firstlevel
    }

    addGUIScript(guiScript) {
        this.guiScript = guiScript
    }
    /**
     * Rebuilds the levels and replaces the old ones to allow for new levels to be made.
     */
    rebuildLevels(){
        const firstlevel = new FirstLevel(this.game)
        this.addScene(firstlevel.name, firstlevel)
    }


    removeGUIScript() {
        this.guiScript = false
    }


    /**
     * Adds ascene to the collection of scenes
     * @param name the name of the new scene
     * @param scene a reference ot the scene
     */
    addScene(name, scene) {
        //TODO: Check if exists
        this.scenes[name] = scene
    }

    /**
     * Returns a scene by its name
     * @param name of the scene
     * @returns {scene}
     */
    getScene(name) {
        return this.scenes[name]
    }

    removeScene(name) {
        return this.scenes.splice(name, 1)
    }

    /**
     * Calls update func for active scene
     */
    update() {
        this.checkPause()
        if(this.isPaused)
            this.pause.update()
        else
            this.currentScene.update()
    }

    /**
     * Checks if the escape, or p keys were pressed, and pauses or resumes the game as necessary.
     */
    checkPause(){
        if(this.game.inputManager.downKeys[KEYS.Escape]
            || this.game.inputManager.downKeys[KEYS.KeyP]) {
            this.isPaused = !this.isPaused
        }
    }

    quitGame(){
        this.isPaused = false
        this.change('titlemenu')
        this.rebuildLevels()
    }

    /**
     * This function calls the draw function for the active scene
     */
    draw() {
        this.currentScene.draw()
        if (this.guiScript != false && this.currentScene.isPlayable()) {
            this.guiScript()
        }
        if(this.isPaused){
            this.pause.draw()
        }
    }

    /**
     * This function changes from one scene to another
     * @param AN OPTIONAL OBJECT THAT CAN BE PASSED INTO THE NEW SCENE TO INITIALIZE IT
     */
    change(name, params) {
        params = params || {}
        this.currentScene.exit()  //exit old scene
        this.currentScene = this.getScene(name)

        this.currentScene.enter(params) //enter new scene
        if (this.currentScene !== this.scenes['scores']) {
            this.currentScene.enter(params) //enter new scene
        }
    }

    /**
     * Adds an entity to the collidable layer. Checks to ensure it has a hitbox before being added.
     *
     * @param entity the entity to be added.
     */
    addCollidableEntity(entity) {
        if (null != entity) {
            if (null === entity.hitbox) {
                entity.hitbox = new HitCircle(entity.radius, entity.x, entity.y)
            }
            this.collisionLayer.addCollidable(entity)
        }
    }

    getCollidablesXYScreen(pos) {
        const ret = []
        for (let i = 0; i < this.currentScene.entities.length; i++) {
            const entity = this.currentScene.entities[i]
            const collisionComponent = entity.getComponent(CollisionComponent)
            if (collisionComponent) {
                const collides = collisionComponent.checkCollisionScreen(pos)
                if (collides) {
                    ret.push(entity)
                }
            }
        }
        return ret
    }

    getCollidablesXYWorld(pos) {
        const ret = []
        for (let i = 0; i < this.currentScene.entities.length; i++) {
            const entity = this.currentScene.entities[i]
            const collisionComponent = entity.getComponent(CollisionComponent)
            if (collisionComponent) {
                const collides = collisionComponent.checkCollisionWorld(pos)
                if (collides) {           
                    ret.push(entity)
                }
            }

        }
        return ret
    }

    getCollidablesHitbox(entity) {
        const ret = []
        for (let i = 0; i < this.currentScene.entities.length; i++) {
            const e = this.currentScene.entities[i]
            const collisionComponent = entity.getComponent(CollisionComponent)
            if (collisionComponent) {
                const collides = collisionComponent.checkCollision(Vector.vectorFromEntity(e))
            }
        }
        
    }
}
