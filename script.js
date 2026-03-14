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

// Get platform
const platform = document.getElementById('platform');

document.addEventListener('keydown', function(event) {
  if (event.key === 'a') {
    jelly.velocityX -= 5;
  } else if (event.key === 'd') {
    jelly.velocityX += 5;
  } else if (event.key === 'w' && jump >= 1) {
    jelly.velocityY -= 10;
    jump -= 1;
  }
});

function update() {
  // Gravity
  jelly.velocityY += gravity;
  jelly.y += jelly.velocityY;

  // Platform collision
  const platTop = platform.offsetTop;
  const platLeft = platform.offsetLeft;
  const platRight = platLeft + platform.offsetWidth;

  if (
    jelly.y + jellyImg.offsetHeight >= platTop &&
    jelly.y + jellyImg.offsetHeight <= platTop + 20 && // small margin for collision
    jelly.x + jellyImg.offsetWidth > platLeft &&
    jelly.x < platRight
  ) {
    jelly.y = platTop - jellyImg.offsetHeight;
    jelly.velocityY = 0;
    jump = 1; // restore jump when landing on platform
  }

  // Floor collision
  if (jelly.y > 400) {
    jelly.y = 400;
    jelly.velocityY = 0;
    jump = 1;
  }

  // Horizontal movement friction
  jelly.velocityX *= 0.95;
  jelly.x += jelly.velocityX;

  // Update position
  jelly.image.style.left = jelly.x + 'px';
  jelly.image.style.top = jelly.y + 'px';

  requestAnimationFrame(update);
}

update();
