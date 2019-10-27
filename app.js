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
			ul {
				list-style: none outside none;
				padding: 0;
				display: grid;
				grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
				grid-gap: 5px;
				width: 400px;
			}
			li {
				background: rgba(255, 255, 255, 0.5);
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
				padding: 4px 10px;
			}
			button {
				font-family: 'Microsoft Sans Serif';
				font-size: 13px;
				outline: 1px solid #000000;
				background: #c0c0c0;
				border-width: 1px;
				border-style: solid;
				border-color: #ffffff #808080 #808080 #ffffff;
			}
			hr {
				border-top-color: #808080;
				border-bottom-color: #ffffff;
			}
		`;
	}

	render() {
		console.log(this.state);
		return html`
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
				@click=${() => {
					this.onAdvanceRound({ type: actions.WAIT });
				}}
			>
				Advance
			</button>
		`;
	}
}

customElements.define('gridrounds-app', App);
