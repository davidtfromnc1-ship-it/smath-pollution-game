const jelly = document.getElementById('box');
let jellyx = 100;
let jellyy = 100;

document.addEventListener('keydown', function(event) {
  if (event.key === 'a') {
    jellyx -= 100;
  } else if (event.key === 'd') {
    jellyx += 100;
  } else if (event.key === 'w') {
    jellyy -= 100;
  } else if (event.key === 's') {
    jellyy += 100;
  }
  jelly.style.left = jellyx + 'px';
  jelly.style.top = jellyy +'px';
});
