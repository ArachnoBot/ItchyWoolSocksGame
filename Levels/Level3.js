import Phaser from "phaser"
import noBtnPath from "../Assets/Level3/en.png"
import yesBtnPath from "../Assets/Level3/joo.png"
import finalPath from "../Assets/Level3/finalLevel.png"

let settings;
let config;


export default class Level3 extends Phaser.Scene {
    constructor() {
        super("Level3")
    }

    preload() {
      this.load.image("noBtn", noBtnPath)
      this.load.image("yesBtn", yesBtnPath)
      this.load.image("bg3", finalPath)
    }

    create(data) {
      config = data.config
      settings = data.settings

      this.add.image(config.width / 2, config.height / 2, "bg3").setDepth(0)
      this.noBtn = this.add.image(config.width-720, config.height - 220, "noBtn").setDepth(1).setInteractive()
      this.yesBtn = this.add.image(config.width-280, config.height - 220, "yesBtn").setDepth(1).setInteractive()

      this.noBtn.on("pointerdown", ()=>{
        this.scene.start("Level4", {config, settings})
      }, this)

      this.yesBtn.on("pointerdown", ()=>{
        this.scene.start("Level5", {config, settings})
      }, this)
    }

    update(time, delta) {

    }
}