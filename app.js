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
	}

	static get properties() {
		return {
			state: { type: Object }
		};
	}

	onAdvanceRound(action) {
		this.state = advanceRound(this.state, action);
		if (
			this.state.board.filter(i => i.occupant === entities.EXPLOSION).length > 0 &&
			action.type !== actions.DROP_ITEM
		) {
			const explosion = new Audio('./explosion.wav');
			explosion.play();
		} else {
			const blip = new Audio('./blip.wav');
			blip.play();
		}
	}

	onFieldClicked(position) {
		const fuse = new Audio('./fuse.wav');
		fuse.play();
		this.onAdvanceRound({
			type: actions.DROP_ITEM,
			entity: entities.BOMB,
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
				animation-duration: 2s;
				animation-fill-mode: both;
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
			@keyframes explode {
				from {
					transform: scale(0.5);
				}
				to {
					transform: scale(1.5);
				}
			}
		`;
	}

	render() {
		console.log(this.state);
		const bombCount = this.state.board.filter(val => val.occupant === entities.BOMB).length;

		return html`
			<main>
				${this.state.gameState !== gamestates.LOST
					? html`
							<h1>
								<span>
									Gridrounds — ${this.state.boardWidth}&times;${this.state.boardHeight}
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
									<div class="status-item">
										${entities.BOMB.repeat(this.state.bombs - bombCount)}
									</div>
								</div>
								<ul style=${`grid-template-columns: ${'1fr '.repeat(this.state.boardWidth)}`}>
									${this.state.board.map((cell, index) => {
										return html`
											<li>
												<div class="square">
													<button
														?disabled=${cell.occupant !== entities.EMPTY ||
															bombCount === this.state.bombs ||
															this.state.gameState === gamestates.LOST}
														@click=${e => {
															this.onFieldClicked(index);
														}}
														@mouseenter=${() => {
															const hoverSound = new Audio('./hover.wav');
															hoverSound.play();
														}}
													>
														<span
															class=${cell.occupant === entities.EXPLOSION
																? 'explosion'
																: ''}
															>${cell.occupant}</span
														>
													</button>
													<small>${cell.timer}</small>
												</div>
											</li>
										`;
									})}
								</ul>
								<div class="status">
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
