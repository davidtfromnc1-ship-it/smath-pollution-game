let score = 10
let health = 20

function spawnTrash(){

let trash = document.createElement("img")

trash.src = "assets/trash.png"

trash.className = "trash"

trash.style.left = Math.random()*750 + "px"
trash.style.top = Math.random()*350 + "px"

trash.onclick = function(){

trash.remove()

score++
health += 2

document.getElementById("score").innerText =
"Trash Removed: " + score

updateHealth()

spawnFish()

}

document.getElementById("ocean").appendChild(trash)

}
function updateHealth(){

if(health > 100){
health = 100
}

document.getElementById("healthBar").style.width =
health + "%"

}
function spawnFish(){

if(health > 50){

let fish = document.createElement("img")

fish.src = "assets/fish.png"

fish.style.width = "60px"
fish.style.position = "absolute"

fish.style.left = Math.random()*750 + "px"
fish.style.top = Math.random()*350 + "px"

document.getElementById("ocean").appendChild(fish)

}

}
setInterval(function(){

spawnTrash()

},2000)
if(score == 10){
alert("Lore Unlocked: The Plastic Tide - In 2050 there may be more plastic than fish.")
}
