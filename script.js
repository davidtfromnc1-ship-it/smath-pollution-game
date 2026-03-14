const box = document.getElementById('box');
let boxX = 100;
let boxY = 100;

document.addEventListener('keydown', function(event) {
  if (event.key === 'a') {
    boxX -= 10;
  } else if (event.key === 'd') {
    boxX += 10;
  } else if (event.key === 'w') {
    boxY -= 10;
  } else if (event.key === 's') {
    boxY += 10;
  }
  box.style.left = boxX + 'px';
  box.style.top = boxY +'px';
});
