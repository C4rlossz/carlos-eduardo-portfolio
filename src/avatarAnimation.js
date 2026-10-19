const TAU = Math.PI * 2;
  export const duration = 4;

  export function createAvatarAnimation(image, createCanvas) {
    const width = 1254;
    const height = 1254;
    const plate = createCanvas(width, height);
    const plateContext = plate.getContext('2d');
    plateContext.drawImage(image, 0, 0, width, height);

    const region = { x: 637, y: 463, width: 159, height: 93 };
    const hand = createCanvas(region.width, region.height);
    const handContext = hand.getContext('2d');
    handContext.drawImage(plate, region.x, region.y, region.width, region.height,
      0, 0, region.width, region.height);
    const original = handContext.getImageData(0, 0, region.width, region.height);
    const pixels = handContext.createImageData(region.width, region.height);
    const fields = [];
    const controls = [
      { x: 666, y: 529, rx: 17, ry: 19 },
      { x: 691, y: 531, rx: 18, ry: 18 },
      { x: 681, y: 505, rx: 29, ry: 24 },
      { x: 735, y: 511, rx: 34, ry: 24 },
    ];
    for (let y = 0; y < region.height; y++) {
      for (let x = 0; x < region.width; x++) {
        const gx = x + region.x;
        const gy = y + region.y;
        const boundary = Math.min(1, x / 8, y / 8,
          (region.width - 1 - x) / 8, (region.height - 1 - y) / 8);
        const screenBoundary = Math.min(1, Math.max(0, (gx - 653) / 9));
        const keyboardBoundary = Math.min(1, Math.max(0, (544 - gy) / 8));
        fields.push(controls.map(p => Math.exp(-2 * (
          ((gx - p.x) / p.rx) ** 2 + ((gy - p.y) / p.ry) ** 2
        )) * Math.max(0, boundary) * screenBoundary * keyboardBoundary));
      }
    }

    function updateHand(t) {
      const rhythm = 0.8 + 0.2 * Math.cos(TAU * t / duration);
      const a = (1 - Math.cos(TAU * 2.5 * t)) * 0.5 * rhythm;
      const b = (1 - Math.cos(TAU * 4 * t)) * 0.5 * rhythm;
      const c = (1 - Math.cos(TAU * t)) * 0.5;
      const shifts = [-15 * a, -13 * b, -3.4 * a - 2.4 * b, -4.5 * c];
      const source = original.data;
      const output = pixels.data;
      for (let y = 0; y < region.height; y++) {
        for (let x = 0; x < region.width; x++) {
          const weights = fields[y * region.width + x];
          const dy = weights.reduce((sum, w, i) => sum + w * shifts[i], 0);
          const dx = weights[0] * 2.1 * a - weights[1] * 1.4 * b;
          const sx = Math.max(0, Math.min(region.width - 1.001, x - dx));
          const sy = Math.max(0, Math.min(region.height - 1.001, y - dy));
          const x0 = Math.floor(sx), y0 = Math.floor(sy);
          const fx = sx - x0, fy = sy - y0;
          const i0 = (y0 * region.width + x0) * 4;
          const i1 = i0 + 4;
          const i2 = i0 + region.width * 4;
          const i3 = i2 + 4;
          const dest = (y * region.width + x) * 4;
          for (let channel = 0; channel < 4; channel++) {
            output[dest + channel] =
              source[i0 + channel] * (1 - fx) * (1 - fy) +
              source[i1 + channel] * fx * (1 - fy) +
              source[i2 + channel] * (1 - fx) * fy +
              source[i3 + channel] * fx * fy;
          }
        }
      }
      handContext.putImageData(pixels, 0, 0);
    }

    function drawSteam(context, t) {
      context.save();
      context.beginPath();
      context.rect(834, 386, 108, 117);
      context.clip();
      context.filter = 'blur(2.4px)';
      context.lineCap = 'round';
      for (let i = 0; i < 5; i++) {
        const p = ((t / duration + i / 5) % 1 + 1) % 1;
        const drift = Math.sin(TAU * p + i) * 7;
        const x = 879 + drift + Math.sin(i * 3) * 5;
        const y = 505 - p * 97;
        const length = 20 + p * 27;
        context.globalAlpha = Math.sin(Math.PI * p) ** 1.3 * 0.28;
        context.strokeStyle = '#e8eee6';
        context.lineWidth = 3.5 + p * 3.5;
        context.beginPath();
        context.moveTo(x + 1, y + length * 0.4);
        context.bezierCurveTo(x - 8, y + 5, x + 11, y - 8, x + 4, y - length * 0.6);
        context.stroke();
      }
      context.restore();
    }

    function render(canvas, time) {
      const t = ((time % duration) + duration) % duration;
      updateHand(t);
      const context = canvas.getContext('2d');
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.save();
      context.scale(canvas.width / width, canvas.height / height);
      context.drawImage(plate, 0, 0);
      context.clearRect(region.x, region.y, region.width, region.height);
      context.drawImage(hand, region.x, region.y);
      drawSteam(context, t);
      context.restore();
    }
    return { render, duration };
  }
