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
			[draggable] {
				font-size: 3rem;
				border: 1px dotted black;
				display: inline-block;
			}
			main {
				background: rgb(206, 208, 207);
				max-width: 500px;
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
				margin: 0 2px 0 0;
				background-image: linear-gradient(
					to right,
					rgb(0, 0, 128),
					rgb(16, 52, 166)
				);
				text-align: center;
				padding: 5px;
			}
			.content {
				padding: 1rem;
			}
			ul {
				list-style: none outside none;
				padding: 0;
				display: grid;
				grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
				width: 100%;
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
			li button {
				font-size: 3rem;
				width: 100%;
				margin: 0;
			}
			button {
				font-family: 'Microsoft Sans Serif', sans-serif;
				font-size: 13px;
				outline: 1px solid #000000;
				background: rgb(206, 208, 207);
				border-width: 1px;
				border-style: solid;
				border-color: #ffffff #808080 #808080 #ffffff;
			}
			.fat-button {
				width: 100%;
				padding: 10px;
			}
			hr {
				border-top-color: #808080;
				border-bottom-color: #ffffff;
				margin-bottom: 1rem;
			}
		`;
	}

	render() {
		console.log(this.state);
		return html`
			<main>
				<h1>GRIDROUNDS</h1>
				<div class="content">
					Round: ${this.state.round} Lives: ${this.state.lives}
					<ul>
						${this.state.board.map((cell, index) => {
							return html`
								<li>
									<button
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
					<hr />
					<button
						class="fat-button"
						@click=${() => {
							this.onAdvanceRound({ type: actions.WAIT });
						}}
					>
						Advance
					</button>
				</div>
			</main>
		`;
	}
}

customElements.define('gridrounds-app', App);
