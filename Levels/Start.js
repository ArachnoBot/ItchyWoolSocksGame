import Phaser from "phaser"
import startImg from "../Assets/Start/start.png"
import startBg from "../Assets/Start/startbackground.png"

let settings;
let config;


export default class Start extends Phaser.Scene {
    constructor() {
        super("Start")
    }

    preload() {
      this.load.image('start', startImg)
      this.load.image('startbg', startBg)
    }

    create(data) {
      config = data.config
      settings = data.settings

      this.add.image(config.width / 2, config.height / 2, "startbg").setDepth(0)
      const start = this.add.image(config.width/2, config.height/2, 'start').setInteractive().setDepth(1)
      start.setScale(0.6).setPosition(1400,800)
      start.on("pointerdown", this.handleStartClick, this)
    }

    update(time, delta) {

    }

    handleStartClick() {
      console.log("start clicked")
      this.scene.start("Level1", {config, settings});
    }
}