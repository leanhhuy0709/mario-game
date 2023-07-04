import Phaser from 'phaser'

export const GameConfig: Phaser.Types.Core.GameConfig = {
    title: 'Super Mario Land',
    url: 'https://github.com/leanhhuy0709/mario-game',
    version: '2.0',
    width: 160,
    height: 144,
    zoom: 5,
    type: Phaser.AUTO,
    parent: 'game',
    scene: [],
    input: {
        keyboard: true,
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 475 },
            debug: false,
        },
    },
    backgroundColor: '#f8f8f8',
    render: { pixelArt: true, antialias: false },
}
