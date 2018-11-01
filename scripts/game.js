// logic for the count game

class NumberedBox extends createjs.Container {
  constructor(game, number=0) {
    super();

    this.game = game;
    this.number = number;

    const movieclip = new lib.NumberedBox();
    movieclip.numberText.text = number;

    new createjs.ButtonHelper(movieclip, 0, 1, 2, false, new 
      lib.NumberedBox(), 3);

    this.addChild(movieclip);
    this.setBounds(0,0,50,50);

    // handle click/tap
    this.on('click', this.handleClick.bind(this));
  }

  handleClick() {
    this.game.handleClick(this);
  }
}

// Class to control the game date
class GameData {
  constructor() {
    this.amountOfbox = 3;
    this.resetDate();
  }

  resetDate() {
    this.currentNumber = 1;
  }

  nextNumber() {
    this.currentNumber += 1;
  }

  isRightNumber(number) {
    return (number === this.currentNumber);
  }

  isGameWin() {
    return (this.currentNumber > this.amountOfbox);
  }
}

class Game{
  constructor() {
    console.log(`Welcome to the game, version ${this.version()}`);

    this.canvas = document.querySelector('#game-canvas');
    this.stage = new createjs.Stage(this.canvas);

    this.stage.width = this.canvas.width;
    this.stage.height = this.canvas.height;

    this.stage.enableMouseOver();

    //enable tap on touch device
    createjs.Touch.enable(this.stage);

    // Enable retina screen
    this.retinalize();

    // game related initialization
    this.gameData = new GameData();

    window.debugStage = this.stage;
    
    createjs.Ticker.setFPS(60);

    // keep re-drwaing the stage
    createjs.Ticker.on('tick', this.stage);

    // background
    this.stage.addChild(new lib.Background());

    this.generateMultipleBoxes(this.gameData.amountOfbox);
  }
  
  version() {
    return '1.0.0';
  }

  generateMultipleBoxes(amount=10) {
    for (let i = amount; i > 0; i--) {
      const movieclip = new NumberedBox(this, i);
      
      this.stage.addChild(movieclip);

      // random position
      movieclip.x = Math.random() * (this.stage.width - 
          movieclip.getBounds().width);
      movieclip.y = Math.random() * (this.stage.width - 
          movieclip.getBounds().height);
    }
  }

  handleClick(numberedBox) {
    if (this.gameData.isRightNumber(numberedBox.number)) {
      this.stage.removeChild(numberedBox);
      this.gameData.nextNumber();
      
      // is game over?
      if (this.gameData.isGameWin()) {
        let gameOverView = new lib.GameOverView();
        this.stage.addChild(gameOverView);
      }
    }
    
  }

  // add retina support
  retinalize() {
    this.stage.width = this.canvas.width;
    this.stage.height = this.canvas.height;

    let ratio = window.devicePixelRatio;
    if (ratio === undefined) return;
    

    this.canvas.setAttribute('width', Math.round( this.stage.width * ratio ));
    this.canvas.setAttribute('height', Math.round( this.stage.height * ratio ));

    this.stage.scaleX = this.stage.scaleY = ratio;

    // Set CSS style
    this.canvas.style.width = this.stage.width + "px";
    this.canvas.style.height = this.stage.height + "px";
  }
}

const game = new Game();