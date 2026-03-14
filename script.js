const jellyImg = document.getElementById('box');
const gravity = 0.5;
let jelly = {
  x: 100,
  y: 100,
  velocityY: 0,
  image: jellyImg
}


document.addEventListener('keydown', function(event) {
  if (event.key === 'a') {
    jelly.x -= 100;
  } else if (event.key === 'd') {
    jelly.x += 100;
  } else if (event.key === 'w') {
    jelly.y -= 100;
  } else if (event.key === 's') {
    jelly.y += 100;
  }
  jelly.image.style.left = jelly.x + 'px';
  jelly.image.style.top = jelly.y +'px';
});

