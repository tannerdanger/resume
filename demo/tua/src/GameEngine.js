/* eslint-disable complexity */
import Timer from './utils/Timer.js'
import InputManager from './InputManager.js'
import SceneManager from './SceneManager.js'
import Camera from './entities/Camera.js'
import Vector from './utils/Vector.js'

export default class GameEngine {
    constructor() {
        this.sceneManager = null
        this.inputManager = null
        this.assetManager = null
        this.soundManager = null
        this.timer = null
        this.ctx = null
        this.surfaceWidth = null
        this.surfaceHeight = null
        this.requestAnimFrame = this.getPlatformRAF().bind(window)
        this.killDisplay = this.setKillDisplay(-1)
        this.killDisplay.timer = 0
        this.killPoints = 0
        this.roomDisplay = this.setKillDisplay(-1)
        this.roomDisplay.timer = 0
        this.roomPoints = 0
    }

    /**
     * Returns the Request Animation Frame method for the current browser/platform
     * @returns {Function}
     */
    getPlatformRAF() {
        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            // eslint-disable-next-line no-unused-vars
            function (/* function */ callback, /* DOMElement */ element) {
                window.setTimeout(callback, 1000 / 60)
            }
    }

    init(ctx) {
        this.inputManager = new InputManager()
        this.ctx = ctx
        this.surfaceWidth = this.ctx.canvas.width
        this.surfaceHeight = this.ctx.canvas.height
        this.timer = new Timer()
        this.sceneManager = new SceneManager()
        this.sceneManager.init(this)
        this.startInput()

    }

    reInit() {
        this.timer = new Timer()
        this.sceneManager = new SceneManager()
        this.sceneManager.init(this)
        this.startInput()
        this.start()
    }
    resizeCanvas(width, height) {
        this.ctx.canvas.width = width
        this.ctx.canvas.height = height
        this.surfaceWidth = width
        this.surfaceHeight = height
    }

    start() {
        this.gameLoop()
    }

    gameLoop() {
        this.loop()
        this.requestAnimFrame(this.gameLoop.bind(this), this.ctx.canvas)
    }

    startInput() {
        this.inputManager.registerEventListeners(this.ctx)
    }

    addEntity(entity) {
        this.entities.push(entity)
    }

    draw() {
        this.ctx.clearRect(0, 0, this.surfaceWidth, this.surfaceHeight)
        this.ctx.save()
        this.sceneManager.draw()
        this.ctx.restore()
    }

    update() {
        this.sceneManager.update()
    }

    loop() {
        this.clockTick = this.timer.tick()
        this.update()
        this.draw()
        this.inputManager.clear()
    }

    getAsset(path) {
        return this.assetManager.getAsset(path)
    }

    /**
     * Gets an array with the current map.
     * This needs to be replaced with a similar array which also contains character, NPC, and other entities.
     * @returns {Array} An array representation of the current map
     */
    getWorld() {
        return this.sceneManager.currentScene.map.getPathfindingArray()
    }

    getTileSize() {
        return 64
    }

    getCamera() {
        return this.sceneManager.currentScene.camera ? this.sceneManager.currentScene.camera : { xView: 0, yView: 0 }
    }

    screenToWorld(pos) {
        const cam = this.getCamera()
        return new Vector(pos.x + cam.xView, pos.y + cam.yView)
    }
    worldToScreen(pos) {
        const cam = this.getCamera()
        return new Vector(pos.x - cam.xView, pos.y - cam.yView)
    }
    getCurrentScene() {
        if (this.sceneManager) {
            return this.sceneManager.currentScene
        } else {
            return false
        }
    }

    removeEntityByRef(entity) {
        const scene = this.sceneManager.currentScene
        if (scene.entities.indexOf(entity) > -1) {
            scene.removeEntity(scene.entities.indexOf(entity))
        }
        if (scene.items.indexOf(entity) > -1) {
            scene.removeItem(scene.items.indexOf(entity))
        }
    }

    getHighlightedEntity() {
        return this.sceneManager.currentScene.highlightedEntity
    }
    setHighlightedEntity(entity) {
        this.sceneManager.currentScene.highlightedEntity = entity
    }
    removeHighlightedEntity() {
        this.sceneManager.currentScene.highlightedEntity = null
    }
    getEntityByXYOnScreen(pos) {
        return this.sceneManager.getCollidablesXYScreen(new Vector(pos.x, pos.y))
    }

    getEntityByXYInWorld(pos) {
        return this.sceneManager.getCollidablesXYWorld(new Vector(pos.x, pos.y))
    }

