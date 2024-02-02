class Game {
  static COLORS = ['#ff4500', '#00cc78', '#2450a5', '#fed734', '#f9fafc'];
  static BOARD_SIZE = [25, 25];
  static PIXEL_SIZE = 20;
  static TIME_TO_WAIT = 3000;

  lastPixelAddedDate = Date.now();

  constructor() {
    // 🦁 Initialise un `ColorPicker`
    this.colorPicker = new ColorPicker(Game.COLORS, Game.COLORS[0]);
    this.warning = new Warning();
    this.interval = null;
  }

  init() {
    // 🦁 Récupère le board
    this.board = document.querySelector('#board');
    this.timeLeft = document.querySelector('#time-left');
    // 💡 Définit le style suivant pour que ce soit beau
    this.board.style.gridTemplateColumns = `repeat(${Game.BOARD_SIZE[0]}, ${Game.PIXEL_SIZE}px)`;
    // 🦁 Appelle la méthode this.initPixels()
    this.initPixels();
    this.warning.init();
    // 🦁 Appelle la méthode this.colorPicker.initPixelPicker()
    this.colorPicker.init();
  }

  onPixelClick(pixel) {
    if (
      this.lastPixelAddedDate &&
      new Date() - this.lastPixelAddedDate < Game.TIME_TO_WAIT
    ) {
      console.log("Impossible d'ajouter le pixel, veuillez attendre 5 seconde");
      this.warning.showWarning();
      return;
    }

    pixel.color = this.colorPicker.currentColor;
    this.lastPixelAddedDate = new Date();
    this.toggleTimeLeft();
  }

  toggleTimeLeft() {
    this.toggleTimeLeft.innerText = `${Game.TIME_TO_WAIT / 1000}s`;

    clearInterval(this.interval);

    this.interval = setInterval(() => {
      const now = new Date();
      const diff = now - this.lastPixelAddedDate;
      const secondsToWait = Math.floor((Game.TIME_TO_WAIT - diff) / 1000);
      this.timeLeft.innerText = `${secondsToWait}s`;

      if (secondsToWait <= 0) {
        clearInterval(this.interval);
        this.timeLeft.innerText = '';
      }
    }, 990);
  }
  // 🦁 Crée une méthode `initPixels`
  initPixels() {
    for (let i = 0; i < Game.BOARD_SIZE[0] * Game.BOARD_SIZE[1]; i++) {
      const pixel = new Pixel(Game.COLORS[Game.COLORS.length - 1]);
      pixel.element.addEventListener('click', () => this.onPixelClick(pixel));
      this.board.append(pixel.element);
    }
  }
}

class Pixel {
  static PIXEL_CLASS = 'pixel';
  static PIXEL_PICKER_CLASS = 'pixel-picker';

  constructor(color) {
    // 🦁 Stocke la couleur dans _color
    // 🦁 Crée un élément div qui sera stocké dans this.element
    this._color = color;
    this.element = document.createElement('div');
    this.element.style.background = color;
    this.element.classList.add(Pixel.PIXEL_CLASS);
  }

  set color(newColor) {
    this._color = newColor;
    this.element.style.background = newColor;
  }

  get color() {
    return this._color;
  }
}

class ColorPicker {
  constructor(colors, currentColor) {
    // 🦁 Stocke colors et currentColor
    this.colors = colors;
    this.currentColor = currentColor;
    // 🦁 Initie un tableau de pixels
    this.pixels = [];
  }

  // 🦁 Crée une méthode `init`
  init() {
    this.element = document.querySelector('#color-picker');
    // this.timeLeft = document.querySelector('#time-left');

    for (const color of this.colors) {
      const pixel = new Pixel(color);
      this.pixels.push(pixel);
      pixel.element.classList.add(Pixel.PIXEL_PICKER_CLASS);

      if (color === this.currentColor) {
        pixel.element.classList.add('active');
      }

      pixel.element.addEventListener('click', () => {
        this.onColorPixelClick(pixel);
      });

      this.element.appendChild(pixel.element);
    }
  }

  onColorPixelClick(pixel) {
    this.currentColor = pixel.color;
    this.updateActiveColor();
  }

  updateActiveColor() {
    for (const pixel of this.pixels) {
      // pixel.element.classList.toggle('active', pixel.color === this.currentColor);
      if (pixel.color === this.currentColor) {
        pixel.element.classList.add('active');
      } else {
        pixel.element.classList.remove('active');
      }
    }
  }
}

class Warning {
  constructor() {
    this.interval = null;
  }

  init() {
    this.element = document.querySelector('#warning');
  }

  showWarning() {
    this.element.classList.remove('hidden');

    clearInterval(this.interval);

    this.interval = setTimeout(() => {
      this.element.classList.add('hidden');
    }, Game.TIME_TO_WAIT);
  }
}

const game = new Game();
game.init();
