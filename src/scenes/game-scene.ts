import { Box } from '../objects/box'
import { Brick } from '../objects/brick'
import { Collectible } from '../objects/collectible'
import { Goomba } from '../objects/goomba'
import { Mario } from '../objects/mario'
import { Platform } from '../objects/platform'
import { Portal } from '../objects/portal'

export class GameScene extends Phaser.Scene {
    // tilemap
    private map: Phaser.Tilemaps.Tilemap
    private tileset: Phaser.Tilemaps.Tileset
    private backgroundLayer: Phaser.Tilemaps.TilemapLayer
    private foregroundLayer: Phaser.Tilemaps.TilemapLayer

    // game objects
    private boxes: Phaser.GameObjects.Group
    private bricks: Phaser.GameObjects.Group
    private collectibles: Phaser.GameObjects.Group
    private enemies: Phaser.GameObjects.Group
    private platforms: Phaser.GameObjects.Group
    private player: Mario
    private portals: Phaser.GameObjects.Group

    private doux: Phaser.GameObjects.Sprite | null

    private bullets: Phaser.GameObjects.Group

    constructor() {
        super({
            key: 'GameScene',
        })
    }

    init(): void {
        //
    }

    create(): void {
        // *****************************************************************
        // SETUP TILEMAP
        // *****************************************************************

        // create our tilemap from Tiled JSON
        this.map = this.make.tilemap({ key: this.registry.get('level') })

        let world = ''
        switch (this.registry.get('level')) {
            case 'game1':
                world = '1-1'
                break
            case 'game2':
                world = '1-2'
                break
            case 'game3':
                world = '1-3'
                break
        }
        this.registry.set('world', world)
        // add our tileset and layers to our tilemap
        this.tileset = this.map.addTilesetImage('fish-tiles')
        this.map.createLayer('T0', [this.tileset], 0, 0)
        this.map.createLayer('T1', [this.tileset], 0, 0).setTint(0x02d5ff)

        this.map
            .createLayer('T2', [this.tileset], 0, 0)
            .setTint(0x00ffff)
            .setAlpha(100 / 255)
        this.foregroundLayer = this.map.createLayer('T3', [this.tileset], 0, 0)
        this.backgroundLayer = this.map.createLayer('T4', [this.tileset], 0, 0)
        this.foregroundLayer.setName('foregroundLayer')

        // set collision for tiles with the property collide set to true
        this.foregroundLayer.setCollisionByProperty({ collide: true })

        // *****************************************************************
        // GAME OBJECTS
        // *****************************************************************
        this.doux = null

        this.portals = this.add.group({
            //classType: Portal,//
            runChildUpdate: true,
        })

        this.boxes = this.add.group({
            //classType: Box,//
            runChildUpdate: true,
        })

        this.bricks = this.add.group({
            //classType: Brick,//
            runChildUpdate: true,
        })

        this.collectibles = this.add.group({
            //classType: Collectible,//
            runChildUpdate: true,
        })

        this.enemies = this.add.group({
            runChildUpdate: true,
        })

        this.bullets = this.add.group({
            runChildUpdate: true,
        })

        this.platforms = this.add.group({
            //classType: Platform,//
            runChildUpdate: true,
        })

        this.loadObjectsFromTilemap()

        // *****************************************************************
        // COLLIDERS
        // *****************************************************************
        this.physics.add.collider(this.player, this.foregroundLayer)
        this.physics.add.collider(this.enemies, this.foregroundLayer)
        this.physics.add.collider(this.enemies, this.boxes)
        this.physics.add.collider(this.enemies, this.bricks)
        this.physics.add.collider(this.player, this.bricks)

        this.physics.add.collider(this.player, this.boxes, this.playerHitBox, undefined, this)

        this.physics.add.overlap(
            this.player,
            this.enemies,
            this.handlePlayerEnemyOverlap,
            undefined,
            this
        )

        this.physics.add.overlap(
            this.player,
            this.portals,
            this.handlePlayerPortalOverlap,
            undefined,
            this
        )

        this.physics.add.collider(
            this.player,
            this.platforms,
            this.handlePlayerOnPlatform,
            undefined,
            this
        )

        this.physics.add.overlap(
            this.player,
            this.collectibles,
            this.handlePlayerCollectiblesOverlap,
            undefined,
            this
        )

        this.physics.add.overlap(
            this.bullets,
            this.enemies,
            this.handleBulletKillEnemy,
            undefined,
            this
        )

        this.physics.add.collider(
            this.bullets,
            this.foregroundLayer,
            (bullet, _fore) => {
                bullet.destroy()
            },
            undefined,
            this
        )

        // *****************************************************************
        // CAMERA
        // *****************************************************************
        this.cameras.main.startFollow(this.player)
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels) //*/
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private handleBulletKillEnemy(o1: any, enemy: any): void {
        o1.destroy()
        enemy.gotHitOnHead()
        this.add.tween({
            targets: enemy,
            props: { alpha: 0 },
            duration: 1000,
            ease: 'Power0',
            yoyo: false,
            onComplete: function () {
                enemy.isDead()
            },
        })
    }

