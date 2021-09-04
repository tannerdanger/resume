import Component from '../Component.js'
import Map from '../../../world/Map.js'
import {
    MAP_ITEMS
} from '../../../utils/Const.js'

export default class ButtonBehaviorComponent extends Component {
    constructor(entity, scene) {
        super(entity)
        this.scene = scene
        this.buttonTimer = 0
        this.timerEnd = 200
        this.activated = false
    }

    update() {
        if (Map.checkSameTile(Map.getTileByEntity(this.scene.getPlayer()), Map.getTileByEntity(this.entity))) {
            const pos = [Map.getTileByEntity(this.entity).x, Map.getTileByEntity(this.entity).y]
            this.scene.map.createObject(this.scene.map.map1, pos, MAP_ITEMS.SwitchOn)
            this.activated = true
        }
        if (this.activated) {
            this.buttonTimer += this.entity.game.clockTick * 200
            if (this.buttonTimer > this.timerEnd) {
                this.entity.game.addScore('END', false)
                this.entity.game.sceneManager.change('scoredisplay')
                this.entity.game.sceneManager.currentScene.updateText()
            }
        }
    }
}