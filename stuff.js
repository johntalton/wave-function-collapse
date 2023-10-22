function* range(x) {
	for (let i = 0; i < x; i++) {
		yield i
	}
}

export function* tilesFrom(image, size = 3) {
	for (x of range(3)) {
		yield x
	}
}


function* bySlice(ary, step = 1) {
	console.log(ary)
	for (let idx = 0; idx < ary.byteLength; idx += step) {
		const foo = ary.slice(idx, idx + step)
		// console.log('yet', idx, step, ary, foo)
		yield foo
	}
}

// this is what GPT things
function findTopNColors(imageData, N) {
	const colorFrequency = {}

	const data = imageData.data
	const BYTE_PRE_PIXEL = 4
	for (const slice of bySlice(data, BYTE_PRE_PIXEL)) {
		const [ r, g, b, a ] = slice
		if(a === 0) { continue }

		const key = `${r},${g},${b}`

		if(colorFrequency[key] === undefined) { colorFrequency[key] = 0 }
		colorFrequency[key] += 1
	}

	const colorArray = Object.keys(colorFrequency).map(k => ({
		color: k,
		count: colorFrequency[k]
	}))

	colorArray.sort((a, b) => b.count - a.count)

	//
	let maxPrevalence = 0
	for(const key in colorFrequency) {
		if(colorFrequency[key] > maxPrevalence) {
			maxPrevalence = colorFrequency[key]
		}
	}

	const mostPrevalent = []
	for(const key in colorFrequency) {
		if(colorFrequency[key] === maxPrevalence) {
			mostPrevalent.push(key)
		}
	}

	return { freq: colorArray.slice(0, N), prev: mostPrevalent }
}


export function sampleImageToColorBuckets(imageData, bucketCount) {
	const buckets = new Array(bucketCount)

	const foo = findTopNColors(imageData, 10)
	console.log(foo)

	// console.log(bucketCount)

	// const colorSpace = imageData.colorSpace
	// const data = imageData.data

	// const BYTE_PRE_PIXEL = 4

	// const colors = {}

	// for (const slice of bySlice(data, BYTE_PRE_PIXEL)) {
	// 	const [ r, g, b, a ] = slice

	// 	const x = x => Math.floor(Math.round(x / 255 * 10) / 10 * 255)
	// 	// console.log('r becomes r', r, g, b, x(r))

	// 	const hash = x(r) < 24 | x(g) << 16 | x(b) << 8 | x(a)
	// 	colors[hash] = `rgb(${x(r)} ${x(g)} ${x(b)} / ${a/255})`
	// }

	// console.log(colors)

	return buckets
}