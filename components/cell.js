import { LitElement, html, css } from '../vendor/LitElement.js';
import entities from './entities.js';

class Cell extends LitElement {
	constructor() {
		super();
		this.visible = true;
	}

	static get properties() {
		return {
			entity: { type: Object },
			timer: { type: Number },
			position: { type: Number },
			disabled: { type: Boolean },
			animatedClass: { type: String }
		};
	}

	flicker() {
		this.animatedClass = 'not-animated';
		console.log('GOT FLICKED');
		setTimeout(() => {
			this.animatedClass = 'animated';
		}, 0);
	}

	static get styles() {
		return css`
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
			button {
				font-size: 13px;
				background: #2c3e50;
				border: none;
				text-transform: uppercase;
				font-weight: bold;
				color: white;
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
		`;
	}

	render() {
		const dateNow = Date.now();
		return html`
			<style>
				@keyframes explode-${dateNow} {
					0% {
						transform: scale(0.2);
					}
					100% {
						transform: scale(1.2);
					}
				}
				@keyframes moveDown-${dateNow} {
					0% {
						transform: translateY(-50px);
					}
					100% {
						transform: translateY(0);
					}
				}
				li.not-animated button div {
					opacity: 0;
				}
				li.animated button .explosion {
					animation-name: explode-${dateNow};
					animation-duration: 0.3s;
					animation-iteration-count: infinite;
					animation-timing-function: ease-out;
					animation-delay: ${Math.random() / 4}s;
				}
				li.animated button .enemy {
					animation-name: moveDown-${dateNow};
					animation-duration: 0.3s;
					animation-fill-mode: both;
					animation-timing-function: ease-in-out;
				}
			</style>

			<li class=${this.animatedClass} }>
				<div class="square">
					<button
						?disabled=${this.disabled}
						@click=${e => {
							const cl = new CustomEvent('cell-clicked', {
								detail: this.position
							});

							this.dispatchEvent(cl);
						}}
					>
						<div
							class=${this.entity === entities.EXPLOSION
								? 'explosion'
								: this.entity === entities.ENEMY
								? 'enemy'
								: ''}
						>
							${this.entity}
						</div>
					</button>
					<small>${this.timer}</small>
				</div>
			</li>
		`;
	}
}

customElements.define('gridrounds-cell', Cell);
