/* eslint-disable complexity */
import Scene from './Scene.js'

/**
 * Scene that manages the game scores. Both in keeping record and displaying.
 */
export default class TitleMeScoreDIsplayScenenuScene extends Scene {
    /**
     * Construct the parameters for the scene
     * @param {*the gameEngine of the game played} game 
     */
    constructor(game) {
        super(game)
        this.game = game
        this.name = 'scoredisplay'
        
        this.scores = []
        this.killCount = 0
        this.state = 0
        this.displayButton = false

        this.width = game.surfaceWidth
        this.height = game.surfaceHeight
        this.bB = {
            N:  this.height * 3 / 4 - 50,
            S:  this.height * 3 / 4 + 50,
            E: this.width * 3 / 4 + 150,
            W: this.width * 3 / 4 - 150
        }
        this.buttonHover = false
        
        this.timeElapsed = 0
        this.timeBuffer = 0
        
        this.offset = 0
        this.txtOffset = this.width / 22
        this.lineSize = 17
        this.max = Math.floor(game.surfaceHeight / this.lineSize) - 6
        this.timeInt = 0.1
        this.count = this.max
        this.index = 0
        this.offsetPrint = 0
        
        this.scoreText = []
        this.gameOverText = []
        this.initGOT()
        this.titleText = []
        this.initTT()
        this.replayText = []
        this.initRT()
        this.updateText()
        this.FinalSCore = 0
        this.totalScore = [
            {TIME: 1, TEXT: 0, W: this.width * 5/11 - this.txtOffset, H: this.game.surfaceHeight - 15, COLOR: 'white', FONT: '18px terminal'}
        ]
    }

    /**
     * Updates the scene's state.
     * 
     */
    update() {
        super.update()
        // If level finished, refreshes scene to a not lose state.
        if (this.state != 0) {
            this.initGOT()
            this.state = 0
        }
        // Conditions to delay Total Score addition and printing animation to 'scroll' up after a certain offset.
        this.timeBuffer += this.game.clockTick
        if (this.timeBuffer > this.timeInt) {
            if( this.index < this.scores.length) {
                this.FinalSCore += this.scores[this.index].Score
                this.updateFinalScore()
                this.index++
            }
            if ( (this.timeElapsed - 1)/this.timeInt > this.max && this.count < this.scores.length) {
                this.offset += this.lineSize
                super.draw()
                this.offsetPrint++
                this.updateText()
            }
            this.timeBuffer -= this.timeInt
        }
        this.displayButton = (this.timeElapsed - 1)/this.timeInt > this.scores.length
        if(this.displayButton)  this.checkButton()
    }

    /**
     * Draws the scene to canvas. Calls drawText on the appropriate arrays of text
     */
    draw() {
        super.draw()
        this.drawText(this.gameOverText)
        this.drawText(this.scoreText)
        this.drawText(this.totalScore)
        this.drawText(this.titleText)
        
        // Display replay button 
        if(this.displayButton) {
            this.drawText(this.replayText)
        }
    }

    drawText(text){
        for (const i in text) {
            const t = text[i]
            if (t.TIME === undefined
                || t.TIME === 0
                || this.timeElapsed > t.TIME) {
                this.game.ctx.textAlign = t.ALIGN || 'center'
                this.game.ctx.font = t.FONT
                this.game.ctx.fillStyle = t.COLOR
                this.game.ctx.fillText(t.TEXT, t.W, t.H)
            }
        }
    }

    updateText() {
        this.scoreText = []
        this.count++
        for (let i = this.offsetPrint; i < this.scores.length; i++) {
            this.scoreText.push({TIME: 1 + i*this.timeInt, TEXT: this.scores[i].Name, W: this.width * 1/11 - this.txtOffset, H: 60 + i * this.lineSize - this.offset, COLOR: 'white', FONT: '14px terminal'})
            this.scoreText.push({TIME: 1 + i*this.timeInt, TEXT: this.scores[i].Time, W: this.width * 2/11 - this.txtOffset, H: 60 + i * this.lineSize - this.offset, COLOR: 'white', FONT: '14px terminal'})
            if (this.scores[i].Type === 'C') {
                this.scoreText.push({TIME: 1 + i*this.timeInt, TEXT: this.scores[i].Duration, W: this.width * 3/11 - this.txtOffset, H: 60 + i * this.lineSize - this.offset, COLOR: 'white', FONT: '14px terminal'})
            }
            this.scoreText.push({TIME: 1 + i*this.timeInt, TEXT: this.scores[i].lvl, W: this.width * 4/11 - this.txtOffset, H: 60 + i * this.lineSize - this.offset, COLOR: 'white', FONT: '14px terminal'})
            this.scoreText.push({TIME: 1 + i*this.timeInt, TEXT: (this.scores[i].Score).toString(), W: this.width * 5/11 - this.txtOffset, H: 60 + i * this.lineSize - this.offset, COLOR: 'white', FONT: '14px terminal'})
        }
    
    }

