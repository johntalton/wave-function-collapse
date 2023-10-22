
import { WaveFunctionCollapse, consoleGrid } from "./wfc.js"
import { UI } from './ui.js'

const WIKIPEDIA_ITEMS =  [
	{ resolved: 5 }, { resolved: 3 }, { },			{ }, { resolved: 7 }, { },			{ }, { }, { },
	{ resolved: 6 }, { }, { },			{ resolved: 1 }, { resolved: 9 }, { resolved: 5 },			{ }, { }, { },
	{ }, { resolved: 9 }, { resolved: 8 },			{ }, { }, { },			{ }, { resolved: 6 }, { },

	{ resolved: 8 }, { }, { },			{ }, { resolved: 6 }, { },			{ }, { }, { resolved: 3 },
	{ resolved: 4 }, { }, { },			{ resolved: 8 }, { }, { resolved: 3 },			{ }, { }, { resolved: 1 },
	{ resolved: 7 }, { }, { },			{ }, { resolved: 2 }, { },			{ }, { }, { resolved: 6 },

	{ }, { resolved: 6 }, { },			{ }, { }, { },			{ resolved: 2 }, { resolved: 8 }, { },
	{ }, { }, { },			{ resolved: 4 }, { resolved: 1 }, { resolved: 9 },			{ }, { }, { resolved: 5 },
	{ }, { }, { },			{ }, { resolved: 8 }, { },			{ }, { resolved: 7 }, { resolved: 9 },
]
	.map(item => ({
		...item,
		resolved: item.resolved !== undefined ? item.resolved - 1 : undefined
	}))


const NOT_FUN = [
		{ }, { resolved: 2 }, { },			{ }, { }, { },			{ }, { }, { },
		{ }, { }, { },			{ resolved: 6 }, { }, { },			{ }, { }, { resolved: 3 },
		{ }, { resolved: 7 }, { resolved: 4 },			{ }, { resolved: 8 }, { },			{ }, { }, { },

		{ }, { }, { },			{ }, { }, { resolved: 3 },			{ }, { }, { resolved: 2 },
		{ }, { resolved: 8 }, { },			{ }, { resolved: 4 }, { },			{ }, { resolved: 1 }, { },
		{ resolved: 6 }, { }, { },			{ resolved: 5 }, { }, { },			{ }, { }, { },

		{ }, { }, { },			{ }, { resolved: 1 }, { },			{ resolved: 7 }, { resolved: 8 }, { },
		{ resolved: 5 }, { }, { },			{ }, { }, { resolved: 9 },			{ }, { }, { },
		{ }, { }, { },			{ }, { }, { },			{ }, { resolved: 4 }, { },
	]
	.map(item => ({
		...item,
		resolved: item.resolved !== undefined ? item.resolved - 1 : undefined
	}))


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
			height: 9,
			width: 9,
			items: WIKIPEDIA_ITEMS,
			// items: NOT_FUN,
		// 	items: [
		// 		{ }, { }, { },  { resolved: 0 }, { }, { },  { }, { }, { },
		// 		{ }, { }, { },  { }, { }, { },  { }, { }, { },
		// 		{ }, { }, { },  { }, { }, { },  { }, { }, { },

		// 		{ }, { }, { },  { }, { }, { },  { }, { }, { },
		// 		{ }, { }, { },  { }, { }, { },  { }, { }, { },
		// 		{ }, { }, { },  { }, { }, { },  { }, { }, { },

		// 		{ }, { }, { },  { }, { }, { },  { }, { }, { },
		// 		{ }, { }, { },  { }, { }, { },  { }, { }, { },
		// 		{ }, { }, { },  { }, { }, { },  { }, { }, { },
		// 	]
		},
		tiles: [
			{ name: '1', weight: 1, color: 'red' },
			{ name: '2', weight: .1, color: 'green' },
			{ name: '3', weight: .1, color: 'blue' },
			{ name: '4', weight: 1, color: 'yellow' },
			{ name: '5', weight: 1, color: 'orange' },
			{ name: '6', weight: .1, color: 'cyan' },
			{ name: '7', weight: .1, color: 'pink' },
			{ name: '8', weight: 1, color: 'black' },
			{ name: '9', weight: .01, color: 'white' },
		]

		// grid: {
		// 	height: 3,
		// 	width: 3,
		// 	items: [
		// 		{}, {}, {},
		// 		{}, {}, {},
		// 		{}, {}, {}
		// 	]
		// },
		// tiles: [
		// 	{ name: 'X', weight: 1, color: 'green' },
		// 	{ name: 'O', weight: 1, color: 'blue' },
		// ]
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

			// console.log(x, y, idx, item)
			const resolved = item.resolved !== undefined
			if(resolved) {
				const tile = config.tiles[item.resolved]
				config.context.fillStyle = tile.color
			} else {
				config.context.fillStyle = 'transparent'
			}

			config.context.fillRect(canvasX, canvasY, cellWidth, cellHeight)

			if(resolved) {
				const tile = config.tiles[item.resolved]

				config.context.fillStyle = 'white'
				config.context.font = '50px san-serif'
				config.context.fillText(tile.name, canvasX + 5, canvasY + cellHeight / 2)
			}

		}
	}

	// if(config.grid.resolved !== true)
	// 	update(config)
}

function update(config) {
	config.grid = WaveFunctionCollapse.collapse(config.grid, config.tiles)
	// console.log(consoleGrid(config.grid))
	// render(config)

	if(config.grid.resolved === true) { clearInterval(config.updateTimer) }
}

async function onContentLoaded() {

	//
	window.addEventListener('keydown', event => {
		const keys = [ 'ArrowRight', 'ArrowLeft' ]
		if(!keys.includes(event.key)) { return }

		const frequency = event.key === 'ArrowRight' ? 260 :
			event.key === 'ArrowLeft' ? 300 :
			0

		//
		const audioContext = new window.AudioContext()

		const oscillator = new OscillatorNode(audioContext, {
			type: 'sine',
			frequency
		})
		// oscillator.type = 'square'
		// oscillator.frequency.setValueAtTime(440, audioContext.currentTime)

		const gain = new GainNode(audioContext)
		gain.gain.value = 0

		oscillator.connect(gain).connect(audioContext.destination)

		gain.gain.setValueAtTime(.0125, audioContext.currentTime + .125)
		gain.gain.setValueAtTime(.00125, audioContext.currentTime + .25)

		oscillator.start(audioContext.currentTime)
		oscillator.stop(audioContext.currentTime + .25)
	})

	//
	const config = setup()

	config.grid = WaveFunctionCollapse.normalizeGrid(config.grid, config.tiles)

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
	config.updateTimer = setInterval(() => {
		update(config)
		render(config)
	}, 1000 * 1)

	update(config)
}

const syncOnContentLoaded = () => {
	onContentLoaded()
		.catch(console.warn)
}

(document.readyState === 'loading') ?
	document.addEventListener('DOMContentLoaded', syncOnContentLoaded) :
	syncOnContentLoaded()
