/* eslint-disable indent,no-case-declarations,no-console */
import inHex from './math/inHex.js';
import bus from '../bus.js';
import PLAYER_STATES from './config/playerStates.js';
import {aboutRegion} from './helperFuncs/renderInfoAboutRegion.js';
import Ws from '../ws.js';
import {GameModes} from './config/modes.js';
import User from '../userModel.js';
import {dUnits} from './config/unitConf.js';

/**
 * Class representing Game Scene (Set of graphical and logical elements)
 */
export default class GameScene {
	/**
	 * Creates scene
	 * @param canvas
	 * @param players
	 * @param regions
	 * @param mode
	 */
	constructor(canvas, players, regions, mode) {

		this.mode = mode;
		this.canvas  = canvas;
		this.game_ctx = canvas.getContext('2d');
		this.players = players;
		this.regions = regions;
		this.about_region = document.getElementById('about-region');
		// if (mode === GameModes.singleplayer) {
			this.setPlayersRegions();
		// }
		if (mode === GameModes.multiplayer) {
			this.mainPlayer = null;
			this.curPlayer = null;
			this.setPlayersStatus();
			this.ws = new Ws();
		}
	}

	/**
	 * Returns current player
	 * @return {*}
	 */
	currentPlayer() {
		for (let i = 0; i < this.players.length; ++i) {
			// TODO проверить работает ли это условие
			if (this.players[i].status !== PLAYER_STATES.DISABLED ) {
				return this.players[i];
			}
		}
	}

	/**
	 * Returns next player
	 * @return {*}
	 */
	nextPlayer() {
		const curP = this.currentPlayer();
		for (let i = 0; i < this.players.length; ++i) {
			if (this.players[i] === curP) {
				i = (i + 1) % this.players.length;
				return this.players[i];
			}
		}
	}

	/**
	 * Returns pointed region
	 * @param x
	 * @param y
	 * @return {Region | null}
	 */
	isRegion(x, y) {
		for (let i = 0; i < this.regions.length; ++i) {
			if (inHex(x, y, this.regions[i].area.xp, this.regions[i].area.yp)) {
				return this.regions[i];
			}
		}
		return null;
	}

	/**
	 *
	 * @param active
	 * @param current
	 * @return {boolean}
	 */
	isNeighbour(active, current) {
		for (let i = 0; i < active.neighbour.length; i++) {
			if (current.label === active.neighbour[i]) {
				return true;
			}
		}
		return false;
	}

	isMatrixNeighbour(active, current) {
		const x1 = active.coordinate.I;
		const y1 = active.coordinate.J;
		const x2 = current.coordinate.I;
		const y2 = current.coordinate.J;
		if (x1 === x2 && Math.abs(y1 - y2) === 1) {
			return true;
		}
		else if (Math.abs(x1 - x2) === 1) {
			if (y1 === y2) {
				return true;
			}
			else {
				if (x1 % 2 === 0 && y1 - y2 === 1) {
					return true;
				}
				else if (x1 % 2 === 1 && y2 - y1 === 1) {
					return true;
				}
			}
		}
		return false;
	}

	/**
	 *
	 * @return {Region}
	 */
	activeRegion() {
		for (let i = 0; i < this.regions.length; ++i) {
			if (this.regions[i].selected === true) {
				return this.regions[i];
			}
		}
	}

	/**
	 *
	 */
	deactivatePlayers() {
		this.players.forEach(player => player.active = false);
	}

	/**
	 * Sets regions for playes
	 */
	setPlayersRegions() {
		for (let i = 0; i < this.players.length; i++ ) {
			// this.players[i].addRegion(this.regions[i]);
			for (let j = 0; j < this.regions.length; ++j) {
				if (this.regions[j].owner === this.players[i]) {
					this.players[i].addRegion(this.regions[j], this.players[i]);
				}
			}
		}
	}

	setPlayersStatus() {
		// return new Promise((resolve, reject)=> {
			bus.on('TurnInit$Request', data => {
				const user = data.payload.user;
				if (user === User.getCurUser().username) {
					this.players.forEach(player => {
						if (player.name === user) {
							player.setStatus(PLAYER_STATES.DEFAULT);
							this.mainPlayer = player;
							bus.emit('start-controller', {});
							bus.emit('illum-cur-m', [player, this.players]);
						}
					});
				}
				else {
					bus.emit('stop-controller', {});
					this.players.forEach(player => {
						if (player.name === user) {
							this.curPlayer = player;
							bus.emit('illum-cur-m', [player, this.players]);
						}
					});
				}
			});
	}