    updateFinalScore() {
        this.totalScore = []
        this.totalScore.push({TIME: 1, TEXT: this.FinalSCore, W: this.width * 5/11 - this.txtOffset, H: this.game.surfaceHeight - 15, COLOR: 'white', FONT: '18px terminal'})
    }
    
    checkButton() {
        this.mouse = this.game.inputManager.mousePosition
        if (this.mouse !== null) {
            if (this.mouse.x > this.bB.W && this.mouse.x < this.bB.E && this.mouse.y > this.bB.N && this.mouse.y < this.bB.S) {
                this.buttonHover = true
                this.initRT()
                this.clickOnButton()
            } else {
                this.buttonHover = false
                this.initRT()
            }
        }
    }

    clickOnButton() {
        if (this.game.inputManager.newLeftClick) {
            this.game.sceneManager.removeScene('level1')
            this.game.reInit()
        }
    }
  
    initGOT() {
        this.gameOverText = [
            {TIME: 0, TEXT: 'GAME', W: this.width * 3 / 4, H: this.height * 1/4 + 25 , COLOR: 'white', FONT: '50px terminal'},
            {TIME: 0, TEXT: 'OVER', W: this.width * 3 / 4, H: this.height * 1/4 - 25 , COLOR: 'white', FONT: '50px terminal'},
            {TIME: 0, TEXT: 'GAME', W: this.width * 3 / 4 + 1, H: this.height * 1/4 + 25 + 2, COLOR: 'gray', FONT: '50px terminal'},
            {TIME: 0, TEXT: 'OVER', W: this.width * 3 / 4 + 1, H: this.height * 1/4 - 25 + 2, COLOR: 'gray', FONT: '50px terminal'},
            {TIME: 0, TEXT: '0 _ 0', W: this.width * 3 / 4, H: this.height * 5/8 , COLOR: 'white', FONT: '60px terminal'},
            {TIME: 0, TEXT: '0 _ 0', W: this.width * 3 / 4 + 1, H: this.height * 5/8 + 2, COLOR: 'gray', FONT: '60px terminal'},
        ]

        if (this.state === 0) {
            this.initDied()
        } else {
            this.initComplete()
        }
        for (let i = 0; i <= 16 ; i++) {
            this.gameOverText.push({TIME: 0, TEXT: '_', W: this.width * 3 / 4 + (i - 8) * 14, H: this.height * 1/4 - 90 , COLOR: 'white', FONT: '14px terminal'})
            this.gameOverText.push({TIME: 0, TEXT: '_', W: this.width * 3 / 4 + (i - 8) * 14, H: this.height * 1/4 + 55, COLOR: 'white', FONT: '14px terminal'})
        }
        for (let i = 0; i < 8; i++) {
            this.gameOverText.push({TIME: 0, TEXT: '|', W: this.width * 3 / 4 - 7 - (8 * 14), H: this.height * 1 / 4 + (i - 4) * 18, COLOR: 'white', FONT: '14px terminal'})
            this.gameOverText.push({TIME: 0, TEXT: '|', W: this.width * 3 / 4 + 7 + (8 * 14), H: this.height * 1 / 4 + (i - 4) * 18, COLOR: 'white', FONT: '14px terminal'})
        }
    }

    initDied() {
        this.gameOverText.push({TIME: 0.5, TEXT: 'YOU DIED', W: this.width * 3 / 4, H: this.height * 2/4, COLOR: 'white', FONT: '50px terminal'})
        this.gameOverText.push({TIME: 0.5, TEXT: 'YOU DIED', W: this.width * 3 / 4 + 1, H: this.height * 2/4 + 2, COLOR: 'gray', FONT: '50px terminal'})
            
        this.gameOverText.push({TIME: 1, TEXT: 'X_X', W: this.width * 3 / 4, H: this.height * 5/8 , COLOR: 'white', FONT: '70px terminal'})
        this.gameOverText.push({TIME: 1, TEXT: 'X_X', W: this.width * 3 / 4 + 2, H: this.height * 5/8 + 2, COLOR: 'gray', FONT: '70px terminal'})
    }

