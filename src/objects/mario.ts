import { ISpriteConstructor } from '../interfaces/sprite.interface'
import { HUDScene } from '../scenes/hud-scene'
import Bullet from './Bullet'

const JUMP_SIZE = 500
const MAX_VELOCITY_X = 200
const MAX_VELOCITY_Y = 500
export class Mario extends Phaser.GameObjects.Sprite {
    body: Phaser.Physics.Arcade.Body

    bullets: Phaser.GameObjects.Group

    // variables
    private currentScene: Phaser.Scene
    private marioSize: string
    private acceleration: number
    private isJumping: boolean
    private isDying: boolean
    private isVulnerable: boolean
    private vulnerableCounter: number
    private fireFlag = false

    private spawnX: number
    private spawnY: number

    // input
    private keys: Map<string, Phaser.Input.Keyboard.Key>

    public getKeys(): Map<string, Phaser.Input.Keyboard.Key> {
        return this.keys
    }

    public getVulnerable(): boolean {
        return this.isVulnerable
    }

    constructor(aParams: ISpriteConstructor, bullets: Phaser.GameObjects.Group) {
        super(aParams.scene, aParams.x, aParams.y, aParams.texture, aParams.frame)

        this.currentScene = aParams.scene
        this.initSprite()
        //this.setSize(100, 100)
        this.body.setSize(13, 13)
        this.setDisplaySize(100, 100)

        this.currentScene.add.existing(this)

        this.bullets = bullets

        this.spawnX = aParams.x
        this.spawnY = aParams.y
    }

    private initSprite() {
        // variables
        this.marioSize = this.currentScene.registry.get('marioSize')
        this.acceleration = 500 * 3
        this.isJumping = false
        this.isDying = false
        this.isVulnerable = true
        this.vulnerableCounter = 100 * 4

        // sprite
        this.setOrigin(0.5, 0.5)
        this.setFlipX(false)

        // input
        this.keys = new Map([
            ['LEFT', this.addKey('LEFT')],
            ['RIGHT', this.addKey('RIGHT')],
            ['DOWN', this.addKey('DOWN')],
            ['JUMP', this.addKey('SPACE')],
            ['FIRE', this.addKey('F')],
        ])

        // physics
        this.currentScene.physics.world.enable(this)
        this.adjustPhysicBodyToSmallSize()
        this.body.maxVelocity.x = MAX_VELOCITY_X
        this.body.maxVelocity.y = MAX_VELOCITY_Y
    }

    private addKey(key: string): Phaser.Input.Keyboard.Key {
        return this.currentScene.input.keyboard.addKey(key)
    }

    update(): void {
        if (!this.isDying) {
            this.handleInput()
            this.handleAnimations()
        } else {
            this.setFrame(5)
            if (this.y > this.currentScene.sys.canvas.height) {
                this.currentScene.scene.stop('GameScene')
                this.currentScene.scene.stop('HUDScene')
                this.currentScene.scene.start('MenuScene')
            }
        }

        if (!this.isVulnerable) {
            if (this.vulnerableCounter > 0) {
                this.vulnerableCounter -= 1
            } else {
                this.vulnerableCounter = 100 * 4
                this.isVulnerable = true
            }
        }
    }

    private handleInput() {
        if (this.y > this.currentScene.sys.canvas.height) {
            // mario fell into a hole
            this.isDying = true
        }

        // evaluate if player is on the floor or on object
        // if neither of that, set the player to be jumping
        if (this.body.onFloor() || this.body.touching.down || this.body.blocked.down) {
            this.isJumping = false
            //this.body.setVelocityY(0);
        }
        let isMoved = false
        // handle movements to left and right
        if (this.keys.get('RIGHT')?.isDown) {
            this.body.setAccelerationX(this.acceleration)
            this.setFlipX(false)
            isMoved = true
        } else if (this.keys.get('LEFT')?.isDown) {
            this.body.setAccelerationX(-this.acceleration)
            this.setFlipX(true)
            isMoved = true
        } else {
            this.body.setVelocityX(0)
            this.body.setAccelerationX(0)
        }

        // handle jumping
        if (this.keys.get('JUMP')?.isDown && !this.isJumping) {
            this.body.setVelocityY(-JUMP_SIZE)
            this.isJumping = true
            isMoved = true
        }

        if (!isMoved && this.keys.get('FIRE')?.isDown) {
            this.fire()
            this.fireFlag = false
        } else {
            this.fireFlag = true
        }
    }

    public fire(): void {
        if (this.fireFlag) {
            if (this.flipX) this.bullets.add(new Bullet(this.scene, this.x - 64, this.y, -1))
            else this.bullets.add(new Bullet(this.scene, this.x + 64, this.y, 1))
        }
    }

    private handleAnimations(): void {
        if (this.body.velocity.y !== 0) {
            // mario is jumping or falling
            this.anims.stop()
        } else if (this.body.velocity.x !== 0) {
            // mario is moving horizontal

            if (this.body.velocity.x > 0) {
                this.anims.play(this.marioSize + 'MarioWalk', true)
            } else {
                this.anims.play(this.marioSize + 'MarioWalk', true)
            }
        } else {
            // mario is standing still
            this.anims.stop()
            if (this.marioSize === 'small') {
                this.setFrame(0)
            } else {
                if (this.keys.get('DOWN')?.isDown) {
                    this.setFrame(1)
                } else {
                    this.setFrame(5)
                }
            }
        }
    }

    public growMario(): void {
        this.marioSize = 'big'
        this.currentScene.registry.set('marioSize', 'big')
        this.adjustPhysicBodyToBigSize()
    }

    private shrinkMario(): void {
        this.marioSize = 'small'
        this.currentScene.registry.set('marioSize', 'small')
        this.adjustPhysicBodyToSmallSize()
    }

    private adjustPhysicBodyToSmallSize(): void {
        this.setDisplaySize(100, 100)
    }

    private adjustPhysicBodyToBigSize(): void {
        this.setDisplaySize(150, 150)
    }

    public bounceUpAfterHitEnemyOnHead(): void {
        this.currentScene.add.tween({
            targets: this,
            props: { y: this.y - 5 },
            duration: 200,
            ease: 'Power1',
            yoyo: true,
        })
    }

    public gotHit(): void {
        this.isVulnerable = false
        if (this.marioSize === 'big') {
            this.shrinkMario()
        } else {
            const lives = this.scene.registry.get('lives')
            if (lives > 1) {
                this.scene.registry.set('lives', lives - 1)
                this.setPosition(this.spawnX, this.spawnY)
                const HUDScene = this.scene.scene.get('HUDScene') as HUDScene
                HUDScene.updateLives()
                return
            }

            // mario is dying
            this.isDying = true

            // sets acceleration, velocity and speed to zero
            // stop all animations
            this.body.stop()
            this.anims.stop()

            // make last dead jump and turn off collision check
            this.body.setVelocityY(-JUMP_SIZE / 2)

            // this.body.checkCollision.none did not work for me
            this.body.checkCollision.up = false
            this.body.checkCollision.down = false
            this.body.checkCollision.left = false
            this.body.checkCollision.right = false
        }
    }
}
