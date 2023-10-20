


function setup() {
  const canvas = document.getElementById('canvas')
	const context = canvas.getContext('2d', {
		alpha: true,
		colorSpace: 'display-p3'
	})

	context.imageSmoothingEnabled = true


  //



  return {
    canvas, context
  }
}

function render(config) {
  const { width, height } = config.canvas
  config.context.fillStyle = 'black'
  config.context.fillRect(0, 0, width, height)
}

async function onContentLoaded() {
  const config = setup()

  const proxyRender = () => {
    render(config)
    requestAnimationFrame(proxyRender)
  }
  requestAnimationFrame(proxyRender)
}

const syncOnContentLoaded = () => {
	onContentLoaded()
		.catch(console.warn)
}

(document.readyState === 'loading') ?
	document.addEventListener('DOMContentLoaded', syncOnContentLoaded) :
	syncOnContentLoaded()
