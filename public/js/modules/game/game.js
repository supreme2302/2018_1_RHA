import MainPlayer from './player/mainPlayer.js';
import BotPlayer from './player/botPlayer.js';
import Region from './components/region.js';
import GameManager from './gameManager.js';
import Controller from './controller.js';
import GameScene from './gameScene.js';
import bus from '../bus.js';
import {GameModes} from './config/modes.js';
import Ws from '../ws.js';
import User from '../userModel.js';
import WebPlayer from './player/webPlayer.js';

/**
 * Class representing game
 */
export default class Game {
	/**
	 * Creates game
	 * @param mode
	 * @param game_canvas
	 * @param change_canvas
	 */
	constructor(mode, game_canvas, coordinate, changeBut, img) {
		//let GameConstructor = null;

		// if (Game.__instance) {
		// 	return Game.__instance;
		// }
		this.listeners = {};
		Game.__instance = this;

		this.mode = mode;
		this.game_canvas = game_canvas;
		this.coordinate = coordinate;
		this.game_ctx = this.game_canvas.getContext('2d');
		this.img = img;
		this.scene = null;
		this.controller = new Controller(this.game_canvas, changeBut, this.mode);
		console.log(this.mode);
		if (this.mode === GameModes.singleplayer) {
			this.players = [
				new MainPlayer('A', 'rgba(0,255,127,0.4)', this.game_canvas, this.img),
				new BotPlayer('B','rgba(0,0,205,0.4)', this.game_canvas, this.img),
				new BotPlayer('C', 'rgba(255,69,0,0.4)', this.game_canvas, this.img),
				new BotPlayer('D', 'rgba(139,125,107,0.4)', this.game_canvas, this.img),
				new BotPlayer('E', 'rgba(255,165,0,0.4)', this.game_canvas, this.img)
			];
			this.regions = [];

			this.players.forEach( (player, i, arr) => {
				this.regions.push(new Region(player.name, player,
					this.game_canvas, this.coordinate, (arr.length - i) * 1000));
			});
			this.players.forEach(player => {
				player.setAllRegtions(this.regions);
			});
			this.regions.forEach(temp => {
				temp.setGlobalRegions(this.regions);
			});
			debugger;
			this.scene = new GameScene(this.game_canvas, this.players, this.regions, this.mode);

			this.manager = new GameManager(this.controller, this.game_canvas, this.regions, this.img, this.mode);
		} else {
			this.Ws = new Ws();
			bus.on('connected', () => {
				this.Ws.send('JoinGame$Request', {});
				bus.on('InitGame$Request', (data) => {
					//TODO установить игроков
					const initData = data.payload;
					const username = User.getCurUser().username;
					let indexPlayer;
					initData.players.forEach((player, index) => {
						if (player === username) {
							indexPlayer = index + 1;
						}
					});
					this.players = [];
					this.regions = [];
					this.botPlayer = new BotPlayer('bot', 'rgba(0,0,205,0.4)', this.game_canvas, this.img);
					initData.map.forEach((obj,i) => {
						if (obj.owner === indexPlayer) {
							const player = new MainPlayer(username, 'rgba(0,255,127,0.4)', this.game_canvas, this.img);
							this.players.push(player);
							const region = new Region(username, player, this.game_canvas, this.coordinate, obj.units);
							this.regions.push(region);
							// player.addRegion(region);
						}
						else if (obj.owner === 0) {
							const region = new Region(String(i), this.botPlayer, this.game_canvas, this.coordinate, 0);
							this.regions.push(region);
							// this.botPlayer.addRegion(region);
						}
						else {
							initData.players.forEach((player, i) => {
								if (obj.owner === i + 1) {
									console.log('in else');
									this.webPlayer = new WebPlayer(player, 'rgba(255,69,0,0.4)', this.game_canvas, this.img);
									this.players.push(this.webPlayer);
									const region = new Region(player, this.webPlayer, this.game_canvas, this.coordinate, obj.units);
									this.regions.push(region);
									// this.webPlayer.addRegion(region);
								}
							});

						}
					});
					debugger;
					this.players.forEach(player => {
						player.setAllRegtions(this.regions);
					});

					console.log(username);
					console.log(initData);

					this.scene = new GameScene(this.game_canvas, this.players, this.regions, this.mode);
					this.manager = new GameManager(this.controller, this.game_canvas, this.regions, this.img, this.mode);
					this.start();
					// Ws.send('set-players-confirm', true);
				});
			});
		}
	}

	/**
	 * Starts game
	 */
	start() {
		this.controller.start();
		this.scene.onListeners();
		this.manager.start();
		bus.emit('start-game', {});
	}

	/**
	 * turns game off
	 */
	destroy() {
		this.controller.stop();
		this.manager.destroy();
	}

}

//todo ИНТЕРФЕЙС БЛ*ТЬ
//todo при выделении границы говнятся, потому что не стираются старые