    setKillDisplay(value) {
        return {
            value: value,
            timer: 2,
        }
    }

    /**
     * Creates score items and saves them into the score scene. Updates kill count or scene
     * state accordingly.
     * 
     * @param {*name of score item} name 
     * @param {*boolean of whether its a mob kill action} kill 
     */
    addScore(name, kill) {
        const scene = this.sceneManager.getScene('scoredisplay')
        if (kill) {
            scene.killCount++
            const Score = this.addKillScore(name)
            if (Score) {
                scene.scores.push(Score)
            }
        } else {
            const Score = this.addNonKill(name, scene)
            if (Score) {
                scene.scores.push(Score)
            }
        }
    }

    /**
     * Creates and returns score object of a mob kill action.
     * @param {*name of mob killed} name 
     */
    addKillScore(name) {
        let Score = null
        switch (name) {
            case 'ARCHER':
                Score = {
                    Name: 'Archer_Kill',
                    Time: Math.floor(this.timer.gameTime),
                    lvl: 1,
                    Score: Math.floor(400 * Math.sqrt(2)),
                    Type: 'E'
                }
                this.killDisplay = this.setKillDisplay(Score.Score)
                break
            case 'MAGE':
                Score = {
                    Name: 'Mage_Kill',
                    Time: Math.floor(this.timer.gameTime),
                    lvl: 1,
                    Score: Math.floor(700 * Math.sqrt(2)),
                    Type: 'E'
                }
                this.killDisplay = this.setKillDisplay(Score.Score)
                break
            case 'ROBOT':
                Score = {
                    Name: 'Robot_Kill',
                    Time: Math.floor(this.timer.gameTime),
                    lvl: 1,
                    Score: Math.floor(850 * Math.sqrt(2)),
                    Type: 'E'
                }
                this.killDisplay = this.setKillDisplay(Score.Score)
                break
            case 'CHIEF':
                Score = {
                    Name: 'Chief_Kill',
                    Time: Math.floor(this.timer.gameTime),
                    lvl: 1,
                    Score: Math.floor(430 * Math.sqrt(2)),
                    Type: 'E'
                }
                this.killDisplay = this.setKillDisplay(Score.Score)
                break
            case 'KNIGHT':
                Score = {
                    Name: 'Knight_Kill',
                    Time: Math.floor(this.timer.gameTime),
                    lvl: 1,
                    Score: Math.floor(480 * Math.sqrt(2)),
                    Type: 'E'
                }
                this.killDisplay = this.setKillDisplay(Score.Score)
                break
            case 'WARRIOR':
                Score = {
                    Name: 'Robot_Kill',
                    Time: Math.floor(this.timer.gameTime),
                    lvl: 1,
                    Score: Math.floor(550 * Math.sqrt(2)),
                    Type: 'E'
                }
                this.killDisplay = this.setKillDisplay(Score.Score)
                break
            case 'WOLF':
                Score = {
                    Name: 'Wolf_kill',
                    Time: Math.floor(this.timer.gameTime),
                    lvl: 1,
                    Score: Math.floor(440 * Math.sqrt(2)),
                    Type: 'E'
                }
                this.killDisplay = this.setKillDisplay(Score.Score)
                break
            default:
                return null
        }
        return Score
    }

    /**
     * Creates and returns score object of a non-mob kill action. Increment score scene's state if
     * level is finished.
     * 
     * @param {*name of score item} name 
     * @param {*score scene to increment scene state if level finsihed} scene 
     */
    addNonKill(name, scene) {
        let Score
        switch (name) {
            case 'ROOM':
                Score = {
                    Name: 'ROOM_CLEARED',
                    Time: Math.floor(this.timer.gameTime),
                    Duration: this.sceneManager.currentScene.currentRoomTimeLapse,
                    lvl: 1,
                    Score: Math.floor(21000 * Math.sqrt(2) / Math.sqrt(this.sceneManager.currentScene.currentRoomTimeLapse)),
                    Type: 'C'
                }
                this.roomDisplay = this.setKillDisplay(Score.Score)
                break
            case 'END':
                Score = {
                    Name: 'LEVEL_END',
                    Time: Math.floor(this.timer.gameTime),
                    Duration: this.timer.gameTime.toFixed(2),
                    lvl: 1,
                    Score: Math.floor(100000 * Math.sqrt(2) / Math.sqrt(this.timer.gameTime)),
                    Type: 'C'
                }
                scene.state++
                break
            default:
                return null
        }
        return Score
    }

}
