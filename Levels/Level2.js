import Phaser from "phaser"
import ballDownPath from "../Assets/Level2/yarnball_down.png"
import ballLeftPath from "../Assets/Level2/yarnball_left.png"
import ballRightPath from "../Assets/Level2/yarnball_right.png"
import ballUpPath from "../Assets/Level2/yarnball_up.png"
import bgPath from "../Assets/Level2/background.png"
import knitPath from "../Assets/Level2/knitting.png"
import failPath from "../Assets/Level2/fail.png"
import continueTextPath from "../Assets/Level2/continue2.png"
import continueBtnPath from "../Assets/Level2/continueBtn.png"
const musicPath = require("url:../Assets/Level2/FrigidFortress.mp3")

let settings;
let config;

export default class Level2 extends Phaser.Scene {
    constructor() {
        super("Level2")
    }

    preload() {
      this.load.spritesheet("ballDown", ballDownPath, {frameWidth: 181, frameHeight: 335 })
      this.load.spritesheet("ballLeft", ballLeftPath, {frameWidth: 181, frameHeight: 335 })
      this.load.spritesheet("ballRight", ballRightPath, {frameWidth: 181, frameHeight: 335 })
      this.load.spritesheet("ballUp", ballUpPath, {frameWidth: 181, frameHeight: 335 })
      this.load.spritesheet("knitSheet", knitPath, {frameWidth: 781, frameHeight: 629 })
      this.load.image("continueText2", continueTextPath)
      this.load.image("continueBtn", continueBtnPath)
      this.load.image("bg2", bgPath)
      this.load.image("fail", failPath)
      this.load.audio('music', musicPath);
    }

    create(data) {
      config = data.config
      settings = data.settings
      this.barMaxWidth = 800
      this.lastSlot = 0
      this.playTime = 30
      this.finished = false
      this.ballArray = []
      this.pressDelay = 780

      this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
      this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
      this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
      this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);

      this.keyA.on("down", () => {this.handleKeystroke("left")})
      this.keyD.on("down", () => {this.handleKeystroke("right")})
      this.keyW.on("down", () => {this.handleKeystroke("up")})
      this.keyS.on("down", () => {this.handleKeystroke("down")})

      this.music = this.sound.add('music');
      this.music.loop = true;
      this.music.play();

      this.add.image(config.width / 2, config.height / 2, "bg2").setDepth(0)
      this.outlineGraphics = this.add.graphics(2).setDepth(2)
      this.barGraphics = this.add.graphics().setDepth(1)

      this.outlineGraphics.lineStyle(6, 0xaaaaaa)
      this.outlineGraphics.strokeRoundedRect(1050, 40, 800, 80)

      this.createBallAnims()
      this.knitter = this.playKnitAnim()

      this.yarnBalls = this.physics.add.group({
        classType: YarnBall,
        runChildUpdate: true
      })

      this.ballTrigger = this.time.addEvent({
        callback: this.spawnBall,
        callbackScope: this,
        delay: 573,
        loop: true
      })
      this.ballTrigger.paused = true

      // For delaying the start of music
      setTimeout(()=>{this.ballTrigger.paused = false}, 330)

