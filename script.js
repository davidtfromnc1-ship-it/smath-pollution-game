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
  if (event.key === 'a') {
    jelly.velocityX -= 0.5;
  } else if (event.key === 'd') {
    jelly.velocityX += 0.5;
  } else if (event.key === 'w') {
    jelly.velocityY -= 10;
  }
  jelly.image.style.left = jelly.x + 'px';
  jelly.image.style.top = jelly.y +'px';
});
function update() {
  //Gravity
  jelly.velocityY += gravity;
  jelly.y += jelly.velocityY;
  if (jelly.y > 400) {
    jelly.y = 400;
    jelly.velocityY = 0;
  }
  //Horizontal Movement
  jelly.velocityX = jelly.velocityX*0.8;
  jelly.x += jelly.velocityX;
  jelly.image.style.left = jelly.x + 'px';
  jelly.image.style.top = jelly.y + 'px';
  requestAnimationFrame(update);
}
update();

