// function shuffle(array) {
// 	for (let i = array.length - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1));
//     [array[i], array[j]] = [array[j], array[i]];
//   }
//   return array
// }


function gridItemEntropy(item, tiles, strong = true) {
	const { superPositions } = {
		superPositions: [ ...new Array(tiles.length)].map((_, i) => i),
		...item
	}

	if(strong) {
		if(superPositions.length === 1) { return 0 }
		return 1
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

function propagateSudoku(grid, tiles, candidate, resolvedTilePos) {

	const targetX = candidate.idx % grid.width
	const targetY = Math.floor(candidate.idx / grid.width)

	const column = grid.items.filter((_, idx) => {
		const x = idx % grid.width
		return x === targetX
	})

	// console.log(column)

	const row = grid.items.filter((_, idx) => {
		const y = Math.floor(idx / grid.width)
		return y === targetY
	})

	const sy = 27 * Math.floor(targetY / 3)
	const sx = 3 * Math.floor(targetX / 3)
	const s = sy + sx
	const cubIdxs = [
		s, s + 1, s + 2,
		s + 9, s + 9 + 1, s + 9 + 2,
		s + 18, s + 18 + 1, s + 18 + 2,
	]

	// console.log('cube', targetX, targetY, cubIdxs)
	const cube = grid.items.filter((_, idx) => {
		return cubIdxs.includes(idx)
	})

	// console.log({ column, row, cube })
	const all = [ ...column, ...row, ...cube ]
	all.forEach(item => {
		item.superPositions = item.superPositions || [ ...new Array(tiles.length)].map((_, i) => i)
		item.superPositions = item.superPositions.filter(pos => pos != resolvedTilePos)
	})

	return grid
}




export class WaveFunctionCollapse {
	static normalizeGrid(grid, tiles) {

		const resolvedItems = grid.items
			.map((item, idx) => ({ ...item, idx }))
			.filter(item => (item.resolved !== undefined))

		for(const ri of resolvedItems) {
			// console.log(ri)
			propagateSudoku(grid, tiles, ri, ri.resolved)
		}

		return grid

		// return {
		// 	...grid,
		// 	items: grid.items.map(item => ({ ...item, resolved: undefined }))
		// }
	}

	static collapse(grid, tiles) {
		// console.log('collapse', grid, tiles)

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
			grid.resolved = true
			return grid
		}

		// console.log('selected candidate', candidate, rest)
		if(candidate.item.superPositions !== undefined && candidate.item.superPositions.length <= 0) {
			console.log('grid candidate exhausted superPositions', candidate)
			grid.resolved = true
			return grid
		}

		//
		// resolve grid item
		const resolvedTilePos = selectSuperPosition(candidate.item, tiles)
		// const resolvedTile = tiles[resolvedTilePos]

		candidate.item.resolved = resolvedTilePos
		candidate.item.superPositions = []

		// console.log('resolved candidate with pos', candidate)

		//
		// propagate constraints to neighbors
		// custom ...
		propagateSudoku(grid, tiles, candidate, resolvedTilePos)

		const items = grid.items

		// return new grid
		return {
			...grid,
			items
		}
	}
}


// const config = {
// 	grid: {
// 		height: 9,
// 		width: 9,
// 		items: [
// 			{ }, { }, { },  { }, { }, { },  { }, { }, { },
// 			{ }, { }, { },  { }, { }, { },  { }, { }, { },
// 			{ }, { }, { },  { }, { }, { },  { }, { }, { },

// 			{ }, { }, { },  { }, { }, { },  { }, { }, { },
// 			{ }, { }, { },  { }, { }, { },  { }, { }, { },
// 			{ }, { }, { },  { }, { }, { },  { }, { }, { },

// 			{ }, { }, { },  { }, { }, { },  { }, { }, { },
// 			{ }, { }, { },  { }, { }, { },  { }, { }, { },
// 			{ }, { }, { },  { }, { }, { },  { }, { }, { },
// 		]
// 	},
// 	tiles: [
// 		{ name: '1', weight: .5, color: 'red' },
// 		{ name: '2', weight: .5, color: 'red' },
// 		{ name: '3', weight: 1, color: 'red' },
// 		{ name: '4', weight: 1, color: 'red' },
// 		{ name: '5', weight: 1, color: 'red' },
// 		{ name: '6', weight: 1, color: 'red' },
// 		{ name: '7', weight: 1, color: 'red' },
// 		{ name: '8', weight: 1, color: 'red' },
// 		{ name: '9', weight: 1, color: 'red' },
// 	]
// }

// config.grid = WaveFunctionCollapse.collapse(config.grid, config.tiles)
// config.grid = WaveFunctionCollapse.collapse(config.grid, config.tiles)
// config.grid = WaveFunctionCollapse.collapse(config.grid, config.tiles)
// config.grid = WaveFunctionCollapse.collapse(config.grid, config.tiles)
// config.grid = WaveFunctionCollapse.collapse(config.grid, config.tiles)
// config.grid = WaveFunctionCollapse.collapse(config.grid, config.tiles)
// config.grid = WaveFunctionCollapse.collapse(config.grid, config.tiles)
// config.grid = WaveFunctionCollapse.collapse(config.grid, config.tiles)
// config.grid = WaveFunctionCollapse.collapse(config.grid, config.tiles)

// config.grid = WaveFunctionCollapse.collapse(config.grid, config.tiles)
// config.grid = WaveFunctionCollapse.collapse(config.grid, config.tiles)
// config.grid = WaveFunctionCollapse.collapse(config.grid, config.tiles)
// config.grid = WaveFunctionCollapse.collapse(config.grid, config.tiles)
// config.grid = WaveFunctionCollapse.collapse(config.grid, config.tiles)
// config.grid = WaveFunctionCollapse.collapse(config.grid, config.tiles)
// config.grid = WaveFunctionCollapse.collapse(config.grid, config.tiles)
// config.grid = WaveFunctionCollapse.collapse(config.grid, config.tiles)
// config.grid = WaveFunctionCollapse.collapse(config.grid, config.tiles)

// config.grid = WaveFunctionCollapse.collapse(config.grid, config.tiles)
// config.grid = WaveFunctionCollapse.collapse(config.grid, config.tiles)
// config.grid = WaveFunctionCollapse.collapse(config.grid, config.tiles)
// config.grid = WaveFunctionCollapse.collapse(config.grid, config.tiles)
// config.grid = WaveFunctionCollapse.collapse(config.grid, config.tiles)
// config.grid = WaveFunctionCollapse.collapse(config.grid, config.tiles)
// config.grid = WaveFunctionCollapse.collapse(config.grid, config.tiles)
// config.grid = WaveFunctionCollapse.collapse(config.grid, config.tiles)
// config.grid = WaveFunctionCollapse.collapse(config.grid, config.tiles)


export function consoleGrid(grid) {
	const BRK_STR = '\n------+-------+------\n'
	return (grid.items.reduce((acc, item, idx) => {

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
}
