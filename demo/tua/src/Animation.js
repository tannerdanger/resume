export default class Animation {
    constructor(spritesheet, frameWidth, frameHeight, startY, frames, offset, frameDuration, loop, scale) {
        this.spritesheet = spritesheet
        this.frameWidth = frameWidth
        this.frameHeight = frameHeight
        this.startY = startY
        this.offset = offset
        this.frameDuration = frameDuration
        this.frames = frames
        this.loop = loop
        this.scale = scale
        this.elapsedTime = 0
        this.totalTime = this.frameDuration * this.frames
        this.draw = true
    }

    // eslint-disable-next-line complexity
    drawFrame(game, x, y, angle) {
        if (this.draw) {
            
            const cam = game.sceneManager.currentScene.camera

            const xView = cam ? cam.xView : 0
            const yView = cam ? cam.yView :0 
            this.elapsedTime += game.clockTick
            if (this.isDone()) {
                if (this.cbCalled === false && this.cb) {
                    this.cbCalled = true
                    this.cb()
                }
                if (this.loop) this.elapsedTime = 0
            }
            const frame = this.currentFrame()
            const startX = (frame % this.frames) * this.frameWidth
            const startY = this.startY
    
            const offscreenCanvas = document.createElement('canvas')
            const size = Math.max(this.frameWidth * this.scale, this.frameHeight * this.scale)
    
            offscreenCanvas.width = size
            offscreenCanvas.height = size
            const offscreenCtx = offscreenCanvas.getContext('2d')
    
            const thirdCanvas = document.createElement('canvas')
            thirdCanvas.width = size
            thirdCanvas.height = size
            const thirdCtx = thirdCanvas.getContext('2d')
    
                
            thirdCtx.drawImage(
                this.spritesheet,
                startX, 
                startY,
                this.frameWidth, 
                this.frameHeight,
                0, 
                0,
                this.frameWidth * this.scale,
                this.frameHeight * this.scale
            )
    
            offscreenCtx.save()
            offscreenCtx.translate(size / 2, size / 2)
            offscreenCtx.rotate(angle)
            offscreenCtx.translate(0, 0)
            offscreenCtx.drawImage(thirdCanvas, - (this.frameWidth * this.scale / 2), - (this.frameHeight * this.scale / 2))
            offscreenCtx.restore()
            thirdCtx.clearRect(0,0, size, size)
            game.ctx.drawImage(offscreenCanvas,  (x - (this.frameWidth * this.scale / 2)) + this.offset.x - xView, (y - (this.frameHeight * this.scale)) + this.offset.y - yView)
    
        }
        
    }

    currentFrame() {
        return Math.min(this.frames - 1, Math.floor(this.elapsedTime / this.frameDuration))
    }

    isDone() {
        return this.elapsedTime >= this.totalTime
    }

    setCallback(cb) {
        this.cbCalled = false
        this.cb = cb
    }

    removeCallback() {
        this.cb = null
    }

    getWidth() {
        return this.frameWidth * this.scale
    }

    getHeight() {
        return this.frameHeight * this.scale
    }

    setDraw(bool) {
        this.draw = bool
    }
}