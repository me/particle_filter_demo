import Particle from './particle.js';


class Bot extends Particle {
  constructor(world, x=world.randX(), y=world.randY(), rot=world.randRot()) {
    super(world, x, y, rot, 'img/blue.png');
    this.sprite.zOrder = 1000000;
    this.sprite.alpha = 1;
    this.sprite.width = 30;
    this.sprite.height = 45;
  }
}

export default Bot;
