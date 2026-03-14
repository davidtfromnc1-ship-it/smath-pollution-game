const jellyImg = document.getElementById('jellyfish');
const gravity = 0.5;
let jelly = {
  x: 100,
  y: 100,
  velocityY: 0,
  velocityX: 0,
  image: jellyImg
}

document.addEventListener('keydown', function(event) {
  keys[event.key] = true;
});

document.addEventListener('keyup', function(event) {
  keys[event.key] = false;
});

function update() {

  // Horizontal movement
  if (keys['a']) {
    jelly.velocityX -= 0.5;
  }
  if (keys['d']) {
    jelly.velocityX += 0.5;
  }

  // Jump
  if (keys['w'] && jelly.velocityY === 0) {
    jelly.velocityY = -10;
  }

  // Gravity
  jelly.velocityY += gravity;
  jelly.y += jelly.velocityY;

  if (jelly.y > 400) {
    jelly.y = 400;
    jelly.velocityY = 0;
  }

  // Friction
  jelly.velocityX *= 0.95;
  jelly.x += jelly.velocityX;

  // Draw
  jelly.image.style.left = jelly.x + 'px';
  jelly.image.style.top = jelly.y + 'px';

  requestAnimationFrame(update);
}
update()
