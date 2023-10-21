// import { sampleImageToColorBuckets } from './stuff.js'

export class UI {
	static async handleMessage(config, event) {
		const sourceImg = document.getElementById('source')

		const input = document.getElementById('sourcePicker')

		input.disabled = true

		const [ file ] = input.files

		const ib = await createImageBitmap(file)

		const src = URL.createObjectURL(file)

		return new Promise((resolve, reject) => {
			sourceImg.src = src
			sourceImg.addEventListener('load', event => {
				// console.log('revokingObjectURL', src)
				URL.revokeObjectURL(src)
				resolve()
			}, { once: true })
			sourceImg.addEventListener('error', event => {
				reject()
			}, { once: true })
		})
		.then(() => {
			const offscreen = new OffscreenCanvas(ib.width, ib.height)
			const offscreenContext = offscreen.getContext('2d', {
				alpha: true,
				colorSpace: 'display-p3'
			})
			offscreenContext.imageSmoothingEnabled = false

			offscreenContext.drawImage(sourceImg, 0, 0, ib.width, ib.height)

			const imageData = offscreenContext.getImageData(0, 0, ib.width, ib.height)

			console.log('yck', [...imageData.data].filter(value => value != 0))

			// sampleImageToColorBuckets(imageData, 3)

		})
		.then(() => {
			input.disabled = false
		})
	}
}
