import Scene from './Scene.js'
import Animation from '../../Animation.js'
import { KEYS, ASSET_PATHS} from '../../utils/Const.js'


export default class TitleMenuScene extends Scene {

    constructor(game){
        super(game)
        this.name='titlemenu'
        this.ctx = game.ctx
        this.isMusicPlaying = false

         const sheet = game.getAsset(ASSET_PATHS.TitleAnimation)
         this.background = new titleanim(sheet, 960, 540, 50, 1, 0.1, 50, true, 1)


        this.selectedItem = 0
        this.drawSpeedBuffer = 0
        this.x = 0
        this.y = 0

        this.text = [
            {TIME: 1.5, TEXT: 'DR. MARIOTT\'s', W: this.ctx.canvas.width / 2, H: this.ctx.canvas.height / 2 - 280, COLOR: 'red', FONT: '40px arcade'},
            {TIME: 2, TEXT: 'DEADLY SIMULATOR', W: this.ctx.canvas.width / 2, H: this.ctx.canvas.height / 2 - 220, COLOR: 'red', FONT: '40px arcade'},
            {TIME: 3, TEXT: 'START', W: this.ctx.canvas.width / 2, H: this.ctx.canvas.height / 2 + 120, COLOR: 'red', FONT: '32px arcade'},
            {TIME: 3.4, TEXT: 'OPTIONS', W: this.ctx.canvas.width / 2, H: this.ctx.canvas.height / 2 + 160, COLOR: 'grey', FONT: '32px arcade'},
            {TIME: 3.8, TEXT: 'HIGH SCORE', W: this.ctx.canvas.width / 2, H: this.ctx.canvas.height / 2 + 190, COLOR: 'grey', FONT: '32px arcade'},
            {TIME: 4.2, TEXT: 'EXIT', W: this.ctx.canvas.width / 2, H: this.ctx.canvas.height / 2 + 220, COLOR: 'grey', FONT: '32px arcade'}
        ]

    }
    playMusic(){
        this.isMusicPlaying = true
        this.game.soundManager.playMusic(1)
    }

    exit(){
        this.game.soundManager.stopMusic()
    }

    // eslint-disable-next-line complexity
    update() {
        const tick = this.game.clockTick
        super.update()
        this.updateMap(tick)

        //wait until all words are displayed to get input
        if(this.timeElapsed > 4.5){
            if(!this.isMusicPlaying){this.playMusic()}
            if (this.selectedItem===0){this.selectedItem=2}//enable first option if not yet enabled

            if(this.game.inputManager.downKeys[KEYS.Enter]){
                switch (this.selectedItem) {

                    case 2:
                        {
                            //switch to start game
                            console.log('start game!')
                            this.game.sceneManager.change('level1', null)
                        }
                        break
                    case 5:
                        window.close()
                        break
                }
            }

            if(this.game.inputManager.downKeys[KEYS.ArrowUp] ||
                this.game.inputManager.downKeys[KEYS.KeyW]){

                this.text[this.selectedItem].COLOR = 'grey' //reset color
                if(this.selectedItem === 2){this.selectedItem =  5}else{this.selectedItem--}
            }

            else if(this.game.inputManager.downKeys[KEYS.ArrowDown] ||
                this.game.inputManager.downKeys[KEYS.KeyS]){

                this.text[this.selectedItem].COLOR = (this.selectedItem === 2) ? 'red' : 'grey' //reset color
                if(this.selectedItem === 5){this.selectedItem =  2}else{this.selectedItem++}

            }

            this.text[this.selectedItem].COLOR = 'white'
            this.drawSpeedBuffer = 0

        }
    }

    draw(){
        super.draw()
        this.background.drawFrame(this.game, this.x, this.y)

        this.ctx.textAlign = 'center'

        for(const i in this.text){

            const t = this.text[i]
            if(this.timeElapsed > t.TIME){
                this.ctx.font = t.FONT
                this.ctx.fillStyle = t.COLOR
                this.ctx.fillText(t.TEXT, t.W, t.H)
            }
        }
    }


}


class titleanim {
    constructor(
        spriteSheet,
        frameWidth,
        frameHeight,
        sheetWidth,
        row,
        frameDuration,
        frames,
        loop,
        scale
    ) {
        this.spriteSheet = spriteSheet
        this.frameWidth = frameWidth
        this.frameHeight = frameHeight
        this.sheetWidth = sheetWidth
        this.row = row
        this.frameDuration = frameDuration
        this.frames = frames
        this.loop = loop
        this.scale = scale
        this.elapsedTime = 0
        this.totalTime = frameDuration * frames
    }

    drawFrame(game, x, y) {
        this.elapsedTime += game.clockTick
        if (this.isDone()) {
            if (this.loop) this.elapsedTime = 0
            else this.elapsedTime -= game.clockTick
        }
        const frame = this.currentFrame()
        let xindex = 0
        let yindex = 0
        xindex = frame % this.sheetWidth
        yindex = this.frameHeight * (this.row - 1)
        game.ctx.drawImage(
            this.spriteSheet,
            xindex * this.frameWidth,
            yindex, // source from sheet
            this.frameWidth,
            this.frameHeight,
            (x + this.frameWidth / 2) ,
            (y + this.frameHeight / 2) ,
            this.frameWidth * this.scale,
            this.frameHeight * this.scale
        )
    }

    currentFrame() {
        return Math.floor(this.elapsedTime / this.frameDuration)
    }

    isDone() {
        return this.elapsedTime >= this.totalTime
    }
}