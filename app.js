import { LitElement, html, css } from '../vendor/LitElement.js';
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

	onCellDrop(e, position) {
		e.preventDefault();
		console.log('Droppin: ', e.dataTransfer.getData('text/plain'), e);
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
				padding: 3px;
				text-align: center;
				font-size: 3rem;
				position: relative;
			}
			li small {
				font-size: 12px;
				position: absolute;
				right: 0;
				bottom: 0;
			}
		`;
	}

	render() {
		console.log(this.state);
		return html`
			<ul>
				${this.state.board.map((cell, index) => {
					return html`
						<li
							@dragover=${e => {
								e.preventDefault();
							}}
							@drop=${e => {
								this.onCellDrop(e, index);
							}}
						>
							${cell.occupant}
							<small>${cell.timer}</small>
						</li>
					`;
				})}
			</ul>
			<hr />
			<div
				draggable="true"
				data-item-type=${entities.BOMB}
				@dragstart=${this.onItemDrag}
			>
				💣
			</div>
			<hr />
			<button
				@click=${() => {
					this.onAdvanceRound({ type: actions.WAIT });
				}}
			>
				Advance
			</button>
			Round: ${this.state.round}
		`;
	}
}

customElements.define('gridrounds-app', App);
