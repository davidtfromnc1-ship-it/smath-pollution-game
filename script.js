const jellyImg = document.getElementById('jellyfish');
const gravity = 0.5;
let jump = 0;
let score = 0;
let jelly = {
  x: 1000,
  y: 550,
  velocityY: 0,
  velocityX: 0,
  width: 50,   // match your HTML image
  height: 50,
  image: jellyImg
};
let facingRight = true; // initial direction


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
  const spawnPlatforms = platforms.filter(p => p.y >= 200 && p.y <= 600); 
  // Only the ground and the 4 levitating platforms

  for (let i = 0; i < 10; i++) {
    const type = trashTypes[Math.floor(Math.random() * trashTypes.length)];
    const p = spawnPlatforms[Math.floor(Math.random() * spawnPlatforms.length)];
    const x = p.x + Math.random() * (p.width - 30); // leave 30px for width
    const y = p.y - 30; // put it on top of the platform

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
      element: img
    });
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
function checkTrash() {
  trashItems = trashItems.filter(trash => {
    const jellyRight = jelly.x + jelly.width;
    const jellyBottom = jelly.y + jelly.height;
    const trashLeft = trash.element.offsetLeft;
    const trashTop = trash.element.offsetTop;
    const trashRight = trashLeft + trash.width;
    const trashBottom = trashTop + trash.height;

    const touching =
      jellyRight > trashLeft &&
      jelly.x < trashRight &&
      jellyBottom > trashTop &&
      jelly.y < trashBottom;

    if (touching) {
      trash.element.remove();
      score++;
      document.getElementById('score').innerText = "Trash Collected: " + score;
      return false;
    }
    return true;
  });
}

function update() {
  if (jelly.velocityX > 0) facingRight = true;
  if (jelly.velocityX < 0) facingRight = false;
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

drawPlatforms();
spawnTrash();

document.addEventListener('keydown', (event) => {
  if (event.key in keys) keys[event.key] = true;
});
document.addEventListener('keyup', (event) => {
  if (event.key in keys) keys[event.key] = false;
});
 jelly.image.style.left = jelly.x + 'px';
jelly.image.style.top = jelly.y + 'px';


update();
