export class UI {
	static handleMessage(config, event) {
		const sourceImg = document.getElementById('source')

		const input = document.getElementById('sourcePicker')
		const [ file ] = input.files
		const src = URL.createObjectURL(file)

		sourceImg.src = src

		const offscreen = new OffscreenCanvas(10, 10)
		const offscreenContext = offscreen.getContext('2d')
		offscreenContext.drawImage(sourceImg, 0, 0)

		const imageData = offscreenContext.getImageData(0, 0, 10, 10)

		console.log('message', input.files, imageData)
	}
}
