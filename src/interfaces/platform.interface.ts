export interface IPlatformConstructor {
    scene: Phaser.Scene
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    tweenProps: any
    x: number
    y: number
    texture: string
    frame?: string | number
}
