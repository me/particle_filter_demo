import gaussian from 'gaussian';

class Particle {
  constructor(world, x=world.randX(), y=world.randY(), rot=world.randRot(), img='img/red.png') {
    this.img = img;
    var sprite = PIXI.Sprite.fromImage(img);
    this.world = world;
    sprite.anchor.set(0.5);
    sprite.width = 20;
    sprite.height = 30;
    sprite.x = x;
    sprite.y = y;
    this.sprite = sprite;
    this.rotation = rot;
    this.weight = 0.5;
    world.app.stage.addChild(sprite);

    this.forwardNoise = 50.0;
    this.turnNoise = 0.1;
    this.senseNoise = 50.0;
    this.vision = 200;
  }

  get x() {
    return this.sprite.x;
  }

  get y() {
    return this.sprite.y;
  }

  set x(v) {
    this.sprite.x = v;
  }

  set y(v) {
    this.sprite.y = v;
  }

  get rotation() {
    return this.rot;
  }

  set rotation(v) {
    this.rot = v;
    this.sprite.rotation = v + Math.PI/2;
  }

  set weight(v) {
    this.weightVal = v;
    this.sprite.alpha = 0.5;
  }

  get weight() {
    return this.weightVal;
  }

  reposition(x, y) {
    this.sprite.x = x;
    this.sprite.y = y;
  }

  rotateTo(rad) {
    this.sprite.rotation = rad;
  }

  distance(x, y) {
    return Math.sqrt(Math.pow((this.x - x), 2) + Math.pow((this.y - y), 2));
  }

  sense() {
    var seen = [];
    for (let i of this.world.landmarks.keys()) {
      let landmark = this.world.landmarks[i];
      let dist = this.distance(landmark[0], landmark[1]);
      if (dist < this.vision) {
        seen[i] =  dist + this.noise(this.senseNoise);
      } else {
        seen[i] = null;
      }
    }
    return seen;
  }

  measurementProbability(measurement) {
    var prob = 1.0;
    for (let i of this.world.landmarks.keys()) {
      let landmark = this.world.landmarks[i];
      let dist = this.distance(landmark[0], landmark[1]);
      let p;
      if (dist < this.vision && measurement[i]) {
        p = this.gaussian(dist, this.senseNoise, measurement[i]);
      } else if (dist < this.vision) {
        // dist < vision but no measurement
        p = this.gaussian(dist, this.senseNoise, this.vision*1.5);
      } else if (measurement[i]) {
        // dist > vision and a measurement
        p = 0;
      } else {
        p = 1;
      }
      //console.log(`Dist: ${dist}, ${measurement[i]}, ${p}`)
      prob *= p;
    }
    return prob;
  }

  move(turn, forward) {
    var rotation = this.rotation + turn;
    rotation += this.noise(this.turnNoise);
    let circ = 2*Math.PI;
    rotation = ((rotation%circ)+circ)%circ;

    var dist = forward;
    dist += this.noise(this.forwardNoise);
    var x = this.x + (Math.cos(this.rotation)*dist);
    var y = this.y + (Math.sin(this.rotation)*dist);

    x = ((x%this.world.width)+this.world.width)%this.world.width;
    y = ((y%this.world.height)+this.world.height)%this.world.height;

    this.x = x;
    this.y = y;
    this.rotation = rotation;
  }

  noise(factor) {
    return gaussian(0.0, factor).ppf(Math.random());
  }

  regenerate() {
    var sprite = PIXI.Sprite.fromImage(this.img);
    sprite.x = sprite.x;
    sprite.anchor.set(0.5);
    sprite.width = this.sprite.width;
    sprite.height = this.sprite.height;
    sprite.x = this.sprite.x;
    sprite.y = this.sprite.y;
    sprite.alpha = this.sprite.alpha;
    sprite.rotation = this.sprite.rotation;
    this.sprite = sprite;
  }

  gaussian(mu, sigma, x) {
    return Math.exp(
      (- Math.pow(mu - x, 2)) / Math.pow(sigma, 2) / 2
    ) / Math.sqrt(2.0 * Math.PI * Math.pow(sigma, 2));

  }

}

export default Particle;