    update(): void {
        this.player.update()
    }

    private loadObjectsFromTilemap(): void {
        // get the object layer in the tilemap named 'objects'
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const objects = this.map.getObjectLayer('objects').objects as any[]
        objects.forEach((object) => {
            if (object.type === 'portal') {
                this.portals.add(
                    new Portal({
                        scene: this,
                        x: object.x,
                        y: object.y,
                        height: object.width,
                        width: object.height,
                        spawn: {
                            x: object.properties.marioSpawnX,
                            y: object.properties.marioSpawnY,
                            dir: object.properties.direction,
                        },
                    }).setName(object.name)
                )
            }

            if (object.type === 'player') {
                this.player = new Mario(
                    {
                        scene: this,
                        x: object.x,
                        y: object.y,
                        texture: 'move',
                    },
                    this.bullets
                )
            }

            if (object.type === 'goomba') {
                this.enemies.add(
                    new Goomba({
                        scene: this,
                        x: object.x,
                        y: object.y,
                        texture: 'goomba',
                    })
                )
            }

            if (object.type === 'brick') {
                this.bricks.add(
                    new Brick({
                        scene: this,
                        x: object.x,
                        y: object.y,
                        texture: 'brick',
                        value: 50,
                    })
                )
            }

            if (object.type === 'box') {
                let content = ''
                if (object.properties[0].name == 'content') {
                    content = object.properties[0].value
                }
                this.boxes.add(
                    new Box({
                        scene: this,
                        content: content,
                        x: object.x,
                        y: object.y,
                        texture: 'box',
                    })
                )
            }

            if (object.type === 'collectible') {
                let kindOfCollectible = ''
                if (object.properties[0].name == 'kindOfCollectible') {
                    kindOfCollectible = object.properties[0].value
                }
                this.collectibles.add(
                    new Collectible({
                        scene: this,
                        x: object.x,
                        y: object.y,
                        texture: kindOfCollectible,
                        points: 100,
                    })
                )
            }

            if (object.type === 'platformMovingUpAndDown') {
                this.platforms.add(
                    new Platform({
                        scene: this,
                        x: object.x,
                        y: object.y,
                        texture: 'platform',
                        tweenProps: {
                            y: {
                                value: 50,
                                duration: 5000,
                                ease: 'Power0',
                            },
                        },
                    })
                )
            }

            if (object.type === 'platformMovingLeftAndRight') {
                this.platforms.add(
                    new Platform({
                        scene: this,
                        x: object.x,
                        y: object.y,
                        texture: 'platform',
                        tweenProps: {
                            x: {
                                value: object.x + 1400,
                                duration: 8000,
                                ease: 'Power0',
                            },
                        },
                    })
                )
            }

            if (object.type === 'tard') {
                const tard = this.add.sprite(object.x, object.y, 'tard').setFlipX(true)
                this.physics.add.existing(tard)
                tard.setDisplaySize(100, 100)
                const body = tard.body as Phaser.Physics.Arcade.Body
                body.setSize(13, 13)
                this.physics.add.collider(tard, this.foregroundLayer)
            }

            if (object.type === 'doux') {
                const doux = this.add.sprite(object.x, object.y, 'doux')
                this.physics.add.existing(doux)
                doux.setDisplaySize(100, 100)
                const body = doux.body as Phaser.Physics.Arcade.Body
                body.setSize(13, 13)
                this.physics.add.collider(doux, this.foregroundLayer)
                doux.play('doux')
                this.doux = doux
            }

            if (object.type === 'egg') {
                const egg = this.add.sprite(object.x, object.y, 'egg').setFlipX(true)
                this.physics.add.existing(egg)
                egg.setDisplaySize(100, 100)
                const body = egg.body as Phaser.Physics.Arcade.Body
                body.setSize(13, 13)
                this.physics.add.collider(egg, this.foregroundLayer)
                egg.play('egg')
            }
        })
    }

