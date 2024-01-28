import Phaser from "phaser"
import woolPath from "../Assets/Level1/wool.png"
import bgPath from "../Assets/Level1/background.png"
import basketPath from "../Assets/Level1/basket.png"
import sheepPath from "../Assets/Level1/sheepSheet.png"
import continueTextPath from "../Assets/Level1/continue.png"
import continueBtnPath from "../Assets/Level1/continueBtn.png"
const musicPath2 = require("url:../Assets/Level1/elevator.mp3")

let settings;
let config;

export default class Level1 extends Phaser.Scene {
  constructor() {
      super("Level1")
  }

  preload() {
    this.load.image("woolPiece", woolPath)
    this.load.image("bg", bgPath)
    this.load.image("basket", basketPath)
    this.load.image("continueText", continueTextPath)
    this.load.image("continueBtn", continueBtnPath)
    this.load.spritesheet("sheepSheet", sheepPath, {frameWidth: 860, frameHeight: 555 })
    this.load.audio('music2', musicPath2)
  }

  create(data) {
    config = data.config
    settings = data.settings
    let woolCaught = 0
    this.finished = false

    this.keyLeft = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.keyRight = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

    this.add.image(config.width / 2, config.height / 2, "bg").setDepth(0)
    this.physics.world.setBounds(0, 0, config.width, config.height);
    let woolText = this.add.text(config.width - 660, 16, 'Villaa kerätty: 0', { fontFamily: "Comic Sans MS", fontSize: 80, fill: '#ffffff' });
    this.btn = null
    this.playSheepAnim()
 
    this.music = this.sound.add('music2');
    this.music.loop = true;
    this.music.play();

    this.basket = this.createBasket()
    this.hitbox1 = this.createHitbox(this.basket.body.position)
    this.hitbox2 = this.createHitbox(this.basket.body.position)

    this.woolPieces = this.physics.add.group({
      classType: WoolPiece,
      runChildUpdate: true
    })

    this.woolTrigger = this.time.addEvent({
      callback: this.spawnWool,
      callbackScope: this,
      delay: 1000,
      loop: true
    })

    this.physics.add.collider(
      this.woolPieces,
      this.basket,
      (basket, woolPiece) => {
        woolCaught += 1
        woolText.text = 'Villaa kerätty: ' + woolCaught.toString()
        if (!this.finished && woolCaught >= 20) {
          this.triggerEnding()
        }
        woolPiece.destroy()
      }
    );
    
    this.physics.add.collider(
      this.woolPieces,
      this.hitbox1,
    );

    this.physics.add.collider(
      this.woolPieces,
      this.hitbox2,
    );
  }

  update(time, delta) {
    if (!this.finished) {
      this.basketController(delta)
    }
    const newPosX = this.basket.body.position.x
    this.hitbox1.setPosition(newPosX - 50, 940)
    this.hitbox2.setPosition(newPosX + 360, 940)
  }

  spawnWool() {
    const velocityX = -100 + Math.random()*500
    let woolPiece = this.woolPieces.get()
    if (woolPiece) {
      woolPiece.setPosition(500, 300)
      woolPiece.setSize(settings.woolSizeX, settings.woolSizeY)
      woolPiece.body.gravity.y = 500
      woolPiece.body.setVelocity(velocityX,-700)
      woolPiece.setDepth(1)
      woolPiece.setBounce(0.5)
      setTimeout(() => {
        woolPiece.setDepth(3)
      }, 1000)
    }
  }

  basketController(delta) {
    if (this.keyLeft.isDown) {
      this.basket.body.velocity.x -= 30
    }
    else if (this.keyRight.isDown) {
      this.basket.body.velocity.x += 30
    }
  }

  playSheepAnim() {
    let sheep = this.add.sprite(0, 0, "sheepAnim")
    sheep.setOrigin(0,0)
    sheep.setDepth(2)
    this.anims.create({
      key: "sheepAnim",
      frames: this.anims.generateFrameNumbers("sheepSheet", {start: 0, end : 1}),
      frameRate: 4,
      repeat: -1
    })
    sheep.anims.play("sheepAnim")
  }

  createBasket() {
    const basket = this.physics.add.sprite(config.width/2, config.height-200, "basket");
    basket.setDrag(600)
    basket.setSize(settings.basketSizeX, settings.basketSizeY)
    basket.setOffset(150,250)
    basket.setCollideWorldBounds(true);
    basket.setImmovable(true)
    basket.setDepth(4)

    return basket
  }

  createHitbox(pos) {
    const hitbox = this.physics.add.sprite(pos.x, pos.y);
    hitbox.setSize(50,150)
    hitbox.setImmovable(true)
    return hitbox
  }

  triggerEnding() {
    this.finished = true
    this.woolTrigger.delay = 50
    this.add.image(config.width / 2, config.height / 2, "continueText").setDepth(6).setScale(1)
    const btn = this.add.image(config.width - 300, config.height - 200, "continueBtn").setDepth(6).setScale(1).setInteractive()
    btn.on("pointerdown", ()=>{
      this.scene.start("Level2", {config, settings})
      this.music.destroy()
    }, this)
  }
}


class WoolPiece extends Phaser.Physics.Arcade.Sprite {
  constructor (scene) {
    super(scene, 0, 0, "woolPiece")
    this.lifespan = 5000
    this.currentRotation = 0
    this.setScale(1.5)
  }

  preUpdate(time, delta) {
    this.setScale(this.scale + 0.005)
    this.currentRotation += 0.1
    this.setRotation(this.currentRotation)
    super.preUpdate(time, delta);
    this.lifespan -= delta;
    
    if (this.lifespan <= 0) {
      console.log("wool destroyed")
      this.destroy();
    }
  }
}