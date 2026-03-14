const jelly = document.getElementById('box');
let jellyx = 100;
let jellyy = 100;

document.addEventListener('keydown', function(event) {
  if (event.key === 'a') {
    jellyx -= 10;
  } else if (event.key === 'd') {
    jellyx += 10;
  } else if (event.key === 'w') {
    jellyy -= 10;
  } else if (event.key === 's') {
    jellyy += 10;
  }
  jelly.style.left = jellyx + 'px';
  jelly.style.top = jellyy +'px';
});
