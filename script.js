const jellyImg = document.getElementById('jellyfish');
const gravity = 0.5;
let jump = 1;
const platforms = [
  { x: 50, y: 300, width: 200, height: 20 },
  { x: 300, y: 200, width: 150, height: 20 },
  { x: 500, y: 350, width: 200, height: 20 }
];
function checkPlatforms() {
  for (let platform of platforms) {
    // Check if jellyfish is falling onto the platform
    if (
      jelly.y + jelly.image.height >= platform.y && // bottom of jelly >= top of platform
      jelly.y + jelly.image.height <= platform.y + platform.height && // prevent sticking from below
      jelly.x + jelly.image.width > platform.x && // jelly right past left side
      jelly.x < platform.x + platform.width // jelly left before right side
    ) {
      jelly.y = platform.y - jelly.image.height; // place on top
      jelly.velocityY = 0;
      jump = 1; // reset jump
    }
  }
}
function drawPlatforms() {
  platforms.forEach(p => {
    const plat = document.getElementById('platform-' + p.x);
    if (!plat) {
      const div = document.createElement('div');
      div.id = 'platform-' + p.x;
      div.style.position = 'absolute';
      div.style.left = p.x + 'px';
      div.style.top = p.y + 'px';
      div.style.width = p.width + 'px';
      div.style.height = p.height + 'px';
      div.style.backgroundColor = 'brown';
      document.body.appendChild(div);
    }
  });
}
for (let p of platforms) {
  // Check if jellyfish is within horizontal bounds of the platform
  if (jelly.x + jelly.width > p.x && jelly.x < p.x + p.width) {
    // Landing on top of platform
    if (jelly.y + jelly.height >= p.y && jelly.y + jelly.height <= p.y + p.height && jelly.velocityY >= 0) {
      jelly.y = p.y - jelly.height;
      jelly.velocityY = 0;
      jump = 1; // reset jump
    }
    // Hitting the bottom of platform
    if (jelly.y <= p.y + p.height && jelly.y >= p.y && jelly.velocityY < 0) {
      jelly.y = p.y + p.height;
      jelly.velocityY = 0; // stop upward movement
    }
  }
}
const buffer = 2;
if (jelly.y + jelly.height >= p.y - buffer && jelly.y + jelly.height <= p.y + buffer && jelly.velocityY >= 0) { ... }
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

drawPlatforms()


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
  // Horizontal movement acceleration
  if (keys.a) jelly.velocityX -= 0.5;
  if (keys.d) jelly.velocityX += 0.5;
  jelly.velocityX *= 0.9;
  jelly.x += jelly.velocityX;

  // Gravity
  jelly.velocityY += gravity;
  jelly.y += jelly.velocityY;

  // Check collision with platforms
  checkPlatforms();

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
    keys.w = false;
  }

  jelly.image.style.left = jelly.x + 'px';
  jelly.image.style.top = jelly.y + 'px';

  requestAnimationFrame(update);
}

update();
