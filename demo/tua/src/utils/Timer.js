export default class Timer {
    constructor() {
        this.gameTime = 0
        this.maxStep = 0.05
        this.wallLastTimestamp = 0
    }

    tick() {
        const wallCurrent = Date.now()
        const wallDelta = (wallCurrent - this.wallLastTimestamp) / 1000
        this.wallLastTimestamp = wallCurrent

        const gameDelta = Math.min(wallDelta, this.maxStep)
        this.gameTime += gameDelta
        return gameDelta
    }

    getGameTIme() {
        return this.gameTime
    }
}