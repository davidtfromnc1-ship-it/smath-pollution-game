const jellyImg = document.getElementById('jellyfish');
const gravity = 0.5;
let jump = 1;
let jelly = {
  x: 100,
  y: 100,
  velocityY: 0,
  velocityX: 0,
  image: jellyImg
};
let keys = {
  a: false,
  d: false,
  w: false
};

// Get platform
const platform = document.getElementById('platform');

document.addEventListener('keydown', function(event) {
if (event.key === 'w' && jump >= 1) {
    jelly.velocityY -= 10;
    jump -= 1;
  }
});
document.addEventListener('keydown', (event) => {
  if (event.key in keys) keys[event.key] = true;
});
document.addEventListener('keyup', (event) => {
  if (event.key in keys) keys[event.key] = false;
});
  
function update() {
  const platTop = platform.offsetTop;
  const platLeft = platform.offsetLeft;
  const platRight = platLeft + platform.offsetWidth;
  // Horizontal movement acceleration
  if (keys.a) jelly.velocityX -= 0.5; // smaller increment for smoothness
  if (keys.d) jelly.velocityX += 0.5;

  // Apply friction
  jelly.velocityX *= 0.9; // stronger friction for better control

  jelly.x += jelly.velocityX;

  // Gravity & vertical movement
  jelly.velocityY += gravity;
  jelly.y += jelly.velocityY;

  // Ground collision
  if (jelly.y > 400) {
    jelly.y = 400;
    jelly.velocityY = 0;
    jump = 1;
  }

  // Jump
  if (keys.w && jump > 0) {
    jelly.velocityY = -10;
    jump -= 1;
    keys.w = false; // prevent holding jump for repeated boosts
  }

  // Update position
  jelly.image.style.left = jelly.x + 'px';
  jelly.image.style.top = jelly.y + 'px';

  requestAnimationFrame(update);
}

update();
