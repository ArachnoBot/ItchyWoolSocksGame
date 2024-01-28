import Phaser from "phaser"
import retryPath from "../Assets/Level4/uudelleen.png"
import noEndingPath from "../Assets/Level4/noEnding.png"

let settings;
let config;


export default class Level4 extends Phaser.Scene {
    constructor() {
        super("Level4")
    }

    preload() {
      console.log("level 4")
      this.load.image("retry", retryPath)
      this.load.image("bg4", noEndingPath)
    }

    create(data) {
      config = data.config
      settings = data.settings

      this.add.image(config.width / 2, config.height / 2, "bg4").setDepth(0)
      this.retryBtn = this.add.image(config.width/2, config.height - 220, "retry").setDepth(1).setInteractive()

      this.retryBtn.on("pointerdown", ()=>{
        this.scene.start("Start", {config, settings})
      }, this)

    }

    update(time, delta) {

    }
}