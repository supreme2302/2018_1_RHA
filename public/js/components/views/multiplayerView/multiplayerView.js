/* eslint-disable no-undef */
import Section from '../baseView.js';
import bus from '../../../modules/bus.js';
import Game from '../../../modules/game/game.js';
import Coordinate from '../../../modules/game/config/coordinate.js';
import {GameModes} from '../../../modules/game/config/modes.js';

export default class MultiplayerSection extends Section {
	constructor() {
		super();

		this.parent = document.getElementById('game');
		this.wrapper = document.createElement('div');
		this.wrapper.classList.add('wrapper');

		this.wrapper.innerHTML += generateCanvas(
			{
				'width': window.innerWidth * 0.7,
				'height': window.innerWidth * 0.525 * 0.83,
				'id': 'game-canvas'
			}
		);

		// this.wrapper.getElementsByClassName('info-menu')[0].setAttribute('style', window.innerWidth * 0.525 * 0.83);
		this.parent.appendChild(this.wrapper);
		this.game_canvas = document.getElementById('game-canvas');
		this.ctx = this.game_canvas.getContext('2d');
		this.img = new Image();
		this.img.src = '/map.png';
	}

	render() {
		bus.on('ws-start', () => {
			this.img.onload = () => {
				//let pattern = this.ctx.createPattern(img, 'repeat');
				this.ctx.drawImage(this.img, 0,0, this.game_canvas.width, this.game_canvas.height);
				bus.emit('load-img', {});
			};

			bus.on('load-img', () => {
				this.setWindowResizeHandler();
				this.coordinate = new Coordinate(this.game_canvas);
				this.changeBut = this.wrapper.getElementsByClassName('change')[0];
				this.game = new Game(GameModes.multiplayer, this.game_canvas, this.coordinate, this.changeBut, this.img);
				this.game.start();
			});

		});
		return this.wrapper;
	}

	allowed() {
		return true;
	}

	computeCanvasSize() {
		// const size = (window.innerWidth > window.innerHeight) ? window.innerHeight : window.innerWidth;
		return [window.innerWidth * 0.7, window.innerWidth * 0.525 * 0.83];
	}

	setWindowResizeHandler() {
		window.addEventListener('resize', () => {
			[this.game_canvas.width, this.game_canvas.height] = this.computeCanvasSize();
			this.ctx.drawImage(this.img, 0, 0, this.game_canvas.width, this.game_canvas.height);
			this.coordinate.reSize(this.game_canvas);
			bus.emit('resize-for-draw', {});
		});
		return this;
	}
}