      // Restart if song ends for syncing
      setTimeout(()=>{this.scene.restart()}, 148000)
    }

    update(time, delta) {
      if (this.finished || !this.ballTrigger) {
        return
      }

      if (this.ballTrigger.delay != 573) { 
        this.ballTrigger.delay = 573
        console.log("low diff")
      }
      if (this.playTime >= 30) {
        this.playTime -= 0.2
        
      }
      

      
      if (this.playTime > 800) {
        this.triggerEnding()
        this.barGraphics.fillRoundedRect(1050, 40, this.barMaxWidth, 78)
      } 
      else if (this.playTime <= 800 ) {
        this.barGraphics.clear()
        this.barGraphics.fillStyle("0x34ebdf", 1)
        this.barGraphics.fillRoundedRect(1050, 40, this.playTime, 78)
      }
    }

    handleKeystroke(slot) {
      const ballArray = this.yarnBalls.getChildren()
      if (ballArray.length > 0) {
        const ball = ballArray[0]
        const timing = Math.abs(new Date() - ball.initTime - this.pressDelay)
        console.log(timing, ball.slot)
        if (ball.slot == slot && timing <= settings.maxDelay) {
          this.playTime += Math.round((100-timing)*0.5)
        } else {
          if (this.playTime >= 80) {
            this.playTime -= 50
          }
          this.knitter.anims.pause()
          const fail = this.addFailImg()
          setTimeout(() => {
            fail.destroy()
            this.knitter.anims.resume()
          }, 800)
        }
        ball.destroy()
      }
    }

    createBallAnims () {
      this.anims.create({
        key: "ballLeftAnim",
        frames: this.anims.generateFrameNumbers("ballLeft", {start: 0, end : 1}),
        frameRate: 4,
        repeat: -1
      })
      this.anims.create({
        key: "ballRightAnim",
        frames: this.anims.generateFrameNumbers("ballRight", {start: 0, end : 1}),
        frameRate: 4,
        repeat: -1
      })
      this.anims.create({
        key: "ballDownAnim",
        frames: this.anims.generateFrameNumbers("ballDown", {start: 0, end : 1}),
        frameRate: 4,
        repeat: -1
      })
      this.anims.create({
        key: "ballUpAnim",
        frames: this.anims.generateFrameNumbers("ballUp", {start: 0, end : 1}),
        frameRate: 4,
        repeat: -1
      })
    }

    spawnBall(localSlot) {
      let slot = null
      if (localSlot != null) {
        slot = localSlot
      } else {
        slot = Math.floor(Math.random()*4)
        while (slot == this.lastSlot) {
          slot = Math.round(Math.random()*3)
        }
        this.lastSlot = slot
      }

      let x = 0
      let animStr = ""
      const slots = ["left", "down", "up", "right"]
      if (slot == 0) {
        x = 120
        animStr = "ballLeftAnim"
      }
      else if (slot == 1) {
        x = 370
        animStr = "ballDownAnim"
      }
      else if (slot == 2) {
        x = 615
        animStr = "ballUpAnim"
      }
      else if (slot == 3) {
        x = 860
        animStr = "ballRightAnim"
      }
      let yarnBall = this.yarnBalls.get()
      if (yarnBall) {
        yarnBall.setPosition(x, -140)
        yarnBall.setScale(1)
        yarnBall.body.setVelocity(0, 1200)
        yarnBall.slot = slots[slot]
        yarnBall.anims.play(animStr)
      }
    }

    playKnitAnim() {
      let knitter = this.add.sprite();
      knitter.setOrigin(0,0)
      knitter.setPosition(1100, 200)
      knitter.setDepth(2)
      this.anims.create({
        key: "knitAnim",
        frames: this.anims.generateFrameNumbers("knitSheet", {start: 0, end : 1}),
        frameRate: 4,
        repeat: -1
      })
      knitter.anims.play("knitAnim")
      return knitter
    }

    addFailImg() {
      const img = this.add.image(1150,350,"fail")
      img.setDepth(4)
      img.setScale(0.7)
      img.setRotation(-0.4)
      return img
    }

    delay = (delayInms) => {
      return new Promise(resolve => setTimeout(resolve, delayInms));
    }

    async triggerEnding() {
      this.ballTrigger.destroy()
      this.keyA.destroy()
      this.keyD.destroy()
      this.keyS.destroy()
      this.keyW.destroy()
      this.finished = true
      this.reverse = false
      let slot = 0
      this.add.image(config.width / 2, config.height / 2, "continueText2").setDepth(6).setScale(1)
      const btn = this.add.image(config.width - 300, config.height - 200, "continueBtn").setDepth(6).setScale(1).setInteractive()
      btn.on("pointerdown", ()=>{
        this.scene.start("Level3", {config, settings})
        this.music.destroy()
        this.yarnBalls.clear()
      }, this)
      while(true) {
        await this.delay(100)
        this.spawnBall(slot)
        if (slot > 2) {
          this.reverse = true
        } 
        else if (slot == 0) {
          this.reverse = false
        }
        if (this.reverse) {
          slot -= 1
        } else {
          slot += 1
        }
      }
    }
}


class YarnBall extends Phaser.Physics.Arcade.Sprite {
  constructor (scene) {
    super(scene, 0, 0, "YarnBall")
    this.lifespan = 1100
    this.setScale(1.5)
    this.initTime = new Date()
    this.slot = ""
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);
    this.lifespan -= delta;
    
    if (this.lifespan <= 0) {
      //console.log("ball destroyed")
      this.destroy()
    }
  }
}