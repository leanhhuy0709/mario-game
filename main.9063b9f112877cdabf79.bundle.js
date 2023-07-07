(()=>{"use strict";var e,t={826:(e,t,s)=>{var i=s(260),r=s.n(i);class n{constructor(e,t){this.scene=e,this.animationData=t,this.createGameAnimations()}createGameAnimations(){for(const e of this.animationData.anims){let t;const s=[];if("generateFrameNames"===e.frames.typeOfGeneration)t=this.scene.anims.generateFrameNames(e.frames.key,{prefix:e.frames.prefix||"",start:e.frames.start||0,end:e.frames.end||0,suffix:e.frames.suffix||"",zeroPad:e.frames.zeroPad||0,frames:e.frames.frames||!1});else if("generateFrameNumbers"===e.frames.typeOfGeneration)t=this.scene.anims.generateFrameNumbers(e.frames.key,{start:e.frames.start||0,end:e.frames.end||-1,first:e.frames.first||!1,frames:e.frames.frames||!1});else for(const t of e.frames){const e={key:t.key,frame:t.frame,duration:t.duration||0,visible:t.visible};s.push(e)}this.scene.anims.create({key:e.key,frames:t||s,defaultTextureKey:e.defaultTextureKey||null,frameRate:e.frameRate||24,duration:e.duration,skipMissedFrames:e.skipMissedFrames||!0,delay:e.delay||0,repeat:e.repeat||0,repeatDelay:e.repeatDelay||0,yoyo:e.yoyo||!1,showOnStart:e.showOnStart||!1,hideOnComplete:e.hideOnComplete||!1})}}}class a extends Phaser.Scene{constructor(){super({key:"BootScene"})}preload(){this.cameras.main.setBackgroundColor(0),this.createLoadingGraphics(),this.load.on("progress",(e=>{this.progressBar.clear(),this.progressBar.fillStyle(8971347,1),this.progressBar.fillRect(this.cameras.main.width/4,this.cameras.main.height/2-16,this.cameras.main.width/2*e,16)}),this),this.load.on("complete",(()=>{this.animationHelperInstance=new n(this,this.cache.json.get("animationJSON")),this.progressBar.destroy(),this.loadingBar.destroy()}),this),this.load.pack("preload","./assets/pack.json","preload")}update(){this.scene.start("MenuScene")}createLoadingGraphics(){this.loadingBar=this.add.graphics(),this.loadingBar.fillStyle(16777215,1),this.loadingBar.fillRect(this.cameras.main.width/4-2,this.cameras.main.height/2-18,this.cameras.main.width/2+4,20),this.progressBar=this.add.graphics()}}class o extends Phaser.GameObjects.Sprite{constructor(e){super(e.scene,e.x,e.y,e.texture,e.frame),this.currentScene=e.scene,this.points=e.points,this.initSprite(),this.currentScene.add.existing(this)}initSprite(){this.setOrigin(0,0),this.setFrame(0),this.currentScene.physics.world.enable(this),this.body.setSize(8,8),this.setScale(8),this.body.setAllowGravity(!1)}update(){}collected(){this.destroy(),this.currentScene.registry.values.score+=this.points,this.currentScene.events.emit("scoreChanged")}}class h extends Phaser.GameObjects.Sprite{getContent(){return this.content?this.content:null}getBoxContentString(){return this.boxContent}constructor(e){super(e.scene,e.x,e.y,e.texture,e.frame),this.setScale(8),this.currentScene=e.scene,this.boxContent=e.content,this.initSprite(),this.currentScene.add.existing(this)}initSprite(){this.content=null,this.hitBoxTimeline=this.currentScene.tweens.createTimeline({}),this.setOrigin(0,0),this.setFrame(0),this.currentScene.physics.world.enable(this),this.body.setSize(8,8),this.body.setAllowGravity(!1),this.body.setImmovable(!0)}update(){}yoyoTheBoxUpAndDown(){this.hitBoxTimeline.add({targets:this,props:{y:this.y-20},duration:100,ease:"Power0",yoyo:!0,onComplete:function(){this.targets[0].active=!1,this.targets[0].setFrame(1)}})}spawnBoxContent(){return this.content=new o({scene:this.currentScene,x:this.x,y:this.y-50,texture:this.boxContent,points:1e3}),this.content}tweenBoxContent(e,t,s){this.hitBoxTimeline.add({targets:this.content,props:e,delay:0,duration:t,ease:"Power0",onComplete:s})}startHitTimeline(){this.hitBoxTimeline.play()}popUpCollectible(){this.content&&(this.content.body.setVelocity(30,-50),this.content.body.setAllowGravity(!0),this.content.body.setGravityY(-300))}addCoinAndScore(e,t){this.currentScene.registry.values.coins+=e,this.currentScene.events.emit("coinsChanged"),this.currentScene.registry.values.score+=t,this.currentScene.events.emit("scoreChanged")}}class c extends Phaser.GameObjects.Sprite{constructor(e){super(e.scene,e.x,e.y,e.texture,e.frame),this.currentScene=e.scene,this.destroyingValue=e.value,this.initSprite(),this.currentScene.add.existing(this)}initSprite(){this.setOrigin(0,0),this.setFrame(0),this.currentScene.physics.world.enable(this),this.body.setSize(8,8),this.body.setAllowGravity(!1),this.body.setImmovable(!0)}update(){if(this.body.touching.down){for(let e=-2;e<2;e++){const e=this.currentScene.add.sprite(this.x,this.y,"brick").setOrigin(0,0).setDisplaySize(4,4);this.currentScene.physics.world.enable(e)}this.destroy(),this.currentScene.registry.values.score+=this.destroyingValue,this.currentScene.events.emit("scoreChanged")}}}class d extends Phaser.GameObjects.Sprite{constructor(e){super(e.scene,e.x,e.y,e.texture,e.frame),this.currentScene=e.scene,this.initSprite(),this.currentScene.add.existing(this)}initSprite(){this.isActivated=!1,this.isDying=!1,this.setOrigin(0,0),this.setFrame(0),this.currentScene.physics.world.enable(this),this.body.setSize(8,8)}showAndAddScore(){this.currentScene.registry.values.score+=this.dyingScoreValue,this.currentScene.events.emit("scoreChanged");const e=this.currentScene.add.dynamicBitmapText(this.x,this.y-20,"font",this.dyingScoreValue.toString(),4).setOrigin(0,0);this.currentScene.add.tween({targets:e,props:{y:e.y-25},duration:800,ease:"Power0",yoyo:!1,onComplete:function(){e.destroy()}})}}class l extends d{constructor(e){super(e),this.setScale(8.5),this.speed=-50,this.dyingScoreValue=100}update(){this.isDying?(this.anims.stop(),this.body.setVelocity(0,0),this.body.checkCollision.none=!0):this.isActivated?(this.body.setVelocityX(this.speed),(this.body.blocked.right||this.body.blocked.left)&&(this.speed=-this.speed,this.body.velocity.x=this.speed),this.anims.play("goombaWalk",!0)):Phaser.Geom.Intersects.RectangleToRectangle(this.getBounds(),this.currentScene.cameras.main.worldView)&&(this.isActivated=!0)}gotHitOnHead(){this.isDying=!0,this.setFrame(2),this.showAndAddScore()}gotHitFromBulletOrMarioHasStar(){this.isDying=!0,this.body.setVelocityX(20),this.body.setVelocityY(-20),this.setFlipY(!0)}isDead(){this.destroy()}}class y extends Phaser.GameObjects.Sprite{constructor(e,t,s,i){super(e,t,s,"fireball"),e.add.existing(this),e.physics.world.enableBody(this),this.setAngle(25),this.body.velocity.x=200*i,-1==i&&this.setAngle(205);const r=this.body;r.setAllowGravity(!1),r.setSize(25,25),this.setScale(1.5).setTint(3319890),this.play("fireball")}}class p extends Phaser.GameObjects.Sprite{getKeys(){return this.keys}getVulnerable(){return this.isVulnerable}constructor(e,t){super(e.scene,e.x,e.y,e.texture,e.frame),this.fireFlag=!1,this.currentScene=e.scene,this.initSprite(),this.body.setSize(13,13),this.setDisplaySize(100,100),this.currentScene.add.existing(this),this.bullets=t,this.spawnX=e.x,this.spawnY=e.y}initSprite(){this.marioSize=this.currentScene.registry.get("marioSize"),this.acceleration=1500,this.isJumping=!1,this.isDying=!1,this.isVulnerable=!0,this.vulnerableCounter=400,this.setOrigin(.5,.5),this.setFlipX(!1),this.keys=new Map([["LEFT",this.addKey("LEFT")],["RIGHT",this.addKey("RIGHT")],["DOWN",this.addKey("DOWN")],["JUMP",this.addKey("SPACE")],["FIRE",this.addKey("F")]]),this.currentScene.physics.world.enable(this),this.adjustPhysicBodyToSmallSize(),this.body.maxVelocity.x=200,this.body.maxVelocity.y=500}addKey(e){return this.currentScene.input.keyboard.addKey(e)}update(){this.isDying?(this.setFrame(5),this.y>this.currentScene.sys.canvas.height&&(this.currentScene.scene.stop("GameScene"),this.currentScene.scene.stop("HUDScene"),this.currentScene.scene.start("MenuScene"))):(this.handleInput(),this.handleAnimations()),this.isVulnerable||(this.vulnerableCounter>0?this.vulnerableCounter-=1:(this.vulnerableCounter=400,this.isVulnerable=!0))}handleInput(){var e,t,s,i;this.y>this.currentScene.sys.canvas.height&&(this.isDying=!0),(this.body.onFloor()||this.body.touching.down||this.body.blocked.down)&&(this.isJumping=!1);let r=!1;(null===(e=this.keys.get("RIGHT"))||void 0===e?void 0:e.isDown)?(this.body.setAccelerationX(this.acceleration),this.setFlipX(!1),r=!0):(null===(t=this.keys.get("LEFT"))||void 0===t?void 0:t.isDown)?(this.body.setAccelerationX(-this.acceleration),this.setFlipX(!0),r=!0):(this.body.setVelocityX(0),this.body.setAccelerationX(0)),(null===(s=this.keys.get("JUMP"))||void 0===s?void 0:s.isDown)&&!this.isJumping&&(this.body.setVelocityY(-500),this.isJumping=!0,r=!0),!r&&(null===(i=this.keys.get("FIRE"))||void 0===i?void 0:i.isDown)?(this.fire(),this.fireFlag=!1):this.fireFlag=!0}fire(){if(this.fireFlag){let e=this.scene.registry.get("score");e>=200&&(e-=200,this.scene.registry.set("score",e),this.scene.scene.get("HUDScene").updateScore(),this.flipX?this.bullets.add(new y(this.scene,this.x-64,this.y,-1)):this.bullets.add(new y(this.scene,this.x+64,this.y,1)))}}handleAnimations(){var e;0!==this.body.velocity.y?this.anims.stop():0!==this.body.velocity.x?(this.body.velocity.x,this.anims.play(this.marioSize+"MarioWalk",!0)):(this.anims.stop(),"small"===this.marioSize?this.setFrame(0):(null===(e=this.keys.get("DOWN"))||void 0===e?void 0:e.isDown)?this.setFrame(1):this.setFrame(5))}growMario(){this.marioSize="big",this.currentScene.registry.set("marioSize","big"),this.adjustPhysicBodyToBigSize()}shrinkMario(){this.marioSize="small",this.currentScene.registry.set("marioSize","small"),this.adjustPhysicBodyToSmallSize()}adjustPhysicBodyToSmallSize(){this.setDisplaySize(100,100)}adjustPhysicBodyToBigSize(){this.setDisplaySize(150,150)}bounceUpAfterHitEnemyOnHead(){this.currentScene.add.tween({targets:this,props:{y:this.y-5},duration:200,ease:"Power1",yoyo:!0})}gotHit(){if(this.isVulnerable=!1,"big"===this.marioSize)this.shrinkMario();else{const e=this.scene.registry.get("lives");if(e>1)return this.scene.registry.set("lives",e-1),this.setPosition(this.spawnX,this.spawnY),void this.scene.scene.get("HUDScene").updateLives();this.isDying=!0,this.body.stop(),this.anims.stop(),this.body.setVelocityY(-250),this.body.checkCollision.up=!1,this.body.checkCollision.down=!1,this.body.checkCollision.left=!1,this.body.checkCollision.right=!1}}}class u extends Phaser.GameObjects.Image{constructor(e){super(e.scene,e.x,e.y,e.texture,e.frame),this.currentScene=e.scene,this.tweenProps=e.tweenProps,this.setScale(8),this.initImage(),this.initTween(),this.currentScene.add.existing(this)}initImage(){this.setOrigin(0,0),this.setFrame(0),this.currentScene.physics.world.enable(this),this.body.setSize(24,5),this.body.setAllowGravity(!1),this.body.setImmovable(!0)}initTween(){this.currentScene.tweens.add({targets:this,props:this.tweenProps,ease:"Power0",yoyo:!0,repeat:-1})}update(){}}class g extends Phaser.GameObjects.Zone{getPortalDestination(){return this.portalDestinationForMario}constructor(e){super(e.scene,e.x,e.y,e.width,e.height),this.currentScene=e.scene,this.portalDestinationForMario=e.spawn,this.initZone(),this.currentScene.add.existing(this)}initZone(){this.setOrigin(0,0),this.currentScene.physics.world.enable(this),this.body.setSize(this.height,this.width),this.body.setOffset(0,0),this.body.setAllowGravity(!1),this.body.setImmovable(!0)}update(){}}class m extends Phaser.Scene{constructor(){super({key:"GameScene"})}init(){}create(){this.map=this.make.tilemap({key:this.registry.get("level")});let e="";switch(this.registry.get("level")){case"game1":e="1-1";break;case"game2":e="1-2";break;case"game3":e="1-3"}this.registry.set("world",e),this.tileset=this.map.addTilesetImage("fish-tiles"),this.map.createLayer("T0",[this.tileset],0,0),this.map.createLayer("T1",[this.tileset],0,0).setTint(185855),this.map.createLayer("T2",[this.tileset],0,0).setTint(65535).setAlpha(100/255),this.foregroundLayer=this.map.createLayer("T3",[this.tileset],0,0),this.backgroundLayer=this.map.createLayer("T4",[this.tileset],0,0),this.foregroundLayer.setName("foregroundLayer"),this.foregroundLayer.setCollisionByProperty({collide:!0}),this.doux=null,this.portals=this.add.group({runChildUpdate:!0}),this.boxes=this.add.group({runChildUpdate:!0}),this.bricks=this.add.group({runChildUpdate:!0}),this.collectibles=this.add.group({runChildUpdate:!0}),this.enemies=this.add.group({runChildUpdate:!0}),this.bullets=this.add.group({runChildUpdate:!0}),this.platforms=this.add.group({runChildUpdate:!0}),this.loadObjectsFromTilemap(),this.physics.add.collider(this.player,this.foregroundLayer),this.physics.add.collider(this.enemies,this.foregroundLayer),this.physics.add.collider(this.enemies,this.boxes),this.physics.add.collider(this.enemies,this.bricks),this.physics.add.collider(this.player,this.bricks),this.physics.add.collider(this.player,this.boxes,this.playerHitBox,void 0,this),this.physics.add.overlap(this.player,this.enemies,this.handlePlayerEnemyOverlap,void 0,this),this.physics.add.overlap(this.player,this.portals,this.handlePlayerPortalOverlap,void 0,this),this.physics.add.collider(this.player,this.platforms,this.handlePlayerOnPlatform,void 0,this),this.physics.add.overlap(this.player,this.collectibles,this.handlePlayerCollectiblesOverlap,void 0,this),this.physics.add.overlap(this.bullets,this.enemies,this.handleBulletKillEnemy,void 0,this),this.physics.add.collider(this.bullets,this.foregroundLayer,((e,t)=>{e.destroy()}),void 0,this),this.cameras.main.startFollow(this.player),this.cameras.main.setBounds(0,0,this.map.widthInPixels,this.map.heightInPixels)}handleBulletKillEnemy(e,t){e.destroy(),t.gotHitOnHead(),this.add.tween({targets:t,props:{alpha:0},duration:1e3,ease:"Power0",yoyo:!1,onComplete:function(){t.isDead()}})}update(){this.player.update()}loadObjectsFromTilemap(){this.map.getObjectLayer("objects").objects.forEach((e=>{if("portal"===e.type&&this.portals.add(new g({scene:this,x:e.x,y:e.y,height:e.width,width:e.height,spawn:{x:e.properties.marioSpawnX,y:e.properties.marioSpawnY,dir:e.properties.direction}}).setName(e.name)),"player"===e.type&&(this.player=new p({scene:this,x:e.x,y:e.y,texture:"move"},this.bullets)),"goomba"===e.type&&this.enemies.add(new l({scene:this,x:e.x,y:e.y,texture:"goomba"})),"brick"===e.type&&this.bricks.add(new c({scene:this,x:e.x,y:e.y,texture:"brick",value:50})),"box"===e.type){let t="";"content"==e.properties[0].name&&(t=e.properties[0].value),this.boxes.add(new h({scene:this,content:t,x:e.x,y:e.y,texture:"box"}))}if("collectible"===e.type){let t="";"kindOfCollectible"==e.properties[0].name&&(t=e.properties[0].value),this.collectibles.add(new o({scene:this,x:e.x,y:e.y,texture:t,points:100}))}if("platformMovingUpAndDown"===e.type&&this.platforms.add(new u({scene:this,x:e.x,y:e.y,texture:"platform",tweenProps:{y:{value:50,duration:5e3,ease:"Power0"}}})),"platformMovingLeftAndRight"===e.type&&this.platforms.add(new u({scene:this,x:e.x,y:e.y,texture:"platform",tweenProps:{x:{value:e.x+1400,duration:8e3,ease:"Power0"}}})),"tard"===e.type){const t=this.add.sprite(e.x,e.y,"tard").setFlipX(!0);this.physics.add.existing(t),t.setDisplaySize(100,100),t.body.setSize(13,13),this.physics.add.collider(t,this.foregroundLayer)}if("doux"===e.type){const t=this.add.sprite(e.x,e.y,"doux");this.physics.add.existing(t),t.setDisplaySize(100,100),t.body.setSize(13,13),this.physics.add.collider(t,this.foregroundLayer),t.play("doux"),this.doux=t}if("egg"===e.type){const t=this.add.sprite(e.x,e.y,"egg").setFlipX(!0);this.physics.add.existing(t),t.setDisplaySize(100,100),t.body.setSize(13,13),this.physics.add.collider(t,this.foregroundLayer),t.play("egg")}}))}handlePlayerEnemyOverlap(e,t){e.y<t.y+t.height/2+5?(e.bounceUpAfterHitEnemyOnHead(),t.gotHitOnHead(),this.add.tween({targets:t,props:{alpha:0},duration:1e3,ease:"Power0",yoyo:!1,onComplete:function(){t.isDead()}})):e.getVulnerable()&&e.gotHit()}playerHitBox(e,t){if(t.body.touching.down&&t.active){switch(t.yoyoTheBoxUpAndDown(),this.collectibles.add(t.spawnBoxContent()),t.getBoxContentString()){case"coin":case"rotatingCoin":t.tweenBoxContent({y:t.y-40,alpha:0},700,(function(){var e;null===(e=t.getContent())||void 0===e||e.destroy()})),t.addCoinAndScore(1,100);break;case"flower":t.tweenBoxContent({y:t.y-8},200,(function(){var e;null===(e=t.getContent())||void 0===e||e.anims.play("flower")}));break;case"mushroom":case"star":t.popUpCollectible()}t.startHitTimeline()}}handlePlayerPortalOverlap(e,t){"exit"===t.name?(this.scene.stop("GameScene"),this.scene.stop("HUDScene"),this.scene.start("MenuScene")):"winner"===t.name?(console.log("You win"),this.scene.stop("GameScene"),this.scene.stop("HUDScene"),this.scene.start("WinScene")):"doux_run"===t.name?this.doux&&(this.doux.body.velocity.x=50):(this.registry.set("level",t.name),this.registry.set("spawn",{x:t.getPortalDestination().x,y:t.getPortalDestination().y,dir:t.getPortalDestination().dir}),this.scene.restart())}handlePlayerCollectiblesOverlap(e,t){switch(t.texture.key){case"flower":case"star":default:break;case"mushroom":e.growMario()}t.collected()}handlePlayerOnPlatform(e,t){t.body.moves&&t.body.touching.up&&e.body.touching.down}}class b extends Phaser.Scene{constructor(){super({key:"HUDScene"})}create(){this.textElements=new Map([["LIVES",this.addText(10,30,`HEARTx ${this.registry.get("lives")}`).setOrigin(0,0)],["WORLDTIME",this.addText(2e3,30,`${this.registry.get("worldTime")}`).setOrigin(1,0)],["SCORE",this.addText(10,94,`${this.registry.get("score")}`).setOrigin(0,0)],["WORLD",this.addText(1700,94,`${this.registry.get("world")}`).setOrigin(1,0)],["TIME",this.addText(2e3,94,`${this.registry.get("time")}`).setOrigin(1,0)]]);const e=this.scene.get("GameScene");e.events.on("coinsChanged",this.updateCoins,this),e.events.on("scoreChanged",this.updateScore,this),e.events.on("livesChanged",this.updateLives,this),this.timer=this.time.addEvent({delay:1e3,callback:this.updateTime,callbackScope:this,loop:!0})}addText(e,t,s){return this.add.bitmapText(e,t,"font",s,64)}updateTime(){var e;this.registry.values.time-=1,null===(e=this.textElements.get("TIME"))||void 0===e||e.setText(`${this.registry.get("time")}`)}updateCoins(){const e=this.textElements.get("COINS");e&&e.setText(`${this.registry.get("coins")}`).setX(80-8*(this.registry.get("coins").toString().length-1))}updateScore(){const e=this.textElements.get("SCORE");e&&e.setText(`${this.registry.get("score")}`).setX(40-8*(this.registry.get("score").toString().length-1))}updateLives(){const e=this.textElements.get("LIVES");e&&e.setText(`HEARTx ${this.registry.get("lives")}`)}}class S extends Phaser.Scene{constructor(){super({key:"MenuScene"}),this.bitmapTexts=[]}init(){this.startKey=this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),this.startKey.isDown=!1,this.initGlobalDataManager()}create(){this.add.image(1e3,0,"menu").setOrigin(.5,0),this.bitmapTexts.push(this.add.bitmapText(1e3,900,"font","PRESS S TO PLAY",64).setOrigin(.5,.5))}update(){this.startKey.isDown&&(this.scene.start("HUDScene"),this.scene.start("GameScene"),this.scene.bringToTop("HUDScene"))}initGlobalDataManager(){this.registry.set("time",400),this.registry.set("level","game1"),this.registry.set("world","1-1"),this.registry.set("worldTime","WORLD TIME"),this.registry.set("score",0),this.registry.set("coins",0),this.registry.set("lives",2),this.registry.set("spawn",{x:12,y:44,dir:"down"}),this.registry.set("marioSize","small")}}class x extends Phaser.Scene{constructor(){super({key:"WinScene"}),this.bitmapTexts=[]}init(){this.startKey=this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),this.startKey.isDown=!1}create(){this.add.image(1e3,0,"win").setOrigin(.5,0),this.bitmapTexts.push(this.add.bitmapText(1350,700,"font","PRESS S TO\n GO BACK MENU",64).setOrigin(.5,.5).setCenterAlign())}update(){this.startKey.isDown&&this.scene.start("MenuScene")}}const f={title:"Super Mario Land",url:"https://github.com/leanhhuy0709/mario-game",version:"2.0",width:2e3,height:1280,zoom:5,type:r().AUTO,parent:"game",scene:[a,S,b,m,x],input:{keyboard:!0},physics:{default:"arcade",arcade:{gravity:{y:475},debug:!1}},scale:{mode:r().Scale.FIT,autoCenter:r().Scale.CENTER_BOTH},backgroundColor:"#f8f8f8",render:{pixelArt:!0,antialias:!1}};class v extends Phaser.Game{constructor(e){super(e)}}window.addEventListener("load",(()=>{new v(f)}))}},s={};function i(e){var r=s[e];if(void 0!==r)return r.exports;var n=s[e]={exports:{}};return t[e].call(n.exports,n,n.exports,i),n.exports}i.m=t,e=[],i.O=(t,s,r,n)=>{if(!s){var a=1/0;for(d=0;d<e.length;d++){for(var[s,r,n]=e[d],o=!0,h=0;h<s.length;h++)(!1&n||a>=n)&&Object.keys(i.O).every((e=>i.O[e](s[h])))?s.splice(h--,1):(o=!1,n<a&&(a=n));if(o){e.splice(d--,1);var c=r();void 0!==c&&(t=c)}}return t}n=n||0;for(var d=e.length;d>0&&e[d-1][2]>n;d--)e[d]=e[d-1];e[d]=[s,r,n]},i.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return i.d(t,{a:t}),t},i.d=(e,t)=>{for(var s in t)i.o(t,s)&&!i.o(e,s)&&Object.defineProperty(e,s,{enumerable:!0,get:t[s]})},i.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),(()=>{var e={179:0};i.O.j=t=>0===e[t];var t=(t,s)=>{var r,n,[a,o,h]=s,c=0;if(a.some((t=>0!==e[t]))){for(r in o)i.o(o,r)&&(i.m[r]=o[r]);if(h)var d=h(i)}for(t&&t(s);c<a.length;c++)n=a[c],i.o(e,n)&&e[n]&&e[n][0](),e[n]=0;return i.O(d)},s=self.webpackChunktype_project_template=self.webpackChunktype_project_template||[];s.forEach(t.bind(null,0)),s.push=t.bind(null,s.push.bind(s))})();var r=i.O(void 0,[216],(()=>i(826)));r=i.O(r)})();