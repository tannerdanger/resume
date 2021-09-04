import InteractionComponent from './InteractionComponent/InteractionComponent.js'
import EquippedItemsComponent from './EquippedItemsComponent.js'

export default class EquipmentComponent extends InteractionComponent {
    constructor(entity, config) {
        super(entity)
        const defaults = {
            name: 'Unnamed Helm of Debugging',
            type: 'head',
            atk: 2,
            def: 2,
            matk: 1,
            mdef: 2
        }
        Object.assign(this, defaults, config)
    }

    update() {
        super.update()
    }

    draw() {
        super.draw()
        if (this.hovered) {
            const mousePos = this.entity.game.inputManager.mousePosition
            this.drawMouseover(mousePos)
        }
        
    }

    setRightClick() {
        this.entity.game.getCurrentScene().getPlayer().getComponent(EquippedItemsComponent).equip(this)
        this.entity.removeFromWorld = true
    }

    drawMouseover(pos) {        
        const ctx = this.entity.game.ctx
        ctx.fillStyle = 'black'
        ctx.textAlign = 'left'
        let yOffset = 20
        const ySpace = 15
        ctx.fillRect(pos.x, pos.y, 240, 120)
        ctx.fillStyle = 'white'
        ctx.font = '14px verdana, sans-serif'
        ctx.fillText(this.name, pos.x + 5, pos.y + yOffset)
        ctx.font = '12px verdana, sans-serif'
        yOffset += ySpace
        ctx.fillText('Type: ' + this.type, pos.x + 5, pos.y + yOffset)
        yOffset += ySpace
        ctx.fillText('Atk: ' + this.atk, pos.x + 5, pos.y + yOffset)
        yOffset += ySpace
        ctx.fillText('Def: ' + this.def, pos.x + 5, pos.y + yOffset)
        yOffset += ySpace
        ctx.fillText('Matk: ' + this.matk, pos.x + 5, pos.y + yOffset)
        yOffset += ySpace
        ctx.fillText('Mdef: ' + this.mdef, pos.x + 5, pos.y + yOffset)
    }

    getMatk() {
        return this.matk
    }

    getMdef() {
        return this.mdef
    }

    getAtk() {
        return this.atk
    }

    getDef() {
        return this.def
    }
}