	/**
	 * подписываемся на события кликов мышки
	 */
	onListeners() {
		if (this.mode === GameModes.singleplayer) {
			bus.on('left-click', data => {
				const curPlayer = this.currentPlayer();
				const coordinates = data.payload;
				if (curPlayer.status === PLAYER_STATES.DISABLED) {
					return;
				}
				const curRegion = this.isRegion(coordinates.x, coordinates.y);
				if (!curRegion) {
					const acReg = this.activeRegion();
					if (acReg != null) {
						curPlayer.status = PLAYER_STATES.DEFAULT;
						bus.emit('remove-selection', acReg);
					}
					return;
				}
				switch (curPlayer.status) {
					case PLAYER_STATES.DEFAULT:
						if (!curPlayer.isTheRegionOfPlayer(curRegion)) {
							return;
						}
						curPlayer.status = PLAYER_STATES.READY;

						//выводим информацию о регионе
						aboutRegion(curRegion);
						bus.emit('select-region', curRegion);
						break;
					case PLAYER_STATES.READY:
						const activeRegion = this.activeRegion();
						if (!this.currentPlayer().isTheRegionOfPlayer(curRegion)) {
							if (this.isNeighbour(activeRegion, curRegion) === false) {
								return;
							}
							bus.emit('attack', {
								from: activeRegion,
								to: curRegion
							});
						}
						//если нажали на выделенный регион
						else {
							if (curRegion === this.activeRegion()) {
								curPlayer.status = PLAYER_STATES.DEFAULT;
								bus.emit('remove-selection', curRegion);
							} else {
								//выводим информацию о регионе
								aboutRegion(curRegion);
								curRegion.gameData.units += activeRegion.gameData.units;
								activeRegion.gameData.units = 0;
								bus.emit('move-units',
									{
										active: this.activeRegion(),
										new: curRegion
									});
							}
						}
						break;
				}
			});


			bus.on('left-click-change', () => {
				const curPlayer = this.currentPlayer();
				const nextPlayer = this.nextPlayer();
				if (curPlayer.status === PLAYER_STATES.DISABLED) {
					return;
				}
				bus.emit('change-move', {
					current: curPlayer,
					next: nextPlayer,
				});
			});

			bus.on('bot-attack', data => {
				const regs = data.payload;
				for (let i = 0; i < this.regions.length; ++i) {
					if (regs.to === this.regions[i].label) {
						bus.emit('attack', {
							from: regs.from,
							to: this.regions[i]
						});
					}
				}
			});

			bus.on('bot-change-move', () => {
				bus.emit('change-move', {
					current: this.currentPlayer(),
					next: this.nextPlayer(),
				});
			});

			bus.on('delete-from-queue', data => {
				const player = data.payload;
				this.players.forEach((cur, i) => {
					if (cur === player) {
						this.players.splice(i, 1);
					}
				});
			});

			bus.on('start-game', () => {
				//подсветка текущего игрока
				bus.emit('illum-cur', this.currentPlayer());
			});
		}
		else {
			bus.on('left-click', data => {
				const coordinates = data.payload;
				const curRegion = this.isRegion(coordinates.x, coordinates.y);


				if (!curRegion) {
					const acReg = this.activeRegion();
					if (acReg != null) {
						this.mainPlayer.status = PLAYER_STATES.DEFAULT;
						bus.emit('remove-selection', acReg);
					}
					return;
				}



				switch (this.mainPlayer.status) {
					case PLAYER_STATES.DEFAULT:
						if (!this.mainPlayer.isTheRegionOfPlayer(curRegion)) {
							return;
						}

						aboutRegion(curRegion);

						this.mainPlayer.status = PLAYER_STATES.READY;
						bus.emit('select-region', curRegion);
						break;

					case PLAYER_STATES.READY:
						const activeRegion = this.activeRegion();
						if (curRegion === activeRegion) {
							this.mainPlayer.status = PLAYER_STATES.DEFAULT;
							bus.emit('remove-selection', curRegion);
						}
						else {
							if (this.isMatrixNeighbour(activeRegion, curRegion) === false) {
								return;
							}
							this.ws.send({
								class: 'ClientStep',
								from: [activeRegion.coordinate.I, activeRegion.coordinate.J],
								to: [curRegion.coordinate.I, curRegion.coordinate.J]
							});
						}
						break;
				}
			});

			bus.on('left-click-change', () => {
				this.ws.send({
						class: 'ClientTurn'
				});
			});

			bus.on('update-regions', (data) => {
				const regions = data.payload;
				regions.regions.forEach(reg => {
					this.regions[reg.num].area.units = reg.units;
					this.regions[reg.num].gameData.units = reg.units;
				});
			});

			// bus.on('start-game', () => {
				//подсветка текущего игрока

			// });

			bus.on('update-units', () => {

				this.regions.forEach((curReg) => {
					// console.log(curReg, '+', dUnits[String(curReg.area.type)]);
					if (curReg.area.type !== 0) {
						curReg.area.units += dUnits[curReg.area.type];
						curReg.gameData.units += dUnits[curReg.area.type];
					}
				});
			});
		}
	}

	offListeners() {

	}
}
//todo сделать ход
//todo назначить цвета и сделать несколько веб плееров
