export class HUDScene extends Phaser.Scene {
    private textElements: Map<string, Phaser.GameObjects.BitmapText>
    private timer: Phaser.Time.TimerEvent

    constructor() {
        super({
            key: 'HUDScene',
        })
    }

    create(): void {
        this.textElements = new Map([
            ['LIVES', this.addText(100, 30, `MARIOx ${this.registry.get('lives')}`)],
            ['WORLDTIME', this.addText(80 * 8, 30, `${this.registry.get('worldTime')}`)],
            ['SCORE', this.addText(40 * 8, 8 * 8 + 30, `${this.registry.get('score')}`)],
            ['COINS', this.addText(80 * 8, 8 * 8 + 30, `${this.registry.get('coins')}`)],
            ['WORLD', this.addText(96 * 8, 8 * 8 + 30, `${this.registry.get('world')}`)],
            ['TIME', this.addText(136 * 8, 8 * 8 + 30, `${this.registry.get('time')}`)],
        ])

        // create events
        const level = this.scene.get('GameScene')
        level.events.on('coinsChanged', this.updateCoins, this)
        level.events.on('scoreChanged', this.updateScore, this)
        level.events.on('livesChanged', this.updateLives, this)

        // add timer
        this.timer = this.time.addEvent({
            delay: 1000,
            callback: this.updateTime,
            callbackScope: this,
            loop: true,
        })
    }

    private addText(x: number, y: number, value: string): Phaser.GameObjects.BitmapText {
        return this.add.bitmapText(x, y, 'font', value, 64)
    }

    private updateTime() {
        this.registry.values.time -= 1
        this.textElements.get('TIME')?.setText(`${this.registry.get('time')}`)
    }

    private updateCoins() {
        const coin = this.textElements.get('COINS')
        if (coin)
            coin.setText(`${this.registry.get('coins')}`).setX(
                80 - 8 * (this.registry.get('coins').toString().length - 1)
            )
    }

    private updateScore() {
        const score = this.textElements.get('SCORE')
        if (score)
            score
                .setText(`${this.registry.get('score')}`)
                .setX(40 - 8 * (this.registry.get('score').toString().length - 1))
    }

    private updateLives() {
        const lives = this.textElements.get('LIVES')
        if (lives) lives.setText(`Lives: ${this.registry.get('lives')}`)
    }
}
