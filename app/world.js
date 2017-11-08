import $ from 'jquery';
import * as PIXI from 'pixi.js';

class World {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.landmarks = [];
    this.app = new PIXI.Application(width, height, { antialias: true, backgroundColor : 0xe1e4e8 });
    $('#map')[0].appendChild(this.view);
    this.landmarks = this.generateLandmarks();
  }

  get view() {
    return this.app.view;
  }

  generateLandmarks() {
    var landmarks = [];
    for (var i=0; i<5; i++) {
      var x = this.randX();
      var y = this.randY();
      landmarks.push([x, y]);
      var graphics = new PIXI.Graphics();
      graphics.lineStyle(0);
      graphics.beginFill(0xFF0000, 1);
      graphics.drawCircle(x, y, 5);
      graphics.endFill();
      this.app.stage.addChild(graphics);
    }
    return landmarks;
  }

  randX() {
    return Math.floor((Math.random() * this.width) + 1);
  }

  randY() {
    return Math.floor((Math.random() * this.height) + 1);
  }

  randRot() {
    return Math.random() * 2 * Math.PI;
  }

}

export default World;
