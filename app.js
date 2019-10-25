import { LitElement, html, css } from '../vendor/LitElement.js';
import { getFreshState } from './components/state.js';
import entities from './components/entities.js';

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

	static get styles() {
		return css`
			ul {
				list-style: none outside none;
				padding: 0;
				display: grid;
				grid-template-columns: 1fr 1fr 1fr 1fr;
				grid-gap: 5px;
				width: 400px;
			}
			li {
				background: rgba(255, 255, 255, 0.5);
				padding: 10px;
				text-align: center;
			}
		`;
	}

	advanceRound() {
		const newState = { ...this.state };
		newState.board[1] = { occupant: entities.BOMB };
		this.state = newState;
	}

	render() {
		return html`
			<ul>
				${this.state.board.map(cell => {
					return html`
						<li>${cell.occupant}</li>
					`;
				})}
			</ul>
			<button
				@click=${() => {
					this.advanceRound();
				}}
			>
				Advance
			</button>
		`;
	}
}

customElements.define('gridrounds-app', App);
