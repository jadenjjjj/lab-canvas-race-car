const myCanvs =  document.querySelector('canvas');
const ctx = myCanvs.getContext("2d");
myCanvs.style.border = "2px solid black";

const bgImage = new Image();
bgImage.src = "./images/road.png";

const carImg = new Image();
carImg.src = "./images/car.png";


class Component {
  constructor(x,y,width,height,speed) {
    this.x = x;
    this.y = y;
    this.height = height;
    this.width = width;
    this.speed = speed;
  }

  left() {
    return this.x;
  }
  
  right() {
    return this.x + this.width;
  }

  top() {
    return this.y;
  }

  bottom() {
    return this.y + this.height;
  }

  isCrashedWith(obstacel) {
    const condition = !(
      this.bottom() < obstacel.top() ||
      this.top() > obstacel.bottom() ||
      this.right() < obstacel.left() ||
      this.left() > obstacel.right()
    )
    return condition;
  }
}

class Obstacel extends Component {
  move() {
    this.y += this.speed;
  }

  draw() {
    ctx.fillStyle = "red";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

class Game {
  constructor(background, player) {
    this.background = background;
    this.player = player;
    this.animateId;
    this.frames = 0;
    this.score = 0;
    this.obstaceles = []
  }

  updateGame = () => {
    ctx.clearRect(0,0,myCanvs.width,myCanvs.height);

    this.background.move();
    this.background.draw();

    this.player.move();
    this.player.draw();

    this.updateObstacles();

    this.updateScore(this.score);

    this.animateId = requestAnimationFrame(this.updateGame);

    this.checkGameOver();
  };

  updateObstacles = () => {
    this.frames++;

    if (this.frames % 30 === 0) {
      this.score++;
    }

    this.obstaceles.map((obstacel) => {
      obstacel.move();
      obstacel.draw();
    });

    if (this.frames % 90 === 0) {
      let y = 0;

      let minWidth = 100;
      let maxWidth = 200;
      let width = Math.floor(
        Math.random() * (maxWidth - minWidth + 1) + minWidth
      );

      let minX =  40;
      let maxX = myCanvs.width - 40 - width;
      let x = Math.floor(Math.random() * (maxX - minX + 1) + minX);

      const obstacel = new Obstacel(x, y, width, 20, 3);

      this.obstaceles.push(obstacel);
    }
  };

  checkGameOver = () => {
    const crashed = this.obstaceles.some((obstacel) => {
      return this.player.isCrashedWith(obstacel);
    });
  };

  updateScore = (score) => {
    ctx.font = "20px Arial";
    ctx.fillStyle = "white";

    ctx.fillText(`Score ${this.score}`, 70, 20);
  }
}

class Background {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height; 
    this.speed = 3;
  }

  move() {
    this.y += this.speed;

    if (this.y >= myCanvs.height) {
      this.y = 0;
    }
  }

  draw() {
    ctx.drawImage(bgImage, this.x, this.y, myCanvs.width, myCanvs.height);

    if (this.speed >= 0) {
      ctx.drawImage(
        bgImage,
        this.x,
        this.y - myCanvs.height,//?
        this.width,
        this.height,
      );
    }
  }
}

class Player extends Component {
  move() {
    this.x += this.speed;

    if (this.x <= 40) {
      this.x = 40;
    }

    if (this.x >= myCanvs.width - 100) {
      this.x = myCanvs.width - 100;
    }
  }

  draw() {
    ctx.drawImage(carImg, this.x, this.y, this.width, this.height);
  }
}

window.onload = () => {
  document.getElementById('start-button').onclick = () => {
    startGame();
  };

  function startGame() {
    const game = new Game (
      new Background(0, 0, myCanvs.width, myCanvs.height),
      new Player(myCanvs.width / 2 - 25, myCanvs.height -150, 50, 100, 0)
    );
    

    game.updateGame();

    document.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") {
        game.player.speed = -4;
      }

      if (event.key === "ArrowRight") {
        game.player.speed = 4;
      }
    });

    document.addEventListener("keyup", () => {
      game.player.speed = 0;
    });
  }
};
