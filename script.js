const jellyImg = document.getElementById('jellyfish');
const jellyAtk = "assets/attack.gif";
const gravity = 0.5;
let jump = 0;
let score = 50;
let atkcooldown = 1;
let leftatk = 0;
let room = 1;
let jelly = {
  x: 200,
  y: 550,
  velocityY: 0,
  velocityX: 0,
  width: 50,
  height: 50,
  image: jellyImg
};
const trashB = document.getElementById('jellyfish');
const trashjump = "assets/attack.gif";
const trashwalk = "assets/attack.gif";
let trashBoss = {
  x: 200,
  y: 550,
  velocityY: 0,
  velocityX: 0,
  width: 50,
  height: 50,
  image: trashB
};



let facingLeft = false;
let keys = { a: false, d: false, w: false };

const platforms = [
  { x: 0, y: 0, width: 100, height: 1400 },
  { x: 1200, y: 0, width: 100, height: 1400 },
  { x: 0, y: 600, width: 800, height: 100 },
  { x: 1000, y: 600, width: 400, height: 100 },
  { x: 1, y: 0, width: 1400, height: 100 },
  { x: 0, y: 1200, width: 1400, height: 100 },
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
    const jellyRight = jelly.x + jelly.width;
    const jellyBottom = jelly.y + jelly.height;
    const platformRight = platform.x + platform.width;
    const platformBottom = platform.y + platform.height;

    if (jellyRight > platform.x && jelly.x < platformRight &&
        jellyBottom > platform.y && jelly.y < platformBottom) {
      if (jelly.velocityY > 0 && jellyBottom - jelly.velocityY <= platform.y) {
        jelly.y = platform.y - jelly.height;
        jelly.velocityY = 0;
        jump = 1;
      } else if (jelly.velocityY < 0 && jelly.y - jelly.velocityY >= platformBottom) {
        jelly.y = platformBottom;
        jelly.velocityY = 0;
      } else if (jelly.velocityX > 0 && jellyRight - jelly.velocityX <= platform.x) {
        jelly.x = platform.x - jelly.width;
        jelly.velocityX = 0;
      } else if (jelly.velocityX < 0 && jelly.x - jelly.velocityX >= platformRight) {
        jelly.x = platformRight;
        jelly.velocityX = 0;
      }
    }
  }
}

function spawnSingleTrash() {
  const type = trashTypes[Math.floor(Math.random() * trashTypes.length)];
  const x = Math.random() * 770;
  const y = 100 +5;

  const img = document.createElement("img");
  img.src = type;
  img.style.position = "absolute";
  img.style.width = "40px";
  img.style.height = "40px";
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

  const nextSpawn = Math.random() * 2500 + 500;
  setTimeout(spawnSingleTrash, nextSpawn);
}

function drawPlatforms() {
  platforms.forEach(p => {
    const id = 'platform-' + p.x + '-' + p.y;
    const plat = document.getElementById(id);

    if (!plat) {
      const div = document.createElement('div');
      div.id = id;
      div.style.position = 'absolute';
      div.style.left = p.x + 'px';
      div.style.top = p.y + 'px';
      div.style.width = p.width + 'px';
      div.style.height = p.height + 'px';
      div.style.backgroundColor = '#080C3D';
      document.body.appendChild(div);
    }
  });
}

function checkTrash(attacking = false) {
  trashItems = trashItems.filter(trash => {
    trash.velocityY += 0.023;
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

    if (touching && attacking) {
      trash.element.remove();
      score += 2;
      document.getElementById('score').innerText = "Trash Collected: " + score;
      return false;
    }

    if (trash.y > 800) {
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
  jelly.image.style.width = "120px";
  if(facingLeft){
    jelly.x -= 50;
    leftatk = 1;
  }
  jellyTalk("Glub glub!", 1500); 
  checkTrash(true); 

  setTimeout(() => {
    jelly.image.src = original;
    jelly.image.style.width = "50px";
    jelly.width = 50;
    if(leftatk == 1){
      jelly.x += 50;
      leftatk = 0;
    }
  }, 360);

  setTimeout(() => { atkcooldown = 1; }, 500);
}

function jellyTalk(text, duration = 2000) {
  let bubble = document.createElement("div");
  bubble.innerText = text;
  bubble.style.position = "absolute";
  bubble.style.left = (jelly.x + jelly.width / 2) + "px";
  bubble.style.top = (jelly.y - 30) + "px";
  bubble.style.backgroundColor = "rgba(255,255,255,0.9)";
  bubble.style.border = "2px solid #000";
  bubble.style.borderRadius = "10px";
  bubble.style.padding = "5px 10px";
  bubble.style.fontFamily = "Arial, sans-serif";
  bubble.style.fontSize = "14px";
  bubble.style.color = "#000";
  bubble.style.whiteSpace = "nowrap";
  bubble.style.transform = "translateX(-50%)";
  bubble.style.zIndex = 1000;
  document.body.appendChild(bubble);

  let followInterval = setInterval(() => {
    bubble.style.left = (jelly.x + jelly.width / 2) + "px";
    bubble.style.top = (jelly.y - 30) + "px";
  }, 16);

  setTimeout(() => {
    clearInterval(followInterval);
    bubble.remove();
  }, duration);
}

function update() {
  if (jelly.velocityX > 0) facingLeft = false;
  if (jelly.velocityX < 0) facingLeft = true;
  if (keys.a) jelly.velocityX -= 3; //Should be 0.55

  if (keys.d) jelly.velocityX += 3; //Should be 0.55
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

  window.scrollTo(
-1000,
-1000
);

  jelly.image.style.transform = facingLeft ? "scaleX(1)" : "scaleX(-1)";
  checkPlatforms();
  checkTrash(false);
  requestAnimationFrame(update);

  if(jelly.x > 800 && jelly.x <1000 && jelly.y >600 && jelly.y <800 && jelly.velocityY >0){
    room = 2;
  }
  if(room == 1){
    window.scrollTo(0,0);
  } else if (room === 2){
    window.scrollTo(0,600);
  }









  
}

drawPlatforms();
spawnSingleTrash();
update();

document.addEventListener('keydown', (event) => { if (event.key in keys) keys[event.key] = true; });
document.addEventListener('keyup', (event) => { if (event.key in keys) keys[event.key] = false; });
document.addEventListener('mousedown', (event) => {
 if (event.button === 0 && atkcooldown === 1) {
    attack();  // attack now calls trash check and glub glub
  }
});
