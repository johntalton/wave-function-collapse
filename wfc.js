// function shuffle(array) {
// 	for (let i = array.length - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1));
//     [array[i], array[j]] = [array[j], array[i]];
//   }
//   return array
// }


function gridItemEntropy(item, tiles) {
	const { superPositions } = {
		superPositions: [ ...new Array(tiles.length)].map((_, i) => i),
		...item
	}

	return superPositions.length / tiles.length
}

function selectSuperPosition(item, tiles) {
	const { superPositions } = {
		superPositions: [ ...new Array(tiles.length)].map((_, i) => i),
		...item
	}

	const [ fullResult ] = superPositions
		.map(pos => ({ ...tiles[pos], pos }))
		.sort((a, b) => b.weight - a.weight)  // b - a -> largest weight

	return fullResult.pos
}


export class WaveFunctionCollapse {
	static collapse(grid, tiles) {
		console.log('collapse', grid, tiles)

		//
		// least entropy grid item
		const [ candidate, ...rest ] = grid.items
			.map((item, idx) => ({ item, idx }))
			.filter(({ item }) => item.resolved === undefined)
			.map(({item, idx}) => {
				const e = gridItemEntropy(item, tiles)

				const targetX = idx % grid.width
			const targetY = Math.floor(idx / grid.width)

				return { item, idx, e, targetX, targetY }
			})
			.sort((a, b) => a.e - b.e) // a - b -> smallest e
			// .map(({ item }) => item)

		if(candidate === undefined) {
			console.log('no more valid candidates in grid')
			return grid
		}

		console.log('selected candidate', candidate, rest)

		//
		// resolve grid item
		const resolvedTilePos = selectSuperPosition(candidate.item, tiles)
		const resolvedTile = tiles[resolvedTilePos]

		candidate.item.resolved = resolvedTilePos
		candidate.item.superPositions = []

		console.log('resolved candidate with pos', candidate)

		//
		// propagate constraints to neighbors
		// custom ...
		{
			const targetX = candidate.idx % grid.width
			const targetY = Math.floor(candidate.idx / grid.width)

			const column = grid.items.filter((item, idx) => {
				const x = idx % grid.width
				return x === targetX
			})

			const row = grid.items.filter((item, idx) => {
				const y = Math.floor(idx / grid.width)
				return y === targetY
			})

			const sy =  27 * Math.floor(targetY / 3)
			const sx = 3 * Math.floor(targetX / 3)
			const s = sy + sx
			const cubIdxs = [
				s, s + 1, s + 2,
				s + 9, s + 9 + 1, s + 9 + 2,
				s + 18, s + 18 + 1, s + 18 + 2,
			]

			console.log('cube', targetX, targetY, cubIdxs)
			const cube = grid.items.filter((item, idx) => {
				return cubIdxs.includes(idx)
			})

			// console.log({ column, row, cube })
			const all = [ ...column, ...row, ...cube ]
			all.forEach(item => {
				item.superPositions = item.superPositions || [ ...new Array(tiles.length)].map((_, i) => i)
				item.superPositions = item.superPositions.filter(pos => pos != resolvedTilePos)
			})


		}



		const items = grid.items

		// return new grid
		return {
			...grid,
			items
		}
	}
}


const config = {
	grid: {
		height: 9,
		width: 9,
		items: [
			{ }, { }, { },  { }, { }, { },  { }, { }, { },
			{ }, { }, { },  { }, { }, { },  { }, { }, { },
			{ }, { }, { },  { }, { }, { },  { }, { }, { },

			{ }, { }, { },  { }, { }, { },  { }, { }, { },
			{ }, { }, { },  { }, { }, { },  { }, { }, { },
			{ }, { }, { },  { }, { }, { },  { }, { }, { },

			{ }, { }, { },  { }, { }, { },  { }, { }, { },
			{ }, { }, { },  { }, { }, { },  { }, { }, { },
			{ }, { }, { },  { }, { }, { },  { }, { }, { },
		]
	},
	tiles: [
		{ name: '1', weight: .5, color: 'red' },
		{ name: '2', weight: .5, color: 'red' },
		{ name: '3', weight: 1, color: 'red' },
		{ name: '4', weight: 1, color: 'red' },
		{ name: '5', weight: 1, color: 'red' },
		{ name: '6', weight: 1, color: 'red' },
		{ name: '7', weight: 1, color: 'red' },
		{ name: '8', weight: 1, color: 'red' },
		{ name: '9', weight: 1, color: 'red' },
	]
}

config.grid = WaveFunctionCollapse.collapse(config.grid, config.tiles)
config.grid = WaveFunctionCollapse.collapse(config.grid, config.tiles)
config.grid = WaveFunctionCollapse.collapse(config.grid, config.tiles)
config.grid = WaveFunctionCollapse.collapse(config.grid, config.tiles)
config.grid = WaveFunctionCollapse.collapse(config.grid, config.tiles)
config.grid = WaveFunctionCollapse.collapse(config.grid, config.tiles)
config.grid = WaveFunctionCollapse.collapse(config.grid, config.tiles)
config.grid = WaveFunctionCollapse.collapse(config.grid, config.tiles)
config.grid = WaveFunctionCollapse.collapse(config.grid, config.tiles)

config.grid = WaveFunctionCollapse.collapse(config.grid, config.tiles)
config.grid = WaveFunctionCollapse.collapse(config.grid, config.tiles)
config.grid = WaveFunctionCollapse.collapse(config.grid, config.tiles)
config.grid = WaveFunctionCollapse.collapse(config.grid, config.tiles)
config.grid = WaveFunctionCollapse.collapse(config.grid, config.tiles)
config.grid = WaveFunctionCollapse.collapse(config.grid, config.tiles)
config.grid = WaveFunctionCollapse.collapse(config.grid, config.tiles)
config.grid = WaveFunctionCollapse.collapse(config.grid, config.tiles)
config.grid = WaveFunctionCollapse.collapse(config.grid, config.tiles)

config.grid = WaveFunctionCollapse.collapse(config.grid, config.tiles)
config.grid = WaveFunctionCollapse.collapse(config.grid, config.tiles)
config.grid = WaveFunctionCollapse.collapse(config.grid, config.tiles)
config.grid = WaveFunctionCollapse.collapse(config.grid, config.tiles)
config.grid = WaveFunctionCollapse.collapse(config.grid, config.tiles)
config.grid = WaveFunctionCollapse.collapse(config.grid, config.tiles)
config.grid = WaveFunctionCollapse.collapse(config.grid, config.tiles)
config.grid = WaveFunctionCollapse.collapse(config.grid, config.tiles)
config.grid = WaveFunctionCollapse.collapse(config.grid, config.tiles)



const BRK_STR = '\n------+-------+------\n'
console.log(config.grid.items.reduce((acc, item, idx) => {

	// const value = item.resolved || '_'
	const value = (item.resolved !== undefined) ? item.resolved : ('[' + (item.superPositions || '_') + ']')

	const modBar = (idx + 1) % 3 === 0
	const modRet = (idx + 1) % 9 === 0
	const modBrk = (idx + 1) % 27 === 0
	const modEnd = (idx + 1) % 81 === 0

	const suffix = modEnd ? '\n.' :
		modBrk ? BRK_STR :
		modRet ? '\n' :
		modBar ? ' | ':
		' '

	return acc + value + suffix
}, '\n'))

