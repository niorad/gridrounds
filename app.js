import { LitElement, html, css } from './vendor/LitElement.js';
import { getFreshState, advanceRound } from './components/state.js';
import entities from './components/entities.js';
import actions from './components/actions.js';
import gamestates from './components/gamestates.js';
import './components/menu.js';

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

		// if (this.state.events.indexOf(actions.EXPLOSION) >= 0) {
		// 	const explosion = new Audio('./explosion.wav');
		// 	explosion.play();
		// }

		// if (this.state.events.indexOf(actions.DROP_ITEM) >= 0) {
		// 	const fuse = new Audio('./fuse.wav');
		// 	fuse.play();
		// }

		// if (this.state.events.indexOf(actions.LOST_HP) >= 0) {
		// 	const hit = new Audio('./hit.wav');
		// 	hit.play();
		// }

		// const blip = new Audio('./blip.wav');
		// blip.play();
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
			@keyframes explode {
				0% {
					transform: scale(0.2);
				}
				100% {
					transform: scale(1.2);
				}
			}
			@keyframes moveDown {
				0% {
					transform: translateY(-20px);
				}
				100% {
					transform: translateY(0);
				}
			}

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
			li {
				text-align: center;
				position: relative;
			}
			li small {
				font-size: 12px;
				position: absolute;
				right: 5px;
				bottom: 3px;
			}
			li .square {
				width: 100%;
				padding-top: 100%;
				position: relative;
			}
			li button {
				font-size: 2.4rem;
				margin: 0;
				width: 100%;
				max-width: 100%;
				padding: 0;
				position: absolute;
				top: 0;
				left: 0;
				right: 0;
				bottom: 0;
				outline: 1px dashed #d35400;
				outline-offset: -3px;
			}
			li button:not([disabled]):hover {
				cursor: pointer;
				outline: 2px dashed #d35400;
			}

			li button[disabled] {
				color: black;
				outline: transparent;
			}
			li button .explosion {
				animation-name: explode;
				animation-duration: 0.5s;
				/* animation-fill-mode: both; */
				animation-iteration-count: infinite;
				animation-timing-function: ease-out;
			}
			li button .enemy {
				animation-name: moveDown;
				animation-duration: 0.2s;
				animation-fill-mode: both;
				animation-timing-function: ease-in-out;
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
									${this.state.board.map((cell, index) => {
										return html`
											<li>
												<div class="square">
													<button
														?disabled=${cell.occupant !== entities.EMPTY ||
															chosenItemRemaining === 0 ||
															this.state.gameState === gamestates.LOST}
														@click=${e => {
															this.onFieldClicked(index);
														}}
														@mouseenter=${() => {
															// const hoverSound = new Audio('./hover.wav');
															// hoverSound.play();
														}}
													>
														<div
															class=${cell.occupant === entities.EXPLOSION
																? 'explosion'
																: cell.occupant === entities.ENEMY
																? 'enemy'
																: ''}
														>
															${cell.occupant}
														</div>
													</button>
													<small>${cell.timer}</small>
												</div>
											</li>
										`;
									})}
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
