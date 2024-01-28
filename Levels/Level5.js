import Phaser from "phaser"
import retryPath from "../Assets/Level4/uudelleen.png"
import socksPath from "../Assets/Level5/socks.png"
import winnerPath from "../Assets/Level5/winner.png"
import yesEnding from "../Assets/Level5/finalFrame.png"
import kutittaaEnding from "../Assets/Level5/kutittaa.png"

let settings;
let config;


export default class Level5 extends Phaser.Scene {
    constructor() {
        super("Level5")
    }

    preload() {
      console.log("level 5")
      this.load.image("retryBtn", retryPath)
      this.load.image("bg5", yesEnding)
      this.load.image("socks", socksPath)
      this.load.image("winner", winnerPath)
      this.load.image("kutittaa", kutittaaEnding)
    }

    create(data) {
      config = data.config
      settings = data.settings
      this.start = false

      this.add.image(config.width / 2, config.height / 2, "bg5").setDepth(0)
      this.socks = this.add.image(-1000,650, "socks").setDepth(2)

      setTimeout(()=> {this.start=true}, 1000)

      setTimeout(()=> {
        this.add.image(200,200, "kutittaa").setDepth(3)
      }, 3000)

      setTimeout(()=> {
        this.add.image(config.width/2, config.height/2-100, "winner").setDepth(3)
        this.retryBtn = this.add.image(config.width/2, config.height - 160, "retryBtn").setDepth(3).setInteractive()
        this.retryBtn.on("pointerdown", ()=>{
          this.scene.start("Start", {config, settings})
        }, this)
      },4000)
    }
    
    update(time, delta) {
      console.log(this.socks.x)
      if (this.socks.x < 900 && this.start) {
        this.socks.setPosition(this.socks.x + 50, 650)
      }
    }
}