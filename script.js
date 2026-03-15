const jellyImg = document.getElementById('jellyfish');
const jellyAtk = "assets/attack.gif";
const gravity = 0.5;
let jump = 0;
let bossHealth = 100;
let score2 = 50;
let atkcooldown = 1;
let leftatk = 0;
let room = 1;
let action =0;
let canmove = 0;
let trashCollected = 0;
let damageCooldown = 0; 

const platforms = [
  { x: 0, y: 0, width: 100, height: 1800 },
  { x: 1200, y: 0, width: 100, height: 150 },
  { x: 1200, y: 300, width: 100, height: 1000 },
  { x: 0, y: 600, width: 1200, height: 100 },
  { x: 1000, y: 600, width: 400, height: 100 },
  { x: 1, y: 0, width: 1200, height: 100 },
  { x: 0, y: 1200, width: 1050, height: 100 },
  { x: 1150, y: 1200, width: 150, height: 100 },
  { x: 100, y: 100, width: 500, height: 400 },
  { x: 1000, y: 500, width:100, height: 100 },
  { x: 800, y: 400, width: 100, height: 80 },
  { x: 1050, y: 300, width: 80, height: 50 },
  { x: 1200, y: 400, width: 150, height: 1000 },
  { x: 1300, y: 500, width: 150, height: 850 },
  { x: 1400, y: 600, width: 150, height: 600 },
  { x: 0, y: 1800, width: 2000, height: 200 },
  { x: 400, y: 1500, width: 800, height: 100 },
  { x: 600, y: 1400, width: 700, height: 110 },
  { x: 90, y: 1700, width: 300, height: 110 },
  { x: 130, y: 1600, width: 150, height: 110 },
  { x: 1800, y: 0, width: 100, height: 2000 },
];

let jelly = {
  x: 200,
  y: 550,
  velocityX: 0,
  velocityY: 0,
  width: 50,  
  height: 50, 
  image: jellyImg,
  hitbox: {  
    offsetX: 10,
    offsetY: 5,
    width: 30,
    height: 40
  }
};
const trashB = document.getElementById('trashboss');
const trashjump = "assets/nobackgroundleap.gif";
const trashwalk = "assets/nobackgroundwalk.gif";
let trashBoss = {
  x: 200,
  y: 850,
  velocityY: 0,
  velocityX: 0,
  width: 300,
  height: 250,
  image: trashB,
  hitbox: {
    offsetX: 150,
    offsetY: 0,
    width: 150,
    height: 200
  }
};



//Hitboxs
function drawHitbox(entity, color = 'red') {
    if (!entity.hitboxDiv) {
        const div = document.createElement('div');
        div.style.position = 'absolute';
        div.style.border = `2px dashed ${color}`;
        div.style.backgroundColor = 'rgba(255,0,0,0.1)';
        div.style.pointerEvents = 'none';
        document.body.appendChild(div);
        entity.hitboxDiv = div;
    }

    div = entity.hitboxDiv;
    div.style.left = (entity.x + entity.hitbox.offsetX) + 'px';
    div.style.top = (entity.y + entity.hitbox.offsetY) + 'px';
    div.style.width = entity.hitbox.width + 'px';
    div.style.height = entity.hitbox.height + 'px';
}


let facingLeft = false;
let keys = { a: false, d: false, w: false };


const trashTypes = [
  "assets/6-ring.png",
  "assets/bottle.png",
  "assets/plastic.png",
  "assets/cap.png"
];

let trashItems = [];  

