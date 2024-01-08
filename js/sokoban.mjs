"use strict";

import { maps } from "./maps.mjs";

export default class Sokoban {
	patterns = undefined;

	mapIndex = 0;

	_map = Rss.Matrix.clone(maps[this.mapIndex]);
	_originalMap = Rss.Matrix.clone(maps[this.mapIndex]);
	w = this._map[0].length;
	h = this._map.length;
	grid = new Rss.Grid(this.w, this.h, 32);

	// FIXME: This needs to be Rss.js' EventEmitter
	on() {
	}

	// FIXME: This needs to be Rss.js' EventEmitter
	emit() {
	}

	constructor(patterns) {
		this.patterns = patterns;
	}

	_drawMap() {
		let i, j;
		for (i = 0; i < this._map.length; i++) {
			for (j = 0; j < this._map[i].length; j++) {
				this.grid.fillSquare(j, i, this.patterns[this._map[i][j]]);
			}
		}
	}

	_getCoordOfKeeper() {
		let x, y, i;
		for (i = 0; i < this._map.length; i++) {
			if (this._map[i].indexOf(6) !== -1 || this._map[i].indexOf(7) !== -1) {
				x = this._map[i].indexOf(6) !== -1
					? this._map[i].indexOf(6)
					: this._map[i].indexOf(7);
				y = i;
				break;
			}
		}
		return [x, y];
	}

	_checkIfFinished() {
		let finished = true, i, j;
		for (i = 0; i < this._map.length; i++) {
			for (
				j = 0;
				j < this._map[i].length;
				j++
			) if (this._map[i][j] == 3 || this._map[i][j] == 4) finished = false;
		}
		if (finished) {
			alert("You have completed this level, the next stage will level now.");
			this._playNextMap();
		}
	}

	_playNextMap() {
		this.playMap(this.mapIndex + 1);
	}

	playMap(mapIndex) {
		this.mapIndex = mapIndex;
		this.grid.destroy();
		this.mapIndex %= maps.length;
		this._map = Rss.Matrix.clone(maps[this.mapIndex]);

		this._originalMap = Rss.Matrix.clone(maps[this.mapIndex]);
		this.w = this._map[0].length;
		this.h = this._map.length;
		this.grid = new Rss.Grid(this.w, this.h, 32);

		this.play();
	}

	play() {
		this._drawMap();
		this.emit("stageStarted");
	}

	restartStage() {
		_map = Rss.Matrix.clone(_originalMap);
		_drawMap();
	}

	moveLeft() {
		const coords = this._getCoordOfKeeper();
		let x = coords[0], y = coords[1], moved = false;

		if (this._map[y][x - 1] == 0 || this._map[y][x - 1] == 1) {
			return;
		}

		if (this._map[y][x - 1] == 2) {
			this._map[y][x - 1] = 6;
			moved = true;
		} else if (this._map[y][x - 1] == 3) {
			this._map[y][x - 1] = 7;
			moved = true;
		} else if (this._map[y][x - 1] == 4) {
			if (this._map[y][x - 2] == 2) {
				this._map[y][x - 2] = 4;
				this._map[y][x - 1] = 6;
				moved = true;
			} else if (this._map[y][x - 2] == 3) {
				this._map[y][x - 2] = 5;
				this._map[y][x - 1] = 6;
				moved = true;
			}
		} else if (this._map[y][x - 1] == 5) {
			if (this._map[y][x - 2] == 2) {
				this._map[y][x - 2] = 4;
				this._map[y][x - 1] = 7;
				moved = true;
			} else if (this._map[y][x - 2] == 3) {
				this._map[y][x - 2] = 5;
				this._map[y][x - 1] = 7;
				moved = true;
			}
		}

		if (moved) {
			if (this._map[y][x] == 6) this._map[y][x] = 2;
			else if (this._map[y][x] == 7) this._map[y][x] = 3;
		}

		this._drawMap();
		this._checkIfFinished();
	}

