import { LitElement, html, css } from '../vendor/LitElement.js';
import actions from '../components/actions.js';

class Menu extends LitElement {
	constructor() {
		super();
		this.newGameBoardWidth = 5;
		this.newGameBoardHeight = 5;
		this.newGameBombs = 3;
		this.newGameBombTimer = 3;
		this.newGameHitpoints = 3;
		this.newGameEnemiesDelay = 1;
	}

	static get properties() {
		return {
			newGameBoardWidth: { type: Number },
			newGameBoardHeight: { type: Number },
			newGameBombs: { type: Number },
			newGameBombTimer: { type: Number },
			newGameHitpoints: { type: Number },
			newGameEnemiesDelay: { type: Number }
		};
	}

	static get styles() {
		return css`
			.menu {
				display: flex;
				flex-direction: column;
				padding-top: 1rem;
				font-size: 1.2rem;
			}
			input[type='number'] {
				font-size: 1.2rem;
			}
			.menu > * {
				display: flex;
				align-items: center;
				margin-bottom: 0.5rem;
			}
			.menu span,
			.menu input {
				flex: 0 1 50%;
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
				width: 100%;
				margin-top: 1rem;
			}
		`;
	}

	render() {
		return html`
			<div class="menu">
				<div>
					<span>
						Board Width
					</span>
					<input
						type="number"
						@change=${e =>
							(this.newGameBoardWidth = e.target.value)}
						value=${this.newGameBoardWidth}
					/>
				</div>
				<div>
					<span>
						Board Height
					</span>
					<input
						type="number"
						value=${this.newGameBoardHeight}
						@change=${e =>
							(this.newGameBoardHeight = e.target.value)}
					/>
				</div>
				<div>
					<span>
						Bombs
					</span>
					<input
						type="number"
						value=${this.newGameBombs}
						@change=${e => (this.newGameBombs = e.target.value)}
					/>
				</div>
				<div>
					<span>
						Bombs Time
					</span>
					<input
						type="number"
						value=${this.newGameBombTimer}
						@change=${e => (this.newGameBombTimer = e.target.value)}
					/>
				</div>
				<div>
					<span>
						Hitpoints
					</span>
					<input
						type="number"
						value=${this.newGameHitpoints}
						@change=${e => (this.newGameHitpoints = e.target.value)}
					/>
				</div>
				<div>
					<span>
						Enemy Freq
					</span>
					<input
						type="number"
						value=${this.newGameEnemiesDelay}
						@change=${e =>
							(this.newGameEnemiesDelay = e.target.value)}
					/>
				</div>
				<div>
					<button
						@click=${() => {
							const ev = new CustomEvent('new-game', {
								detail: {
									type: actions.NEW_GAME,
									boardWidth: parseInt(
										this.newGameBoardWidth,
										10
									),
									boardHeight: parseInt(
										this.newGameBoardHeight,
										10
									),
									lives: parseInt(this.newGameHitpoints, 10),
									bombs: parseInt(this.newGameBombs, 10),
									bombTimer: parseInt(
										this.newGameBombTimer,
										10
									),
									enemiesDelay: parseInt(
										this.newGameEnemiesDelay,
										10
									)
								}
							});
							this.dispatchEvent(ev);
						}}
					>
						New
					</button>
				</div>
			</div>
		`;
	}
}

customElements.define('gridrounds-menu', Menu);
