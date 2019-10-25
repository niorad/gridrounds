import entities from './entities.js';

export const getFreshState = () => {
	return {
		board: [
			{ occupant: entities.EMPTY },
			{ occupant: entities.EMPTY },
			{ occupant: entities.ENEMY },
			{ occupant: entities.EMPTY },

			{ occupant: entities.EMPTY },
			{ occupant: entities.ENEMY },
			{ occupant: entities.EMPTY },
			{ occupant: entities.EMPTY },

			{ occupant: entities.EMPTY },
			{ occupant: entities.EMPTY },
			{ occupant: entities.EMPTY },
			{ occupant: entities.EMPTY },

			{ occupant: entities.EMPTY },
			{ occupant: entities.EMPTY },
			{ occupant: entities.EMPTY },
			{ occupant: entities.EMPTY },

			{ occupant: entities.EMPTY },
			{ occupant: entities.EMPTY },
			{ occupant: entities.EMPTY },
			{ occupant: entities.EMPTY },

			{ occupant: entities.EMPTY },
			{ occupant: entities.BOMB },
			{ occupant: entities.EMPTY },
			{ occupant: entities.EMPTY }
		]
	};
};