	moveRight() {
		const coords = this._getCoordOfKeeper();
		let x = coords[0], y = coords[1], moved = false;
		if (this._map[y][x + 1] == 0 || this._map[y][x + 1] == 1) {
			return;
		}
		if (this._map[y][x + 1] == 2) {
			this._map[y][x + 1] = 6;
			moved = true;
		} else if (this._map[y][x + 1] == 3) {
			this._map[y][x + 1] = 7;
			moved = true;
		} else if (this._map[y][x + 1] == 4) {
			if (this._map[y][x + 2] == 2) {
				this._map[y][x + 2] = 4;
				this._map[y][x + 1] = 6;
				moved = true;
			} else if (this._map[y][x + 2] == 3) {
				this._map[y][x + 2] = 5;
				this._map[y][x + 1] = 6;
				moved = true;
			}
		} else if (this._map[y][x + 1] == 5) {
			if (this._map[y][x + 2] == 2) {
				this._map[y][x + 2] = 4;
				this._map[y][x + 1] = 7;
				moved = true;
			} else if (this._map[y][x + 2] == 3) {
				this._map[y][x + 2] = 5;
				this._map[y][x + 1] = 7;
				moved = true;
			}
		}

		if (moved) {
			if (this._map[y][x] == 6) this._map[y][x] = 2;
			else if (this._map[y][x] == 7) this._map[y][x] = 3;
		}

		this._drawMap();
		this._checkIfFinished();
	}

	moveUp() {
		const coords = this._getCoordOfKeeper();
		let x = coords[0], y = coords[1], moved = false;
		if (this._map[y - 1][x] == 0 || this._map[y - 1][x] == 1) {
			return;
		}
		if (this._map[y - 1][x] == 2) {
			this._map[y - 1][x] = 6;
			moved = true;
		} else if (this._map[y - 1][x] == 3) {
			this._map[y - 1][x] = 7;
			moved = true;
		} else if (this._map[y - 1][x] == 4) {
			if (this._map[y - 2][x] == 2) {
				this._map[y - 2][x] = 4;
				this._map[y - 1][x] = 6;
				moved = true;
			} else if (this._map[y - 2][x] == 3) {
				this._map[y - 2][x] = 5;
				this._map[y - 1][x] = 6;
				moved = true;
			}
		} else if (this._map[y - 1][x] == 5) {
			if (this._map[y - 2][x] == 2) {
				this._map[y - 2][x] = 4;
				this._map[y - 1][x] = 7;
				moved = true;
			} else if (this._map[y - 2][x] == 3) {
				this._map[y - 2][x] = 5;
				this._map[y - 1][x] = 7;
				moved = true;
			}
		}

		if (moved) {
			if (this._map[y][x] == 6) this._map[y][x] = 2;
			else if (this._map[y][x] == 7) this._map[y][x] = 3;
		}

		this._drawMap();
		this._checkIfFinished();
	}

	moveDown() {
		const coords = this._getCoordOfKeeper();
		let x = coords[0], y = coords[1], moved = false;

		if (this._map[y + 1][x] == 0 || this._map[y + 1][x] == 1) {
			return;
		}

		if (this._map[y + 1][x] == 2) {
			this._map[y + 1][x] = 6;
			moved = true;
		} else if (this._map[y + 1][x] == 3) {
			this._map[y + 1][x] = 7;
			moved = true;
		} else if (this._map[y + 1][x] == 4) {
			if (this._map[y + 2][x] == 2) {
				this._map[y + 2][x] = 4;
				this._map[y + 1][x] = 6;
				moved = true;
			} else if (this._map[y + 2][x] == 3) {
				this._map[y + 2][x] = 5;
				this._map[y + 1][x] = 6;
				moved = true;
			}
		} else if (this._map[y + 1][x] == 5) {
			if (this._map[y + 2][x] == 2) {
				this._map[y + 2][x] = 4;
				this._map[y + 1][x] = 7;
				moved = true;
			} else if (this._map[y + 2][x] == 3) {
				this._map[y + 2][x] = 5;
				this._map[y + 1][x] = 7;
				moved = true;
			}
		}

		if (moved) {
			if (this._map[y][x] == 6) this._map[y][x] = 2;
			else if (this._map[y][x] == 7) this._map[y][x] = 3;
		}

		this._drawMap();
		this._checkIfFinished();
	}
}

// Sokoban.prototype = new Rss.EventEmitter();
