import { LitElement, html, css } from './vendor/LitElement.js';
import { getFreshState, advanceRound } from './components/state.js';
import entities from './components/entities.js';
import actions from './components/actions.js';
import gamestates from './components/gamestates.js';
import './components/menu.js';
import './components/cell.js';

class App extends LitElement {
	constructor() {
		super();
		this.state = getFreshState();
		this.chosenItem = entities.BOMB;
	}

	static get properties() {
		return {
			state: { type: Object },
			chosenItem: { type: String }
		};
	}

	onAdvanceRound(action) {
		this.state = advanceRound(this.state, action);
		if (action.type !== actions.DROP_ITEM) {
			const cells = this.shadowRoot.querySelectorAll('gridrounds-cell');
			for (let i = 0; i < cells.length; i++) {
				cells[i].flicker();
			}
		}
	}

	onFieldClicked(position) {
		this.onAdvanceRound({
			type: actions.DROP_ITEM,
			entity: this.chosenItem,
			position
		});
	}

	static get styles() {
		return css`
			main {
				max-width: 400px;
				margin: auto;
				margin-top: 2rem;
				padding: 10px;
			}
			h1 {
				font-size: 13px;
				font-weight: normal;
				margin: 0 2px 0 0;
				padding: 5px;
				display: flex;
				justify-content: space-between;
				align-items: center;
				text-transform: uppercase;
			}

			.content {
				padding: 1rem;
			}

			ul {
				list-style: none outside none;
				padding: 0;
				display: grid;
				width: 100%;
				grid-gap: 5px;
			}

			button {
				font-size: 13px;
				background: #2c3e50;
				border: none;
				text-transform: uppercase;
				font-weight: bold;
				color: white;
			}
			.fat-button {
				width: 100%;
				margin-top: 1rem;
				padding: 10px;
				cursor: pointer;
			}
			.status {
				display: flex;
				justify-content: space-between;
				align-items: flex-center;
				font-size: 2rem;
			}
			.status-item {
				text-align: center;
				flex: 1;
			}
			.status-item button {
				font-size: 1.6rem;
				cursor: pointer;
			}
			.status-item button.active {
				box-shadow: 0 0 10px white;
			}
		`;
	}

	render() {
		console.log(this.state);
		const bombCount = this.state.board.filter(val => val.occupant === entities.BOMB).length;
		const trapCount = this.state.board.filter(val => val.occupant === entities.TRAP).length;
		const chosenItemRemaining =
			this.chosenItem === entities.BOMB ? this.state.bomb - bombCount : this.state.trap - trapCount;

		const cells = this.state.board.map((cell, index) => {
			return html`
				<gridrounds-cell
					.entity=${cell.occupant}
					.position=${index}
					.timer=${cell.timer}
					.disabled=${cell.occupant !== entities.EMPTY ||
						chosenItemRemaining === 0 ||
						this.state.gameState === gamestates.LOST}
					@cell-clicked=${e => {
						console.log(e);
						this.onFieldClicked(e.detail);
					}}
				></gridrounds-cell>
			`;
		});

		return html`
			<main>
				${this.state.gameState !== gamestates.LOST
					? html`
							<h1>
								<span>
									Gridrounds
								</span>
								<button
									@click=${() => {
										this.onAdvanceRound({
											type: actions.END_GAME
										});
									}}
								>
									New Game
								</button>
							</h1>
							<div class="content">
								<div class="status">
									<div class="status-item">
										⏳ ${this.state.roundsToSurvive - this.state.round}
									</div>
								</div>
								<ul style=${`grid-template-columns: ${'1fr '.repeat(this.state.boardWidth)}`}>
									${cells}
								</ul>
								<div class="status">
									<div class="status-item">
										<button
											@click=${() => {
												this.chosenItem = entities.BOMB;
											}}
											class=${this.chosenItem === entities.BOMB && 'active'}
										>
											${entities.BOMB} ${this.state.bomb - bombCount}
										</button>
										<button
											@click=${() => {
												this.chosenItem = entities.TRAP;
											}}
											class=${this.chosenItem === entities.TRAP && 'active'}
										>
											${entities.TRAP} ${this.state.trap - trapCount}
										</button>
									</div>
									<div class="status-item">
										${'❤️️'.repeat(this.state.lives)}
									</div>
								</div>
								${this.state.gameState === gamestates.LOST
									? html`
											Game Over
									  `
									: html`
											<button
												class="fat-button"
												@click=${() => {
													this.onAdvanceRound({
														type: actions.WAIT
													});
												}}
											>
												Next Round
											</button>
									  `}
							</div>
					  `
					: html`
							<h1>
								<span>
									Gridrounds — New Game
								</span>
							</h1>
							<div class="content">
								<gridrounds-menu
									@new-game=${e => {
										this.onAdvanceRound(e.detail);
									}}
								></gridrounds-menu>
							</div>
					  `}
			</main>
		`;
	}
}

customElements.define('gridrounds-app', App);
