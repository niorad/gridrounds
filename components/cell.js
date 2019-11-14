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
			killedEnemy: { type: Boolean },
			bombExploded: { type: Boolean },
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
			@keyframes explode {
				0% {
					transform: scale(0.2);
				}
				100% {
					transform: scale(1.2);
				}
			}
			@keyframes go-off {
				0% {
					transform: scale(1) rotate(0);
					opacity: 1;
				}
				100% {
					transform: scale(2) rotate(10deg);
					opacity: 0;
				}
			}
			@keyframes move-and-die {
				0% {
					transform: translateY(-80px) scale(1);
				}
				25% {
					transform: translateY(-40px) scale(1.5);
				}
				50% {
					transform: translateY(0) scale(1);
					opacity: 1;
				}
				100% {
					transform: translateY(0) scale(2);
					opacity: 0;
				}
			}
			@keyframes moveDown {
				0% {
					transform: translateY(-80px) scale(1);
				}
				50% {
					transform: translateY(-40px) scale(1.5);
				}
				100% {
					transform: translateY(0) scale(1);
				}
			}
			li.not-animated button div {
				opacity: 0;
			}
			li.animated button .explosion {
				animation-name: explode;
				animation-duration: 0.3s;
				animation-iteration-count: infinite;
				animation-timing-function: ease-out;
				animation-delay: 0.6s;
			}
			li.animated button .enemy {
				animation-name: moveDown;
				animation-duration: 0.5s;
				animation-fill-mode: both;
				animation-timing-function: ease-in-out;
			}
			li.animated button .enemy-killed {
				animation-name: move-and-die;
				animation-duration: 1s;
				animation-fill-mode: both;
				animation-timing-function: ease-in-out;
			}
			li.animated button .bomb-exploded {
				animation-name: go-off;
				animation-duration: 0.5s;
				animation-fill-mode: both;
				animation-timing-function: ease-out;
				animation-delay: 0.6s;
			}
			.enemy-killed,
			.enemy,
			.bomb-exploded,
			.explosion {
				position: absolute;
				top: 0;
				left: 0;
				right: 0;
				bottom: 0;
				line-height: 1.6;
			}
			.explosion {
				transform: scale(0);
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
		return html`
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
						${this.killedEnemy
							? html`
									<div class="enemy-killed">${entities.ENEMY}</div>
							  `
							: null}
						${this.bombExploded
							? html`
									<div class="bomb-exploded">${entities.BOMB}</div>
							  `
							: null}
					</button>
					<small>${this.timer}</small>
				</div>
			</li>
		`;
	}
}

customElements.define('gridrounds-cell', Cell);
