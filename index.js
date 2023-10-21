
import { WaveFunctionCollapse } from "./wfc.js"
import { UI } from './ui.js'

function setup() {
	const source = document.getElementById('source')
	const canvas = document.getElementById('canvas')
	const context = canvas.getContext('2d', {
		alpha: true,
		colorSpace: 'display-p3'
	})

	context.imageSmoothingEnabled = false

	return {
		canvas, context,
		source,
		grid: {
			height: 2,
			width: 3,
			items: [
				{}, {}, {},
				{}, {}, {}
			]
		},
		tiles: [
			{ name: 'bar', weight: .25, color: 'red' },
			{ name: 'foo', weight: .5, color: 'green' },
			{ name: 'bar', weight: 1, color: 'blue' },
			{ name: 'qix', weight: 1, color: 'yellow' }
		]
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

			const idx = y * config.grid.width + x
			const item = config.grid.items[idx]

			//config.context.drawImage(config.source, canvasX, canvasY, cellWidth, cellHeight)

			console.log(x, y, idx, item)
			const resolved = item.resolved !== undefined
			if(resolved) {
				const tile = config.tiles[item.resolved]
				config.context.fillStyle = tile.color
			} else {
				config.context.fillStyle = 'transparent'
			}

			config.context.fillRect(canvasX, canvasY, cellWidth, cellHeight)

			config.context.fillStyle = 'black'
			config.context.font = '50px san-serif'
			config.context.fillText('0,1,2,3,4,5', canvasX + 5, canvasY + cellHeight / 2)

		}
	}
}

function update(config) {
	config.grid = WaveFunctionCollapse.collapse(config.grid, config.tiles)
	render(config)
}

async function onContentLoaded() {
	//
	const config = setup()

	//
	onmessage = event => {
		UI.handleMessage(config, event)
			.then(() => render(config))
			.catch(e => console.warn('error in UI handler', e))
	}

	//
	// const proxyRender = () => {
	// 	render(config)
	// 	requestAnimationFrame(proxyRender)
	// }
	// requestAnimationFrame(proxyRender)

	//
	// setInterval(() => {
	// 	update(config)
	// }, 1000 * 5)
}

const syncOnContentLoaded = () => {
	onContentLoaded()
		.catch(console.warn)
}

(document.readyState === 'loading') ?
	document.addEventListener('DOMContentLoaded', syncOnContentLoaded) :
	syncOnContentLoaded()
