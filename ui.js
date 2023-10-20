export class UI {
	static async handleMessage(config, event) {
		const sourceImg = document.getElementById('source')

		const input = document.getElementById('sourcePicker')

		input.disabled = true

		const [ file ] = input.files

		const ib = await createImageBitmap(file)

		// console.log(ib.width, ib.height)

		const offscreen = new OffscreenCanvas(ib.width, ib.height)
		const offscreenContext = offscreen.getContext('2d', {
			alpha: true,
			colorSpace: 'display-p3'
		})
		offscreenContext.drawImage(sourceImg, 0, 0)

		const imageData = offscreenContext.getImageData(0, 0, ib.width, ib.height)

		// console.log('message', input.files, imageData)

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
			input.disabled = false
		})
	}
}
