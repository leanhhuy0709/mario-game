export class WinScene extends Phaser.Scene {
    private startKey: Phaser.Input.Keyboard.Key
    private bitmapTexts: Phaser.GameObjects.BitmapText[] = []

    constructor() {
        super({
            key: 'WinScene',
        })
    }

    init(): void {
        this.startKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S)
        this.startKey.isDown = false
    }

    create(): void {
        this.add.image(1000, 0, 'win').setOrigin(0.5, 0)

        this.bitmapTexts.push(
            this.add.bitmapText(1350, 700, 'font', 'PRESS S TO\n GO BACK MENU', 8 * 8).setOrigin(0.5, 0.5).setCenterAlign()
        )
    }

    update(): void {
        if (this.startKey.isDown) {
            this.scene.start('MenuScene')
        }
    }
}
