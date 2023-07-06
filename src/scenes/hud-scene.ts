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
            ['LIVES', this.addText(10, 30, `HEARTx ${this.registry.get('lives')}`).setOrigin(0, 0)],
            ['WORLDTIME', this.addText(2000, 30, `${this.registry.get('worldTime')}`).setOrigin(1, 0)],
            ['SCORE', this.addText(10, 8 * 8 + 30, `${this.registry.get('score')}`).setOrigin(0, 0)],
            ['WORLD', this.addText(1700, 8 * 8 + 30, `${this.registry.get('world')}`).setOrigin(1, 0)],
            ['TIME', this.addText(2000, 8 * 8 + 30, `${this.registry.get('time')}`).setOrigin(1, 0)],
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

    public updateScore() {
        const score = this.textElements.get('SCORE')
        if (score)
            score
                .setText(`${this.registry.get('score')}`)
                .setX(40 - 8 * (this.registry.get('score').toString().length - 1))
    }

    public updateLives() {
        const lives = this.textElements.get('LIVES')
        if (lives) lives.setText(`HEARTx ${this.registry.get('lives')}`)
    }
}
