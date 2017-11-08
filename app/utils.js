import Particle from './particle.js';

let Utils = {
  mod(val, m) {
    return (((val)%m)+m)%m;
  },

  sample(world, particles, w, count) {
    let newParticles = [];
    let index = Math.floor(Math.random() * w.length);
    let beta = 0.0;
    let mw = Math.max(...w);
    for (let i=0; i<count; i++) {
      beta += Math.random() * 2.0 * mw;
      while (beta > w[index]) {
        beta -= w[index];
        index =  Utils.mod(index+1, w.length);
      }
      let p = particles[index];
      let n = new Particle(world, p.x, p.y, p.rotation);
      newParticles.push(n);
    }
    return newParticles;
  }
};

export default Utils;