function checkPlatforms(entity) {
  for (let platform of platforms) {
    const left = entity.x + entity.hitbox.offsetX;
    const top = entity.y + entity.hitbox.offsetY;
    const right = left + entity.hitbox.width;
    const bottom = top + entity.hitbox.height;

    const platformRight = platform.x + platform.width;
    const platformBottom = platform.y + platform.height;

    // Check if hitbox overlaps the platform
    if (right > platform.x &&
        left < platformRight &&
        bottom > platform.y &&
        top < platformBottom) {

      // Falling (down)
      if (entity.velocityY > 0 && bottom - entity.velocityY <= platform.y) {
        entity.y = platform.y - entity.hitbox.height - entity.hitbox.offsetY;
        entity.velocityY = 0;
        if (entity === jelly) jump = 1;

      // Rising (up)
      } else if (entity.velocityY < 0 && top - entity.velocityY >= platformBottom) {
        entity.y = platformBottom - entity.hitbox.offsetY;
        entity.velocityY = 0;

      // Moving right
      } else if (entity.velocityX > 0 && right - entity.velocityX <= platform.x) {
        entity.x = platform.x - entity.hitbox.width - entity.hitbox.offsetX;
        entity.velocityX = 0;

      // Moving left
      } else if (entity.velocityX < 0 && left - entity.velocityX >= platformRight) {
        entity.x = platformRight - entity.hitbox.offsetX;
        entity.velocityX = 0;
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
    width: 50,
    height: 50,
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

    if (touching) {
      if (attacking) {
        trash.element.remove();

        score2 += 1; // heal
        if (score2 > 100) score2 = 100;

        trashCollected += 1; // track trash collected

        document.getElementById('score2').innerText = "Jelly Health: " + score2;
        document.getElementById('trashCount').innerText = "Trash: " + trashCollected;

        return false;
      } else {
        if (damageCooldown <= 0) {
          score2 -= 1;
          if (score2 < 0) score2 = 0;

          document.getElementById('score2').innerText = "Jelly Health: " + score2;

          damageCooldown = 1000;
        }
      }
    }

    if (trash.y > 1250) {
      trash.element.remove();
      return false;
    }

    return true;

    if (trash.y > 1250) {
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


  const jellyRight = jelly.x + jelly.width;
  const jellyBottom = jelly.y + jelly.height;
  const bossRight = trashBoss.x + trashBoss.width;
  const bossBottom = trashBoss.y + trashBoss.height;

  const hittingBoss =
      jellyRight > trashBoss.x &&
      jelly.x < bossRight &&
      jellyBottom > trashBoss.y &&
      jelly.y < bossBottom;

  if (hittingBoss) {
      bossHealth -= 10; 
      if (bossHealth < 0) bossHealth = 0;
      document.getElementById('score').innerText = "Boss Health: " + bossHealth;
  }

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
  if (keys.a) jelly.velocityX -= 0.55; 
  const jellyRight = jelly.x + jelly.width;
  const jellyBottom = jelly.y + jelly.height;
  const bossRight = trashBoss.x + trashBoss.width;
  const bossBottom = trashBoss.y + trashBoss.height;
  
  const touchingBoss =
      jellyRight > trashBoss.x &&
      jelly.x < bossRight &&
      jellyBottom > trashBoss.y &&
      jelly.y < bossBottom;
  if (damageCooldown > 0) {
    damageCooldown -= 16; 
  }
  if (touchingBoss && damageCooldown <= 0) {
    score2 -= 5;            
    if (score2 < 0) score2 = 0;
    document.getElementById('score2').innerText = "Jelly Health: " + score2;

    damageCooldown = 1000;    
  }
  if (keys.d) jelly.velocityX += 0.55;
  jelly.velocityX *= 0.9;
  jelly.x += jelly.velocityX;

  jelly.velocityY += gravity;
  jelly.y += jelly.velocityY;
  trashBoss.velocityY += gravity;
  trashBoss.y += trashBoss.velocityY;
  trashBoss.x += trashBoss.velocityX;

  if (keys.w && jump > 0 && jelly.velocityY < 4) {
    jelly.velocityY = -11;
    jump -= 1;
    keys.w = false;
  }

  jelly.image.style.left = jelly.x + 'px';
  jelly.image.style.top = jelly.y + 'px';
  trashBoss.image.style.left = trashBoss.x + "px";
  trashBoss.image.style.top = trashBoss.y + "px";

  jelly.image.style.transform = facingLeft ? "scaleX(1)" : "scaleX(-1)";
  checkPlatforms(jelly);
  checkPlatforms(trashBoss);
  checkTrash(false);
  requestAnimationFrame(update);

  if(jelly.x > 100 && jelly.x <1200 && jelly.y >700 && jelly.y <1200){
    room = 2;
  }
  if(room == 1){
    window.scrollTo(0,0);
  } else if (room === 2){
    window.scrollTo(0,600);
    canmove=1;
  }
  


if (action === 0 && canmove === 1) {
    let dist = trashBoss.x - jelly.x;
    let absDist = Math.abs(dist);

    let decision = Math.random();
    if (absDist < 200) { 
        if (decision < 0.01) action = 1; 
        else if (decision < 0.05) action = 2; 
    } else if (absDist < 400) { 
        if (decision < 0.025) action = 1;
        else if (decision < 0.05) action = 2;
    } else { 
        if (decision < 0.05) action = 1;
        else if (decision < 0.01) action = 2;
    }
}

if (action === 1 || action ===2 && trashBoss.velocityY <-2) { 
    const original = trashBoss.image.src;
    trashBoss.image.src = trashjump;
    trashBoss.velocityY = -10;
    if (trashBoss.x < jelly.x-200) trashBoss.velocityX = 20;
    else trashBoss.velocityX = -20;
    setTimeout(() => { trashBoss.image.src = original; action = -1; }, 800);
    setTimeout(() => { trashBoss.image.src = original; action = 0; }, 2000);
} else if (action === 2 && trashBoss.velocityY > -2) { 
    const original = trashBoss.image.src;
    trashBoss.image.src = trashwalk;
    if (trashBoss.x < jelly.x-200) trashBoss.velocityX = 5;
    else trashBoss.velocityX = -5;
    setTimeout(() => { trashBoss.image.src = original; action = 0; }, 800);
} else {
    trashBoss.velocityX = 0;
}






drawHitbox(jelly, 'blue');      
drawHitbox(trashBoss, 'red');
  
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
