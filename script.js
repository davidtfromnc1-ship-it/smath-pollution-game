const jellyImg = document.getElementById('jellyfish');
const gravity = 0.5;
let jump = 0;
let jelly = {
  x: 100,
  y: 100,
  velocityY: 0,
  velocityX: 0,
  width: 50,   // match your HTML image
  height: 50,
  image: jellyImg
};
let keys = {
  a: false,
  d: false,
  w: false
};
const platforms = [
  { x: 50, y: 300, width: 200, height: 20 },
  { x: 300, y: 200, width: 150, height: 20 },
  { x: 500, y: 350, width: 200, height: 20 }
];
function checkPlatforms() {
  for (let platform of platforms) {
    // Horizontal and vertical overlap
    const jellyRight = jelly.x + jelly.width;
    const jellyBottom = jelly.y + jelly.height;
    const platformRight = platform.x + platform.width;
    const platformBottom = platform.y + platform.height;

    // Check if jellyfish is overlapping the platform
    if (jellyRight > platform.x && jelly.x < platformRight &&
        jellyBottom > platform.y && jelly.y < platformBottom) {

      // ---- Top collision (landing on platform) ----
      if (jelly.velocityY > 0 && jellyBottom - jelly.velocityY <= platform.y) {
        jelly.y = platform.y - jelly.height;
        jelly.velocityY = 0;
        jump = 1;
      }
      // ---- Bottom collision (hitting underside of platform) ----
      else if (jelly.velocityY < 0 && jelly.y - jelly.velocityY >= platformBottom) {
        jelly.y = platformBottom;
        jelly.velocityY = 0;
      }
      // ---- Left side collision ----
      else if (jelly.velocityX > 0 && jellyRight - jelly.velocityX <= platform.x) {
        jelly.x = platform.x - jelly.width;
        jelly.velocityX = 0;
      }
      // ---- Right side collision ----
      else if (jelly.velocityX < 0 && jelly.x - jelly.velocityX >= platformRight) {
        jelly.x = platformRight;
        jelly.velocityX = 0;
      }
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
      div.style.backgroundColor = '#2ecc71';
      document.body.appendChild(div);
    }
  });
}


drawPlatforms()

document.addEventListener('keydown', (event) => {
  if (event.key in keys) keys[event.key] = true;
});
document.addEventListener('keyup', (event) => {
  if (event.key in keys) keys[event.key] = false;
});
  
function update() {

  // Horizontal movement acceleration
  if (keys.a) jelly.velocityX -= 0.55;
  if (keys.d) jelly.velocityX += 0.55;
  jelly.velocityX *= 0.9;
  jelly.x += jelly.velocityX;

  // Gravity
  jelly.velocityY += gravity;
  jelly.y += jelly.velocityY;

  // Ground collision
  if (jelly.y > 400) {
    jelly.y = 400;
    jelly.velocityY = 0;
    jump = 1;
  }

  // Jump

  if (keys.w && jump > 0 ) {
    jelly.velocityY = -11;
    jump -= 1;
    keys.w = false;
  }

  jelly.image.style.left = jelly.x + 'px';
  jelly.image.style.top = jelly.y + 'px';
  checkPlatforms()
  requestAnimationFrame(update);
}

update();
