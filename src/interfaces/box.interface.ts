export interface IBoxConstructor {
    scene: Phaser.Scene
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    content: any
    x: number
    y: number
    texture: string
    frame?: string | number
}
