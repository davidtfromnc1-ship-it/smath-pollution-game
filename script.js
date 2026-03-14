const jellyImg = document.getElementById('jellyfish');
const gravity = 0.5;
let jelly = {
  x: 100,
  y: 100,
  velocityY: 0,
  image: jellyImg
}

document.addEventListener('keydown', function(event) {
  if (event.key === 'a') {
    jelly.x -= 10;
  } else if (event.key === 'd') {
    jelly.x += 10;
  } else if (event.key === 'w') {
    jelly.velocityY -= 10;
  }
  jelly.image.style.left = jelly.x + 'px';
  jelly.image.style.top = jelly.y +'px';
});
function update() {
  jelly.velocityY += gravity;
  jelly.y += jelly.velocityY;
  if (jelly.y > 400) {
    jelly.y = 400;
    jelly.velocityY = 0;
  }
  jelly.image.style.left = jelly.x + 'px';
  jelly.image.style.top = jelly.y + 'px';
  requestAnimationFrame(update);
}
update();

