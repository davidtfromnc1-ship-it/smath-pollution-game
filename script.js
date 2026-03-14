let pollution = 3;

function clean(trash) {
  trash.remove();
  pollution -= 1;
  document.getElementById('pollution').innerText = pollution;

  if (pollution <= 0) {
    alert("🌟 Great job! The ocean is clean!");
  }
}

function goToLore() {
  window.location.href = 'lore.html';
}