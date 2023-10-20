
import { WaveFunctionCollapse } from "./wfc.js"
import { UI } from './ui.js'

function setup() {
	const source = document.getElementById('source')
	const canvas = document.getElementById('canvas')
	const context = canvas.getContext('2d', {
		alpha: true,
		colorSpace: 'display-p3'
	})

	context.imageSmoothingEnabled = true

	return {
		canvas, context,
		source,
		grid: {
			height: 2,
			width: 3,
			items: []
		},
		tiles: {
		}
	}
}

function render(config) {
	const { width, height } = config.canvas

	// config.context.fillStyle = 'rgb(255 0 0)'
	// config.context.fillRect(0, 0, width, height)


	const cellWidth = width / config.grid.width
	const cellHeight = height / config.grid.height

	config.context.strokeStyle = 'red'
	for(let y = 0; y < config.grid.height; y++) {
		for(let x = 0; x < config.grid.width; x++) {
			const canvasX = cellWidth * x
			const canvasY = cellHeight * y

			config.context.drawImage(config.source, canvasX, canvasY, cellWidth - 1, cellHeight - 1)

			// config.context.strokeRect(canvasX, canvasY, cellWidth - 1, cellHeight - 1)
		}
	}
}

function update(config) {
	config.grid = WaveFunctionCollapse.collapse(config.grid, config.tiles)
}

async function onContentLoaded() {
	//
	const config = setup()

	//
	onmessage = event => {
		UI.handleMessage(config, event)
			.catch(e => console.warn('error in UI handler', e))
	}

	//
	const proxyRender = () => {
		render(config)
		requestAnimationFrame(proxyRender)
	}
	requestAnimationFrame(proxyRender)

	//
	setInterval(() => {
		update(config)
	}, 1000 * 5)
}

const syncOnContentLoaded = () => {
	onContentLoaded()
		.catch(console.warn)
}

(document.readyState === 'loading') ?
	document.addEventListener('DOMContentLoaded', syncOnContentLoaded) :
	syncOnContentLoaded()
