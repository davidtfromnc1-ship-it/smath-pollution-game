const jellyImg = document.getElementById('jellyfish');
const jellyAtk = "assets/attack.gif";
const gravity = 0.5;
let jump = 0;
let score = 0;
let atkcooldown = 1;
let leftatk = 0;
let jelly = {
  x: 1000,
  y: 550,
  velocityY: 0,
  velocityX: 0,
  width: 50,   // match your HTML image
  height: 50,
  image: jellyImg
};
let facingLeft = true; // initial direction


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
  const x = Math.random() * 770;
  const y = -30; // start above screen

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
setInterval(spawnTrash, 3000);

function checkTrash() {
  trashItems = trashItems.filter(trash => {
    trash.velocityY += 0.07; // super slow fall
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

    if (trash.y > 500) { // remove trash if it falls below screen
      trash.element.remove();
      return false;
    }

    return true;
  });
}
function attack() {
  atkcooldown = 0;

  const original = jelly.image.src;

  jelly.image.src = jellyAtk;

  // make attack longer
  jelly.image.style.width = "120px";
  if(facingLeft == true){
    jelly.x -= 50;
    leftatk = 1;
  }

  setTimeout(() => {
    jelly.image.src = original;

    jelly.image.style.width = "50px";
    jelly.width = 50;
    if(leftatk ==1){
    jelly.x +=50;
    leftatk =0;
    }
  }, 360);

  setTimeout(() => {
    atkcooldown = 1;
  }, 500);
}
function update() {
  if (jelly.velocityX > 0) facingLeft = false;
  if (jelly.velocityX < 0) facingLeft = true;
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
if (facingLeft) {
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

 jelly.image.style.left = jelly.x + 'px';
jelly.image.style.top = jelly.y + 'px';



drawPlatforms();
update();

function jellyTalk(text, duration = 2000) {
  let bubble = document.createElement("div");
  bubble.innerText = text;
  
  bubble.style.position = "absolute";
  bubble.style.left = (jelly.x + jelly.width / 2) + "px";
  bubble.style.top = (jelly.y - 30) + "px"; // above jellyfish
  bubble.style.backgroundColor = "rgba(255,255,255,0.9)";
  bubble.style.border = "2px solid #000";
  bubble.style.borderRadius = "10px";
  bubble.style.padding = "5px 10px";
  bubble.style.fontFamily = "Arial, sans-serif";
  bubble.style.fontSize = "14px";
  bubble.style.color = "#000";
  bubble.style.whiteSpace = "nowrap";
  bubble.style.transform = "translateX(-50%)"; // center above jelly
  bubble.style.zIndex = 1000;
  
  document.body.appendChild(bubble);

  // Update bubble position every frame to follow jellyfish
  let followInterval = setInterval(() => {
    bubble.style.left = (jelly.x + jelly.width / 2) + "px";
    bubble.style.top = (jelly.y - 30) + "px";
  }, 16); // ~60fps

  // Remove after duration
  setTimeout(() => {
    clearInterval(followInterval);
    bubble.remove();
  }, duration);
}

// --- Example usage ---
// Make jellyfish say something when player left-clicks
document.addEventListener("mousedown", (event) => {
  if (event.button === 0 && atkcooldown ==1) {
    jellyTalk("Glub glub! Cleaning up!", 2500);
    attack();
  }
});