    /**
     * Player <-> Enemy Overlap
     * @param _player [Mario]
     * @param _enemy  [Enemy]
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private handlePlayerEnemyOverlap(_player: any, _enemy: any): void {
        if (_player.y < _enemy.y + _enemy.height + 5) {
            // player hit enemy on top
            _player.bounceUpAfterHitEnemyOnHead()
            _enemy.gotHitOnHead()
            this.add.tween({
                targets: _enemy,
                props: { alpha: 0 },
                duration: 1000,
                ease: 'Power0',
                yoyo: false,
                onComplete: function () {
                    _enemy.isDead()
                },
            })
        } else {
            // player got hit from the side or on the head
            if (_player.getVulnerable()) {
                _player.gotHit()
            }
        }
    }

    /**
     * Player <-> Box Collision
     * @param _player [Mario]
     * @param _box    [Box]
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private playerHitBox(_player: any, _box: any): void {
        if (_box.body.touching.down && _box.active) {
            // ok, mario has really hit a box on the downside
            _box.yoyoTheBoxUpAndDown()
            this.collectibles.add(_box.spawnBoxContent())

            switch (_box.getBoxContentString()) {
                // have a look what is inside the box! Christmas time!
                case 'coin': {
                    _box.tweenBoxContent({ y: _box.y - 40, alpha: 0 }, 700, function () {
                        _box.getContent()?.destroy()
                    })

                    _box.addCoinAndScore(1, 100)
                    break
                }
                case 'rotatingCoin': {
                    _box.tweenBoxContent({ y: _box.y - 40, alpha: 0 }, 700, function () {
                        _box.getContent()?.destroy()
                    })

                    _box.addCoinAndScore(1, 100)
                    break
                }
                case 'flower': {
                    _box.tweenBoxContent({ y: _box.y - 8 }, 200, function () {
                        _box.getContent()?.anims.play('flower')
                    })

                    break
                }
                case 'mushroom': {
                    _box.popUpCollectible()
                    break
                }
                case 'star': {
                    _box.popUpCollectible()
                    break
                }
                default: {
                    break
                }
            }
            _box.startHitTimeline()
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private handlePlayerPortalOverlap(_player: any, _portal: any): void {
        if (_portal.name === 'exit') {
            this.scene.stop('GameScene')
            this.scene.stop('HUDScene')
            this.scene.start('MenuScene')
        } else if (_portal.name === 'winner') {
            console.log('You win')
            this.scene.stop('GameScene')
            this.scene.stop('HUDScene')
            this.scene.start('WinScene')
        } else if (_portal.name === 'doux_run') {
            if (this.doux) this.doux.body.velocity.x = 50
        } else {
            // set new level and new destination for mario
            this.registry.set('level', _portal.name)
            this.registry.set('spawn', {
                x: _portal.getPortalDestination().x,
                y: _portal.getPortalDestination().y,
                dir: _portal.getPortalDestination().dir,
            })

            // restart the game scene
            this.scene.restart()
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private handlePlayerCollectiblesOverlap(_player: any, _collectible: any): void {
        switch (_collectible.texture.key) {
            case 'flower': {
                break
            }
            case 'mushroom': {
                _player.growMario()
                break
            }
            case 'star': {
                break
            }
            default: {
                break
            }
        }
        _collectible.collected()
    }

    // TODO!!!
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private handlePlayerOnPlatform(player: any, platform: any): void {
        if (platform.body.moves && platform.body.touching.up && player.body.touching.down) {
            //
        }
    }
}
