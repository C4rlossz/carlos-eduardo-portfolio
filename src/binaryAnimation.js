// Downward flow is independent of the spring offsets used for cursor interaction.
export function createBinaryParticles(width, height) {
  const mobile = width < 620;
  const clusters = mobile ? 4 : 9;
  const lineHeight = mobile ? 32 : 30;
  const spacing = mobile ? 7 : 9;
  const rows = Math.ceil(height / lineHeight) + 4;
  const particles = [];
  for (let column = 0; column < clusters; column++) {
    for (let row = 0; row < rows; row++) {
      for (let digit = 0; digit < 4; digit++) {
        const seed = column * 173 + row * 31 + digit * 7;
        particles.push({
          bit: ((seed * 13 + 5) % 17) % 2 ? '1' : '0',
          homeX: width * (.04 + column * .92 / (clusters - 1)) + digit * spacing,
          y: row * lineHeight - 60 - column * 7,
          speed: 60 + column % 4 * 12,
          alpha: column < clusters / 2 ? .13 : .26,
          offsetX: 0, offsetY: 0, velocityX: 0, velocityY: 0,
          angle: seed * 2.39996
        });
      }
    }
  }
  return particles;
}

export function advanceBinaryParticles(particles, { dt, height, pointer, gentle = false }) {
  const radius = gentle ? 105 : 165;
  const damping = Math.exp(-7.5 * dt);
  let maxDisplacement = 0;
  for (const particle of particles) {
    particle.y += particle.speed * dt * (gentle ? .45 : 1);
    if (particle.y > height + 60) {
      particle.y -= height + 120;
      particle.offsetX = particle.offsetY = particle.velocityX = particle.velocityY = 0;
    }
    let forceX = 0;
    let forceY = 0;
    if (pointer) {
      const dx = particle.homeX + particle.offsetX - pointer.x;
      const dy = particle.y + particle.offsetY - pointer.y;
      const distance = Math.hypot(dx, dy);
      if (distance < radius) {
        const strength = (1 - distance / radius) * (gentle ? 1200 : 2600);
        forceX = (distance > .1 ? dx / distance : Math.cos(particle.angle)) * strength;
        forceY = (distance > .1 ? dy / distance : Math.sin(particle.angle)) * strength;
      }
    }
    particle.velocityX = (particle.velocityX + (forceX - particle.offsetX * 32) * dt) * damping;
    particle.velocityY = (particle.velocityY + (forceY - particle.offsetY * 32) * dt) * damping;
    particle.offsetX += particle.velocityX * dt;
    particle.offsetY += particle.velocityY * dt;
    maxDisplacement = Math.max(maxDisplacement, Math.hypot(particle.offsetX, particle.offsetY));
  }
  return maxDisplacement;
}
