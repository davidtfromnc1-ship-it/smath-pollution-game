const jellyImg = document.getElementById('jellyfish');
const jellyAtk = "assets/attack.gif";
const gravity = 0.5;
let jump = 0;
let score = 0;
let atkcooldown = 1;
let jelly = {
  x: 1000,
  y: 550,
  velocityY: 0,
  velocityX: 0,
  width: 50,   // match your HTML image
  height: 50,
  image: jellyImg
};
let facingRight = false; // initial direction


let keys = {
  a: false,
  d: false,
  w: false
};
const platforms = [
  { x: 0, y: 600, width: 2000, height: 200 },
  { x: 320, y: 500, width: 30, height: 50 },
  { x: 240, y: 400, width: 50, height: 40 },
  { x: 160, y: 300, width: 40, height: 50 },
  { x: 80, y: 200, width: 30, height: 60 },
  { x: 600, y: -400, width: 2000, height: 900 },
  { x: 1200, y: -400, width: 2000, height: 1200 }
];

const trashTypes = [
  "assets/6-ring.png",
  "assets/bottle.png",
  "assets/plastic.png",
  "assets/cap.png"
];

let trashItems = [];

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
function spawnTrash() {
  const type = trashTypes[Math.floor(Math.random() * trashTypes.length)];
  const x = Math.random() * 770; // 800px screen minus 30px width
  const y = -30; // start above the screen

  const img = document.createElement("img");
  img.src = type;
  img.style.position = "absolute";
  img.style.width = "30px";
  img.style.height = "30px";
  img.style.left = x + "px";
  img.style.top = y + "px";
  document.body.appendChild(img);

  trashItems.push({
    x: x,
    y: y,
    width: 30,
    height: 30,
    element: img,
    velocityY: 0
  });
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
function checkTrash() {
  trashItems = trashItems.filter(trash => {
    trash.velocityY += gravity;
    trash.y += trash.velocityY;
    trash.element.style.top = trash.y + "px";

    const jellyRight = jelly.x + jelly.width;
    const jellyBottom = jelly.y + jelly.height;
    const trashRight = trash.x + trash.width;
    const trashBottom = trash.y + trash.height;

    const touching =
      jellyRight > trash.x &&
      jelly.x < trashRight &&
      jellyBottom > trash.y &&
      jelly.y < trashBottom;

    if (touching) {
      trash.element.remove();
      score++;
      document.getElementById('score').innerText = "Trash Collected: " + score;
      return false;
    }

    // remove trash if it falls below the screen
    if (trash.y > 500) {
      trash.element.remove();
      return false;
    }

    return true;
  });
}
function attack() {
  const originalSrc = jelly.image.src;
  const originalWidth = jelly.image.width;
  const originalHeight = jelly.image.height;

  // Set attack sprite
  jelly.image.src = "assets/jelly-attack.gif";
  jelly.image.width = 100;  // make it longer / bigger
  jelly.image.height = 50;

  // Revert after animation (e.g., 300ms)
  setTimeout(() => {
    jelly.image.src = originalSrc;
    jelly.image.width = originalWidth;
    jelly.image.height = originalHeight;
  }, 300);
}
function update() {
  if (jelly.velocityX > 0) facingRight = false;
  if (jelly.velocityX < 0) facingRight = true;
  if (keys.a) jelly.velocityX -= 0.55;
  if (keys.d) jelly.velocityX += 0.55;
  jelly.velocityX *= 0.9;
  jelly.x += jelly.velocityX;

  jelly.velocityY += gravity;
  jelly.y += jelly.velocityY;

  if (keys.w && jump > 0 && jelly.velocityY < 4) {
    jelly.velocityY = -11;
    jump -= 1;
    keys.w = false;
  }

  jelly.image.style.left = jelly.x + 'px';
  jelly.image.style.top = jelly.y + 'px';
// Flip horizontally based on direction
if (facingRight) {
  jelly.image.style.transform = "scaleX(1)";
} else {
  jelly.image.style.transform = "scaleX(-1)";
}
  checkPlatforms();
  checkTrash(); // <- call it here every frame

  requestAnimationFrame(update);
}
spawnTrash();

document.addEventListener('keydown', (event) => {
  if (event.key in keys) keys[event.key] = true;
});
document.addEventListener('keyup', (event) => {
  if (event.key in keys) keys[event.key] = false;
});
document.addEventListener('mousedown', (event) => {
  if (event.button === 0 && atkcooldown == 1) { // 0 = left mouse button
    attack();
  }
});
 jelly.image.style.left = jelly.x + 'px';
jelly.image.style.top = jelly.y + 'px';


drawPlatforms();
update();