    initComplete() {
        this.gameOverText.push({TIME: 0.5, TEXT: 'LEVEL COMPLETED', W: this.width * 3 / 4, H: this.height * 2/4, COLOR: 'white', FONT: '50px terminal'})
        this.gameOverText.push({TIME: 0.5, TEXT: 'LEVEL COMPLETED', W: this.width * 3 / 4 + 1, H: this.height * 2/4 + 2, COLOR: 'gray', FONT: '50px terminal'})
    }

    initTT() {
        this.titleText = [
            {TIME: 1, TEXT: 'Task', W: this.width * 1/11 - this.txtOffset, H: 25 , COLOR: 'white', FONT: '14px terminal'},
            {TIME: 1, TEXT: 'Time Stamp', W: this.width * 2/11 - this.txtOffset, H: 25, COLOR: 'white', FONT: '14px terminal'},
            {TIME: 1, TEXT: 'Task Duration', W: this.width * 3 / 11 - this.txtOffset, H: 25, COLOR: 'white', FONT: '14px terminal'},
            {TIME: 1, TEXT: 'Level', W: this.width * 4/11 - this.txtOffset, H: 25, COLOR: 'white', FONT: '14px terminal'},
            {TIME: 1, TEXT: 'Score', W: this.width * 5/11 - this.txtOffset, H: 25, COLOR: 'white', FONT: '14px terminal'},
            {TIME: 1, TEXT: 'TOTAL SCORE', W: this.width / 4, H: this.game.surfaceHeight - 15, COLOR: 'white', FONT: '18px terminal'},
        ]
        for (let i = 0; i < this.width * 5 / 11; i += 14) {
            this.titleText.push({TIME: 1, TEXT: '_', W: i, H: 35, COLOR: 'white', FONT: '14px terminal'})
            this.titleText.push({TIME: 1, TEXT: '_', W: i, H: this.game.surfaceHeight - 42, COLOR: 'white', FONT: '14px terminal'})
        }
        for (let i = 0; i < this.game.surfaceHeight - 42; i += 14) {
            this.titleText.push({TIME: 1 , TEXT: ':', W: this.width * 1/11, H: i , COLOR: 'white', FONT: '14px terminal'})
            this.titleText.push({TIME: 1 , TEXT: ':', W: this.width * 2/11, H: i , COLOR: 'white', FONT: '14px terminal'})
            this.titleText.push({TIME: 1 , TEXT: ':', W: this.width * 3/11, H: i , COLOR: 'white', FONT: '14px terminal'})
            this.titleText.push({TIME: 1 , TEXT: ':', W: this.width * 4/11, H: i , COLOR: 'white', FONT: '14px terminal'})
        }
        for (let i = 0; i <= this.height; i += 14) {
            this.titleText.push({TIME: 1 , TEXT: '|', W: this.width / 2 - this.txtOffset, H:  i, COLOR: 'white', FONT: '14px terminal'})
        }
    }

    initRT() {
        this.replayText = [
            {TIME: 0, TEXT: 'REPLAY', W: this.width * 3 / 4, H: this.height *3/4 , COLOR: 'white', FONT: '50px terminal'},
        ]
        if (!this.buttonHover) {
            this.replayText.push({TIME: 0, TEXT: 'REPLAY', W: this.width * 3 / 4 + 2, H: this.height *3/4 + 2, COLOR: 'gray', FONT: '50px terminal'})
        }
        for (let i = 0; i <= 18; i++) {
            this.replayText.push({TIME: 0, TEXT: '_', W: this.width * 3 / 4 + (i - 9) * 14, H: this.height * 3 / 4 + 30, COLOR: 'white', FONT: '14px terminal'})
            this.replayText.push({TIME: 0, TEXT: '_', W: this.width * 3 / 4 + (i - 9) * 14, H: this.height * 3 / 4 - 65, COLOR: 'white', FONT: '14px terminal'})
        }
        for (let i = 0; i < 5; i++) {
            this.replayText.push({TIME: 0, TEXT: '|', W: this.width * 3 / 4 - 7 - (9 * 14), H: this.height * 3 / 4 + (i - 3) * 18 + 7, COLOR: 'white', FONT: '14px terminal'})
            this.replayText.push({TIME: 0, TEXT: '|', W: this.width * 3 / 4 + 7 + (9 * 14), H: this.height * 3 / 4 + (i - 3) * 18 + 7, COLOR: 'white', FONT: '14px terminal'})
            
        }
    }   
}
