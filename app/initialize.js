
import * as PIXI from 'pixi.js';
import $ from 'jquery';
import World from './world.js';
import Bot from './bot.js';
import Particle from './particle.js';
import Utils from './utils.js';

let worldWidth = 1024;
let worldHeight = 512;
let numParticles = 1000;
let moveForward = 30;
let rotate = 0.1;
let numLandmarks = 5;


document.addEventListener('DOMContentLoaded', () => {
  let world = new World(worldWidth, worldHeight, numLandmarks);
  let app = world.app;

  let bot = new Bot(world);

  let particles = [];

  for (let i=0; i<numParticles; i++) {
    particles.push(new Particle(world));
  }

  let step = () => {
    bot.move(rotate, moveForward);
    let measurement = bot.sense();
    for (let particle of particles) {
      particle.move(rotate, moveForward);
    }
    let w = [];
    for (let i of particles.keys()) {
      let particle = particles[i];
      w[i]  = particle.measurementProbability(measurement);
    }
    let sum = w.reduce((a, b) => a + b, 0);
    for (let i of w.keys()) {
      w[i] /= sum;
      particles[i].weight = w[i];
    }
    for (let particle of particles) {
      world.app.stage.removeChild(particle.sprite);
    }
    particles = Utils.sample(world, particles, w, w.length);
  };

  $('#step').click(step);

  $(document).keydown(function(e) {
    if (e.keyCode > 36 && e.keyCode < 40) {
      step();
    }
  });
});

