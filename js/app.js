var gemPosX = [0, 100, 200, 300, 400];
var gemPosY = [60, 140, 220];
var gemImages = ['images/Gem-Orange.png', 'images/Gem-Blue.png', 'images/Gem-Green.png'];
var myAudio;

window.onload = function() {
    myAudio = new Audio('audio/bgmusic.mp3');
    myAudio.loop = true;
    myAudio.play();
}
// Enemies our player must avoid.
var Enemy = function(x,y) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.x = x;
    this.y = y;
    this.speed = Math.floor((Math.random()*300)+250);
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += this.speed * dt;

    // Reset position of enemy to move across the canvas again.
    if (this.x > 505) {
       this.x = -100;
       this.speed = Math.floor((Math.random()*300)+250);
   }

   // Detect collision and reset player position.
   if (player.x <= this.x + 80 && player.x >= this.x - 50 && player.y <= this.y + 50 && player.y >= this.y - 50) {
     myAudio = new Audio('audio/enemybite.mp3');
     myAudio.play();
     player.x = 200;
     player.y = 380;
     life.decrease();
     life.drawLife();
   }
};

// Draw the enemy on the screen, required method for game.
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(x, y) {
    this.x = x;
    this.y = y;
    this.sprite = 'images/char-boy.png';
};

// Update the player's position.
// Prevent player from moving beyond canvas.
Player.prototype.update = function() {
    if (this.y > 380) {
        this.y = 380;
    } else if (this.x > 400) {
        this.x = 400;
    } else if (this.x < 0) {
        this.x = 0;
    } else if (this.y < 0) {
        this.x = 200;
        this.y = 380;
    }
};

// Renders the player on the screen.
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Move the player on keypress.
Player.prototype.handleInput = function(key) {
    switch (key) {
        case 'left':
            this.x -= 100;
            break;
        case 'up':
            this.y -= 80;
            break;
        case 'right':
            this.x += 100;
            break;
        case 'down':
            this.y += 80;
            break;
    }
};

// A player should try to collect gems.
// Gems appear on the map randomly.
var Gem = function() {
  this.sprite = gemImages[Math.floor(Math.random() * 3)];
  this.x = gemPosX[Math.floor(Math.random() * 5)];
  this.y = gemPosY[Math.floor(Math.random() * 3)];
};

// Updates the gem's position.
// Gem's position will reset whenever player touches it.
Gem.prototype.update = function() {
  if (player.x === this.x && player.y === this.y) {
    gameScore.score++;
    gameScore.drawScore();
    myAudio = new Audio('audio/gemcollect.wav');
    myAudio.play();
    this.sprite = gemImages[Math.floor(Math.random() * 3)];
    this.x = gemPosX[Math.floor(Math.random() * 5)];
    this.y = gemPosY[Math.floor(Math.random() * 3)];
  }
};

// Renders the gem on the screen.
Gem.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Score shows number of gems player has collected.
var Score = function() {
  this.score = 0;
}

// Draw the score.
Score.prototype.drawScore = function() {
  ctx.font = '30px arial';
  ctx.textAlign = 'left';
  ctx.fillStyle = 'black'
  this.removeScore();
  ctx.fillText('Gems: ' + this.score, 0, 40);
};

// Remove the score.
Score.prototype.removeScore = function() {
  ctx.clearRect(0, 0, 150, 40);
};

// Renders the score on the screen.
Score.prototype.render = function() {
  this.drawScore();
};

// Life of the player.
var Life = function() {
  this.sprite = 'images/Heart.png';
  this.life = 5;
};

// Remove lives.
Life.prototype.removeLife = function() {
  ctx.clearRect(335, 0, 175, 50);
}

// Draw lives.
Life.prototype.drawLife = function() {
  this.removeLife();
  var x = 475;
  for (var i = 0; i < this.life; i++) {
    ctx.drawImage(Resources.get(this.sprite), x, 5, 30, 50);
    x = x - 35;
  }
};

// Renders the lives on the screen.
Life.prototype.render = function() {
  this.drawLife();
  if (this.life === 0) {
    ctx.drawImage(Resources.get('images/game-over.png'), 0, 50);
    ctx.font = '35px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText("You've collected "+gameScore.score+" gems", 65, 400);
  }
};

// Decrease the number of lives.
Life.prototype.decrease = function() {
  if (this.life > 0) {
    this.life = this.life - 1;
  }
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [];
var gem = new Gem();
var life = new Life();
var gameScore = new Score();
var enemySpawnPosition = [60, 140, 220];
var player = new Player(200, 380);
var enemy;


// Create a enemy for each spawn position
enemySpawnPosition.forEach(function(pos) {
    enemy = new Enemy(0,pos);
    allEnemies.push(enemy);
});


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    myAudio = new Audio('audio/playerjump.wav');
    myAudio.play();
    player.handleInput(allowedKeys[e.keyCode]);
});
