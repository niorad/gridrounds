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
	}

	onItemDrag(e) {
		console.log('Draggin: ', e);
		e.dataTransfer.setData('text/plain', entities.BOMB);
	}

	onFieldClicked(position) {
		this.onAdvanceRound({
			type: actions.DROP_ITEM,
			entity: entities.BOMB,
			position
		});
	}

	static get styles() {
		return css`
			main {
				background: rgb(214, 211, 206);
				max-width: 400px;
				margin: auto;
				margin-top: 2rem;
				padding: 2px;
				border-bottom-style: solid;
				border-bottom-width: 2px;
				border-image-outset: 0px;
				border-image-repeat: stretch;
				border-image-slice: 100%;
				border-image-source: none;
				border-image-width: 1;
				border-left-color: rgb(255, 255, 255);
				border-left-style: solid;
				border-left-width: 2px;
				border-right-color: rgb(5, 6, 8);
				border-right-style: solid;
				border-right-width: 2px;
				border-top-color: rgb(255, 255, 255);
				border-top-style: solid;
				border-top-width: 2px;
				box-shadow: rgb(223, 224, 227) 1px 1px 0px 1px inset,
					rgb(136, 140, 143) -1px -1px 0px 1px inset;
			}
			h1 {
				color: white;
				font-size: 13px;
				font-weight: bold;
				margin: 0 2px 0 0;
				background-image: linear-gradient(to right, #102b73, #a5cbf7);
				padding: 5px;
				display: flex;
				justify-content: space-between;
				align-items: center;
				height: 20px;
			}

			h1 button {
				margin: 0;
				width: 20px;
				height: 20px;
				padding: 0;
				line-height: 20px;
				text-align: center;
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
				border: 1px solid rgba(0, 0, 0, 0.2);
			}
			li small {
				font-size: 12px;
				position: absolute;
				right: 5px;
				bottom: 3px;
			}
			li button {
				font-size: 2.4rem;
				margin: 0;
				width: 100%;
				max-width: 100%;
				padding: 0;
			}
			li button[disabled] {
				color: black;
				outline: none;
				border-color: transparent;
			}
			button {
				font-family: 'Microsoft Sans Serif', sans-serif;
				font-size: 13px;
				outline: 1px solid #000000;
				background: rgb(214, 211, 206);
				border-width: 1px;
				border-style: solid;
				border-color: #ffffff #808080 #808080 #ffffff;
				cursor: url(win95mouse.png), auto;
			}
			.fat-button {
				width: 100%;
				margin-top: 1rem;
				padding: 10px;
			}
			hr {
				border-top-color: #808080;
				border-bottom-color: #ffffff;
				margin-bottom: 1rem;
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
		`;
	}

	render() {
		console.log(this.state);
		const bombCount = this.state.board.filter(
			val => val.occupant === entities.BOMB
		).length;

		return html`
			<main>
				${this.state.gameState !== gamestates.LOST
					? html`
							<h1>
								<span>
									gridrounds.exe —
									${this.state.boardWidth}&times;${this.state
										.boardHeight}
								</span>
								<button
									@click=${() => {
										this.onAdvanceRound({
											type: actions.END_GAME
										});
									}}
								>
									✖️
								</button>
							</h1>
							<div class="content">
								<div class="status">
									<div class="status-item">
										⏳
										${this.state.roundsToSurvive -
											this.state.round}
									</div>
									<div class="status-item">
										${entities.BOMB.repeat(
											this.state.bombs - bombCount
										)}
									</div>
								</div>
								<ul
									style=${`grid-template-columns: ${'1fr '.repeat(
										this.state.boardWidth
									)}`}
								>
									${this.state.board.map((cell, index) => {
										return html`
											<li>
												<button
													?disabled=${cell.occupant !==
														entities.EMPTY ||
														bombCount ===
															this.state.bombs ||
														this.state.gameState ===
															gamestates.LOST}
													@click=${e => {
														this.onFieldClicked(
															index
														);
													}}
												>
													${cell.occupant}
												</button>
												<small>${cell.timer}</small>
											</li>
										`;
									})}
								</ul>
								<div class="status">
									<div class="status-item">
										${'🏠️'.repeat(this.state.lives)}
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
									gridrounds.exe — New Game
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
