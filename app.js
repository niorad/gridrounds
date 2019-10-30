import { LitElement, html, css } from './vendor/LitElement.js';
import { getFreshState, advanceRound } from './components/state.js';
import entities from './components/entities.js';
import actions from './components/actions.js';

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
				background: rgb(206, 208, 207);
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
				background-image: linear-gradient(
					to right,
					rgb(0, 0, 128),
					rgb(16, 52, 166)
				);
				padding: 5px;
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
				font-size: 3rem;
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
				background: rgb(206, 208, 207);
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
			}
			.status-item {
				text-align: center;
				flex: 1;
			}
			.menu {
				display: flex;
				padding-top: 1rem;
				justify-content: stretch;
			}
			.menu > * {
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
				<h1>
					gridrounds.exe —
					${this.state.boardWidth}x${this.state.boardHeight}
				</h1>
				<div class="content">
					<div class="status">
						<div class="status-item">
							⏳ ${this.state.roundsToSurvive - this.state.round}
						</div>
						<div class="status-item">
							${entities.BOMB.repeat(3 - bombCount)}
						</div>
					</div>
					<ul
						style="grid-template-columns: ${'1fr '.repeat(
							this.state.boardWidth
						)}"
					>
						${this.state.board.map((cell, index) => {
							return html`
								<li>
									<button
										?disabled=${cell.occupant !==
											entities.EMPTY || bombCount === 3}
										@click=${e => {
											this.onFieldClicked(index);
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
					<button
						class="fat-button"
						@click=${() => {
							this.onAdvanceRound({ type: actions.WAIT });
						}}
					>
						Next Round
					</button>
					<div class="menu">
						<button
							@click=${() => {
								this.onAdvanceRound({
									type: actions.NEW_GAME,
									boardWidth: 4,
									boardHeight: 5
								});
							}}
						>
							New 4x5
						</button>
						<button
							@click=${() => {
								this.onAdvanceRound({
									type: actions.NEW_GAME,
									boardWidth: 5,
									boardHeight: 5
								});
							}}
						>
							New 5x5
						</button>
						<button
							@click=${() => {
								this.onAdvanceRound({
									type: actions.NEW_GAME,
									boardWidth: 6,
									boardHeight: 5
								});
							}}
						>
							New 6x5
						</button>
					</div>
				</div>
			</main>
		`;
	}
}

customElements.define('gridrounds-app', App);
