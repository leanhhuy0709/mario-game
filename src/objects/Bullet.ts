export default class Bullet extends Phaser.GameObjects.Sprite {
    public constructor(scene: Phaser.Scene, x: number, y: number, direct: number) {
        super(scene, x, y, 'fireball')
        scene.add.existing(this)
        scene.physics.world.enableBody(this)
        this.setAngle(25)
        this.body.velocity.x = 200 * direct
        if (direct == -1) this.setFlipX(true)
        const body = this.body as Phaser.Physics.Arcade.Body
        body.setAllowGravity(false)

        this.setScale(1.5)

        this.play('fireball')
    }
}
