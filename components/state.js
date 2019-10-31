import entities from './entities.js';
import actions from './actions.js';
import gameStates from './gamestates.js';

export const advanceRound = (state, action) => {
	if (action.type === actions.WAIT) {
		return checkIfLost(
			addEnemies(
				addRound(
					explodeBombs(
						tickBombs(moveEnemies(cleanUpExplosions({ ...state })))
					)
				)
			)
		);
	} else if (action.type === actions.DROP_ITEM) {
		return addBomb(state, action.position);
	} else if (action.type === actions.NEW_GAME) {
		return getFreshState(
			action.boardWidth,
			action.boardHeight,
			action.bombs,
			action.lives,
			action.enemiesDelay
		);
	}
	return state;
};

function moveEnemies(state) {
	const s = { ...state };
	for (let i = s.board.length - 1; i >= 0; i--) {
		if (s.board[i].occupant === entities.ENEMY) {
			s.board[i].occupant = entities.EMPTY;
			if (i + s.boardWidth < s.board.length) {
				s.board[i + s.boardWidth] = { occupant: entities.ENEMY };
			} else {
				console.log('ENEMY HIT HOMEBASE');
				s.lives--;
			}
		}
	}
	return s;
}

function addEnemies(state) {
	const s = { ...state };
	if (s.round % state.enemiesDelay === 0) {
		s.board[Math.floor(Math.random() * s.boardWidth)] = {
			occupant: entities.ENEMY
		};
	}
	return s;
}

function addBomb(state, cell) {
	const s = { ...state };

	const bombCount = s.board.filter(val => val.occupant === entities.BOMB)
		.length;

	if (bombCount >= state.bombs) {
		return s;
	}

	if (s.board[cell].occupant === entities.EMPTY) {
		s.board[cell] = { occupant: entities.BOMB, timer: 3 };
	}
	return s;
}

function tickBombs(state) {
	const s = { ...state };
	for (let i = 0; i < s.board.length; i++) {
		if (s.board[i].occupant === entities.BOMB) {
			s.board[i].timer--;
		}
	}
	return s;
}

function checkIfLost(state) {
	const s = { ...state };
	if (s.lives <= 0) {
		s.gameState = gameStates.LOST;
	}
	return s;
}

function explodeBombs(state) {
	const s = { ...state };
	for (let i = 0; i < s.board.length; i++) {
		if (s.board[i].occupant === entities.BOMB && s.board[i].timer <= 0) {
			s.board[i] = { occupant: entities.EXPLOSION };
			// has tile to the right
			if ((i + 1) % s.boardWidth !== 0) {
				if (s.board[i + 1].occupant !== entities.BOMB) {
					s.board[i + 1] = { occupant: entities.EXPLOSION };
				} else {
					s.board[i + 1].timer = -1;
				}
			}
			// has tile to the left
			if ((i - 1) % s.boardWidth !== s.boardWidth - 1) {
				if (s.board[i - 1].occupant !== entities.BOMB) {
					s.board[i - 1] = { occupant: entities.EXPLOSION };
				} else {
					s.board[i - 1].timer = -1;
				}
			}
			// has tile to the top
			if (i - s.boardWidth >= 0) {
				if (s.board[i - s.boardWidth].occupant !== entities.BOMB) {
					s.board[i - s.boardWidth] = {
						occupant: entities.EXPLOSION
					};
				} else {
					s.board[i - s.boardWidth].timer = -1;
				}
			}
			// has tile to the bottom
			if (i + s.boardWidth <= s.board.length - 1) {
				if (s.board[i + s.boardWidth].occupant !== entities.BOMB) {
					s.board[i + s.boardWidth] = {
						occupant: entities.EXPLOSION
					};
				} else {
					s.board[i + s.boardWidth].timer = -1;
				}
			}
			// if bomb found, start from beginning to explode all bombs
			i = 0;
		}
	}
	return s;
}

function cleanUpExplosions(state) {
	const s = { ...state };
	for (let i = 0; i < s.board.length; i++) {
		if (s.board[i].occupant === entities.EXPLOSION) {
			s.board[i] = { occupant: entities.EMPTY };
		}
	}
	return s;
}

function addRound(state) {
	const s = { ...state };
	s.round++;
	return s;
}

export const getFreshState = (
	boardWidth = 5,
	boardHeight = 5,
	bombs = 3,
	lives = 3,
	enemiesDelay = 1
) => {
	return {
		round: 0,
		lives,
		bombs,
		enemiesDelay,
		roundsToSurvive: 30,
		gameState: gameStates.PRISTINE,
		boardWidth,
		boardHeight,
		board: Array(boardWidth * boardHeight).fill({
			occupant: entities.EMPTY
		})
	};
};
