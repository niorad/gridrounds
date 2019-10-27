import entities from './entities.js';
import actions from './actions.js';

export const advanceRound = (state, action) => {
	if (action.type === actions.WAIT) {
		return addEnemies(addRound(tickBombs(moveEnemies({ ...state }))));
	} else if (action.type === actions.DROP_ITEM) {
		return addBomb(state, action.position);
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
			}
		}
	}
	return s;
}

function addEnemies(state) {
	const s = { ...state };
	if (s.round % 2 === 0) {
		s.board[Math.floor(Math.random() * s.boardWidth)] = {
			occupant: entities.ENEMY
		};
	}
	return s;
}

function addBomb(state, cell) {
	const s = { ...state };
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

function addRound(state) {
	const s = { ...state };
	s.round++;
	return s;
}

export const getFreshState = () => {
	const boardWidth = 6;
	const boardHeight = 6;
	return {
		round: 0,
		boardWidth,
		boardHeight,
		board: Array(boardWidth * boardHeight).fill({
			occupant: entities.EMPTY
		})
	};
};
