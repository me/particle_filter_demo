
import * as PIXI from 'pixi.js';
import $ from 'jquery';
import World from './world.js';
import Bot from './bot.js';
import Particle from './particle.js';


document.addEventListener('DOMContentLoaded', () => {
  let world = new World(1024, 512);
  let app = world.app;

  let bot = new Bot(world);

  let particles = [];

  for (let i=0; i<1000; i++) {
    particles.push(new Particle(world));
  }

  let forward = 30;
  let rotate = 0.1;

  let step = () => {
    bot.move(rotate, forward);
    let measurement = bot.sense();
    for (let particle of particles) {
      particle.move(rotate, forward);
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
    let newParticles = [];
    var index = Math.floor(Math.random() * w.length);
    let beta = 0.0;
    let mw = Math.max(...w);
    for (let i of w.keys()) {
      beta += Math.random() * 2.0 * mw;
      while (beta > w[index]) {
        beta -= w[index];
        index =  (((index+1)%w.length)+w.length)%w.length;
      }
      let p = particles[index];
      let n = new Particle(world, p.x, p.y, p.rotation);
      newParticles.push(n);
    }

    particles = newParticles;
  };

  $('#step').click(step);

  $(document).keydown(function(e) {
    if (e.keyCode != 39) {
      return;
    }
    step();
  });


});

